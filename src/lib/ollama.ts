import os from "os";


import { providerTelemetryService } from "../features/ai/services/providerTelemetry";


export interface OllamaModelConfig {
  name: string;
  minRamGb: number;
  displayName: string;
}

// Ordered local models with their memory thresholds
export const LOCAL_MODELS: Record<string, OllamaModelConfig> = {
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

export class OllamaService {
  private endpoint: string;

  constructor() {
    this.endpoint = process.env.OLLAMA_HOST || "http://localhost:11434";
  }

  // Get total host memory in gigabytes
  getSystemRamGb(): number {
    return Math.floor(os.totalmem() / (1024 * 1024 * 1024));
  }

  // Auto-detect best model based on available RAM and requested type
  selectModel(type: "primary" | "general" | "reasoning" | "llama" | "mistral" | "low_ram"): string {
    const ram = this.getSystemRamGb();
    console.log(`Auto-detected system RAM: ${ram}GB. Selecting Ollama model for category: ${type}`);

    switch (type) {
      case "primary":
        return ram >= LOCAL_MODELS.primary.minRamGb
          ? LOCAL_MODELS.primary.name
          : LOCAL_MODELS.primary_low.name;
      case "general":
        return ram >= LOCAL_MODELS.general.minRamGb
          ? LOCAL_MODELS.general.name
          : LOCAL_MODELS.general_low.name;
      case "reasoning":
        return ram >= LOCAL_MODELS.reasoning.minRamGb
          ? LOCAL_MODELS.reasoning.name
          : LOCAL_MODELS.reasoning_low.name;
      case "llama":
        return ram >= LOCAL_MODELS.llama.minRamGb
          ? LOCAL_MODELS.llama.name
          : LOCAL_MODELS.llama_low.name;
      case "mistral":
        return ram >= LOCAL_MODELS.mistral.minRamGb
          ? LOCAL_MODELS.mistral.name
          : LOCAL_MODELS.low_ram.name;
      case "low_ram":
      default:
        return LOCAL_MODELS.low_ram.name;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1000); // quick check

      const res = await fetch(`${this.endpoint}/api/tags`, { signal: controller.signal });
      clearTimeout(id);
      const isOnline = res.status === 200;
      try {
        providerTelemetryService.recordReadiness(isOnline ? "Healthy" : "Offline");
      } catch {
        // Safe no-throw
      }
      return isOnline;
    } catch {
      try {
        providerTelemetryService.recordReadiness("Offline");
      } catch {
        // Safe no-throw
      }
      return false;
    }
  }

  async generate(model: string, prompt: string, systemInstruction?: string, options?: { signal?: AbortSignal }): Promise<string> {
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

  async getEmbeddings(text: string): Promise<number[]> {
    const model = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
    const url = `${this.endpoint}/api/embeddings`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 200);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt: text }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Ollama embeddings failed with status: ${res.status}`);
      }

      const data = await res.json();
      try {
        providerTelemetryService.recordEmbeddingOutcome("success");
      } catch {
        // Safe no-throw
      }
      return data.embedding || [];
    } catch {
      try {
        providerTelemetryService.recordEmbeddingOutcome("failed");
      } catch {
        // Safe no-throw
      }
      console.warn(`Ollama embeddings request failed for model ${model}. Returning mock/dummy vector for safety.`);
      // return a dummy vector matching 1536 dims (or 768 dims for nomic)
      return new Array(768).fill(0.01);
    }
  }

  /**
   * Strict corpus-specific Ollama embedding generator.
   * Throws on HTTP non-200, timeout (15s), or signal abort.
   * Never returns synthetic dummy vectors!
   */
  async getRawCorpusEmbedding(text: string, options?: { signal?: AbortSignal }): Promise<number[]> {
    const model = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
    const url = `${this.endpoint}/api/embed`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const onAbort = () => controller.abort();
    if (options?.signal) {
      options.signal.addEventListener("abort", onAbort);
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, input: text }),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error(`Ollama raw corpus embedding failed with status: ${res.status}`);
      }

      const data = await res.json();
      const embedding = Array.isArray(data.embeddings) ? data.embeddings[0] : (data.embedding || []);

      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error("Ollama raw corpus embedding returned empty vector array.");
      }

      // Verify all vector values are finite numbers
      for (const val of embedding) {
        if (typeof val !== "number" || !Number.isFinite(val)) {
          throw new Error("Ollama raw corpus embedding returned non-finite vector value.");
        }
      }

      return embedding;
    } finally {
      clearTimeout(timeoutId);
      if (options?.signal) {
        options.signal.removeEventListener("abort", onAbort);
      }
    }
  }

  /**
   * Discover and validate model descriptor via /api/tags and /api/show.
   */
  async getModelDescriptor(modelName: string = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text"): Promise<{
    modelName: string;
    modelDigest: string;
    expectedDimensions: number;
    normalizationEnum: "L2_NORM_V1";
  }> {
    const OLLAMA_MODEL_ALLOWLIST = ["nomic-embed-text", "all-minilm", "bge-small-en-v1.5"];
    if (!OLLAMA_MODEL_ALLOWLIST.includes(modelName)) {
      throw new Error(`MODEL_UNAVAILABLE: Model '${modelName}' is not in approved Ollama allowlist.`);
    }

    // 1. Fetch tags to discover model digest
    let tagsRes: Response;
    try {
      tagsRes = await fetch(`${this.endpoint}/api/tags`);
    } catch (err: any) {
      throw new Error(`MODEL_UNAVAILABLE: /api/tags fetch failed: ${err.message || err}`);
    }

    if (!tagsRes.ok) {
      throw new Error(`MODEL_UNAVAILABLE: /api/tags returned HTTP ${tagsRes.status}`);
    }

    const tagsData = await tagsRes.json();
    const models = Array.isArray(tagsData.models) ? tagsData.models : [];
    const matched = models.find((m: any) => m.name === modelName || m.name?.startsWith(modelName + ":"));

    if (!matched || !matched.digest || typeof matched.digest !== "string") {
      throw new Error(`MODEL_UNAVAILABLE: Model digest for '${modelName}' not found in /api/tags`);
    }

    let bareDigest = matched.digest;
    if (bareDigest.startsWith("sha256:")) {
      bareDigest = bareDigest.slice(7);
    }
    if (!/^[a-f0-9]{64}$/.test(bareDigest)) {
      throw new Error(`MODEL_UNAVAILABLE: Invalid model digest format '${bareDigest}'`);
    }
    const normalizedDigest = `sha256:${bareDigest}`;

    // 2. Fetch show details to discover dimensions
    let showRes: Response;
    try {
      showRes = await fetch(`${this.endpoint}/api/show`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName })
      });
    } catch (err: any) {
      throw new Error(`MODEL_UNAVAILABLE: /api/show fetch failed: ${err.message || err}`);
    }

    if (!showRes.ok) {
      throw new Error(`MODEL_UNAVAILABLE: /api/show returned HTTP ${showRes.status}`);
    }

    const showData = await showRes.json();
    let dims: number | null = null;

    if (showData && typeof showData === "object") {
      if (showData.details && typeof showData.details.embedding_length === "number") {
        dims = showData.details.embedding_length;
      }
      if (!dims && showData.model_info && typeof showData.model_info === "object") {
        for (const key of Object.keys(showData.model_info)) {
          if (key.endsWith(".embedding_length") && typeof showData.model_info[key] === "number") {
            dims = showData.model_info[key];
            break;
          }
        }
      }
    }

    if (!dims || typeof dims !== "number" || !Number.isInteger(dims) || dims < 64 || dims > 1536) {
      throw new Error(`MODEL_UNAVAILABLE: Valid embedding length not found for model '${modelName}'`);
    }

    return {
      modelName,
      modelDigest: normalizedDigest,
      expectedDimensions: dims,
      normalizationEnum: "L2_NORM_V1"
    };
  }
}

export const ollamaService = new OllamaService();
