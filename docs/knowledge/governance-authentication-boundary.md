# Knowledge Governance Authentication Boundary & Server Isolation

**Version**: 1.0.0  
**Effective Date**: 2026-07-25  

---

## 1. Executive Security Policy

All governance operations must execute strictly behind verified server boundaries (`deriveGovernanceAuthContext`). The system rejects all client-supplied identity overrides, role spoofing, or request-body actor claims.

---

## 2. Authenticated Governance Context

```ts
export interface AuthenticatedGovernanceContext {
  accountId: string;
  contributorId?: ContributorId;
  roles: GovernanceRole[];
  permissions: GovernancePermission[];
}
```

1. **Server Cookie Verification**: Derived via `verifyAdminSessionCookie` (HMAC SHA-256 signed session token).
2. **Body Spoofing Neutralization**: All body parameters named `actorId`, `contributorId`, `roles`, `permissions`, or `accountOverride` are automatically purged by `sanitizeGovernanceRequestBody`.
3. **Fail-Closed Contributor Mapping**: If an authenticated session `uid` does not map to a recognized active contributor in the registry, `contributorId` is `undefined`, and all write operations fail closed with `UNMAPPED_CONTRIBUTOR` (HTTP status 403).
