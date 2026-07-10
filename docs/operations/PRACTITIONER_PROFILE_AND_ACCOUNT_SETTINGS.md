# Practitioner Profile & Workspace Personalization Settings Manual

This operational manual documents self-service profile updates, preference configurations, access rules, security logging, and restrictions for the practitioner workspace.

---

## 1. Practitioner Profile Definition

Practitioners can fetch and display their profile credentials via the `/api/account/profile` route:

```ts
export interface PractitionerProfileView {
  id: string;
  email: string;
  displayName?: string;
  role: AdminRole;
  status: PractitionerAccountStatus;
  specialties?: string[];
  clinicLocation?: string;
  subscriptionExpiresAt?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. Safe Self-Service Mutations

Self-service changes are restricted at the API and database levels.

### Allowed Fields
Practitioners are only permitted to mutate the following personal metadata fields:
- `displayName` (string)
- `clinicLocation` (string)
- `specialties` (array of strings)

### Strictly Protected Fields
Any attempt to patch the following parameters results in a `400 Bad Request` or is stripped at the repository boundary:
- `role` (AdminRole)
- `status` (PractitionerAccountStatus)
- `subscriptionExpiresAt` (string)
- `permissions` (array of Permissions)
- `uid` / `id` (string)
- `email` (string)

---

## 3. Preferences Configuration

Workspace visual preferences can be customized:

```ts
export interface PractitionerPreferences {
  defaultDashboardTab?: string;
  compactMode?: boolean;
  showClinicalDisclaimers?: boolean;
}
```

### Safety Constraints
- Preferences cannot alter repertory scoring or clinical contraindication decision logic.
- Toggling `showClinicalDisclaimers` to `false` only hides supplementary visual tips/guidance notes and does not hide mandatory clinical safety notices.

---

## 4. Personal Security Timeline Logs

Practitioners can review their login events and administrative edits via GET `/api/account/security-activity`.
- Excludes sensitive cryptographic secrets, session cookies, raw tokens, or hashes.
- Audits all profile changes and preference updates.
