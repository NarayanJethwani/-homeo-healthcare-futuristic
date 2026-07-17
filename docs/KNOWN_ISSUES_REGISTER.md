# Known Issues & Technical Debt Register

This register tracks unresolved bugs, code smells, performance issues, and planned refactoring items.

## Active Known Issues

| ID | Title | Date Added | Component | Severity | Description / Mitigation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **KI-001** | Mock database stubs in tests | 2026-07-03 | Tests | Low | Some tests rely on stubs; replace with real local mocks when dependencies are fully configured. | Active |
| **KI-002** | Satellite node animation performance lag | 2026-07-08 | UI | Medium | Graph satellite nodes may stutter on low-performance mobile devices; simulated Chrome emulation passed performance budgets. | Mitigated pending physical-device validation |

## Resolved Issues

| ID | Title | Date Added | Date Resolved | Component | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **KI-003** | Server Component printAction serialization error | 2026-07-07 | 2026-07-08 | API / UI | Re-structured the print handler function signature to separate state values. | Resolved |
| **KI-004** | Empty graph satellite nodes rendering error | 2026-07-07 | 2026-07-08 | UI | Added check to filter undefined nodes before executing graph layout mapping. | Resolved |
