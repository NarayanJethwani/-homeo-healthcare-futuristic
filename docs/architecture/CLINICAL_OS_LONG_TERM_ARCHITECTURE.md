# Clinical OS Long-Term Architecture

Date: 2026-07-03  
Scope: Homeo Healthcare Clinical Operating System  
Immediate implementation boundary: Dr. Jethwani's Clinical Repertory inside Nexus Atlas only  
Status: Architecture guidance only, no code changes

## North Star

Homeo Healthcare should evolve into a unified clinical operating system where repertory, materia medica, remedy intelligence, AI reasoning, validation, follow-up analysis, clinical research, and knowledge graph intelligence work together inside one continuous clinician workspace.

The clinician should not think in terms of engines, versions, APIs, or modules.

The clinician should experience:

`intake -> understanding -> rubric exploration -> workbench -> analysis -> remedy intelligence -> differential -> validation -> final clinical review`

## Core Architectural Principle

Engines are internal. Workflow is external.

Clinicians should never choose between V1, V2, Compare, legacy, indexed search, canonical search, graph search, or AI search.

The system should automatically select and combine the most appropriate internal engines for the clinical task.

## Product Principle

Do not simply reorganize the existing UI.

Design the workspace as a long-lived clinical desktop that can absorb future capabilities without another major redesign:

- additional repertories
- additional materia medicas
- remedy relationship databases
- AI reasoning improvements
- graph intelligence
- semantic search
- multilingual support
- voice consultation
- OCR document intake
- laboratory data
- imaging reports
- wearable health data
- patient timeline
- follow-up comparison
- research mode
- teaching mode
- clinical audit mode

## Boundary Rules

The immediate redesign applies only to:

`Dr. Jethwani's Clinical Repertory inside Nexus Atlas`

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
- diet and lifestyle
- report analyzer
- Clinical OS outside repertory
- AI router settings
- medical academy
- learning hub
- public intake
- manage doctors
- Firestore rules
- database schema
- deployment settings

High-risk file:

`src/app/admin/dashboard/page.tsx`

Avoid touching this file unless absolutely necessary. If dashboard wiring is unavoidable, document exact lines and ask for explicit approval before editing.

## Backward Compatibility Policy

Backward compatibility is not the product goal, but production safety is mandatory.

Therefore:

- Do not delete existing engines.
- Do not delete APIs.
- Do not delete comparison logic.
- Do not delete V2 components.
- Do not delete fallback paths.

Instead:

- stop exposing version concepts to clinicians
- keep existing modules available internally
- build a unified service layer over them
- deprecate obsolete components gradually
- remove unused code only after multiple successful production releases

## Unified Service Layer

The unified workspace should call one clinical facade:

`clinicalRepertoryService`

This service should coordinate:

- intake parsing
- rubric search
- source-aware rubric retrieval
- rubric intelligence
- repertorization
- remedy reasoning
- differential analysis
- validation
- final review/export

The service may internally use legacy or newer engines, but it must return clinician-facing concepts only.

Avoid naming service outputs `v1`, `v2`, or `compare`.

Use names like:

- `rubricCandidates`
- `selectedRubrics`
- `repertorizationResult`
- `remedyRankings`
- `evidenceBreakdown`
- `clinicalWarnings`
- `missingInformation`
- `differentialQuestions`
- `sourceAttribution`
- `confidenceAssessment`

## Unified Workspace Model

The future workspace should be organized around clinical state, not UI tabs.

Core state domains:

1. Intake
   - raw narrative
   - voice transcript
   - uploaded notes
   - OCR text
   - document references

2. Parsed Symptoms
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
   - confidence
   - clinician edits

3. Rubric Explorer
   - unified query
   - source filters
   - category filters
   - system filters
   - semantic matches
   - hierarchy matches
   - source badges
   - provenance

4. Clinical Workbench
   - selected rubrics
   - weights
   - severity
   - frequency
   - intensity
   - confidence
   - importance
   - clinical notes
   - grouping
   - priority
   - clinician overrides

5. Clinical Intelligence
   - missing rubrics
   - contradictory rubrics
   - overweighted rubrics
   - pathology clues
   - constitutional clues
   - miasmatic clues
   - etiology clues
   - clinical pearls
   - differential suggestions

6. Repertorization
   - remedy ranking
   - score
   - coverage
   - confidence
   - contribution
   - rubric mapping
   - explanation

