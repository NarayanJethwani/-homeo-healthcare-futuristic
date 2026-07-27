# KEP-1 Assignment and Acquisition Control

**Status:** Available for controlled administrator use

**Access:** Super administrator with `knowledge.expansion.manage`

**Drafting, publication, and production RAG authority:** None

## Purpose

This workflow joins verified private onboarding records to the 32 KEP-1
editorial assignments and the 11 registered source dossiers. It creates a
durable, human-controlled bridge from roster readiness to source-rights
decisions without downloading, extracting, publishing, or embedding source
content.

## Assignment gate

1. An authorized administrator proposes one verified contributor for an
   entity-role slot.
2. The service rechecks identity verification, role eligibility, topic
   expertise, credential currency, and all governance attestations.
3. A different authorized administrator records the decision of a verified
   program owner and a private evidence reference.
4. Clinical authors and independent clinical reviewers must remain distinct.
5. Optimistic versions and append-only audit events prevent silent overwrites.

All 32 slots must be approved before any source-rights decision can be
recorded.

## Source-rights gate

- Only a contributor assigned and approved as a rights reviewer for a linked
  KEP-1 entity may record the decision.
- Citation-only sources can only be confirmed for citation or blocked.
- Controlled extraction can only be approved for sources already registered
  as public domain with extraction and derived-data permission.
- Every decision requires a private evidence reference.
- The browser receives record IDs and aggregate state, never names, identity
  hashes, credential evidence, rights evidence, or administrator identifiers.

## Authority boundary

A controlled-extraction decision adds a source to an administrative queue. It
does not execute acquisition, create evidence claims, authorize drafting,
approve clinical content, change public indexing, publish content, or activate
production RAG.
