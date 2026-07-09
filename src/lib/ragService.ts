import { ollamaService } from "./ollama";
import { MASTER_REMEDY_DB } from "./materiaMedicaDb";
import { ORGANON_APHORISMS } from "./organonData";
import { globalVectorStore } from "../features/knowledge/retrieval/vectorStore";
import { embeddingManager } from "../features/knowledge/retrieval/embeddingProvider";

export interface KnowledgeDocument {
  id: string;
  category: string;
  title: string;
  content: string;
  citations: string[];
  tags: string[];
}

// In-memory knowledge base containing clinical protocols, FAQs, brand info, and policies.
export const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  // Philosophy & Brand
  {
    id: "kb_brand_philosophy",
    category: "Philosophy",
    title: "Homeo Healthcare Treatment Philosophy",
    content: "Homeo Healthcare, founded by Dr. Narayan Jethwani MD (Hom.), integrates classical homeopathic principles with modern diagnostic science. We focus on evidence-based homeopathic treatment, documenting patient recovery through objective parameters like blood panels and scans.",
    citations: ["Homeo Healthcare Clinical Charter, 2026", "Dr. Narayan Jethwani MD (Hom.) Practices"],
    tags: ["philosophy", "evidence-based", "science", "dr jethwani", "foundation"]
  },
  {
    id: "kb_law_of_similars",
    category: "Philosophy",
    title: "The Law of Similars (Similia Similibus Curentur)",
    content: "The fundamental law of homeopathy is 'Like cures like'. A substance that produces symptoms in a healthy individual can stimulate the body's vital force to heal similar symptoms in a sick person when administered in potentized minimum doses.",
    citations: ["Hahnemann's Organon of Medicine, 6th Edition"],
    tags: ["law of similars", "like cures like", "principles", "organon"]
  },
  {
    id: "kb_individualization",
    category: "Philosophy",
    title: "Individualized Constitutional Treatment",
    content: "Homeopathic remedy selection is based on individualization. Rather than prescribing for a disease name, the homeopath analyzes the patient's unique physical constitution, emotional temperament, genetic predispositions, and modalities (factors making symptoms better or worse).",
    citations: ["Kent's Lectures on Homeopathic Philosophy"],
    tags: ["individualization", "constitution", "remedy selection", "philosophy"]
  },

  // FAQs
  {
    id: "faq_evidence_based",
    category: "FAQ",
    title: "Is Homeopathy scientifically proven?",
    content: "Yes. Modern homeopathy relies on double-blind randomized controlled trials (RCTs), in-vitro laboratory studies, and observational trials showing clinical efficacy. Homeopathic micro-dilutions contain active nanoparticle structures of the original substance that interact with cellular membranes to stimulate self-regulation.",
    citations: ["Consortium for Homeopathic Research Publications, 2024", "Nanoparticle Theory in High Dilutions, Bell et al."],
    tags: ["science", "proof", "proven", "research", "placebo", "nanoparticle"]
  },
  {
    id: "faq_allopathy_combination",
    category: "FAQ",
    title: "Can homeopathic remedies be taken with conventional allopathic drugs?",
    content: "Yes. Homeopathic remedies act on a dynamic, self-regulatory level and do not chemically react with conventional pharmacological drugs. However, patients must keep both prescribing physicians informed, and any tapering of conventional medications must be done under supervision.",
    citations: ["Integrated Medicine Guidelines, Homeo Healthcare"],
    tags: ["allopathy", "english medicine", "combination", "drugs", "interaction"]
  },
  {
    id: "faq_duration",
    category: "FAQ",
    title: "How long does homeopathic treatment take to show results?",
    content: "Acute conditions (such as fevers, acute indigestion, or sprains) can respond within minutes to hours. For long-standing chronic diseases, treatment requires time to correct deep constitutional miasms. The general rule is approximately one month of treatment for every year of illness.",
    citations: ["Chronic Diseases, Samuel Hahnemann"],
    tags: ["duration", "time", "how long", "slow", "acute", "chronic"]
  },
  {
    id: "faq_dietary_rules",
    category: "FAQ",
    title: "What are the dietary restrictions during homeopathic treatment?",
    content: "It is recommended to avoid strong aromatic substances like raw onion, raw garlic, mint, coffee, and camphor within 15-20 minutes of taking a remedy. These aromatics can overwhelm olfactory and sublingual receptors, potentially antidoting or weakening highly sensitive homeopathic potencies.",
    citations: ["Homeo Healthcare Patient Guide"],
    tags: ["diet", "onion", "garlic", "coffee", "camphor", "restrictions"]
  },

  // Clinic Policies & Booking
  {
    id: "policy_booking",
    category: "Clinic Policy",
    title: "How to book an appointment with Dr. Narayan Jethwani",
    content: "Consultations with Dr. Narayan Jethwani MD (Hom.) are booked directly via WhatsApp message or through the scheduling widget on our portal. Walk-in slots are subject to availability; advance booking is highly recommended.",
    citations: ["Homeo Healthcare Appointment Portal"],
    tags: ["booking", "schedule", "appointment", "dr jethwani", "whatsapp", "contact"]
  },
  {
    id: "policy_emergencies",
    category: "Clinic Policy",
    title: "Emergency and Acute Care Protocols",
    content: "Homeo Healthcare is an outpatient constitutional clinic. In case of life-threatening medical emergencies (e.g., severe chest pain, sudden paralysis, breathing failure, severe trauma), patients must contact their local emergency service (e.g., dial 102/108 or proceed to the nearest hospital emergency room) immediately.",
    citations: ["Homeo Healthcare Emergency Response Policy"],
    tags: ["emergency", "hospital", "acute", "danger", "chest pain"]
  },

  // Disease Database / Clinical Protocols
  {
    id: "protocol_hpa_axis",
    category: "Clinical Protocol",
    title: "HPA Axis Dysregulation & Stress Adaptation",
    content: "Chronic stress triggers hypothalamic-pituitary-adrenal (HPA) axis dysregulation, elevating cortisol and proinflammatory cytokines (IL-6, TNF-alpha). In classical homeopathy, remedies like Aurum metallicum, Ignatia amara, and Phosphoricum acidum are selected based on constitutional modalities to restore homeostatic endocrine function.",
    citations: ["HPA Axis and Homeostasis Study, Jethwani et al.", "Endocrine Pathophysiology"],
    tags: ["hpa axis", "cortisol", "stress", "endocrine", "aurum", "ignatia"]
  },
  {
    id: "protocol_ckd_renal",
    category: "Clinical Protocol",
    title: "Chronic Kidney Disease (CKD) Management Protocol",
    content: "For Chronic Kidney Disease, the clinical protocol focuses on reducing metabolic load, managing blood pressure, and supporting glomerular filtration rate (GFR). Homeopathic support (e.g., Apis mellifica, Serum anguillae) is prescribed alongside routine serum creatinine and BUN monitoring.",
    citations: ["Renal Care Protocols, Homeo Healthcare, 2025"],
    tags: ["ckd", "kidney", "renal", "creatinine", "apis", "serum anguillae"]
  }
];

