# V1 vs V2 Repertory Comparison UI

Date: 2026-07-03  
Scope: Admin-only developer preview for Dr. Narayan Jethwani

## Purpose

Provide a side-by-side clinical search comparison for Dr. Jethwani only.

The panel is for evaluation, not prescribing and not production replacement.

## Placement

Recommended placement:

- Inside Dr. Jethwani's Clinical Repertory area.
- Near the existing "Clinical Symptom Directory" search tools.
- Below the current search/filter controls, or inside a collapsed preview section.

The preview must not replace:

- Current V1 search list.
- Current directory tabs.
- Current Add Group behavior.
- Current workbench.
- Current repertorization.

## Visibility Rules

Render only when all conditions pass:

```text
session.role === "admin"
session.email === "narayan.jethwani@homeo.healthcare"
server endpoint confirms REPERTORY_V2_ADMIN_COMPARISON_MODE=true
```

Visible label:

```text
Developer Preview - Dr. Jethwani Only
```

Hidden for:

- Doctors.
- Other admins.
- Patients.
- Public users.
- Anyone when flag is OFF.

## Panel Layout

### Header

Content:

- Query text.
- Filters used.
- Timestamp.
- V1 latency.
- V2 latency.
- Warning: `V2 is observational only. V1 remains official.`

### Two-Column Comparison

Left panel:

```text
V1 Current Search Results
```

Shows:

- V1 result count.
- Top 10 V1 rubrics.
- Rank number.
- Rubric title/name.
- Organ system/category if available.
- Remedy count if available.

Right panel:

```text
V2 Clinical Search Results
```

Shows:

- V2 result count.
- Top 10 V2 rubrics.
- Rank number.
- Rubric title/name.
- Clinical relevance score if available.
- Synonym matches if available.
- Match fields if available.

### Comparison Summary

Show:

- Common rubrics.
- V1-only rubrics.
- V2-only rubrics.
- Ranking differences.
- Top 10 overlap count.
- V2 synonym matches.

Recommended visual labels:

- `Common`
- `V1 only`
- `V2 only`
- `Rank changed`
- `Synonym match`

## Feedback Buttons

Buttons:

- `Mark V2 better`
- `Mark V1 better`
- `Both acceptable`
- `V2 missed important rubric`
- `V2 found useful rubric`
- `Needs review`

Each feedback record should capture:

- Query text.
- Filters.
- Timestamp.
- Selected feedback label.
- Optional notes.
- Top 10 V1 rubric IDs.
- Top 10 V2 rubric IDs.
- Common rubric IDs.
- V1-only rubric IDs.
- V2-only rubric IDs.
- Ranking differences.
- V1 latency.
- V2 latency.

## Feedback Storage

First version:

- Store in browser localStorage only.
- Do not write Firestore.
- Do not write production clinical database.

Local key:

```text
repertory_v2_admin_comparison_feedback
```

Admin actions:

- `Save local feedback`
- `Copy JSON`
- `Download JSON`
- `Clear local feedback`

## Empty States

No query:

```text
Enter a search term above to compare V1 and V2.
```

Flag off:

```text
Comparison mode is disabled.
```

Unauthorized:

```text
This preview is restricted.
```

V2 error:

```text
V2 comparison failed. V1 remains unaffected.
```

## Loading State

When fetching comparison:

- Disable only comparison controls.
- Do not disable existing V1 search.
- Do not block the current repertory UI.

## Clinical Safety Language

Visible note:

```text
V2 results are for clinician evaluation only. V1 remains the official repertory output. No prescription should be made automatically from this comparison.
```

## Accessibility and Responsiveness

Desktop:

- Two columns side by side.

Tablet/mobile:

- Stack V1 above V2.
- Keep comparison summary above feedback buttons.

Keyboard:

- Buttons must be focusable.
- Feedback choices must have clear labels.

## UI Risk Controls

- No auto-selection of V2 rubrics.
- No "Use V2" button.
- No "Replace V1" button.
- No prescribing action.
- No repertorization action.
- No patient record action.
- No database save action.

## Proposed Component Contract

File:

- `src/features/repertory/components/AdminV1V2ComparisonPanel.tsx`

Props:

```ts
interface AdminV1V2ComparisonPanelProps {
  query: string;
  category: string;
  organSystem: string;
  miasm: string;
  remedy: string;
  session: {
    role?: string;
    email?: string;
  } | null;
}
```

Behavior:

- Calls `/api/repertory/admin-comparison`.
- Renders only if server confirms access.
- Stores feedback locally.
- Never mutates parent repertory state.

## Recommended Implementation Order

1. Build static component with mock props.
2. Add localStorage feedback support.
3. Connect to admin-only API.
4. Add one dashboard insertion.
5. Verify hidden state for non-Dr. Jethwani users.
6. Verify no current UI behavior changes.
