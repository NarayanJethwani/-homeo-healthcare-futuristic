const GUEST_SESSION_KEY = "homeo-healthcare:mm:guest-session:v1";

export function getPrivateWorkspaceOwnerKey(uid?: string | null): string {
  if (uid) return uid;
  if (typeof window === "undefined") return "guest-server";

  try {
    const existing = window.sessionStorage.getItem(GUEST_SESSION_KEY);
    if (existing) return `guest-${existing}`;

    const sessionId = globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(GUEST_SESSION_KEY, sessionId);
    return `guest-${sessionId}`;
  } catch {
    return "guest-session-unavailable";
  }
}

export function clearGuestSessionId(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(GUEST_SESSION_KEY);
  } catch {
    // Storage can be unavailable in hardened/private browser contexts.
  }
}
