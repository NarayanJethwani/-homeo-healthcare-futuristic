import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { JETHWANI_REPERTORY_DATA, SEARCH_SYNONYMS } from "@/lib/repertoryData";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { isOriginAllowed, getCorsHeaders, handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";
import { consumeRepertoryRateLimit, rateLimitResponse, readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { z } from "zod";

export const dynamic = "force-dynamic";

const seedSchema = z.object({
  action: z.literal("seed_default"),
}).strict();

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferOrganSystem(name: string): string {
  const text = name.toLowerCase();
  if (text.includes("heart") || text.includes("pulse") || text.includes("hypertension") || text.includes("circulation")) {
    return "Cardiovascular";
  }
  if (text.includes("stomach") || text.includes("gerd") || text.includes("ibs") || text.includes("gastric") || text.includes("acidity") || text.includes("bloating")) {
    return "Gastrointestinal";
  }
  if (text.includes("asthma") || text.includes("respiratory") || text.includes("cough") || text.includes("sinusitis") || text.includes("rhinitis") || text.includes("bronchial")) {
    return "Respiratory";
  }
  if (text.includes("eczema") || text.includes("skin") || text.includes("dermatitis") || text.includes("acne") || text.includes("psoriasis") || text.includes("urticaria") || text.includes("hives")) {
    return "Skin / Integumentary";
  }
  if (text.includes("thyroid") || text.includes("hypothyroidism") || text.includes("pcos") || text.includes("hormonal") || text.includes("metabolism") || text.includes("insulin")) {
    return "Endocrine";
  }
  if (text.includes("joint") || text.includes("arthritis") || text.includes("musculoskeletal") || text.includes("fibromyalgia") || text.includes("back") || text.includes("pain")) {
    return "Musculoskeletal";
  }
  if (text.includes("burnout") || text.includes("anxiety") || text.includes("panic") || text.includes("insomnia") || text.includes("sleep") || text.includes("mind") || text.includes("depression")) {
    return "Psychology & Psychiatry";
  }
  return "Generalities";
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin, "POST, OPTIONS");
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ ok: false, error: { code: "METHOD_NOT_ALLOWED", message: "GET not allowed on this endpoint" } }, { status: 405 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  // 1. Exact-Origin check
  if (!isOriginAllowed(origin)) {
    const response = NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Disallowed Origin" } }, { status: 403 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const corsHeaders = getCorsHeaders(origin, "POST, OPTIONS");

  try {
    // 2. Super-Admin Authorization
    const auth = await authorizeRequest(request, "repertory.snapshot.activate", "REPERTORY_DATABASE_SEED");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 3. Seeding configuration gate check
    if (process.env.REPERTORY_SEEDING_ENABLED !== "true") {
      const response = NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Seeding is disabled in this environment." } }, { status: 403 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 4. Rate Limiting
    const rateLimit = consumeRepertoryRateLimit("seed_post", auth.session.uid, {
      maxRequests: 5,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) {
      const response = rateLimitResponse(rateLimit.retryAfterSeconds);
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 5. Secure stream-bound request body reading (1KB limit)
    let rawBody = "";
    try {
      rawBody = await readAndBoundRequestBody(request, 1024);
    } catch (err: any) {
      if (err.message === "PAYLOAD_TOO_LARGE") {
        const response = NextResponse.json({ ok: false, error: { code: "PAYLOAD_TOO_LARGE", message: "Payload too large" } }, { status: 413 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
      throw err;
    }

    const parsedJson = JSON.parse(rawBody);
    const parsed = seedSchema.safeParse(parsedJson);
    if (!parsed.success) {
      const response = NextResponse.json({ success: false, message: "Invalid payload schema." }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 6. Execute atomic seed check & writes inside transaction
    let rubricsSeeded = 0;
    let synonymsSeeded = 0;

    try {
      await getAdminDb().runTransaction(async (transaction: any) => {
        // Read 1: Marker document to check if already seeded
        const markerRef = getAdminDb().collection("system_config").doc("database_seeded_marker");
        const markerDoc = await transaction.get(markerRef);
        if (markerDoc.exists && markerDoc.data()?.seeded === true) {
          throw new Error("ALREADY_SEEDED");
        }

        // Read 2: Check standard rubric presence via limit(1) query
        const rubricsQuery = getAdminDb().collection("rubrics").limit(1);
        const rubricsSnap = await transaction.get(rubricsQuery);
        if (!rubricsSnap.empty) {
          throw new Error("ALREADY_SEEDED");
        }

        // Write 1: Set seeded marker document
        transaction.set(markerRef, { seeded: true, seededAt: new Date().toISOString() });

        // Write 2: Seed Rubrics
        const rubricsRef = getAdminDb().collection("rubrics");
        JETHWANI_REPERTORY_DATA.forEach(fr => {
          const docRef = rubricsRef.doc(fr.id);
          const words = fr.name.toLowerCase().split(/[\s,\.\-_]+/);

          const rubric = {
            id: fr.id,
            name: fr.name,
            slug: generateSlug(fr.name),
            parentRubricId: null,
            description: fr.researchCitation?.detail || "Dr. Jethwani's clinical indicator.",
            category: fr.section,
            subcategory: fr.name.split(",")[0] || fr.section,
            organSystem: inferOrganSystem(fr.name),
            clinicalPriority: fr.id.includes("burnout") || fr.id.includes("panic") || fr.id.includes("collapse") ? "high" : "medium",
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
            status: "active",
            searchWeight: 1.0,
            remedies: fr.remedies,
            indexWeights: fr.indexWeights || {},
            researchCitation: fr.researchCitation || null,
            keywords: Array.from(new Set(words.filter(w => w.length > 3))),
            synonyms: [],
            clinicalConditions: [],
            modalities: [],
            miasms: fr.id.includes("psora") ? ["Psora"] : fr.id.includes("sycosis") ? ["Sycosis"] : fr.id.includes("syphilis") ? ["Syphilis"] : [],
          };

          transaction.set(docRef, rubric);
          rubricsSeeded++;
        });

        // Write 3: Seed Synonyms
        const synonymsRef = getAdminDb().collection("synonyms");
        Object.entries(SEARCH_SYNONYMS).forEach(([word, synonyms]) => {
          const docRef = synonymsRef.doc(word);
          transaction.set(docRef, {
            word,
            synonyms,
          });
          synonymsSeeded++;
        });
      });
    } catch (e: any) {
      if (e.message === "ALREADY_SEEDED") {
        const response = NextResponse.json({ success: false, message: "Database already seeded. Seeding aborted." }, { status: 409 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
      throw e;
    }

    const response = NextResponse.json({
      success: true,
      message: "Database seeded successfully.",
      rubricsSeeded,
      synonymsSeeded,
    });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error: any) {
    console.error("Database seeding failed. Details redacted.");

    const response = NextResponse.json({
      success: false,
      message: "Database seeding failed."
    }, { status: 500 });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
