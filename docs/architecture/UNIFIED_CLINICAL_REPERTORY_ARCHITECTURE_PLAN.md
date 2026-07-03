# Unified Clinical Repertory Architecture Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory inside Nexus Atlas only  
Status: Planning only, no code changes made

## Executive Direction

The Clinical Repertory should stop exposing `V1`, `Compare`, and `V2` as clinician-facing concepts.

The product should become one unified clinical workspace:

`Patient intake -> symptom understanding -> rubric exploration -> clinical workbench -> repertorization -> remedy intelligence -> differential -> validation -> final clinical review`

Internally, modular engines can continue to exist:

- Search Engine
- Rubric Intelligence
- AI Intake Layer
- Ranking Engine
- Reasoning Engine
- Validation Engine
- Graph Engine
- Knowledge Engine

But the clinician should experience one premium, continuous repertory desktop.

## Boundary Rules

Do not disturb:

- public website
- patient portal
- doctor portal
- admin dashboard outside repertory
- authentication
- billing
- invoices
- appointments
- communications
- diagnostics
- treatment planner
- diet & lifestyle
- report analyzer
- clinical OS outside repertory
- AI router settings
- medical academy
- learning hub
- public intake
- manage doctors
- Firestore rules
- database schema
- deployment settings

High-risk shared file:

`src/app/admin/dashboard/page.tsx`

Avoid editing this file. If dashboard wiring becomes unavoidable, ask for explicit approval before editing and document the exact lines.

Preferred working area:

`src/features/repertory/**`

## Current Architecture Observed

### Dashboard Mount

`src/app/admin/dashboard/page.tsx` already imports and mounts the repertory feature:

- Import: `src/app/admin/dashboard/page.tsx:31`
- Dr. Jethwani button and workspace mount: around `src/app/admin/dashboard/page.tsx:14136-14151`

This is good. It means the redesign can mostly happen inside `src/features/repertory/**`.

### Current Main UI

`src/features/repertory/components/RepertoryWorkbench.tsx`

Currently contains:

- AI Intake textarea
- rubric search/filter
- rubric cards
- active workbench
- severity/frequency/impact modal
- scoring panel
- reasoning tabs
- remedy reasoning panel
- clinical safety warnings
- V1/Compare/V2 switcher

This file is the current best candidate to evolve into the unified workspace shell.

### Current V1/V2 UI Artifacts

Clinician-facing V1/V2 artifacts exist in:

- `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx`
- `src/features/repertory/components/V2ComparisonPanel.tsx`
- `src/features/repertory/components/V2LivePanel.tsx`
- `src/features/repertory/components/V2ClinicalFeedbackPanel.tsx`
- `src/features/repertory/components/RepertoryWorkbench.tsx`

Current API artifacts:

- `src/app/api/repertory/v2-live/route.ts`
- `src/app/api/repertory/v2-compare/route.ts`
- `src/app/api/repertory/v2-feedback/route.ts`

Current type artifacts:

- `src/features/repertory/liveMode/types.ts`
- `src/features/repertory/liveMode/liveEngine.ts`
- `src/features/repertory/liveMode/comparisonEngine.ts`
- `src/features/repertory/liveMode/feedbackModel.ts`

### Current Strong Internal Engines

Keep and reuse internally:

- canonical types: `src/features/repertory/engine/canonicalTypes.ts`
- adapters: `src/features/repertory/adapters/**`
- clinical search: `src/features/repertory/search/clinicalSearch/**`
- rubric intelligence: `src/features/repertory/intelligence/clinicalRubricIntelligence/**`
- repertorization engine: `src/features/repertory/repertorization/clinicalRepertorization/**`
- reasoning engine: `src/features/repertory/reasoning/**`
- validation framework: `src/features/repertory/validation/clinicalValidation/**`
- knowledge curation docs/model: `src/features/repertory/knowledge/clinicalCuration/**`
- graph utilities: `src/features/repertory/graph/repertoryGraph.ts`

These can power the future platform without exposing old version labels.

## Proposed Architecture

### New Conceptual Shape

Create one feature-owned clinical desktop:

