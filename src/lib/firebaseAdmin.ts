import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let appInstance: any = null;
let mockDb: any = null;

export type BackendMode = 'mock' | 'emulator' | 'production' | 'unconfigured';

export function resolveBackendMode(): BackendMode {
  // Validate project ID variables consistency
  const fProjId = process.env.FIRESTORE_PROJECT_ID;
  const pubProjId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const gcProjId = process.env.GCLOUD_PROJECT;

  const projectIds = [fProjId, pubProjId, gcProjId].filter(Boolean) as string[];
  if (projectIds.length > 1 && new Set(projectIds).size > 1) {
    throw new Error("Configuration Error: Conflicting project ID variables.");
  }

  const isMock = process.env.REPERTORY_USE_MOCK_FIRESTORE === 'true';

  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

  const hasFirebaseKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const hasGoogleKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const hasAdcOptIn = process.env.REPERTORY_USE_ADC === 'true';
  const hasGacFile = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (hasGacFile && !hasAdcOptIn) {
    throw new Error("Configuration Error: GOOGLE_APPLICATION_CREDENTIALS requires REPERTORY_USE_ADC=true.");
  }

  // Conflicting modes check
  const configSignals = [
    isMock,
    !!emulatorHost,
    (hasFirebaseKey || hasGoogleKey || hasAdcOptIn)
  ].filter(Boolean).length;

  if (configSignals > 1) {
    throw new Error("Configuration Error: Conflicting backend modes configured.");
  }

  if (configSignals === 0) {
    return 'unconfigured';
  }

  if (isMock) {
    if (emulatorHost || hasFirebaseKey || hasGoogleKey || hasAdcOptIn || hasGacFile) {
      throw new Error("Configuration Error: Mock mode cannot be used with production or emulator settings.");
    }
    return 'mock';
  }

  if (emulatorHost) {
    if (isMock || hasFirebaseKey || hasGoogleKey || hasAdcOptIn || hasGacFile) {
      throw new Error("Configuration Error: Emulator mode cannot be used with production settings.");
    }

    // Structural parsing of emulator host
    const lastColonIndex = emulatorHost.lastIndexOf(":");
    if (lastColonIndex === -1) {
      throw new Error("Configuration Error: Invalid emulator host format.");
    }
    const hostSegment = emulatorHost.substring(0, lastColonIndex);
    const portSegment = emulatorHost.substring(lastColonIndex + 1);

    if (hostSegment !== "localhost" && hostSegment !== "127.0.0.1" && hostSegment !== "[::1]") {
      throw new Error("Configuration Error: Invalid emulator host. Only loopback interfaces are allowed.");
    }

    // Port must be an integer between 1 and 65535, reject leading zeros
    if (!/^[1-9][0-9]*$/.test(portSegment)) {
      throw new Error("Configuration Error: Invalid emulator port.");
    }
    const portNum = parseInt(portSegment, 10);
    if (portNum < 1 || portNum > 65535) {
      throw new Error("Configuration Error: Invalid emulator port.");
    }

    const projectId = process.env.FIRESTORE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
    if (!projectId) {
      throw new Error("Configuration Error: Project ID is required for emulator mode.");
    }

    if (!/^hh-test-[a-f0-9]{12}$/.test(projectId)) {
      throw new Error("Configuration Error: Invalid project ID for emulator mode.");
    }

    return 'emulator';
  }

  // Production mode
  if (hasFirebaseKey || hasGoogleKey || hasAdcOptIn) {
    if (isMock || emulatorHost) {
      throw new Error("Configuration Error: Production mode cannot be used with mock or emulator settings.");
    }

    const credentialSources = [hasFirebaseKey, hasGoogleKey, hasAdcOptIn].filter(Boolean).length;
    if (credentialSources > 1) {
      throw new Error("Configuration Error: Multiple production credential sources configured.");
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error("Configuration Error: Production project ID is required.");
    }

    const productionProjectIds = (process.env.REPERTORY_PRODUCTION_FIREBASE_PROJECT_IDS || "homeo-healthcare")
      .split(',').map(s => s.trim()).filter(Boolean);

    if (!productionProjectIds.includes(projectId)) {
      throw new Error("Configuration Error: Project ID is not authorized for production.");
    }

    if (hasFirebaseKey || hasGoogleKey) {
      const keyVal = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "";
      let cleanKey = keyVal.trim();
      if (
        (cleanKey.startsWith("'") && cleanKey.endsWith("'")) ||
        (cleanKey.startsWith('"') && cleanKey.endsWith('"'))
      ) {
        cleanKey = cleanKey.slice(1, -1);
      }

      let parsed: any;
      try {
        parsed = JSON.parse(cleanKey);
      } catch (err) {
        throw new Error("Configuration Error: Failed to parse production credentials.");
      }

      if (parsed.project_id !== projectId) {
        throw new Error("Configuration Error: Mismatched project ID in production credentials.");
      }
    }

    return 'production';
  }

  throw new Error("Configuration Error: Ambiguous backend mode configuration.");
}

