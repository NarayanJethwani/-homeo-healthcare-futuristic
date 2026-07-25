# Editorial Workflow State Machine & Emergency Override Rules

**Status**: Active — Phase 2 Governance Architecture  
**Scope**: Clinical Knowledge Platform  

---

## 1. Overview

The Editorial Workflow State Machine governs all state transitions for knowledge entities. Skipped stages are rejected by default.

---

## 2. Permitted Transitions

```text
draft -> editorial-review -> clinical-review -> evidence-review -> approved -> published -> withdrawn / archived
```

Specific branch transitions:
- `clinical-review` -> `changes-requested` -> `draft`
- `evidence-review` -> `changes-requested` -> `draft`
- `published` -> `withdrawn`
- `published` -> `editorial-review`

---

## 3. Emergency Override Rules

If an entity must skip workflow stages under urgent clinical circumstances:

1. **Authorized Actor**: Must provide valid `actorId`.
2. **Detailed Reason**: `emergencyReason` must contain at least 10 characters explaining the clinical necessity.
3. **Expiry Requirement**: Must specify an `emergencyExpiry` ISO timestamp.
4. **Audit Logging**: An immutable audit event (`EMERGENCY_WORKFLOW_OVERRIDE`) is automatically appended to `GovernanceAuditEvent`.
