import { createClient } from '@/lib/supabase/server';

// Server-side admin verification for API routes. Returns the user id when the
// caller is an authenticated admin, otherwise null. Admin status is resolved by
// the is_admin() RPC against the admin_emails table — the SAME authority RLS
// uses — so the API layer and the database can never disagree. Never trusts a
// divergent env allowlist or client input. Fails closed on any RPC error.
export async function verifyAdmin(): Promise<{ userId: string } | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || isAdmin !== true) return null;
  return { userId: user.id };
}
