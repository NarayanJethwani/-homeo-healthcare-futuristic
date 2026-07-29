import fs from "fs";
import path from "path";
import { CITATIONS } from "../../src/features/knowledge/content/citations";
import { KEP1_SOURCES } from "../../src/features/knowledge/expansion/kep1SourceDossiers";
import { buildKnowledgeSourceIntegrityReport } from "../../src/features/knowledge/expansion/sourceIntegrity";

const report = buildKnowledgeSourceIntegrityReport({
  citations: CITATIONS,
  sources: KEP1_SOURCES,
  asOfDate: "2026-07-29",
});
const outputPath = path.resolve(
  process.cwd(),
  "reports/knowledge-source-integrity.json"
);

fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
