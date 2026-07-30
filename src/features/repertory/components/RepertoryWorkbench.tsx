import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Sliders, Trash2, Plus, Info, RefreshCw, CheckCircle, 
  AlertTriangle, BookOpen, Download, HelpCircle, ArrowRight, Check,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { RepertoryRubric, ScoringResult, RemedyDifferentiation, ValidationReport, ClinicalReasoningSummary } from '../types';
import { getApprovedMiasmsForRubric, IS_MIASMATIC_FILTER_ENABLED, MiasmTypeV1 } from '../projections/RubricMiasmProjectionV1';
import { DifferentialComparison } from './DifferentialComparison';
import { ConfidenceBreakdownPanel } from './ConfidenceBreakdownPanel';
import { RubricCoverageHeatmap } from './RubricCoverageHeatmap';
import { ReasoningTimeline } from './ReasoningTimeline';
import { createClinicalRepertoryService } from '../clinicalWorkspace/clinicalRepertoryService';
import { ClinicalValidationFinding } from '../clinicalWorkspace/types';
import { VisitTimelineEntry, LongitudinalCaseSummary } from '../clinicalWorkspace/longitudinalTypes';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface RepertoryWorkbenchProps {
  sessionUid?: string;
  activePatientId?: string;
  onSendToTreatmentPlanner?: (summary: string) => void;
  onPatientChange?: (patientId: string) => void;
  enableMiasmaticFilter?: boolean;
}

