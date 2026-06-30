-- Regression fix: is_admin() was moved public -> private (migration
-- 20260522215502_keisar_club_move_is_admin_to_private_schema). RLS policies
-- kept working (bound by OID), but this trigger calls is_admin() by name in
-- PL/pgSQL, resolved at runtime, which broke every profiles UPDATE with
-- "function public.is_admin() does not exist". Point it at the function's
-- current schema. Behavior is otherwise unchanged.
create or replace function public.profile_protect_admin_fields()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if not private.is_admin() then
    new.role = old.role;
    new.status = old.status;
    new.invited_by = old.invited_by;
    new.terms_accepted_at = coalesce(new.terms_accepted_at, old.terms_accepted_at);
    new.id = old.id;
    new.created_at = old.created_at;
  end if;
  return new;
end;
$function$;
