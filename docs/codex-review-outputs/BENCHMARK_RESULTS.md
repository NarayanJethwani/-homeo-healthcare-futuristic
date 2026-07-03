# Benchmark Results

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 4 isolated clinical repertorization engine

## Benchmark Helper

Implemented in:

`src/features/repertory/repertorization/clinicalRepertorization/benchmark.ts`

## Benchmark Sizes

The benchmark helper supports the requested session sizes:

- 10 rubrics
- 50 rubrics
- 100 rubrics
- 500 rubrics
- 1000 rubrics

## Metrics

For each rubric count, it measures:

- execution time
- memory delta when runtime memory usage is available
- ranking stability
- top remedy ID

## Ranking Stability

Ranking stability is checked by running the same isolated session twice and confirming the top remedy remains the same.

## Current Execution Status

The benchmark helper was implemented but could not be executed through the project test runner because local project tooling is missing:

- `next`: missing
- `tsc`: missing
- `ts-node`: missing

`npm run build` result:

- failed immediately with `next: command not found`

`npm test` result:

- started `npx tsc ...`
- hung while invoking unavailable TypeScript tooling
- stopped manually to avoid leaving a running process

## Recommended Next Benchmark Step

Once dependencies are installed or CI is available:

1. Run the isolated Phase 4 test.
2. Run `benchmarkClinicalRepertorization()` for all five rubric sizes.
3. Record timing/memory baselines.
4. Compare ranking stability across all built-in strategies.

## Production Impact

None. The benchmark uses synthetic in-memory rubrics only and does not access production data.
