import {
  RemedyConcept,
  RemedyConceptId,
  RemedyAliasRecord,
  RemedyTaxonomyAssertion
} from "../repertory/types/remedyTypes";
import {
  RepertorySourceId,
  RepertoryEditionId
} from "../repertory/types/repertoryTypes";

export type RemedyResolutionResult =
  | {
      status: "resolved";
      concept: RemedyConcept;
      mapping: RemedyAliasRecord;
    }
  | {
      status: "ambiguous";
      candidates: RemedyConcept[];
    }
  | {
      status: "unresolved";
      sourceAbbreviation: string;
    };

// Curated seed/pilot registry labeled clearly
export const REVIEWED_SEED_REMEDY_REGISTRY: RemedyConcept[] = [
  {
    id: "c4b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Arnica Montana",
    latinName: "Arnica Montana",
    family: "Asteraceae",
    kingdom: "Plantae",
    scientificName: "Arnica montana",
    canonicalDisplayName: "Arnica Montana",
    historicalAbbreviations: ["Arn.", "Arnic."],
    aliases: [
      {
        id: "alias_arn_arn",
        remedyConceptId: "c4b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Arn",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Asteraceae", source: "APG IV", status: "verified" },
      { rank: "species", value: "Arnica montana", source: "IPNI", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "d5b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Belladonna",
    latinName: "Atropa Belladonna",
    family: "Solanaceae",
    kingdom: "Plantae",
    scientificName: "Atropa belladonna",
    canonicalDisplayName: "Belladonna",
    historicalAbbreviations: ["Bell."],
    aliases: [
      {
        id: "alias_bell_bell",
        remedyConceptId: "d5b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Bell",
        aliasType: "source_abbreviation",
        status: "verified"
      },
      {
        id: "alias_bell_nightshade",
        remedyConceptId: "d5b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Deadly Nightshade",
        aliasType: "common_name",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Solanaceae", source: "APG IV", status: "verified" },
      { rank: "species", value: "Atropa belladonna", source: "IPNI", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "e6b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Nux Vomica",
    latinName: "Strychnos Nux Vomica",
    family: "Loganiaceae",
    kingdom: "Plantae",
    scientificName: "Strychnos nux-vomica",
    canonicalDisplayName: "Nux Vomica",
    historicalAbbreviations: ["Nux-v.", "Nux."],
    aliases: [
      {
        id: "alias_nuxv_nuxv",
        remedyConceptId: "e6b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Nux-v",
        aliasType: "source_abbreviation",
        status: "verified"
      },
      {
        id: "alias_nuxv_nux",
        remedyConceptId: "e6b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Nux",
        aliasType: "historical_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Loganiaceae", source: "APG IV", status: "verified" },
      { rank: "species", value: "Strychnos nux-vomica", source: "IPNI", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "f7b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Sulphur",
    latinName: "Sulphur",
    family: "Sulphur Elements",
    kingdom: "Mineral",
    scientificName: "Sulphur sublimatum",
    canonicalDisplayName: "Sulphur",
    historicalAbbreviations: ["Sulf.", "Sulph."],
    aliases: [
      {
        id: "alias_sulph_sulph",
        remedyConceptId: "f7b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Sulph",
        aliasType: "source_abbreviation",
        status: "verified"
      },
      {
        id: "alias_sulph_sul",
        remedyConceptId: "f7b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Sul",
        aliasType: "historical_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Elements", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "a8b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Arsenicum Album",
    latinName: "Arsenicum Album",
    family: "Arsenic Oxides",
    kingdom: "Mineral",
    scientificName: "Arsenious acid",
    canonicalDisplayName: "Arsenicum Album",
    historicalAbbreviations: ["Ars.", "Arsen."],
    aliases: [
      {
        id: "alias_ars_ars",
        remedyConceptId: "a8b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Ars",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Oxides", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "b9b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Lycopodium Clavatum",
    latinName: "Lycopodium Clavatum",
    family: "Lycopodiaceae",
    kingdom: "Plantae",
    scientificName: "Lycopodium clavatum",
    canonicalDisplayName: "Lycopodium Clavatum",
    historicalAbbreviations: ["Lyc.", "Lycop."],
    aliases: [
      {
        id: "alias_lyc_lyc",
        remedyConceptId: "b9b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Lyc",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Lycopodiaceae", source: "APG IV", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "10b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Alumina",
    latinName: "Alumina",
    family: "Aluminium Oxides",
    kingdom: "Mineral",
    scientificName: "Aluminium oxide",
    canonicalDisplayName: "Alumina",
    historicalAbbreviations: ["Alum."],
    aliases: [
      {
        id: "alias_alum_alum",
        remedyConceptId: "10b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Alum",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Oxides", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "21b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Calcarea Phosphorica",
    latinName: "Calcarea Phosphorica",
    family: "Calcium Phosphates",
    kingdom: "Mineral",
    scientificName: "Calcium phosphate",
    canonicalDisplayName: "Calcarea Phosphorica",
    historicalAbbreviations: ["Calc-p."],
    aliases: [
      {
        id: "alias_calcp_calcp",
        remedyConceptId: "21b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Calc-p",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Phosphates", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "32b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "China Officinalis",
    latinName: "Cinchona Officinalis",
    family: "Rubiaceae",
    kingdom: "Plantae",
    scientificName: "Cinchona officinalis",
    canonicalDisplayName: "China",
    historicalAbbreviations: ["Chin.", "Chna."],
    aliases: [
      {
        id: "alias_chna_chna",
        remedyConceptId: "32b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Chna",
        aliasType: "source_abbreviation",
        status: "verified"
      },
      {
        id: "alias_chna_chin",
        remedyConceptId: "32b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Chin",
        aliasType: "historical_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Rubiaceae", source: "APG IV", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "43b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Ferrum Metallicum",
    latinName: "Ferrum Metallicum",
    family: "Metallic Elements",
    kingdom: "Mineral",
    scientificName: "Ferrum",
    canonicalDisplayName: "Ferrum Metallicum",
    historicalAbbreviations: ["Ferr.", "Fer."],
    aliases: [
      {
        id: "alias_ferr_ferr",
        remedyConceptId: "43b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Ferr",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Metals", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "54b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Phosphorus",
    latinName: "Phosphorus",
    family: "Phosphorus Elements",
    kingdom: "Mineral",
    scientificName: "Phosphorus",
    canonicalDisplayName: "Phosphorus",
    historicalAbbreviations: ["Phos."],
    aliases: [
      {
        id: "alias_phos_phos",
        remedyConceptId: "54b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Phos",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Nonmetals", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "65b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Zincum Metallicum",
    latinName: "Zincum Metallicum",
    family: "Metallic Elements",
    kingdom: "Mineral",
    scientificName: "Zincum",
    canonicalDisplayName: "Zincum Metallicum",
    historicalAbbreviations: ["Zinc.", "Zinc-m."],
    aliases: [
      {
        id: "alias_zinc_zinc",
        remedyConceptId: "65b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Zinc",
        aliasType: "source_abbreviation",
        status: "verified"
      },
      {
        id: "alias_zinc_zincm",
        remedyConceptId: "65b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Zinc-m",
        aliasType: "historical_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Metals", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "76b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Aurum Metallicum",
    latinName: "Aurum Metallicum",
    family: "Metallic Elements",
    kingdom: "Mineral",
    scientificName: "Aurum",
    canonicalDisplayName: "Aurum Metallicum",
    historicalAbbreviations: ["Aur."],
    aliases: [
      {
        id: "alias_aur_aur",
        remedyConceptId: "76b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Aur",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Metals", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  },
  {
    id: "87b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
    canonicalName: "Baryta Carbonica",
    latinName: "Baryta Carbonica",
    family: "Barium Carbonates",
    kingdom: "Mineral",
    scientificName: "Barium carbonate",
    canonicalDisplayName: "Baryta Carbonica",
    historicalAbbreviations: ["Bar-c."],
    aliases: [
      {
        id: "alias_barc_barc",
        remedyConceptId: "87b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
        value: "Bar-c",
        aliasType: "source_abbreviation",
        status: "verified"
      }
    ],
    taxonomy: [
      { rank: "family", value: "Carbonates", source: "Mineralogy Handbook", status: "verified" }
    ],
    registryStatus: "verified"
  }
];

export function resolveRemedyConceptByAbbreviation(
  abbr: string,
  context?: { sourceId?: RepertorySourceId; editionId?: RepertoryEditionId }
): RemedyResolutionResult {
  if (!abbr) {
    return { status: "unresolved", sourceAbbreviation: abbr };
  }
  const clean = abbr.trim().toLowerCase();

  const candidates: RemedyConcept[] = [];
  const matchingAliases: RemedyAliasRecord[] = [];

  for (const concept of REVIEWED_SEED_REMEDY_REGISTRY) {
    // Check direct standard details
    if (
      concept.canonicalName.toLowerCase() === clean ||
      concept.latinName.toLowerCase() === clean ||
      concept.canonicalDisplayName.toLowerCase() === clean
    ) {
      // Direct high confidence match
      const defaultAlias: RemedyAliasRecord = {
        id: `alias_fallback_${concept.id}`,
        remedyConceptId: concept.id,
        value: abbr,
        aliasType: "synonym",
        status: "verified"
      };
      return { status: "resolved", concept, mapping: defaultAlias };
    }

    // Check alias records
    for (const alias of concept.aliases) {
      if (alias.value.toLowerCase() === clean) {
        // If context matches, resolve directly
        const contextMatches =
          (!context?.sourceId || !alias.sourceId || alias.sourceId === context.sourceId) &&
          (!context?.editionId || !alias.editionId || alias.editionId === context.editionId);

        if (contextMatches) {
          return { status: "resolved", concept, mapping: alias };
        }
        candidates.push(concept);
        matchingAliases.push(alias);
      }
    }

    // Check historical abbreviations list
    if (concept.historicalAbbreviations.some(h => h.toLowerCase() === clean || h.replace(/\.$/, "").toLowerCase() === clean)) {
      candidates.push(concept);
    }
  }

  // Deduplicate candidates
  const uniqueCandidates = Array.from(new Set(candidates));

  if (uniqueCandidates.length === 1) {
    const concept = uniqueCandidates[0];
    const mapping: RemedyAliasRecord = matchingAliases.find(a => a.remedyConceptId === concept.id) || {
      id: `alias_resolved_historical_${concept.id}`,
      remedyConceptId: concept.id,
      value: abbr,
      aliasType: "historical_abbreviation",
      status: "verified"
    };
    return { status: "resolved", concept, mapping };
  }

  if (uniqueCandidates.length > 1) {
    return { status: "ambiguous", candidates: uniqueCandidates };
  }

  return { status: "unresolved", sourceAbbreviation: abbr };
}
