# Performance Report

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5 clinical validation and benchmarking

## Implementation

Performance benchmarking is implemented in:

`src/features/repertory/validation/clinicalValidation/performance.ts`

It wraps the isolated V2 repertorization benchmark helper and standardizes the requested Phase 5 rubric counts.

## Benchmark Sizes

The performance runner benchmarks:

- 10 rubrics
- 25 rubrics
- 50 rubrics
- 100 rubrics
- 500 rubrics
- 1000 rubrics

## Metrics

Each benchmark case reports:

- rubric count
- execution time
- memory delta
- ranking stability
- top remedy ID

## Current Execution Status

The performance framework was implemented but full execution through the project test runner could not complete because local project tooling is missing:

- `next`: missing
- `tsc`: missing
- `ts-node`: missing

`npm run build` result:

- failed immediately with `next: command not found`

`npm test` result:

- started `npx tsc ...`
- hung while invoking unavailable TypeScript tooling
- stopped manually to avoid leaving a background process

## Checks That Passed

- `git diff --check HEAD` passed.
- Worktree is clean.
- Isolation scan confirmed Phase 5 references are limited to isolated repertory validation files, isolated tests, and the isolated flag file.

## Next Step Once Tooling Is Available

Run:

- isolated validation framework test
- performance benchmark for all rubric counts
- regression comparison against stored baseline results

Record:

- average execution time
- p95 execution time if repeated
- memory delta
- top remedy stability

## Production Impact

None. The performance runner uses synthetic in-memory benchmark data and does not access production systems.
