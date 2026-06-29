export const PATIENT_SESSION_COOKIE = "hh_patient_session";

export type PatientSessionPayload = {
  uid: string;
  email?: string | null;
  role: "patient";
  patientId?: string;
  name?: string;
  exp: number;
};

function getSessionSecret() {
  const secret =
    process.env.PATIENT_SESSION_SECRET ||
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    (process.env.NODE_ENV !== "production" ? "homeo-healthcare-dev-patient-session-secret" : "");

  return secret.trim();
}

function base64UrlEncode(input: string) {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToBinary(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  return atob(padded);
}

function encodeJsonPayload(payload: PatientSessionPayload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return bytesToBase64Url(bytes);
}

function decodeJsonPayload(input: string) {
  const binary = base64UrlDecodeToBinary(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as PatientSessionPayload;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return base64UrlEncode(binary);
}

async function sign(value: string) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("PATIENT_SESSION_SECRET is required for patient sessions.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createPatientSessionCookie(payload: PatientSessionPayload) {
  const encodedPayload = encodeJsonPayload(payload);
  const signature = await sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function verifyPatientSessionCookie(cookieValue?: string) {
  if (!cookieValue) return null;

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature) return null;

  try {
    const expectedSignature = await sign(encodedPayload);
    if (!timingSafeEqual(signature, expectedSignature)) return null;

    const payload = decodeJsonPayload(encodedPayload);
    if (!payload.uid || payload.role !== "patient" || !payload.exp) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
