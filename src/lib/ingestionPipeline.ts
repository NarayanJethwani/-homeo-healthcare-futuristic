export interface IngestionSource {
  id: string;
  name: string;
  type: 'repertory' | 'materia_medica';
  author: string;
  totalRecords: number;
}

export const INGESTION_SOURCES: IngestionSource[] = [
  { id: 'src_kent_rep', name: 'Kent Repertory', type: 'repertory', author: 'J.T. Kent', totalRecords: 64200 },
  { id: 'src_boericke_rep', name: 'Boericke Repertory', type: 'repertory', author: 'W. Boericke', totalRecords: 28500 },
  { id: 'src_boger_boenning', name: 'Boger-Boenninghausen Repertory', type: 'repertory', author: 'C. Boger', totalRecords: 19400 },
  { id: 'src_bbcr', name: 'Boger Boenninghausen Characteristics & Repertory', type: 'repertory', author: 'C. Boger', totalRecords: 24100 },
  { id: 'src_boericke_mm', name: 'Boericke Materia Medica', type: 'materia_medica', author: 'W. Boericke', totalRecords: 1400 },
  { id: 'src_allen_keynotes', name: 'Allen Keynotes', type: 'materia_medica', author: 'H.C. Allen', totalRecords: 380 },
  { id: 'src_clarke_dict', name: 'Clarke Dictionary', type: 'materia_medica', author: 'J.H. Clarke', totalRecords: 1100 },
  { id: 'src_hering_guiding', name: 'Hering Guiding Symptoms', type: 'materia_medica', author: 'C. Hering', totalRecords: 4800 },
  { id: 'src_lippe_keynotes', name: 'Lippe Keynotes', type: 'materia_medica', author: 'A. Lippe', totalRecords: 290 },
  { id: 'src_nash_leaders', name: 'Nash Leaders', type: 'materia_medica', author: 'E.B. Nash', totalRecords: 240 }
];

export const REMEDY_ABBREVIATIONS: Record<string, string> = {
  'sulph': 'Sulphur',
  'sulphur': 'Sulphur',
  'sulphuricum': 'Sulphur',
  'lyc': 'Lycopodium Clavatum',
  'lycopodium': 'Lycopodium Clavatum',
  'nux-v': 'Nux Vomica',
  'nux': 'Nux Vomica',
  'nuxvomica': 'Nux Vomica',
  'ars': 'Arsenicum Album',
  'arsenicum': 'Arsenicum Album',
  'calc': 'Calcarea Carbonica',
  'calcarea': 'Calcarea Carbonica',
  'calc-c': 'Calcarea Carbonica',
  'lach': 'Lachesis Muta',
  'lachesis': 'Lachesis Muta',
  'puls': 'Pulsatilla Pratensis',
  'pulsatilla': 'Pulsatilla Pratensis',
  'gels': 'Gelsemium Sempervirens',
  'gelsemium': 'Gelsemium Sempervirens',
  'bry': 'Bryonia Alba',
  'bryonia': 'Bryonia Alba',
  'acon': 'Aconitum Napellus',
  'aconite': 'Aconitum Napellus',
  'aconitum': 'Aconitum Napellus'
};

export const RUBRIC_SYNONYMS: Record<string, string> = {
  'anxiety about health': 'Mind; Anxiety; health, about',
  'health anxiety': 'Mind; Anxiety; health, about',
  'anxiety of health': 'Mind; Anxiety; health, about',
  'fears health': 'Mind; Anxiety; health, about',
  'anticipatory anxiety': 'Mind; Anxiety; anticipatory / stage fright',
  'stage fright': 'Mind; Anxiety; anticipatory / stage fright',
  'anticipation before events': 'Mind; Anxiety; anticipatory / stage fright',
  'apprehensive of future': 'Mind; Anxiety; anticipatory / stage fright',
  'irritable when questioned': 'Mind; Irritability; questioned, when',
  'questioned causes anger': 'Mind; Irritability; questioned, when',
  'irritability under query': 'Mind; Irritability; questioned, when',
  'fastidious': 'Mind; Fastidious',
  'orderly': 'Mind; Fastidious',
  'neatness obsessive': 'Mind; Fastidious',
  'burning soles of feet': 'Generals; Burning; soles of feet, out of bed',
  'uncovers feet at night': 'Generals; Burning; soles of feet, out of bed',
  'feet hot in bed': 'Generals; Burning; soles of feet, out of bed',
  'empty feeling 11 am': 'Stomach; Emptiness; 11 AM',
  'sinking sensation at 11 am': 'Stomach; Emptiness; 11 AM',
  'bloating after eating': 'Stomach; Distension; eating, after',
  'flatulence after food': 'Stomach; Distension; eating, after',
  'gas stomach distended': 'Stomach; Distension; eating, after',
  'right sided headache': 'Head; Pain; right-sided',
  'headache right side': 'Head; Pain; right-sided',
  'migraine right template': 'Head; Pain; right-sided'
};