export const RepertoryWorkbench: React.FC<RepertoryWorkbenchProps> = ({
  sessionUid = '',
  activePatientId = '',
  onSendToTreatmentPlanner,
  onPatientChange,
  enableMiasmaticFilter = false
}) => {
  const isFilterEnabled = process.env.NODE_ENV === 'test' && enableMiasmaticFilter === true
    ? true
    : IS_MIASMATIC_FILTER_ENABLED;
  // Database States
  const [rubrics, setRubrics] = useState<RepertoryRubric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Patient Switcher & Case Manager states
  const [patients, setPatients] = useState<any[]>([]);
  const [loadedPatient, setLoadedPatient] = useState<any | null>(null);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState<boolean>(false);
  const [isSyncingToSheet, setIsSyncingToSheet] = useState<boolean>(false);
  const [nlpInput, setNlpInput] = useState<string>('');
  const [parsingIntake, setParsingIntake] = useState<boolean>(false);

  // New Case Registration fields
  const [newCaseName, setNewCaseName] = useState('');
  const [newCaseAge, setNewCaseAge] = useState('');
  const [newCaseGender, setNewCaseGender] = useState('Male');
  const [newCasePhone, setNewCasePhone] = useState('');
  const [newCaseEmail, setNewCaseEmail] = useState('');
  const [newCaseComplaint, setNewCaseComplaint] = useState('');
  const [newCaseCareLevel, setNewCaseCareLevel] = useState('🌱 Essential Acute & Wellness Care');
  const [newCaseBillingCycle, setNewCaseBillingCycle] = useState('Weekly');
  const [newCasePrice, setNewCasePrice] = useState('');
  const [newCaseDuration, setNewCaseDuration] = useState('2');
  const [newCaseConditions, setNewCaseConditions] = useState('1');
  const [newCaseConcession, setNewCaseConcession] = useState('None');
  const [isCreatingCase, setIsCreatingCase] = useState(false);

  // 1. Fetch live patients list from Firestore on mount
  useEffect(() => {
    if (typeof window === "undefined" || !db) return;
    const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPatients(list);
    }, (err) => {
      console.error("Firestore listener failed in RepertoryWorkbench:", err);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch specific selected patient case details and pre-fill voice intake
  useEffect(() => {
    if (!activePatientId || !db) {
      setLoadedPatient(null);
      return;
    }
    
    // Look up in patients array first
    const found = patients.find(p => p.id === activePatientId);
    if (found) {
      setLoadedPatient(found);
      if (found.complaint) {
        setNlpInput(prev => prev.trim() ? prev : found.complaint);
      }
      return;
    }

    const loadSingle = async () => {
      try {
        const docRef = doc(db, "patients", activePatientId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const pData = docSnap.data();
          setLoadedPatient({ id: docSnap.id, ...pData });
          if (pData?.complaint) {
            setNlpInput(prev => prev.trim() ? prev : pData.complaint);
          }
        }
      } catch (err) {
        console.error("Failed to load active patient document:", err);
      }
    };
    loadSingle();
  }, [activePatientId, patients]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrganSystem, setSelectedOrganSystem] = useState<string>('All');
  const [selectedMiasms, setSelectedMiasms] = useState<MiasmTypeV1[]>([]);
  const miasmContainerRef = useRef<HTMLDivElement>(null);
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
  
  // Session token lifecycle & stale response prevention
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const repertorizeGenerationRef = useRef<number>(0);

  // Invalidate in-flight responses and clear token when patient changes
  useEffect(() => {
    setSessionToken(null);
    repertorizeGenerationRef.current++;
    setSelectedMiasms([]);
  }, [activePatientId, sessionUid]);


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

  // Fetch initial rubrics
  useEffect(() => {
    const loadRubrics = async () => {
      setLoading(true);
      try {
        const data = await clinicalRepertoryService.current.loadInitialRubrics();
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
          remedy: selectedRemedy === 'All' ? undefined : selectedRemedy
        };

        if (debouncedSearch.trim()) {
          const data = await clinicalRepertoryService.current.searchFullRubrics(debouncedSearch, filters);
          setRubrics(data);
        } else {
          const data = await clinicalRepertoryService.current.getRubrics(filters);
          setRubrics(data);
        }
      } catch (e) {
        console.error("Filtered retrieval failed:", e);
      }
    };
    fetchFiltered();
  }, [debouncedSearch, selectedCategory, selectedOrganSystem, selectedRemedy]);

  // Memoized visible catalog rubrics based on local miasmatic filter
  const visibleCatalogRubrics = useMemo(() => {
    return rubrics.filter(rub => {
      if (selectedMiasms.length === 0) return true;
      const approvedMiasms = getApprovedMiasmsForRubric(rub.rubricId);
      return selectedMiasms.some(m => approvedMiasms.includes(m));
    });
  }, [rubrics, selectedMiasms]);

  const handleMiasmKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!miasmContainerRef.current) return;
    const buttons = Array.from(miasmContainerRef.current.querySelectorAll('button.miasm-btn')) as HTMLButtonElement[];
    if (buttons.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % buttons.length;
      buttons[nextIndex].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + buttons.length) % buttons.length;
      buttons[prevIndex].focus();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      buttons[index].click();
    }
  };

  // Recalculate scoring, differentiations, reasoning summary, and validation safety checks using the Codex Clinical Workspace Service
  useEffect(() => {
    const recalculate = async () => {
      // zero-rubric reset: clear everything, including token
      if (selectedRubrics.length === 0) {
        setScoringResult(null);
        setDifferentiations([]);
        setReasoningSummary(null);
        setValidationFindings([]);
        setSessionToken(null);
        return;
      }

      // rubric-recalculate start: clear token and increment generation
      setSessionToken(null);
      const localGeneration = ++repertorizeGenerationRef.current;
      setIsScoringLoading(true);

      try {
        const result = await clinicalRepertoryService.current.runClinicalAnalysis({
          patientId: activePatientId || undefined,
          query: undefined,
          selectedRubrics: selectedRubrics.map(sr => ({
            rubricId: sr.rubricId,
            severity: sr.severity,
            frequency: sr.frequency,
            impact: sr.impact
          }))
        });

        // stale-response guard: compare generation before committing results
        if (localGeneration !== repertorizeGenerationRef.current) {
          return;
        }

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
          
          const sessionTokenVal = (result as any).sessionToken;
          if (sessionTokenVal) {
            setSessionToken(sessionTokenVal);
          }
        } else {
          // failure: clear token
          setSessionToken(null);
        }
      } catch (e) {
        console.error("Clinical analysis calculation failed:", e);
        // failure: clear token
        setSessionToken(null);
      }

      // Ensure we only unset loading if no newer request overtook us
      if (localGeneration === repertorizeGenerationRef.current) {
        setIsScoringLoading(false);
      }
    };
    recalculate();
  }, [selectedRubrics, activePatientId]);


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

  // Synchronize active symptoms / rubrics directly to Google Sheets
  const handleSyncRubricsToSheet = async () => {
    if (!loadedPatient) {
      alert("Please select a patient first.");
      return;
    }
    
    const rubricsPayload = await Promise.all(selectedRubrics.map(async (s) => {
      const r = await clinicalRepertoryService.current.getRubricById(s.rubricId);
      const weight = s.severity >= 7 ? 3 : s.severity >= 4 ? 2 : 1;
      const grades: Record<string, number> = {};
      
      const remediesList = scoringResult?.topRemedies.map(tr => tr.remedyId) || ["Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep"];
      remediesList.forEach(rem => {
        const foundRem = r?.relatedRemedies?.find((rr: any) => rr.remedyId.toLowerCase() === rem.toLowerCase());
        grades[rem] = foundRem ? foundRem.grade : 0;
      });
      
      return {
        name: r ? r.title : s.rubricId,
        chapter: r ? r.category : "General",
        source: r?.source || "Kent",
        weight,
        grades
      };
    }));

    if (rubricsPayload.length === 0) {
      alert("Please select at least one symptom rubric to sync.");
      return;
    }

    setIsSyncingToSheet(true);
    try {
      let sheetId = loadedPatient.sheetId;
      if (!sheetId && loadedPatient.sheetUrl) {
        const match = loadedPatient.sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          sheetId = match[1];
        }
      }

      const res = await fetch("/api/export-repertory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: loadedPatient.id,
          sheetId: sheetId || "",
          rubrics: rubricsPayload,
          remedies: scoringResult?.topRemedies.map(tr => tr.remedyId) || ["Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep"]
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Rubrics successfully synchronized directly to patient's live Google Sheet!");
        if (loadedPatient.sheetUrl && loadedPatient.sheetUrl.startsWith("http")) {
          window.open(loadedPatient.sheetUrl, "_blank");
        }
      } else {
        throw new Error(data.message || "Failed to export");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed to sync to Google Sheet: ${err.message || err}`);
    } finally {
      setIsSyncingToSheet(false);
    }
  };

  // Submit case registration to intake endpoint
  const handleCreateNewCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseName.trim() || !newCaseAge.trim() || !newCasePhone.trim() || !newCaseComplaint.trim()) {
      alert("Please fill in Name, Age, Phone, and Chief Complaint.");
      return;
    }
    
    setIsCreatingCase(true);
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCaseName.trim(),
          age: Number(newCaseAge),
          gender: newCaseGender,
          phone: newCasePhone.trim(),
          email: newCaseEmail.trim() || "N/A",
          city: "Pune",
          state: "Maharashtra",
          country: "India",
          complaint: newCaseComplaint.trim(),
          careLevel: newCaseCareLevel,
          conditionsCount: Number(newCaseConditions) || 1,
          durationText: `${newCaseDuration} Weeks`,
          finalPrice: newCasePrice ? Number(newCasePrice) : (newCaseCareLevel.includes("🌱 Essential Acute & Wellness Care") ? 2850 : (newCaseCareLevel.includes("🚨 Intensive Acute Priority Care") ? 25000 : 12000)),
          receivedAmount: newCasePrice ? Number(newCasePrice) : (newCaseCareLevel.includes("🌱 Essential Acute & Wellness Care") ? 2850 : (newCaseCareLevel.includes("🚨 Intensive Acute Priority Care") ? 25000 : 12000)),
          remainingBalance: 0,
          billingCycle: newCaseBillingCycle,
          durationValue: Number(newCaseDuration) || 2,
          concessionApplied: newCaseConcession
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to register case");
      }

      alert(`Case registered successfully with ID: ${data.patientId}.\nReal Google Sheet will be provisioned in the background.`);
      
      // Notify parent & switch selected patient
      if (onPatientChange) {
        onPatientChange(data.patientId);
      }
      
      // Clear fields and collapse panel
      setNewCaseName('');
      setNewCaseAge('');
      setNewCasePhone('');
      setNewCaseEmail('');
      setNewCaseComplaint('');
      setNewCasePrice('');
      setNewCaseDuration('2');
      setNewCaseConditions('1');
      setNewCaseConcession('None');
      setIsNewCaseOpen(false);
    } catch (err: any) {
      console.error("Case registration failed:", err);
      alert(`Case registration failed: ${err.message || err}`);
    } finally {
      setIsCreatingCase(false);
    }
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
      const response = await fetch('/api/admin/repertory-review');
      const data = await response.json();
      if (data.success) {
        setAuditReport({
          isValid: (data.duplicates || []).length === 0,
          duplicates: data.duplicates || [],
          missingSynonyms: [],
          missingRemedyGrades: [],
          orphanRubrics: [],
          invalidRemedyIds: [],
          missingSourceOrReviewer: [],
          weakClinicalWording: [],
          prohibitedClaims: [],
          weakDifferentialNotes: []
        });
        setShowAuditModal(true);
      }
    } catch (e) {
      console.error("Database audit failed:", e);
    }
    setAuditLoading(false);
  };

  // Export handlers
  const handleExportData = async (type: 'json') => {
    try {
      let filename = `repertory_export_${Date.now()}`;
      let content: string;

      if (!sessionToken) {
        throw new Error("No active session token available for JSON export.");
      }
      const res = await fetch('/api/repertory/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: sessionToken })
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error?.message || "Server failed to export session JSON");
      }
      content = JSON.stringify(data.export, null, 2);
      filename += '.json';

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      console.error("Export operation failed:", e);
      alert(`Export failed: ${e.message}`);
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

    summary += `\n---\nDISCLAIMER: Clinical Review Required — This system provides clinical decision support only. Final diagnosis and prescribing remain the responsibility of the clinician.`;

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
      {/* Sticky Global Safety Banner */}
      <div className="sticky top-0 z-50 bg-amber-50/95 backdrop-blur-md border border-amber-200/80 p-2.5 rounded-2xl flex items-center justify-center text-center shadow-xs text-[10px] text-amber-800 font-bold">
        <span>⚠️ <strong>Clinical Review Required</strong> — This system provides clinical decision support only. Final diagnosis and prescribing remain the responsibility of the clinician.</span>
      </div>

      {/* Release transparency for source-faithful Clarke occurrence scoring. */}
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/90 px-4 py-3 text-left text-xs text-cyan-950 shadow-xs">
        <div className="flex items-start gap-2">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
          <div>
            <p className="font-black uppercase tracking-wider">Expanded repertory release status</p>
            <p className="mt-1 font-semibold leading-relaxed">
              Version 1.2.0 is validated and staged with 78,687 rubrics from Kent, Boericke, and Clarke.
              Clarke rubrics use source-faithful equal-occurrence repertorization: each verified remedy listed
              under a selected rubric contributes one point. No remedy-grade hierarchy is inferred from OCR.
            </p>
          </div>
        </div>
      </div>

      {/* Case File Management Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block">Active Patient Switcher</span>
            <select
              value={activePatientId || ""}
              onChange={(e) => {
                if (onPatientChange) {
                  onPatientChange(e.target.value);
                }
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold min-w-[200px] cursor-pointer shadow-md"
            >
              <option value="" className="text-slate-500">-- Select Active Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id} className="text-white">
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>
          
          {loadedPatient ? (
            <div className="flex flex-col justify-center text-[11px] border-l border-slate-800 pl-4 h-full">
              <span className="font-extrabold text-slate-200">{loadedPatient.name} ({loadedPatient.age || "N/A"} / {loadedPatient.gender || "N/A"})</span>
              <span className="text-slate-400 font-mono text-[9px] mt-0.5">Billing: {loadedPatient.billingCycle || "Weekly"} | Case: {loadedPatient.id}</span>
            </div>
          ) : (
            <div className="flex flex-col justify-center text-[10px] border-l border-slate-800 pl-4 h-full text-slate-400 font-semibold italic">
              <span>Select an active patient to load clinical files & sync sheets</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {loadedPatient && (
            <>
              {loadedPatient.complaint && (
                <button
                  type="button"
                  onClick={() => setNlpInput(loadedPatient.complaint)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Import patient chief complaint notes into NLP text area below"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Use Complaint Notes
                </button>
              )}
              
              <button
                type="button"
                onClick={handleSyncRubricsToSheet}
                disabled={isSyncingToSheet || selectedRubrics.length === 0}
                className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                {isSyncingToSheet ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                Sync to Sheet
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsNewCaseOpen(!isNewCaseOpen)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            {isNewCaseOpen ? "Cancel Case Form" : "Create New Case"}
          </button>
        </div>
      </div>

      {/* New Case Creation Form Panel (Collapsible) */}
      {isNewCaseOpen && (
        <form onSubmit={handleCreateNewCase} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-left animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              New Clinical Case Entry
            </h3>
            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Workspace will be provisioned automatically
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                required
                value={newCaseName}
                onChange={(e) => setNewCaseName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Age</label>
              <input
                type="number"
                required
                value={newCaseAge}
                onChange={(e) => setNewCaseAge(e.target.value)}
                placeholder="e.g. 45"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Gender</label>
              <select
                value={newCaseGender}
                onChange={(e) => setNewCaseGender(e.target.value)}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Phone Number</label>
              <input
                type="tel"
                required
                value={newCasePhone}
                onChange={(e) => setNewCasePhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Email (Optional)</label>
              <input
                type="email"
                value={newCaseEmail}
                onChange={(e) => setNewCaseEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Billing Cycle</label>
              <select
                value={newCaseBillingCycle}
                onChange={(e) => setNewCaseBillingCycle(e.target.value)}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer"
              >
                <option value="Weekly">Weekly Settle</option>
                <option value="Monthly">Monthly Settle</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Care Level</label>
              <select
                value={newCaseCareLevel}
                onChange={(e) => {
                  setNewCaseCareLevel(e.target.value);
                  setNewCaseDuration(e.target.value.includes("Acute") ? "2" : "6");
                }}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer"
              >
                {/* 2-week registration package: ₹1,500/week × 2 weeks = ₹3,000, less 5% = ₹2,850 */}
                <option value="🌱 Essential Acute & Wellness Care">🌱 Essential Acute & Wellness Care (₹2,850)</option>
                <option value="⚡ Core Chronic Care">⚡ Core Chronic Care (₹12,000)</option>
                <option value="🚨 Intensive Acute Priority Care">🚨 Intensive Acute Priority Care (₹25,000)</option>
                <option value="🎯 Deep Constitutional Care">🎯 Deep Constitutional Care (₹21,000)</option>
                <option value="🫁 Advanced Pathology Support">🫁 Advanced Pathology Support (₹30,000)</option>
                <option value="🔮 Multisystem Integrative Care">🔮 Multisystem Integrative Care (₹42,000)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Custom Price Override (Optional)</label>
              <input
                type="number"
                value={newCasePrice}
                onChange={(e) => setNewCasePrice(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Duration (Weeks)</label>
              <input
                type="number"
                required
                value={newCaseDuration}
                onChange={(e) => setNewCaseDuration(e.target.value)}
                placeholder="e.g. 2 or 6"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">No. of Conditions</label>
              <input
                type="number"
                required
                value={newCaseConditions}
                onChange={(e) => setNewCaseConditions(e.target.value)}
                placeholder="e.g. 1"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Concession / Discount</label>
              <select
                value={newCaseConcession}
                onChange={(e) => setNewCaseConcession(e.target.value)}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer"
              >
                <option value="None">No Concession</option>
                <option value="Senior Citizen Concession (15%)">Senior Citizen Concession (15%)</option>
                <option value="Socio-Economic Concession (30%)">Socio-Economic Concession (30%)</option>
                <option value="Special Clinical Concession">Special Clinical Concession</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Chief Complaint Notes</label>
            <textarea
              required
              rows={3}
              value={newCaseComplaint}
              onChange={(e) => setNewCaseComplaint(e.target.value)}
              placeholder="Describe the main clinical complaints, remedy modalities, and pathology index..."
              className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold resize-y"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsNewCaseOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingCase}
              className="bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isCreatingCase ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save & Register Case
            </button>
          </div>
        </form>
      )}

      {/* Sticky Clinical Summary */}
      {(() => {
        const topRem = scoringResult?.topRemedies[0];
        const totalWarnings = scoringResult?.topRemedies.reduce((acc, r) => acc + (r.contradictoryEvidence?.length || 0), 0) || 0;
        const missingGaps = reasoningSummary?.missingInformation?.length || 0;

        return (
          <div className="sticky top-[42px] z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between shadow-xs mb-4 text-[10px] text-slate-700 font-bold">
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

              {/* Miasmatic filter toggles */}
              {isFilterEnabled && (
                <div
                  ref={miasmContainerRef}
                  className="mt-3 flex flex-wrap items-center gap-2"
                  role="group"
                  aria-label="Filter rubrics by Homeopathic Miasm"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mr-1">
                    Miasms:
                  </span>
                  {(['psora', 'sycosis', 'syphilis', 'tubercular', 'unclassified'] as const).map((miasm, idx) => {
                    const isSelected = selectedMiasms.includes(miasm);
                    return (
                      <button
                        key={miasm}
                        type="button"
                        onClick={() => {
                          setSelectedMiasms(prev =>
                            prev.includes(miasm)
                              ? prev.filter(m => m !== miasm)
                              : [...prev, miasm]
                          );
                        }}
                        onKeyDown={(e) => handleMiasmKeyDown(e, idx)}
                        aria-pressed={isSelected}
                        className={`miasm-btn px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:outline-none motion-reduce:transition-none ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-350'
                        }`}
                        style={{ transitionProperty: 'color, background-color, border-color' }}
                      >
                        {miasm}
                      </button>
                    );
                  })}
                  {selectedMiasms.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedMiasms([])}
                      className="px-2 py-1 text-[9px] font-bold text-slate-400 hover:text-rose-500 motion-reduce:transition-none transition-colors uppercase cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}

              {/* Collapsible List Container */}
              {resolvedCatalogExpanded && (
                <div className="border-t border-slate-100 pt-4 flex-grow transition-all duration-300">
                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                    </div>
                  ) : visibleCatalogRubrics.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 space-y-2">
                      <Info className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                      <p className="text-xs font-bold">No active clinical rubrics found matching current filter.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 pr-1">
                      {visibleCatalogRubrics.map(rub => {
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
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              Repertorization Scoring Panel
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono">
                Decision Support
              </span>
              {scoringResult && (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono">
                  Margin: {scoringResult.confidenceScore}%
                </span>
              )}
            </div>
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
              <div className={`pt-2 border-t border-white/5 grid ${sessionToken ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                <button
                  type="button"
                  onClick={handleSendToPlanner}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 font-mono"
                >
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  Send to Planner
                </button>
                {sessionToken && (
                  <button
                    type="button"
                    onClick={() => handleExportData('json')}
                    className="bg-slate-800 hover:bg-slate-750 text-slate-200 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-white/5 flex items-center justify-center gap-1.5 font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export JSON
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Clinical Reasoning Engine (Col Span 3) */}
      <div className="lg:col-span-3 flex flex-col gap-4 order-3 lg:order-3 text-left lg:overflow-y-auto lg:h-full pb-6 pr-1 scrollbar-thin">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              Reasoning Engine
            </h3>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-250/30">
                Clinician Review
              </span>
              <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                AI Assisted
              </span>
            </div>
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
