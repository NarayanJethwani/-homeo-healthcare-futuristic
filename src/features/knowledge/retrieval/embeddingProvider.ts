import { GoogleGenerativeAI } from "@google/generative-ai";
import { ollamaService } from "../../../lib/ollama";

export interface EmbeddingProvider {
  name: string;
  getEmbeddings(text: string): Promise<number[]>;
  isAvailable(): Promise<boolean>;
}

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  name = "ollama";
  
  async getEmbeddings(text: string): Promise<number[]> {
    return await ollamaService.getEmbeddings(text);
  }
  
  async isAvailable(): Promise<boolean> {
    return await ollamaService.checkHealth();
  }
}

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  name = "gemini";
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }

  async getEmbeddings(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error("Gemini API key is not configured.");
    }
    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      if (result && result.embedding && result.embedding.values) {
        return result.embedding.values;
      }
      throw new Error("Empty response from Gemini embedding service.");
    } catch (e: any) {
      console.warn("Failed to generate embedding via Gemini:", e.message || e);
      throw e;
    }
  }

  async isAvailable(): Promise<boolean> {
    return typeof window === "undefined" && !!this.apiKey;
  }
}

export class NullEmbeddingProvider implements EmbeddingProvider {
  name = "null-provider";
  
  async getEmbeddings(text: string): Promise<number[]> {
    // Return a dummy/empty vector of 768 dimensions for fallback safety
    return new Array(768).fill(0.0);
  }
  
  async isAvailable(): Promise<boolean> {
    return true;
  }
}

export class EmbeddingManager {
  private providers: EmbeddingProvider[] = [];

  constructor() {
    this.providers = [
      new GeminiEmbeddingProvider(),
      new OllamaEmbeddingProvider(),
      new NullEmbeddingProvider()
    ];
  }

  async getActiveProvider(): Promise<EmbeddingProvider> {
    for (const provider of this.providers) {
      try {
        if (await provider.isAvailable()) {
          return provider;
        }
      } catch {
        // Continue to next provider
      }
    }
    return new NullEmbeddingProvider();
  }
}

export const embeddingManager = new EmbeddingManager();
