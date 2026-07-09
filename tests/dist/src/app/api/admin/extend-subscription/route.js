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
 * POST /api/admin/extend-subscription
 *
 * Admin-only: extends (or starts trial for) a doctor's subscription.
 *
 * Body:
 *   doctorUid  – The doctor's Firebase UID
 *   plan       – "trial" | "monthly" | "quarterly" | "annual"
 *   note?      – Optional note (e.g. "Paid via UPI - screenshot confirmed")
 */
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        if (session.role !== "admin")
            return (0, adminApiAuth_1.forbiddenApiResponse)();
        const body = await request.json();
        const { doctorUid, plan, note = "" } = body;
        if (!doctorUid || !plan) {
            return server_1.NextResponse.json({ success: false, message: "doctorUid and plan are required." }, { status: 400 });
        }
        const validUntil = computeValidUntil(plan);
        const renewedAt = new Date().toISOString();
        const subscriptionUpdate = {
            "subscription.plan": plan,
            "subscription.validUntil": validUntil,
            "subscription.status": "active",
            "subscription.renewedAt": renewedAt,
            "subscription.note": note,
        };
        const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";
        if (isFirebaseConfigured) {
            const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
            // Update both users/{uid} and doctors/{uid} so both collections stay in sync
            const batch = getAdminDb().batch();
            batch.update(getAdminDb().collection("users").doc(doctorUid), subscriptionUpdate);
            batch.update(getAdminDb().collection("doctors").doc(doctorUid), subscriptionUpdate);
            await batch.commit();
        }
        else {
            console.log("[MOCK] Would extend subscription for:", doctorUid, plan, validUntil);
        }
        return server_1.NextResponse.json({
            success: true,
            message: `Subscription extended to ${plan} plan. Valid until ${validUntil}.`,
            doctorUid,
            plan,
            validUntil,
            renewedAt,
        });
    }
    catch (error) {
        console.error("extend-subscription error:", error);
        return server_1.NextResponse.json({ success: false, message: error.message || "Failed to extend subscription." }, { status: 500 });
    }
}
/** Compute ISO date (YYYY-MM-DD) from today based on plan */
function computeValidUntil(plan) {
    if (plan === "branch")
        return "2099-12-31"; // Permanent access for branch doctors
    const d = new Date();
    switch (plan) {
        case "trial":
            d.setDate(d.getDate() + 14);
            break; // 14-day trial
        case "monthly":
            d.setMonth(d.getMonth() + 1);
            break;
        case "quarterly":
            d.setMonth(d.getMonth() + 3);
            break;
        case "annual":
            d.setFullYear(d.getFullYear() + 1);
            break;
        default:
            d.setMonth(d.getMonth() + 1);
            break;
    }
    return d.toISOString().split("T")[0];
}
