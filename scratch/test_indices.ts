import { calculateClinicalIndices } from "../src/lib/repertoryData";

// Simulate high severity symptoms to push stress load and anxiety indices high
const testSymptoms = [
  { rubricId: "gerd_reflux", severity: 10, frequency: "Constant", impact: "Severe" },
  { rubricId: "ibs_bloat", severity: 10, frequency: "Constant", impact: "Severe" },
  { rubricId: "anxiety_panic", severity: 10, frequency: "Constant", impact: "Severe" },
  { rubricId: "insomnia_sleep", severity: 10, frequency: "Constant", impact: "Severe" },
  { rubricId: "eczema_skin", severity: 10, frequency: "Constant", impact: "Severe" },
  { rubricId: "burnout_fatigue", severity: 10, frequency: "Constant", impact: "Severe" }
];

const results = calculateClinicalIndices(testSymptoms as any);
console.log("--- Calculation Results ---");
console.log(JSON.stringify(results, null, 2));

const allInRange = Object.entries(results).every(([key, val]) => {
  return typeof val === "number" && val >= 0 && val <= 100;
});

if (allInRange) {
  console.log("SUCCESS: All calculated indices are strictly clamped within [0, 100] range.");
} else {
  console.error("FAIL: Calculated index out of bounds [0, 100]!");
  process.exit(1);
}
