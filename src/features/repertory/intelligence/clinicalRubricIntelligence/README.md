# Clinical Rubric Intelligence

Phase 3 isolated relationship layer for Dr. Jethwani's Clinical Repertory.

This module treats canonical rubrics as a clinical hierarchy instead of flat search records. It is not imported by production UI, APIs, database code, scoring, repertorization, or AI intake.

## Files

- `types.ts` defines hierarchy, breadcrumb, relationship, related-rubric, nearby-suggestion, and navigation types.
- `pathParser.ts` parses rubric paths such as `Generalities > Food > Desire > Sweets` and generates breadcrumbs.
- `hierarchyIndex.ts` builds fast in-memory lookup maps for parents, children, siblings, roots, categories, systems, path tokens, and cross-references.
- `relatedRubrics.ts` finds clinically related rubrics using hierarchy, shared category/system, shared modalities, miasms, clinical conditions, text overlap, and explicit cross-references.
- `navigation.ts` provides parent, child, sibling, root, breadcrumb, nearby-rubric, and path lookup utilities.
- `index.ts` exports the isolated intelligence module.

## Safety

- No UI wiring.
- No API wiring.
- No database access.
- No scoring changes.
- No repertorization changes.
- No AI behavior.
- Feature flags remain off by default.
