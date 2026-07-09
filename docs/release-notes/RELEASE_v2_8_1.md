# Release Notes - v2.8.1 (Treatment Planner UX Refinements)

## Release Information
- **Release Version**: `2.8.1`
- **Release Tag**: `v2.8.1-ux-refinements`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Clean Next.js static build success

## Summary of Changes
V2.8.1 delivers user experience updates to the public-facing Treatment Planner, emphasizing patient-friendly clinical terminology and defaulting planner widgets to monthly billing cycles.

### 1. Default Billing Cycle Alignment
- Updated the default `billingCycle` and `catalogBillingCycle` states from `"weekly"` to `"monthly"` on the public store page.
- Aligned public-facing plan listings and pricing calculators to present monthly subscription prices on initial load.

### 2. Patient-Friendly Concession Rename
- Replaced administrative `"Custom Override"` / `"Override"` terminology with `"Special Clinical Concession"` on all patient-facing interfaces.
- Updated the Treatment Planner summary display and the dynamically formatted WhatsApp message templates in `src/app/admin/dashboard/page.tsx` and `src/app/admin/mock-sheet/page.tsx`.
- Updated the walk-in checkout dropdown and generated checkout metadata in `src/app/store/page.tsx`.
