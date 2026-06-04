import { getAll15000Diagnoses, getIcdDiagnosis, CURATED_DIAGNOSES } from "../src/lib/clinicalDiagnosisLibrary";

console.log("Total curated diagnoses:", CURATED_DIAGNOSES.length);
const all = getAll15000Diagnoses();
console.log("Total dynamic diagnoses:", all.length);

// Test matching inguinal hernia
console.log("\n--- Testing Inguinal Hernia Search ---");
const match1 = getIcdDiagnosis("inguinal hernia");
console.log("Match for 'inguinal hernia':", match1 ? `${match1.name} (ID: ${match1.id}, ICD-10: ${match1.icd10})` : "NOT FOUND");

const match2 = getIcdDiagnosis("groin hernia");
console.log("Match for 'groin hernia':", match2 ? `${match2.name} (ID: ${match2.id}, ICD-10: ${match2.icd10})` : "NOT FOUND");

// Test search logic and sorting
console.log("\n--- Testing Alphabetical Sorting (First 15 items) ---");
const query = ""; // Empty query to check full list sorting
const listToReturn = [...all];

// Sort: Curated items first, then others, both ordered A-Z alphabetically by name
listToReturn.sort((a, b) => {
  const aIsCurated = CURATED_DIAGNOSES.some(cd => cd.id === a.id);
  const bIsCurated = CURATED_DIAGNOSES.some(cd => cd.id === b.id);
  
  if (aIsCurated && !bIsCurated) return -1;
  if (!aIsCurated && bIsCurated) return 1;
  
  return a.name.localeCompare(b.name);
});

console.log("Top 5 Curated (should be alphabetical):");
listToReturn.slice(0, 5).forEach((d, i) => {
  const isCurated = CURATED_DIAGNOSES.some(cd => cd.id === d.id);
  console.log(`${i+1}. [Curated: ${isCurated}] ${d.name}`);
});

console.log("\nNext 10 Items (should be dynamic, sorted A-Z starting with A):");
listToReturn.slice(10, 20).forEach((d, i) => {
  const isCurated = CURATED_DIAGNOSES.some(cd => cd.id === d.id);
  console.log(`${i+11}. [Curated: ${isCurated}] ${d.name}`);
});
