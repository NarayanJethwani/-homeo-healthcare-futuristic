# Knowledge Governance Private Data Policy & Field Isolation

**Version**: 1.0.0  
**Effective Date**: 2026-07-25  

---

## 1. Data Classification Rules

Contributor data is classified into two distinct fields:

### Public Profile Data (Accessible via Public DTO)
* `id`: Contributor ID string
* `displayName`: Practitioner name
* `professionalRole`: Public clinical title
* `qualifications`: Public clinical degrees (e.g. BHMS, MD)
* `organisation`: Associated institution
* `active`: Account status

### Private Verification Data (Strictly Excluded from APIs & Client SDK)
* `registrationAuthority`: Government / licensing board name
* `registrationNumber`: Official practitioner registration ID
* `verificationDocuments`: Uploaded credential files
* `verificationNotes`: Internal administrative review notes
* `internalConflicts`: Private conflict declarations
* `registrationNumberHash`: SHA-256 hash stored for background verification

---

## 2. DTO Serialization Enforcement

All public-facing API routes must pass contributor entities through `serializePublicContributor()`.

`serializePublicContributor()` constructs the public DTO strictly using explicit property allowlists. It does NOT rely on deleting keys from source objects. Unexpected future fields (e.g. `personalEmail`, `paymentDetails`, `identityDocument`) are automatically excluded.

Direct exposure of `Contributor` database documents via public APIs is strictly prohibited. Unit tests verify that private fields are omitted during serialization.
