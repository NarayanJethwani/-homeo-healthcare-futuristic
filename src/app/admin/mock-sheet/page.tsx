"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { 
  FileSpreadsheet, ArrowLeft, Info, AlertTriangle, Check, 
  Plus, Trash2, TrendingUp, Sparkles, Folder, Copy, ExternalLink, 
  ChevronDown, ChevronRight, Activity, CheckCircle, 
  AlertCircle, Search, X
} from "lucide-react";
import Link from "next/link";
import { JETHWANI_REPERTORY_DATA, setRepertoryData } from "@/lib/repertoryData";

type TabType = "Dashboard" | "Case Taking" | "Follow-up Tracker" | "Repertorization" | "Treatment Planner" | "Finance" | "AI Repertory Lab" | "Reports & Attachments" | "Config DB";

const mapCareLevel = (levelStr: string): "mild" | "moderate" | "focused" | "acute_critical" | "organ" | "comprehensive" => {
  const l = levelStr.toLowerCase();
  if (l.includes("critical") || l.includes("emergency") || l.includes("acute critical")) return "acute_critical";
  if (l.includes("acute") || l.includes("wellness") || l.includes("general") || l.includes("consult")) return "mild";
  if (l.includes("standard") || l.includes("chronic") || l.includes("moderate")) return "moderate";
  if (l.includes("deep") || l.includes("systemic") || l.includes("focused")) return "focused";
  if (l.includes("organ") || l.includes("advanced") || l.includes("pathological")) return "organ";
  if (l.includes("multisystem") || l.includes("premium") || l.includes("comprehensive") || l.includes("integrative")) return "comprehensive";
  return "focused"; // default
};

const getDurationMonths = (text: string): number => {
  const t = text.toLowerCase();
  if (t.includes("12-month") || t.includes("1-year") || t.includes("1 year") || t.includes("12 months")) return 12;
  if (t.includes("6-month") || t.includes("6 months")) return 6;
  if (t.includes("3-month") || t.includes("3 months")) return 3;
  if (t.includes("2-month") || t.includes("2 months")) return 2;
  if (t.includes("1-month") || t.includes("1 month")) return 1;
  return 1;
};

// Inbuilt Common Homeopathic Remedies
const INBUILT_REMEDIES = [
  "Aconitum Napellus",
  "Allium Cepa",
  "Antimonium Tartaricum",
  "Apis Mellifica",
  "Arnica Montana",
  "Arsenicum Album",
  "Arsenicum Iodatum",
  "Avena Sativa",
  "Baryta Carbonica",
  "Belladonna",
  "Berberis Vulgaris",
  "Bryonia Alba",
  "Calcarea Carbonica",
  "Calcarea Fluorica",
  "Calcarea Phosphorica",
  "Calcarea Sulphurica",
  "Cantharis",
  "Carbo Vegetabilis",
  "Carduus Marianus",
  "Causticum",
  "Chamomilla",
  "Chelidonium Majus",
  "Chininum Sulphuricum",
  "Cina",
  "Cinchona Officinalis (China)",
  "Colocynthis",
  "Conium Maculatum",
  "Crataegus Oxyacantha",
  "Damiana",
  "Dioscorea Villosa",
  "Dulcamara",
  "Eupatorium Perfoliatum",
  "Ferrum Phosphoricum",
  "Gelsemium Sempervirens",
  "Glonoine",
  "Graphites",
  "Gymnema Sylvestre",
  "Hepar Sulphuris Calcareum",
  "Hydrastis Canadensis",
  "Hyoscyamus Niger",
  "Hypericum Perforatum",
  "Ignatia Amara",
  "Ipecacuanha",
  "Kali Bichromicum",
  "Kali Muriaticum",
  "Kali Phosphoricum",
  "Kali Sulphuricum",
  "Lachesis Muta",
  "Ledum Palustre",
  "Lycopodium Clavatum",
  "Magnesia Phosphorica",
  "Mercurius Solubilis",
  "Natrum Muriaticum",
  "Natrum Phosphoricum",
  "Natrum Sulphuricum",
  "Nux Vomica",
  "Passiflora Incarnata",
  "Phosphorus",
  "Phytolacca Decandra",
  "Podophyllum Peltatum",
  "Pulsatilla Pratensis",
  "Rhus Toxicodendron",
  "Ruta Graveolens",
  "Sabal Serrulata",
  "Sarsaparilla Officinalis",
  "Secale Cornutum",
  "Sepia Officinalis",
  "Silicea",
  "Spongia Tosta",
  "Staphysagria",
  "Stramonium",
  "Sulphur",
  "Symphytum Officinale",
  "Syzygium Jambolanum",
  "Thlaspi Bursa Pastoris",
  "Thuja Occidentalis",
  "Urtica Urens",
  "Veratrum Album",
  // Bio-combinations
  "BC-1 (Anemia)",
  "BC-2 (Asthma)",
  "BC-3 (Colic)",
  "BC-4 (Constipation)",
  "BC-5 (Coryza)",
  "BC-6 (Cough, Cold)",
  "BC-7 (Diabetes)",
  "BC-8 (Diarrhea)",
  "BC-9 (Dysentery)",
  "BC-10 (Tonsillitis)",
  "BC-11 (Fever)",
  "BC-12 (Headache)",
  "BC-13 (Leucorrhea)",
  "BC-14 (Measles)",
  "BC-15 (Menstrual Troubles)",
  "BC-16 (Nervous Exhaustion)",
  "BC-17 (Piles)",
  "BC-18 (Pyorrhea)",
  "BC-19 (Rheumatism)",
  "BC-20 (Skin Diseases)",
  "BC-21 (Teething Troubles)",
  "BC-22 (Scrofula)",
  "BC-23 (Toothache)",
  "BC-24 (Debility)",
  "BC-25 (Acidity, Flatulence)",
  "BC-26 (Easy Parturition)",
  "BC-27 (Lack of Vitality)",
  "BC-28 (Tonic)"
];

const getClinicalMethodInfo = (medicines: any[]) => {
  if (medicines.length === 0) return { title: "No Remedy", desc: "No medicines added yet.", color: "bg-slate-100 text-slate-650 border-slate-200" };
  if (medicines.length === 1) {
    const med = medicines[0];
    return {
      title: "Classical Method",
      desc: `Single constitutional remedy (${med.name} ${med.potency}) matching patient totality.`,
      color: "bg-blue-50 text-[#0F4C81] border-blue-200"
    };
  }
  
  const types = medicines.map(m => m.type);
  const uniqueTypes = Array.from(new Set(types));
  return {
    title: "Complex Method",
    desc: `Concurrent target remedies addressing separate systemic symptoms (${uniqueTypes.join(", ")}).`,
    color: "bg-emerald-50 text-emerald-800 border-emerald-200"
  };
};

