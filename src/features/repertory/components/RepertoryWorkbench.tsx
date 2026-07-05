import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sliders, Trash2, Plus, Info, RefreshCw, CheckCircle, 
  AlertTriangle, BookOpen, Download, HelpCircle, ArrowRight, Check,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { RepertoryRubric, ScoringResult, RemedyDifferentiation, ValidationReport, ClinicalReasoningSummary } from '../types';
import { repertoryRepository } from '../database/repertoryDb';
import { DatabaseValidator } from '../validators/databaseValidator';
import { ImportExportService } from '../import-export/importExportService';
import { DifferentialComparison } from './DifferentialComparison';
import { ConfidenceBreakdownPanel } from './ConfidenceBreakdownPanel';
import { RubricCoverageHeatmap } from './RubricCoverageHeatmap';
import { ReasoningTimeline } from './ReasoningTimeline';
import { createClinicalRepertoryService } from '../clinicalWorkspace/clinicalRepertoryService';
import { ClinicalValidationFinding } from '../clinicalWorkspace/types';
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
  const [validationFindings, setValidationFindings] = useState<ClinicalValidationFinding[]>([]);
  const [longitudinalSummary, setLongitudinalSummary] = useState<LongitudinalCaseSummary | null>(null);
  const [lastAmeliorationRating, setLastAmeliorationRating] = useState<number>(3);

  // Dialogs & Audits
  const [auditReport, setAuditReport] = useState<ValidationReport | null>(null);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [importedStatus, setImportedStatus] = useState<{ success?: string; error?: string }>({});

  const [activeDockTab, setActiveDockTab] = useState<string>('materia-medica');
  const [expandedDockSection, setExpandedDockSection] = useState<string | null>(null);

  // UI state
  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(null);
  const [isCatalogExpanded, setIsCatalogExpanded] = useState<boolean | null>(null);
  const [showAllAudits, setShowAllAudits] = useState<boolean>(false);
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

  const getCategorizedChips = () => {
    const mental: any[] = [];
    const physical: any[] = [];
    const sleep: any[] = [];
    const modalities: any[] = [];
    const general: any[] = [];

    selectedRubrics.forEach(sr => {
      const rub = rubrics.find(r => r.rubricId === sr.rubricId);
      if (!rub) return;

      const titleLower = rub.title.toLowerCase();
      const catLower = rub.category.toLowerCase();

      const chip = { sr, rub };

      if (catLower.includes('mind') || catLower.includes('delusions') || catLower.includes('mental')) {
        mental.push(chip);
      } else if (catLower.includes('sleep') || catLower.includes('dreams')) {
        sleep.push(chip);
      } else if (catLower.includes('modality') || titleLower.includes('worse') || titleLower.includes('better') || titleLower.includes('agg') || titleLower.includes('amel')) {
        modalities.push(chip);
      } else if (
        catLower.includes('stomach') || catLower.includes('abdomen') || 
        catLower.includes('rectum') || catLower.includes('stool') || 
        catLower.includes('head') || catLower.includes('mouth') ||
        catLower.includes('throat') || catLower.includes('chest') ||
        catLower.includes('respiratory') || catLower.includes('cough') ||
        catLower.includes('physical')
      ) {
        physical.push(chip);
      } else {
        general.push(chip);
      }
    });

    return { mental, physical, sleep, modalities, general };
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

  const renderDockContent = () => {
    if (!reasoningSummary || !activeReasoningRemedyId) {
      return (
        <div className="p-8 text-center text-slate-400 text-xs font-semibold">
          Select a remedy candidate above to inspect detailed clinical intelligence.
        </div>
      );
    }

    const activeRes = reasoningSummary.topRemedies.find(r => r.remedyId === activeReasoningRemedyId);
    if (!activeRes) return null;

    switch (activeDockTab) {
      case 'materia-medica':
        return (
          <div className="space-y-3">
            {[
              { id: 'mm-summary', label: '📖 Materia Medica Summary', content: activeRes.materiaMedicaSummary || 'No summary registered.' },
              { id: 'mm-keynotes', label: '🩺 Keynotes & Confirmations', list: activeRes.keynotes || [] },
              { id: 'mm-mentals', label: '🧠 Mental Generals', list: activeRes.mentals || [] },
              { id: 'mm-physicals', label: '💪 Physical Generals', list: activeRes.physicalGenerals || [] },
              { id: 'mm-modalities', label: '✨ Modalities', list: activeRes.modalities || [] }
            ].map(sec => {
              const isOpen = expandedDockSection === sec.id;
              return (
                <div key={sec.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden text-left">
                  <button
                    type="button"
                    onClick={() => setExpandedDockSection(isOpen ? null : sec.id)}
                    className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 outline-none border-none cursor-pointer"
                  >
                    <span>{sec.label}</span>
                    <span className="text-slate-400 font-mono">{isOpen ? '▼' : '▶'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs text-slate-650 leading-relaxed border-t border-slate-100 text-left space-y-1">
                      {sec.content ? (
                        <p>{sec.content}</p>
                      ) : sec.list && sec.list.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {sec.list.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      ) : (
                        <p className="text-slate-400 italic">None registered.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'clinical-reasoning':
        return (
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-left space-y-4 text-xs">
            <h4 className="font-bold text-slate-800">Remedy Reasoning Explanation</h4>
            <p className="text-slate-650 leading-relaxed">{activeRes.materiaMedicaSummary}</p>
            {activeRes.clinicalPearls && activeRes.clinicalPearls.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">Clinical Observations:</span>
                <div className="space-y-2">
                  {activeRes.clinicalPearls.map((pearl, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="font-semibold text-slate-750">{pearl.text}</p>
                      <span className="text-[9px] text-slate-400 font-mono capitalize mt-1 block">Origin: {pearl.origin}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'knowledge-graph':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-800 mb-3 text-left">Rubric Coverage Heatmap</h4>
              <RubricCoverageHeatmap 
                confidenceBreakdown={reasoningSummary.confidenceBreakdown} 
                remedyId={activeReasoningRemedyId} 
              />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-800 mb-3 text-left">Confidence Breakdown</h4>
              <ConfidenceBreakdownPanel 
                evidenceBreakdown={reasoningSummary.evidenceBreakdown} 
                remedyId={activeReasoningRemedyId} 
              />
            </div>
          </div>
        );

      case 'relationships':
        const rels = activeRes.relationships || {};
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-slate-800">Complementary & Follows Well</h4>
              <div className="space-y-1">
                <span className="font-bold text-slate-500 text-[10px]">Complementary:</span>
                <p className="text-slate-650">{rels.complementary?.join(', ') || 'None'}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-500 text-[10px]">Follows Well:</span>
                <p className="text-slate-650">{rels.followsWell?.join(', ') || 'None'}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-slate-800">Inimical & Antidotes</h4>
              <div className="space-y-1">
                <span className="font-bold text-slate-500 text-[10px]">Inimical (Antagonistic):</span>
                <p className="text-slate-650 text-rose-650 font-bold">{rels.inimical?.join(', ') || 'None'}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-500 text-[10px]">Antidotes:</span>
                <p className="text-slate-650">{rels.antidotes?.join(', ') || 'None'}</p>
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <ReasoningTimeline summary={longitudinalSummary} />
          </div>
        );

      case 'editorial-sources':
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-800">Editorial Provenance Records</h4>
            {activeRes.evidenceItems && activeRes.evidenceItems.length > 0 ? (
              <div className="space-y-3">
                {activeRes.evidenceItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-850">{item.title}</span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8px] font-black px-1.5 py-0.5 rounded font-mono uppercase">{item.editorialStatus}</span>
                    </div>
                    <p className="text-slate-600">{item.summary}</p>
                    <div className="text-[9px] text-slate-400 font-mono">
                      Reviewer: {item.reviewer} | Last Reviewed: {item.lastReviewed}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-xs">No editorial records registered.</p>
            )}
          </div>
        );

      case 'clinical-experience':
        const obs = activeRes.clinicalPearls?.filter(p => p.origin.includes('clinical') || p.origin.includes('Jethwani')) || [];
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-3 text-xs">
            <h4 className="font-bold text-slate-800">Dr. Jethwani Curated Clinical Observations</h4>
            {obs.length > 0 ? (
              <div className="space-y-2">
                {obs.map((o, idx) => (
                  <div key={idx} className="p-3 bg-indigo-50/40 border border-indigo-105 rounded-xl">
                    <p className="font-semibold text-indigo-900 leading-normal">{o.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No specific clinical observations mapped to this remedy candidate.</p>
            )}
          </div>
        );

      case 'differentials':
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <DifferentialComparison comparisons={reasoningSummary.differentialComparisons} />
          </div>
        );

      case 'validation':
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Live Validation Audits</h4>
            {validationFindings.length > 0 ? (
              <ul className="text-xs text-rose-700 font-bold space-y-1.5 pl-4 list-disc">
                {validationFindings.map((finding, idx) => (
                  <li key={idx}>
                    <span className="uppercase text-[8px] font-black bg-rose-100 px-1.5 py-0.5 rounded mr-1.5">{finding.category}</span>
                    {finding.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-emerald-600 text-xs font-semibold">✓ 0 validation alerts detected. Clinical integrity check passed.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Sticky Clinical Summary */}
      {(() => {
        const topRem = scoringResult?.topRemedies[0];
        const totalWarnings = scoringResult?.topRemedies.reduce((acc, r) => acc + (r.contradictoryEvidence?.length || 0), 0) || 0;
        const missingGaps = reasoningSummary?.missingInformation?.length || 0;

        return (
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between shadow-xs mb-4 text-[10px] text-slate-700 font-bold">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 uppercase text-[8px] font-black tracking-wider">Clinical OS Summary:</span>
              {topRem ? (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-100">
                  <span>Top Remedy: <strong>{topRem.remedyId}</strong> ({topRem.confidence}%)</span>
                </div>
              ) : (
                <span className="text-slate-400 italic">No active repertorization</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">
                ⚠️ Clinical review required — do not auto-prescribe.
              </span>
              {totalWarnings > 0 && (
                <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[8px] font-black px-2 py-0.5 rounded-lg">
                  {totalWarnings} Warnings
                </span>
              )}
              {missingGaps > 0 && (
                <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[8px] font-black px-2 py-0.5 rounded-lg">
                  {missingGaps} Gaps
                </span>
              )}
            </div>
          </div>
        );
      })()}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pb-12 text-slate-800 lg:h-[calc(100vh-140px)] lg:max-h-[950px] min-h-[500px]">
      
      {/* LEFT COLUMN: Search & Rubric Directory (Col Span 5) */}
      <div className="lg:col-span-5 flex flex-col gap-4 order-2 lg:order-1 lg:overflow-y-auto lg:h-full pb-6 pr-1 scrollbar-thin">
        
        {/* Search & NLP Intake Block */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-500" />
              AI Intake & Symptoms Workspace
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
              className="w-full h-48 md:h-56 min-h-[180px] bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all resize-y font-semibold leading-relaxed"
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

          {/* Extracted Symptoms Grid (compact chips) */}
          {(() => {
            const chips = getCategorizedChips();
            const hasChips = chips.mental.length > 0 || chips.physical.length > 0 || chips.sleep.length > 0 || chips.modalities.length > 0 || chips.general.length > 0;
            if (!hasChips) return null;

            return (
              <div className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl space-y-3 text-left">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Extracted Symptoms</h4>
                <div className="space-y-2">
                  {chips.mental.length > 0 && (
                    <div>
                      <span className="text-[8px] font-black uppercase text-purple-600 block mb-1">Mental</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chips.mental.map(({ sr, rub }) => (
                          <button
                            type="button"
                            key={sr.rubricId}
                            onClick={() => setSearchTerm(rub.title)}
                            className="bg-white border border-purple-200 hover:border-purple-400 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                          >
                            ✓ {rub.title} (G{rub.grade})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chips.physical.length > 0 && (
                    <div>
                      <span className="text-[8px] font-black uppercase text-emerald-600 block mb-1">Physical</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chips.physical.map(({ sr, rub }) => (
                          <button
                            type="button"
                            key={sr.rubricId}
                            onClick={() => setSearchTerm(rub.title)}
                            className="bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                          >
                            ✓ {rub.title} (G{rub.grade})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chips.sleep.length > 0 && (
                    <div>
                      <span className="text-[8px] font-black uppercase text-blue-600 block mb-1">Sleep</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chips.sleep.map(({ sr, rub }) => (
                          <button
                            type="button"
                            key={sr.rubricId}
                            onClick={() => setSearchTerm(rub.title)}
                            className="bg-white border border-blue-200 hover:border-blue-400 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                          >
                            ✓ {rub.title} (G{rub.grade})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chips.modalities.length > 0 && (
                    <div>
                      <span className="text-[8px] font-black uppercase text-amber-600 block mb-1">Modalities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chips.modalities.map(({ sr, rub }) => (
                          <button
                            type="button"
                            key={sr.rubricId}
                            onClick={() => setSearchTerm(rub.title)}
                            className="bg-white border border-amber-200 hover:border-amber-400 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                          >
                            ✓ {rub.title} (G{rub.grade})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chips.general.length > 0 && (
                    <div>
                      <span className="text-[8px] font-black uppercase text-slate-500 block mb-1">General</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chips.general.map(({ sr, rub }) => (
                          <button
                            type="button"
                            key={sr.rubricId}
                            onClick={() => setSearchTerm(rub.title)}
                            className="bg-white border border-slate-200 hover:border-slate-400 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                          >
                            ✓ {rub.title} (G{rub.grade})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Collapsible Clinical Rubrics Catalog */}
        {(() => {
          const resolvedCatalogExpanded = isCatalogExpanded !== null ? isCatalogExpanded : (selectedRubrics.length <= 6);

          return (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  Clinical Rubrics Catalog ({rubrics.length} matches)
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCatalogExpanded(!resolvedCatalogExpanded)}
                    className="text-[10px] font-black border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-mono"
                  >
                    {resolvedCatalogExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Expand
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleRunAudit}
                    disabled={auditLoading}
                    className="text-[10px] font-black border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-mono"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Audit
                  </button>
                </div>
              </div>

              {/* Directory Search & Filters (Always visible inside Catalog card) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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

              {/* Collapsible List Container */}
              {resolvedCatalogExpanded && (
                <div className="border-t border-slate-100 pt-4 flex-grow transition-all duration-300">
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
                    <div className="grid grid-cols-1 gap-3 pr-1">
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
              )}
            </div>
          );
        })()}
      </div>
      {/* CENTER COLUMN: Active Workbench & Scoring (Col Span 4) */}
      <div className="lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2 lg:overflow-y-auto lg:h-full pb-6 pr-1 scrollbar-thin">
        
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
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {selectedRubrics.map(s => {
                const rub = rubrics.find(r => r.rubricId === s.rubricId);
                return (
                  <div key={s.rubricId} className="bg-slate-50 border border-slate-150 p-1.5 px-3 rounded-xl flex items-center justify-between gap-3 group text-[10px]">
                    <div className="flex-grow min-w-0 flex items-center gap-2">
                      <span className="font-bold text-slate-800 truncate max-w-[120px] xl:max-w-[180px]">{rub?.title || s.rubricId}</span>
                      <div className="flex items-center gap-1.5 text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50 shrink-0 font-bold">
                        <span>Sev: {s.severity}/10</span>
                        <span>•</span>
                        <span className="capitalize">{s.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleConfigureSymptom(s.rubricId)}
                        className="p-1 border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 rounded-lg text-[8px] font-black uppercase px-2 font-mono cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(s.rubricId)}
                        className="p-1.5 border border-rose-100 hover:border-rose-500 rounded-lg bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 cursor-pointer transition-all"
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
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-400">#{idx + 1}</span>
                          <span className="font-extrabold text-emerald-400">{rem.remedyId}</span>
                          <span className="text-[8px] text-slate-400 font-medium max-w-[80px] truncate">{rem.remedyName}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[9px] font-medium text-slate-350">
                          <span>Score: {rem.score}</span>
                          <span className="text-emerald-400">({rem.confidence}%)</span>
                          <span className="text-blue-400">Fit: {rem.constitutionalFit || 0}%</span>
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

      {/* RIGHT COLUMN: Clinical Reasoning Engine (Col Span 3) */}
      <div className="lg:col-span-3 flex flex-col gap-4 order-3 lg:order-3 text-left lg:overflow-y-auto lg:h-full pb-6 pr-1 scrollbar-thin">
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
            <div className="bg-rose-50/60 border border-rose-150/40 p-3 rounded-xl space-y-2.5 text-left">
              <div className="flex items-center justify-between border-b border-rose-200/40 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Critical Alerts
                  </span>
                  <span className="text-[9px] font-bold text-rose-800 font-mono">
                    {validationFindings.length} issues
                  </span>
                </div>
                {validationFindings.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAudits(!showAllAudits)}
                    className="text-[8px] font-black uppercase border border-rose-200 hover:border-rose-600 bg-white hover:bg-slate-50 text-rose-700 px-2 py-0.5 rounded-lg transition-all cursor-pointer font-mono"
                  >
                    {showAllAudits ? 'Less' : `All (${validationFindings.length})`}
                  </button>
                )}
              </div>
              <ul className="text-[10px] text-rose-700/90 font-bold space-y-1 pl-3.5 list-disc leading-normal">
                {(showAllAudits ? validationFindings : validationFindings.slice(0, 2)).map((finding, idx) => (
                  <li key={idx} className={finding.severity === 'critical' ? 'text-rose-900 font-black' : ''}>
                    <span className="uppercase text-[8px] font-black tracking-wider bg-rose-100/80 text-rose-800 px-1 py-0.2 rounded mr-1 font-mono inline-block">
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
          ) : (() => {
            const activeRes = reasoningSummary.topRemedies.find(r => r.remedyId === activeReasoningRemedyId);
            const patMatch = reasoningSummary.matchedPatterns?.find(p => p.remedyId === activeReasoningRemedyId);
            return (
              <div className="space-y-4">
                {/* Target Remedy Selector */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Target Remedy:</span>
                  <select
                    value={activeReasoningRemedyId || ''}
                    onChange={(e) => {
                      setActiveReasoningRemedyId(e.target.value);
                      setExpandedDockSection(null);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] font-bold cursor-pointer w-full"
                  >
                    {reasoningSummary.topRemedies.map(r => (
                      <option key={r.remedyId} value={r.remedyId}>
                        {r.remedyId} - {r.remedyName} ({r.confidence}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fit Scores */}
                {activeRes && (
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
                    {activeRes.constitutionalFit !== undefined && (
                      <div className="flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <span className="text-[7px] text-slate-400 uppercase font-black">Constitutional Fit</span>
                        <span className="text-emerald-600 font-mono text-[9px] mt-0.5">{activeRes.constitutionalFit}%</span>
                      </div>
                    )}
                    {activeRes.miasmaticFit !== undefined && (
                      <div className="flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <span className="text-[7px] text-slate-400 uppercase font-black">Miasmatic Fit</span>
                        <span className="text-blue-600 font-mono text-[9px] mt-0.5">{activeRes.miasmaticFit}%</span>
                      </div>
                    )}
                    {activeRes.modalityFit !== undefined && (
                      <div className="flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <span className="text-[7px] text-slate-400 uppercase font-black">Modality Align</span>
                        <span className="text-indigo-600 font-mono text-[9px] mt-0.5">{activeRes.modalityFit}%</span>
                      </div>
                    )}
                    {activeRes.etiologyFit !== undefined && (
                      <div className="flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <span className="text-[7px] text-slate-400 uppercase font-black">Etiology Match</span>
                        <span className="text-violet-600 font-mono text-[9px] mt-0.5">{activeRes.etiologyFit}%</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Pattern Match */}
                {patMatch && (
                  <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-xl text-[10px] text-amber-800">
                    <span className="font-bold block">🔥 Clinical Pattern Match:</span>
                    <span className="font-medium block mt-0.5">{patMatch.patternName} ({patMatch.matchPercentage}% Overlap)</span>
                  </div>
                )}

                {/* Missing Confirmations */}
                {patMatch && patMatch.missingIndicators.length > 0 && (
                  <div className="space-y-1.5 text-[9px] text-slate-700">
                    <span className="font-bold text-amber-700">Missing Confirmations:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {patMatch.missingIndicators.map((mi, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg font-bold">
                          {mi.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Follow-up Questions */}
                {reasoningSummary.suggestedQuestions && reasoningSummary.suggestedQuestions.length > 0 && (
                  <div className="space-y-1.5 text-[9px] text-slate-700">
                    <span className="font-bold text-slate-500 uppercase tracking-wide">Next Follow-up Questions:</span>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                      {reasoningSummary.suggestedQuestions.slice(0, 3).map((q, idx) => (
                        <li key={idx}>{q.questionText}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
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

      {/* CLINICAL INTELLIGENCE DOCK */}
      {reasoningSummary && activeReasoningRemedyId && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-6 mt-6 shadow-sm">
          {/* Dock Tab Selector */}
          <div className="flex border-b border-slate-200/60 pb-3 gap-2 overflow-x-auto">
            {[
              { id: 'materia-medica', label: '📖 Materia Medica' },
              { id: 'clinical-reasoning', label: '🩺 Clinical Reasoning' },
              { id: 'knowledge-graph', label: '🕸️ Knowledge Graph' },
              { id: 'relationships', label: '🧬 Relationships' },
              { id: 'timeline', label: '📅 Case Timeline' },
              { id: 'editorial-sources', label: '🎯 Editorial & Provenance' },
              { id: 'clinical-experience', label: '💡 Clinical Experience' },
              { id: 'differentials', label: '📊 Differentials' },
              { id: 'validation', label: '🛡️ Validation Audits' }
            ].map(tab => {
              const isActive = activeDockTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => {
                    setActiveDockTab(tab.id);
                    setExpandedDockSection(null);
                  }}
                  className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl transition cursor-pointer flex-shrink-0 border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="mt-4 min-h-[150px]">
            {renderDockContent()}
          </div>
        </div>
      )}
    </div>
  );
};
