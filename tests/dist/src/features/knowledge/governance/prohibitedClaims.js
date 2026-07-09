"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROHIBITED_PHRASES = void 0;
exports.checkProhibitedClaims = checkProhibitedClaims;
exports.PROHIBITED_PHRASES = [
    "guaranteed cure",
    "permanent cure",
    "no side effects",
    "replaces emergency care",
    "replaces conventional treatment",
    "100% effective",
    "proven cure",
    "cures instantly",
    "completely cures",
];
/**
 * Checks a localized string or object for any prohibited claims.
 * Returns a list of matches, or an empty array if clear.
 */
function checkProhibitedClaims(text) {
    if (!text)
        return [];
    const matches = [];
    const contentToSearch = typeof text === "string"
        ? text
        : JSON.stringify(text);
    const lowerContent = contentToSearch.toLowerCase();
    for (const phrase of exports.PROHIBITED_PHRASES) {
        if (lowerContent.includes(phrase.toLowerCase())) {
            matches.push(phrase);
        }
    }
    return matches;
}
