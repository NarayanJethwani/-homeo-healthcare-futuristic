# Rubric Intelligence Design

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 3 clinical rubric intelligence, safe and isolated

## Safety Boundary

The Clinical Rubric Intelligence layer is isolated under:

`work/homeo-healthcare-futuristic/src/features/repertory/intelligence/clinicalRubricIntelligence/**`

It is not wired into:

- production UI
- admin dashboard
- APIs
- database
- scoring
- repertorization
- AI intake
- patient/doctor workflows
- public site

Feature flags remain off by default.

## Purpose

The Phase 2 search engine treats rubrics as searchable clinical documents. Phase 3 adds a relationship layer so future workflows can understand:

- roots
- parents
- children
- siblings
- leaves
- breadcrumbs
- nearby rubrics
- cross-references
- hierarchy-aware synonyms
- clinical navigation

This does not replace current search, scoring, or repertorization.

## New Files

| File | Purpose | Production impact |
|---|---|---|
| `src/features/repertory/intelligence/clinicalRubricIntelligence/types.ts` | Defines hierarchy, breadcrumb, relationship, related-rubric, nearby-suggestion, and navigation types. | None |
| `src/features/repertory/intelligence/clinicalRubricIntelligence/pathParser.ts` | Parses rubric paths and builds breadcrumbs such as `Generalities → Food → Desire → Sweets`. | None |
| `src/features/repertory/intelligence/clinicalRubricIntelligence/hierarchyIndex.ts` | Builds fast in-memory hierarchy lookups by ID, parent, path, path token, category, clinical system, and cross-reference. | None |
| `src/features/repertory/intelligence/clinicalRubricIntelligence/relatedRubrics.ts` | Finds clinically related rubrics using hierarchy, cross-references, shared category/system, shared modalities, miasms, conditions, and text overlap. | None |
| `src/features/repertory/intelligence/clinicalRubricIntelligence/navigation.ts` | Provides breadcrumb, parent, child, sibling, root, nearby-rubric, and path lookup utilities. | None |
| `src/features/repertory/intelligence/clinicalRubricIntelligence/index.ts` | Barrel export for isolated intelligence utilities. | None |
| `src/features/repertory/intelligence/clinicalRubricIntelligence/README.md` | Documents the isolated module and safety rules. | None |
| `src/features/repertory/__tests__/clinicalRubricIntelligence.test.ts` | Isolated tests for hierarchy, breadcrumbs, related rubrics, nearby suggestions, cross-references, and hierarchy synonyms. | None |

Updated isolated files:

| File | Purpose | Production impact |
|---|---|---|
| `src/features/repertory/flags/repertoryFlags.ts` | Adds disabled-by-default `useRubricIntelligence`. | None |
| `src/features/repertory/__tests__/repertoryFlags.test.ts` | Confirms the new flag defaults to false. | None |

## Main Concepts

### Hierarchy

Each canonical rubric can become a hierarchy node with:

- `parentId`
- `childIds`
- `siblingIds`
- `depth`
- `kind`
- `path`
- `breadcrumb`
- `crossReferenceIds`

### Breadcrumbs

Breadcrumbs are generated from canonical metadata or source fields:

`Generalities → Food → Desire → Sweets`

### Related Rubrics

Relatedness can be inferred through:

- explicit cross-references
- parent/child/sibling relationships
- shared clinical category
- shared clinical system
- shared modality
- shared miasm
- shared clinical condition
- shared clinical text tokens

### Navigation

Navigation utilities support:

- roots
- parent node
- child nodes
- sibling nodes
- nearby suggestions
- path lookup

## Feature Flag

New flag:

`REPERTORY_V2_USE_RUBRIC_INTELLIGENCE`

Current status:

- default: off
- not consumed by production
- not wired into UI/API/database/scoring/repertorization

## Local Commits

- `453cbb3` Add disabled repertory rubric intelligence flag
- `46a3b94` Add repertory rubric hierarchy index
- `8b587f9` Add repertory related rubric intelligence
- `753c2ea` Add rubric intelligence documentation and tests

## Integration Status

Not integrated. Any future production integration should require separate approval and clinical validation.
