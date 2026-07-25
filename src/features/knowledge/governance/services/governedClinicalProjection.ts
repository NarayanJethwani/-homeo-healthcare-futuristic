import { KnowledgeEntity } from "../../types";

export interface GovernedClinicalProjection {
  title: any;
  overview?: string;
  clinicalSections?: any;
  redFlags?: string[];
  emergencyEscalation?: string;
  diagnosticLimitations?: string;
  conventionalManagement?: string;
  complementaryCareBoundary?: string;
  claims?: any[];
  references?: string[];
  translations?: any;
}

/**
 * Builds an explicit governed clinical projection for an entity.
 * Filters out volatile rendering metadata and returns only clinically material fields
 * for SHA-256 revision content hashing.
 */
export function buildGovernedClinicalProjection(entity: KnowledgeEntity | any): GovernedClinicalProjection {
  if (!entity || !entity.content) {
    return {
      title: entity?.title || "Untitled Entity",
    };
  }

  const c = entity.content;
  return {
    title: entity.title,
    overview: c.overview || c.description || "",
    clinicalSections: {
      etiology: c.etiology || c.causes || "",
      symptoms: c.symptoms || c.keynotes || [],
      safety: c.safetyWarnings || c.contraindications || [],
      dosage: c.dosageGuidance || "",
    },
    redFlags: c.redFlags || [],
    emergencyEscalation: c.emergencyEscalation || "",
    diagnosticLimitations: c.diagnosticLimitations || "",
    conventionalManagement: c.conventionalManagement || "",
    complementaryCareBoundary: c.complementaryCareBoundary || "",
    claims: c.claims || [],
    references: c.references || [],
    translations: c.translations || null,
  };
}
