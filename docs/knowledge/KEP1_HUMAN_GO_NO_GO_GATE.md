# KEP-1 Human Go/No-Go Gate

**Status:** Available for controlled administrator use

**Access:** Super administrator with `knowledge.expansion.manage`

**Publication, public indexing, embedding, production migration, and production
RAG authority:** None

## Purpose

The step-ten gate records the accountable human program-owner decision against
the exact current passing KEP-1 offline evaluation. It closes the flagship pilot
as either `go` or `no-go`; it does not execute any downstream release action.

## Prerequisites

- The decision must reference the latest evaluation for the current exact
  eight-revision corpus manifest.
- That evaluation must have passed every quality and zero-tolerance safety
  threshold.
- The submitted corpus-manifest and query-set SHA-256 values must match the
  server record.
- The decision actor must be different from the actor who recorded the
  evaluation.
- The named program-owner record must be current, eligible, identity verified,
  and fully attested.

## Decision controls

A `go` decision requires:

- all KEP-1 acceptance gates reviewed;
- current clinical and evidence reviews confirmed;
- exact offline results reviewed;
- withdrawn exclusions and zero production RAG confirmed;
- residual risks, containment, and rollback reviewed;
- the limited authority boundary explicitly accepted;
- zero unresolved blockers;
- private decision evidence and meeting-minutes references;
- the exact high-friction confirmation phrase.

A `no-go` decision requires one or more explicit blockers and its own exact
confirmation phrase. Both outcomes require an accountable rationale.

## Immutability and invalidation

There is one insert-only decision per evaluation. A `no-go` requires a new
evaluation before reconsideration. A new current evaluation or a changed draft
corpus makes the earlier decision historical rather than current.

## Authority boundary

A current `go` marks KEP-1 complete and permits controlled KEP-3 expansion
planning. It cannot approve editorial workflow, publish content, change public
indexing, create embeddings, authorize production migration, alter the RAG
allowlist, or activate production retrieval.
