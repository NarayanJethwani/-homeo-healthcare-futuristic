# Diagnostic Evidence Report: React Hydration & Timing Loop Issues

This report documents the captured evidence, root causes, and verification criteria for Sprint 28B issues.

---

## 1. React Hydration Mismatch Error #418

### Simulated Legacy Hydration Warning (Simulated Timezone Difference)
Running the legacy formatter component under a simulated timezone difference (Server: UTC, Client: America/New_York) captures the exact React hydration mismatch error:

```
  <LegacyReviewedBadge reviewedDate="2026-06-30...">
    <span>
+       Reviewed: Jun 29, 2026
-       Reviewed: Jun 30, 2026
```

*Note: The warning above is a verified reconstruction generated programmatically by running our legacy component fixture inside our test suite (`tests/hydrationAndTiming.test.tsx`) under a simulated timezone override.*

---

### Identified Component & Root Cause
* **Components**: `LastReviewedBadge.tsx` (and other date-rendering sibling components).
* **Root Cause**: The components call `new Date(reviewedDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })` without pinning a specific timezone.
  - On the server (Vercel builds/actions), Node.js evaluates this in UTC (returning `"Jun 30, 2026"`).
  - On the client browser, it is evaluated in the user's local timezone (e.g. New York, which shifts `01:00:00Z` back to the previous day `"Jun 29, 2026"`), resulting in an HTML mismatch.

---

### Separation of Browser State Observations

#### A. Clean-Browser Context (No Caching)
* **Observation**: Upon hard-reloading a browser tab with developer tools open and disabled cache, a hydration mismatch is captured in the console if the browser's system timezone is not UTC.
* **Mechanism**: The server renders the date using UTC, but the client evaluates `new Date(reviewedDate).toLocaleDateString()` in the local timezone, causing a mismatch on the first client hydration pass.

#### B. Pre-Rendered / Shared CDN Cache Context
* **Observation**: When pages are pre-rendered statically during build or cached by the CDN edge using the default server timezone, subsequent client-side hydration requests in user local timezones trigger React hydration mismatch warnings (React error #418).
* **Mechanism**: The browser receives a pre-rendered static HTML shell. The client-side hydration process evaluates the date in the local timezone, causing a mismatch with the shell structure served from the cache.

---

## 2. THREE.Clock Deprecation Warnings

### Original Warnings (Original Evidence)
In Three.js v0.184.0, using `THREE.Clock` generates repeated console deprecation warnings:
```
THREE.Clock has been deprecated and will be removed in a future release. Use THREE.Timer instead.
```

### Identified Component
* **Component**: `src/components/AntigravityBackground.tsx`
* **Root Cause**: Instantiating `new THREE.Clock()` and calling `.getElapsedTime()` to calculate elapsed frames.
* **Proposed Resolution**: Migrate to `THREE.Timer`, using `Math.min(timer.getDelta(), 0.1)` and an accumulated `simulationElapsed` float uniform to keep render ticks stable and prevent frame-drop jumps.
