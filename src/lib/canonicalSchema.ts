export interface SourceAttribution {
  statementId: string;
  sourceBook: string;       // e.g. "Kent Lectures", "Boericke Materia Medica"
  author: string;           // e.g. "Kent", "Boericke", "Allen", "Clarke", "Hering"
  chapter: string;          // e.g. "Mind", "Stomach", "Skin"
  section?: string;         // e.g. "Particulars", "Keynotes"
  pageNumber?: string;
  originalText: string;     // The literal historical text quote
  confidenceScore: number;  // Calculated confidence contribution [0 - 100]
  sourceReliability: number; // Statically assigned reliability weight [0.0 - 1.0]
}

export interface CanonicalRecord<T> {
  uniqueId: string;
  data: T;
  attributions: SourceAttribution[];
  confidenceScore: number;   // Combined confidence score across sources
  versionHistory: Array<{
    version: number;
    changedAt: string;
    description: string;
  }>;
  crossReferences: string[]; // List of related nodes in the Knowledge Graph
  lastValidationDate: string;
}

export interface RemedyMasterProfile {
  remedyId: string;
  identity: {
    name: string;
    abbreviation: string;
    kingdom: "Plant" | "Mineral" | "Animal" | "Nosode";
    family: string;
    sourceSubstance: string;
  };
  essence: {
    coreTheme: string;
    centralConflict: string;
    compensationPattern: string;
  };
  mentals: CanonicalRecord<{
    personalityArchetype: string;
    keyThemes: string[];
    fears: string[];
    dreams: string[];
    delusions: string[];
  }>;
  physicals: CanonicalRecord<{
    thermalState: "Hot" | "Chilly" | "Ambi";
    thirstIndex: number; // 0-100
    foodDesires: string[];
    foodAversions: string[];
    sleepPatterns: string[];
  }>;
  modalities: CanonicalRecord<{
    betterFrom: string[];
    worseFrom: string[];
  }>;
  particulars: CanonicalRecord<{
    head: string[];
    eyes: string[];
    ears: string[];
    nose: string[];
    face: string[];
    throat: string[];
    chest: string[];
    abdomen: string[];
    skin: string[];
    joints: string[];
  }>;
  organAffinities: Array<{
    organ: string;
    rating: number; // 1-100
    reconciledReferences: SourceAttribution[];
  }>;
  miasmaticProfile: {
    psora: number;      // percentage
    sycosis: number;    // percentage
    syphilis: number;   // percentage
    tubercular: number; // percentage
    cancerinic: number; // percentage
  };
  provings: Array<{
    date: string;
    proverName: string;
    keySymptomsObserved: string[];
    citations: SourceAttribution[];
  }>;
  toxicology: {
    poisoningSymptoms: string[];
    referenceSources: SourceAttribution[];
  };
  historicalNotes: string[];
}
