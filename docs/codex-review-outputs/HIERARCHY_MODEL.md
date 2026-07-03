# Hierarchy Model

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 3 clinical rubric intelligence, safe and isolated

## Goal

Represent rubrics as a clinical tree instead of flat text records.

Example:

`Generalities → Food → Desire → Sweets`

## Node Types

| Node kind | Meaning |
|---|---|
| `root` | Top-level rubric with no parent and one or more children. |
| `parent` | Rubric with children. |
| `child` | Supported as a relationship type for rubrics below a parent. |
| `sibling` | Leaf-like rubric that shares a parent with other rubrics. |
| `leaf` | Rubric with no children and no sibling context. |

## Path Parsing

Implemented in:

`src/features/repertory/intelligence/clinicalRubricIntelligence/pathParser.ts`

Supported separators:

- `>`
- `→`
- `/`
- `::`
- `|`

The parser:

- trims segments
- normalizes repeated spaces
- stores display labels
- stores normalized labels
- assigns depth

## Breadcrumb Generation

Breadcrumbs are produced from the best available canonical source:

1. `rubric.metadata.path`
2. `rubric.metadata.sourcePath`
3. composed fallback from:
   - `chapter`
   - `section`
   - `sourceCategory`
   - `subCategory` / `subcategory`
   - `title`
4. final fallback to `title`

Breadcrumb output:

- `rubricId`
- ordered path segments
- display path string

## Fast Lookup Maps

Implemented in:

`src/features/repertory/intelligence/clinicalRubricIntelligence/hierarchyIndex.ts`

The index builds:

| Lookup | Purpose |
|---|---|
| `nodesById` | Fast node lookup by rubric ID. |
| `rootIds` | Top-level navigation entry points. |
| `childIdsByParentId` | Fast parent-to-children lookup. |
| `idsByNormalizedPath` | Fast path lookup. |
| `idsByPathToken` | Finds rubrics by hierarchy path tokens. |
| `idsByCategory` | Finds rubrics by normalized category. |
| `idsByClinicalSystem` | Finds rubrics by normalized clinical system. |
| `idsByCrossReference` | Finds rubrics referencing another rubric. |

## Parent Resolution

Parent IDs are resolved in this order:

1. `parentRubricId`
2. `parentId`
3. inferred parent path when a parent path exists in the current index

This allows the model to support both explicit database-style hierarchy and classic repertory path-style hierarchy.

## Cross-References

Cross-reference IDs are read from:

- `metadata.crossReferenceIds`
- `metadata.relatedRubricIds`
- `relatedSymptoms`

This remains read-only and does not create database links.

## Files

- `types.ts`
- `pathParser.ts`
- `hierarchyIndex.ts`
- `navigation.ts`
- `clinicalRubricIntelligence.test.ts`

## Production Impact

None. The hierarchy model is in-memory and isolated.
