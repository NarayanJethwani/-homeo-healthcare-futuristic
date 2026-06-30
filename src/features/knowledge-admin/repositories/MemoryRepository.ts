import { KmsKnowledgeEntity, CitationRecord, AuditLogEntry, EditorialRole } from "../types";
import { KnowledgeRepository, EntityFilters } from "./KnowledgeRepository";
import { DISEASES } from "@/features/knowledge/content/diseases";
import { SYMPTOMS } from "@/features/knowledge/content/symptoms";
import { REMEDIES } from "@/features/knowledge/content/remedies";
import { LAB_TESTS } from "@/features/knowledge/content/lab-tests";
import { FAQS } from "@/features/knowledge/content/faqs";
import { RESEARCH } from "@/features/knowledge/content/research";
import { CASE_STUDIES } from "@/features/knowledge/content/case-studies";
import { KNOWLEDGE_RELATIONSHIPS } from "@/features/knowledge/graph/entityRelationships";
import { KnowledgeEntity } from "@/features/knowledge/types";

// In-memory data store singleton
const entities: KmsKnowledgeEntity[] = [];
let citations: CitationRecord[] = [];
const auditLogs: AuditLogEntry[] = [];
let isSeeded = false;

export class MemoryRepository implements KnowledgeRepository {
  constructor() {
    this.seedStore();
  }

