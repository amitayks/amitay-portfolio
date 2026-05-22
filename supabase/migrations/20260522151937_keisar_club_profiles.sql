create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'dev',
  github_handle text,
  full_name text,
  display_name text,
  avatar_url text,
  bio text,
  resume_url text,
  links jsonb not null default '{}'::jsonb,
  status public.profile_status not null default 'active',
  invited_by uuid references public.profiles(id) on delete set null,
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);
create index profiles_status_idx on public.profiles(status);
create index profiles_github_handle_idx on public.profiles(github_handle);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- SECURITY DEFINER helper to avoid recursive RLS checks
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Prevent non-admins from changing privileged fields on their own profile
create or replace function public.profile_protect_admin_fields()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role = old.role;
    new.status = old.status;
    new.invited_by = old.invited_by;
    new.terms_accepted_at = coalesce(new.terms_accepted_at, old.terms_accepted_at);
    new.id = old.id;
    new.created_at = old.created_at;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_admin_fields
  before update on public.profiles
  for each row execute function public.profile_protect_admin_fields();

alter table public.profiles enable row level security;
