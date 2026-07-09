"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const googleDrive_1 = require("@/lib/googleDrive");
const zod_1 = require("zod");
const mockStore_1 = require("@/lib/mockStore");
// In-memory rate limiter: Map of IP -> timestamps of requests
const ipLimiter = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute
function isRateLimited(ip) {
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
const intakeSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Name is required"),
    age: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).transform(val => String(val)),
    gender: zod_1.z.string().min(1, "Gender is required"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
    email: zod_1.z.string().email("Invalid email format").optional().or(zod_1.z.literal("")),
    city: zod_1.z.string().optional().default("N/A"),
    state: zod_1.z.string().optional().default("N/A"),
    country: zod_1.z.string().optional().default("India"),
    complaint: zod_1.z.preprocess((val) => typeof val === "string" && val.trim() ? val : "No chief complaint recorded", zod_1.z.string()).optional(),
    careLevel: zod_1.z.string().optional().default("Standard Consultation"),
    conditionsCount: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().transform(val => val !== undefined ? Number(val) : 1),
    durationText: zod_1.z.string().optional().default("One-Time consultation"),
    finalPrice: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().transform(val => val !== undefined ? Number(val) : 300),
    deliveryMode: zod_1.z.string().optional().default("shipping"),
    address: zod_1.z.string().optional().default(""),
    receivedAmount: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
    remainingBalance: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
    billingCycle: zod_1.z.preprocess((val) => typeof val === "string" ? val.toLowerCase() : val, zod_1.z.enum(["weekly", "monthly"])).optional(),
    durationValue: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
    concessionApplied: zod_1.z.string().optional(),
    overridePrice: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
    medicineAddons: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().transform(val => val !== undefined ? Number(val) : undefined),
    date: zod_1.z.string().optional(),
    slot: zod_1.z.string().optional(),
    assignedDoctor: zod_1.z.string().optional(),
    status: zod_1.z.string().optional()
});
async function POST(request) {
    try {
        // 1. Rate limiting
        const rawIp = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for");
        const ip = rawIp ? rawIp.split(",")[0].trim() : "127.0.0.1";
        if (isRateLimited(ip)) {
            console.warn(`Intake rate limit triggered for IP: ${ip}`);
            return server_1.NextResponse.json({
                success: false,
                message: "Too many requests. Please wait a minute before submitting the form again."
            }, { status: 429 });
        }
        const body = await request.json();
        // 2. Validate input using Zod
        const validationResult = intakeSchema.safeParse(body);
        if (!validationResult.success) {
            return server_1.NextResponse.json({
                success: false,
                message: "Invalid input data.",
                errors: validationResult.error.format()
            }, { status: 400 });
        }
        const validatedData = validationResult.data;
        // Extract patient intake data
        const patientData = {
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
            careLevel: validatedData.careLevel,
            conditionsCount: validatedData.conditionsCount,
            durationText: validatedData.durationText,
            finalPrice: validatedData.finalPrice,
            deliveryMode: validatedData.deliveryMode,
            address: validatedData.address,
            receivedAmount: validatedData.receivedAmount,
            remainingBalance: validatedData.remainingBalance,
            billingCycle: validatedData.billingCycle,
            durationValue: validatedData.durationValue,
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
                const db = (0, firebaseAdmin_1.getAdminDb)();
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
            }
            catch (err) {
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
                    const folderResult = await (0, googleDrive_1.createPatientFolder)(patientData);
                    folderId = folderResult.folderId;
                    folderUrl = folderResult.folderUrl;
                    // 2. Create Patient Clinical Sheet inside their new Folder
                    const sheetResult = await (0, googleDrive_1.createPatientClinicalSheet)(folderId, patientData);
                    sheetId = sheetResult.sheetId;
                    sheetUrl = sheetResult.sheetUrl;
                    // 3. Append summary row to Master Google Sheet
                    try {
                        await (0, googleDrive_1.appendPatientToMasterRecord)(patientData, folderUrl, sheetUrl);
                    }
                    catch (mErr) {
                        console.warn("Could not sync dynamically provisioned patient to Master Record Sheet:", mErr);
                    }
                    // 4. Create Google Calendar event
                    try {
                        await (0, googleDrive_1.addCalendarEvent)(patientData);
                    }
                    catch (calErr) {
                        console.warn("Could not create Google Calendar event:", calErr);
                    }
                }
                catch (gpErr) {
                    console.error("Failed to provision Google Drive files:", gpErr);
                    // Don't fail the whole request, fallback to mock if Drive fails
                    isMock = true;
                }
            }
            else {
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
            conditionsCount: patientData.conditionsCount,
            durationText: patientData.durationText,
            finalPrice: patientData.finalPrice,
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
            durationValue: patientData.durationValue || 1
        };
        // Save to local in-memory fallback cache (for local demo mode)
        mockStore_1.mockPatientCache.set(patientData.id, patientDoc);
        if (isFirebaseConfigured) {
            try {
                await (0, firebaseAdmin_1.getAdminDb)().collection("patients").doc(patientDoc.id).set(patientDoc, { merge: true });
                console.log("Patient document saved successfully in Firestore.");
            }
            catch (fsErr) {
                console.warn("Failed to write to Firestore, relying on in-memory cache:", fsErr);
            }
        }
        else {
            console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore write.");
        }
        return server_1.NextResponse.json({
            success: true,
            message: status === "pending_plan"
                ? "Patient case registered successfully in Firestore. Clinical Sheet and Folder will be dynamically provisioned on first doctor access."
                : "Patient case registered and workspace provisioned successfully.",
            patientId: patientDoc.id,
            folderUrl: patientDoc.folderUrl,
            sheetUrl: patientDoc.sheetUrl,
            isMock
        });
    }
    catch (error) {
        console.error("Intake automation failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to complete Google services integration or database sync.",
            error: error.message || error
        }, { status: 500 });
    }
}
