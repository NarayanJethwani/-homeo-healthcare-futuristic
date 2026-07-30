import fs from "fs";
import path from "path";
import { buildPriorityDiseaseEvidenceManifest } from "../../src/features/knowledge/expansion/priorityDiseaseEvidence";

function readAsOfDate(argv: string[]): string {
  const index = argv.indexOf("--as-of");
  const value = index >= 0 ? argv[index + 1] : undefined;
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(
      "A deterministic --as-of YYYY-MM-DD argument is required."
    );
  }
  return value;
}

export function generatePriorityDiseaseEvidenceArtifact(
  asOfDate: string,
  outputPath = path.resolve(
    __dirname,
    "../../reports/knowledge-priority-disease-evidence.json"
  )
): string {
  const manifest = buildPriorityDiseaseEvidenceManifest();
  if (manifest.asOfDate !== asOfDate) {
    throw new Error(
      `Requested as-of date does not match governed manifest: ${asOfDate}`
    );
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  return outputPath;
}

if (require.main === module) {
  const asOfDate = readAsOfDate(process.argv.slice(2));
  const outputPath =
    generatePriorityDiseaseEvidenceArtifact(asOfDate);
  console.log(
    `Generated governed priority disease evidence preparation artifact:\n- ${outputPath}`
  );
}
