import * as admin from "firebase-admin";

if (!admin.apps.length) {
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
      admin.initializeApp({
        credential: admin.credential.cert(parsedKey),
        databaseURL: `https://${parsedKey.project_id}.firebaseio.com`
      });
      console.log("Firebase Admin initialized for project:", parsedKey.project_id);
    } else {
      // Fallback for local development using application default credentials or mock
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id"
      });
    }
  } catch (error: any) {
    console.error("Firebase admin initialization error:", error?.message || error);
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };
