import { KmsKnowledgeEntity, EditorialStatus, CitationRecord, AuditLogEntry } from "../types";
import { EntityType } from "@/features/knowledge/types";

export interface EntityFilters {
  editorialStatus?: EditorialStatus;
  entityType?: EntityType;
  tag?: string;
  dueReviewBefore?: string; // ISO date string
}

export interface KnowledgeRepository {
  // Entity Operations
  getEntities(filters?: EntityFilters): Promise<KmsKnowledgeEntity[]>;
  getEntity(id: string): Promise<KmsKnowledgeEntity | null>;
  saveEntity(entity: KmsKnowledgeEntity, editor: string, role: string, reason?: string): Promise<void>;
  deleteEntity(id: string, editor: string, role: string): Promise<void>;
  
  // Citations Operations
  getCitations(): Promise<CitationRecord[]>;
  getCitation(id: string): Promise<CitationRecord | null>;
  saveCitation(citation: CitationRecord): Promise<void>;
  deleteCitation(id: string): Promise<void>;
  
  // Audit Logs
  getAuditLogs(entityId?: string): Promise<AuditLogEntry[]>;
  addAuditLog(entry: Omit<AuditLogEntry, "id" | "performedAt">): Promise<void>;
}
