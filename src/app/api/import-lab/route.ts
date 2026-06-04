import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { fileData, mimeType, fileName } = await request.json();
    if (!fileData) {
      return NextResponse.json({ success: false, message: "File data is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Operating in mock mode for lab report extraction.");
      return NextResponse.json({
        success: true,
        text: "Complete Blood Count (CBC):\n- Hemoglobin: 10.2 g/dL (LOW)\n- White Blood Cells: 6.8 x10^3/uL\n- Red Blood Cells: 3.8 x10^6/uL\n- Platelets: 245 x10^3/uL\n\nThyroid Function Panel:\n- TSH: 8.4 uIU/mL (HIGH)\n- Free T4: 0.9 ng/dL (Normal)\n- Free T3: 2.1 pg/mL"
      });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" }); // Multimodal model supporting pdf/images

    const prompt = `You are an expert medical transcriptionist. Extract all text, laboratory values, metrics, reference ranges, and clinical notes from the uploaded laboratory report/medical file.
Return the extracted text in a clean, readable format, preserving all numeric values, units, and markers. Do not add markdown styling, return only the plain text.`;

    let responseText = "";

    if (mimeType.startsWith("text/")) {
      const rawText = Buffer.from(fileData, "base64").toString("utf-8");
      responseText = rawText;
    } else {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType,
            data: fileData
          }
        },
        prompt
      ]);
      responseText = await result.response.text();
    }

    return NextResponse.json({
      success: true,
      text: responseText.trim()
    });

  } catch (error: any) {
    console.error("AI lab file extraction failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to extract lab report text using AI.",
      error: error.message || error
    }, { status: 500 });
  }
}
