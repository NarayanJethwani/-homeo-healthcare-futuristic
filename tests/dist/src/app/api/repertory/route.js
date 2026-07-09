"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const repertoryData_1 = require("@/lib/repertoryData");
async function GET() {
    try {
        // Try multiple paths for Vercel compatibility
        const possibleBasePaths = [
            path_1.default.join(process.cwd(), "public", "data"), // Vercel serverless (public/ is at cwd)
            path_1.default.join(process.cwd(), "src", "lib"), // Local development fallback
            path_1.default.join(process.cwd(), ".next", "server", "app"), // Next.js output
        ];
        console.log(`Loading classic repertories dynamically on server...`);
        let kentData = [];
        let boerickeData = [];
        // Try to load Kent data
        for (const basePath of possibleBasePaths) {
            const kentPath = path_1.default.join(basePath, "kentRepertoryData.json");
            if (fs_1.default.existsSync(kentPath)) {
                try {
                    const raw = fs_1.default.readFileSync(kentPath, "utf-8");
                    kentData = JSON.parse(raw);
                    console.log(`Loaded Kent repertory from ${kentPath}: ${kentData.length} rubrics`);
                    break;
                }
                catch (e) {
                    console.warn(`Failed to parse Kent data from ${kentPath}:`, e);
                }
            }
        }
        // Try to load Boericke data
        for (const basePath of possibleBasePaths) {
            const boerickePath = path_1.default.join(basePath, "boerickeRepertoryData.json");
            if (fs_1.default.existsSync(boerickePath)) {
                try {
                    const raw = fs_1.default.readFileSync(boerickePath, "utf-8");
                    boerickeData = JSON.parse(raw);
                    console.log(`Loaded Boericke repertory from ${boerickePath}: ${boerickeData.length} rubrics`);
                    break;
                }
                catch (e) {
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
        let jethwaniData = [];
        try {
            const rubricsSnap = await (0, firebaseAdmin_1.getAdminDb)().collection("rubrics").where("status", "==", "active").get();
            rubricsSnap.forEach((doc) => {
                jethwaniData.push(doc.data());
            });
            if (jethwaniData.length === 0) {
                console.warn("Jethwani rubrics collection is empty. Loading fallback data.");
                jethwaniData = repertoryData_1.JETHWANI_REPERTORY_DATA;
            }
            else {
                console.log(`Loaded ${jethwaniData.length} Jethwani rubrics from Firestore.`);
            }
        }
        catch (e) {
            console.warn("Failed to load Jethwani rubrics from Firestore. Using local fallback:", e);
            jethwaniData = repertoryData_1.JETHWANI_REPERTORY_DATA;
        }
        return server_1.NextResponse.json({
            success: true,
            kent: kentData,
            boericke: boerickeData,
            jethwani: jethwaniData
        });
    }
    catch (error) {
        console.error("Repertory API failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to load repertory database.",
            error: error.message || error
        }, { status: 500 });
    }
}
