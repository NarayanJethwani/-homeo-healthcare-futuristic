"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSearchText = normalizeSearchText;
exports.tokenize = tokenize;
exports.uniqueTokens = uniqueTokens;
const COMBINING_MARKS_REGEX = /\p{M}/gu;
const NON_WORD_REGEX = /[^\p{L}\p{N}]+/gu;
const MULTISPACE_REGEX = /\s+/g;
function normalizeSearchText(input) {
    if (input === null || input === undefined)
        return "";
    return String(input)
        .normalize("NFKD")
        .replace(COMBINING_MARKS_REGEX, "")
        .toLocaleLowerCase("en-IN")
        .replace(NON_WORD_REGEX, " ")
        .replace(MULTISPACE_REGEX, " ")
        .trim();
}
function tokenize(input) {
    const original = input === null || input === undefined ? "" : String(input);
    const normalized = normalizeSearchText(original);
    const tokens = normalized ? normalized.split(" ").filter(Boolean) : [];
    return {
        original,
        normalized,
        tokens,
    };
}
function uniqueTokens(input) {
    return Array.from(new Set(tokenize(input).tokens));
}
