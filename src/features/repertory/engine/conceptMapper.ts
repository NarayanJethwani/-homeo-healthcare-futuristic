import { RepertoryRubric } from '../types';

export type CanonicalConcept = {
  id: string; // e.g. "concept_headache_better_pressure"
  conceptText: string; // e.g. "HEADACHE — BETTER — PRESSURE"
  definition?: string;
  synonyms: string[];
  createdAt: string;
  updatedAt: string;
};

export type RubricConceptMapping = {
  rubricId: string;
  conceptId: string;
  confidence: number; // 0.0 to 1.0
  relationshipType:
    | "exact-equivalent"
    | "close-equivalent"
    | "broader-than"
    | "narrower-than"
    | "related-to"
    | "historical-variant"
    | "possible-match"
    | "not-equivalent";
  reviewStatus: "draft" | "reviewed" | "approved";
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
};

export class ConceptMapper {
  private static concepts: Map<string, CanonicalConcept> = new Map();
  private static mappings: Map<string, RubricConceptMapping[]> = new Map(); // rubricId -> mappings

  // Pre-seed some default canonical concepts for common clinical presentations
  static {
    const defaultConcepts: CanonicalConcept[] = [
      {
        id: "concept_panic_death_terror",
        conceptText: "PANIC ATTACKS — WITH TERROR OF DEATH",
        definition: "Sudden onset of extreme anxiety accompanied by acute fear of dying.",
        synonyms: ["fear of death", "panic death terror", "sudden panic"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "concept_exhaustion_burnout",
        conceptText: "EXHAUSTION — MENTAL AND PHYSICAL — OVERWORK, FROM",
        definition: "Chronic adrenal fatigue, cognitive slowdown, and burnout from excessive work.",
        synonyms: ["adrenal burnout", "brain fag", "work exhaustion", "mental weariness"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "concept_chilly_sensitivity",
        conceptText: "GENERALITIES — CHILLINESS — SENSITIVENESS TO COLD",
        definition: "Constitutional chilliness and aggravation from exposure to cold air.",
        synonyms: ["chilly", "sensitive to cold", "aggravated by cold"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    defaultConcepts.forEach(c => this.concepts.set(c.id, c));

    // Pre-seed some mappings for the Jethwani SEED_RUBRICS
    const defaultMappings: RubricConceptMapping[] = [
      {
        rubricId: "jeth_rb_panic_death_terror",
        conceptId: "concept_panic_death_terror",
        confidence: 1.0,
        relationshipType: "exact-equivalent",
        reviewStatus: "approved",
        reviewedBy: "CIE Clinical Director",
        reviewedAt: new Date().toISOString()
      },
      {
        rubricId: "jeth_rb_adrenal_burnout",
        conceptId: "concept_exhaustion_burnout",
        confidence: 1.0,
        relationshipType: "exact-equivalent",
        reviewStatus: "approved",
        reviewedBy: "CIE Clinical Director",
        reviewedAt: new Date().toISOString()
      },
      {
        rubricId: "jeth_rb_chilly_sensitive",
        conceptId: "concept_chilly_sensitivity",
        confidence: 1.0,
        relationshipType: "exact-equivalent",
        reviewStatus: "approved",
        reviewedBy: "CIE Clinical Director",
        reviewedAt: new Date().toISOString()
      }
    ];

    defaultMappings.forEach(m => this.addMapping(m));
  }

  static getConceptById(id: string): CanonicalConcept | null {
    return this.concepts.get(id) || null;
  }

  static getConcepts(): CanonicalConcept[] {
    return Array.from(this.concepts.values());
  }

  static addConcept(concept: CanonicalConcept) {
    this.concepts.set(concept.id, { ...concept });
  }

  static getMappingsForRubric(rubricId: string): RubricConceptMapping[] {
    return this.mappings.get(rubricId) || [];
  }

  static getMappingsForConcept(conceptId: string): RubricConceptMapping[] {
    const results: RubricConceptMapping[] = [];
    this.mappings.forEach(list => {
      list.forEach(m => {
        if (m.conceptId === conceptId) {
          results.push(m);
        }
      });
    });
    return results;
  }

  static addMapping(mapping: RubricConceptMapping) {
    if (!this.mappings.has(mapping.rubricId)) {
      this.mappings.set(mapping.rubricId, []);
    }
    const list = this.mappings.get(mapping.rubricId)!;
    // Prevent duplicates
    const idx = list.findIndex(m => m.conceptId === mapping.conceptId);
    if (idx >= 0) {
      list[idx] = { ...mapping };
    } else {
      list.push({ ...mapping });
    }
  }

  /**
   * Automatically attempts to map a source rubric to existing canonical concepts based on text overlap.
   * Auto-generated mappings remain in "draft" status until reviewed.
   */
  static async autoMapRubricToConcept(rubric: RepertoryRubric): Promise<RubricConceptMapping | null> {
    const text = (rubric.originalText || rubric.classicalWording || rubric.title).toLowerCase();
    
    let bestConceptId: string | null = null;
    let maxOverlap = 0;

    for (const concept of this.getConcepts()) {
      // Check overlap with concept title and synonyms
      const terms = [concept.conceptText.toLowerCase(), ...concept.synonyms.map(s => s.toLowerCase())];
      for (const term of terms) {
        // Calculate Jaccard similarity of words
        const w1 = new Set(text.split(/[^a-zA-Z]+/));
        const w2 = new Set(term.split(/[^a-zA-Z]+/));
        
        // Remove noise words
        const noise = new Set(["and", "or", "the", "of", "in", "to", "with", "from"]);
        noise.forEach(n => { w1.delete(n); w2.delete(n); });

        const intersect = new Set([...w1].filter(x => w2.has(x)));
        const union = new Set([...w1, ...w2]);
        const score = union.size > 0 ? intersect.size / union.size : 0;

        if (score > maxOverlap && score >= 0.4) {
          maxOverlap = score;
          bestConceptId = concept.id;
        }
      }
    }

    if (bestConceptId) {
      const mapping: RubricConceptMapping = {
        rubricId: rubric.rubricId,
        conceptId: bestConceptId,
        confidence: Math.round(maxOverlap * 100) / 100,
        relationshipType: maxOverlap >= 0.8 ? "close-equivalent" : "possible-match",
        reviewStatus: "draft"
      };
      this.addMapping(mapping);
      return mapping;
    }

    return null;
  }
}
