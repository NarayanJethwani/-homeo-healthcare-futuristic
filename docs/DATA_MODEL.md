# Data Model Reference

This document maps the data models, Firestore collections, and TypeScript schemas used across the platform.

## 1. Firestore Collections Overview

```
[knowledge]
  ├── remedies (e.g. R001)
  ├── diseases (e.g. D001)
  ├── symptoms (e.g. S001)
  └── lab-tests (e.g. L001)

[patients]
  └── [patientId] 
        ├── profile
        ├── cases
        └── sessions

[invoices] (billing records)

[repertory_sessions] (repertorization scores & selections)
```

---

## 2. Main TypeScript Schema Interfaces

### KnowledgeEntity Schema
This interface represents any document inside the `knowledge` collection:

```typescript
export interface KnowledgeEntity {
  id: string; // Unique ID (e.g., "R0001", "D0001")
  type: "remedy" | "disease" | "symptom" | "lab-test";
  title: string;
  slug: string;
  status: "draft" | "ai-assisted" | "medical-review" | "clinical-validation" | "published" | "archived";
  audience: "patient" | "student" | "practitioner";
  license: string;
  references: string[]; // Linked Citation IDs
  
  // Dynamic features
  clinicalPearl?: string;
  quickFacts?: Record<string, string>;
  
  // AI Readiness Summary Metadata
  aiReadiness?: {
    retrievalSummary: string;
    clinicalSummary: string;
    patientSummary: string;
    studentSummary: string;
    keywords: string[];
    semanticKeywords: string[];
    icd?: string;
    snomed?: string;
    mesh?: string;
    bodySystem: string;
    urgency: "routine" | "monitor" | "urgent" | "emergency";
  };
}
```

### Patient Model
Represents patient profiles stored inside the `/patients` collection:

```typescript
export interface PatientProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  dietaryRestrictions?: string[];
  miasmaticBackground?: "psora" | "sycosis" | "syphilis" | "tubercular" | "mixed";
  createdDate: string;
  modifiedDate: string;
}
```

### Invoice Model
Represents financial billing documents under `/invoices`:

```typescript
export interface Invoice {
  id: string;
  patientId: string;
  practitionerId: string;
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
}
```

### Treatment Planner & Case Model
Represents clinical cases associated with a patient:

```typescript
export interface CaseRecord {
  id: string;
  patientId: string;
  chiefComplaint: string;
  onsetDetails: string;
  modalities: {
    aggravations: string[];
    ameliorations: string[];
  };
  selectedSymptoms: Array<{
    rubricId: string;
    severity: 1 | 2 | 3;
    frequency: "rare" | "intermittent" | "constant";
  }>;
  prescriptions: Array<{
    remedyId: string;
    potency: string; // e.g. "30C", "200C"
    dosage: string;
    frequency: string;
  }>;
  status: "active" | "resolved" | "monitoring";
  createdDate: string;
}
```
