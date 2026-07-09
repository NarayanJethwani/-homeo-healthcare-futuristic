"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const diseases_1 = require("@/features/knowledge/content/diseases");
async function GET() {
    // Only return published educational records
    const published = diseases_1.DISEASES.filter(d => d.editorialStatus === "published");
    return server_1.NextResponse.json(published);
}
