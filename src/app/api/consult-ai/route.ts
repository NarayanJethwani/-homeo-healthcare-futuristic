import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}

export async function POST(request: Request) {
  try {
    const { query, score, answers, logs, mode, hasAssessments, lang } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured.");
      return NextResponse.json({
        success: false,
        response: "Note: The clinical AI assistant is running in offline mode. Configure the Gemini API Key on Vercel.\n\nTo fully confirm these results, Dr. Jethwani suggests obtaining standard biological checkups: Fasting Insulin, HbA1c, and a Complete Thyroid Panel."
      }, { headers: CORS_HEADERS });
    }

    let systemInstruction = "You are a scientific clinical AI assistant for Dr. Narayan Jethwani's evidence-based classical homeopathy practice (Homeo Healthcare). ";
    
    // Set response language
    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
      gu: "Gujarati",
      bn: "Bengali",
      te: "Telugu",
      ta: "Tamil",
      kn: "Kannada"
    };
    const responseLang = languageNames[lang as string] || "English";
    systemInstruction += `CRITICAL: You MUST write your entire response natively in the ${responseLang} language using its proper native script (e.g., Devanagari script for Hindi/Marathi, Gujarati script for Gujarati, Bengali script for Bengali, Telugu script for Telugu, Tamil script for Tamil, Kannada script for Kannada). Do not write non-English languages in English alphabets (do not transliterate). `;

    if (mode === "doctor") {
      systemInstruction += "You are in Doctor Mode (Clinical Pathophysiology). Provide highly technical, pathophysiological responses using medical terms. Discuss HPA axis, endocrine axes, cardiovascular dynamics (SVR, TNF-alpha, IL-6), miasmatic analysis, and constitutional selection. Maintain a clinical, scientific tone.";
    } else {
      systemInstruction += "You are in Patient Mode (General Healthcare Assistant). Provide warm, compassionate, patient-facing responses. Use clear, simple language to guide patients. Answer questions directly and understandably, maintaining a supportive, reassuring tone.";
    }
    
    if (hasAssessments) {
      systemInstruction += ` Context: The patient completed an assessment. Score: ${score || 0}. `;
    } else {
      systemInstruction += ` Context: The patient has not completed any health assessments or uploaded any reports yet. Do not mention any specific scores or numbers. `;
    }
    if (answers && Array.isArray(answers) && answers.length > 0) {
      systemInstruction += `Wizard Answers: ${JSON.stringify(answers)}. `;
    }
    if (logs && Array.isArray(logs) && logs.length > 0) {
      systemInstruction += `Patient's Live Dashboard Logs: ${JSON.stringify(logs)}. `;
    }
    systemInstruction += "CRITICAL: Never mention any homeopathic remedy names, specific medicines, potencies, or dosages to the patient. Respond directly, clearly, and understandably to the user's query. Do NOT add generic hydration, water, or diet instructions unless the query is specifically about lifestyle, diet, or unless it is highly relevant. Avoid forcing repetitive wellness tips or booking CTAs when not requested; answer simple questions or greetings directly. Only advise the patient to book a formal consultation with Dr. Narayan Jethwani on WhatsApp when they ask about specific treatments, symptoms, diagnosis, or when it is naturally relevant to do so. Keep responses concise (under 3 paragraphs) and format in clean Markdown.";

    const ai = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-flash-latest"];
    let aiResponse = "";
    let success = false;
    let errors: Record<string, string> = {};

    for (const modelName of candidateModels) {
      try {
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: `System Instructions:\n${systemInstruction}\n\nUser Question:\n${query}` }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.4
          }
        });
        aiResponse = result.response.text();
        if (aiResponse) {
          success = true;
          break;
        }
      } catch (err: any) {
        errors[modelName] = err.message || String(err);
      }
    }

    if (!success) {
      console.error("All Gemini models failed in Next.js API:", errors);
      return NextResponse.json({
        success: false,
        response: "All clinical AI models are currently busy. Serving offline fallback:\n\nTo fully confirm these results, Dr. Jethwani suggests obtaining standard biological checkups: Fasting Insulin, HbA1c, and a Complete Thyroid Panel.",
        errors
      }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({
      success: true,
      response: aiResponse
    }, { headers: CORS_HEADERS });

  } catch (error: any) {
    console.error("Error in consult-ai route:", error);
    return NextResponse.json({
      success: false,
      response: "An unexpected error occurred in the clinical AI route."
    }, { status: 500, headers: CORS_HEADERS });
  }
}
