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
    const auth = await authorizeRequest(request, "CMS_DRAFT_EDIT", "GENERATE_SUMMARIES_API_POST");
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
    const entityType = draft.entityType || "article";
    const contentText = draft.draftContent || "";

    // Length limit checks (prevent excessive token usage or DOS)
    if (contentText.length > 100000) {
      return NextResponse.json(
        { success: false, error: "Content length exceeds the maximum limit of 100,000 characters." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const systemInstruction = `You are a medical publication AI assistant for a clinical homeopathy practice.
Analyze the provided medical content for the article "${title}" (${entityType}).
You must generate three tailored summaries in English:
1. "patientSummary": Warm, patient-friendly, compassionate, in clear non-technical language (under 3 paragraphs).
2. "practitionerSummary": Highly technical, pathophysiological, using medical terms (discussing HPA axis, endocrine markers, miasmatic affinity, constitutional considerations) for professional clinicians (under 3 paragraphs).
3. "educationalSummary": Structured for medical students, focusing on clinical definitions, repertory links, and keynotes (under 3 paragraphs).

CRITICAL CLINICAL SAFETY RULES:
- Do NOT invent or hallucinate references, bibliography, or clinical trials that are not mentioned in the source content.
- Do NOT make claims of guaranteed cures or 100% success rates.
- Do NOT advise patients to discontinue conventional allopathic treatments.
- All output is considered draft suggestions and requires human editorial approval.

CRITICAL: Your response must be ONLY a valid JSON object matching this TypeScript interface:
{
  "patientSummary": string,
  "practitionerSummary": string,
  "educationalSummary": string
}
Do not include any markdown formatting wrappers (like \`\`\`json) or conversational text outside the JSON object. Output raw JSON only.`;

    const userPrompt = `Content to summarize:\n\n${contentText}`;

    // Classified as phi because the prompt consists of a mutable draft that has not undergone
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
        { success: false, error: "AI Router failed to generate summaries. Provider may be offline." },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    // Attempt to parse response as JSON
    let parsedSummaries;
    const cleanText = aiResponse.response
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    try {
      parsedSummaries = JSON.parse(cleanText);
    } catch {
      // Fallback if parsing fails
      console.warn("AI returned non-JSON summaries, using default generic fallback.");
      parsedSummaries = {
        patientSummary: `[AI Draft Suggestion for Patients]\nRefer to the main article draft.`,
        practitionerSummary: `[AI Draft Technical Suggestion]\nRefer to the main article draft.`,
        educationalSummary: `[AI Draft Study Guide Suggestion]\nRefer to the main article draft.`
      };
    }

    return NextResponse.json(
      {
        success: true,
        summaries: parsedSummaries,
        warning: "AI-generated draft suggestions. Requires clinical editorial review before use.",
        providerUsed: aiResponse.providerUsed,
        modelUsed: aiResponse.modelUsed,
        latencyMs: aiResponse.latencyMs
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in generate-summaries route: Internal Server Error");
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during summary generation." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
