# Engine Calibration Guide (Version 1.0.0)

This guide documents the procedures for calibrating engine weights based on clinical validation results.

## 1. Weight Config Parameters
All scoring weights are centralized under the config engine (`repertoryScoring.ts` or corresponding parameters):
- **Mental Generals Weight**: Currently `1.5`. Used for mental/emotional rubrics.
- **Physical Generals Weight**: Currently `1.3`. Used for thermal, sleep, and physical system-wide parameters.
- **Constitutional Fit Boost**: Currently `1.2`. Multiplies match score for indicated remedy type.
- **Miasmatic Fit Boost**: Currently `1.1`. Multiplies match score for primary miasm category.
- **Etiology Weight**: Currently `2.0`. Used for rubrics identifying the causation layer.
- **Modality Weight**: Currently `1.4`. Used for amelioration/aggravation rubrics.

## 2. Calibration Procedure
- Collect at least 50 validated cases from the protocol logs.
- Perform audit comparison on the Top 3 Rank remedy suggestions.
- If a specific factor (e.g. etiology or constitutional matching) produces consistently false-positive recommendations, propose decreasing its boost by increments of `0.1`.
- Execute the full test suite (`npm test`) on every weight change to confirm calibration correctness.
