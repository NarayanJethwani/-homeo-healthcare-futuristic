# Governed Ollama Corpus Cache Activation Runbook

## Current state

The Sprint 28H cache is infrastructure only. It is disabled by default, bypassed in CI and serverless/Vercel environments, and the production eligibility projection is empty. Do not enable the cache until every prerequisite below is satisfied.

## Activation prerequisites

1. Approve a source-version eligibility read model containing only non-PHI, published corpus entities.
2. Record exact entity ID, entity type, published version, provenance, rights state, review freshness, and approval evidence for every eligible entry.
3. Verify that the eligibility projection is immutable at runtime and cannot be overridden outside tests.
4. Select a dedicated local cache directory that is not synchronized, web-served, shared with patient data, or mounted in a serverless environment.
5. Run focused cache, queue integration, governed unit, release, and evidence-lineage gates on the exact activation commit.
6. Capture baseline provider latency, cache hit/miss outcomes, disk growth, generation failures, and lock-recovery events without recording source text or entity IDs.

## Shadow activation

Use a local non-production worker with an explicitly approved corpus subset.

```text
ENABLE_LOCAL_OLLAMA_EMBED_CACHE=true
OLLAMA_CACHE_DIR=<dedicated local path>
OLLAMA_CORPUS_SNAPSHOT_VERSION=<approved snapshot version>
```

The worker must remain outside Vercel/serverless execution. Validate generated entries against the manifest, confirm quota and TTL behavior, exercise restart/crash recovery, and compare vectors with uncached Ollama generation before expanding the approved subset.

## Stop conditions

Disable activation immediately if any of the following occurs:

- an entity is missing an exact approved source-version record;
- source rights, publication, or review status is expired or withdrawn;
- manifest, checksum, dimensions, model digest, normalization, TTL, path, or file-size validation fails;
- lock ownership is lost or recovery leaves a marker, tombstone, temporary file, or uncommitted entry;
- telemetry contains caller text, entity identifiers, paths, credentials, or other sensitive values;
- disk usage exceeds the governed quota or provider/cache results diverge unexpectedly.

## Rollback

1. Set `ENABLE_LOCAL_OLLAMA_EMBED_CACHE=false` and restart the local worker.
2. Confirm subsequent embedding requests use the uncached governed provider path.
3. Preserve only sanitized aggregate diagnostics needed for investigation.
4. Quarantine or delete the dedicated cache directory according to the incident decision; never reuse entries after an integrity or eligibility failure.
5. Record the rollback commit, snapshot version, reason code, and verification evidence without including corpus text or local filesystem paths.

Production or wider corpus activation requires a separate governed pull request and clinical/source approval. This runbook does not authorize activation by itself.

## Activation manifest gate

Sprint 28J adds a non-activating application-layer validator and compiler in `CorpusCacheActivationManifestV1.ts`. A future activation pull request must supply a strict `1.0.0` manifest containing:

- the exact cache snapshot version;
- UTC approval and expiry timestamps;
- canonical entity IDs, entity types, and published version IDs;
- `non-phi` classification and newline-free provenance metadata;
- `public-domain` or `licensed` rights state;
- current per-entry review expiry timestamps; and
- opaque clinical, editorial, and rights approval record IDs.

The gate rejects unknown fields, empty manifests, duplicate entities, stale or future approvals, expired entry reviews, snapshot mismatches, non-canonical entity types, and unapproved rights states. It returns static error codes and does not echo caller-controlled values.

Passing this validator does not activate the cache. The default production eligibility registry remains empty, no manifest is loaded from disk or environment variables, and a separately reviewed activation change must compile a checked-in approved manifest into the production registry.
