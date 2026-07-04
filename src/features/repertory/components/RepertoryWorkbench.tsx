import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sliders, Trash2, Plus, Info, RefreshCw, CheckCircle, 
  AlertTriangle, BookOpen, Download, HelpCircle, ArrowRight, Check
} from 'lucide-react';
import { RepertoryRubric, ScoringResult, RemedyDifferentiation, ValidationReport, ClinicalReasoningSummary } from '../types';
import { repertoryRepository } from '../database/repertoryDb';
import { DatabaseValidator } from '../validators/databaseValidator';
import { ImportExportService } from '../import-export/importExportService';
import { RemedyReasoningPanel } from './RemedyReasoningPanel';
import { DifferentialComparison } from './DifferentialComparison';
import { MissingInformationCard } from './MissingInformationCard';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ConfidenceBreakdownPanel } from './ConfidenceBreakdownPanel';
import { RubricCoverageHeatmap } from './RubricCoverageHeatmap';
import { ReasoningTimeline } from './ReasoningTimeline';
import { createClinicalRepertoryService } from '../clinicalWorkspace/clinicalRepertoryService';
import { CLINICAL_WORKSPACE_SAFETY_NOTICE, ClinicalValidationFinding } from '../clinicalWorkspace/types';
import { VisitTimelineEntry, LongitudinalCaseSummary } from '../clinicalWorkspace/longitudinalTypes';

export interface RepertoryWorkbenchProps {
  sessionUid?: string;
  activePatientId?: string;
  onSendToTreatmentPlanner?: (summary: string) => void;
}