7. Remedy Intelligence
   - materia medica summary
   - keynotes
   - generals
   - mentals
   - physicals
   - modalities
   - remedy relationships
   - complementary remedies
   - inimical remedies
   - follows well
   - acute/chronic role
   - clinical confirmations
   - citations

8. Differential Analysis
   - why Remedy A over B/C
   - shared evidence
   - unique evidence
   - weak evidence
   - missing confirmations

9. Case Validation
   - missing symptoms
   - contradictions
   - weak evidence
   - confidence
   - suggested follow-up questions

10. Final Clinical Review
   - export
   - save
   - print
   - clinical reasoning
   - patient explanation
   - clinician-only notes

## Extensibility Model

Every future capability should plug into the workspace through a defined extension point.

Recommended extension points:

- `IntakeSource`
- `SymptomExtractor`
- `RubricSource`
- `MateriaMedicaSource`
- `RemedyRelationshipSource`
- `SearchProvider`
- `RepertorizationStrategy`
- `ReasoningProvider`
- `ValidationRule`
- `ClinicalGraphProvider`
- `ExportRenderer`
- `TeachingModeProvider`
- `ResearchModeProvider`
- `AuditModeProvider`

This avoids future redesigns when adding voice, OCR, wearables, imaging reports, research mode, or teaching mode.

## Knowledge Model Direction

The repertory knowledge foundation must be source-aware and provenance-aware.

Every rubric should eventually support:

- source
- author
- edition
- rubric path
- canonical concept mapping
- confidence
- verification status
- citation
- notes
- evidence level
- custom annotations

Every remedy-rubric relationship should eventually support:

- remedy
- grade
- source grade
- source
- author
- edition
- page/citation
- confidence
- verification status
- clinical notes
- conflict handling
- provenance

No copyrighted commercial data should be imported unless legally provided.

## Clinical Safety Rules

Always show:

`Clinical review required — do not auto-prescribe.`

The system must:

- assist, not prescribe
- explain rankings
- cite evidence where possible
- show uncertainty
- show missing data
- show contradictions
- allow clinician override
- keep final responsibility with the clinician

## Implementation Rule

Work incrementally.

Every phase must:

- compile successfully
- pass tests
- preserve existing stable modules
- deploy safely
- be independently rollbackable with a single commit

Never perform a large rewrite in one deployment.

## Recommended Phase Structure

### Phase 1: Unified Shell

Goal:

Create a new unified workspace shell under `src/features/repertory/**`.

Do:

- create a `ClinicalRepertoryWorkspace`
- create workspace state/types
- create a unified service facade
- hide clinician-facing V1/V2/Compare language
- keep old engines/components internally

Do not:

- edit dashboard
- edit APIs
- edit database
- delete old files

### Phase 2: Section Extraction

Goal:

Break the current monolithic repertory workbench into focused clinical sections.

Do:

- extract intake panel
- extract parser panel
- extract rubric explorer
- extract workbench
- extract repertorization panel
- extract reasoning/validation/remedy sections

### Phase 3: Unified Engine Orchestration

Goal:

Replace UI-level engine choices with automatic service-level orchestration.

Do:

- route all clinical analysis through the unified service
- use best available search/repertorization/reasoning engines internally
- keep transparent explanations

### Phase 4: Source-Aware Knowledge Expansion

Goal:

Prepare for multiple repertories and materia medicas without redesign.

Do:

- add source metadata UI
- add source filters
- add provenance display
- add conflict handling model

No unapproved data imports.

### Phase 5: Clinical Intelligence Expansion

Goal:

Add richer reasoning, graph intelligence, missing-symptom detection, follow-up comparison, and remedy relationship intelligence.

### Phase 6: Research, Teaching, Audit Modes

Goal:

Add modes as overlays/capabilities inside the same workspace, not separate products.

## Decommissioning Policy

Do not remove old modules immediately.

A module may be removed only when:

- it is no longer imported
- no production API depends on it
- no production UI depends on it
- there have been multiple successful production releases
- rollback is documented
- explicit approval is given

Until then, mark obsolete UI as deprecated internally rather than deleting it.

## Final Architecture Position

The future Clinical Repertory should not be a V2 screen.

It should be the clinical reasoning center of Homeo Healthcare:

- one workspace
- modular engines
- source-aware knowledge
- explainable clinical reasoning
- clinician-controlled decisions
- safe incremental evolution

