import "@testing-library/jest-dom/vitest";

process.env.REPERTORY_USE_MOCK_FIRESTORE = 'true';
process.env.NODE_ENV = 'test';
process.env.FIRESTORE_PROJECT_ID = 'hh-test-vitestunit';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'hh-test-vitestunit';
process.env.GCLOUD_PROJECT = 'hh-test-vitestunit';
