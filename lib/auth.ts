import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

// Returns the signed-in user or null. Use in Server Components / route handlers.
export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Requires a signed-in user; redirects to /login otherwise.
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

// Admin status comes from the admin_emails table via the is_admin() RPC — the
// same authority RLS uses — so the app layer and the database can never diverge.
// Fails closed on any RPC error.
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('is_admin');
  return !error && data === true;
}

// Requires an admin user; redirects otherwise.
export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (!(await isCurrentUserAdmin())) redirect('/dashboard');
  return user;
}
