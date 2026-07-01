export interface ReportExtractionResult {
  clinicalImpressions: string;
  labs: string;
  imaging: string;
  currentMeds: string;
  pastTreatments: string;
  thermal: string | null;
  miasm: string[];
  energy: number | null;
  confidenceLevels: Record<string, "High" | "Medium" | "Low">;
  sourceEvidence: Record<string, { text: string; page?: number }>;
  reportType: "lab" | "prescription" | "imaging";
  fileNameHash: string;
}
