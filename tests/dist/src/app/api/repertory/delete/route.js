"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
async function POST(request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return server_1.NextResponse.json({ success: false, message: "Rubric ID is required." }, { status: 400 });
        }
        const docRef = (0, firebaseAdmin_1.getAdminDb)().collection("rubrics").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return server_1.NextResponse.json({ success: false, message: "Rubric not found." }, { status: 404 });
        }
        const data = docSnap.data();
        if (data?.status === "custom") {
            // Custom rubrics can be permanently deleted
            await docRef.delete();
            return server_1.NextResponse.json({
                success: true,
                message: "Custom rubric permanently deleted."
            });
        }
        else {
            // Standard rubrics are archived (soft deleted)
            await docRef.update({
                status: "archived",
                modifiedDate: new Date().toISOString()
            });
            return server_1.NextResponse.json({
                success: true,
                message: "Standard rubric archived successfully."
            });
        }
    }
    catch (error) {
        console.error("Repertory Delete API failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to delete/archive rubric.",
            error: error.message || error
        }, { status: 500 });
    }
}
