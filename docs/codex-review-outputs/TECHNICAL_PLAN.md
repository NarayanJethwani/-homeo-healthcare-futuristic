# Technical Plan

## Recommended Database Structure

Use a relational database or Firestore with relational-style collections. For professional repertory scale and querying, Postgres with full-text/GIN indexes is preferred. Firestore can work for the current app if paired with a search index, but it should not be the scoring engine's long-term analytical store.

Core entities:

- `sources`: Kent, Boericke, Clarke, Hering, Dr. Jethwani Clinical Repertory.
- `source_editions`: edition, year, license/public-domain status, import checksum.
- `chapters`: source, chapter name, canonical chapter code.
- `rubrics`: canonical ID, source ID, chapter ID, parent rubric ID, path, display text, normalized text, status.
- `rubric_terms`: synonyms, patient expressions, clinical keywords, language, reviewer status.
- `remedies`: canonical remedy ID, abbreviation, name, aliases, family/kingdom, metadata.
- `rubric_remedies`: rubric ID, remedy ID, grade, source, confidence, reviewer, notes.
- `rubric_relations`: parent/child, related, opposite, differential, disease mapping, organ mapping.
- `cases`: patient ID, doctor ID, case metadata.
- `case_rubrics`: case ID, rubric ID, severity, frequency, intensity, polarity, AI suggested/clinician confirmed.
- `repertorization_runs`: case ID, algorithm version, selected rubric snapshot, result snapshot.
- `ai_mapping_events`: phrase, candidates, confidence, prompt/model version, clinician action.
- `audit_events`: actor, action, object type, object ID, before/after hash, timestamp.

## Rubric Hierarchy Model

Represent every rubric as a tree node with a materialized path.

Example:

`kent/mind/fear/death/sudden`

Fields:

- `id`
- `source_id`
- `chapter_id`
- `parent_id`
- `path`
- `depth`
- `display_text`
- `classical_text`
- `plain_language_text`
- `modality_type`: worse, better, time, location, sensation, extension, concomitant
- `status`: draft, reviewed, active, deprecated
- `provenance`: imported, curated, AI-assisted, clinic-authored

This enables:

- chapter navigation;
- parent/child expansion;
- inherited search context;
- distinguishing broad rubrics from precise subrubrics.

## Remedy Grading Model

Use a normalized join table instead of `remedies: { Nux-v: 3 }`.

Recommended fields:

- `rubric_id`
- `remedy_id`
- `grade`: 1-4
- `grade_scale`: kent_3, normalized_4, clinical_custom
- `source_id`
- `citation_id`
- `confidence`: 0-1
- `clinical_weight`: 0-1, clinic-specific and separate from classical grade
- `contraindication_notes`
- `differential_notes`
- `review_status`

Keep classical grade and Dr. Jethwani clinical weighting separate. Do not merge them into one number.

## Scoring Algorithm

Use a transparent formula and store every contribution.

Baseline:

`contribution = remedy_grade_weight * rubric_importance * case_intensity * source_reliability * clinician_confirmation_weight`

Suggested weights:

- Grade 1: 1
- Grade 2: 2.25
- Grade 3: 4
- Grade 4: 6.25

Rubric importance:

- etiology: high
- mental generals: high
- physical generals: high
- modalities: medium-high
- particulars: medium
- modern disease label: low unless used as a filter/context only

Run result should expose:

- total score;
- coverage count;
- coverage percentage;
- keynote score;
- general/particular balance;
- missing major generals;
- contraindication flags;
- differential questions;
- confidence as case completeness, not prescription certainty.

## Search Indexing Approach

Short term:

- Firestore composite indexes for `status`, `category`, `organSystem`.
- Dedicated `keywords` array only for small result sets.
- Paginate every endpoint.

Professional target:

- Meilisearch, Typesense, Algolia, or Postgres full text with trigram.
- Index fields:
  - canonical text;
  - classical text;
  - synonyms;
  - patient expressions;
  - remedies;
  - chapter;
  - source;
  - rubric path.
- Support:
  - typo tolerance;
  - exact phrase boost;
  - remedy abbreviation search;
  - chapter filters;
  - source filters;
  - grade filters;
  - negative/exclusion filters.

## API Structure

Protected doctor/admin APIs:

- `GET /api/repertory/rubrics`
- `GET /api/repertory/rubrics/:id`
- `GET /api/repertory/search`
- `POST /api/repertory/cases/:caseId/rubrics`
- `POST /api/repertory/cases/:caseId/repertorize`
- `POST /api/repertory/ai-map`
- `POST /api/repertory/rubrics`
- `PATCH /api/repertory/rubrics/:id`
- `DELETE /api/repertory/rubrics/:id`
- `GET /api/repertory/runs/:runId`

Public APIs, if needed:

- only read-only, rate-limited, paginated, and stripped of clinic-private metadata.

Every protected route should:

- call `requireAdminApiSession`;
- derive `userId` from the cookie/session, not request body;
- validate input with Zod;
- enforce role and ownership;
- log an audit event.

## Testing Plan

Unit tests:

- tokenizer/search ranking;
- synonym expansion;
- remedy abbreviation normalization;
- scoring formula;
- negative rubric/elimination behavior;
- data validator.

Integration tests:

- authenticated search;
- unauthorized API rejection;
- doctor can access only own sessions;
- admin can review/write rubrics;
- Firestore repository read/write.

Data tests:

- duplicate rubrics;
- invalid remedy IDs;
- empty sources/citations;
- suspicious generated citations;
- weak synonyms;
- prohibited claims;
- orphan graph nodes.

Performance tests:

- search latency over 70k+ rubrics;
- repertorization over 10, 50, and 200 selected rubrics;
- API payload sizes;
- Vercel cold start behavior.

Deployment gates:

- `npm run lint`
- `npm test`
- TypeScript check using local `typescript`, not deprecated `npx tsc` fallback.
- smoke test:
  - `/admin/dashboard` redirects unauthenticated;
  - protected APIs return 401 unauthenticated;
  - search returns paginated results authenticated;
  - repertorization saves session under authenticated doctor.

