# V2 Comparison UI Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory UI only

## UI Goal

Add a clear engine selector:

```text
Clinical Engine: [V1] [Compare] [V2 Live]
```

The selector appears only inside Dr. Jethwani's Clinical Repertory. It does not affect patient, doctor, billing, auth, public site, or other dashboard modules.

## Always Visible Safety Badge

Show in all modes:

```text
Clinical review required — do not auto-prescribe
```

Suggested placement:

- Immediately next to the clinical engine selector.
- Repeated inside V2 Live output panel.

## V1 Mode UI

Behavior:

- Existing stable UI remains unchanged.
- Existing Jethwani search/filter/directory/workbench/ranking remain official.

Screen:

- Same current `Clinical Symptom Directory`.
- Same current `Clinical Workbench`.
- Same current ranking panel.

Risk:

- None if untouched.

## Compare Mode UI

### Header

Show:

- Query text.
- Active filters.
- V1 latency.
- V2 latency.
- Result counts.
- Safety badge.

### Main Layout

Two columns on desktop:

```text
Left: V1 Current Engine
Right: V2 Clinical Engine
```

Stack on tablet/mobile:

```text
V1 Current Engine
V2 Clinical Engine
Comparison Summary
Feedback
```

### Left Panel: V1

Show:

- V1 rubrics
- V1 result count
- Top 10 V1 rubrics
- V1 remedy ranking
- V1 scores if available

### Right Panel: V2

Show:

- V2 rubrics
- V2 result count
- Top 10 V2 rubrics
- V2 remedy ranking
- clinical relevance score
- synonym matches
- hierarchy/breadcrumb matches
- V2 explanation

### Comparison Summary

Show:

- Common rubrics
- V1-only rubrics
- V2-only rubrics
- Score differences
- Ranking differences
- Missing rubrics
- Newly discovered rubrics
- Why V2 ranked differently

Recommended labels:

- `Common`
- `V1 only`
- `V2 only`
- `Rank changed`
- `V2 synonym`
- `Hierarchy match`
- `Needs review`

## V2 Live Mode UI

### V2 Search Results

Show:

- V2 rubric results
- breadcrumb/path if available
- source/category/organ system
- clinical relevance score
- synonym match detail
- hierarchy match detail

### V2 Repertorization

Show:

- V2 remedy ranking
- total score
- weighted score
- normalized score
- confidence score

### Explainability

Show for each remedy:

- why it ranked
- contributing rubrics
- grade contribution
- weight contribution
- percentage contribution
- missing rubrics
- clinical confidence

### Verification Notice

Always show:

```text
Clinician verification required before any prescription decision.
```

## Feedback UI

Buttons:

- `V2 better`
- `V1 better`
- `Both acceptable`
- `V2 missed important rubric`
- `V2 found useful rubric`
- `Needs correction`
- `Add clinical note`

Clinical note:

- Optional text field.
- Store with feedback payload.
- Do not auto-change the engine.
- Do not auto-change source data.

## Exact UI Files Proposed

| File | Change | Risk |
|---|---|---|
| `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx` | New segmented mode control. | Medium |
| `src/features/repertory/components/ClinicalSafetyBadge.tsx` | New safety badge. | Low |
| `src/features/repertory/components/V2ComparisonPanel.tsx` | New side-by-side comparison panel. | Medium |
| `src/features/repertory/components/V2LivePanel.tsx` | New V2 live output panel. | Medium |
| `src/features/repertory/components/V2ClinicalFeedbackPanel.tsx` | New feedback buttons/note form. | Medium |
| `src/app/admin/dashboard/page.tsx` | Mount controls in Jethwani repertory only. | High |

## Dashboard Insertion Strategy

Current relevant area:

- Jethwani repertory state begins around `Dr. Jethwani's Clinical Repertory State`.
- Current clinical directory renders around `Clinical Symptom Directory`.

Minimal dashboard change:

1. Add state:

```ts
const [clinicalEngineMode, setClinicalEngineMode] =
  useState<"v1" | "compare" | "v2-live">("v1");
```

2. Add switcher above the Jethwani directory/workbench.
3. Keep current V1 UI unchanged for V1 mode.
4. Render comparison/live panels additively.

## UI Safety Controls

Do not add:

- `Replace V1` button.
- `Auto prescribe` button.
- `Write to patient` button.
- `Use V2 remedy as prescription` button.
- Database source editing from comparison panel.

Do add:

- `Return to V1` button.
- Safety badge.
- Clinician verification notice.
- V1 fallback always visible or one click away.

## Responsiveness

Desktop:

- Two-column compare panel.

Tablet:

- Two-column if space allows; otherwise stack.

Mobile:

- Stack all sections.
- Keep mode switch sticky near top of repertory section.

## Acceptance Criteria

- V1 mode looks and behaves like existing UI.
- Compare mode clearly shows V1 and V2 separately.
- V2 Live mode clearly identifies V2 output.
- Safety badge is always visible.
- Feedback does not change engine behavior.
- Doctors/users with platform access see only enabled modes.
- Disabled flags hide Compare/V2 Live.
