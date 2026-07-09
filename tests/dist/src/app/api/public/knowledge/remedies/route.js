"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const remedies_1 = require("@/features/knowledge/content/remedies");
async function GET() {
    const published = remedies_1.REMEDIES.filter(r => r.editorialStatus === "published");
    return server_1.NextResponse.json(published);
}
