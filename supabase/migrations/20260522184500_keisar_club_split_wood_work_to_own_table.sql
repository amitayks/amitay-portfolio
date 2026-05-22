-- Create wood_work as a structural clone of projects.
-- LIKE ... INCLUDING ALL copies columns, defaults, constraints, and
-- indexes, but NOT foreign keys, triggers, or RLS. Re-add those below.
create table public.wood_work (like public.projects including all);

-- Re-add the FK to profiles for the assigned manager.
alter table public.wood_work
  add constraint wood_work_assigned_manager_fkey
  foreign key (assigned_manager) references public.profiles(id) on delete set null;

-- Re-add the updated_at maintenance trigger.
create trigger wood_work_set_updated_at
  before update on public.wood_work
  for each row execute function public.set_updated_at();

-- Enable RLS with no policies — table is private to admin connections
-- via the service role / direct DB access only. Anon and authenticated
-- get zero rows even with table-level GRANTs.
alter table public.wood_work enable row level security;

-- Move the 32 Wood-Working rows over (no data loss).
insert into public.wood_work select * from public.projects where "projectType" = 'Wood-Working';

delete from public.projects where "projectType" = 'Wood-Working';
