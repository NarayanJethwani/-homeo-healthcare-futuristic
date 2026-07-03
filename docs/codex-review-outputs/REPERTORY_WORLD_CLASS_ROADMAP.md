# Repertory World-Class Roadmap

Goal: evolve the current repertory module into a modern, web-first, clinically safe professional repertory system comparable in seriousness to RadarOpus, Complete Dynamics, and MacRepertory, while adding careful AI-assisted workflows.

## Phase 1: Stabilize Current Repertory

- Freeze destructive feature work until the data/API split is resolved.
- Choose one canonical rubric shape and migrate all UI/API paths toward it.
- Replace `MemoryRepertoryRepository` in production paths with a real repository.
- Protect all repertory admin APIs with admin/doctor session checks.
- Add pagination to `/api/repertory`; never return all Kent/Boericke/Jethwani records in one response.
- Remove sensitive session logging.
- Add HTML sanitization or safe Markdown rendering before every `dangerouslySetInnerHTML` surface.
- Add basic indexes for active rubric search by keyword, source, chapter, remedy, and category.
- Make the current workbench label every result as "clinical decision support for clinician review only."
- Add regression tests for:
  - search;
  - scoring;
  - role permissions;
  - rubric save/delete;
  - repertorization session ownership.

## Phase 2: Improve Rubric/Remedy Database

- Build a canonical data model:
  - repertory source;
  - chapter;
  - rubric;
  - subrubric;
  - remedy;
  - rubric-remedy grade;
  - source citation.
- Normalize remedy abbreviations, aliases, family/kingdom metadata, and inimical/complementary relationships.
- Create a rubric import pipeline for Kent/Boericke and custom Dr. Jethwani rubrics.
- Add data quality flags:
  - duplicate rubric;
  - weak citation;
  - generated/unverified;
  - missing synonym;
  - missing remedy grade;
  - orphan rubric;
  - prohibited claim.
- Separate classical public-domain repertory data from clinic-authored proprietary rubrics.
- Add reviewer workflow: draft -> reviewed -> active -> deprecated.

## Phase 3: Advanced Repertorization Engine

- Implement multiple repertorization methods:
  - classic sum of grades;
  - Boenninghausen-style coverage;
  - weighted generals/particulars;
  - keynote-heavy analysis;
  - elimination/contraindication mode;
  - differential-only mode.
- Show transparent score contribution per remedy:
  - rubric;
  - grade;
  - intensity;
  - reliability;
  - category weight;
  - source weight;
  - final contribution.
- Add negative rubrics and eliminating symptoms.
- Add remedy relationship logic:
  - complementary;
  - inimical;
  - antidotal;
  - follows well;
  - follows badly.
- Add confidence bands that mean "case completeness", not "prescription certainty."
- Support saved analysis versions so clinicians can compare case evolution over time.

## Phase 4: AI Case Intake And Symptom Mapping

- Convert AI intake from direct auto-add to staged review:
  - extracted patient phrase;
  - candidate rubric;
  - confidence;
  - reason matched;
  - missing question;
  - clinician action: accept, reject, edit, ask follow-up.
- Use a hybrid retrieval approach:
  - lexical index for exact repertory language;
  - synonyms/abbreviations;
  - embedding candidate retrieval;
  - deterministic reranker with source-aware rules.
- Add red-flag medical triage before repertorization.
- Maintain a full audit trail for every AI suggestion.
- Add prompt-injection hardening and no-remedy/potency rules in patient-facing mode.
- Keep final remedy/potency actions manual and clinician-owned.

## Phase 5: Clinician-Grade UI

- Split the 30k-line admin dashboard into focused modules.
- Create a professional repertory layout:
  - left: search/chapter tree;
  - center: rubric results and selected rubric workbench;
  - right: scoring, differentials, missing info, citations.
- Add compact density modes suitable for repeated clinical use.
- Add keyboard-first workflows:
  - quick search;
  - add rubric;
  - adjust grade/intensity;
  - jump to selected remedy;
  - compare top remedies.
- Add case tabs:
  - Intake;
  - Rubrics;
  - Repertorization;
  - Differential;
  - Materia Medica;
  - Follow-up.
- Make mobile/tablet views useful but not overloaded: tablet for case review, desktop for full repertorization.

## Phase 6: Public/Doctor Platform Expansion

- Keep public patient AI separate from doctor-only repertory tools.
- Add a doctor platform with clinic/franchise boundaries:
  - organization;
  - clinic;
  - doctor;
  - assistant;
  - patient;
  - case.
- Add subscription/entitlement checks server-side.
- Add anonymized learning analytics only after consent and privacy review.
- Add export formats:
  - clinician PDF;
  - case summary;
  - repertory session JSON;
  - audit log.
- Build a governed clinical knowledge system:
  - editorial review;
  - citations;
  - versioning;
  - safety review;
  - release notes.