```text
src/features/repertory/
  workspace/
    ClinicalRepertoryWorkspace.tsx
    workspaceTypes.ts
    workspaceState.ts
    workspaceSelectors.ts
    workspaceActions.ts
    README.md

  components/
    intake/
      PatientIntakePanel.tsx
      IntakeUploadPanel.tsx
      SymptomExtractionPanel.tsx

    parser/
      IntelligentSymptomParser.tsx
      SymptomClassificationEditor.tsx
      ParserConfidenceReview.tsx

    explorer/
      RubricExplorer.tsx
      RubricSearchBox.tsx
      RubricSourceFilters.tsx
      RubricResultCard.tsx
      RubricSourceBadge.tsx

    workbench/
      ClinicalWorkbench.tsx
      SelectedRubricCard.tsx
      RubricWeightEditor.tsx
      WorkbenchGroupingPanel.tsx

    intelligence/
      ClinicalIntelligencePanel.tsx
      MissingRubricsPanel.tsx
      ContradictionsPanel.tsx
      MiasmaticCluesPanel.tsx
      ClinicalPearlsPanel.tsx

    repertorization/
      UnifiedRepertorizationPanel.tsx
      RemedyRankingTable.tsx
      RemedyContributionDrawer.tsx
      ScoreExplanationPanel.tsx

    remedy/
      RemedyIntelligencePanel.tsx
      MateriaMedicaSummary.tsx
      RemedyRelationshipsPanel.tsx
      ClinicalConfirmationsPanel.tsx

    differential/
      DifferentialAnalysisPanel.tsx
      RemedyComparisonMatrix.tsx

    validation/
      CaseValidationPanel.tsx
      FollowUpQuestionsPanel.tsx

    finalReview/
      FinalClinicalReviewPanel.tsx
      ExportClinicalReportPanel.tsx

    shared/
      ClinicalSafetyBanner.tsx
      SourceBadge.tsx
      ConfidenceBadge.tsx
      EvidenceBadge.tsx
```

### Service Layer

Create one facade for the UI:

```text
src/features/repertory/services/
  clinicalRepertoryService.ts
  intakeMappingService.ts
  unifiedRubricSearchService.ts
  unifiedRepertorizationService.ts
  remedyIntelligenceService.ts
  clinicalValidationService.ts
```

The UI should call the service facade, not `V1` or `V2` modules directly.

### Internal Engine Layer

Keep current engines but rename only after a safe transition:

```text
src/features/repertory/engines/
  search/
  rubricIntelligence/
  repertorization/
  reasoning/
  validation/
  knowledge/
```

The first phases should avoid physical file moves unless necessary. Start with facade files that wrap existing engines.

## Component Map

### Current -> Future

| Current File | Future Role |
|---|---|
| `components/RepertoryWorkbench.tsx` | Temporary shell; eventually split into `workspace/ClinicalRepertoryWorkspace.tsx` and focused section components |
| `components/V2ClinicalEngineSwitcher.tsx` | Remove from clinician UI; not needed in unified workspace |
| `components/V2LivePanel.tsx` | Convert ideas into `UnifiedRepertorizationPanel`, `ScoreExplanationPanel`, and `ClinicalIntelligencePanel` |
| `components/V2ComparisonPanel.tsx` | Remove as a page/panel; reuse internal comparison logic only for validation/debug if needed |
| `components/V2ClinicalFeedbackPanel.tsx` | Rename/repurpose as `ClinicalFeedbackPanel` |
| `components/RemedyReasoningPanel.tsx` | Keep; use inside `RemedyIntelligencePanel` |
| `components/DifferentialComparison.tsx` | Keep; use inside `DifferentialAnalysisPanel` |
| `components/MissingInformationCard.tsx` | Keep; use inside `CaseValidationPanel` |
| `components/SuggestedQuestions.tsx` | Keep; use inside `CaseValidationPanel` |
| `components/RubricCoverageHeatmap.tsx` | Keep; use inside `ScoreExplanationPanel` |
| `components/ConfidenceBreakdownPanel.tsx` | Keep; use inside `CaseValidationPanel` |
| `components/ClinicalSafetyBadge.tsx` | Keep; upgrade to global `ClinicalSafetyBanner` |

## Proposed Unified Workflow

### 1. Patient AI Intake

Inputs:

- typed narrative
- pasted case notes
- future voice input
- future upload/OCR

Output:

- normalized clinical phrases
- candidate symptom entities
- confidence per extracted symptom

Initial implementation:

