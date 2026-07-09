"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaService = exports.OllamaService = exports.LOCAL_MODELS = void 0;
const os_1 = __importDefault(require("os"));
// Ordered local models with their memory thresholds
exports.LOCAL_MODELS = {
    primary: { name: "qwen2.5:7b", minRamGb: 12, displayName: "Qwen 2.5 7B" },
    primary_low: { name: "qwen2.5:3b", minRamGb: 0, displayName: "Qwen 2.5 3B (Quantized)" },
    general: { name: "gemma2:9b", minRamGb: 16, displayName: "Gemma 2 9B" },
    general_low: { name: "gemma2:2b", minRamGb: 0, displayName: "Gemma 2 2B (Fast)" },
    reasoning: { name: "deepseek-r1:8b", minRamGb: 12, displayName: "DeepSeek R1 8B" },
    reasoning_low: { name: "deepseek-r1:1.5b", minRamGb: 0, displayName: "DeepSeek R1 1.5B" },
    llama: { name: "llama3:8b", minRamGb: 12, displayName: "Llama 3 8B" },
    llama_low: { name: "llama3.2:3b", minRamGb: 0, displayName: "Llama 3.2 3B" },
    mistral: { name: "mistral:latest", minRamGb: 8, displayName: "Mistral" },
    low_ram: { name: "phi3:latest", minRamGb: 0, displayName: "Phi-3 Mini" }
};
class OllamaService {
    constructor() {
        this.endpoint = process.env.OLLAMA_HOST || "http://localhost:11434";
    }
    // Get total host memory in gigabytes
    getSystemRamGb() {
        return Math.floor(os_1.default.totalmem() / (1024 * 1024 * 1024));
    }
    // Auto-detect best model based on available RAM and requested type
    selectModel(type) {
        const ram = this.getSystemRamGb();
        console.log(`Auto-detected system RAM: ${ram}GB. Selecting Ollama model for category: ${type}`);
        switch (type) {
            case "primary":
                return ram >= exports.LOCAL_MODELS.primary.minRamGb
                    ? exports.LOCAL_MODELS.primary.name
                    : exports.LOCAL_MODELS.primary_low.name;
            case "general":
                return ram >= exports.LOCAL_MODELS.general.minRamGb
                    ? exports.LOCAL_MODELS.general.name
                    : exports.LOCAL_MODELS.general_low.name;
            case "reasoning":
                return ram >= exports.LOCAL_MODELS.reasoning.minRamGb
                    ? exports.LOCAL_MODELS.reasoning.name
                    : exports.LOCAL_MODELS.reasoning_low.name;
            case "llama":
                return ram >= exports.LOCAL_MODELS.llama.minRamGb
                    ? exports.LOCAL_MODELS.llama.name
                    : exports.LOCAL_MODELS.llama_low.name;
            case "mistral":
                return ram >= exports.LOCAL_MODELS.mistral.minRamGb
                    ? exports.LOCAL_MODELS.mistral.name
                    : exports.LOCAL_MODELS.low_ram.name;
            case "low_ram":
            default:
                return exports.LOCAL_MODELS.low_ram.name;
        }
    }
    async checkHealth() {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 1000); // quick check
            const res = await fetch(`${this.endpoint}/api/tags`, { signal: controller.signal });
            clearTimeout(id);
            return res.status === 200;
        }
        catch {
            return false;
        }
    }
    async generate(model, prompt, systemInstruction, options) {
        const url = `${this.endpoint}/api/generate`;
        const body = {
            model,
            prompt,
            system: systemInstruction,
            stream: false,
            options: {
                temperature: 0.3,
                num_ctx: 4096
            }
        };
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: options?.signal
        });
        if (!res.ok) {
            throw new Error(`Ollama generation failed with status: ${res.status}`);
        }
        const data = await res.json();
        return data.response || "";
    }
    async getEmbeddings(text) {
        const model = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
        const url = `${this.endpoint}/api/embeddings`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model, prompt: text })
            });
            if (!res.ok) {
                throw new Error(`Ollama embeddings failed with status: ${res.status}`);
            }
            const data = await res.json();
            return data.embedding || [];
        }
        catch {
            console.warn(`Ollama embeddings request failed for model ${model}. Returning mock/dummy vector for safety.`);
            // return a dummy vector matching 1536 dims (or 768 dims for nomic)
            return new Array(768).fill(0.01);
        }
    }
}
exports.OllamaService = OllamaService;
exports.ollamaService = new OllamaService();
