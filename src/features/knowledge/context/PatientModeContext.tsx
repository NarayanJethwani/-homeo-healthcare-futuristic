"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { trackPatientModeToggle } from "../analytics/knowledgeAnalytics";

export type AudienceMode = "patient" | "student" | "practitioner";

interface PatientModeContextType {
  audienceMode: AudienceMode;
  setAudienceMode: (mode: AudienceMode) => void;
  isPatientFriendly: boolean; // Backwards compatible helper
  setIsPatientFriendly: (val: boolean) => void; // Backwards compatible helper
}

const PatientModeContext = createContext<PatientModeContextType | undefined>(undefined);

export function PatientModeProvider({ children }: { children: React.ReactNode }) {
  const [audienceMode, setAudienceModeState] = useState<AudienceMode>("patient");

  // Sync with localStorage
  useEffect(() => {
    const saved = localStorage.getItem("audience_mode_selection") as AudienceMode;
    if (saved === "patient" || saved === "student" || saved === "practitioner") {
      setAudienceModeState(saved);
    }
  }, []);

  const setAudienceMode = (mode: AudienceMode) => {
    setAudienceModeState(mode);
    localStorage.setItem("audience_mode_selection", mode);
    // Track mode changes
    trackPatientModeToggle(mode === "patient");
  };

  const setIsPatientFriendly = (val: boolean) => {
    setAudienceMode(val ? "patient" : "practitioner");
  };

  const isPatientFriendly = audienceMode === "patient";

  return (
    <PatientModeContext.Provider value={{ audienceMode, setAudienceMode, isPatientFriendly, setIsPatientFriendly }}>
      {children}
    </PatientModeContext.Provider>
  );
}

export function usePatientMode() {
  const context = useContext(PatientModeContext);
  if (!context) {
    return {
      audienceMode: "patient" as AudienceMode,
      setAudienceMode: () => {},
      isPatientFriendly: true,
      setIsPatientFriendly: () => {}
    };
  }
  return context;
}

/**
 * Text translation dictionary mapping medical jargon to layman parenthetical definitions.
 */
const JARGON_DICTIONARY: Record<string, string> = {
  "atopic dermatitis": "atopic dermatitis (eczema, a chronic inflammatory skin condition)",
  "erythrocyte sedimentation rate": "erythrocyte sedimentation rate (ESR, a blood test that detects inflammation)",
  "c-reactive protein": "c-reactive protein (CRP, a marker produced by the liver that rises during inflammation)",
  "gastroesophageal reflux disease": "gastroesophageal reflux disease (acid reflux causing heartburn)",
  "psoriasis": "psoriasis (a skin disease causing itchy, scaly red patches)",
  "urticaria": "urticaria (hives, a red and itchy skin rash triggered by allergies)",
  "hypothyroidism": "hypothyroidism (underactive thyroid gland producing insufficient hormones)",
  "hyperthyroidism": "hyperthyroidism (overactive thyroid gland producing excess hormones)",
  "glycated hemoglobin": "glycated hemoglobin (HbA1c, a test measuring average blood sugar over 3 months)",
  "creatinine": "creatinine (a waste product cleared by the kidneys, used to check kidney function)",
  "bilirubin": "bilirubin (a yellow compound formed during red blood cell breakdown, checking liver health)",
  "tsh": "TSH (Thyroid Stimulating Hormone, the master regulator of metabolic rate)",
  "cholelithiasis": "cholelithiasis (gallbladder stones)",
  "nephrolithiasis": "nephrolithiasis (kidney stones)",
  "otitis media": "otitis media (middle ear infection)",
  "dyspepsia": "dyspepsia (indigestion and upper abdominal discomfort)",
  "bronchitis": "bronchitis (inflammation of the lung's airways)",
  "allergic rhinitis": "allergic rhinitis (hay fever causing sneezing and nasal congestion)",
  "alopecia": "alopecia (hair loss)"
};

/**
 * Traverses a string and replaces medical jargon terms with simplified explanations.
 */
export function simplifyMedicalJargon(text: string): string {
  if (!text) return "";
  let simplified = text;

  // Case-insensitive replacement loops
  Object.entries(JARGON_DICTIONARY).forEach(([jargon, layman]) => {
    const regex = new RegExp(`\\b${jargon}\\b`, "gi");
    simplified = simplified.replace(regex, match => {
      // Preserve first character capitalization
      if (match[0] === match[0].toUpperCase()) {
        return layman[0].toUpperCase() + layman.slice(1);
      }
      return layman;
    });
  });

  return simplified;
}
