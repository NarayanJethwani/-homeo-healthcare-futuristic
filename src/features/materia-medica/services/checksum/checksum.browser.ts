import { canonicalizeChecksumText } from "./checksum.shared";

export async function computeSha256Browser(text: string): Promise<string> {
  const canonical = canonicalizeChecksumText(text);
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto API is not available in this environment.");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(canonical);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
export default computeSha256Browser;
