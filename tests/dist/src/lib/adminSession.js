"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_SESSION_COOKIE = void 0;
exports.createAdminSessionCookie = createAdminSessionCookie;
exports.verifyAdminSessionCookie = verifyAdminSessionCookie;
exports.ADMIN_SESSION_COOKIE = "hh_admin_session_v3";
function getSessionSecret() {
    let secret = process.env.ADMIN_SESSION_SECRET ||
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
        (process.env.NODE_ENV !== "production" ? "homeo-healthcare-dev-session-secret" : "");
    secret = secret.trim();
    if ((secret.startsWith("'") && secret.endsWith("'")) ||
        (secret.startsWith('"') && secret.endsWith('"'))) {
        secret = secret.slice(1, -1);
    }
    return secret.trim();
}
function base64UrlEncode(input) {
    return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64UrlDecodeToBinary(input) {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
    return atob(padded);
}
function encodeJsonPayload(payload) {
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    return bytesToBase64Url(bytes);
}
function decodeJsonPayload(input) {
    const binary = base64UrlDecodeToBinary(input);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}
function bytesToBase64Url(bytes) {
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return base64UrlEncode(binary);
}
async function sign(value) {
    const secret = getSessionSecret();
    if (!secret) {
        throw new Error("ADMIN_SESSION_SECRET is required for admin sessions.");
    }
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
    return bytesToBase64Url(new Uint8Array(signature));
}
function timingSafeEqual(a, b) {
    if (a.length !== b.length)
        return false;
    let result = 0;
    for (let i = 0; i < a.length; i += 1) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
async function createAdminSessionCookie(payload) {
    const encodedPayload = encodeJsonPayload(payload);
    const signature = await sign(encodedPayload);
    return `${encodedPayload}.${signature}`;
}
async function verifyAdminSessionCookie(cookieValue) {
    if (!cookieValue) {
        console.log("[verifyAdminSessionCookie] No cookie value provided");
        return null;
    }
    const parts = cookieValue.split(".");
    if (parts.length !== 2) {
        console.log(`[verifyAdminSessionCookie] Cookie format invalid. Expected 2 parts, got ${parts.length}`);
        return null;
    }
    const [encodedPayload, signature] = parts;
    try {
        const expectedSignature = await sign(encodedPayload);
        const signatureMatch = timingSafeEqual(signature, expectedSignature);
        console.log(`[verifyAdminSessionCookie] Signature match: ${signatureMatch}. Got signature: ${signature}, Expected signature: ${expectedSignature}`);
        if (!signatureMatch)
            return null;
        const payload = decodeJsonPayload(encodedPayload);
        console.log(`[verifyAdminSessionCookie] Decoded payload: ${JSON.stringify(payload)}`);
        const now = Math.floor(Date.now() / 1000);
        const hasExpired = payload.exp <= now;
        console.log(`[verifyAdminSessionCookie] Expiry check: exp = ${payload.exp}, now = ${now}, hasExpired = ${hasExpired}`);
        if (!payload.uid || !payload.role || !payload.exp)
            return null;
        if (hasExpired)
            return null;
        return payload;
    }
    catch (err) {
        console.log(`[verifyAdminSessionCookie] Verification error: ${err?.message || err}`);
        return null;
    }
}
