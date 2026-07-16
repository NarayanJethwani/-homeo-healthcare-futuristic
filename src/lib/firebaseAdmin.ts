import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getRuntimeEnvironment } from "../features/repertory/config/runtimeEnv";

let isInitialized = false;

if (!getApps().length) {
  try {
    let serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      // Sanitize: strip outer single or double quotes that Vercel env vars sometimes add
      serviceAccountKey = serviceAccountKey.trim();
      if (
        (serviceAccountKey.startsWith("'") && serviceAccountKey.endsWith("'")) ||
        (serviceAccountKey.startsWith('"') && serviceAccountKey.endsWith('"'))
      ) {
        serviceAccountKey = serviceAccountKey.slice(1, -1);
      }
      const parsedKey = JSON.parse(serviceAccountKey);
      initializeApp({
        credential: cert(parsedKey),
        databaseURL: `https://${parsedKey.project_id}.firebaseio.com`
      });
      console.log("Firebase Admin initialized for project:", parsedKey.project_id);
      isInitialized = true;
    } else {
      // Fallback for local development using application default credentials or mock
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id"
      });
      isInitialized = true;
    }
  } catch (error: any) {
    console.error("Firebase admin initialization error:", error?.message || error);
    isInitialized = false;
  }
} else {
  isInitialized = true;
}

let mockDb: any = null;

export function getAdminDb() {
  if (process.env.REPERTORY_USE_MOCK_FIRESTORE === 'true' ||
      (process.env.NODE_ENV === 'test' && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !process.env.FIRESTORE_EMULATOR_HOST)) {
    if (!mockDb) {
      class MockDocumentReference {
        constructor(private collectionName: string, private docId: string, private store: any) {}
        get id() { return this.docId; }
        async get() {
          const data = this.store[this.collectionName]?.[this.docId];
          return {
            id: this.docId,
            exists: !!data,
            data: () => data
          };
        }
        async set(data: any) {
          if (!this.store[this.collectionName]) this.store[this.collectionName] = {};
          this.store[this.collectionName][this.docId] = data;
        }
        async update(data: any) {
          if (!this.store[this.collectionName]) this.store[this.collectionName] = {};
          const existing = this.store[this.collectionName][this.docId] || {};
          this.store[this.collectionName][this.docId] = { ...existing, ...data };
        }
        async delete() {
          if (this.store[this.collectionName]) {
            delete this.store[this.collectionName][this.docId];
          }
        }
      }
      class MockQuery {
        private filters: Array<{ field: string; op: string; val: any }> = [];
        constructor(private collectionName: string, private store: any) {}
        where(field: string, op: string, val: any) {
          this.filters.push({ field, op, val });
          return this;
        }
        orderBy(field: string, dir?: string) {
          return this;
        }
        limit(n: number) {
          return this;
        }
        async get() {
          const colStore = this.store[this.collectionName] || {};
          let docs = Object.keys(colStore).map(id => {
            const data = colStore[id];
            return {
              id,
              exists: true,
              data: () => data
            };
          });

          for (const filter of this.filters) {
            if (filter.op === "==") {
              docs = docs.filter(doc => {
                const docData = doc.data();
                return docData && docData[filter.field] === filter.val;
              });
            } else if (filter.op === "in" && Array.isArray(filter.val)) {
              docs = docs.filter(doc => {
                const docData = doc.data();
                return docData && filter.val.includes(docData[filter.field]);
              });
            }
          }

          return {
            empty: docs.length === 0,
            docs,
            forEach: (cb: any) => docs.forEach(cb)
          };
        }
      }
      class MockCollectionReference {
        constructor(private name: string, private store: any) {}
        doc(id: string) {
          return new MockDocumentReference(this.name, id, this.store);
        }
        where(field: string, op: string, val: any) {
          return new MockQuery(this.name, this.store).where(field, op, val);
        }
        orderBy(field: string, dir?: string) {
          return new MockQuery(this.name, this.store).orderBy(field, dir);
        }
        limit(n: number) {
          return new MockQuery(this.name, this.store).limit(n);
        }
        async get() {
          return new MockQuery(this.name, this.store).get();
        }
        async add(data: any) {
          const id = Math.random().toString(36).substring(2) || "mock-auto-id";
          const docRef = this.doc(id);
          await docRef.set(data);
          return docRef;
        }
      }
      class MockFirestore {
        private store: any = {};
        collection(name: string) {
          return new MockCollectionReference(name, this.store);
        }
        async runTransaction(cb: (tx: any) => Promise<any>) {
          const tx = {
            set: (docRef: any, data: any) => docRef.set(data),
            get: (docRef: any) => docRef.get(),
            update: (docRef: any, data: any) => docRef.update(data),
            delete: (docRef: any) => docRef.delete()
          };
          return cb(tx);
        }
        clearStore() {
          this.store = {};
        }
      }
      mockDb = new MockFirestore();
    }
    return mockDb;
  }

  if (!isInitialized || !getApps().length) {
    throw new Error("Firebase Admin SDK is not initialized. Check your credentials.");
  }

  const env = getRuntimeEnvironment();
  const productionProjectIds = (process.env.REPERTORY_PRODUCTION_FIREBASE_PROJECT_IDS || "homeo-healthcare")
    .split(',').map(s => s.trim()).filter(Boolean);

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    const projId = (getFirestore() as any).projectId || process.env.FIRESTORE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projId && productionProjectIds.includes(projId)) {
      throw new Error(`Emulator Safety Guard: Firestore emulator cannot be used with production project ID ${projId}`);
    }
  }

  return getFirestore();
}

export function getAdminAuth() {
  if (!isInitialized || !getApps().length) {
    throw new Error("Firebase Admin SDK is not initialized. Check your credentials.");
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { getAuth } = require("firebase-admin/auth");
  return getAuth();
}

// Legacy exports as safe Proxies to prevent startup/import-time crashes
const adminAuth = new Proxy({} as any, {
  get(_target, prop) {
    try {
      const auth = getAdminAuth();
      const value = Reflect.get(auth, prop);
      return typeof value === "function" ? value.bind(auth) : value;
    } catch (err: any) {
      console.warn(`Firebase Admin Auth service unavailable: ${err.message}`);
      const dummyFn = () => {
        throw new Error(`Firebase Admin Auth is not initialized. Failed calling Auth.${String(prop)}`);
      };
      return new Proxy(dummyFn, {
        get() {
          return dummyFn;
        }
      });
    }
  }
});

const adminDb = new Proxy({} as any, {
  get(_target, prop) {
    try {
      const db = getAdminDb();
      const value = Reflect.get(db, prop);
      return typeof value === "function" ? value.bind(db) : value;
    } catch (err: any) {
      console.warn(`Firebase Admin Firestore service unavailable: ${err.message}`);
      const dummyFn = () => {
        throw new Error(`Firebase Admin Firestore is not initialized. Failed calling Firestore.${String(prop)}`);
      };
      return new Proxy(dummyFn, {
        get() {
          return dummyFn;
        }
      });
    }
  }
});

export { adminAuth, adminDb };
