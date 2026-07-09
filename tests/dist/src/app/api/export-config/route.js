"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.dynamic = void 0;
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const googleDrive_1 = require("@/lib/googleDrive");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
async function GET(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get("patientId");
        if (!patientId) {
            return server_1.NextResponse.json({ success: false, message: "Missing patientId parameter." }, { status: 400 });
        }
        // Default configuration database if not found in Firestore or in mock mode
        let configDb = {
            remedies: [
                "Nux Vomica", "Arsenicum Album", "Lycopodium Clavatum", "Pulsatilla Pratensis",
                "Sulphur", "Rhus Toxicodendron", "Bryonia Alba", "Calcarea Carbonica",
                "Silicea", "Natrum Muriaticum", "Ignatia Amara", "Sepia Officinalis"
            ],
            potencies: ["6C", "30C", "200C", "1M", "10M", "50M", "CM", "LM1", "LM2", "LM5", "LM10", "LM30"],
            miasms: ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancerinic"],
            locations: ["Baner Clinic, Pune", "Koregaon Park Clinic, Pune", "Mumbai OPD"],
            doctors: ["Dr. Narayan Jethwani", "Dr. R. Jethwani"],
            packages: [
                { name: "Standard Consult", price: 300 },
                { name: "Acute Care Plan", price: 1500 },
                { name: "3-Month Chronic", price: 4500 },
                { name: "6-Month Advanced", price: 8500 },
                { name: "1-Year Premium", price: 15000 }
            ]
        };
        if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
                if (patientSnap.exists) {
                    const patientData = patientSnap.data();
                    if (patientData?.configDb) {
                        configDb = patientData.configDb;
                    }
                }
            }
            catch (dbErr) {
                console.error("Firestore patient configDb fetch failed:", dbErr);
            }
        }
        return server_1.NextResponse.json({ success: true, configDb });
    }
    catch (error) {
        console.error("Fetch Config DB failed:", error);
        return server_1.NextResponse.json({ success: false, message: "Failed to fetch Config DB.", error: error.message || error }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const { patientId, configDb, sheetId: clientSheetId } = await request.json();
        if (!patientId || !configDb) {
            return server_1.NextResponse.json({ success: false, message: "Missing patientId or configDb parameter." }, { status: 400 });
        }
        let sheetId = clientSheetId || "mock-sheet-id";
        // 1. Fetch patient document to get sheetId only if not provided by client
        if ((!sheetId || sheetId === "mock-sheet-id") && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
                if (patientSnap.exists) {
                    const patientData = patientSnap.data();
                    sheetId = patientData?.sheetId || "mock-sheet-id";
                }
            }
            catch (dbErr) {
                console.error("Firestore patient fetch failed in export-config:", dbErr);
            }
        }
        // 2. If sheetId exists, push the config values to the patient's Google Sheet
        if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
            try {
                await (0, googleDrive_1.syncConfigDbToClinicalSheet)(sheetId, configDb);
            }
            catch (sheetErr) {
                console.warn("Failed to push Config DB to Google Sheets, falling back to Firestore only:", sheetErr);
            }
        }
        // 3. Update Firestore with the configDb object
        if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                await getAdminDb().collection("patients").doc(patientId).update({
                    configDb: configDb,
                    configDbUpdated: new Date().toISOString()
                });
            }
            catch (dbUpdateErr) {
                console.error("Firestore configDb update failed in export-config:", dbUpdateErr);
            }
        }
        else {
            console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore update.");
        }
        return server_1.NextResponse.json({
            success: true,
            message: "Config DB updated in Firestore and Google Sheet successfully."
        });
    }
    catch (error) {
        console.error("Export Config DB failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to export Config DB.",
            error: error.message || error
        }, { status: 500 });
    }
}
