import { NextRequest, NextResponse } from "next/server";
import { downloadFileFromGoogleDrive } from "@/lib/googleDrive";
import { forbiddenApiResponse, requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdminApiSession(request);
    if (!session) return unauthorizedApiResponse();
    if (session.role !== "admin") return forbiddenApiResponse();

    const fileId = process.env.GOOGLE_DRIVE_REMEDY_PACK_FILE_ID;
    
    if (!fileId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "GOOGLE_DRIVE_REMEDY_PACK_FILE_ID is not configured in your .env.local file." 
        },
        { status: 400 }
      );
    }

    const destPath = path.join(process.cwd(), "src/lib/remedyDataPack.json");
    console.log(`Starting Google Drive sync for file ID: ${fileId} into target path: ${destPath}`);

    const success = await downloadFileFromGoogleDrive(fileId, destPath);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Successfully synchronized Materia Medica remedy pack from Google Drive!",
        fileId,
        destination: "src/lib/remedyDataPack.json"
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to download file from Google Drive. Check server console logs or GOOGLE_SERVICE_ACCOUNT_KEY permissions." 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Sync books endpoint failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred during synchronization.",
        error: error.message || error
      },
      { status: 500 }
    );
  }
}
