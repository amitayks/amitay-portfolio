-- ============================================================
-- profiles
-- ============================================================
create policy profiles_self_read on public.profiles
  for select using (auth.uid() = id);

create policy profiles_admin_read on public.profiles
  for select using (public.is_admin());

create policy profiles_self_insert on public.profiles
  for insert with check (auth.uid() = id);

create policy profiles_admin_insert on public.profiles
  for insert with check (public.is_admin());

create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy profiles_admin_update on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

create policy profiles_admin_delete on public.profiles
  for delete using (public.is_admin());

-- ============================================================
-- profile_audit
-- ============================================================
-- Inserts only via trigger (no INSERT policy = blocked by RLS).
create policy profile_audit_self_read on public.profile_audit
  for select using (auth.uid() = profile_id);

create policy profile_audit_admin_read on public.profile_audit
  for select using (public.is_admin());

-- ============================================================
-- dev_invites
-- ============================================================
create policy dev_invites_admin_all on public.dev_invites
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- projects (replaces the open "Enable read access for all users")
-- ============================================================
drop policy if exists "Enable read access for all users" on public.projects;

create policy projects_public_read on public.projects
  for select using (publish = true);

create policy projects_admin_read on public.projects
  for select using (public.is_admin());

create policy projects_admin_insert on public.projects
  for insert with check (public.is_admin());

create policy projects_admin_update on public.projects
  for update using (public.is_admin()) with check (public.is_admin());

create policy projects_admin_delete on public.projects
  for delete using (public.is_admin());
