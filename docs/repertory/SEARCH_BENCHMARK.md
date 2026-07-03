# Search Benchmark

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 2 clinical search engine, safe and isolated

## Benchmark Utility Added

Added:

`work/homeo-healthcare-futuristic/src/features/repertory/search/clinicalSearch/benchmark.ts`

The benchmark helper measures:

- number of rubrics indexed
- number of queries tested
- index build time
- total search time
- average search time
- p95 search time
- queries per second

## Benchmark Design

The benchmark intentionally works only with in-memory `CanonicalRubric[]` data. It does not read from Firestore, APIs, UI, or production repositories.

Workflow:

1. Build a canonical search index.
2. Run a list of representative clinical queries.
3. Measure each query duration.
4. Return aggregate metrics.

## Example Query Set For Future Validation

Recommended validation queries:

- `panic palpitations`
- `anxety death fear`
- `gas abdomen`
- `flatulence bloating`
- `difficult stool`
- `constipaton`
- `diarrhoea`
- `diarrhea loose stool`
- `craving sweets`
- `desire cold drinks`
- `sleeplessness anxiety`
- `heartburn reflux`
- `chilly worse cold`
- `menses pain`

## Current Benchmark Status

The benchmark helper was added, but live benchmark execution was not completed because local project TypeScript tooling is unavailable in this workspace:

- `next`: missing
- `tsc`: missing
- `ts-node`: missing

`npm run build` result:

- Failed immediately with `next: command not found`.

`npm test` result:

- Started `npx tsc ...`
- Hung while trying to invoke unavailable `npx`/TypeScript tooling.
- Stopped manually to avoid leaving a background process running.

## Expected Next Benchmark Step

After dependencies are installed or CI is available:

1. Run the isolated clinical search test.
2. Run benchmark fixtures against representative exported repertory data.
3. Record baseline results before any production integration.

Suggested baseline thresholds before integration:

- index build under 500 ms for small clinical fixtures
- average query latency under 20 ms for small fixtures
- p95 query latency under 50 ms for small fixtures
- no result-order regression against approved clinical expectations

## Production Impact

None. Benchmark code is offline-only and not imported by production behavior.
