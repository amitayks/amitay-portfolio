-- Required extensions
create extension if not exists citext with schema extensions;

-- Enum types for the Keisar Club platform
create type public.user_role as enum ('admin', 'manager', 'dev', 'client');
create type public.profile_status as enum ('active', 'suspended');
create type public.project_status as enum ('upcoming', 'ongoing', 'finished');
create type public.client_visibility as enum ('public', 'logo_only', 'hidden');
create type public.dev_attribution as enum ('named', 'anonymized', 'hidden');

-- Shared updated_at trigger function (used by multiple tables)
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
