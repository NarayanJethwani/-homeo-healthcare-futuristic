import { REMEDIES_METADATA } from "../../../lib/repertoryData";
import { getKnownRemedyAliases } from "../../repertory/engine/remedyNormalizer";

// Compile remedy terms from the governed read interfaces at startup
const REMEDY_VOCABULARY = new Set<string>();

// 1. Add metadata abbreviations and full names
Object.keys(REMEDIES_METADATA).forEach(abbr => {
  REMEDY_VOCABULARY.add(abbr.normalize("NFC").toLowerCase());
  const meta = REMEDIES_METADATA[abbr];
  if (meta && meta.fullName) {
    REMEDY_VOCABULARY.add(meta.fullName.normalize("NFC").toLowerCase());
    // Also add parts of the name (e.g. "Arnica" from "Arnica montana")
    const parts = meta.fullName.split(/\s+/);
    if (parts[0] && parts[0].length > 3) {
      REMEDY_VOCABULARY.add(parts[0].normalize("NFC").toLowerCase());
    }
  }
});

// 2. Add aliases from the remedy normalizer
const aliases = getKnownRemedyAliases();
Object.keys(aliases).forEach(alias => {
  REMEDY_VOCABULARY.add(alias.normalize("NFC").toLowerCase());
  const target = aliases[alias];
  REMEDY_VOCABULARY.add(target.normalize("NFC").toLowerCase());
});

// Explicit extra common remedy terms to ensure robust coverage
const EXTRA_REMEDY_TERMS = [
  "arnica", "pulsatilla", "lachesis", "sulphur", "sulfur", "calc-carb", 
  "lycopodium", "belladonna", "gelsemium", "silicea", "nux vomica", "nux-v",
  "arsenicum", "ars-alb", "nat-mur", "natrum mur", "phosphorus", "aconite",
  "bryonia", "sepia", "apis", "rhus-tox", "rhus tox"
];
EXTRA_REMEDY_TERMS.forEach(t => REMEDY_VOCABULARY.add(t.normalize("NFC").toLowerCase()));

export class OutputValidator {
  /**
   * Validates generated LLM response.
   * If any safety rule is violated:
   *  - patient/public mode: returns deterministic patient fallback disclaimer.
   *  - doctor mode: returns deterministic doctor fallback disclaimer.
   * Under no circumstances is the original unsafe output logged or returned.
   */
  public static validate(text: string, mode: "public" | "patient" | "doctor"): { valid: boolean; response: string } {
    if (!text) {
      return { valid: true, response: "" };
    }

    const normalizedText = text.normalize("NFC");
    const lowerText = normalizedText.toLowerCase();

    // 1. General Secret Leaks Protection (Defense-in-depth)
    const secretKeywords = [
      "clinical_pseudonymization_secret", 
      "admin_session_secret", 
      "session_secret"
    ];
    for (const kw of secretKeywords) {
      if (lowerText.includes(kw)) {
        return {
          valid: false,
          response: this.getDisclaimer(mode)
        };
      }
    }

    // 2. Patient & Public Mode Validation Rules
    if (mode === "public" || mode === "patient") {
      // Rule A: Governed Remedy Vocabulary scan
      // Match words on word boundaries to prevent substring false-positives
      for (const remedy of REMEDY_VOCABULARY) {
        // Escaping special characters in remedy names for regex safety
        const escaped = remedy.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(`\\b${escaped}\\b`, "i");
        if (regex.test(normalizedText)) {
          return {
            valid: false,
            response: this.getDisclaimer(mode)
          };
        }
      }

      // Rule B: Potency patterns (e.g. 30c, 200c, 1m, 10m, 30x, 6ch, etc.)
      const potencyRegex = /\b\d+(?:c|x|ch|k|ck|lm|m)\b/i;
      if (potencyRegex.test(normalizedText)) {
        return {
          valid: false,
          response: this.getDisclaimer(mode)
        };
      }

      // Rule C: Dosage or frequency instructions (e.g. drops, pills, doses, twice daily)
      const dosageRegex = /\b(?:drops|pills|doses?|twice daily|drops under tongue)\b/i;
      if (dosageRegex.test(lowerText)) {
        return {
          valid: false,
          response: this.getDisclaimer(mode)
        };
      }

      // Rule D: Definitive diagnoses in patient mode
      const diagnosisRegex = /\b(?:you have|diagnose you with|suffer from)\b/i;
      if (diagnosisRegex.test(lowerText)) {
        return {
          valid: false,
          response: this.getDisclaimer(mode)
        };
      }
    }

    // 3. Doctor Mode Validation Rules
    if (mode === "doctor") {
      // Rule A: Severe non-homeopathic conditions without standard referral disclaimers
      const severeConditions = /\b(cancer|tuberculosis|chronic kidney disease|myocardial infarction|stroke|cardiac arrest|heart attack|renal failure|tuberculosis)\b/i;
      if (severeConditions.test(lowerText)) {
        const referralDisclaimers = /\b(refer|emergency|hospital|specialist|primary care|cardiologist|oncologist|physician|er)\b/i;
        if (!referralDisclaimers.test(lowerText)) {
          return {
            valid: false,
            response: this.getDisclaimer(mode)
          };
        }
      }

      // Rule B: Cross-patient identifier-like data (e.g. pat-xxx, enc-xxx, con-xxx)
      const idRegex = /\b(?:pat|enc|con|usr|doc)-[a-zA-Z0-9-]+\b/i;
      if (idRegex.test(normalizedText)) {
        return {
          valid: false,
          response: this.getDisclaimer(mode)
        };
      }
    }

    return { valid: true, response: text };
  }

  private static getDisclaimer(mode: "public" | "patient" | "doctor"): string {
    if (mode === "doctor") {
      return "To ensure clinical safety, this response has been blocked due to a safety policy violation (unreferred severe diagnosis or potential identifier exposure). Please review patient details directly in the Clinical OS workspace.";
    }
    return "To ensure your clinical safety, specific remedy details, potencies, and dosages are not shared outside a formal consultation. Please message Dr. Narayan Jethwani on WhatsApp.";
  }
}
