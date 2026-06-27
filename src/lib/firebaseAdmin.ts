import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

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

export function getAdminDb() {
  if (!isInitialized || !getApps().length) {
    throw new Error("Firebase Admin SDK is not initialized. Check your credentials.");
  }
  return getFirestore();
}

export function getAdminAuth() {
  if (!isInitialized || !getApps().length) {
    throw new Error("Firebase Admin SDK is not initialized. Check your credentials.");
  }
  return getAuth();
}

// Legacy exports as safe Proxies to prevent startup/import-time crashes
const adminAuth = new Proxy({} as any, {
  get(target, prop) {
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
        get(t, p) {
          return dummyFn;
        }
      });
    }
  }
});

const adminDb = new Proxy({} as any, {
  get(target, prop) {
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
        get(t, p) {
          return dummyFn;
        }
      });
    }
  }
});

export { adminAuth, adminDb };
