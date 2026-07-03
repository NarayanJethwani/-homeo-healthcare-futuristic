# Data Model Comparison

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 1.6 data fidelity, no new features

## Summary

The Phase 1 canonical repertory model was safe and isolated, but it was too small to represent every production repertory field. Phase 1.6 expands the isolated canonical model and read-only adapters so current rubric, remedy, hierarchy, metadata, clinical weighting, and negative-grade semantics can be carried forward without changing live behavior.

No dashboard, API, database, auth, billing, patient, doctor, public-site, or live UI files were changed.

## Field-by-Field Comparison

| Production field | Production source | Canonical field | Status | Notes |
|---|---|---|---|---|
| `id` | `src/lib/repertoryData.ts`, `src/lib/repertoryDbService.ts` | `id`, `sourceId` | mapped | Preserved as canonical ID and source ID. |
| `rubricId` | `src/features/repertory/types/index.ts` | `rubricId`, fallback to `id` | mapped | Rich typed rubrics can retain original rubric identifier. |
| `name` | legacy/classic/Firestore | `title`, `sourceTitle` | mapped | Canonical title uses `title`; original field remains available as `sourceTitle`. |
| `title` | rich typed model | `title` | mapped | Directly preserved when present. |
| `chapter` | Kent/Boericke | `chapter` | mapped | Classic repertory chapter preserved. |
| `section` | Jethwani fallback | `section`, `chapter` | mapped | Section is preserved directly and also usable as chapter. |
| `slug` | Firestore rubric | `slug` | mapped | Previously missing; now preserved. |
| `parentRubricId` | Firestore rubric | `parentRubricId`, `parentId` | mapped | Preserves hierarchy relationship. |
| `description` | Firestore rubric | `description` | mapped | Previously missing; now preserved. |
| `plainLanguageMeaning` | rich typed model | `plainLanguageMeaning` | mapped | Patient-friendly meaning preserved. |
| `classicalWording` | rich typed model | `classicalWording` | mapped | Classical repertory wording preserved. |
| `category` | Firestore/rich typed/legacy | `sourceCategory`, normalized `category` | mapped | Source text retained; normalized category available for future internal use. |
| `subCategory` | rich typed model | `subCategory`, `subcategory` | mapped | Both current casing styles are representable. |
| `subcategory` | Firestore rubric | `subcategory`, `subCategory` | mapped | Firestore field preserved. |
| `organSystem` | Firestore/rich typed | `organSystem`, normalized `clinicalSystem` | mapped | Source text retained; normalized enum still available. |
| `clinicalPriority` | Firestore rubric | `clinicalPriority` | mapped | Low/medium/high and future custom text supported. |
| `createdDate` | Firestore rubric | `createdDate` | mapped | Preserved as source date string. |
| `modifiedDate` | Firestore rubric | `modifiedDate` | mapped | Preserved as source date string. |
| `lastUpdated` | rich typed model | `lastUpdated` | mapped | Preserved as source timestamp string. |
| `status` | Firestore/rich typed | `status`, `sourceStatus` | mapped | `active`, `archived`, and `custom` are now represented; original text retained. |
| `searchWeight` | Firestore rubric | `searchWeight` | mapped | Previously missing; now preserved. |
| `indexWeights` | Jethwani/Firestore | `indexWeights` | mapped | Preserves clinical index weights, including negative values. |
| `researchCitation.source` | Jethwani/Firestore | `citation.sourceName` | mapped | Citation source preserved. |
| `researchCitation.detail` | Jethwani/Firestore | `citation.detail` | mapped | Citation detail preserved. |
| `keywords` | Jethwani/Firestore | `keywords` | mapped | Preserved as string array. |
| `clinicalKeywords` | rich typed model | `clinicalKeywords` | mapped | Professional search terms preserved. |
| `synonyms` | Jethwani/Firestore/rich typed | `synonyms` | mapped | Preserved as string array. |
| `patientExpressions` | rich typed model | `patientExpressions` | mapped | Colloquial patient language preserved. |
| `relatedSymptoms` | rich typed model | `relatedSymptoms` | mapped | Related rubric IDs preserved. |
| `relatedDiseases` | rich typed model | `relatedDiseases` | mapped | Modern disease/ICD-style labels preserved. |
| `clinicalConditions` | Firestore rubric | `clinicalConditions` | mapped | Previously missing; now preserved. |
| `modalities` | Jethwani/Firestore/rich typed | `modalities` | mapped | Preserved as source array. |
| `miasms` | Jethwani/Firestore | `miasms` | mapped | Preserved as source array. |
| `miasmaticWeight` | rich typed model | `miasmaticWeight` | mapped | Weighted miasmatic model now representable. |
| `intensityScale` | rich typed model | `intensityScale` | mapped | Default clinical impact preserved. |
| `polarity` | rich typed model | `polarity` | mapped | Positive/negative rubric polarity represented. |
| `mentalEmotionalState` | rich typed model | `mentalEmotionalState` | mapped | Preserved as string array. |
| `physicalGenerals` | rich typed model | `physicalGenerals` | mapped | Preserved as string array. |
| `thermalState` | rich typed model | `thermalState` | mapped | Known thermal values represented. |
| `thirstPattern` | rich typed model | `thirstPattern` | mapped | Known thirst values represented. |
| `foodCravings` | rich typed model | `foodCravings` | mapped | Preserved as string array. |
| `aggravations` | rich typed model | `aggravations` | mapped | Preserved separately from general modalities. |
| `ameliorations` | rich typed model | `ameliorations` | mapped | Preserved separately from general modalities. |
| `clinicalNotes` | rich typed model | `clinicalNotes` | mapped | Clinical notes preserved. |
| `confidence` | rich typed model | `confidence` | mapped | Rubric reliability index preserved. |
| `author` | rich typed model | `author` | mapped | Author preserved. |
| `reviewer` | rich typed model | `reviewer` | mapped | Reviewer preserved. |
| `remedies` | legacy/classic/Firestore | `remedies[]` | mapped | Record entries become canonical remedy entries. |
| remedy record key | legacy/classic/Firestore | `sourceRemedyId` | mapped | Original remedy abbreviation/name retained for reversibility. |
| normalized remedy ID | adapters | `remedyId` | mapped | Normalized value retained for future matching. |
| remedy grade | all repertory sources | `grade`, `sourceGrade` | mapped | Normalized grade remains available; original numeric grade preserved. |
| negative remedy grade | possible clinical data | `sourceGrade`, `polarity`, `isEliminating` | mapped | Negative values no longer lose elimination semantics. |
| `relatedRemedies[].remedyId` | rich typed model | `remedyId`, `sourceRemedyId` | mapped | Source and normalized IDs preserved. |
| `relatedRemedies[].remedyName` | rich typed model | `remedyName` | mapped | Remedy display name preserved. |
| `relatedRemedies[].confidence` | rich typed model | `confidence` | mapped | Preserved. |
| `relatedRemedies[].keynoteReason` | rich typed model | `keynoteReason` | mapped | Preserved. |
| `relatedRemedies[].sourceReference` | rich typed model | `sourceReference` | mapped | Preserved. |
| `relatedRemedies[].clinicalExperienceWeight` | rich typed model | `clinicalExperienceWeight` | mapped | Preserved. |
| `relatedRemedies[].contraindicationNotes` | rich typed model | `contraindicationNotes` | mapped | Preserved. |
| `relatedRemedies[].differentialNotes` | rich typed model | `differentialNotes` | mapped | Preserved. |
| unknown/future fields | any source record | `metadata`, `originalRecord` | mapped | Adapter metadata retains unmapped fields; `originalRecord` keeps the full source object reference. |
| `JETHWANI_SECTIONS.icon` | section metadata | not on rubric; available in source constants | not applicable | This is section UI/reference metadata, not a rubric row field. No adapter change was made. |
| `JETHWANI_SECTIONS.description` | section metadata | not on rubric; available in source constants | not applicable | Section description is not attached to each rubric in production data. |
| `JethwaniSymptomConfig.severity` | session/config | `RepertorySessionRubric.severity` | mapped | Already represented from Phase 1. |
| `JethwaniSymptomConfig.frequency` | session/config | `RepertorySessionRubric.frequency` | mapped | Already represented from Phase 1. |
| `JethwaniSymptomConfig.impact` | session/config | `RepertorySessionRubric.impact` | mapped | Already represented from Phase 1. |
| `RepertorizationSession.results` | Firestore session | not expanded in Phase 1.6 | partial | Current Phase 1.6 focused rubric/remedy fidelity. Session result snapshots should be expanded before session migration work. |
| `FavoriteRubric` | Firestore favorites | not part of canonical rubric | not applicable | Favorite records are workflow/user data and remain outside the isolated repertory data foundation. |

