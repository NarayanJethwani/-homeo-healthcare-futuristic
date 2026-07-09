"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKnowledgeBase = searchKnowledgeBase;
const index_1 = require("../index");
const searchRanking_1 = require("./searchRanking");
const searchTokenizer_1 = require("./searchTokenizer");
/**
 * Searches the Clinical Knowledge Platform database.
 */
function searchKnowledgeBase(query, entityTypeFilter) {
    if (!query || query.trim().length === 0) {
        // If query is empty, return all active entities sorted alphabetically
        const entities = (0, index_1.getAllKnowledgeEntities)().filter(e => e.editorialStatus === "published");
        const filtered = entityTypeFilter
            ? entities.filter(e => e.entityType === entityTypeFilter)
            : entities;
        return filtered.map(entity => ({
            entity,
            score: 1,
            matchedFields: [],
        }));
    }
    const queryTokens = (0, searchTokenizer_1.tokenize)(query);
    const entities = (0, index_1.getAllKnowledgeEntities)().filter(e => e.editorialStatus === "published");
    const filtered = entityTypeFilter
        ? entities.filter(e => e.entityType === entityTypeFilter)
        : entities;
    return filtered
        .map(entity => (0, searchRanking_1.scoreEntity)(entity, queryTokens, query))
        .filter(res => res.score > 0)
        .sort((a, b) => b.score - a.score);
}
