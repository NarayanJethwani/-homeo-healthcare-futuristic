"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const lab_tests_1 = require("@/features/knowledge/content/lab-tests");
async function GET() {
    const published = lab_tests_1.LAB_TESTS.filter(l => l.editorialStatus === "published");
    return server_1.NextResponse.json(published);
}
