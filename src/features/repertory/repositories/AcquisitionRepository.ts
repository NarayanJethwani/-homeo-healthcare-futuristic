import { getAdminDb } from '../../../lib/firebaseAdmin';
import { 
  RepertoryAcquisitionRecord, 
  AuditActor, 
  CreateRepertoryAcquisitionRecordInput, 
  AcquisitionTransition, 
  AcquiredSourceArtifact, 
  RepertoryExtractionStatus,
  RepertoryAcquisitionRegisterExport 
} from '../types';
import { getRuntimeEnvironment } from '../config/runtimeEnv';
import * as fs from 'fs';
import * as path from 'path';

export interface IAcquisitionRepository {
  getById(id: string): Promise<RepertoryAcquisitionRecord | null>;
  getForSource(sourceId: string): Promise<RepertoryAcquisitionRecord[]>;
  create(input: CreateRepertoryAcquisitionRecordInput, actor: AuditActor): Promise<RepertoryAcquisitionRecord>;
  updateStatus(id: string, transition: AcquisitionTransition, actor: AuditActor): Promise<RepertoryAcquisitionRecord>;
  recordArtifact(id: string, artifact: AcquiredSourceArtifact, actor: AuditActor): Promise<RepertoryAcquisitionRecord>;
  recordExtractionStatus(id: string, status: RepertoryExtractionStatus, actor: AuditActor): Promise<RepertoryAcquisitionRecord>;
  updateEditorialStatus(id: string, status: RepertoryAcquisitionRecord["editorialStatus"], actor: AuditActor): Promise<RepertoryAcquisitionRecord>;
  updatePublicationStatus(id: string, status: RepertoryAcquisitionRecord["publicationStatus"], actor: AuditActor): Promise<RepertoryAcquisitionRecord>;
  exportRegister(): Promise<void>;
}

// In-Memory implementation for tests or fallback
class InMemoryAcquisitionRepository implements IAcquisitionRepository {
  private records = new Map<string, RepertoryAcquisitionRecord>();

  private getExportPath(): string {
    const env = getRuntimeEnvironment();
    return path.join(env.artifactRoot, 'reports', 'acquisition-register.json');
  }

  constructor() {
    this.loadRegister();
  }

  private loadRegister() {
    const exportPath = this.getExportPath();
    if (fs.existsSync(exportPath)) {
      try {
        const raw = fs.readFileSync(exportPath, 'utf-8');
        const data: RepertoryAcquisitionRegisterExport = JSON.parse(raw);
        if (data && Array.isArray(data.records)) {
          data.records.forEach(r => {
            this.records.set(r.id, r);
          });
        }
      } catch (err) {
        console.warn("Failed to load in-memory acquisition register from JSON file:", err);
      }
    }
  }

  async getById(id: string): Promise<RepertoryAcquisitionRecord | null> {
    return this.records.get(id) || null;
  }

  async getForSource(sourceId: string): Promise<RepertoryAcquisitionRecord[]> {
    return Array.from(this.records.values()).filter(r => r.sourceId === sourceId);
  }

