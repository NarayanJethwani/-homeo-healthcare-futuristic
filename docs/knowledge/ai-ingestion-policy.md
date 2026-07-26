# AI Ingestion Policy & RAG Governance

**Status**: Active — Phase 2 Governance Architecture  
**Scope**: Clinical Knowledge Platform AI Grounding  

---

## 1. Overview

An entity being suitable for public web indexing or direct URL view does NOT grant eligibility for AI retrieval-augmented generation (RAG) grounding.

AI grounding requires an explicit `AiIngestionApproval` record matching the active content revision hash.

---

## 2. AI Ingestion Approval Schema

```ts
interface AiIngestionApproval {
  entityId: string;
  revisionId: string;
  approvedBy: ContributorId;
  approvedAt: string;
  evidenceProfileId: string;
  policyCheckVersion: string;
  citationCheckPassed: boolean;
  prohibitedClaimCheckPassed: boolean;
  expiresAt?: string;
}
```

---

## 3. Strict AI Corpus Containment Rules

1. **Empty Allowlist Default**: `RAG_INGESTION_ALLOWLIST` defaults to an empty set (`new Set([])`).
2. **Current Revision Match**: `approval.revisionId` must equal `currentContentHash`.
3. **Full Governance Pass**: Entity must pass `eligibleByClinicalGovernance` (independent review, approved evidence profile, valid claim citations, no prohibited claims).
4. **Active Corpus Verification**: Real retrieval functions (`getEligibleAIArticlesForRAG()`) must enforce these checks, keeping active RAG corpus size at **0** during Phase 2.
