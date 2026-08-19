import {
  CONTROLLED_RAG_COHORT_V1,
  FLAGSHIP_ENTITIES_V1,
  evaluateEntityRagPreflight,
} from "./controlledRagCohort";
import {
  evaluateRelationshipEligibility,
} from "../governance/relationshipActivationContract";
import { WITHDRAWN_SAFETY_ENTITIES } from "../governance/publicationGuard";
import { CITATIONS } from "../content/citations";
import type { KnowledgeEntity, CitationRecord } from "../types";
import type { GovernedRelationshipRecord } from "../governance/relationshipGovernanceTypes";

export interface GovernedRetrievalOptions {
  activeEntities?: KnowledgeEntity[];
  activeRelationships?: GovernedRelationshipRecord[];
  citationsMap?: Map<string, CitationRecord>;
  minMatchScore?: number;
  strictCohortOnly?: boolean;
}

export interface GroundedEntityHit {
  entityId: string;
  slug: string;
  title: string;
  entityType: string;
  summary: string;
  citations: string[];
  reviewer: string;
  governanceVersion: string;
  score: number;
}

export interface GroundedRelationshipHit {
  relationshipId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  claimDescription: string;
  citations: string[];
  adjudicatedBy: string;
}

export interface GovernedRetrievalResult {
  status: "grounded_hit" | "emergency_escalation" | "refusal_abstention" | "miss";
  query: string;
  groundedEntities: GroundedEntityHit[];
  groundedRelationships: GroundedRelationshipHit[];
  citations: string[];
  isEmergency: boolean;
  emergencyNotice?: string;
  abstentionReason?: string;
  groundedResponse: string;
  latencyMs: number;
  evaluatedAt: string;
}

const EMERGENCY_RED_FLAG_KEYWORDS = [
  "vomiting blood",
  "hematemesis",
  "coffee-ground",
  "chest pain",
  "heart attack",
  "stemi",
  "anaphylaxis",
  "difficulty breathing",
  "stridor",
  "severe shortness of breath",
  "cyanosis",
  "apnea",
  "loss of consciousness",
  "fainting",
  "syncope",
  "paralysis",
  "sudden weakness",
  "cauda equina",
  "inability to urinate",
  "complete urinary retention",
  "board-like abdomen",
  "rigid belly",
  "peritonitis",
  "internal bleeding",
  "postpartum hemorrhage",
  "septic shock",
  "high fever with shaking chills",
];

const UNGROUNDED_OR_PROHIBITED_QUERIES = [
  "100% cure guarantee",
  "miracle cure",
  "replace hospital emergency care",
  "molecular mechanism proof",
  "guaranteed cancer cure",
  "cure gerd overnight without diet",
];

/**
 * Authoritative governed retrieval adapter for Lucy AI (AIRouterService & ragService).
 * Enforces the Knowledge Activation Contract and zero-tolerance safety gates.
 */
