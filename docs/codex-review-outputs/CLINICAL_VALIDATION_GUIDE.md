# Clinical Validation Guide

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5 clinical validation and benchmarking

## Purpose

This guide describes how to validate the isolated V2 Clinical Repertory Engine before any UI, API, AI, or production integration.

## What To Validate

For each benchmark case, review:

- selected rubrics
- rubric weights
- symptom importance
- remedy grades
- exclusions
- expected top remedies
- ranking tolerance
- clinical notes
- references
- remedy explanations
- missing rubrics
- confidence score

## Expected Outcome Review

A case should pass only when:

- expected remedies appear within the allowed rank range
- score thresholds are satisfied when specified
- every ranked remedy has an explanation
- every explanation includes contributing rubrics
- every contribution includes grade and weighting
- confidence is present
- results are repeatable

## Clinical Safety Language

Benchmark results are validation data only.

They should not be treated as:

- prescriptions
- automatic remedy selections
- medical advice
- replacement for clinician review

## Suggested Workflow

1. Define a benchmark case from a known repertory scenario.
2. Add selected rubrics and grades.
3. Define expected top remedies and tolerance.
4. Add clinical notes and references.
5. Run the validation suite.
6. Review rankings and explanations.
7. Store the run as a baseline.
8. Re-run after any engine change.
9. Compare against baseline.
10. Clinically review every difference before approval.

## Files To Use

- `types.ts` for schema
- `sampleBenchmarkCases.ts` for examples
- `benchmarkRunner.ts` for running cases
- `explainabilityVerifier.ts` for explanation completeness
- `regression.ts` for comparing runs
- `performance.ts` for large-session benchmarks

## Integration Rule

Do not integrate into production until:

- benchmark suite passes
- regression suite is stable
- performance is acceptable
- explanations are clinically reviewed
- feature flag remains off until final approval
- a separate production integration plan is approved
