"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_VERSION_MANIFEST = void 0;
exports.isValidSemver = isValidSemver;
exports.formatChangeLogEntry = formatChangeLogEntry;
exports.PLATFORM_VERSION_MANIFEST = {
    currentVersion: "1.0.0",
    compatibleVersionRange: ">=1.0.0 <2.0.0",
};
/**
 * Validates version format (Semantic Versioning e.g. 1.2.0)
 */
function isValidSemver(version) {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
}
/**
 * Formulates a change log entry
 */
function formatChangeLogEntry(record) {
    return `[v${record.version}] ${record.date} by ${record.author}: ${record.changes.join("; ")}`;
}
