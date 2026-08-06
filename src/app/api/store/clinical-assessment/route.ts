import { NextRequest, NextResponse } from "next/server";
import { processCareAssessmentSubmission } from "@/features/store-clinical-care/services/careAssessmentService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = processCareAssessmentSubmission(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}
