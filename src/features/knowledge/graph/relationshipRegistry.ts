import { ClinicalGraphNodeType, ClinicalGraphRelationshipType } from "./clinicalGraphTypes";

export interface GraphRelationshipDefinition {
  type: ClinicalGraphRelationshipType;
  label: string;
  inverseLabel?: string;
  directed: boolean;
  symmetric: boolean;
  allowedSourceTypes: ClinicalGraphNodeType[];
  allowedTargetTypes: ClinicalGraphNodeType[];
  requiresClinicalReview: boolean;
  retrievalWeight: number; // 0.0 to 1.0 representation
  publicVisibilityAllowed: boolean;
  maxTraversalDepth?: number;
  description: string;
  misuseWarning?: string;
  maxOutgoing?: number;
  maxIncoming?: number;
}

export const RELATIONSHIP_REGISTRY: Record<ClinicalGraphRelationshipType, GraphRelationshipDefinition> = {
  "associated-with": {
    type: "associated-with",
    label: "Associated With",
    directed: false,
    symmetric: true,
    allowedSourceTypes: ["knowledge-entity", "remedy", "rubric", "symptom", "condition", "clinical-concept", "modality", "constitution", "miasmatic-concept", "organ-system", "pathology"],
    allowedTargetTypes: ["knowledge-entity", "remedy", "rubric", "symptom", "condition", "clinical-concept", "modality", "constitution", "miasmatic-concept", "organ-system", "pathology"],
    requiresClinicalReview: true,
    retrievalWeight: 0.3,
    publicVisibilityAllowed: true,
    maxTraversalDepth: 2,
    description: "General conceptual association between entities.",
    misuseWarning: "Do not use for direct causal or treatment statements."
  },
  "contains": {
    type: "contains",
    label: "Contains",
    inverseLabel: "part-of",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["knowledge-entity", "organ-system", "clinical-concept"],
    allowedTargetTypes: ["knowledge-entity", "organ-system", "clinical-concept", "pathology"],
    requiresClinicalReview: false,
    retrievalWeight: 0.5,
    publicVisibilityAllowed: true,
    maxTraversalDepth: 2,
    description: "Indicates that the source concept contains or comprises the target concept.",
    misuseWarning: "Do not use for approximate similarity."
  },
  "part-of": {
    type: "part-of",
    label: "Part Of",
    inverseLabel: "contains",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["knowledge-entity", "organ-system", "clinical-concept", "pathology"],
    allowedTargetTypes: ["knowledge-entity", "organ-system", "clinical-concept"],
    requiresClinicalReview: false,
    retrievalWeight: 0.5,
    publicVisibilityAllowed: true,
    maxTraversalDepth: 2,
    description: "Indicates that the source is a constituent or component of the target.",
    misuseWarning: "Verify structural alignment."
  },
  "describes": {
    type: "describes",
    label: "Describes",
    inverseLabel: "references",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["materia-medica-entry", "repertory-entry", "clinical-protocol", "publication"],
    allowedTargetTypes: ["remedy", "rubric", "symptom", "condition", "clinical-concept"],
    requiresClinicalReview: true,
    retrievalWeight: 0.8,
    publicVisibilityAllowed: true,
    description: "Primary descriptive relationship linking literature or protocols to core concepts.",
    misuseWarning: "Ensure accurate literature references."
  },
  "references": {
    type: "references",
    label: "References",
    inverseLabel: "describes",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["remedy", "rubric", "symptom", "condition", "clinical-concept"],
    allowedTargetTypes: ["materia-medica-entry", "repertory-entry", "clinical-protocol", "publication", "research-source"],
    requiresClinicalReview: false,
    retrievalWeight: 0.2,
    publicVisibilityAllowed: true,
    description: "Outgoing reference pointer to literature or research records.",
    misuseWarning: "Does not establish efficacy."
  },
  "supported-by": {
    type: "supported-by",
    label: "Supported By",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["knowledge-entity", "remedy", "rubric", "symptom", "condition", "clinical-concept", "pathology"],
    allowedTargetTypes: ["research-source", "publication", "author"],
    requiresClinicalReview: false,
    retrievalWeight: 0.1,
    publicVisibilityAllowed: true,
    description: "Link to backing publication, study, or author.",
    misuseWarning: "Does not imply semantic proof."
  },
  "contradicted-by": {
    type: "contradicted-by",
    label: "Contradicted By",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["knowledge-entity", "remedy", "clinical-concept"],
    allowedTargetTypes: ["research-source", "publication"],
    requiresClinicalReview: true,
    retrievalWeight: 0.0, // Should not expand retrieval in positive direction
    publicVisibilityAllowed: true,
    description: "Identifies peer-reviewed literature that contradicts or disputes this relationship.",
    misuseWarning: "Review clinical evidence before adding."
  },
  "related-to": {
    type: "related-to",
    label: "Related To",
    directed: false,
    symmetric: true,
    allowedSourceTypes: ["knowledge-entity", "remedy", "rubric", "symptom", "condition", "clinical-concept", "modality", "constitution", "miasmatic-concept", "organ-system", "pathology", "materia-medica-entry", "repertory-entry", "clinical-protocol", "research-source", "publication", "author", "specialty", "terminology-code"],
    allowedTargetTypes: ["knowledge-entity", "remedy", "rubric", "symptom", "condition", "clinical-concept", "modality", "constitution", "miasmatic-concept", "organ-system", "pathology", "materia-medica-entry", "repertory-entry", "clinical-protocol", "research-source", "publication", "author", "specialty", "terminology-code"],
    requiresClinicalReview: false,
    retrievalWeight: 0.2,
    publicVisibilityAllowed: true,
    description: "Loose semantic relation for navigation.",
    misuseWarning: "Use more specific types where available."
  },
  "has-symptom": {
    type: "has-symptom",
    label: "Has Symptom",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["condition", "pathology"],
    allowedTargetTypes: ["symptom"],
    requiresClinicalReview: true,
    retrievalWeight: 0.8,
    publicVisibilityAllowed: true,
    description: "Connects a clinical condition or pathology to its symptomatic presentation.",
    misuseWarning: "Do not imply diagnosing criteria."
  },
  "has-modality": {
    type: "has-modality",
    label: "Has Modality",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["symptom", "condition", "remedy"],
    allowedTargetTypes: ["modality"],
    requiresClinicalReview: true,
    retrievalWeight: 0.7,
    publicVisibilityAllowed: true,
    description: "Connects an entity to its ameliorating or aggravating modal modifiers.",
    misuseWarning: "Verify modality source citation."
  },
  "mapped-to-rubric": {
    type: "mapped-to-rubric",
    label: "Mapped to Rubric",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["symptom", "condition"],
    allowedTargetTypes: ["rubric"],
    requiresClinicalReview: true,
    retrievalWeight: 0.9,
    publicVisibilityAllowed: true,
    description: "Maps a modern symptom or disease to its counterpart repertory rubric.",
    misuseWarning: "Do not approximate loosely."
  },
  "rubric-includes-remedy": {
    type: "rubric-includes-remedy",
    label: "Rubric Includes Remedy",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["rubric"],
    allowedTargetTypes: ["remedy"],
    requiresClinicalReview: true,
    retrievalWeight: 1.0,
    publicVisibilityAllowed: true,
    description: "Core repertory relationship denoting that a remedy covers a specific rubric.",
    misuseWarning: "Ensure correct grade mapping."
  },
  "remedy-covers-symptom": {
    type: "remedy-covers-symptom",
    label: "Remedy Covers Symptom",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["remedy"],
    allowedTargetTypes: ["symptom"],
    requiresClinicalReview: true,
    retrievalWeight: 0.8,
    publicVisibilityAllowed: true,
    description: "Indicates that a remedy is recorded in Materia Medica to cover or alleviate a symptom.",
    misuseWarning: "Does not guarantee clinical efficacy."
  },
  "condition-associated-with-symptom": {
    type: "condition-associated-with-symptom",
    label: "Condition Associated with Symptom",
    directed: false,
    symmetric: true,
    allowedSourceTypes: ["condition"],
    allowedTargetTypes: ["symptom"],
    requiresClinicalReview: true,
    retrievalWeight: 0.6,
    publicVisibilityAllowed: true,
    description: "Non-causative clinical association between a condition and symptom.",
    misuseWarning: "Do not imply diagnosis."
  },
  "concept-broader-than": {
    type: "concept-broader-than",
    label: "Concept Broader Than",
    inverseLabel: "concept-narrower-than",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["clinical-concept", "symptom", "condition"],
    allowedTargetTypes: ["clinical-concept", "symptom", "condition"],
    requiresClinicalReview: false,
    retrievalWeight: 0.5,
    publicVisibilityAllowed: true,
    description: "Taxonomical parent relationship.",
    misuseWarning: "Do not use for synonym equivalence."
  },
  "concept-narrower-than": {
    type: "concept-narrower-than",
    label: "Concept Narrower Than",
    inverseLabel: "concept-broader-than",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["clinical-concept", "symptom", "condition"],
    allowedTargetTypes: ["clinical-concept", "symptom", "condition"],
    requiresClinicalReview: false,
    retrievalWeight: 0.5,
    publicVisibilityAllowed: true,
    description: "Taxonomical child relationship.",
    misuseWarning: "Do not use for synonym equivalence."
  },
  "concept-equivalent-to": {
    type: "concept-equivalent-to",
    label: "Concept Equivalent To",
    directed: false,
    symmetric: true,
    allowedSourceTypes: ["clinical-concept", "symptom", "condition", "remedy", "terminology-code"],
    allowedTargetTypes: ["clinical-concept", "symptom", "condition", "remedy", "terminology-code"],
    requiresClinicalReview: true,
    retrievalWeight: 1.0,
    publicVisibilityAllowed: true,
    maxOutgoing: 5,
    maxIncoming: 5,
    description: "Strict synonym or concept equivalence.",
    misuseWarning: "Do not use for approximate similarity."
  },
  "classified-under": {
    type: "classified-under",
    label: "Classified Under",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["remedy", "condition", "symptom"],
    allowedTargetTypes: ["miasmatic-concept", "constitution", "organ-system"],
    requiresClinicalReview: true,
    retrievalWeight: 0.4,
    publicVisibilityAllowed: true,
    description: "Classification of clinical entities under philosophical or biological umbrellas.",
    misuseWarning: "Must be supported by clear literature."
  },
  "applies-to-specialty": {
    type: "applies-to-specialty",
    label: "Applies to Specialty",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["condition", "clinical-protocol", "terminology-code"],
    allowedTargetTypes: ["specialty"],
    requiresClinicalReview: false,
    retrievalWeight: 0.2,
    publicVisibilityAllowed: true,
    description: "Links protocols or tests to clinical specialties.",
    misuseWarning: "Keep mappings professional."
  },
  "mapped-to-terminology": {
    type: "mapped-to-terminology",
    label: "Mapped to Terminology",
    directed: true,
    symmetric: false,
    allowedSourceTypes: ["condition", "symptom", "remedy", "terminology-code"],
    allowedTargetTypes: ["terminology-code"],
    requiresClinicalReview: true,
    retrievalWeight: 0.9,
    publicVisibilityAllowed: true,
    maxOutgoing: 2,
    description: "Official mapping to SNOMED CT, ICD-11, UMLS, RxNorm, or LOINC.",
    misuseWarning: "Requires terminology code validation."
  }
};
