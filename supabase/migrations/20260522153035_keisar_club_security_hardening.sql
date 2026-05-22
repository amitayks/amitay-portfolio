-- Drop the temporary portfolio backwards-compat view.
-- Client code is being updated in this same change, so the alias
-- is no longer needed and would leak all columns to anon.
drop view if exists public.portfolio;

-- Fix search_path on set_updated_at (lint 0011)
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict EXECUTE on SECURITY DEFINER helpers (lints 0028, 0029)
revoke execute on function public.profile_audit_trigger() from public;
revoke execute on function public.profile_protect_admin_fields() from public;
revoke execute on function public.is_admin() from public;

-- Rebuild profiles_public as security_invoker=true so it enforces
-- the caller's RLS, not the view owner's privileges (lint 0010).
drop view if exists public.profiles_public;

create view public.profiles_public
with (security_invoker = true)
as select
  id,
  display_name,
  avatar_url,
  github_handle,
  bio,
  links
from public.profiles
where status = 'active';

grant select on public.profiles_public to anon, authenticated;

-- Column-level grant: anon and authenticated can SELECT only the
-- safe columns on profiles directly. Admin queries go through the
-- profiles_self_read / profiles_admin_read policies which return
-- all columns to authorized callers.
revoke select on public.profiles from anon, authenticated;
grant select (id, display_name, avatar_url, github_handle, bio, links)
  on public.profiles to anon, authenticated;

-- Row-level: anyone can read active profiles through the
-- column-restricted grant above.
create policy profiles_public_active_read on public.profiles
  for select using (status = 'active');
