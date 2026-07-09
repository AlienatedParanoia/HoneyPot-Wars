import { redirect } from 'next/navigation';
import { Shell, panelStyle } from '@/components/Shell';
import { SignOutButton } from '@/components/SignOutButton';
import { Button } from '@/components/ui/button';
import { requireUser, isAdminUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C, MONO } from '@/lib/theme';
import type { Profile, SessionRequest, Report, Review } from '@/lib/types';

type CheckRow = SessionRequest & { reviews: Review[] | null };

const STATUS_COLOR: Record<string, string> = {
  pending: C.muted,
  approved: C.ok,
  rejected: C.high,
  active: C.ok,
  suspended: C.high,
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function DashboardPage() {
  const user = await requireUser();
  // Admin-only identity: admins use /admin, never the client home (defense in depth).
  if (isAdminUser(user)) redirect('/admin');

  const supabase = createClient();
  const [{ data: profile }, { data: checks }, { data: reports }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle<Profile>(),
    supabase
      .from('session_requests')
      .select('*, reviews(*)')
      .eq('account_id', user.id)
      .order('requested_at', { ascending: false })
      .returns<CheckRow[]>(),
    supabase.from('reports').select('*').eq('account_id', user.id).order('created_at', { ascending: false }).returns<Report[]>(),
  ]);

  const hasPending = (checks ?? []).some((c) => c.status === 'pending');
  const status = profile?.account_status ?? 'pending';

  return (
    <Shell
      title={`Welcome, ${profile?.company_name || user.email || 'operator'}`}
      subtitle="Your security dashboard"
      maxWidth="900px"
      right={<SignOutButton />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Account status + new-check CTA */}
        <div
          style={{
            ...panelStyle,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="hw-mono-label">Account status</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: STATUS_COLOR[status] ?? C.text, marginTop: '8px' }}>
              {status}
            </div>
          </div>
          {!hasPending && (
            <Button href="/request-session" size="sm">
              Request a check
            </Button>
          )}
        </div>

        {/* Past checks (history) with any admin reviews attached */}
        <div style={panelStyle}>
          <div className="hw-mono-label">Your checks</div>
          {checks && checks.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {checks.map((c) => (
                <li key={c.id} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '16px' }}>
                  <div style={{ fontFamily: MONO, fontSize: '14px', color: C.accent, wordBreak: 'break-all' }}>{c.repo_url}</div>
                  <div style={{ fontSize: '13px', color: C.muted, marginTop: '6px' }}>
                    {fmt(c.requested_at)} · <span style={{ color: STATUS_COLOR[c.status] ?? C.text }}>{c.status}</span>
                  </div>
                  {c.reviews && c.reviews.length > 0 && (
                    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {c.reviews.map((rv) => (
                        <div
                          key={rv.id}
                          style={{ background: C.surface2, borderLeft: `2px solid ${C.accent}`, borderRadius: '6px', padding: '14px 16px' }}
                        >
                          {rv.verdict && (
                            <div style={{ fontSize: '13px', fontWeight: 600, color: C.accent, marginBottom: '8px' }}>{rv.verdict}</div>
                          )}
                          <div style={{ fontSize: '14px', lineHeight: 1.6, color: C.text }}>{rv.body}</div>
                          <div style={{ fontSize: '12px', color: C.muted, marginTop: '10px' }}>
                            — Honeypot Wars · {fmt(rv.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '15px', color: C.muted, margin: '0 0 16px' }}>No checks yet.</p>
              <Button href="/request-session" size="sm">
                Request your first check
              </Button>
            </div>
          )}
        </div>

        {/* Reports — downloadable */}
        <div style={panelStyle}>
          <div className="hw-mono-label">Your reports</div>
          {reports && reports.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reports.map((r) => (
                <li
                  key={r.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${C.border}`,
                    paddingBottom: '14px',
                  }}
                >
                  <span style={{ fontSize: '15px', color: C.text }}>
                    {r.title}
                    <span style={{ color: C.muted, fontSize: '13px' }}> · {r.report_type} · {fmt(r.created_at)}</span>
                  </span>
                  <a href={`/api/reports/download?id=${r.id}`} style={{ color: C.accent, fontSize: '14px' }}>
                    Download
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '15px', color: C.muted, margin: '16px 0 0' }}>
              No reports yet. They&apos;ll appear here once your assessment is complete.
            </p>
          )}
        </div>
      </div>
    </Shell>
  );
}
