import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import type { InvoiceData } from "@/lib/googleDrive";
import { validateInvoiceWorkflow } from "@/lib/invoiceWorkflow";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function requireAdminSession(request: NextRequest) {
  const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  return session;
}

function getInvoicePreviewUrl(invoiceNo: string) {
  return `/admin/invoice-preview?invoiceNo=${encodeURIComponent(invoiceNo)}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return jsonResponse({ success: false, message: "Authentication required." }, 401);
    }

    const invoiceNo = request.nextUrl.searchParams.get("invoiceNo")?.trim();
    if (!invoiceNo) {
      return jsonResponse({ success: false, message: "Missing invoice number." }, 400);
    }

    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const invoiceDoc = await getAdminDb().collection("invoices").doc(invoiceNo).get();
    if (!invoiceDoc.exists) {
      return jsonResponse({ success: false, message: "Invoice not found." }, 404);
    }

    return jsonResponse({ success: true, invoice: invoiceDoc.data() });
  } catch (error: any) {
    console.error("Invoice lookup failed:", error?.message || error);
    return jsonResponse({ success: false, message: "Failed to load invoice." }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return jsonResponse({ success: false, message: "Authentication required." }, 401);
    }

    const body = await request.json();
    const invoiceNo = typeof body.invoiceNo === "string" ? body.invoiceNo.trim() : "";
    const patientId = typeof body.patientId === "string" ? body.patientId.trim() : "";
    const patientName = typeof body.patientName === "string" ? body.patientName.trim() : "";
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!invoiceNo || !/^[A-Za-z0-9._-]+$/.test(invoiceNo)) {
      return jsonResponse({ success: false, message: "Enter a valid invoice number." }, 400);
    }
    if (!patientId || !patientName) {
      return jsonResponse({ success: false, message: "Select an existing patient before generating the invoice." }, 400);
    }
    const invoiceSource = body.invoiceSource === "confirmed-quotation" ? "confirmed-quotation" : "manual-administrative";
    const manualOverrideReason = typeof body.manualOverrideReason === "string" ? body.manualOverrideReason.trim() : "";
    const concessionReason = typeof body.concessionReason === "string" ? body.concessionReason.trim() : "";
    const workflowError = validateInvoiceWorkflow({ ...body, invoiceSource, manualOverrideReason, concessionReason });
    if (workflowError) return jsonResponse({ success: false, message: workflowError }, 400);

    const items: Array<{ description: string; qty: number; unitPrice: number; amount: number }> = rawItems.map((item: any) => {
      const description = typeof item?.description === "string" ? item.description.trim() : "";
      const qty = Number(item?.qty);
      const unitPrice = Number(item?.unitPrice);
      return { description, qty, unitPrice, amount: qty * unitPrice };
    });
    const invalidItem = items.some((item) =>
      !item.description ||
      !Number.isFinite(item.qty) || item.qty <= 0 ||
      !Number.isFinite(item.unitPrice) || item.unitPrice < 0
    );
    if (items.length === 0 || invalidItem) {
      return jsonResponse({ success: false, message: "Add at least one valid invoice item." }, 400);
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const requestedDiscount = Number(body.discount || 0);
    const discount = Number.isFinite(requestedDiscount) ? Math.min(Math.max(0, requestedDiscount), subtotal) : 0;

    // Structure invoice data
    const invoiceData: InvoiceData = {
      invoiceNo,
      date: body.date,
      dueDate: body.dueDate,
      patientId,
      patientName,
      patientPhone: body.patientPhone || "",
      patientEmail: body.patientEmail || "",
      patientAddress: body.patientAddress || "",
      items,
      subtotal,
      discount,
      grandTotal: subtotal - discount,
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
        const { createInvoiceSheet } = await import("@/lib/googleDrive");
        const result = await createInvoiceSheet(folderId, invoiceData);
        invoiceSheetId = result.sheetId;
        invoiceSheetUrl = result.sheetUrl;
      } catch (err) {
        console.error("Google Drive Invoice creation failed, falling back to mock:", err);
        invoiceSheetUrl = getInvoicePreviewUrl(invoiceData.invoiceNo);
      }
    } else {
      // Offline/Mock mode fallback
      invoiceSheetUrl = getInvoicePreviewUrl(invoiceData.invoiceNo);
    }

    // 2. Append row to patient's primary Clinical Case Sheet
    if (caseSheetId && caseSheetId !== "mock-sheet-id" && invoiceSheetId !== "mock-invoice-id") {
      try {
        const { appendInvoiceToClinicalSheet } = await import("@/lib/googleDrive");
        await appendInvoiceToClinicalSheet(caseSheetId, invoiceData);
      } catch (err) {
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
      invoiceSource,
      manualOverrideReason,
      concessionReason,
      quotationId: body.quotationId || "",
      approvalStatus: body.approvalStatus || "",
      physicianConfirmed: body.physicianConfirmed === true,
      confirmedAt: body.confirmedAt || "",
      pricingRuleVersion: body.pricingRuleVersion || "",
      sheetId: invoiceSheetId,
      sheetUrl: invoiceSheetUrl,
      previewUrl: getInvoicePreviewUrl(invoiceData.invoiceNo),
      createdAt: new Date().toISOString()
    };

    const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
    if (!isMockProject) {
      const { getAdminDb } = await import("@/lib/firebaseAdmin");
      await getAdminDb().collection("invoices").doc(invoiceDoc.id).set(invoiceDoc);
    } else {
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

  } catch (error: any) {
    console.error("Invoice generation handler failed:", error);
    return jsonResponse(
      { 
        success: false, 
        message: "Failed to process invoice creation."
      },
      500
    );
  }
}
