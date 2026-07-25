# Claim-Level Citation Mapping & Traditional-Use Labeling

**Status**: Active — Phase 2 Governance Architecture  
**Scope**: Clinical Knowledge Platform  

---

## 1. Overview

Resolving reference IDs to a citation database does not establish claim-level citation validity. Specific material clinical claims (efficacy, safety, diagnosis, emergency, risk) must be individually mapped to supported citation sources.

---

## 2. Clinical Claim Schema

```ts
interface ClinicalClaim {
  id: string;
  entityId: string;
  revisionId: string;
  text: string;
  claimType: ClaimType;
  citationIds: string[];
  evidenceStatus: EvidenceStatus;
  requiresClinicalReview: boolean;
}
```

---

## 3. Claim Types & Evidence Boundaries

### Material Clinical Claims
- Types: `treatment`, `safety`, `emergency`, `diagnosis`, `risk`, `laboratory-interpretation`.
- Requirement: Must have non-empty `citationIds`, 100% resolving to valid citation database entries, and carry `evidenceStatus: 'supported'` or `'partially-supported'`.
- Failure: Any material claim with `insufficient-evidence` or `unsupported` status blocks clinical publication.

### Traditional Homeopathic Descriptions
- Type: `traditional-use`.
- Requirement: Must be explicitly labelled with `evidenceStatus: 'traditional-description'`.
- Constraint: Traditional descriptions must **never** be represented as established clinical efficacy or Level-A/B clinical evidence.
