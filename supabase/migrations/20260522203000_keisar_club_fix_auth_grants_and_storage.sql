-- Fix #1: storage.objects "read product image" policy was scoped to
-- auth.role()='anon', which breaks for logged-in users. Allow both
-- anon and authenticated to read from products-image (same as the
-- existing site-image policy).
drop policy if exists "read product image " on storage.objects;

create policy "read product image" on storage.objects
  for select
  using (bucket_id = 'products-image');

-- Fix #2: profiles table-level SELECT was revoked from both anon
-- and authenticated as part of column-level grants. That breaks
-- `select=*` for the row owner (auth.uid() = id) and for admins,
-- both of whom should see all columns.
--
-- Restore full SELECT for authenticated (RLS still restricts which
-- rows: self via profiles_self_read, all via profiles_admin_read,
-- active via profiles_public_active_read).
-- Anon keeps column-level grants only.
grant select on public.profiles to authenticated;
