import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Rubric ID is required." }, { status: 400 });
    }

    const docRef = adminDb.collection("rubrics").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ success: false, message: "Rubric not found." }, { status: 404 });
    }

    const data = docSnap.data();

    if (data?.status === "custom") {
      // Custom rubrics can be permanently deleted
      await docRef.delete();
      return NextResponse.json({
        success: true,
        message: "Custom rubric permanently deleted."
      });
    } else {
      // Standard rubrics are archived (soft deleted)
      await docRef.update({
        status: "archived",
        modifiedDate: new Date().toISOString()
      });
      return NextResponse.json({
        success: true,
        message: "Standard rubric archived successfully."
      });
    }
  } catch (error: any) {
    console.error("Repertory Delete API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete/archive rubric.",
      error: error.message || error
    }, { status: 500 });
  }
}
