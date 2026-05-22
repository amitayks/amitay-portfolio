import supabase from "./supabase";
import { generateInviteToken, sha256Hex } from "@/lib/crypto";
import type { DevInvite } from "@/types/profile";

export interface InviteValidationResult {
  email: string;
  expiresAt: string;
}

export async function validateInvite(
  rawToken: string
): Promise<InviteValidationResult | null> {
  const { data, error } = await supabase.rpc("validate_invite", { p_token: rawToken });
  if (error) throw error;
  if (!data || data.length === 0) return null;
  const row = data[0] as { email: string; expires_at: string };
  return { email: row.email, expiresAt: row.expires_at };
}

// Atomic redeem: checks token, checks the caller's auth email matches,
// marks invite used, returns invited_by uuid.
// Throws on any failure (mismatched email, expired, used, not authenticated).
export async function redeemInvite(rawToken: string): Promise<string | null> {
  const { data, error } = await supabase.rpc("redeem_invite", { p_token: rawToken });
  if (error) {
    // Map Postgres errcodes to readable names
    const msg = error.message ?? "";
    if (msg.includes("invite_email_mismatch")) throw new InviteEmailMismatchError();
    if (msg.includes("invite_invalid_or_expired")) throw new InviteInvalidError();
    if (msg.includes("not_authenticated")) throw new InviteNotAuthenticatedError();
    throw error;
  }
  return (data as string | null) ?? null;
}

// Admin-only. Generates a random token, hashes it, inserts the hash
// to dev_invites, returns the raw token so the admin can copy the URL.
// The raw token is never persisted server-side.
export async function createInvite(email: string): Promise<{ rawToken: string; invite: DevInvite }> {
  const rawToken = generateInviteToken();
  const tokenHash = await sha256Hex(rawToken);
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("dev_invites")
    .insert({
      token_hash: tokenHash,
      email: email.toLowerCase(),
      invited_by: user.user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return { rawToken, invite: data as DevInvite };
}

export async function listInvites(): Promise<DevInvite[]> {
  const { data, error } = await supabase
    .from("dev_invites")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DevInvite[];
}

export class InviteEmailMismatchError extends Error {
  constructor() {
    super("Your account email does not match the invite.");
    this.name = "InviteEmailMismatchError";
  }
}
export class InviteInvalidError extends Error {
  constructor() {
    super("This invite is invalid or has expired.");
    this.name = "InviteInvalidError";
  }
}
export class InviteNotAuthenticatedError extends Error {
  constructor() {
    super("You must sign in before redeeming an invite.");
    this.name = "InviteNotAuthenticatedError";
  }
}
