import { getAdminDb } from '@/lib/firebaseAdmin';
import { RepertoryRubricVersion, RepertoryEditorialAuditLog } from '../types';

export class EditorialRepository {
  private static getCollection(name: string) {
    try {
      const db = getAdminDb();
      if (!db) {
        throw new Error("Firestore Admin SDK is not initialized.");
      }
      return db.collection(name);
    } catch (e: any) {
      // In production, we must fail closed. In tests, we can throw so the test harness can handle it.
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Production failure: Required Firestore database is not configured. ${e.message}`);
      }
      throw e;
    }
  }

  // --- Rubric Versions ---

  static async saveRubricVersion(version: RepertoryRubricVersion): Promise<void> {
    const col = this.getCollection('repertoryRubricVersions');
    
    // In a transaction, if setting this version as the current approved one,
    // we must mark all other versions for this rubric as NOT the current approved version.
    const db = getAdminDb();
    await db.runTransaction(async (transaction) => {
      const docRef = col.doc(version.id);
      
      if (version.isCurrentApprovedVersion) {
        const querySnapshot = await col
          .where('rubricId', '==', version.rubricId)
          .where('isCurrentApprovedVersion', '==', true)
          .get();

        querySnapshot.forEach((doc) => {
          if (doc.id !== version.id) {
            transaction.update(col.doc(doc.id), { isCurrentApprovedVersion: false });
          }
        });
      }

      transaction.set(docRef, version);
    });
  }

  static async getRubricVersionById(id: string): Promise<RepertoryRubricVersion | null> {
    const col = this.getCollection('repertoryRubricVersions');
    const doc = await col.doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as RepertoryRubricVersion;
  }

  static async getLatestRubricVersion(rubricId: string): Promise<RepertoryRubricVersion | null> {
    const col = this.getCollection('repertoryRubricVersions');
    const snapshot = await col
      .where('rubricId', '==', rubricId)
      .orderBy('versionNumber', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as RepertoryRubricVersion;
  }

  static async getCurrentApprovedRubricVersion(rubricId: string): Promise<RepertoryRubricVersion | null> {
    const col = this.getCollection('repertoryRubricVersions');
    const snapshot = await col
      .where('rubricId', '==', rubricId)
      .where('isCurrentApprovedVersion', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as RepertoryRubricVersion;
  }

  static async getAllCurrentApprovedVersions(): Promise<RepertoryRubricVersion[]> {
    const col = this.getCollection('repertoryRubricVersions');
    const snapshot = await col.where('isCurrentApprovedVersion', '==', true).get();
    const list: RepertoryRubricVersion[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as RepertoryRubricVersion);
    });
    return list;
  }

  // --- Editorial Audit Logs (Append-Only) ---

  static async saveAuditLog(log: RepertoryEditorialAuditLog): Promise<void> {
    const col = this.getCollection('repertoryEditorialAuditLogs');
    // Ensure the ID exists or generate it
    const docId = log.id || `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const docRef = col.doc(docId);
    
    // Safety check to enforce append-only: verify the document does not exist yet
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      throw new Error(`Audit log with ID ${docId} already exists. Audit logs are append-only.`);
    }

    await docRef.set({
      ...log,
      id: docId,
      createdAt: log.createdAt || new Date().toISOString()
    });
  }

  static async getAuditLogs(): Promise<RepertoryEditorialAuditLog[]> {
    const col = this.getCollection('repertoryEditorialAuditLogs');
    const snapshot = await col.orderBy('createdAt', 'desc').get();
    const logs: RepertoryEditorialAuditLog[] = [];
    snapshot.forEach((doc) => {
      logs.push(doc.data() as RepertoryEditorialAuditLog);
    });
    return logs;
  }
}
