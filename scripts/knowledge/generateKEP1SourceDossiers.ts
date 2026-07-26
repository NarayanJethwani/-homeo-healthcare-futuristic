import fs from "fs";
import path from "path";
import { buildKEP1SourceDossierManifest } from "../../src/features/knowledge/expansion/kep1SourceDossiers";

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

export function generateKEP1SourceDossierArtifact(
  asOfDate: string,
  outputPath = path.resolve(
    __dirname,
    "../../reports/knowledge-kep1-source-dossiers.json"
  )
): string {
  const manifest = buildKEP1SourceDossierManifest();
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
  const outputPath = generateKEP1SourceDossierArtifact(asOfDate);
  console.log(`Generated governed KEP-1 source dossier artifact:\n- ${outputPath}`);
}