  async create(input: CreateRepertoryAcquisitionRecordInput, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const id = `acq_mem_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();
    const record: RepertoryAcquisitionRecord = {
      id,
      sourceId: input.sourceId,
      volumeId: input.volumeId,
      candidateSourceUrl: input.candidateSourceUrl,
      sourceProvider: input.sourceProvider,
      archiveIdentifier: input.archiveIdentifier,
      expectedPhysicalPageCount: input.expectedPhysicalPageCount,
      expectedPrintedPageStart: input.expectedPrintedPageStart,
      expectedPrintedPageEnd: input.expectedPrintedPageEnd,
      acquisitionStatus: "candidate-found",
      extractionStatus: "not-started",
      editorialStatus: "not-submitted",
      publicationStatus: "not-published",
      createdAt: now,
      updatedAt: now
    };
    this.records.set(id, record);
    return record;
  }

  async updateStatus(id: string, transition: AcquisitionTransition, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error(`Acquisition record ${id} not found.`);
    record.acquisitionStatus = transition.status;
    record.statusReason = transition.reason;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  async recordArtifact(id: string, artifact: AcquiredSourceArtifact, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error(`Acquisition record ${id} not found.`);
    record.originalFileName = artifact.originalFileName;
    record.fileSizeBytes = artifact.fileSizeBytes;
    record.sourceChecksum = artifact.sourceChecksum;
    record.artifactStoragePath = artifact.artifactStoragePath;
    record.acquisitionStatus = "acquired";
    record.updatedAt = new Date().toISOString();
    return record;
  }

  async recordExtractionStatus(id: string, status: RepertoryExtractionStatus, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error(`Acquisition record ${id} not found.`);
    record.extractionStatus = status.extractionStatus;
    record.parserVersion = status.parserVersion;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  async updateEditorialStatus(id: string, status: RepertoryAcquisitionRecord["editorialStatus"], actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error(`Acquisition record ${id} not found.`);
    record.editorialStatus = status;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  async updatePublicationStatus(id: string, status: RepertoryAcquisitionRecord["publicationStatus"], actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error(`Acquisition record ${id} not found.`);
    record.publicationStatus = status;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  async exportRegister(): Promise<void> {
    const exportPath = this.getExportPath();
    const dir = path.dirname(exportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data: RepertoryAcquisitionRegisterExport = {
      generatedAt: new Date().toISOString(),
      records: Array.from(this.records.values())
    };
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// Firestore collection-backed implementation
class FirestoreAcquisitionRepository implements IAcquisitionRepository {
  private getCollection() {
    return getAdminDb().collection('repertoryAcquisitionRecords');
  }

  async getById(id: string): Promise<RepertoryAcquisitionRecord | null> {
    const doc = await this.getCollection().doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as RepertoryAcquisitionRecord;
  }

  async getForSource(sourceId: string): Promise<RepertoryAcquisitionRecord[]> {
    const snapshot = await this.getCollection().where('sourceId', '==', sourceId).get();
    const list: RepertoryAcquisitionRecord[] = [];
    snapshot.forEach((doc: any) => {
      list.push({ id: doc.id, ...doc.data() } as RepertoryAcquisitionRecord);
    });
    return list;
  }

  async create(input: CreateRepertoryAcquisitionRecordInput, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const id = `acq_${Date.now()}`;
    const now = new Date().toISOString();
    const record: Omit<RepertoryAcquisitionRecord, 'id'> = {
      sourceId: input.sourceId,
      volumeId: input.volumeId || "",
      candidateSourceUrl: input.candidateSourceUrl || "",
      sourceProvider: input.sourceProvider || "",
      archiveIdentifier: input.archiveIdentifier || "",
      expectedPhysicalPageCount: input.expectedPhysicalPageCount || 0,
      expectedPrintedPageStart: input.expectedPrintedPageStart || "",
      expectedPrintedPageEnd: input.expectedPrintedPageEnd || "",
      acquisitionStatus: "candidate-found",
      extractionStatus: "not-started",
      editorialStatus: "not-submitted",
      publicationStatus: "not-published",
      createdAt: now,
      updatedAt: now
    };
    await this.getCollection().doc(id).set(record);
    return { id, ...record };
  }

  async updateStatus(id: string, transition: AcquisitionTransition, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const now = new Date().toISOString();
    const update = {
      acquisitionStatus: transition.status,
      statusReason: transition.reason || "",
      updatedAt: now
    };
    await this.getCollection().doc(id).update(update);
    const updated = await this.getById(id);
    if (!updated) throw new Error(`Acquisition record ${id} not found after update.`);
    return updated;
  }

  async recordArtifact(id: string, artifact: AcquiredSourceArtifact, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const now = new Date().toISOString();
    const update = {
      originalFileName: artifact.originalFileName,
      fileSizeBytes: artifact.fileSizeBytes,
      sourceChecksum: artifact.sourceChecksum,
      artifactStoragePath: artifact.artifactStoragePath,
      acquisitionStatus: "acquired" as const,
      updatedAt: now
    };
    await this.getCollection().doc(id).update(update);
    const updated = await this.getById(id);
    if (!updated) throw new Error(`Acquisition record ${id} not found after recording artifact.`);
    return updated;
  }

  async recordExtractionStatus(id: string, status: RepertoryExtractionStatus, actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const now = new Date().toISOString();
    const update = {
      extractionStatus: status.extractionStatus,
      parserVersion: status.parserVersion,
      updatedAt: now
    };
    await this.getCollection().doc(id).update(update);
    const updated = await this.getById(id);
    if (!updated) throw new Error(`Acquisition record ${id} not found after recording extraction.`);
    return updated;
  }

  async updateEditorialStatus(id: string, status: RepertoryAcquisitionRecord["editorialStatus"], actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const now = new Date().toISOString();
    const update = {
      editorialStatus: status,
      updatedAt: now
    };
    await this.getCollection().doc(id).update(update);
    const updated = await this.getById(id);
    if (!updated) throw new Error(`Acquisition record ${id} not found after updating editorial status.`);
    return updated;
  }

  async updatePublicationStatus(id: string, status: RepertoryAcquisitionRecord["publicationStatus"], actor: AuditActor): Promise<RepertoryAcquisitionRecord> {
    const now = new Date().toISOString();
    const update = {
      publicationStatus: status,
      updatedAt: now
    };
    await this.getCollection().doc(id).update(update);
    const updated = await this.getById(id);
    if (!updated) throw new Error(`Acquisition record ${id} not found after updating publication status.`);
    return updated;
  }

  async exportRegister(): Promise<void> {
    const snapshot = await this.getCollection().get();
    const records: RepertoryAcquisitionRecord[] = [];
    snapshot.forEach((doc: any) => {
      records.push({ id: doc.id, ...doc.data() } as RepertoryAcquisitionRecord);
    });

    const env = getRuntimeEnvironment();
    const exportPath = path.join(env.artifactRoot, 'reports', 'acquisition-register.json');
    const dir = path.dirname(exportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data: RepertoryAcquisitionRegisterExport = {
      generatedAt: new Date().toISOString(),
      records
    };
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// Instantiate based on environment adapter
export const acquisitionRepository: IAcquisitionRepository = 
  getRuntimeEnvironment().acquisitionRepositoryAdapter === 'firestore'
    ? new FirestoreAcquisitionRepository()
    : new InMemoryAcquisitionRepository();
