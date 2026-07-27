# KEP-1 Private Provenance Drafting Workbench

**Status:** Available for controlled administrator use

**Access:** Super administrator with `knowledge.expansion.manage`

**Clinical approval, evidence approval, graph approval, publication, public
indexing, and production RAG authority:** None

## Purpose

The step-seven workbench creates immutable private draft revisions from
independently verified KEP-1 source artifacts. It does not read arbitrary URLs
or paths and does not write to public content, graph, search, or embedding
stores.

## Required lineage

Every revision is bound to:

1. a registered KEP-1 flagship entity;
2. its approved and currently eligible clinical author;
3. a current controlled-extraction rights decision;
4. a verified immutable artifact and exact artifact SHA-256;
5. passage locators and server-computed passage hashes;
6. claim, evidence-profile, and graph-proposal passage references; and
7. a server-computed canonical revision SHA-256.

The revision record and audit event are insert-only. A mutable head contains
only the current revision pointer and is updated with optimistic concurrency.

## Clinical boundaries

- Traditional-use claims must be labelled `traditional-description`.
- Traditional literature cannot establish supported clinical proof for
  diagnosis, risk, treatment, safety, emergency, or laboratory interpretation.
- Unknown passage references, graph relationship types, and self-relationships
  fail closed.
- Claims and graph proposals always require independent clinical review.
- Evidence profiles remain `draft` with no reviewers.

## Authority boundary

Draft creation never changes existing editorial workflow state, approves a
claim or evidence profile, writes a graph edge, publishes content, changes
public indexing, creates an embedding, or activates production RAG.
