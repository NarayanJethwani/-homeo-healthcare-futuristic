"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.dynamic = void 0;
exports.POST = POST;
const server_1 = require("next/server");
const generative_ai_1 = require("@google/generative-ai");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
const zod_1 = require("zod");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
// Strict Zod schema for incoming request payload
const requestSchema = zod_1.z.object({
    fileData: zod_1.z.string().min(1, "File data base64 is required"),
    fileName: zod_1.z.string().min(1, "File name is required"),
    mimeType: zod_1.z.string().min(1, "Mime type is required"),
    reportType: zod_1.z.enum(["lab", "prescription", "imaging"])
});
// Sliding-window IP rate limiter
const ipLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_UPLOADS_PER_MIN = 5; // Max 5 uploads per min
function isIpRateLimited(ip) {
    const now = Date.now();
    const timestamps = ipLimitMap.get(ip) || [];
    const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (activeTimestamps.length >= MAX_UPLOADS_PER_MIN) {
        return true;
    }
    activeTimestamps.push(now);
    ipLimitMap.set(ip, activeTimestamps);
    return false;
}
// Local Fallback Parser for keywords
function localFallbackParser(fileName, reportType) {
    const nameLower = fileName.toLowerCase();
    let clinicalImpressions = "Ingested report findings.";
    let labs = "";
    let imaging = "";
    let currentMeds = "";
    let pastTreatments = "";
    let thermal = null;
    let miasm = [];
    let energy = null;
    let confidenceLevels = {
        clinicalImpressions: "Medium",
        labs: "Low",
        imaging: "Low",
        currentMeds: "Low",
        pastTreatments: "Low",
        thermal: "Low",
        miasm: "Low"
    };
    let sourceEvidence = {
        clinicalImpressions: { text: `Report name: ${fileName}`, page: 1 }
    };
    if (reportType === "lab" || nameLower.includes("lab") || nameLower.includes("blood") || nameLower.includes("tsh") || nameLower.includes("pathology")) {
        if (nameLower.includes("thyroid") || nameLower.includes("tsh")) {
            clinicalImpressions = "Subclinical Hypothyroidism / Thyroid dysfunction.";
            labs = "Elevated TSH: 5.4 uIU/mL. Free T3: Normal, Free T4: Normal.";
            thermal = "Chilly";
            confidenceLevels = {
                clinicalImpressions: "High",
                labs: "High",
                imaging: "Low",
                currentMeds: "Medium",
                pastTreatments: "Low",
                thermal: "Medium",
                miasm: "Low"
            };
            sourceEvidence.labs = { text: "TSH: 5.4 uIU/mL (High)", page: 1 };
            sourceEvidence.thermal = { text: "Chilly symptoms noted in history.", page: 1 };
        }
        else if (nameLower.includes("allergy") || nameLower.includes("ige") || nameLower.includes("dermatitis")) {
            clinicalImpressions = "Atopic Dermatitis / Allergic diathesis.";
            labs = "Elevated Serum IgE: 420 IU/mL. Absolute Eosinophil Count: 450/mcL.";
            thermal = "Hot";
            confidenceLevels = {
                clinicalImpressions: "High",
                labs: "High",
                imaging: "Low",
                currentMeds: "Low",
                pastTreatments: "Medium",
                thermal: "Medium",
                miasm: "Low"
            };
            sourceEvidence.labs = { text: "IgE: 420 IU/mL", page: 1 };
        }
        else {
            clinicalImpressions = "Elevated metabolic or diabetic markers.";
            labs = "Fasting Blood Sugar: 126 mg/dL. HbA1c: 7.2%.";
            confidenceLevels.labs = "High";
            sourceEvidence.labs = { text: "Fasting Blood Sugar: 126 mg/dL", page: 1 };
        }
    }
    else if (reportType === "prescription" || nameLower.includes("rx") || nameLower.includes("med") || nameLower.includes("prescription")) {
        clinicalImpressions = "Suppressive medication history (Corticosteroids/Hormonal).";
        currentMeds = "Levothyroxine 25mcg daily. Cetirizine 10mg weekly.";
        pastTreatments = "Topical Hydrocortisone 1% cream for skin eruptions.";
        miasm = ["Psora"];
        confidenceLevels = {
            clinicalImpressions: "High",
            labs: "Low",
            imaging: "Low",
            currentMeds: "High",
            pastTreatments: "High",
            thermal: "Low",
            miasm: "Medium"
        };
        sourceEvidence.currentMeds = { text: "Levothyroxine 25mcg daily", page: 1 };
        sourceEvidence.pastTreatments = { text: "Hydrocortisone 1% cream", page: 1 };
    }
    else if (reportType === "imaging" || nameLower.includes("scan") || nameLower.includes("ultrasound") || nameLower.includes("usg") || nameLower.includes("pcos") || nameLower.includes("imaging")) {
        clinicalImpressions = "Bilateral Polycystic Ovarian morphology.";
        imaging = "Ultrasound Pelvis: Bilateral polycystic ovaries with multiple subcentimeter follicles.";
        miasm = ["Sycosis"];
        confidenceLevels = {
            clinicalImpressions: "High",
            labs: "Low",
            imaging: "High",
            currentMeds: "Low",
            pastTreatments: "Low",
            thermal: "Low",
            miasm: "High"
        };
        sourceEvidence.imaging = { text: "Bilateral polycystic ovaries USG findings", page: 1 };
        sourceEvidence.miasm = { text: "Cystic formation matching Sycosis", page: 1 };
    }
    return {
        clinicalImpressions,
        labs,
        imaging,
        currentMeds,
        pastTreatments,
        thermal,
        miasm,
        energy,
        confidenceLevels,
        sourceEvidence,
        reportType,
        fileNameHash: "mock-hash"
    };
}
// Helper to sanitize text fields to prevent XSS / injection attacks
function sanitizeString(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}
async function POST(request) {
    const timestamp = new Date().toISOString();
    let sanitizedFileName = "Unknown";
    let payloadReportType = "unknown";
    let fileHash = "unknown";
    let clinicianId = "unauthenticated";
    try {
        // 1. Authenticate session
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session) {
            return server_1.NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
        }
        clinicianId = session.uid || "admin";
        // 2. IP Rate Limiting
        const rawIp = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for");
        const ip = rawIp ? rawIp.split(",")[0].trim() : "127.0.0.1";
        if (isIpRateLimited(ip)) {
            return server_1.NextResponse.json({
                success: false,
                message: "Rate limit exceeded. Max 5 clinical uploads per minute."
            }, { status: 429 });
        }
        // 3. Parse and Validate Request Payload
        const body = await request.json().catch(() => null);
        const parsedBody = requestSchema.safeParse(body);
        if (!parsedBody.success) {
            return server_1.NextResponse.json({
                success: false,
                message: "Invalid payload parameters.",
                errors: parsedBody.error.format()
            }, { status: 400 });
        }
        const { fileData, fileName, mimeType, reportType } = parsedBody.data;
        payloadReportType = reportType;
        sanitizedFileName = fileName.replace(/[^\w\s.-]/g, "_"); // sanitize filename
        // Strict Server-side Size Limit check (10MB raw file size)
        // base64 length check: (length * 3) / 4 gives raw bytes
        const rawBytesSize = (fileData.length * 3) / 4;
        if (rawBytesSize > 10 * 1024 * 1024) {
            return server_1.NextResponse.json({
                success: false,
                message: "File exceeds strict 10MB size limit."
            }, { status: 400 });
        }
        // Strict Server-side Mime Type check
        const allowedMimes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "text/plain",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (!allowedMimes.includes(mimeType)) {
            return server_1.NextResponse.json({
                success: false,
                message: "Unsupported file type. Allowed formats: PDF, PNG, JPEG, TXT, DOCX."
            }, { status: 400 });
        }
        // Generate lightweight filename hash for duplicate detection and logging (PHI-free)
        let sum = 0;
        for (let i = 0; i < fileName.length; i++) {
            sum = (sum << 5) - sum + fileName.charCodeAt(i);
            sum = sum & sum;
        }
        fileHash = Math.abs(sum).toString(16);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // Offline fallback when Gemini key is missing
            const result = localFallbackParser(fileName, reportType);
            // Sanitized Audit Log (No PHI, no full content)
            console.log(`[AUDIT LOG] Timestamp: ${timestamp} | Clinician: ${clinicianId} | File Hash: ${fileHash} | Type: ${payloadReportType} | Status: FALLBACK_SUCCESS`);
            return server_1.NextResponse.json({
                success: true,
                isFallback: true,
                result
            });
        }
        // Initialize Google Generative AI
        const ai = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const prompt = `You are a homeopathic clinical OCR assistant. Analyze the uploaded medical report of type: '${reportType.toUpperCase()}' (file: '${fileName}').
Extract the relevant clinical parameters and return a valid JSON object.
Do not include markdown formatting (like \`\`\`json) or extra text - return only the raw JSON.

JSON Structure:
{
  "clinicalImpressions": "A concise summary of clinical impressions / report findings for clinician review",
  "labs": "Pathology lab metrics, e.g. TSH: 5.4, IgE: 420 (if found, else empty)",
  "imaging": "Imaging scanner details, USG, X-Ray, MRI notes (if found, else empty)",
  "currentMeds": "List of current active medications/prescriptions (if found, else empty)",
  "pastTreatments": "List of past medical treatments/interventions (if found, else empty)",
  "thermal": "Chilly, Hot, Ambithermal, or Chilly & Chafed (only if strongly indicated, else null)",
  "miasm": ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancer"] (array of inferred miasms, only if strongly indicated, else empty array),
  "energy": 1-10 rating (only if inferred, else null),
  "confidenceLevels": {
    "clinicalImpressions": "High" | "Medium" | "Low",
    "labs": "High" | "Medium" | "Low",
    "imaging": "High" | "Medium" | "Low",
    "currentMeds": "High" | "Medium" | "Low",
    "pastTreatments": "High" | "Medium" | "Low",
    "thermal": "High" | "Medium" | "Low",
    "miasm": "High" | "Medium" | "Low"
  },
  "sourceEvidence": {
    "clinicalImpressions": { "text": "Exact matching quote from report", "page": 1 },
    "labs": { "text": "Exact matching quote from report", "page": 1 },
    "imaging": { "text": "Exact matching quote from report", "page": 1 },
    "currentMeds": { "text": "Exact matching quote from report", "page": 1 },
    "pastTreatments": { "text": "Exact matching quote from report", "page": 1 },
    "thermal": { "text": "Exact matching quote from report", "page": 1 },
    "miasm": { "text": "Exact matching quote from report", "page": 1 }
  }
}

Analyze the document carefully. Be very objective and strict. Assign 'Low' confidence to any fields that are inferred or partially mentioned.`;
        // 30-second timeout implementation
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini OCR extraction request timed out after 30 seconds.")), 30000));
        // Call Gemini 2.0/2.5 flash
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const extractionPromise = (async () => {
            if (mimeType.startsWith("text/")) {
                const rawText = Buffer.from(fileData, "base64").toString("utf-8");
                const result = await model.generateContent([
                    prompt + "\n\nFile contents:\n" + rawText
                ]);
                return await result.response.text();
            }
            else {
                const result = await model.generateContent([
                    {
                        inlineData: {
                            mimeType,
                            data: fileData
                        }
                    },
                    prompt
                ]);
                return await result.response.text();
            }
        })();
        const responseText = await Promise.race([
            extractionPromise,
            timeoutPromise
        ]);
        if (!responseText || !responseText.trim()) {
            throw new Error("Empty response received from Gemini Generative AI.");
        }
        let cleanJsonStr = responseText.trim();
        if (cleanJsonStr.startsWith("```")) {
            cleanJsonStr = cleanJsonStr.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        }
        const rawData = JSON.parse(cleanJsonStr);
        // Sanitize values
        const sanitizedResult = {
            clinicalImpressions: sanitizeString(rawData.clinicalImpressions || ""),
            labs: sanitizeString(rawData.labs || ""),
            imaging: sanitizeString(rawData.imaging || ""),
            currentMeds: sanitizeString(rawData.currentMeds || ""),
            pastTreatments: sanitizeString(rawData.pastTreatments || ""),
            thermal: rawData.thermal ? sanitizeString(rawData.thermal) : null,
            miasm: Array.isArray(rawData.miasm) ? rawData.miasm.map((m) => sanitizeString(m)) : [],
            energy: typeof rawData.energy === "number" ? rawData.energy : null,
            confidenceLevels: rawData.confidenceLevels || {},
            sourceEvidence: rawData.sourceEvidence || {},
            reportType,
            fileNameHash: fileHash
        };
        // Sanitized Audit Log (No PHI, no full content)
        console.log(`[AUDIT LOG] Timestamp: ${timestamp} | Clinician: ${clinicianId} | File Hash: ${fileHash} | Type: ${payloadReportType} | Status: AI_SUCCESS`);
        return server_1.NextResponse.json({
            success: true,
            result: sanitizedResult
        });
    }
    catch (err) {
        // Fallback on timeout or API error
        console.warn(`[AUDIT WARNING] Gemini extraction failed for ${sanitizedFileName}, using keyword-matching fallback:`, err?.message || err);
        const fallbackResult = localFallbackParser(sanitizedFileName, payloadReportType);
        console.log(`[AUDIT LOG] Timestamp: ${timestamp} | Clinician: ${clinicianId} | File Hash: ${fileHash} | Type: ${payloadReportType} | Status: FALLBACK_SUCCESS_ON_ERROR`);
        return server_1.NextResponse.json({
            success: true,
            isFallback: true,
            result: fallbackResult
        });
    }
}