export interface SearchResult {
  document: KnowledgeDocument;
  score: number;
}

export interface SearchResultList extends Array<SearchResult> {
  metadata?: {
    vectorCoveragePercent: number;
    numVectorEnabledDocs: number;
    numMissingVectors: number;
    numDimensionMismatches: number;
    fallbackModeUsed: "none" | "text-only-fallback" | "dimension-mismatch-fallback" | "partial-vector-fallback";
    embeddingProviderUsed: string;
    searchDurationMs: number;
  };
}

export class RAGService {
  private vectorDbUrl: string | null;
  private unifiedDb: KnowledgeDocument[] | null = null;

  constructor() {
    this.vectorDbUrl = process.env.VECTOR_DB_URL || null;
  }

  public getUnifiedDb(): KnowledgeDocument[] {
    const docs = [...KNOWLEDGE_BASE];

    // 1. Map MASTER_REMEDY_DB
    if (Array.isArray(MASTER_REMEDY_DB)) {
      MASTER_REMEDY_DB.forEach((rem) => {
        const title = `Materia Medica Remedy: ${rem.identity.name} (${rem.identity.abbreviation})`;
        const content = `Remedy name: ${rem.identity.name} (${rem.identity.abbreviation}). Kingdom: ${rem.identity.kingdom}. Family: ${rem.identity.family}. Source: ${rem.identity.sourceSubstance}. Core Theme: ${rem.essence?.coreTheme || ""}. Mental personality picture: ${rem.mentalPicture?.personality || ""}. Modalities better from: ${rem.modalities?.betterFrom?.join(", ") || ""}; worse from: ${rem.modalities?.worseFrom?.join(", ") || ""}. Keynotes: ${rem.keynotes?.top10?.join(", ") || ""}. Dominant miasm: ${rem.miasmaticAnalysis?.dominantMiasm || ""}. relationships complementary: ${rem.relationships?.complementary?.join(", ") || ""}; inimical: ${rem.relationships?.inimical?.join(", ") || ""}.`;
        docs.push({
          id: `rem_${rem.id}`,
          category: "Materia Medica",
          title,
          content,
          citations: [`Kent's/Boericke's Materia Medica: ${rem.identity.name}`, `Homeo Healthcare Database`],
          tags: [rem.identity.name.toLowerCase(), rem.identity.abbreviation.toLowerCase(), rem.identity.kingdom.toLowerCase(), "materia medica", "remedy", "protocol"]
        });
      });
    }

    // 2. Map ORGANON_APHORISMS
    if (Array.isArray(ORGANON_APHORISMS)) {
      ORGANON_APHORISMS.forEach((aph) => {
        const title = `Organon of Medicine ${aph.number}: ${aph.title}`;
        const content = `Organon Aphorism ${aph.number} (${aph.edition}): ${aph.title}. Text: ${aph.originalText}. Modern Translation: ${aph.modernTranslation}. Clinical meaning: ${aph.clinicalMeaning}. Practical application: ${aph.practicalApplication}. related concepts: ${aph.relatedConcepts?.join(", ") || ""}. related remedies: ${aph.relatedRemedies?.join(", ") || ""}.`;
        docs.push({
          id: `org_${aph.id}`,
          category: "Organon",
          title,
          content,
          citations: [`Samuel Hahnemann, Organon of Medicine 6th Edition, Aphorism ${aph.number}`, `Clinical Meaning of Aphorism ${aph.number}`],
          tags: [aph.number.toLowerCase(), aph.title.toLowerCase(), "organon", "aphorism", "hahnemann", "principles"]
        });
      });
    }

    // 3. Map Dynamic CMS Published Knowledge Entities
    try {
      const { globalKmsRepository } = require("../features/knowledge-admin/repositories/MemoryRepository");
      if (globalKmsRepository && typeof globalKmsRepository.getEntitiesSync === "function") {
        const cmsEntities = globalKmsRepository.getEntitiesSync();
        const published = cmsEntities.filter((e: any) => e.editorialStatus === "published");
        
        published.forEach((entity: any) => {
          const bodyText = typeof entity.content?.overview === "string" 
            ? entity.content.overview 
            : typeof entity.content?.description === "string" 
              ? entity.content.description 
              : "";
          const titleStr = typeof entity.title === "string" ? entity.title : (entity.title.en || "");
          
          docs.push({
            id: entity.id,
            category: entity.entityType,
            title: titleStr,
            content: `${titleStr}. ${bodyText}`,
            citations: entity.content?.references || [],
            tags: entity.tags || []
          });
        });
      }
    } catch (err) {
      console.warn("[RAGService] Failed to load dynamic CMS published entities into search index:", err);
    }

    return docs;
  }

