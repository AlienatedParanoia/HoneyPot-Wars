import { Shell, panelStyle, BackLink } from '@/components/Shell';
import { SignOutButton } from '@/components/SignOutButton';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C } from '@/lib/theme';
import type { Report, Profile } from '@/lib/types';

type ReportRow = Report & { profiles: Pick<Profile, 'company_name' | 'email'> | null };

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminAllReports() {
  await requireAdmin();
  const supabase = createClient();
  const { data: reports } = await supabase
    .from('reports')
    .select('*, profiles(company_name, email)')
    .order('created_at', { ascending: false })
    .returns<ReportRow[]>();

  return (
    <Shell title="All posted reports" subtitle={`${reports?.length ?? 0} total`} maxWidth="100%" right={<SignOutButton />}>
      <BackLink />
      <div style={{ ...panelStyle, marginTop: '18px' }}>
        {reports && reports.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  paddingBottom: '12px',
                }}
              >
                <span style={{ fontSize: '15px', lineHeight: 1.6 }}>
                  <span style={{ color: C.text }}>{r.title}</span>
                  <span style={{ color: C.muted, fontSize: '13px' }}>
                    {' '}
                    · {r.report_type} · {r.profiles?.company_name || r.profiles?.email || '—'} · {fmt(r.created_at)}
                  </span>
                </span>
                <a href={`/api/reports/download?id=${r.id}`} style={{ color: C.accent, fontSize: '14px' }}>
                  Download
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '15px', color: C.muted, margin: 0 }}>No reports posted yet.</p>
        )}
      </div>
    </Shell>
  );
}
