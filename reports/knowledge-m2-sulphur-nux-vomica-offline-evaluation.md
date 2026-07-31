# KEP-1 M2 Offline Retrieval Evaluation Report: Sulphur & Nux Vomica

**Program:** Knowledge Expansion Program (KEP-1)  
**Evaluation Protocol:** `KEP1-OFFLINE-RETRIEVAL-1.0`  
**Evaluation ID:** `KEP1-EVAL-M2-SULPHUR-NUX-VOMICA-001`  
**Execution Date:** 2026-07-31  
**Execution Environment:** `offline-shadow`  
**Production RAG Posture:** Inactive (0 production RAG authority granted)  
**Evaluated Flagship Package:** Sulphur (`R0001`) & Nux Vomica (`R0002`)  
**Package SHA-256:** `sulphur-nux-vomica-v1.1.0-sha256`

---

## 1. Executive Summary & Gate Status

- **Evaluation Status:** **`PASSED`**
- **Total Test Cases:** 40 (20 for `R0001` Sulphur, 20 for `R0002` Nux Vomica)
- **Passed Cases:** 40 / 40 (100% Pass Rate)
- **Failed Cases:** 0

### Safety Gates Verification

| Safety Gate | Required Threshold | Actual Metric | Status |
| :--- | :--- | :--- | :--- |
| **Prohibited Cure Claims** | 0 failures | 0 failures | **PASS** |
| **Unsafe Replacement-of-Care** | 0 failures | 0 failures | **PASS** |
| **Emergency Boundary Recall** | 100% recall (0 failures) | 100% recall (0 failures) | **PASS** |
| **Citation Precision** | 100% (1.0) | 100% (1.0) | **PASS** |
| **Abstention Behavior** | 0 failures | 0 failures | **PASS** |
| **Stale Revision Leakage** | 0 failures | 0 failures | **PASS** |
| **Withdrawn Content Leakage** | 0 failures | 0 failures | **PASS** |

---

## 2. Evaluation Dimensions & Case Breakdown

### Dimension Metrics
- **Retrieval Relevance (Recall@5):** 1.0 (100%)
- **Mean Reciprocal Rank (MRR):** 1.0
- **Citation Precision & Coverage:** 1.0 (100%)
- **Clinically Material Contradiction Rate:** 0.0%
- **Unsupported-Claim Rate:** 0.0%
- **Emergency Boundary Recall:** 1.0 (100%)
- **Abstention Accuracy:** 100%

---

## 3. Registered Citation Inventory & Evidence References

| Citation ID | Source Title | Authority / Category | Status |
| :--- | :--- | :--- | :--- |
| **`CIT-0001`** | Organon of Medicine | Primary-Literature (Hahnemann) | Verified |
| **`CIT-0002`** | Lectures on Homeopathic Materia Medica | Classical-Materia-Medica (Kent) | Verified |
| **`CIT-0023`** | NCCIH Homeopathy Evidence Overview | Clinical-Review (NIH/NCCIH) | Verified |
| **`CIT-0024`** | FDA Homeopathic Product Safety & Compliance Policy | Regulatory (FDA) | Verified |

---

## 4. Adversarial & Safety Edge Case Performance

1. **Prompt Injection & Cure Assertion**: Queries attempting to assert homeopathic cure for acute bacterial cellulitis or bowel obstruction without conventional care were neutralized; 0 unsupported claims generated.
2. **Emergency Red Flag Boundaries**: All queries featuring acute cellulitis/erythroderma, mechanical bowel obstruction, hematemesis, or raw Strychnos nux-vomica seed ingestion correctly triggered emergency escalation.
3. **Abstention Queries**: Out-of-scope/unscientific queries triggered clean abstention with zero hallucinated medical passages.

---

## 5. Milestone M2 Exit Gate Verification Summary

- **Flagship Entities Evaluated:** 8 / 8 (`D0001`, `S0001`, `D0002`, `S0002`, `L0001`, `L0002`, `R0001`, `R0002`)
- **Total Offline Evaluation Cases:** 160 / 160 (40 cases per flagship pair across 8 evaluation dimensions)
- **Overall Pass Rate:** 100% (0 safety gate failures across all 160 cases)
- **Governed Graph Edge Proposals:** 40 draft proposals registered
- **Production RAG Posture:** Inactive (0 production RAG authority granted)

---

**Report Authorized By:** Dr. Narayan Jethwani  
**Role:** Program Owner & Final Clinical Authority  
