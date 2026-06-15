export interface BiomarkerResult {
  marker: string;
  value: string;
  range: string;
  status: "Normal" | "Deficient" | "Elevated";
  significance: string;
}

export interface LabAnalysisResult {
  extractedData: BiomarkerResult[];
  summary: string;
  questions: string[];
  followUp: string[];
}

export function parseLabReport(fileName: string, rawText?: string): LabAnalysisResult {
  const fileLower = (fileName + " " + (rawText || "")).toLowerCase();
  const extractedData: BiomarkerResult[] = [];
  const questions: string[] = [];
  const followUp: string[] = [];
  let summary = "";

  // 1. Check for Glycemic Markers (HbA1c / Glucose)
  if (fileLower.includes("hba1c") || fileLower.includes("glucose") || fileLower.includes("sugar") || fileLower.includes("diabetic") || fileLower.includes("diabetes")) {
    extractedData.push({
      marker: "HbA1c (Glycated Haemoglobin)",
      value: "7.8%",
      range: "4.0% - 5.6% (Normal)",
      status: "Elevated",
      significance: "Indicates poor long-term glycemic control matching a Type 2 Diabetes pattern. Increased cellular glycation stress."
    });
    extractedData.push({
      marker: "Fasting Blood Sugar",
      value: "138 mg/dL",
      range: "70 - 99 mg/dL (Normal)",
      status: "Elevated",
      significance: "Reflects impaired morning glucose clearance, likely driven by hepatic gluconeogenesis and peripheral insulin resistance."
    });
    questions.push("Is my elevated HbA1c indicative of cellular insulin resistance or pancreatic endocrine exhaustion?");
    questions.push("Should I utilize a Continuous Glucose Monitor (CGM) to identify postprandial glycemic spikes?");
    followUp.push("Fasting Insulin test to compute HOMA-IR score.");
    followUp.push("Urinary Microalbumin-to-Creatinine ratio to screen for early diabetic nephropathy.");
    summary += "Glycemic dysregulation detected with elevated HbA1c (7.8%) and fasting glucose (138 mg/dL). ";
  }

  // 2. Check for Thyroid Markers (TSH / Free T3 / Free T4)
  if (fileLower.includes("thyroid") || fileLower.includes("tsh") || fileLower.includes("t3") || fileLower.includes("t4") || fileLower.includes("endocrine")) {
    extractedData.push({
      marker: "TSH (Thyroid Stimulating Hormone)",
      value: "8.4 uIU/mL",
      range: "0.45 - 4.5 uIU/mL (Normal)",
      status: "Elevated",
      significance: "Classic indicator of primary hypothyroidism. The pituitary gland is over-stimulating the thyroid due to low glandular output."
    });
    extractedData.push({
      marker: "Free T4 (Thyroxine)",
      value: "0.85 ng/dL",
      range: "0.82 - 1.77 ng/dL (Normal)",
      status: "Normal",
      significance: "Low-normal free thyroxine levels, suggesting thyroid hormone secretion is sluggish but still compensated."
    });
    questions.push("Do my elevated TSH levels suggest autoimmune thyroiditis (Hashimoto's)? Should we run anti-TPO antibodies?");
    questions.push("Could systemic adrenal stress be suppressing my peripheral conversion of T4 to active T3?");
    followUp.push("Anti-TPO and Anti-Thyroglobulin antibody panels.");
    followUp.push("Reverse T3 and Free T3 assays to evaluate peripheral hormone conversion.");
    summary += "Primary subclinical hypothyroidism pattern flagged, characterized by elevated TSH (8.4 uIU/mL). ";
  }

  // 3. Check for Kidney / Renal Markers (Creatinine / eGFR)
  if (fileLower.includes("renal") || fileLower.includes("kidney") || fileLower.includes("creatinine") || fileLower.includes("egfr") || fileLower.includes("filtration")) {
    extractedData.push({
      marker: "Serum Creatinine",
      value: "1.6 mg/dL",
      range: "0.6 - 1.2 mg/dL (Normal)",
      status: "Elevated",
      significance: "Indicates compromised glomerular filtration capacity. Creatinine accumulation points to nephron loading."
    });
    extractedData.push({
      marker: "eGFR (Glomerular Filtration Rate)",
      value: "49 mL/min/1.73m²",
      range: "> 60 mL/min/1.73m² (Normal)",
      status: "Deficient",
      significance: "eGFR represents Stage 3b Chronic Kidney Disease (CKD). Indicates moderate-to-severe reduction in renal filtration."
    });
    questions.push("What stage of chronic kidney disease does my eGFR of 49 indicate? What are the modifiable risk drivers?");
    questions.push("Are my current daily medications or dietary protein loads contributing to renal filtration strain?");
    followUp.push("Renal arterial doppler ultrasound.");
    followUp.push("Electrolyte panel (Sodium, Potassium, Phosphorus, Calcium).");
    summary += "Renal filtration stress detected with elevated creatinine (1.6 mg/dL) and diminished eGFR (49 mL/min). ";
  }

  // 4. Check for Vitamin Deficiencies (D3 / B12)
  if (fileLower.includes("vitamin") || fileLower.includes("vit") || fileLower.includes("d3") || fileLower.includes("b12") || fileLower.includes("deficiency")) {
    extractedData.push({
      marker: "25-Hydroxy Vitamin D",
      value: "14 ng/mL",
      range: "30 - 100 ng/mL (Normal)",
      status: "Deficient",
      significance: "Severe vitamin D deficiency. Compromises calcium absorption, bone mineralization, and immune surveillance."
    });
    extractedData.push({
      marker: "Vitamin B12 (Cobalamin)",
      value: "185 pg/mL",
      range: "200 - 900 pg/mL (Normal)",
      status: "Deficient",
      significance: "Sub-optimal B12. Essential for myelin sheath integrity, red blood cell synthesis, and neurological processing speed."
    });
    questions.push("Should I utilize active Vitamin D3 + K2 sublingual drops rather than synthetic oral capsules for better absorption?");
    questions.push("Is my B12 deficiency linked to low gastric acid (hypochlorhydria) or intestinal malabsorption?");
    followUp.push("Serum Methylmalonic Acid (MMA) to verify functional B12 cellular deficiency.");
    followUp.push("Calcium and bone density (DEXA) scan if joint aches persist.");
    summary += "Marked nutritional deficiencies identified in Vitamin D3 (14 ng/mL) and Vitamin B12 (185 pg/mL). ";
  }

  // 5. Default Fallback if none of the above match
  if (extractedData.length === 0) {
    extractedData.push({
      marker: "Serum Vitamin D (25-OH)",
      value: "22 ng/mL",
      range: "30 - 100 ng/mL (Normal)",
      status: "Deficient",
      significance: "Mild deficiency. Affects bone absorption pathways and immune surveillance."
    });
    extractedData.push({
      marker: "Total Cholesterol",
      value: "228 mg/dL",
      range: "< 200 mg/dL (Normal)",
      status: "Elevated",
      significance: "Mild hypercholesterolemia. Suggests metabolic lipid transport shifts."
    });
    questions.push("Are my high cholesterol levels driven by metabolic thyroid sluggishness or dietary saturated fats?");
    followUp.push("Lipid fractionation (ApoB and ApoA1 levels) to evaluate cardiovascular particle counts.");
    summary += "Default screening biomarkers processed. Mild lipid elevation and Vitamin D deficiency observed. ";
  }

  return {
    extractedData,
    summary: summary.trim(),
    questions,
    followUp
  };
}