export const RepertoryWorkbench: React.FC<RepertoryWorkbenchProps> = ({
  sessionUid = '',
  activePatientId = '',
  onSendToTreatmentPlanner
}) => {
  // Database States
  const [rubrics, setRubrics] = useState<RepertoryRubric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrganSystem, setSelectedOrganSystem] = useState<string>('All');
  const [selectedMiasm, setSelectedMiasm] = useState<string>('All');
  const [selectedRemedy, setSelectedRemedy] = useState<string>('All');

  // Initialize internal Codex clinical workspace service facade
  const clinicalRepertoryService = useRef(createClinicalRepertoryService());

  // Workbench / Case States
  const [selectedRubrics, setSelectedRubrics] = useState<Array<{
    rubricId: string;
    severity: number;
    frequency: 'constant' | 'frequent' | 'occasional';
    impact: 'severe' | 'moderate' | 'mild';
  }>>([]);
  const [nlpInput, setNlpInput] = useState<string>('');
  const [parsingIntake, setParsingIntake] = useState<boolean>(false);
  
  // Scoring & Differentiation
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [differentiations, setDifferentiations] = useState<RemedyDifferentiation[]>([]);
  const [activeRemedyDetails, setActiveRemedyDetails] = useState<string | null>(null);
  const [isScoringLoading, setIsScoringLoading] = useState<boolean>(false);
  const [reasoningSummary, setReasoningSummary] = useState<ClinicalReasoningSummary | null>(null);
  const [activeReasoningRemedyId, setActiveReasoningRemedyId] = useState<string | null>(null);
  const [activeReasoningTab, setActiveReasoningTab] = useState<'explanation' | 'differential' | 'coverage' | 'questions' | 'timeline'>('explanation');
  const [validationFindings, setValidationFindings] = useState<ClinicalValidationFinding[]>([]);
  const [longitudinalSummary, setLongitudinalSummary] = useState<LongitudinalCaseSummary | null>(null);
  const [lastAmeliorationRating, setLastAmeliorationRating] = useState<number>(3);

  // Dialogs & Audits
  const [auditReport, setAuditReport] = useState<ValidationReport | null>(null);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [importedStatus, setImportedStatus] = useState<{ success?: string; error?: string }>({});

  // UI state
  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(null);
  const [modifyingSymptom, setModifyingSymptom] = useState<{
    rubricId: string;
    severity: number;
    frequency: 'constant' | 'frequent' | 'occasional';
    impact: 'severe' | 'moderate' | 'mild';
  } | null>(null);

  // Categories list
  const CATEGORIES = [
    'All',
    'Mental & Emotional',
    'Constitutional Generals',
    'Etiology / Causation',
    'Physical Generals',
    'Thermal State',
    'Food & Cravings',
    'Sleep',
    'Female / Menses',
    'GI / Digestive',
    'Respiratory',
    'Skin',
    'Pain',
    'Modalities',
    'Miasmatic Load',
    'Follow-up & Response Indicators',
    'Modern Clinical Conditions'
  ];

  // Organ Systems list
  const ORGAN_SYSTEMS = [
    'All',
    'Cardiovascular',
    'Gastrointestinal',
    'Respiratory',
    'Skin / Integumentary',
    'Endocrine',
    'Musculoskeletal',
    'Psychology & Psychiatry',
    'Generalities'
  ];

  // Miasms list
  const MIASMS = ['All', 'Psora', 'Sycosis', 'Syphilis', 'Tubercular', 'Cancerinic'];

  // Fetch initial rubrics
  useEffect(() => {
    const loadRubrics = async () => {
      setLoading(true);
      try {
        const data = await repertoryRepository.getRubrics();
        setRubrics(data);
      } catch (e) {
        console.error("Failed to load rubrics:", e);
      }
      setLoading(false);
    };
    loadRubrics();
  }, []);

  // Search Debouncer (500ms - 800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query database based on filters and search
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const filters = {
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          organSystem: selectedOrganSystem === 'All' ? undefined : selectedOrganSystem,
          miasm: selectedMiasm === 'All' ? undefined : selectedMiasm,
          remedy: selectedRemedy === 'All' ? undefined : selectedRemedy
        };

        if (debouncedSearch.trim()) {
          const candidates = await clinicalRepertoryService.current.searchRubrics(debouncedSearch, filters);
          const data = await Promise.all(candidates.map(c => repertoryRepository.getRubricById(c.id)));
          setRubrics(data.filter((r): r is NonNullable<typeof r> => r !== undefined));
        } else {
          const data = await repertoryRepository.getRubrics(filters);
          setRubrics(data);
        }
      } catch (e) {
        console.error("Filtered retrieval failed:", e);
      }
    };
    fetchFiltered();
  }, [debouncedSearch, selectedCategory, selectedOrganSystem, selectedMiasm, selectedRemedy]);

  // Recalculate scoring, differentiations, reasoning summary, and validation safety checks using the Codex Clinical Workspace Service
  useEffect(() => {
    const recalculate = async () => {
      if (selectedRubrics.length === 0) {
        setScoringResult(null);
        setDifferentiations([]);
        setReasoningSummary(null);
        setValidationFindings([]);
        return;
      }
      setIsScoringLoading(true);
      try {
        const result = await clinicalRepertoryService.current.runClinicalAnalysis({
          query: undefined,
          selectedRubrics: selectedRubrics.map(sr => ({
            rubricId: sr.rubricId,
            severity: sr.severity,
            frequency: sr.frequency,
            impact: sr.impact
          }))
        });

        if (result.success) {
          if (result.scoringResult) {
            setScoringResult(result.scoringResult);
          }
          if (result.differentiations) {
            setDifferentiations(result.differentiations);
          }
          if (result.reasoningSummary) {
            setReasoningSummary(result.reasoningSummary);
          }
          setValidationFindings(result.validationFindings || []);
        }
      } catch (e) {
        console.error("Clinical analysis calculation failed:", e);
      }
      setIsScoringLoading(false);
    };
    recalculate();
  }, [selectedRubrics]);

  // Recalculate longitudinal history matching active selected rubrics
  useEffect(() => {
    const updateTimeline = async () => {
      if (selectedRubrics.length === 0) {
        setLongitudinalSummary(null);
        return;
      }

      const now = new Date();
      const visit1Date = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
      const visit2Date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const visit3Date = now.toISOString();

      const keyRubrics = selectedRubrics.slice(0, 2);
      if (keyRubrics.length === 0) return;

      const mockTimeline: VisitTimelineEntry[] = [
        {
          visitId: 'visit-1',
          date: visit1Date,
          activeSymptoms: keyRubrics.map(kr => ({
            rubricId: kr.rubricId,
            severity: Math.min(10, kr.severity + 2),
            observedIntensity: 8
          })),
          prescribedRemedyId: 'Ars',
          potency: '30C',
          dosage: 'Once daily',
          generalAmeliorationRating: 2,
          notes: 'Patient presented with severe acute burning pains and midnight restlessness. Prescribed Ars 30C.'
        },
        {
          visitId: 'visit-2',
          date: visit2Date,
          activeSymptoms: keyRubrics.map(kr => ({
            rubricId: kr.rubricId,
            severity: Math.min(10, kr.severity + 1),
            observedIntensity: 4
          })),
          prescribedRemedyId: 'Ars',
          potency: '200C',
          dosage: 'Single dose',
          generalAmeliorationRating: 4,
          notes: 'Burning pains subsided by 50%. Restlessness resolved. Eruptions on skin appeared. Potency scaled to 200C.'
        },
        {
          visitId: 'visit-3',
          date: visit3Date,
          activeSymptoms: selectedRubrics.map(kr => ({
            rubricId: kr.rubricId,
            severity: kr.severity,
            observedIntensity: kr.severity
          })),
          prescribedRemedyId: null,
          potency: null,
          dosage: null,
          generalAmeliorationRating: lastAmeliorationRating,
          notes: 'Current follow-up session. Assessing remedy response and next steps.'
        }
      ];

      try {
        const summary = await clinicalRepertoryService.current.getLongitudinalSummary('patient-1', mockTimeline);
        setLongitudinalSummary(summary);
      } catch (err) {
        console.error("Timeline analysis calculation failed:", err);
      }
    };

    updateTimeline();
  }, [selectedRubrics, lastAmeliorationRating]);

  useEffect(() => {
    if (scoringResult && scoringResult.topRemedies.length > 0) {
      if (!activeReasoningRemedyId || !scoringResult.topRemedies.some(r => r.remedyId === activeReasoningRemedyId)) {
        setActiveReasoningRemedyId(scoringResult.topRemedies[0].remedyId);
      }
    } else {
      setActiveReasoningRemedyId(null);
    }
  }, [scoringResult, activeReasoningRemedyId]);

  // Toggle rubric selection in workbench
  const handleToggleRubric = (rubric: RepertoryRubric) => {
    const index = selectedRubrics.findIndex(s => s.rubricId === rubric.rubricId);
    if (index > -1) {
      setSelectedRubrics(prev => prev.filter(s => s.rubricId !== rubric.rubricId));
    } else {
      setSelectedRubrics(prev => [
        ...prev,
        {
          rubricId: rubric.rubricId,
          severity: rubric.intensityScale || 5,
          frequency: 'frequent',
          impact: 'moderate'
        }
      ]);
    }
  };

  // Open config drawer for active modifiers
  const handleConfigureSymptom = (rubricId: string) => {
    const symptom = selectedRubrics.find(s => s.rubricId === rubricId);
    if (symptom) {
      setModifyingSymptom({ ...symptom });
    }
  };

  // Save modified severity, frequency, or impact
  const handleSaveSymptomModifiers = () => {
    if (modifyingSymptom) {
      setSelectedRubrics(prev => 
        prev.map(s => s.rubricId === modifyingSymptom.rubricId ? { ...modifyingSymptom } : s)
      );
      setModifyingSymptom(null);
    }
  };

  // Remove symptom from workbench
  const handleRemoveSymptom = (rubricId: string) => {
    setSelectedRubrics(prev => prev.filter(s => s.rubricId !== rubricId));
  };

  // Parse NLP Clinical Intake
  const handleParseIntake = async () => {
    if (!nlpInput.trim()) return;
    setParsingIntake(true);
    try {
      const results = await clinicalRepertoryService.current.parseAIIntakeText(nlpInput);
      
      // Map results back to selected rubrics
      const incoming = results.matchedRubrics.map((m: { rubricId: string; suggestedSeverity: number }) => ({
        rubricId: m.rubricId,
        severity: m.suggestedSeverity,
        frequency: 'frequent' as const,
        impact: 'moderate' as const
      }));

      // Merge with existing
      setSelectedRubrics(prev => {
        const filtered = prev.filter(s => !incoming.some((i: { rubricId: string }) => i.rubricId === s.rubricId));
        return [...filtered, ...incoming];
      });

      setNlpInput('');
      alert(`Intake processing complete! Matched ${results.matchedRubrics.length} clinical indicators with active weights.`);
    } catch (e) {
      console.error("AI Intake mapping failed:", e);
    }
    setParsingIntake(false);
  };

  // Run Database Quality Audit
  const handleRunAudit = async () => {
    setAuditLoading(true);
    try {
      const report = await DatabaseValidator.validateDatabase();
      setAuditReport(report);
      setShowAuditModal(true);
    } catch (e) {
      console.error("Database audit failed:", e);
    }
    setAuditLoading(false);
  };

  // Export handlers
  const handleExportData = async (type: 'json' | 'csv' | 'mdx' | 'triples') => {
    try {
      let content = '';
      let filename = `repertory_export_${Date.now()}`;
      
      if (type === 'json') {
        content = await ImportExportService.exportToJSON();
        filename += '.json';
      } else if (type === 'csv') {
        content = await ImportExportService.exportToCSV();
        filename += '.csv';
      } else if (type === 'mdx') {
        content = await ImportExportService.exportToMDX();
        filename += '.mdx';
      } else {
        content = await ImportExportService.exportToGraphTriples();
        filename += '_triples.txt';
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export operation failed:", e);
    }
  };

  // Send summary reports safely to treatment planner (no automated scripts)
  const handleSendToPlanner = () => {
    if (!scoringResult || scoringResult.topRemedies.length === 0) return;
    
    let summary = `Repertory suggestions for clinician review.\n\n`;
    summary += `Calculated on: ${new Date().toLocaleString()}\n`;
    summary += `Selected Rubrics (${selectedRubrics.length}):\n`;
    
    selectedRubrics.forEach(s => {
      const match = rubrics.find(r => r.rubricId === s.rubricId);
      if (match) {
        summary += ` - ${match.title} (Severity: ${s.severity}/10, Freq: ${s.frequency})\n`;
      }
    });

    summary += `\nTop Suggested Remedies:\n`;
    scoringResult.topRemedies.slice(0, 3).forEach((r, idx) => {
      summary += `${idx + 1}. ${r.remedyName} (${r.remedyId}) - Score: ${r.score} (Confidence: ${r.confidence}%)\n`;
    });

    summary += `\nMissing parameters to query:\n`;
    scoringResult.missingDataNeeded.forEach(m => {
      summary += ` - ${m}\n`;
    });

    summary += `\nWARNING: For clinician verification. Do not automatically prescribe.`;

    if (onSendToTreatmentPlanner) {
      onSendToTreatmentPlanner(summary);
    } else {
      alert("Summary copied to Clipboard! Paste it directly into your Treatment Planner template.");
      navigator.clipboard.writeText(summary);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Safety Header Badge */}
      <div className="bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30 p-4 rounded-3xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-850 dark:text-amber-300">Clinical Review Protocol</h4>
            <p className="text-[10px] text-amber-700/80 dark:text-slate-400 font-bold mt-0.5">
              {CLINICAL_WORKSPACE_SAFETY_NOTICE}.
            </p>
          </div>
        </div>
        <span className="text-[8px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-900/30">
          clinician verification required
        </span>
      </div>

      {/* Real-time Clinical Validation Findings */}
      {validationFindings.length > 0 && (
        <div className="bg-rose-50/80 dark:bg-rose-950/10 border border-rose-150/50 dark:border-rose-900/20 p-4 rounded-3xl space-y-2 shadow-xs">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-450 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Clinical Validation Audits ({validationFindings.length})
          </h4>
          <ul className="text-[10px] text-rose-700/90 dark:text-slate-400 font-bold space-y-1.5 pl-4 list-disc">
            {validationFindings.map((finding, idx) => (
              <li key={idx} className={finding.severity === 'critical' ? 'text-rose-900 dark:text-rose-350 font-black' : ''}>
                <span className="uppercase text-[8px] font-black tracking-wider bg-rose-100 dark:bg-rose-900/30 px-1.5 py-0.5 rounded mr-1.5">
                  {finding.category.replace('_', ' ')}
                </span>
                {finding.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch pb-12 text-slate-800">
      
      {/* LEFT COLUMN: Search & Rubric Directory (Col Span 4) */}
      <div className="xl:col-span-4 flex flex-col gap-6 order-2 xl:order-1">
        
        {/* Search & NLP Intake Block */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-500" />
              Symptom Lookup & AI Intake
            </h3>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-mono">
              Repertory suggestions for clinician review
            </span>
          </div>

          {/* Quick NLP parse block */}
          <div className="space-y-2">
            <textarea
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
              placeholder="Paste raw patient voice intake here (e.g., 'Worse at 3am, anxious, extremely chilly, bloating immediately after eating')..."
              className="w-full h-20 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none font-semibold leading-relaxed"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleParseIntake}
                disabled={parsingIntake || !nlpInput.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {parsingIntake ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                Parse Case Intake
              </button>
            </div>
          </div>

          {/* Directory Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rubrics, synonyms, remedies..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedOrganSystem}
                onChange={(e) => setSelectedOrganSystem(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="All">All Systems</option>
                {ORGAN_SYSTEMS.filter(o => o !== 'All').map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rubrics Catalog List */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 flex-grow shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Clinical Rubrics Catalog ({rubrics.length} matches)
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={auditLoading}
                className="text-[10px] font-black border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Audit Database
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ) : rubrics.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <Info className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-xs font-bold">No active clinical rubrics found matching current filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-[550px] overflow-y-auto pr-1">
              {rubrics.map(rub => {
                const isActive = selectedRubrics.some(s => s.rubricId === rub.rubricId);
                const isExpanded = expandedRubricId === rub.rubricId;
                
                return (
                  <div 
                    key={rub.rubricId}
                    className={`flex flex-col bg-white rounded-2xl border transition-all duration-300 p-4 shadow-2xs hover:shadow-xs ${
                      isActive ? 'border-emerald-500/40 bg-emerald-50/10' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 text-left flex-grow min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                            {rub.category}
                          </span>
                          <span className="text-[8px] font-semibold text-slate-400 font-mono">
                            {rub.organSystem}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{rub.title}</h5>
                        <p className="text-[10px] text-slate-400 font-medium italic">
                          {rub.classicalWording}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpandedRubricId(isExpanded ? null : rub.rubricId)}
                          className="p-1.5 border border-slate-200 hover:border-slate-800 rounded-xl bg-white text-slate-400 hover:text-slate-800 text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          {isExpanded ? 'Hide Grades' : 'Show Grades'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleRubric(rub)}
                          className={`p-1.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 ${
                            isActive
                              ? 'bg-rose-500 border-rose-500 hover:bg-rose-600 text-white'
                              : 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 text-white'
                          }`}
                          title={isActive ? "Remove from workbench" : "Add to workbench"}
                        >
                          {isActive ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Remedy Grades Details Drawer */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-left space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                            <strong className="text-slate-700">Meaning:</strong> {rub.plainLanguageMeaning}
                          </p>
                          {rub.clinicalNotes && (
                            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                              <strong className="text-slate-700">Clinical Tip:</strong> {rub.clinicalNotes}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <span className="block text-[8px] font-black uppercase text-slate-400 tracking-widest font-mono">
                            Graded Remedy Coverage ({rub.relatedRemedies.length})
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {rub.relatedRemedies.map(rem => {
                              // Grade color code
                              const gradeBadge = 
                                rem.grade === 4 ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                rem.grade === 3 ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                rem.grade === 2 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                'bg-slate-100 text-slate-700 border-slate-200';
                              
                              const gradeLabel =
                                rem.grade === 4 ? 'Grade 4 (Keynote)' :
                                rem.grade === 3 ? 'Grade 3 (Strong)' :
                                rem.grade === 2 ? 'Grade 2 (Moderate)' :
                                'Grade 1 (Low)';

                              return (
                                <div key={rem.remedyId} className="flex flex-col bg-slate-50 border border-slate-100 p-2 rounded-xl">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-900">{rem.remedyId} - {rem.remedyName}</span>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${gradeBadge}`}>
                                      {gradeLabel}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-slate-500 leading-normal font-semibold mt-1">
                                    {rem.keynoteReason}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* CENTER COLUMN: Active Workbench & Scoring (Col Span 4) */}
      <div className="xl:col-span-4 flex flex-col gap-6 order-1 xl:order-2">
        
        {/* Active Symptoms Panel */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500 animate-pulse" />
              Active Workbench ({selectedRubrics.length})
            </h3>
            <button
              onClick={() => setSelectedRubrics([])}
              disabled={selectedRubrics.length === 0}
              className="text-[9px] font-black text-rose-500 hover:text-rose-600 disabled:opacity-50 cursor-pointer uppercase border-none bg-transparent"
            >
              Clear Workbench
            </button>
          </div>

          {selectedRubrics.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-2xl">
              <HelpCircle className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
              <p className="text-xs font-semibold">No rubrics selected. Click the '+' button in the catalog or parse intake text to begin analysis.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {selectedRubrics.map(s => {
                const rub = rubrics.find(r => r.rubricId === s.rubricId);
                return (
                  <div key={s.rubricId} className="bg-slate-50 border border-slate-150 p-2.5 rounded-2xl flex items-center justify-between gap-3 group">
                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-black text-slate-800 line-clamp-1">{rub?.title || s.rubricId}</span>
                      <div className="flex gap-2 text-[8px] font-mono text-emerald-600 font-bold mt-0.5">
                        <span>Severity: {s.severity}/10</span>
                        <span>•</span>
                        <span className="capitalize">{s.frequency}</span>
                        <span>•</span>
                        <span className="capitalize">{s.impact} Impact</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleConfigureSymptom(s.rubricId)}
                        className="p-1 border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 rounded-lg text-[9px] font-black uppercase px-2 font-mono cursor-pointer transition-colors"
                      >
                        Adjust
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(s.rubricId)}
                        className="p-1.5 border border-rose-100 hover:border-rose-500 rounded-lg bg-rose-50/50 hover:bg-rose-500 hover:text-white text-rose-500 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Real-time Scoring Panel */}
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 space-y-4 shadow-sm text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              Repertorization Scoring Panel
            </h3>
            {scoringResult && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono">
                Margin: {scoringResult.confidenceScore}%
              </span>
            )}
          </div>

          <div className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-2xl text-center font-mono uppercase tracking-wider">
            ⚠️ Repertory suggestions for clinician review. Do not auto-prescribe.
          </div>

          {isScoringLoading ? (
            <div className="flex justify-center items-center py-10">
              <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          ) : !scoringResult || scoringResult.topRemedies.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              <p className="text-xs font-semibold">Select symptoms to calculate remedy affinities.</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Remedies Bar Chart List */}
              <div className="space-y-2">
                {scoringResult.topRemedies.slice(0, 5).map((rem, idx) => {
                  const maxScore = scoringResult.topRemedies[0].score || 1;
                  const pct = Math.round((rem.score / maxScore) * 100);

                  return (
                    <div 
                      key={rem.remedyId} 
                      onClick={() => setActiveRemedyDetails(activeRemedyDetails === rem.remedyId ? null : rem.remedyId)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col ${
                        activeRemedyDetails === rem.remedyId
                          ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                          : 'bg-slate-850/50 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400">#{idx + 1}</span>
                          <span className="font-black text-emerald-400">{rem.remedyId}</span>
                          <span className="text-[9px] text-slate-350 font-bold max-w-[120px] line-clamp-1">{rem.remedyName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-black">
                          <span className="text-slate-400">Score: {rem.score}</span>
                          <span className="text-emerald-400">({rem.confidence}%)</span>
                        </div>
                      </div>

                      {/* Micro visual progress bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>

                      {/* Differential details expanded inside the chart item */}
                      {activeRemedyDetails === rem.remedyId && (() => {
                        const diff = differentiations.find(d => d.remedyId === rem.remedyId);
                        return (
                          <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-[10px] text-slate-350 font-semibold animate-in fade-in duration-200">
                            <div className="bg-slate-900/65 p-2 border border-white/5 rounded-xl text-[8px] font-bold text-amber-400/90 text-center uppercase tracking-wider font-mono">
                              ⚠️ Repertory suggestions for clinician review
                            </div>
                            <p className="text-emerald-400/90 font-bold leading-normal">{diff?.reason}</p>
                            
                            {diff?.strongestMatchingRubrics && diff.strongestMatchingRubrics.length > 0 && (
                              <div>
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider font-mono block">Strong matches:</span>
                                <p className="text-slate-300 leading-normal">{diff.strongestMatchingRubrics.join(', ')}</p>
                              </div>
                            )}

                            {diff?.missingConfirmingRubrics && diff.missingConfirmingRubrics.length > 0 && (
                              <div>
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider font-mono block">Missing Confirming Rubrics:</span>
                                <p className="text-slate-300 leading-normal">{diff.missingConfirmingRubrics.join(', ')}</p>
                              </div>
                            )}

                            {diff?.cautionNotes && (
                              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-1.5 rounded-lg font-bold">
                                {diff.cautionNotes}
                              </div>
                            )}

                            <span className="block text-[8px] font-bold text-slate-500 font-mono italic">
                              {diff?.materiaMedicaRef}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>

              {/* Missing general parameters suggestions */}
              {scoringResult.missingDataNeeded.length > 0 && (
                <div className="bg-emerald-950/40 border border-emerald-500/10 rounded-2xl p-3.5 space-y-1.5">
                  <span className="text-[8px] font-black uppercase text-emerald-400 tracking-wider font-mono block">Missing Clinical Parameters</span>
                  <ul className="list-disc pl-4 text-[10px] text-slate-300 font-semibold space-y-1">
                    {scoringResult.missingDataNeeded.map(m => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Send / Export buttons */}
              <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSendToPlanner}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 font-mono"
                >
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  Send to Planner
                </button>
                <div className="relative group/export">
                  <button
                    type="button"
                    className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-white/5 flex items-center justify-center gap-1 font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Options
                  </button>
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover/export:flex flex-col bg-slate-800 border border-white/10 rounded-xl p-1 shadow-xl z-20 w-[150px] animate-in fade-in duration-200">
                    <button onClick={() => handleExportData('json')} className="w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg">JSON schema</button>
                    <button onClick={() => handleExportData('csv')} className="w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg">CSV spreadsheet</button>
                    <button onClick={() => handleExportData('mdx')} className="w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg">MDX report</button>
                    <button onClick={() => handleExportData('triples')} className="w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg">RDF Triples</button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Clinical Reasoning Engine (Col Span 4) */}
      <div className="xl:col-span-4 flex flex-col gap-6 order-3 xl:order-3 text-left">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              Reasoning Engine
            </h3>
            <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
              Deterministic Insights
            </span>
          </div>

          <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
            ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
          </div>

          {/* Real-time Clinical Validation Findings inside Reasoning Area */}
          {selectedRubrics.length > 0 && validationFindings.length > 0 && (
            <div className="bg-rose-50/60 dark:bg-rose-950/10 border border-rose-150/55 dark:border-rose-900/20 p-4 rounded-2xl space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-450 flex items-center gap-1.5 justify-start">
                <AlertTriangle className="w-3.5 h-3.5" />
                Live Clinical Audits ({validationFindings.length})
              </h4>
              <ul className="text-[10px] text-rose-700/90 dark:text-slate-400 font-bold space-y-1.5 pl-4 list-disc text-left">
                {validationFindings.map((finding, idx) => (
                  <li key={idx} className={finding.severity === 'critical' ? 'text-rose-900 dark:text-rose-350 font-black' : ''}>
                    <span className="uppercase text-[8px] font-black tracking-wider bg-rose-100 dark:bg-rose-900/30 px-1.5 py-0.5 rounded mr-1.5">
                      {finding.category.replace('_', ' ')}
                    </span>
                    {finding.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRubrics.length === 0 || !reasoningSummary ? (
            <div className="py-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-2xl">
              <HelpCircle className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
              <p className="text-xs font-semibold">No active analysis.</p>
              <p className="text-[10px] text-slate-500 font-semibold px-6">
                Add symptoms to the workbench to generate explainable AI reasoning, coverage heatmaps, differential comparisons, and follow-up prompts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tabs selector */}
              <div className="flex border-b border-slate-200/60 pb-1.5 gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveReasoningTab('explanation')}
                  className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                    activeReasoningTab === 'explanation'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Affinity
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReasoningTab('differential')}
                  className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                    activeReasoningTab === 'differential'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-655 hover:bg-slate-200'
                  }`}
                >
                  Differential
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReasoningTab('coverage')}
                  className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                    activeReasoningTab === 'coverage'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-655 hover:bg-slate-200'
                  }`}
                >
                  Coverage
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReasoningTab('questions')}
                  className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                    activeReasoningTab === 'questions'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-655 hover:bg-slate-200'
                  }`}
                >
                  Questions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReasoningTab('timeline')}
                  className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                    activeReasoningTab === 'timeline'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-655 hover:bg-slate-200'
                  }`}
                >
                  Timeline
                </button>
              </div>

              {/* Tab Contents */}
              {activeReasoningTab === 'explanation' && (() => {
                const activeRes = reasoningSummary.topRemedies.find(r => r.remedyId === activeReasoningRemedyId);
                return (
                  <div className="space-y-4">
                    {/* Remedy selector for active reasoning */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Target Remedy:</span>
                      <select
                        value={activeReasoningRemedyId || ''}
                        onChange={(e) => setActiveReasoningRemedyId(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-bold cursor-pointer"
                      >
                        {reasoningSummary.topRemedies.map(r => (
                          <option key={r.remedyId} value={r.remedyId}>
                            {r.remedyId} - {r.remedyName} ({r.confidence}%)
                          </option>
                        ))}
                      </select>
                    </div>

                    {activeRes ? (
                      <RemedyReasoningPanel 
                        reasoning={{
                          ...activeRes,
                          ...(longitudinalSummary?.remedyOutcomes.find(o => o.remedyId === activeRes.remedyId) || {})
                        }}
                        matchedPatterns={reasoningSummary.matchedPatterns} 
                      />
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">No target remedy selected.</p>
                    )}
                  </div>
                );
              })()}

              {activeReasoningTab === 'differential' && (
                <DifferentialComparison comparisons={reasoningSummary.differentialComparisons} />
              )}

              {activeReasoningTab === 'coverage' && activeReasoningRemedyId && (
                <div className="space-y-4">
                  {/* Remedy selector for active reasoning */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Target Remedy:</span>
                    <select
                      value={activeReasoningRemedyId || ''}
                      onChange={(e) => setActiveReasoningRemedyId(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-bold cursor-pointer"
                    >
                      {reasoningSummary.topRemedies.map(r => (
                        <option key={r.remedyId} value={r.remedyId}>
                          {r.remedyId} - {r.remedyName} ({r.confidence}%)
                        </option>
                      ))}
                    </select>
                  </div>
                  <RubricCoverageHeatmap 
                    confidenceBreakdown={reasoningSummary.confidenceBreakdown} 
                    remedyId={activeReasoningRemedyId} 
                  />
                  <ConfidenceBreakdownPanel 
                    evidenceBreakdown={reasoningSummary.evidenceBreakdown} 
                    remedyId={activeReasoningRemedyId} 
                  />
                </div>
              )}

              {activeReasoningTab === 'questions' && (
                <div className="space-y-4">
                  <MissingInformationCard missingInfo={reasoningSummary.missingInformation} />
                  <SuggestedQuestions questions={reasoningSummary.suggestedQuestions} />
                </div>
              )}

              {activeReasoningTab === 'timeline' && (
                <ReasoningTimeline summary={longitudinalSummary} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODIFIER CONFIG POPUP MODAL */}
      {modifyingSymptom && (() => {
        const rub = rubrics.find(r => r.rubricId === modifyingSymptom.rubricId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider font-mono bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Adjust Clinical Modifiers
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{rub?.title || modifyingSymptom.rubricId}</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">{rub?.category}</p>
              </div>

              {/* Severity Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Severity Scale</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                    {modifyingSymptom.severity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={modifyingSymptom.severity}
                  onChange={(e) => setModifyingSymptom({ ...modifyingSymptom, severity: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-100 accent-emerald-500 rounded-lg appearance-none cursor-pointer border border-slate-200/50"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold font-mono">
                  <span>Mild (1-3)</span>
                  <span>Moderate (4-7)</span>
                  <span>Severe (8-10)</span>
                </div>
              </div>

              {/* Frequency segmented */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Frequency Modifiers</span>
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200/40">
                  {(['constant', 'frequent', 'occasional'] as const).map((freq) => (
                    <button
                      type="button"
                      key={freq}
                      onClick={() => setModifyingSymptom({ ...modifyingSymptom, frequency: freq })}
                      className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer border-none ${
                        modifyingSymptom.frequency === freq
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800 bg-transparent"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Level Segmented */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Functional Impact</span>
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200/40">
                  {(['severe', 'moderate', 'mild'] as const).map((imp) => (
                    <button
                      type="button"
                      key={imp}
                      onClick={() => setModifyingSymptom({ ...modifyingSymptom, impact: imp })}
                      className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer border-none ${
                        modifyingSymptom.impact === imp
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800 bg-transparent"
                      }`}
                    >
                      {imp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveSymptomModifiers}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer border-none font-mono"
                >
                  Save Modifiers
                </button>
                <button
                  type="button"
                  onClick={() => setModifyingSymptom(null)}
                  className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-500 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-mono"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DATABASE QUALITY AUDIT REPORT MODAL */}
      {showAuditModal && auditReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Clinical Repertory Quality Audit Report
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Checking data compliance, structures, synonyms, and claims rules</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent font-bold cursor-pointer text-sm"
              >
                Close
              </button>
            </div>

            {/* Overall status */}
            <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
              auditReport.isValid 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-rose-50 border-rose-100 text-rose-800'
            }`}>
              {auditReport.isValid ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertTriangle className="w-6 h-6 shrink-0" />}
              <div>
                <p className="text-xs font-black">
                  Database Status: {auditReport.isValid ? 'VALID & COMPLIANT' : 'ATTENTION REQUIRED'}
                </p>
                <p className="text-[10px] font-semibold leading-relaxed mt-0.5">
                  {auditReport.isValid 
                    ? 'All checked rubrics meet clinical terminology rules, grading limits, and safety standards.'
                    : 'We detected duplicate titles, invalid remedy mappings, or prohibited definitive claims.'}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Prohibited claims check results */}
              <div className="space-y-2">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">1. Prohibited Definitive Claims ({auditReport.prohibitedClaims.length})</span>
                {auditReport.prohibitedClaims.length === 0 ? (
                  <p className="text-[10px] text-emerald-600 font-bold">✓ Zero definitive claims detected. Complies with safety regulations.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    {auditReport.prohibitedClaims.map((p, idx) => (
                      <div key={idx} className="bg-rose-50 border border-rose-100 text-rose-800 p-2 rounded-lg text-[10px]">
                        <strong>Rubric: {p.rubricId}</strong> (Field: {p.field}) - Contains prohibited term: <strong className="underline font-black">"{p.term}"</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Duplicate Detection results */}
              <div className="space-y-2">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">2. Duplicate Rubrics Detected ({auditReport.duplicates.length})</span>
                {auditReport.duplicates.length === 0 ? (
                  <p className="text-[10px] text-emerald-600 font-bold">✓ No duplicates or highly overlapping titles found.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    {auditReport.duplicates.map((d, idx) => (
                      <div key={idx} className="bg-amber-50 border border-amber-100 text-amber-800 p-2 rounded-lg text-[10px] flex items-center justify-between">
                        <span>"{d.title1}" <strong className="text-slate-500">↔</strong> "{d.title2}"</span>
                        <span className="font-mono text-[9px] bg-white border border-amber-200 px-1.5 rounded font-black">{Math.round(d.distance * 100)}% Match</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Orphan rubrics check results */}
              <div className="space-y-2">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">3. Orphan Rubrics Check ({auditReport.orphanRubrics.length})</span>
                {auditReport.orphanRubrics.length === 0 ? (
                  <p className="text-[10px] text-emerald-600 font-bold">✓ All rubrics are properly connected in the relationship graph.</p>
                ) : (
                  <p className="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-100/50 p-2 rounded-xl">
                    Orphan Rubrics: {auditReport.orphanRubrics.join(', ')}
                  </p>
                )}
              </div>

              {/* Invalid remedy ids check results */}
              <div className="space-y-2">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">4. Invalid Remedy Abbreviations ({auditReport.invalidRemedyIds.length})</span>
                {auditReport.invalidRemedyIds.length === 0 ? (
                  <p className="text-[10px] text-emerald-600 font-bold">✓ All mapped remedies correspond to valid Materia Medica identifiers.</p>
                ) : (
                  <div className="space-y-1.5 bg-rose-50 border border-rose-100 p-2 rounded-xl text-rose-800 text-[10px]">
                    {auditReport.invalidRemedyIds.map((ir, idx) => (
                      <div key={idx}>Rubric {ir.rubricId} references invalid remedy code: <strong>{ir.remedyId}</strong></div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
