create table public.dev_invites (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  email extensions.citext not null,
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  used_at timestamptz
);

create index dev_invites_email_unused_idx on public.dev_invites(email) where used_at is null;

alter table public.dev_invites enable row level security;
