# Clinical Repertorization Engine

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 4 isolated clinical repertorization engine

## Safety Boundary

The Phase 4 engine is isolated under:

`work/homeo-healthcare-futuristic/src/features/repertory/repertorization/clinicalRepertorization/**`

It is not wired into:

- production dashboard
- production UI
- APIs
- database
- authentication
- billing
- patient workflows
- doctor workflows
- current repertorization
- current scoring
- AI modules

Feature flags remain off by default.

## Purpose

This module provides a next-generation repertorization engine that can run independently from the current production engine. It is intended for validation only until a future approved integration phase.

## New Files

| File | Purpose | Production impact |
|---|---|---|
| `src/features/repertory/repertorization/clinicalRepertorization/types.ts` | Canonical session, selected rubric, exclusions, strategy, ranking, contribution, comparison, serialization, and benchmark types. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/session.ts` | Creates isolated repertorization sessions with rubric weights, symptom importance, exclusions, metadata, and timestamps. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/serializer.ts` | Saves/loads isolated sessions as versioned JSON strings. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/scoringStrategies.ts` | Strategy interface and built-in scoring strategies. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/rankingEngine.ts` | Computes remedy rankings and transparent contribution breakdowns. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/explainability.ts` | Produces remedy explanations from ranking outputs. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/remedyComparison.ts` | Compares remedies by shared, unique, strongest, and weakest rubrics. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/benchmark.ts` | Synthetic benchmark helper for 10, 50, 100, 500, and 1000 rubric sessions. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/index.ts` | Isolated module exports. | None |
| `src/features/repertory/repertorization/clinicalRepertorization/README.md` | Documents files and safety boundaries. | None |
| `src/features/repertory/__tests__/clinicalRepertorizationEngine.test.ts` | Isolated regression tests for strategies, exclusions, explanations, comparison, serialization, custom strategy extension, and benchmark output. | None |

Updated isolated files:

| File | Purpose | Production impact |
|---|---|---|
| `src/features/repertory/flags/repertoryFlags.ts` | Adds disabled-by-default `useClinicalRepertorizationEngine`. | None |
| `src/features/repertory/__tests__/repertoryFlags.test.ts` | Confirms the new flag defaults to false. | None |

## Feature Flag

New flag:

`REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE`

Current status:

- default: off
- not consumed by production
- no live scoring replacement
- no API/UI/database integration

## Local Commits

- `6e26a5f` Add disabled clinical repertorization flag
- `fd2017a` Add clinical repertorization session model
- `b9ea290` Add clinical repertorization scoring and ranking
- `d45aaf7` Add clinical repertorization explainability tools
- `b9ddfad` Add clinical repertorization tests and docs

## Integration Status

Not integrated. Any future production integration requires separate approval.
