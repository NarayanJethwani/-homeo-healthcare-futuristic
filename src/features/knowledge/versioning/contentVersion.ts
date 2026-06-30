
export interface VersionChangeRecord {
  version: string;
  date: string;
  author: string;
  changes: string[];
}

export const PLATFORM_VERSION_MANIFEST = {
  currentVersion: "1.0.0",
  compatibleVersionRange: ">=1.0.0 <2.0.0",
};

/**
 * Validates version format (Semantic Versioning e.g. 1.2.0)
 */
export function isValidSemver(version: string): boolean {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  return semverRegex.test(version);
}

/**
 * Formulates a change log entry
 */
export function formatChangeLogEntry(record: VersionChangeRecord): string {
  return `[v${record.version}] ${record.date} by ${record.author}: ${record.changes.join("; ")}`;
}
