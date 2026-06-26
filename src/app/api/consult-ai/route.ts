import { NextResponse } from "next/server";
import { aiRouterService } from "@/lib/aiRouter";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// In-memory rate limiter: Map of IP -> timestamps of requests
const ipLimiter = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipLimiter.get(ip) || [];
  
  // Filter out expired timestamps
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  activeTimestamps.push(now);
  ipLimiter.set(ip, activeTimestamps);
  return false;
}

// Simple prompt injection detection
function isPromptInjection(query: string): boolean {
  const injectionPatterns = [
    "ignore previous instructions",
    "ignore all previous",
    "system rules",
    "bypass safety",
    "forget what you were told",
    "developer mode",
    "act as a developer",
    "you are now a coding assistant"
  ];
  const q = query.toLowerCase();
  return injectionPatterns.some(pattern => q.includes(pattern));
}

// Medical safety filters
function checkMedicalSafety(query: string): string | null {
  const q = query.toLowerCase();
  
  // Crisis prevention
  if (q.includes("suicide") || q.includes("kill myself") || q.includes("end my life") || q.includes("harm myself") || q.includes("self-harm")) {
    return "If you are experiencing thoughts of self-harm or a mental health crisis, please contact emergency service lines immediately (such as dialing 911, 112, or local mental health lifelines) or proceed to the nearest hospital emergency room. Please seek urgent care.";
  }

  // Dangerous poisoning
  if (q.includes("drink bleach") || q.includes("ingest poison") || q.includes("toxic cure")) {
    return "For your safety, please immediately call a local poison control center or emergency services. Never ingest toxic substances under any circumstances.";
  }

  return null;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}

export async function POST(request: Request) {
  try {
    // 1. Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous_ip";
    if (isRateLimited(ip)) {
      console.warn(`Rate limit triggered for IP: ${ip}`);
      return NextResponse.json({
        success: false,
        response: "You are sending requests too quickly. Please wait a minute before asking Lucy again."
      }, { status: 429, headers: CORS_HEADERS });
    }

    const { query, score, answers, logs, mode, hasAssessments, lang } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({
        success: false,
        response: "Query parameter is required."
      }, { status: 400, headers: CORS_HEADERS });
    }

    // 2. Security: Prompt Injection Guard
    if (isPromptInjection(query)) {
      console.warn(`Prompt injection attempt blocked from IP: ${ip}`);
      return NextResponse.json({
        success: true, // return natural response instead of throwing technical error
        response: "I am designed exclusively to support your health journey with Homeo Healthcare. I cannot modify my instructions, perform coding tasks, or bypass clinical safety guidelines."
      }, { headers: CORS_HEADERS });
    }

    // 3. Security: Medical Safety Filter
    const safetyWarning = checkMedicalSafety(query);
    if (safetyWarning) {
      console.warn(`Medical safety filter triggered from IP: ${ip}`);
      return NextResponse.json({
        success: true,
        response: safetyWarning
      }, { headers: CORS_HEADERS });
    }

    // 4. Construct System Instruction
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
      systemInstruction += "You are in Patient Mode (General Healthcare Assistant). Provide warm, compassionate, patient-facing responses. Use clear, simple language to guide patients. Answer questions directly and understandably, maintaining a supportive, reassuring tone. Never mention you are switching models or providers; keep the personality seamless.";
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

    // 5. Call Central AI Router
    const result = await aiRouterService.consultAI(query, systemInstruction, {
      score,
      answers,
      logs,
      mode,
      lang
    });

    return NextResponse.json(result, { headers: CORS_HEADERS });

  } catch (error: any) {
    console.error("Error in consult-ai route:", error);
    return NextResponse.json({
      success: false,
      response: "An unexpected error occurred. Connecting you to local clinical resources.",
      error: error.message || String(error)
    }, { status: 500, headers: CORS_HEADERS });
  }
}
