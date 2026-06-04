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
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const response = await model.generateContent("Hello, are you active? Reply in one sentence.");
    console.log("Success! Response text:", response.response.text());
  } catch (err: any) {
    console.error("Gemini API request failed:", err.message || err);
  }
}

test();
