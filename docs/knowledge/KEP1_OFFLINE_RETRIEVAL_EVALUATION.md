# KEP-1 Offline Retrieval Evaluation Gate

**Status:** Available for controlled administrator use

**Access:** Super administrator with `knowledge.expansion.manage`

**Human go/no-go, editorial approval, publication, indexing, embedding, and
production RAG authority:** None

## Purpose

The step-nine gate records an immutable offline evaluation against the exact
manifest of all eight current KEP-1 draft revisions. Every revision must already
hold approved clinical and evidence decisions from distinct reviewers against
its exact SHA-256.

The evaluation is a shadow exercise. It does not write to the production vector
store, embedding queue, search index, sitemap, public graph, editorial workflow,
or RAG allowlist.

## Corpus and query-set integrity

- The corpus contains exactly the eight KEP-1 pilot entities.
- Each entry identifies the current revision and exact content SHA-256.
- The server recomputes and verifies the canonical corpus-manifest SHA-256.
- The query set is canonicalised independently of observed outputs.
- The server recomputes and verifies the query-set SHA-256.
- A new draft revision or review invalidates current evaluation readiness.

## Minimum evaluation coverage

At least 20 offline cases are required for each pilot entity, for a minimum of
160 cases. Every entity must cover:

1. retrieval relevance;
2. citation precision;
3. unsupported-claim detection;
4. emergency escalation;
5. abstention;
6. stale-revision exclusion;
7. cross-entity confusion;
8. withdrawn-content leakage.

## Passing thresholds

- recall@5: at least 90%;
- mean reciprocal rank: at least 0.85;
- citation precision: exactly 100%;
- unsupported-claim failures: zero;
- emergency-escalation failures: zero;
- abstention failures: zero;
- stale-revision leakage: zero;
- cross-entity confusion: zero;
- withdrawn-content leakage: zero.

Metrics are recomputed by the server from the submitted case outputs. Both
passing and failing runs remain immutable and auditable.

## Readiness boundary

`offline-evaluation-passed` only permits consideration of KEP-1 step 10, the
separate human go/no-go decision. It never grants publication, public indexing,
embedding, retrieval, or production RAG authority.
