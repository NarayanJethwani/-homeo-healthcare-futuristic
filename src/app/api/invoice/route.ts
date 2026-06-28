import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import { 
  createInvoiceSheet, 
  appendInvoiceToClinicalSheet, 
  InvoiceData 
} from "@/lib/googleDrive";

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
    
    // Structure invoice data
    const invoiceData: InvoiceData = {
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
      sheetId: invoiceSheetId,
      sheetUrl: invoiceSheetUrl,
      previewUrl: getInvoicePreviewUrl(invoiceData.invoiceNo),
      createdAt: new Date().toISOString()
    };

    const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
    if (!isMockProject) {
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
