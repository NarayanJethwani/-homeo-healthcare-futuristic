"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.POST = POST;
const server_1 = require("next/server");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const liveMode_1 = require("@/features/repertory/liveMode");
exports.dynamic = "force-dynamic";
function noStoreJson(body, status = 200) {
    const response = server_1.NextResponse.json(body, { status });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
async function POST(request) {
    const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
    if (!session)
        return (0, adminApiAuth_1.unauthorizedApiResponse)();
    const payload = await request.json().catch(() => null);
    if (!(0, liveMode_1.isValidV2FeedbackPayload)(payload)) {
        return noStoreJson({ success: false, message: "Invalid V2 feedback payload." }, 400);
    }
    try {
        const document = (0, liveMode_1.createV2ClinicalFeedbackDocument)(payload, {
            uid: session.uid,
            email: session.email,
            role: session.role,
            name: session.name,
        });
        const ref = await (0, firebaseAdmin_1.getAdminDb)().collection("v2ClinicalFeedback").add(document);
        return noStoreJson({ success: true, feedbackId: ref.id });
    }
    catch (error) {
        return noStoreJson({
            success: false,
            message: "Unable to store V2 feedback.",
            error: error?.message || String(error),
        }, 500);
    }
}
