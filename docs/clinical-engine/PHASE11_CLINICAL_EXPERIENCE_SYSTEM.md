# Phase 11: Dr. Jethwani Clinical Knowledge System

This document outlines the architecture, indexing, and display mechanism for Dr. Jethwani's curated clinical observations and pattern registry.

## 1. Structured Clinical Observations & Patterns
We introduced a dedicated schema under `clinicalExperience/types.ts` defining `ClinicalExperienceRecord` entries:
- **Unique Identifier**: `obs_001_anxiety_digestive`, etc.
- **Type**: `pattern`, `observation`, `warning`, `tip`, `lesson`.
- **Editorial Metadata**: `author`, `reviewer`, `confidence`, `dateAdded`, `version`, `editorialStatus`, `provenance`.
- **Mappings**: remedies, rubrics, and miasms associated with the pattern.

## 2. Active Patterns Registered
Five patterns have been registered:
1. **Anxiety with digestive disturbance**: Mapped to Lycopodium/Gelsemium.
2. **Chronic acidity with perfectionism**: Mapped to Nux Vomica/Arsenicum.
3. **Recurrent URTI with thermals**: Mapped to Hepar Sulph/Silicea/Pulsatilla.
4. **Chronic constipation constitutional**: Mapped to Bryonia/Alumina/Nux Vomica.
5. **Allergic rhinitis constitutional**: Mapped to Pulsatilla/Allium Cepa/Arsenicum/Sabadilla.

## 3. Decision-Support Integration
The reasoning engine in `reasoningEngine.ts` queries observations using the cached `ClinicalExperienceIndex` and appends them as `"Dr. Jethwani Clinical Observation"` pearls. These appear dynamically inside the existing reasoning panels under each candidate remedy.
