# KEP-3 Controlled Cohort Planning

**Status:** Available only after a current KEP-1 go decision

**Access:** Super administrator with `knowledge.expansion.manage`

**Assignment, approval, publication, indexing, embedding, migration, and
production RAG authority:** None

## Purpose

The planning gate records a transparent proposal for the next cohort without
starting editorial or technical release work. Each proposal is immutable and
is bound to the exact current KEP-1 go decision and deterministic 343-entity
inventory SHA-256.

## Cohort controls

- A cohort contains between 1 and 25 unique entities.
- KEP-1 flagship entities cannot be selected again.
- Withdrawn entities remain isolated in KEP-2 and cannot enter KEP-3.
- Any active or allowlisted RAG entity fails the gate closed.
- The proposal author must be different from the KEP-1 decision actor.
- Clinical importance, safety sensitivity, actual search demand, source
  availability, and graph value are each scored from 0–5 with private evidence.
- The server recomputes the weighted score using published weights of 30%, 25%,
  20%, 15%, and 10% respectively.
- Clinical author, independent clinical reviewer, evidence reviewer, and rights
  reviewer capacity must each cover the full proposed cohort.
- Selection methodology, residual risks, planning evidence, and risk-register
  references are mandatory.

Scores prioritize human review; they never approve selection automatically.
Capacity evidence is not an assignment and does not make any person eligible.

## Immutability and drift

The proposal ID is derived from canonical proposal content. Direct client access
to proposal and audit collections is denied. A changed inventory or superseded
KEP-1 decision makes an earlier proposal historical and requires a new proposal.

## Authority boundary

Recording a proposal proves only that a candidate cohort was planned. Separate
governed milestones are required for contributor eligibility, assignment,
source rights, acquisition, drafting, independent review, evaluation,
publication, indexing, embeddings, migration, and production RAG.
