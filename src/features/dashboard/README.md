# Features: Dashboard Module Developer Guide

Welcome to the **Clinical Intelligence OS™ Dashboard Feature module** developer onboarding guide. This folder houses the modular clinical dashboard workspace.

## 1. Directory Structure

```
src/features/dashboard/
├── components/             # React presentation components
│   ├── skeletons/          # Pulse loading visual states
│   └── DashboardErrorBoundary.tsx # Catching runtime rendering failures
├── domain/                 # Pure business rules & logical entities
│   ├── patients.ts         # Patient miasmatic & severity logic
│   ├── alerts.ts           # Clinical safety thresholds
│   ├── cdss.ts             # Safety disclaimer overlays
│   └── ...
├── hooks/                  # Component logic & reactivity extraction hooks
│   ├── usePatientQueue.ts  # Selectors connector for patient listings
│   ├── useClinicalAlerts.ts# Pin/mute/acknowledge states
│   └── ...
├── services/               # UI-agnostic data retrieval & normalizing
│   ├── dashboardPatients.ts
│   ├── dashboardAnalytics.ts
│   └── ...
├── selectors/              # Calculations & mappings selectors
│   └── dashboardSelectors.ts
├── constants/              # Central static configurations & flags
│   ├── dashboardConfig.ts  # Sidebar, colors, transitions
│   └── featureFlags.ts     # Feature toggling console
├── types/                  # Typed interfaces & Branded identifier tokens
│   ├── branded.ts          # Branded ID definitions
│   └── index.ts
├── contexts/               # Light global state contexts
├── providers/              # State context wrappers
└── index.ts                # Public entry points export map
```

---

## 2. Key Architectural Guidelines

1. **Keep Services UI-Agnostic**: Services are clean TypeScript files and must never contain React imports or JSX styling. They deal strictly with domain models and normalized API returns.
2. **Selectors Over Local Loops**: Components should not filter, map, or sort data themselves. Write selectors in `selectors/dashboardSelectors.ts` and call them within hooks.
3. **Context Restriction**: Avoid storing large collections (like `patients`, `invoicesList`) in global Context. Context is meant for preferences, layout, active tabs, and filter criteria to prevent unnecessary tree re-renders.
4. **Branded Types**: Always use branded types for parameters:
   ```typescript
   import { PatientId } from "../types/branded";
   ```
5. **safety First (CDSS)**: All AI clinical decision support panels must explicitly print safety advisory text confirming they are guidelines and not final diagnostics.

---

## 3. How to Add a New Widget

1. **Define Domain Model**: If the widget introduces a new domain entity (e.g. `billing`), add `domain/billing.ts`.
2. **Add Configuration**: Put any static values, colors, or section definitions in `constants/dashboardConfig.ts`.
3. **Define Services & Selectors**:
   - Add data normalizing in `services/`.
   - Write calculation/filter code in `selectors/`.
4. **Extract Logic to Hooks**: Build a custom hook (e.g. `hooks/useBillingWidget.ts`) to handle loading, calculations, and local interaction states.
5. **Create Component**: Create the visual files under `components/` and a loading skeleton under `components/skeletons/`.
6. **Integrate with Boundary**: Render it inside `page.tsx` wrapped individually:
   ```typescript
   <DashboardErrorBoundary widgetName="Billing Summary" fallback={<BillingSkeleton />}>
     <BillingSummaryWidget />
   </DashboardErrorBoundary>
   ```