function ensureInitialized() {
  if (appInstance || getApps().length > 0) {
    appInstance = getApps()[0] || appInstance;
    return;
  }

  const mode = resolveBackendMode();

  if (mode === 'unconfigured') {
    throw new Error("Configuration Error: Firestore is unconfigured.");
  }

  if (mode === 'mock') {
    return;
  }

  try {
    if (mode === 'emulator') {
      const projectId = process.env.FIRESTORE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
      if (!projectId) {
        throw new Error("Configuration Error: Project ID is required for emulator mode.");
      }
      appInstance = initializeApp({
        projectId
      });
      console.log("Firebase Admin initialized in EMULATOR mode.");
    } else if (mode === 'production') {
      const hasFirebaseKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      const hasGoogleKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      const hasAdcOptIn = process.env.REPERTORY_USE_ADC === 'true';

      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!projectId) {
        throw new Error("Configuration Error: Production project ID is required.");
      }

      if (hasFirebaseKey || hasGoogleKey) {
        const keyVal = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "";
        let cleanKey = keyVal.trim();
        if (
          (cleanKey.startsWith("'") && cleanKey.endsWith("'")) ||
          (cleanKey.startsWith('"') && cleanKey.endsWith('"'))
        ) {
          cleanKey = cleanKey.slice(1, -1);
        }
        const parsedKey = JSON.parse(cleanKey);
        appInstance = initializeApp({
          credential: cert(parsedKey),
          databaseURL: `https://${parsedKey.project_id}.firebaseio.com`
        });
        console.log("Firebase Admin initialized in PRODUCTION mode with service account.");
      } else if (hasAdcOptIn) {
        appInstance = initializeApp({
          projectId
        });
        console.log("Firebase Admin initialized in PRODUCTION mode using ADC.");
      }
    }
  } catch (error: any) {
    console.error("Firebase admin initialization error: Failed to initialize Firebase application.");
    appInstance = null;
    throw new Error("Firebase admin initialization error: Failed to initialize Firebase application.");
  }
}

export function resetMockDb() {
  const mode = resolveBackendMode();
  if (mode !== 'mock') {
    throw new Error("Configuration Error: Reset mock database is only permitted in mock mode.");
  }
  if (mockDb) {
    mockDb.clearStore();
  }
}

export function getAdminDb() {
  const mode = resolveBackendMode();
  if (mode === 'mock') {
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
  ensureInitialized();
  return getFirestore();
}

export function getAdminAuth(): any {
  const mode = resolveBackendMode();
  if (mode === 'mock') {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error("Configuration Error: Mock auth is not allowed outside test environment.");
    }
    return {
      verifyIdToken: async (token: string) => {
        if (token === 'valid-token') return { uid: 'mock-user', role: 'practitioner' };
        throw new Error("Invalid token");
      },
      deleteUser: async (uid: string) => {
        return;
      }
    } as any;
  }
  ensureInitialized();
  return getAuth() as any;
}

// Legacy exports as safe Proxies to prevent startup/import-time crashes
const adminAuth = new Proxy({} as any, {
  get(_target, prop) {
    try {
      const auth = getAdminAuth();
      const value = Reflect.get(auth, prop);
      return typeof value === "function" ? value.bind(auth) : value;
    } catch {
      console.warn("Firebase Admin Auth service unavailable.");
      const dummyFn = () => {
        throw new Error("Firebase Admin Auth is not initialized.");
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
    } catch {
      console.warn("Firebase Admin Firestore service unavailable.");
      const dummyFn = () => {
        throw new Error("Firebase Admin Firestore is not initialized.");
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
