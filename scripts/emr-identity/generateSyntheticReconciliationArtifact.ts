import { createHash } from "crypto";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { buildPatientIdentityInventoryReport } from "../../src/features/emr-identity/PatientIdentityInventoryService";
import type {
  PatientIdentityCandidate,
  PatientIdentityInventoryReport,
  PatientLinkedRecordReference,
  PatientPortalLinkReference,
} from "../../src/features/emr-identity/types";

export const EMR_IDENTITY_ARTIFACT_SCHEMA_VERSION = 1;
export const EMR_IDENTITY_RECONCILIATION_TOOL_VERSION = "2.14.0-preview.1";
export const DEFAULT_SYNTHETIC_PAGE_SIZE = 250;

export interface SyntheticPatientIdentityDataset {
  classification: "synthetic";
  datasetId: string;
  patients: PatientIdentityCandidate[];
  portalLinks: PatientPortalLinkReference[];
  linkedRecords: PatientLinkedRecordReference[];
}

export interface PatientIdentityReconciliationArtifact {
  schemaVersion: 1;
  toolVersion: string;
  classification: "synthetic";
  datasetId: string;
  generatedAt: string;
  pageSize: number;
  pageCounts: {
    patients: number;
    portalLinks: number;
    linkedRecords: number;
  };
  inputChecksum: string;
  reportChecksum: string;
  report: PatientIdentityInventoryReport;
  artifactChecksum: string;
}

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([key, entry]) => [key, canonicalValue(entry)]),
    );
  }
  return value;
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(canonicalValue(value));
}

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function pageCount(length: number, pageSize: number): number {
  return length === 0 ? 0 : Math.ceil(length / pageSize);
}

function validateDataset(value: unknown): asserts value is SyntheticPatientIdentityDataset {
  if (!value || typeof value !== "object") throw new Error("Dataset must be a JSON object.");
  const dataset = value as Partial<SyntheticPatientIdentityDataset>;
  if (dataset.classification !== "synthetic") {
    throw new Error("Refusing dataset: classification must be exactly 'synthetic'.");
  }
  if (typeof dataset.datasetId !== "string" || !dataset.datasetId.trim()) {
    throw new Error("Synthetic datasetId is required.");
  }
  if (!Array.isArray(dataset.patients) || !Array.isArray(dataset.portalLinks) || !Array.isArray(dataset.linkedRecords)) {
    throw new Error("Synthetic dataset arrays are required.");
  }
}

function validatePageSize(pageSize: number): void {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 1_000) {
    throw new Error("Page size must be an integer between 1 and 1000.");
  }
}

export function createSyntheticReconciliationArtifact(
  input: unknown,
  options: { generatedAt: string; pageSize?: number },
): PatientIdentityReconciliationArtifact {
  validateDataset(input);
  const pageSize = options.pageSize ?? DEFAULT_SYNTHETIC_PAGE_SIZE;
  validatePageSize(pageSize);

  const report = buildPatientIdentityInventoryReport({
    patients: input.patients,
    portalLinks: input.portalLinks,
    linkedRecords: input.linkedRecords,
  }, options.generatedAt);
  const inputChecksum = sha256(stableStringify(input));
  const reportChecksum = sha256(stableStringify(report));
  const unsigned = {
    schemaVersion: EMR_IDENTITY_ARTIFACT_SCHEMA_VERSION as 1,
    toolVersion: EMR_IDENTITY_RECONCILIATION_TOOL_VERSION,
    classification: "synthetic" as const,
    datasetId: input.datasetId,
    generatedAt: options.generatedAt,
    pageSize,
    pageCounts: {
      patients: pageCount(input.patients.length, pageSize),
      portalLinks: pageCount(input.portalLinks.length, pageSize),
      linkedRecords: pageCount(input.linkedRecords.length, pageSize),
    },
    inputChecksum,
    reportChecksum,
    report,
  };

  return {
    ...unsigned,
    artifactChecksum: sha256(stableStringify(unsigned)),
  };
}

export function verifySyntheticReconciliationArtifact(
  artifact: PatientIdentityReconciliationArtifact,
): boolean {
  const { artifactChecksum, ...unsigned } = artifact;
  return artifact.classification === "synthetic"
    && artifact.schemaVersion === EMR_IDENTITY_ARTIFACT_SCHEMA_VERSION
    && artifact.report.writeCount === 0
    && artifact.reportChecksum === sha256(stableStringify(artifact.report))
    && artifactChecksum === sha256(stableStringify(unsigned));
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf("--input");
  const outputIndex = args.indexOf("--output");
  const generatedAtIndex = args.indexOf("--generated-at");
  if (inputIndex < 0 || outputIndex < 0 || generatedAtIndex < 0) {
    throw new Error("Usage: --input <synthetic.json> --output <artifact.json> --generated-at <ISO timestamp>");
  }

  const inputPath = resolve(args[inputIndex + 1]);
  const outputPath = resolve(args[outputIndex + 1]);
  const generatedAt = args[generatedAtIndex + 1];
  if (!generatedAt || Number.isNaN(Date.parse(generatedAt))) throw new Error("A valid --generated-at timestamp is required.");

  const dataset = JSON.parse(await readFile(inputPath, "utf8")) as unknown;
  const artifact = createSyntheticReconciliationArtifact(dataset, { generatedAt });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  process.stdout.write(`Synthetic reconciliation artifact created: ${outputPath}\n`);
  process.stdout.write(`Artifact checksum: ${artifact.artifactChecksum}\n`);
}

if (require.main === module) {
  run().catch(error => {
    process.stderr.write(`${error instanceof Error ? error.message : "Artifact generation failed."}\n`);
    process.exitCode = 1;
  });
}
