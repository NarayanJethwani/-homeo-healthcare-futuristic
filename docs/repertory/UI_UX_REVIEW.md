# UI/UX Review

## Scope And Access

Authenticated dashboard screens could not be inspected on the live site without credentials. The review is based on code inspection, unauthenticated live behavior, and the visible public/login pages.

Live behavior observed:

- `/admin/dashboard` redirects to `/admin/login?next=/admin/dashboard`.
- Login page presents "Clinical Hub Login" and professional portal language.
- Public site is visually rich and polished, but some claims need safety/legal review.

## Current Screens

The admin dashboard is currently a large all-in-one clinical operating system:

- dashboard widgets;
- AI intake;
- patient queue;
- diagnostics;
- repertory/Nexus Atlas;
- materia medica;
- Organon learning;
- prescriptions/invoices;
- doctor management;
- AI router settings.

This ambition is impressive, but the screen complexity is likely too high for daily repertory work. The code shape reflects that complexity: `src/app/admin/dashboard/page.tsx` is about 30k lines.

## Dashboard Improvements

- Split dashboard into clear clinical work zones:
  - Today;
  - Patients;
  - Case Intake;
  - Repertory;
  - Materia Medica;
  - Reports/Billing;
  - Admin.
- Reduce visual noise in clinical work areas. Repertory software should prioritize scan speed, density, and confidence over decorative UI.
- Keep alerts and AI status available, but avoid making them compete with rubric selection.
- Use a persistent patient/case context bar:
  - patient name;
  - case status;
  - last visit;
  - active doctor;
  - unsaved changes;
  - safety flags.
- Replace browser alerts with in-app non-blocking toasts or review panels.

## Filters

Current filters include category, organ system, miasm, and remedy. These are good but need professional expansion:

- source: Kent, Boericke, Jethwani, custom;
- chapter;
- grade;
- rubric type: general, particular, modality, etiology, mental, concomitant;
- reviewer status;
- AI-generated/unverified flag;
- remedy relationship: complementary, inimical, follows well;
- case state: added, rejected, suggested, confirmed.

Filter UX should use compact segmented controls, multi-select menus, and chips. The current "All" dropdown pattern will become slow at professional scale.

## Rubric Cards

Rubric cards should show:

- classical rubric path;
- plain-language meaning only when useful;
- source and citation;
- remedies with grades in a compact row;
- review status;
- add/confirm button;
- confidence/provenance badge;
- quick actions: compare, details, related rubrics.

Avoid long paragraph cards for every result. Dense repertory users need to scan dozens of rubrics quickly.

## Workbench

The workbench should become the center of the repertory screen:

- selected rubrics grouped by chapter/category;
- visible intensity/frequency controls;
- AI-suggested rubrics separated from clinician-confirmed rubrics;
- drag/reorder or priority controls;
- "why added" trace for AI mappings;
- missing major generals panel;
- case completeness meter.

Add undo history for rubric additions/removals. This is important in long cases.

## Scoring Panel

The scoring panel should be transparent and clinically cautious:

- top remedies with score, coverage, and confidence band;
- per-remedy contribution breakdown;
- strongest rubrics;
- missing confirmations;
- contraindication/elimination flags;
- differentials against next-best remedies;
- no "prescribe" primary action from the score panel.

Recommended CTA language:

- "Review remedy"
- "Compare"
- "Send to clinical note"
- "Mark as clinician-considered"

Avoid:

- "Prescribe now"
- "Final remedy"
- "Confirmed diagnosis"

## AI Intake UI

Current AI intake logic can add rubrics directly from token matches. Upgrade this into a review queue:

- phrase extracted from intake;
- suggested rubric;
- confidence;
- matched terms;
- missing clarification question;
- clinician buttons: accept, edit, reject, ask.

This keeps AI useful while preserving clinical responsibility.

## Mobile And Tablet Responsiveness

Desktop should remain the primary professional repertorization environment.

Tablet:

- good for reviewing selected rubrics, remedy comparison, and case notes;
- use two panes: workbench and score/reasoning.

Mobile:

- not ideal for full repertorization;
- support quick case review, intake notes, patient queue, and reading materia medica;
- hide dense scoring tables behind tabs;
- use sticky bottom actions for save/review.

Responsive safeguards:

- avoid nested cards in dense panels;
- fixed-height scroll regions for rubric results and selected rubrics;
- no text overlap in buttons/cards;
- compact font sizes in dashboards, not hero-scale type;
- predictable tabs instead of long vertical all-in-one pages.

## Safety Language

The new repertory components do a good job repeating "clinician review only" and "Do not prescribe automatically."

Extend that consistency to:

- AI intake;
- clinical conference;
- public patient AI;
- PDF exports;
- remedy comparison;
- treatment planner handoff.

Public marketing pages should use more careful wording:

- "support"
- "may help"
- "clinical assessment"
- "individualized care"
- "requires consultation"

Avoid definitive disease cure/dissolution/prevention claims.

