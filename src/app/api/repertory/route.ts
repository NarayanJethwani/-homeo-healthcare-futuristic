import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const kentPath = path.join(process.cwd(), "src", "lib", "kentRepertoryData.json");
    const boerickePath = path.join(process.cwd(), "src", "lib", "boerickeRepertoryData.json");

    console.log(`Loading classic repertories dynamically on server...`);

    let kentData = [];
    let boerickeData = [];

    if (fs.existsSync(kentPath)) {
      const raw = fs.readFileSync(kentPath, "utf-8");
      kentData = JSON.parse(raw);
    } else {
      console.warn(`Kent repertory file not found at ${kentPath}`);
    }

    if (fs.existsSync(boerickePath)) {
      const raw = fs.readFileSync(boerickePath, "utf-8");
      boerickeData = JSON.parse(raw);
    } else {
      console.warn(`Boericke repertory file not found at ${boerickePath}`);
    }

    return NextResponse.json({
      success: true,
      kent: kentData,
      boericke: boerickeData
    });
  } catch (error: any) {
    console.error("Repertory API failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load repertory database.",
        error: error.message || error
      },
      { status: 500 }
    );
  }
}
