"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const symptoms_1 = require("@/features/knowledge/content/symptoms");
async function GET() {
    const published = symptoms_1.SYMPTOMS.filter(s => s.editorialStatus === "published");
    return server_1.NextResponse.json(published);
}
