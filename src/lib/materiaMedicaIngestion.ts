import { MateriaMedicaDocument } from "./materiaMedicaSchema";
import { MASTER_REMEDY_DB } from "./materiaMedicaDb";

export interface TextSnippet {
  sourceText: string;
  extractedSymptom: string;
  category: "essence" | "mental" | "physical" | "modality" | "organ" | "clinical";
  matchedRubric?: string;
  confidenceScore: number; // 0-100
}

export interface IngestionPipelineLog {
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  stage: "INIT" | "PARSE" | "EXTRACT" | "ALIGN" | "GRAPH_LINK";
  message: string;
}

export interface MateriaMedicaIngestionSummary {
  sourceId: string;
  sourceName: string;
  author: string;
  rawFileSizeKb: number;
  totalCharacters: number;
  monographsDetected: number;
  remediesMapped: number;
  symptomsExtractedCount: number;
  modalitiesStructuredCount: number;
  organAffinitiesMappedCount: number;
  miasmaticKeywordsCount: {
    psora: number;
    sycosis: number;
    syphilis: number;
    tubercular: number;
    cancerinic: number;
  };
  snippets: TextSnippet[];
  logs: IngestionPipelineLog[];
}

export const CLASSICAL_SOURCES = [
  { id: "src_boericke", name: "Pocket Manual of Homoeopathic Materia Medica", author: "William Boericke, M.D.", size: 2450, chars: 480000 },
  { id: "src_hering", name: "Guiding Symptoms of our Materia Medica", author: "Constantine Hering, M.D.", size: 14800, chars: 3200000 },
  { id: "src_kent", name: "Lectures on Homoeopathic Materia Medica", author: "James Tyler Kent, M.D.", size: 4100, chars: 980000 },
  { id: "src_allen_key", name: "Keynotes and Characteristics with Comparisons", author: "Henry C. Allen, M.D.", size: 850, chars: 180000 },
  { id: "src_clarke_dict", name: "A Dictionary of Practical Materia Medica", author: "John Henry Clarke, M.D.", size: 18200, chars: 4100000 }
];

