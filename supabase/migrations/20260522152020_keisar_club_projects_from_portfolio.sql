-- Add new columns to existing portfolio table (nullable until backfill)
alter table public.portfolio
  add column company_name text,
  add column duration text,
  add column status_new public.project_status,
  add column developers uuid[] not null default '{}',
  add column assigned_manager uuid references public.profiles(id) on delete set null,
  add column client_visibility public.client_visibility not null default 'hidden',
  add column dev_attribution public.dev_attribution not null default 'named',
  add column started_at date,
  add column finished_at date,
  add column updated_at timestamptz not null default now();

-- Map existing text status → enum
update public.portfolio set status_new = case
  when status = 'completed' then 'finished'::public.project_status
  when status = 'in-progress' then 'ongoing'::public.project_status
  when status = 'concept' then 'upcoming'::public.project_status
  else 'finished'::public.project_status
end;

-- Best-effort default for finished_at on existing rows
update public.portfolio
  set finished_at = created_at::date
  where status_new = 'finished' and finished_at is null;

-- Replace old text status column with the enum
alter table public.portfolio drop column status;
alter table public.portfolio rename column status_new to status;
alter table public.portfolio alter column status set not null;
alter table public.portfolio alter column status set default 'finished';

-- updated_at maintenance
create trigger projects_set_updated_at
  before update on public.portfolio
  for each row execute function public.set_updated_at();

-- Rename to projects
alter table public.portfolio rename to projects;

-- Backwards-compat view so the currently deployed site keeps working
-- until the new client code is deployed. Drop this view in the
-- security_hardening migration once everyone is on the new code.
create view public.portfolio as select * from public.projects;
