# Phase 9: Advanced Repertorization & Clinical Decision Engine

This document details the newly added analysis engines, Multi-Factor weighting config, and decision support metrics added in Phase 9.

## 1. Multi-Factor Clinical Weighting
We introduced a structured scoring configuration `scoringConfig.ts` with adjustable weight parameters:
- `mentalGenerals`: 1.6
- `physicalGenerals`: 1.4
- `modalities`: 1.3
- `etiology`: 2.0
- `particulars`: 1.0
- `constitutionalFit`: 1.5
- `miasmaticFit`: 1.3
- `graphConfidence`: 1.1
- `editorialConfidence`: 1.2

This allows dynamic tuning without hardcoding calculations or magic numbers.

## 2. Constitutional Analysis Engine
The constitutional engine (`constitutionalEngine.ts`) evaluates case characteristics:
- **Thermals**: chilly vs warm-blooded preferences.
- **Cravings / Aversions**: sweet, fat, meat, warm drinks.
- **Temperament / Mentals**: anxiety, yielding, competitive, irritable traits.
It returns a mapped dominant type, confidence score, and checks for contradictions (e.g. chilly + warm-blooded simultaneously).

## 3. Miasmatic Analysis Engine
The miasmatic engine (`miasmaticEngine.ts`) calculates Psora, Sycosis, and Syphilis loads based on symptoms and outputs:
- Primary and secondary miasms.
- Mixed presentation markers.
- Multi-factorial explanation summary.

## 4. UI Metric Badges
The reasoning workbench displays a grid of fit scores (Constitutional, Miasmatic, Modality, Etiology, and confidence bounds) within `RemedyReasoningPanel.tsx` without modifying the page layouts.
