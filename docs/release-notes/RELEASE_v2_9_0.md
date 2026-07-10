# Release Notes - v2.9.0 (Sprint 12)

**Release Date**: 2026-07-09  
**Release Tag**: `v2.9.0-auth-rbac`  
**Status**: SUCCESS / Vercel Production  

---

## Highlights
Implemented a centralized Security and Role-Based Access Control (RBAC) layer for the administrative, clinical, and editorial surfaces of the Homeo Healthcare Knowledge Platform & Clinical OS.

## Major Changes
- **Centralized RBAC Engine (`rbac.ts`)**: Defines six administrative roles (`super-admin`, `clinical-reviewer`, `editor`, `operations`, `analytics-viewer`, `read-only-admin`) and eight granular security permission keys. Normalize legacy role values (`"admin"` -> `"super-admin"`, `"doctor"` -> `"read-only-admin"`) for backwards compatibility.
- **Global Middleware Path Guard (`middleware.ts`)**: Intercepts requests matching `/admin/:path*` and `/api/admin/:path*`, redirecting unauthenticated page requests to `/admin/login` and blocking unauthenticated API calls with standard `401 Unauthorized` JSON codes.
- **Granular API Route Guard (`apiAuth.ts`)**: Integrates `authorizeRequest` API middleware guard across all administrative mutative routes to check session role permissions on route entry.
- **Permission-Aware UI Cockpit**: Restricts administrative panels, tabs, sidebars, and click buttons based on user permissions, disabling actions and presenting an `"Access Denied"` block for unauthorized attempts.
- **Audit Logger (`auditLogger.ts`)**: Logs authentication events, blocked authorization exceptions, RAG index operations, and publish actions.
