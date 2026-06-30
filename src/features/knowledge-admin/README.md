# Clinical Knowledge Management System (KMS) Admin Module

This module provides the administrative interfaces, validation engines, and governance systems to manage the **Clinical Knowledge Platform** of the Homeo Healthcare website.

It acts as the editorial operating system for managing structured medical knowledge entities (Diseases, Symptoms, Remedies, Lab Tests, etc.) while ensuring strict compliance with clinical policies.

---

## 📂 Directory Layout

```
src/features/knowledge-admin/
├── types/                      # Core KMS type interfaces & audit log shapes
├── repositories/               # Repository Pattern interfaces and providers
│   ├── KnowledgeRepository.ts  # Base database access interface
│   ├── MemoryRepository.ts     # In-memory provider (seeded from public content)
│   └── FirestoreRepository.ts  # Placeholder provider for Firestore migration
├── adapters/                   # Serializers, parsers, and comparisons
│   ├── importExport.ts         # Bulk export/import (JSON, CSV, Graph Triples)
│   └── diff.ts                 # Line-by-line visual diff comparison engines
├── validation/                 # Content health validation engines
│   ├── qualityGates.ts         # Safety audits (prohibited claims & disclaimers)
│   ├── duplicateDetector.ts    # Jaccard title-word duplicate scanners
│   └── relationshipSuggestions.ts # Clinical word association suggests
├── components/                 # Reusable React UI controls
│   ├── KnowledgeEditor.tsx     # localizable CRUD editor layout
│   ├── RelationshipGraph.tsx   # visual entity relationship network
│   ├── ReferencePicker.tsx     # central citation registry select dropdown
│   └── VersionTimeline.tsx     # changelog comparison and rollback triggers
└── pages/                      # Dashboard and CRUD registries
    ├── KmsDashboard.tsx        # Overall health metrics and tasks
    ├── EntityRegistry.tsx      # Tabular registry with search & filters
    └── CitationLibrary.tsx     # Scientific reference library management
```

---

## ⚡ Key Architectural Concepts

### 1. Repository Pattern
To prevent UI layouts from binding directly to database drivers, all components interact with `KnowledgeRepository`. 
- **`MemoryRepository`** operates as a transient store seeded automatically from public static `.ts` files, enabling client-side testing without setup complexity.
- **`FirestoreRepository`** exists as a clear, typed stub ready to be filled when ready to transition content updates to Firebase collections.

### 2. Clinical Validation & Quality Gates
Before any draft transition becomes `published`, it must satisfy rules defined in `qualityGates.ts`:
- **Prohibited Claims Scanner**: Blocks saving or publishing entities containing illegal or non-compliant medical assertions (e.g., *"guaranteed cure"*, *"permanent cure"*, *"no side effects"*, *"proven cure"*).
- **Disclaimer Enforcement**: Verifies presence of a standard patient warning block.
- **Reviewer Credentials Check**: Asserts presence of a reviewer name, specialty, and date.
- **Canonical Address Matching**: Ensures the slug maps precisely to the relative public page URL pathing.
- **Broken Connection Audit**: Scans related entity tags to make sure there are no dead links to undefined IDs.

### 3. Change Tracking & Audit Logs
Every write transaction logs metadata through `addAuditLog` capturing:
- The editing user and active role.
- Fields modified during the update.
- Version increments (e.g. `1.0.0` to `1.0.1`).
- Rolling JSON snapshots of previous revisions allowing safe point-in-time rollbacks.

### 4. Graph Relationships (Triples)
Relationships between nodes (e.g. `[Disease-GERD] -> (treatedWith) -> [Remedy-NuxVomica]`) are managed as semantic triples of `{ source, relation, target }`. Suggestions are made automatically to the editor using a localized Jaccard clinical term correlation scanner.
