import { notFound } from 'next/navigation';
import { Shell, panelStyle, BackLink } from '@/components/Shell';
import { SignOutButton } from '@/components/SignOutButton';
import { UploadReportForm } from '@/components/UploadReportForm';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C, MONO } from '@/lib/theme';
import type { Profile, Report, SessionRequest } from '@/lib/types';

const STATUS_COLOR: Record<string, string> = {
  approved: C.ok,
  rejected: C.high,
  pending: C.muted,
};

export default async function AdminClientPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<Profile>();
  if (!profile) notFound();

  const [{ data: requests }, { data: reports }] = await Promise.all([
    supabase.from('session_requests').select('*').eq('account_id', params.id).order('requested_at', { ascending: false }).returns<SessionRequest[]>(),
    supabase.from('reports').select('*').eq('account_id', params.id).order('created_at', { ascending: false }).returns<Report[]>(),
  ]);

  return (
    <Shell
      title={profile.company_name || profile.email}
      subtitle={`Status: ${profile.account_status}`}
      maxWidth="100%"
      right={<SignOutButton />}
    >
      <BackLink />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '18px' }}>
        <div style={panelStyle}>
          <div className="hw-mono-label">Client</div>
          <div style={{ fontSize: '15px', color: C.muted, marginTop: '12px' }}>Email: {profile.email}</div>
          <div style={{ fontSize: '15px', color: C.muted }}>Domain: {profile.registered_domain || '—'}</div>
        </div>

        <div style={panelStyle}>
          <div className="hw-mono-label">Session requests</div>
          {requests && requests.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {requests.map((r) => (
                <li key={r.id} style={{ fontSize: '14px' }}>
                  <span style={{ fontFamily: MONO, color: C.accent }}>{r.repo_url}</span>
                  {' — '}
                  <span style={{ color: STATUS_COLOR[r.status] ?? C.text }}>{r.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '15px', color: C.muted, margin: '14px 0 0' }}>No requests.</p>
          )}
        </div>

        <div style={panelStyle}>
          <div className="hw-mono-label" style={{ marginBottom: '16px', display: 'block' }}>
            Upload report
          </div>
          <UploadReportForm accountId={profile.id} />
        </div>

        <div style={panelStyle}>
          <div className="hw-mono-label">Existing reports</div>
          {reports && reports.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reports.map((r) => (
                <li
                  key={r.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                    borderBottom: `1px solid ${C.border}`,
                    paddingBottom: '10px',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>
                    {r.title}
                    <span style={{ color: C.muted, fontSize: '13px' }}> · {r.report_type}</span>
                  </span>
                  <a href={`/api/reports/download?id=${r.id}`} style={{ color: C.accent, fontSize: '14px' }}>
                    Download
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '15px', color: C.muted, margin: '14px 0 0' }}>No reports uploaded yet.</p>
          )}
        </div>
      </div>
    </Shell>
  );
}
