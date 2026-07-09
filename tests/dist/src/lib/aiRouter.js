"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRouterService = exports.AIRouterService = void 0;
const cacheService_1 = require("./cacheService");
const ragService_1 = require("./ragService");
const ollama_1 = require("./ollama");
const generative_ai_1 = require("@google/generative-ai");
const MAX_LOGS = 50;
const requestLogs = [];
// Global metrics tracker
const stats = {
    totalRequests: 0,
    failures: 0,
    cacheHits: 0,
    knowledgeHits: 0,
    retries: 0,
    fallbacks: 0,
    averageLatencyMs: 0,
    activeProvider: "Gemini (Primary)",
    providerHealth: {
        DeepSeek: "Offline",
        Qwen: "Offline",
        GLM: "Offline",
        Gemini: "Healthy",
        HuggingFace: "Offline",
        Ollama: "Offline"
    },
    detailedHealth: {}
};
// Initial prioritized Gemini models list
let geminiModels = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-pro-exp",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
];
let lastDiscoveryTime = 0;
const DISCOVERY_INTERVAL = 60 * 60 * 1000; // 1 hour
// Dynamic discovery of Gemini models
async function discoverNewGeminiModels(apiKey) {
    const now = Date.now();
    if (now - lastDiscoveryTime < DISCOVERY_INTERVAL)
        return;
    lastDiscoveryTime = now;
    try {
        console.log("[AIRouter] Checking for new Gemini models dynamically...");
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!res.ok) {
            console.warn(`[AIRouter] Failed to fetch Gemini models list: ${res.status}`);
            return;
        }
        const data = await res.json();
        if (!data.models)
            return;
        const newModels = [];
        for (const m of data.models) {
            const name = m.name.replace("models/", "");
            if (name.startsWith("gemini-") && !geminiModels.includes(name)) {
                const isStable = !name.includes("-exp") &&
                    !name.includes("-preview") &&
                    !name.includes("-tuning") &&
                    !name.includes("-vision") &&
                    !name.includes("-latest") &&
                    !/-\d{4}$/.test(name);
                if (isStable) {
                    newModels.push(name);
                }
            }
        }
        if (newModels.length > 0) {
            newModels.sort((a, b) => b.localeCompare(a));
            geminiModels = [...newModels, ...geminiModels];
            console.log(`[AIRouter] Dynamically discovered new stable Gemini models:`, newModels);
        }
    }
    catch (e) {
        console.error(`[AIRouter] Error during dynamic Gemini model discovery:`, e.message || e);
    }
}
// Qwen Model Discovery & Selection Logic
let qwenModels = [];
let lastQwenDiscoveryTime = 0;
const QWEN_DISCOVERY_INTERVAL = 60 * 60 * 1000; // 1 hour
// Prioritized list of preferred Qwen models (highest capability to lowest)
const QWEN_PREFERENCE_ORDER = [
    "qwen3-max",
    "qwen-max",
    "qwen3-coder-480b-a35b-instruct",
    "qwen3-next-80b-a3b-instruct",
    "qwen3-coder-plus",
    "qwen-plus-latest",
    "qwen-plus",
    "qwen3-32b",
    "qwen3-14b",
    "qwen3-8b",
    "qwen-turbo",
    "qwen-flash"
];
async function discoverQwenModels(apiKey) {
    const now = Date.now();
    if (now - lastQwenDiscoveryTime < QWEN_DISCOVERY_INTERVAL && qwenModels.length > 0)
        return;
    lastQwenDiscoveryTime = now;
    try {
        console.log("[AIRouter] Checking for available Qwen models dynamically...");
        const endpoint = process.env.QWEN_API_ENDPOINT || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
        let modelsUrl = "";
        if (endpoint.includes("/compatible-mode") || endpoint.includes("/v1")) {
            const base = endpoint.split("/chat/completions")[0].split("/compatible-mode")[0];
            modelsUrl = `${base}/compatible-mode/v1/models`;
        }
        else {
            modelsUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1/models";
        }
        const res = await fetch(modelsUrl, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });
        if (!res.ok) {
            console.warn(`[AIRouter] Failed to fetch Qwen models list: ${res.status}`);
            return;
        }
        const data = await res.json();
        if (!data.data || !Array.isArray(data.data)) {
            console.warn("[AIRouter] Invalid Qwen models response format:", data);
            return;
        }
        const discovered = [];
        for (const m of data.data) {
            const id = m.id;
            const isChatModel = (id.startsWith("qwen") || id.startsWith("qwq")) &&
                !id.includes("-vl-") &&
                !id.includes("-tts-") &&
                !id.includes("-asr-") &&
                !id.includes("-image-") &&
                !id.includes("-mt-") &&
                !id.includes("embedding");
            if (isChatModel) {
                discovered.push(id);
            }
        }
        if (discovered.length === 0) {
            console.error("[AIRouter] DIAGNOSTIC: DashScope API returned successful models list, but NO enabled chat/instruction models were detected!");
            return;
        }
        // Sort discovered models based on preference ranking
        discovered.sort((a, b) => {
            let idxA = QWEN_PREFERENCE_ORDER.indexOf(a);
            let idxB = QWEN_PREFERENCE_ORDER.indexOf(b);
            if (idxA === -1)
                idxA = 999;
            if (idxB === -1)
                idxB = 999;
            return idxA - idxB;
        });
        qwenModels = discovered;
        console.log(`[AIRouter] Dynamically discovered and ranked Qwen models:`, qwenModels);
    }
    catch (e) {
        console.error(`[AIRouter] Error during dynamic Qwen model discovery:`, e.message || e);
    }
}
function selectQwenModel(taskCategory) {
    if (qwenModels.length === 0) {
        throw new Error("DIAGNOSTIC: No dynamically discovered Qwen models available. Check DashScope API configuration.");
    }
    if (taskCategory === "coding") {
        const coderModels = qwenModels.filter(m => m.includes("coder"));
        if (coderModels.length > 0) {
            return coderModels[0];
        }
    }
    return qwenModels[0];
}
// Provider health manager tracking state
const providerHealthCache = {
    Gemini: { provider: "Gemini", status: "Healthy", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
    DeepSeek: { provider: "DeepSeek", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
    Qwen: { provider: "Qwen", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
    GLM: { provider: "GLM", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
    HuggingFace: { provider: "HuggingFace", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
    Ollama: { provider: "Ollama", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 }
};
// Map failed models for 5-10 minutes to skip them
const failedModelsCache = new Map();
function isModelFailed(modelName) {
    const expiry = failedModelsCache.get(modelName);
    if (!expiry)
        return false;
    if (Date.now() >= expiry) {
        failedModelsCache.delete(modelName);
        return false;
    }
    return true;
}
function markModelFailed(modelName) {
    const duration = (5 * 60 * 1000) + Math.random() * (5 * 60 * 1000); // 5-10m with jitter
    failedModelsCache.set(modelName, Date.now() + duration);
    console.log(`[AIRouter] Caching failed model ${modelName} for ${Math.round(duration / 1000 / 60)} minutes.`);
}
function getErrorStatus(err) {
    if (err.status)
        return err.status;
    const msg = String(err.message || "").toLowerCase();
    if (msg.includes("429") || msg.includes("quota") || msg.includes("too many requests"))
        return 429;
    if (msg.includes("500") || msg.includes("internal server error"))
        return 500;
    if (msg.includes("503") || msg.includes("service unavailable"))
        return 503;
    if (msg.includes("api key") || msg.includes("invalid key") || msg.includes("unauthorized") || msg.includes("401"))
        return 401;
    return 500; // default
}
const TIMEOUT_TOKEN = Symbol("TIMEOUT_TOKEN");
class AIRouterService {
    constructor() {
        this.updateProviderHealth();
        setInterval(() => this.updateProviderHealth(), 60000); // every 1 min
        if (process.env.GEMINI_API_KEY) {
            discoverNewGeminiModels(process.env.GEMINI_API_KEY).catch(() => { });
        }
        if (process.env.QWEN_API_KEY) {
            discoverQwenModels(process.env.QWEN_API_KEY).catch(() => { });
        }
    }
    initModelHealth(modelName) {
        return {
            model: modelName,
            latencyMs: 0,
            averageResponseTimeMs: 0,
            lastSuccess: null,
            lastFailure: null,
            failureCount: 0,
            retryAfter: null,
            tokensUsedToday: 0,
            requestsToday: 0,
            consecutiveFailures: 0
        };
    }
    isProviderDisabled(providerName) {
        const health = providerHealthCache[providerName];
        if (!health)
            return false;
        if (health.retryAfter && Date.now() < health.retryAfter) {
            return true;
        }
        if (health.retryAfter && Date.now() >= health.retryAfter) {
            health.retryAfter = null;
            health.consecutiveFailures = 0;
            health.status = "Healthy";
        }
        return false;
    }
    recordSuccess(providerName, modelName, latencyMs, tokensUsed = 0) {
        const provider = providerHealthCache[providerName];
        if (provider) {
            provider.consecutiveFailures = 0;
            provider.retryAfter = null;
            provider.status = "Healthy";
            provider.requestsToday++;
            provider.tokensUsedToday += tokensUsed;
            if (!provider.models[modelName]) {
                provider.models[modelName] = this.initModelHealth(modelName);
            }
            const model = provider.models[modelName];
            model.latencyMs = latencyMs;
            model.averageResponseTimeMs = model.averageResponseTimeMs === 0
                ? latencyMs
                : Math.round((model.averageResponseTimeMs * 4 + latencyMs) / 5);
            model.lastSuccess = new Date().toISOString();
            model.consecutiveFailures = 0;
            model.retryAfter = null;
            model.requestsToday++;
            model.tokensUsedToday += tokensUsed;
        }
    }
    recordFailure(providerName, modelName, error) {
        const provider = providerHealthCache[providerName];
        if (provider) {
            provider.consecutiveFailures++;
            const status = getErrorStatus(error);
            const isQuotaExceeded = status === 429;
            const disableDuration = 10 * 60 * 1000; // 10 minutes
            if (provider.consecutiveFailures >= 3 || isQuotaExceeded) {
                provider.status = "Disabled";
                provider.retryAfter = Date.now() + disableDuration;
                console.warn(`[AIRouter] Provider ${providerName} disabled until ${new Date(provider.retryAfter).toISOString()} due to consecutive failures/quota exceeded.`);
            }
            if (modelName) {
                if (!provider.models[modelName]) {
                    provider.models[modelName] = this.initModelHealth(modelName);
                }
                const model = provider.models[modelName];
                model.lastFailure = new Date().toISOString();
                model.consecutiveFailures++;
                model.failureCount++;
                if (isQuotaExceeded) {
                    model.retryAfter = Date.now() + disableDuration;
                }
            }
        }
    }
    // Update stats helper
    updateStats(success, latency, retries, cache, kb, provider) {
        stats.totalRequests++;
        if (!success) {
            stats.failures++;
        }
        if (cache)
            stats.cacheHits++;
        if (kb)
            stats.knowledgeHits++;
        stats.retries += retries;
        if (retries > 0 && success)
            stats.fallbacks++;
        stats.averageLatencyMs = Math.round((stats.averageLatencyMs * (stats.totalRequests - 1) + latency) / stats.totalRequests);
        stats.activeProvider = provider;
        stats.detailedHealth = providerHealthCache;
        // Sync simple statuses for dashboard UI
        Object.keys(providerHealthCache).forEach(pKey => {
            const pHealth = providerHealthCache[pKey];
            if (pHealth.status === "Disabled") {
                stats.providerHealth[pKey] = "Offline"; // dashboard renders Offline for Disabled
            }
            else if (pHealth.status === "Degraded") {
                stats.providerHealth[pKey] = "Degraded";
            }
            else if (pHealth.status === "Offline") {
                stats.providerHealth[pKey] = "Offline";
            }
            else {
                stats.providerHealth[pKey] = "Healthy";
            }
        });
    }
    // Log requests helper
    addRequestLog(query, category, provider, model, latencyMs, status, retries, cacheHit, knowledgeHit, promptTokens, completionTokens, totalTokens, failureReason) {
        const log = {
            timestamp: new Date().toISOString(),
            query: query.substring(0, 100) + (query.length > 100 ? "..." : ""),
            category,
            provider,
            model,
            latencyMs,
            status,
            retries,
            cacheHit,
            knowledgeHit,
            promptTokens,
            completionTokens,
            totalTokens,
            failureReason
        };
        requestLogs.unshift(log);
        if (requestLogs.length > MAX_LOGS) {
            requestLogs.pop();
        }
    }
    async updateProviderHealth() {
        // 1. DeepSeek
        providerHealthCache.DeepSeek.status = process.env.DEEPSEEK_API_KEY
            ? (this.isProviderDisabled("DeepSeek") ? "Disabled" : "Healthy")
            : "Offline";
        // 2. Qwen
        providerHealthCache.Qwen.status = process.env.QWEN_API_KEY
            ? (this.isProviderDisabled("Qwen") ? "Disabled" : "Healthy")
            : "Offline";
        // 3. GLM
        providerHealthCache.GLM.status = process.env.GLM_API_KEY
            ? (this.isProviderDisabled("GLM") ? "Disabled" : "Healthy")
            : "Offline";
        // 4. Gemini
        providerHealthCache.Gemini.status = process.env.GEMINI_API_KEY
            ? (this.isProviderDisabled("Gemini") ? "Disabled" : "Healthy")
            : "Offline";
        // 5. Hugging Face
        providerHealthCache.HuggingFace.status = process.env.HF_API_KEY
            ? (this.isProviderDisabled("HuggingFace") ? "Disabled" : "Healthy")
            : "Offline";
        // 6. Ollama
        const ollamaOnline = await ollama_1.ollamaService.checkHealth();
        providerHealthCache.Ollama.status = ollamaOnline
            ? (this.isProviderDisabled("Ollama") ? "Disabled" : "Healthy")
            : "Offline";
        // Sync stats object structure for compat
        stats.detailedHealth = providerHealthCache;
        Object.keys(providerHealthCache).forEach(pKey => {
            const pHealth = providerHealthCache[pKey];
            if (pHealth.status === "Disabled") {
                stats.providerHealth[pKey] = "Offline";
            }
            else {
                stats.providerHealth[pKey] = pHealth.status === "Offline" ? "Offline" : (pHealth.status === "Degraded" ? "Degraded" : "Healthy");
            }
        });
    }
    getStats() {
        return stats;
    }
    getRequestLogs() {
        return requestLogs;
    }
    classifyTask(query) {
        const q = query.toLowerCase();
        if (q.includes("code") || q.includes("programming") || q.includes("script"))
            return "coding";
        if (q.includes("summarize") || q.includes("summary") || q.includes("digest"))
            return "summaries";
        if (q.includes("why") || q.includes("explain") || q.includes("pathophysiological") || q.includes("mechanism"))
            return "reasoning";
        if (q.includes("diagnose") || q.includes("remedy details") || q.includes("research"))
            return "long_reasoning";
        if (q.includes("is homeopathy") || q.includes("how long") || q.includes("fee") || q.includes("location") || q.includes("schedule"))
            return "faq";
        return "conversation";
    }
    // Helper executing provider call with retry-once-on-500 & key check
    async executeProviderCall(providerName, modelName, callFn) {
        let attempts = 0;
        while (true) {
            attempts++;
            try {
                return await callFn();
            }
            catch (err) {
                const status = getErrorStatus(err);
                if (status === 401) {
                    const provider = providerHealthCache[providerName];
                    if (provider) {
                        provider.status = "Disabled";
                        provider.retryAfter = Date.now() + (100 * 365 * 24 * 60 * 60 * 1000); // Disable until restart
                    }
                    console.error(`[AIRouter] Provider ${providerName} disabled until restart due to Invalid API Key.`);
                    throw err;
                }
                if (status === 500 && attempts === 1) {
                    console.warn(`[AIRouter] Provider ${providerName} model ${modelName} failed with 500. Retrying once...`);
                    continue; // retry once
                }
                throw err;
            }
        }
    }
    // Main router method using staggered parallel failover racing
    async consultAI(query, systemInstruction, options = {}) {
        const startTime = Date.now();
        const taskCategory = this.classifyTask(query);
        // Dynamic discovery calls in background
        if (process.env.GEMINI_API_KEY) {
            discoverNewGeminiModels(process.env.GEMINI_API_KEY).catch(() => { });
        }
        if (process.env.QWEN_API_KEY) {
            discoverQwenModels(process.env.QWEN_API_KEY).catch(() => { });
        }
        // 1. Check Local Cache first
        const cacheKey = `ai_response:${Buffer.from(query + "_" + systemInstruction + "_" + options.lang).toString("base64")}`;
        const cachedResponse = await cacheService_1.cacheService.get(cacheKey);
        if (cachedResponse) {
            console.log("Response found in Cache.");
            const latency = Date.now() - startTime;
            this.updateStats(true, latency, 0, true, false, cachedResponse.providerUsed);
            this.addRequestLog(query, taskCategory, cachedResponse.providerUsed, cachedResponse.modelUsed, latency, "Success", 0, true, false, 0, 0, 0);
            return {
                success: true,
                response: cachedResponse.response,
                providerUsed: cachedResponse.providerUsed,
                modelUsed: cachedResponse.modelUsed,
                latencyMs: latency,
                retryCount: 0,
                cacheHit: true,
                knowledgeHit: false
            };
        }
        // 2. Search local Knowledge Base (RAG)
        try {
            const ragHit = await ragService_1.ragService.queryLocalKnowledge(query);
            if (ragHit) {
                const latency = Date.now() - startTime;
                const result = {
                    success: true,
                    response: ragHit.answer,
                    providerUsed: "Knowledge Base (Local)",
                    modelUsed: "Vector Search",
                    latencyMs: latency,
                    retryCount: 0,
                    cacheHit: false,
                    knowledgeHit: true,
                    citations: ragHit.citations
                };
                const ttl = taskCategory === "faq" ? cacheService_1.CACHE_TTLS.FAQ : cacheService_1.CACHE_TTLS.ARTICLE;
                await cacheService_1.cacheService.set(cacheKey, result, ttl);
                this.updateStats(true, latency, 0, false, true, "Knowledge Base (Local)");
                this.addRequestLog(query, taskCategory, "Knowledge Base (Local)", "Vector Search", latency, "Success", 0, false, true, 0, 0, 0);
                return result;
            }
        }
        catch (e) {
            console.error("Local RAG Search encountered error, continuing:", e);
        }
        // Retrieve RAG Grounding Context if there's no direct high-confidence hit
        let groundingContext = "";
        const activeCitations = [];
        try {
            const searchResults = await ragService_1.ragService.hybridSearch(query);
            const relevantMatches = searchResults
                .filter(r => r.score >= 0.35)
                .slice(0, 3);
            if (relevantMatches.length > 0) {
                console.log(`[AIRouter] Found ${relevantMatches.length} grounding documents for query: "${query.substring(0, 30)}..."`);
                groundingContext = "\n\n[GROUNDING CONTEXT FROM APPROVED HOMEOPATHIC SOURCES]\n";
                relevantMatches.forEach((m, idx) => {
                    groundingContext += `[Source ${idx + 1}]: ${m.document.title}\nContent snippet: ${m.document.content}\n\n`;
                    m.document.citations.forEach(c => {
                        if (!activeCitations.includes(c))
                            activeCitations.push(c);
                    });
                });
                systemInstruction = `${systemInstruction}\n\nGround your medical analysis strictly in the provided approved homeopathic context. Cite your sources dynamically when referencing facts from the context.`;
            }
        }
        catch (e) {
            console.error("[AIRouter] Error fetching grounding context:", e);
        }
        const finalQuery = groundingContext ? `${query}\n\n${groundingContext}` : query;
        // 3. Staggered Parallel Race candidate tasks building
        const tasks = [];
        // Sort Gemini priorities based on intelligent model selection rules
        let geminiPriority = [...geminiModels];
        if (taskCategory === "reasoning" || taskCategory === "long_reasoning") {
            const proModels = geminiPriority.filter(m => m.includes("pro"));
            const flashModels = geminiPriority.filter(m => !m.includes("pro"));
            geminiPriority = [...proModels, ...flashModels];
        }
        else {
            const flashModels = geminiPriority.filter(m => m.includes("flash"));
            const proModels = geminiPriority.filter(m => !m.includes("flash"));
            geminiPriority = [...flashModels, ...proModels];
        }
        const geminiKey = process.env.GEMINI_API_KEY;
        // Queue Gemini models if key exists and provider is healthy
        if (geminiKey && !this.isProviderDisabled("Gemini")) {
            for (const mName of geminiPriority) {
                if (!isModelFailed(mName)) {
                    tasks.push({
                        name: `Gemini (${mName})`,
                        provider: "Gemini",
                        model: mName,
                        run: async (signal) => {
                            return await this.executeProviderCall("Gemini", mName, () => this.callGemini(geminiKey, mName, finalQuery, systemInstruction, signal));
                        }
                    });
                }
            }
        }
        // Queue DeepSeek
        if (process.env.DEEPSEEK_API_KEY && !this.isProviderDisabled("DeepSeek") && !isModelFailed("deepseek-chat")) {
            tasks.push({
                name: "DeepSeek (deepseek-chat)",
                provider: "DeepSeek",
                model: "deepseek-chat",
                run: async (signal) => {
                    return await this.executeProviderCall("DeepSeek", "deepseek-chat", () => this.callDeepSeek(process.env.DEEPSEEK_API_KEY, finalQuery, systemInstruction, signal));
                }
            });
        }
        // Queue Qwen
        if (process.env.QWEN_API_KEY && !this.isProviderDisabled("Qwen")) {
            try {
                if (qwenModels.length === 0) {
                    await discoverQwenModels(process.env.QWEN_API_KEY);
                }
                const model = selectQwenModel(taskCategory);
                if (!isModelFailed(model)) {
                    tasks.push({
                        name: `Qwen (${model})`,
                        provider: "Qwen",
                        model: model,
                        run: async (signal) => {
                            return await this.executeProviderCall("Qwen", model, () => this.callQwen(process.env.QWEN_API_KEY, model, finalQuery, systemInstruction, signal));
                        }
                    });
                }
            }
            catch (err) {
                console.error("[AIRouter] Qwen model selection failed dynamically:", err.message);
            }
        }
        // Queue GLM
        if (process.env.GLM_API_KEY && !this.isProviderDisabled("GLM") && !isModelFailed("glm-4")) {
            tasks.push({
                name: "GLM (glm-4)",
                provider: "GLM",
                model: "glm-4",
                run: async (signal) => {
                    return await this.executeProviderCall("GLM", "glm-4", () => this.callGLM(process.env.GLM_API_KEY, finalQuery, systemInstruction, signal));
                }
            });
        }
        // Queue Hugging Face (with dynamic candidate checking internally)
        if (process.env.HF_API_KEY && !this.isProviderDisabled("HuggingFace")) {
            tasks.push({
                name: "HuggingFace (dynamic)",
                provider: "HuggingFace",
                model: "hf-dynamic",
                run: async (signal) => {
                    return await this.executeProviderCall("HuggingFace", "hf-dynamic", () => this.callHuggingFace(process.env.HF_API_KEY, finalQuery, systemInstruction, signal));
                }
            });
        }
        // Queue Ollama Local fallback (if online)
        const ollamaOnline = await ollama_1.ollamaService.checkHealth();
        if (ollamaOnline && !this.isProviderDisabled("Ollama")) {
            tasks.push({
                name: "Ollama (Local)",
                provider: "Ollama",
                model: "ollama-local",
                run: async (signal) => {
                    const selectType = taskCategory === "reasoning" || taskCategory === "long_reasoning"
                        ? "reasoning"
                        : taskCategory === "coding"
                            ? "primary"
                            : "general";
                    const model = ollama_1.ollamaService.selectModel(selectType);
                    return await ollama_1.ollamaService.generate(model, finalQuery, systemInstruction, { signal });
                }
            });
        }
        if (tasks.length === 0) {
            console.error("[AIRouter] No candidate providers/models available for routing.");
            return this.returnFailureResponse(startTime, query, taskCategory, 0, "No candidate providers configured or available");
        }
        // 4. Run staggered race (stagger timeout is 4 seconds)
        try {
            const raceResult = await this.runWithStaggeredFallback(tasks, 4000);
            // Calculate token counts
            const promptTokens = Math.ceil((finalQuery.length + systemInstruction.length) / 4);
            const completionTokens = Math.ceil(raceResult.response.length / 4);
            const totalTokens = promptTokens + completionTokens;
            const result = {
                success: true,
                response: raceResult.response,
                providerUsed: raceResult.provider,
                modelUsed: raceResult.model,
                latencyMs: raceResult.latencyMs,
                retryCount: 0,
                cacheHit: false,
                knowledgeHit: activeCitations.length > 0,
                citations: activeCitations.length > 0 ? activeCitations : undefined
            };
            // Record success in health manager
            this.recordSuccess(raceResult.provider, raceResult.model, raceResult.latencyMs, totalTokens);
            // Cache response
            const ttl = taskCategory === "faq" ? cacheService_1.CACHE_TTLS.FAQ : cacheService_1.CACHE_TTLS.ARTICLE;
            await cacheService_1.cacheService.set(cacheKey, result, ttl);
            this.updateStats(true, raceResult.latencyMs, 0, false, activeCitations.length > 0, raceResult.provider);
            this.addRequestLog(query, taskCategory, raceResult.provider, raceResult.model, raceResult.latencyMs, "Success", 0, false, activeCitations.length > 0, promptTokens, completionTokens, totalTokens);
            return result;
        }
        catch (err) {
            console.error("[AIRouter] All raced providers failed:", err.message || err);
            return this.returnFailureResponse(startTime, query, taskCategory, 0, err.message || "All raced providers failed");
        }
    }
    returnFailureResponse(startTime, query, taskCategory, retries, reason) {
        const latency = Date.now() - startTime;
        this.updateStats(false, latency, retries, false, false, "None");
        this.addRequestLog(query, taskCategory, "None", "None", latency, "Failed", retries, false, false, 0, 0, 0, reason);
        return {
            success: false,
            response: "Lucy is taking a short rest. Please review your Vitality Score or symptom map on the dashboard while I synchronize with Dr. Jethwani.",
            providerUsed: "None",
            modelUsed: "None",
            latencyMs: latency,
            retryCount: retries,
            cacheHit: false,
            knowledgeHit: false,
            error: reason
        };
    }
    // Staggered race runner
    async runWithStaggeredFallback(tasks, timeoutMs = 4000) {
        const controllers = [];
        const activePromises = new Map();
        const errors = [];
        const startTimes = new Map();
        let successValue = null;
        const cleanup = (successIndex) => {
            controllers.forEach((controller, idx) => {
                if (idx !== successIndex) {
                    try {
                        controller.abort();
                    }
                    catch {
                        // ignore
                    }
                }
            });
        };
        const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(TIMEOUT_TOKEN), ms));
        let nextIndex = 0;
        while (successValue === null) {
            if (nextIndex < tasks.length && !activePromises.has(nextIndex)) {
                const idx = nextIndex;
                const controller = new AbortController();
                controllers[idx] = controller;
                startTimes.set(idx, Date.now());
                console.log(`[AIRouter] Launching staggered task ${idx}: ${tasks[idx].name}`);
                const promise = tasks[idx].run(controller.signal)
                    .then((res) => {
                    return { type: "success", index: idx, value: res };
                })
                    .catch((err) => {
                    return { type: "error", index: idx, error: err };
                });
                activePromises.set(idx, promise);
                nextIndex++;
            }
            if (activePromises.size === 0) {
                break;
            }
            const promisesToRace = Array.from(activePromises.values());
            if (nextIndex < tasks.length) {
                const result = await Promise.race([...promisesToRace, delay(timeoutMs)]);
                if (result === TIMEOUT_TOKEN) {
                    console.log(`[AIRouter] Stagger timeout reached after ${timeoutMs}ms. Activating next task...`);
                    continue;
                }
                const { type, index, value, error } = result;
                activePromises.delete(index);
                const latency = Date.now() - startTimes.get(index);
                if (type === "success") {
                    const responseText = typeof value === "string" ? value : value.response;
                    const resolvedModel = (typeof value === "object" && value.modelUsed) ? value.modelUsed : tasks[index].model;
                    successValue = {
                        response: responseText,
                        provider: tasks[index].provider,
                        model: resolvedModel,
                        latencyMs: latency
                    };
                    cleanup(index);
                    break;
                }
                else {
                    const status = getErrorStatus(error);
                    console.warn(`[AIRouter] Task ${index} (${tasks[index].name}) failed in ${latency}ms (Status: ${status}):`, error.message || error);
                    this.recordFailure(tasks[index].provider, tasks[index].model, error);
                    if (status === 429) {
                        markModelFailed(tasks[index].model);
                    }
                    errors.push({ name: tasks[index].name, message: error.message || String(error), status });
                }
            }
            else {
                const result = await Promise.race(promisesToRace);
                const { type, index, value, error } = result;
                activePromises.delete(index);
                const latency = Date.now() - startTimes.get(index);
                if (type === "success") {
                    const responseText = typeof value === "string" ? value : value.response;
                    const resolvedModel = (typeof value === "object" && value.modelUsed) ? value.modelUsed : tasks[index].model;
                    successValue = {
                        response: responseText,
                        provider: tasks[index].provider,
                        model: resolvedModel,
                        latencyMs: latency
                    };
                    cleanup(index);
                    break;
                }
                else {
                    const status = getErrorStatus(error);
                    console.warn(`[AIRouter] Final task ${index} (${tasks[index].name}) failed in ${latency}ms:`, error.message || error);
                    this.recordFailure(tasks[index].provider, tasks[index].model, error);
                    if (status === 429) {
                        markModelFailed(tasks[index].model);
                    }
                    errors.push({ name: tasks[index].name, message: error.message || String(error), status });
                }
            }
        }
        if (successValue !== null) {
            return successValue;
        }
        throw new Error(`All providers failed: ${errors.map(e => `${e.name}: ${e.message}`).join("; ")}`);
    }
    // --- API Providers Call Implementations ---
    async callDeepSeek(apiKey, query, system, signal) {
        const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: system },
                    { role: "user", content: query }
                ],
                temperature: 0.3,
                max_tokens: 1024
            }),
            signal
        });
        if (!res.ok)
            throw new Error(`DeepSeek API returned code ${res.status}`);
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
    }
    async callQwen(apiKey, model, query, system, signal) {
        const endpoint = process.env.QWEN_API_ENDPOINT || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
        const isOpenAiCompatible = endpoint.includes("/compatible-mode") || endpoint.includes("/v1");
        const fetchUrl = isOpenAiCompatible
            ? (endpoint.endsWith("/chat/completions") ? endpoint : `${endpoint}/chat/completions`)
            : endpoint;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };
        const body = isOpenAiCompatible
            ? {
                model,
                messages: [
                    { role: "system", content: system },
                    { role: "user", content: query }
                ],
                temperature: 0.3,
                max_tokens: 1024
            }
            : {
                model,
                input: {
                    messages: [
                        { role: "system", content: system },
                        { role: "user", content: query }
                    ]
                },
                parameters: {
                    temperature: 0.3,
                    max_tokens: 1024
                }
            };
        const res = await fetch(fetchUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Qwen API returned code ${res.status}: ${errorText}`);
        }
        const data = await res.json();
        if (isOpenAiCompatible) {
            return data.choices?.[0]?.message?.content || "";
        }
        return data.output?.text || data.choices?.[0]?.message?.content || "";
    }
    async callGLM(apiKey, query, system, signal) {
        const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "glm-4",
                messages: [
                    { role: "system", content: system },
                    { role: "user", content: query }
                ],
                temperature: 0.3
            }),
            signal
        });
        if (!res.ok)
            throw new Error(`GLM API returned code ${res.status}`);
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
    }
    async callGemini(apiKey, modelName, query, system, signal) {
        // Map future-proof model names to real supported API identifiers
        let actualModelName = modelName;
        if (modelName === "gemini-2.5-flash") {
            actualModelName = "gemini-2.0-flash";
        }
        else if (modelName === "gemini-2.5-pro") {
            actualModelName = "gemini-2.0-pro-exp-02-05";
        }
        const ai = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: actualModelName });
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: `System Instructions:\n${system}\n\nUser Question:\n${query}` }]
                }
            ],
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.4
            }
        }, { signal });
        const text = result.response.text();
        if (!text) {
            throw new Error(`Gemini model ${modelName} returned empty response`);
        }
        return text;
    }
    async callHuggingFace(apiKey, query, system, signal) {
        const candidates = [
            "Qwen/Qwen2.5-Coder-32B-Instruct",
            "Qwen/Qwen2.5-72B-Instruct",
            "meta-llama/Llama-3.3-70B-Instruct",
            "meta-llama/Llama-3.1-8B-Instruct",
            "meta-llama/Meta-Llama-3-8B-Instruct"
        ];
        let lastError = null;
        for (const model of candidates) {
            if (isModelFailed(model)) {
                continue;
            }
            console.log(`[AIRouter] Attempting HuggingFace model: ${model}`);
            let delay = 2000;
            for (let attempt = 1; attempt <= 3; attempt++) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout
                if (signal) {
                    if (signal.aborted) {
                        clearTimeout(timeoutId);
                        throw new Error("Aborted");
                    }
                    const abortHandler = () => {
                        controller.abort();
                    };
                    signal.addEventListener("abort", abortHandler);
                    // Cleanup handler after request settles
                    controller.signal.addEventListener("abort", () => {
                        signal.removeEventListener("abort", abortHandler);
                    });
                }
                try {
                    const res = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [
                                { role: "system", content: system },
                                { role: "user", content: query }
                            ],
                            max_tokens: 1024,
                            temperature: 0.3
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    if (!res.ok) {
                        const errText = await res.text();
                        throw new Error(`HF API returned code ${res.status}: ${errText}`);
                    }
                    const data = await res.json();
                    const text = data.choices?.[0]?.message?.content || "";
                    if (!text) {
                        throw new Error("Empty response from HuggingFace model");
                    }
                    const resolvedModel = data.model || model;
                    return { response: text, modelUsed: resolvedModel };
                }
                catch (err) {
                    clearTimeout(timeoutId);
                    console.warn(`[AIRouter] HF model ${model} attempt ${attempt} failed:`, err.message || err);
                    lastError = err;
                    if (signal?.aborted || (err.name === "AbortError" && signal?.aborted)) {
                        throw err;
                    }
                    if (attempt < 3) {
                        const jitterDelay = delay + Math.random() * 1000;
                        console.log(`[AIRouter] Retrying HF model ${model} in ${Math.round(jitterDelay)}ms...`);
                        await new Promise(resolve => setTimeout(resolve, jitterDelay));
                        delay *= 2;
                    }
                }
            }
            markModelFailed(model);
        }
        throw new Error(`All HuggingFace models in fallback chain failed. Last error: ${lastError?.message || String(lastError)}`);
    }
}
exports.AIRouterService = AIRouterService;
exports.aiRouterService = new AIRouterService();