export function retrieveGovernedKnowledge(
  query: string,
  options: GovernedRetrievalOptions = {}
): GovernedRetrievalResult {
  const startTime = Date.now();
  const nowStr = new Date().toISOString();
  const cleanQuery = (query || "").trim().toLowerCase();

  const entities = options.activeEntities || FLAGSHIP_ENTITIES_V1;
  const relationships = options.activeRelationships || [];
  const citationsMap = options.citationsMap || new Map(CITATIONS.map((c) => [c.id, c]));

  // 1. Emergency Red Flag Escalation Gate (Zero Tolerance)
  for (const redFlag of EMERGENCY_RED_FLAG_KEYWORDS) {
    if (cleanQuery.includes(redFlag)) {
      return {
        status: "emergency_escalation",
        query,
        groundedEntities: [],
        groundedRelationships: [],
        citations: ["CIT-0024"],
        isEmergency: true,
        emergencyNotice: `EMERGENCY ALERT: Query describes acute red-flag symptoms ('${redFlag}'). Immediate conventional emergency care (hospital ER / dial emergency services) is required. Homeopathic supportive care cannot replace emergency medical management.`,
        groundedResponse: `**URGENT MEDICAL ADVICE**: The symptoms described ('${redFlag}') indicate a potential acute medical emergency requiring immediate conventional hospital evaluation. Please contact local emergency services (e.g. 102 / 108 / 911) or proceed immediately to the nearest emergency department. Homeopathic remedies must not be used as a substitute for emergency resuscitation, surgical hemostasis, or acute hospital care.`,
        latencyMs: Date.now() - startTime,
        evaluatedAt: nowStr,
      };
    }
  }

  // 2. Prohibited / Ungrounded Claim Refusal Gate (Zero Tolerance)
  for (const prohibited of UNGROUNDED_OR_PROHIBITED_QUERIES) {
    if (cleanQuery.includes(prohibited)) {
      return {
        status: "refusal_abstention",
        query,
        groundedEntities: [],
        groundedRelationships: [],
        citations: ["CIT-0023", "CIT-0024"],
        isEmergency: false,
        abstentionReason: `Refusal: Query requests unsupported or prohibited claims ('${prohibited}').`,
        groundedResponse: `I cannot fulfill this request. Under clinical governance standards, homeopathy offers individualized supportive and constitutional care and does not claim 100% guaranteed cures or replace proven conventional medical therapies.`,
        latencyMs: Date.now() - startTime,
        evaluatedAt: nowStr,
      };
    }
  }

  // 3. Filter Eligible Entities using Preflight Gate & Activation Contract
  const eligibleEntities: KnowledgeEntity[] = [];
  for (const entity of entities) {
    const preflight = evaluateEntityRagPreflight(entity, citationsMap);
    if (preflight.isEligible && !WITHDRAWN_SAFETY_ENTITIES.has(entity.id)) {
      eligibleEntities.push(entity);
    }
  }

  // 4. Forbidden Knowledge / Withdrawn Entity Query Interception
  // If query specifically asks for a withdrawn entity (e.g. Asthma D0007 or Arsenicum R0006), refuse!
  if (
    cleanQuery.includes("d0007") ||
    cleanQuery.includes("r0006") ||
    cleanQuery.includes("faq-safety") ||
    (cleanQuery.includes("arsenicum") && !cleanQuery.includes("sulphur") && !cleanQuery.includes("nux"))
  ) {
    return {
      status: "refusal_abstention",
      query,
      groundedEntities: [],
      groundedRelationships: [],
      citations: ["CIT-0023"],
      isEmergency: false,
      abstentionReason: "Refusal: Requested knowledge entity is withdrawn for safety governance remediation.",
      groundedResponse: `This profile is currently under editorial safety review and is temporarily excluded from AI retrieval. Please consult a qualified physician for clinical guidance.`,
      latencyMs: Date.now() - startTime,
      evaluatedAt: nowStr,
    };
  }

  // 5. Score and Match Eligible Entities
  const queryTokens = new Set(cleanQuery.split(/[\s,.-]+/).filter((t) => t.length > 2));
  const entityHits: GroundedEntityHit[] = [];

  for (const entity of eligibleEntities) {
    const titleStr = typeof entity.title === "string" ? entity.title : entity.title.en || "";
    const summaryStr = typeof entity.summary === "string" ? entity.summary : entity.summary.en || "";
    const bodyStr = `${entity.content?.overview || ""} ${entity.content?.description || ""} ${(entity.content?.keynotes || []).join(" ")} ${(entity.aiReadiness?.keywords || []).join(" ")} ${(entity.aiReadiness?.retrievalSummary || "")}`;
    const contentText = `${titleStr} ${summaryStr} ${entity.slug} ${entity.tags.join(" ")} ${bodyStr}`.toLowerCase();

    let matches = 0;
    for (const token of queryTokens) {
      if (contentText.includes(token)) {
        matches += 1;
      }
    }

    const coverage = queryTokens.size > 0 ? matches / queryTokens.size : 0;
    let exactTitleBoost = 0;
    const lowerTitle = titleStr.toLowerCase();
    const lowerSlug = entity.slug.toLowerCase();
    if (cleanQuery.includes(lowerTitle) || cleanQuery.includes(lowerSlug) || lowerTitle.includes(cleanQuery)) {
      exactTitleBoost = 0.5;
    } else {
      // Check if primary name tokens appear in query
      const primaryTokens = lowerTitle.split(/[\s()]+/).filter((t) => t.length > 2);
      if (primaryTokens.some((t) => cleanQuery.includes(t))) {
        exactTitleBoost = 0.35;
      }
    }

    const score = Math.min(1.0, coverage * 0.6 + exactTitleBoost);

    if (score >= (options.minMatchScore || 0.25)) {
      const references: string[] =
        entity.content?.references ||
        (entity.claimCitations ? entity.claimCitations.flatMap((c) => c.citationIds || []) : []);

      entityHits.push({
        entityId: entity.id,
        slug: entity.slug,
        title: titleStr,
        entityType: entity.entityType,
        summary: summaryStr || entity.content?.overview?.slice(0, 200) || "",
        citations: references,
        reviewer: typeof entity.reviewer === "string" ? entity.reviewer : entity.reviewer?.name || "Clinical Governance",
        governanceVersion: entity.versionInfo?.version || "1.1.0",
        score,
      });
    }
  }

  entityHits.sort((a, b) => b.score - a.score);

  // 6. Discover Matching Governed Relationships (Filtering by Activation Contract)
  const topEntityIds = new Set(entityHits.slice(0, 3).map((h) => h.entityId));
  const relationshipHits: GroundedRelationshipHit[] = [];

  for (const rel of relationships) {
    const eligibility = evaluateRelationshipEligibility(rel, { citationsMap });
    if (eligibility.isGoverned && !eligibility.isBlockedByWithdrawal && !eligibility.isBlockedBySupersession) {
      if (topEntityIds.has(rel.sourceEntityId) || topEntityIds.has(rel.targetEntityId)) {
        relationshipHits.push({
          relationshipId: rel.relationshipId,
          sourceEntityId: rel.sourceEntityId,
          targetEntityId: rel.targetEntityId,
          relationshipType: rel.relationshipType,
          claimDescription: rel.claimDescription,
          citations: rel.evidenceCitationIds,
          adjudicatedBy: rel.adjudication?.adjudicatedBy?.name || "Clinical Reviewer",
        });
      }
    }
  }

  // 7. Assemble Grounded Response or Refusal
  if (entityHits.length === 0) {
    return {
      status: "miss",
      query,
      groundedEntities: [],
      groundedRelationships: [],
      citations: [],
      isEmergency: false,
      abstentionReason: "No eligible governed entities in controlled RAG cohort matched the query.",
      groundedResponse: "No matching governed knowledge found in the active pilot cohort.",
      latencyMs: Date.now() - startTime,
      evaluatedAt: nowStr,
    };
  }

  const primaryHit = entityHits[0];
  const allCitations = Array.from(
    new Set([
      ...primaryHit.citations,
      ...relationshipHits.flatMap((r) => r.citations),
    ])
  ).slice(0, 8);

  let responseSnippet = `### ${primaryHit.title} (${primaryHit.entityId} v${primaryHit.governanceVersion})\n\n${primaryHit.summary}\n\n`;

  if (relationshipHits.length > 0) {
    responseSnippet += `**Governed Clinical Associations**:\n`;
    for (const rel of relationshipHits.slice(0, 2)) {
      responseSnippet += `- *${rel.relationshipType.replaceAll("_", " ")}*: ${rel.claimDescription}\n`;
    }
    responseSnippet += `\n`;
  }

  responseSnippet += `*Clinical Governance Reviewer*: ${primaryHit.reviewer}\n`;
  responseSnippet += `*Evidence References*: ${allCitations.join(", ")}\n`;
  responseSnippet += `\n> [!NOTE]\n> Homeopathic medicines are prescribed on an individualized constitutional basis as supportive care. Conventional diagnostic evaluation and medical boundaries must be maintained.`;

  return {
    status: "grounded_hit",
    query,
    groundedEntities: entityHits.slice(0, 3),
    groundedRelationships: relationshipHits.slice(0, 3),
    citations: allCitations,
    isEmergency: false,
    groundedResponse: responseSnippet,
    latencyMs: Date.now() - startTime,
    evaluatedAt: nowStr,
  };
}
