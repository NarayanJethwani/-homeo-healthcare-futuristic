# Repertory Doctor Pilot Runbook

## Default state

Doctor pilot access is disabled unless both server-only settings are present:

```text
REPERTORY_DOCTOR_PILOT_ENABLED=true
REPERTORY_DOCTOR_PILOT_UIDS=<comma-separated Firebase UIDs>
```

Missing, malformed, empty, or false values keep the pilot disabled. The UID list accepts at most 50 Firebase-style UIDs. These variables must never use a `NEXT_PUBLIC_` prefix.

## Eligibility gate

A pilot request is permitted only when all conditions pass:

1. The request has a valid signed practitioner session.
2. The session role is `doctor` or `read-only-admin`.
3. The server pilot switch is enabled.
4. The signed-in UID is explicitly allow-listed.
5. The matching practitioner account has organization and clinic identifiers.
6. The account is active and its subscription has not expired.
7. The account has the exact `search` or `repertorize` capability requested.

Existing super-administrator access continues through shared RBAC. The pilot does not modify shared or frozen domain roles.

## Pilot activation

Before activation, verify the practitioner's account record contains:

```text
uid
organizationId
clinicId
status=active
repertoryCapabilities=[search] or [search,repertorize]
```

Enable one doctor first. Validate authenticated search before enabling repertorization. Review the repertory health endpoint and security audit logs during the pilot.

## Rollback

Set `REPERTORY_DOCTOR_PILOT_ENABLED=false` and redeploy. Stored practitioner entitlements remain intact, but doctor requests fail closed with `403`. Super-administrator access is unaffected.
