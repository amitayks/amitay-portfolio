-- Regression fix: the public site showed no developer credits for anonymous
-- visitors (skeleton, then nothing), while logged-in views worked.
--
-- Root cause: `profiles_public` is a security_invoker view, so reads run with
-- the caller's column-level privileges on `public.profiles`. Per
-- 20260522153035_keisar_club_security_hardening, `anon` was granted SELECT on
-- only the safe public columns (id, display_name, avatar_url, github_handle,
-- bio, links). `authenticated` later received table-level SELECT
-- (20260522203000_keisar_club_fix_auth_grants_and_storage), so it sees any new
-- column automatically — `anon` does not.
--
-- 20260630083502_add_developer_profile_fields added headline/skills/availability
-- and put them (plus resume_url) into the projection, but never extended anon's
-- column grant. Anonymous reads of profiles_public then hit a column anon cannot
-- access and failed with "permission denied for table profiles", returning no
-- rows. This grant restores the curated-public-columns design for the new fields.
grant select (headline, skills, availability, resume_url)
  on public.profiles to anon;
