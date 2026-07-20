-- The admin_emails table is the SINGLE source of truth for admin access: both
-- RLS (is_admin()) and the app layer (verifyAdmin / requireAdmin via the
-- is_admin() RPC) read it. Manage admins here. To revoke an admin, DELETE their
-- row — removing them from ADMIN_EMAILS env alone does NOT revoke DB privileges.
-- Re-run safely; conflicts are ignored.

insert into public.admin_emails (email) values
  ('prajjit2009@gmail.com')
on conflict (email) do nothing;
