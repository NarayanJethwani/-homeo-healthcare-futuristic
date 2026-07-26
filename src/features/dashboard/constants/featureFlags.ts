/**
 * Dashboard & Workspace Feature Flags
 * These flags control the visibility and enabling of specific advanced capabilities
 * across Dr. Jethwani’s Clinical OS workspace dashboard.
 */
export const featureFlags = {
  aiAssistant: true,
  advancedAnalytics: true,
  voiceAssistant: false,
  telemedicine: false,
  labIntegration: true,
  whatsapp: false,
  patientPortal: true,
  multiClinic: false,
  researchMode: false,
  knowledgeEditorialWorkflowEnabled: false,
  knowledgeGraphEnabled: false,
  clinicalKnowledgeGraphEnabled: false,
  clinicalKnowledgeGraphRetrievalEnabled: false,
  clinicalKnowledgeGraphAdminEnabled: false,
  knowledgeSourceDiscrepancyQueueEnabled: false,
  repertoryDoctorEntitlementsEnabled: false,
  clinicalKnowledgeReferencesEnabled: false,
  emrCanonicalPatientReadModelEnabled: false,
  emrPatientIdentityReconciliationEnabled: false,
  knowledgeEvidenceScoringEnabled: false,
  aiCitationEnforcementEnabled: false,
  clinicalCaseLibraryEnabled: false,
  unifiedClinicalSearchEnabled: false,
  knowledgeQualityDashboardEnabled: false,
  knowledgeContinuousLearningEnabled: false,
  // The governed, bundled reader is the production-safe Materia Medica path.
  // The retired legacy scraper is intentionally disabled server-side and must
  // not be selected as the default UI.
  MATERIA_MEDICA_LIBRARY_V2: true,
  MATERIA_MEDICA_READER_V2: true,
  MATERIA_MEDICA_INGESTION_ADMIN: false,
  MATERIA_MEDICA_RAG_INDEXING: false,
  MATERIA_MEDICA_AI_SUMMARIES: false,
  MATERIA_MEDICA_SAMPLE_CORPUS: true,
  MATERIA_MEDICA_LOCAL_SEARCH: true,
  MATERIA_MEDICA_REMEDY_COMPARISON: false,
  MATERIA_MEDICA_PRIVATE_WORKSPACE: false,
  MATERIA_MEDICA_SCAN_SPLIT_READER: false,
};
