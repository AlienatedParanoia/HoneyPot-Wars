import { Shell, panelStyle, BackLink } from '@/components/Shell';
import { SignOutButton } from '@/components/SignOutButton';
import { RequestActions } from '@/components/RequestActions';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C, MONO } from '@/lib/theme';
import type { SessionRequest, Profile } from '@/lib/types';

type RequestRow = SessionRequest & { profiles: Pick<Profile, 'company_name' | 'email'> | null };

const STATUS_COLOR: Record<string, string> = {
  approved: C.ok,
  rejected: C.high,
  pending: C.muted,
};

export default async function AdminRequests() {
  await requireAdmin();
  const supabase = createClient();
  const { data: requests } = await supabase
    .from('session_requests')
    .select('*, profiles(company_name, email)')
    .order('requested_at', { ascending: false })
    .returns<RequestRow[]>();

  return (
    <Shell title="Session requests" subtitle="Review and approve" maxWidth="100%" right={<SignOutButton />}>
      <BackLink />
      <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {requests && requests.length > 0 ? (
          requests.map((r) => (
            <div
              key={r.id}
              style={{
                ...panelStyle,
                // Pending requests are the ones needing action — accent the border.
                borderColor: r.status === 'pending' ? C.accent : C.border,
              }}
            >
              <div style={{ fontSize: '15px' }}>
                <span style={{ color: C.text, fontWeight: 600 }}>{r.profiles?.company_name || '—'}</span>{' '}
                <span style={{ color: C.muted }}>{r.profiles?.email}</span>
              </div>
              <div style={{ fontSize: '14px', color: C.muted, marginTop: '10px' }}>
                Repo: <span style={{ fontFamily: MONO, color: C.accent }}>{r.repo_url}</span>
              </div>
              {r.deployment_url && (
                <div style={{ fontSize: '14px', color: C.muted }}>
                  URL: <span style={{ fontFamily: MONO, color: C.accent }}>{r.deployment_url}</span>
                </div>
              )}
              {r.notes && <div style={{ fontSize: '14px', color: C.muted, marginTop: '6px' }}>Notes: {r.notes}</div>}
              <div style={{ fontSize: '13px', color: C.muted, margin: '12px 0 14px' }}>
                Status: <span style={{ color: STATUS_COLOR[r.status] ?? C.text }}>{r.status}</span>
                {' · '}Consent:{' '}
                <span style={{ color: r.consent_signed ? C.ok : C.high }}>{r.consent_signed ? 'signed' : 'no'}</span>
              </div>
              {r.status === 'pending' && <RequestActions requestId={r.id} />}
            </div>
          ))
        ) : (
          <p style={{ fontSize: '15px', color: C.muted }}>No requests yet.</p>
        )}
      </div>
    </Shell>
  );
}
