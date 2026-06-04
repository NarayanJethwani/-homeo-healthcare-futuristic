async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not configured.");
    process.exit(1);
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if (data.models) {
      console.log("Supported Models:");
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (${m.displayName})`);
      });
    } else {
      console.log("No models returned in response:", data);
    }
  } catch (err: any) {
    console.error("Request failed:", err.message || err);
  }
}

test();