- Reuse the current textarea and `RepertorySearch.parseAIIntakeText`.
- Do not add upload/OCR until a separate phase.

### 2. Intelligent Symptom Parser

Classifies extracted symptoms into:

- mental generals
- physical generals
- particulars
- modalities
- concomitants
- causations
- sensations
- pathology
- miasmatic hints
- keynotes

Initial implementation:

- Add local, editable parsed symptom list.
- No AI auto-prescribing.
- No database writes.

### 3. Rubric Explorer

Unified search:

- one search box
- source badges
- source filter
- category/system filters
- add to workbench

Initial implementation:

- Reuse current search UI.
- Remove Kent/Boericke/Jethwani engine mode language from this workspace.
- Keep source badges as data metadata, not navigation modes.

### 4. Clinical Workbench

Center of system:

- selected rubrics
- weights
- severity
- frequency
- intensity
- confidence
- importance
- notes
- grouping
- priority

Initial implementation:

- Reuse current selected rubrics panel and adjust modal.
- Extend local state types before any database persistence.

### 5. AI Clinical Intelligence

Displays:

- missing rubrics
- contradictory rubrics
- overweighted rubrics
- pathology clues
- constitutional clues
- miasmatic clues
- etiology clues
- clinical pearls
- differential suggestions

Initial implementation:

- Reuse current reasoning modules:
  - `reasoningEngine.ts`
  - `questionGenerator.ts`
  - `differentialEngine.ts`
  - `confidenceEngine.ts`

### 6. Unified Repertorization Engine

Clinician sees:

- ranking
- scores
- coverage
- confidence
- contribution
- rubric mapping
- explanation

Clinician does not see:

- V1
- V2
- Compare

Initial implementation:

- UI facade calls current best available engine.
- Internally this can use `clinicalRepertorization`.
- Old APIs can remain temporarily, but not be exposed in UI.

### 7. Remedy Intelligence

For each remedy:

- Materia Medica summary
- keynotes
- generals
- mentals
- physicals
- modalities
- relationships
- complementary
- inimical
- follows well
- acute/chronic role
- clinical confirmations
- citations

Initial implementation:

- Reuse existing remedy metadata and reasoning panels.
- Add source/citation placeholders where data exists.
- Do not import new copyrighted repertory sources.

### 8. Differential Analysis

Shows:

- why Remedy A instead of B/C
- shared evidence
- unique evidence
- missing confirmations
- suggested differentiating questions

Initial implementation:

- Reuse `DifferentialComparison`.
- Later connect to richer remedy intelligence.

### 9. Case Validation

Shows:

- missing symptoms
- contradictions
- weak evidence
- confidence
- need more questioning
- follow-up questions

Initial implementation:

- Reuse `MissingInformationCard`, `SuggestedQuestions`, `ConfidenceBreakdownPanel`.

### 10. Final Clinical Review

Actions:

- export
- save
- print
- clinical reasoning
- remedy explanation
- patient explanation

Initial implementation:

- Reuse current export/send summary logic.
- Do not persist new clinical database records unless separately approved.

## Files To Modify

### Phase A: Planning and Non-Disruptive Setup

Modify/create only under `src/features/repertory/**`:

1. `src/features/repertory/workspace/ClinicalRepertoryWorkspace.tsx`
   - New unified workspace shell.
   - Can initially compose existing components.

2. `src/features/repertory/workspace/workspaceTypes.ts`
   - Define clinician-facing state: intake, parsed symptoms, selected rubrics, ranking, reasoning, validation.

3. `src/features/repertory/workspace/workspaceState.ts`
   - Local reducer/state helpers.
   - No persistence.

4. `src/features/repertory/services/clinicalRepertoryService.ts`
   - Facade over current search/repertorization/reasoning engines.
   - Hides V1/V2 terms.

5. `src/features/repertory/components/RepertoryWorkbench.tsx`
   - Temporary adapter that renders the new `ClinicalRepertoryWorkspace`.
   - This allows dashboard import to remain unchanged.

Risk: Low to moderate.

### Phase B: UI Component Extraction

Modify/create only under `src/features/repertory/**`:

