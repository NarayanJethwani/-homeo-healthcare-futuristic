export interface ClinicalQuotationPdfItem {
  label: string;
  amount: number;
}

export interface ClinicalQuotationPdfData {
  quotationId: string;
  patientName: string;
  issuedAt: string;
  validUntil: string;
  approvalStatus: string;
  recommendedPathway: string;
  selectedPathway: string;
  selectionMode: string;
  manualSelectionReason?: string;
  carePeriodWeeks: number;
  weeklyFee: number;
  rationale: string[];
  items: ClinicalQuotationPdfItem[];
  concessionAmount: number;
  finalTotal: number;
  pricingRuleVersion: string;
}

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

function cleanText(value: unknown) {
  return String(value ?? "")
    .replaceAll("₹", "Rs. ")
    .replace(/[–—]/g, "-")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function wrap(value: string, max = 82) {
  const words = cleanText(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}

function text(command: string[], value: string, x: number, y: number, size = 10, bold = false, color = "0.12 0.18 0.20") {
  command.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg ${x} ${y} Td (${cleanText(value)}) Tj ET`);
}

function money(value: number) {
  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

export function buildClinicalQuotationPdf(data: ClinicalQuotationPdfData): Uint8Array {
  const commands: string[] = [];
  commands.push("0.055 0.102 0.145 rg 0 742 595 100 re f");
  commands.push("0.12 0.73 0.66 rg 0 735 595 7 re f");
  text(commands, "Homeo Healthcare", 44, 794, 24, true, "1 1 1");
  text(commands, "Physician-reviewed clinical care quotation", 44, 773, 11, false, "0.75 0.89 0.87");
  text(commands, data.quotationId, 430, 794, 10, true, "0.75 0.89 0.87");

  let y = 705;
  text(commands, `Patient: ${data.patientName}`, 44, y, 13, true); y -= 20;
  text(commands, `Issued: ${new Date(data.issuedAt).toLocaleDateString("en-IN")}   Valid until: ${new Date(data.validUntil).toLocaleDateString("en-IN")}`, 44, y, 9); y -= 16;
  text(commands, `Approval status: ${data.approvalStatus.replaceAll("-", " ")}`, 44, y, 9, true, "0.04 0.48 0.43"); y -= 29;

  text(commands, "CARE DECISION", 44, y, 10, true, "0.04 0.48 0.43"); y -= 18;
  text(commands, `Recommended pathway: ${data.recommendedPathway}`, 44, y, 10); y -= 16;
  text(commands, `Physician-selected pathway: ${data.selectedPathway}`, 44, y, 11, true); y -= 16;
  text(commands, `Selection mode: ${data.selectionMode.replaceAll("-", " ")}`, 44, y, 9); y -= 16;
  if (data.manualSelectionReason) {
    for (const line of wrap(`Documented reason: ${data.manualSelectionReason}`)) { text(commands, line, 44, y, 9); y -= 13; }
  }
  text(commands, `Care period: ${data.carePeriodWeeks} ${data.carePeriodWeeks === 1 ? "week" : "weeks"} at ${money(data.weeklyFee)} per week`, 44, y, 10, true); y -= 25;
  if (data.carePeriodWeeks === 1 && !data.selectedPathway.toLowerCase().includes("acute")) {
    text(commands, "One-week initial care period - physician reassessment is required before continuation.", 44, y, 8, true, "0.70 0.38 0.02"); y -= 22;
  }

  text(commands, "CLINICAL RATIONALE", 44, y, 10, true, "0.04 0.48 0.43"); y -= 17;
  for (const reason of data.rationale.slice(0, 5)) {
    for (const line of wrap(`- ${reason}`)) { text(commands, line, 50, y, 8.5); y -= 12; }
  }
  y -= 8;
  text(commands, "ITEMIZED PENDING QUOTATION", 44, y, 10, true, "0.04 0.48 0.43"); y -= 18;
  for (const item of data.items) {
    text(commands, item.label, 50, y, 9);
    text(commands, money(item.amount), 445, y, 9, true);
    y -= 16;
  }
  if (data.concessionAmount > 0) {
    text(commands, "Documented concession", 50, y, 9);
    text(commands, `- ${money(data.concessionAmount)}`, 445, y, 9, true, "0.25 0.25 0.60"); y -= 18;
  }
  commands.push(`0.82 0.87 0.88 RG 44 ${y + 9} 507 1 re f`);
  text(commands, "Pending quotation total", 50, y - 7, 13, true);
  text(commands, money(data.finalTotal), 425, y - 7, 13, true, "0.04 0.48 0.43");

  text(commands, "No payment is requested by this document. Patient approval and physician confirmation precede invoicing.", 44, 75, 8.5, true, "0.28 0.36 0.40");
  text(commands, `Pricing record: ${data.pricingRuleVersion}`, 44, 58, 7.5, false, "0.40 0.46 0.50");
  text(commands, "Homeo Healthcare | Individual clinical care", 44, 40, 8, true, "0.04 0.48 0.43");

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}
