// Force mock in-memory Firestore for local unit testing
process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
process.env.NODE_ENV = "test";
process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "mock-project-id";
process.env.REPERTORY_DOCTOR_PILOT_ENABLED = "true";
process.env.REPERTORY_DOCTOR_PILOT_UIDS = "doctor-authorized,doctor-unauthorized,doctor-expired,doctor-suspended";
