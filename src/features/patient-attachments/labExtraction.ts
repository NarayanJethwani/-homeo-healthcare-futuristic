import { 
  getAttachmentById, 
  updateAttachmentStatus, 
  createExtractedLabParameters 
} from "./attachmentRepository";
import { ExtractedLabParameter } from "./types";

export async function queueLabExtraction(attachmentId: string): Promise<ExtractedLabParameter[]> {
  const attachment = await getAttachmentById(attachmentId);
  if (!attachment) {
    throw new Error("Attachment not found.");
  }

  await updateAttachmentStatus(attachmentId, "processing");

  try {
    const mockContent = getMockTextForFileName(attachment.originalFileName);
    const params = await extractLabParametersFromText(mockContent, {
      attachmentId,
      patientId: attachment.patientId
    });

    if (params.length === 0) {
      attachment.extractionStatus = "requires-clinician-review";
      await updateAttachmentStatus(attachmentId, "review-required");
    } else {
      attachment.extractionStatus = "completed";
      await updateAttachmentStatus(attachmentId, "processed");
      await createExtractedLabParameters(attachmentId, params);
    }
    
    return params;
  } catch {
    console.error("[Lab Extraction Pipeline] Extraction failed.");
    attachment.extractionStatus = "failed";
    await updateAttachmentStatus(attachmentId, "extraction-failed");
    throw new Error("Lab extraction failed due to a system parsing error.");
  }
}

function getMockTextForFileName(fileName: string): string {
  const nameLower = fileName.toLowerCase();
  if (nameLower.includes("cbc") || nameLower.includes("hemoglobin") || nameLower.includes("blood")) {
    return "Patient Report: Hemoglobin 14.2 g/dL (normal range 12.0 - 16.0), WBC count 6.5 x10^3/uL, Platelets 250 x10^3/uL, ESR 12 mm/hr";
  }
  if (nameLower.includes("crp") || nameLower.includes("inflammation")) {
    return "Inflammatory Markers: CRP 18.5 mg/L (High, reference range < 5.0 mg/L)";
  }
  if (nameLower.includes("tsh") || nameLower.includes("thyroid")) {
    return "Thyroid Panel: TSH 5.4 uIU/mL (High, normal 0.4 - 4.5), Free T4 1.2 ng/dL, Free T3 3.1 pg/mL";
  }
  if (nameLower.includes("glucose") || nameLower.includes("hba1c") || nameLower.includes("diabetic")) {
    return "Metabolic profile: Fasting Glucose 110 mg/dL (High, normal 70-90), HbA1c 6.2% (Prediabetic, normal < 5.7%)";
  }
  if (nameLower.includes("vit") || nameLower.includes("vitamin")) {
    return "Nutritional analysis: Vitamin D 22 ng/mL (Low, normal 30-100), B12 180 pg/mL (Low, normal 200-900)";
  }
  if (nameLower.includes("liver") || nameLower.includes("sgpt") || nameLower.includes("sgot") || nameLower.includes("ast") || nameLower.includes("alt")) {
    return "Hepatic profile: SGPT/ALT 45 U/L (High, normal < 35), SGOT/AST 38 U/L (normal < 35)";
  }
  if (nameLower.includes("lipid") || nameLower.includes("cholesterol")) {
    return "Cardiovascular Risk: Total Cholesterol 220 mg/dL (High, normal < 200), LDL 140 mg/dL (High, normal < 100), HDL 45 mg/dL, Triglycerides 160 mg/dL (High)";
  }
  return "";
}

export async function extractLabParametersFromText(text: string, context: { attachmentId: string; patientId: string }): Promise<ExtractedLabParameter[]> {
  if (!text) return [];

  const parsed = parseCommonLabPatterns(text);
  const nowStr = new Date().toISOString();

  return parsed.map((item, idx) => {
    const id = "param_" + Math.random().toString(36).substr(2, 9) + `_${idx}`;
    return {
      id,
      attachmentId: context.attachmentId,
      patientId: context.patientId,
      testName: normalizeLabParameterName(item.name),
      value: item.value,
      unit: item.unit,
      referenceRange: item.referenceRange,
      flag: classifyLabFlag(item.value, item.referenceRange),
      confidence: 0.95,
      reviewStatus: "pending-review",
      createdAt: nowStr,
      updatedAt: nowStr
    };
  });
}

