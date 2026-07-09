"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllKnowledgeChunks = getAllKnowledgeChunks;
exports.retrieveRelevantChunks = retrieveRelevantChunks;
const index_1 = require("../index");
const chunker_1 = require("./chunker");
const searchTokenizer_1 = require("../search/searchTokenizer");
/**
 * Returns all tokenized text chunks across the published knowledge entities.
 */
function getAllKnowledgeChunks() {
    const entities = (0, index_1.getAllKnowledgeEntities)().filter(e => e.editorialStatus === "published");
    return entities.flatMap(entity => (0, chunker_1.chunkEntity)(entity));
}
/**
 * Performs flat-text chunk retrieval matching queries.
 */
function retrieveRelevantChunks(query, limit = 3) {
    const tokens = (0, searchTokenizer_1.tokenize)(query);
    if (tokens.length === 0)
        return [];
    const chunks = getAllKnowledgeChunks();
    const scored = chunks.map(chunk => {
        let score = 0;
        const chunkTokens = (0, searchTokenizer_1.tokenize)(chunk.text);
        for (const token of tokens) {
            if (chunkTokens.includes(token)) {
                score += 1;
            }
            if (chunk.title.toLowerCase().includes(token)) {
                score += 2; // Boost if matched title
            }
        }
        return { chunk, score };
    });
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.chunk);
}
