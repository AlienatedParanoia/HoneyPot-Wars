import { Shell, panelStyle, BackLink } from '@/components/Shell';
import { SignOutButton } from '@/components/SignOutButton';
import { AdminReviewForm } from '@/components/AdminReviewForm';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C, MONO } from '@/lib/theme';
import type { SessionRequest, Profile, Review } from '@/lib/types';

type CheckRow = SessionRequest & {
  profiles: Pick<Profile, 'company_name' | 'email'> | null;
  reviews: Review[] | null;
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminReviews() {
  await requireAdmin();
  const supabase = createClient();
  const { data: checks } = await supabase
    .from('session_requests')
    .select('*, profiles(company_name, email), reviews(*)')
    .order('requested_at', { ascending: false })
    .returns<CheckRow[]>();

  return (
    <Shell title="Post reviews" subtitle="Write a verdict on a client check" maxWidth="100%" right={<SignOutButton />}>
      <BackLink />
      <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {checks && checks.length > 0 ? (
          checks.map((c) => (
            <div key={c.id} style={panelStyle}>
              <div style={{ fontSize: '15px' }}>
                <span style={{ color: C.text, fontWeight: 600 }}>{c.profiles?.company_name || '—'}</span>{' '}
                <span style={{ color: C.muted }}>{c.profiles?.email}</span>
              </div>
              <div style={{ fontSize: '13px', color: C.muted, marginTop: '8px' }}>
                <span style={{ fontFamily: MONO, color: C.accent }}>{c.repo_url}</span> · {fmt(c.requested_at)} ·{' '}
                {c.status}
              </div>

              {c.reviews && c.reviews.length > 0 && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {c.reviews.map((rv) => (
                    <div
                      key={rv.id}
                      style={{ background: C.surface2, borderLeft: `2px solid ${C.accent}`, borderRadius: '6px', padding: '12px 14px' }}
                    >
                      {rv.verdict && <span style={{ fontSize: '13px', fontWeight: 600, color: C.accent }}>{rv.verdict} · </span>}
                      <span style={{ fontSize: '14px', lineHeight: 1.6 }}>{rv.body}</span>
                    </div>
                  ))}
                </div>
              )}

              <AdminReviewForm accountId={c.account_id} sessionRequestId={c.id} />
            </div>
          ))
        ) : (
          <p style={{ fontSize: '15px', color: C.muted }}>No checks to review yet.</p>
        )}
      </div>
    </Shell>
  );
}
