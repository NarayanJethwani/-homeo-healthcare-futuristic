"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const repertoryData_1 = require("@/lib/repertoryData");
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return server_1.NextResponse.json({
                success: false,
                message: "Rubric ID is required."
            }, { status: 400 });
        }
        const docRef = (0, firebaseAdmin_1.getAdminDb)().collection("rubrics").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return server_1.NextResponse.json({
                success: false,
                message: "Rubric not found."
            }, { status: 404 });
        }
        const rubric = docSnap.data();
        if (!rubric) {
            return server_1.NextResponse.json({
                success: false,
                message: "Rubric data is empty."
            }, { status: 404 });
        }
        // Enrich remedies with full names
        const remediesEnriched = [];
        if (rubric.remedies) {
            Object.entries(rubric.remedies).forEach(([abbrev, grade]) => {
                const meta = repertoryData_1.REMEDIES_METADATA[abbrev] || { fullName: abbrev, source: "Unknown" };
                remediesEnriched.push({
                    abbreviation: abbrev,
                    fullName: meta.fullName,
                    source: meta.source,
                    grade
                });
            });
        }
        // Sort remedies by grade descending
        remediesEnriched.sort((a, b) => b.grade - a.grade);
        return server_1.NextResponse.json({
            success: true,
            rubric: {
                ...rubric,
                remediesEnriched
            }
        });
    }
    catch (error) {
        console.error("Repertory Details API failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to load rubric details.",
            error: error.message || error
        }, { status: 500 });
    }
}
