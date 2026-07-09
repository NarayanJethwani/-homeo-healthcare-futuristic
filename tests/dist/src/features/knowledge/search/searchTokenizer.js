"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
/**
 * Splits text into a clean set of normalized query tokens (lowercased, alphanumeric only, trimmed).
 */
function tokenize(text) {
    if (!text)
        return [];
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(token => token.trim().length > 1);
}
