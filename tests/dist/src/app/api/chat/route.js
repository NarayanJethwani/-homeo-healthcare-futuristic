"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const generative_ai_1 = require("@google/generative-ai");
function formatDigitalTwin(twin) {
    if (!twin)
        return "No digital twin data available yet.";
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
            const wData = data;
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
            const assessment = val;
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
        twin.history.forEach((h, idx) => {
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
async function POST(request) {
    try {
        const { messages, twin, tone } = await request.json();
        if (!messages || !Array.isArray(messages)) {
            return server_1.NextResponse.json({ success: false, message: "Messages history is required." }, { status: 400 });
        }
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not configured. Falling back to local intelligence.");
            return server_1.NextResponse.json({
                success: false,
                message: "API key missing. Falling back to local intelligence."
            });
        }
        const ai = new generative_ai_1.GoogleGenerativeAI(apiKey);
        // Prepare conversation context
        const currentQuery = messages[messages.length - 1]?.text || "";
        const conversationHistory = messages.slice(0, messages.length - 1).map((m) => `${m.sender === "user" ? "User" : "AI Assistant"}: ${m.text}`).join("\n");
        const toneChoice = tone || "empathetic";
        let toneInstruction = "";
        if (toneChoice === "professional") {
            toneInstruction = `Tone: Speak as a supportive, precise, and objective clinical guide. Maintain clinical vocabulary while remaining clear and easy to understand. Discuss findings in terms of organ loads and system reserves.`;
        }
        else {
            toneInstruction = `Tone: Speak as a warm, highly empathetic close friend and wellness ally. Use gentle, comforting, and encouraging language. Make the patient feel cared for and validated.`;
        }
        const formattedTwinData = formatDigitalTwin(twin);
        const currentDateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const systemInstructions = `HOMEO HEALTHCARE AI COMPANION v3.0

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

Always transform data into understanding. Never start with generic lifestyle advice when a medical question or lab query is asked. First answer the user's actual question directly and scientifically!

⸻

HEALTH INTELLIGENCE DATA
Below is the patient's real-time Your Health Twin Insights profile. Refer to this data as their actual health history, constitutional patterns, and recent assessments:
${formattedTwinData}

Current Date & Time: ${currentDateStr} (Use this to align check-in recommendations)

${toneInstruction}

⸻

RESPONSE PRIORITY ENGINE (INTENT DETECTION)
For every user query, determine the Intent Type and order your response elements as specified:

- **Intent Type 1: Medical Knowledge** (e.g., "What is PCOS?", "Explain diabetes", "What causes migraine?", "What is insulin resistance?")
  - RESPONSE ORDER:
    1. Condition Snapshot (Definition, common symptoms, risk factors, mechanisms).
    2. Medical explanation (What it actually is biologically/physiologically).
    3. Symptoms and Causes.
    4. How it is evaluated.
    5. Evidence-based management approaches.
    6. Personalized relevance (Connect to user's health profile, e.g., metabolic or endocrine scores).
    7. Targeted follow-up questions to drive personalization.
  - CRITICAL: Never start with generic lifestyle or hydration advice. First explain the medical condition requested.

- **Intent Type 2: Lab Interpretation** (e.g., "Interpret my HbA1c", "Explain ferritin", "Review my uploaded lab report")
  - RESPONSE ORDER:
    1. Marker explanation (What is being measured and why it is used).
    2. Reference ranges (e.g. Normal, Prediabetes, High).
    3. Trend interpretation (Compare user's level if available in the profile, or explain how it trends).
    4. Potential significance (Organ load, functional strain, systemic impact).
    5. Personalized context.
    6. Suggested discussion points for the consultation.

- **Intent Type 3: Symptom Guidance** (e.g., "I have headache", "I feel tired", "Why am I bloated?")
  - RESPONSE ORDER:
    1. Clarify symptom characteristics.
    2. Compare against user health profile (e.g., sleep scores, stress flags, constitutional match).
    3. Identify possible contributors (lifestyle, stress, sleep, environment).
    4. Offer practical self-care guidance.
    5. Recommend clinical review when appropriate.
  - Always ask relevant follow-up questions to refine.

- **Intent Type 4: Health Intelligence Questions** (e.g., "Why did my vitality score drop?", "Explain my bio-age", "What changed this month?")
  - RESPONSE ORDER:
    1. Trend analysis (What score changed and when).
    2. Driver analysis (Which lifestyle, stress, or system scores contributed).
    3. Risk/opportunity analysis.
    4. Action priorities.

⸻

UI RESPONSE TEMPLATE
Always format the generated response using these exact section headers:

### 🧠 Quick Insight
[Provide a highly concise (1-2 sentences) summary. First answer the medical/lab/symptom question directly before introducing other sections.]
[If applicable, provide a brief trigger list or status indicators]
[Add: "What would you like to do?" followed by interactive choice chips in square brackets:
[Explore Causes] [PCOS Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]
Note: Tailor the plan name to the symptoms, e.g., [Headache Recovery Plan] or [Fatigue Recovery Plan] or [Metabolic Recovery Plan]]

### Health Twin Insights Summary
**Confidence**: [Low / Moderate / High] (based on available telemetry data)
**Data Used**: [List vitality metrics, sleep scores, or symptoms used in this analysis]
**Active Signals**:
[List status signals:
🟢 Recovery Capacity: [Strong/Stable/Sluggish]
🟢 Stress Burden: [Low/Moderate/High]
🟢 Sleep Reserve: [Good/Sufficient/Sluggish]
🟡 New Symptom: [Symptom Name] (or 🟢 No Active Symptoms reported)
⚪ Clinical Concern Level: [Low/Moderate/Significant]
]

### What This Means
[Detailed explanation mapping to the Response Priority Engine based on intent (Condition definition/explanation/snapshot, marker interpretation, or symptom clarification). Put the core medical answers here first.]

### Why It Matters
[Provide the clinical, physiological, epigenetic, or constitutional significance of this condition, lab, or symptom.]

### Personalized Insight
[Connect findings to the user's assessments, reserve scores, bio-age, constitutional match, or sleep records. E.g., "While PCOS affects each person differently, your current metabolic reserve scores (85%) provide useful context when evaluating insulin sensitivity."]

### Recommended Next Steps
[Provide practical, actionable self-care or platform assessment recommendations, e.g., [Take Metabolic Assessment].]

### 👨⚕️ Clinical Insight
[Label this section exactly: "Educational Clinical Insight". Provide educational guidance aligned with Dr. Jethwani's Homeo Healthcare philosophy, focusing on root-cause patterns, recovery capacity, and system reserve protection.]

### Constitutional Perspective
[Analyze how their constitutional profile (e.g. thermal response, appetite tendencies, sleep, system dominance, adaptive reaction) influences their current symptoms. Observation only, not diagnosis.]

### To Guide You Better
[Ask 3 or 4 targeted, personalized follow-up questions to drive personalization rather than long essays.]

### Next Best Actions
[Provide proactive action chips in square brackets:
[💧 Hydration Check] [😴 Sleep Review] [🧘 Stress Check-In] [📊 Compare with Previous Assessments] [Request Clinical Review]
]

### Continue on WhatsApp
📱 I can check in with you later today, or you can connect with Dr. Jethwani for a clinical review. Select a preference:
[Remind Me in 4 Hours] [Track This Symptom] [Ask Dr. Jethwani]

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
                if (responseText)
                    break;
            }
            catch (err) {
                console.error(`Gemini model ${modelName} failed:`, err);
                lastError = err;
            }
        }
        if (!responseText) {
            throw lastError || new Error("Failed to generate content from any Gemini model.");
        }
        return server_1.NextResponse.json({
            success: true,
            text: responseText
        });
    }
    catch (error) {
        console.error("Error in health assistant API:", error);
        return server_1.NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
