import fs from "fs";
import path from "path";
import { buildFlagshipPilotManifest } from "../../src/features/knowledge/expansion/flagshipPilot";
import { generateKnowledgeExpansionInventory } from "../../src/features/knowledge/expansion/inventoryService";

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

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function generateExpansionArtifacts(
  asOfDate: string,
  outputRoot = path.resolve(__dirname, "../../reports")
): { inventoryPath: string; pilotPath: string } {
  const inventory = generateKnowledgeExpansionInventory(asOfDate);
  const pilot = buildFlagshipPilotManifest(inventory);
  const inventoryPath = path.join(
    outputRoot,
    "knowledge-expansion-inventory.json"
  );
  const pilotPath = path.join(
    outputRoot,
    "knowledge-flagship-pilot-manifest.json"
  );

  writeJson(inventoryPath, inventory);
  writeJson(pilotPath, pilot);

  return { inventoryPath, pilotPath };
}

if (require.main === module) {
  const asOfDate = readAsOfDate(process.argv.slice(2));
  const paths = generateExpansionArtifacts(asOfDate);
  console.log(
    `Generated governed Knowledge expansion artifacts:\n- ${paths.inventoryPath}\n- ${paths.pilotPath}`
  );
}
