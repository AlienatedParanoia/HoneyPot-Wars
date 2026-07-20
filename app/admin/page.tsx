import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { SignOutButton } from '@/components/SignOutButton';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C, DISPLAY } from '@/lib/theme';
import type { Profile, SessionRequest, Report } from '@/lib/types';

const navCard: React.CSSProperties = {
  flex: '1',
  minWidth: '200px',
  border: `1px solid ${C.border}`,
  borderRadius: 'var(--r-card)',
  padding: '22px',
  textDecoration: 'none',
  color: C.text,
};

export default async function AdminHome() {
  await requireAdmin();
  const supabase = createClient();

  const [{ data: profiles }, { data: pending }, { data: reports }, { data: adminEmails }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).returns<Profile[]>(),
    supabase.from('session_requests').select('id').eq('status', 'pending').returns<Pick<SessionRequest, 'id'>[]>(),
    supabase.from('reports').select('id').returns<Pick<Report, 'id'>[]>(),
    supabase.rpc('admin_emails_list'),
  ]);

  // Admins are not clients — exclude them from the client list. The admin set
  // comes from the admin_emails table (single source of truth), not an env list.
  const adminSet = new Set(
    ((adminEmails as string[] | null) ?? []).map((e) => e.toLowerCase()),
  );
  const clients = (profiles ?? []).filter((p) => !adminSet.has(p.email.toLowerCase()));

  const stat: React.CSSProperties = { fontFamily: DISPLAY, fontWeight: 800, fontSize: '32px', color: C.accent };

  return (
    <Shell title="Admin console" subtitle="Honeypot Wars control panel" maxWidth="100%" right={<SignOutButton />}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <Link href="/admin/requests" style={navCard}>
          <div style={stat}>{pending?.length ?? 0}</div>
          <div style={{ fontSize: '14px', color: C.muted, marginTop: '10px' }}>Pending requests →</div>
        </Link>
        <Link href="/admin/users" style={navCard}>
          <div style={stat}>{clients.length}</div>
          <div style={{ fontSize: '14px', color: C.muted, marginTop: '10px' }}>All users →</div>
        </Link>
        <Link href="/admin/reports" style={navCard}>
          <div style={stat}>{reports?.length ?? 0}</div>
          <div style={{ fontSize: '14px', color: C.muted, marginTop: '10px' }}>All reports →</div>
        </Link>
        <Link href="/admin/reviews" style={navCard}>
          <div style={stat}>✎</div>
          <div style={{ fontSize: '14px', color: C.muted, marginTop: '10px' }}>Post reviews →</div>
        </Link>
      </div>

      <div style={{ border: `1px solid ${C.border}`, borderRadius: 'var(--r-card)', padding: '22px' }}>
        <div className="hw-mono-label">Clients</div>
        {clients.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: '0', margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {clients.map((c) => (
              <li
                key={c.id}
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
                <span style={{ fontSize: '15px' }}>
                  <span style={{ color: C.text, fontWeight: 600 }}>{c.company_name || '—'}</span>{' '}
                  <span style={{ color: C.muted }}>{c.email}</span>{' '}
                  <span style={{ color: c.account_status === 'active' ? C.ok : C.muted, fontSize: '13px' }}>
                    [{c.account_status}]
                  </span>
                </span>
                <Link href={`/admin/clients/${c.id}`} style={{ color: C.accent, fontSize: '14px' }}>
                  Manage →
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '15px', color: C.muted, margin: '16px 0 0' }}>No clients yet.</p>
        )}
      </div>
    </Shell>
  );
}
