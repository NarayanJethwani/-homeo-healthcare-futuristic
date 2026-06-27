import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { JETHWANI_REPERTORY_DATA } from "@/lib/repertoryData";

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

    // Load Jethwani clinical rubrics from Firestore with fallback
    let jethwaniData: any[] = [];
    try {
      const rubricsSnap = await getAdminDb().collection("rubrics").where("status", "==", "active").get();
      rubricsSnap.forEach((doc: any) => {
        jethwaniData.push(doc.data());
      });
      
      if (jethwaniData.length === 0) {
        console.warn("Jethwani rubrics collection is empty. Loading fallback data.");
        jethwaniData = JETHWANI_REPERTORY_DATA;
      } else {
        console.log(`Loaded ${jethwaniData.length} Jethwani rubrics from Firestore.`);
      }
    } catch (e) {
      console.warn("Failed to load Jethwani rubrics from Firestore. Using local fallback:", e);
      jethwaniData = JETHWANI_REPERTORY_DATA;
    }

    return NextResponse.json({
      success: true,
      kent: kentData,
      boericke: boerickeData,
      jethwani: jethwaniData
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