  private seedStore() {
    if (isSeeded) return;

    // 1. Seed some baseline citations
    citations = [
      {
        id: "CIT-001",
        title: "Efficacy of Constitutional Homeopathy in Gastroesophageal Reflux Disease (GERD)",
        authors: ["Jethwani N.", "Sharma R."],
        journal: "International Journal of Homeopathic Research",
        doi: "10.1007/s11938-024-00123-x",
        pubmedId: "34892019",
        year: 2024,
        citationStyle: "AMA",
        usageCount: 0,
        linkedEntities: []
      },
      {
        id: "CIT-002",
        title: "Individualized Homeopathic Treatment for Atopic Dermatitis: A Cohort Study",
        authors: ["Witt C. M.", "Lüdtke R."],
        journal: "Complementary Medicine Research",
        doi: "10.1159/000235948",
        pubmedId: "19816024",
        year: 2019,
        citationStyle: "AMA",
        usageCount: 0,
        linkedEntities: []
      },
      {
        id: "CIT-003",
        title: "TSH Reference Intervals and Homeopathic Prescribing Mappings",
        authors: ["Miller D."],
        journal: "Clinical Endocrinology Review",
        doi: "10.1111/cen.14582",
        pubmedId: "28910482",
        year: 2021,
        citationStyle: "AMA",
        usageCount: 0,
        linkedEntities: []
      }
    ];

    // Helper to transform a public KnowledgeEntity to an Admin KmsKnowledgeEntity
    const convertToKms = (pub: KnowledgeEntity): KmsKnowledgeEntity => {
      // Map related references
      const refIds: string[] = [];
      if (pub.content?.references) {
        pub.content.references.forEach((ref, idx) => {
          // If referencing our baseline citations, link them
          if (pub.slug.includes("gerd") && idx === 0) {
            refIds.push("CIT-001");
            citations[0].linkedEntities.push(pub.id);
            citations[0].usageCount++;
          } else if (pub.slug.includes("eczema") && idx === 0) {
            refIds.push("CIT-002");
            citations[1].linkedEntities.push(pub.id);
            citations[1].usageCount++;
          } else if (pub.slug.includes("tsh") && idx === 0) {
            refIds.push("CIT-003");
            citations[2].linkedEntities.push(pub.id);
            citations[2].usageCount++;
          }
        });
      }

      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      // Load initial relationships from public graph
      const initialRelations = KNOWLEDGE_RELATIONSHIPS
        .filter(r => r.source === pub.id)
        .map(r => r.target);

      const hasReviewer = !!pub.reviewer;
      const hasSummary = !!pub.summary?.en;
      const completeness = (hasReviewer ? 30 : 0) + (hasSummary ? 30 : 0) + (refIds.length > 0 ? 40 : 10);

      return {
        id: pub.id,
        slug: pub.slug,
        entityType: pub.entityType,
        title: typeof pub.title === "string"
          ? { en: pub.title, hi: "", gu: "", mr: "", es: "", ar: "" }
          : pub.title,
        summary: typeof pub.summary === "string"
          ? { en: pub.summary, hi: "", gu: "", mr: "", es: "", ar: "" }
          : pub.summary,
        relatedEntities: initialRelations,
        lastReviewed: pub.versionInfo.reviewed,
        lastUpdated: pub.versionInfo.updated,
        author: pub.author,
        reviewer: pub.reviewer,
        evidenceLevel: pub.evidenceLevel,
        tags: pub.tags || [],
        canonicalUrl: pub.canonicalUrl || "",
        editorialStatus: pub.editorialStatus as any || "published",
        
        editorialNotes: "",
        nextReviewDate: nextYear.toISOString(),
        versionInfo: {
          version: pub.versionInfo.version,
          created: pub.versionInfo.created,
          updated: pub.versionInfo.updated,
          reviewed: pub.versionInfo.reviewed,
          changelog: [
            {
              version: pub.versionInfo.version,
              updatedAt: pub.versionInfo.updated,
              author: pub.author.name,
              fieldsChanged: ["initial_import"],
              reason: "Initial import from public platform content files",
              snapshot: JSON.stringify(pub)
            }
          ]
        },
        content: {
          ...pub.content,
          references: refIds.length > 0 ? refIds : undefined
        },
        readabilityScore: {
          score: 85,
          readingLevel: "Patient Friendly",
          readingTimeMinutes: 2
        },
        seoGeoScores: {
          seoScore: completeness,
          geoScore: completeness - 5,
          aiReadinessScore: completeness - 2
        }
      };
    };

    // Add seeded entities
    DISEASES.forEach((d: any) => entities.push(convertToKms(d)));
    SYMPTOMS.forEach((s: any) => entities.push(convertToKms(s)));
    REMEDIES.forEach((r: any) => entities.push(convertToKms(r)));
    LAB_TESTS.forEach((l: any) => entities.push(convertToKms(l)));
    FAQS.forEach((f: any) => entities.push(convertToKms(f)));
    RESEARCH.forEach((r: any) => entities.push(convertToKms(r)));
    CASE_STUDIES.forEach((c: any) => entities.push(convertToKms(c)));

    // Seeding some audit logs
    entities.forEach(e => {
      auditLogs.push({
        id: `AUD-${Math.random().toString(36).substr(2, 9)}`,
        entityId: e.id,
        entityTitle: e.title.en,
        action: "create",
        performedBy: e.author.name,
        performedAt: e.versionInfo.created,
        role: "MedicalEditor",
        reason: "Initial baseline creation"
      });
    });

    isSeeded = true;
  }

  // --- ENTITY INTERFACES ---
  async getEntities(filters?: EntityFilters): Promise<KmsKnowledgeEntity[]> {
    let result = [...entities];
    if (filters) {
      if (filters.editorialStatus) {
        result = result.filter(e => e.editorialStatus === filters.editorialStatus);
      }
      if (filters.entityType) {
        result = result.filter(e => e.entityType === filters.entityType);
      }
      if (filters.tag) {
        result = result.filter(e => e.tags.includes(filters.tag!));
      }
      if (filters.dueReviewBefore) {
        const threshold = new Date(filters.dueReviewBefore);
        result = result.filter(e => new Date(e.nextReviewDate) <= threshold);
      }
    }
    return result;
  }

  async getEntity(id: string): Promise<KmsKnowledgeEntity | null> {
    const e = entities.find(x => x.id === id || x.slug === id);
    return e || null;
  }

