export interface VisitTimelineEntry {
  visitId: string;
  date: string; // ISO String
  activeSymptoms: Array<{
    rubricId: string;
    severity: number; // 1-10
    observedIntensity: number; // 1-10
  }>;
  prescribedRemedyId: string | null;
  potency: string | null; // e.g. "30C", "200C"
  dosage: string | null;
  generalAmeliorationRating: number; // -5 to +5 scale (aggravation to improvement)
  notes: string;
}

export interface SymptomEvolution {
  rubricId: string;
  rubricTitle: string;
  intensityHistory: Array<{
    date: string;
    intensity: number;
  }>;
  status: 'active' | 'improving' | 'aggravated' | 'resolved';
}

export interface RubricEvolution {
  rubricId: string;
  firstObservedDate: string;
  lastObservedDate: string;
  isActive: boolean;
  totalVisitsActive: number;
}

export interface RemedyResponse {
  remedyId: string;
  remedyName: string;
  visitsPrescribed: string[];
  observedImprovementRates: Array<{
    visitId: string;
    improvementPercentage: number;
  }>;
}

export interface ConfidenceTrend {
  visitId: string;
  date: string;
  scoringConfidence: number; // 0 - 100
}

export interface LongitudinalCaseSummary {
  patientId: string;
  timeline: VisitTimelineEntry[];
  symptomTrends: SymptomEvolution[];
  rubricsHistory: RubricEvolution[];
  remedyOutcomes: RemedyResponse[];
  confidenceHistory: ConfidenceTrend[];
}
