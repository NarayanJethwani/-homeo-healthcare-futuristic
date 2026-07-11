export type SyncOperationType = "create" | "update" | "delete";
export type SyncStatus = "pending" | "processing" | "failed" | "completed";

export interface SyncOperation {
  operationId: string;
  entityId: string;
  entityType: string;
  organizationId: string;
  baseVersion: number; // For optimistic concurrency check
  clientTimestamp: string;
  serverTimestamp?: string;
  actorId: string;
  deviceId: string;
  operationType: SyncOperationType;
  retryCount: number;
  syncStatus: SyncStatus;
  payload: Record<string, unknown>;
  errorMessage?: string;
}

export interface SyncStats {
  pendingCount: number;
  failedCount: number;
  lastSyncedAt?: string;
}
