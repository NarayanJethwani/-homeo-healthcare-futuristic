"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepertoryWorkbench = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const repertoryDb_1 = require("../database/repertoryDb");
const databaseValidator_1 = require("../validators/databaseValidator");
const importExportService_1 = require("../import-export/importExportService");
const DifferentialComparison_1 = require("./DifferentialComparison");
const ConfidenceBreakdownPanel_1 = require("./ConfidenceBreakdownPanel");
const RubricCoverageHeatmap_1 = require("./RubricCoverageHeatmap");
const ReasoningTimeline_1 = require("./ReasoningTimeline");
const clinicalRepertoryService_1 = require("../clinicalWorkspace/clinicalRepertoryService");
const firebase_1 = require("@/lib/firebase");
const firestore_1 = require("firebase/firestore");
const RepertoryWorkbench = ({ sessionUid = '', activePatientId = '', onSendToTreatmentPlanner, onPatientChange }) => {
    // Database States
    const [rubrics, setRubrics] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    // Active Patient Switcher & Case Manager states
    const [patients, setPatients] = (0, react_1.useState)([]);
    const [loadedPatient, setLoadedPatient] = (0, react_1.useState)(null);
    const [isNewCaseOpen, setIsNewCaseOpen] = (0, react_1.useState)(false);
    const [isSyncingToSheet, setIsSyncingToSheet] = (0, react_1.useState)(false);
    const [nlpInput, setNlpInput] = (0, react_1.useState)('');
    const [parsingIntake, setParsingIntake] = (0, react_1.useState)(false);
    // New Case Registration fields
    const [newCaseName, setNewCaseName] = (0, react_1.useState)('');
    const [newCaseAge, setNewCaseAge] = (0, react_1.useState)('');
    const [newCaseGender, setNewCaseGender] = (0, react_1.useState)('Male');
    const [newCasePhone, setNewCasePhone] = (0, react_1.useState)('');
    const [newCaseEmail, setNewCaseEmail] = (0, react_1.useState)('');
    const [newCaseComplaint, setNewCaseComplaint] = (0, react_1.useState)('');
    const [newCaseCareLevel, setNewCaseCareLevel] = (0, react_1.useState)('🌱 Acute & Wellness Care');
    const [newCaseBillingCycle, setNewCaseBillingCycle] = (0, react_1.useState)('Weekly');
    const [newCasePrice, setNewCasePrice] = (0, react_1.useState)('');
    const [newCaseDuration, setNewCaseDuration] = (0, react_1.useState)('2');
    const [newCaseConditions, setNewCaseConditions] = (0, react_1.useState)('1');
    const [newCaseConcession, setNewCaseConcession] = (0, react_1.useState)('None');
    const [isCreatingCase, setIsCreatingCase] = (0, react_1.useState)(false);
    // 1. Fetch live patients list from Firestore on mount
    (0, react_1.useEffect)(() => {
        if (typeof window === "undefined" || !firebase_1.db)
            return;
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, "patients"), (0, firestore_1.orderBy)("createdAt", "desc"));
        const unsubscribe = (0, firestore_1.onSnapshot)(q, (snapshot) => {
            const list = [];
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
    (0, react_1.useEffect)(() => {
        if (!activePatientId || !firebase_1.db) {
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
                const docRef = (0, firestore_1.doc)(firebase_1.db, "patients", activePatientId);
                const docSnap = await (0, firestore_1.getDoc)(docRef);
                if (docSnap.exists()) {
                    const pData = docSnap.data();
                    setLoadedPatient({ id: docSnap.id, ...pData });
                    if (pData?.complaint) {
                        setNlpInput(prev => prev.trim() ? prev : pData.complaint);
                    }
                }
            }
            catch (err) {
                console.error("Failed to load active patient document:", err);
            }
        };
        loadSingle();
    }, [activePatientId, patients]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [debouncedSearch, setDebouncedSearch] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('All');
    const [selectedOrganSystem, setSelectedOrganSystem] = (0, react_1.useState)('All');
    const [selectedMiasm, setSelectedMiasm] = (0, react_1.useState)('All');
    const [selectedRemedy, setSelectedRemedy] = (0, react_1.useState)('All');
    // Initialize internal Codex clinical workspace service facade
    const clinicalRepertoryService = (0, react_1.useRef)((0, clinicalRepertoryService_1.createClinicalRepertoryService)());
    // Workbench / Case States
    const [selectedRubrics, setSelectedRubrics] = (0, react_1.useState)([]);
    // Scoring & Differentiation
    const [scoringResult, setScoringResult] = (0, react_1.useState)(null);
    const [differentiations, setDifferentiations] = (0, react_1.useState)([]);
    const [activeRemedyDetails, setActiveRemedyDetails] = (0, react_1.useState)(null);
    const [isScoringLoading, setIsScoringLoading] = (0, react_1.useState)(false);
    const [reasoningSummary, setReasoningSummary] = (0, react_1.useState)(null);
    const [activeReasoningRemedyId, setActiveReasoningRemedyId] = (0, react_1.useState)(null);
    const [validationFindings, setValidationFindings] = (0, react_1.useState)([]);
    const [longitudinalSummary, setLongitudinalSummary] = (0, react_1.useState)(null);
    const [lastAmeliorationRating, setLastAmeliorationRating] = (0, react_1.useState)(3);
    // Dialogs & Audits
    const [auditReport, setAuditReport] = (0, react_1.useState)(null);
    const [showAuditModal, setShowAuditModal] = (0, react_1.useState)(false);
    const [auditLoading, setAuditLoading] = (0, react_1.useState)(false);
    const [importedStatus, setImportedStatus] = (0, react_1.useState)({});
    const [activeDockTab, setActiveDockTab] = (0, react_1.useState)('materia-medica');
    const [expandedDockSection, setExpandedDockSection] = (0, react_1.useState)(null);
    // UI state
    const [expandedRubricId, setExpandedRubricId] = (0, react_1.useState)(null);
    const [isCatalogExpanded, setIsCatalogExpanded] = (0, react_1.useState)(null);
    const [showAllAudits, setShowAllAudits] = (0, react_1.useState)(false);
    const [modifyingSymptom, setModifyingSymptom] = (0, react_1.useState)(null);
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
    (0, react_1.useEffect)(() => {
        const loadRubrics = async () => {
            setLoading(true);
            try {
                const data = await repertoryDb_1.repertoryRepository.getRubrics();
                setRubrics(data);
            }
            catch (e) {
                console.error("Failed to load rubrics:", e);
            }
            setLoading(false);
        };
        loadRubrics();
    }, []);
    // Search Debouncer (500ms - 800ms)
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 600);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    // Query database based on filters and search
    (0, react_1.useEffect)(() => {
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
                    const data = await Promise.all(candidates.map(c => repertoryDb_1.repertoryRepository.getRubricById(c.id)));
                    setRubrics(data.filter((r) => r !== undefined));
                }
                else {
                    const data = await repertoryDb_1.repertoryRepository.getRubrics(filters);
                    setRubrics(data);
                }
            }
            catch (e) {
                console.error("Filtered retrieval failed:", e);
            }
        };
        fetchFiltered();
    }, [debouncedSearch, selectedCategory, selectedOrganSystem, selectedMiasm, selectedRemedy]);
    // Recalculate scoring, differentiations, reasoning summary, and validation safety checks using the Codex Clinical Workspace Service
    (0, react_1.useEffect)(() => {
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
            }
            catch (e) {
                console.error("Clinical analysis calculation failed:", e);
            }
            setIsScoringLoading(false);
        };
        recalculate();
    }, [selectedRubrics]);
    // Recalculate longitudinal history matching active selected rubrics
    (0, react_1.useEffect)(() => {
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
            if (keyRubrics.length === 0)
                return;
            const mockTimeline = [
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
            }
            catch (err) {
                console.error("Timeline analysis calculation failed:", err);
            }
        };
        updateTimeline();
    }, [selectedRubrics, lastAmeliorationRating]);
    (0, react_1.useEffect)(() => {
        if (scoringResult && scoringResult.topRemedies.length > 0) {
            if (!activeReasoningRemedyId || !scoringResult.topRemedies.some(r => r.remedyId === activeReasoningRemedyId)) {
                setActiveReasoningRemedyId(scoringResult.topRemedies[0].remedyId);
            }
        }
        else {
            setActiveReasoningRemedyId(null);
        }
    }, [scoringResult, activeReasoningRemedyId]);
    // Toggle rubric selection in workbench
    const handleToggleRubric = (rubric) => {
        const index = selectedRubrics.findIndex(s => s.rubricId === rubric.rubricId);
        if (index > -1) {
            setSelectedRubrics(prev => prev.filter(s => s.rubricId !== rubric.rubricId));
        }
        else {
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
    const handleConfigureSymptom = (rubricId) => {
        const symptom = selectedRubrics.find(s => s.rubricId === rubricId);
        if (symptom) {
            setModifyingSymptom({ ...symptom });
        }
    };
    // Save modified severity, frequency, or impact
    const handleSaveSymptomModifiers = () => {
        if (modifyingSymptom) {
            setSelectedRubrics(prev => prev.map(s => s.rubricId === modifyingSymptom.rubricId ? { ...modifyingSymptom } : s));
            setModifyingSymptom(null);
        }
    };
    // Remove symptom from workbench
    const handleRemoveSymptom = (rubricId) => {
        setSelectedRubrics(prev => prev.filter(s => s.rubricId !== rubricId));
    };
    const getCategorizedChips = () => {
        const mental = [];
        const physical = [];
        const sleep = [];
        const modalities = [];
        const general = [];
        selectedRubrics.forEach(sr => {
            const rub = rubrics.find(r => r.rubricId === sr.rubricId);
            if (!rub)
                return;
            const titleLower = rub.title.toLowerCase();
            const catLower = rub.category.toLowerCase();
            const chip = { sr, rub };
            if (catLower.includes('mind') || catLower.includes('delusions') || catLower.includes('mental')) {
                mental.push(chip);
            }
            else if (catLower.includes('sleep') || catLower.includes('dreams')) {
                sleep.push(chip);
            }
            else if (catLower.includes('modality') || titleLower.includes('worse') || titleLower.includes('better') || titleLower.includes('agg') || titleLower.includes('amel')) {
                modalities.push(chip);
            }
            else if (catLower.includes('stomach') || catLower.includes('abdomen') ||
                catLower.includes('rectum') || catLower.includes('stool') ||
                catLower.includes('head') || catLower.includes('mouth') ||
                catLower.includes('throat') || catLower.includes('chest') ||
                catLower.includes('respiratory') || catLower.includes('cough') ||
                catLower.includes('physical')) {
                physical.push(chip);
            }
            else {
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
            const r = await repertoryDb_1.repertoryRepository.getRubricById(s.rubricId);
            const weight = s.severity >= 7 ? 3 : s.severity >= 4 ? 2 : 1;
            const grades = {};
            const remediesList = scoringResult?.topRemedies.map(tr => tr.remedyId) || ["Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep"];
            remediesList.forEach(rem => {
                const foundRem = r?.relatedRemedies?.find(rr => rr.remedyId.toLowerCase() === rem.toLowerCase());
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
            }
            else {
                throw new Error(data.message || "Failed to export");
            }
        }
        catch (err) {
            console.error(err);
            alert(`Failed to sync to Google Sheet: ${err.message || err}`);
        }
        finally {
            setIsSyncingToSheet(false);
        }
    };
    // Submit case registration to intake endpoint
    const handleCreateNewCase = async (e) => {
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
                    finalPrice: newCasePrice ? Number(newCasePrice) : (newCaseCareLevel.includes("Acute") ? 2280 : 9600),
                    receivedAmount: newCasePrice ? Number(newCasePrice) : (newCaseCareLevel.includes("Acute") ? 2280 : 9600),
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
        }
        catch (err) {
            console.error("Case registration failed:", err);
            alert(`Case registration failed: ${err.message || err}`);
        }
        finally {
            setIsCreatingCase(false);
        }
    };
    // Parse NLP Clinical Intake
    const handleParseIntake = async () => {
        if (!nlpInput.trim())
            return;
        setParsingIntake(true);
        try {
            const results = await clinicalRepertoryService.current.parseAIIntakeText(nlpInput);
            // Map results back to selected rubrics
            const incoming = results.matchedRubrics.map((m) => ({
                rubricId: m.rubricId,
                severity: m.suggestedSeverity,
                frequency: 'frequent',
                impact: 'moderate'
            }));
            // Merge with existing
            setSelectedRubrics(prev => {
                const filtered = prev.filter(s => !incoming.some((i) => i.rubricId === s.rubricId));
                return [...filtered, ...incoming];
            });
            setNlpInput('');
            alert(`Intake processing complete! Matched ${results.matchedRubrics.length} clinical indicators with active weights.`);
        }
        catch (e) {
            console.error("AI Intake mapping failed:", e);
        }
        setParsingIntake(false);
    };
    // Run Database Quality Audit
    const handleRunAudit = async () => {
        setAuditLoading(true);
        try {
            const report = await databaseValidator_1.DatabaseValidator.validateDatabase();
            setAuditReport(report);
            setShowAuditModal(true);
        }
        catch (e) {
            console.error("Database audit failed:", e);
        }
        setAuditLoading(false);
    };
    // Export handlers
    const handleExportData = async (type) => {
        try {
            let content = '';
            let filename = `repertory_export_${Date.now()}`;
            if (type === 'json') {
                content = await importExportService_1.ImportExportService.exportToJSON();
                filename += '.json';
            }
            else if (type === 'csv') {
                content = await importExportService_1.ImportExportService.exportToCSV();
                filename += '.csv';
            }
            else if (type === 'mdx') {
                content = await importExportService_1.ImportExportService.exportToMDX();
                filename += '.mdx';
            }
            else {
                content = await importExportService_1.ImportExportService.exportToGraphTriples();
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
        }
        catch (e) {
            console.error("Export operation failed:", e);
        }
    };
    // Send summary reports safely to treatment planner (no automated scripts)
    const handleSendToPlanner = () => {
        if (!scoringResult || scoringResult.topRemedies.length === 0)
            return;
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
        }
        else {
            alert("Summary copied to Clipboard! Paste it directly into your Treatment Planner template.");
            navigator.clipboard.writeText(summary);
        }
    };
    const renderDockContent = () => {
        if (!reasoningSummary || !activeReasoningRemedyId) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-slate-400 text-xs font-semibold", children: "Select a remedy candidate above to inspect detailed clinical intelligence." }));
        }
        const activeRes = reasoningSummary.topRemedies.find(r => r.remedyId === activeReasoningRemedyId);
        if (!activeRes)
            return null;
        switch (activeDockTab) {
            case 'materia-medica':
                return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [
                        { id: 'mm-summary', label: '📖 Materia Medica Summary', content: activeRes.materiaMedicaSummary || 'No summary registered.' },
                        { id: 'mm-keynotes', label: '🩺 Keynotes & Confirmations', list: activeRes.keynotes || [] },
                        { id: 'mm-mentals', label: '🧠 Mental Generals', list: activeRes.mentals || [] },
                        { id: 'mm-physicals', label: '💪 Physical Generals', list: activeRes.physicalGenerals || [] },
                        { id: 'mm-modalities', label: '✨ Modalities', list: activeRes.modalities || [] }
                    ].map(sec => {
                        const isOpen = expandedDockSection === sec.id;
                        return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-200 rounded-xl bg-white overflow-hidden text-left", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setExpandedDockSection(isOpen ? null : sec.id), className: "w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 outline-none border-none cursor-pointer", children: [(0, jsx_runtime_1.jsx)("span", { children: sec.label }), (0, jsx_runtime_1.jsx)("span", { className: "text-slate-400 font-mono", children: isOpen ? '▼' : '▶' })] }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-xs text-slate-650 leading-relaxed border-t border-slate-100 text-left space-y-1", children: sec.content ? ((0, jsx_runtime_1.jsx)("p", { children: sec.content })) : sec.list && sec.list.length > 0 ? ((0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside space-y-1", children: sec.list.map((item, idx) => (0, jsx_runtime_1.jsx)("li", { children: item }, idx)) })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-slate-400 italic", children: "None registered." })) }))] }, sec.id));
                    }) }));
            case 'clinical-reasoning':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-white border border-slate-200 rounded-2xl text-left space-y-4 text-xs", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-800", children: "Remedy Reasoning Explanation" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-650 leading-relaxed", children: activeRes.materiaMedicaSummary }), activeRes.clinicalPearls && activeRes.clinicalPearls.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-700 block", children: "Clinical Observations:" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: activeRes.clinicalPearls.map((pearl, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-750", children: pearl.text }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] text-slate-400 font-mono capitalize mt-1 block", children: ["Origin: ", pearl.origin] })] }, i))) })] }))] }));
            case 'knowledge-graph':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold text-slate-800 mb-3 text-left", children: "Rubric Coverage Heatmap" }), (0, jsx_runtime_1.jsx)(RubricCoverageHeatmap_1.RubricCoverageHeatmap, { confidenceBreakdown: reasoningSummary.confidenceBreakdown, remedyId: activeReasoningRemedyId })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold text-slate-800 mb-3 text-left", children: "Confidence Breakdown" }), (0, jsx_runtime_1.jsx)(ConfidenceBreakdownPanel_1.ConfidenceBreakdownPanel, { evidenceBreakdown: reasoningSummary.evidenceBreakdown, remedyId: activeReasoningRemedyId })] })] }));
            case 'relationships':
                const rels = activeRes.relationships || {};
                return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-800", children: "Complementary & Follows Well" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-500 text-[10px]", children: "Complementary:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-650", children: rels.complementary?.join(', ') || 'None' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-500 text-[10px]", children: "Follows Well:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-650", children: rels.followsWell?.join(', ') || 'None' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-800", children: "Inimical & Antidotes" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-500 text-[10px]", children: "Inimical (Antagonistic):" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-650 text-rose-650 font-bold", children: rels.inimical?.join(', ') || 'None' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-500 text-[10px]", children: "Antidotes:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-650", children: rels.antidotes?.join(', ') || 'None' })] })] })] }));
            case 'timeline':
                return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4", children: (0, jsx_runtime_1.jsx)(ReasoningTimeline_1.ReasoningTimeline, { summary: longitudinalSummary }) }));
            case 'editorial-sources':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold text-slate-800", children: "Editorial Provenance Records" }), activeRes.evidenceItems && activeRes.evidenceItems.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: activeRes.evidenceItems.map((item, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-850", children: item.title }), (0, jsx_runtime_1.jsx)("span", { className: "bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8px] font-black px-1.5 py-0.5 rounded font-mono uppercase", children: item.editorialStatus })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600", children: item.summary }), (0, jsx_runtime_1.jsxs)("div", { className: "text-[9px] text-slate-400 font-mono", children: ["Reviewer: ", item.reviewer, " | Last Reviewed: ", item.lastReviewed] })] }, idx))) })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-slate-400 italic text-xs", children: "No editorial records registered." }))] }));
            case 'clinical-experience':
                const obs = activeRes.clinicalPearls?.filter(p => p.origin.includes('clinical') || p.origin.includes('Jethwani')) || [];
                return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-3 text-xs", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-800", children: "Dr. Jethwani Curated Clinical Observations" }), obs.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: obs.map((o, idx) => ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-indigo-50/40 border border-indigo-105 rounded-xl", children: (0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-indigo-900 leading-normal", children: o.text }) }, idx))) })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-slate-400 italic", children: "No specific clinical observations mapped to this remedy candidate." }))] }));
            case 'differentials':
                return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4", children: (0, jsx_runtime_1.jsx)(DifferentialComparison_1.DifferentialComparison, { comparisons: reasoningSummary.differentialComparisons }) }));
            case 'validation':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold text-slate-800", children: "Live Validation Audits" }), validationFindings.length > 0 ? ((0, jsx_runtime_1.jsx)("ul", { className: "text-xs text-rose-700 font-bold space-y-1.5 pl-4 list-disc", children: validationFindings.map((finding, idx) => ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { className: "uppercase text-[8px] font-black bg-rose-100 px-1.5 py-0.5 rounded mr-1.5", children: finding.category }), finding.message] }, idx))) })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-emerald-600 text-xs font-semibold", children: "\u2713 0 validation alerts detected. Clinical integrity check passed." }))] }));
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "sticky top-0 z-50 bg-amber-50/95 backdrop-blur-md border border-amber-200/80 p-2.5 rounded-2xl flex items-center justify-center text-center shadow-xs text-[10px] text-amber-800 font-bold", children: (0, jsx_runtime_1.jsxs)("span", { children: ["\u26A0\uFE0F ", (0, jsx_runtime_1.jsx)("strong", { children: "Clinical Review Required" }), " \u2014 This system provides clinical decision support only. Final diagnosis and prescribing remain the responsibility of the clinician."] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block", children: "Active Patient Switcher" }), (0, jsx_runtime_1.jsxs)("select", { value: activePatientId || "", onChange: (e) => {
                                            if (onPatientChange) {
                                                onPatientChange(e.target.value);
                                            }
                                        }, className: "bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold min-w-[200px] cursor-pointer shadow-md", children: [(0, jsx_runtime_1.jsx)("option", { value: "", className: "text-slate-500", children: "-- Select Active Patient --" }), patients.map(p => ((0, jsx_runtime_1.jsxs)("option", { value: p.id, className: "text-white", children: [p.name, " (", p.id, ")"] }, p.id)))] })] }), loadedPatient ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center text-[11px] border-l border-slate-800 pl-4 h-full", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-extrabold text-slate-200", children: [loadedPatient.name, " (", loadedPatient.age || "N/A", " / ", loadedPatient.gender || "N/A", ")"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-slate-400 font-mono text-[9px] mt-0.5", children: ["Billing: ", loadedPatient.billingCycle || "Weekly", " | Case: ", loadedPatient.id] })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col justify-center text-[10px] border-l border-slate-800 pl-4 h-full text-slate-400 font-semibold italic", children: (0, jsx_runtime_1.jsx)("span", { children: "Select an active patient to load clinical files & sync sheets" }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [loadedPatient && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [loadedPatient.complaint && ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setNlpInput(loadedPatient.complaint), className: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm", title: "Import patient chief complaint notes into NLP text area below", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-3.5 h-3.5 text-emerald-400" }), "Use Complaint Notes"] })), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: handleSyncRubricsToSheet, disabled: isSyncingToSheet || selectedRubrics.length === 0, className: "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm", children: [isSyncingToSheet ? (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3.5 h-3.5" }), "Sync to Sheet"] })] })), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setIsNewCaseOpen(!isNewCaseOpen), className: "bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-3.5 h-3.5 text-emerald-600" }), isNewCaseOpen ? "Cancel Case Form" : "Create New Case"] })] })] }), isNewCaseOpen && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleCreateNewCase, className: "bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-left animate-fadeIn", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-b border-slate-100 pb-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 text-emerald-500" }), "New Clinical Case Entry"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200", children: "Workspace will be provisioned automatically" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Full Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", required: true, value: newCaseName, onChange: (e) => setNewCaseName(e.target.value), placeholder: "e.g. John Doe", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Age" }), (0, jsx_runtime_1.jsx)("input", { type: "number", required: true, value: newCaseAge, onChange: (e) => setNewCaseAge(e.target.value), placeholder: "e.g. 45", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Gender" }), (0, jsx_runtime_1.jsxs)("select", { value: newCaseGender, onChange: (e) => setNewCaseGender(e.target.value), className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer", children: [(0, jsx_runtime_1.jsx)("option", { value: "Male", children: "Male" }), (0, jsx_runtime_1.jsx)("option", { value: "Female", children: "Female" }), (0, jsx_runtime_1.jsx)("option", { value: "Other", children: "Other" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Phone Number" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", required: true, value: newCasePhone, onChange: (e) => setNewCasePhone(e.target.value), placeholder: "e.g. 9876543210", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Email (Optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: newCaseEmail, onChange: (e) => setNewCaseEmail(e.target.value), placeholder: "e.g. john@example.com", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Billing Cycle" }), (0, jsx_runtime_1.jsxs)("select", { value: newCaseBillingCycle, onChange: (e) => setNewCaseBillingCycle(e.target.value), className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer", children: [(0, jsx_runtime_1.jsx)("option", { value: "Weekly", children: "Weekly Settle" }), (0, jsx_runtime_1.jsx)("option", { value: "Monthly", children: "Monthly Settle" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Care Level" }), (0, jsx_runtime_1.jsxs)("select", { value: newCaseCareLevel, onChange: (e) => {
                                            setNewCaseCareLevel(e.target.value);
                                            setNewCaseDuration(e.target.value.includes("Acute") ? "2" : "6");
                                        }, className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer", children: [(0, jsx_runtime_1.jsx)("option", { value: "\uD83C\uDF31 Acute & Wellness Care", children: "\uD83C\uDF31 Acute & Wellness Care (\u20B92,280)" }), (0, jsx_runtime_1.jsx)("option", { value: "\u26A1 Standard Chronic Care", children: "\u26A1 Standard Chronic Care (\u20B99,600)" }), (0, jsx_runtime_1.jsx)("option", { value: "\uD83D\uDEA8 Acute Critical Care", children: "\uD83D\uDEA8 Acute Critical Care (\u20B920,000)" }), (0, jsx_runtime_1.jsx)("option", { value: "\uD83C\uDFAF Deep Systemic Care", children: "\uD83C\uDFAF Deep Systemic Care (\u20B916,800)" }), (0, jsx_runtime_1.jsx)("option", { value: "\uD83E\uDEC1 Advanced Pathological Care", children: "\uD83E\uDEC1 Advanced Pathological Care (\u20B924,000)" }), (0, jsx_runtime_1.jsx)("option", { value: "\uD83D\uDD2E Multisystem Integrative Care", children: "\uD83D\uDD2E Multisystem Integrative Care (\u20B933,600)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Custom Price Override (Optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: newCasePrice, onChange: (e) => setNewCasePrice(e.target.value), placeholder: "e.g. 5000", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Duration (Weeks)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", required: true, value: newCaseDuration, onChange: (e) => setNewCaseDuration(e.target.value), placeholder: "e.g. 2 or 6", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "No. of Conditions" }), (0, jsx_runtime_1.jsx)("input", { type: "number", required: true, value: newCaseConditions, onChange: (e) => setNewCaseConditions(e.target.value), placeholder: "e.g. 1", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Concession / Discount" }), (0, jsx_runtime_1.jsxs)("select", { value: newCaseConcession, onChange: (e) => setNewCaseConcession(e.target.value), className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold cursor-pointer", children: [(0, jsx_runtime_1.jsx)("option", { value: "None", children: "No Concession" }), (0, jsx_runtime_1.jsx)("option", { value: "Senior Citizen Discount", children: "Senior Citizen Discount" }), (0, jsx_runtime_1.jsx)("option", { value: "Socio-Economic Relief", children: "Socio-Economic Relief" }), (0, jsx_runtime_1.jsx)("option", { value: "Special Concession", children: "Special Concession" }), (0, jsx_runtime_1.jsx)("option", { value: "Student Discount", children: "Student Discount" }), (0, jsx_runtime_1.jsx)("option", { value: "Healthcare Professional Discount", children: "Healthcare Professional Discount" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider block", children: "Chief Complaint Notes" }), (0, jsx_runtime_1.jsx)("textarea", { required: true, rows: 3, value: newCaseComplaint, onChange: (e) => setNewCaseComplaint(e.target.value), placeholder: "Describe the main clinical complaints, remedy modalities, and pathology index...", className: "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold resize-y" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 border-t border-slate-100 pt-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsNewCaseOpen(false), className: "bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer", children: "Cancel" }), (0, jsx_runtime_1.jsxs)("button", { type: "submit", disabled: isCreatingCase, className: "bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5", children: [isCreatingCase ? (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-3.5 h-3.5" }), "Save & Register Case"] })] })] })), (() => {
                const topRem = scoringResult?.topRemedies[0];
                const totalWarnings = scoringResult?.topRemedies.reduce((acc, r) => acc + (r.contradictoryEvidence?.length || 0), 0) || 0;
                const missingGaps = reasoningSummary?.missingInformation?.length || 0;
                return ((0, jsx_runtime_1.jsxs)("div", { className: "sticky top-[42px] z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between shadow-xs mb-4 text-[10px] text-slate-700 font-bold", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500 uppercase text-[8px] font-black tracking-wider", children: "Clinical OS Summary:" }), topRem ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-100", children: (0, jsx_runtime_1.jsxs)("span", { children: ["Top Remedy: ", (0, jsx_runtime_1.jsx)("strong", { children: topRem.remedyId }), " (", topRem.confidence, "%)"] }) })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-slate-400 italic", children: "No active repertorization" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [totalWarnings > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "bg-rose-50 text-rose-800 border border-rose-200 text-[8px] font-black px-2 py-0.5 rounded-lg", children: [totalWarnings, " Warnings"] })), missingGaps > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "bg-sky-50 text-sky-800 border border-sky-200 text-[8px] font-black px-2 py-0.5 rounded-lg", children: [missingGaps, " Gaps"] }))] })] }));
            })(), (0, jsx_runtime_1.jsxs)("div", { className: "w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pb-12 text-slate-800 lg:h-[calc(100vh-140px)] lg:max-h-[950px] min-h-[500px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-5 flex flex-col gap-4 order-2 lg:order-1 lg:overflow-y-auto lg:h-full pb-6 pr-1 scrollbar-thin", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4 text-emerald-500" }), "AI Intake & Symptoms Workspace"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-mono", children: "Repertory suggestions for clinician review" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("textarea", { value: nlpInput, onChange: (e) => setNlpInput(e.target.value), placeholder: "Paste raw patient voice intake here (e.g., 'Worse at 3am, anxious, extremely chilly, bloating immediately after eating')...", className: "w-full h-48 md:h-56 min-h-[180px] bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all resize-y font-semibold leading-relaxed" }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end gap-3", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: handleParseIntake, disabled: parsingIntake || !nlpInput.trim(), className: "bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5", children: [parsingIntake ? (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-3.5 h-3.5" }), "Parse Case Intake"] }) })] }), (() => {
                                        const chips = getCategorizedChips();
                                        const hasChips = chips.mental.length > 0 || chips.physical.length > 0 || chips.sleep.length > 0 || chips.modalities.length > 0 || chips.general.length > 0;
                                        if (!hasChips)
                                            return null;
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl space-y-3 text-left", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-[10px] font-black text-slate-500 uppercase tracking-wider", children: "Extracted Symptoms" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [chips.mental.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-purple-600 block mb-1", children: "Mental" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1.5", children: chips.mental.map(({ sr, rub }) => ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setSearchTerm(rub.title), className: "bg-white border border-purple-200 hover:border-purple-400 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer", children: ["\u2713 ", rub.title, " (G", rub.grade, ")"] }, sr.rubricId))) })] })), chips.physical.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-emerald-600 block mb-1", children: "Physical" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1.5", children: chips.physical.map(({ sr, rub }) => ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setSearchTerm(rub.title), className: "bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer", children: ["\u2713 ", rub.title, " (G", rub.grade, ")"] }, sr.rubricId))) })] })), chips.sleep.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-blue-600 block mb-1", children: "Sleep" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1.5", children: chips.sleep.map(({ sr, rub }) => ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setSearchTerm(rub.title), className: "bg-white border border-blue-200 hover:border-blue-400 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer", children: ["\u2713 ", rub.title, " (G", rub.grade, ")"] }, sr.rubricId))) })] })), chips.modalities.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-amber-600 block mb-1", children: "Modalities" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1.5", children: chips.modalities.map(({ sr, rub }) => ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setSearchTerm(rub.title), className: "bg-white border border-amber-200 hover:border-amber-400 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer", children: ["\u2713 ", rub.title, " (G", rub.grade, ")"] }, sr.rubricId))) })] })), chips.general.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-slate-500 block mb-1", children: "General" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1.5", children: chips.general.map(({ sr, rub }) => ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setSearchTerm(rub.title), className: "bg-white border border-slate-200 hover:border-slate-400 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer", children: ["\u2713 ", rub.title, " (G", rub.grade, ")"] }, sr.rubricId))) })] }))] })] }));
                                    })()] }), (() => {
                                const resolvedCatalogExpanded = isCatalogExpanded !== null ? isCatalogExpanded : (selectedRubrics.length <= 6);
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 flex flex-col gap-4 shadow-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-4 h-4 text-emerald-500" }), "Clinical Rubrics Catalog (", rubrics.length, " matches)"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsCatalogExpanded(!resolvedCatalogExpanded), className: "text-[10px] font-black border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-mono", children: resolvedCatalogExpanded ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "w-3.5 h-3.5" }), "Collapse"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3.5 h-3.5" }), "Expand"] })) }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: handleRunAudit, disabled: auditLoading, className: "text-[10px] font-black border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-mono", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-3 h-3 text-amber-500" }), "Audit"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search rubrics, synonyms, remedies...", className: "w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-xs" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer", children: [(0, jsx_runtime_1.jsx)("option", { value: "All", children: "All Categories" }), CATEGORIES.filter(c => c !== 'All').map(c => ((0, jsx_runtime_1.jsx)("option", { value: c, children: c }, c)))] }), (0, jsx_runtime_1.jsxs)("select", { value: selectedOrganSystem, onChange: (e) => setSelectedOrganSystem(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer", children: [(0, jsx_runtime_1.jsx)("option", { value: "All", children: "All Systems" }), ORGAN_SYSTEMS.filter(o => o !== 'All').map(o => ((0, jsx_runtime_1.jsx)("option", { value: o, children: o }, o)))] })] })] }), resolvedCatalogExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "border-t border-slate-100 pt-4 flex-grow transition-all duration-300", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center py-20", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-8 h-8 text-slate-300 animate-spin" }) })) : rubrics.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-20 text-slate-400 space-y-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-10 h-10 mx-auto opacity-40 text-slate-400" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-bold", children: "No active clinical rubrics found matching current filter." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-3 pr-1", children: rubrics.map(rub => {
                                                    const isActive = selectedRubrics.some(s => s.rubricId === rub.rubricId);
                                                    const isExpanded = expandedRubricId === rub.rubricId;
                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col bg-white rounded-2xl border transition-all duration-300 p-4 shadow-2xs hover:shadow-xs ${isActive ? 'border-emerald-500/40 bg-emerald-50/10' : 'border-slate-100 hover:border-slate-200'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-left flex-grow min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-wrap", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50", children: rub.category }), (0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-semibold text-slate-400 font-mono", children: rub.organSystem })] }), (0, jsx_runtime_1.jsx)("h5", { className: "text-xs font-bold text-slate-900 line-clamp-2 leading-snug", children: rub.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-400 font-medium italic", children: rub.classicalWording })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 shrink-0", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setExpandedRubricId(isExpanded ? null : rub.rubricId), className: "p-1.5 border border-slate-200 hover:border-slate-800 rounded-xl bg-white text-slate-400 hover:text-slate-800 text-[10px] font-bold cursor-pointer transition-colors", children: isExpanded ? 'Hide Grades' : 'Show Grades' }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleToggleRubric(rub), className: `p-1.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 ${isActive
                                                                                    ? 'bg-rose-500 border-rose-500 hover:bg-rose-600 text-white'
                                                                                    : 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 text-white'}`, title: isActive ? "Remove from workbench" : "Add to workbench", children: isActive ? (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-3.5 h-3.5" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-3.5 h-3.5" }) })] })] }), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 pt-3 border-t border-slate-100 text-left space-y-3 animate-in slide-in-from-top-2 duration-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-50/50 p-2.5 rounded-xl border border-slate-100", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] text-slate-500 font-semibold leading-relaxed", children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-slate-700", children: "Meaning:" }), " ", rub.plainLanguageMeaning] }), rub.clinicalNotes && ((0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] text-slate-500 font-semibold leading-relaxed mt-1", children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-slate-700", children: "Clinical Tip:" }), " ", rub.clinicalNotes] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5", children: [(0, jsx_runtime_1.jsxs)("span", { className: "block text-[8px] font-black uppercase text-slate-400 tracking-widest font-mono", children: ["Graded Remedy Coverage (", rub.relatedRemedies.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: rub.relatedRemedies.map(rem => {
                                                                                    const gradeBadge = rem.grade === 4 ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                                                        rem.grade === 3 ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                                                                            rem.grade === 2 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                                                                'bg-slate-100 text-slate-700 border-slate-200';
                                                                                    const gradeLabel = rem.grade === 4 ? 'Grade 4 (Keynote)' :
                                                                                        rem.grade === 3 ? 'Grade 3 (Strong)' :
                                                                                            rem.grade === 2 ? 'Grade 2 (Moderate)' :
                                                                                                'Grade 1 (Low)';
                                                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col bg-slate-50 border border-slate-100 p-2 rounded-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-[10px] font-black text-slate-900", children: [rem.remedyId, " - ", rem.remedyName] }), (0, jsx_runtime_1.jsx)("span", { className: `text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${gradeBadge}`, children: gradeLabel })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-[9px] text-slate-500 leading-normal font-semibold mt-1", children: rem.keynoteReason })] }, rem.remedyId));
                                                                                }) })] })] }))] }, rub.rubricId));
                                                }) })) }))] }));
                            })()] }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2 lg:overflow-y-auto lg:h-full pb-6 pr-1 scrollbar-thin", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sliders, { className: "w-4 h-4 text-emerald-500 animate-pulse" }), "Active Workbench (", selectedRubrics.length, ")"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedRubrics([]), disabled: selectedRubrics.length === 0, className: "text-[9px] font-black text-rose-500 hover:text-rose-600 disabled:opacity-50 cursor-pointer uppercase border-none bg-transparent", children: "Clear Workbench" })] }), selectedRubrics.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-8 h-8 mx-auto opacity-40 text-slate-400" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold", children: "No rubrics selected. Click the '+' button in the catalog or parse intake text to begin analysis." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-1.5 max-h-[300px] overflow-y-auto pr-1", children: selectedRubrics.map(s => {
                                            const rub = rubrics.find(r => r.rubricId === s.rubricId);
                                            return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-50 border border-slate-150 p-1.5 px-3 rounded-xl flex items-center justify-between gap-3 group text-[10px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-grow min-w-0 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-800 truncate max-w-[120px] xl:max-w-[180px]", children: rub?.title || s.rubricId }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50 shrink-0 font-bold", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Sev: ", s.severity, "/10"] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: s.frequency })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 shrink-0", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleConfigureSymptom(s.rubricId), className: "p-1 border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 rounded-lg text-[8px] font-black uppercase px-2 font-mono cursor-pointer transition-colors", children: "Edit" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleRemoveSymptom(s.rubricId), className: "p-1.5 border border-rose-100 hover:border-rose-500 rounded-lg bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 cursor-pointer transition-all", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-3 h-3" }) })] })] }, s.rubricId));
                                        }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900 text-slate-100 rounded-3xl p-6 space-y-4 shadow-sm text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3.5 h-3.5 text-emerald-400" }), "Repertorization Scoring Panel"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 shrink-0", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono", children: "Decision Support" }), scoringResult && ((0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono", children: ["Margin: ", scoringResult.confidenceScore, "%"] }))] })] }), isScoringLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center py-10", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-6 h-6 text-emerald-500 animate-spin" }) })) : !scoringResult || scoringResult.topRemedies.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "py-10 text-center text-slate-500", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold", children: "Select symptoms to calculate remedy affinities." }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: scoringResult.topRemedies.slice(0, 5).map((rem, idx) => {
                                                    const maxScore = scoringResult.topRemedies[0].score || 1;
                                                    const pct = Math.round((rem.score / maxScore) * 100);
                                                    return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => setActiveRemedyDetails(activeRemedyDetails === rem.remedyId ? null : rem.remedyId), className: `p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col ${activeRemedyDetails === rem.remedyId
                                                            ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                                                            : 'bg-slate-850/50 border-white/5 hover:border-white/15'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-[10px] font-bold", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] text-slate-400", children: ["#", idx + 1] }), (0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-emerald-400", children: rem.remedyId }), (0, jsx_runtime_1.jsx)("span", { className: "text-[8px] text-slate-400 font-medium max-w-[80px] truncate", children: rem.remedyName })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 font-mono text-[9px] font-medium text-slate-350", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Score: ", rem.score] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-emerald-400", children: ["(", rem.confidence, "%)"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-blue-400", children: ["Fit: ", rem.constitutionalFit || 0, "%"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-emerald-500 h-full rounded-full transition-all duration-500", style: { width: `${pct}%` } }) }), activeRemedyDetails === rem.remedyId && (() => {
                                                                const diff = differentiations.find(d => d.remedyId === rem.remedyId);
                                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 pt-3 border-t border-white/5 space-y-2 text-[10px] text-slate-350 font-semibold animate-in fade-in duration-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-slate-900/65 p-2 border border-white/5 rounded-xl text-[8px] font-bold text-amber-400/90 text-center uppercase tracking-wider font-mono", children: "\u26A0\uFE0F Repertory suggestions for clinician review" }), (0, jsx_runtime_1.jsx)("p", { className: "text-emerald-400/90 font-bold leading-normal", children: diff?.reason }), diff?.strongestMatchingRubrics && diff.strongestMatchingRubrics.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-slate-500 tracking-wider font-mono block", children: "Strong matches:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-300 leading-normal", children: diff.strongestMatchingRubrics.join(', ') })] })), diff?.missingConfirmingRubrics && diff.missingConfirmingRubrics.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-slate-500 tracking-wider font-mono block", children: "Missing Confirming Rubrics:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-300 leading-normal", children: diff.missingConfirmingRubrics.join(', ') })] })), diff?.cautionNotes && ((0, jsx_runtime_1.jsx)("div", { className: "bg-rose-500/10 border border-rose-500/20 text-rose-300 p-1.5 rounded-lg font-bold", children: diff.cautionNotes })), (0, jsx_runtime_1.jsx)("span", { className: "block text-[8px] font-bold text-slate-500 font-mono italic", children: diff?.materiaMedicaRef })] }));
                                                            })()] }, rem.remedyId));
                                                }) }), scoringResult.missingDataNeeded.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-emerald-950/40 border border-emerald-500/10 rounded-2xl p-3.5 space-y-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase text-emerald-400 tracking-wider font-mono block", children: "Missing Clinical Parameters" }), (0, jsx_runtime_1.jsx)("ul", { className: "list-disc pl-4 text-[10px] text-slate-300 font-semibold space-y-1", children: scoringResult.missingDataNeeded.map(m => ((0, jsx_runtime_1.jsx)("li", { children: m }, m))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "pt-2 border-t border-white/5 grid grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: handleSendToPlanner, className: "bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 font-mono", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-3.5 h-3.5 text-slate-950" }), "Send to Planner"] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative group/export", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", className: "w-full bg-slate-800 hover:bg-slate-750 text-slate-200 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-white/5 flex items-center justify-center gap-1 font-mono", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-3.5 h-3.5" }), "Export Options"] }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 hidden group-hover/export:flex flex-col bg-slate-800 border border-white/10 rounded-xl p-1 shadow-xl z-20 w-[150px] animate-in fade-in duration-200", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleExportData('json'), className: "w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg", children: "JSON schema" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleExportData('csv'), className: "w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg", children: "CSV spreadsheet" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleExportData('mdx'), className: "w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg", children: "MDX report" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleExportData('triples'), className: "w-full text-left px-3 py-1.5 hover:bg-slate-750 text-[10px] font-bold text-slate-200 border-none bg-transparent cursor-pointer rounded-lg", children: "RDF Triples" })] })] })] })] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-3 flex flex-col gap-4 order-3 lg:order-3 text-left lg:overflow-y-auto lg:h-full pb-6 pr-1 scrollbar-thin", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sliders, { className: "w-4 h-4 text-emerald-500" }), "Reasoning Engine"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 font-mono", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-250/30", children: "Clinician Review" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200", children: "AI Assisted" })] })] }), selectedRubrics.length > 0 && validationFindings.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50/60 border border-rose-150/40 p-3 rounded-xl space-y-2.5 text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-rose-200/40 pb-1.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-[8px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-mono", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-2.5 h-2.5" }), "Critical Alerts"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] font-bold text-rose-800 font-mono", children: [validationFindings.length, " issues"] })] }), validationFindings.length > 2 && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowAllAudits(!showAllAudits), className: "text-[8px] font-black uppercase border border-rose-200 hover:border-rose-600 bg-white hover:bg-slate-50 text-rose-700 px-2 py-0.5 rounded-lg transition-all cursor-pointer font-mono", children: showAllAudits ? 'Less' : `All (${validationFindings.length})` }))] }), (0, jsx_runtime_1.jsx)("ul", { className: "text-[10px] text-rose-700/90 font-bold space-y-1 pl-3.5 list-disc leading-normal", children: (showAllAudits ? validationFindings : validationFindings.slice(0, 2)).map((finding, idx) => ((0, jsx_runtime_1.jsxs)("li", { className: finding.severity === 'critical' ? 'text-rose-900 font-black' : '', children: [(0, jsx_runtime_1.jsx)("span", { className: "uppercase text-[8px] font-black tracking-wider bg-rose-100/80 text-rose-800 px-1 py-0.2 rounded mr-1 font-mono inline-block", children: finding.category.replace('_', ' ') }), finding.message] }, idx))) })] })), selectedRubrics.length === 0 || !reasoningSummary ? ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-8 h-8 mx-auto opacity-40 text-slate-400" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold", children: "No active analysis." }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-500 font-semibold px-6", children: "Add symptoms to the workbench to generate explainable AI reasoning, coverage heatmaps, differential comparisons, and follow-up prompts." })] })) : (() => {
                                    const activeRes = reasoningSummary.topRemedies.find(r => r.remedyId === activeReasoningRemedyId);
                                    const patMatch = reasoningSummary.matchedPatterns?.find(p => p.remedyId === activeReasoningRemedyId);
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1.5 pt-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-black text-slate-500 uppercase tracking-wide", children: "Target Remedy:" }), (0, jsx_runtime_1.jsx)("select", { value: activeReasoningRemedyId || '', onChange: (e) => {
                                                            setActiveReasoningRemedyId(e.target.value);
                                                            setExpandedDockSection(null);
                                                        }, className: "bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] font-bold cursor-pointer w-full", children: reasoningSummary.topRemedies.map(r => ((0, jsx_runtime_1.jsxs)("option", { value: r.remedyId, children: [r.remedyId, " - ", r.remedyName, " (", r.confidence, "%)"] }, r.remedyId))) })] }), activeRes && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2 text-[9px] font-bold", children: [activeRes.constitutionalFit !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[7px] text-slate-400 uppercase font-black", children: "Constitutional Fit" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-emerald-600 font-mono text-[9px] mt-0.5", children: [activeRes.constitutionalFit, "%"] })] })), activeRes.miasmaticFit !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[7px] text-slate-400 uppercase font-black", children: "Miasmatic Fit" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-blue-600 font-mono text-[9px] mt-0.5", children: [activeRes.miasmaticFit, "%"] })] })), activeRes.modalityFit !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[7px] text-slate-400 uppercase font-black", children: "Modality Align" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-indigo-600 font-mono text-[9px] mt-0.5", children: [activeRes.modalityFit, "%"] })] })), activeRes.etiologyFit !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col bg-slate-50 border border-slate-200 p-2 rounded-xl", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[7px] text-slate-400 uppercase font-black", children: "Etiology Match" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-violet-600 font-mono text-[9px] mt-0.5", children: [activeRes.etiologyFit, "%"] })] }))] })), patMatch && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-amber-50 border border-amber-200/50 p-3 rounded-xl text-[10px] text-amber-800", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold block", children: "\uD83D\uDD25 Clinical Pattern Match:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium block mt-0.5", children: [patMatch.patternName, " (", patMatch.matchPercentage, "% Overlap)"] })] })), patMatch && patMatch.missingIndicators.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5 text-[9px] text-slate-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-amber-700", children: "Missing Confirmations:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1.5", children: patMatch.missingIndicators.map((mi, idx) => ((0, jsx_runtime_1.jsx)("span", { className: "bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg font-bold", children: mi.title }, idx))) })] })), reasoningSummary.suggestedQuestions && reasoningSummary.suggestedQuestions.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5 text-[9px] text-slate-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-500 uppercase tracking-wide", children: "Next Follow-up Questions:" }), (0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside space-y-1 pl-1 text-slate-600", children: reasoningSummary.suggestedQuestions.slice(0, 3).map((q, idx) => ((0, jsx_runtime_1.jsx)("li", { children: q.questionText }, idx))) })] }))] }));
                                })()] }) })] }), modifyingSymptom && (() => {
                const rub = rubrics.find(r => r.rubricId === modifyingSymptom.rubricId);
                return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-black uppercase text-emerald-600 tracking-wider font-mono bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100", children: "Adjust Clinical Modifiers" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-bold text-slate-900 mt-2", children: rub?.title || modifyingSymptom.rubricId }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-400 mt-1 font-semibold", children: rub?.category })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono", children: "Severity Scale" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono", children: [modifyingSymptom.severity, " / 10"] })] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "1", max: "10", value: modifyingSymptom.severity, onChange: (e) => setModifyingSymptom({ ...modifyingSymptom, severity: Number(e.target.value) }), className: "w-full h-1.5 bg-slate-100 accent-emerald-500 rounded-lg appearance-none cursor-pointer border border-slate-200/50" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-[9px] text-slate-400 font-semibold font-mono", children: [(0, jsx_runtime_1.jsx)("span", { children: "Mild (1-3)" }), (0, jsx_runtime_1.jsx)("span", { children: "Moderate (4-7)" }), (0, jsx_runtime_1.jsx)("span", { children: "Severe (8-10)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono", children: "Frequency Modifiers" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200/40", children: ['constant', 'frequent', 'occasional'].map((freq) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setModifyingSymptom({ ...modifyingSymptom, frequency: freq }), className: `flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer border-none ${modifyingSymptom.frequency === freq
                                                ? "bg-slate-900 text-white shadow-xs"
                                                : "text-slate-500 hover:text-slate-800 bg-transparent"}`, children: freq }, freq))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono", children: "Functional Impact" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200/40", children: ['severe', 'moderate', 'mild'].map((imp) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setModifyingSymptom({ ...modifyingSymptom, impact: imp }), className: `flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer border-none ${modifyingSymptom.impact === imp
                                                ? "bg-slate-900 text-white shadow-xs"
                                                : "text-slate-500 hover:text-slate-800 bg-transparent"}`, children: imp }, imp))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleSaveSymptomModifiers, className: "flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer border-none font-mono", children: "Save Modifiers" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setModifyingSymptom(null), className: "flex-1 border border-slate-200 hover:bg-slate-100 text-slate-500 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-mono", children: "Cancel" })] })] }) }));
            })(), showAuditModal && auditReport && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-amber-500" }), "Clinical Repertory Quality Audit Report"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-400 font-semibold mt-1", children: "Checking data compliance, structures, synonyms, and claims rules" })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowAuditModal(false), className: "text-slate-400 hover:text-slate-900 border-none bg-transparent font-bold cursor-pointer text-sm", children: "Close" })] }), (0, jsx_runtime_1.jsxs)("div", { className: `p-4 rounded-2xl flex items-center gap-3 border ${auditReport.isValid
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                : 'bg-rose-50 border-rose-100 text-rose-800'}`, children: [auditReport.isValid ? (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-6 h-6 shrink-0" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-6 h-6 shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-black", children: ["Database Status: ", auditReport.isValid ? 'VALID & COMPLIANT' : 'ATTENTION REQUIRED'] }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] font-semibold leading-relaxed mt-0.5", children: auditReport.isValid
                                                ? 'All checked rubrics meet clinical terminology rules, grading limits, and safety standards.'
                                                : 'We detected duplicate titles, invalid remedy mappings, or prohibited definitive claims.' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono", children: ["1. Prohibited Definitive Claims (", auditReport.prohibitedClaims.length, ")"] }), auditReport.prohibitedClaims.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-emerald-600 font-bold", children: "\u2713 Zero definitive claims detected. Complies with safety regulations." })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-1.5 max-h-[120px] overflow-y-auto bg-slate-50 border border-slate-100 p-2.5 rounded-xl", children: auditReport.prohibitedClaims.map((p, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 border border-rose-100 text-rose-800 p-2 rounded-lg text-[10px]", children: [(0, jsx_runtime_1.jsxs)("strong", { children: ["Rubric: ", p.rubricId] }), " (Field: ", p.field, ") - Contains prohibited term: ", (0, jsx_runtime_1.jsxs)("strong", { className: "underline font-black", children: ["\"", p.term, "\""] })] }, idx))) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono", children: ["2. Duplicate Rubrics Detected (", auditReport.duplicates.length, ")"] }), auditReport.duplicates.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-emerald-600 font-bold", children: "\u2713 No duplicates or highly overlapping titles found." })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-1.5 max-h-[120px] overflow-y-auto bg-slate-50 border border-slate-100 p-2.5 rounded-xl", children: auditReport.duplicates.map((d, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-amber-50 border border-amber-100 text-amber-800 p-2 rounded-lg text-[10px] flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["\"", d.title1, "\" ", (0, jsx_runtime_1.jsx)("strong", { className: "text-slate-500", children: "\u2194" }), " \"", d.title2, "\""] }), (0, jsx_runtime_1.jsxs)("span", { className: "font-mono text-[9px] bg-white border border-amber-200 px-1.5 rounded font-black", children: [Math.round(d.distance * 100), "% Match"] })] }, idx))) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono", children: ["3. Orphan Rubrics Check (", auditReport.orphanRubrics.length, ")"] }), auditReport.orphanRubrics.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-emerald-600 font-bold", children: "\u2713 All rubrics are properly connected in the relationship graph." })) : ((0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-100/50 p-2 rounded-xl", children: ["Orphan Rubrics: ", auditReport.orphanRubrics.join(', ')] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono", children: ["4. Invalid Remedy Abbreviations (", auditReport.invalidRemedyIds.length, ")"] }), auditReport.invalidRemedyIds.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-emerald-600 font-bold", children: "\u2713 All mapped remedies correspond to valid Materia Medica identifiers." })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-1.5 bg-rose-50 border border-rose-100 p-2 rounded-xl text-rose-800 text-[10px]", children: auditReport.invalidRemedyIds.map((ir, idx) => ((0, jsx_runtime_1.jsxs)("div", { children: ["Rubric ", ir.rubricId, " references invalid remedy code: ", (0, jsx_runtime_1.jsx)("strong", { children: ir.remedyId })] }, idx))) }))] })] })] }) })), reasoningSummary && activeReasoningRemedyId && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-6 mt-6 shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex border-b border-slate-200/60 pb-3 gap-2 overflow-x-auto", children: [
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
                            return ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                    setActiveDockTab(tab.id);
                                    setExpandedDockSection(null);
                                }, className: `text-[10px] font-black uppercase px-4 py-2 rounded-xl transition cursor-pointer flex-shrink-0 border ${isActive
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'}`, children: tab.label }, tab.id));
                        }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 min-h-[150px]", children: renderDockContent() })] }))] }));
};
exports.RepertoryWorkbench = RepertoryWorkbench;
