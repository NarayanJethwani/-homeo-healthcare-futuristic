# Knowledge Database Expansion Milestones

**Program:** Knowledge Expansion Program (KEP)
**Roadmap version:** 1.1
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
generate evaluation cases, and assemble the final authorization packet. The
authenticated program owner is the final decision-maker. One independent
clinical checker is added only for elevated or critical items. AI cannot accept
a clinical claim or grant itself publication or RAG authority.

Decision lanes:

- routine, fully cited, source-bound revision: program-owner final decision;
- elevated or critical clinical revision: one independent clinical check,
  followed by the program-owner final decision;
- critical release: the same human decision path plus controlled release,
  observation, and rollback controls.

Exit gate:

```text
1/1 authenticated program-owner authority active
100% revisions assigned to a risk lane
100% routine items routed directly to owner final authorization
100% elevated and critical revisions have one independent clinical check
100% engaged human credentials current
all source-rights decisions current
0 AI or automatic final approvals
0 publication or RAG authority changes
```

The detailed operating policy is defined in
`docs/knowledge/AUTHORITY_LED_EXPANSION_WORKFLOW.md`. The earlier eleven-seat
model remains historical KEP-1 evidence and may still be selected as an
institutional high-assurance option, but it is no longer the universal entry
gate for new expansion work.

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
- 14 material claim groups mapped to four verified sources (`CIT-0017`, `CIT-0023`, `CIT-0025`, `CIT-0036`);
- 10 unique governed relationship proposals for GERD/Heartburn, all draft-only;
- Revision-bound authorization packet approved by the program owner on 2026-07-30 through PR #74;
- **M2 Governed Offline Retrieval Evaluation** executed for GERD + Heartburn on 2026-07-30:
  - 40 test cases across 8 evaluation dimensions (20 for `D0001` GERD, 20 for `S0001` Heartburn);
  - 100% pass rate: 0 unsupported claim failures, 100% emergency escalation recall, 100% citation precision;
  - Evaluation report published to `reports/knowledge-m2-gerd-heartburn-offline-evaluation.md`.
- **Eczema + Skin Eruptions** flagship package revision `1.1.0` prepared on 2026-07-30:
  - `D0002` Eczema and `S0002` Skin Eruptions upgraded to `v1.1.0` with claim-level citations (`CIT-0019` NICE CG57, `CIT-0022`, `CIT-0023`, `CIT-0024`);
  - 10 unique governed relationship proposals for Eczema/Skin Eruptions, all draft-only;
  - Authorization packet built in `reports/knowledge-m2-eczema-skin-eruptions-authorization.json`;
  - **M2 Governed Offline Retrieval Evaluation** executed for Eczema + Skin Eruptions on 2026-07-30: 40 cases across 8 dimensions (20 for `D0002`, 20 for `S0002`), 100% pass rate, 100% emergency recall (eczema herpeticum, erythroderma >90% BSA, SJS/TEN); evaluation report published to `reports/knowledge-m2-eczema-skin-eruptions-offline-evaluation.md`.
- **CBC + TSH** flagship package revision `1.1.0` prepared and evaluated on 2026-07-30:
  - `L0001` CBC and `L0002` TSH upgraded to `v1.1.0` with passage-level claim citations, emergency critical value panic boundaries, and explicit homeopathy non-replacement boundaries;
  - 10 unique governed relationship proposals for CBC/TSH, all draft-only;
  - Authorization packet built in `reports/knowledge-m2-cbc-tsh-authorization.json`;
  - **M2 Governed Offline Retrieval Evaluation** executed for CBC + TSH on 2026-07-30: 40 cases across 8 dimensions (20 for `L0001`, 20 for `L0002`), 100% pass rate, 100% emergency critical panic recall (febrile neutropenia, severe thrombocytopenia < 20,000/µL, severe anemia Hgb < 7.0 g/dL, myxedema coma, thyroid storm, pregnancy TSH > 20 mIU/L); evaluation report published to `reports/knowledge-m2-cbc-tsh-offline-evaluation.md`.
- **Sulphur + Nux Vomica** flagship package revision `1.1.0` prepared and evaluated on 2026-07-31:
  - `R0001` Sulphur and `R0002` Nux Vomica upgraded to `v1.1.0` with passage-level claim citations, traditional vs modern clinical evidence boundaries, strychnine toxicity safety warnings, and safety boundaries;
  - 10 unique governed relationship proposals for Sulphur/Nux Vomica, all draft-only;
  - Authorization packet built in `reports/knowledge-m2-sulphur-nux-vomica-authorization.json`;
  - **M2 Governed Offline Retrieval Evaluation** executed for Sulphur + Nux Vomica on 2026-07-31: 40 cases across 8 dimensions (20 for `R0001`, 20 for `R0002`), 100% pass rate, 100% emergency recall (acute cellulitis/erythroderma, acute mechanical bowel obstruction, hematemesis, raw Strychnos nux-vomica seed ingestion warnings); evaluation report published to `reports/knowledge-m2-sulphur-nux-vomica-offline-evaluation.md`.
- Production RAG remains strictly inactive across all entities.

Exit gate:

```text
8/8 current draft revisions complete (D0001, S0001, D0002, S0002, L0001, L0002, R0001, R0002)
100% material claims citation-mapped
40/40 unique governed relationship proposals generated (draft-only)
160/160 governed offline retrieval evaluation cases executed (100% pass rate)
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
8/8 current revisions have a recorded risk-lane decision (D0001, S0001, D0002, S0002, L0001, L0002, R0001, R0002) [VERIFIED]
100% elevated and critical revisions independently checked by Dr. Narayan Jethwani [VERIFIED]
160/160 aggregated offline evaluation cases executed with 100% pass rate [VERIFIED]
0 unsupported-claim failures [VERIFIED]
0 emergency-escalation failures [VERIFIED]
0 withdrawn-content leakage [VERIFIED]
current human KEP-1 GO decision recorded in reports/knowledge-m3-flagship-go-no-go.json [VERIFIED]
successful canary and rollback exercise evidence recorded [VERIFIED]
production RAG remains strictly inactive [VERIFIED]
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
3/3 rewritten with authoritative safety boundaries (D0007 Asthma, R0006 Arsenicum Album, FAQ-safety) [VERIFIED]
3/3 independently reviewed with recorded clinical checks [VERIFIED]
withdrawn-content regression suite green (30/30 offline evaluation cases passed 100%) [VERIFIED]
explicit human restore-or-remain-withdrawn decision packet generated in reports/knowledge-m4-withdrawn-remediation-authorization.json [VERIFIED]
no automatic restoration [VERIFIED]
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
current KEP-1 go decision [VERIFIED]
current inventory SHA-256 [VERIFIED]
independently authorized KEP-3 proposal packet generated in reports/knowledge-m5-controlled-disease-authorization.json [VERIFIED]
5/5 source, content, review, graph, and evaluation packages complete (D0005, D0009, D0010, D0011, D0051 v1.1.0) [VERIFIED]
0 withdrawn or flagship entities duplicated [VERIFIED]
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

1. Merge the authorized GERD + Heartburn package after protected pull-request
   checks pass.
2. Build the 20-case-per-entity offline evaluation set for GERD + Heartburn.
3. Copy the verified package workflow to Eczema + Skin Eruptions.
4. Complete CBC + TSH, then Sulphur + Nux Vomica.
5. Complete the full KEP-1 go/no-go gate.
6. Start KEP-2 safety remediation and KEP-3 priority disease promotion as
   separate workstreams.
