import crypto from "crypto";
import { canonicalizeChecksumText } from "./checksum.shared";

export function computeSha256Server(text: string): string {
  const canonical = canonicalizeChecksumText(text);
  return crypto.createHash("sha256").update(canonical).digest("hex");
}
export default computeSha256Server;
