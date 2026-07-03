# Benchmark Schema

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5 clinical validation and benchmarking

## Implementation

Schema definitions are implemented in:

`src/features/repertory/validation/clinicalValidation/types.ts`

## Case Format

Each benchmark case includes:

- case ID
- case name
- selected rubrics
- rubric weights
- symptom importance
- remedies and grades
- expected top remedies
- expected ranking tolerance
- clinical notes
- references
- strategy ID
- exclusions
- metadata

## Core TypeScript Shape

```ts
interface ClinicalBenchmarkCase {
  id: string;
  caseName: string;
  selectedRubrics: BenchmarkCaseRubric[];
  rubricWeights?: Record<string, number>;
  expectedTopRemedies: ExpectedTopRemedy[];
  expectedRankingTolerance: number;
  clinicalNotes: string;
  references: BenchmarkReference[];
  strategyId?: ClinicalScoringStrategyId;
  exclusions?: {
    remedyIds?: string[];
    rubricIds?: string[];
    reason?: string;
  };
  metadata?: Record<string, unknown>;
}
```

## Selected Rubric Shape

Each selected rubric includes:

- rubric ID
- rubric title
- rubric weight
- symptom importance
- remedy list
- optional metadata

## Expected Top Remedy Shape

Expected outcomes include:

- remedy ID
- optional minimum rank
- maximum acceptable rank
- optional minimum score

This supports strict expectations like rank 1 only, and tolerant expectations like rank 1-3.

## References

References can include:

- source name
- note
- URL

These are metadata only and do not trigger network access.

## Starter Cases

Starter in-memory cases are implemented in:

`src/features/repertory/validation/clinicalValidation/sampleBenchmarkCases.ts`

They are synthetic validation fixtures, not prescribing guidance.
