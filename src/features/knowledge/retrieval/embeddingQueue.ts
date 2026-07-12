import { globalVectorStore, VectorRecord } from "./vectorStore";
import { embeddingManager } from "./embeddingProvider";

export interface EmbeddingJob {
  id: string;
  articleId: string;
  title: string;
  entityType: string;
  contentText: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  error?: string;
  createdAt: string;
  updatedAt: string;
  attempts: number;
}

export interface EmbeddingJobResult {
  success: boolean;
  jobId: string;
  articleId: string;
  vectorUpserted: boolean;
  providerUsed?: string;
  dimensions?: number;
  contentHash?: string;
  warnings: string[];
  errors: string[];
}

function sanitizePii(text: string): string {
  if (!text) return text;
  // Redact email addresses
  let sanitized = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]");
  // Redact phone numbers
  sanitized = sanitized.replace(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, "[REDACTED_PHONE]");
  return sanitized;
}

// In-memory queue fallback
const memoryQueue: EmbeddingJob[] = [];

async function getFirestoreDb() {
  try {
    const { getAdminDb } = await import("../../../lib/firebaseAdmin");
    const db = getAdminDb();
    if (db) return db;
  } catch (e) {
    // Fallback
  }
  return null;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export async function queueEmbeddingJob(
  articleId: string,
  title: string,
  entityType: string,
  contentText: string
): Promise<EmbeddingJob> {
  if (contentText.includes("Reviewer Notes:") || contentText.includes("Audit Trail:") || contentText.includes("workflow note")) {
    throw new Error("Job payload cannot contain reviewer notes or workflow audit logs.");
  }

  const cleanTitle = sanitizePii(title);
  const cleanContent = sanitizePii(contentText);

  const db = await getFirestoreDb();
  const now = new Date().toISOString();
  
  // Deduplicate: remove any existing pending or failed jobs for this article
  if (db) {
    try {
      const snap = await db.collection("knowledge_embedding_jobs")
        .where("articleId", "==", articleId)
        .get();
      for (const doc of snap.docs) {
        const data = doc.data();
        if (data.status === "pending" || data.status === "failed") {
          await doc.ref.delete();
        }
      }
    } catch {
      // Ignore
    }
  }
  
  const existingIdx = memoryQueue.findIndex(j => j.articleId === articleId && (j.status === "pending" || j.status === "failed"));
  if (existingIdx !== -1) {
    memoryQueue.splice(existingIdx, 1);
  }

  const job: EmbeddingJob = {
    id: generateId(),
    articleId,
    title: cleanTitle,
    entityType,
    contentText: cleanContent,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    attempts: 0
  };

  if (db) {
    try {
      await db.collection("knowledge_embedding_jobs").doc(job.id).set(job);
      return job;
    } catch (err) {
      console.warn("[EmbeddingQueue] Failed to write job to Firestore, writing in-memory fallback.", err);
    }
  }

  memoryQueue.push(job);
  return job;
}

export async function getQueueJobs(): Promise<EmbeddingJob[]> {
  const db = await getFirestoreDb();
  if (db) {
    try {
      const snap = await db.collection("knowledge_embedding_jobs").get();
      const list: EmbeddingJob[] = [];
      snap.forEach((doc: any) => list.push(doc.data() as EmbeddingJob));
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      // Fallback
    }
  }
  return [...memoryQueue].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function processQueue(): Promise<void> {
  const jobs = await getQueueJobs();
  const pendingJobs = jobs.filter(j => j.status === "pending");

  for (const job of pendingJobs) {
    await runJob(job);
  }
}

export async function retryFailedJobs(): Promise<void> {
  const jobs = await getQueueJobs();
  const failedJobs = jobs.filter(j => j.status === "failed");

  for (const job of failedJobs) {
    job.status = "pending";
    job.error = undefined;
    job.attempts = 0; // Reset attempts to allow fresh retrying
    job.updatedAt = new Date().toISOString();
    
    const db = await getFirestoreDb();
    if (db) {
      try {
        await db.collection("knowledge_embedding_jobs").doc(job.id).set(job);
      } catch {
        // memory sync
      }
    }
    const memIdx = memoryQueue.findIndex(j => j.id === job.id);
    if (memIdx !== -1) {
      memoryQueue[memIdx] = job;
    }

    await runJob(job);
  }
}

export async function runJob(job: EmbeddingJob): Promise<EmbeddingJobResult> {
  const warnings: string[] = [];
  const errors: string[] = [];
  let providerName = "unknown";
  let dims = 0;
  let computedHash = "";
  let vectorUpserted = false;

  const db = await getFirestoreDb();
  const updateJobStatus = async (status: EmbeddingJob["status"], errorMsg?: string) => {
    job.status = status;
    job.error = errorMsg;
    job.updatedAt = new Date().toISOString();
    if (db) {
      try {
        await db.collection("knowledge_embedding_jobs").doc(job.id).set(job);
      } catch {
        // fallback
      }
    }
    const memIdx = memoryQueue.findIndex(j => j.id === job.id);
    if (memIdx !== -1) {
      memoryQueue[memIdx] = job;
    }
  };

  if (job.attempts >= 3) {
    const errorMsg = "Max retries exceeded (3 attempts limit reached).";
    errors.push(errorMsg);
    await updateJobStatus("failed", errorMsg);
    return {
      success: false,
      jobId: job.id,
      articleId: job.articleId,
      vectorUpserted: false,
      warnings,
      errors
    };
  }

  job.status = "processing";
  job.attempts++;
  job.updatedAt = new Date().toISOString();

  await updateJobStatus("processing");

  try {
    const provider = await embeddingManager.getActiveProvider();
    providerName = provider.name;
    if (provider.name === "null-provider") {
      throw new Error("Active embedding provider is offline or null-provider.");
    }

    // Generate embedding
    const vector = await provider.getEmbeddings(job.contentText);
    if (!vector || vector.length === 0) {
      throw new Error("Generated embedding vector is empty.");
    }
    dims = vector.length;

    // Compute content hash
    const textToHash = `${job.title}\n${job.contentText}`;
    computedHash = Buffer.from(textToHash).toString("base64").slice(0, 16);

    const record: VectorRecord = {
      id: job.articleId,
      articleId: job.articleId,
      entityType: job.entityType,
      title: job.title,
      vector,
      contentHash: computedHash,
      model: provider.name,
      dimensions: vector.length,
      updatedAt: new Date().toISOString(),
      status: "published"
    };

    await globalVectorStore.upsertVector(record);
    vectorUpserted = true;
    await updateJobStatus("completed");

    return {
      success: true,
      jobId: job.id,
      articleId: job.articleId,
      vectorUpserted: true,
      providerUsed: providerName,
      dimensions: dims,
      contentHash: computedHash,
      warnings,
      errors
    };
  } catch (err: any) {
    const errMsg = err.message || String(err);
    errors.push(errMsg);
    console.error(`[EmbeddingQueue] Job ${job.id} for article ${job.articleId} failed: ${errMsg}`);
    await updateJobStatus("failed", errMsg);

    return {
      success: false,
      jobId: job.id,
      articleId: job.articleId,
      vectorUpserted: false,
      providerUsed: providerName,
      warnings,
      errors
    };
  }
}
