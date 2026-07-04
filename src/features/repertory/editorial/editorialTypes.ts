export type EditorialStatus = 'Draft' | 'Review' | 'Verified' | 'Deprecated' | 'Archived';

export interface EditorialSource {
  id: string;
  title: string;
  author: string;
  edition: string;
  publicationYear: number;
  legalStatus: 'Public Domain' | 'Licensed' | 'Proprietary' | 'Clinic Internal';
  provenanceType: 'source-backed' | 'editorial' | 'AI-assisted' | 'graph-derived' | 'Dr. Jethwani verified clinical note';
  confidencePolicy: number; // 0 to 100
}

export interface EditorialRevision {
  version: string;
  created: string; // ISO date
  modified: string; // ISO date
  author: string;
  reviewer: string;
  changeLog: string;
}

export interface EditorialApproval {
  reviewer: string;
  approvalDate: string; // ISO date
  status: EditorialStatus;
  comments?: string;
}

export interface EditorialRecord {
  id: string;
  remedyId: string;
  sourceId: string;
  currentStatus: EditorialStatus;
  revisionHistory: EditorialRevision[];
  approvals: EditorialApproval[];
  clinicalPearlsIds: string[];
  evidenceItemsIds: string[];
}
