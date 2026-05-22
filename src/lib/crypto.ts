// SHA-256 of a string returned as lowercase hex.
// Matches Postgres `encode(extensions.digest(p, 'sha256'), 'hex')`.
export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 32 bytes of cryptographically random URL-safe base64.
// ~43 chars after stripping padding.
export function generateInviteToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let b64 = btoa(String.fromCharCode(...bytes));
  // Make URL-safe and strip padding
  b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return b64;
}
