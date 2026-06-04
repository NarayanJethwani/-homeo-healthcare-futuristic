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
      console.warn("GEMINI_API_KEY not configured. Operating in mock mode for file extraction.");
      // Return mock extracted patient details for development/demo purposes
      return NextResponse.json({
        success: true,
        patient: {
          name: fileName ? fileName.replace(/\.[^/.]+$/, "") : "Devendra Sharma",
          age: "48",
          gender: "Male",
          email: "devendra.sharma@outlook.com",
          phone: "+91 94420 33812",
          city: "Baner, Pune",
          state: "Maharashtra",
          complaint: "Chronic asthma and respiratory congestion, worse during cold winds. Has dry skin patches on knees with mild itching.",
          rubrics: "Asthma (3); Cough (2); Skin itching (2)"
        }
      });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" }); // Multimodal model supporting pdf/images

    const prompt = `You are a medical clinical uploader assistant. Analyze the uploaded patient record/case sheet and extract the patient's demographic information and symptoms.
Return ONLY a valid JSON object matching the following structure. Do not include markdown code block syntax (like \`\`\`json) or extra text - return only the raw JSON string:
{
  "name": "Patient Full Name",
  "age": "Age in years (number only, or empty string)",
  "gender": "Male or Female",
  "email": "Email address if found, or empty string",
  "phone": "Phone number if found, or empty string",
  "city": "City name if found, or empty string",
  "state": "State name if found, or empty string",
  "complaint": "Chief complaint or detailed symptom history",
  "rubrics": "Semicolon separated list of symptom rubrics with intensity if possible, e.g. 'Asthma (3); Cough (2)'"
}

Extract values accurately from the file. If certain fields are not found, leave them as empty strings. Make sure the JSON is valid.`;

    let responseText = "";

    if (mimeType.startsWith("text/")) {
      const rawText = Buffer.from(fileData, "base64").toString("utf-8");
      const result = await model.generateContent([
        prompt + "\n\nFile contents:\n" + rawText
      ]);
      responseText = await result.response.text();
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

    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith("```")) {
      cleanJsonStr = cleanJsonStr.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsedData = JSON.parse(cleanJsonStr);
    return NextResponse.json({
      success: true,
      patient: parsedData
    });

  } catch (error: any) {
    console.error("AI file extraction failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to extract patient details using AI.",
      error: error.message || error
    }, { status: 500 });
  }
}
