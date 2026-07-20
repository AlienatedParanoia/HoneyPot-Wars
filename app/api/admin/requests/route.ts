import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { isInScope } from '@/lib/scope-guard';

const bodySchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
});

type RequestRow = {
  account_id: string;
  deployment_url: string | null;
  consent_signed: boolean;
  status: string;
};

// Approve or reject a session request. Admin-only, server-side, via service role.
// Approval is the authorisation gate for a real scan, so it verifies consent and
// scope here — not just in the UI — before greenlighting anything.
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { requestId, action } = parsed.data;

  const db = createAdminClient();
  const status = action === 'approve' ? 'approved' : 'rejected';

  // Load the request first: we must gate approval on its consent/scope and must
  // never act on a request that has already been reviewed (state-machine guard).
  const { data: req, error: reqErr } = await db
    .from('session_requests')
    .select('account_id, deployment_url, consent_signed, status')
    .eq('id', requestId)
    .maybeSingle<RequestRow>();
  if (reqErr) return NextResponse.json({ error: 'Could not load request' }, { status: 500 });
  if (!req) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Request has already been reviewed' }, { status: 409 });
  }

  if (action === 'approve') {
    // Consent must be signed before any scan is authorised (§B.1/§B.4).
    if (!req.consent_signed) {
      return NextResponse.json({ error: 'Cannot approve: consent is not signed' }, { status: 400 });
    }

    const { data: profile, error: profErr } = await db
      .from('profiles')
      .select('registered_domain, account_status')
      .eq('id', req.account_id)
      .maybeSingle<{ registered_domain: string | null; account_status: string }>();
    if (profErr || !profile) {
      return NextResponse.json({ error: 'Could not load account' }, { status: 500 });
    }
    // A suspended (flagged) account is never auto-reactivated by an approval (§B.5).
    if (profile.account_status === 'suspended') {
      return NextResponse.json(
        { error: 'Account is suspended and must be reviewed manually' },
        { status: 403 },
      );
    }
    // Scope-lock: a live target must be within the account's registered domain
    // (§A.1/§A.6/§E.5). Repo-only requests (no deployment URL) skip this.
    if (req.deployment_url) {
      if (!profile.registered_domain) {
        return NextResponse.json(
          { error: 'Cannot approve: account has no registered domain to scope against' },
          { status: 400 },
        );
      }
      if (!isInScope(req.deployment_url, profile.registered_domain)) {
        return NextResponse.json(
          { error: 'Deployment URL is outside the account\'s registered domain' },
          { status: 400 },
        );
      }
    }
  }

  // State-machine guard: transition only a still-pending request. If a concurrent
  // review already moved it, this matches zero rows and we report a conflict.
  const { data: updated, error: updErr } = await db
    .from('session_requests')
    .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: admin.userId })
    .eq('id', requestId)
    .eq('status', 'pending')
    .select('account_id')
    .maybeSingle<{ account_id: string }>();
  if (updErr) return NextResponse.json({ error: 'Could not update request' }, { status: 500 });
  if (!updated) {
    return NextResponse.json({ error: 'Request has already been reviewed' }, { status: 409 });
  }

  // Approving a request activates the client's account — but never revives a
  // suspended one (guarded above, and re-asserted here against a race).
  if (action === 'approve') {
    const { error: actErr } = await db
      .from('profiles')
      .update({ account_status: 'active' })
      .eq('id', updated.account_id)
      .neq('account_status', 'suspended');
    if (actErr) return NextResponse.json({ error: 'Could not activate account' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status });
}
