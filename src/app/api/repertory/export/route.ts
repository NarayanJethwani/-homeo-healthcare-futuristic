/**
 * route.ts — Next.js App Router route for /api/repertory/export
 *
 * Only exports valid Next.js route fields (GET, POST, dynamic, runtime).
 * All handler logic lives in ./handlers.ts so tests can import the factory
 * functions without triggering Next.js route export validation errors.
 */

import "server-only";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createExportGetHandler, createExportPostHandler } from "./handlers";
import { ImportExportService } from "@/features/repertory/import-export/importExportService";
import { resolveDoctorRepertoryEntitlement } from "@/features/repertory/access/DoctorEntitlementRepository";
import { runClinicianSessionExport } from "@/features/repertory/export/RepertorySessionExportService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ─── Production GET handler ───────────────────────────────────────────────────
//
// Corpus export is an ADMINISTRATIVE operation.
// Uses authorizeRequest with 'repertory.export.json' (RBAC).
// That permission is granted to super-admin only — the normalised role for
// 'doctor' (read-only-admin) does NOT have it, so doctors are blocked.

const _get = createExportGetHandler({
  authorize: async (req) => {
    // authorizeRequest lives in server-only apiAuth; dynamic import keeps
    // it out of the testable handlers.ts type boundary.
    const { authorizeRequest } = await import("@/lib/security/apiAuth");
    const result = await authorizeRequest(
      req,
      "repertory.export.json",
      "repertory/export-corpus",
    );
    if (!result.authorized) return result;
    return { authorized: true as const, session: { uid: result.session.uid } };
  },
  exportToJSON:         () => ImportExportService.exportToJSON(),
  exportToCSV:          () => ImportExportService.exportToCSV(),
  exportToMDX:          () => ImportExportService.exportToMDX(),
  exportToGraphTriples: () => ImportExportService.exportToGraphTriples(),
});

// ─── Production POST handler ──────────────────────────────────────────────────
//
// Clinician session export — doctor entitlement path.
// Uses real Firestore sessionRepo, real patient access checker, real rate limiter.

const _post = createExportPostHandler({
  authorize: async (req) => {
    // authorizeRepertoryExportRequest enforces doctor entitlement + export-json capability.
    // Using repertory.repertorize here would allow doctors without export-json to reach this endpoint.
    const { authorizeRepertoryExportRequest } = await import(
      "@/features/repertory/access/RepertoryRequestAuthorization"
    );
    return authorizeRepertoryExportRequest(req, "repertory/export-session");
  },
  rateLimit: (uid) => {
    // Synchronous in-memory rate limiter — safe to require() at call time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { consumeRepertoryRateLimit } = require(
      "@/features/repertory/security/RepertoryApiSecurity",
    ) as typeof import("@/features/repertory/security/RepertoryApiSecurity");
    return consumeRepertoryRateLimit("export", uid, { maxRequests: 10, windowMs: 60_000 });
  },
  resolveEntitlement: (uid) => resolveDoctorRepertoryEntitlement(uid),
  runExport: runClinicianSessionExport,
  sessionRepo: {
    getById: async (id) => {
      const { getAdminDb } = await import("@/lib/firebaseAdmin");
      const db = getAdminDb();
      if (!db) return null;
      const snap = await db.collection("repertorization_sessions").doc(id).get();
      return snap.exists ? (snap.data() ?? null) : null;
    },
  },
  patientAccess: {
    check: async (patientId, doctorUid, clinicId) => {
      const { checkExportPatientAccess } = await import(
        "@/features/repertory/access/RepertoryExportPatientAccessChecker"
      );
      return checkExportPatientAccess(patientId, doctorUid, clinicId);
    },
  },
  idGenerator: () => randomUUID(),
  now: () => new Date(),
});

// ─── Next.js route exports ────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  return _get(request);
}

export async function POST(request: NextRequest) {
  return _post(request);
}
