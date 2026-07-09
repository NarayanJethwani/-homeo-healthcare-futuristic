"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorizedApiResponse = unauthorizedApiResponse;
exports.forbiddenApiResponse = forbiddenApiResponse;
exports.requireAdminApiSession = requireAdminApiSession;
const server_1 = require("next/server");
const adminSession_1 = require("@/lib/adminSession");
function unauthorizedApiResponse(message = "Authentication required.") {
    const response = server_1.NextResponse.json({ success: false, message }, { status: 401 });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
function forbiddenApiResponse(message = "Admin access required.") {
    const response = server_1.NextResponse.json({ success: false, message }, { status: 403 });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
async function requireAdminApiSession(request, allowedRoles = ["admin", "doctor"]) {
    const session = await (0, adminSession_1.verifyAdminSessionCookie)(request.cookies.get(adminSession_1.ADMIN_SESSION_COOKIE)?.value);
    if (!session)
        return null;
    if (!allowedRoles.includes(session.role))
        return null;
    return session;
}
