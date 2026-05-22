export type UserRole = "admin" | "manager" | "dev" | "client";
export type ProfileStatus = "active" | "suspended";

export interface ProfileLinks {
  github?: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  github_handle: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  resume_url: string | null;
  links: ProfileLinks;
  status: ProfileStatus;
  invited_by: string | null;
  terms_accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  github_handle: string | null;
  bio: string | null;
  links: ProfileLinks;
}

export interface ProfileEditable {
  full_name?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  resume_url?: string | null;
  links?: ProfileLinks;
  terms_accepted_at?: string;
}

export interface DevInvite {
  id: string;
  token_hash: string;
  email: string;
  invited_by: string | null;
  created_at: string;
  expires_at: string;
  used_at: string | null;
}

export interface ProfileAuditEntry {
  id: number;
  profile_id: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
}
