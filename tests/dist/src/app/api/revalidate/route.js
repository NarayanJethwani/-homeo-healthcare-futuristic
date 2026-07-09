"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const cache_1 = require("next/cache");
async function handleRevalidate(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const path = searchParams.get("path") || "/blogs";
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
        return server_1.NextResponse.json({ message: "Revalidation secret not configured on server" }, { status: 500 });
    }
    if (secret !== expectedSecret) {
        return server_1.NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }
    try {
        // Revalidate the page on-demand
        (0, cache_1.revalidatePath)(path);
        return server_1.NextResponse.json({ revalidated: true, now: Date.now(), path });
    }
    catch (err) {
        return server_1.NextResponse.json({ message: err.message }, { status: 500 });
    }
}
async function GET(request) {
    return handleRevalidate(request);
}
async function POST(request) {
    return handleRevalidate(request);
}
