# Validation Framework

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5 clinical validation and benchmarking

## Safety Boundary

The validation framework is isolated under:

`work/homeo-healthcare-futuristic/src/features/repertory/validation/clinicalValidation/**`

It does not modify:

- production code
- production UI
- APIs
- database
- scoring algorithms
- repertorization algorithms
- AI modules
- patient or doctor workflows

Feature flags remain off by default.

## Purpose

The framework validates the isolated V2 Clinical Repertory Engine against known or synthetic repertory cases before any UI, API, AI, or production integration.

It checks:

- expected top remedies
- ranking tolerance
- scores
- confidence
- execution time
- explanation completeness
- regression stability
- performance at increasing rubric counts

## New Files

| File | Purpose | Production impact |
|---|---|---|
| `src/features/repertory/validation/clinicalValidation/types.ts` | Benchmark case, expected outcome, result, explainability, regression, and performance schemas. | None |
| `src/features/repertory/validation/clinicalValidation/caseFactory.ts` | Converts benchmark cases into isolated V2 sessions. | None |
| `src/features/repertory/validation/clinicalValidation/sampleBenchmarkCases.ts` | Starter in-memory validation cases. | None |
| `src/features/repertory/validation/clinicalValidation/explainabilityVerifier.ts` | Verifies why-selected, rubrics, grades, weights, and confidence are present. | None |
| `src/features/repertory/validation/clinicalValidation/benchmarkRunner.ts` | Runs benchmark cases against the V2 engine. | None |
| `src/features/repertory/validation/clinicalValidation/regression.ts` | Compares previous and current benchmark runs. | None |
| `src/features/repertory/validation/clinicalValidation/performance.ts` | Runs 10, 25, 50, 100, 500, and 1000 rubric performance benchmarks. | None |
| `src/features/repertory/validation/clinicalValidation/index.ts` | Isolated exports. | None |
| `src/features/repertory/validation/clinicalValidation/README.md` | Module documentation and safety rules. | None |
| `src/features/repertory/__tests__/clinicalValidationFramework.test.ts` | Isolated validation framework tests. | None |

Updated isolated files:

- `src/features/repertory/flags/repertoryFlags.ts`
- `src/features/repertory/__tests__/repertoryFlags.test.ts`

New disabled flag:

`REPERTORY_V2_USE_CLINICAL_VALIDATION_FRAMEWORK`

## Local Commits

- `8f60ab5` Add disabled clinical validation flag
- `7e8aeda` Add clinical validation benchmark schema
- `69ae65f` Add clinical validation benchmark runner
- `5dfb906` Add clinical validation regression tools
- `fa5854c` Add clinical validation docs and tests

## Integration Status

Not integrated. Future production integration requires separate approval.
