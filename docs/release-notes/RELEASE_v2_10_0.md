# Release Notes - v2.10.0 (Sprint 13)

**Release Date**: 2026-07-09  
**Release Tag**: `v2.10.0-practitioner-lifecycle`  
**Status**: SUCCESS / Vercel Production  

---

## Highlights
Implemented a comprehensive practitioner account lifecycle, one-time invitation management system, and administrative user cockpit. Built timing-safe cryptographic verification checks, protected routes, and a glassmorphism administration cockpit.

## Major Changes
- **Permissions Update**: Registered the `SUBSCRIPTION_MANAGE` permission and mapped it to the `super-admin` role, separating license expiration date extensions from general account management (`USER_MANAGE`).
- **Cryptographic Token Service (`invitationTokenService.ts`)**: Built a cryptographically secure token generator using 256-bit random bytes, generating timing-safe SHA-256 hashes for storage and validation. Raw invitation tokens are displayed exactly once and never written to persistence or logs.
- **Practitioner Repository (`practitionerRepository.ts`)**: Created Firestore repository collections (`practitioner_accounts` and `practitioner_invitations`) with memory fallbacks. Implemented duplicate invite blocks, role override prevention, suspensions, reactivations, and subscription renewals.
- **11 Guarded API Endpoints**:
  - `/api/admin/users`: GET list practitioners. (Requires `USER_MANAGE`)
  - `/api/admin/users/[userId]`: GET profile / PATCH update. (Requires `USER_MANAGE`)
  - `/api/admin/users/invite`: POST create invitation, showing token once. (Requires `USER_MANAGE`)
  - `/api/admin/users/invitations`: GET list invitations, hiding tokenHash. (Requires `USER_MANAGE`)
  - `/api/admin/users/invitations/[inviteId]/revoke`: POST revoke invitation. (Requires `USER_MANAGE`)
  - `/api/admin/users/[userId]/role`: POST change role. (Requires `USER_MANAGE`)
  - `/api/admin/users/[userId]/suspend`: POST suspend account. (Requires `USER_MANAGE`)
  - `/api/admin/users/[userId]/reactivate`: POST reactivate account. (Requires `USER_MANAGE`)
  - `/api/admin/users/[userId]/deactivate`: POST deactivate account. (Requires `USER_MANAGE`)
  - `/api/admin/users/[userId]/subscription`: POST extend subscription. (Requires `SUBSCRIPTION_MANAGE`)
  - `/api/admin/invitations/accept`: Onboarding route exempt from admin middleware session checks, but timing-safely matches token hashes. (Token-protected)
- **UI Administration Dashboard Panel**: Created a high-density glassmorphism Practitioner Management tab within the single pane of glass dashboard, showing status statistics, list grids, invite modals, and role downgrade confirmations.
- **Automated Lifecycle Tests (`tests/practitionerLifecycle.test.ts`)**: Programmed 23 test targets verifying token generation, expiry boundaries, deactivations, self-escalation blocks, standardized responses, and dev memory fallbacks.
- **Production Verification Script**: Expanded `verify-production-readiness.ts` to assert that all practitioner lifecycle models exist and that all user routes are fully guarded.
