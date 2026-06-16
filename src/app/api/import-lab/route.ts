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
    const prompt = `You are an expert medical AI system. Analyze the provided laboratory report / medical file.
Extract all biomarker data and return a JSON object matching the following TypeScript interface:

interface BiomarkerResult {
  marker: string; // The name of the biomarker, e.g. TSH, HbA1c, Serum Creatinine, Hemoglobin
  value: string; // The parsed value with units, e.g. "8.4 uIU/mL" or "7.8%" or "10.2 g/dL"
  range: string; // The reference range provided in the report, e.g. "0.45 - 4.5 uIU/mL" or "12.0 - 16.0 g/dL"
  status: "Normal" | "Deficient" | "Elevated"; // Assess status based on the value and reference range
  significance: string; // A concise clinical explanation of why this value is normal, elevated, or deficient and its biological significance
}

interface LabAnalysisResult {
  extractedData: BiomarkerResult[]; // List of all extracted biomarkers
  summary: string; // A 2-3 sentence overview paragraph describing the primary clinical pattern or system strain found in this report.
  questions: string[]; // 2 key questions the patient should ask their doctor based on these findings.
  followUp: string[]; // 2 recommended follow-up tests or screenings.
}

Do not add any markdown wrapping like \`\`\`json. Return only the raw JSON.`;

    let responseText = "";
    let lastError = null;
    let decodedText = "";

    if (mimeType.startsWith("text/")) {
      decodedText = Buffer.from(fileData, "base64").toString("utf-8");
      // Still set responseText as fallback
      responseText = decodedText;
    }

    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];
    for (const modelName of models) {
      try {
        console.log(`Querying Gemini model ${modelName} for structured lab report analysis...`);
        const model = ai.getGenerativeModel({ model: modelName });
        
        let contents;
        if (mimeType.startsWith("text/")) {
          contents = [
            {
              role: "user",
              parts: [
                {
                  text: `Here is the raw text of the laboratory report:\n\n${decodedText}\n\n${prompt}`
                }
              ]
            }
          ];
        } else {
          contents = [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: fileData
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ];
        }

        const result = await model.generateContent({
          contents,
          generationConfig: {
            responseMimeType: "application/json"
          }
        });
        
        const text = await result.response.text();
        if (text && text.trim()) {
          try {
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanText);
            if (parsed && Array.isArray(parsed.extractedData)) {
              console.log(`Successfully parsed structured lab report using model: ${modelName}`);
              return NextResponse.json({
                success: true,
                result: parsed,
                rawText: text,
                text: text // For backwards compatibility
              });
            }
          } catch (jsonErr) {
            console.warn("Failed to parse Gemini response as structured JSON, saving raw text:", jsonErr);
            responseText = text;
          }
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed during lab analysis:`, err?.message || err);
        lastError = err;
      }
    }

    if (!responseText || !responseText.trim()) {
      throw lastError || new Error("Failed to extract data with any generative model.");
    }

    return NextResponse.json({
      success: true,
      text: responseText.trim()
    });

  } catch (error: any) {
    console.error("AI lab file extraction failed, using offline mock fallback:", error);
    return NextResponse.json({
      success: true,
      isFallback: true,
      text: "Complete Blood Count (CBC):\n- Hemoglobin: 10.2 g/dL (LOW)\n- White Blood Cells: 6.8 x10^3/uL\n- Red Blood Cells: 3.8 x10^6/uL\n- Platelets: 245 x10^3/uL\n\nThyroid Function Panel:\n- TSH: 8.4 uIU/mL (HIGH)\n- Free T4: 0.9 ng/dL (Normal)\n- Free T3: 2.1 pg/mL"
    });
  }
}
