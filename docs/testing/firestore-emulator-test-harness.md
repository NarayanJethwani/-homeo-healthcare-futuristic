# Firestore Emulator Test Harness Architecture & Isolation Rules

**Version**: 1.0.0  
**Effective Date**: 2026-07-25  
**Scope**: NarayanJethwani/-homeo-healthcare-futuristic  

---

## 1. Overview & Architecture

The Firestore Emulator Test Harness provides deterministic, isolated execution for database persistence and security rules testing without contacting production Firebase services.

```
                    ┌──────────────────────────────────────────────┐
                    │          scripts/run-emulator-tests.ts       │
                    └──────────────────────┬───────────────────────┘
                                           │ (Starts 127.0.0.1:8080)
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │      Firebase Firestore Emulator (8080)     │
                    │         Loading firestore.rules              │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
 ┌───────────────┐                 ┌───────────────┐                 ┌───────────────┐
 │ firestoreRules│                 │ materiaMedica │                 │ repertory     │
 │ Client.test.ts│                 │ Persistence   │                 │ Approval      │
 │ (4 tests)     │                 │ (10 tests)    │                 │ Persistence   │
 └───────────────┘                 └───────────────┘                 └───────────────┘
```

---

## 2. Fail-Closed Environment Isolation Controls

1. **Host Verification**: `FIRESTORE_EMULATOR_HOST` must point to loopback interface (`127.0.0.1:8080` or `localhost:8080`).
2. **Project ID Pattern**: Project ID must match synthetic pattern `/^hh-test-[a-f0-9]{12}$/` or `hh-test-1234567890ab`. Real/production project IDs (`homeo-healthcare`, `production-project-id`) cause immediate harness startup failure.
3. **Production Credential Blocking**: Presence of `FIREBASE_SERVICE_ACCOUNT_KEY` or `GOOGLE_APPLICATION_CREDENTIALS` immediately halts the test runner.
4. **Data Isolation Endpoint**: Database documents are purged between test suites using `DELETE http://127.0.0.1:8080/emulator/v1/projects/{projectId}/databases/(default)/documents`.

---

## 3. Running Emulator Tests

```bash
# Run all Firestore emulator suites
npm run test:emulator

# Run non-UI multi-runner suite including emulator
npm run test:all
```