export const simulateMateriaMedicaIngestion = (sourceId: string): MateriaMedicaIngestionSummary => {
  const source = CLASSICAL_SOURCES.find(s => s.id === sourceId) || CLASSICAL_SOURCES[0];
  const logs: IngestionPipelineLog[] = [];
  const snippets: TextSnippet[] = [];

  const addLog = (level: "info" | "success" | "warning" | "error", stage: "INIT" | "PARSE" | "EXTRACT" | "ALIGN" | "GRAPH_LINK", message: string) => {
    const time = new Date().toISOString().split("T")[1].substring(0, 12);
    logs.push({ timestamp: time, level, stage, message });
  };

  // Step 1: Initialization
  addLog("info", "INIT", `Accessing digital archive file: ${source.name} by ${source.author}`);
  addLog("info", "INIT", `Scanning encoding schema (UTF-8) and validating raw text block checksums...`);
  addLog("success", "INIT", `File verification successful. Size: ${source.size} KB, Characters: ${source.chars}`);

  // Step 2: Parsing monographs
  addLog("info", "PARSE", `Tokenizing text stream and searching for classical remedy header structures...`);
  
  // Seed random factors based on sourceId to make outputs look dynamic but consistent
  const seed = source.id.length;
  const monographsDetected = Math.floor(120 + seed * 12);
  const remediesMapped = Math.min(monographsDetected, MASTER_REMEDY_DB.length + Math.floor(seed * 0.5));

  addLog("success", "PARSE", `Successfully parsed text stream. Detected ${monographsDetected} remedy monographs.`);
  addLog("info", "PARSE", `Resolving abbreviations and checking spelling anomalies against homeopathic lexicon...`);
  addLog("success", "PARSE", `Resolved abbreviations: mapped ${remediesMapped} monographs directly to master database IDs.`);

  // Warning check
  if (seed % 2 === 0) {
    addLog("warning", "PARSE", `Remedy abbreviation "AC-N" resolved to "Aconitum Napellus" using soundex heuristics.`);
  } else {
    addLog("warning", "PARSE", `Abbreviation "SULPH-AC" flagged as possible match for Sulphuric Acid (rem_sulph_ac) rather than Sulphur.`);
  }

  // Step 3: Symptom Extraction
  addLog("info", "EXTRACT", `Extracting symptomatic text fragments using Natural Language Processing parser...`);
  const symptomsCount = monographsDetected * 18;
  const modalitiesCount = monographsDetected * 6;
  const organCount = monographsDetected * 4;

  addLog("success", "EXTRACT", `Extracted ${symptomsCount} candidate symptoms, ${modalitiesCount} modalities, and ${organCount} organ descriptors.`);

  // Generate snippets
  const sampleSnippets: Record<string, TextSnippet[]> = {
    src_boericke: [
      {
        sourceText: "Standing is the most disagreeable position for Sulphur patients; they cannot stand still.",
        extractedSymptom: "Aggravation from standing still",
        category: "modality",
        matchedRubric: "Generals; Standing; worse",
        confidenceScore: 98
      },
      {
        sourceText: "Stomach feels empty, weak, sinking at about 11 a.m., desires sweets, fats, and highly seasoned food.",
        extractedSymptom: "Sinking stomach at 11 AM with sweet cravings",
        category: "physical",
        matchedRubric: "Stomach; Emptiness; 11 AM",
        confidenceScore: 95
      },
      {
        sourceText: "Constant flatulent distension in the abdomen, especially immediately after eating a small amount.",
        extractedSymptom: "Abdominal bloating after small meals",
        category: "organ",
        matchedRubric: "Abdomen; Distension; eating, after",
        confidenceScore: 91
      }
    ],
    src_hering: [
      {
        sourceText: "Anxiety and pacing about, especially at 1 a.m. with fears of death and incurable diseases.",
        extractedSymptom: "Midnight anxiety, pacing, fear of death",
        category: "mental",
        matchedRubric: "Mind; Anxiety; midnight, after (1 AM)",
        confidenceScore: 97
      },
      {
        sourceText: "Burning pains in skin and joints, intensely aggravated by cold applications, but temporarily relieved by hot water.",
        extractedSymptom: "Burning pains ameliorated by heat",
        category: "modality",
        matchedRubric: "Generals; Heat; ameliorates (Burning)",
        confidenceScore: 94
      }
    ],
    src_kent: [
      {
        sourceText: "The Sulphur patient is a ragged philosopher; he thinks old rags are beautiful, and is critical of others.",
        extractedSymptom: "Egotistical theoretical philosopher, disregards appearance",
        category: "essence",
        matchedRubric: "Mind; Egotism / Theoretical",
        confidenceScore: 99
      },
      {
        sourceText: "Aconite symptoms come on with extreme suddenness and violence, usually after exposure to cold, dry winds.",
        extractedSymptom: "Sudden violent symptoms from cold dry wind",
        category: "clinical",
        matchedRubric: "Generals; Suddenness / Cold wind",
        confidenceScore: 96
      }
    ]
  };

  const selectedSnippets = sampleSnippets[source.id] || sampleSnippets.src_boericke;
  selectedSnippets.forEach(snip => snippets.push(snip));

  // Step 4: Normalization and Alignment
  addLog("info", "ALIGN", `Aligning extracted descriptors with Materia Medica schema mapping rules...`);
  addLog("success", "ALIGN", `Successfully aligned data records. Normalized schema attributes for ${remediesMapped} remedies.`);

  // Step 5: Graph Linkage
  addLog("info", "GRAPH_LINK", `Mapping cross-references and calculating miasmatic keyword density...`);
  const psoraKeywords = Math.floor(180 + seed * 25);
  const sycosisKeywords = Math.floor(120 + seed * 18);
  const syphilisKeywords = Math.floor(90 + seed * 12);
  const tubercularKeywords = Math.floor(60 + seed * 10);
  const cancerinicKeywords = Math.floor(30 + seed * 5);

  addLog("success", "GRAPH_LINK", `Calculated miasmatic weight scores from text density. Linked new nodes in clinical registry.`);
  addLog("success", "GRAPH_LINK", `Pipeline completed. Knowledge Graph updated successfully.`);

  return {
    sourceId: source.id,
    sourceName: source.name,
    author: source.author,
    rawFileSizeKb: source.size,
    totalCharacters: source.chars,
    monographsDetected,
    remediesMapped,
    symptomsExtractedCount: symptomsCount,
    modalitiesStructuredCount: modalitiesCount,
    organAffinitiesMappedCount: organCount,
    miasmaticKeywordsCount: {
      psora: psoraKeywords,
      sycosis: sycosisKeywords,
      syphilis: syphilisKeywords,
      tubercular: tubercularKeywords,
      cancerinic: cancerinicKeywords
    },
    snippets,
    logs
  };
};
