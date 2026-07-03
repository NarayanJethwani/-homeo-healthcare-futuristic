# Regression Test Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5 clinical validation and benchmarking

## Goal

Ensure future V2 engine changes can be compared against previous validated benchmark results before any production integration.

## Implementation

Regression comparison is implemented in:

`src/features/repertory/validation/clinicalValidation/regression.ts`

## Comparison Inputs

The regression framework compares two benchmark runs:

- previous run
- current run

Each run contains:

- case results
- rankings
- remedy scores
- expectation outcomes
- explainability outcomes

## What Is Compared

For each case and remedy:

- previous rank
- current rank
- previous score
- current score
- rank changes
- score delta

## Pass/Fail Rule

A regression comparison passes only if:

- no remedy rank changes beyond expected output
- score deltas remain within the allowed threshold

Default allowed score delta:

`0.01`

## Recommended Workflow

1. Run the benchmark suite before changing the V2 engine.
2. Save the benchmark run JSON.
3. Make the isolated change.
4. Run the benchmark suite again.
5. Compare previous and current runs.
6. Review every rank or score difference.
7. Require clinical approval before accepting changed outcomes.

## Current Status

The isolated test creates:

- a baseline benchmark run
- a repeated benchmark run
- an altered run to prove regression detection works

No production data or production workflows are used.
