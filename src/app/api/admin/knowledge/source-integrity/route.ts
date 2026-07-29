import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { CITATIONS } from "@/features/knowledge/content/citations";
import { KEP1_SOURCES } from "@/features/knowledge/expansion/kep1SourceDossiers";
import { buildKnowledgeSourceIntegrityReport } from "@/features/knowledge/expansion/sourceIntegrity";

export const dynamic = "force-dynamic";

const AS_OF_DATE = "2026-07-29";

function response(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      Vary: "Cookie",
    },
  });
}

export async function GET(request: NextRequest) {
  const auth = await authorizeRequest(
    request,
    "knowledge.expansion.manage",
    "KNOWLEDGE_SOURCE_INTEGRITY"
  );
  if (!auth.authorized) return auth.response;

  try {
    return response({
      ok: true,
      report: buildKnowledgeSourceIntegrityReport({
        citations: CITATIONS,
        sources: KEP1_SOURCES,
        asOfDate: AS_OF_DATE,
      }),
    });
  } catch {
    return response(
      {
        ok: false,
        error: { code: "SOURCE_INTEGRITY_REPORT_READ_FAILED" },
      },
      500
    );
  }
}
