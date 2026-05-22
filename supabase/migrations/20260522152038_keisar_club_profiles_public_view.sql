-- Public view exposing only safe profile columns for active profiles.
-- This initial definition is replaced in the security_hardening
-- migration with security_invoker=true + column-level grants.
create view public.profiles_public as
select
  id,
  display_name,
  avatar_url,
  github_handle,
  bio,
  links
from public.profiles
where status = 'active';

grant select on public.profiles_public to anon, authenticated;
