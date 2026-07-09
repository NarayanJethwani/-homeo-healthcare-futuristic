"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalKmsRepository = exports.MemoryRepository = void 0;
const diseases_1 = require("@/features/knowledge/content/diseases");
const symptoms_1 = require("@/features/knowledge/content/symptoms");
const remedies_1 = require("@/features/knowledge/content/remedies");
const lab_tests_1 = require("@/features/knowledge/content/lab-tests");
const faqs_1 = require("@/features/knowledge/content/faqs");
const research_1 = require("@/features/knowledge/content/research");
const case_studies_1 = require("@/features/knowledge/content/case-studies");
const entityRelationships_1 = require("@/features/knowledge/graph/entityRelationships");
const citations_1 = require("@/features/knowledge/content/citations");
// In-memory data store singleton
const entities = [];
let citations = [];
const auditLogs = [];
let isSeeded = false;
class MemoryRepository {
    constructor() {
        this.seedStore();
    }
    seedStore() {
        if (isSeeded)
            return;
        // 1. Seed citations from central citations registry
        citations = citations_1.CITATIONS.map(cit => ({
            ...cit,
            usageCount: 0,
            linkedEntities: []
        }));
        // Curated list of 50 cornerstone/flagship articles
        const cornerstoneIds = new Set([
            // Diseases (20)
            "D0001", "D0002", "D0003", "D0004", "D0005", "D0006", "D0007", "D0008", "D0009", "D0010",
            "D0011", "D0012", "D0013", "D0014", "D0015", "D0016", "D0017", "D0018", "D0019", "D0020",
            // Symptoms (10)
            "S0001", "S0002", "S0003", "S0004", "S0005", "S0006", "S0007", "S0008", "S0009", "S0010",
            // Remedies (20)
            "R0001", "R0002", "R0003", "R0004", "R0005", "R0006", "R0007", "R0008", "R0009", "R0010",
            "R0011", "R0012", "R0013", "R0014", "R0015", "R0016", "R0017", "R0018", "R0019", "R0020"
        ]);
        // Helper to transform a public KnowledgeEntity to an Admin KmsKnowledgeEntity
        const convertToKms = (pub) => {
            // Map related references
            const refIds = pub.content?.references || [];
            // Update citation registry links
            refIds.forEach(refId => {
                const found = citations.find(c => c.id === refId);
                if (found) {
                    found.linkedEntities.push(pub.id);
                    found.usageCount++;
                }
            });
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            // Load initial relationships from public graph
            const initialRelations = entityRelationships_1.KNOWLEDGE_RELATIONSHIPS
                .filter(r => r.source === pub.id)
                .map(r => r.target);
            // Cornerstone detection
            const isCornerstone = cornerstoneIds.has(pub.id);
            // Safe Review Status default (conservative needs-review)
            const reviewStatus = (pub.reviewer?.name?.trim() && pub.versionInfo?.reviewed) ? "clinically-reviewed" : "needs-review";
            // Compute citation health from reference count
            const citationCount = refIds.length;
            let citationHealth = "needs-attention";
            if (citationCount >= 3) {
                citationHealth = "excellent";
            }
            else if (citationCount >= 1) {
                citationHealth = "good";
            }
            else {
                citationHealth = isCornerstone ? "critical" : "needs-attention";
            }
            // Compute content completeness percentage
            const hasTitle = !!pub.title?.en;
            const hasSummaryText = !!pub.summary?.en;
            const hasBody = !!(pub.content?.overview || pub.content?.description || pub.content?.definition);
            const hasFaqs = !!(pub.content?.faqs && pub.content.faqs.length > 0);
            const hasRefs = refIds.length > 0;
            const hasAuthor = !!pub.author?.name;
            const hasReviewerName = !!pub.reviewer?.name;
            let contentCompleteness = 0;
            if (hasTitle)
                contentCompleteness += 15;
            if (hasSummaryText)
                contentCompleteness += 15;
            if (hasBody)
                contentCompleteness += 25;
            if (hasFaqs)
                contentCompleteness += 15;
            if (hasRefs)
                contentCompleteness += 15;
            if (hasAuthor)
                contentCompleteness += 7;
            if (hasReviewerName)
                contentCompleteness += 8;
            // Compute graph completeness
            const relationCount = initialRelations.length;
            const graphCompleteness = relationCount >= 4 ? 100 : relationCount >= 2 ? 75 : relationCount >= 1 ? 50 : 25;
            // Compute SEO Status
            const hasCanonical = !!pub.canonicalUrl;
            const hasGoodSlug = !!pub.slug && pub.slug !== "untitled-slug";
            const hasMeta = !!pub.summary?.en && pub.summary.en.length >= 10 && pub.summary.en.length <= 160;
            const seoScore = (hasTitle ? 20 : 0) + (hasMeta ? 30 : 0) + (hasGoodSlug ? 20 : 0) + (hasCanonical ? 30 : 0);
            const seoStatus = seoScore >= 80 ? "excellent" : seoScore >= 50 ? "good" : "needs-attention";
            // Compute Structured Data Status
            const hasStructured = !!(pub.visualBodySystem || pub.structuredEvidence || pub.structuredDifferentials || pub.interpretationAlgorithm);
            const structuredDataStatus = hasStructured ? "excellent" : "good";
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
                reviewer: pub.reviewer || { name: "", credentials: "", specialty: "" },
                reviewerRole: pub.reviewer?.specialty || "Clinical Reviewer",
                lastClinicalReview: pub.versionInfo.reviewed || pub.versionInfo.created,
                nextClinicalReview: nextYear.toISOString(),
                referencesUpdated: pub.versionInfo.reviewed || pub.versionInfo.updated,
                clinicalChangesSinceLastRevision: "Initial import and clinical calibration",
                reviewStatus,
                citationHealth,
                contentCompleteness,
                graphCompleteness,
                seoStatus,
                structuredDataStatus,
                isCornerstone,
                version: pub.versionInfo.version || "1.0.0",
                evidenceLevel: pub.evidenceLevel,
                tags: pub.tags || [],
                canonicalUrl: pub.canonicalUrl || "",
                editorialStatus: pub.editorialStatus || "published",
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
                    seoScore: contentCompleteness,
                    geoScore: contentCompleteness - 5,
                    aiReadinessScore: contentCompleteness - 2
                }
            };
        };
        // Add seeded entities
        diseases_1.DISEASES.forEach((d) => entities.push(convertToKms(d)));
        symptoms_1.SYMPTOMS.forEach((s) => entities.push(convertToKms(s)));
        remedies_1.REMEDIES.forEach((r) => entities.push(convertToKms(r)));
        lab_tests_1.LAB_TESTS.forEach((l) => entities.push(convertToKms(l)));
        faqs_1.FAQS.forEach((f) => entities.push(convertToKms(f)));
        research_1.RESEARCH.forEach((r) => entities.push(convertToKms(r)));
        case_studies_1.CASE_STUDIES.forEach((c) => entities.push(convertToKms(c)));
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
    getEntitiesSync(filters) {
        let result = [...entities];
        if (filters) {
            if (filters.editorialStatus) {
                result = result.filter(e => e.editorialStatus === filters.editorialStatus);
            }
            if (filters.entityType) {
                result = result.filter(e => e.entityType === filters.entityType);
            }
            if (filters.tag) {
                result = result.filter(e => e.tags.includes(filters.tag));
            }
            if (filters.dueReviewBefore) {
                const threshold = new Date(filters.dueReviewBefore);
                result = result.filter(e => new Date(e.nextReviewDate) <= threshold);
            }
        }
        return result;
    }
    async getEntities(filters) {
        let result = [...entities];
        if (filters) {
            if (filters.editorialStatus) {
                result = result.filter(e => e.editorialStatus === filters.editorialStatus);
            }
            if (filters.entityType) {
                result = result.filter(e => e.entityType === filters.entityType);
            }
            if (filters.tag) {
                result = result.filter(e => e.tags.includes(filters.tag));
            }
            if (filters.dueReviewBefore) {
                const threshold = new Date(filters.dueReviewBefore);
                result = result.filter(e => new Date(e.nextReviewDate) <= threshold);
            }
        }
        return result;
    }
    async getEntity(id) {
        const e = entities.find(x => x.id === id || x.slug === id);
        return e || null;
    }
    async saveEntity(entity, editor, role, reason) {
        const idx = entities.findIndex(x => x.id === entity.id);
        const now = new Date().toISOString();
        // Log previous fields changed
        const fieldsChanged = [];
        if (idx !== -1) {
            const original = entities[idx];
            if (JSON.stringify(original.title) !== JSON.stringify(entity.title))
                fieldsChanged.push("title");
            if (JSON.stringify(original.summary) !== JSON.stringify(entity.summary))
                fieldsChanged.push("summary");
            if (original.editorialStatus !== entity.editorialStatus)
                fieldsChanged.push("editorialStatus");
            if (JSON.stringify(original.relatedEntities) !== JSON.stringify(entity.relatedEntities))
                fieldsChanged.push("relatedEntities");
            if (original.editorialNotes !== entity.editorialNotes)
                fieldsChanged.push("editorialNotes");
            if (JSON.stringify(original.content?.references) !== JSON.stringify(entity.content?.references))
                fieldsChanged.push("references");
        }
        else {
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
        }
        else {
            entities.push(updatedEntity);
        }
        // --- CMS/FIRESTORE PERSISTENCE HOOK ---
        // TODO: Connect Firebase Firestore or CMS collection here to persist the updated entity:
        // const docRef = doc(db, "knowledge_entities", updatedEntity.id);
        // await setDoc(docRef, updatedEntity);
        // --------------------------------------
        // Refresh citation links
        this.refreshCitationCounts();
        // Log to audits
        await this.addAuditLog({
            entityId: entity.id,
            entityTitle: entity.title.en || "",
            action: idx === -1 ? "create" : "update",
            performedBy: editor,
            role: role,
            fieldsChanged,
            reason: reason || "Saved in editor"
        });
    }
    async deleteEntity(id, editor, role) {
        const idx = entities.findIndex(x => x.id === id);
        if (idx !== -1) {
            const deleted = entities[idx];
            entities.splice(idx, 1);
            // --- CMS/FIRESTORE PERSISTENCE HOOK ---
            // TODO: Connect Firebase Firestore or CMS collection here to delete the document:
            // await deleteDoc(doc(db, "knowledge_entities", id));
            // --------------------------------------
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
                role: role,
                reason: "Entity permanently deleted by administrator"
            });
        }
    }
    // --- CITATION INTERFACES ---
    async getCitations() {
        return [...citations];
    }
    async getCitation(id) {
        return citations.find(c => c.id === id) || null;
    }
    async saveCitation(citation) {
        const idx = citations.findIndex(c => c.id === citation.id);
        if (idx !== -1) {
            citations[idx] = citation;
        }
        else {
            citations.push(citation);
        }
    }
    async deleteCitation(id) {
        citations = citations.filter(c => c.id !== id);
        // Remove reference from entity links
        entities.forEach(e => {
            if (e.content?.references?.includes(id)) {
                e.content.references = e.content.references.filter((x) => x !== id);
            }
        });
    }
    // --- AUDIT INTERFACES ---
    async getAuditLogs(entityId) {
        if (entityId) {
            return auditLogs.filter(a => a.entityId === entityId).reverse();
        }
        return [...auditLogs].reverse();
    }
    async addAuditLog(entry) {
        auditLogs.push({
            ...entry,
            id: `AUD-${Math.random().toString(36).substr(2, 9)}`,
            performedAt: new Date().toISOString()
        });
    }
    refreshCitationCounts() {
        citations.forEach(c => {
            const links = entities.filter(e => e.content?.references?.includes(c.id)).map(e => e.id);
            c.linkedEntities = links;
            c.usageCount = links.length;
        });
    }
}
exports.MemoryRepository = MemoryRepository;
exports.globalKmsRepository = new MemoryRepository();
exports.default = exports.globalKmsRepository;
