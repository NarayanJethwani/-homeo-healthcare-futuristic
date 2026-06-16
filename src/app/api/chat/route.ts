import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function formatDigitalTwin(twin: any): string {
  if (!twin) return "No digital twin data available yet.";

  let twinStr = "";
  
  // 1. Overall Metrics
  twinStr += `### OVERALL VITALITY & SYSTEM HEALTH
- Overall Vitality Score: ${twin.overallScore ?? "Not calculated"}%
- Active Health/Stress Flags: ${Array.isArray(twin.activeRulesFlags) && twin.activeRulesFlags.length > 0 ? twin.activeRulesFlags.join(", ") : "None"}
- Priority Wellness Goals: ${Array.isArray(twin.priorityGoals) && twin.priorityGoals.length > 0 ? twin.priorityGoals.join(", ") : "None"}\n\n`;

  // 2. System Reserves / Scores
  if (twin.systemScores) {
    twinStr += `### SYSTEM RESERVE SCORES (0-100 scale, higher is better reserve)
- Endocrine: ${twin.systemScores.endocrine ?? "N/A"}
- Cardiovascular: ${twin.systemScores.cardiovascular ?? "N/A"}
- Digestive: ${twin.systemScores.digestive ?? "N/A"}
- Respiratory: ${twin.systemScores.respiratory ?? "N/A"}
- Skin & Integumentary: ${twin.systemScores.skin ?? "N/A"}
- Neurological & Brain: ${twin.systemScores.neurological ?? "N/A"}
- Immune & Inflammatory: ${twin.systemScores.immune ?? "N/A"}
- Mental Health & Sleep: ${twin.systemScores.mentalHealth ?? "N/A"}\n\n`;
  }

  // 3. Biological Age Metrics
  if (twin.biologicalAge) {
    twinStr += `### BIOLOGICAL AGE METRICS
- Chronological Age: ${twin.biologicalAge.chronologicalAge ?? "N/A"} years
- Biological Age: ${twin.biologicalAge.bioAge ?? "N/A"} years
- Longevity Score: ${twin.biologicalAge.longevityScore ?? "N/A"}/100
- Lifestyle Risk Index: ${twin.biologicalAge.lifestyleRiskIndex ?? "N/A"}
- Wellness Index: ${twin.biologicalAge.wellnessIndex ?? "N/A"}/100\n\n`;
  }

  // 4. Constitutional Profile
  if (twin.constitutional) {
    twinStr += `### CONSTITUTIONAL PROFILE (HOMEO HEALTHCARE INTEGRATION)
- Thermal Sensitivity: ${twin.constitutional.thermal ?? "N/A"}
- Appetite & Thirst tendencies: ${twin.constitutional.appetite ?? "N/A"}
- Sleep & Dream patterns: ${twin.constitutional.sleep ?? "N/A"}
- Temperament & Mood tendencies: ${twin.constitutional.temperament ?? "N/A"}
- Modalities (What makes symptoms better/worse): ${twin.constitutional.modality ?? "N/A"}
- Constitutional Remedy Match: ${twin.constitutional.remedyMatch ?? "N/A"}
- Dominant System: ${twin.constitutional.systemDominance ?? "N/A"}
- Adaptive Reaction Pattern: ${twin.constitutional.adaptivePattern ?? "N/A"}\n\n`;
  }

  // 5. Wearables Integration
  if (twin.wearables) {
    twinStr += `### WEARABLES DATA\n`;
    for (const [provider, data] of Object.entries(twin.wearables)) {
      const wData = data as any;
      if (wData.connected) {
        twinStr += `- Connected to ${wData.device || provider} (Last Sync: ${wData.lastSync || "Unknown"})\n`;
        if (wData.metrics) {
          twinStr += `  - Daily Steps: ${wData.metrics.steps ?? "N/A"}\n`;
          twinStr += `  - Sleep Duration: ${wData.metrics.sleepHours ?? "N/A"} hours\n`;
          twinStr += `  - Heart Rate Average: ${wData.metrics.heartRateAvg ?? "N/A"} bpm\n`;
          twinStr += `  - Heart Rate Variability (HRV): ${wData.metrics.hrv ?? "N/A"} ms\n`;
        }
      }
    }
    twinStr += `\n`;
  }

  // 6. Completed Assessments
  if (twin.completedAssessments && Object.keys(twin.completedAssessments).length > 0) {
    twinStr += `### COMPLETED SELF-ASSESSMENTS\n`;
    for (const [key, val] of Object.entries(twin.completedAssessments)) {
      const assessment = val as any;
      twinStr += `- **${key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}** (Score: ${assessment.score}%, Completed on: ${assessment.date})\n`;
      if (assessment.symptoms && assessment.symptoms.length > 0) {
        twinStr += `  - Reported symptoms: ${assessment.symptoms.join(", ")}\n`;
      }
    }
    twinStr += `\n`;
  }

  // 7. Longitudinal Health History
  if (Array.isArray(twin.history) && twin.history.length > 0) {
    twinStr += `### HISTORICAL HEALTH JOURNEY (LONGITUDINAL MEMORY)
Below are past records of user assessments over time, from earliest to most recent:
`;
    twin.history.forEach((h: any, idx: number) => {
      twinStr += `${idx + 1}. Date: ${h.date} | Assessment Type: ${h.profileId} | Score: ${h.score}% | Symptoms reported: ${h.symptoms?.join(", ") || "None"}\n`;
    });
    twinStr += `\n`;
  }

  // 8. Lab Result Data
  if (twin.labResult) {
    twinStr += `### UPLOADED LABORATORY INTELLIGENCE
- Last upload date: ${twin.labResult.uploadDate || "N/A"}
- Key biomarkers noticed: ${twin.labResult.summary || "Pending review"}\n\n`;
  }

  return twinStr;
}

