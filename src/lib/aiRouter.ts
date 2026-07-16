import { cacheService, CACHE_TTLS } from "./cacheService";
import { ragService } from "./ragService";
import { ollamaService } from "./ollama";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProviderPolicy } from "../features/ai-security/provider-policy/providerPolicy";
import { APPROVED_PROVIDERS, ApprovedProviderConfig } from "../features/ai-security/provider-policy/approvedProviders";

export class OrphanedProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrphanedProviderError";
    Object.setPrototypeOf(this, OrphanedProviderError.prototype);
  }
}

// Task categories and preferred model routing rules
export type MedicalTaskCategory =
  | "faq"
  | "reasoning"
  | "conversation"
  | "coding"
  | "summaries"
  | "long_reasoning";

export interface AIResponse {
  success: boolean;
  response: string;
  providerUsed: string;
  modelUsed: string;
  latencyMs: number;
  retryCount: number;
  cacheHit: boolean;
  knowledgeHit: boolean;
  citations?: string[];
  error?: string;
}

export interface ModelHealth {
  model: string;
  latencyMs: number;
  averageResponseTimeMs: number;
  lastSuccess: string | null;
  lastFailure: string | null;
  failureCount: number;
  retryAfter: number | null; // timestamp in ms
  tokensUsedToday: number;
  requestsToday: number;
  consecutiveFailures: number;
}

export interface ProviderHealth {
  provider: string;
  status: "Healthy" | "Degraded" | "Offline" | "Disabled";
  models: Record<string, ModelHealth>;
  consecutiveFailures: number;
  retryAfter: number | null; // timestamp in ms
  requestsToday: number;
  tokensUsedToday: number;
}

export interface RouterStats {
  totalRequests: number;
  failures: number;
  cacheHits: number;
  knowledgeHits: number;
  retries: number;
  fallbacks: number;
  averageLatencyMs: number;
  activeProvider: string;
  providerHealth: Record<string, "Healthy" | "Degraded" | "Offline" | "Disabled">;
  detailedHealth: Record<string, ProviderHealth>;
}

// In-memory circular buffer for requests log
export interface RequestLog {
  timestamp: string;
  query: string;
  category: MedicalTaskCategory;
  provider: string;
  model: string;
  latencyMs: number;
  status: "Success" | "Failed";
  retries: number;
  cacheHit: boolean;
  knowledgeHit: boolean;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  failureReason?: string;
}

const MAX_LOGS = 50;
const requestLogs: RequestLog[] = [];

// Global metrics tracker
const stats: RouterStats = {
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
async function discoverNewGeminiModels(apiKey: string) {
  const now = Date.now();
  if (now - lastDiscoveryTime < DISCOVERY_INTERVAL) return;
  lastDiscoveryTime = now;

  try {
    console.log("[AIRouter] Checking for new Gemini models dynamically...");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) {
      console.warn(`[AIRouter] Failed to fetch Gemini models list: ${res.status}`);
      return;
    }
    const data = await res.json();
    if (!data.models) return;

    const newModels: string[] = [];
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
  } catch (e: any) {
    console.error(`[AIRouter] Error during dynamic Gemini model discovery:`, e.message || e);
  }
}

// Qwen Model Discovery & Selection Logic
let qwenModels: string[] = [];
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

async function discoverQwenModels(apiKey: string) {
  const now = Date.now();
  if (now - lastQwenDiscoveryTime < QWEN_DISCOVERY_INTERVAL && qwenModels.length > 0) return;
  lastQwenDiscoveryTime = now;

  try {
    console.log("[AIRouter] Checking for available Qwen models dynamically...");
    const endpoint = process.env.QWEN_API_ENDPOINT || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
    
    let modelsUrl = "";
    if (endpoint.includes("/compatible-mode") || endpoint.includes("/v1")) {
      const base = endpoint.split("/chat/completions")[0].split("/compatible-mode")[0];
      modelsUrl = `${base}/compatible-mode/v1/models`;
    } else {
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

    const discovered: string[] = [];
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
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });

    qwenModels = discovered;
    console.log(`[AIRouter] Dynamically discovered and ranked Qwen models:`, qwenModels);
  } catch (e: any) {
    console.error(`[AIRouter] Error during dynamic Qwen model discovery:`, e.message || e);
  }
}

