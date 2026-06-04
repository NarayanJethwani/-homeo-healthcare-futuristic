import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not configured.");
    process.exit(1);
  }

  try {
    // Standard fetch to list models
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error("Request failed:", err.message || err);
  }
}

test();
