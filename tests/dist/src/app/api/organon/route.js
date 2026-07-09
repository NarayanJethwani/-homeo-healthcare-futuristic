"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function GET() {
    try {
        const organonPath = path_1.default.join(process.cwd(), "src", "lib", "organon6thFull.json");
        if (!fs_1.default.existsSync(organonPath)) {
            return server_1.NextResponse.json({ success: false, error: "Database not generated" }, { status: 404 });
        }
        const raw = fs_1.default.readFileSync(organonPath, "utf-8");
        const data = JSON.parse(raw);
        return server_1.NextResponse.json({ success: true, data });
    }
    catch (error) {
        console.error("Organon API failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to load Organon database.",
            error: error.message || error
        }, { status: 500 });
    }
}
