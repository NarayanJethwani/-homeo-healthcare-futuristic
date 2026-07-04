# Phase 5: Advanced Clinical Decision Support & Longitudinal Case Intelligence

This document outlines the architecture, timeline models, symptom evolution engine, and follow-up question generation features implemented during Phase 5.

## 1. Longitudinal Case Model
The system now tracks case progression over multiple patient visits:
- **Timeline Ledger**: Chronological visits listing prescriptions, potencies, and general amelioration ratings.
- **Symptom Evolution**: Computes status updates ('improving', 'aggravated', 'resolved', 'active') based on intensity history.
- **Certainty Evolution**: Calculates a confidence trend rating (e.g. 70% -> 85% -> 95%) and stability parameters.

## 2. Suppression warnings & Hering's Law
- **Suppression Audit**: Automatically alerts the clinician if superficial skin symptoms improve while deeper internal respiratory or mental symptoms worsen.
- **Relapse Alert**: Flags symptoms that show a flare-up after initial improvement.
- **Unexpected Findings**: Flags new symptoms appearing in recent follow-ups.

## 3. Remedy Response database
Remedy profiles are augmented with follow-up information:
- Expected acute vs. chronic response actions.
- Action timelines.
- Warning alerts.
- Milestone/follow-up checkpoints.

## 4. Intelligent Follow-up Question Generator
- **Generals & Modalities Auditor**: Flags missing constitutional details.
- **Differentiator**: Assembles queries to distinguish closely matched remedies.
