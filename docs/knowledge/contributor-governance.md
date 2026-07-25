# Contributor Identity & Governance Model

**Status**: Active — Phase 2 Governance Architecture  
**Scope**: Clinical Knowledge Platform  

---

## 1. Overview

The Contributor Identity Model replaces plain-text string names (`"Dr. Narayan Jethwani"`) with immutable, unique contributor identifiers (`ContributorId`).

Text-based contributor comparison (`author.name === reviewer.name`) is explicitly deprecated and prohibited across all governance evaluation routines.

---

## 2. Contributor Schema

```ts
type ContributorId = string;

interface Contributor {
  id: ContributorId;
  displayName: string;
  professionalRole?: string;
  qualifications?: string[];
  registrationAuthority?: string;
  registrationNumberHash?: string; // Private registration details stored as immutable verification hash
  organisation?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Contribution Roles

Contributors participate in distinct governance roles:

- `author`: Primary author of clinical text.
- `editor`: Structural, stylistic, or formatting editor.
- `clinical-reviewer`: Licensed clinical practitioner conducting independent clinical review.
- `evidence-reviewer`: Evidence specialist evaluating guideline alignment and citation quality.
- `translation-reviewer`: Specialist evaluating localization and multilingual accuracy.

---

## 4. Privacy & Regulatory Boundaries

- Public DTOs expose only `displayName`, `professionalRole`, and `qualifications`.
- Registration numbers and private contact information are never exposed in public API payloads.
- Registration details are hashed (`registrationNumberHash`) for internal credential audit verification.
