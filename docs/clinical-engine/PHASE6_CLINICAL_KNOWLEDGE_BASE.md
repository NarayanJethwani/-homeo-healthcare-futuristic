# Phase 6: Clinical Knowledge Base & Evidence Layer

This document details the architecture of the source-aware Clinical Knowledge Base, provenance tracing models, internal editorial review workflow statuses, and Clinical Knowledge Graph integrations.

## 1. Modular Knowledge Architecture
The clinical knowledge base is organized under `src/features/repertory/knowledge/`:
- **[knowledgeModel.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/features/repertory/knowledge/knowledgeModel.ts)**: Contains type schemas for `EvidenceItem`, `ClinicalPearl`, and `RemedyKnowledgeRecord`.
- **[evidenceRegistry.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/features/repertory/knowledge/evidenceRegistry.ts)**: Acts as an in-memory database registry of Dr. Jethwani's clinical pearls, keynotes, and cautions for core polychrests.

## 2. Evidence & Provenance Model
Every recommendation retains a verifiable origin trace labeled as:
- **source-backed**: Directly cited from authoritative literature.
- **Dr. Jethwani clinical note**: Clinical pearls verified in practice.
- **editorial**: Standard clinical instructions and guidance.
- **graph-derived**: Dynamically inferred from Clinical Knowledge Graph traversals.
- **AI-assisted**: Derived from context analysis patterns.

## 3. Internal Editorial Workflow
The status models classify material readiness under the following progression:
1. `Draft` - Preliminary notes and suggestions.
2. `Reviewed` - Approved by the editorial board.
3. `Verified` - Final Dr. Jethwani approved guidelines.
4. `Deprecated` - Retired records.

## 4. Performance & Graph Integration
- The service incorporates a lookup memoization cache in `knowledgeService.ts` to deliver sub-millisecond retrieval.
- Relationships (e.g. `treatsPathology`, `isComplementaryTo`, `antidotesRemedy`) are dynamically registered inside the in-memory graph at startup.
