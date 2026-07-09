"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingManager = exports.EmbeddingManager = exports.NullEmbeddingProvider = exports.GeminiEmbeddingProvider = exports.OllamaEmbeddingProvider = void 0;
const generative_ai_1 = require("@google/generative-ai");
const ollama_1 = require("../../../lib/ollama");
class OllamaEmbeddingProvider {
    constructor() {
        this.name = "ollama";
    }
    async getEmbeddings(text) {
        return await ollama_1.ollamaService.getEmbeddings(text);
    }
    async isAvailable() {
        return await ollama_1.ollamaService.checkHealth();
    }
}
exports.OllamaEmbeddingProvider = OllamaEmbeddingProvider;
class GeminiEmbeddingProvider {
    constructor() {
        this.name = "gemini";
        this.apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    }
    async getEmbeddings(text) {
        if (!this.apiKey) {
            throw new Error("Gemini API key is not configured.");
        }
        try {
            const genAI = new generative_ai_1.GoogleGenerativeAI(this.apiKey);
            const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const result = await model.embedContent(text);
            if (result && result.embedding && result.embedding.values) {
                return result.embedding.values;
            }
            throw new Error("Empty response from Gemini embedding service.");
        }
        catch (e) {
            console.warn("Failed to generate embedding via Gemini:", e.message || e);
            throw e;
        }
    }
    async isAvailable() {
        return typeof window === "undefined" && !!this.apiKey;
    }
}
exports.GeminiEmbeddingProvider = GeminiEmbeddingProvider;
class NullEmbeddingProvider {
    constructor() {
        this.name = "null-provider";
    }
    async getEmbeddings(text) {
        // Return a dummy/empty vector of 768 dimensions for fallback safety
        return new Array(768).fill(0.0);
    }
    async isAvailable() {
        return true;
    }
}
exports.NullEmbeddingProvider = NullEmbeddingProvider;
class EmbeddingManager {
    constructor() {
        this.providers = [];
        this.providers = [
            new GeminiEmbeddingProvider(),
            new OllamaEmbeddingProvider(),
            new NullEmbeddingProvider()
        ];
    }
    async getActiveProvider() {
        for (const provider of this.providers) {
            try {
                if (await provider.isAvailable()) {
                    return provider;
                }
            }
            catch {
                // Continue to next provider
            }
        }
        return new NullEmbeddingProvider();
    }
}
exports.EmbeddingManager = EmbeddingManager;
exports.embeddingManager = new EmbeddingManager();
