# KEP-1 Private Contributor Onboarding Workflow

**Status:** Available for controlled administrator use

**Access:** Super administrator with `knowledge.contributor.manage`

**Drafting, publication, and production RAG authority:** None

## Purpose

The private onboarding workspace records the evidence needed to staff the
eleven-seat KEP-1 operating roster without exposing personal or credential data
through source control, public APIs, logs, or aggregate readiness reports.

## Security model

- Browser clients never access Firestore onboarding collections directly.
- Firestore rules deny all client reads and writes.
- Server routes use verified administrator sessions and a dedicated permission.
- Mutations require an exact same-origin request and strict JSON content type.
- Request bodies are stream-limited to 24 KiB.
- Identity values are immediately normalized and keyed-hashed with
  `GOVERNANCE_IDENTITY_HASH_SECRET`; raw values are not persisted or returned.
- Identity hashes have transactional uniqueness locks.
- Evidence documents remain outside Firestore; only opaque private references
  are recorded.
- API responses contain redacted status and aggregate readiness only.
- Records use optimistic versions, immutable identity, and append-only audit
  events.

## Maker-checker workflow

1. An authorized administrator creates a `verification-pending` record.
2. The record captures role and expertise eligibility, credential metadata,
   private evidence references, and the four mandatory attestations.
3. A different authorized administrator verifies identity and credential
   evidence.
4. Self-verification, stale versions, duplicate identities, expired
   credentials, and unknown credentials fail closed.
5. Successful verification marks the private record eligible and recalculates
   aggregate roster coverage.

Program-owner records cannot claim editorial roles or credentials through this
workflow. Contributor records require at least one role, one expertise domain,
and one current verified credential.

## Authority boundary

Private onboarding only proves operating-roster capacity. It does not:

- approve any of the 32 KEP-1 assignments;
- grant controlled drafting authority;
- approve evidence, clinical content, graph relationships, or publication;
- activate public indexing or production RAG;
- modify any frozen clinical domain.

After all eleven operating seats have qualified coverage, the separate
contributor-intake gate must still receive explicit program-owner decisions for
all 32 assignments.
