import assert from "assert";
import crypto from "crypto";
import { HmacCursorCodec, generateAccessFingerprint } from "../../src/server/repertory/cursor/HmacCursorCodec";
import { ExpectedCursorContext, SecureCursorPayload } from "../../src/server/repertory/cursor/cursor.types";
import { CursorException } from "../../src/server/repertory/cursor/cursorErrors";

export function runCursorTests() {
  console.log("▶ Running Repertory Secure Cursor Tests...");

  const testKeyId = "test-k1";
  const customKeys: Record<string, string> = {
    "test-k1": "my-extremely-secure-secret-key-12345!",
    "test-k2": "my-second-extremely-secure-secret-key-67890!"
  };

  const codec = new HmacCursorCodec(testKeyId, customKeys, 1000 * 60 * 30); // 30 min TTL

  const baseContext: ExpectedCursorContext = {
    purpose: "rubric_search",
    organizationId: "org1",
    accessFingerprint: generateAccessFingerprint("org1", ["kent_1908"], "clinician", ["flag1"]),
    queryHash: "qhash",
    filterHash: "fhash",
    corpusVersion: "v1.0.0",
    searchIndexVersion: "idx1",
    synonymRegistryVersion: "syn1",
    limit: 50
  };

  const basePayload: Omit<SecureCursorPayload, "version" | "keyId" | "issuedAt" | "expiresAt"> = {
    purpose: "rubric_search",
    organizationId: "org1",
    accessFingerprint: baseContext.accessFingerprint,
    queryHash: "qhash",
    filterHash: "fhash",
    corpusVersion: "v1.0.0",
    searchIndexVersion: "idx1",
    synonymRegistryVersion: "syn1",
    limit: 50,
    position: 10
  };

  // 1. Valid Round Trip
  const encoded = codec.encode(basePayload);
  assert.ok(encoded, "Cursor must encode successfully.");
  const decoded = codec.decode(encoded, baseContext);
  assert.strictEqual(decoded.position, 10, "Decoded position should match.");
  assert.strictEqual(decoded.keyId, testKeyId, "Key ID should match.");

  // 2. Tampered Payload
  assert.throws(() => {
    const envelope = JSON.parse(Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    const tamperedPayload = envelope.p.replace(`"position":10`, `"position":999`);
    const tamperedEnvelope = { p: tamperedPayload, s: envelope.s };
    const tamperedCursor = Buffer.from(JSON.stringify(tamperedEnvelope)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    codec.decode(tamperedCursor, baseContext);
  }, (err: any) => err.code === "CURSOR_SIGNATURE_INVALID", "Should reject tampered payload.");

  // 3. Tampered Signature
  assert.throws(() => {
    const envelope = JSON.parse(Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    const tamperedEnvelope = { p: envelope.p, s: "deadbeefdeadbeef" };
    const tamperedCursor = Buffer.from(JSON.stringify(tamperedEnvelope)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    codec.decode(tamperedCursor, baseContext);
  }, (err: any) => err.code === "CURSOR_SIGNATURE_INVALID", "Should reject tampered signature.");

  // 4. Truncated cursor
  assert.throws(() => {
    codec.decode(encoded.substring(0, 10), baseContext);
  }, (err: any) => err.code === "CURSOR_MALFORMED", "Should reject truncated cursor.");

  // 5. Invalid Base64URL characters
  assert.throws(() => {
    codec.decode("!!!invalid!!!", baseContext);
  }, (err: any) => err.code === "CURSOR_MALFORMED", "Should reject invalid Base64URL string.");

  // 6. Unknown fields in payload
  assert.throws(() => {
    const rawPayload = { ...basePayload, version: 1, keyId: testKeyId, issuedAt: Date.now(), expiresAt: Date.now() + 100000, hackerField: "bad" };
    const pStr = JSON.stringify(rawPayload);
    const key = Buffer.from(customKeys[testKeyId], "utf8");
    const sStr = crypto.createHmac("sha256", key).update(pStr).digest("hex");
    const badCursor = Buffer.from(JSON.stringify({ p: pStr, s: sStr })).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    codec.decode(badCursor, baseContext);
  }, (err: any) => err.code === "CURSOR_MALFORMED", "Zod should reject unknown fields.");

  // 7. Unsupported version
  assert.throws(() => {
    const rawPayload = { ...basePayload, version: 2, keyId: testKeyId, issuedAt: Date.now(), expiresAt: Date.now() + 100000 };
    const pStr = JSON.stringify(rawPayload);
    const key = Buffer.from(customKeys[testKeyId], "utf8");
    const sStr = crypto.createHmac("sha256", key).update(pStr).digest("hex");
    const badCursor = Buffer.from(JSON.stringify({ p: pStr, s: sStr })).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    codec.decode(badCursor, baseContext);
  }, (err: any) => err.code === "CURSOR_MALFORMED", "Should reject version !== 1.");

  // 8. Unknown key ID
  assert.throws(() => {
    const rawPayload = { ...basePayload, version: 1, keyId: "unknown-key", issuedAt: Date.now(), expiresAt: Date.now() + 100000 };
    const pStr = JSON.stringify(rawPayload);
    const badCursor = Buffer.from(JSON.stringify({ p: pStr, s: "dummy" })).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    codec.decode(badCursor, baseContext);
  }, (err: any) => err.code === "CURSOR_KEY_UNKNOWN", "Should reject unknown key ID.");

  // 9. Context parameter mismatch tests
  const mismatchParams: Array<{ field: keyof ExpectedCursorContext; value: any; code: string }> = [
    { field: "purpose", value: "chapter_page", code: "CURSOR_PURPOSE_MISMATCH" },
    { field: "organizationId", value: "org2", code: "CURSOR_CONTEXT_MISMATCH" },
    { field: "accessFingerprint", value: "wrong-fingerprint", code: "CURSOR_CONTEXT_MISMATCH" },
    { field: "queryHash", value: "another-q", code: "CURSOR_CONTEXT_MISMATCH" },
    { field: "filterHash", value: "another-f", code: "CURSOR_CONTEXT_MISMATCH" },
    { field: "corpusVersion", value: "v2.0.0", code: "CURSOR_STALE" },
    { field: "searchIndexVersion", value: "idx2", code: "CURSOR_STALE" },
    { field: "synonymRegistryVersion", value: "syn2", code: "CURSOR_STALE" },
    { field: "limit", value: 10, code: "CURSOR_CONTEXT_MISMATCH" }
  ];

  for (const item of mismatchParams) {
    assert.throws(() => {
      const ctx = { ...baseContext, [item.field]: item.value };
      codec.decode(encoded, ctx);
    }, (err: any) => err.code === item.code, `Should throw ${item.code} for mismatched field ${String(item.field)}.`);
  }

  // 10. Expired cursor
  const expiredCodec = new HmacCursorCodec(testKeyId, customKeys, -100);
  const expiredEncoded = expiredCodec.encode(basePayload);
  assert.throws(() => {
    codec.decode(expiredEncoded, baseContext);
  }, (err: any) => err.code === "CURSOR_EXPIRED", "Should reject expired cursor.");

  // 11. Future-issued cursor
  assert.throws(() => {
    const rawPayload = { ...basePayload, version: 1, keyId: testKeyId, issuedAt: Date.now() + 1000000, expiresAt: Date.now() + 2000000 };
    const pStr = JSON.stringify(rawPayload);
    const key = Buffer.from(customKeys[testKeyId], "utf8");
    const sStr = crypto.createHmac("sha256", key).update(pStr).digest("hex");
    const futureCursor = Buffer.from(JSON.stringify({ p: pStr, s: sStr })).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    codec.decode(futureCursor, baseContext);
  }, (err: any) => err.code === "CURSOR_MALFORMED", "Should reject future-issued cursor beyond clock skew.");

  // 12. Key Rotation verification using previous key
  const rotationCodec = new HmacCursorCodec("test-k2", customKeys, 1000 * 60);
  const newEncoded = rotationCodec.encode(basePayload);
  const decodedNew = codec.decode(newEncoded, baseContext);
  assert.strictEqual(decodedNew.keyId, "test-k2", "Should verify and decode test-k2 cursor successfully.");

  // 13. Test missing environment key checks
  const origSecret = process.env.CURSOR_SIGNING_SECRET;
  delete process.env.CURSOR_SIGNING_SECRET;
  const envCheckCodec = new HmacCursorCodec("v1", undefined, 1000 * 60);
  assert.throws(() => {
    envCheckCodec.encode(basePayload);
  }, (err: any) => err.message.includes("explicit cursor signing key") || err.message.includes("CURSOR_SIGNING_SECRET is required"), "Should fail when CURSOR_SIGNING_SECRET environment variable is missing.");
  process.env.CURSOR_SIGNING_SECRET = origSecret;

  console.log("✅ Repertory Secure Cursor Tests Passed");
}
