-- validate_invite: anon-callable. Returns email + expires_at when
-- the SHA-256 hash of the raw token matches an unused, unexpired
-- row in dev_invites. Returns nothing otherwise.
create or replace function public.validate_invite(p_token text)
returns table(email text, expires_at timestamptz)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select i.email::text, i.expires_at
  from public.dev_invites i
  where i.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and i.used_at is null
    and i.expires_at > now();
$$;

-- redeem_invite: authenticated-only. Atomically verifies the
-- token, checks the caller's auth email matches the invite,
-- marks the invite used, and returns the invited_by uuid.
create or replace function public.redeem_invite(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_invite_id uuid;
  v_invite_email text;
  v_invite_invited_by uuid;
  v_user_email text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select email into v_user_email from auth.users where id = auth.uid();

  select id, email::text, invited_by
    into v_invite_id, v_invite_email, v_invite_invited_by
  from public.dev_invites
  where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and used_at is null
    and expires_at > now()
  for update;

  if v_invite_id is null then
    raise exception 'invite_invalid_or_expired' using errcode = 'P0002';
  end if;

  if lower(v_user_email) <> lower(v_invite_email) then
    raise exception 'invite_email_mismatch' using errcode = 'P0001';
  end if;

  update public.dev_invites set used_at = now() where id = v_invite_id;

  return v_invite_invited_by;
end;
$$;

revoke execute on function public.validate_invite(text) from public;
revoke execute on function public.redeem_invite(text) from public;

grant execute on function public.validate_invite(text) to anon, authenticated;
grant execute on function public.redeem_invite(text) to authenticated;
