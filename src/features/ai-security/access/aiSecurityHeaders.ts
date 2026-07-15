import { NextResponse } from "next/server";

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const lowerOrigin = origin.toLowerCase().trim();
    // Parse URL and normalize to origin (scheme + host + port)
    const normalizedOrigin = new URL(lowerOrigin).origin;

    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "http://localhost:3000,https://homeo.healthcare,https://www.homeo.healthcare";
    const allowedOrigins = allowedOriginsEnv.split(",").map(o => {
      try {
        return new URL(o.trim().toLowerCase()).origin;
      } catch {
        return o.trim().toLowerCase();
      }
    });

    return allowedOrigins.includes(normalizedOrigin);
  } catch {
    return false;
  }
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = isOriginAllowed(origin);
  if (!allowed) {
    // If not allowed, return safe baseline headers omitting Access-Control-Allow-Origin
    return {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
      "Access-Control-Allow-Credentials": "true",
      "Vary": "Origin"
    };
  }

  return {
    "Access-Control-Allow-Origin": origin!,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin"
  };
}

export function handleOptionsRequest(origin: string | null): NextResponse {
  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, {
      status: 403,
      // Omit Access-Control-Allow-Origin entirely
      headers: {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin"
      }
    });
  }
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin)
  });
}
