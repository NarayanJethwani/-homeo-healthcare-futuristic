# Multi-Runner Test Execution Strategy & Tiered Architecture

**Version**: 1.1.0  
**Effective Date**: 2026-07-25  

---

## 1. Overview & Tiered Execution Model

The repository uses a multi-runner execution architecture to separate fast Node CLI unit tests, isolated browser UI component rendering, and live Firestore Emulator database persistence & security rules validation.

```
                    ┌──────────────────────────────────────────────┐
                    │               npm run test:all               │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴─────┬───────────────────┐
         ▼                   ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ test:manifest-  │ │    test:unit    │ │  test:emulator  │ │test:performance │
│      audit      │ │  (113 suites)   │ │   (7 suites)    │ │   (1 suite)     │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 2. Test Runner Execution Tiers

| Command | Scope | Target Environment | Exit Policy |
| :--- | :--- | :--- | :--- |
| `npm run test:manifest-audit` | Test manifest completeness & security | Node CLI | Fail-Closed (exit 1 on missing/unclassified file) |
| `npm run test:unit` | Active unit, governance & auth security suites | Node CLI (`REPERTORY_USE_MOCK_FIRESTORE=true`) | Fail-Closed |
| `npm run test:security` | API security, CORS, CSRF & RBAC suites | Node CLI | Fail-Closed |
| `npm run test:integration` | Clinical OS & workflow integration | Node CLI | Fail-Closed |
| `npm run test:emulator` | Firestore persistence & security rules suites | Firebase Emulator (`127.0.0.1:8080`) | Fail-Closed (propagates emulator failure) |
| `npm run test:performance` | Knowledge graph & search performance benchmarks | Node CLI | Fail-Closed |
| **`npm run test:all`** | **Complete Non-UI Multi-Runner Suite** | **All Non-UI Tiers** | **Fail-Closed (exit status 0 required)** |

---

## 3. UI Layer Isolation

UI component rendering suites (10 files) require a browser DOM environment (`vitest-jsdom` / `react-testing-library`) and are isolated in `npm run test:ui`. They do not run under Node CLI unit runners and do not block backend persistence or security rule verification.