function MockSheetContent() {
  const searchParams = useSearchParams();
  const sheetUrl = searchParams.get("sheetUrl") || "";

  // Extract query parameters for initial state
  const initialName = searchParams.get("name") || "Aarav Mehta";
  const initialId = searchParams.get("id") || "P-100234";
  const initialAge = searchParams.get("age") || "42";
  const initialGender = searchParams.get("gender") || "Male";
  const initialPhone = searchParams.get("phone") || "+91 98200 12345";
  const initialEmail = searchParams.get("email") || "aarav.mehta@gmail.com";
  const initialComplaint = searchParams.get("complaint") || "Chronic severe acidity, GERD, and abdominal bloating immediately after eating. Irritability, very chilly, worse cold drinks [Psora] [Sycosis].";
  const initialCareLevel = searchParams.get("careLevel") || "6-Month Advanced";
  const initialDurationText = searchParams.get("durationText") || "6-Month Treatment Plan";
  const initialPriceVal = Number(searchParams.get("finalPrice") || "8500");
  const initialReceived = searchParams.get("receivedAmount") !== null && searchParams.get("receivedAmount") !== ""
    ? Number(searchParams.get("receivedAmount"))
    : initialPriceVal;
  const initialBillingCycle = searchParams.get("billingCycle") || "";
  const initialConcessionApplied = searchParams.get("concessionApplied") || "";
  const initialConditionsCount = searchParams.get("conditionsCount") ? Number(searchParams.get("conditionsCount")) : null;
  const initialDurationValue = searchParams.get("durationValue") ? Number(searchParams.get("durationValue")) : null;

  const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");
  const [editingCell, setEditingCell] = useState<{ section?: string; row?: number; field?: string; colIndex?: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Patient Info State
  const [patient, setPatient] = useState({
    id: initialId,
    name: initialName,
    age: initialAge,
    gender: initialGender,
    phone: initialPhone,
    email: initialEmail,
    address: "Baner, Pune, Maharashtra, India",
    bloodGroup: "O+ Pos",
    referredBy: "Self",
    clinicBranch: "Baner Clinic",
    doctor: "Dr. Narayan Jethwani",
    status: "Chronic"
  });

  // Case Taking State
  const [caseTaking, setCaseTaking] = useState({
    mainComplaint: initialComplaint,
    duration: initialDurationText,
    onset: "Gradual",
    progress: "Progressive",
    severity: "8",
    location: "Epigastrium and stomach area, radiating upwards",
    sensation: "Burning fire-like pain with sour eructations",
    modalBetter: "Warm drinks, sitting upright, warm applications [Psora]",
    modalWorse: "Eating immediately, cold drinks, lying down flat [Psora]",
    concomitants: "Headache and mild nausea during severe burning episodes [Psora] [Sycosis]",
    etiology: "Mental stress and irregular eating hours [Psora]",
    maintaining: "Sedentary lifestyle and excessive tea consumption [Psora]",
    // Generals
    temperament: "Choleretic (irritable and anxious)",
    fears: "Fears disease, dark, and being alone [Psora]",
    anxiety: "Anxious about future, high anticipation [Psora]",
    anger: "Vocal and intense, gets irritable easily [Psora]",
    grief: "Suppressed, does not like talking about grief [Sycosis]",
    depression: "Intermittent sadness post-grief [Sycosis]",
    memory: "Alert, but forgets names under stress [Psora]",
    concentration: "Difficult after heavy meals [Psora]",
    traits: "Perfectionist, fastidious, loves order [Psora]",
    // Physicals
    appetite: "Increased, hungry soon after eating",
    thirst: "Frequent but drinks small sips [Ars]",
    foodDesires: "Highly desires spicy and warm meals [Psora]",
    foodAversions: "Aversion to cold milk and sweets [Psora]",
    thermals: "Very Chilly (sensitive to cold drafts) [Psora]",
    perspiration: "Profuse on head and neck, sour smelling [Psora]",
    sleep: "Restless, wakes up between 3 AM to 4 AM [Nux-v]",
    dreams: "Dreams of busy work and unresolved tasks [Psora]",
    energy: "High in evening, low and sluggish in morning",
    // History
    pastIllnesses: "Typhoid fever at age 14, recurrent tonsillitis",
    pastSurgeries: "Appendectomy at age 24",
    pastAllergies: "Dust allergy, sensitive to sulfonamides",
    familyMaternal: "Mother has Type 2 Diabetes [Psora]",
    familyPaternal: "Father has Hypertension [Psora]",
    // Diagnosis
    primaryDiagnosis: "Gastroesophageal Reflux Disease (GERD) with dyspepsia",
    complexity: "Moderate Chronic Multi-systemic",
    totality: "Chilly patient with intense epigastric burning, worse cold, better warm. Highly irritable temperament, fastidious, restless sleep.",
    remedy: "Nux Vomica",
    potency: "30C",
    scale: "Centesimal (C)",
    dose: "4 pills, twice daily on dry tongue",
    rxDuration: "14 Days",
    advice: "Avoid tea, coffee, carbonated drinks, and deep-fried foods. Maintain 2 hours gap between dinner and sleep.",
    nextFollowUp: "2 Weeks later",
    aiEngine: "Gemini 3.5 Clinical Synthesis",
    aiTimestamp: "",
    aiJustification: ""
  });

  // Collapsible Sections State (Tab 2: Case Taking)
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    complaints: true,
    symptoms: true,
    mentals: true,
    physicals: true,
    pastHistory: false,
    familyHistory: false,
    investigations: false,
    diagnosis: true,
    miasm: true,
    totality: true,
    prescription: true,
    aiVerdict: true
  });

  // Follow-up Tracker State
  const [followUps, setFollowUps] = useState<any[]>([
    {
      date: today,
      symptoms: "Baseline consult: severe epigastric burning post meals, anxiety, chilly.",
      improvement: "0%",
      medicines: [
        { name: "Nux Vomica", potency: "30C", dose: "BD", type: "Dilution" }
      ],
      remedy: "Nux Vomica",
      potency: "30C (BD)",
      assessment: "Case taken, totality points to Nux-v. Symptom severity is 8/10.",
      nextReview: "After 14 Days"
    },
    {
      date: "21-06-2026",
      symptoms: "Burning reduced by 40%. Sleep improved, waking up less at night. Stools regular.",
      improvement: "40%",
      medicines: [
        { name: "Nux Vomica", potency: "30C", dose: "BD", type: "Dilution" }
      ],
      remedy: "Nux Vomica",
      potency: "30C (BD)",
      assessment: "Good response. Continue same remedy to stabilize.",
      nextReview: "After 2 Weeks"
    }
  ]);

  // Prescription Titration Manager state
  const [selectedFollowUpIndex, setSelectedFollowUpIndex] = useState<number | null>(null);
  const [tempMedicines, setTempMedicines] = useState<any[]>([]);
  const [remedySearch, setRemedySearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    potency: "30C",
    dose: "BD",
    type: "Dilution"
  });

  const handleOpenPrescriptionModal = (idx: number) => {
    setSelectedFollowUpIndex(idx);
    setTempMedicines(followUps[idx].medicines || []);
    setRemedySearch("");
    setShowSuggestions(false);
    setNewMedicine({
      name: "",
      potency: "30C",
      dose: "BD",
      type: "Dilution"
    });
  };

  const handleSavePrescription = () => {
    if (selectedFollowUpIndex !== null) {
      setFollowUps(prev => {
        const next = [...prev];
        const m = tempMedicines;
        const remedyStr = m.map(item => item.name).join(", ");
        const potencyStr = m.map(item => `${item.potency} (${item.dose})`).join(", ");
        next[selectedFollowUpIndex] = {
          ...next[selectedFollowUpIndex],
          medicines: m,
          remedy: remedyStr || "None",
          potency: potencyStr || "-"
        };
        return next;
      });
      setSelectedFollowUpIndex(null);
    }
  };

  const handleSelectSuggestion = (remedy: string) => {
    setNewMedicine(prev => ({ ...prev, name: remedy }));
    setRemedySearch(remedy);
    setShowSuggestions(false);
  };

  const handleAddMedicine = () => {
    const medName = newMedicine.name.trim() || remedySearch.trim();
    if (!medName) {
      alert("Please select or type a remedy name.");
      return;
    }
    setTempMedicines(prev => [
      ...prev,
      {
        name: medName,
        potency: newMedicine.potency,
        dose: newMedicine.dose,
        type: newMedicine.type
      }
    ]);
    setNewMedicine(prev => ({
      ...prev,
      name: "",
    }));
    setRemedySearch("");
  };

  const filteredSuggestions = remedySearch.trim() === ""
    ? []
    : INBUILT_REMEDIES.filter(r =>
        r.toLowerCase().includes(remedySearch.toLowerCase())
      ).slice(0, 5);

  // Repertorization State
  const [remediesList, setRemediesList] = useState(["Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep"]);
  
  // Predefined library of symptoms/rubrics with scores
  const PREDEFINED_LIBRARY_RUBRICS = [
    { name: "Skin - Itching - warmth of bed, agg.", chapter: "Skin", source: "Kent", weight: 3, scores: { "Nux-v": 0, "Lyc": 2, "Ars": 1, "Puls": 3, "Sulph": 3, "Rhus-t": 2, "Calc": 1, "Sil": 0, "Nat-m": 1, "Ign": 0, "Sep": 2 } },
    { name: "Mind - Fear - dark, of", chapter: "Mind", source: "Kent", weight: 2, scores: { "Nux-v": 0, "Lyc": 2, "Ars": 3, "Puls": 2, "Sulph": 1, "Rhus-t": 0, "Calc": 3, "Sil": 2, "Nat-m": 1, "Ign": 1, "Sep": 0 } },
    { name: "Stomach - Desires - sweets", chapter: "Stomach", source: "Kent", weight: 2, scores: { "Nux-v": 0, "Lyc": 3, "Ars": 1, "Puls": 3, "Sulph": 3, "Rhus-t": 0, "Calc": 3, "Sil": 1, "Nat-m": 1, "Ign": 0, "Sep": 1 } },
    { name: "Stomach - Aversion - milk", chapter: "Stomach", source: "Kent", weight: 2, scores: { "Nux-v": 1, "Lyc": 1, "Ars": 0, "Puls": 2, "Sulph": 2, "Rhus-t": 0, "Calc": 3, "Sil": 1, "Nat-m": 2, "Ign": 1, "Sep": 1 } },
    { name: "Sleep - Sleeplessness - 3 AM after", chapter: "Sleep", source: "Kent", weight: 3, scores: { "Nux-v": 3, "Lyc": 1, "Ars": 2, "Puls": 0, "Sulph": 2, "Rhus-t": 1, "Calc": 1, "Sil": 0, "Nat-m": 1, "Ign": 1, "Sep": 0 } },
    { name: "Cough - dry - night", chapter: "Cough", source: "Kent", weight: 2, scores: { "Nux-v": 2, "Lyc": 1, "Ars": 3, "Puls": 3, "Sulph": 2, "Rhus-t": 2, "Calc": 1, "Sil": 1, "Nat-m": 1, "Ign": 2, "Sep": 1 } },
    { name: "Rectum - Constipation - urging ineffectual", chapter: "Rectum", source: "Kent", weight: 3, scores: { "Nux-v": 3, "Lyc": 2, "Ars": 0, "Puls": 0, "Sulph": 2, "Rhus-t": 0, "Calc": 1, "Sil": 2, "Nat-m": 2, "Ign": 1, "Sep": 1 } },
    { name: "Mind - Fastidious", chapter: "Mind", source: "Kent", weight: 2, scores: { "Nux-v": 2, "Lyc": 1, "Ars": 3, "Puls": 0, "Sulph": 1, "Rhus-t": 0, "Calc": 0, "Sil": 3, "Nat-m": 2, "Ign": 1, "Sep": 0 } }
  ];

  const [rubrics, setRubrics] = useState<any[]>([
    { name: "Stomach - Acidity - eating, post", chapter: "Stomach", source: "Kent", weight: 3, dateAdded: "07/06/2026", scores: { "Nux-v": 3, "Lyc": 2, "Ars": 3, "Puls": 1, "Sulph": 2, "Rhus-t": 1, "Calc": 1, "Sil": 0, "Nat-m": 0, "Ign": 1, "Sep": 0 } },
    { name: "Mind - Irritability - eating, after", chapter: "Mind", source: "Kent", weight: 2, dateAdded: "07/06/2026", scores: { "Nux-v": 2, "Lyc": 3, "Ars": 1, "Puls": 2, "Sulph": 2, "Rhus-t": 1, "Calc": 0, "Sil": 0, "Nat-m": 0, "Ign": 0, "Sep": 0 } },
    { name: "Generalities - Chilly - sensitive to cold", chapter: "Generalities", source: "Kent", weight: 3, dateAdded: "07/06/2026", scores: { "Nux-v": 3, "Lyc": 1, "Ars": 3, "Puls": 0, "Sulph": 1, "Rhus-t": 3, "Calc": 3, "Sil": 2, "Nat-m": 1, "Ign": 0, "Sep": 1 } },
    { name: "Mind - Anxiety - anticipation, with", chapter: "Mind", source: "Kent", weight: 2, dateAdded: "07/06/2026", scores: { "Nux-v": 2, "Lyc": 2, "Ars": 3, "Puls": 2, "Sulph": 1, "Rhus-t": 0, "Calc": 0, "Sil": 0, "Nat-m": 0, "Ign": 3, "Sep": 0 } },
    { name: "Stomach - Thirst - small quantities, for", chapter: "Stomach", source: "Kent", weight: 1, dateAdded: "07/06/2026", scores: { "Nux-v": 1, "Lyc": 0, "Ars": 3, "Puls": 0, "Sulph": 0, "Rhus-t": 0, "Calc": 1, "Sil": 0, "Nat-m": 0, "Ign": 0, "Sep": 0 } }
  ]);

  const [repertorySyncLogs, setRepertorySyncLogs] = useState<any[]>([
    {
      dateSynced: "07/06/2026",
      rubricsCount: 5,
      topRemedy: "Ars",
      topScore: 129,
      method: "Baseline Sync"
    }
  ]);

  const [repertoryToast, setRepertoryToast] = useState<string | null>(null);

  // Repertory Database Hydration & Search States
  const [dbKent, setDbKent] = useState<any[]>([]);
  const [dbBoericke, setDbBoericke] = useState<any[]>([]);
  const [dbJethwani, setDbJethwani] = useState<any[]>(JETHWANI_REPERTORY_DATA);
  const [isRepertoryLoaded, setIsRepertoryLoaded] = useState(false);
  const [isRepertoryLoading, setIsRepertoryLoading] = useState(false);
  const [sheetRepSource, setSheetRepSource] = useState<"kent" | "boericke" | "jethwani" | "custom">("kent");
  const [sheetRepSearch, setSheetRepSearch] = useState("");
  const [activeSelectedDbRubric, setActiveSelectedDbRubric] = useState<any | null>(null);

  // Helper to resolve remedy grades from database keys to target sheet remedies
  const resolveRemedyGrade = (remedies: Record<string, number> | undefined, target: string): number => {
    if (!remedies) return 0;
    
    // Direct match
    if (remedies[target] !== undefined) return remedies[target];
    
    const targetLower = target.toLowerCase();
    for (const [key, value] of Object.entries(remedies)) {
      const keyLower = key.toLowerCase();
      if (keyLower === targetLower) return value;
      
      // Common abbreviations mappings
      if (targetLower === "sulph" && (keyLower === "sulphur" || keyLower === "sul-ac" || keyLower === "sulph-ac")) return value;
      if (keyLower === "sulph" && (targetLower === "sulphur" || targetLower === "sul-ac" || targetLower === "sulph-ac")) return value;
      
      if (targetLower === "nux-v" && keyLower.startsWith("nux")) return value;
      if (keyLower === "nux-v" && targetLower.startsWith("nux")) return value;

      if (targetLower === "rhus-t" && keyLower.startsWith("rhus")) return value;
      if (keyLower === "rhus-t" && targetLower.startsWith("rhus")) return value;

      if (targetLower === "nat-m" && keyLower.startsWith("nat-m")) return value;
      if (keyLower === "nat-m" && targetLower.startsWith("nat-m")) return value;

      if (keyLower.startsWith(targetLower) || targetLower.startsWith(keyLower)) return value;
    }
    return 0;
  };



  // New rubric form state
  const [customRubricName, setCustomRubricName] = useState("");
  const [customRubricChapter, setCustomRubricChapter] = useState("Stomach");
  const [customRubricWeight, setCustomRubricWeight] = useState(2);
  const [customRubricDate, setCustomRubricDate] = useState(today);
  const [customScores, setCustomScores] = useState<{ [rem: string]: number }>({
    "Nux-v": 0, "Lyc": 0, "Ars": 0, "Puls": 0, "Sulph": 0, "Rhus-t": 0, "Calc": 0, "Sil": 0, "Nat-m": 0, "Ign": 0, "Sep": 0
  });

  const [customRepSearchRemedy, setCustomRepSearchRemedy] = useState("");
  
  const handleAddRemedyToCompare = (remedyName: string) => {
    const trimmed = remedyName.trim();
    if (!trimmed) return;
    
    // Add to remediesList immediately if not already present
    setRemediesList(prev => {
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed];
    });

    // Add to customScores state with grade 0
    setCustomScores(prev => {
      if (prev[trimmed] !== undefined) return prev;
      return { ...prev, [trimmed]: 0 };
    });
    
    setCustomRepSearchRemedy("");
  };

  // AI Repertory Lab state variables
  const [aiTransmitLoading, setAiTransmitLoading] = useState(false);
  const [aiTransmitStep, setAiTransmitStep] = useState(0);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // Import rubrics parameter on mount or once database is loaded
  useEffect(() => {
    const importRubricsParam = searchParams.get("importRubrics");
    if (!importRubricsParam) return;
    
    const parsed = importRubricsParam.split("|").map(item => {
      const [chapter, name, weightStr] = item.split(":");
      const weight = Number(weightStr || "1");
      
      // 1. Look up in PREDEFINED_LIBRARY_RUBRICS
      let match = PREDEFINED_LIBRARY_RUBRICS.find(r => r.name.toLowerCase() === name.toLowerCase());
      
      // 2. Look up in Jethwani Database (loaded from static JSON)
      if (!match && dbJethwani.length > 0) {
        const jethMatch = dbJethwani.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (jethMatch) {
          const scores: Record<string, number> = {};
          remediesList.forEach(rem => {
            scores[rem] = resolveRemedyGrade(jethMatch.remedies, rem);
          });
          match = {
            name: jethMatch.name,
            chapter: jethMatch.section,
            source: "Jethwani" as any,
            weight,
            scores: scores as any
          };
        }
      }
      
      // 3. Look up in Kent Database
      if (!match && dbKent.length > 0) {
        const kentMatch = dbKent.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (kentMatch) {
          const scores: Record<string, number> = {};
          remediesList.forEach(rem => {
            scores[rem] = resolveRemedyGrade(kentMatch.remedies, rem);
          });
          match = {
            name: kentMatch.name,
            chapter: kentMatch.chapter,
            source: "Kent" as any,
            weight,
            scores: scores as any
          };
        }
      }
      
      // 4. Look up in Boericke Database
      if (!match && dbBoericke.length > 0) {
        const boerickeMatch = dbBoericke.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (boerickeMatch) {
          const scores: Record<string, number> = {};
          remediesList.forEach(rem => {
            scores[rem] = resolveRemedyGrade(boerickeMatch.remedies, rem);
          });
          match = {
            name: boerickeMatch.name,
            chapter: boerickeMatch.chapter,
            source: "Boericke" as any,
            weight,
            scores: scores as any
          };
        }
      }
      
      // 5. Fallback as a custom rubric
      if (!match) {
        const mockScores: Record<string, number> = {};
        remediesList.forEach(rem => {
          mockScores[rem] = 2; // Default to 2
        });
        return {
          name,
          chapter: chapter || "Generalities",
          source: "Clinical",
          weight,
          dateAdded: today,
          scores: mockScores
        };
      }
      
      return {
        ...match,
        dateAdded: today,
        weight
      };
    });
    
    // Update rubrics state avoiding duplicates by name
    setRubrics(prev => {
      const filteredPrev = prev.filter(p => !parsed.some(n => n.name.toLowerCase() === p.name.toLowerCase()));
      return [...filteredPrev, ...parsed];
    });
    
    // Automatically switch to Repertorization tab
    setActiveTab("Repertorization");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isRepertoryLoaded, dbKent, dbBoericke]);

  // Treatment Planner State
  const initialCareLevelMapped = mapCareLevel(initialCareLevel);
  const initialDurationMonthsVal = getDurationMonths(initialDurationText || initialCareLevel);

  const [planner, setPlanner] = useState({
    careLevel: initialCareLevelMapped,
    billingCycle: (initialBillingCycle 
      ? (initialBillingCycle.toLowerCase() === "weekly" ? "weekly" : "monthly")
      : ((initialCareLevel.toLowerCase().includes("weekly") || initialDurationText.toLowerCase().includes("week")) ? "weekly" : "monthly")) as "weekly" | "monthly",
    durationValue: initialDurationValue !== null ? initialDurationValue : initialDurationMonthsVal,
    conditionsCount: initialConditionsCount !== null ? initialConditionsCount : (initialCareLevel.toLowerCase().includes("multisystem") ? 2 : 1),
    concessionType: (initialConcessionApplied 
      ? (initialConcessionApplied.toLowerCase().includes("senior") ? "senior" : initialConcessionApplied.toLowerCase().includes("socio") ? "compassionate" : initialConcessionApplied.toLowerCase().includes("override") ? "override" : "none")
      : ((parseInt(initialAge) >= 60) ? "senior" : "none")) as "none" | "senior" | "compassionate" | "override",
    overridePrice: initialPriceVal,
    received: initialReceived,
    medicineAddons: [] as { id: string; type: string; details: string; amount: number }[]
  });

  // Synchronize mock patient data if mockId is provided
  useEffect(() => {
    const mockId = searchParams.get("mockId") || searchParams.get("id");
    if (!mockId || mockId === "P-100234") return;

    let isMounted = true;
    const fetchMockPatient = async () => {
      try {
        const res = await fetch(`/api/mock-patient?id=${encodeURIComponent(mockId)}`);
        if (!res.ok) throw new Error("Mock patient not found");
        const data = await res.json();
        if (!isMounted) return;

        if (data.success && data.patient) {
          const p = data.patient;
          
          // Update Patient Info
          setPatient(prev => ({
            ...prev,
            id: p.id || prev.id,
            name: p.name || prev.name,
            age: String(p.age !== undefined && p.age !== null ? p.age : prev.age),
            gender: p.gender || prev.gender,
            phone: p.phone || prev.phone,
            email: p.email || prev.email,
            address: p.location || prev.address,
          }));

          // Update Case Taking
          setCaseTaking(prev => ({
            ...prev,
            mainComplaint: p.complaint || prev.mainComplaint,
            duration: p.durationText || prev.duration,
          }));

          // Update Planner
          const mappedCare = mapCareLevel(p.careLevel || "");
          const durMonths = getDurationMonths(p.durationText || p.careLevel || "");
          setPlanner(prev => ({
            ...prev,
            careLevel: mappedCare,
            billingCycle: p.billingCycle 
              ? (p.billingCycle.toLowerCase() === "weekly" ? "weekly" : "monthly")
              : ((p.careLevel?.toLowerCase().includes("weekly") || p.durationText?.toLowerCase().includes("week")) ? "weekly" : "monthly"),
            durationValue: p.durationValue !== undefined && p.durationValue !== null ? p.durationValue : durMonths,
            conditionsCount: p.conditionsCount !== undefined && p.conditionsCount !== null ? p.conditionsCount : (p.careLevel?.toLowerCase().includes("multisystem") ? 2 : 1),
            concessionType: p.concessionApplied 
              ? (p.concessionApplied.toLowerCase().includes("senior") ? "senior" : p.concessionApplied.toLowerCase().includes("socio") ? "compassionate" : p.concessionApplied.toLowerCase().includes("override") ? "override" : "none")
              : ((parseInt(p.age || "0") >= 60) ? "senior" : "none"),
            overridePrice: p.finalPrice !== undefined && p.finalPrice !== null ? p.finalPrice : prev.overridePrice,
            received: p.receivedAmount !== undefined && p.receivedAmount !== null ? p.receivedAmount : (p.finalPrice || prev.overridePrice),
          }));
        }
      } catch (err) {
        console.error("Failed to load mock patient data:", err);
      }
    };

    fetchMockPatient();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Attachments State
  const [attachments, setAttachments] = useState<any[]>([
    { date: today, category: "Clinical Photo", target: "Epigastric Bloating Snapshot", url: `https://drive.google.com/drive/folders/mock-folder-id` },
    { date: "05-06-2026", category: "Blood Test", target: "Complete Blood Count & Liver Panel", url: "https://drive.google.com/drive/folders/mock-folder-id" }
  ]);

  const [syncingAttachments, setSyncingAttachments] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualTitle, setManualTitle] = useState("");
  const [manualCategory, setManualCategory] = useState("Blood Test");
  const [manualUrl, setManualUrl] = useState("");
  const [importMode, setImportMode] = useState<"lab" | "demographics" | "manual">("lab");
  const [extractedDemographics, setExtractedDemographics] = useState<any | null>(null);
  const [expandedNotesIndex, setExpandedNotesIndex] = useState<number | null>(null);

  // Sync to database and sheet helper
  const handleSyncAttachments = async (currentAttachments: any[]) => {
    setSyncingAttachments(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/export-attachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          attachments: currentAttachments
        })
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage({ text: "Attachments successfully synced to Google Sheet & Firestore!", type: "success" });
      } else {
        setSyncMessage({ text: `Sync failed: ${data.message}`, type: "error" });
      }
    } catch (err: any) {
      setSyncMessage({ text: `Sync error: ${err.message || err}`, type: "error" });
    } finally {
      setSyncingAttachments(false);
    }
  };

  const handleAddManualAttachment = async () => {
    if (!manualTitle.trim()) {
      setUploadError("Please provide a title for the attachment.");
      return;
    }
    const newAtt = {
      date: today,
      category: manualCategory,
      target: manualTitle.trim(),
      url: manualUrl.trim() || "https://drive.google.com/drive/folders/mock-folder-id"
    };
    const updated = [...attachments, newAtt];
    setAttachments(updated);
    setManualTitle("");
    setManualUrl("");
    setUploadError(null);
    await handleSyncAttachments(updated);
  };

  const handleDeleteAttachment = async (indexToDelete: number) => {
    const updated = attachments.filter((_, idx) => idx !== indexToDelete);
    setAttachments(updated);
    await handleSyncAttachments(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadError(null);
    setExtractedDemographics(null);

    try {
      // Convert file to Base64
      const base64Str = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = err => reject(err);
      });

      // Choose API based on mode
      if (importMode === "lab") {
        const res = await fetch("/api/import-lab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: base64Str,
            mimeType: file.type,
            fileName: file.name
          })
        });
        const data = await res.json();
        if (data.success) {
          const newAtt = {
            date: today,
            category: "Lab Report",
            target: file.name.replace(/\.[^/.]+$/, ""),
            url: "https://drive.google.com/drive/folders/mock-folder-id",
            notes: data.text
          };
          const updated = [...attachments, newAtt];
          setAttachments(updated);
          await handleSyncAttachments(updated);
        } else {
          setUploadError(`Failed to process lab report: ${data.message}`);
        }
      } else {
        // Demographics extraction
        const res = await fetch("/api/import-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: base64Str,
            mimeType: file.type,
            fileName: file.name
          })
        });
        const data = await res.json();
        if (data.success && data.patient) {
          setExtractedDemographics(data.patient);
        } else {
          setUploadError(`Failed to extract demographics: ${data.message}`);
        }
      }
    } catch (err: any) {
      setUploadError(`Upload error: ${err.message || err}`);
    } finally {
      setUploadingFile(false);
      // Reset file input value
      e.target.value = "";
    }
  };

  const handleApplyDemographics = async () => {
    if (!extractedDemographics) return;
    
    // Update patient details
    setPatient(prev => ({
      ...prev,
      name: extractedDemographics.name || prev.name,
      age: extractedDemographics.age || prev.age,
      gender: extractedDemographics.gender || prev.gender,
      email: extractedDemographics.email || prev.email,
      phone: extractedDemographics.phone || prev.phone,
      address: `${extractedDemographics.city || ""}${extractedDemographics.city && extractedDemographics.state ? ", " : ""}${extractedDemographics.state || ""}` || prev.address
    }));

    // Update caseTaking details
    setCaseTaking(prev => ({
      ...prev,
      mainComplaint: extractedDemographics.complaint || prev.mainComplaint
    }));

    // Add to attachments log
    const newAtt = {
      date: today,
      category: "Case Intake",
      target: `Intake Extract - ${extractedDemographics.name || "Patient"}`,
      url: "https://drive.google.com/drive/folders/mock-folder-id",
      notes: `Extracted Complaint:\n${extractedDemographics.complaint || "None"}\n\nExtracted Rubrics:\n${extractedDemographics.rubrics || "None"}`
    };

    const updated = [...attachments, newAtt];
    setAttachments(updated);
    setExtractedDemographics(null);
    setUploadError(null);
    await handleSyncAttachments(updated);
  };

  // Config DB State
  const [configDb, setConfigDb] = useState({
    remedies: [
      "Nux Vomica", "Arsenicum Album", "Lycopodium Clavatum", "Pulsatilla Pratensis", 
      "Sulphur", "Rhus Toxicodendron", "Bryonia Alba", "Calcarea Carbonica", 
      "Silicea", "Natrum Muriaticum", "Ignatia Amara", "Sepia Officinalis"
    ],
    potencies: ["6C", "30C", "200C", "1M", "10M", "50M", "CM", "LM1", "LM2", "LM5", "LM10", "LM30"],
    miasms: ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancerinic"],
    locations: ["Baner Clinic, Pune", "Koregaon Park Clinic, Pune", "Mumbai OPD"],
    doctors: ["Dr. Narayan Jethwani", "Dr. R. Jethwani"],
    packages: [
      { name: "Standard Consult", price: 300 },
      { name: "Acute Care Plan", price: 1500 },
      { name: "3-Month Chronic", price: 4500 },
      { name: "6-Month Advanced", price: 8500 },
      { name: "1-Year Premium", price: 15000 }
    ]
  });

  const [syncingConfig, setSyncingConfig] = useState(false);
  const [configSyncMessage, setConfigSyncMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [templateMessage, setTemplateMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    setTemplateMessage(null);
    try {
      const res = await fetch("/api/download-template");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to download template.");
      }
      
      const disposition = res.headers.get("content-disposition");
      let filename = "clinical_record_template.xlsx";
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const parts = disposition.split(";");
        for (let part of parts) {
          part = part.trim();
          if (part.startsWith("filename=")) {
            filename = part.substring("filename=".length).replace(/['"]/g, "");
          }
        }
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      const tempId = res.headers.get("x-template-id") || "";
      setTemplateMessage({
        text: `Template Excel downloaded! ID: ${tempId}. Upload this sheet to Google Drive, share it with narayan.jethwani@homeo.healthcare as writer, and set GOOGLE_TEMPLATE_SHEET_ID to this ID in Vercel to copy it on new case creations.`,
        type: "success"
      });
    } catch (err: any) {
      console.error(err);
      setTemplateMessage({
        text: `Download failed: ${err.message || err}`,
        type: "error"
      });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  // Input states for adding new config items
  const [newRemedyInput, setNewRemedyInput] = useState("");
  const [newPotencyInput, setNewPotencyInput] = useState("");
  const [newMiasmInput, setNewMiasmInput] = useState("");
  const [newLocationInput, setNewLocationInput] = useState("");
  const [newDoctorInput, setNewDoctorInput] = useState("");
  const [newPackageNameInput, setNewPackageNameInput] = useState("");
  const [newPackagePriceInput, setNewPackagePriceInput] = useState("");

  const handleSyncConfig = async (currentConfig: typeof configDb) => {
    setSyncingConfig(true);
    setConfigSyncMessage(null);
    try {
      const res = await fetch("/api/export-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          configDb: currentConfig
        })
      });
      const data = await res.json();
      if (data.success) {
        setConfigSyncMessage({ text: "Dropdown configurations successfully synced to Google Sheet & Firestore!", type: "success" });
      } else {
        setConfigSyncMessage({ text: `Sync failed: ${data.message}`, type: "error" });
      }
    } catch (err: any) {
      setConfigSyncMessage({ text: `Sync error: ${err.message || err}`, type: "error" });
    } finally {
      setSyncingConfig(false);
    }
  };

  // Hydrate classic repertory database asynchronously
  // Fetch directly from static JSON files in /data/ to avoid Vercel API response size limits
  useEffect(() => {
    const hydrateRepertory = async () => {
      setIsRepertoryLoading(true);
      try {
        // Fetch Kent, Boericke & Jethwani in parallel from static public/data/ files
        const [kentRes, boerickeRes, jethwaniRes] = await Promise.allSettled([
          fetch("/data/kentRepertoryData.json"),
          fetch("/data/boerickeRepertoryData.json"),
          fetch("/data/jethwaniRepertoryData.json")
        ]);

        let kentData: any[] = [];
        let boerickeData: any[] = [];
        let jethwaniData: any[] = [];

        if (kentRes.status === "fulfilled" && kentRes.value.ok) {
          kentData = await kentRes.value.json();
          console.log(`Loaded Kent repertory: ${kentData.length} rubrics`);
        } else {
          console.warn("Failed to load Kent data from static file, trying API fallback...");
        }

        if (boerickeRes.status === "fulfilled" && boerickeRes.value.ok) {
          boerickeData = await boerickeRes.value.json();
          console.log(`Loaded Boericke repertory: ${boerickeData.length} rubrics`);
        } else {
          console.warn("Failed to load Boericke data from static file, trying API fallback...");
        }

        if (jethwaniRes.status === "fulfilled" && jethwaniRes.value.ok) {
          jethwaniData = await jethwaniRes.value.json();
          console.log(`Loaded Jethwani repertory: ${jethwaniData.length} rubrics`);
        } else {
          console.warn("Failed to load Jethwani data from static file, using inline fallback.");
          jethwaniData = JETHWANI_REPERTORY_DATA;
        }

        // If Kent or Boericke failed, try API fallback
        if (kentData.length === 0 || boerickeData.length === 0) {
          try {
            const apiRes = await fetch("/api/repertory");
            const apiData = await apiRes.json();
            if (apiData.success) {
              if (kentData.length === 0) kentData = apiData.kent || [];
              if (boerickeData.length === 0) boerickeData = apiData.boericke || [];
            }
          } catch (apiErr) {
            console.warn("API fallback also failed:", apiErr);
          }
        }

        setDbKent(kentData);
        setDbBoericke(boerickeData);
        setDbJethwani(jethwaniData);
        setRepertoryData(kentData, boerickeData);
        setIsRepertoryLoaded(true);
      } catch (err) {
        console.error("Failed to load repertory database in mock sheet:", err);
      } finally {
        setIsRepertoryLoading(false);
      }
    };
    hydrateRepertory();
  }, []);

  // Hydrate patient attachments on mount/id change
  useEffect(() => {
    const fetchAttachments = async () => {
      if (!patient.id) return;
      try {
        const res = await fetch(`/api/export-attachments?patientId=${encodeURIComponent(patient.id)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.attachments)) {
          setAttachments(data.attachments);
        }
      } catch (err) {
        console.error("Failed to fetch attachments on mount:", err);
      }
    };
    fetchAttachments();
  }, [patient.id]);

  // Hydrate Config DB on mount/id change
  useEffect(() => {
    const fetchConfigDb = async () => {
      if (!patient.id) return;
      try {
        const res = await fetch(`/api/export-config?patientId=${encodeURIComponent(patient.id)}`);
        const data = await res.json();
        if (data.success && data.configDb) {
          setConfigDb(data.configDb);
        }
      } catch (err) {
        console.error("Failed to fetch Config DB on mount:", err);
      }
    };
    fetchConfigDb();
  }, [patient.id]);

  const handleAddConfigItem = async (type: "remedies" | "potencies" | "miasms" | "locations" | "doctors") => {
    let value = "";
    if (type === "remedies") { value = newRemedyInput.trim(); setNewRemedyInput(""); }
    else if (type === "potencies") { value = newPotencyInput.trim(); setNewPotencyInput(""); }
    else if (type === "miasms") { value = newMiasmInput.trim(); setNewMiasmInput(""); }
    else if (type === "locations") { value = newLocationInput.trim(); setNewLocationInput(""); }
    else if (type === "doctors") { value = newDoctorInput.trim(); setNewDoctorInput(""); }

    if (!value) return;

    setConfigDb(prev => {
      const updatedList = [...(prev[type] as string[])];
      if (!updatedList.includes(value)) {
        updatedList.push(value);
      }
      const updatedConfig = { ...prev, [type]: updatedList };
      handleSyncConfig(updatedConfig);
      return updatedConfig;
    });
  };

  const handleRemoveConfigItem = async (type: "remedies" | "potencies" | "miasms" | "locations" | "doctors", index: number) => {
    setConfigDb(prev => {
      const updatedList = (prev[type] as string[]).filter((_, i) => i !== index);
      const updatedConfig = { ...prev, [type]: updatedList };
      handleSyncConfig(updatedConfig);
      return updatedConfig;
    });
  };

  const handleAddPackageConfig = async () => {
    const name = newPackageNameInput.trim();
    const price = parseInt(newPackagePriceInput.trim());

    if (!name || isNaN(price)) return;
    setNewPackageNameInput("");
    setNewPackagePriceInput("");

    setConfigDb(prev => {
      const updatedPackages = [...prev.packages];
      if (!updatedPackages.some(p => p.name === name)) {
        updatedPackages.push({ name, price });
      }
      const updatedConfig = { ...prev, packages: updatedPackages };
      handleSyncConfig(updatedConfig);
      return updatedConfig;
    });
  };

  const handleRemovePackageConfig = async (index: number) => {
    setConfigDb(prev => {
      const updatedPackages = prev.packages.filter((_, i) => i !== index);
      const updatedConfig = { ...prev, packages: updatedPackages };
      handleSyncConfig(updatedConfig);
      return updatedConfig;
    });
  };

  // ----------------------------------------------------
  // CALCULATED FORMULAS (CROSS-TAB SYNC)
  // ----------------------------------------------------

  // 1. Calculate Miasm Scores based on keyword-tagging
  const calculateMiasmScores = () => {
    // Collect all text in caseTaking fields
    const textBlocks = [
      caseTaking.mainComplaint,
      caseTaking.modalBetter,
      caseTaking.modalWorse,
      caseTaking.concomitants,
      caseTaking.etiology,
      caseTaking.maintaining,
      caseTaking.fears,
      caseTaking.anxiety,
      caseTaking.anger,
      caseTaking.grief,
      caseTaking.depression,
      caseTaking.memory,
      caseTaking.concentration,
      caseTaking.traits,
      caseTaking.appetite,
      caseTaking.thirst,
      caseTaking.foodDesires,
      caseTaking.foodAversions,
      caseTaking.thermals,
      caseTaking.perspiration,
      caseTaking.sleep,
      caseTaking.dreams,
      caseTaking.familyPaternal,
      caseTaking.familyMaternal
    ];

    const combinedText = textBlocks.join(" ").toLowerCase();

    const counts = {
      Psora: (combinedText.match(/\[psora\]/g) || []).length,
      Sycosis: (combinedText.match(/\[sycosis\]/g) || []).length,
      Syphilis: (combinedText.match(/\[syphilis\]/g) || []).length,
      Tubercular: (combinedText.match(/\[tubercular\]/g) || []).length,
      Cancerinic: (combinedText.match(/\[cancerinic\]/g) || []).length
    };

    return counts;
  };

  const miasmScores = calculateMiasmScores();

  // 2. Repertory Matrix Calculations
  const calculateRepertoryScores = () => {
    const coverage: { [rem: string]: number } = {};
    const sumGrades: { [rem: string]: number } = {};
    const rankScores: { [rem: string]: number } = {};

    remediesList.forEach(rem => {
      let count = 0;
      let sum = 0;
      rubrics.forEach(rub => {
        const score = rub.scores[rem] || 0;
        if (score > 0) {
          count++;
          sum += score * rub.weight;
        }
      });
      coverage[rem] = rubrics.length > 0 ? count / rubrics.length : 0;
      sumGrades[rem] = sum;
      rankScores[rem] = (coverage[rem] * 100) + sum;
    });

    // Sort remedies by Rank Score descending
    const sortedRemedies = [...remediesList].sort((a, b) => rankScores[b] - rankScores[a]);

    return { coverage, sumGrades, rankScores, sortedRemedies };
  };

  const repertoryResults = calculateRepertoryScores();

  const handleSendRepertoryToPatient = () => {
    const topRem = repertoryResults.sortedRemedies[0];
    const topScr = Math.round(repertoryResults.rankScores[topRem] || 0);
    const newLog = {
      dateSynced: today,
      rubricsCount: rubrics.length,
      topRemedy: topRem,
      topScore: topScr,
      method: rubrics.length > 5 ? "Longitudinal Follow-up Sync" : "Intake Assessment Sync"
    };
    setRepertorySyncLogs(prev => [newLog, ...prev]);
    setRepertoryToast(`Successfully synced repertory details to ${patient.name}'s active case file!`);
    setTimeout(() => setRepertoryToast(null), 4000);
  };

  const getFilteredDbRubrics = () => {
    const q = sheetRepSearch.trim().toLowerCase();
    let srcList: any[] = [];
    if (sheetRepSource === "kent") {
      srcList = dbKent;
    } else if (sheetRepSource === "boericke") {
      srcList = dbBoericke;
    } else if (sheetRepSource === "jethwani") {
      srcList = dbJethwani;
    } else {
      return [];
    }

    if (!q) {
      return srcList.slice(0, 30);
    }

    const terms = q.split(/\s+/).filter(Boolean);
    return srcList.filter(rub => {
      const name = (rub.name || "").toLowerCase();
      const chapter = (rub.chapter || rub.section || "").toLowerCase();
      const textToSearch = `${chapter} ${name}`;
      return terms.every(term => textToSearch.includes(term));
    }).slice(0, 50);
  };

  const handleAddRubric = () => {
    if (sheetRepSource !== "custom") {
      if (!activeSelectedDbRubric) {
        alert("Please select a rubric from the search list first.");
        return;
      }
      const name = activeSelectedDbRubric.name;
      if (rubrics.some(r => r.name.toLowerCase() === name.toLowerCase())) {
        alert("This rubric is already in the matrix.");
        return;
      }
      
      const scores: Record<string, number> = {};
      remediesList.forEach(rem => {
        scores[rem] = resolveRemedyGrade(activeSelectedDbRubric.remedies, rem);
      });
      
      const newRub = {
        name,
        chapter: activeSelectedDbRubric.chapter || activeSelectedDbRubric.section || "Generalities",
        source: sheetRepSource === "kent" ? "Kent" : sheetRepSource === "boericke" ? "Boericke" : "Jethwani",
        weight: Number(customRubricWeight),
        dateAdded: customRubricDate,
        scores
      };
      
      setRubrics(prev => [...prev, newRub]);
      setActiveSelectedDbRubric(null);
      setSheetRepSearch("");
      
      setRepertoryToast(`Added: "${newRub.name}" to repertorization.`);
      setTimeout(() => setRepertoryToast(null), 3000);
    } else {
      const name = customRubricName.trim();
      if (!name) {
        alert("Please enter a rubric name.");
        return;
      }
      if (rubrics.some(r => r.name.toLowerCase() === name.toLowerCase())) {
        alert("This rubric is already in the matrix.");
        return;
      }

      // Add any custom remedy with grade > 0 that is not in remediesList to remediesList
      const newRemediesToCompare: string[] = [];
      Object.entries(customScores).forEach(([rem, score]) => {
        if (score > 0 && !remediesList.includes(rem)) {
          newRemediesToCompare.push(rem);
        }
      });
      
      if (newRemediesToCompare.length > 0) {
        setRemediesList(prev => [...prev, ...newRemediesToCompare]);
      }

      const newRub = {
        name,
        chapter: customRubricChapter,
        source: "Clinical" as any,
        weight: Number(customRubricWeight),
        dateAdded: customRubricDate,
        scores: customScores
      };
      setRubrics(prev => [...prev, newRub]);
      setCustomRubricName("");
      // Reset customScores to all active remedies in remediesList with grade 0
      const nextRemedies = Array.from(new Set([...remediesList, ...newRemediesToCompare]));
      const defaultScores: Record<string, number> = {};
      nextRemedies.forEach(rem => {
        defaultScores[rem] = 0;
      });
      setCustomScores(defaultScores);
      
      setRepertoryToast(`Added custom rubric: "${newRub.name}"`);
      setTimeout(() => setRepertoryToast(null), 3000);
    }
  };

  const handleAddAllLibraryRubrics = () => {
    setRubrics(prev => {
      const next = [...prev];
      PREDEFINED_LIBRARY_RUBRICS.forEach(libRub => {
        if (!next.some(r => r.name === libRub.name)) {
          next.push({
            ...libRub,
            dateAdded: today
          });
        }
      });
      return next;
    });
  };

  const handleTransmitToAiLab = async () => {
    setAiTransmitLoading(true);
    setAiTransmitStep(1);
    
    try {
      setAiTransmitStep(2);
      
      // Map our sheet rubrics format to the format expected by the API
      const apiRubrics = rubrics.map(r => ({
        name: r.name,
        chapter: r.chapter,
        grade: r.weight
      }));
      
      // Map sheet compare remedy results
      const apiRepertorizationResults = repertoryResults.sortedRemedies.map(rem => ({
        remedyName: rem,
        coverage: repertoryResults.coverage[rem] || 0,
        score: repertoryResults.sumGrades[rem] || 0
      }));
      
      const payload = {
        taskType: "synthesis",
        patientInfo: {
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          complaint: caseTaking.mainComplaint
        },
        rubrics: apiRubrics,
        repertorizationResults: apiRepertorizationResults
      };
      
      setAiTransmitStep(3);
      
      const res = await fetch("/api/ai-diagnostics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      setAiTransmitStep(4);
      const data = await res.json();
      
      if (data.success) {
        // Parse the analysis JSON string if it is returned as a string
        const parsed = typeof data.analysis === "string" ? JSON.parse(data.analysis) : data.analysis;
        
        // Extract keynotes, miasms, etc.
        const verdict = parsed?.clinical_reasoning_v2?.remedy_justification || `${repertoryResults.sortedRemedies[0]} matches patient's physical Generals and Miasmatic Totality best.`;
        
        let synthesis = "";
        if (parsed?.clinical_reasoning_v2?.constitutional_interpretation) {
          synthesis = `${parsed.clinical_reasoning_v2.constitutional_interpretation}`;
          if (parsed?.clinical_reasoning_v2?.miasmatic_analysis_summary) {
            synthesis += ` Miasmatic Totality: ${parsed.clinical_reasoning_v2.miasmatic_analysis_summary}`;
          }
          if (parsed?.clinical_reasoning_v2?.etiological_analysis) {
            synthesis += ` Etiology and Causa Occasionalis: ${parsed.clinical_reasoning_v2.etiological_analysis}`;
          }
        } else {
          synthesis = `The patient's case presents a clear picture matching ${repertoryResults.sortedRemedies[0]} (Rank: ${Math.round(repertoryResults.rankScores[repertoryResults.sortedRemedies[0]] || 0)} pts, Coverage: ${Math.round((repertoryResults.coverage[repertoryResults.sortedRemedies[0]] || 0) * 100)}%).`;
        }
        
        // Build cards from top_remedies
        const topRemedies = parsed?.top_remedies || [];
        let remedyCards: any[] = [];
        if (topRemedies.length > 0) {
          remedyCards = topRemedies.slice(0, 3).map((tr: any, idx: number) => ({
            name: tr.name,
            rank: idx + 1,
            score: tr.score || Math.round(repertoryResults.rankScores[tr.name] || 0),
            indications: tr.why_selected || tr.relationship_to_patient || "Indicated for constitutional totality.",
            keynotes: tr.brief_keynotes || tr.why_not_selected || "No specific keynotes provided."
          }));
        }
        
        // Resiliently fill up to 3 cards
        while (remedyCards.length < 3 && remedyCards.length < repertoryResults.sortedRemedies.length) {
          const nextRem = repertoryResults.sortedRemedies[remedyCards.length];
          remedyCards.push({
            name: nextRem,
            rank: remedyCards.length + 1,
            score: Math.round(repertoryResults.rankScores[nextRem] || 0),
            indications: "Repertorization match score indicates strong coverage.",
            keynotes: "Verify modalities, thermal response, and characteristic generals."
          });
        }
        
        // Update local caseTaking state with AI results
        const timeZoneKolkata = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        setCaseTaking(prev => ({
          ...prev,
          aiTimestamp: timeZoneKolkata,
          aiJustification: synthesis
        }));

        // Export/save the analysis to the patient record (both Google Sheets and Firestore)
        try {
          await fetch("/api/export-analysis", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              patientId: patient.id,
              aiReport: typeof data.analysis === "string" ? data.analysis : JSON.stringify(data.analysis)
            })
          });
        } catch (exportErr) {
          console.error("Failed to export AI analysis to Google Sheets:", exportErr);
        }

        setAiAnalysisResult({
          dateAnalyzed: today,
          verdict,
          synthesis,
          remedyCards
        });
      } else {
        throw new Error(data.message || "Failed to generate synthesis on backend.");
      }
      
    } catch (err: any) {
      console.error("AI transmit call failed, using graceful local fallback:", err);
      // GRACEFUL FALLBACK
      setAiTransmitStep(4);
      await new Promise(resolve => setTimeout(resolve, 800));

      const fallbackSynthesis = `The patient's case presents a clear chilly, irritable picture matching ${repertoryResults.sortedRemedies[0]} (Rank: ${Math.round(repertoryResults.rankScores[repertoryResults.sortedRemedies[0]] || 0)} pts, Coverage: ${Math.round((repertoryResults.coverage[repertoryResults.sortedRemedies[0]] || 0) * 100)}%). Miasmatic assessment indicates Psora as primary, which matches the deep-acting nature of ${repertoryResults.sortedRemedies[0]}. Longitudinally, the addition of rubrics over time shows a shift from gastrointestinal distress to nervous irritability, indicating the remedy should be titrated to Centesimal scale (30C to 200C).`;
      
      // Update local caseTaking state with AI fallback results
      const timeZoneKolkata = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      setCaseTaking(prev => ({
        ...prev,
        aiTimestamp: timeZoneKolkata,
        aiJustification: fallbackSynthesis
      }));

      // Export/save fallback report to Google Sheet / Firestore
      try {
        await fetch("/api/export-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            patientId: patient.id,
            aiReport: `CLINICAL VERDICT:\n${repertoryResults.sortedRemedies[0]} matches patient's physical Generals and Miasmatic Totality best.\n\nSYNTHESIS:\n${fallbackSynthesis}`
          })
        });
      } catch (exportErr) {
        console.error("Failed to export fallback AI analysis to Google Sheets:", exportErr);
      }

      setAiAnalysisResult({
        dateAnalyzed: today,
        verdict: `${repertoryResults.sortedRemedies[0]} matches patient's physical Generals and Miasmatic Totality best. (Local Fallback)`,
        synthesis: fallbackSynthesis,
        remedyCards: [
          {
            name: repertoryResults.sortedRemedies[0],
            rank: 1,
            score: Math.round(repertoryResults.rankScores[repertoryResults.sortedRemedies[0]] || 0),
            indications: "Chilly, highly irritable, fastidious, sensitive to light and drafts. Epigastric burning worse post eating. Wakes 3-4 AM.",
            keynotes: "Epigastric pressure like a stone, sour eructations, intense chilly, clean tongue, spasmodic complaints."
          },
          {
            name: repertoryResults.sortedRemedies[1] || "Ars",
            rank: 2,
            score: Math.round(repertoryResults.rankScores[repertoryResults.sortedRemedies[1] || "Ars"] || 0),
            indications: "Chilly, restless, severe anxiety, burning pains relieved by heat, thirst for small quantities frequently.",
            keynotes: "Restlessness, fear of disease and death, extreme weakness, midnight aggravation (1-2 AM), hot drinks ameliorate."
          },
          {
            name: repertoryResults.sortedRemedies[2] || "Lyc",
            rank: 3,
            score: Math.round(repertoryResults.rankScores[repertoryResults.sortedRemedies[2] || "Lyc"] || 0),
            indications: "Warm drinks desires, flatulence, bloating, right-sided complaints, lacks self-confidence, irritable in morning.",
            keynotes: "Epigastric flatulence, full soon after eating, desire for sweets, 4 PM to 8 PM aggravation, right-to-left progression."
          }
        ]
      });
    } finally {
      setTimeout(() => {
        setAiTransmitLoading(false);
      }, 500);
    }
  };

  // 3. Treatment planner calculations and prices
  const careLevelsDetails = {
    mild: { title: "Acute & Wellness Care", weeklyPrice: 1200, monthlyPrice: 4800 },
    moderate: { title: "Standard Chronic Care", weeklyPrice: 2400, monthlyPrice: 9600 },
    focused: { title: "Deep Systemic Care", weeklyPrice: 4200, monthlyPrice: 16800 },
    acute_critical: { title: "Acute Critical Care", weeklyPrice: 5000, monthlyPrice: 20000 },
    organ: { title: "Advanced Pathological Care", weeklyPrice: 6000, monthlyPrice: 24000 },
    comprehensive: { title: "Multisystem Integrative Care", weeklyPrice: 8400, monthlyPrice: 33600 },
  };

  const surchargesLookup = {
    mild: { unitWeekly: 300, unitMonthly: 1200 },
    moderate: { unitWeekly: 450, unitMonthly: 1800 },
    focused: { unitWeekly: 750, unitMonthly: 3000 },
    acute_critical: { unitWeekly: 1000, unitMonthly: 4000 },
    organ: { unitWeekly: 1050, unitMonthly: 4200 },
    comprehensive: { unitWeekly: 1350, unitMonthly: 5400 }
  };

  const calculatePricing = (
    level: keyof typeof careLevelsDetails,
    cycle: "weekly" | "monthly",
    duration: number,
    conditions: number
  ) => {
    const details = careLevelsDetails[level];
    const basePrice = cycle === "weekly" ? details.weeklyPrice : details.monthlyPrice;
    
    let surcharge = 0;
    if (conditions > 1) {
      const tierSurcharges = surchargesLookup[level];
      const unit = cycle === "weekly" ? tierSurcharges.unitWeekly : tierSurcharges.unitMonthly;
      surcharge = (conditions - 1) * unit;
    }

    const adjustedBasePrice = basePrice + surcharge;
    const rawTotal = adjustedBasePrice * duration;
    
    // Equivalent weeks
    const equivalentWeeks = cycle === "weekly" ? duration : duration * 4;
    
    let discountPercent = 0;
    if (equivalentWeeks >= 48) discountPercent = 30;
    else if (equivalentWeeks >= 24) discountPercent = 25;
    else if (equivalentWeeks >= 12) discountPercent = 20;
    else if (equivalentWeeks >= 8) discountPercent = 15;
    else if (equivalentWeeks >= 4) discountPercent = 10;
    else if (equivalentWeeks >= 2) discountPercent = 5;
    
    const discountAmount = Math.round((rawTotal * discountPercent) / 100);
    const finalPriceBeforeConcession = rawTotal - discountAmount;
    
    return {
      basePrice,
      surcharge,
      adjustedBasePrice,
      rawTotal,
      discountPercent,
      discountAmount,
      finalPriceBeforeConcession
    };
  };

  const getCalculatedPlannerPrices = () => {
    const basePricing = calculatePricing(
      planner.careLevel,
      planner.billingCycle,
      planner.durationValue,
      planner.conditionsCount
    );
    
    let concessionAmount = 0;
    if (planner.concessionType === "senior") {
      concessionAmount = Math.round(basePricing.finalPriceBeforeConcession * 0.15);
    } else if (planner.concessionType === "compassionate") {
      concessionAmount = Math.round(basePricing.finalPriceBeforeConcession * 0.30);
    } else if (planner.concessionType === "override") {
      concessionAmount = Math.max(0, basePricing.finalPriceBeforeConcession - planner.overridePrice);
    }
    
    const addonsSum = planner.medicineAddons.reduce((sum, item) => sum + item.amount, 0);
    
    const finalPrice = basePricing.finalPriceBeforeConcession - concessionAmount + addonsSum;
    const computedBalanceDue = finalPrice - planner.received;
    
    return {
      ...basePricing,
      concessionAmount,
      addonsSum,
      finalPrice,
      balanceDue: computedBalanceDue
    };
  };

  const plannerPrices = getCalculatedPlannerPrices();
  const balanceDue = plannerPrices.balanceDue;

  // Dynamic Transactions Ledger list
  const getTransactionsList = () => {
    const tx1Status = plannerPrices.balanceDue <= 0 ? "Paid" : (planner.received > 0 ? "Partially Paid" : "Unpaid");
    const initialTx = {
      date: today,
      description: `${careLevelsDetails[planner.careLevel].title} - Initial Package Setup`,
      refId: `Tx-Plan-${patient.id}`,
      charged: plannerPrices.finalPrice,
      received: planner.received,
      mode: "UPI",
      status: tx1Status
    };
    
    const followUpTx = [
      {
        date: "05-06-2026",
        description: "First Consultation Check-in",
        refId: "FU-01",
        charged: 0,
        received: 0,
        mode: "N/A",
        status: "Paid"
      }
    ];
    
    return [initialTx, ...followUpTx];
  };

  const currentTransactions = getTransactionsList();
  const totalBilled = currentTransactions.reduce((sum, tx) => sum + tx.charged, 0);
  const totalCollected = currentTransactions.reduce((sum, tx) => sum + tx.received, 0);
  const outstandingBalance = totalBilled - totalCollected;

  const generateWhatsAppMessage = () => {
    const careText = careLevelsDetails[planner.careLevel].title;
    const condText = planner.conditionsCount === 1 ? "1 condition" : `${planner.conditionsCount} conditions`;
    const durText = `${planner.durationValue} ${planner.billingCycle === "weekly" ? "weeks" : "months"}`;
    const concessionText = planner.concessionType === "senior" ? " [Senior 15%]" : planner.concessionType === "compassionate" ? " [Socio-Economic 30%]" : planner.concessionType === "override" ? " [Override]" : "";
    return `Dear ${patient.name}, thank you for consulting Homeo Healthcare. Your treatment package is: ${careText} (${condText}, ${durText}${concessionText}). Total Cost: ₹${plannerPrices.finalPrice.toLocaleString("en-IN")}. Balance Due: ₹${balanceDue.toLocaleString("en-IN")}. Please pay using Gpay: 8446056789. Clinic Branch: Homeo Healthcare.`;
  };
  const whatsappInvoiceText = generateWhatsAppMessage();

  // 4. Follow-up summary trends
  const lastVisit = followUps.length > 0 ? followUps[followUps.length - 1].date : "N/A";
  const progressPercent = followUps.length > 0 ? followUps[followUps.length - 1].improvement : "0%";

  // ----------------------------------------------------
  // CELL EDIT ACTION HANDLERS
  // ----------------------------------------------------
  const handleCellClick = (section: string, field: string, currentValue: string, rowIdx?: number) => {
    setEditingCell({ section, field, row: rowIdx });
    setEditValue(currentValue);
  };

  const handleSaveCell = () => {
    if (editingCell) {
      const { section, field, row } = editingCell;
      if (section === "patient") {
        setPatient(prev => ({ ...prev, [field!]: editValue }));
      } else if (section === "caseTaking") {
        setCaseTaking(prev => ({ ...prev, [field!]: editValue }));
      } else if (section === "planner") {
        const val = Number(editValue.replace(/[^0-9]/g, ""));
        setPlanner(prev => ({ ...prev, [field!]: isNaN(val) ? 0 : val }));
      } else if (section === "followUp" && typeof row === "number") {
        setFollowUps(prev => {
          const next = [...prev];
          next[row] = { ...next[row], [field!]: editValue };
          return next;
        });
      }
      setEditingCell(null);
    }
  };

  const handleAddFollowUp = () => {
    const nextDate = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    const baselineMed = {
      name: caseTaking.remedy || "Nux Vomica",
      potency: caseTaking.potency || "30C",
      dose: caseTaking.dose ? (caseTaking.dose.toLowerCase().includes("twice") || caseTaking.dose.toLowerCase().includes("bd") ? "BD" : caseTaking.dose.toLowerCase().includes("thrice") || caseTaking.dose.toLowerCase().includes("tds") ? "TDS" : "BD") : "BD",
      type: "Dilution"
    };
    const newFollowUp = {
      date: nextDate,
      symptoms: "Epigastric burning stable. Appetite healthy.",
      improvement: "50%",
      medicines: [baselineMed],
      remedy: baselineMed.name,
      potency: `${baselineMed.potency} (${baselineMed.dose})`,
      assessment: "Remedy acting favorably. Continue.",
      nextReview: "After 2 weeks"
    };
    setFollowUps(prev => [...prev, newFollowUp]);
  };

  const handleRemoveLastFollowUp = () => {
    if (followUps.length > 1) {
      setFollowUps(prev => prev.slice(0, -1));
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section as keyof typeof prev] }));
  };

  // ----------------------------------------------------
  // RENDER INTERACTION FUNCTIONS
  // ----------------------------------------------------
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(whatsappInvoiceText);
    alert("WhatsApp billing message copied to clipboard!");
  };

  // Helper to trigger cell editing inputs
  const renderEditableInput = (section: string, field: string, value: string, isTextArea = false) => {
    const isEditing = editingCell?.section === section && editingCell?.field === field;
    if (isEditing) {
      if (isTextArea) {
        return (
          <textarea
            className="w-full h-full p-2 border border-[#0F4C81] rounded-lg bg-white font-medium text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveCell}
            autoFocus
          />
        );
      }
      return (
        <input
          type="text"
          className="w-full h-full p-1 border border-[#0F4C81] rounded bg-white font-medium text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveCell}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveCell();
            if (e.key === "Escape") setEditingCell(null);
          }}
          autoFocus
        />
      );
    }

    return (
      <div 
        onDoubleClick={() => handleCellClick(section, field, value)}
        className="w-full h-full min-h-[18px] cursor-pointer hover:bg-slate-50 px-2 py-0.5 rounded transition-colors text-[11px]"
      >
        {value}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans select-none pb-12 text-[#1F2937]">
      {/* Top Banner Alert */}
      <div className="bg-[#0F4C81] text-white px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-md border-b border-[#0F4C81]/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
          <div className="text-xs sm:text-sm font-semibold tracking-wide">
            <span className="font-extrabold uppercase text-amber-300">Hybrid Sheet Sandbox Mode</span> — Redesigned Case Management System. Double-click cells to interactively edit case records and watch charts, miasms, and formulas recalculate in real-time.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/dashboard?tab=cie&patientId=${encodeURIComponent(patient.id)}`}
            className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all border border-white/25 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Google Sheets-like Toolbar Mockup */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-[#0F4C81] shadow-sm border border-teal-100/50">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              {patient.name} - Case File redone
              <span className="text-[10px] bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                10/10 clinical system
              </span>
            </h1>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold mt-1">
              <span className="hover:text-slate-650 cursor-pointer font-bold text-[#0F4C81]">File</span>
              <span className="hover:text-slate-650 cursor-pointer">Edit</span>
              <span className="hover:text-slate-650 cursor-pointer">View</span>
              <span className="hover:text-slate-650 cursor-pointer">Insert</span>
              <span className="hover:text-slate-650 cursor-pointer">Format</span>
              <span className="hover:text-slate-650 cursor-pointer">Data</span>
              <span className="hover:text-slate-650 cursor-pointer">Tools</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#0F4C81] flex items-center gap-1.5 font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Formulas Live
              </span>
              {sheetUrl && (sheetUrl.startsWith("https://docs.google.com") || sheetUrl.startsWith("https://sheets.google.com") || sheetUrl.startsWith("https://drive.google.com")) && (
                <>
                  <span className="text-slate-300">|</span>
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-950 flex items-center gap-1.5 font-bold cursor-pointer transition-all text-[11px]"
                    title="Open the actual Google Sheet for this patient in a new tab"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    Open Real Google Sheet
                  </a>
                </>
              )}
              <span className="text-slate-300">|</span>
              <button
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate}
                className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 font-bold cursor-pointer transition-all disabled:opacity-50 text-[11px]"
                title="Download the clinical record template as an Excel sheet to upload to Google Drive"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-650" />
                {downloadingTemplate ? "Generating Excel..." : "Download Excel Template"}
              </button>
            </div>
          </div>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {activeTab === "Follow-up Tracker" && (
            <>
              <button
                onClick={handleAddFollowUp}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Follow-up</span>
              </button>
              {followUps.length > 1 && (
                <button
                  onClick={handleRemoveLastFollowUp}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Last</span>
                </button>
              )}
            </>
          )}

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-bold bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-150">
            <Info className="w-4 h-4 text-[#0F4C81] shrink-0" />
            <span>Formulas recalculate as you type bracketed miasm keywords (e.g. [Psora]).</span>
          </div>
        </div>
      </div>

      {/* Template Download Alert/Instructions */}
      {templateMessage && (
        <div className={`mx-6 mt-4 p-5 rounded-3xl border ${
          templateMessage.type === "success" 
            ? "bg-emerald-50/90 text-emerald-950 border-emerald-200/60" 
            : "bg-rose-50/90 text-rose-950 border-rose-200/60"
        } text-xs font-semibold leading-relaxed flex items-start gap-3 shadow-md`}>
          <Info className={`w-5 h-5 shrink-0 mt-0.5 ${templateMessage.type === "success" ? "text-emerald-700" : "text-rose-700"}`} />
          <div className="flex-1">
            <p className="font-extrabold text-sm text-[#0F766E]">{templateMessage.type === "success" ? "✓ Action Required for Sheet Automation" : "✗ Error Occurred"}</p>
            <p className="mt-1.5 font-medium text-[12px] opacity-90">{templateMessage.text}</p>
            {templateMessage.type === "success" && (
              <div className="mt-4 bg-white/70 p-4 rounded-2xl border border-emerald-100 font-mono text-[11px] space-y-3.5 text-emerald-950 shadow-inner">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#0F4C81]">Step-by-Step Setup Guide:</p>
                <ol className="list-decimal list-inside space-y-2 font-medium leading-relaxed font-sans text-xs">
                  <li>
                    <strong>Upload to Google Drive:</strong> Open your Google Drive, go to the parent folder and upload the downloaded Excel sheet (<code>clinical_record_template.xlsx</code>).
                  </li>
                  <li>
                    <strong>Save as Google Sheets:</strong> Open the uploaded sheet in Google Drive, go to <code>File &gt; Save as Google Sheets</code>.
                  </li>
                  <li>
                    <strong>Get Spreadsheet ID:</strong> From the URL of the newly created Google Sheet, copy the Spreadsheet ID (the long string of characters in the address bar).
                  </li>
                  <li>
                    <strong>Configure Vercel:</strong> Paste the copied ID in your Vercel Environment Variables:
                    <code className="block mt-2 bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">GOOGLE_TEMPLATE_SHEET_ID="your_copied_id"</code>
                  </li>
                  <li>
                    <strong>Enjoy Live Updates:</strong> Redeploy the project on Vercel. Now, when a patient registers, the app will instantly clone this template sheet! You can change styling directly in Google Sheets without modifying any code!
                  </li>
                </ol>
              </div>
            )}
          </div>
          <button onClick={() => setTemplateMessage(null)} className="text-slate-400 hover:text-slate-650 cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid Wrapper */}
      <div className="flex-1 p-4 sm:p-8 flex flex-col items-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-6xl w-full overflow-hidden flex flex-col">
          
          {/* SCREEN CONTAINER */}
          <div className="relative group/scroll flex-grow w-full">
            <div className="overflow-auto w-full border-b border-slate-150 max-h-[70vh]">
            
            {/* ---------------------------------------------------- */}
            {/* TAB 1: DASHBOARD */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Dashboard" && (
              <div className="p-6 sm:p-8 space-y-8 bg-[#F8FAFC]">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black tracking-wide">HOMEO HEALTHCARE - PATIENT CLINICAL DASHBOARD</h2>
                    <p className="text-xs opacity-90 mt-1">Pune Baner Practice • Real-time Totality Engine</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-amber-300 animate-pulse hidden md:block" />
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Demographics Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-[#0F4C81] uppercase tracking-wider">Patient Demographics</h3>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                        {patient.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 text-[11px] font-medium">
                      <div className="text-slate-400">Patient ID:</div>
                      <div className="text-slate-800 font-bold">{patient.id}</div>
                      
                      <div className="text-slate-400">Full Name:</div>
                      <div className="text-slate-800 font-bold">{patient.name}</div>
                      
                      <div className="text-slate-400">Age / Gender:</div>
                      <div className="text-slate-800 font-bold">{patient.age} / {patient.gender}</div>
                      
                      <div className="text-slate-400">Blood Group:</div>
                      <div className="text-slate-800 font-bold">{patient.bloodGroup}</div>
                      
                      <div className="text-slate-400">Clinic Branch:</div>
                      <div className="text-[#0F4C81] font-bold">{patient.clinicBranch}</div>
                    </div>
                  </div>

                  {/* Active Diagnosis & Treatment Summary */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-[#0F4C81] uppercase tracking-wider">Active Treatment</h3>
                      <Activity className="w-4 h-4 text-[#0F4C81]" />
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 text-[11px] font-medium">
                      <div className="text-slate-400">Diagnosis:</div>
                      <div className="text-slate-800 font-bold truncate" title={caseTaking.primaryDiagnosis}>
                        {caseTaking.primaryDiagnosis}
                      </div>
                      
                      <div className="text-slate-400">Active Remedy:</div>
                      <div className="text-emerald-700 font-extrabold">{caseTaking.remedy} {caseTaking.potency}</div>
                      
                      <div className="text-slate-400">Last Visit:</div>
                      <div className="text-slate-800 font-bold">{lastVisit}</div>
                      
                      <div className="text-slate-400">Next Review:</div>
                      <div className="text-slate-800 font-bold text-amber-600">{caseTaking.nextFollowUp}</div>
                    </div>
                  </div>

                  {/* Financials & Clinical Scores */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-[#0F4C81] uppercase tracking-wider">Outcomes & Ledger</h3>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 text-[11px] font-medium">
                      <div className="text-slate-400">Progress Score:</div>
                      <div className="text-emerald-700 font-black text-xs">{progressPercent} Improvement</div>
                      
                      <div className="text-slate-400">Balance Due:</div>
                      <div className={`font-black text-xs ${balanceDue > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                        ₹{balanceDue.toLocaleString("en-IN")}
                      </div>
                      
                      <div className="text-slate-400">Top Totality Remedy:</div>
                      <div className="text-slate-800 font-extrabold text-xs">
                        {repertoryResults.sortedRemedies[0]} ({Math.round(repertoryResults.rankScores[repertoryResults.sortedRemedies[0]] || 0)} pts)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Miasmatic Profile Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm flex flex-col space-y-4">
                    <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-100 pb-3">
                      Miasmatic Profile (Calculated via Totality Tags)
                    </h3>
                    <div className="flex items-center justify-between">
                      {/* Interactive Radar Ring Visualization */}
                      <div className="w-[180px] h-[180px] flex items-center justify-center relative bg-slate-50 rounded-full border border-slate-100">
                        {/* Center Point */}
                        <div className="w-2 h-2 bg-[#0F4C81] rounded-full z-15"></div>
                        {/* Grid lines */}
                        <div className="absolute w-[140px] h-[140px] border border-dashed border-slate-200 rounded-full"></div>
                        <div className="absolute w-[90px] h-[90px] border border-dashed border-slate-200 rounded-full"></div>
                        <div className="absolute w-[40px] h-[40px] border border-dashed border-slate-200 rounded-full"></div>
                        
                        {/* SVG Polygon Overlay */}
                        <svg className="absolute w-full h-full top-0 left-0" viewBox="0 0 100 100">
                          {/* Compute radial points: Psora (top), Sycosis (top-right), Syphilis (bottom-right), Tubercular (bottom-left), Cancerinic (top-left) */}
                          {(() => {
                            const maxVal = Math.max(1, miasmScores.Psora, miasmScores.Sycosis, miasmScores.Syphilis, miasmScores.Tubercular, miasmScores.Cancerinic);
                            const scale = (val: number) => 8 + (val / maxVal) * 35; // map to radius from 0 to 45
                            
                            // Angles in rad: Psora: -pi/2, Sycosis: -pi/2 + 2pi/5, Syphilis: -pi/2 + 4pi/5, Tubercular: -pi/2 + 6pi/5, Cancerinic: -pi/2 + 8pi/5
                            const pts = [
                              { x: 50, y: 50 - scale(miasmScores.Psora) },
                              { x: 50 + scale(miasmScores.Sycosis) * Math.cos(-Math.PI/2 + (2*Math.PI)/5), y: 50 + scale(miasmScores.Sycosis) * Math.sin(-Math.PI/2 + (2*Math.PI)/5) },
                              { x: 50 + scale(miasmScores.Syphilis) * Math.cos(-Math.PI/2 + (4*Math.PI)/5), y: 50 + scale(miasmScores.Syphilis) * Math.sin(-Math.PI/2 + (4*Math.PI)/5) },
                              { x: 50 + scale(miasmScores.Tubercular) * Math.cos(-Math.PI/2 + (6*Math.PI)/5), y: 50 + scale(miasmScores.Tubercular) * Math.sin(-Math.PI/2 + (6*Math.PI)/5) },
                              { x: 50 + scale(miasmScores.Cancerinic) * Math.cos(-Math.PI/2 + (8*Math.PI)/5), y: 50 + scale(miasmScores.Cancerinic) * Math.sin(-Math.PI/2 + (8*Math.PI)/5) }
                            ];

                             
                            return (
                              <>
                                <polygon points={`${pts[0].x},${pts[0].y} ${pts[1].x},${pts[1].y} ${pts[2].x},${pts[2].y} ${pts[3].x},${pts[3].y} ${pts[4].x},${pts[4].y}`} fill="rgba(15, 76, 129, 0.2)" stroke="#0F4C81" strokeWidth="1.5" />
                                {pts.map((p, i) => (
                                  <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#0F4C81" />
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Score Metrics */}
                      <div className="flex-1 ml-6 space-y-2.5 text-[11px] font-bold">
                        <div className="flex justify-between items-center text-[#0F4C81]">
                          <span>Psora (Primary):</span>
                          <span className="bg-[#0F4C81]/10 px-2 py-0.5 rounded">{miasmScores.Psora} tags</span>
                        </div>
                        <div className="flex justify-between items-center text-[#2E8B57]">
                          <span>Sycosis (Secondary):</span>
                          <span className="bg-emerald-50 px-2 py-0.5 rounded">{miasmScores.Sycosis} tags</span>
                        </div>
                        <div className="flex justify-between items-center text-[#8B2E2E]">
                          <span>Syphilis:</span>
                          <span className="bg-rose-50 px-2 py-0.5 rounded">{miasmScores.Syphilis} tags</span>
                        </div>
                        <div className="flex justify-between items-center text-amber-600">
                          <span>Tubercular:</span>
                          <span className="bg-amber-50 px-2 py-0.5 rounded">{miasmScores.Tubercular} tags</span>
                        </div>
                        <div className="flex justify-between items-center text-indigo-600">
                          <span>Cancerinic:</span>
                          <span className="bg-indigo-50 px-2 py-0.5 rounded">{miasmScores.Cancerinic} tags</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outcome Progress Graph */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm flex flex-col space-y-4">
                    <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-100 pb-3">
                      Symptom Severity & Improvement Trend
                    </h3>
                    <div className="h-[180px] w-full bg-slate-50 rounded-2xl p-4 flex flex-col justify-between border border-slate-100 relative">
                      {/* Grid Lines */}
                      <div className="absolute inset-x-0 top-[20%] border-t border-slate-200/50"></div>
                      <div className="absolute inset-x-0 top-[50%] border-t border-slate-200/50"></div>
                      <div className="absolute inset-x-0 top-[80%] border-t border-slate-200/50"></div>
                      
                      {/* SVG Line Graph */}
                      <svg className="absolute w-[85%] h-[70%] top-[15%] left-[7.5%] overflow-visible" viewBox="0 0 100 50">
                        {/* Draw Area path under line */}
                        <path d="M 10 40 L 50 20 L 90 10 L 90 50 L 10 50 Z" fill="rgba(46, 139, 87, 0.08)" />
                        {/* Draw Line path */}
                        <path d="M 10 40 L 50 20 L 90 10" fill="none" stroke="#2E8B57" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Points */}
                        <circle cx="10" cy="40" r="3" fill="#2E8B57" />
                        <circle cx="50" cy="20" r="3" fill="#2E8B57" />
                        <circle cx="90" cy="10" r="3" fill="#2E8B57" />
                        
                        {/* Labels */}
                        <text x="10" y="46" fontSize="4" textAnchor="middle" fontWeight="bold" fill="#64748B">Visit 1 (0%)</text>
                        <text x="50" y="26" fontSize="4" textAnchor="middle" fontWeight="bold" fill="#64748B">Visit 2 (40%)</text>
                        <text x="90" y="16" fontSize="4" textAnchor="middle" fontWeight="bold" fill="#64748B">Visit 3 (50%)</text>
                      </svg>
                      
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase mt-auto">
                        <span>Baseline (Severity: 8/10)</span>
                        <span>Clinical Cure Target</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Longitudinal Repertory History & Timeline */}
                <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-100 pb-3">
                    Longitudinal Repertory Sync Logs (Clinical Study Log)
                  </h3>
                  
                  {repertorySyncLogs.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                      No repertory sync logs found. Go to the Repertorization tab to link details.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {repertorySyncLogs.map((log, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#0F4C81]/30 transition-colors shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-150">
                          <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                              <span className="text-[10px] bg-[#0F4C81]/15 text-[#0F4C81] font-bold px-2 py-0.5 rounded-full uppercase">
                                {log.method}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">{log.dateSynced}</span>
                            </div>
                            
                            <div className="space-y-1.5 text-[11px] font-medium text-slate-600">
                              <div className="flex justify-between">
                                <span>Rubrics Analyzed:</span>
                                <strong className="text-slate-800">{log.rubricsCount} rubrics</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Primary Indicated Remedy:</span>
                                <strong className="text-slate-800">{log.topRemedy}</strong>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/50">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Totality Grade</span>
                            <span className="text-xs font-black text-emerald-700">{log.topScore} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 2: CASE TAKING (MAIN WORK SHEET) */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Case Taking" && (
              <div className="bg-white min-w-[1050px]">
                <table className="border-collapse table-fixed w-full">
                  <thead>
                    <tr className="bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-b border-slate-200 h-7">
                      <th className="w-10 border-r border-slate-200 bg-slate-100"></th>
                      <th className="w-[280px] border-r border-slate-200">A (Clinical Section / Field)</th>
                      <th className="w-[770px]">B (Case Details & Totality Notes)</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {/* SECTION 1: PATIENT DETAILS */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">1</td>
                      <td colSpan={2} onClick={() => toggleSection("details")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.details ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 1 – PATIENT DETAILS
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Double-click fields to update</span>
                      </td>
                    </tr>
                    
                    {expandedSections.details && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">2</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Patient ID</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("patient", "id", patient.id)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">3</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Full Patient Name</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("patient", "name", patient.name)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">4</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Age / Gender</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("patient", "age", patient.age)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">5</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Contact Phone</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("patient", "phone", patient.phone)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">6</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Email Address</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("patient", "email", patient.email)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">7</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Address / Location</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("patient", "address", patient.address)}</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 2: CHIEF COMPLAINT */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">8</td>
                      <td colSpan={2} onClick={() => toggleSection("complaints")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.complaints ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 2 – CHIEF COMPLAINT ANALYSIS
                        </span>
                      </td>
                    </tr>

                    {expandedSections.complaints && (
                      <>
                        <tr className="h-14 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">9</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50 align-top pt-2">Primary Case Complaint</td>
                          <td className="p-2 text-[11px] font-medium">{renderEditableInput("caseTaking", "mainComplaint", caseTaking.mainComplaint, true)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">10</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Duration</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "duration", caseTaking.duration)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">11</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Onset (Sudden / Gradual)</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "onset", caseTaking.onset)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">12</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Complaint Severity (1-10)</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "severity", caseTaking.severity)}</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 3: PRESENTING SYMPTOMS (TOTALITY) */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">13</td>
                      <td colSpan={2} onClick={() => toggleSection("symptoms")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.symptoms ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 3 – PRESENTING SYMPTOMS (REPERTORY TOTALITY)
                        </span>
                      </td>
                    </tr>

                    {expandedSections.symptoms && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">14</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Location / Extension</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "location", caseTaking.location)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">15</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Sensation / Pain Character</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "sensation", caseTaking.sensation)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">16</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50 text-[#2E8B57]">Modalities Better (Amelioration)</td>
                          <td className="px-4 text-[11px] font-medium text-emerald-800">{renderEditableInput("caseTaking", "modalBetter", caseTaking.modalBetter)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">17</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50 text-rose-700">Modalities Worse (Aggravation)</td>
                          <td className="px-4 text-[11px] font-medium text-rose-800">{renderEditableInput("caseTaking", "modalWorse", caseTaking.modalWorse)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">18</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Concomitants</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "concomitants", caseTaking.concomitants)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">19</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Etiology / Causes</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "etiology", caseTaking.etiology)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">20</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Maintaining Causes</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "maintaining", caseTaking.maintaining)}</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 4: MENTAL GENERALS */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">21</td>
                      <td colSpan={2} onClick={() => toggleSection("mentals")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.mentals ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 4 – MENTAL GENERALS
                        </span>
                      </td>
                    </tr>

                    {expandedSections.mentals && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">22</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Temperament</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "temperament", caseTaking.temperament)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">23</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Fears & Phobias</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "fears", caseTaking.fears)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">24</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Anxiety States</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "anxiety", caseTaking.anxiety)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">25</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Anger & Reactions</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "anger", caseTaking.anger)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">26</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Grief / Suppressions</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "grief", caseTaking.grief)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">27</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Personality Traits / Attributes</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "traits", caseTaking.traits)}</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 5: PHYSICAL GENERALS */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">28</td>
                      <td colSpan={2} onClick={() => toggleSection("physicals")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.physicals ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 5 – PHYSICAL GENERALS
                        </span>
                      </td>
                    </tr>

                    {expandedSections.physicals && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">29</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Appetite / Hunger</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "appetite", caseTaking.appetite)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">30</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Thirst Quality</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "thirst", caseTaking.thirst)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">31</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Food Desires</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "foodDesires", caseTaking.foodDesires)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">32</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Food Aversions</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "foodAversions", caseTaking.foodAversions)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">33</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50 text-[#0F4C81]">Thermal State (Chilly / Hot)</td>
                          <td className="px-4 text-[11px] font-medium text-blue-900">{renderEditableInput("caseTaking", "thermals", caseTaking.thermals)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">34</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Sleep Cycles & Dreams</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "sleep", caseTaking.sleep)}</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 9: DIAGNOSIS */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">35</td>
                      <td colSpan={2} onClick={() => toggleSection("diagnosis")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.diagnosis ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 9 – CLINICAL DIAGNOSIS
                        </span>
                      </td>
                    </tr>

                    {expandedSections.diagnosis && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">36</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Clinical Diagnosis</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "primaryDiagnosis", caseTaking.primaryDiagnosis)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">37</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Case Complexity</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "complexity", caseTaking.complexity)}</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 10: MIASMATIC ASSESSMENT */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">40</td>
                      <td colSpan={2} onClick={() => toggleSection("miasm")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.miasm ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 10 – MIASMATIC ASSESSMENT (FORMULA DRIVEN)
                        </span>
                      </td>
                    </tr>

                    {expandedSections.miasm && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">41</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Psora Miasm Score</td>
                          <td className="px-4 text-[11px] font-bold text-[#0F4C81] bg-slate-50/20">{miasmScores.Psora} (Calculated from [Psora] tags)</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">42</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Sycosis Miasm Score</td>
                          <td className="px-4 text-[11px] font-bold text-emerald-800 bg-slate-50/20">{miasmScores.Sycosis} (Calculated from [Sycosis] tags)</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">43</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Syphilis Miasm Score</td>
                          <td className="px-4 text-[11px] font-bold text-rose-800 bg-slate-50/20">{miasmScores.Syphilis} (Calculated from [Syphilis] tags)</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">44</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Tubercular Miasm Score</td>
                          <td className="px-4 text-[11px] font-bold text-amber-800 bg-slate-50/20">{miasmScores.Tubercular} (Calculated from [Tubercular] tags)</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">45</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Cancerinic Miasm Score</td>
                          <td className="px-4 text-[11px] font-bold text-indigo-800 bg-slate-50/20">{miasmScores.Cancerinic} (Calculated from [Cancerinic] tags)</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 12: PRESCRIPTION */}
                    <tr className="h-10 border-b border-slate-200 bg-[#E2FBF7]/50">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">46</td>
                      <td colSpan={2} onClick={() => toggleSection("prescription")} className="px-4 font-black text-[#0F4C81] text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.prescription ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          SECTION 12 – CURRENT PRESCRIPTION & ADVICE
                        </span>
                      </td>
                    </tr>

                    {expandedSections.prescription && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">47</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Remedy Name</td>
                          <td className="px-4 text-[11px] font-bold text-emerald-800">{renderEditableInput("caseTaking", "remedy", caseTaking.remedy)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">48</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Potency / Scale</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "potency", caseTaking.potency)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">49</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Dosage & Frequency</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "dose", caseTaking.dose)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">50</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Duration</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "rxDuration", caseTaking.rxDuration)}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">51</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Dietary & lifestyle advice</td>
                          <td className="px-4 text-[11px] font-medium">{renderEditableInput("caseTaking", "advice", caseTaking.advice)}</td>
                        </tr>
                      </>
                    )}

                    {/* SECTION 13: AI CLINICAL SYNTHESIS VERDICT */}
                    <tr className="h-10 border-b border-slate-200 bg-pink-50/30">
                      <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">52</td>
                      <td colSpan={2} onClick={() => toggleSection("aiVerdict")} className="px-4 font-black text-pink-700 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-between h-10 select-none">
                        <span className="flex items-center gap-2">
                          {expandedSections.aiVerdict ? <ChevronDown className="w-4 h-4 text-pink-600" /> : <ChevronRight className="w-4 h-4 text-pink-600" />}
                          <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
                          SECTION 13 – AI CLINICAL SYNTHESIS VERDICT
                        </span>
                      </td>
                    </tr>

                    {expandedSections.aiVerdict && (
                      <>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">53</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">AI Analysis Engine</td>
                          <td className="px-4 text-[11px] font-bold text-slate-700 bg-pink-50/5">{caseTaking.aiEngine || "Gemini 3.5 Clinical Synthesis"}</td>
                        </tr>
                        <tr className="h-9 border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">54</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50">Analysis Timestamp</td>
                          <td className="px-4 text-[11px] font-medium text-slate-600 bg-pink-50/5">{caseTaking.aiTimestamp || <span className="text-slate-400 italic">No AI Analysis Run yet. Transmit from AI Lab to generate.</span>}</td>
                        </tr>
                        <tr className="h-auto min-h-[60px] border-b border-slate-100">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold py-2">55</td>
                          <td className="px-4 font-bold border-r border-slate-150 text-[11px] bg-slate-50/50 py-2">AI Constitutional Justification</td>
                          <td className="px-4 py-2 text-[11px] font-medium text-slate-805 bg-pink-50/5 whitespace-pre-wrap leading-relaxed">
                            {caseTaking.aiJustification || <span className="text-slate-400 italic">No AI Analysis Run yet. Go to "AI Repertory Lab" tab and click "Transmit Data to AI Lab".</span>}
                          </td>
                        </tr>
                      </>
                    )}

                  </tbody>
                </table>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 3: FOLLOW-UP TRACKER */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Follow-up Tracker" && (
              <div className="bg-white min-w-[1050px]">
                <table className="border-collapse table-fixed w-full">
                  <thead>
                    <tr className="bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-b border-slate-200 h-8">
                      <th className="w-10 border-r border-slate-200 bg-slate-100"></th>
                      <th className="w-[110px] border-r border-slate-200">Date</th>
                      <th className="w-[300px] border-r border-slate-200">Symptoms & Patient Report (Db-Click)</th>
                      <th className="w-[90px] border-r border-slate-200">Improvement %</th>
                      <th className="w-[200px] border-r border-slate-200">Remedy (Click to edit)</th>
                      <th className="w-[120px] border-r border-slate-200">Potency / Dose</th>
                      <th className="w-[180px] border-r border-slate-200">Assessment / Notes (Db-Click)</th>
                      <th className="w-[100px]">Next Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followUps.map((visit, idx) => {
                      const isEditingSymptoms = editingCell?.section === "followUp" && editingCell?.row === idx && editingCell?.field === "symptoms";
                      const isEditingImprovement = editingCell?.section === "followUp" && editingCell?.row === idx && editingCell?.field === "improvement";
                      const isEditingAssessment = editingCell?.section === "followUp" && editingCell?.row === idx && editingCell?.field === "assessment";
                      const isEditingNextReview = editingCell?.section === "followUp" && editingCell?.row === idx && editingCell?.field === "nextReview";
                      
                      return (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-[#F8FAFC]/50 min-h-12 align-top">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold py-3">{idx + 1}</td>
                          <td className="px-3 py-3 text-[11px] font-bold text-[#0F4C81]">{visit.date}</td>
                          
                          {/* Symptoms */}
                          <td className="px-3 py-2.5 text-[11px] font-medium border-r border-slate-200">
                            {isEditingSymptoms ? (
                              <textarea
                                className="w-full p-1 border border-[#0F4C81] rounded bg-white font-medium text-slate-800 text-[11px] focus:outline-none"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveCell}
                                autoFocus
                              />
                            ) : (
                              <div
                                onDoubleClick={() => handleCellClick("followUp", "symptoms", visit.symptoms, idx)}
                                className="w-full cursor-pointer hover:bg-slate-50 py-1 px-1 rounded transition-colors whitespace-pre-wrap leading-relaxed"
                                title="Double-click to edit symptoms"
                              >
                                {visit.symptoms}
                              </div>
                            )}
                          </td>
                          
                          {/* Improvement */}
                          <td className="px-3 py-3 text-[11px] font-black text-emerald-700 bg-emerald-50/10 border-r border-slate-200 text-center">
                            {isEditingImprovement ? (
                              <input
                                type="text"
                                className="w-full p-1 border border-[#0F4C81] rounded bg-white font-black text-emerald-700 text-[11px] text-center focus:outline-none"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveCell}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveCell();
                                  if (e.key === "Escape") setEditingCell(null);
                                }}
                                autoFocus
                              />
                            ) : (
                              <div
                                onDoubleClick={() => handleCellClick("followUp", "improvement", visit.improvement, idx)}
                                className="w-full cursor-pointer hover:bg-emerald-100/30 py-1 rounded transition-colors"
                                title="Double-click to edit improvement %"
                              >
                                {visit.improvement}
                              </div>
                            )}
                          </td>
                          
                          {/* Remedy */}
                          <td
                            className="px-3 py-2.5 text-[11px] border-r border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => handleOpenPrescriptionModal(idx)}
                            title="Click to open Prescription Manager"
                          >
                            <div className="space-y-1.5">
                              {visit.medicines && visit.medicines.length > 0 ? (
                                visit.medicines.map((med: any, mIdx: number) => (
                                  <div key={mIdx} className="flex flex-wrap items-center gap-1">
                                    <span className="font-bold text-slate-800">{med.name}</span>
                                    <span className="text-[8px] font-bold bg-[#0F4C81]/5 text-[#0F4C81] px-1 py-0.2 rounded border border-[#0F4C81]/10 uppercase tracking-wide">
                                      {med.type === "Liquid Mother Tincture" ? "Q" : med.type === "Bio-Combination" ? "BC" : med.type === "Biochemic Tablet" ? "Biochem" : med.type === "Globules" ? "Glob" : "Dil"}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-400 italic">No remedy - click to add</span>
                              )}
                            </div>
                          </td>
                          
                          {/* Potency / Dose */}
                          <td
                            className="px-3 py-2.5 text-[11px] border-r border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => handleOpenPrescriptionModal(idx)}
                            title="Click to open Prescription Manager"
                          >
                            <div className="space-y-1.5">
                              {visit.medicines && visit.medicines.length > 0 ? (
                                visit.medicines.map((med: any, mIdx: number) => (
                                  <div key={mIdx} className="flex items-center gap-1.5 h-[17px]">
                                    <span className="font-semibold text-slate-700">{med.potency}</span>
                                    <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100 uppercase">
                                      {med.dose}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-400 italic">-</span>
                              )}
                            </div>
                          </td>
                          
                          {/* Assessment */}
                          <td className="px-3 py-2.5 text-[11px] font-medium border-r border-slate-200">
                            {isEditingAssessment ? (
                              <textarea
                                className="w-full p-1 border border-[#0F4C81] rounded bg-white font-medium text-slate-800 text-[11px] focus:outline-none"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveCell}
                                autoFocus
                              />
                            ) : (
                              <div
                                onDoubleClick={() => handleCellClick("followUp", "assessment", visit.assessment, idx)}
                                className="w-full cursor-pointer hover:bg-slate-50 py-1 px-1 rounded transition-colors whitespace-pre-wrap leading-relaxed"
                                title="Double-click to edit assessment/notes"
                              >
                                {visit.assessment}
                              </div>
                            )}
                          </td>
                          
                          {/* Next Review */}
                          <td className="px-3 py-3 text-[11px] font-bold text-amber-600">
                            {isEditingNextReview ? (
                              <input
                                type="text"
                                className="w-full p-1 border border-[#0F4C81] rounded bg-white font-bold text-amber-600 text-[11px] focus:outline-none"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveCell}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveCell();
                                  if (e.key === "Escape") setEditingCell(null);
                                }}
                                autoFocus
                              />
                            ) : (
                              <div
                                onDoubleClick={() => handleCellClick("followUp", "nextReview", visit.nextReview, idx)}
                                className="w-full cursor-pointer hover:bg-slate-50 py-1 rounded transition-colors"
                                title="Double-click to edit next follow-up"
                              >
                                {visit.nextReview}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 4: REPERTORIZATION */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Repertorization" && (
              <div className="bg-white min-w-[1050px] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                  <h2 className="text-sm font-black text-[#0F4C81] uppercase tracking-wider">Clinical Repertorization Matrix</h2>
                  <div className="text-xs bg-slate-100 text-[#0F4C81] px-4 py-1.5 rounded-full font-bold border border-slate-200/50">
                    Auto-ranking 11 compare remedies
                  </div>
                </div>

                {/* Sync & Transmit Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleSendRepertoryToPatient}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Send to Patient Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("AI Repertory Lab");
                        // Automatically trigger analysis
                        setTimeout(() => handleTransmitToAiLab(), 100);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer animate-pulse"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Send to AI Repertory Lab</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddAllLibraryRubrics}
                      className="px-4 py-2 border border-[#0F4C81]/20 hover:bg-[#0F4C81]/5 text-[#0F4C81] rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Add All Library Rubrics
                    </button>
                  </div>
                </div>

                {/* Rubric Adding Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm">
                  
                  {/* Left Column: Database Search Engine */}
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-200 pb-2">
                      Search Classical & Clinical Repertories
                    </h3>
                    
                    {/* Database source tabs */}
                    <div className="flex bg-slate-200/50 p-1 rounded-xl">
                      {(["kent", "boericke", "jethwani", "custom"] as const).map(src => (
                        <button
                          key={src}
                          onClick={() => {
                            setSheetRepSource(src);
                            setActiveSelectedDbRubric(null);
                          }}
                          className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            sheetRepSource === src 
                              ? "bg-white text-[#0F4C81] shadow-sm" 
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {src === "kent" ? "Kent" : src === "boericke" ? "Boericke" : src === "jethwani" ? "Jethwani" : "Custom Form"}
                        </button>
                      ))}
                    </div>

                    {sheetRepSource !== "custom" && (
                      <div className="space-y-3">
                        {/* Search Input */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={`Search ${sheetRepSource === 'kent' ? "Kent's" : sheetRepSource === 'boericke' ? "Boericke's" : "Jethwani's"} repertory...`}
                            value={sheetRepSearch}
                            onChange={(e) => setSheetRepSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-250 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0F4C81] font-semibold text-slate-700 shadow-inner"
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          {isRepertoryLoading && (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#0F4C81]/35 border-t-[#0F4C81] animate-spin absolute right-3 top-3" />
                          )}
                        </div>

                        {/* Search Results list */}
                        <div className="h-[260px] overflow-y-auto border border-slate-200 bg-white rounded-2xl p-2 divide-y divide-slate-100 shadow-inner">
                          {getFilteredDbRubrics().length > 0 ? (
                            getFilteredDbRubrics().map((rub) => {
                              const isSelected = activeSelectedDbRubric?.name === rub.name;
                              const remCount = Object.keys(rub.remedies || {}).length;
                              return (
                                <button
                                  key={rub.id || rub.name}
                                  onClick={() => setActiveSelectedDbRubric(rub)}
                                  className={`w-full text-left p-2.5 text-[11px] hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 rounded-lg ${
                                    isSelected ? "bg-blue-50/50 border-l-3 border-[#0F4C81] pl-2 font-bold" : ""
                                  }`}
                                >
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-455 uppercase block tracking-wider mb-0.5">
                                      {rub.chapter || rub.section || "General"}
                                    </span>
                                    <span className="text-slate-700 leading-snug">{rub.name}</span>
                                  </div>
                                  <span className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
                                    {remCount} remedies
                                  </span>
                                </button>
                              );
                            })
                          ) : (
                            <div className="text-center text-slate-400 py-12 text-[11px] font-semibold">
                              {isRepertoryLoading 
                                ? "Loading repertory databases..." 
                                : "No symptom matches found. Try another term."}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {sheetRepSource === "custom" && (
                      <div className="space-y-4 pt-1">
                        {/* Custom Rubric Inputs */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Rubric Name</span>
                            <input
                              type="text"
                              placeholder="e.g. Head - Pain - pressing"
                              value={customRubricName}
                              onChange={(e) => setCustomRubricName(e.target.value)}
                              className="p-2 border border-slate-250 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0F4C81] font-semibold text-slate-700"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chapter</span>
                            <input
                              type="text"
                              list="custom-chapters-list"
                              placeholder="Type or select chapter..."
                              value={customRubricChapter}
                              onChange={(e) => setCustomRubricChapter(e.target.value)}
                              className="p-2 border border-slate-250 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
                            />
                            <datalist id="custom-chapters-list">
                              <option value="Mind" />
                              <option value="Vertigo" />
                              <option value="Head" />
                              <option value="Eye" />
                              <option value="Ear" />
                              <option value="Hearing" />
                              <option value="Nose" />
                              <option value="Face" />
                              <option value="Mouth" />
                              <option value="Teeth" />
                              <option value="Throat" />
                              <option value="External Throat" />
                              <option value="Stomach" />
                              <option value="Abdomen" />
                              <option value="Rectum" />
                              <option value="Stool" />
                              <option value="Bladder" />
                              <option value="Kidneys" />
                              <option value="Urethra" />
                              <option value="Urine" />
                              <option value="Male Genitalia" />
                              <option value="Female Genitalia" />
                              <option value="Larynx & Trachea" />
                              <option value="Respiration" />
                              <option value="Cough" />
                              <option value="Expectoration" />
                              <option value="Chest" />
                              <option value="Back" />
                              <option value="Extremities" />
                              <option value="Sleep" />
                              <option value="Chill" />
                              <option value="Fever" />
                              <option value="Perspiration" />
                              <option value="Skin" />
                              <option value="Generalities" />
                            </datalist>
                          </div>
                        </div>

                        {/* Search & Add New Remedy to sheet compare list */}
                        <div className="flex items-end gap-2 p-3 bg-slate-100/50 border border-slate-200 rounded-2xl relative">
                          <div className="flex-1 relative flex flex-col gap-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Add custom medicine column to compare:</span>
                            <input
                              type="text"
                              placeholder="Type medicine name (e.g. Acon, Thuja, BC-4)..."
                              value={customRepSearchRemedy}
                              onChange={(e) => setCustomRepSearchRemedy(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (customRepSearchRemedy.trim()) {
                                    handleAddRemedyToCompare(customRepSearchRemedy.trim());
                                  }
                                }
                              }}
                              className="p-1.5 border border-slate-250 bg-white rounded-lg text-[10px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
                            />
                            {customRepSearchRemedy.trim() !== "" && (
                              <div className="absolute left-0 bottom-full mb-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 divide-y divide-slate-100 max-h-36 overflow-y-auto">
                                {INBUILT_REMEDIES.filter(r => 
                                  r.toLowerCase().includes(customRepSearchRemedy.toLowerCase()) && 
                                  customScores[r] === undefined
                                ).slice(0, 5).map(sug => (
                                  <button
                                    key={sug}
                                    type="button"
                                    onClick={() => handleAddRemedyToCompare(sug)}
                                    className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors block cursor-pointer"
                                  >
                                    {sug}
                                  </button>
                                ))}
                                {INBUILT_REMEDIES.filter(r => 
                                  r.toLowerCase().includes(customRepSearchRemedy.toLowerCase()) && 
                                  customScores[r] === undefined
                                ).length === 0 && (
                                  <div className="px-3 py-1.5 text-[10px] text-slate-450 italic">
                                    Press "Add Medicine" to add as custom name
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (customRepSearchRemedy.trim()) {
                                handleAddRemedyToCompare(customRepSearchRemedy.trim());
                              }
                            }}
                            className="px-3 py-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                          >
                            Add Medicine
                          </button>
                        </div>

                        {/* Custom scores mapping (0-3 select boxes for each remedy) */}
                        <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2">
                          <span className="text-[9px] font-black text-[#0F4C81] uppercase tracking-wider block">Assign Remedy Grades (0 to 3) for Custom Rubric:</span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[150px] overflow-y-auto pr-1">
                            {Object.keys(customScores).map(rem => (
                              <div key={rem} className="flex items-center justify-between gap-1 bg-slate-50 border border-slate-150 p-1.5 rounded-xl shadow-xs">
                                <span className="text-[9px] font-black text-slate-700 select-none whitespace-nowrap shrink-0" title={rem}>{rem}</span>
                                <select
                                  value={customScores[rem] || 0}
                                  onChange={(e) => setCustomScores(prev => ({ ...prev, [rem]: Number(e.target.value) }))}
                                  className="p-0.5 border border-slate-255 bg-white rounded-md text-[9px] font-bold w-9 text-center focus:outline-none focus:ring-1 focus:ring-[#0F4C81] cursor-pointer shrink-0"
                                >
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Selected Rubric Details & Save Actions */}
                  <div className="border-t lg:border-t-0 lg:border-l border-slate-200 pt-5 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-200 pb-2">
                        Configure Selected Rubric Details
                      </h3>

                      {activeSelectedDbRubric || sheetRepSource === "custom" ? (
                        <div className="space-y-5 pt-3">
                          {/* Selected Rubric Card */}
                          {sheetRepSource !== "custom" && activeSelectedDbRubric && (
                            <div className="bg-[#0F4C81]/5 border border-[#0F4C81]/15 p-3.5 rounded-2xl space-y-2.5">
                              <div>
                                <span className="bg-[#0F4C81]/15 text-[#0F4C81] text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  {sheetRepSource.toUpperCase()} DB MATCH
                                </span>
                                <h4 className="font-bold text-[12px] text-slate-800 leading-snug mt-1.5">
                                  {activeSelectedDbRubric.name}
                                </h4>
                              </div>

                              <div className="text-[10px] text-slate-500">
                                <strong>Chapter/Section:</strong> {activeSelectedDbRubric.chapter || activeSelectedDbRubric.section || "Generalities"}
                              </div>

                              {/* Grade mapping preview */}
                              <div className="border-t border-slate-200/50 pt-2 space-y-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Matched Remedy Grades Preview:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {remediesList.map(rem => {
                                    const gr = resolveRemedyGrade(activeSelectedDbRubric.remedies, rem);
                                    if (gr === 0) return null;
                                    return (
                                      <span key={rem} className="bg-emerald-55 text-emerald-900 border border-emerald-100 text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                                        {rem} <span className="text-[#0F4C81] bg-white rounded px-0.5 text-[8px] font-black">{gr}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {sheetRepSource === "custom" && (
                            <div className="bg-pink-50/25 border border-pink-100/50 p-3.5 rounded-2xl space-y-2">
                              <span className="bg-pink-100 text-pink-700 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                CUSTOM CELL INJECTION
                              </span>
                              <h4 className="font-bold text-[12px] text-slate-800 leading-snug mt-1.5">
                                {customRubricName.trim() || "Untitled Custom Rubric"}
                              </h4>
                              <p className="text-[10px] text-slate-500 italic">
                                Grades will be injected manually based on your selection panel below.
                              </p>
                            </div>
                          )}

                          {/* Configuration selectors */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Rubric Weight (Clinical Severity)</span>
                              <select
                                value={customRubricWeight}
                                onChange={(e) => setCustomRubricWeight(Number(e.target.value))}
                                className="p-2.5 border border-slate-250 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F4C81] cursor-pointer shadow-sm"
                              >
                                <option value="1">1 (Mild / Local)</option>
                                <option value="2">2 (Moderate / General)</option>
                                <option value="3">3 (Severe / Peculiar Keynote)</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Date Added</span>
                              <input
                                type="text"
                                placeholder="DD/MM/YYYY"
                                value={customRubricDate}
                                onChange={(e) => setCustomRubricDate(e.target.value)}
                                className="p-2 border border-slate-250 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0F4C81] font-semibold text-slate-700 shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                          <Activity className="w-8 h-8 text-slate-300 stroke-1" />
                          <p className="text-[11px] font-semibold leading-relaxed max-w-[200px]">
                            Select a rubric from the database search list to configure parameters.
                          </p>
                        </div>
                      )}
                    </div>

                    {(activeSelectedDbRubric || (sheetRepSource === "custom" && customRubricName.trim() !== "")) && (
                      <div className="flex items-center justify-end gap-3 pt-6 mt-auto">
                        {sheetRepSource !== "custom" && (
                          <button
                            onClick={() => setActiveSelectedDbRubric(null)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Clear Selection
                          </button>
                        )}
                        <button
                          onClick={handleAddRubric}
                          className="px-6 py-2.5 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Rubric to Matrix</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm overflow-x-auto mt-6">
                  <table className="border-collapse w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] text-slate-600 font-black uppercase tracking-wider border-b border-slate-200">
                        <th className="p-3 w-10 text-center bg-slate-100 border-r border-slate-200 text-[#0F4C81]">Del</th>
                        <th className="p-3 border-r border-slate-200">Rubric Name</th>
                        <th className="p-3 border-r border-slate-200">Chapter / Location</th>
                        <th className="p-3 border-r border-slate-200 w-[90px]">Source</th>
                        <th className="p-3 border-r border-slate-200 w-[120px] text-center">Importance Weight</th>
                        {remediesList.map(rem => {
                          const isCustom = !["Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep"].includes(rem);
                          return (
                            <th 
                              key={rem} 
                              className={`p-3 border-r border-slate-200 text-center font-extrabold relative ${
                                isCustom ? "bg-amber-50/50 text-amber-800 border-b-2 border-amber-300/40" : "text-[#0F4C81]"
                              }`}
                              title={isCustom ? `${rem} (Dynamically Added Custom Remedy)` : rem}
                            >
                              {rem}
                              {isCustom && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                              )}
                            </th>
                          );
                        })}
                        <th className="p-3 border-r border-slate-200 text-center text-emerald-800 dark:text-emerald-300 w-[110px] bg-emerald-50/70 font-black">Totality Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rubrics.map((rub, rIdx) => {
                        const sumOfGrades = remediesList.reduce((acc, rem) => acc + (rub.scores[rem] || 0), 0);
                        const totalityScore = rub.weight * sumOfGrades;
                        return (
                          <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50 text-[11px]">
                            <td className="p-3 text-center bg-slate-50/50 border-r border-slate-200">
                              <button
                                onClick={() => setRubrics(prev => prev.filter((_, i) => i !== rIdx))}
                                className="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100"
                                title="Delete rubric"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                            <td className="p-3 border-r border-slate-200 font-bold">{rub.name}</td>
                            <td className="p-3 border-r border-slate-200 font-semibold text-slate-500">{rub.chapter}</td>
                            <td className="p-3 border-r border-slate-200 font-bold text-slate-650">{rub.source || "Kent"}</td>
                            <td className="p-3 border-r border-slate-200 text-center font-black text-[#0F4C81] bg-slate-50/50">{rub.weight}</td>
                            {remediesList.map(rem => {
                              const score = rub.scores[rem] || 0;
                              return (
                                <td key={rem} className={`p-3 border-r border-slate-200 text-center font-bold ${score > 0 ? "bg-[#ECFDF5] text-[#047857]" : "text-[#CBD5E1]"}`}>
                                  {score}
                                </td>
                              );
                            })}
                            <td className="p-3 border-r border-slate-200 text-center font-black text-emerald-800 bg-emerald-50/50">
                              {totalityScore}
                            </td>
                          </tr>
                        );
                      })}
                      
                      {/* Calculations rows */}
                      <tr className="border-b border-slate-200 bg-slate-100/30 font-bold text-[10px] uppercase text-slate-500">
                        <td colSpan={5} className="p-3 border-r border-slate-200 bg-slate-100/50">Symptom Coverage</td>
                        {remediesList.map(rem => (
                          <td key={rem} className="p-3 border-r border-slate-200 text-center text-[#0F4C81] bg-slate-100/20">
                            {(repertoryResults.coverage[rem] || 0).toFixed(1)}
                          </td>
                        ))}
                        <td className="p-3 border-r border-slate-200 text-center bg-slate-100/50"></td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-100/30 font-bold text-[10px] uppercase text-slate-500">
                        <td colSpan={5} className="p-3 border-r border-slate-200 bg-slate-100/50">Sum of Grades</td>
                        {remediesList.map(rem => (
                          <td key={rem} className="p-3 border-r border-slate-200 text-center text-slate-700 bg-slate-100/20">
                            {repertoryResults.sumGrades[rem] || 0}
                          </td>
                        ))}
                        <td className="p-3 border-r border-slate-200 text-center bg-slate-100/50"></td>
                      </tr>
                      <tr className="bg-emerald-50/35 font-black text-[11px] uppercase border-b-2 border-slate-300">
                        <td colSpan={5} className="p-3 border-r border-slate-200 text-emerald-800 bg-emerald-50/50">Totality Rank Score</td>
                        {remediesList.map(rem => (
                          <td key={rem} className="p-3 border-r border-slate-200 text-center text-emerald-700 bg-emerald-100/30 font-black">
                            {Math.round(repertoryResults.rankScores[rem] || 0)}
                          </td>
                        ))}
                        <td className="p-3 border-r border-slate-200 text-center bg-emerald-50/55"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Top Remedy Rankings display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {repertoryResults.sortedRemedies.slice(0, 3).map((rem, index) => (
                    <div key={rem} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-black text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">{rem}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">remedy totality match</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-700">{Math.round(repertoryResults.rankScores[rem] || 0)}</div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 4.5: AI REPERTORY LAB */}
            {/* ---------------------------------------------------- */}
            {activeTab === "AI Repertory Lab" && (
              <div className="bg-white min-w-[1050px] p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                  <div>
                    <h2 className="text-sm font-black text-[#0F4C81] uppercase tracking-wider">AI Repertory Lab</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">High-Fidelity Neural Totality Matching Engine</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-pink-50 text-pink-700 border border-pink-100 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Active Node: portal.homeo.healthcare
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Data Payload (lg:col-span-5) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 lg:col-span-5 flex flex-col justify-between shadow-sm">
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-200 pb-2">
                        Spreadsheet Repertory Payload
                      </h3>
                      
                      {/* Rubrics Checklist */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rubrics Selected for Transmit ({rubrics.length}):</span>
                        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                          {rubrics.map((r, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-white border border-slate-150 rounded-xl text-[10px] font-medium text-slate-700 shadow-sm">
                              <span className="font-bold truncate max-w-[200px]" title={r.name}>{r.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[8px] font-bold uppercase">{r.chapter}</span>
                                <span className="bg-[#0F4C81]/5 text-[#0F4C81] px-1 py-0.5 rounded font-bold">W:{r.weight}</span>
                                <span className="text-slate-400 text-[8px]">{r.dateAdded || today}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary calculations */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top Remedy Rankings:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {repertoryResults.sortedRemedies.slice(0, 3).map((rem, rIdx) => (
                            <div key={rem} className="bg-white border border-slate-150 rounded-xl p-2.5 text-center shadow-sm">
                              <div className="text-[9px] font-extrabold text-[#0F4C81] uppercase">RANK {rIdx + 1}</div>
                              <div className="text-xs font-black text-slate-800 mt-1">{rem}</div>
                              <div className="text-[10px] font-black text-emerald-700 mt-0.5">
                                {Math.round(repertoryResults.rankScores[rem] || 0)} pts
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Transmit Trigger Button */}
                    <div className="pt-4 border-t border-slate-200">
                      <button
                        onClick={handleTransmitToAiLab}
                        disabled={aiTransmitLoading}
                        className="w-full py-3 bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-60"
                      >
                        <Sparkles className={`w-4.5 h-4.5 ${aiTransmitLoading ? "animate-spin" : ""}`} />
                        <span>{aiTransmitLoading ? "TRANSMITTING DATA..." : "TRANSMIT DATA TO AI LAB"}</span>
                      </button>
                    </div>

                  </div>

                  {/* Right Column: AI Analysis Result (lg:col-span-7) */}
                  <div className="border border-slate-200 rounded-2xl p-6 lg:col-span-7 flex flex-col justify-between min-h-[400px] bg-white relative overflow-hidden shadow-sm">
                    
                    <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-gradient-to-bl from-pink-500/5 to-transparent rounded-full pointer-events-none filter blur-2xl"></div>

                    {aiTransmitLoading ? (
                      /* LOADING STATE */
                      <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-pink-600 animate-spin"></div>
                          <Sparkles className="w-6 h-6 text-pink-600 absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                          <h4 className="text-xs font-black text-[#0F4C81] uppercase tracking-widest animate-pulse">
                            {aiTransmitStep === 1 && "Connecting to portal.homeo.healthcare..."}
                            {aiTransmitStep === 2 && "Serializing repertory data payload..."}
                            {aiTransmitStep === 3 && "Analyzing miasmatic totality vectors..."}
                            {aiTransmitStep === 4 && "Compiling Materia Medica database insights..."}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Executing secure token protocol...</p>
                        </div>
                      </div>
                    ) : aiAnalysisResult ? (
                      /* COMPLETED STATE */
                      <div className="space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-5">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              AI Analysis Synthesis Complete
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">DATE: {aiAnalysisResult.dateAnalyzed}</span>
                          </div>

                          {/* Verdict Summary */}
                          <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 flex gap-3">
                            <Activity className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">Clinical Diagnostic Verdict</h4>
                              <p className="text-[11px] text-emerald-950 font-bold mt-0.5">{aiAnalysisResult.verdict}</p>
                            </div>
                          </div>

                          {/* Long Synthesis */}
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Dynamic Totality Match Analysis</h4>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                              {aiAnalysisResult.synthesis}
                            </p>
                          </div>

                          {/* Side-by-side card grid comparison */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Materia Medica Keynotes & Verifications</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {aiAnalysisResult.remedyCards.map((card: any) => (
                                <div key={card.name} className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm flex flex-col justify-between h-full">
                                  <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                      <span className="font-extrabold text-slate-800 text-xs truncate max-w-[80px]" title={card.name}>{card.name}</span>
                                      <span className="bg-[#0F4C81]/15 text-[#0F4C81] text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Rank {card.rank}</span>
                                    </div>
                                    <div className="text-[9px] text-slate-600 leading-relaxed mt-2">
                                      <strong className="text-[8px] font-bold uppercase text-slate-400 block mb-0.5">Indications</strong>
                                      {card.indications}
                                    </div>
                                  </div>
                                  <div className="text-[9px] text-slate-600 leading-relaxed mt-3 border-t border-slate-100/50 pt-2">
                                    <strong className="text-[8px] font-bold uppercase text-slate-400 block mb-0.5">Keynotes</strong>
                                    {card.keynotes}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Export actions */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-auto">
                          <button
                            onClick={() => {
                              const summaryText = `Homeo Healthcare AI Analysis Summary:\nDate: ${aiAnalysisResult.dateAnalyzed}\nVerdict: ${aiAnalysisResult.verdict}\n\nSynthesis: ${aiAnalysisResult.synthesis}`;
                              navigator.clipboard.writeText(summaryText);
                              alert("AI Analysis Summary copied to clipboard!");
                            }}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Summary</span>
                          </button>
                          <button
                            onClick={() => {
                              const shareText = `Dear ${patient.name}, thank you for your consultation. We have completed the clinical AI Totality Match analysis for your case. Top Remedy indicated: ${repertoryResults.sortedRemedies[0]}. We have saved these analysis details to your patient file. Clinical verified keynotes are being matching to your symptoms. Clinic Branch: Pune Baner.`;
                              const url = `https://api.whatsapp.com/send?phone=${patient.phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(shareText)}`;
                              window.open(url, "_blank");
                            }}
                            className="px-5 py-2 bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow cursor-pointer flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Share with Patient</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* EMPTY INITIAL STATE */
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 py-16">
                        <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shadow-sm">
                          <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="max-w-md space-y-1.5">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Repertory Totality Analysis Ready</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Transmit your spreadsheet repertorization grid directly to the **AI Repertory Lab** at `portal.homeo.healthcare`. The neural model matches the rubrics and date intervals against 250,000+ verified Materia Medica keynotes and miasmatic vectors.
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 5: TREATMENT PLANNER */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Treatment Planner" && (
              <div className="bg-white min-w-[1050px] p-6 space-y-6">
                <div className="border-b border-slate-150 pb-4">
                  <h2 className="text-sm font-black text-[#0F4C81] uppercase tracking-wider">Multi-Clinic Treatment Planner & Billing</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Config (lg:col-span-5) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 lg:col-span-5">
                    <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-200 pb-2">
                      Plan Configuration
                    </h3>
                    <div className="space-y-4 text-[11px] font-semibold">
                      {/* Care Level */}
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400">Care Level:</span>
                        <select
                          className="p-2 border border-slate-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
                          value={planner.careLevel}
                          onChange={(e) => {
                            const level = e.target.value as any;
                            setPlanner(prev => ({ ...prev, careLevel: level }));
                          }}
                        >
                          <option value="mild">Acute & Wellness Care</option>
                          <option value="moderate">Standard Chronic Care</option>
                          <option value="focused">Deep Systemic Care</option>
                          <option value="acute_critical">Acute Critical Care</option>
                          <option value="organ">Advanced Pathological Care</option>
                          <option value="comprehensive">Multisystem Integrative Care</option>
                        </select>
                      </div>

                      {/* Billing Cycle */}
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400">Billing Cycle:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPlanner(prev => ({ ...prev, billingCycle: "monthly", durationValue: 1 }))}
                            className={`flex-1 py-1.5 rounded-lg border text-center font-bold transition-all ${
                              planner.billingCycle === "monthly"
                                ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer"
                            }`}
                          >
                            Monthly Commit
                          </button>
                          <button
                            onClick={() => setPlanner(prev => ({ ...prev, billingCycle: "weekly", durationValue: 4 }))}
                            className={`flex-1 py-1.5 rounded-lg border text-center font-bold transition-all ${
                              planner.billingCycle === "weekly"
                                ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer"
                            }`}
                          >
                            Weekly Settle
                          </button>
                        </div>
                      </div>

                      {/* Duration Value */}
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400">Duration ({planner.billingCycle === "weekly" ? "Weeks" : "Months"}):</span>
                        <select
                          className="p-2 border border-slate-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
                          value={planner.durationValue}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPlanner(prev => ({ ...prev, durationValue: val }));
                          }}
                        >
                          {planner.billingCycle === "weekly" ? (
                            <>
                              <option value={1}>1 Week</option>
                              <option value={2}>2 Weeks</option>
                              <option value={4}>4 Weeks (1 Month)</option>
                              <option value={8}>8 Weeks (2 Months)</option>
                              <option value={12}>12 Weeks (3 Months)</option>
                              <option value={24}>24 Weeks (6 Months)</option>
                              <option value={48}>48 Weeks (1 Year)</option>
                            </>
                          ) : (
                            <>
                              <option value={1}>1 Month</option>
                              <option value={2}>2 Months</option>
                              <option value={3}>3 Months</option>
                              <option value={6}>6 Months</option>
                              <option value={12}>12 Months (1 Year)</option>
                            </>
                          )}
                        </select>
                      </div>

                      {/* Conditions Count */}
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400">Co-existing Conditions:</span>
                        <select
                          className="p-2 border border-slate-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
                          value={planner.conditionsCount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPlanner(prev => ({ ...prev, conditionsCount: val }));
                          }}
                        >
                          <option value={1}>1 Condition (Standard)</option>
                          <option value={2}>2 Conditions (+ Surcharge)</option>
                          <option value={3}>3 Conditions (+ Surcharge)</option>
                          <option value={4}>4 Conditions (+ Surcharge)</option>
                          <option value={5}>5+ Conditions (+ Surcharge)</option>
                        </select>
                      </div>

                      {/* Concession type */}
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400">Concession Applied:</span>
                        <select
                          className="p-2 border border-slate-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
                          value={planner.concessionType}
                          onChange={(e) => {
                            const type = e.target.value as any;
                            setPlanner(prev => ({ ...prev, concessionType: type }));
                          }}
                        >
                          <option value="none">None</option>
                          <option value="senior">Senior Citizen (15% Concession)</option>
                          <option value="compassionate">Socio-Economic (30% Compassionate)</option>
                          <option value="override">Custom Override Price</option>
                        </select>
                      </div>

                      {/* Custom Override Price (only if override) */}
                      {planner.concessionType === "override" && (
                        <div className="flex flex-col gap-1 bg-amber-50 border border-amber-200 p-3 rounded-xl animate-fade-in">
                          <span className="text-amber-800 font-bold">Custom Override Price (₹):</span>
                          <input
                            type="number"
                            className="p-2 border border-amber-300 bg-white rounded-lg focus:outline-none text-xs font-bold text-slate-800"
                            value={planner.overridePrice}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setPlanner(prev => ({ ...prev, overridePrice: val }));
                            }}
                          />
                        </div>
                      )}

                      {/* Medicine Add-ons Section */}
                      <div className="border-t border-slate-200 pt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Medicine Add-ons:</span>
                          <button
                            onClick={() => {
                              const newAddon = {
                                id: Math.random().toString(),
                                type: "Dilution",
                                details: "Custom dilution 30C",
                                amount: 150
                              };
                              setPlanner(prev => ({ ...prev, medicineAddons: [...prev.medicineAddons, newAddon] }));
                            }}
                            className="text-[10px] text-[#0F4C81] hover:text-[#0F4C81]/80 font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm"
                          >
                            <Plus className="w-3 h-3" /> Add Item
                          </button>
                        </div>
                        
                        {planner.medicineAddons.length > 0 && (
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {planner.medicineAddons.map((item) => (
                              <div key={item.id} className="flex justify-between items-center bg-white p-2 border border-slate-200 rounded-lg text-[10px]">
                                <div className="flex flex-col">
                                  <span className="text-slate-700 font-bold">{item.type}</span>
                                  <span className="text-slate-400 text-[8px]">{item.details}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-[#0F4C81]">₹{item.amount}</span>
                                  <button
                                    onClick={() => {
                                      setPlanner(prev => ({ ...prev, medicineAddons: prev.medicineAddons.filter(x => x.id !== item.id) }));
                                    }}
                                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Breakdown & Invoice (lg:col-span-7) */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Live Pricing Breakdown */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      <h3 className="font-extrabold text-xs text-[#2E8B57] uppercase tracking-widest border-b border-slate-200 pb-2">
                        Live Pricing Breakdown
                      </h3>
                      <div className="space-y-2 text-[11px] font-semibold text-slate-600">
                        <div className="flex justify-between items-center">
                          <span>Base Care Rate:</span>
                          <span className="font-bold text-slate-800">₹{plannerPrices.basePrice.toLocaleString("en-IN")} / {planner.billingCycle === "weekly" ? "week" : "month"}</span>
                        </div>
                        {plannerPrices.surcharge > 0 && (
                          <div className="flex justify-between items-center text-amber-700">
                            <span>Co-existing Conditions Surcharge:</span>
                            <span className="font-bold">+₹{plannerPrices.surcharge.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center border-t border-slate-100 pt-1.5">
                          <span>Gross Adjusted Rate:</span>
                          <span className="font-bold text-slate-800">₹{plannerPrices.adjustedBasePrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Multiplier Duration:</span>
                          <span className="font-bold text-slate-800">× {planner.durationValue} {planner.billingCycle === "weekly" ? (planner.durationValue === 1 ? "week" : "weeks") : (planner.durationValue === 1 ? "month" : "months")}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-slate-800 bg-slate-100/60 p-2 rounded-lg">
                          <span>Gross Subtotal:</span>
                          <span>₹{plannerPrices.rawTotal.toLocaleString("en-IN")}</span>
                        </div>
                        {plannerPrices.discountPercent > 0 && (
                          <div className="flex justify-between items-center text-emerald-700">
                            <span>Duration Discount ({plannerPrices.discountPercent}%):</span>
                            <span>-₹{plannerPrices.discountAmount.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {plannerPrices.concessionAmount > 0 && (
                          <div className="flex justify-between items-center text-indigo-700 bg-indigo-50/50 px-2 py-1 rounded">
                            <span>Concession Applied ({planner.concessionType === "senior" ? "Senior 15%" : planner.concessionType === "compassionate" ? "Socio-Economic 30%" : "Override"}):</span>
                            <span>-₹{plannerPrices.concessionAmount.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {plannerPrices.addonsSum > 0 && (
                          <div className="flex justify-between items-center text-[#0F4C81]">
                            <span>Medicine Add-ons:</span>
                            <span>+₹{plannerPrices.addonsSum.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-xs font-black text-slate-800">
                          <span>Total Program Cost:</span>
                          <span className="text-[#0F4C81] text-sm font-black">₹{plannerPrices.finalPrice.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="flex justify-between items-center border-t border-dashed border-slate-250 pt-2">
                          <span className="text-slate-400">Amount Received Today (Editable):</span>
                          <span className="font-black text-slate-800 text-xs">
                            {renderEditableInput("planner", "received", `₹${planner.received.toLocaleString("en-IN")}`)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center border-t-2 border-slate-200 pt-2 text-xs font-black">
                          <span className="text-slate-700">Outstanding Balance Due:</span>
                          <span className={`text-sm font-black ${balanceDue > 0 ? "text-rose-600 animate-pulse" : "text-emerald-700"}`}>
                            ₹{balanceDue.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Message Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 flex flex-col justify-between shadow-sm">
                      <div>
                        <h3 className="font-extrabold text-xs text-[#0F4C81] uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <Copy className="w-4 h-4 text-slate-400" />
                          WhatsApp Invoice Message (Copied via script)
                        </h3>
                        <p className="text-[10px] text-slate-505 text-slate-600 font-semibold mt-2 leading-relaxed bg-white border border-slate-200 rounded-xl p-3 select-all min-h-[60px]">
                          {whatsappInvoiceText}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleCopyToClipboard}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Message</span>
                        </button>
                        <button
                          onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappInvoiceText)}`, "_blank")}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Send via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 5.5: FINANCE */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Finance" && (
              <div className="bg-white min-w-[1050px] p-6 space-y-6">
                <div className="border-b border-slate-150 pb-4">
                  <h2 className="text-sm font-black text-[#0F4C81] uppercase tracking-wider">Patient Financial Ledger & Revenue History</h2>
                </div>

                {/* Finance Overview KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Total Billed */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount Billed</div>
                    <div className="text-2xl font-black text-[#0F4C81] mt-1">₹{totalBilled.toLocaleString("en-IN")}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-1.5">Initial Plan + Surcharges + Add-ons</div>
                  </div>

                  {/* Card 2: Total Revenue Collected */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-emerald-700">Total Revenue Collected</div>
                    <div className="text-2xl font-black text-emerald-700 mt-1">₹{totalCollected.toLocaleString("en-IN")}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-1.5">Direct payments received till date</div>
                  </div>

                  {/* Card 3: Outstanding Balance */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-rose-600">Outstanding Balance</div>
                    <div className="text-2xl font-black text-rose-600 mt-1">₹{outstandingBalance.toLocaleString("en-IN")}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-1.5">Remaining receivable amounts</div>
                  </div>
                </div>

                {/* Ledger Transactions Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                        <th className="p-3">Date</th>
                        <th className="p-3">Description / Event</th>
                        <th className="p-3">Reference ID</th>
                        <th className="p-3 text-right">Amount Charged</th>
                        <th className="p-3 text-right">Amount Received</th>
                        <th className="p-3 text-right">Outstanding Balance</th>
                        <th className="p-3">Payment Mode</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 bg-white font-semibold text-slate-850 text-slate-700">
                      {currentTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 text-slate-400">{tx.date}</td>
                          <td className="p-3 font-bold text-slate-805 text-slate-800">{tx.description}</td>
                          <td className="p-3 font-mono text-slate-500">{tx.refId}</td>
                          <td className="p-3 text-right text-slate-600">₹{tx.charged.toLocaleString("en-IN")}</td>
                          <td className="p-3 text-right text-slate-800">
                            {idx === 0 ? (
                              renderEditableInput("planner", "received", `₹${tx.received.toLocaleString("en-IN")}`)
                            ) : (
                              `₹${tx.received.toLocaleString("en-IN")}`
                            )}
                          </td>
                          <td className="p-3 text-right font-bold text-slate-700">₹{(tx.charged - tx.received).toLocaleString("en-IN")}</td>
                          <td className="p-3 text-slate-500">{tx.mode}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              tx.status === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" :
                              tx.status === "Partially Paid" ? "bg-indigo-50 text-indigo-700 border border-indigo-150" :
                              "bg-rose-50 text-rose-700 border border-rose-150"
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ledger Help note */}
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl text-[10px] text-slate-500 leading-relaxed font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#0F4C81] flex-shrink-0" />
                  <span>The Ledger logs transactions from case initiation to follow-up check-ins. Modify the initial plan payment by double-clicking on the Amount Received cell in either the Ledger or the Treatment Planner configuration.</span>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 6: REPORTS & ATTACHMENTS */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Reports & Attachments" && (
              <div className="bg-white min-w-[1050px] p-6 space-y-6">
                <div className="border-b border-slate-150 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-[#0F4C81] uppercase tracking-wider">Reports & Attachments Log</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Upload lab investigations, photos, or intake sheets to parse with Gemini Multimodal AI and sync to Google Sheets</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSyncAttachments(attachments)}
                      disabled={syncingAttachments}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-sm border ${
                        syncingAttachments
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                          : "bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white border-[#0F4C81]"
                      }`}
                    >
                      {syncingAttachments ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Sync to Google Sheet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Banners */}
                {syncMessage && (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    syncMessage.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {syncMessage.type === "success" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">{syncMessage.text}</span>
                    </div>
                    <button onClick={() => setSyncMessage(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-6">
                  {/* LEFT PANEL: Uploader & Form (col-span-5) */}
                  <div className="col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Upload & Import Center</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Process files using Gemini multimodal engines</p>
                    </div>

                    {/* Mode Toggle Buttons */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-1 rounded-xl">
                      <button
                        onClick={() => { setImportMode("lab"); setUploadError(null); }}
                        className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                          importMode === "lab"
                            ? "bg-white text-[#0F4C81] shadow-sm"
                            : "text-slate-600 hover:text-slate-800"
                        }`}
                      >
                        Lab Report
                      </button>
                      <button
                        onClick={() => { setImportMode("demographics"); setUploadError(null); }}
                        className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                          importMode === "demographics"
                            ? "bg-white text-[#0F4C81] shadow-sm"
                            : "text-slate-600 hover:text-slate-800"
                        }`}
                      >
                        Intake File
                      </button>
                      <button
                        onClick={() => { setImportMode("manual"); setUploadError(null); }}
                        className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                          importMode === "manual"
                            ? "bg-white text-[#0F4C81] shadow-sm"
                            : "text-slate-600 hover:text-slate-800"
                        }`}
                      >
                        Manual Link
                      </button>
                    </div>

                    {/* ERROR BOX */}
                    {uploadError && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[10px] text-rose-800 font-bold flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                        <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-700">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* UPLOADER / MANUAL FORM */}
                    {importMode !== "manual" ? (
                      <div className="space-y-4">
                        <div className="relative border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center min-h-[160px] group cursor-pointer">
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            disabled={uploadingFile}
                            accept=".pdf,image/png,image/jpeg,image/jpg,text/plain"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                          />
                          {uploadingFile ? (
                            <div className="pointer-events-none space-y-3 flex flex-col items-center">
                              <Activity className="w-8 h-8 text-[#0F4C81] animate-spin" />
                              <div className="space-y-1">
                                <p className="text-[11px] font-extrabold text-[#0F4C81] uppercase tracking-wider animate-pulse">Gemini AI is transcribing...</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Extracting structured clinical findings</p>
                              </div>
                            </div>
                          ) : (
                            <div className="pointer-events-none space-y-2 flex flex-col items-center group-hover:scale-[1.02] transition-transform">
                              <div className="p-3 bg-slate-100 rounded-2xl text-slate-50 group-hover:bg-[#0F4C81]/10 group-hover:text-[#0F4C81] transition-colors">
                                <Sparkles className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Drag & drop your file here</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">or click to browse files</p>
                              </div>
                              <p className="text-[8px] text-slate-400 font-semibold mt-2">Supports PDF, PNG, JPG, JPEG, TXT (Max 5MB)</p>
                            </div>
                          )}
                        </div>

                        {/* Extractions Preview Card */}
                        {extractedDemographics && (
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3.5 shadow-sm">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span className="font-extrabold text-emerald-800 text-[10px] uppercase tracking-wider">AI Extracted Demographics</span>
                              </div>
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Intake Ready</span>
                            </div>
                            <div className="space-y-2 text-[10px] font-medium text-slate-600">
                              <div className="grid grid-cols-12 gap-1.5 border-b border-slate-100 pb-1.5">
                                <span className="col-span-4 font-bold uppercase text-slate-400">Name:</span>
                                <span className="col-span-8 font-extrabold text-slate-800">{extractedDemographics.name || "N/A"}</span>
                              </div>
                              <div className="grid grid-cols-12 gap-1.5 border-b border-slate-100 pb-1.5">
                                <span className="col-span-4 font-bold uppercase text-slate-400">Age / Sex:</span>
                                <span className="col-span-8 font-extrabold text-slate-800">{extractedDemographics.age || "N/A"} / {extractedDemographics.gender || "N/A"}</span>
                              </div>
                              <div className="grid grid-cols-12 gap-1.5 border-b border-slate-100 pb-1.5">
                                <span className="col-span-4 font-bold uppercase text-slate-400">Contact:</span>
                                <span className="col-span-8 font-extrabold text-slate-800">{extractedDemographics.phone || "N/A"} | {extractedDemographics.email || "N/A"}</span>
                              </div>
                              <div className="grid grid-cols-12 gap-1.5 border-b border-slate-100 pb-1.5">
                                <span className="col-span-4 font-bold uppercase text-slate-400">Location:</span>
                                <span className="col-span-8 font-extrabold text-slate-800">{extractedDemographics.city || "N/A"}, {extractedDemographics.state || "N/A"}</span>
                              </div>
                              <div className="space-y-1">
                                <span className="font-bold uppercase text-slate-400">Chief Complaint:</span>
                                <p className="bg-white border border-slate-150 rounded-lg p-2 text-[9.5px] font-semibold text-slate-700 leading-normal">{extractedDemographics.complaint || "N/A"}</p>
                              </div>
                            </div>
                            <button
                              onClick={handleApplyDemographics}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Apply to Case Sheet & Log</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Manual Attachment Form */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Attachment Title / Target</label>
                          <input
                            type="text"
                            value={manualTitle}
                            onChange={e => setManualTitle(e.target.value)}
                            placeholder="e.g. Complete Thyroid Profile (T3, T4, TSH)"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Investigation Category</label>
                          <select
                            value={manualCategory}
                            onChange={e => setManualCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                          >
                            <option value="Blood Test">Blood Test</option>
                            <option value="Clinical Photo">Clinical Photo</option>
                            <option value="Thyroid Report">Thyroid Report</option>
                            <option value="GERD Scan">GERD Scan</option>
                            <option value="Other Scan">Other Scan</option>
                            <option value="Consultation Note">Consultation Note</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Google Drive Hyperlink</label>
                          <input
                            type="text"
                            value={manualUrl}
                            onChange={e => setManualUrl(e.target.value)}
                            placeholder="https://drive.google.com/..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                          />
                        </div>

                        <button
                          onClick={handleAddManualAttachment}
                          className="w-full bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Attachment</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* RIGHT PANEL: Attachments list (col-span-7) */}
                  <div className="col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Clinical Investigation Log</h3>
                      <span className="bg-slate-200 text-slate-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">{attachments.length} files logged</span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {attachments.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-2">
                          <Folder className="w-8 h-8 text-slate-350" />
                          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">No clinical attachments logged</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Use the Upload Center to log investigations</p>
                        </div>
                      ) : (
                        attachments.map((file, index) => (
                          <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3 transition-all hover:shadow-md hover:border-slate-300">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3.5">
                                <div className="p-3 bg-[#0F4C81]/10 rounded-xl text-[#0F4C81]">
                                  {file.category === "Clinical Photo" ? (
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                  ) : file.category === "Blood Test" || file.category === "Thyroid Report" ? (
                                    <Activity className="w-5 h-5 text-emerald-600" />
                                  ) : (
                                    <Folder className="w-5 h-5" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-800 text-xs leading-normal">{file.target}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{file.category}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{file.date}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl transition-all shadow-sm"
                                  title="View on Google Drive"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={() => handleDeleteAttachment(index)}
                                  className="p-2 border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded-xl transition-all shadow-sm"
                                  title="Delete attachment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Collapsible AI Notes block */}
                            {file.notes && (
                              <div className="border-t border-slate-200/60 pt-2.5">
                                <button
                                  onClick={() => setExpandedNotesIndex(expandedNotesIndex === index ? null : index)}
                                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                  {expandedNotesIndex === index ? (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
                                      <span className="text-teal-600 font-extrabold">Hide Transcribed AI Notes</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                      <span>View Transcribed AI Notes</span>
                                    </>
                                  )}
                                </button>

                                {expandedNotesIndex === index && (
                                  <div className="mt-2.5 bg-slate-100/70 border border-slate-200/50 rounded-xl p-3 text-[10.5px] font-mono text-slate-600 whitespace-pre-wrap leading-relaxed select-all">
                                    {file.notes}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 7: CONFIG DB */}
            {/* ---------------------------------------------------- */}
            {activeTab === "Config DB" && (
              <div className="bg-white min-w-[1250px] p-6 space-y-6">
                {/* Header */}
                <div className="border-b border-slate-150 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-[#0F4C81] uppercase tracking-wider">Reference Metadata Database (Config DB)</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Configure dropdown validation options and treatment packages. Updates are synced to range 'Config DB'!A3:G100 in Google Sheets.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSyncConfig(configDb)}
                      disabled={syncingConfig}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-sm border ${
                        syncingConfig
                           ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                           : "bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white border-[#0F4C81]"
                      }`}
                    >
                      {syncingConfig ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Sync to Google Sheet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Banners */}
                {configSyncMessage && (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    configSyncMessage.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {configSyncMessage.type === "success" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">{configSyncMessage.text}</span>
                    </div>
                    <button onClick={() => setConfigSyncMessage(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 6-Column Grid Layout */}
                <div className="grid grid-cols-6 gap-4">
                  {/* Column 1: Materia Medica */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[400px] shadow-sm">
                    <div className="space-y-3.5">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="font-extrabold text-[#0F4C81] text-xs uppercase tracking-wider">Materia Medica</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{configDb.remedies.length} Remedies</p>
                      </div>
                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                        {configDb.remedies.map((remedy, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-slate-150 rounded-xl px-3 py-1.5 hover:shadow-sm group transition-all">
                            <span className="text-[11px] font-bold text-slate-700">{remedy}</span>
                            <button
                              onClick={() => handleRemoveConfigItem("remedies", index)}
                              className="text-slate-355 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-250 flex items-center gap-1.5 mt-4">
                      <input
                        type="text"
                        placeholder="Add Remedy..."
                        value={newRemedyInput}
                        onChange={e => setNewRemedyInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddConfigItem("remedies")}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                      />
                      <button
                        onClick={() => handleAddConfigItem("remedies")}
                        className="p-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-xl transition-all shadow-sm shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Column 2: Potencies */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[400px] shadow-sm">
                    <div className="space-y-3.5">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="font-extrabold text-[#0F4C81] text-xs uppercase tracking-wider">Potency Options</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{configDb.potencies.length} Scales</p>
                      </div>
                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                        {configDb.potencies.map((potency, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-slate-150 rounded-xl px-3 py-1.5 hover:shadow-sm group transition-all">
                            <span className="text-[11px] font-bold text-slate-700">{potency}</span>
                            <button
                              onClick={() => handleRemoveConfigItem("potencies", index)}
                              className="text-slate-355 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-250 flex items-center gap-1.5 mt-4">
                      <input
                        type="text"
                        placeholder="Add Potency..."
                        value={newPotencyInput}
                        onChange={e => setNewPotencyInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddConfigItem("potencies")}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                      />
                      <button
                        onClick={() => handleAddConfigItem("potencies")}
                        className="p-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-xl transition-all shadow-sm shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Column 3: Miasms */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[400px] shadow-sm">
                    <div className="space-y-3.5">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="font-extrabold text-[#0F4C81] text-xs uppercase tracking-wider">Miasm Tags</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{configDb.miasms.length} Miasms</p>
                      </div>
                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                        {configDb.miasms.map((miasm, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-slate-150 rounded-xl px-3 py-1.5 hover:shadow-sm group transition-all">
                            <span className="text-[11px] font-bold text-slate-700">{miasm}</span>
                            <button
                              onClick={() => handleRemoveConfigItem("miasms", index)}
                              className="text-slate-355 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-250 flex items-center gap-1.5 mt-4">
                      <input
                        type="text"
                        placeholder="Add Miasm..."
                        value={newMiasmInput}
                        onChange={e => setNewMiasmInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddConfigItem("miasms")}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                      />
                      <button
                        onClick={() => handleAddConfigItem("miasms")}
                        className="p-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-xl transition-all shadow-sm shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Column 4: Locations */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[400px] shadow-sm">
                    <div className="space-y-3.5">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="font-extrabold text-[#0F4C81] text-xs uppercase tracking-wider">Clinic Branches</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{configDb.locations.length} OPDs</p>
                      </div>
                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                        {configDb.locations.map((loc, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-slate-150 rounded-xl px-3 py-1.5 hover:shadow-sm group transition-all">
                            <span className="text-[11px] font-bold text-slate-700 break-words max-w-[85%]">{loc}</span>
                            <button
                              onClick={() => handleRemoveConfigItem("locations", index)}
                              className="text-slate-355 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-250 flex items-center gap-1.5 mt-4">
                      <input
                        type="text"
                        placeholder="Add OPD..."
                        value={newLocationInput}
                        onChange={e => setNewLocationInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddConfigItem("locations")}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                      />
                      <button
                        onClick={() => handleAddConfigItem("locations")}
                        className="p-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-xl transition-all shadow-sm shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Column 5: Consulting Doctors */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[400px] shadow-sm">
                    <div className="space-y-3.5">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="font-extrabold text-[#0F4C81] text-xs uppercase tracking-wider">Consulting Doctors</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{(configDb.doctors || []).length} Doctors</p>
                      </div>
                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                        {(configDb.doctors || []).map((doc, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-slate-150 rounded-xl px-3 py-1.5 hover:shadow-sm group transition-all">
                            <span className="text-[11px] font-bold text-slate-700 break-words max-w-[85%]">{doc}</span>
                            <button
                              onClick={() => handleRemoveConfigItem("doctors", index)}
                              className="text-slate-355 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-250 flex items-center gap-1.5 mt-4">
                      <input
                        type="text"
                        placeholder="Add Doctor..."
                        value={newDoctorInput}
                        onChange={e => setNewDoctorInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddConfigItem("doctors")}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                      />
                      <button
                        onClick={() => handleAddConfigItem("doctors")}
                        className="p-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-xl transition-all shadow-sm shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Column 6: Packages & Pricing */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[400px] shadow-sm">
                    <div className="space-y-3.5">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="font-extrabold text-[#0F4C81] text-xs uppercase tracking-wider">Packages & Pricing</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{configDb.packages.length} Tiers</p>
                      </div>
                      <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                        {configDb.packages.map((pkg, index) => (
                          <div key={index} className="bg-white border border-slate-150 rounded-xl p-2.5 hover:shadow-sm group transition-all space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-slate-800">{pkg.name}</span>
                              <button
                                onClick={() => handleRemovePackageConfig(index)}
                                className="text-slate-355 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center text-[#0F4C81] gap-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider">Standard Rate:</span>
                              <span className="text-[10px] font-black font-mono">₹{pkg.price.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-250 space-y-2 mt-4">
                      <input
                        type="text"
                        placeholder="Package Name..."
                        value={newPackageNameInput}
                        onChange={e => setNewPackageNameInput(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 focus:outline-none focus:border-[#0F4C81]"
                      />
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Price (₹)..."
                          value={newPackagePriceInput}
                          onChange={e => setNewPackagePriceInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleAddPackageConfig()}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-[#0F4C81] focus:outline-none focus:border-[#0F4C81]"
                        />
                        <button
                          onClick={handleAddPackageConfig}
                          className="p-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-xl transition-all shadow-sm shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
          {/* Scroll indicator fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-r from-white/75 to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-white/75 to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10" />
        </div>

        {/* Sheets Bottom Tab Bar */}
          <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-600 z-10">
            {/* Tabs List */}
            <div className="flex flex-wrap gap-1">
              {(["Dashboard", "Case Taking", "Follow-up Tracker", "Repertorization", "Treatment Planner", "Finance", "AI Repertory Lab", "Reports & Attachments", "Config DB"] as TabType[]).map(tab => {
                const isActive = activeTab === tab;
                const tabColors: { [key: string]: string } = {
                  "Dashboard": "border-t-2 border-t-[#0F4C81] text-[#0F4C81]",
                  "Case Taking": "border-t-2 border-t-[#2E8B57] text-[#2E8B57]",
                  "Follow-up Tracker": "border-t-2 border-t-amber-600 text-amber-600",
                  "Repertorization": "border-t-2 border-t-indigo-600 text-indigo-600",
                  "Treatment Planner": "border-t-2 border-t-purple-600 text-purple-600",
                  "Finance": "border-t-2 border-t-emerald-600 text-emerald-600",
                  "AI Repertory Lab": "border-t-2 border-t-pink-600 text-pink-600",
                  "Reports & Attachments": "border-t-2 border-t-teal-600 text-teal-600",
                  "Config DB": "border-t-2 border-t-slate-500 text-slate-500"
                };

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 bg-white rounded-t-lg shadow-sm border border-b-0 border-slate-200/80 cursor-pointer transition-all hover:bg-slate-50 ${
                      isActive ? `${tabColors[tab] || "text-slate-800 font-extrabold"} font-extrabold` : "text-slate-500 hover:text-slate-700 font-semibold"
                    }`}
                  >
                    {tab === "Dashboard" && "📊 "}
                    {tab === "Case Taking" && "📝 "}
                    {tab === "Follow-up Tracker" && "📈 "}
                    {tab === "Repertorization" && "⚖️ "}
                    {tab === "Treatment Planner" && "💼 "}
                    {tab === "Finance" && "💰 "}
                    {tab === "AI Repertory Lab" && "🧠 "}
                    {tab === "Reports & Attachments" && "📂 "}
                    {tab === "Config DB" && "⚙️ "}
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Quick Status details */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Layout: Hybrid (Single Case Page + Tabs)</span>
              <span>•</span>
              <span>Active: {activeTab}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Prescription Titration Manager Modal Overlay */}
      {selectedFollowUpIndex !== null && (() => {
        const visit = followUps[selectedFollowUpIndex];
        const methodInfo = getClinicalMethodInfo(tempMedicines);
        
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-150 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Prescription Titration Manager</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">Follow-up Visit • {visit.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedFollowUpIndex(null)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer animate-pulse"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Method Badge Card */}
                <div className={`p-4 rounded-2xl border ${methodInfo.color} flex items-start gap-3 transition-all duration-305`}>
                  <Activity className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider">{methodInfo.title}</div>
                    <div className="text-[11px] font-medium leading-relaxed mt-0.5">{methodInfo.desc}</div>
                  </div>
                </div>

                {/* Add Remedy Form */}
                <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-150 space-y-4">
                  <h4 className="text-[10px] font-black text-[#0F4C81] uppercase tracking-wider">Add Remedy to Prescription</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Remedy Search */}
                    <div className="relative">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Search or Type Remedy</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Lycopodium, Nux Vomica..."
                          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C81] font-semibold text-slate-700"
                          value={remedySearch}
                          onChange={(e) => {
                            setRemedySearch(e.target.value);
                            setNewMedicine(prev => ({ ...prev, name: e.target.value }));
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      
                      {/* Suggestions dropdown */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[1000] overflow-hidden max-h-48 overflow-y-auto">
                          {filteredSuggestions.map((rem, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleSelectSuggestion(rem)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-[#0F4C81]/5 hover:text-[#0F4C81] transition-colors border-b border-slate-50 last:border-0 font-bold text-slate-700"
                            >
                              {rem}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Form Factor / Type */}
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Form Factor (Type)</label>
                      <select
                        value={newMedicine.type}
                        onChange={(e) => {
                          const newType = e.target.value;
                          let defaultPotency = newMedicine.potency;
                          if (newType === "Liquid Mother Tincture") defaultPotency = "Q";
                          else if (newType === "Bio-Combination") defaultPotency = "6x";
                          else if (newType === "Biochemic Tablet") defaultPotency = "6x";
                          else if (newType === "Dilution" && (defaultPotency === "Q" || defaultPotency.endsWith("x"))) defaultPotency = "30C";
                          
                          setNewMedicine(prev => ({
                            ...prev,
                            type: newType,
                            potency: defaultPotency
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C81] font-bold text-slate-700"
                      >
                        <option value="Dilution">Dilution</option>
                        <option value="Liquid Mother Tincture">Liquid Mother Tincture</option>
                        <option value="Bio-Combination">Bio-Combination</option>
                        <option value="Biochemic Tablet">Biochemic Tablet</option>
                        <option value="Globules">Globules</option>
                      </select>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Potency */}
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Potency / Scale</label>
                      <input
                        type="text"
                        placeholder="e.g. 30C, 200C, Q, 6x"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C81] font-bold text-slate-700"
                        value={newMedicine.potency}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, potency: e.target.value }))}
                      />
                    </div>

                    {/* Dosage */}
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Dosage Frequency</label>
                      <select
                        value={newMedicine.dose}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, dose: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C81] font-bold text-slate-700"
                      >
                        <option value="BD">BD (Twice daily)</option>
                        <option value="TDS">TDS (Thrice daily)</option>
                        <option value="OD">OD (Once daily)</option>
                        <option value="HS">HS (At bedtime)</option>
                        <option value="SOS">SOS (When needed)</option>
                        <option value="Stat">Stat (Once immediately)</option>
                      </select>
                    </div>

                    {/* Add Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="w-full py-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Remedy</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* Current Remedies List */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Prescription List</h4>
                  
                  {tempMedicines.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
                      No remedies added yet. Use the form above to build the prescription.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {tempMedicines.map((med, mIdx) => (
                        <div 
                          key={mIdx}
                          className="flex items-center justify-between p-3.5 bg-white border border-slate-150 rounded-2xl hover:border-slate-350 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#0F4C81]/5 text-[#0F4C81] flex items-center justify-center text-xs font-black">
                              {mIdx + 1}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">{med.name}</div>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/50 uppercase font-semibold">
                                  {med.type}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold">•</span>
                                <span className="text-[10px] text-slate-600 font-medium">
                                  Potency: <strong className="text-slate-800">{med.potency}</strong>
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold">•</span>
                                <span className="text-[10px] text-slate-600 font-medium">
                                  Dose: <strong className="text-[#2E8B57]">{med.dose}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setTempMedicines(prev => prev.filter((_, i) => i !== mIdx))}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-150 flex items-center justify-end gap-3 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setSelectedFollowUpIndex(null)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePrescription}
                  className="px-6 py-2.5 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Save Prescription
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Toast Notification */}
      {repertoryToast && (
        <div className="fixed bottom-16 right-6 bg-slate-900/90 backdrop-blur-sm text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 z-[9999] flex items-center gap-2.5 text-xs font-bold animate-in fade-in-50 slide-in-from-bottom-5 duration-205">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
          <span>{repertoryToast}</span>
        </div>
      )}

    </div>
  );
}

export default function MockSheetPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading Clinical Case Sheet...</div>}>
      <MockSheetContent />
    </Suspense>
  );
}
