import crypto from "crypto";

export function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashInvitationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyInvitationToken(token: string, tokenHash: string): boolean {
  const hash = hashInvitationToken(token);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(tokenHash, "hex")
    );
  } catch {
    return false;
  }
}

export function getInvitationExpiry(days = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
