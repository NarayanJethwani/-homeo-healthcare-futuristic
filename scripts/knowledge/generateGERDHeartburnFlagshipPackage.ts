import fs from "fs";
import path from "path";
import { buildGERDHeartburnAuthorizationPacket } from "../../src/features/knowledge/expansion/gerdHeartburnFlagshipPackage";

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

export function generateGERDHeartburnFlagshipPackage(
  asOfDate: string,
  outputPath = path.resolve(
    __dirname,
    "../../reports/knowledge-m2-gerd-heartburn-authorization.json"
  )
): string {
  const packet = buildGERDHeartburnAuthorizationPacket();
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
  const asOfDate = readAsOfDate(process.argv.slice(2));
  const outputPath = generateGERDHeartburnFlagshipPackage(asOfDate);
  console.log(
    `Generated revision-bound GERD + Heartburn authorization packet:\n- ${outputPath}`
  );
}
