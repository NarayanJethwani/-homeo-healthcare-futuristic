import fs from "fs";
import path from "path";
import { buildEczemaSkinEruptionsAuthorizationPacket } from "../../src/features/knowledge/expansion/eczemaSkinEruptionsFlagshipPackage";

function readAsOfDate(argv: string[]): string {
  const index = argv.indexOf("--as-of");
  const value = index >= 0 ? argv[index + 1] : undefined;
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("A deterministic --as-of YYYY-MM-DD argument is required.");
  }
  return value;
}

export function generateEczemaSkinEruptionsFlagshipPackage(
  asOfDate: string,
  outputPath = path.resolve(
    __dirname,
    "../../reports/knowledge-m2-eczema-skin-eruptions-authorization.json"
  )
): string {
  const packet = buildEczemaSkinEruptionsAuthorizationPacket();
  if (packet.generatedAt !== asOfDate) {
    throw new Error(
      `Requested as-of date does not match governed package: ${asOfDate}`
    );
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  return outputPath;
}

if (require.main === module) {
  const outputPath = generateEczemaSkinEruptionsFlagshipPackage(
    readAsOfDate(process.argv.slice(2))
  );
  console.log(
    `Generated revision-bound Eczema + Skin Eruptions authorization packet:\n- ${outputPath}`
  );
}
