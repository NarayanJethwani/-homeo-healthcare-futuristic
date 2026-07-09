"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreEntity = scoreEntity;
const searchTokenizer_1 = require("./searchTokenizer");
const searchSynonyms_1 = require("./searchSynonyms");
/**
 * Calculates the Levenshtein distance between two strings to support fuzzy misspelling matches.
 */
function getEditDistance(a, b) {
    if (a.length === 0)
        return b.length;
    if (b.length === 0)
        return a.length;
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++)
        matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++)
        matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, // Deletion
            matrix[i][j - 1] + 1, // Insertion
            matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }
    return matrix[a.length][b.length];
}
/**
 * Returns true if the query token is a fuzzy match with the target token.
 * Max distance of 1 for words under 6 chars, max 2 for longer words.
 */
function isFuzzyMatch(queryToken, targetToken) {
    if (Math.abs(queryToken.length - targetToken.length) > 2)
        return false;
    const dist = getEditDistance(queryToken, targetToken);
    const threshold = targetToken.length <= 5 ? 1 : 2;
    return dist <= threshold;
}
/**
 * Calculates search match score for a given entity and query tokens.
 * Utilizes synonym expansion, spelling correction, and weighted semantic search.
 */
function scoreEntity(entity, queryTokens, originalQuery) {
    let score = 0;
    const matchedFields = [];
    const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
    const summary = typeof entity.summary === "string" ? entity.summary : (entity.summary?.en || "");
    const slug = entity.slug.toLowerCase();
    const titleTokens = (0, searchTokenizer_1.tokenize)(title);
    const summaryTokens = (0, searchTokenizer_1.tokenize)(summary);
    const tagTokens = entity.tags.flatMap(tag => (0, searchTokenizer_1.tokenize)(tag));
    const contentStr = JSON.stringify(entity.content || "").toLowerCase();
    // Get expanded synonyms for the user's query
    const expandedTokens = (0, searchSynonyms_1.expandQuery)(originalQuery);
    // 1. Exact Slug Match (Direct navigation trigger)
    if (slug === originalQuery.toLowerCase().trim()) {
        score += 150;
        matchedFields.push("slug-exact");
    }
    // 2. Exact Title Match Boost
    if (title.toLowerCase().trim() === originalQuery.toLowerCase().trim()) {
        score += 200;
        matchedFields.push("title-exact");
    }
    // 3. Score matching tokens from the original query
    for (const token of queryTokens) {
        // Title match
        if (titleTokens.includes(token)) {
            score += 50;
            matchedFields.push("title-token");
        }
        // Fuzzy Title Match (misspelling recovery)
        else {
            const fuzzyTitleMatch = titleTokens.some(t => isFuzzyMatch(token, t));
            if (fuzzyTitleMatch) {
                score += 25;
                matchedFields.push("title-fuzzy");
            }
        }
        // Tag matches
        if (tagTokens.includes(token)) {
            score += 40;
            matchedFields.push("tag");
        }
        else {
            const fuzzyTagMatch = tagTokens.some(t => isFuzzyMatch(token, t));
            if (fuzzyTagMatch) {
                score += 20;
                matchedFields.push("tag-fuzzy");
            }
        }
        // Summary matches
        if (summaryTokens.includes(token)) {
            score += 20;
            matchedFields.push("summary");
        }
        // Full Content JSON string scan
        if (contentStr.includes(token)) {
            score += 10;
            matchedFields.push("content");
        }
    }
    // 4. Score expanded synonym tokens (Weighted slightly lower than direct inputs)
    for (const token of expandedTokens) {
        // Skip if already matched as direct query token
        if (queryTokens.includes(token))
            continue;
        if (titleTokens.includes(token)) {
            score += 30;
            matchedFields.push("synonym-title");
        }
        if (tagTokens.includes(token)) {
            score += 20;
            matchedFields.push("synonym-tag");
        }
        if (summaryTokens.includes(token)) {
            score += 10;
            matchedFields.push("synonym-summary");
        }
        if (contentStr.includes(token)) {
            score += 5;
            matchedFields.push("synonym-content");
        }
    }
    return {
        entity,
        score,
        matchedFields: Array.from(new Set(matchedFields)),
    };
}
