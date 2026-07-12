import { getAdminDb } from '../../../lib/firebaseAdmin';
import { getRuntimeEnvironment } from '../config/runtimeEnv';
import * as fs from 'fs';
import * as path from 'path';

export type ActiveRepertoryCorpus = {
  activeVersion: string;
  previousVersion?: string;
  contentHash: string;

  activatedAt: string;
  activatedByUid: string;

  transactionId: string;
  auditLogId: string;

  status: "active";
};

export type ActivateCorpusInput = {
  version: string;
  previousVersion?: string;
  contentHash: string;
  actorUid: string;
  actorRole: string;
  reason: string;
  transactionId: string;
  auditLogId: string;
};

export type RollbackCorpusInput = {
  version: string;
  previousVersion?: string;
  contentHash: string;
  actorUid: string;
  actorRole: string;
  reason: string;
  transactionId: string;
  auditLogId: string;
};

export interface ActiveCorpusPointerRepository {
  getActive(): Promise<ActiveRepertoryCorpus | null>;
  activate(input: ActivateCorpusInput): Promise<void>;
  rollback(input: RollbackCorpusInput): Promise<void>;
}

let sharedInMemoryActiveCorpus: ActiveRepertoryCorpus | null = null;

export function resetSharedInMemoryActiveCorpus(): void {
  sharedInMemoryActiveCorpus = null;
}

export class InMemoryActiveCorpusPointerRepository implements ActiveCorpusPointerRepository {
  async getActive(): Promise<ActiveRepertoryCorpus | null> {
    return sharedInMemoryActiveCorpus;
  }

  async activate(input: ActivateCorpusInput): Promise<void> {
    sharedInMemoryActiveCorpus = {
      activeVersion: input.version,
      previousVersion: input.previousVersion,
      contentHash: input.contentHash,
      activatedAt: new Date().toISOString(),
      activatedByUid: input.actorUid,
      transactionId: input.transactionId,
      auditLogId: input.auditLogId,
      status: "active"
    };
  }

  async rollback(input: RollbackCorpusInput): Promise<void> {
    sharedInMemoryActiveCorpus = {
      activeVersion: input.version,
      previousVersion: input.previousVersion,
      contentHash: input.contentHash,
      activatedAt: new Date().toISOString(),
      activatedByUid: input.actorUid,
      transactionId: input.transactionId,
      auditLogId: input.auditLogId,
      status: "active"
    };
  }
}

export class LocalFileActiveCorpusPointerRepository implements ActiveCorpusPointerRepository {
  private getPointerFile(): string {
    const env = getRuntimeEnvironment();
    return path.join(env.artifactRoot, 'published', 'active_pointer.json');
  }

  async getActive(): Promise<ActiveRepertoryCorpus | null> {
    const pointerFile = this.getPointerFile();
    if (!fs.existsSync(pointerFile)) {
      return null;
    }
    try {
      const content = fs.readFileSync(pointerFile, 'utf-8');
      return JSON.parse(content) as ActiveRepertoryCorpus;
    } catch (e) {
      console.warn("LocalFileActiveCorpusPointerRepository: Failed to read pointer file", e);
      return null;
    }
  }

  async activate(input: ActivateCorpusInput): Promise<void> {
    const pointerFile = this.getPointerFile();
    const dir = path.dirname(pointerFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data: ActiveRepertoryCorpus = {
      activeVersion: input.version,
      previousVersion: input.previousVersion,
      contentHash: input.contentHash,
      activatedAt: new Date().toISOString(),
      activatedByUid: input.actorUid,
      transactionId: input.transactionId,
      auditLogId: input.auditLogId,
      status: "active"
    };
    fs.writeFileSync(pointerFile, JSON.stringify(data, null, 2), 'utf-8');
  }

  async rollback(input: RollbackCorpusInput): Promise<void> {
    const pointerFile = this.getPointerFile();
    const dir = path.dirname(pointerFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data: ActiveRepertoryCorpus = {
      activeVersion: input.version,
      previousVersion: input.previousVersion,
      contentHash: input.contentHash,
      activatedAt: new Date().toISOString(),
      activatedByUid: input.actorUid,
      transactionId: input.transactionId,
      auditLogId: input.auditLogId,
      status: "active"
    };
    fs.writeFileSync(pointerFile, JSON.stringify(data, null, 2), 'utf-8');
  }
}

export class FirestoreActiveCorpusPointerRepository implements ActiveCorpusPointerRepository {
  private getCollection() {
    return getAdminDb().collection('repertoryActiveCorpusPointer');
  }

  async getActive(): Promise<ActiveRepertoryCorpus | null> {
    try {
      const doc = await this.getCollection().doc('active').get();
      if (!doc.exists) return null;
      return doc.data() as ActiveRepertoryCorpus;
    } catch (e) {
      console.warn("FirestoreActiveCorpusPointerRepository: Failed to get active corpus pointer:", e);
      return null;
    }
  }

  async activate(input: ActivateCorpusInput): Promise<void> {
    await this.getCollection().doc('active').set({
      activeVersion: input.version,
      previousVersion: input.previousVersion || null,
      contentHash: input.contentHash,
      activatedAt: new Date().toISOString(),
      activatedByUid: input.actorUid,
      transactionId: input.transactionId,
      auditLogId: input.auditLogId,
      status: "active"
    });
  }

  async rollback(input: RollbackCorpusInput): Promise<void> {
    await this.getCollection().doc('active').set({
      activeVersion: input.version,
      previousVersion: input.previousVersion || null,
      contentHash: input.contentHash,
      activatedAt: new Date().toISOString(),
      activatedByUid: input.actorUid,
      transactionId: input.transactionId,
      auditLogId: input.auditLogId,
      status: "active"
    });
  }
}

let singletonPointerRepo: ActiveCorpusPointerRepository | null = null;

export function resetActiveCorpusPointerRepository(): void {
  singletonPointerRepo = null;
}

export function getActiveCorpusPointerRepository(): ActiveCorpusPointerRepository {
  if (singletonPointerRepo) return singletonPointerRepo;

  const env = getRuntimeEnvironment();
  if (env.activePointerRepositoryAdapter === 'firestore') {
    singletonPointerRepo = new FirestoreActiveCorpusPointerRepository();
  } else if (env.activePointerRepositoryAdapter === 'memory') {
    singletonPointerRepo = new InMemoryActiveCorpusPointerRepository();
  } else if (process.env.TEST_POINTER_REPO === 'local-file') {
    singletonPointerRepo = new LocalFileActiveCorpusPointerRepository();
  } else {
    singletonPointerRepo = new LocalFileActiveCorpusPointerRepository();
  }
  return singletonPointerRepo;
}
