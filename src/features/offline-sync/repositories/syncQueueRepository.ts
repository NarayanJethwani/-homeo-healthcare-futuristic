import { SyncOperation } from "../domain/sync.types";

export interface SyncQueueRepository {
  enqueue(operation: SyncOperation): Promise<void>;
  dequeue(operationId: string): Promise<void>;
  peekPending(): Promise<SyncOperation[]>;
  updateStatus(operationId: string, status: SyncOperation["syncStatus"], error?: string): Promise<void>;
  clearQueue(): Promise<void>;
}

/**
 * DEVELOPMENT ONLY - Synthetic In-Memory Sync Queue Repository
 */
export class MockSyncQueueRepository implements SyncQueueRepository {
  private queue: SyncOperation[] = [];

  async enqueue(operation: SyncOperation): Promise<void> {
    this.queue.push(operation);
    console.log(`[Offline Sync Queue - DEV] Enqueued operation ${operation.operationId} on ${operation.entityType}`);
  }

  async dequeue(operationId: string): Promise<void> {
    this.queue = this.queue.filter(o => o.operationId !== operationId);
  }

  async peekPending(): Promise<SyncOperation[]> {
    return this.queue.filter(o => o.syncStatus === "pending" || o.syncStatus === "failed");
  }

  async updateStatus(operationId: string, status: SyncOperation["syncStatus"], error?: string): Promise<void> {
    const op = this.queue.find(o => o.operationId === operationId);
    if (op) {
      op.syncStatus = status;
      if (error) {
        op.errorMessage = error;
        op.retryCount += 1;
      }
    }
  }

  async clearQueue(): Promise<void> {
    this.queue = [];
  }
}
