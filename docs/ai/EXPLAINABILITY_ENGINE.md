# Explainability Engine

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 4 isolated clinical repertorization engine

## Purpose

The explainability layer makes every remedy ranking transparent. It is designed so a future clinician-facing interface can show why a remedy ranked without making any prescription decision.

## Implementation

Implemented in:

- `src/features/repertory/repertorization/clinicalRepertorization/explainability.ts`
- `src/features/repertory/repertorization/clinicalRepertorization/remedyComparison.ts`

## Remedy Explanation

Each remedy explanation includes:

- remedy ID
- summary
- ranking reasons
- contributing rubrics
- missing rubrics

The ranking reasons include:

- number of matched rubrics
- total score
- confidence score
- strongest contribution
- missing rubric count

## Remedy Comparison

The comparison engine supports two or more remedies and returns:

- shared rubrics
- unique rubrics by remedy
- strongest rubrics by remedy
- weakest rubrics by remedy
- clinical difference statements

## Clinical Safety

The explainability engine is descriptive only.

It does not:

- prescribe
- change scoring
- change repertorization
- call AI
- write data
- alter production behavior

## Future Validation

Before UI integration, explanations should be reviewed by clinicians for:

- clarity
- clinical appropriateness
- avoiding overclaiming
- avoiding auto-prescribing language
