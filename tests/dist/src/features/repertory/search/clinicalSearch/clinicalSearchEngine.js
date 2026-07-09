"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCanonicalRubrics = searchCanonicalRubrics;
exports.buildAndSearchCanonicalRubrics = buildAndSearchCanonicalRubrics;
const fuzzyMatcher_1 = require("./fuzzyMatcher");
const searchIndex_1 = require("./searchIndex");
const synonyms_1 = require("./synonyms");
const tokenizer_1 = require("./tokenizer");
const DEFAULT_LIMIT = 25;
const DEFAULT_MIN_SCORE = 1;
const DEFAULT_MAX_EDIT_DISTANCE = 1;
const MATCH_SCORES = {
    exact: 100,
    starts_with: 72,
    contains: 48,
    synonym: 58,
    fuzzy: 34,
};
function keywordFrequencyBoost(document, token) {
    return Math.min(document.tokenFrequency.get(token) || 0, 6) * 2;
}
function scoreTokenMatch(queryToken, candidateToken, synonymTokens, maxEditDistance) {
    if (candidateToken === queryToken)
        return { type: "exact", score: MATCH_SCORES.exact };
    if ((0, fuzzyMatcher_1.isPrefixMatch)(queryToken, candidateToken))
        return { type: "starts_with", score: MATCH_SCORES.starts_with };
    if ((0, fuzzyMatcher_1.isSuffixMatch)(queryToken, candidateToken) || (0, fuzzyMatcher_1.isPartialWordMatch)(queryToken, candidateToken)) {
        return { type: "contains", score: MATCH_SCORES.contains };
    }
    if (synonymTokens.has(candidateToken))
        return { type: "synonym", score: MATCH_SCORES.synonym };
    if ((0, fuzzyMatcher_1.isSmallSpellingMistake)(queryToken, candidateToken, maxEditDistance)) {
        return { type: "fuzzy", score: MATCH_SCORES.fuzzy };
    }
    return null;
}
function bestMatchForField(document, field, queryToken, synonymTokens, maxEditDistance) {
    let best = null;
    field.tokens.forEach((candidateToken) => {
        const tokenMatch = scoreTokenMatch(queryToken, candidateToken, synonymTokens, maxEditDistance);
        if (!tokenMatch)
            return;
        const score = (tokenMatch.score + keywordFrequencyBoost(document, candidateToken)) * field.weight;
        if (!best || score > best.score) {
            best = {
                field: field.field,
                token: candidateToken,
                queryToken,
                type: tokenMatch.type,
                score,
            };
        }
    });
    return best;
}
function exactPhraseBoost(document, normalizedQuery) {
    if (!normalizedQuery)
        return 0;
    return document.fields.reduce((boost, field) => {
        const normalizedField = (0, tokenizer_1.normalizeSearchText)(field.text);
        return normalizedField.includes(normalizedQuery) ? boost + (field.weight * 90) : boost;
    }, 0);
}
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildHighlight(field, matches) {
    const matchedTerms = Array.from(new Set(matches.flatMap((match) => [match.queryToken, match.token])))
        .filter((term) => term.length >= 2)
        .sort((left, right) => right.length - left.length);
    if (matchedTerms.length === 0)
        return null;
    let html = escapeHtml(field.text);
    matchedTerms.forEach((term) => {
        const pattern = new RegExp(`(${escapeRegExp(escapeHtml(term))})`, "gi");
        html = html.replace(pattern, "<mark>$1</mark>");
    });
    return {
        field: field.field,
        text: field.text,
        html,
        matchedTerms,
    };
}
function buildHighlights(document, matches) {
    return document.fields
        .map((field) => buildHighlight(field, matches.filter((match) => match.field === field.field)))
        .filter((highlight) => highlight !== null);
}
function rankDocument(document, queryTokens, normalizedQuery, synonymExpansions, options) {
    const matches = [];
    queryTokens.forEach((queryToken) => {
        const synonymTokens = synonymExpansions.get(queryToken) || new Set();
        document.fields.forEach((field) => {
            const match = bestMatchForField(document, field, queryToken, synonymTokens, options.maxEditDistance);
            if (match)
                matches.push(match);
        });
    });
    if (matches.length === 0)
        return null;
    const rawScore = matches.reduce((sum, match) => sum + match.score, 0) + exactPhraseBoost(document, normalizedQuery);
    const score = Math.round(rawScore * document.relevanceWeight * 100) / 100;
    const matchedFields = Array.from(new Set(matches.map((match) => match.field)));
    return {
        rubric: document.rubric,
        score,
        matches: matches.sort((left, right) => right.score - left.score),
        matchedFields,
        highlights: options.includeHighlights ? buildHighlights(document, matches) : [],
    };
}
function searchCanonicalRubrics(index, query, options = {}, dictionary) {
    const tokenizedQuery = (0, tokenizer_1.tokenize)(query);
    if (tokenizedQuery.tokens.length === 0)
        return [];
    const normalizedOptions = {
        limit: options.limit || DEFAULT_LIMIT,
        minScore: options.minScore ?? DEFAULT_MIN_SCORE,
        includeHighlights: options.includeHighlights ?? true,
        maxEditDistance: options.maxEditDistance ?? DEFAULT_MAX_EDIT_DISTANCE,
    };
    const synonymMap = (0, synonyms_1.buildSynonymMap)(dictionary);
    const synonymExpansions = (0, synonyms_1.expandTokensWithSynonyms)(tokenizedQuery.tokens, synonymMap);
    return index.documents
        .map((document) => rankDocument(document, tokenizedQuery.tokens, tokenizedQuery.normalized, synonymExpansions, normalizedOptions))
        .filter((result) => result !== null && result.score >= normalizedOptions.minScore)
        .sort((left, right) => right.score - left.score || left.rubric.title.localeCompare(right.rubric.title))
        .slice(0, normalizedOptions.limit);
}
function buildAndSearchCanonicalRubrics(rubrics, query, options, dictionary) {
    return searchCanonicalRubrics((0, searchIndex_1.buildCanonicalSearchIndex)(rubrics), query, options, dictionary);
}
