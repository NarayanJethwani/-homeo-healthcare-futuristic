# Ranking Engine

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 4 isolated clinical repertorization engine

## Implementation

Implemented in:

`src/features/repertory/repertorization/clinicalRepertorization/rankingEngine.ts`

## Inputs

The ranking engine receives:

- isolated repertorization session
- selected canonical rubrics
- rubric weights
- symptom importance values
- selected scoring strategy
- exclusions
- optional custom strategies

## Outputs

Each remedy ranking includes:

- `remedyId`
- `remedyName`
- `totalScore`
- `weightedScore`
- `normalizedScore`
- `confidenceScore`
- `matchedRubricCount`
- `missingRubricIds`
- contribution breakdowns
- plain-language ranking reasons

## Contribution Breakdown

Every rubric contribution includes:

- rubric ID
- rubric title
- remedy ID
- remedy name
- grade
- source grade
- rubric weight
- symptom importance
- grade contribution
- weight contribution
- strategy contribution
- percentage contribution

## Normalized Score

The engine calculates normalized score from weighted contribution compared with the maximum possible weighted score across selected rubrics.

## Confidence Score

The confidence score combines:

- rubric coverage
- normalized score

This is an isolated experimental confidence value and does not affect production scoring.

## Ranking Order

Rankings sort by:

1. descending total score
2. remedy ID for deterministic tie-breaking

## Production Impact

None. The ranking engine is not wired into current repertorization.
