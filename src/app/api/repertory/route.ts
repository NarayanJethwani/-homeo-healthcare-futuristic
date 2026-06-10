import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Try multiple paths for Vercel compatibility
    const possibleBasePaths = [
      path.join(process.cwd(), "public", "data"),        // Vercel serverless (public/ is at cwd)
      path.join(process.cwd(), "src", "lib"),             // Local development fallback
      path.join(process.cwd(), ".next", "server", "app"), // Next.js output
    ];

    console.log(`Loading classic repertories dynamically on server...`);

    let kentData: any[] = [];
    let boerickeData: any[] = [];

    // Try to load Kent data
    for (const basePath of possibleBasePaths) {
      const kentPath = path.join(basePath, "kentRepertoryData.json");
      if (fs.existsSync(kentPath)) {
        try {
          const raw = fs.readFileSync(kentPath, "utf-8");
          kentData = JSON.parse(raw);
          console.log(`Loaded Kent repertory from ${kentPath}: ${kentData.length} rubrics`);
          break;
        } catch (e) {
          console.warn(`Failed to parse Kent data from ${kentPath}:`, e);
        }
      }
    }

    // Try to load Boericke data
    for (const basePath of possibleBasePaths) {
      const boerickePath = path.join(basePath, "boerickeRepertoryData.json");
      if (fs.existsSync(boerickePath)) {
        try {
          const raw = fs.readFileSync(boerickePath, "utf-8");
          boerickeData = JSON.parse(raw);
          console.log(`Loaded Boericke repertory from ${boerickePath}: ${boerickeData.length} rubrics`);
          break;
        } catch (e) {
          console.warn(`Failed to parse Boericke data from ${boerickePath}:`, e);
        }
      }
    }

    if (kentData.length === 0) {
      console.warn("Kent repertory data not found in any path. Will serve empty.");
    }
    if (boerickeData.length === 0) {
      console.warn("Boericke repertory data not found in any path. Will serve empty.");
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
