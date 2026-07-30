# Knowledge Database Expansion Milestones

**Program:** Knowledge Expansion Program (KEP)
**Roadmap version:** 1.0
**Baseline date:** 2026-07-30
**Current production RAG posture:** Inactive

## Baseline

The governed inventory contains 343 entities:

- 75 diseases;
- 75 symptoms;
- 150 remedies;
- 40 laboratory tests;
- 1 FAQ, 1 case study, and 1 research record.

Current readiness is:

- 8 flagship entities planned;
- 24/24 flagship claim plans eligible for staging;
- the program owner is the recorded final authority;
- routine source-bound revisions use direct program-owner authorization;
- elevated and critical revisions require one independent clinical check before
  the final owner decision;
- 5 priority disease evidence-preparation dossiers with 15/15 eligible claim
  plans;
- 32 eligible citation records and 4 quarantined or review-only records;
- 3 withdrawn entities;
- 207 isolated entities and 178 duplicate relationship rows;
- 0 production RAG entities.

Mock dashboard analytics are not evidence of demand and cannot affect cohort
priority or source authority. When real privacy-safe telemetry becomes available,
it may contribute only through the governed KEP-3 scoring gate.

## Milestone sequence

### M0 — Program alignment and deterministic roadmap

Purpose: remove naming ambiguity and establish one authoritative expansion order.

Deliverables:

- reserve KEP-2 exclusively for withdrawn-entity remediation;
- classify the five-disease evidence package as
  `KEP-PREP-1-PRIORITY-DISEASE-EVIDENCE`;
- keep preparation evidence outside the formal KEP-3 cohort until KEP-1 has a
  current human go decision;
- regenerate deterministic evidence and source-integrity artifacts;
- publish this roadmap through normal pull-request controls.

Exit gate:

```text
0 conflicting program identifiers
0 publication or RAG authority changes
all active tests and release checks green
```

### M1 — Flagship operating readiness

Purpose: make the existing eight-entity flagship executable through one clear,
risk-based human-accountability path.

Flagship:

- D0001 GERD
- D0002 Eczema
- S0001 Heartburn
- S0002 Skin Eruptions
- R0001 Sulphur
- R0002 Nux Vomica
- L0001 CBC
- L0002 TSH

AI may summarize sources, prepare citation maps, draft text, propose graph edges,
and generate evaluation cases. AI cannot accept a clinical claim or make the
final authorization decision.

Decision lanes:

- routine, fully cited, source-bound revision: program-owner final decision;
- elevated or critical clinical revision: one independent clinical check,
  followed by the program-owner final decision;
- critical release: the same human decision path plus controlled release,
  observation, and rollback controls.

Exit gate:

```text
1 recorded program-owner final authority
100% revisions assigned to a risk lane
100% elevated and critical revisions have one independent clinical check
all source-rights decisions current
0 AI or automatic final approvals
0 publication or RAG authority changes
```

### M2 — Flagship content and graph completion

Purpose: produce the first complete, source-bound clinical knowledge package.

Required per entity:

- topic-specific content with no generic-template findings;
- conventional-care context and emergency boundaries;
- material claims mapped to registered citations;
- a draft evidence profile;
- 5–10 governed graph relationships;
- complete revision, passage, and source provenance.

Delivery order:

1. GERD + Heartburn;
2. Eczema + Skin Eruptions;
3. CBC + TSH;
4. Sulphur + Nux Vomica.

Current delivery:

- GERD + Heartburn revision `1.1.0` prepared on 2026-07-30;
- 14 material claim groups mapped to four verified sources;
- 10 unique governed relationship proposals, all draft-only;
- revision-bound authorization packet generated with final owner authorization
  pending;
- no automatic graph acceptance, publication execution, or RAG activation.

Exit gate:

```text
8/8 current draft revisions complete
24/24 planned claim groups represented
100% material claims citation-mapped
40–80 unique governed relationship proposals
0 unresolved source identifiers
0 duplicate flagship relationships
0 automatic approvals
```

### M3 — Flagship independent review, evaluation, and go/no-go

Purpose: prove the end-to-end process before scaling it.

Deliverables:

- risk-lane decisions against exact revision hashes, including one independent
  clinical check for every elevated or critical revision;
- at least 160 offline cases, with at least 20 per entity;
- coverage of retrieval relevance, citation precision, unsupported claims,
  emergency escalation, abstention, stale revisions, cross-entity confusion,
  and withdrawn-content leakage;
- human program-owner go/no-go decision;
- canary-first release authorization with publication and RAG separated;
- rollback exercise and observation record.

Exit gate:

```text
8/8 current revisions have a recorded risk-lane decision
100% elevated and critical revisions independently checked
160+ offline evaluation cases
0 unsupported-claim failures
0 emergency-escalation failures
0 withdrawn-content leakage
current human KEP-1 go decision
successful canary and rollback evidence
production RAG remains inactive unless separately authorized
```

