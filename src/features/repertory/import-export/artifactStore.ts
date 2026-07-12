import * as path from 'path';
import * as fs from 'fs';
import crypto from 'crypto';

export interface StoreSourceInput {
  sourceId: string;
  volumeId?: string;
  originalFileName: string;
  bytes: Buffer;
}

export interface StoredArtifact {
  originalFileName: string;
  fileSizeBytes: number;
  sourceChecksum: string;
  artifactStoragePath: string;
}

export interface RepertorySourceArtifactStore {
  storeSource(input: StoreSourceInput): Promise<StoredArtifact>;
  readSource(storagePath: string): Promise<Buffer>;
  exists(storagePath: string): Promise<boolean>;
}

export class LocalArtifactStore implements RepertorySourceArtifactStore {
  private static readonly BASE_DIR = path.join(process.cwd(), 'data', 'repertory', 'source');

  async storeSource(input: StoreSourceInput): Promise<StoredArtifact> {
    const checksum = crypto.createHash('sha256').update(input.bytes).digest('hex');
    const storageName = input.originalFileName;
    const fullPath = path.join(LocalArtifactStore.BASE_DIR, storageName);
    
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, input.bytes);
    
    return {
      originalFileName: input.originalFileName,
      fileSizeBytes: input.bytes.length,
      sourceChecksum: checksum,
      artifactStoragePath: storageName
    };
  }

  async readSource(storagePath: string): Promise<Buffer> {
    const fullPath = path.join(LocalArtifactStore.BASE_DIR, storagePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Artifact not found at path: ${storagePath}`);
    }
    return fs.readFileSync(fullPath);
  }

  async exists(storagePath: string): Promise<boolean> {
    const fullPath = path.join(LocalArtifactStore.BASE_DIR, storagePath);
    return fs.existsSync(fullPath);
  }
}

let activeStore: RepertorySourceArtifactStore = new LocalArtifactStore();

export function getArtifactStore(): RepertorySourceArtifactStore {
  return activeStore;
}

export function setArtifactStore(store: RepertorySourceArtifactStore): void {
  activeStore = store;
}
