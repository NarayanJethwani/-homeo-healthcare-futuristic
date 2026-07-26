# KEP-1 Contributor Intake

**Program:** Knowledge Expansion Program, flagship cohort

**Status:** Intake required; all assignments remain blocked

**Publication and production RAG authority:** None

## Purpose

This intake gate proves that every KEP-1 editorial assignment belongs to a real,
verified, qualified, conflict-declared contributor and has explicit approval
from a verified program owner. A typed contributor ID alone is not sufficient.

The gate does not create contributor identities, infer credentials, approve
people automatically, or authorize clinical publication.

## Recommended operating pool

The 32 assignment slots can be served by a smaller qualified pool. The
recommended minimum operating model is:

- four clinical authors covering gastroenterology, dermatology, laboratory
  medicine, and homeopathy subject matter;
- four separate independent clinical reviewers covering the same domains;
- one evidence-methodology reviewer;
- one source-rights reviewer;
- one verified program owner who is not self-approving an assignment.

People may serve multiple dossiers when their verified expertise covers those
dossiers. A clinical author may never independently review the same dossier.

## Required contributor record

Each contributor record must include:

1. a stable contributor ID;
2. full name;
3. a verified staff ID, ORCID, or GitHub identity;
4. role eligibility;
5. relevant expertise domains;
6. at least one current verified credential with evidence location;
7. conflict-of-interest declaration;
8. editorial-independence attestation;
9. AI-assistance disclosure agreement;
10. source-use policy agreement.

An invited, pending, rejected, expired, or suspended record is not eligible for
an approved assignment.

## Required assignment decision

Every entity-role pair must have exactly one decision containing:

- contributor ID;
- proposer identity and proposal date;
- approved status;
- a verified program-owner approver and decision date.

Self-approval is forbidden. The assignment manifest must contain exactly the
eight flagship entities and four required roles per entity.

## Expertise routing

| Entities | Clinical expertise |
| --- | --- |
| GERD and Heartburn | Gastroenterology |
| Eczema and Skin Eruptions | Dermatology |
| CBC and TSH | Laboratory medicine |
| Sulphur and Nux Vomica | Homeopathy subject matter |
| All evidence-review assignments | Evidence methodology |
| All rights-review assignments | Source rights |

## Fail-closed behavior

The gate blocks draft authoring when any identity, credential, attestation,
expertise match, independence check, or owner approval is incomplete. It also
blocks contributor IDs inserted directly into a source dossier unless they
match an approved contributor-intake decision.

Passing this intake gate authorizes assignment to controlled drafting only. It
does not approve evidence, clinical review, publication, graph relationships,
patient-specific advice, or production RAG ingestion.
