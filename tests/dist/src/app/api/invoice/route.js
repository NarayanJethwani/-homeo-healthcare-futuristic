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
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const adminSession_1 = require("@/lib/adminSession");
function jsonResponse(body, status = 200) {
    const response = server_1.NextResponse.json(body, { status });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
async function requireAdminSession(request) {
    const session = await (0, adminSession_1.verifyAdminSessionCookie)(request.cookies.get(adminSession_1.ADMIN_SESSION_COOKIE)?.value);
    return session;
}
function getInvoicePreviewUrl(invoiceNo) {
    return `/admin/invoice-preview?invoiceNo=${encodeURIComponent(invoiceNo)}`;
}
async function GET(request) {
    try {
        const session = await requireAdminSession(request);
        if (!session) {
            return jsonResponse({ success: false, message: "Authentication required." }, 401);
        }
        const invoiceNo = request.nextUrl.searchParams.get("invoiceNo")?.trim();
        if (!invoiceNo) {
            return jsonResponse({ success: false, message: "Missing invoice number." }, 400);
        }
        const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
        const invoiceDoc = await getAdminDb().collection("invoices").doc(invoiceNo).get();
        if (!invoiceDoc.exists) {
            return jsonResponse({ success: false, message: "Invoice not found." }, 404);
        }
        return jsonResponse({ success: true, invoice: invoiceDoc.data() });
    }
    catch (error) {
        console.error("Invoice lookup failed:", error?.message || error);
        return jsonResponse({ success: false, message: "Failed to load invoice." }, 500);
    }
}
async function POST(request) {
    try {
        const session = await requireAdminSession(request);
        if (!session) {
            return jsonResponse({ success: false, message: "Authentication required." }, 401);
        }
        const body = await request.json();
        // Structure invoice data
        const invoiceData = {
            invoiceNo: body.invoiceNo,
            date: body.date,
            dueDate: body.dueDate,
            patientId: body.patientId,
            patientName: body.patientName,
            patientPhone: body.patientPhone || "",
            patientEmail: body.patientEmail || "",
            patientAddress: body.patientAddress || "",
            items: body.items || [],
            subtotal: Number(body.subtotal || 0),
            discount: Number(body.discount || 0),
            grandTotal: Number(body.grandTotal || 0),
            paymentMode: body.paymentMode || "UPI",
            status: body.status || "Pending"
        };
        console.log(`Processing invoice ${invoiceData.invoiceNo} for patient ${invoiceData.patientId}`);
        // Google folder ID and case sheet ID
        const folderId = body.folderId;
        const caseSheetId = body.caseSheetId;
        let invoiceSheetId = "mock-invoice-id";
        let invoiceSheetUrl = "";
        // 1. Create Google Sheet Invoice inside the patient folder
        if (folderId && folderId !== "mock-folder-id") {
            try {
                const { createInvoiceSheet } = await Promise.resolve().then(() => __importStar(require("@/lib/googleDrive")));
                const result = await createInvoiceSheet(folderId, invoiceData);
                invoiceSheetId = result.sheetId;
                invoiceSheetUrl = result.sheetUrl;
            }
            catch (err) {
                console.error("Google Drive Invoice creation failed, falling back to mock:", err);
                invoiceSheetUrl = getInvoicePreviewUrl(invoiceData.invoiceNo);
            }
        }
        else {
            // Offline/Mock mode fallback
            invoiceSheetUrl = getInvoicePreviewUrl(invoiceData.invoiceNo);
        }
        // 2. Append row to patient's primary Clinical Case Sheet
        if (caseSheetId && caseSheetId !== "mock-sheet-id" && invoiceSheetId !== "mock-invoice-id") {
            try {
                const { appendInvoiceToClinicalSheet } = await Promise.resolve().then(() => __importStar(require("@/lib/googleDrive")));
                await appendInvoiceToClinicalSheet(caseSheetId, invoiceData);
            }
            catch (err) {
                console.error("Failed to append invoice row to clinical sheet:", err);
            }
        }
        // 3. Save to Firestore under 'invoices' collection
        const invoiceDoc = {
            id: invoiceData.invoiceNo,
            patientId: invoiceData.patientId,
            patientName: invoiceData.patientName,
            patientPhone: invoiceData.patientPhone,
            patientEmail: invoiceData.patientEmail,
            date: invoiceData.date,
            dueDate: invoiceData.dueDate,
            items: invoiceData.items,
            subtotal: invoiceData.subtotal,
            discount: invoiceData.discount,
            grandTotal: invoiceData.grandTotal,
            paymentMode: invoiceData.paymentMode,
            status: invoiceData.status,
            sheetId: invoiceSheetId,
            sheetUrl: invoiceSheetUrl,
            previewUrl: getInvoicePreviewUrl(invoiceData.invoiceNo),
            createdAt: new Date().toISOString()
        };
        const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
        if (!isMockProject) {
            const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
            await getAdminDb().collection("invoices").doc(invoiceDoc.id).set(invoiceDoc);
        }
        else {
            console.log("Firebase operating in mock mode. Skipping invoices Firestore write.");
        }
        return jsonResponse({
            success: true,
            message: "Invoice generated and synced successfully.",
            invoiceNo: invoiceData.invoiceNo,
            sheetUrl: invoiceSheetUrl,
            previewUrl: getInvoicePreviewUrl(invoiceData.invoiceNo),
            isMock: invoiceSheetId === "mock-invoice-id"
        });
    }
    catch (error) {
        console.error("Invoice generation handler failed:", error);
        return jsonResponse({
            success: false,
            message: "Failed to process invoice creation."
        }, 500);
    }
}
