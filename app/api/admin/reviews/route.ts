import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/admin';

const bodySchema = z.object({
  accountId: z.string().uuid(),
  sessionRequestId: z.string().uuid().optional().nullable(),
  body: z.string().min(1).max(4000),
  verdict: z.string().max(80).optional().nullable(),
});

// Post a written review on a client's check. Admin-only, server-side, service role.
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { accountId, sessionRequestId, body, verdict } = parsed.data;

  const db = createAdminClient();

  // A review is shown to the client whose account_id it carries, so verify the
  // account exists and — if a session request is linked — that it belongs to
  // THIS account, otherwise a mis-set accountId leaks a review to another tenant.
  const { data: acct } = await db
    .from('profiles')
    .select('id')
    .eq('id', accountId)
    .maybeSingle<{ id: string }>();
  if (!acct) return NextResponse.json({ error: 'Unknown account' }, { status: 400 });
  if (sessionRequestId) {
    const { data: sr } = await db
      .from('session_requests')
      .select('account_id')
      .eq('id', sessionRequestId)
      .maybeSingle<{ account_id: string }>();
    if (!sr || sr.account_id !== accountId) {
      return NextResponse.json({ error: 'Session request does not belong to this account' }, { status: 400 });
    }
  }

  const { error } = await db.from('reviews').insert({
    account_id: accountId,
    session_request_id: sessionRequestId ?? null,
    body,
    verdict: verdict || null,
    created_by: admin.userId,
  });
  if (error) return NextResponse.json({ error: 'Could not save review' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
