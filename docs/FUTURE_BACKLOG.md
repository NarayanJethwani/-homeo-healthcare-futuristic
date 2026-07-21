# Future Backlog

This document lists future features, enhancement ideas, and research opportunities that have not yet been assigned to a specific sprint.

## Backlog Register

| Item | Component | Complexity | Description / Objectives |
| :--- | :--- | :--- | :--- |
| **Symptom Severity Calibration** | Clinical Engine | High | Create mathematical weights adjusting symptom impact scores based on frequency and duration parameters. |
| **Miasmatic Filter Toggle** | UI / Repertory | Medium | Allow clinicians to filter repertory rubrics dynamically by miasm (Psora, Sycosis, Syphilis, Tubercular). Model schema, frozen projection read model, and disabled presentation layout are fully implemented and verified; dynamic production enablement remains clinically governed. |
| **Export Case Timeline to PDF** | Case Ledger | Medium | Generate structured PDF case logs with clinical charts and safety disclosures for offline consultation references. |
| **PWA Offline Mode Cache** | App / PWA | High | Allow local offline symptom tracking and sync when connectivity is restored. |
| **Governed Ollama Cache Activation** | AI / RAG | High | Approve a source-version eligibility read model and a small non-PHI corpus, document local runtime configuration, and complete shadow/rollback validation before enabling the Sprint 28H cache outside tests. |

## Completed Items

| Item | Component | Complexity | Resolution |
| :--- | :--- | :--- | :--- |
| **Integrate local Ollama telemetry logs** | AI / Telemetry | Medium | Completed in Sprint 28F (Commit `80e41ac277aa8a8847b9e5d6180cc8aa04fbbfd3`). |
| **Governed Ollama embeddings cache foundation** | AI / RAG | High | Completed in Sprint 28H (Merge commit `a617ecee753074b2eb06e799c5d2c2d068a728d1`). Runtime activation remains separately governed. |
