import Link from 'next/link';
import { Shell, panelStyle, BackLink } from '@/components/Shell';
import { SignOutButton } from '@/components/SignOutButton';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C } from '@/lib/theme';
import type { Profile } from '@/lib/types';

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminUsers() {
  await requireAdmin();
  const supabase = createClient();
  const [{ data: profiles }, { data: adminEmails }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).returns<Profile[]>(),
    supabase.rpc('admin_emails_list'),
  ]);

  // Exclude admin accounts using the admin_emails table (single source of truth).
  const adminSet = new Set(
    ((adminEmails as string[] | null) ?? []).map((e) => e.toLowerCase()),
  );
  const users = (profiles ?? []).filter((p) => !adminSet.has(p.email.toLowerCase()));

  return (
    <Shell title="All users" subtitle={`${users.length} registered`} maxWidth="100%" right={<SignOutButton />}>
      <BackLink />
      <div style={{ ...panelStyle, marginTop: '18px' }}>
        {users.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {users.map((u) => (
              <li
                key={u.id}
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
                  <span style={{ color: C.text, fontWeight: 600 }}>{u.company_name || '—'}</span>{' '}
                  <span style={{ color: C.muted }}>{u.email}</span>{' '}
                  <span style={{ color: u.account_status === 'active' ? C.ok : C.muted, fontSize: '13px' }}>
                    [{u.account_status}]
                  </span>
                  <span style={{ color: C.muted, fontSize: '13px' }}> · joined {fmt(u.created_at)}</span>
                </span>
                <Link href={`/admin/clients/${u.id}`} style={{ color: C.accent, fontSize: '14px' }}>
                  Manage →
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '15px', color: C.muted, margin: 0 }}>No users yet.</p>
        )}
      </div>
    </Shell>
  );
}
