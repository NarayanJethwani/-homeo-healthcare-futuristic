if (typeof window !== "undefined") {
  throw new Error("This module cannot be imported from a Client Component.");
}
import crypto from "crypto";
import { secureCursorPayloadSchema } from "./cursor.schema";
import { CursorCodec, ExpectedCursorContext, SecureCursorPayload } from "./cursor.types";
import { CursorException } from "./cursorErrors";

function getCursorSigningKey(keyId: string, customKeys?: Record<string, string>): Buffer {
  if (customKeys) {
    if (customKeys[keyId]) {
      return Buffer.from(customKeys[keyId], "utf8");
    }
    throw new Error("Key not found in custom registry.");
  }

  const value = process.env.CURSOR_SIGNING_SECRET;

  if (!value) {
    if (process.env.NODE_ENV === "test") {
      throw new Error("Tests must inject an explicit cursor signing key.");
    }
    throw new Error("CURSOR_SIGNING_SECRET is required.");
  }

  return Buffer.from(value, "utf8");
}

export function canonicalStringify(obj: any): string {
  if (typeof obj !== "object" || obj === null) {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalStringify).join(",") + "]";
  }
  const keys = Object.keys(obj).sort();
  const properties = keys.map(key => `${JSON.stringify(key)}:${canonicalStringify(obj[key])}`);
  return "{" + properties.join(",") + "}";
}

export function base64urlEncode(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

export class HmacCursorCodec implements CursorCodec {
  private activeKeyId: string;
  private customKeys?: Record<string, string>;
  private ttlMs: number;

  constructor(activeKeyId: string = "v1", customKeys?: Record<string, string>, ttlMs: number = 30 * 60 * 1000) {
    this.activeKeyId = activeKeyId;
    this.customKeys = customKeys;
    this.ttlMs = ttlMs;
  }

  encode(payloadInput: Omit<SecureCursorPayload, "version" | "keyId" | "issuedAt" | "expiresAt">): string {
    const now = Date.now();
    const payload: SecureCursorPayload = {
      ...payloadInput,
      version: 1,
      keyId: this.activeKeyId,
      issuedAt: now,
      expiresAt: now + this.ttlMs
    };

    // Zod Validation before signing
    const parsed = secureCursorPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new CursorException("CURSOR_MALFORMED", `Invalid payload before encode: ${parsed.error.message}`);
    }

    const payloadStr = canonicalStringify(payload);
    const key = getCursorSigningKey(this.activeKeyId, this.customKeys);
    const signature = crypto.createHmac("sha256", key).update(payloadStr).digest("hex");

    const envelope = {
      p: payloadStr,
      s: signature
    };

    return base64urlEncode(JSON.stringify(envelope));
  }

  decode(cursor: string, expected: ExpectedCursorContext): SecureCursorPayload {
    let envelopeStr: string;
    try {
      envelopeStr = base64urlDecode(cursor);
    } catch {
      throw new CursorException("CURSOR_MALFORMED", "Cursor encoding is not valid Base64URL.");
    }

    let envelope: any;
    try {
      envelope = JSON.parse(envelopeStr);
    } catch {
      throw new CursorException("CURSOR_MALFORMED", "Cursor envelope JSON is invalid.");
    }

    if (!envelope || typeof envelope.p !== "string" || typeof envelope.s !== "string") {
      throw new CursorException("CURSOR_MALFORMED", "Cursor envelope properties missing.");
    }

    let payload: SecureCursorPayload;
    try {
      payload = JSON.parse(envelope.p);
    } catch {
      throw new CursorException("CURSOR_MALFORMED", "Cursor payload JSON is invalid.");
    }

    // Zod Validation after decoding
    const parsed = secureCursorPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new CursorException("CURSOR_MALFORMED", `Parsed payload invalid: ${parsed.error.message}`);
    }

    // Key verification
    let key: Buffer;
    try {
      key = getCursorSigningKey(payload.keyId, this.customKeys);
    } catch (e: any) {
      if (e.message.includes("CURSOR_SIGNING_SECRET")) {
        throw e;
      }
      throw new CursorException("CURSOR_KEY_UNKNOWN", `Signature key ${payload.keyId} is unknown or retired.`);
    }

    // Timing-safe signature verification
    const expectedSignature = crypto.createHmac("sha256", key).update(envelope.p).digest("hex");
    const sigA = Buffer.from(envelope.s, "hex");
    const sigB = Buffer.from(expectedSignature, "hex");

    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      throw new CursorException("CURSOR_SIGNATURE_INVALID", "Cursor signature verification failed.");
    }

    // Validate timestamps & Clock skew (allowed skew = 60 seconds)
    const now = Date.now();
    const clockSkew = 60 * 1000;
    if (payload.issuedAt > now + clockSkew) {
      throw new CursorException("CURSOR_MALFORMED", "Cursor issued in the future.");
    }
    if (payload.expiresAt < now) {
      throw new CursorException("CURSOR_EXPIRED", "Cursor has expired.");
    }
    if (payload.expiresAt <= payload.issuedAt) {
      throw new CursorException("CURSOR_MALFORMED", "Invalid expiration bound.");
    }

    // Bindings check
    if (payload.purpose !== expected.purpose) {
      throw new CursorException("CURSOR_PURPOSE_MISMATCH", "Cursor purpose mismatch.");
    }
    if (payload.organizationId !== expected.organizationId) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor bound to a different organization.");
    }
    if (payload.accessFingerprint !== expected.accessFingerprint) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor bound to a different access fingerprint.");
    }
    if (expected.sourceId && payload.sourceId !== expected.sourceId) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor sourceId mismatch.");
    }
    if (expected.editionId && payload.editionId !== expected.editionId) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor editionId mismatch.");
    }
    if (expected.chapterId && payload.chapterId !== expected.chapterId) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor chapterId mismatch.");
    }
    if (expected.queryHash && payload.queryHash !== expected.queryHash) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor queryHash mismatch.");
    }
    if (expected.filterHash && payload.filterHash !== expected.filterHash) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor filterHash mismatch.");
    }
    if (payload.corpusVersion !== expected.corpusVersion) {
      throw new CursorException("CURSOR_STALE", "Cursor bound to a different corpus version.");
    }
    if (expected.searchIndexVersion && payload.searchIndexVersion !== expected.searchIndexVersion) {
      throw new CursorException("CURSOR_STALE", "Cursor bound to a different search index version.");
    }
    if (expected.synonymRegistryVersion && payload.synonymRegistryVersion !== expected.synonymRegistryVersion) {
      throw new CursorException("CURSOR_STALE", "Cursor bound to a different synonym registry version.");
    }
    if (payload.limit !== expected.limit) {
      throw new CursorException("CURSOR_CONTEXT_MISMATCH", "Cursor limit mismatch.");
    }

    return payload;
  }
}

export function generateAccessFingerprint(
  orgId: string,
  allowedEditions: string[],
  userRole: string,
  flags: string[]
): string {
  const sortedEditions = [...allowedEditions].sort();
  const sortedFlags = [...flags].sort();
  const raw = [orgId, sortedEditions.join(","), userRole, sortedFlags.join(",")].join("|");
  return crypto.createHash("sha256").update(raw).digest("hex");
}
