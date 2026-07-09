"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseIdToken = verifyFirebaseIdToken;
let cachedJwks = null;
let cachedJwksExpiry = 0;
function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
        base64 += "=";
    }
    return atob(base64);
}
function base64UrlDecodeToBytes(str) {
    const binary = base64UrlDecode(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
async function getJwks() {
    const now = Date.now();
    if (cachedJwks && now < cachedJwksExpiry) {
        return cachedJwks;
    }
    const res = await fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com");
    if (!res.ok) {
        throw new Error("Failed to fetch Google JWKS public keys.");
    }
    const data = await res.json();
    cachedJwks = data;
    const cacheControl = res.headers.get("cache-control");
    let maxAge = 6 * 60 * 60; // fallback to 6 hours
    if (cacheControl) {
        const match = cacheControl.match(/max-age=(\d+)/);
        if (match) {
            maxAge = parseInt(match[1], 10);
        }
    }
    cachedJwksExpiry = now + maxAge * 1000;
    return data;
}
async function verifyFirebaseIdToken(idToken) {
    const parts = idToken.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid JWT token format.");
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    // 1. Decode header and payload
    let header;
    let payload;
    try {
        header = JSON.parse(base64UrlDecode(headerB64));
        payload = JSON.parse(base64UrlDecode(payloadB64));
    }
    catch (err) {
        throw new Error("Failed to parse JWT header or payload JSON: " + err.message);
    }
    // 2. Validate header claims
    if (header.alg !== "RS256") {
        throw new Error(`Invalid JWT algorithm: expected RS256, got ${header.alg}`);
    }
    if (!header.kid) {
        throw new Error("Missing kid in JWT header.");
    }
    // 3. Validate payload claims
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId || projectId === "mock-project-id") {
        throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not configured.");
    }
    const expectedIssuer = `https://securetoken.google.com/${projectId}`;
    if (payload.iss !== expectedIssuer) {
        throw new Error(`Invalid token issuer: expected ${expectedIssuer}, got ${payload.iss}`);
    }
    if (payload.aud !== projectId) {
        throw new Error(`Invalid token audience (project ID): expected ${projectId}, got ${payload.aud}`);
    }
    const now = Math.floor(Date.now() / 1000);
    const skew = 300; // allow 5 minutes clock skew
    if (payload.exp <= now - skew) {
        throw new Error("Firebase ID token has expired.");
    }
    if (payload.iat > now + skew) {
        throw new Error("Firebase ID token issued in the future.");
    }
    if (typeof payload.sub !== "string" || !payload.sub) {
        throw new Error("Firebase ID token missing subject (uid) claim.");
    }
    // 4. Retrieve JWK key matching the token's kid
    const jwks = await getJwks();
    const jwk = jwks.keys.find((key) => key.kid === header.kid);
    if (!jwk) {
        throw new Error(`Google public key not found for kid: ${header.kid}`);
    }
    // 5. Import key into Web Crypto
    const publicKey = await crypto.subtle.importKey("jwk", jwk, {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
    }, false, ["verify"]);
    // 6. Verify signature
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlDecodeToBytes(signatureB64);
    const isSignatureValid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signatureBytes, data);
    if (!isSignatureValid) {
        throw new Error("Firebase ID token signature verification failed.");
    }
    return {
        uid: payload.sub,
        email: payload.email,
        name: payload.name,
        ...payload,
    };
}
