/**
 * handlers.ts — Dependency-injected factory functions for the repertory export route.
 *
 * This file is intentionally separate from route.ts so that the factory
 * functions can be imported by tests without Next.js treating them as
 * invalid route export fields.
 */

import { NextRequest, NextResponse } from "next/server";
import type { DoctorRepertoryEntitlement } from "@/features/repertory/access/DoctorEntitlementService";
import type {
  AuthorizedRepertoryRequest,
  DeniedRepertoryRequest,
} from "@/features/repertory/access/RepertoryRequestAuthorization";
import {
  runClinicianSessionExport,
  type ExportServiceDeps,
} from "@/features/repertory/export/RepertorySessionExportService";

// ─── Shared constants ─────────────────────────────────────────────────────────

const MAX_BODY_BYTES = 4096;
const VALID_GET_TYPES = ["json", "csv", "mdx", "triples"] as const;
type ExportType = (typeof VALID_GET_TYPES)[number];

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store");
  return res;
}

// ─── GET handler factory ──────────────────────────────────────────────────────

export type ExportGetDeps = {
  authorize(req: NextRequest): Promise<
    | { authorized: true; session: { uid: string } }
    | { authorized: false; response: NextResponse }
  >;
  exportToJSON(): Promise<string>;
  exportToCSV(): Promise<string>;
  exportToMDX(): Promise<string>;
  exportToGraphTriples(): Promise<string>;
};

export function createExportGetHandler(deps: ExportGetDeps) {
  return async function handleGet(req: NextRequest): Promise<NextResponse> {
    // 1. Auth
    const auth = await deps.authorize(req);
    if (!auth.authorized) return noStore(auth.response);

    // 2. Validate ?type param
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    if (!type || !VALID_GET_TYPES.includes(type as ExportType)) {
      return noStore(
        NextResponse.json(
          {
            ok: false,
            error: {
              code: "INVALID_TYPE",
              message: "type must be one of: json, csv, mdx, triples",
            },
          },
          { status: 400 },
        ),
      );
    }

    // 3. Run export
    let content: string;
    switch (type as ExportType) {
      case "json":    content = await deps.exportToJSON(); break;
      case "csv":     content = await deps.exportToCSV(); break;
      case "mdx":     content = await deps.exportToMDX(); break;
      case "triples": content = await deps.exportToGraphTriples(); break;
    }

    return noStore(
      NextResponse.json({ success: true, content }, { headers: { "Cache-Control": "no-store" } }),
    );
  };
}

// ─── POST handler factory ─────────────────────────────────────────────────────

export type ExportPostDeps = {
  authorize(req: NextRequest): Promise<AuthorizedRepertoryRequest | DeniedRepertoryRequest>;
  rateLimit(uid: string): { allowed: true } | { allowed: false; retryAfterSeconds?: number };
  resolveEntitlement(uid: string): Promise<DoctorRepertoryEntitlement | null>;
  runExport(
    sessionId: string,
    entitlement: DoctorRepertoryEntitlement,
    deps: ExportServiceDeps,
  ): ReturnType<typeof runClinicianSessionExport>;
  sessionRepo: ExportServiceDeps["sessionRepo"];
  patientAccess: ExportServiceDeps["patientAccess"];
  idGenerator(): string;
  now(): Date;
};

export function createExportPostHandler(deps: ExportPostDeps) {
  return async function handlePost(req: NextRequest): Promise<NextResponse> {
    // 1. Auth
    const auth = await deps.authorize(req);
    if (!auth.authorized) return noStore(auth.response);

    const uid = auth.session.uid;

    // 2. Rate limit
    const limit = deps.rateLimit(uid);
    if (!limit.allowed) {
      const retryAfter = (limit as { allowed: false; retryAfterSeconds?: number }).retryAfterSeconds;
      const headers: Record<string, string> = { "Cache-Control": "no-store" };
      if (retryAfter) headers["Retry-After"] = String(retryAfter);
      return NextResponse.json(
        { ok: false, error: { code: "RATE_LIMITED" } },
        { status: 429, headers },
      );
    }

    // 3. Read & size-check body
    const rawText = await req.text();
    if (new TextEncoder().encode(rawText).byteLength > MAX_BODY_BYTES) {
      return noStore(
        NextResponse.json(
          { ok: false, error: { code: "PAYLOAD_TOO_LARGE" } },
          { status: 413 },
        ),
      );
    }

    // 4. Parse JSON
    let body: unknown;
    try {
      body = JSON.parse(rawText);
    } catch {
      return noStore(
        NextResponse.json(
          { ok: false, error: { code: "INVALID_JSON" } },
          { status: 400 },
        ),
      );
    }

    // 5. Validate body shape — exactly { sessionId: string }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return noStore(
        NextResponse.json(
          { ok: false, error: { code: "INVALID_INPUT" } },
          { status: 400 },
        ),
      );
    }
    const bodyObj = body as Record<string, unknown>;
    const keys = Object.keys(bodyObj);
    if (keys.length !== 1 || !("sessionId" in bodyObj)) {
      return noStore(
        NextResponse.json(
          { ok: false, error: { code: "INVALID_INPUT" } },
          { status: 400 },
        ),
      );
    }
    if (typeof bodyObj.sessionId !== "string" || bodyObj.sessionId.length === 0) {
      return noStore(
        NextResponse.json(
          { ok: false, error: { code: "INVALID_INPUT" } },
          { status: 400 },
        ),
      );
    }
    const sessionId = bodyObj.sessionId as string;

    // 6. Resolve entitlement
    const entitlement = await deps.resolveEntitlement(uid);
    const nowMs = deps.now().getTime();
    const isExpired = !entitlement || entitlement.status !== "active" ||
      (!!entitlement.expiresAt && new Date(entitlement.expiresAt).getTime() <= nowMs);
    if (!entitlement || isExpired || !entitlement.capabilities.includes("export-json")) {
      return noStore(
        NextResponse.json(
          { ok: false, error: { code: "FORBIDDEN" } },
          { status: 403 },
        ),
      );
    }

    // 7. Run export service
    const result = await deps.runExport(sessionId, entitlement, {
      sessionRepo:   deps.sessionRepo,
      patientAccess: deps.patientAccess,
      idGenerator:   deps.idGenerator,
      now:           deps.now,
    });

    if (!result.ok) {
      const statusMap: Record<string, number> = {
        NOT_FOUND:    404,
        FORBIDDEN:    403,
        PHI_DETECTED: 400,
        INTERNAL:     500,
      };
      return noStore(
        NextResponse.json(
          { ok: false, error: { code: result.code } },
          { status: statusMap[result.code] ?? 500 },
        ),
      );
    }

    return noStore(
      NextResponse.json(
        { ok: true, export: result.export },
        { headers: { "Cache-Control": "no-store" } },
      ),
    );
  };
}
