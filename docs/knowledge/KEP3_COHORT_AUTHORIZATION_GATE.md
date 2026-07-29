# KEP-3 Cohort Authorization Gate

**Status:** Available after a current KEP-3 planning proposal

**Access:** Super administrator with `knowledge.expansion.manage`

**Assignment, editorial approval, publication, indexing, embedding, migration,
and production RAG authority:** None

## Purpose

The authorization gate prevents a cohort proposal from authorizing itself. It
records one immutable human approve/reject decision against the exact latest
proposal that still matches the current KEP-1 go decision and deterministic
inventory.

## Prerequisites

- The proposal must be the latest current KEP-3 proposal.
- Its complete stored record must match the submitted SHA-256.
- Its cohort, role-capacity, and zero-downstream-authority invariants must hold.
- The authorizer must be different from the proposal author.
- The named program owner must remain eligible, identity verified, and fully
  attested.

## Decision controls

Approval requires:

- selection evidence reviewed;
- all four role-capacity proofs reviewed;
- risks and the risk register reviewed;
- withdrawn and KEP-1 flagship exclusions confirmed;
- zero production RAG confirmed;
- no automatic assignment confirmed;
- the limited authority boundary accepted;
- zero unresolved blockers;
- private authorization evidence and meeting-minutes references;
- the exact approval confirmation phrase.

Rejection requires explicit blockers and its own exact confirmation phrase.
Both decisions require an accountable rationale.

## Immutability and invalidation

There is one insert-only authorization per proposal. A rejected proposal must be
superseded by a new proposal. A newer proposal, changed inventory, or invalidated
KEP-1 go makes an earlier authorization historical.

## Authority boundary

Approval grants controlled cohort preparation only. It cannot assign people,
approve editorial or clinical work, publish content, change indexing, create
embeddings, authorize migration, change the RAG allowlist, or activate retrieval.
