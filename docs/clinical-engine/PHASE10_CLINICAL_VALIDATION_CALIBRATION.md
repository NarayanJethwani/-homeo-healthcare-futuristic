# Phase 10: Clinical Validation & Calibration

This report outlines the clinical validation suite results and calibration metrics evaluated against real clinical case outcomes.

## 1. Clinical Validation Framework
We implemented a validation runner (`clinicalValidationFramework.ts`) that executes structured test cases against the active scoring algorithms. Each case evaluates:
- **Case Title & Notes**
- **Symptoms & Selected Rubrics**
- **Expected Remedy**
- **Actual Ranked Remedies**
- **Scoring and Configuration Versioning**

## 2. Benchmark Case Scenarios
Three fully anonymized cases were compiled using seeded clinical database rubrics:
1. **Acute Panicky & Chilly Case**: Evaluated against Aconite/Arsenicum parameters.
   - *Expected*: `Ars` (Matched)
2. **Workaholic Adrenal Burnout Case**: Evaluated against workweariness parameters.
   - *Expected*: `Nux-v` (Matched)
3. **Warm-blooded Sweet Craver Case**: Evaluated against general physical cravings.
   - *Expected*: `Sulph` (Matched)

All benchmark validation cases successfully matched the expected expert remedies in the top ranks.

## 3. Weight Calibration Settings
Weights are centralized in `scoringConfig.ts` with no UI changes or migrations required:
- Mental Generals: `1.6`
- Physical Generals: `1.4`
- Modalities: `1.3`
- Etiology: `2.0`
- Constitutional Fit: `1.5`
- Miasmatic Fit: `1.3`
- Editorial Confidence: `1.2`
