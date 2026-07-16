import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { isOriginAllowed, getCorsHeaders, handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";
import { consumeRepertoryRateLimit, rateLimitResponse, readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SAFE_IDENTIFIER = /^[a-zA-Z0-9_\-.:]+$/;

const saveSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("save"),
    rubricData: z.object({
      id: z.string().max(100).optional(),
      name: z.string().min(3).max(100),
      description: z.string().max(200).optional(),
      category: z.string().max(50).optional(),
      subcategory: z.string().max(50).optional(),
      organSystem: z.string().max(50).optional(),
      clinicalPriority: z.enum(["low", "medium", "high"]).optional(),
      remedies: z.record(z.string().max(30), z.number().min(1).max(4)).optional(),
      researchCitation: z.object({
        source: z.string().max(100).optional(),
        detail: z.string().max(500).optional(),
      }).strict().optional(),
      keywords: z.array(z.string().max(30)).max(20).optional(),
      synonyms: z.array(z.string().max(100)).max(20).optional(),
      miasms: z.array(z.string().max(30)).max(5).optional(),
    }).strict(),
  }).strict(),
  z.object({
    action: z.literal("merge"),
    mergeData: z.object({
      targetName: z.string().min(3).max(100),
      sourceIds: z.array(z.string().max(100)).min(1).max(20),
      category: z.string().max(50).optional(),
    }).strict(),
  }).strict(),
  z.object({
    action: z.literal("clone"),
    cloneData: z.object({
      sourceId: z.string().max(100),
      newName: z.string().min(3).max(100),
    }).strict(),
  }).strict(),
]);

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferOrganSystem(name: string): string {
  const text = name.toLowerCase();
  if (text.includes("heart") || text.includes("pulse") || text.includes("hypertension") || text.includes("circulation")) return "Cardiovascular";
  if (text.includes("stomach") || text.includes("gerd") || text.includes("ibs") || text.includes("gastric") || text.includes("acidity") || text.includes("bloating")) return "Gastrointestinal";
  if (text.includes("asthma") || text.includes("respiratory") || text.includes("cough") || text.includes("sinusitis") || text.includes("rhinitis") || text.includes("bronchial")) return "Respiratory";
  if (text.includes("eczema") || text.includes("skin") || text.includes("dermatitis") || text.includes("acne") || text.includes("psoriasis") || text.includes("urticaria") || text.includes("hives")) return "Skin / Integumentary";
  if (text.includes("thyroid") || text.includes("hypothyroidism") || text.includes("pcos") || text.includes("hormonal") || text.includes("metabolism") || text.includes("insulin")) return "Endocrine";
  if (text.includes("joint") || text.includes("arthritis") || text.includes("musculoskeletal") || text.includes("fibromyalgia") || text.includes("back") || text.includes("pain")) return "Musculoskeletal";
  if (text.includes("burnout") || text.includes("anxiety") || text.includes("panic") || text.includes("insomnia") || text.includes("sleep") || text.includes("mind") || text.includes("depression")) return "Psychology & Psychiatry";
  return "Generalities";
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin, "POST, OPTIONS");
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
    // 2. Admin Authorization (runs before consuming slot or reading body)
    const auth = await authorizeRequest(request, "repertory.review.correct", "REPERTORY_RUBRIC_SAVE");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 3. Rate Limiting
    const rateLimit = consumeRepertoryRateLimit("save_post", auth.session.uid, {
      maxRequests: 20,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) {
      const response = rateLimitResponse(rateLimit.retryAfterSeconds);
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 4. Secure stream-bound request body reading (10KB limit)
    let rawBody = "";
    try {
      rawBody = await readAndBoundRequestBody(request, 10 * 1024);
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
    const parsed = saveSchema.safeParse(parsedJson);
    if (!parsed.success) {
      const response = NextResponse.json({ success: false, message: "Invalid payload schema." }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const data = parsed.data;
    const rubricsRef = getAdminDb().collection("rubrics");

    if (data.action === "save") {
      const { rubricData } = data;

      // Safe identifier check
      if (rubricData.id && !SAFE_IDENTIFIER.test(rubricData.id)) {
        const response = NextResponse.json({ success: false, message: "Invalid ID format." }, { status: 400 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }

      const id = rubricData.id || `custom_${generateSlug(rubricData.name)}_${Date.now()}`;
      const slug = generateSlug(rubricData.name);
      const words: string[] = rubricData.name.toLowerCase().split(/[\s,\.\-_]+/);

      // Overwrite safety check: standard published rubrics cannot be overwritten
      const docSnap = await rubricsRef.doc(id).get();
      if (docSnap.exists) {
        const existingData = docSnap.data();
        if (existingData?.status !== "custom") {
          const response = NextResponse.json({ success: false, message: "Standard published rubrics cannot be modified." }, { status: 403 });
          Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
          response.headers.set("Cache-Control", "no-store");
          return response;
        }
      }

      // Safe remedies key format check
      const remedies = rubricData.remedies || {};
      for (const remedyId of Object.keys(remedies)) {
        if (!SAFE_IDENTIFIER.test(remedyId)) {
          const response = NextResponse.json({ success: false, message: "Invalid remedy identifier format." }, { status: 400 });
          Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
          response.headers.set("Cache-Control", "no-store");
          return response;
        }
      }

      const rubric = {
        id,
        name: rubricData.name,
        slug,
        parentRubricId: null,
        description: rubricData.description || "",
        category: rubricData.category || "Custom Rubrics",
        subcategory: rubricData.subcategory || "Personal",
        organSystem: rubricData.organSystem || inferOrganSystem(rubricData.name),
        clinicalPriority: rubricData.clinicalPriority || "medium",
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        status: "custom", // Server forced
        searchWeight: 1.0,
        remedies,
        indexWeights: {},
        researchCitation: rubricData.researchCitation || null,
        keywords: rubricData.keywords || Array.from(new Set(words.filter(w => w.length > 3))),
        synonyms: rubricData.synonyms || [],
        clinicalConditions: [],
        modalities: [],
        miasms: rubricData.miasms || []
      };

      await rubricsRef.doc(id).set(rubric);

      const response = NextResponse.json({
        success: true,
        message: "Rubric saved successfully.",
        rubric
      });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    if (data.action === "merge") {
      const { mergeData } = data;
      const { targetName, sourceIds, category = "Merged Rubrics" } = mergeData;

      // Validate sourceIds format
      for (const sid of sourceIds) {
        if (!SAFE_IDENTIFIER.test(sid)) {
          const response = NextResponse.json({ success: false, message: "Invalid source rubric ID format." }, { status: 400 });
          Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
          response.headers.set("Cache-Control", "no-store");
          return response;
        }
      }

      const sourceRubrics: any[] = [];
      for (const sid of sourceIds) {
        const docSnap = await rubricsRef.doc(sid).get();
        if (docSnap.exists) {
          sourceRubrics.push(docSnap.data());
        }
      }

      if (sourceRubrics.length === 0) {
        const response = NextResponse.json({ success: false, message: "No source rubrics found." }, { status: 404 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }

      const combinedRemedies: Record<string, number> = {};
      const combinedKeywords: string[] = [];
      const combinedSynonyms: string[] = [];

      sourceRubrics.forEach(sr => {
        if (sr.remedies) {
          Object.entries(sr.remedies).forEach(([remedy, grade]) => {
            if (SAFE_IDENTIFIER.test(remedy)) {
              combinedRemedies[remedy] = Math.max(combinedRemedies[remedy] || 0, grade as number);
            }
          });
        }
        if (sr.keywords) combinedKeywords.push(...sr.keywords);
        if (sr.synonyms) combinedSynonyms.push(...sr.synonyms);
        combinedSynonyms.push(sr.name);
      });

      const id = `custom_merged_${generateSlug(targetName)}_${Date.now()}`;
      const slug = generateSlug(targetName);
      const words: string[] = targetName.toLowerCase().split(/[\s,\.\-_]+/);

      const rubric = {
        id,
        name: targetName,
        slug,
        parentRubricId: null,
        description: `Merged clinical rubric`,
        category,
        subcategory: "Merged",
        organSystem: inferOrganSystem(targetName),
        clinicalPriority: "medium",
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        status: "custom",
        searchWeight: 1.0,
        remedies: combinedRemedies,
        indexWeights: {},
        keywords: Array.from(new Set(combinedKeywords.concat(words.filter(w => w.length > 3)))),
        synonyms: Array.from(new Set(combinedSynonyms)),
        clinicalConditions: [],
        modalities: [],
        miasms: []
      };

      await rubricsRef.doc(id).set(rubric);

      const response = NextResponse.json({
        success: true,
        message: "Rubrics merged successfully.",
        rubric
      });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    if (data.action === "clone") {
      const { cloneData } = data;
      const { sourceId, newName } = cloneData;

      if (!SAFE_IDENTIFIER.test(sourceId)) {
        const response = NextResponse.json({ success: false, message: "Invalid source rubric ID format." }, { status: 400 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }

      const docSnap = await rubricsRef.doc(sourceId).get();
      if (!docSnap.exists) {
        const response = NextResponse.json({ success: false, message: "Source rubric not found." }, { status: 404 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }

      const source = docSnap.data();
      const id = `custom_${generateSlug(newName)}_${Date.now()}`;
      const slug = generateSlug(newName);
      const words: string[] = newName.toLowerCase().split(/[\s,\.\-_]+/);

      const rubric = {
        ...source,
        id,
        name: newName,
        slug,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        status: "custom",
        keywords: Array.from(new Set((source?.keywords || []).concat(words.filter(w => w.length > 3))))
      };

      await rubricsRef.doc(id).set(rubric);

      const response = NextResponse.json({
        success: true,
        message: "Rubric cloned successfully.",
        rubric
      });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    const response = NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    // Audit failure without leaking exception details to logs or clients
    console.error("Repertory Save API failed. Details redacted.");

    const response = NextResponse.json({
      success: false,
      message: "An internal server error occurred while performing the save action."
    }, { status: 500 });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
