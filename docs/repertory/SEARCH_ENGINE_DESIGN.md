# Search Engine Design

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 2 clinical search engine, safe and isolated

## Safety Boundary

The new clinical search engine is isolated under:

`work/homeo-healthcare-futuristic/src/features/repertory/search/clinicalSearch/**`

It is not wired into:

- production dashboard
- production UI
- APIs
- database
- scoring
- repertorization
- AI intake
- public site
- auth, billing, patient, or doctor workflows

The feature flag `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE` was added and defaults to off.

## New Files

| File | Purpose | Production impact |
|---|---|---|
| `src/features/repertory/search/clinicalSearch/types.ts` | Search-only TypeScript types for indexed fields, matches, highlights, results, and benchmarks. | None |
| `src/features/repertory/search/clinicalSearch/tokenizer.ts` | Unicode-safe text normalization and tokenization. Handles spaces, punctuation, case, and diacritics. | None |
| `src/features/repertory/search/clinicalSearch/synonyms.ts` | Extensible clinical synonym dictionary and token expansion helpers. | None |
| `src/features/repertory/search/clinicalSearch/fuzzyMatcher.ts` | Edit-distance, partial-word, prefix, and suffix matching helpers. | None |
| `src/features/repertory/search/clinicalSearch/searchIndex.ts` | Builds a canonical search index from isolated `CanonicalRubric` records. | None |
| `src/features/repertory/search/clinicalSearch/clinicalSearchEngine.ts` | Ranks results using exact, starts-with, contains, synonym, fuzzy, frequency, and clinical relevance signals. | None |
| `src/features/repertory/search/clinicalSearch/benchmark.ts` | Offline benchmark helper for index build and query latency. | None |
| `src/features/repertory/search/clinicalSearch/README.md` | Documents the module and its safety rules. | None |
| `src/features/repertory/__tests__/clinicalSearchEngine.test.ts` | Isolated unit test scaffolding for tokenizer, synonyms, fuzzy search, ranking, highlighting, and benchmark helper. | None |

Updated existing isolated files:

| File | Purpose | Production impact |
|---|---|---|
| `src/features/repertory/flags/repertoryFlags.ts` | Adds disabled-by-default `useClinicalSearchEngine`. | None; not consumed by production |
| `src/features/repertory/__tests__/repertoryFlags.test.ts` | Confirms the new flag defaults to false. | None |

## Architecture

The engine has five layers:

1. Tokenizer
   - Converts input into normalized tokens.
   - Normalizes Unicode using `NFKD`.
   - Removes combining marks.
   - Converts punctuation to spaces.
   - Collapses repeated spaces.
   - Uses case-insensitive lowercase normalization.

2. Synonym engine
   - Uses an extensible dictionary.
   - Adds symmetric token mappings.
   - Supports examples such as:
     - `abdomen` / `abdominal`
     - `gas` / `flatulence`
     - `constipation` / `difficult stool`
     - `diarrhoea` / `diarrhea`
     - `craving` / `desire`
     - `anxiety` / `anxious`

3. Fuzzy matching
   - Prefix match.
   - Suffix match.
   - Partial word match.
   - Small spelling mistake match using Levenshtein distance.

4. Canonical index builder
   - Builds searchable field documents from `CanonicalRubric`.
   - Keeps fields separate so matches remain explainable.
   - Indexes title, classical wording, plain meaning, description, keywords, synonyms, patient expressions, modalities, clinical conditions, category, organ system, and remedies.

5. Ranking engine
   - Scores by:
     - exact token match
     - exact phrase boost
     - starts-with match
     - contains/suffix/partial match
     - synonym match
     - fuzzy match
     - keyword frequency
     - field importance
     - clinical relevance via `searchWeight` and `clinicalPriority`

## Highlighting

The search result includes per-field highlights:

- original field text
- HTML-marked fragment using `<mark>`
- matched terms

This remains data-only. No UI component consumes it yet.

## Feature Flag Plan

New flag:

`REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE`

Current status:

- default: off
- no production consumer
- no UI wiring
- no API wiring

Future integration should require separate approval and should compare current production search results against this engine before enabling.

## Commits

- `12e7e0e` Add disabled repertory clinical search flag
- `ea8583c` Add isolated repertory clinical search engine
- `5ac68ce` Add clinical search benchmarks and tests

## Integration Status

Not integrated. Waiting for future explicit approval before any production wiring.
