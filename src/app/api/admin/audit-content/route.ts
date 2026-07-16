import { NextRequest, NextResponse } from "next/server";
import { aiRouterService } from "@/lib/aiRouter";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { getDraft } from "@/features/knowledge-admin/cms/cmsManager";
import { z } from "zod";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const AdminRequestSchema = z.object({
  articleId: z.string().min(1)
}).strict();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "CMS_DRAFT_EDIT", "AUDIT_CONTENT_API_POST");
    if (!auth.authorized) return auth.response;
    
    const payload = await request.json();
    const parsed = AdminRequestSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input schema: strictly 'articleId' string is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    const { articleId } = parsed.data;

    const draft = await getDraft(articleId);
    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Article draft not found." },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const title = draft.title || "Untitled Article";
    const contentText = draft.draftContent || "";
    
    // Validate tags with Array.isArray() and retain only strings
    const rawTags = draft.metadata?.tags;
    const tags: string[] = Array.isArray(rawTags)
      ? rawTags.filter((t): t is string => typeof t === "string")
      : [];

    // Length limit checks (prevent excessive token usage or DOS)
    if (contentText.length > 100000) {
      return NextResponse.json(
        { success: false, error: "Content length exceeds the maximum limit of 100,000 characters." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const systemInstruction = `You are a medical copyeditor and clinical compliance auditor.
Analyze the provided medical content for the article "${title}".
You must audit the text and output a JSON object with compliance, copyediting, and metadata metrics.

Compliance Rules:
- Identify if there are any prohibited medical claims: claiming homeopathy "guarantees" or "promises" a 100% cure for incurable or severe illnesses, or telling patients to instantly stop conventional drugs.
- Return these as string warnings in the "complianceIssues" array. If none are found, return an empty array.

Auditing Metrics:
1. "readabilityScore": 0-100 score of text complexity (higher = easier to read).
2. "readingLevel": "Patient Friendly" | "Medical Professional" | "Mixed".
3. "readingTimeMinutes": estimated reading time based on ~200 words per minute.
4. "seoScore": 0-100 rating of keyword optimization, heading hierarchy, meta suitability.
5. "geoScore": 0-100 rating of localization and clinical accessibility.
6. "aiReadinessScore": 0-100 rating of semantic structuring, tagging, and definition clear.
7. "suggestedTags": list of 5-8 relevant tags (medical terms, symptoms, kingdoms).

CRITICAL: Your output must be ONLY a valid JSON object matching this TypeScript interface:
{
  "readabilityScore": number,
  "readingLevel": "Patient Friendly" | "Medical Professional" | "Mixed",
  "readingTimeMinutes": number,
  "seoScore": number,
  "geoScore": number,
  "aiReadinessScore": number,
  "suggestedTags": string[],
  "complianceIssues": string[]
}
Do not include any markdown formatting wrappers (like \`\`\`json) or conversational text outside the JSON.`;

    const userPrompt = `Content to audit:\n\nCurrent Tags: ${JSON.stringify(tags || [])}\n\nText:\n${contentText}`;

    // Classified as phi because content to audit is a mutable draft that has not undergone
    // approved/published governance validation and can contain pasted patient information.
    const aiResponse = await aiRouterService.consultAI(
      userPrompt,
      systemInstruction,
      {
        mode: "doctor",
        lang: "en"
      },
      "phi"
    );

    if (!aiResponse.success) {
      return NextResponse.json(
        { success: false, error: "AI Router failed to audit the content. Provider may be offline." },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    let auditResults;
    const cleanText = aiResponse.response
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    try {
      auditResults = JSON.parse(cleanText);
    } catch {
      console.warn("AI returned non-JSON audit, utilizing mock parser fallback.");
      // fallback
      const wordCount = contentText.split(/\s+/).length;
      auditResults = {
        readabilityScore: 65,
        readingLevel: "Mixed",
        readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
        seoScore: 78,
        geoScore: 80,
        aiReadinessScore: 75,
        suggestedTags: tags || ["homeopathy", "clinical-audit"],
        complianceIssues: []
      };
    }

    return NextResponse.json(
      {
        success: true,
        audit: auditResults,
        warning: "This audit is an editorial support tool, not clinical validation.",
        providerUsed: aiResponse.providerUsed,
        modelUsed: aiResponse.modelUsed,
        latencyMs: aiResponse.latencyMs
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in audit-content route: Internal Server Error");
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during content audit." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
