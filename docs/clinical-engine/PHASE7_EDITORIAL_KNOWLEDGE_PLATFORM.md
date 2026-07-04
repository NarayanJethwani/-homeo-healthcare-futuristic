# Phase 7: Editorial Knowledge Platform & Source Integration

This document outlines the architecture, metadata source registries, validation engines, and version control procedures introduced during Phase 7.

## 1. Editorial Architecture
The system features a structured platform directory: `src/features/repertory/editorial/`
- **[editorialTypes.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/features/repertory/editorial/editorialTypes.ts)**: Contains type declarations for `EditorialSource`, `EditorialRecord`, `EditorialRevision`, `EditorialApproval`.
- **[editorialRegistry.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/features/repertory/editorial/editorialRegistry.ts)**: Stores legal, public-domain source descriptions and versioned change histories.

## 2. Source Metadata Policies
Every registered text is described by a policy containing:
- Legal licensing rights (`Public Domain`, `Licensed`, `Proprietary`, `Clinic Internal`).
- Base confidence weights (e.g. Samuel Hahnemann Chronic Diseases = 98% weight, Jethwani Notes = 99% weight).

## 3. QA validation
- **[editorialValidator.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/features/repertory/editorial/editorialValidator.ts)**: Automatically audits the registry, flagging duplicate pearl mappings, missing source ID properties, unapproved verifications, or empty change logs.

## 4. UI rendering
- **[RemedyReasoningPanel.tsx](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/features/repertory/components/RemedyReasoningPanel.tsx)**: Displays complete version lists, approval comments, and legal source details.
