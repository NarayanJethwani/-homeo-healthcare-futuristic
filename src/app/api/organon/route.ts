import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const organonPath = path.join(process.cwd(), "src", "lib", "organon6thFull.json");
    if (!fs.existsSync(organonPath)) {
      return NextResponse.json({ success: false, error: "Database not generated" }, { status: 404 });
    }
    const raw = fs.readFileSync(organonPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Organon API failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Organon database.",
        error: error.message || error
      },
      { status: 500 }
    );
  }
}
