"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeClinicalSession = serializeClinicalSession;
exports.deserializeClinicalSession = deserializeClinicalSession;
function serializeClinicalSession(session) {
    const payload = {
        version: 1,
        session,
    };
    return JSON.stringify(payload);
}
function deserializeClinicalSession(serialized) {
    const parsed = JSON.parse(serialized);
    if (parsed.version !== 1) {
        throw new Error(`Unsupported clinical repertorization session version: ${parsed.version}`);
    }
    if (!parsed.session?.id || !Array.isArray(parsed.session.selectedRubrics)) {
        throw new Error("Invalid clinical repertorization session payload");
    }
    return parsed.session;
}
