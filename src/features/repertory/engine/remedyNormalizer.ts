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

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeRemedyId(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return REMEDY_ALIASES[normalizeKey(trimmed)] || trimmed;
}

export function remedyIdsMatch(left: unknown, right: unknown): boolean {
  const normalizedLeft = normalizeRemedyId(left);
  const normalizedRight = normalizeRemedyId(right);
  return !!normalizedLeft && normalizedLeft.toLowerCase() === normalizedRight.toLowerCase();
}

export function getKnownRemedyAliases(): Readonly<Record<string, string>> {
  return REMEDY_ALIASES;
}

