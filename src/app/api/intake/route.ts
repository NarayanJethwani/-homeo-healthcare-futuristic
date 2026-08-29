import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { 
  createPatientFolder, 
  createPatientClinicalSheet, 
  appendPatientToMasterRecord,
  addCalendarEvent,
  PatientIntakeData 
} from "@/lib/googleDrive";
import { z } from "zod";
import { mockPatientCache } from "@/lib/mockStore";
import { CARE_PLAN_CATALOG_VERSION, calculateCarePlanTotal, formatCarePlanDuration, getCarePlan } from "@/lib/pricingConfig";

// In-memory rate limiter: Map of IP -> timestamps of requests
const ipLimiter = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

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

// Zod validation schema for patient intake request body
const intakeSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Name is required"),
  age: z.union([z.string(), z.number()]).optional().default("").transform(val => String(val)),
  gender: z.string().optional().default(""),
  phone: z.string().trim().optional().default(""),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  city: z.string().optional().default("N/A"),
  state: z.string().optional().default("N/A"),
  country: z.string().optional().default("India"),
  complaint: z.preprocess((val) => typeof val === "string" && val.trim() ? val : "No chief complaint recorded", z.string()).optional(),
  careLevel: z.string().optional().default("Standard Consultation"),
  carePlanId: z.enum(["acute_mild_3d", "acute_wellness_7d", "chronic_focused_1w", "chronic_integrated_1w", "chronic_complex_1w", "chronic_advanced_1w"]).optional(),
  carePlanCatalogVersion: z.string().optional(),
  conditionsCount: z.union([z.string(), z.number()]).optional().transform(val => val !== undefined ? Number(val) : 1),
  durationText: z.string().optional().default("One-Time consultation"),
  finalPrice: z.union([z.string(), z.number()]).optional().transform(val => val !== undefined ? Number(val) : 300),
  deliveryMode: z.string().optional().default("shipping"),
  address: z.string().optional().default(""),
  receivedAmount: z.union([z.string(), z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
  remainingBalance: z.union([z.string(), z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
  billingCycle: z.preprocess((val) => typeof val === "string" ? val.toLowerCase() : val, z.enum(["weekly", "monthly"])).optional(),
  durationValue: z.union([z.string(), z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
  durationUnit: z.enum(["day", "week"]).optional(),
  concessionApplied: z.string().optional(),
  overridePrice: z.union([z.string(), z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
  medicineAddons: z.union([z.string(), z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
  date: z.string().optional(),
  slot: z.string().optional(),
  assignedDoctor: z.string().optional(),
  status: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.status === "pending_plan") return;

  const requiredForActiveCase = [
    ["age", data.age, "Age is required"],
    ["gender", data.gender, "Gender is required"],
    ["phone", data.phone, "Phone number is required"]
  ] as const;

  for (const [field, value, message] of requiredForActiveCase) {
    if (!String(value).trim()) {
      ctx.addIssue({ code: "custom", path: [field], message });
    }
  }
});

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const rawIp = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for");
    const ip = rawIp ? rawIp.split(",")[0].trim() : "127.0.0.1";
    if (isRateLimited(ip)) {
      console.warn(`Intake rate limit triggered for IP: ${ip}`);
      return NextResponse.json({
        success: false,
        message: "Too many requests. Please wait a minute before submitting the form again."
      }, { status: 429 });
    }

    const body = await request.json();

    // 1.5 Handle NLP Clinical Intake parsing request if body contains 'text' without patient registration fields
    if (typeof body.text === "string" && !body.name && !body.phone) {
      const { RepertorySearch } = await import("@/features/repertory/search/repertorySearch");
      const { PublishedCorpusRepository } = await import("@/features/repertory/repositories/PublishedCorpusRepository");
      const { JETHWANI_REPERTORY_DATA } = await import("@/lib/repertoryData");

      const intakeText = body.text.trim();
      if (!intakeText) {
        return NextResponse.json({
          success: true,
          nlpPhrase: "",
          matchedRubrics: [],
          suggestedRemedies: [],
          missingClarificationQuestions: [],
          repertoryScore: 0,
          rubrics: []
        });
      }

      const result = await RepertorySearch.parseAIIntakeText(intakeText);
      const rubricIds = result.matchedRubrics.map(m => m.rubricId);
      const rubricsMap = new Map<string, any>();

      for (const id of rubricIds) {
        try {
          const r = await PublishedCorpusRepository.getRubricById(id);
          if (r) rubricsMap.set(id, r);
        } catch (_e) {}
      }

      for (const id of rubricIds) {
        if (!rubricsMap.has(id)) {
          const fallback = JETHWANI_REPERTORY_DATA.find(j => j.id === id);
          if (fallback) {
            rubricsMap.set(id, {
              rubricId: fallback.id,
              id: fallback.id,
              title: fallback.name,
              displayText: fallback.name,
              classicalWording: fallback.name,
              plainLanguageMeaning: fallback.name,
              category: fallback.section === "Section A" ? "Mental & Emotional" : "Physical Symptoms",
              organSystem: "General",
              severity: 5,
              frequency: "frequent",
              impact: "moderate",
              synonyms: [],
              clinicalKeywords: [],
              patientExpressions: [],
              relatedRemedies: Object.entries(fallback.remedies || {}).map(([rem, grade]) => ({
                remedyId: rem,
                remedyName: rem,
                grade
              }))
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        ...result,
        rubrics: Array.from(rubricsMap.values())
      });
    }

    // 2. Validate input using Zod for patient intake registration
    const validationResult = intakeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid input data.",
        errors: validationResult.error.format()
      }, { status: 400 });
    }

    const validatedData = validationResult.data;
    const selectedPlan = validatedData.carePlanId ? getCarePlan(validatedData.carePlanId) : undefined;
    const selectedDurationValue = selectedPlan?.family === "acute"
      ? selectedPlan.durationValue
      : validatedData.durationValue;
    const officialCarePeriodTotal = selectedPlan
      ? calculateCarePlanTotal(selectedPlan.id, selectedPlan.family === "chronic" ? (selectedDurationValue || 1) : 1).total
      : undefined;
    
    // Extract patient intake data
    const patientData: PatientIntakeData = {
      id: validatedData.id || `P-${Math.floor(100000 + Math.random() * 900000)}`,
      name: validatedData.name,
      age: validatedData.age,
      gender: validatedData.gender,
      phone: validatedData.phone,
      email: validatedData.email || "",
      city: validatedData.city,
      state: validatedData.state,
      country: validatedData.country,
      complaint: validatedData.complaint || "No chief complaint recorded",
      careLevel: selectedPlan?.title || validatedData.careLevel,
      conditionsCount: validatedData.conditionsCount,
      durationText: selectedPlan
        ? `${formatCarePlanDuration({ durationValue: selectedDurationValue || selectedPlan.durationValue, durationUnit: selectedPlan.durationUnit })} Care Period`
        : validatedData.durationText,
      finalPrice: body.status === "pending_plan" && !selectedPlan ? 0 : validatedData.finalPrice,
      deliveryMode: validatedData.deliveryMode,
      address: validatedData.address,
      receivedAmount: validatedData.receivedAmount,
      remainingBalance: validatedData.remainingBalance,
      billingCycle: validatedData.billingCycle,
      durationValue: selectedDurationValue,
      concessionApplied: validatedData.concessionApplied,
      overridePrice: validatedData.overridePrice,
      medicineAddons: validatedData.medicineAddons,
      date: validatedData.date,
      slot: validatedData.slot
    };

    console.log("Processing intake automation for patient:", patientData.name);
    
    let folderId = "";
    let folderUrl = "";
    let sheetId = "";
    let sheetUrl = "";
    let status = body.status || "active";
    let createdAt = new Date().toISOString();

    let isFirebaseConfigured = false;
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        const db = getAdminDb();
        isFirebaseConfigured = true;
        const docRef = db.collection("patients").doc(patientData.id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const existingData = docSnap.data() || {};
          folderId = existingData.folderId || "";
          folderUrl = existingData.folderUrl || "";
          sheetId = existingData.sheetId || "";
          sheetUrl = existingData.sheetUrl || "";
          status = body.status || existingData.status || "active";
          createdAt = existingData.createdAt || new Date().toISOString();
        }
      } catch (err) {
        console.warn("Failed to check existing patient document in Firestore:", err);
      }
    }

    let isMock = false;

    // Only provision Google Workspace if the status is active (or anything other than pending_plan)
    // AND if the patient doesn't already have a provisioned folder/sheet.
    if (status !== "pending_plan" && (!folderUrl || !sheetUrl)) {
      const hasGoogleCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      
      if (hasGoogleCredentials) {
        try {
          // 1. Create Patient Folder in Google Drive under Parent Folder
          const folderResult = await createPatientFolder(patientData);
          folderId = folderResult.folderId;
          folderUrl = folderResult.folderUrl;
          
          // 2. Create Patient Clinical Sheet inside their new Folder
          const sheetResult = await createPatientClinicalSheet(folderId, patientData);
          sheetId = sheetResult.sheetId;
          sheetUrl = sheetResult.sheetUrl;
          
          // 3. Append summary row to Master Google Sheet
          try {
            await appendPatientToMasterRecord(patientData, folderUrl, sheetUrl);
          } catch (mErr) {
            console.warn("Could not sync dynamically provisioned patient to Master Record Sheet:", mErr);
          }

          // 4. Create Google Calendar event
          try {
            await addCalendarEvent(patientData);
          } catch (calErr) {
            console.warn("Could not create Google Calendar event:", calErr);
          }
        } catch (gpErr) {
          console.error("Failed to provision Google Drive files:", gpErr);
          // Don't fail the whole request, fallback to mock if Drive fails
          isMock = true;
        }
      } else {
        console.warn("GOOGLE_SERVICE_ACCOUNT_KEY not set. Intake operating in mock mode for:", patientData.name);
        isMock = true;
      }

      if (isMock) {
        // Build mock sheet URL with a short temporary mock ID instead of serializing patient details
        const mockSheetUrl = `/admin/mock-sheet?mockId=${encodeURIComponent(patientData.id)}`;

        folderUrl = "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link";
        sheetUrl = mockSheetUrl;
      }
    }

    // Save to Firestore and local in-memory cache
    const patientDoc = {
      id: patientData.id,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      phone: patientData.phone,
      email: patientData.email,
      location: patientData.deliveryMode
        ? (patientData.deliveryMode === "shipping"
            ? `${patientData.address || "N/A"}, ${patientData.city}, ${patientData.state}, ${patientData.country}`
            : patientData.deliveryMode === "walkin"
              ? "Walk-in Clinic Pickup (Baner, Pune)"
              : "Self-Arranged Pickup (Baner Clinic, Pune)")
        : `${patientData.city}, ${patientData.state}, ${patientData.country}`,
      complaint: patientData.complaint,
      careLevel: patientData.careLevel,
      ...(validatedData.carePlanId ? { carePlanId: validatedData.carePlanId } : {}),
      ...(validatedData.carePlanId ? { carePlanCatalogVersion: CARE_PLAN_CATALOG_VERSION } : {}),
      conditionsCount: patientData.conditionsCount,
      durationText: patientData.durationText,
      finalPrice: patientData.finalPrice,
      ...(officialCarePeriodTotal !== undefined ? { officialCarePeriodTotal } : {}),
      receivedAmount: Number(body.receivedAmount || patientData.finalPrice),
      remainingBalance: Number(body.remainingBalance || 0),
      deliveryMode: patientData.deliveryMode,
      folderId,
      folderUrl,
      sheetId,
      sheetUrl,
      assignedDoctor: body.assignedDoctor || "unassigned",
      isMock,
      status,
      createdAt,
      billingCycle: patientData.billingCycle || "Monthly",
      concessionApplied: patientData.concessionApplied || "None",
      durationValue: patientData.durationValue || 1,
      durationUnit: selectedPlan?.durationUnit || validatedData.durationUnit || "week"
    };

    // Save to local in-memory fallback cache (for local demo mode)
    mockPatientCache.set(patientData.id, patientDoc);

    if (isFirebaseConfigured) {
      try {
        await getAdminDb().collection("patients").doc(patientDoc.id).set(patientDoc, { merge: true });
        console.log("Patient document saved successfully in Firestore.");
      } catch (fsErr) {
        console.warn("Failed to write to Firestore, relying on in-memory cache:", fsErr);
      }
    } else {
      console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore write.");
    }

    return NextResponse.json({
      success: true,
      message: status === "pending_plan" 
        ? "Patient case registered successfully in Firestore. Clinical Sheet and Folder will be dynamically provisioned on first doctor access."
        : "Patient case registered and workspace provisioned successfully.",
      patientId: patientDoc.id,
      folderUrl: patientDoc.folderUrl,
      sheetUrl: patientDoc.sheetUrl,
      isMock
    });

  } catch (error: any) {
    console.error("Intake automation failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to complete Google services integration or database sync.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
