-- Explicitly revoke EXECUTE on internal helpers from the Supabase
-- API roles so they're not callable via /rest/v1/rpc/*.
-- is_admin is invoked by RLS policies (which run as the policy
-- owner, not the caller, so the policy still works).
revoke execute on function public.is_admin() from anon, authenticated;
revoke execute on function public.profile_audit_trigger() from anon, authenticated;
revoke execute on function public.profile_protect_admin_fields() from anon, authenticated;
