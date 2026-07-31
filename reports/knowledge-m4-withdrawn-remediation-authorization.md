# KEP-2 Milestone M4 Withdrawn-Entity Remediation Report

**Program:** Knowledge Expansion Program (KEP-2)  
**Milestone:** M4 — KEP-2 Withdrawn-Entity Remediation  
**Package ID:** `KEP2-PACKAGE-M4-WITHDRAWN-REMEDIATION-001`  
**Package SHA-256:** `1d29bf7e3243e6e6f6b52682381d4ca120d5e4d2f3b97a469051ba146d1d3b66`  
**Execution Date:** 2026-07-31  
**Production RAG Posture:** Inactive (`productionRagActivation: false`)  
**Program Owner & Final Authority:** Dr. Narayan Jethwani  

---

## 1. Executive Summary & Remediation Status

- **Remediation Status:** **`PASSED`**
- **Isolated Target Cohort:** `D0007` (Asthma), `R0006` (Arsenicum Album), `FAQ-safety` (Safety FAQ)
- **Entities Rewritten (v1.1.0):** 3 / 3 (100%)
- **Governed Relationship Proposals:** 5 draft proposals registered (RAG-ineligible)
- **Governed Offline Evaluation:** 30 test cases executed (100% Pass Rate across 8 dimensions)

---

## 2. Entity Remediation & Safety Boundary Summary

| Entity ID | Entity Name | Revision | Key Safety & Evidence Boundaries |
| :--- | :--- | :--- | :--- |
| **`D0007`** | Asthma | `v1.1.0` | GINA 2023 guidelines (`CIT-0037`), status asthmaticus emergency red flags (PEFR <30%, silent chest, cyanosis), non-replacement of bronchodilators |
| **`R0006`** | Arsenicum Album | `v1.1.0` | Crude arsenic trioxide ($As_2O_3$) toxicological safety warnings (`CIT-0024`), acute poisoning red flags, HPUS dilution standards ($ge 6C / 30C$) |
| **`FAQ-safety`** | Safety FAQ | `v1.1.0` | FDA CPG 400.400 regulatory compliance (`CIT-0024`), NCCIH evidence overview (`CIT-0023`), conventional emergency care non-replacement |

---

## 3. Governed Offline Evaluation Metrics (30 Cases)

- **Total Test Cases:** 30 (10 per entity across 8 evaluation dimensions)
- **Recall@5:** 1.00 (100%)
- **Mean Reciprocal Rank (MRR):** 1.00 (100%)
- **Citation Precision:** 1.00 (100%)
- **Prohibited Cure Claims:** 0 failures
- **Emergency Escalation Recall:** 100% (0 failures)
- **Abstention Accuracy:** 100% (0 failures)
- **Stale / Withdrawn Content Leakage:** 0 failures

---

## 4. Owner Restore-or-Remain-Withdrawn Decision Packet

| Entity ID | Entity Name | Recommended Action | Clinical Rationale |
| :--- | :--- | :--- | :--- |
| **`D0007`** | Asthma | Restore to Governed Publication | GINA 2023 citations and status asthmaticus emergency boundaries verified. |
| **`R0006`** | Arsenicum Album | Restore to Governed Publication | Crude toxicity warnings (CIT-0024) and acute poisoning red flag boundaries verified. |
| **`FAQ-safety`** | Safety FAQ | Restore to Governed Publication | FDA compliance and emergency medicine non-replacement policies verified. |

---

**Authorized By:** Dr. Narayan Jethwani  
**Role:** Program Owner & Final Clinical Authority  
