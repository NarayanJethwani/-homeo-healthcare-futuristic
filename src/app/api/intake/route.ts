import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { 
  createPatientFolder, 
  createPatientClinicalSheet, 
  appendPatientToMasterRecord,
  PatientIntakeData 
} from "@/lib/googleDrive";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract patient intake data
    const patientData: PatientIntakeData = {
      id: body.id || `P-${Math.floor(100000 + Math.random() * 900000)}`,
      name: body.name,
      age: String(body.age),
      gender: body.gender,
      phone: body.phone,
      email: body.email,
      city: body.city || "N/A",
      state: body.state || "N/A",
      country: body.country || "India",
      complaint: body.complaint,
      careLevel: body.careLevel || "Standard Consultation",
      conditionsCount: Number(body.conditionsCount || 1),
      durationText: body.durationText || "One-Time consultation",
      finalPrice: Number(body.finalPrice || 300),
      deliveryMode: body.deliveryMode || "shipping",
      address: body.address || "",
      receivedAmount: body.receivedAmount !== undefined ? Number(body.receivedAmount) : undefined,
      remainingBalance: body.remainingBalance !== undefined ? Number(body.remainingBalance) : undefined,
      billingCycle: body.billingCycle,
      durationValue: body.durationValue !== undefined ? Number(body.durationValue) : undefined,
      concessionApplied: body.concessionApplied,
      overridePrice: body.overridePrice !== undefined ? Number(body.overridePrice) : undefined,
      medicineAddons: body.medicineAddons !== undefined ? Number(body.medicineAddons) : undefined
    };

    console.log("Processing intake automation for patient:", patientData.name);

    // Check if Google credentials are available before attempting real API calls
    const hasGoogleCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!hasGoogleCredentials) {
      console.warn("GOOGLE_SERVICE_ACCOUNT_KEY not set. Intake operating in mock mode for:", patientData.name);
      
      // Save to Firestore WITHOUT mock sheet URLs — leave them empty for lazy provisioning later
      const patientDoc = {
        id: patientData.id,
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        location: `${patientData.city}, ${patientData.state}, ${patientData.country}`,
        complaint: patientData.complaint,
        careLevel: patientData.careLevel,
        conditionsCount: patientData.conditionsCount,
        durationText: patientData.durationText,
        finalPrice: patientData.finalPrice,
        receivedAmount: Number(body.receivedAmount || patientData.finalPrice),
        remainingBalance: Number(body.remainingBalance || 0),
        deliveryMode: patientData.deliveryMode,
        folderId: "",
        folderUrl: "",
        sheetId: "",
        sheetUrl: "",
        assignedDoctor: body.assignedDoctor || "unassigned",
        status: "active",
        createdAt: new Date().toISOString(),
        billingCycle: patientData.billingCycle || "Monthly",
        concessionApplied: patientData.concessionApplied || "None",
        durationValue: patientData.durationValue || 1
      };

      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
        await adminDb.collection("patients").doc(patientDoc.id).set(patientDoc);
      }

      // Build mock sheet URL for display purposes
      const mockSheetUrl = `/admin/mock-sheet?name=${encodeURIComponent(patientData.name)}` +
        `&id=${encodeURIComponent(patientData.id)}` +
        `&age=${encodeURIComponent(patientData.age)}` +
        `&gender=${encodeURIComponent(patientData.gender)}` +
        `&phone=${encodeURIComponent(patientData.phone)}` +
        `&email=${encodeURIComponent(patientData.email || "")}` +
        `&complaint=${encodeURIComponent(patientData.complaint)}` +
        `&careLevel=${encodeURIComponent(patientData.careLevel)}` +
        `&durationText=${encodeURIComponent(patientData.durationText)}` +
        `&finalPrice=${encodeURIComponent(String(patientData.finalPrice))}`;

      return NextResponse.json({
        success: true,
        isMock: true,
        message: "Patient intake saved. Google Workspace not provisioned (no credentials). Sheet will be created on first access.",
        patientId: patientDoc.id,
        folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
        sheetUrl: mockSheetUrl
      });
    }

    // 1. Create Patient Folder in Google Drive under Parent Folder
    const folderResult = await createPatientFolder(patientData);
    
    // 2. Create Patient Clinical Sheet inside their new Folder
    const sheetResult = await createPatientClinicalSheet(folderResult.folderId, patientData);
    
    // 3. Append summary row to Master Google Sheet
    await appendPatientToMasterRecord(patientData, folderResult.folderUrl, sheetResult.sheetUrl);

    // 4. Save metadata record to Firestore using client-side SDK configuration
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
      folderId: folderResult.folderId,
      folderUrl: folderResult.folderUrl,
      sheetId: sheetResult.sheetId,
      sheetUrl: sheetResult.sheetUrl,
      assignedDoctor: body.assignedDoctor || "unassigned",
      status: "active",
      createdAt: new Date().toISOString(),
      billingCycle: patientData.billingCycle || "Monthly",
      concessionApplied: patientData.concessionApplied || "None",
      durationValue: patientData.durationValue || 1
    };

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      await adminDb.collection("patients").doc(patientDoc.id).set(patientDoc);
    } else {
      console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore write.");
    }

    return NextResponse.json({
      success: true,
      isMock: false,
      message: "Patient intake processed, Google Workspace files created and synced successfully.",
      patientId: patientDoc.id,
      folderUrl: folderResult.folderUrl,
      sheetUrl: sheetResult.sheetUrl
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