function selectQwenModel(taskCategory: MedicalTaskCategory): string {
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
const providerHealthCache: Record<string, ProviderHealth> = {
  Gemini: { provider: "Gemini", status: "Healthy", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
  DeepSeek: { provider: "DeepSeek", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
  Qwen: { provider: "Qwen", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
  GLM: { provider: "GLM", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
  HuggingFace: { provider: "HuggingFace", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 },
  Ollama: { provider: "Ollama", status: "Offline", models: {}, consecutiveFailures: 0, retryAfter: null, requestsToday: 0, tokensUsedToday: 0 }
};

// Map failed models for 5-10 minutes to skip them
const failedModelsCache = new Map<string, number>();

function isModelFailed(modelName: string): boolean {
  const expiry = failedModelsCache.get(modelName);
  if (!expiry) return false;
  if (Date.now() >= expiry) {
    failedModelsCache.delete(modelName);
    return false;
  }
  return true;
}

function markModelFailed(modelName: string) {
  const duration = (5 * 60 * 1000) + Math.random() * (5 * 60 * 1000); // 5-10m with jitter
  failedModelsCache.set(modelName, Date.now() + duration);
  console.log(`[AIRouter] Caching failed model ${modelName} for ${Math.round(duration / 1000 / 60)} minutes.`);
}

function getErrorStatus(err: any): number {
  if (err.status) return err.status;
  const msg = String(err.message || "").toLowerCase();
  if (msg.includes("429") || msg.includes("quota") || msg.includes("too many requests")) return 429;
  if (msg.includes("500") || msg.includes("internal server error")) return 500;
  if (msg.includes("503") || msg.includes("service unavailable")) return 503;
  if (msg.includes("api key") || msg.includes("invalid key") || msg.includes("unauthorized") || msg.includes("401")) return 401;
  return 500; // default
}

interface RaceTask {
  name: string;
  provider: string;
  model: string;
  run: (signal: AbortSignal) => Promise<string | { response: string; modelUsed: string }>;
}

const TIMEOUT_TOKEN = Symbol("TIMEOUT_TOKEN");

export class AIRouterService {
  constructor() {
    this.updateProviderHealth();
    setInterval(() => this.updateProviderHealth(), 60000); // every 1 min
    if (process.env.GEMINI_API_KEY) {
      discoverNewGeminiModels(process.env.GEMINI_API_KEY).catch(() => {});
    }
    if (process.env.QWEN_API_KEY) {
      discoverQwenModels(process.env.QWEN_API_KEY).catch(() => {});
    }
  }

  private initModelHealth(modelName: string): ModelHealth {
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

  isProviderDisabled(providerName: string): boolean {
    const health = providerHealthCache[providerName];
    if (!health) return false;
    
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

  private recordSuccess(providerName: string, modelName: string, latencyMs: number, tokensUsed = 0) {
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

  private recordFailure(providerName: string, modelName: string, error: any) {
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
  private updateStats(success: boolean, latency: number, retries: number, cache: boolean, kb: boolean, provider: string) {
    stats.totalRequests++;
    if (!success) {
      stats.failures++;
    }
    if (cache) stats.cacheHits++;
    if (kb) stats.knowledgeHits++;
    stats.retries += retries;
    if (retries > 0 && success) stats.fallbacks++;
    
    stats.averageLatencyMs = Math.round(
      (stats.averageLatencyMs * (stats.totalRequests - 1) + latency) / stats.totalRequests
    );
    stats.activeProvider = provider;
    stats.detailedHealth = providerHealthCache;

    // Sync simple statuses for dashboard UI
    Object.keys(providerHealthCache).forEach(pKey => {
      const pHealth = providerHealthCache[pKey];
      if (pHealth.status === "Disabled") {
        stats.providerHealth[pKey] = "Offline"; // dashboard renders Offline for Disabled
      } else if (pHealth.status === "Degraded") {
        stats.providerHealth[pKey] = "Degraded";
      } else if (pHealth.status === "Offline") {
        stats.providerHealth[pKey] = "Offline";
      } else {
        stats.providerHealth[pKey] = "Healthy";
      }
    });
  }

  // Log requests helper
  private addRequestLog(
    query: string,
    category: MedicalTaskCategory,
    provider: string,
    model: string,
    latencyMs: number,
    status: "Success" | "Failed",
    retries: number,
    cacheHit: boolean,
    knowledgeHit: boolean,
    promptTokens: number,
    completionTokens: number,
    totalTokens: number,
    failureReason?: string
  ) {
    let sanitizedFailureReason = failureReason;
    if (failureReason) {
      const lowerReason = failureReason.toLowerCase();
      if (lowerReason.includes("safety") || lowerReason.includes("blocked") || lowerReason.includes("refusal")) {
        sanitizedFailureReason = "Safety policy block / safety refusal";
      } else if (lowerReason.includes("api key") || lowerReason.includes("unauthorized") || lowerReason.includes("401") || lowerReason.includes("403")) {
        sanitizedFailureReason = "Authentication/authorization error";
      } else {
        sanitizedFailureReason = "Operational failure / transient error";
      }
    }

    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      query: "[REDACTED_QUERY]",
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
      failureReason: sanitizedFailureReason
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
    const ollamaOnline = await ollamaService.checkHealth();
    providerHealthCache.Ollama.status = ollamaOnline 
      ? (this.isProviderDisabled("Ollama") ? "Disabled" : "Healthy") 
      : "Offline";

    // Sync stats object structure for compat
    stats.detailedHealth = providerHealthCache;
    Object.keys(providerHealthCache).forEach(pKey => {
      const pHealth = providerHealthCache[pKey];
      if (pHealth.status === "Disabled") {
        stats.providerHealth[pKey] = "Offline";
      } else {
        stats.providerHealth[pKey] = pHealth.status === "Offline" ? "Offline" : (pHealth.status === "Degraded" ? "Degraded" : "Healthy");
      }
    });
  }

  getStats(): RouterStats {
    return stats;
  }

  getRequestLogs(): RequestLog[] {
    return requestLogs;
  }

  classifyTask(query: string): MedicalTaskCategory {
    const q = query.toLowerCase();
    if (q.includes("code") || q.includes("programming") || q.includes("script")) return "coding";
    if (q.includes("summarize") || q.includes("summary") || q.includes("digest")) return "summaries";
    if (q.includes("why") || q.includes("explain") || q.includes("pathophysiological") || q.includes("mechanism")) return "reasoning";
    if (q.includes("diagnose") || q.includes("remedy details") || q.includes("research")) return "long_reasoning";
    if (q.includes("is homeopathy") || q.includes("how long") || q.includes("fee") || q.includes("location") || q.includes("schedule")) return "faq";
    return "conversation";
  }

  // Helper executing provider call with retry-once-on-500 & key check
  private async executeProviderCall(
    providerName: string,
    modelName: string,
    callFn: () => Promise<string | { response: string; modelUsed: string }>
  ): Promise<string | { response: string; modelUsed: string }> {
    let attempts = 0;
    while (true) {
      attempts++;
      try {
        return await callFn();
      } catch (err: any) {
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

  // Main router method using sequential fallback queueing
  async consultAI(
    query: string,
    systemInstruction: string,
    options: {
      score?: number;
      answers?: any[];
      logs?: any;
      mode?: string;
      lang?: string;
    },
    dataClassification: "phi" | "non-phi",
    signal?: AbortSignal
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const taskCategory = this.classifyTask(query);
    const hasPHI = dataClassification === "phi";

    // Dynamic discovery calls in background
    if (process.env.GEMINI_API_KEY) {
      discoverNewGeminiModels(process.env.GEMINI_API_KEY).catch(() => {});
    }
    if (process.env.QWEN_API_KEY) {
      discoverQwenModels(process.env.QWEN_API_KEY).catch(() => {});
    }

    // 1. Check Local Cache first (BYPASS completely for PHI queries)
    const cacheKey = `ai_response:${Buffer.from(query + "_" + systemInstruction + "_" + options.lang).toString("base64")}`;
    if (!hasPHI) {
      const cachedResponse = await cacheService.get(cacheKey);
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
    }

    // 2. Search local Knowledge Base (RAG) (BYPASS completely for PHI queries)
    if (!hasPHI) {
      try {
        const ragHit = await ragService.queryLocalKnowledge(query);
        if (ragHit) {
          const latency = Date.now() - startTime;
          const result: AIResponse = {
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
          const ttl = taskCategory === "faq" ? CACHE_TTLS.FAQ : CACHE_TTLS.ARTICLE;
          await cacheService.set(cacheKey, result, ttl);
          
          this.updateStats(true, latency, 0, false, true, "Knowledge Base (Local)");
          this.addRequestLog(query, taskCategory, "Knowledge Base (Local)", "Vector Search", latency, "Success", 0, false, true, 0, 0, 0);
          return result;
        }
      } catch (e) {
        console.error("[AIRouter] Local RAG search failed. Details redacted.");
      }
    }

    // Retrieve RAG Grounding Context if there's no direct high-confidence hit
    let groundingContext = "";
    const activeCitations: string[] = [];

    if (!hasPHI) {
      try {
        const searchResults = await ragService.hybridSearch(query, "ai-clinical-context");
        const relevantMatches = searchResults
          .filter(r => r.score >= 0.35)
          .slice(0, 3);

        if (relevantMatches.length > 0) {
          console.log(`[AIRouter] Found ${relevantMatches.length} grounding documents for query.`);
          groundingContext = "\n\n[GROUNDING CONTEXT FROM APPROVED HOMEOPATHIC SOURCES]\n";
          relevantMatches.forEach((m, idx) => {
            groundingContext += `[Source ${idx + 1}]: ${m.document.title}\nContent snippet: ${m.document.content}\n\n`;
            m.document.citations.forEach(c => {
              if (!activeCitations.includes(c)) activeCitations.push(c);
            });
          });
          
          systemInstruction = `${systemInstruction}\n\nGround your medical analysis strictly in the provided approved homeopathic context. Cite your sources dynamically when referencing facts from the context.`;
        }
      } catch (e) {
        console.error("[AIRouter] Error fetching grounding context. Details redacted.");
      }
    }

    const finalQuery = groundingContext ? `${query}\n\n${groundingContext}` : query;

    // 3. Sequential Candidate tasks building
    const tasks: RaceTask[] = [];

    // Sort Gemini priorities based on intelligent model selection rules
    let geminiPriority = [...geminiModels];
    if (taskCategory === "reasoning" || taskCategory === "long_reasoning") {
      const proModels = geminiPriority.filter(m => m.includes("pro"));
      const flashModels = geminiPriority.filter(m => !m.includes("pro"));
      geminiPriority = [...proModels, ...flashModels];
    } else {
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
            run: async (sig) => {
              return await this.executeProviderCall("Gemini", mName, () => 
                this.callGemini(geminiKey, mName, finalQuery, systemInstruction, sig)
              );
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
        run: async (sig) => {
          return await this.executeProviderCall("DeepSeek", "deepseek-chat", () =>
            this.callDeepSeek(process.env.DEEPSEEK_API_KEY!, finalQuery, systemInstruction, sig)
          );
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
            run: async (sig) => {
              return await this.executeProviderCall("Qwen", model, () =>
                this.callQwen(process.env.QWEN_API_KEY!, model, finalQuery, systemInstruction, sig)
              );
            }
          });
        }
      } catch (err: any) {
        console.error("[AIRouter] Qwen model selection failed dynamically. Details redacted.");
      }
    }

    // Queue GLM
    if (process.env.GLM_API_KEY && !this.isProviderDisabled("GLM") && !isModelFailed("glm-4")) {
      tasks.push({
        name: "GLM (glm-4)",
        provider: "GLM",
        model: "glm-4",
        run: async (sig) => {
          return await this.executeProviderCall("GLM", "glm-4", () =>
            this.callGLM(process.env.GLM_API_KEY!, finalQuery, systemInstruction, sig)
          );
        }
      });
    }

    // Queue Hugging Face (with dynamic candidate checking internally)
    if (process.env.HF_API_KEY && !this.isProviderDisabled("HuggingFace")) {
      tasks.push({
        name: "HuggingFace (dynamic)",
        provider: "HuggingFace",
        model: "hf-dynamic",
        run: async (sig) => {
          return await this.executeProviderCall("HuggingFace", "hf-dynamic", () =>
            this.callHuggingFace(process.env.HF_API_KEY!, finalQuery, systemInstruction, sig)
          );
        }
      });
    }

    // Queue Ollama Local fallback (if online)
    const ollamaOnline = await ollamaService.checkHealth();
    if (ollamaOnline && !this.isProviderDisabled("Ollama")) {
      tasks.push({
        name: "Ollama (Local)",
        provider: "Ollama",
        model: "ollama-local",
        run: async (sig) => {
          const selectType = taskCategory === "reasoning" || taskCategory === "long_reasoning" 
            ? "reasoning" 
            : taskCategory === "coding" 
              ? "primary"
              : "general";
          const model = ollamaService.selectModel(selectType);
          return await ollamaService.generate(model, finalQuery, systemInstruction, { signal: sig });
        }
      });
    }

    // Filter to only governance approved and active models if request classification contains PHI
    if (hasPHI) {
      const phiTasks = tasks.filter(t => {
        const approved = APPROVED_PROVIDERS.find(p => 
          p.modelName === t.model && 
          p.providerId === t.provider && 
          p.phiApproved === true && 
          p.dataRetention === "zero-retention" &&
          p.region &&
          p.contractReferenceId &&
          p.status === "active"
        );
        return !!approved;
      });
      tasks.length = 0;
      tasks.push(...phiTasks);
    }

    if (tasks.length === 0) {
      console.error("[AIRouter] No candidate providers/models available for routing. PHI query fail closed.");
      return this.returnFailureResponse(startTime, query, taskCategory, 0, "No candidate providers configured or available", dataClassification);
    }

    // 4. Run sequential non-overlapping fallback (timeout per candidate is 4 seconds)
    try {
      const raceResult = await this.runWithStaggeredFallback(tasks, 4000, dataClassification, signal);
      
      // Calculate token counts
      const promptTokens = Math.ceil((finalQuery.length + systemInstruction.length) / 4);
      const completionTokens = Math.ceil(raceResult.response.length / 4);
      const totalTokens = promptTokens + completionTokens;

      const result: AIResponse = {
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

      // Cache response (BYPASS for PHI)
      if (!hasPHI) {
        const ttl = taskCategory === "faq" ? CACHE_TTLS.FAQ : CACHE_TTLS.ARTICLE;
        await cacheService.set(cacheKey, result, ttl);
      }

      this.updateStats(true, raceResult.latencyMs, 0, false, activeCitations.length > 0, raceResult.provider);
      
      const logQuery = hasPHI ? "[PHI_REDACTED]" : query;
      this.addRequestLog(logQuery, taskCategory, raceResult.provider, raceResult.model, raceResult.latencyMs, "Success", 0, false, activeCitations.length > 0, promptTokens, completionTokens, totalTokens);

      return result;
    } catch (err: any) {
      if (err instanceof OrphanedProviderError || err.name === "OrphanedProviderError") {
        throw err;
      }
      console.error("[AIRouter] All sequential providers failed. Details redacted.");
      return this.returnFailureResponse(startTime, query, taskCategory, 0, "All sequential providers failed", dataClassification);
    }
  }

  private returnFailureResponse(
    startTime: number,
    query: string,
    taskCategory: MedicalTaskCategory,
    retries: number,
    reason: string,
    dataClassification: "phi" | "non-phi"
  ): AIResponse {
    const latency = Date.now() - startTime;
    this.updateStats(false, latency, retries, false, false, "None");
    
    const logQuery = dataClassification === "phi" ? "[PHI_REDACTED]" : query;
    const logReason = dataClassification === "phi" ? "[ERROR_REDACTED]" : reason;
    this.addRequestLog(logQuery, taskCategory, "None", "None", latency, "Failed", retries, false, false, 0, 0, 0, logReason);

    return {
      success: false,
      response: "Lucy is taking a short rest. Please review your Vitality Score or symptom map on the dashboard while I synchronize with Dr. Jethwani.",
      providerUsed: "None",
      modelUsed: "None",
      latencyMs: latency,
      retryCount: retries,
      cacheHit: false,
      knowledgeHit: false,
      error: logReason
    };
  }

  // Staggered sequential fallback runner: no overlapping provider executions
  private async runWithStaggeredFallback(
    tasks: RaceTask[],
    timeoutMs = 4000,
    dataClassification: "phi" | "non-phi",
    signal?: AbortSignal
  ): Promise<{ response: string; provider: string; model: string; latencyMs: number }> {
    const errors: { name: string; message: string; status: number }[] = [];
    
    for (let i = 0; i < tasks.length; i++) {
      if (signal?.aborted) {
        throw new Error("Request aborted");
      }

      const task = tasks[i];
      const controller = new AbortController();
      const startTime = Date.now();
      
      const onAbort = () => {
        controller.abort();
      };
      if (signal) {
        signal.addEventListener("abort", onAbort);
      }

      console.log(`[AIRouter] Sequential fallback executing task ${i}: ${task.provider} (${task.model})`);

      let timeoutId: any;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Timeout"));
        }, timeoutMs);
      });

      let taskPromise: Promise<any> | null = null;
      try {
        taskPromise = task.run(controller.signal);
        const res = (await Promise.race([taskPromise, timeoutPromise])) as any;
        clearTimeout(timeoutId);
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }

        const responseText = typeof res === "string" ? res : res.response;
        const resolvedModel = (typeof res === "object" && res.modelUsed) ? res.modelUsed : task.model;

        return {
          response: responseText,
          provider: task.provider,
          model: resolvedModel,
          latencyMs: Date.now() - startTime
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        controller.abort(); // actively cancel/abort task execution

        if (err.message === "Timeout" && taskPromise) {
          let graceTimeoutId: any;
          const graceTimeoutPromise = new Promise((_, reject) => {
            graceTimeoutId = setTimeout(() => {
              reject(new OrphanedProviderError("Grace period timeout: task did not settle after abort"));
            }, 1000);
          });

          try {
            await Promise.race([
              taskPromise.then(() => {}).catch(() => {}),
              graceTimeoutPromise
            ]);
            clearTimeout(graceTimeoutId);
          } catch (graceErr: any) {
            clearTimeout(graceTimeoutId);
            throw graceErr; // Rethrow OrphanedProviderError immediately to stop fallback
          }
        }

        if (signal?.aborted) {
          throw new Error("Request aborted");
        }

        const latency = Date.now() - startTime;
        const errMsg = err?.message || String(err);
        const status = getErrorStatus(err);

        console.warn(`[AIRouter] Task ${i} (${task.provider}) failed. Details redacted. Status: ${status}`);
        this.recordFailure(task.provider, task.model, err);

        // Check for safety refusal
        const nextTask = tasks[i + 1] || null;
        const nextCandidate = nextTask ? APPROVED_PROVIDERS.find(p => p.modelName === nextTask.model) || null : null;
        if (!ProviderPolicy.shouldFallback(errMsg, dataClassification, nextCandidate)) {
          console.error("[AIRouter] Non-fallbackable safety/auth error encountered. Details redacted. Aborting race.");
          throw err;
        }

        if (status === 429) {
          markModelFailed(task.model);
        }

        errors.push({ name: task.name, message: "[REDACTED]", status });
      }
    }

    throw new Error("All sequential providers failed. Details redacted.");
  }

  // --- API Providers Call Implementations ---

  private async callDeepSeek(apiKey: string, query: string, system: string, signal?: AbortSignal): Promise<string> {
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

    if (!res.ok) throw new Error(`DeepSeek API returned code ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  private async callQwen(apiKey: string, model: string, query: string, system: string, signal?: AbortSignal): Promise<string> {
    const endpoint = process.env.QWEN_API_ENDPOINT || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
    const isOpenAiCompatible = endpoint.includes("/compatible-mode") || endpoint.includes("/v1");
    const fetchUrl = isOpenAiCompatible 
      ? (endpoint.endsWith("/chat/completions") ? endpoint : `${endpoint}/chat/completions`)
      : endpoint;

    const headers: Record<string, string> = {
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

  private async callGLM(apiKey: string, query: string, system: string, signal?: AbortSignal): Promise<string> {
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

    if (!res.ok) throw new Error(`GLM API returned code ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  private async callGemini(
    apiKey: string,
    modelName: string,
    query: string,
    system: string,
    signal?: AbortSignal
  ): Promise<string> {
    // Map future-proof model names to real supported API identifiers
    let actualModelName = modelName;
    if (modelName === "gemini-2.5-flash") {
      actualModelName = "gemini-2.0-flash";
    } else if (modelName === "gemini-2.5-pro") {
      actualModelName = "gemini-2.0-pro-exp-02-05";
    }

    const ai = new GoogleGenerativeAI(apiKey);
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

  private async callHuggingFace(
    apiKey: string,
    query: string,
    system: string,
    signal?: AbortSignal
  ): Promise<{ response: string; modelUsed: string }> {
    const candidates = [
      "Qwen/Qwen2.5-Coder-32B-Instruct",
      "Qwen/Qwen2.5-72B-Instruct",
      "meta-llama/Llama-3.3-70B-Instruct",
      "meta-llama/Llama-3.1-8B-Instruct",
      "meta-llama/Meta-Llama-3-8B-Instruct"
    ];

    let lastError: any = null;

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
        } catch (err: any) {
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

export const aiRouterService = new AIRouterService();
