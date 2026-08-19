import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchPubMedLiterature } from "@/features/medical-academy/server/pubmedLiteratureService";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  query: z.string().trim().min(2).max(240),
  studyType: z.enum(["any", "systematic-review", "randomized-trial", "guideline", "review"]).default("any"),
}).strict();

function response(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response({ success: false, error: "Same-origin request required." }, 403);
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return response({ success: false, error: "Enter a literature query between 2 and 240 characters." }, 400);
  }
  try {
    const result = await searchPubMedLiterature(parsed.data.query, fetch, parsed.data.studyType);
    return response({
      success: true,
      ...result,
      source: {
        name: "PubMed",
        publisher: "U.S. National Library of Medicine",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        disclaimerUrl: "https://www.ncbi.nlm.nih.gov/home/about/policies/",
      },
    });
  } catch {
    return response({
      success: false,
      error: "PubMed could not be reached safely. No literature results were generated.",
    }, 503);
  }
}
