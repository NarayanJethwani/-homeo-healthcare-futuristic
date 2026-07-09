"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDb = exports.adminAuth = void 0;
exports.getAdminDb = getAdminDb;
exports.getAdminAuth = getAdminAuth;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
let isInitialized = false;
if (!(0, app_1.getApps)().length) {
    try {
        let serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
            // Sanitize: strip outer single or double quotes that Vercel env vars sometimes add
            serviceAccountKey = serviceAccountKey.trim();
            if ((serviceAccountKey.startsWith("'") && serviceAccountKey.endsWith("'")) ||
                (serviceAccountKey.startsWith('"') && serviceAccountKey.endsWith('"'))) {
                serviceAccountKey = serviceAccountKey.slice(1, -1);
            }
            const parsedKey = JSON.parse(serviceAccountKey);
            (0, app_1.initializeApp)({
                credential: (0, app_1.cert)(parsedKey),
                databaseURL: `https://${parsedKey.project_id}.firebaseio.com`
            });
            console.log("Firebase Admin initialized for project:", parsedKey.project_id);
            isInitialized = true;
        }
        else {
            // Fallback for local development using application default credentials or mock
            (0, app_1.initializeApp)({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id"
            });
            isInitialized = true;
        }
    }
    catch (error) {
        console.error("Firebase admin initialization error:", error?.message || error);
        isInitialized = false;
    }
}
else {
    isInitialized = true;
}
function getAdminDb() {
    if (!isInitialized || !(0, app_1.getApps)().length) {
        throw new Error("Firebase Admin SDK is not initialized. Check your credentials.");
    }
    return (0, firestore_1.getFirestore)();
}
function getAdminAuth() {
    if (!isInitialized || !(0, app_1.getApps)().length) {
        throw new Error("Firebase Admin SDK is not initialized. Check your credentials.");
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { getAuth } = require("firebase-admin/auth");
    return getAuth();
}
// Legacy exports as safe Proxies to prevent startup/import-time crashes
const adminAuth = new Proxy({}, {
    get(_target, prop) {
        try {
            const auth = getAdminAuth();
            const value = Reflect.get(auth, prop);
            return typeof value === "function" ? value.bind(auth) : value;
        }
        catch (err) {
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
exports.adminAuth = adminAuth;
const adminDb = new Proxy({}, {
    get(_target, prop) {
        try {
            const db = getAdminDb();
            const value = Reflect.get(db, prop);
            return typeof value === "function" ? value.bind(db) : value;
        }
        catch (err) {
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
exports.adminDb = adminDb;
