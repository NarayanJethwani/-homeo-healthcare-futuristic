import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not configured.");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const response = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: "Respond in JSON format: { \"status\": \"active\", \"msg\": \"hello\" }" }] }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });
    console.log("Success! Response text:", response.response.text());
  } catch (err: any) {
    console.error("Gemini API request failed:", err.message || err);
  }
}

test();

