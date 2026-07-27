# KEP-1 Independent Clinical and Evidence Review Gate

**Status:** Available for controlled administrator use

**Access:** Super administrator with `knowledge.expansion.manage`

**Editorial approval, publication, public indexing, and production RAG
authority:** None

## Purpose

The step-eight gate records immutable clinical and evidence decisions against
the exact SHA-256 of the current private KEP-1 draft revision. Review records
do not modify draft content or write to existing editorial, public graph,
search, sitemap, embedding, or RAG stores.

## Required controls

- The reviewed revision must be the current draft head.
- The caller must provide the exact server-recorded content SHA-256.
- The reviewer must hold the approved KEP-1 assignment for the review type.
- Reviewer identity, credential, attestations, and eligibility must be current.
- The author cannot review their own work.
- Clinical and evidence reviewers must be different people.
- Independence must be explicitly declared.
- Approvals cannot contain unresolved declared conflicts.
- Claim coverage must exactly match the revision claim set.
- Clinical review must also cover every graph proposal.
- Approval requires every review checklist control.
- Material clinical claims with insufficient or unsupported evidence block
  evidence approval.

## Revision invalidation

Review IDs are deterministic per revision and review type and are insert-only.
A new draft revision becomes the current head, so decisions against prior
revisions remain auditable but no longer satisfy current readiness.

## Readiness boundary

`review-complete` requires approved clinical and evidence decisions from two
distinct reviewers against the same current revision hash. This is an internal
readiness projection only. It never changes editorial workflow state, approves
publication, enables public indexing, creates embeddings, or activates RAG.
