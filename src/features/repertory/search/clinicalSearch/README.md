# Clinical Search Engine

Phase 2 isolated search foundation for Dr. Jethwani's Clinical Repertory.

This module is not imported by production routes, dashboards, APIs, scoring, or repertorization. It is intended for offline validation before any future integration approval.

## Files

- `types.ts` defines search-only types for indexed fields, matches, highlights, results, and benchmarks.
- `tokenizer.ts` normalizes Unicode text, punctuation, spacing, and case before tokenization.
- `synonyms.ts` contains the extensible clinical synonym dictionary and token expansion helpers.
- `fuzzyMatcher.ts` contains edit-distance, partial-word, prefix, and suffix matching helpers.
- `searchIndex.ts` builds a canonical searchable index from isolated `CanonicalRubric` records.
- `clinicalSearchEngine.ts` ranks indexed rubrics by exact, starts-with, contains, synonym, fuzzy, frequency, and clinical relevance signals.
- `benchmark.ts` measures index build time and query latency for offline validation.

## Safety

- No UI wiring.
- No API wiring.
- No database access.
- No scoring changes.
- No repertorization changes.
- No feature flag is enabled by this module.
