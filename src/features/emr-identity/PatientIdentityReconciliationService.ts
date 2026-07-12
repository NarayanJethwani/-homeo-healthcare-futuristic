import {
  PatientIdentityCandidate,
  PatientReconciliationIssue,
  PatientReconciliationReport,
} from "./types";

function candidateKey(candidate: PatientIdentityCandidate): string {
  return `${candidate.sourceSystem}:${candidate.sourcePatientId}`;
}

function normalized(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase("en") ?? "";
}

function demographicFingerprint(candidate: PatientIdentityCandidate): string | null {
  const name = normalized(candidate.name);
  const dateOfBirth = normalized(candidate.dateOfBirth);
  const phone = normalized(candidate.phone).replace(/\D/g, "");
  const email = normalized(candidate.email);

  if (!name || (!dateOfBirth && !phone && !email)) return null;
  return [candidate.organizationId ?? "", name, dateOfBirth, phone, email].join("|");
}

function collectDuplicateIssues(
  candidates: PatientIdentityCandidate[],
  keyFor: (candidate: PatientIdentityCandidate) => string | null,
  code: "duplicate-source-id" | "duplicate-uhid" | "possible-demographic-duplicate",
  severity: "blocking" | "review",
  explanation: string,
): PatientReconciliationIssue[] {
  const groups = new Map<string, PatientIdentityCandidate[]>();

  for (const candidate of candidates) {
    const key = keyFor(candidate);
    if (!key) continue;
    const group = groups.get(key) ?? [];
    group.push(candidate);
    groups.set(key, group);
  }

  return [...groups.values()]
    .filter(group => group.length > 1)
    .map(group => ({
      code,
      severity,
      candidateKeys: group.map(candidateKey).sort(),
      explanation,
    }));
}

/**
 * Produces evidence only. This service deliberately has no repository, batch,
 * transaction, or write dependency, so a dry run cannot mutate clinical data.
 */
export function reconcilePatientIdentitiesDryRun(
  candidates: readonly PatientIdentityCandidate[],
  generatedAt = new Date().toISOString(),
): PatientReconciliationReport {
  const snapshot = candidates.map(candidate => ({ ...candidate }));
  const issues: PatientReconciliationIssue[] = [];

  for (const candidate of snapshot) {
    if (!candidate.organizationId) {
      issues.push({
        code: "missing-organization",
        severity: "blocking",
        candidateKeys: [candidateKey(candidate)],
        explanation: "Patient identity cannot be reconciled without an organization boundary.",
      });
    }
    if (!candidate.sourcePatientId.trim()) {
      issues.push({
        code: "missing-canonical-id",
        severity: "blocking",
        candidateKeys: [candidateKey(candidate)],
        explanation: "Source record has no stable patient identifier.",
      });
    }
  }

  issues.push(...collectDuplicateIssues(
    snapshot,
    candidate => `${candidate.sourceSystem}:${candidate.sourcePatientId}`,
    "duplicate-source-id",
    "blocking",
    "The same source-system patient identifier appears more than once.",
  ));
  issues.push(...collectDuplicateIssues(
    snapshot,
    candidate => candidate.organizationId && candidate.uhid
      ? `${candidate.organizationId}:${normalized(candidate.uhid)}`
      : null,
    "duplicate-uhid",
    "blocking",
    "The same UHID appears on multiple records within one organization.",
  ));
  issues.push(...collectDuplicateIssues(
    snapshot,
    demographicFingerprint,
    "possible-demographic-duplicate",
    "review",
    "Demographic fields match; a human must review before any identity mapping is approved.",
  ));

  const blockedKeys = new Set(
    issues
      .filter(issue => issue.severity === "blocking")
      .flatMap(issue => issue.candidateKeys),
  );

  return {
    mode: "dry-run",
    generatedAt,
    scannedCount: snapshot.length,
    eligibleExactMappings: snapshot.filter(candidate =>
      Boolean(candidate.organizationId && candidate.sourcePatientId.trim())
      && !blockedKeys.has(candidateKey(candidate))
    ).length,
    writeCount: 0,
    issues: issues.sort((left, right) =>
      left.code.localeCompare(right.code, "en")
      || left.candidateKeys.join("|").localeCompare(right.candidateKeys.join("|"), "en")
    ),
  };
}
