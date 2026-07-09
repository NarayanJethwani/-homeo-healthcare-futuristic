# ADR-003: Unified Single-Pane Workspace

## Status
Accepted

## Date
2026-07-03

## Context
Initial implementations had separate routing flows and interfaces for different user classes (practitioners, patients, researchers). This created duplicate view layers, increased bundle sizes, and made layout alignment extremely complex.

## Decision
We consolidate the clinician/practitioner dashboard into a unified, single-pane clinical workspace dashboard. All tools (symptom log, treatment plan, repertorization scores, and knowledge graph viewer) render as responsive panels on a single page, dynamically synchronized using URL parameter states (e.g. `selectedPatientId`, `activeTab`).

## Consequences
- Simplifies routing logic and ensures consistent state synchronization.
- Promotes layout density, optimizing workspace proportions on desktop devices.
- Requires performance optimizations (such as desktop scroll regions) to prevent page-level lag during high-density rendering.
