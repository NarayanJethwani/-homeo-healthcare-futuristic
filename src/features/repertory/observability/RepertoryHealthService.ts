import type { RepertoryPublishedCorpusManifest } from "../types";
import type { RepertoryRuntimeEnvironment } from "../config/runtimeEnv";

export type RepertoryHealthReport = {
  success: boolean;
  status: "healthy" | "degraded";
  storageAdapter: RepertoryRuntimeEnvironment["artifactStoreAdapter"];
  activeVersion: string;
  manifest: {
    corpusVersion: string;
    publicationStatus: RepertoryPublishedCorpusManifest["publicationStatus"];
    validationStatus: RepertoryPublishedCorpusManifest["validationStatus"];
    totalSources: number;
    totalRubrics: number;
    artifactChecksumCount: number;
  } | null;
  checks: {
    manifestHealthy: boolean;
    sampleIndexReadable: boolean;
  };
};

export function buildRepertoryHealthReport(input: {
  storageAdapter: RepertoryRuntimeEnvironment["artifactStoreAdapter"];
  activeVersion: string;
  manifest: RepertoryPublishedCorpusManifest | null;
  sampleIndex: unknown;
}): RepertoryHealthReport {
  const manifestHealthy = Boolean(
    input.manifest &&
      input.manifest.corpusVersion === input.activeVersion &&
      input.manifest.validationStatus === "passed" &&
      input.manifest.publicationStatus === "active"
  );
  const sampleIndexReadable = Boolean(input.sampleIndex && typeof input.sampleIndex === "object");
  const success =
    input.storageAdapter === "object-storage" && manifestHealthy && sampleIndexReadable;

  return {
    success,
    status: success ? "healthy" : "degraded",
    storageAdapter: input.storageAdapter,
    activeVersion: input.activeVersion,
    manifest: input.manifest
      ? {
          corpusVersion: input.manifest.corpusVersion,
          publicationStatus: input.manifest.publicationStatus,
          validationStatus: input.manifest.validationStatus,
          totalSources: input.manifest.totalSources,
          totalRubrics: input.manifest.totalRubrics,
          artifactChecksumCount: Object.keys(input.manifest.artifactChecksums || {}).length,
        }
      : null,
    checks: {
      manifestHealthy,
      sampleIndexReadable,
    },
  };
}
