import { MASTER_REMEDY_DB } from "../src/lib/materiaMedicaDb";

console.log("--- Database Verification Script ---");

// 1. Check total count
const totalCount = MASTER_REMEDY_DB.length;
console.log(`Total remedies in MASTER_REMEDY_DB: ${totalCount}`);
if (totalCount < 1000) {
  console.error("FAIL: Database has less than 1000 remedies!");
  process.exit(1);
} else {
  console.log("PASS: Database contains >= 1000 remedies.");
}

// 2. Check for duplicate IDs
const seenIds = new Set<string>();
const duplicateIds: string[] = [];

// 3. Check for duplicate names
const seenNames = new Set<string>();
const duplicateNames: string[] = [];

// 4. Validate schema fields on every document
let invalidCount = 0;

MASTER_REMEDY_DB.forEach(rem => {
  if (seenIds.has(rem.id)) {
    duplicateIds.push(rem.id);
  }
  seenIds.add(rem.id);

  const nameLower = rem.identity.name.toLowerCase();
  if (seenNames.has(nameLower)) {
    duplicateNames.push(rem.identity.name);
  }
  seenNames.add(nameLower);

  // Validate critical fields
  const hasId = !!rem.id;
  const hasName = !!rem.identity?.name;
  const hasAbbr = !!rem.identity?.abbreviation;
  const hasKingdom = !!rem.identity?.kingdom;
  const hasFamily = !!rem.identity?.family;
  const hasEssence = !!rem.essence?.coreTheme && !!rem.essence?.centralConflict && !!rem.essence?.compensationPattern;
  const hasMentals = !!rem.mentalPicture?.personality && Array.isArray(rem.mentalPicture?.fears);
  const hasPhysicals = !!rem.physicalGenerals?.thermalState && !!rem.physicalGenerals?.thirst && Array.isArray(rem.physicalGenerals?.foodDesires);
  const hasModalities = Array.isArray(rem.modalities?.betterFrom) && Array.isArray(rem.modalities?.worseFrom);
  const hasOrgans = Array.isArray(rem.organAffinities) && rem.organAffinities.length > 0;
  const hasMiasm = !!rem.miasmaticAnalysis?.dominantMiasm && typeof rem.miasmaticAnalysis?.psora === "number";
  const hasKeynotes = Array.isArray(rem.keynotes?.top10) && rem.keynotes.top10.length > 0;

  if (!hasId || !hasName || !hasAbbr || !hasKingdom || !hasFamily || !hasEssence || !hasMentals || !hasPhysicals || !hasModalities || !hasOrgans || !hasMiasm || !hasKeynotes) {
    invalidCount++;
  }
});

console.log(`Duplicate IDs count: ${duplicateIds.length}`);
if (duplicateIds.length > 0) {
  console.error("FAIL: Duplicate IDs found:", duplicateIds);
} else {
  console.log("PASS: No duplicate IDs.");
}

console.log(`Duplicate Names count: ${duplicateNames.length}`);
if (duplicateNames.length > 0) {
  console.error("FAIL: Duplicate names found:", duplicateNames);
} else {
  console.log("PASS: No duplicate names.");
}

console.log(`Schema validation failures: ${invalidCount}`);
if (invalidCount > 0) {
  console.error("FAIL: Schema validation failed on some records.");
} else {
  console.log("PASS: All records conform to the schema.");
}