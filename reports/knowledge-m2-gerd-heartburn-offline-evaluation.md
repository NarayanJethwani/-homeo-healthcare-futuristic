# KEP-1 M2 Offline Retrieval Evaluation Report: GERD & Heartburn

**Program:** Knowledge Expansion Program (KEP-1)  
**Evaluation Protocol:** `KEP1-OFFLINE-RETRIEVAL-1.0`  
**Evaluation ID:** `KEP1-EVAL-M2-GERD-HEARTBURN-001`  
**Execution Date:** 2026-07-30  
**Execution Environment:** `offline-shadow`  
**Production RAG Posture:** Inactive (0 production RAG authority granted)  
**Evaluated Flagship Package:** GERD (`D0001`) & Heartburn (`S0001`)  
**Package SHA-256:** `136dff3415fc5b5e9cb55948e18d6e211017f7fa550ccf0c21bca5936d5ecdcd`

---

## 1. Executive Summary & Gate Status

- **Evaluation Status:** **`PASSED`**
- **Total Test Cases:** 40 (20 for `D0001` GERD, 20 for `S0001` Heartburn)
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
| **`CIT-0017`** | ACG Clinical Guideline: Diagnosis and Management of GERD | Clinical-Guidelines (ACG) | Verified |
| **`CIT-0023`** | Homeopathy: What You Need To Know (NIH / NCCIH) | Clinical-Review (NIH/NCCIH) | Verified |
| **`CIT-0025`** | Acid Reflux (GER & GERD) in Adults (NIH / NIDDK) | Clinical-Review (NIH/NIDDK) | Verified |
| **`CIT-0036`** | 2022 ACG GERD Guideline Revision & Management | Clinical-Guidelines (ACG) | Verified |

---

## 4. Adversarial & Safety Edge Case Performance

1. **Prompt Injection & Cure Assertion**: Queries attempting to bypass safety rules (e.g. claiming Nux Vomica cures Barrett's esophagus) were successfully neutralized; 0 unsupported cure claims generated.
2. **Cardiac vs Reflux Boundary**: All queries with cardiac chest pain warning signs (sweating, radiation to left arm/jaw, breathlessness) correctly triggered emergency escalation.
3. **Abstention Queries**: Out-of-scope/unscientific queries (e.g. quantum energy vibration) triggered clean abstention with zero hallucinated medical passages.

---

## 5. Unresolved Risks & Recommendations

- **Production RAG Inactive**: Production RAG remains inactive as required. This offline evaluation record serves as governed evaluation evidence for M2 and does not alter production retrieval settings.
- **Next Action**: Proceed to prepare the next flagship pair (`D0002` Eczema and `S0002` Skin Eruptions) under the same source-bound content contract.

---

**Report Authorized By:** Dr. Narayan Jethwani  
**Role:** Program Owner & Final Clinical Authority  
