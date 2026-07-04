# Real-World Clinical Validation Protocol

This validation protocol establishes how clinical cases are collected, de-identified, and used for tuning the Clinical OS repertorization outcomes.

## 1. Case Collection Schema
Physicians executing validations must log parameters to the workspace/registry sheets without storing patient-identifying data:

| Field Name | Type / Format | Purpose |
| :--- | :--- | :--- |
| **Validation Case ID** | String (e.g., `val_2026_001`) | Opaque lookup key |
| **Date** | Date string (YYYY-MM-DD) | Evaluation timestamp |
| **Case Summary** | Text | Non-identifying description |
| **AI Intake Symptoms** | List of symptoms | Extracted from patient intake notes |
| **Selected Rubrics** | List of rubric IDs | Rubrics added to workbench |
| **Suggested Remedies** | List of remedy codes | Top 5 ranked results |
| **Prescribed Remedy** | Remedy code (e.g. `Ars`) | Final clinician choice |
| **Clinician Reasoning** | Text | Rationale for the prescription |
| **Follow-up Outcome** | Text / Scale rating | Patient amelioration status |
| **Engine Agreement** | Boolean | Whether prescribed remedy was in top 3 |
| **Missing Rubrics** | List of terms | Rubrics wanted but not found |
| **Overall Confidence** | Integer (0-100) | Clinician's diagnostic confidence |

## 2. De-identification Rules
- Never input patient name, street address, or exact birthdates.
- Use year or general age bracket and gender only.
