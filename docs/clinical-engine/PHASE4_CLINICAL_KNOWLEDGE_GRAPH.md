# Phase 4: Clinical Knowledge Graph & Explainable Intelligence

This document details the architecture, data models, and inference mechanisms for the Phase 4 Clinical Knowledge Graph integration inside the Jethwani Clinical Repertory system.

## 1. Node-Relationship Graph Design
The knowledge graph uses an in-memory triple store representation (`[Subject] -> [Predicate] -> [Object]`) configured inside `repertoryGraph.ts`. It maps relationships between:
- **Rubrics**: Hierarchical structures (parent-child), modally matching categories, and semantic synonyms.
- **Remedies**: Polychrest and affinity linkages.
- **Miasms & Kingdom Affinities**: Deep systemic classification mappings.

### Core Predicates
- `relatesTo`: Weighted semantic similarity between two rubrics.
- `parentOf` / `childOf`: Structural hierarchical representation.
- `hasAffinity`: Systemic classification to kingdoms (Plant, Mineral, Animal) or miasmatic groups (Psora, Sycosis, Syphilis).

## 2. In-Memory Graph Indexing & Traversals
To achieve sub-millisecond lookup speeds, all nodes and adjacency matrices are indexed during initialization and cached in active memory:
- **BFS Traversals**: Traverse paths of depth $\le 3$ to find semantic neighbors.
- **Shortest Path Router**: Traces exactly how a remedy is linked to a patient's symptoms through the graph.

## 3. Explanatory Intelligence
- **Rubric Score Contribution Table**: For every remedy, the scoring engine outputs a precise breakdown of the points contributed by each matched rubric.
- **Contradiction Audits**: Flag thermal mismatches (e.g. chilly remedy mapped to warm patient) and modality anomalies (e.g. motion aggravated symptom combined with motion ameliorating remedy).
- **Clinical Pattern Recognition**: Scans active symptoms for polychrest pattern indicators (Arsenicum, Nux Vomica, Lycopodium, Sulphur, Pulsatilla) and prompts the clinician to confirm missing diagnostic rubrics.
