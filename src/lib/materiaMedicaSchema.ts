export interface RemedyIdentity {
  name: string;
  abbreviation: string;
  kingdom: 'Mineral' | 'Plant' | 'Animal' | 'Nosode';
  family: string;
  sourceSubstance: string;
  preparationMethod?: string;
}

export interface RemedyEssence {
  coreTheme: string;
  centralConflict: string;
  compensationPattern: string;
  constitutionalEssence?: string;
  archetype?: string;
}

export interface MentalPicture {
  personality: string;
  fears: string[];
  anxietyPatterns: string[];
  delusions: string[];
  relationships: string;
  communicationStyle: string;
  memory: string;
  concentration: string;
  stressResponse?: string;
  emotionalPattern?: string;
}

export interface PhysicalGenerals {
  thermalState: string;
  thirst: string;
  perspiration: string;
  sleep: string;
  dreams: string[];
  energyPattern: string;
  foodDesires: string[];
  foodAversions: string[];
  weatherSensitivity?: string;
  timeModalities?: string;
}

export interface RemedyRelationships {
  complementary: string[];
  inimical: string[];
  antidotes: string[];
  followsWell: string[];
  relatedRemedies?: string[];
  familyRelationships?: string[];
}

export interface MiasmaticAnalysis {
  psora: number;      // percentage
  sycosis: number;    // percentage
  syphilis: number;   // percentage
  tubercular: number; // percentage
  cancerinic: number; // percentage
  dominantMiasm: string;
  description: string;
}

export interface OrganAffinity {
  organ: string;
  rating: number; // 1-10
  details: string;
}

export interface ClinicalCondition {
  condition: string;
  severityMatch: 'Low' | 'Medium' | 'High';
  details: string;
}

export interface ClinicalKnowledge {
  commonIndications: string[];
  characteristicConditions: string[];
  acuteUses: string[];
  chronicUses: string[];
  differentialDiagnoses: string[];
}

export interface SourceAttribution {
  sourceName: string;
  author: 'Kent' | 'Boericke' | 'Allen' | 'Clarke' | 'Nash' | 'Phatak' | 'Hering' | 'Lippe' | 'Farrington' | string;
  reference?: string;
  chapter?: string;
  section?: string;
  confidenceLevel: number; // 0 to 100
}

export interface MateriaMedicaDocument {
  id: string;
  identity: RemedyIdentity;
  essence: RemedyEssence;
  mentalPicture: MentalPicture;
  physicalGenerals: PhysicalGenerals;
  modalities: {
    betterFrom: string[];
    worseFrom: string[];
    position?: string[];
    motion?: string[];
    temperature?: string[];
    weather?: string[];
    time?: string[];
    food?: string[];
    touch?: string[];
    pressure?: string[];
  };
  organAffinities: OrganAffinity[];
  clinicalConditions: ClinicalCondition[];
  keynotes: {
    top10: string[];
    top25: string[];
    top50: string[];
  };
  miasmaticAnalysis: MiasmaticAnalysis;
  relationships: RemedyRelationships;
  clinicalKnowledge?: ClinicalKnowledge;
  sourceAttributions?: Record<string, SourceAttribution[]>;
}
