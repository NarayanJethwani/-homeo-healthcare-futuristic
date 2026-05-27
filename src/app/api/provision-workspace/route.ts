import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { 
  createPatientFolder, 
  createPatientClinicalSheet, 
  appendPatientToMasterRecord,
  PatientIntakeData 
} from "@/lib/googleDrive";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, age, gender, phone, email, location, complaint, careLevel, durationText, finalPrice } = body;
    
    if (!id || !name) {
      return NextResponse.json({ success: false, message: "Patient ID and Name are required." }, { status: 400 });
    }

    const patientData: PatientIntakeData = {
      id,
      name,
      age: String(age || "30"),
      gender: gender || "Male",
      phone: phone || "",
      email: email || "",
      city: location || "N/A",
      state: "N/A",
      country: "India",
      complaint: complaint || "N/A",
      careLevel: careLevel || "Standard Consultation",
      conditionsCount: 1,
      durationText: durationText || "One-Time consultation",
      finalPrice: Number(finalPrice || 3500)
    };

    console.log("Dynamically provisioning Google Workspace for patient:", name);

    // Check if the service account credentials exist
    const hasCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!hasCredentials) {
      return NextResponse.json({
        success: true,
        isMock: true,
        folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
        sheetUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link"
      });
    }

    // 1. Create Patient Folder in Google Drive
    const folderResult = await createPatientFolder(patientData);
    
    // 2. Create Patient Clinical Sheet inside Folder
    const sheetResult = await createPatientClinicalSheet(folderResult.folderId, patientData);
    
    // 3. Try to append to Master Record Sheet if possible
    try {
      await appendPatientToMasterRecord(patientData, folderResult.folderUrl, sheetResult.sheetUrl);
    } catch (mErr) {
      console.warn("Could not sync dynamically provisioned patient to Master Record Sheet:", mErr);
    }

    // 4. Update the patient document in Firestore
    const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
    if (!isMockProject) {
      const patientRef = doc(db, "patients", id);
      await updateDoc(patientRef, {
        folderId: folderResult.folderId,
        folderUrl: folderResult.folderUrl,
        sheetId: sheetResult.sheetId,
        sheetUrl: sheetResult.sheetUrl
      });
    }

    return NextResponse.json({
      success: true,
      isMock: false,
      folderUrl: folderResult.folderUrl,
      sheetUrl: sheetResult.sheetUrl
    });

  } catch (error: any) {
    console.error("Dynamic workspace provisioning failed:", error);
    return NextResponse.json({
      success: false,
      message: "Workspace provisioning failed.",
      error: error.message || error
    }, { status: 500 });
  }
}
