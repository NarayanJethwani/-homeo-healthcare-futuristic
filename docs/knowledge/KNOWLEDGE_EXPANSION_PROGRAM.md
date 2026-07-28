# Knowledge Expansion Program

**Program ID:** KEP
**Status:** Active foundation; clinical expansion not yet approved
**Initial cohort:** Eight flagship entities
**Production RAG posture:** Inactive

## Purpose

The Knowledge Expansion Program grows the platform through governed evidence,
clinical review, provenance, graph curation, and retrieval evaluation. Increasing
the number of articles is not itself an expansion success criterion.

The program keeps three knowledge planes separate:

1. public clinical education;
2. classical homeopathic literature and repertory;
3. AI retrieval corpora.

Presence in one plane never grants eligibility in another.

## Non-negotiable boundaries

- The transitional publication freeze remains active.
- Expansion work cannot approve or publish itself.
- Draft evidence profiles are not approved evidence.
- Resolvable bibliography entries are not claim-level citation proof.
- AI-generated graph relationships remain proposals.
- Production RAG remains empty until separately approved.
- Withdrawn entities remain excluded until explicit human restoration approval.
- Expansion must occur through Knowledge services and read models; frozen domain
  entities are not modified.

## Milestones

### KEP-0 — Inventory and prioritisation

Generate a deterministic record for all 343 entities covering:

- safety withdrawal;
- content structure and generic-template signals;
- citation resolution;
- governed evidence-profile presence;
- claim-level citation assessment;
- independent-review identity;
- graph isolation, broken links, and duplicate rows;
- public-index and RAG eligibility;
- transparent prioritisation reasons.

Artifacts:

- `reports/knowledge-expansion-inventory.json`
- `reports/knowledge-flagship-pilot-manifest.json`

### KEP-1 — Eight-entity flagship pilot

The pilot cohort is:

- `D0001` — GERD
- `D0002` — Eczema
- `S0001` — Heartburn
- `S0002` — Skin Eruptions
- `R0001` — Sulphur
- `R0002` — Nux Vomica
- `L0001` — CBC
- `L0002` — TSH

Each work package requires topic-specific content, safety boundaries, conventional
care context, draft evidence profiles, claim-level citations, independent review,
5–10 governed graph relationships, and at least 20 offline retrieval questions.

Existing public-index exceptions are preserved during the pilot. They are neither
expanded nor treated as proof of independent review. RAG eligibility remains false.

### KEP-2 — Withdrawn-entity remediation

The safety remediation cohort remains separate:

- `D0007` — Asthma
- `R0006` — Arsenicum Album
- `FAQ-safety` — Homeopathy Safety and Efficacy FAQ

Rewritten content does not restore publication or retrieval eligibility. Restoration
requires independent review, regression tests, and explicit human approval.

### KEP-3 — Controlled cohort expansion

After KEP-1 passes, expand in batches of no more than 25 entities, selected using
clinical importance, safety sensitivity, actual search demand, source availability,
graph value, and reviewer capacity. The first KEP-3 control records an immutable,
evidence-bound planning proposal against the exact current inventory and current
KEP-1 go decision. A planning proposal cannot assign contributors, approve
content, publish, index, embed, migrate, or activate retrieval.

### KEP-4 — Governed offline retrieval

Build real, dimension-validated embeddings and an offline evaluation corpus before
any production activation. Evaluation must cover retrieval relevance, citation
precision, unsupported claims, emergency escalation, abstention, stale revisions,
cross-entity confusion, and withdrawn-content leakage.

## KEP-1 acceptance gates

```text
8/8 entities structurally complete
100% material clinical claims mapped to citations
100% safety and emergency claims independently reviewed
0 unresolved citation identifiers
0 generic-template findings in the completed pilot content
0 duplicate pilot graph relationships
0 author/reviewer identity conflicts
0 withdrawn-content leakage
0 production RAG entities
0 automatic approval transitions
all provenance and revision fields populated
all required CI and deployment checks green
```

## Source registration

Every new source must record title, source type, custodian, edition or version,
licence status, permitted uses, and provenance evidence. A source with pending or
restricted rights cannot progress to extraction unless the recorded licence
explicitly permits that operation.

## Operational sequence

1. Merge the governance-hardening baseline after CI, deployment, and independent
   review gates pass.
2. Run and review KEP-0 inventory.
3. Fill the eleven-seat KEP-1 operating roster through the private governance
   registry and review the privacy-safe onboarding operations report.
4. Approve all 32 KEP-1 editorial assignments through the verified contributor
   intake gate.
5. Record source-rights decisions through the controlled KEP-1 acquisition
   workspace; citation-only sources remain non-extractable.
6. Propose and independently approve acquisition envelopes, record immutable
   source-artifact metadata, and verify SHA-256 plus exact byte length through
   the KEP-1 acquisition-job workspace. Actual transfer remains separately
   controlled and no extraction is automatic.
7. Create immutable, passage-provenance-bound content revisions, draft evidence
   profiles, claim mappings, and graph proposals through the private KEP-1
   drafting workbench. These records remain unapproved and non-public.
8. Record immutable independent clinical and evidence decisions against the
   exact current draft SHA-256. Two distinct, currently eligible assigned
   reviewers and complete claim-level coverage are required for review
   readiness; this does not grant publication or RAG authority.
9. Record an immutable offline retrieval evaluation against the exact
   independently reviewed eight-entity manifest. Require at least 20 cases per
   entity, full coverage of all eight retrieval and safety dimensions, and
   server-recomputed pass thresholds with zero safety leakage. This does not
   write embeddings or activate production retrieval.
10. Record an immutable human program-owner go/no-go decision against the
    exact latest passing evaluation, with actor separation, complete final
    attestations, explicit risks or blockers, private evidence references, and
    a high-friction confirmation phrase. A go closes KEP-1 and permits
    controlled expansion planning only; it does not publish or activate RAG.
11. Record an immutable KEP-3 cohort planning proposal for no more than 25
    non-withdrawn, non-flagship entities. Bind it to the exact current KEP-1 go
    decision and deterministic inventory SHA-256; require evidence-backed
    five-factor scoring, sufficient capacity evidence for all four operating
    roles, residual risks, and an explicit authority-boundary confirmation.
    This is planning evidence only and creates no assignments or release rights.

No step in this sequence authorises production migration or RAG activation.
