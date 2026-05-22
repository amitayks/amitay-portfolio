create table public.profile_audit (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  field text not null,
  old_value text,
  new_value text,
  changed_at timestamptz not null default now()
);

create index profile_audit_profile_id_idx on public.profile_audit(profile_id);
create index profile_audit_profile_field_idx on public.profile_audit(profile_id, field);

-- Audit trigger: writes one row per changed editable field
create or replace function public.profile_audit_trigger()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if new.full_name is distinct from old.full_name then
    insert into public.profile_audit(profile_id, field, old_value, new_value)
    values (new.id, 'full_name', old.full_name, new.full_name);
  end if;
  if new.display_name is distinct from old.display_name then
    insert into public.profile_audit(profile_id, field, old_value, new_value)
    values (new.id, 'display_name', old.display_name, new.display_name);
  end if;
  if new.avatar_url is distinct from old.avatar_url then
    insert into public.profile_audit(profile_id, field, old_value, new_value)
    values (new.id, 'avatar_url', old.avatar_url, new.avatar_url);
  end if;
  if new.bio is distinct from old.bio then
    insert into public.profile_audit(profile_id, field, old_value, new_value)
    values (new.id, 'bio', old.bio, new.bio);
  end if;
  if new.resume_url is distinct from old.resume_url then
    insert into public.profile_audit(profile_id, field, old_value, new_value)
    values (new.id, 'resume_url', old.resume_url, new.resume_url);
  end if;
  if new.links is distinct from old.links then
    insert into public.profile_audit(profile_id, field, old_value, new_value)
    values (new.id, 'links', old.links::text, new.links::text);
  end if;
  return new;
end;
$$;

create trigger profiles_audit
  after update on public.profiles
  for each row execute function public.profile_audit_trigger();

alter table public.profile_audit enable row level security;
