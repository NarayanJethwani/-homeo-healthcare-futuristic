import { KnowledgeRelationship } from "../types";

export const KNOWLEDGE_RELATIONSHIPS: KnowledgeRelationship[] = [
  // Diseases to Symptoms
  { source: "D0001", relation: "hasSymptom", target: "S0001" }, // GERD has Heartburn
  { source: "D0002", relation: "hasSymptom", target: "S0002" }, // Eczema has Skin Eruptions
  { source: "D0003", relation: "hasSymptom", target: "S0003" }, // Migraine has Headache
  { source: "D0004", relation: "hasSymptom", target: "S0001" }, // IBS has Heartburn/Bloating

  // Diseases to Remedies
  { source: "D0001", relation: "treatedWith", target: "R0002" }, // GERD - Nux Vomica
  { source: "D0001", relation: "treatedWith", target: "R0003" }, // GERD - Lycopodium
  { source: "D0002", relation: "treatedWith", target: "R0001" }, // Eczema - Sulphur
  { source: "D0003", relation: "treatedWith", target: "R0002" }, // Migraine - Nux Vomica
  { source: "D0003", relation: "treatedWith", target: "R0001" }, // Migraine - Sulphur
  { source: "D0004", relation: "treatedWith", target: "R0002" }, // IBS - Nux Vomica
  { source: "D0004", relation: "treatedWith", target: "R0003" }, // IBS - Lycopodium

  // Diseases to Lab Tests
  { source: "D0001", relation: "investigatedBy", target: "L0001" }, // GERD - CBC
  { source: "D0002", relation: "investigatedBy", target: "L0001" }, // Eczema - CBC
  { source: "D0003", relation: "investigatedBy", target: "L0002" }, // Migraine - TSH (rules out thyroid)

  // Symptoms to Remedies
  { source: "S0001", relation: "treatedWith", target: "R0002" }, // Heartburn - Nux Vomica
  { source: "S0001", relation: "treatedWith", target: "R0003" }, // Heartburn - Lycopodium
  { source: "S0002", relation: "treatedWith", target: "R0001" }, // Skin Eruptions - Sulphur
  { source: "S0003", relation: "treatedWith", target: "R0002" }, // Headache - Nux Vomica
  { source: "S0003", relation: "treatedWith", target: "R0001" }, // Headache - Sulphur

  // Remedy to Remedy (Relationships)
  { source: "R0001", relation: "complementaryTo", target: "R0003" }, // Sulphur - Lycopodium
  { source: "R0003", relation: "complementaryTo", target: "R0002" }, // Lycopodium - Nux Vomica
  { source: "R0002", relation: "compareWith", target: "R0003" }, // Nux Vomica compare Lycopodium
  { source: "R0001", relation: "compareWith", target: "R0002" }, // Sulphur compare Nux Vomica

  // Research to Entities
  { source: "RES-gerd-2023", relation: "supportedBy", target: "D0001" },
  { source: "RES-gerd-2023", relation: "supportedBy", target: "R0002" },

  // Case Studies to Entities
  { source: "CAS-eczema-001", relation: "supportedBy", target: "D0002" },
  { source: "CAS-eczema-001", relation: "supportedBy", target: "R0001" },
];
