import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      const parsedKey = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(parsedKey),
        databaseURL: `https://${parsedKey.project_id}.firebaseio.com`
      });
    } else {
      // Fallback for local development using application default credentials or mock
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id"
      });
    }
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };
