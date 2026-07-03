# Related Rubric Engine

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 3 clinical rubric intelligence, safe and isolated

## Purpose

The Related Rubric Engine identifies rubrics that are clinically near one another without changing repertorization or remedy scoring.

It is implemented in:

`src/features/repertory/intelligence/clinicalRubricIntelligence/relatedRubrics.ts`

## Relationship Signals

The engine can use these signals:

| Signal | Meaning | Relative strength |
|---|---|---|
| `parent` | Candidate is the parent rubric. | High |
| `child` | Candidate is a child rubric. | High |
| `sibling` | Candidate shares the same parent. | Medium-high |
| `cross_reference` | Candidate is explicitly cross-referenced. | High |
| `shared_category` | Rubrics share clinical category. | Low-medium |
| `shared_clinical_system` | Rubrics share clinical system. | Low-medium |
| `shared_modality` | Rubrics share aggravation/amelioration/modality language. | Medium |
| `shared_miasm` | Rubrics share miasmatic marker. | Low-medium |
| `shared_condition` | Rubrics share modern clinical condition. | Medium |
| `same_path` | Rubrics share clinical text tokens. | Low-medium |
| `synonym` | Reserved relationship type for future synonym-only explanations. | Not yet primary |

## Output

Each related result returns:

- target rubric
- score
- reasons
- breadcrumb

The reasons are intentionally explicit so a future clinician-facing UI can explain why a rubric is suggested.

## Nearby Suggestions

Implemented in:

`src/features/repertory/intelligence/clinicalRubricIntelligence/navigation.ts`

Nearby suggestions return:

- parent
- children
- siblings
- explicit cross-references

Each suggestion includes:

- target rubric
- relationship
- breadcrumb
- short reason

## Hierarchy Synonym Expansion

Implemented in:

`expandRubricSynonymsUsingHierarchy`

The function expands a rubric's search/navigation language using:

- path labels
- sibling leaf labels
- Phase 2 synonym dictionary

Example:

For `Generalities → Food → Desire → Sweets`, hierarchy terms include `generalities`, `food`, `desire`, and `sweets`. The synonym dictionary can expand `desire` toward `craving`.

## Cross-Reference Support

Cross-references are read from:

- `metadata.crossReferenceIds`
- `metadata.relatedRubricIds`
- `relatedSymptoms`

They are not written to any database and do not modify source records.

## Current Limitations

- Relationship weights are heuristic and need clinical validation before UI use.
- The engine does not yet use large-scale statistical co-occurrence.
- The engine does not alter current search, scoring, or repertorization.
- No AI inference is used.

## Production Impact

None. The engine is isolated and offline-only.
