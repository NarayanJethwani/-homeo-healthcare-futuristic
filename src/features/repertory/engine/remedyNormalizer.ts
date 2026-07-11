import { SYNONYM_RESOLVER_MAP } from "../../../lib/normalizationEngine";
import { REMEDIES_METADATA } from "../../../lib/repertoryData";

const REMEDY_ALIASES: Record<string, string> = {
  aconite: "Acon",
  aconitum: "Acon",
  "aconitum napellus": "Acon",
  arsenicum: "Ars",
  "arsenicum album": "Ars",
  ars: "Ars",
  "nux vomica": "Nux-v",
  nux: "Nux-v",
  "nux-v": "Nux-v",
  "natrum muriaticum": "Nat-m",
  "natrum mur": "Nat-m",
  "nat-m": "Nat-m",
  lycopodium: "Lyc",
  lyc: "Lyc",
  pulsatilla: "Puls",
  puls: "Puls",
  sulphur: "Sulph",
  sulfur: "Sulph",
  sulph: "Sulph",
  silica: "Sil",
  silicea: "Sil",
  sil: "Sil",
  "phosphoric acid": "Ph-ac",
  "phosphoricum acidum": "Ph-ac",
  "ph-ac": "Ph-ac",
  "kali phosphoricum": "Kali-p",
  "kali-p": "Kali-p",
};

// Map canonical rem_xxx IDs back to standard abbreviations (e.g. rem_sulphur -> Sulph)
const CANONICAL_ID_TO_ABBR: Record<string, string> = {};

// Initialize mapping from metadata
Object.keys(REMEDIES_METADATA).forEach(abbr => {
  const meta = REMEDIES_METADATA[abbr];
  if (meta && meta.fullName) {
    const canonicalId = `rem_${meta.fullName.toLowerCase().replace(/[\s\.-]+/g, "_")}`;
    CANONICAL_ID_TO_ABBR[canonicalId] = abbr;
  }
});

// Also manually add fallback lookups for common standard abbreviations
CANONICAL_ID_TO_ABBR["rem_sulphur"] = "Sulph";
CANONICAL_ID_TO_ABBR["rem_lycopodium"] = "Lyc";
CANONICAL_ID_TO_ABBR["rem_nux_vomica"] = "Nux-v";
CANONICAL_ID_TO_ABBR["rem_arsenicum"] = "Ars";
CANONICAL_ID_TO_ABBR["rem_calcarea"] = "Calc";
CANONICAL_ID_TO_ABBR["rem_lachesis"] = "Lach";
CANONICAL_ID_TO_ABBR["rem_pulsatilla"] = "Puls";
CANONICAL_ID_TO_ABBR["rem_gelsemium"] = "Gels";
CANONICAL_ID_TO_ABBR["rem_bryonia"] = "Bry";
CANONICAL_ID_TO_ABBR["rem_aconite"] = "Acon";
CANONICAL_ID_TO_ABBR["rem_nat_mur"] = "Nat-m";
CANONICAL_ID_TO_ABBR["rem_phosphorus"] = "Phos";
CANONICAL_ID_TO_ABBR["rem_silicea"] = "Sil";
CANONICAL_ID_TO_ABBR["rem_sepia"] = "Sep";
CANONICAL_ID_TO_ABBR["rem_belladonna"] = "Bell";
CANONICAL_ID_TO_ABBR["rem_apis"] = "Apis";
CANONICAL_ID_TO_ABBR["rem_agaricus"] = "Agar";

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeRemedyId(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  // 1. Check local manual aliases first
  const key = normalizeKey(trimmed);
  if (REMEDY_ALIASES[key]) {
    return REMEDY_ALIASES[key];
  }

  // 2. Exact match in standard metadata
  if (REMEDIES_METADATA[trimmed]) {
    return trimmed;
  }

  // 3. Normalise special characters (e.g. Æth -> Aeth)
  const normalizedText = trimmed
    .replace(/Æ/g, "Ae")
    .replace(/æ/g, "ae")
    .replace(/Œ/g, "Oe")
    .replace(/œ/g, "oe")
    .replace(/[\.\s_-]/g, " ")
    .trim();

  // 4. Try synonym resolver maps
  const cleanInput = normalizedText.toLowerCase();
  if (SYNONYM_RESOLVER_MAP[cleanInput]) {
    const canonicalId = SYNONYM_RESOLVER_MAP[cleanInput];
    if (CANONICAL_ID_TO_ABBR[canonicalId]) {
      return CANONICAL_ID_TO_ABBR[canonicalId];
    }
  }

  const words = cleanInput.split(" ");
  for (const w of words) {
    if (SYNONYM_RESOLVER_MAP[w]) {
      const canonicalId = SYNONYM_RESOLVER_MAP[w];
      if (CANONICAL_ID_TO_ABBR[canonicalId]) {
        return CANONICAL_ID_TO_ABBR[canonicalId];
      }
    }
  }

  return normalizedText;
}

export function remedyIdsMatch(left: unknown, right: unknown): boolean {
  const normalizedLeft = normalizeRemedyId(left);
  const normalizedRight = normalizeRemedyId(right);
  return !!normalizedLeft && normalizedLeft.toLowerCase() === normalizedRight.toLowerCase();
}

export function getKnownRemedyAliases(): Readonly<Record<string, string>> {
  return REMEDY_ALIASES;
}
