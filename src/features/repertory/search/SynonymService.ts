import { Brand } from "../types/repertoryTypes";

export type ExpansionRelationship =
  | "exact_synonym"
  | "spelling_variant"
  | "abbreviation"
  | "historical_term"
  | "plain_language_alias"
  | "related_term";

export interface SynonymExpansion {
  originalTerm: string;
  normalizedTerm: string;
  exactSynonyms: string[];
  spellingVariants: string[];
  abbreviations: string[];
  historicalTerms: string[];
  plainLanguageAliases: string[];
  relatedTerms: string[];
  expansionVersion: string;
}

export class SynonymService {
  private readonly version = "1.0.0-synonyms";

  // Term index database for classical and clinical translations
  private readonly synonymDb: Record<string, Partial<Record<ExpansionRelationship, string[]>>> = {
    mind: {
      exact_synonym: ["intellect", "psyche", "mental", "will"],
      spelling_variant: ["minde"],
      related_term: ["sensorium", "brain", "emotion"]
    },
    head: {
      exact_synonym: ["cranium", "caput"],
      abbreviation: ["hd"],
      related_term: ["scalp", "forehead", "temple"]
    },
    vertigo: {
      exact_synonym: ["giddiness", "swimming"],
      plain_language_alias: ["dizziness", "spinning", "lightheadedness"],
      spelling_variant: ["vertego"]
    },
    cough: {
      exact_synonym: ["tussis", "barking"],
      spelling_variant: ["coughe"],
      related_term: ["expectoration", "throat", "bronchial"]
    },
    pain: {
      exact_synonym: ["ache", "smarting", "soreness"],
      plain_language_alias: ["hurting", "stitching", "tearing", "shooting"]
    },
    stomach: {
      exact_synonym: ["abdomen", "belly", "epigastrium"],
      abbreviation: ["stom"],
      related_term: ["digestion", "nausea", "appetite"]
    },
    eyes: {
      exact_synonym: ["oculi", "ophthalmic"],
      spelling_variant: ["eies"],
      related_term: ["vision", "sight", "eyeballs"]
    },
    fever: {
      exact_synonym: ["pyrexia", "chill"],
      spelling_variant: ["feaver"],
      related_term: ["temperature", "heat"]
    }
  };

  expandTerm(term: string): SynonymExpansion {
    const normalized = term.toLowerCase().trim();
    const entry = this.synonymDb[normalized] || {};

    return {
      originalTerm: term,
      normalizedTerm: normalized,
      exactSynonyms: entry.exact_synonym || [],
      spellingVariants: entry.spelling_variant || [],
      abbreviations: entry.abbreviation || [],
      historicalTerms: entry.historical_term || [],
      plainLanguageAliases: entry.plain_language_alias || [],
      relatedTerms: entry.related_term || [],
      expansionVersion: this.version
    };
  }

  expandQuery(query: string, maxTerms = 20, maxDepth = 3): {
    expandedTerms: string[];
    termRelationships: Record<string, ExpansionRelationship>;
  } {
    const tokens = query
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .split(/\s+/)
      .filter(t => t.length > 1);

    const expandedSet = new Set<string>();
    const relationships: Record<string, ExpansionRelationship> = {};

    for (const token of tokens) {
      if (expandedSet.size >= maxTerms) break;
      expandedSet.add(token);

      // Perform traversal up to maxDepth
      const queue: { term: string; depth: number }[] = [{ term: token, depth: 1 }];
      const visited = new Set<string>([token]);

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.depth > maxDepth || expandedSet.size >= maxTerms) {
          continue;
        }

        const expansion = this.expandTerm(current.term);
        const candidates: { term: string; rel: ExpansionRelationship }[] = [];

        expansion.exactSynonyms.forEach(t => candidates.push({ term: t, rel: "exact_synonym" }));
        expansion.spellingVariants.forEach(t => candidates.push({ term: t, rel: "spelling_variant" }));
        expansion.abbreviations.forEach(t => candidates.push({ term: t, rel: "abbreviation" }));
        expansion.historicalTerms.forEach(t => candidates.push({ term: t, rel: "historical_term" }));
        expansion.plainLanguageAliases.forEach(t => candidates.push({ term: t, rel: "plain_language_alias" }));
        expansion.relatedTerms.forEach(t => candidates.push({ term: t, rel: "related_term" }));

        for (const cand of candidates) {
          if (!visited.has(cand.term) && expandedSet.size < maxTerms) {
            visited.add(cand.term);
            expandedSet.add(cand.term);
            relationships[cand.term] = cand.rel;
            queue.push({ term: cand.term, depth: current.depth + 1 });
          }
        }
      }
    }

    return {
      expandedTerms: Array.from(expandedSet),
      termRelationships: relationships
    };
  }

  getRelationshipWeight(relationship: ExpansionRelationship): number {
    switch (relationship) {
      case "spelling_variant":
      case "abbreviation":
        return 1.0;
      case "exact_synonym":
        return 0.95;
      case "plain_language_alias":
        return 0.85;
      case "historical_term":
        return 0.75;
      case "related_term":
        return 0.4;
      default:
        return 0.5;
    }
  }
}
