"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const faqs_1 = require("@/features/knowledge/content/faqs");
async function GET() {
    const published = faqs_1.FAQS.filter(f => f.editorialStatus === "published");
    return server_1.NextResponse.json(published);
}
