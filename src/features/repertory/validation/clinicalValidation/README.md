# Clinical Validation Framework

Phase 5 isolated validation and benchmarking framework for Dr. Jethwani's Clinical Repertory V2 engine.

This module validates the isolated V2 repertorization engine. It does not modify scoring, repertorization, UI, APIs, database, AI, or production behavior.

## Files

- `types.ts` defines benchmark case, expected outcome, run result, explainability verification, regression, and performance schemas.
- `caseFactory.ts` converts benchmark cases into isolated V2 repertorization sessions.
- `sampleBenchmarkCases.ts` provides starter in-memory clinical benchmark cases.
- `explainabilityVerifier.ts` checks whether each remedy ranking explains why it ranked, contributing rubrics, grades, weighting, and confidence.
- `benchmarkRunner.ts` runs benchmark cases against the V2 engine and records rankings, scores, confidence, timing, and explanations.
- `regression.ts` compares current benchmark results against previous benchmark results.
- `performance.ts` runs the requested performance sizes: 10, 25, 50, 100, 500, and 1000 rubrics.
- `index.ts` exports the isolated validation module.

## Safety

- No production imports.
- No UI wiring.
- No API changes.
- No database access.
- No AI reasoning.
- No scoring algorithm changes.
- No repertorization algorithm changes.
- Feature flags remain off by default.
