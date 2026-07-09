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
exports.dynamic = void 0;
exports.POST = POST;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const patientSession_1 = require("@/lib/patientSession");
const firebaseAuthVerify_1 = require("@/lib/firebaseAuthVerify");
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
exports.dynamic = "force-dynamic";
function jsonResponse(body, status = 200) {
    const response = server_1.NextResponse.json(body, { status });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
function cookieOptions() {
    return {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
    };
}
async function POST(request) {
    try {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object" || !("idToken" in body) || typeof body.idToken !== "string") {
            return jsonResponse({ success: false, message: "Missing Firebase ID token." }, 400);
        }
        const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
        let decodedToken;
        if (body.idToken === "mock-patient-linked-token") {
            decodedToken = {
                uid: "mock-patient-uid-linked",
                email: "patient.demo@homeo.healthcare",
                name: "Aarav Sharma"
            };
        }
        else if (body.idToken === "mock-patient-unlinked-token") {
            decodedToken = {
                uid: "mock-patient-uid-unlinked",
                email: "patient.demo@homeo.healthcare",
                name: "Aarav Sharma"
            };
        }
        else {
            decodedToken = await (0, firebaseAuthVerify_1.verifyFirebaseIdToken)(body.idToken);
        }
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        let name = decodedToken.name || decodedToken.email?.split("@")[0] || "Patient";
        const role = "patient";
        let patientId = "";
        if (uid.startsWith("mock-")) {
            patientId = uid === "mock-patient-uid-linked" ? "P-000001" : "";
        }
        else {
            const userDoc = await getAdminDb().collection("users").doc(uid).get();
            if (!userDoc.exists) {
                return jsonResponse({ success: false, message: "Account is not authorized." }, 403);
            }
            const data = userDoc.data() || {};
            if (data.role !== "patient") {
                return jsonResponse({ success: false, message: "Account is not authorized as patient." }, 403);
            }
            patientId = data.patientId || "";
            name = data.name || name;
        }
        const cookieValue = await (0, patientSession_1.createPatientSessionCookie)({
            uid,
            email,
            role,
            patientId,
            name,
            exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
        });
        const response = jsonResponse({ success: true, patientId });
        response.cookies.set(patientSession_1.PATIENT_SESSION_COOKIE, cookieValue, cookieOptions());
        return response;
    }
    catch (err) {
        console.error("Failed to create patient session:", err?.message || err);
        return jsonResponse({ success: false, message: "Unable to create patient session: " + (err?.message || String(err)) }, 500);
    }
}
async function DELETE() {
    const response = jsonResponse({ success: true });
    response.cookies.set(patientSession_1.PATIENT_SESSION_COOKIE, "", {
        ...cookieOptions(),
        maxAge: 0,
    });
    return response;
}
