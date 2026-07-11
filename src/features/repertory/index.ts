// Entry point for the Upgraded Repertory Feature Module
export * from './types';
export * from './repositories/RepertoryRepository';
export * from './repositories/MemoryRepertoryRepository';
export * from './repositories/FirestoreRepertoryRepository';
export * from './database/repertoryDb';
export * from './engine/conceptMapper';
export * from './graph/repertoryGraph';
export * from './search/repertorySearch';
export * from './scoring/repertoryScoring';
export * from './validators/databaseValidator';
export * from './import-export/importExportService';
export * from './import-export/ingestionPipeline';
export * from './data/repertorySeed';
export * from './data/repertorySourceRegistry';
export * from './data/caseScenarios';
export * from './clinicalWorkspace';


// UI Components will be exported below
export * from './components/RepertoryWorkbench';
export * from './components/RemedyReasoningPanel';
export * from './components/DifferentialComparison';
export * from './components/MissingInformationCard';
export * from './components/SuggestedQuestions';
export * from './components/ConfidenceBreakdownPanel';
export * from './components/RubricCoverageHeatmap';
export * from './components/ReasoningTimeline';

// Reasoning engine modules
export * from './reasoning/reasoningEngine';
export * from './reasoning/differentialEngine';
export * from './reasoning/confidenceEngine';
export * from './reasoning/questionGenerator';
export * from './reasoning/explanationBuilder';
export * from './reasoning/evidenceBreakdown';
