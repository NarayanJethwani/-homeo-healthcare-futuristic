export interface ScoringConfiguration {
  mentalGenerals: number;
  physicalGenerals: number;
  modalities: number;
  etiology: number;
  particulars: number;
  constitutionalFit: number;
  miasmaticFit: number;
  graphConfidence: number;
  editorialConfidence: number;
}

export const CLINICAL_SCORING_CONFIG: ScoringConfiguration = {
  mentalGenerals: 1.6,
  physicalGenerals: 1.4,
  modalities: 1.3,
  etiology: 2.0,
  particulars: 1.0,
  constitutionalFit: 1.5,
  miasmaticFit: 1.3,
  graphConfidence: 1.1,
  editorialConfidence: 1.2
};
