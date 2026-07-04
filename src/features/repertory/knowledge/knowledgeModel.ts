export type EditorialStatus = 'Draft' | 'Reviewed' | 'Verified' | 'Deprecated';

export type EvidenceStrength = 'Keynote' | 'Strong' | 'Supporting' | 'Hypothetical';

export type ProvenanceOrigin = 
  | 'source-backed' 
  | 'editorial' 
  | 'graph-derived' 
  | 'AI-assisted' 
  | 'Dr. Jethwani clinical note';

export interface EvidenceItem {
  id: string;
  title: string;
  summary: string;
  strength: EvidenceStrength;
  confidence: number; // 0-100
  editorialStatus: EditorialStatus;
  reviewer: string;
  lastReviewed: string; // ISO Date
  origin: ProvenanceOrigin;
  sourceReferences: string[];
}

export interface ClinicalPearl {
  id: string;
  text: string;
  caution?: string;
  type: 'characteristic' | 'caution' | 'differentiation' | 'constitutional';
  origin: ProvenanceOrigin;
}

export interface RemedyKnowledgeRecord {
  remedyId: string;
  clinicalPearls: ClinicalPearl[];
  evidenceItems: EvidenceItem[];
  pathologyRelations: string[];
  remedyRelations: string[];
  editorialStatus: EditorialStatus;
}
