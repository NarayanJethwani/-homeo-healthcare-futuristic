# Clinical Repertorization Engine

Phase 4 isolated repertorization engine for Dr. Jethwani's Clinical Repertory.

This module is independent of current production scoring and repertorization. It is not imported by production UI, APIs, database code, AI modules, patient workflows, doctor workflows, or dashboards.

## Files

- `types.ts` defines canonical session, selected rubric, scoring strategy, ranking, contribution, comparison, serialization, and benchmark types.
- `session.ts` creates isolated in-memory repertorization sessions with rubric weights, symptom importance, exclusions, metadata, and timestamps.
- `serializer.ts` serializes and deserializes isolated sessions to JSON.
- `scoringStrategies.ts` defines the strategy interface and built-in Kent style, sum of grades, weighted grades, weighted symptom importance, and frequency-normalized strategies.
- `rankingEngine.ts` computes remedy rankings, total score, weighted score, normalized score, confidence score, missing rubrics, and contribution breakdowns.
- `explainability.ts` produces remedy explanations from ranking outputs.
- `remedyComparison.ts` compares two or more remedies by shared, unique, strongest, and weakest rubric contributions.
- `benchmark.ts` runs synthetic performance benchmarks for 10, 50, 100, 500, and 1000 rubric sessions.
- `index.ts` exports the isolated module.

## Safety

- No production imports.
- No UI wiring.
- No API wiring.
- No database access.
- No current scoring changes.
- No current repertorization changes.
- No AI reasoning.
- Feature flags remain off by default.
