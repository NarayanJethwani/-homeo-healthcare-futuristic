# Release Notes - v2.14.0

## Sprint 18-20: Classical Repertory Ingestion, Sharded Snapshot Delivery & Memory-Safe Production Runtime

This release introduces the V2.14.x-C sharded published corpus architecture, replacing monolithic 420MB loading patterns with memory-bounded lazy-loaded shards, atomic activation switches, and strict rights-and-acquisition registries.

---

## Key Features

1. **Granular Rights & Ingestion Registry**
   - Implemented in `src/features/repertory/data/repertorySourceRegistry.ts`.
   - Separates rights (`public-domain`, `copyrighted`), acquisition (`sample`, `complete-validated`), editorial (`approved`), and publication states (`active`, `not-published`, `blocked`).
   - Restricts snapshot compilation exclusively to eligible public-domain complete editions (Kent 1908 and Boericke 1927).
   - Isolates non-complete representative classical samples in `data/repertory/samples/` to prevent leakages.

2. **Deterministic Sharded Snapshot compiler**
   - Implemented in `src/features/repertory/import-export/snapshotPipeline.ts`.
   - Builds deterministic chapter files, 64 hash-prefix location map shards, and 64 lexical term shards.
   - Ensures stable key-sorted serialization with native C++ JSON serialization for lightning-fast, reproducible compilations under 10 seconds.
   - Generates deterministic checksum maps in `checksums.json` and cryptographic hashes to verify artifact integrity.

3. **Memory-Safe Bounded LRU Cache Repository**
   - Implemented in `src/features/repertory/repositories/PublishedCorpusRepository.ts`.
   - Restricts startup footprint to metadata-only loading (~200KB).
   - Features double-bounded LRU caches limiting chapter shards to 20 files (20MB capacity) and index shards to 100 files (30MB capacity).
   - Prevents cache stampedes via request-coalescing promises on simultaneous reads.

4. **Atomic Pointer Switcher & Rollbacks**
   - Features atomic, transaction-backed activation pointer switches.
   - Enforces immediate cache invalidation across active version changes.
   - Restores previous versions atomically via manifest references in case of deployment failures.

---

## Files Created

- `src/features/repertory/data/repertorySourceRegistry.ts`
- `src/features/repertory/import-export/snapshotPipeline.ts`
- `src/features/repertory/repositories/EditorialRepository.ts`
- `src/features/repertory/repositories/PublishedCorpusRepository.ts`
- `src/features/repertory/repositories/SourceCorpusRepository.ts`
- `tests/repertoryCorpusCompleteness.test.ts`
- `tests/repertorySharding.test.ts`
- `tests/repertoryCache.test.ts`
- `tests/repertorySnapshotActivation.test.ts`
- `tests/repertoryPerformanceSafety.test.ts`
- `docs/release-notes/RELEASE_v2_14_0.md`

## Files Modified

- `package.json`
- `src/features/repertory/clinicalWorkspace/clinicalRepertoryService.ts`
- `src/app/api/repertory/repertorize/route.ts`
- `tests/repertoryProduction.test.ts`
- `tests/adminWorkflow.test.ts`
- `docs/RELEASE_NOTES.md`
