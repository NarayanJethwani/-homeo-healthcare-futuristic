export interface ClinicalExperienceRecord {
  id: string;
  type: 'observation' | 'pattern' | 'characteristic' | 'warning' | 'tip' | 'lesson';
  title: string;
  content: string;
  author: string;
  reviewer: string;
  confidence: number;
  dateAdded: string;
  version: string;
  editorialStatus: 'Draft' | 'Review' | 'Verified' | 'Deprecated';
  provenance: string;
  remedies?: string[];
  rubrics?: string[];
  miasms?: string[];
  constitutions?: string[];
  pathologies?: string[];
}
