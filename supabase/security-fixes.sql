-- Honeypot Wars — security fixes (authorization & consent gating).
-- Safe to run on the existing production database: every statement is idempotent
-- (create or replace / drop-if-exists / if not exists). Run once in the Supabase
-- SQL editor. These are also folded into schema.sql for fresh setups.

-- ============================================================
-- 1. Helper: privileged writer (admin by email OR service-role client)
--    Used so the approve endpoint's service-role writes are not reverted,
--    while ordinary clients stay blocked.
-- ============================================================
create or replace function public.is_privileged()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or coalesce(
         nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
         ''
       ) = 'service_role';
$$;

-- ============================================================
-- 2. Helper: admin allowlist, readable only by admins.
--    Lets the app filter admin accounts out of client lists using the
--    admin_emails table as the single source of truth.
-- ============================================================
create or replace function public.admin_emails_list()
returns setof text
language sql
stable
security definer
set search_path = public
as $$
  select email from public.admin_emails where public.is_admin();
$$;

-- ============================================================
-- 3. Pin identity/scope columns for ordinary clients.
--    Non-privileged users can no longer self-activate, rewrite the scope-lock
--    domain, or spoof their email. Uses is_privileged() so the service-role
--    approve path still works.
-- ============================================================
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_privileged() then
    new.account_status    := old.account_status;
    new.registered_domain := old.registered_domain;
    new.email             := old.email;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ============================================================
-- 4. Close the self-approval hole.
--    Clients may only insert their OWN request, with consent, in the initial
--    pending/unreviewed state — they can never self-issue an 'approved' record
--    or forge reviewed_by/reviewed_at. Suspended accounts cannot submit.
-- ============================================================
drop policy if exists "requests_insert_own" on public.session_requests;
create policy "requests_insert_own" on public.session_requests
  for insert with check (
    (
      account_id = auth.uid()
      and consent_signed = true
      and status = 'pending'
      and reviewed_at is null
      and reviewed_by is null
      and (
        select p.account_status from public.profiles p where p.id = auth.uid()
      ) is distinct from 'suspended'
    )
    or public.is_admin()
  );

-- ============================================================
-- 5. At most one pending request per account (server-enforced).
--    NOTE: if this errors with a duplicate-key message, you already have two
--    pending rows for one account — reject/clean one, then re-run this line.
-- ============================================================
create unique index if not exists session_requests_one_pending_idx
  on public.session_requests(account_id) where status = 'pending';