  // Calculate cosine similarity between two vectors (dimension resilient)
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    const len = Math.min(vecA.length, vecB.length);
    for (let i = 0; i < len; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Tokenize and clean text for basic search
  private getTokens(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(t => t.length > 2)
    );
  }

  // Jaccard similarity for keyword scoring
  private jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  // Central search method: executes local hybrid search (keyword + cached semantic vector search)
  async hybridSearch(query: string): Promise<SearchResultList> {
    const startTime = Date.now();
    console.log(`Executing local hybrid search for query: "${query}"`);
    const queryTokens = this.getTokens(query);
    const results: SearchResult[] = [];

    // Ensure seed vectors are loaded
    await globalVectorStore.loadSeedVectors();

    // Try to get vector embedding for query using embedding provider manager
    let queryVector: number[] | null = null;
    const provider = await embeddingManager.getActiveProvider();
    const providerName = provider.name;

    if (providerName !== "null-provider") {
      try {
        queryVector = await provider.getEmbeddings(query);
      } catch (err) {
        console.warn(`Failed to retrieve embeddings from provider ${providerName}. Falling back to keyword search.`, err);
      }
    }

    let numVectorEnabledDocs = 0;
    let numMissingVectors = 0;
    let numDimensionMismatches = 0;

    const unifiedDocs = this.getUnifiedDb();

    for (const doc of unifiedDocs) {
      // 1. Keyword Score (Weighted Query Coverage and Jaccard)
      const docText = `${doc.title} ${doc.content} ${doc.tags.join(" ")}`;
      const docTokens = this.getTokens(docText);
      
      const intersection = new Set([...queryTokens].filter(x => docTokens.has(x)));
      const queryCoverage = queryTokens.size > 0 ? intersection.size / queryTokens.size : 0;
      const jaccardScore = this.jaccardSimilarity(queryTokens, docTokens);
      
      // Keyword score is primarily coverage, with Jaccard as a secondary tie-breaker
      const keywordScore = queryCoverage * 0.85 + jaccardScore * 0.15;

      // 2. Exact Match Boost
      let exactBoost = 0;
      const lowerQuery = query.toLowerCase();
      if (doc.title.toLowerCase().includes(lowerQuery)) exactBoost += 0.3;
      for (const tag of doc.tags) {
        if (lowerQuery.includes(tag.toLowerCase())) exactBoost += 0.15;
      }

      // 3. Vector Score (from cached vector store)
      let vectorScore = 0;
      if (queryVector) {
        try {
          const cachedRecord = await globalVectorStore.getVector(doc.id);
          
          if (!cachedRecord || !cachedRecord.vector || cachedRecord.vector.length === 0) {
            numMissingVectors++;
            vectorScore = 0;
          } else if (cachedRecord.vector.length !== queryVector.length) {
            numDimensionMismatches++;
            vectorScore = 0;
            console.warn(`[RAG Search] Dimension mismatch for doc ${doc.id} (cached: ${cachedRecord.vector.length}, query: ${queryVector.length}). Skipping semantic scoring for this document.`);
          } else {
            numVectorEnabledDocs++;
            vectorScore = this.cosineSimilarity(queryVector, cachedRecord.vector);
          }
        } catch (e) {
          console.warn(`Failed to score vector similarity for ${doc.id}:`, e);
          vectorScore = 0;
        }
      }

      // Hybrid combination weight
      const finalScore = queryVector
        ? Math.max(0, Math.min(1.0, keywordScore * 0.4 + exactBoost + vectorScore * 0.5))
        : Math.max(0, Math.min(1.0, keywordScore * 0.75 + exactBoost));

      results.push({ document: doc, score: finalScore });
    }

    // Sort descending by score
    const sortedResults = results.sort((a, b) => b.score - a.score) as SearchResultList;

    // Calculate metadata statistics
    const totalDocs = unifiedDocs.length;
    const vectorCoveragePercent = totalDocs > 0 ? (numVectorEnabledDocs / totalDocs) * 100 : 0;

    let fallbackModeUsed: "none" | "text-only-fallback" | "dimension-mismatch-fallback" | "partial-vector-fallback" = "none";
    if (!queryVector) {
      fallbackModeUsed = "text-only-fallback";
    } else if (numDimensionMismatches > 0 && numVectorEnabledDocs === 0) {
      fallbackModeUsed = "dimension-mismatch-fallback";
    } else if (numMissingVectors > 0 || numDimensionMismatches > 0) {
      fallbackModeUsed = "partial-vector-fallback";
    }

    sortedResults.metadata = {
      vectorCoveragePercent,
      numVectorEnabledDocs,
      numMissingVectors,
      numDimensionMismatches,
      fallbackModeUsed,
      embeddingProviderUsed: providerName,
      searchDurationMs: Date.now() - startTime
    };

    return sortedResults;
  }

  // Main RAG Entrypoint: Checks if a local high-confidence answer exists.
  // Returns answer + citations if confidence > 90%, otherwise returns null.
  async queryLocalKnowledge(query: string): Promise<{ answer: string; citations: string[] } | null> {
    const results = await this.hybridSearch(query);
    if (results.length > 0 && results[0].score >= 0.90) {
      console.log(`RAG hit found with confidence score: ${results[0].score.toFixed(3)}. Serving direct response.`);
      return {
        answer: results[0].document.content,
        citations: results[0].document.citations
      };
    }
    return null;
  }
}

export const ragService = new RAGService();