- `components/intake/PatientIntakePanel.tsx`
- `components/parser/IntelligentSymptomParser.tsx`
- `components/explorer/RubricExplorer.tsx`
- `components/workbench/ClinicalWorkbench.tsx`
- `components/intelligence/ClinicalIntelligencePanel.tsx`
- `components/repertorization/UnifiedRepertorizationPanel.tsx`
- `components/remedy/RemedyIntelligencePanel.tsx`
- `components/differential/DifferentialAnalysisPanel.tsx`
- `components/validation/CaseValidationPanel.tsx`
- `components/finalReview/FinalClinicalReviewPanel.tsx`

Risk: Moderate, because it changes the repertory UI.

### Phase C: Remove Clinician-Facing Version Concepts

Modify:

- `src/features/repertory/components/RepertoryWorkbench.tsx`
- `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx`
- `src/features/repertory/components/V2ComparisonPanel.tsx`
- `src/features/repertory/components/V2LivePanel.tsx`
- `src/features/repertory/components/V2ClinicalFeedbackPanel.tsx`
- `src/features/repertory/liveMode/types.ts`

Recommended approach:

- Do not delete files immediately.
- Stop rendering version switcher.
- Rename labels in new UI:
  - `V2 Clinical` -> `Clinical Intelligence`
  - `V2 feedback` -> `Clinical Feedback`
  - `V1/V2 comparison` -> internal validation only

Risk: Moderate.

### Phase D: Optional Dashboard Wiring

Avoid unless necessary:

- `src/app/admin/dashboard/page.tsx`

Possible future change:

- Replace `RepertoryWorkbench` import with `ClinicalRepertoryWorkspace`.

Recommendation:

- Avoid this by exporting `ClinicalRepertoryWorkspace` through `RepertoryWorkbench` first.
- Ask approval before any dashboard edit.

## Files To Remove

No files should be removed in the first implementation phases.

Potential removal candidates after the unified workspace is stable:

1. `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx`
   - Remove when no UI uses engine mode selection.

2. `src/features/repertory/components/V2ComparisonPanel.tsx`
   - Remove from clinician UI.
   - Keep comparison logic internally if needed for validation.

3. `src/features/repertory/components/V2LivePanel.tsx`
   - Remove after its useful UI pieces are merged into unified sections.

4. `src/app/api/repertory/v2-compare/route.ts`
   - Do not remove initially.
   - Later convert to admin-only/internal validation endpoint or remove after no consumers remain.

5. `src/app/api/repertory/v2-live/route.ts`
   - Do not remove initially.
   - Later rename/replace with `/api/repertory/clinical-workspace` only after production stability.

6. `src/features/repertory/liveMode/**`
   - Do not remove initially.
   - Later rename to `clinicalEngine/**` after migration.

Removal criteria:

- no imports
- no production calls
- tests updated
- rollback path documented
- explicit approval

## Migration Strategy

### Principle

Do not big-bang rewrite.

Use a facade-and-shell migration:

1. Create a unified workspace shell.
2. Wrap existing engines behind a unified service.
3. Move UI sections one at a time.
4. Hide V1/V2 language from clinicians.
5. Keep old endpoints available temporarily.
6. Remove obsolete version-specific code only after the new workspace is validated.

### Phase 1: Unified Workspace Shell

Goal:

- Replace visible V1/Compare/V2 switcher with one continuous page.
- Keep all current functionality available.
- No dashboard edit.
- No API edit.
- No database edit.

Files:

- `src/features/repertory/workspace/ClinicalRepertoryWorkspace.tsx`
- `src/features/repertory/workspace/workspaceTypes.ts`
- `src/features/repertory/services/clinicalRepertoryService.ts`
- `src/features/repertory/components/RepertoryWorkbench.tsx`

### Phase 2: Extract Sections

Goal:

- Break `RepertoryWorkbench.tsx` into maintainable section components.
- Keep same clinical behavior.

Files:

- new section components under `src/features/repertory/components/**`

### Phase 3: Unified Engine Facade

Goal:

- UI calls one `runClinicalRepertoryAnalysis()` service.
- Service internally uses best available engines.
- V1/V2 names disappear from UI and service API.

Files:

- `src/features/repertory/services/clinicalRepertoryService.ts`
- `src/features/repertory/repertorization/clinicalRepertorization/**`
- `src/features/repertory/search/clinicalSearch/**`
- `src/features/repertory/intelligence/clinicalRubricIntelligence/**`

### Phase 4: Source-Aware Rubric Explorer

