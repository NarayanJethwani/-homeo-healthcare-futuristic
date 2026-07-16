// Force mock in-memory Firestore for local unit testing
process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
process.env.NODE_ENV = "test";
process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";
process.env.PATIENT_SESSION_SECRET = "homeo-healthcare-test-patient-secret-xyz123";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "mock-project-id";
process.env.REPERTORY_DOCTOR_PILOT_ENABLED = "true";
process.env.REPERTORY_DOCTOR_PILOT_UIDS = "doctor-authorized,doctor-unauthorized,doctor-expired,doctor-suspended";
process.env.CLINICAL_PSEUDONYMIZATION_SECRET = "test-clinical-pseudonymization-secret-key-12345";
process.env.AI_ROUTER_SECURITY_V2_ENABLED = "true";
process.env.ALLOWED_ORIGINS = "http://localhost:3000,https://homeo.healthcare,https://www.homeo.healthcare";

