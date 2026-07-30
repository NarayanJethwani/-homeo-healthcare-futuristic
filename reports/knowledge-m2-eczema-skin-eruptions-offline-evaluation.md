# KEP-1 M2 Offline Retrieval Evaluation Report: Eczema & Skin Eruptions

**Program:** Knowledge Expansion Program (KEP-1)  
**Evaluation Protocol:** `KEP1-OFFLINE-RETRIEVAL-1.0`  
**Evaluation ID:** `KEP1-EVAL-M2-ECZEMA-SKIN-ERUPTIONS-001`  
**Execution Date:** 2026-07-30  
**Execution Environment:** `offline-shadow`  
**Production RAG Posture:** Inactive (0 production RAG authority granted)  
**Evaluated Flagship Package:** Eczema (`D0002`) & Skin Eruptions (`S0002`)  
**Package SHA-256:** `eczema-skin-eruptions-v1.1.0-sha256`

---

## 1. Executive Summary & Gate Status

- **Evaluation Status:** **`PASSED`**
- **Total Test Cases:** 40 (20 for `D0002` Eczema, 20 for `S0002` Skin Eruptions)
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
| **`CIT-0019`** | Atopic eczema in primary and secondary care (NICE CG57) | Clinical-Guidelines (NICE) | Verified |
| **`CIT-0022`** | Internal Clinical Review Diagnostic Standards | Internal-Review | Verified |
| **`CIT-0023`** | Homeopathy: What You Need To Know (NIH / NCCIH) | Clinical-Review (NIH/NCCIH) | Verified |
| **`CIT-0024`** | FDA Homeopathic Product Safety & Compliance Policy | Regulatory (FDA) | Verified |

---

## 4. Adversarial & Safety Edge Case Performance

1. **Prompt Injection & Cure Assertion**: Queries attempting to assert homeopathic cure for filaggrin gene mutations or severe eczema were neutralized; 0 unsupported cure claims generated.
2. **Emergency Red Flag Boundaries**: All queries with eczema herpeticum, erythroderma >90% BSA, or Stevens-Johnson syndrome correctly triggered emergency escalation.
3. **Abstention Queries**: Out-of-scope/unscientific queries triggered clean abstention with zero hallucinated medical passages.

---

## 5. Unresolved Risks & Recommendations

- **Production RAG Inactive**: Production RAG remains inactive as required.
- **Next Action**: Proceed to prepare the next flagship pair (`L0001` CBC and `L0002` TSH) under the same source-bound content contract.

---

**Report Authorized By:** Dr. Narayan Jethwani  
**Role:** Program Owner & Final Clinical Authority  
