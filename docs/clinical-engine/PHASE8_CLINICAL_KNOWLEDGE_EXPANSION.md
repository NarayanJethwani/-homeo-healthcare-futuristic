# Phase 8: Clinical Knowledge Expansion & Editorial Curation

This document outlines the expanded editorial knowledge layers, miasmatic descriptors, and automated conflict validation rules integrated during Phase 8.

## 1. Registry Content Growth
The clinical registries have been systematically expanded to support:
- **Miasmatic Clues**: Incorporated Psoric, Sycotic, and Syphilitic indicators for core polychrest profiles (`Sulphur` = Chief Psoric representative, `Pulsatilla` = Sycotic mucosal target, `Arsenicum` = Syphilitic destructive target).
- **Constitutional Warnings**: Augmented profiles with warnings and alerts.

## 2. Advanced Editorial Auditing & Conflict Checks
We expanded `editorialValidator.ts` to execute advanced QA rules:
- **Low-confidence Gates**: Generates warnings for any record or source having confidence/confidencePolicy < 80%.
- **Self-relationship Traversal Block**: Validates that no remedy is linked semantically to itself.
- **Bipolar Relationship Conflicts**: Audits that no remedy is simultaneously listed as complementary and antagonistic (antidote/inimical) to the same target remedy.