Goal:

- One search across all available legally usable sources.
- Source badges and provenance.
- No separate Kent/Boericke pages inside the clinical workspace.

No new copyrighted data imports.

### Phase 5: Remedy Intelligence

Goal:

- Remedy detail panels become clinically useful.
- Add source/citation placeholders and relationship structure.

### Phase 6: Validation and Final Review

Goal:

- Add missing symptom checks, contradictions, confidence, export/print/review workflow.

## Database Strategy

No database migration in the initial redesign.

Design future-compatible canonical model around:

- source
- author
- edition
- rubric path
- remedy
- grade
- confidence
- verification status
- clinical notes
- conflict handling
- provenance

Current `CanonicalRubric` already supports many of these fields:

- `source`
- `sourceId`
- `chapter`
- `section`
- `parentId`
- `citation`
- `metadata`
- `status`
- `remedies`
- `confidence`
- `author`
- `reviewer`

Future enhancement:

- strengthen provenance with explicit `sourceAssertions`
- explicit `rubricRemedyProvenance`
- conflict records
- clinician verification records

But do not migrate Firestore until separately documented and approved.

## API Strategy

Initial phase:

- No API changes.
- Use current APIs and local services.

Future phase:

Introduce one clinician-facing endpoint:

`/api/repertory/clinical-workspace`

Possible actions:

- `searchRubrics`
- `parseIntake`
- `runAnalysis`
- `saveFeedback`
- `exportReview`

Old versioned endpoints:

- keep during migration
- stop exposing in UI
- remove only after usage is zero and rollback is clear

## Risk Analysis

### Low Risk

- Creating new files under `src/features/repertory/**`
- Adding a service facade
- Adding local-only state models
- Renaming UI labels inside repertory feature
- Hiding V1/V2 switcher inside `RepertoryWorkbench`

### Moderate Risk

- Rebuilding `RepertoryWorkbench` layout
- Extracting components from a large existing component
- Changing clinician workflow in Dr. Jethwani's repertory
- Replacing mode panels with a continuous page

### High Risk

- Editing `src/app/admin/dashboard/page.tsx`
- Changing existing APIs
- Changing Firestore schema
- Removing old endpoints
- Deleting old components before the new workspace is verified
- Importing new repertory source data

### Main Clinical Safety Risk

The UI might appear too confident if AI/repertorization output is not clearly marked as clinical support.

Required mitigation:

- Always show: `Clinical review required — do not auto-prescribe`
- Explain every ranking
- Show missing/weak/contradictory evidence
- Allow clinician override
- Never auto-prescribe

## Recommended First Implementation Phase

Do not start with a full redesign.

Start with Phase 1:

1. Create `ClinicalRepertoryWorkspace.tsx` under `src/features/repertory/workspace/`.
2. Create `workspaceTypes.ts`.
3. Create `clinicalRepertoryService.ts` facade.
4. Update only `RepertoryWorkbench.tsx` to render the new unified workspace shell.
5. Remove/hide the V1/Compare/V2 switcher from clinician UI.
6. Keep old V2 panels and endpoints available but unused.
7. No dashboard edit.
8. No API edit.
9. No database edit.
10. Run build/tests/lint.

This gives the clean future direction while preserving rollback safety.

## Approval Needed Before Coding

Before implementation, approve Phase 1 specifically:

Files proposed for Phase 1:

- `src/features/repertory/workspace/ClinicalRepertoryWorkspace.tsx`
- `src/features/repertory/workspace/workspaceTypes.ts`
- `src/features/repertory/workspace/workspaceState.ts`
- `src/features/repertory/services/clinicalRepertoryService.ts`
- `src/features/repertory/components/RepertoryWorkbench.tsx`

Files not touched in Phase 1:

- `src/app/admin/dashboard/page.tsx`
- all APIs
- database
- auth
- billing
- patient/doctor workflows
- public site

## Success Criteria

After Phase 1:

- Clinician sees one unified Clinical Repertory workspace.
- No visible V1/V2/Compare mode navigation.
- AI intake remains visible.
- Rubric explorer remains visible.
- Workbench remains central.
- Repertorization output is present.
- Reasoning and validation are present.
- Safety warnings are visible.
- Existing stable modules outside repertory are unchanged.
- Build, tests, and lint pass.
- Rollback is one commit.

