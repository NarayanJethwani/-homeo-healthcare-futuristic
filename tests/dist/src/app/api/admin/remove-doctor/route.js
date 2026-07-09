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
exports.POST = POST;
const server_1 = require("next/server");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
/**
 * POST /api/admin/remove-doctor
 *
 * Admin-only: deletes/removes a doctor from the system.
 *   1. Deletes the doctor from Firebase Auth (if configured)
 *   2. Deletes the user profile in Firestore (users/{uid})
 *   3. Deletes the doctor workspace metadata in Firestore (doctors/{uid})
 *   NOTE: Patient documents are preserved (assignedDoctor remains the doctor's UID)
 *
 * Body:
 *   doctorUid - The doctor's Firebase UID
 */
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        if (session.role !== "admin")
            return (0, adminApiAuth_1.forbiddenApiResponse)();
        const body = await request.json();
        const { doctorUid } = body;
        if (!doctorUid) {
            return server_1.NextResponse.json({ success: false, message: "doctorUid is required." }, { status: 400 });
        }
        const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";
        if (isFirebaseConfigured) {
            const { getAdminAuth, getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
            // 1. Delete from Firebase Auth
            try {
                await getAdminAuth().deleteUser(doctorUid);
                console.log(`Successfully deleted auth user: ${doctorUid}`);
            }
            catch (authErr) {
                console.warn(`Could not delete Auth user ${doctorUid} (it may not exist):`, authErr.message);
            }
            // 2. Delete Firestore documents
            const batch = getAdminDb().batch();
            batch.delete(getAdminDb().collection("users").doc(doctorUid));
            batch.delete(getAdminDb().collection("doctors").doc(doctorUid));
            await batch.commit();
            console.log(`Successfully deleted Firestore docs for: ${doctorUid}`);
        }
        else {
            console.log("[MOCK] Would remove doctor:", doctorUid);
        }
        return server_1.NextResponse.json({
            success: true,
            message: "Doctor successfully removed from the system. Patient records preserved.",
            doctorUid,
        });
    }
    catch (error) {
        console.error("remove-doctor error:", error);
        return server_1.NextResponse.json({ success: false, message: error.message || "Failed to remove doctor." }, { status: 500 });
    }
}
