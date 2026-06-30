-- New developer-describing profile properties for the dev profile popup
-- (change: add-dev-profile-popup).
create type availability_status as enum ('available', 'open_to_work', 'busy');

alter table public.profiles
  add column headline     text,
  add column skills       text[] not null default '{}'::text[],
  add column availability availability_status;

-- Recreate the public projection to expose the new fields plus resume_url.
-- Preserve security_invoker=true; columns appended after the existing set.
create or replace view public.profiles_public
  with (security_invoker = true) as
select id, display_name, avatar_url, github_handle, bio, links,
       headline, skills, availability, resume_url
from public.profiles
where status = 'active';
