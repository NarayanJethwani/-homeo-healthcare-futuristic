import { KnowledgeRelationship } from "../types";

export const KNOWLEDGE_RELATIONSHIPS: KnowledgeRelationship[] = [
  // Diseases to Symptoms
  { source: "DIS-gerd", relation: "hasSymptom", target: "SYM-heartburn" },
  { source: "DIS-eczema", relation: "hasSymptom", target: "SYM-skin-eruptions" },
  { source: "DIS-migraine", relation: "hasSymptom", target: "SYM-headache" },
  { source: "DIS-ibs", relation: "hasSymptom", target: "SYM-heartburn" },

  // Diseases to Remedies
  { source: "DIS-gerd", relation: "treatedWith", target: "REM-nux-vomica" },
  { source: "DIS-gerd", relation: "treatedWith", target: "REM-lycopodium" },
  { source: "DIS-eczema", relation: "treatedWith", target: "REM-sulphur" },
  { source: "DIS-migraine", relation: "treatedWith", target: "REM-nux-vomica" },
  { source: "DIS-migraine", relation: "treatedWith", target: "REM-sulphur" },
  { source: "DIS-ibs", relation: "treatedWith", target: "REM-nux-vomica" },
  { source: "DIS-ibs", relation: "treatedWith", target: "REM-lycopodium" },

  // Diseases to Lab Tests
  { source: "DIS-gerd", relation: "investigatedBy", target: "LAB-cbc" },
  { source: "DIS-eczema", relation: "investigatedBy", target: "LAB-cbc" },
  { source: "DIS-migraine", relation: "investigatedBy", target: "LAB-tsh" }, // TSH to rule out thyroid headache

  // Symptoms to Remedies
  { source: "SYM-heartburn", relation: "treatedWith", target: "REM-nux-vomica" },
  { source: "SYM-heartburn", relation: "treatedWith", target: "REM-lycopodium" },
  { source: "SYM-skin-eruptions", relation: "treatedWith", target: "REM-sulphur" },
  { source: "SYM-headache", relation: "treatedWith", target: "REM-nux-vomica" },
  { source: "SYM-headache", relation: "treatedWith", target: "REM-sulphur" },

  // Research to Entities
  { source: "RES-gerd-2023", relation: "supportedBy", target: "DIS-gerd" },
  { source: "RES-gerd-2023", relation: "supportedBy", target: "REM-nux-vomica" },

  // Case Studies to Entities
  { source: "CAS-eczema-001", relation: "supportedBy", target: "DIS-eczema" },
  { source: "CAS-eczema-001", relation: "supportedBy", target: "REM-sulphur" },
];
