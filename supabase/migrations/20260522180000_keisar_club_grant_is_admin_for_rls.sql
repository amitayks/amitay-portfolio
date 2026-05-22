-- RLS policies on profiles / projects / dev_invites call public.is_admin().
-- Postgres evaluates the function with the caller's GRANTs even though it
-- is SECURITY DEFINER. Without EXECUTE for anon and authenticated, every
-- SELECT through these RLS policies fails with "permission denied for
-- function is_admin". Re-granting EXECUTE: the function only returns a
-- boolean (whether the caller is the admin profile), so direct invocation
-- via /rest/v1/rpc/is_admin is safe — it returns false for anon and
-- true/false for authenticated users, leaking nothing useful.
grant execute on function public.is_admin() to anon, authenticated;

-- Trigger functions stay revoked: triggers are invoked by Postgres
-- internally, not via REST GRANTs, so anon cannot reach them.