export function parseCommonLabPatterns(text: string): Array<{ name: string; value: string; unit?: string; referenceRange?: string }> {
  const list: Array<{ name: string; value: string; unit?: string; referenceRange?: string }> = [];

  const regexes = [
    /Hemoglobin\s*([\d\.]+)\s*(g\/dL)?(?:\s*\(normal range\s*([\d\.]+\s*-\s*[\d\.]+)\))?/i,
    /WBC\s*(?:count)?\s*([\d\.]+)\s*(x10\^3\/uL|x10\^9\/L)?/i,
    /Platelets\s*([\d\.]+)\s*(x10\^3\/uL|x10\^9\/L)?/i,
    /ESR\s*([\d\.]+)\s*(mm\/hr)?/i,
    /CRP\s*([\d\.]+)\s*(mg\/L)?(?:\s*\(.*?reference range\s*(.*?)\))?/i,
    /TSH\s*([\d\.]+)\s*(uIU\/mL|mIU\/L)?(?:\s*\(.*?normal\s*([\d\.]+\s*-\s*[\d\.]+)\))?/i,
    /Fasting\s*Glucose\s*([\d\.]+)\s*(mg\/dL)?/i,
    /HbA1c\s*([\d\.]+)\s*%/i,
    /Vitamin\s*D\s*([\d\.]+)\s*(ng\/mL)?/i,
    /B12\s*([\d\.]+)\s*(pg\/mL)?/i,
    /SGPT\/ALT\s*([\d\.]+)\s*(U\/L)?/i,
    /ALT\s*([\d\.]+)\s*(U\/L)?/i,
    /SGOT\/AST\s*([\d\.]+)\s*(U\/L)?/i,
    /AST\s*([\d\.]+)\s*(U\/L)?/i,
    /Total\s*Cholesterol\s*([\d\.]+)\s*(mg\/dL)?/i,
    /LDL\s*([\d\.]+)\s*(mg\/dL)?/i,
    /HDL\s*([\d\.]+)\s*(mg\/dL)?/i,
    /Triglycerides\s*([\d\.]+)\s*(mg\/dL)?/i,
    /Creatinine\s*([\d\.]+)\s*(mg\/dL)?/i
  ];

  const names = [
    "Hemoglobin", "WBC", "Platelets", "ESR", "CRP", "TSH", 
    "Fasting Glucose", "HbA1c", "Vitamin D", "B12", 
    "SGPT/ALT", "ALT", "SGOT/AST", "AST", 
    "Total Cholesterol", "LDL", "HDL", "Triglycerides", "Creatinine"
  ];

  for (let i = 0; i < regexes.length; i++) {
    const match = text.match(regexes[i]);
    if (match) {
      list.push({
        name: names[i],
        value: match[1],
        unit: match[2] || undefined,
        referenceRange: match[3] || undefined
      });
    }
  }

  return list;
}

export function normalizeLabParameterName(name: string): string {
  const n = name.trim().toLowerCase();
  if (n === "hb" || n === "hemoglobin") return "Hemoglobin";
  if (n === "wbc" || n === "white blood cells") return "WBC Count";
  if (n === "plt" || n === "platelets") return "Platelet Count";
  if (n === "esr") return "ESR";
  if (n === "crp") return "C-Reactive Protein (CRP)";
  if (n === "tsh") return "TSH";
  if (n === "t3") return "Free T3";
  if (n === "t4") return "Free T4";
  if (n === "fasting glucose" || n === "glucose") return "Fasting Glucose";
  if (n === "hba1c") return "HbA1c";
  if (n === "vitamin d" || n === "vit d") return "Vitamin D3";
  if (n === "b12" || n === "vitamin b12") return "Vitamin B12";
  if (n === "creatinine") return "Serum Creatinine";
  if (n === "sgpt" || n === "alt" || n === "sgpt/alt") return "SGPT (ALT)";
  if (n === "sgot" || n === "ast" || n === "sgot/ast") return "SGOT (AST)";
  if (n === "cholesterol" || n === "total cholesterol") return "Total Cholesterol";
  if (n === "ldl") return "LDL Cholesterol";
  if (n === "hdl") return "HDL Cholesterol";
  if (n === "triglycerides") return "Triglycerides";
  return name;
}

export function classifyLabFlag(value: string, referenceRange?: string): "low" | "normal" | "high" | "critical" | "unknown" {
  const valNum = parseFloat(value);
  if (isNaN(valNum)) return "unknown";

  if (!referenceRange) {
    return "normal";
  }

  const rangeClean = referenceRange.replace(/\s+/g, "");
  if (rangeClean.includes("-")) {
    const parts = rangeClean.split("-");
    const low = parseFloat(parts[0]);
    const high = parseFloat(parts[1]);
    if (!isNaN(low) && !isNaN(high)) {
      if (valNum < low) return "low";
      if (valNum > high) return "high";
      return "normal";
    }
  } else if (rangeClean.startsWith("<")) {
    const limit = parseFloat(rangeClean.substring(1));
    if (!isNaN(limit)) {
      return valNum < limit ? "normal" : "high";
    }
  } else if (rangeClean.startsWith(">")) {
    const limit = parseFloat(rangeClean.substring(1));
    if (!isNaN(limit)) {
      return valNum > limit ? "normal" : "low";
    }
  }

  return "normal";
}
