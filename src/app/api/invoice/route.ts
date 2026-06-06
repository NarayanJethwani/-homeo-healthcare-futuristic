import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { 
  createInvoiceSheet, 
  appendInvoiceToClinicalSheet, 
  InvoiceData 
} from "@/lib/googleDrive";

export async function POST(request: Request) {
  try {
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

    console.log(`Processing invoice ${invoiceData.invoiceNo} for patient ${invoiceData.patientName}`);

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
        invoiceSheetUrl = `/admin/invoice-preview?invoiceNo=${encodeURIComponent(invoiceData.invoiceNo)}&date=${encodeURIComponent(invoiceData.date)}&dueDate=${encodeURIComponent(invoiceData.dueDate)}&patientId=${encodeURIComponent(invoiceData.patientId)}&patientName=${encodeURIComponent(invoiceData.patientName)}&patientPhone=${encodeURIComponent(invoiceData.patientPhone)}&patientEmail=${encodeURIComponent(invoiceData.patientEmail)}&patientAddress=${encodeURIComponent(invoiceData.patientAddress)}&subtotal=${invoiceData.subtotal}&discount=${invoiceData.discount}&grandTotal=${invoiceData.grandTotal}&paymentMode=${encodeURIComponent(invoiceData.paymentMode)}&status=${encodeURIComponent(invoiceData.status)}&items=${encodeURIComponent(JSON.stringify(invoiceData.items))}`;
      }
    } else {
      // Offline/Mock mode fallback
      invoiceSheetUrl = `/admin/invoice-preview?invoiceNo=${encodeURIComponent(invoiceData.invoiceNo)}&date=${encodeURIComponent(invoiceData.date)}&dueDate=${encodeURIComponent(invoiceData.dueDate)}&patientId=${encodeURIComponent(invoiceData.patientId)}&patientName=${encodeURIComponent(invoiceData.patientName)}&patientPhone=${encodeURIComponent(invoiceData.patientPhone)}&patientEmail=${encodeURIComponent(invoiceData.patientEmail)}&patientAddress=${encodeURIComponent(invoiceData.patientAddress)}&subtotal=${invoiceData.subtotal}&discount=${invoiceData.discount}&grandTotal=${invoiceData.grandTotal}&paymentMode=${encodeURIComponent(invoiceData.paymentMode)}&status=${encodeURIComponent(invoiceData.status)}&items=${encodeURIComponent(JSON.stringify(invoiceData.items))}`;
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
      createdAt: new Date().toISOString()
    };

    const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
    if (!isMockProject) {
      await adminDb.collection("invoices").doc(invoiceDoc.id).set(invoiceDoc);
    } else {
      console.log("Firebase operating in mock mode. Skipping invoices Firestore write.");
    }

    return NextResponse.json({
      success: true,
      message: "Invoice generated and synced successfully.",
      invoiceNo: invoiceData.invoiceNo,
      sheetUrl: invoiceSheetUrl,
      isMock: invoiceSheetId === "mock-invoice-id"
    });

  } catch (error: any) {
    console.error("Invoice generation handler failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process invoice creation.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
