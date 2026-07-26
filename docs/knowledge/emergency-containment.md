# Emergency Containment Architecture & Boundary Rules

**Status**: Active — Phase 2.1 Architecture  
**Scope**: Clinical Safety Emergency Containment  

---

## 1. Overview

Emergency containment permits authorized administrators to quickly suppress or withdraw unsafe content without requiring normal workflow progression.

---

## 2. Permitted Emergency Actions

- `withdrawn`: Transition entity to withdrawn state.
- `noindex`: Suppress search indexing (`<meta name="robots" content="noindex, follow">`).
- `body-suppression`: Conceal clinical body sections while leaving neutral under-review notice.
- `warning-display`: Display clinical safety alert banner.

---

## 3. Prohibited Emergency Effects

Emergency overrides **CANNOT**:
1. Grant `eligibleByClinicalGovernance: true`.
2. Grant `eligibleForAiIngestion: true`.
3. Set `clinicalReviewStatus` to `'approved'`.
4. Approve evidence profiles.
5. Authorize AI RAG retrieval.

---

## 4. Expiry & Audit Requirements

- Requires an ISO `emergencyExpiry` timestamp in the future. Expired emergency overrides return `emergency-override-expired-or-invalid`.
- Appends an audit event (`EMERGENCY_WORKFLOW_OVERRIDE`) to the audit log.