### M4 — KEP-2 withdrawn-entity remediation

Purpose: correct safety-withdrawn content without letting ordinary expansion
restore it.

Isolated cohort:

- D0007 Asthma
- R0006 Arsenicum Album
- FAQ-safety Homeopathy Safety and Efficacy FAQ

Exit gate:

```text
3/3 rewritten with authoritative safety boundaries
3/3 independently reviewed
withdrawn-content regression suite green
explicit human restore-or-remain-withdrawn decision per entity
no automatic restoration
```

### M5 — First controlled disease cohort

Purpose: promote the already prepared disease evidence into KEP-3 only after the
flagship has a current go decision.

Prepared candidates:

- D0005 Allergic Rhinitis
- D0009 Hypertension
- D0010 Diabetes Mellitus
- D0011 Hypothyroidism
- D0051 Anemia

Exit gate:

```text
current KEP-1 go decision
current inventory SHA-256
independently authorized KEP-3 proposal
5/5 source, content, review, graph, and evaluation packages complete
0 withdrawn or flagship entities duplicated
```

### M6 — Disease coverage waves

Purpose: complete the remaining disease catalogue in cohorts of no more than 25.

Priority wave after M5:

- Sinusitis
- Gastritis
- PCOS
- Acne Vulgaris
- Psoriasis
- Urticaria
- Osteoarthritis
- Anxiety Disorder
- Depression
- Rheumatoid Arthritis

Later disease waves continue by clinical risk, evidence gap, authoritative source
availability, graph value, real privacy-safe demand, and reviewer capacity.

Exit gate for every wave:

```text
1–25 entities only
100% material claims citation-mapped
100% high-risk claims independently reviewed
0 generic-template findings
0 unresolved safety blockers
offline retrieval tests green
controlled release and rollback evidence recorded
```

Catalogue completion target:

```text
75/75 diseases have explicit status
all non-withdrawn published diseases meet current review policy
all withdrawn diseases remain visibly isolated until human restoration
```

### M7 — High-risk symptoms and laboratory tests

Purpose: strengthen triage, diagnostic context, and cross-entity retrieval.

First symptom wave:

- Chest Pain
- Shortness of Breath
- Difficulty Swallowing
- Vomiting
- Diarrhea
- Productive Cough
- Muscle Weakness
- Fever
- Headache
- Constipation

First laboratory wave:

- Lipid Profile
- T3 and T4
- Kidney Function Test
- Postprandial Blood Sugar
- Serum Creatinine and Blood Urea Nitrogen
- Electrolyte Panel
- Uric Acid
- Rheumatoid Factor and Anti-CCP

Exit gates mirror M6, with mandatory escalation language for symptoms and
interpretation boundaries for laboratory tests.

### M8 — Remedy and classical-source expansion

Purpose: expand the 150-remedy library without presenting historical descriptions
as modern efficacy evidence.

Controls:

- cohorts of no more than 25 remedies;
- exact edition and passage provenance;
- traditional-use claim type only for classical sources;
- modern evidence-limitations and product-safety citations;
- no cure, replacement-care, potency, or patient-specific prescribing claims;
- separate reader availability from clinical or RAG eligibility.

Catalogue completion target:

```text
150/150 remedies have explicit source and rights status
100% traditional claims visibly distinguished from modern clinical evidence
0 classical-source claims used as independent treatment-efficacy proof
```

### M9 — Graph repair and governed retrieval scale-up

Purpose: convert a large catalogue into a coherent, testable knowledge system.

Targets:

- reduce 207 isolated entities to 0 where clinically meaningful relationships
  exist;
- reduce 178 duplicate relationship rows to 0;
- preserve provenance and reviewer decisions for every accepted edge;
- run offline retrieval evaluation for every released cohort;
- activate production RAG only through a separate, revision-bound authorization.

## Universal definition of done

An entity is complete only when its current revision has:

1. topic-specific content;
2. registered and verified sources;
3. material claim-level citation mapping;
4. conventional-care and safety boundaries;
5. an evidence profile;
6. a risk-lane decision against the exact revision hash, including independent
   review for elevated or critical revisions;
7. governed graph relationships;
8. offline retrieval coverage;
9. a controlled release and rollback record;
10. an explicit public, indexing, and RAG state.

Article count alone is never a completion metric.

## Immediate execution order

1. Obtain the program-owner final authorization for the GERD + Heartburn
   revision-bound package.
2. Merge only after the protected pull-request checks pass.
3. Build the 20-case-per-entity offline evaluation set for GERD + Heartburn.
4. Copy the verified package workflow to Eczema + Skin Eruptions.
5. Complete CBC + TSH, then Sulphur + Nux Vomica.
6. Complete the full KEP-1 go/no-go gate.
7. Start KEP-2 safety remediation and KEP-3 priority disease promotion as
   separate workstreams.
