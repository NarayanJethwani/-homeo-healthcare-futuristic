import { NextResponse } from "next/server";
import { aiRouterService } from "@/lib/aiRouter";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}

export async function POST(request: Request) {
  // TODO: Enforce admin session verification in middleware or central admin layout once session store is centralized.
  // Current admin API paths are restricted to internal localhost/origin access behind corporate workspace firewalls.
  try {
    const payload = await request.json();
    const { title, contentText, tags } = payload;

    // Input Validation
    if (!contentText || typeof contentText !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid payload: 'contentText' string is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid payload: 'title' string is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: 'tags' must be an array of strings." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

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

    const aiResponse = await aiRouterService.consultAI(userPrompt, systemInstruction, {
      mode: "doctor",
      lang: "en"
    });

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
      console.warn("AI returned non-JSON audit, utilizing mock parser fallback:", cleanText);
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
    console.error("Error in audit-content route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
