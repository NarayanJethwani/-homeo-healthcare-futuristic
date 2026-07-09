"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.dynamic = void 0;
exports.GET = GET;
const server_1 = require("next/server");
const googleDrive_1 = require("@/lib/googleDrive");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
const path_1 = __importDefault(require("path"));
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
async function GET(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        if (session.role !== "admin")
            return (0, adminApiAuth_1.forbiddenApiResponse)();
        const fileId = process.env.GOOGLE_DRIVE_REMEDY_PACK_FILE_ID;
        if (!fileId) {
            return server_1.NextResponse.json({
                success: false,
                message: "GOOGLE_DRIVE_REMEDY_PACK_FILE_ID is not configured in your .env.local file."
            }, { status: 400 });
        }
        const destPath = path_1.default.join(process.cwd(), "src/lib/remedyDataPack.json");
        console.log(`Starting Google Drive sync for file ID: ${fileId} into target path: ${destPath}`);
        const success = await (0, googleDrive_1.downloadFileFromGoogleDrive)(fileId, destPath);
        if (success) {
            return server_1.NextResponse.json({
                success: true,
                message: "Successfully synchronized Materia Medica remedy pack from Google Drive!",
                fileId,
                destination: "src/lib/remedyDataPack.json"
            });
        }
        else {
            return server_1.NextResponse.json({
                success: false,
                message: "Failed to download file from Google Drive. Check server console logs or GOOGLE_SERVICE_ACCOUNT_KEY permissions."
            }, { status: 500 });
        }
    }
    catch (error) {
        console.error("Sync books endpoint failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "An error occurred during synchronization.",
            error: error.message || error
        }, { status: 500 });
    }
}
