# Governance Authentication & Role-Based Access Control (RBAC)

**Status**: Active — Phase 2.1 Architecture  
**Scope**: Governance Permission & Session Security  

---

## 1. Overview

Governance permissions require an authenticated server session (`AuthenticatedGovernanceSession`). Client-supplied `actorId` strings in HTTP payloads are never trusted without server session verification.

---

## 2. Governance Permission Tokens

- `knowledge.contributor.read`: View contributor profiles and registry entries.
- `knowledge.contributor.manage`: Register, update, or suspend contributors.
- `knowledge.revision.create`: Generate new governed content revisions.
- `knowledge.review.submit`: Submit clinical review evaluations.
- `knowledge.review.approve`: Execute clinical review approval transitions.
- `knowledge.evidence.edit`: Modify draft evidence profiles.
- `knowledge.evidence.approve`: Grant evidence profile approvals.
- `knowledge.workflow.transition`: Transition entity workflow state.
- `knowledge.withdraw`: Withdraw unsafe entities.
- `knowledge.emergency-containment`: Apply emergency containment overrides.
- `knowledge.ai-approval.create`: Authorize entity AI RAG ingestion.
- `knowledge.audit.read`: Inspect governance audit logs.

---

## 3. Role Mapping

| Governance Role | Granted Permission Tokens |
| :--- | :--- |
| **content-author** | `knowledge.contributor.read`, `knowledge.revision.create` |
| **editor** | `knowledge.contributor.read`, `knowledge.revision.create`, `knowledge.evidence.edit`, `knowledge.workflow.transition` |
| **clinical-reviewer** | `knowledge.contributor.read`, `knowledge.review.submit`, `knowledge.review.approve`, `knowledge.workflow.transition`, `knowledge.audit.read` |
| **evidence-reviewer** | `knowledge.contributor.read`, `knowledge.evidence.edit`, `knowledge.evidence.approve`, `knowledge.audit.read` |
| **governance-admin** | All governance permissions except emergency override bypass. |
| **emergency-admin** | `knowledge.contributor.read`, `knowledge.withdraw`, `knowledge.emergency-containment`, `knowledge.audit.read` |
| **auditor** | `knowledge.contributor.read`, `knowledge.audit.read` |
