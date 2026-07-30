# Authority-Led Knowledge Expansion Workflow

**Policy version:** 1.0

**Effective scope:** new knowledge expansion packages

**Accountable final authority:** authenticated program owner

**Production publication and RAG posture:** separately controlled

## Purpose

The knowledge platform uses a risk-tiered operating model instead of requiring
an eleven-person permanent roster and 32 manual assignments before useful work
can begin.

AI performs the repeatable preparation work:

- source discovery and registration support;
- citation mapping and completeness checks;
- medical-safety signal detection;
- evidence summaries and draft corrections;
- provenance, revision hashing, and audit-packet preparation.

AI never grants clinical approval, publication authority, or RAG authority.
The authenticated program owner remains the accountable final decision-maker.

## Decision lanes

| Lane | Trigger | Required people | Result |
| --- | --- | --- | --- |
| Background monitoring | Existing reviewed revision is unchanged | None | AI continues citation and safety monitoring |
| Owner final authorization | New or changed, citation-complete, low-risk revision | Program owner | Owner records the final revision-bound decision |
| Independent check + final authorization | Missing or conflicting citation, diagnostic certainty, or another elevated clinical signal | One independent clinical checker, then program owner | Owner records the final decision after the check |
| Controlled safety release | Critical claim, active withdrawal, treatment-replacement risk, or prohibited cure language | Independent clinical checker and program owner | Safety decision is recorded; publication and RAG remain behind separate controlled release |

## Simplified operating rules

1. One authenticated program owner is the standing accountable authority.
2. A permanent eleven-seat roster is not a prerequisite for ordinary expansion.
3. Specialists are engaged on demand only for elevated or critical items.
4. Source-rights ambiguity is routed to a rights specialist before extraction;
   citation-only use may continue when permitted.
5. Every decision is bound to the exact current revision hash and becomes stale
   after a material content edit.
6. Critical safety restoration always retains a separate canary-first release,
   observation, and rollback boundary.
7. Publication and RAG activation remain distinct authorizations.

## Final authorization packet

The program owner should receive one concise packet containing:

- entity title, type, and immutable revision identifier;
- detected medical and citation flags;
- linked source citations;
- AI-prepared evidence summary;
- independent clinical check when the risk lane requires it;
- recommended action and residual risks;
- `Approve`, `Request correction`, or `Keep blocked` controls.

The owner should not be asked to create artificial staffing records or repeat
attestations already proven by authenticated identity, immutable provenance, or
automated checks.

## Boundary

This workflow is an application-layer governance extension. It does not modify
frozen clinical-domain entities or silently reinterpret earlier KEP-1 audit
records. Existing historical records remain valid evidence of the policy that
was in force when they were created.
