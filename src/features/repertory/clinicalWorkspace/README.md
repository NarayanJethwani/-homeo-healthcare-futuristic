# Clinical Repertory Workspace

This folder contains the first isolated foundation for the long-term unified Clinical Repertory workspace.

It does not replace the current workbench, APIs, database, or production routes.

## Purpose

- Keep clinicians in one continuous clinical workspace.
- Hide engine/version concepts from clinician-facing contracts.
- Preserve existing engines internally while providing a stable facade for future orchestration.
- Allow future capabilities such as voice intake, OCR, semantic search, graph intelligence, materia medica, follow-up comparison, teaching mode, research mode, and audit mode to plug in without another redesign.

## Files

- `types.ts` defines clinician-facing workspace, request, result, provider, and safety contracts.
- `workspaceModel.ts` defines the long-term section order of the unified workspace.
- `clinicalRepertoryService.ts` provides a read-only orchestration facade over internal providers.
- `ClinicalRepertoryWorkspace.tsx` is an isolated shell component that can later host the existing integrated repertory panels.

## Safety

- No database writes.
- No API changes.
- No dashboard wiring.
- No engine deletion.
- No V1/V2 behavior replacement.
- Clinical safety notice remains part of the core contract.

