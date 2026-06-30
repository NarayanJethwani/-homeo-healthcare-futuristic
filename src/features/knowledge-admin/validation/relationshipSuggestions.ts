import { KmsKnowledgeEntity } from "../types";

export interface RelationshipSuggestion {
  entityId: string;
  title: string;
  type: string;
  confidence: number; // 0 to 1
  reason: string;
}

// Preset mapping dictionary for common clinical conditions to ensure accurate suggestions
const CLINICAL_AFFINITY_DICTIONARY: Record<string, {
  symptoms: string[];
  remedies: string[];
  labTests: string[];
}> = {
  migraine: {
    symptoms: ["headache", "skin-eruptions"], // links to HEAD-headache
    remedies: ["lycopodium", "sulphur"],
    labTests: ["cbc"]
  },
  gerd: {
    symptoms: ["heartburn"],
    remedies: ["nux-vomica", "lycopodium"],
    labTests: ["cbc"]
  },
  eczema: {
    symptoms: ["skin-eruptions"],
    remedies: ["sulphur"],
    labTests: ["cbc"]
  },
  hypothyroidism: {
    symptoms: ["skin-eruptions"],
    remedies: ["lycopodium"],
    labTests: ["tsh"]
  }
};

/**
 * Generates association suggestions for a given entity based on clinical keywords.
 */
export function getRelationshipSuggestions(
  entity: KmsKnowledgeEntity,
  allEntities: KmsKnowledgeEntity[]
): RelationshipSuggestion[] {
  const suggestions: RelationshipSuggestion[] = [];
  const titleLower = (entity.title.en || "").toLowerCase();
  
  // Find preset dictionary key
  const matchKey = Object.keys(CLINICAL_AFFINITY_DICTIONARY).find(key => 
    titleLower.includes(key) || key.includes(titleLower)
  );

  const presets = matchKey ? CLINICAL_AFFINITY_DICTIONARY[matchKey] : null;

  for (const item of allEntities) {
    if (item.id === entity.id) continue;
    if (entity.relatedEntities.includes(item.id)) continue; // Already linked

    const itemTitle = (item.title.en || "").toLowerCase();
    const itemSlug = item.slug.toLowerCase();

    // Check presets first
    if (presets) {
      if (item.entityType === "symptom" && presets.symptoms.some(s => itemSlug.includes(s) || s.includes(itemSlug))) {
        suggestions.push({
          entityId: item.id,
          title: item.title.en,
          type: item.entityType,
          confidence: 0.9,
          reason: `Clinical mapping: symptom matching '${item.title.en}'`
        });
        continue;
      }
      if (item.entityType === "remedy" && presets.remedies.some(r => itemSlug.includes(r) || r.includes(itemSlug))) {
        suggestions.push({
          entityId: item.id,
          title: item.title.en,
          type: item.entityType,
          confidence: 0.9,
          reason: `Clinical mapping: indicated remedy '${item.title.en}'`
        });
        continue;
      }
      if (item.entityType === "lab-test" && presets.labTests.some(l => itemSlug.includes(l) || l.includes(itemSlug))) {
        suggestions.push({
          entityId: item.id,
          title: item.title.en,
          type: item.entityType,
          confidence: 0.95,
          reason: `Diagnostic mapping: relevant lab test '${item.title.en}'`
        });
        continue;
      }
    }

    // Fallback: simple text keyword co-occurrence matches
    const nameWords = titleLower.split(/\s+/).filter(w => w.length > 3);
    const hasWordMatch = nameWords.some(word => itemTitle.includes(word) || (item.summary.en || "").toLowerCase().includes(word));
    
    if (hasWordMatch) {
      suggestions.push({
        entityId: item.id,
        title: item.title.en,
        type: item.entityType,
        confidence: 0.6,
        reason: `Keyword similarity matches: contains related vocabulary`
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}