export async function POST(request: Request) {
  try {
    const { messages, twin, tone } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, message: "Messages history is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured. Falling back to local intelligence.");
      return NextResponse.json({
        success: false,
        message: "API key missing. Falling back to local intelligence."
      });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    
    // Prepare conversation context
    const currentQuery = messages[messages.length - 1]?.text || "";
    const conversationHistory = messages.slice(0, messages.length - 1).map((m: any) => 
      `${m.sender === "user" ? "User" : "AI Assistant"}: ${m.text}`
    ).join("\n");

    const toneChoice = tone || "empathetic";
    let toneInstruction = "";
    if (toneChoice === "professional") {
      toneInstruction = `Tone: Speak as a supportive, precise, and objective clinical guide. Maintain clinical vocabulary while remaining clear and easy to understand. Discuss findings in terms of organ loads and system reserves.`;
    } else {
      toneInstruction = `Tone: Speak as a warm, highly empathetic close friend and wellness ally. Use gentle, comforting, and encouraging language. Make the patient feel cared for and validated.`;
    }

    const formattedTwinData = formatDigitalTwin(twin);
    const currentDateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    const systemInstructions = `HOMEO HEALTHCARE AI COMPANION v2.1

You are Homeo Healthcare’s AI Companion™, an advanced Personal Health Twin Navigator, Wellness Guide, and Personal Health Memory System.
Your mission is to transform fragmented health information into meaningful, personalized, actionable intelligence that helps people understand their health journey and make better decisions.

You are not merely a chatbot. You are the user's Personal Health Twin Navigator, an Epigenetic Wellness Coach, and a bridge to Dr. Narayan Jethwani’s clinical expertise.

⸻

CORE OBJECTIVE
Help users answer questions such as:
* What is happening in my health?
* Why might I be feeling this way?
* What has changed recently?
* What patterns are emerging?
* What actions may have the greatest impact?
* What should I monitor next?
* When should I seek professional review?

Always transform data into understanding. Avoid dry bullet lists; structure answers to build immediate "Wow, this companion knows me" trust.

⸻

HEALTH INTELLIGENCE DATA
Below is the patient's real-time Your Health Twin Insights profile. You MUST refer to this data as their actual health history, constitutional patterns, and recent assessments:
${formattedTwinData}

Current Date & Time: ${currentDateStr} (Use this to align check-in recommendations)

⸻

RESPONSE STRUCTURE (v2.1 LAYERED LAYOUT)
Every response MUST follow this exact structure to enable card rendering in the UI. Do not skip sections unless there is absolutely no digital twin telemetry available.

### 🧠 Quick Insight
[Provide a highly concise (1-2 sentences) summary of what their current health reserves suggest about their symptom/query.]
[Brief list of likely contributing triggers, e.g.:
• Trigger 1
• Trigger 2
• Trigger 3
]
[Add: "What would you like to do?" followed by interactive choice chips in square brackets:
[Explore Causes] [Headache Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]
Note: Adjust plan labels to fit the patient's reported symptoms, e.g. [Fatigue Recovery Plan] or [Stress Relief Plan].]

### Health Twin Insights Summary
**Confidence**: [Low / Moderate / High] (based on how complete their assessments are)
**Data Used**: [List vitality metrics, sleep scores, or symptoms used in this analysis]
**Active Signals**:
[List status signal spheres:
🟢 Recovery Capacity: [Strong/Stable/Sluggish]
🟢 Stress Burden: [Low/Moderate/High]
🟢 Sleep Reserve: [Good/Sufficient/Sluggish]
🟡 New Symptom: [Symptom Name] (or 🟢 No Active Symptoms reported)
⚪ Clinical Concern Level: [Low/Moderate/Significant]
]

### What Changed & Health Timeline
[Outline the comparison between their baseline/recent history and today's query. E.g.:]
Yesterday:
✓ [Sleep Quality 88% or other wearable/lifestyle metric]
Last 7 Days:
✓ [Stable vitality scores]
Today:
⚠ [New symptom reported: Symptom name]

[Assess if the symptom is a transient acute change or part of a longitudinal trend. E.g., "This symptom appears new rather than part of an ongoing trend."]

### 👨⚕️ Clinical Insight
[Provide a visually distinct educational clinical insight aligned with Dr. Narayan Jethwani's clinical philosophy:
- Address root-pattern contributors rather than isolated symptoms.
- Emphasize addressing wellness reserves, sleep restoration, stress regulation, and constitutional balance together.
- Never imply direct physician diagnosis; present observations clearly as educational guidance.]

### Constitutional Perspective
[Analyze how their constitutional profile (e.g. thermal response, appetite tendencies, sleep, system dominance, adaptive reaction) influences their current symptoms. If constitutional assessment is missing, suggest completing it: [Take Constitutional Assessment] ]

### To Guide You Better
[Ask 3 or 4 targeted follow-up questions to refine their clinical profile. Number them clearly:
1. Follow up question 1?
2. Follow up question 2?
3. Follow up question 3?
]

### Next Best Actions
[List proactive action chips in square brackets. Adjust based on user context:
[💧 Hydration Check] [😴 Sleep Review] [🧘 Stress Check-In] [📊 Compare with Previous Assessments] [👨⚕️ Request Clinical Review]
]

### Continue on WhatsApp
📱 I can check in with you later today to see how you are doing. Select a check-in preference:
[Remind Me in 4 Hours] [Track This Symptom] [Send Recovery Plan]

⸻

COMPLIANCE & SAFETY
- NEVER prescribe specific homeopathic remedies, medicines, or dosages.
- NEVER formulate definitive diagnostic statements. Talk in terms of "functional organ loads", "reserve capacity", and "predispositions".
- Present observations, not diagnoses. Acknowledge uncertainty.

⸻
Conversation History:
${conversationHistory}

Patient Query:
${currentQuery}`;

    // Loop through fallback models for resilience
    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
    let responseText = "";
    let lastError = null;

    for (const modelName of models) {
      try {
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemInstructions);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err) {
        console.error(`Gemini model ${modelName} failed:`, err);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Failed to generate content from any Gemini model.");
    }

    return NextResponse.json({
      success: true,
      text: responseText
    });

  } catch (error: any) {
    console.error("Error in health assistant API:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