export interface IngestionLogEntry {
  timestamp: string;
  sourceId: string;
  sourceName: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface IngestionSummary {
  parsedRecords: number;
  normalizedRemedies: number;
  synonymsResolved: number;
  duplicatesRemoved: number;
  crossReferencesLinked: number;
  logs: IngestionLogEntry[];
}

export const runIngestionSimulation = (sourceId: string): IngestionSummary => {
  const source = INGESTION_SOURCES.find(s => s.id === sourceId) || INGESTION_SOURCES[0];
  const logs: IngestionLogEntry[] = [];
  let parsedRecords = 0;
  let normalizedRemedies = 0;
  let synonymsResolved = 0;
  let duplicatesRemoved = 0;
  let crossReferencesLinked = 0;

  const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    logs.push({
      timestamp: time,
      sourceId: source.id,
      sourceName: source.name,
      type,
      message
    });
  };

  // Step 1: Initializing Ingestion
  addLog('info', `Initializing ingestion pipeline for source: [${source.name}] authored by ${source.author}`);
  addLog('info', `Connecting to raw database file stream...`);
  
  // Step 2: Parsing & Record Counts
  parsedRecords = Math.floor(source.totalRecords * 0.98); // simulated parse rate
  addLog('success', `Connection established. Read ${source.totalRecords} raw lines. Parsed ${parsedRecords} valid XML/HTML records successfully.`);

  // Step 3: Remedies Abbreviation Normalization
  addLog('info', `Running Normalization Engine: Scanning for remedy nomenclature codes...`);
  const abbrevKeys = Object.keys(REMEDY_ABBREVIATIONS);
  
  if (source.type === 'repertory') {
    addLog('info', `Found abbreviations: "sulph", "lyc", "nux-v", "ars", "calc-c" in raw data.`);
    normalizedRemedies = 10;
    addLog('success', `Mapped "sulph" -> "Sulphur" (Master ID: rem_sulphur)`);
    addLog('success', `Mapped "lyc" -> "Lycopodium Clavatum" (Master ID: rem_lycopodium)`);
    addLog('success', `Mapped "nux-v" -> "Nux Vomica" (Master ID: rem_nux_vomica)`);
    addLog('success', `Mapped "ars" -> "Arsenicum Album" (Master ID: rem_arsenicum)`);
    addLog('success', `Mapped "calc-c" -> "Calcarea Carbonica" (Master ID: rem_calcarea)`);
    addLog('success', `Mapped "lach" -> "Lachesis Muta" (Master ID: rem_lachesis)`);
  } else {
    addLog('info', `Detecting remedies in materia medica monograph titles...`);
    normalizedRemedies = 8;
    addLog('success', `Monograph name "Sulphuricum" normalized to "Sulphur" (rem_sulphur)`);
    addLog('success', `Monograph name "Aconitum Napellus" resolved to "Aconitum Napellus" (rem_aconite)`);
  }

  // Step 4: Rubrics Synonyms Detection
  addLog('info', `Normalization Engine: Resolving synonymous rubrics...`);
  if (source.type === 'repertory') {
    synonymsResolved = 14;
    duplicatesRemoved = 8;
    addLog('warning', `Detected duplicate rubric match in [${source.name}]: "Mind; Anxiety; health, about" vs "Mind; Anxiety; of health"`);
    addLog('success', `Merged "Mind; Anxiety; of health" into "Mind; Anxiety; health, about" (Master ID: rub_health_anxiety)`);
    addLog('warning', `Detected duplicate rubric match: "Stomach; Distension; eating, after" vs "Stomach; Flatulence; after eating"`);
    addLog('success', `Merged "Stomach; Flatulence; after eating" into "Stomach; Distension; eating, after" (Master ID: rub_bloating_after_eating)`);
  } else {
    synonymsResolved = 4;
    duplicatesRemoved = 2;
    addLog('success', `Monograph symptom text "restless tossing in bed" mapped to rubric "Mind; Restlessness; anxious"`);
    addLog('success', `Monograph symptom text "sinking at eleven in morning" mapped to rubric "Stomach; Emptiness; 11 AM"`);
  }

  // Step 5: Cross-Referencing
  addLog('info', `Cross-referencing repertory links to Materia Medica metadata nodes...`);
  crossReferencesLinked = Math.floor(normalizedRemedies * 15);
  addLog('success', `Linked ${crossReferencesLinked} symptoms in repertory directly to keynotes in Boericke, Hering, and Allen.`);
  
  // Step 6: Completion
  addLog('success', `Ingestion completed successfully. Knowledge Graph updated with normalized linkages.`);

  return {
    parsedRecords,
    normalizedRemedies,
    synonymsResolved,
    duplicatesRemoved,
    crossReferencesLinked,
    logs
  };
};
