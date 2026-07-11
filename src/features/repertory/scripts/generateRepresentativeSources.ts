import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'data', 'repertory', 'source');

const sourcesData: Record<string, any[]> = {
  boger_boenninghausen_1905: [
    {
      id: "boger_boenning_mind_0",
      chapter: "Mind & Nervous System",
      name: "ANXIETY - Fearful apprehension",
      remedies: { "Acon": 3, "Ars": 3, "Bell": 2, "Gels": 2, "Nux-v": 1 },
      source: "boger_boenninghausen_1905"
    },
    {
      id: "boger_boenning_thermal_0",
      chapter: "Thermal State",
      name: "CHILLY - Worse from cold air",
      remedies: { "Calc": 3, "Sil": 3, "Sulph": 1 },
      source: "boger_boenninghausen_1905"
    }
  ],
  boenninghausen_tpb_1891: [
    {
      id: "tpb_mind_0",
      chapter: "Mind & Nervous System",
      name: "MELANCHOLY - Sadness",
      remedies: { "Ign": 3, "Nat-m": 3, "Puls": 3, "Sulph": 1 },
      source: "boenninghausen_tpb_1891"
    },
    {
      id: "tpb_generals_0",
      chapter: "Constitutional Generals",
      name: "WEAKNESS - Exhaustion from slight exertion",
      remedies: { "Ars": 3, "Calc": 2, "Phos": 2 },
      source: "boenninghausen_tpb_1891"
    }
  ],
  boger_synoptic_1915: [
    {
      id: "synoptic_mind_0",
      chapter: "Mind & Nervous System",
      name: "IRRITABILITY - Anger easily triggered",
      remedies: { "Cham": 3, "Nux-v": 3, "Bry": 2 },
      source: "boger_synoptic_1915"
    },
    {
      id: "synoptic_modalities_0",
      chapter: "Modalities",
      name: "MOTION - Worse from motion",
      remedies: { "Bry": 3, "Nux-v": 1 },
      source: "boger_synoptic_1915"
    }
  ],
  clarke_clinical_1904: [
    {
      id: "clarke_digestive_0",
      chapter: "GI / Digestive",
      name: "HEARTBURN - Sour eructations",
      remedies: { "Nux-v": 3, "Lyc": 3, "Sulph": 2 },
      source: "clarke_clinical_1904"
    },
    {
      id: "clarke_skin_0",
      chapter: "Skin",
      name: "ITCHING - Worse from warmth of bed",
      remedies: { "Sulph": 3, "Puls": 2, "Merc": 2 },
      source: "clarke_clinical_1904"
    }
  ],
  knerr_1896: [
    {
      id: "knerr_mind_0",
      chapter: "Mind & Nervous System",
      name: "HYSTERIA - Emotional volatility",
      remedies: { "Ign": 3, "Puls": 2, "Mosch": 3 },
      source: "knerr_1896"
    },
    {
      id: "knerr_respiratory_0",
      chapter: "Respiratory",
      name: "COUGH - Dry, hacking at night",
      remedies: { "Bry": 3, "Phos": 3, "Sulph": 2 },
      source: "knerr_1896"
    }
  ],
  gentry_1890: [
    {
      id: "gentry_mind_0",
      chapter: "Mind & Nervous System",
      name: "DELUSION - Imagines they are rich",
      remedies: { "Sulph": 3, "Bell": 1 },
      source: "gentry_1890"
    },
    {
      id: "gentry_sleep_0",
      chapter: "Sleep",
      name: "SLEEPLESSNESS - From overcrowding of ideas",
      remedies: { "Coff": 3, "Nux-v": 2, "Ign": 2 },
      source: "gentry_1890"
    }
  ]
};

async function main() {
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }

  for (const [sourceId, rubrics] of Object.entries(sourcesData)) {
    const filePath = path.join(sourceDir, `${sourceId}RepertoryData.json`);
    fs.writeFileSync(filePath, JSON.stringify(rubrics, null, 2), 'utf-8');
    console.log(`Generated: ${filePath}`);
  }
}

main();
