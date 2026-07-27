# KEP-1 Acquisition Jobs and Immutable Artifacts

**Status:** Available for controlled administrator use

**Access:** Super administrator with `knowledge.expansion.manage`

**Extraction, drafting, publication, indexing, and production RAG authority:** None

## Purpose

This KEP-1 step-six control layer turns a current, approved public-domain source
rights decision into a separately approved acquisition envelope. It records
immutable artifact metadata and independent checksum verification without
downloading, parsing, extracting, publishing, indexing, or embedding content.

## Control sequence

1. An administrator proposes a job for a registered `governed-extraction`
   source whose current rights decision is `controlled-extraction-approved`.
2. A different administrator records the decision of a verified program owner.
3. A custody actor records the private object reference, exact byte length,
   media type, SHA-256 digest, and private custody evidence.
4. A different verifier independently recomputes the digest and byte length.
5. Every state transition and immutable insert is committed with a durable
   append-only audit event.

The source URL, source version, rights-decision version, permitted media type,
and acquisition method are fixed in the approved envelope. Caller-supplied
download URLs and filesystem paths are not accepted.

## Fail-closed rules

- Citation-only and rights-pending sources cannot receive jobs.
- Rights-decision replacement or version drift blocks approval, custody, and
  verification.
- Proposers cannot approve their own job.
- Approvers cannot record artifact custody.
- Custody actors cannot verify their own artifact.
- Digest or byte-length mismatch blocks verification.
- Artifact and verification records are insert-only.
- Private object and evidence references are never returned to the browser.

## Authority boundary

A verified artifact proves source custody and byte integrity only. It does not
prove content accuracy, authorize extraction, create claims or evidence
profiles, approve graph relationships, change publication state, alter public
indexing, or activate production RAG.