## Files Compared

- `work/homeo-healthcare-futuristic/src/lib/repertoryData.ts`
- `work/homeo-healthcare-futuristic/src/lib/repertoryDbService.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/types/index.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/engine/canonicalTypes.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/adapters/legacyJethwaniAdapter.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/adapters/firestoreRubricAdapter.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/adapters/kentBoerickeAdapter.ts`

## Phase 1.6 Code Changes

- `src/features/repertory/engine/canonicalTypes.ts`
  - Expanded canonical rubric fields to represent Firestore, fallback Jethwani, Kent/Boericke, and rich typed rubric data.
  - Added source-preserving remedy fields and negative-grade semantics.
- `src/features/repertory/adapters/legacyJethwaniAdapter.ts`
  - Preserves rich rubric fields, index weights, related remedies, metadata, and negative grade semantics.
- `src/features/repertory/adapters/firestoreRubricAdapter.ts`
  - Preserves Firestore admin/data fields, clinical conditions, index weights, metadata, and negative grade semantics.
- `src/features/repertory/adapters/kentBoerickeAdapter.ts`
  - Preserves source remedy IDs, source grades, negative grade semantics, and unknown metadata.
- `src/features/repertory/__tests__/repertoryAdapters.test.ts`
  - Adds data-fidelity coverage for rich Jethwani fields, Firestore fields, unknown metadata, reversible remedy normalization, and negative grades.

## Remaining Partial Areas

- Repertorization session result snapshots are not fully expanded yet because Phase 1.6 targeted rubric and remedy fidelity only.
- Section-level metadata from `JETHWANI_SECTIONS` remains source-level metadata, not per-rubric canonical data.
- Runtime verification is blocked locally because project dependencies such as `next`, `tsc`, and `ts-node` are not installed.
