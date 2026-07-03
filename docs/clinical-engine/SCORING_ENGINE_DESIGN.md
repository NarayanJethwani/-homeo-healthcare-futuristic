# Scoring Engine Design

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 4 isolated clinical repertorization engine

## Design Goal

Support multiple repertorization scoring methods without modifying the engine core when new methods are added.

Implemented in:

`src/features/repertory/repertorization/clinicalRepertorization/scoringStrategies.ts`

## Strategy Interface

Each scoring strategy implements:

- `id`
- `label`
- `description`
- `score(input)`

The strategy receives:

- selected rubric
- rubric remedy
- session context
- remedy frequency map
- max possible grade

## Built-In Strategies

| Strategy | ID | Description |
|---|---|---|
| Kent style | `kent_style` | Balances rubric coverage and grade strength using `(grade * 2) + 1`. |
| Sum of grades | `sum_of_grades` | Adds remedy grades across selected rubrics. |
| Weighted grades | `weighted_grades` | Multiplies grade by rubric weight. |
| Weighted symptom importance | `weighted_symptom_importance` | Multiplies grade by rubric weight and symptom importance. |
| Frequency normalized | `frequency_normalized` | Reduces dominance from remedies appearing too often across selected rubrics. |

## Custom Strategy Support

Custom strategies can be passed into:

`repertorizeClinicalSession(session, customStrategies)`

The engine resolves the strategy by ID. This lets new repertorization methods be added later without editing the ranking engine.

## Exclusions

The session model supports exclusions for:

- remedy IDs
- rubric IDs

Excluded remedies and rubrics do not contribute to rankings.

Eliminating remedies marked by canonical data are also skipped.

## Safety

This scoring engine does not replace current production scoring and does not import current production scoring.