  async saveEntity(entity: KmsKnowledgeEntity, editor: string, role: string, reason?: string): Promise<void> {
    const idx = entities.findIndex(x => x.id === entity.id);
    const now = new Date().toISOString();
    
    // Log previous fields changed
    const fieldsChanged: string[] = [];
    if (idx !== -1) {
      const original = entities[idx];
      if (JSON.stringify(original.title) !== JSON.stringify(entity.title)) fieldsChanged.push("title");
      if (JSON.stringify(original.summary) !== JSON.stringify(entity.summary)) fieldsChanged.push("summary");
      if (original.editorialStatus !== entity.editorialStatus) fieldsChanged.push("editorialStatus");
      if (JSON.stringify(original.relatedEntities) !== JSON.stringify(entity.relatedEntities)) fieldsChanged.push("relatedEntities");
      if (original.editorialNotes !== entity.editorialNotes) fieldsChanged.push("editorialNotes");
      if (JSON.stringify(original.content?.references) !== JSON.stringify(entity.content?.references)) fieldsChanged.push("references");
    } else {
      fieldsChanged.push("created");
    }

    const updatedEntity = {
      ...entity,
      lastUpdated: now,
      versionInfo: {
        ...entity.versionInfo,
        updated: now,
        changelog: [
          ...(entity.versionInfo.changelog || []),
          {
            version: entity.versionInfo.version,
            updatedAt: now,
            author: editor,
            fieldsChanged,
            reason: reason || "Update entity content",
            snapshot: JSON.stringify(entity)
          }
        ]
      }
    };

    if (idx !== -1) {
      entities[idx] = updatedEntity;
    } else {
      entities.push(updatedEntity);
    }

    // Refresh citation links
    this.refreshCitationCounts();

    // Log to audits
    await this.addAuditLog({
      entityId: entity.id,
      entityTitle: entity.title.en || "",
      action: idx === -1 ? "create" : "update",
      performedBy: editor,
      role: role as EditorialRole,
      fieldsChanged,
      reason: reason || "Saved in editor"
    });
  }

  async deleteEntity(id: string, editor: string, role: string): Promise<void> {
    const idx = entities.findIndex(x => x.id === id);
    if (idx !== -1) {
      const deleted = entities[idx];
      entities.splice(idx, 1);
      
      // Cleanup broken relations in other entities
      entities.forEach(e => {
        if (e.relatedEntities.includes(id)) {
          e.relatedEntities = e.relatedEntities.filter(x => x !== id);
        }
      });

      this.refreshCitationCounts();

      await this.addAuditLog({
        entityId: id,
        entityTitle: deleted.title.en,
        action: "delete",
        performedBy: editor,
        role: role as EditorialRole,
        reason: "Entity permanently deleted by administrator"
      });
    }
  }

  // --- CITATION INTERFACES ---
  async getCitations(): Promise<CitationRecord[]> {
    return [...citations];
  }

  async getCitation(id: string): Promise<CitationRecord | null> {
    return citations.find(c => c.id === id) || null;
  }

  async saveCitation(citation: CitationRecord): Promise<void> {
    const idx = citations.findIndex(c => c.id === citation.id);
    if (idx !== -1) {
      citations[idx] = citation;
    } else {
      citations.push(citation);
    }
  }

  async deleteCitation(id: string): Promise<void> {
    citations = citations.filter(c => c.id !== id);
    // Remove reference from entity links
    entities.forEach(e => {
      if (e.content?.references?.includes(id)) {
        e.content.references = e.content.references.filter(x => x !== id);
      }
    });
  }

  // --- AUDIT INTERFACES ---
  async getAuditLogs(entityId?: string): Promise<AuditLogEntry[]> {
    if (entityId) {
      return auditLogs.filter(a => a.entityId === entityId).reverse();
    }
    return [...auditLogs].reverse();
  }

  async addAuditLog(entry: Omit<AuditLogEntry, "id" | "performedAt">): Promise<void> {
    auditLogs.push({
      ...entry,
      id: `AUD-${Math.random().toString(36).substr(2, 9)}`,
      performedAt: new Date().toISOString()
    });
  }

  private refreshCitationCounts() {
    citations.forEach(c => {
      const links = entities.filter(e => e.content?.references?.includes(c.id)).map(e => e.id);
      c.linkedEntities = links;
      c.usageCount = links.length;
    });
  }
}
export const globalKmsRepository = new MemoryRepository();
export default globalKmsRepository;
