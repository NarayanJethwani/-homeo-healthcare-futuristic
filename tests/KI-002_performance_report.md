# KI-002 Performance Mitigation Report

This report establishes the performance mitigation strategy and structural improvements implemented for the `KnowledgeGraphExplorer` component.

## 1. Scope & Mitigation Target
* **Mitigation Target**: React render overhead and DOM tree size during interactive hover states and fullscreen portal views.
* **Component Context**: The client visualization renders a center node, connected satellite elements, and SVG line overlays representing clinical relationships.
* **Validation Status**: Mitigated pending on-device hardware profiling and field validation.

---

## 2. Structural Metrics & Design Invariants

| Invariant / Metric | Baseline Behavior | Optimized Design | Mitigation Status |
| :--- | :--- | :--- | :--- |
| **Fullscreen Workspace Instances** | Renders 2 graph instances simultaneously (inline + portal) | Renders exactly 1 graph instance (inline is unmounted) | **Verified 100% resolved** by single-instance logic |
| **Component Re-renders on Hover/Focus** | Parent and all satellites re-render | Only active/transitioning satellites re-render | **Memoization isolated** |
| **Stable Event Handling** | Inline arrows recreate handlers | Memoized callbacks via `useCallback`/static scopes | Stable prop references |
| **Cleanup on Unmount / Escape Close** | Partial (left overflow and listeners) | Complete capture listener cleanup and overflow restoration | Verified 100% resolved |

---

## 3. Implementation Details

### A. Fullscreen Single-Instance Workspace
* **Design**: The fullscreen modal uses `createPortal` to render the interactive clinical graph at the root level. Rather than leaving the inline graph tree mounted concurrently (which results in rendering 2 concurrent graph workspaces), the inline tree is conditionally unmounted when `isFullScreen` is active (`!isFullScreen && mainContent`). This enforces the single-instance invariant in the document tree.

### B. React Child Render Memoization
* **Design**: The child satellites (`SatelliteNode`) and overlay connectors (`ConnectorLines`) are extracted and wrapped in `React.memo`. To ensure the shallow comparison holds during parent state transitions:
  - Event callbacks (`onHoverStart`, `onFocus`) accept node references dynamically, allowing parent handler functions to be defined once and stabilized using `useCallback`.
  - Static configuration handlers (`getSectionPath`, `getThemeColor`, `getIcon`, `getLineStroke`) are moved outside the component definition, ensuring reference stability across render frames.
  - Hovering or tabbing to a node restricts the commit scope strictly to the affected child components. Unaffected satellites do not execute render logic.
