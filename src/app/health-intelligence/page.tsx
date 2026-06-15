"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Sparkles, Heart, Sliders, ChevronRight, Play, Check, 
  ArrowLeft, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, FileText, Calendar,
  UploadCloud, Info, Trash2, Printer, Plus, Award, User, Layers, BookOpen, MessageSquare
} from "lucide-react";
import Link from "next/link";

import { 
  ASSESSMENT_CATEGORIES, 
  ASSESSMENT_PROFILES 
} from "./assessmentsData";
import { 
  Question, 
  AssessmentProfile, 
  HealthDigitalTwin, 
  IntelligenceReport, 
  SystemScores, 
  MiasmaticProfile,
  ConstitutionalProfile
} from "./types";
import { analyzeDigitalTwin } from "./clinicalRulesEngine";
import { CONSTITUTIONAL_QUESTIONS, analyzeConstitution } from "./constitutionalEngine";
import { parseLabReport, LabAnalysisResult } from "./labOcrEngine";
import RadarChart from "./radarChart";
import SchemaMarkup from "./schemaMarkup";
import HealthAssistant from "./HealthAssistant";
import EcgGraph from "@/components/EcgGraph";

const DEFAULT_TWIN: HealthDigitalTwin = {
  overallScore: 100,
  systemScores: {
    endocrine: 100,
    cardiovascular: 100,
    digestive: 100,
    respiratory: 100,
    skin: 100,
    neurological: 100,
    immune: 100,
    mentalHealth: 100
  },
  completedAssessments: {},
  organLoad: {
    pancreas: 10,
    thyroid: 10,
    heart: 10,
    arteries: 10,
    gut: 10,
    liver: 10,
    lungs: 10,
    dermis: 10,
    adrenals: 10,
    brain: 10
  },
  riskLevel: {
    metabolic: { level: "Low", pct: 15 },
    cardio: { level: "Low", pct: 12 },
    endocrine: { level: "Low", pct: 10 },
    digestive: { level: "Low", pct: 15 },
    respiratory: { level: "Low", pct: 8 }
  },
  activeRulesFlags: [],
  priorityGoals: [
    "Complete baseline metabolic and sleep assessments",
    "Establish regular digestive transit rhythm"
  ]
};

export default function HealthIntelligencePage() {
  const [digitalTwin, setDigitalTwin] = useState<HealthDigitalTwin>(DEFAULT_TWIN);
  const [activeView, setActiveView] = useState<"dashboard" | "assessment" | "constitutional" | "lab_upload" | "report">("dashboard");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("metabolic");
  const [isEcgExpanded, setIsEcgExpanded] = useState(false);
  
  // Questionnaire States
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeReport, setActiveReport] = useState<IntelligenceReport | null>(null);

  // Constitutional Assessment States
  const [constitutionalAnswers, setConstitutionalAnswers] = useState<Record<string, string>>({});
  const [constStep, setConstStep] = useState<number>(0);
  const [constIsCalculating, setConstIsCalculating] = useState(false);

  // Lab Report States
  const [labRawText, setLabRawText] = useState("");
  const [labParsing, setLabParsing] = useState(false);
  const [labResult, setLabResult] = useState<LabAnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load digital twin state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("homeo_health_digital_twin_2026");
    if (saved) {
      try {
        setDigitalTwin(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading health digital twin:", e);
      }
    }
  }, []);

  // Theme synchronizer with global navbar
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Save digital twin helper
  const saveDigitalTwin = (updated: HealthDigitalTwin) => {
    setDigitalTwin(updated);
    localStorage.setItem("homeo_health_digital_twin_2026", JSON.stringify(updated));
  };

  // Reset digital twin helper
  const handleResetTwin = () => {
    if (window.confirm("Are you sure you want to clear your Health Digital Twin profile? This will reset all scores and completed assessments history.")) {
      setDigitalTwin(DEFAULT_TWIN);
      localStorage.removeItem("homeo_health_digital_twin_2026");
      setActiveView("dashboard");
      setLabResult(null);
      setActiveReport(null);
    }
  };

  // Questionnaire helpers
  const handleSelectProfile = (id: string) => {
    setSelectedProfileId(id);
    setSelectedSymptoms([]);
    setCurrentStep(0);
    const profile = ASSESSMENT_PROFILES.find(p => p.id === id);
    const initial: Record<string, any> = {};
    profile?.questions.forEach(q => {
      initial[q.id] = q.type === "range" ? Math.round(((q.max || 10) + (q.min || 1)) / 2) : q.options?.[0] || "";
    });
    setAnswers(initial);
    setActiveView("assessment");
  };

  const handleInputChange = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  // Score generator
  const handleCalculateAssessment = () => {
    if (!selectedProfileId) return;
    setIsCalculating(true);

    setTimeout(() => {
      const profile = ASSESSMENT_PROFILES.find(p => p.id === selectedProfileId);
      if (!profile) return;

      let totalBurden = 0;
      profile.questions.forEach(q => {
        const val = answers[q.id];
        let qBurden = 0;
        if (q.type === "select") {
          const idx = q.options ? q.options.indexOf(val) : 0;
          const count = q.options ? q.options.length : 1;
          qBurden = count > 1 ? (idx / (count - 1)) * 100 : 0;
        } else {
          const min = q.min || 1;
          const max = q.max || 10;
          const v = Number(val) || min;
          // Reverse if it's a positive health marker
          const positiveMarkers = ["activity_level", "daily_steps", "energy_stability", "cardio_stamina", "sleep_duration"];
          if (positiveMarkers.includes(q.id)) {
            qBurden = ((max - v) / (max - min)) * 100;
          } else {
            qBurden = ((v - min) / (max - min)) * 100;
          }
        }
        totalBurden += qBurden;
      });

      const avgQuestionBurden = totalBurden / profile.questions.length;
      const symptomsBurden = Math.min(100, selectedSymptoms.length * 15);
      const finalBurden = Math.min(100, avgQuestionBurden * 0.7 + symptomsBurden * 0.3);
      const score = Math.round(100 - finalBurden);

      // Create new completed assessments copy
      const completedAssessments = { ...digitalTwin.completedAssessments };
      completedAssessments[selectedProfileId] = {
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        score,
        answers: { ...answers },
        symptoms: [...selectedSymptoms]
      };

      // Form intermediate twin to execute clinical engine rules
      const intermediateTwin: HealthDigitalTwin = {
        ...digitalTwin,
        completedAssessments
      };

      const analysis = analyzeDigitalTwin(intermediateTwin);

      // Average the active system scores to compile overall health score
      const systemScoresValues = Object.values(analysis.systemScores);
      const overallScore = Math.round(systemScoresValues.reduce((a, b) => a + b, 0) / systemScoresValues.length);

      // Build updated Digital Twin state
      const updatedTwin: HealthDigitalTwin = {
        ...digitalTwin,
        overallScore,
        systemScores: analysis.systemScores,
        completedAssessments,
        organLoad: analysis.organLoad,
        riskLevel: analysis.riskLevel,
        activeRulesFlags: analysis.activeFlags,
        priorityGoals: analysis.priorityGoals
      };

      // Generate report object
      const report = generateReport(selectedProfileId, score, answers, selectedSymptoms);
      report.miasmaticProfile = analysis.miasmaticProfile; // sync with rules calculations
      
      saveDigitalTwin(updatedTwin);
      setActiveReport(report);
      setIsCalculating(false);
      setActiveView("report");
    }, 1800);
  };

  // Report Generator Logic
  const generateReport = (profileId: string, score: number, answers: Record<string, any>, symptoms: string[]): IntelligenceReport => {
    const profile = ASSESSMENT_PROFILES.find(p => p.id === profileId);
    const category = profile?.category || "metabolic";
    
    let riskClass: "Low Risk" | "Moderate Risk" | "High Risk" = "Low Risk";
    if (score < 55) riskClass = "High Risk";
    else if (score < 85) riskClass = "Moderate Risk";

    const priorityAreas: string[] = [];
    if (score < 55) {
      priorityAreas.push("Immediate clinical review of target system markers is advised.");
      priorityAreas.push("Incorporate anti-inflammatory dietary resets.");
    } else if (score < 85) {
      priorityAreas.push("Establish regular lifestyle cycles and rest boundaries.");
      priorityAreas.push("Target localized system congestion points.");
    } else {
      priorityAreas.push("Maintain current homeostatic balance.");
      priorityAreas.push("Optimize biological age profiles.");
    }
    
    if (symptoms.length > 0) {
      priorityAreas.push(`Resolve symptoms: ${symptoms.slice(0, 2).join(", ")}`);
    }

    let contributingFactors = {
      lifestyle: "Sedentary intervals, irregular activity patterns.",
      nutrition: "Suboptimal fiber consumption, mineral assimilation lag.",
      stress: "Elevated mental strain promoting sympathetic nervous states.",
      sleep: "Circadian rhythm mismatch and fragmented recovery windows.",
      genetics: "Inherent cell metabolic predispositions."
    };
    
    let suggestedLabs: string[] = ["HbA1c", "Fasting Glucose", "Vitamin D3"];
    let recommendations = {
      diet: "Low glycemic whole food options, adequate hydration.",
      exercise: "Moderate cardiovascular exercise for 150 minutes weekly.",
      sleep: "Maintain consistent bedtimes in a cool, dark room.",
      stress: "Implement 10 minutes of deep diaphragmatic breathing daily.",
      preventive: "Routine biomarker panels, blood pressure audits."
    };
    
    let homeopathicInsights = "General constitutional profiling suggests functional vitality strain. Homeopathic remedies like Sulphur or Pulsatilla may support homeostasis based on modalities.";

    if (category === "metabolic") {
      contributingFactors = {
        lifestyle: "Irregular nutritional windows, minimal daily movement index.",
        nutrition: "Frequent simple starch spikes, low prebiotic fiber intake.",
        stress: "Cortisol-driven adipose storage on the waistline.",
        sleep: "Sleep duration deficits increasing morning insulin resistance.",
        genetics: "Familial history of sluggish metabolic conversions."
      };
      suggestedLabs = ["HbA1c", "Fasting Blood Sugar", "Fasting Insulin (HOMA-IR)", "Lipid Panel"];
      recommendations = {
        diet: "Eat low-glycemic foods, increase fiber (35g/day), restrict late-night eating.",
        exercise: "Zone 2 aerobic exercise combined with mild weight resistance training.",
        sleep: "Target 8 hours of sleep; minimize blue light exposure before bed.",
        stress: "Nature walking, diaphragmatic breathing to offset nervous system triggers.",
        preventive: "Measure waist-to-height ratio quarterly; check fasting glucose semi-annually."
      };
      homeopathicInsights = "Sluggish digestive or energy conversions match a sycotic pattern. Remedies like Lycopodium Clavatum are indicated when symptoms worsen late afternoon (4-8 PM).";
    } else if (category === "endocrine") {
      contributingFactors = {
        lifestyle: "High toxic overload (environmental plasticizers), irregular sleep schedule.",
        nutrition: "Deficient selenium, zinc, or iodine blocking glandular conversions.",
        stress: "HPA axis overload suppressing thyroid-stimulating pathways.",
        sleep: "Fragmented sleep pattern lowering pituitary release cycles.",
        genetics: "Hereditary susceptibility to endocrine feedback loops."
      };
      suggestedLabs = ["TSH (Thyroid Stimulating Hormone)", "Free T3 & Free T4", "Anti-TPO Antibodies", "DHEA-S"];
      recommendations = {
        diet: "Support hormone clearance with cruciferous greens; eat selenium-dense Brazil nuts.",
        exercise: "Gentle restorative movement (yoga, walking); avoid exhaustive cardiovascular tests.",
        sleep: "Establish consistent bedtime by 10 PM; sleep in full darkness.",
        stress: "Mindfulness meditation (MBSR) to regulate adrenal-pituitary-ovarian loops.",
        preventive: "Perform basal body temperature mapping; annual thyroid ultrasounds if nodular."
      };
      homeopathicInsights = "Constitutional profile flags endocrine-thyroid axis strain (Psoric deficit). Remedies such as Calcarea Carbonica or Pulsatilla are traditionally indicated.";
    } else if (category === "cardiovascular") {
      contributingFactors = {
        lifestyle: "Sedentary workstation posture, chronic job-related anxiety.",
        nutrition: "Inadequate potassium and magnesium, excess sodium and hydrogenated fats.",
        stress: "Sympathetic dominance raising peripheral vascular resistance.",
        sleep: "Sleep apnea indicators triggering nocturnal arterial tension.",
        genetics: "Family history of early coronary artery disease or lipid shifts."
      };
      suggestedLabs = ["Apolipoprotein B", "hs-CRP (Inflammation)", "Lipid Subfractionation", "Resting ECG"];
      recommendations = {
        diet: "Mediterranean diet: extra virgin olive oil, nuts, wild-caught fatty fish.",
        exercise: "Aerobic cardiovascular training (brisk walking, swimming) 150 mins weekly.",
        sleep: "Check for sleep apnea or airway obstruction; maintain 7.5 hours.",
        stress: "Heart Rate Variability (HRV) biofeedback daily to balance cardiac nerves.",
        preventive: "Check blood pressure weekly; check Coronary Artery Calcium (CAC) if age >40."
      };
      homeopathicInsights = "Vascular resistance and stress-related tension indicates psoric tension. Remedies like Cactus Grandiflorus or Baryta Carbonica may assist systemic circulation.";
    } else if (category === "respiratory") {
      contributingFactors = {
        lifestyle: "Indoor allergen load, low relative humidity, poor aeration.",
        nutrition: "Low intake of antioxidants, high consumption of mucus-forming dairy.",
        stress: "Bronchial hypersensitivity stimulated by autonomic anxiety.",
        sleep: "Mouth breathing leading to cold, unhumidified air loading the throat.",
        genetics: "Inherited atopic traits (asthma, eczema, rhinitis)."
      };
      suggestedLabs = ["Total IgE", "Serum Vitamin D3", "Spirometry", "Inhalant Allergen Panel"];
      recommendations = {
        diet: "Incorporate antioxidant foods: berries, green tea, turmeric, raw honey.",
        exercise: "Diaphragmatic breathing; swimming or gentle indoor walking.",
        sleep: "Use HEPA air filtration; elevate head slightly to clear nasal passages.",
        stress: "Autogenic training and controlled breathing to prevent hyperventilation.",
        preventive: "Keep home humidity around 45%; check peak flow indicators daily."
      };
      homeopathicInsights = "Airway mucous membrane hypersensitivity represents a psoric diathesis. Remedies like Arsenicum Album or Natrum Sulphuricum can help optimize defense.";
    } else if (category === "digestive") {
      contributingFactors = {
        lifestyle: "Fast eating without proper chewing, post-prandial sedentary habits.",
        nutrition: "Frequent intake of emulsifiers, low diversity in prebiotic fibers.",
        stress: "Vagal nerve suppression shunting blood supply away from mucosal walls.",
        sleep: "Late night snacking altering the migrating motor complex (MMC).",
        genetics: "Familial predisposition to intestinal permeability or enzyme deficits."
      };
      suggestedLabs = ["Stool Microbiome Analysis", "Fecal Calprotectin", "Celiac Serology", "SIBO Breath Test"];
      recommendations = {
        diet: "Incorporate bone broth and steamed vegetables; eliminate gluten/emulsifiers.",
        exercise: "Take a 15-minute gentle stroll immediately after major meals.",
        sleep: "Maintain a 3-hour fasting window before sleep; sleep on the left side.",
        stress: "Practice relaxed breathing at meal times; avoid checking screens while eating.",
        preventive: "Perform annual stool tests; track bowel consistency and timing."
      };
      homeopathicInsights = "Portal venous congestion and gastrointestinal stagnation map to a sycotic pattern. Constitutional Nux Vomica or Lycopodium is helpful.";
    } else if (category === "skin") {
      contributingFactors = {
        lifestyle: "Use of petroleum-based topical lotions, excessive hot showering.",
        nutrition: "Essential fatty acid deficiency, food sensitivity triggers (dairy/wheat).",
        stress: "Neuropeptide release worsening epidermal cellular inflammation.",
        sleep: "Shortened sleep cycles reducing overnight epidermal skin cell repairs.",
        genetics: "Filaggrin mutations lowering skin cell lipid barrier strength."
      };
      suggestedLabs = ["Food Sensitivity Panel", "Serum Zinc", "Thyroid Panel", "Vitamin D3"];
      recommendations = {
        diet: "Eliminate dairy and sugar; consume wild salmon, walnuts, chia seeds.",
        exercise: "Engage in moderate-intensity sweat training, followed immediately by a cool rinse.",
        sleep: "Target 8 hours of sleep; maintain a cool, clean sleeping environment.",
        stress: "Autogenic relaxation techniques to modulate stress-dermal flare-ups.",
        preventive: "Use ceramide-rich skin barriers; avoid scrubbing or hot baths."
      };
      homeopathicInsights = "Skin rashes represent the body's primary route of psoric toxin elimination. Sulphur, Graphites, or Mezereum may help regulate outer tissue clearing.";
    } else if (category === "mental") {
      contributingFactors = {
        lifestyle: "Excess screen exposure, lack of nature contact, social isolation.",
        nutrition: "Amino acid deficits, low magnesium, excessive intake of stimulants.",
        stress: "Chronic autonomic hyper-arousal without nervous recovery states.",
        sleep: "Fragmented REM sleep limiting emotional processing capacity.",
        genetics: "Inherited variations in serotonin/dopamine metabolic pathways."
      };
      suggestedLabs = ["MTHFR Genotype", "Urinary Organic Acids", "Salivary Cortisol Rhythm", "Vitamin B12"];
      recommendations = {
        diet: "Incorporate magnesium-rich seeds, dark chocolate, and prebiotic foods.",
        exercise: "Nature forest walking (Shinrin-yoku) for 30 minutes daily; yoga.",
        sleep: "Implement a digital wind-down hour; sleep in absolute quiet.",
        stress: "Daily mindfulness meditation, deep breathing, and emotional journaling.",
        preventive: "Track mood changes against sleep metrics; minimize social media."
      };
      homeopathicInsights = "Mental-emotional symptoms are the highest guide to remedy selection. Constitutional matches like Ignatia Amara or Kali Phosphoricum can support nervous system resilience.";
    } else if (category === "womens") {
      contributingFactors = {
        lifestyle: "Exposure to endocrine disruptors, lack of pelvic movement.",
        nutrition: "Inadequate soluble fiber to excrete estrogen, excessive simple sugars.",
        stress: "High cortisol inhibiting hypothalamic-pituitary-ovarian communication.",
        sleep: "Inadequate sleep lowering nocturnal LH and melatonin secretion.",
        genetics: "Familial tendencies toward ovarian follicle clusters or early menopause."
      };
      suggestedLabs = ["LH / FSH Ratio", "Free and Total Testosterone", "Estradiol & Progesterone (Day 21)", "DHEA-S"];
      recommendations = {
        diet: "Cruciferous greens to clear estrogens; support cycle with seed cycling.",
        exercise: "Compound resistance training to lower insulin; core movements.",
        sleep: "Sleep 8 hours to support progesterone synthesis.",
        stress: "Acupressure or restorative yoga for pelvic circulatory health.",
        preventive: "Perform breast exams; track cycle length and ovulation patterns."
      };
      homeopathicInsights = "Pelvic congestion patterns suggest a sycotic stagnation. Pulsatilla Nigricans or Sepia Officinalis can assist in regulating cyclical rhythms.";
    } else if (category === "childrens") {
      contributingFactors = {
        lifestyle: "Insufficient outdoor sun play, early device and screen overload.",
        nutrition: "Excessive refined sugars, food colorings, lack of prebiotic fibers.",
        stress: "Sensory processing overload in high-stimulation settings.",
        sleep: "Varying sleep schedule reducing growth hormone release.",
        genetics: "Inherited immune diathesis or allergic sensitivities."
      };
      suggestedLabs = ["Serum Ferritin", "Parasitology Check", "Vitamin D3", "IgE Allergy Panel"];
      recommendations = {
        diet: "High-protein breakfast, fresh berries, minimize artificial coloring.",
        exercise: "Active outdoor play for at least 60-90 minutes daily.",
        sleep: "Bedtime routine starting at 8:30 PM with zero screens.",
        stress: "Establishing predictable daily routines and sensory breaks.",
        preventive: "Monitor height/weight growth curve; periodic pediatric checkups."
      };
      homeopathicInsights = "Children's responsive vital forces react strongly to remedies. Calcarea Phosphorica or Chamomilla may help guide growth and immunity pathways.";
    }

    return {
      healthScore: score,
      riskClass,
      priorityAreas,
      miasmaticProfile: { psora: 33, sycosis: 33, syphilis: 34 }, // will be updated by caller
      organLoad: score === 100 ? 10 : Math.round(100 - score * 0.95),
      contributingFactors,
      suggestedLabs,
      recommendations,
      homeopathicInsights
    };
  };

  // Constitutional Wizard Helpers
  const handleStartConstitutional = () => {
    setConstitutionalAnswers({});
    setConstStep(0);
    setActiveView("constitutional");
  };

  const handleConstitutionalAnswer = (qId: string, option: string) => {
    const nextAnswers = { ...constitutionalAnswers, [qId]: option };
    setConstitutionalAnswers(nextAnswers);
    
    if (constStep < CONSTITUTIONAL_QUESTIONS.length - 1) {
      setConstStep(constStep + 1);
    } else {
      setConstIsCalculating(true);
      setTimeout(() => {
        const profile = analyzeConstitution(nextAnswers);
        
        const updatedTwin: HealthDigitalTwin = {
          ...digitalTwin,
          constitutional: profile
        };
        
        saveDigitalTwin(updatedTwin);
        setConstIsCalculating(false);
        setActiveView("dashboard");
      }, 1500);
    }
  };

  // Lab Upload Helpers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLabFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLabFile(e.target.files[0].name);
    }
  };

  const processLabFile = (fileName: string) => {
    setLabParsing(true);
    setTimeout(() => {
      const result = parseLabReport(fileName, labRawText);
      setLabResult(result);
      setLabParsing(false);
      setActiveView("lab_upload");
    }, 1800);
  };

  const handleLoadSampleLab = (name: string) => {
    setLabParsing(true);
    setTimeout(() => {
      const result = parseLabReport(name, "");
      setLabResult(result);
      setLabParsing(false);
      setActiveView("lab_upload");
    }, 1500);
  };

  // UI Active Navigation Category Filter
  const activeAssessmentsList = ASSESSMENT_PROFILES.filter(p => p.category === activeCategory);
  const selectedProfile = ASSESSMENT_PROFILES.find(p => p.id === selectedProfileId);

  // Strength and Vulnerability analysis from system scores
  const strengths: string[] = [];
  const vulnerabilities: string[] = [];
  Object.keys(digitalTwin.systemScores).forEach(key => {
    const val = digitalTwin.systemScores[key as keyof SystemScores];
    const systemName = key.charAt(0).toUpperCase() + key.slice(1);
    if (val >= 90) strengths.push(`Excellent ${systemName} efficiency`);
    else if (val <= 75) vulnerabilities.push(`${systemName} reserve depleted`);
  });

  const nextAssessments = ASSESSMENT_PROFILES.filter(
    p => !digitalTwin.completedAssessments[p.id]
  ).slice(0, 3);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-pearl dark:bg-[#070b13] text-slate-800 dark:text-zinc-150 font-sans transition-colors duration-500">
      
      {/* Dynamic SEO JSON-LD Injected Schema */}
      <SchemaMarkup profileId={selectedProfileId || ""} />

      {/* Ambient Blur Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-mint/5 dark:bg-mint/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Dynamic Nav Breadcrumbs (print:hidden) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          {activeView !== "dashboard" ? (
            <button 
              onClick={() => { setActiveView("dashboard"); setSelectedProfileId(null); setAnswers({}); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-mint hover:text-teal-600 transition-all cursor-pointer border-none bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Health Dashboard
            </button>
          ) : (
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Health Intelligence Portal
            </div>
          )}

          {/* Reset profile state */}
          {Object.keys(digitalTwin.completedAssessments).length > 0 && (
            <button
              onClick={handleResetTwin}
              className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors border-none bg-transparent cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Digital Twin
            </button>
          )}
        </div>

        {/* ECG Monitor Section (Collapsible) */}
        <div className="mb-8 print:hidden">
          <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] overflow-hidden shadow-sm">
            <button
              onClick={() => setIsEcgExpanded(!isEcgExpanded)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 dark:text-zinc-150 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all border-none bg-transparent cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-mint animate-pulse" />
                <span className="font-serif text-base font-bold text-slate-950 dark:text-white">ECG Monitor</span>
                <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">
                  {isEcgExpanded ? "Collapse Monitor" : "Expand Monitor"}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isEcgExpanded ? "rotate-90" : ""}`} />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isEcgExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-t border-slate-100 dark:border-slate-800/80 overflow-hidden"
                >
                  <div className="p-2 md:p-4 bg-slate-50/20 dark:bg-slate-950/10">
                    <EcgGraph />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Outer Workspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* SIDEBAR: PERSISTENT HEALTH DIGITAL TWIN VIEW (4 cols)      */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            
            {/* Digital Twin Overall Vitality Gauge */}
            <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 block">
                Homeostatic Digital Twin OS™
              </span>

              {/* Large Ring Gauge */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-slate-100 dark:stroke-slate-800/80 fill-none" strokeWidth="6" />
                  <motion.circle 
                    cx="50" cy="50" r="42" 
                    className="stroke-mint fill-none" 
                    strokeWidth="6"
                    strokeDasharray={263.8}
                    initial={{ strokeDashoffset: 263.8 }}
                    animate={{ strokeDashoffset: 263.8 - (263.8 * digitalTwin.overallScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-serif font-black text-slate-900 dark:text-white leading-none">
                    {digitalTwin.overallScore}%
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest mt-1.5">
                    Overall Health
                  </span>
                </div>
              </div>

              {/* Digital Twin mini statistics */}
              <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs font-semibold">
                <div className="text-center">
                  <span className="text-[8.5px] text-slate-400 uppercase tracking-wider block font-extrabold mb-0.5">Completed</span>
                  <span className="text-slate-800 dark:text-white font-mono">
                    {Object.keys(digitalTwin.completedAssessments).length} Modules
                  </span>
                </div>
                <div className="text-center border-l border-slate-100 dark:border-slate-800/80">
                  <span className="text-[8.5px] text-slate-400 uppercase tracking-wider block font-extrabold mb-0.5">Active Flags</span>
                  <span className={`font-mono ${digitalTwin.activeRulesFlags.length > 0 ? "text-amber-500 font-bold" : "text-slate-500"}`}>
                    {digitalTwin.activeRulesFlags.length} Systemic
                  </span>
                </div>
              </div>
            </div>

            {/* Radar System Health Wheel Chart */}
            <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-5 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">
                Functional Radar Map
              </span>
              <RadarChart scores={digitalTwin.systemScores} theme={theme} />
            </div>

            {/* Clinical Warning Flags & Priorities */}
            {digitalTwin.activeRulesFlags.length > 0 && (
              <div className="glass-panel border border-amber-250 dark:border-amber-900/30 bg-amber-50/10 dark:bg-amber-950/5 rounded-[28px] p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Clinical Axis Alerts</span>
                </div>
                <div className="space-y-1.5">
                  {digitalTwin.activeRulesFlags.map((flag, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/10 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Miasmatic Profile Accumulation */}
            {Object.keys(digitalTwin.completedAssessments).length > 0 && (
              <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                  Miasmatic Burden Distribution
                </span>
                {/* Dynamically get miasmatic percentages from last report or run engine check */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-slate-500">Psora (Sensory Hyper-reactivity)</span>
                      <span className="text-amber-500 font-mono font-bold">
                        {Math.round(100 - digitalTwin.overallScore * 0.4)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${Math.round(100 - digitalTwin.overallScore * 0.4)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-slate-500">Sycosis (Metabolic Sluggishness)</span>
                      <span className="text-teal-500 font-mono font-bold">
                        {Math.round(digitalTwin.organLoad.pancreas * 0.8 + 15)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full" style={{ width: `${Math.round(digitalTwin.organLoad.pancreas * 0.8 + 15)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Constitutional Profile Match Details */}
            {digitalTwin.constitutional ? (
              <div className="glass-panel border border-violet-200/50 dark:border-violet-900/20 bg-violet-50/10 dark:bg-violet-950/5 rounded-[28px] p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                    <User className="w-4.5 h-4.5" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">Constitutional Match</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 text-[8.5px] font-bold uppercase tracking-wider">Mapped</span>
                </div>
                <div className="p-3 bg-violet-100/30 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/10 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex justify-between">
                    <span className="text-slate-400 font-normal">Remedy Group:</span>
                    {digitalTwin.constitutional.remedyMatch}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex justify-between">
                    <span className="text-slate-400 font-normal">System Focus:</span>
                    {digitalTwin.constitutional.systemDominance}
                  </div>
                  <div className="text-xs text-slate-500 leading-normal border-t border-violet-200/20 pt-1.5">
                    {digitalTwin.constitutional.adaptivePattern}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 rounded-[28px] p-5 shadow-sm text-center space-y-3">
                <p className="text-xs text-slate-500">Constitutional homeopathic mapping not initialized yet.</p>
                <button
                  onClick={handleStartConstitutional}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors border-none shadow-sm"
                >
                  Map Constitution
                </button>
              </div>
            )}

            {/* History timeline of completed assessments */}
            {Object.keys(digitalTwin.completedAssessments).length > 0 && (
              <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                  Completed Evaluations
                </span>
                <div className="space-y-3.5">
                  {Object.keys(digitalTwin.completedAssessments).map(key => {
                    const item = digitalTwin.completedAssessments[key];
                    const prof = ASSESSMENT_PROFILES.find(p => p.id === key);
                    return (
                      <div key={key} className="flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-slate-800 dark:text-zinc-200">{prof?.name}</h5>
                          <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                        </div>
                        <span className="font-mono font-bold text-mint bg-mint/5 px-2 py-0.5 rounded-md text-[11px]">
                          {item.score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* MAIN VIEWPORT: ACTIVE DISPLAY (8 cols)                     */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              
              {/* VIEW: MAIN DASHBOARD AND CATEGORIES SELECTOR */}
              {activeView === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  
                  {/* Digital Twin Welcome Banner */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm">
                    <div className="space-y-3 text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/15 dark:bg-mint/5 text-[9.5px] font-bold uppercase tracking-wider text-mint shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Clinical Intelligence Active</span>
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                        Personal Health Digital Twin
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md leading-relaxed">
                        {Object.keys(digitalTwin.completedAssessments).length > 0
                          ? "Your clinical digital twin computes multi-system organ risks, active diathesis states, and suggests preventative medical screenings."
                          : "Configure your biological twin. Select any health intelligence module below to complete self-assessments and calculate your homeostatic indices."}
                      </p>
                    </div>

                    {/* Quick navigation CTAs */}
                    <div className="flex flex-col gap-3.5 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => handleLoadSampleLab("TSH: 8.4 (Thyroid Panel)")}
                        className="py-3 px-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-mint text-slate-700 dark:text-zinc-200 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <UploadCloud className="w-4 h-4 text-mint" />
                        Upload Lab Report
                      </button>
                      
                      <button
                        onClick={handleStartConstitutional}
                        className="py-3 px-5 bg-mint hover:bg-teal-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-teal-500/10 transition-all border-none flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-4 h-4" />
                        Map Constitutional Miasms
                      </button>
                    </div>
                  </div>

                  {/* Digital Twin Strengths / Vulnerabilities summary */}
                  {Object.keys(digitalTwin.completedAssessments).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Strength Areas */}
                      <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/75 dark:bg-slate-900/65 rounded-[28px] p-5 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-emerald-500" />
                          Biological Strengths
                        </h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-zinc-350">
                          {strengths.length > 0 ? (
                            strengths.slice(0, 3).map((st, i) => (
                              <li key={i} className="flex items-center gap-2 p-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                {st}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400 font-normal">Complete further assessments to map strength indicators.</li>
                          )}
                        </ul>
                      </div>

                      {/* Vulnerability Areas */}
                      <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/75 dark:bg-slate-900/65 rounded-[28px] p-5 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          Priority Vulnerabilities
                        </h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-zinc-350">
                          {vulnerabilities.length > 0 ? (
                            vulnerabilities.slice(0, 3).map((vl, i) => (
                              <li key={i} className="flex items-center gap-2 p-1 text-rose-600 dark:text-rose-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                {vl}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400 font-normal">No major vulnerabilities currently flagged. Take more tests to monitor.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Laboratory Report Upload & Parser Segment */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4.5 h-4.5 text-mint" />
                        AI Lab Report Intelligence™
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Upload a biomarker diagnostic report (PDF/JPG) or run a simulated screening parser.
                      </p>
                    </div>

                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
                        dragActive 
                          ? "border-mint bg-mint/5" 
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-750 bg-slate-50/50 dark:bg-slate-950/20"
                      }`}
                    >
                      <input 
                        type="file" 
                        id="lab-upload-input" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept="image/*,application/pdf"
                      />
                      <label htmlFor="lab-upload-input" className="cursor-pointer space-y-3 block">
                        {labParsing ? (
                          <div className="flex flex-col items-center gap-2 py-4">
                            <RefreshCw className="w-8 h-8 text-mint animate-spin" />
                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">Processing OCR extraction & biomarker ranges...</span>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 text-slate-350 dark:text-slate-700 mx-auto" />
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-zinc-200">Drag and drop file here, or click to upload</p>
                              <p className="text-[10px] text-slate-400 mt-1">PDF or image formats accepted</p>
                            </div>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Pre-configured clinical samples for easy user evaluation */}
                    <div className="space-y-2">
                      <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Select a Sample Lab Report to Analyze:
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        <button
                          onClick={() => handleLoadSampleLab("thyroid_test.pdf")}
                          className="py-2.5 px-3 border border-slate-150 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-mint hover:bg-mint/5 rounded-xl text-[10px] font-bold text-slate-600 dark:text-zinc-350 cursor-pointer transition-colors"
                        >
                          🧪 Thyroid Panel
                        </button>
                        <button
                          onClick={() => handleLoadSampleLab("glycemic_hba1c.pdf")}
                          className="py-2.5 px-3 border border-slate-150 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-mint hover:bg-mint/5 rounded-xl text-[10px] font-bold text-slate-600 dark:text-zinc-350 cursor-pointer transition-colors"
                        >
                          🩸 Glycemic Panel
                        </button>
                        <button
                          onClick={() => handleLoadSampleLab("renal_filtration.pdf")}
                          className="py-2.5 px-3 border border-slate-150 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-mint hover:bg-mint/5 rounded-xl text-[10px] font-bold text-slate-600 dark:text-zinc-350 cursor-pointer transition-colors"
                        >
                          腎 Renal filtration
                        </button>
                        <button
                          onClick={() => handleLoadSampleLab("vitamin_deficiencies.pdf")}
                          className="py-2.5 px-3 border border-slate-150 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-mint hover:bg-mint/5 rounded-xl text-[10px] font-bold text-slate-600 dark:text-zinc-350 cursor-pointer transition-colors"
                        >
                          💊 Vitamin Panel
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Category Selector */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                      Select System Intelligence Category
                    </span>
                    
                    {/* Category tabs */}
                    <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none snap-x snap-mandatory">
                      {ASSESSMENT_CATEGORIES.map(cat => {
                        const isActive = cat.id === activeCategory;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4.5 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer snap-start ${
                              isActive 
                                ? "bg-mint text-white shadow-sm shadow-teal-500/10" 
                                : "bg-white/80 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-zinc-400"
                            }`}
                          >
                            {cat.name.split(" ")[0]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Grid of assessments in active category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeAssessmentsList.map(profile => {
                        const isCompleted = !!digitalTwin.completedAssessments[profile.id];
                        const lastScore = digitalTwin.completedAssessments[profile.id]?.score;
                        return (
                          <div
                            key={profile.id}
                            onClick={() => handleSelectProfile(profile.id)}
                            className={`glass-panel border rounded-[24px] p-5 flex flex-col justify-between h-[180px] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900/60 ${profile.gradient}`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${profile.badgeBg}`}>
                                  Assessment
                                </span>
                                {isCompleted && (
                                  <span className="font-mono text-[9px] font-bold text-mint bg-mint/5 px-2 py-0.5 rounded">
                                    Score: {lastScore}%
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                {profile.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal line-clamp-2">
                                {profile.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-mint group">
                              {isCompleted ? "Re-evaluate Module" : "Begin assessment"}
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* VIEW: MULTI-STEP ASSESSMENT QUESTIONNAIRE WIZARD */}
              {activeView === "assessment" && selectedProfile && (
                <motion.div
                  key="assessment"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/75 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 max-w-xl mx-auto"
                >
                  
                  {/* Category Pill and Title */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-mint bg-mint/5 px-2.5 py-1 rounded-full">
                      Step {currentStep + 1} of {selectedProfile.questions.length + 1}
                    </span>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {selectedProfile.name}
                    </h3>
                  </div>

                  {/* Progress Line Bar */}
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="bg-mint h-full transition-all duration-300"
                      style={{ width: `${((currentStep) / (selectedProfile.questions.length + 1)) * 100}%` }}
                    ></div>
                  </div>

                  {/* Wizard View Controller */}
                  {currentStep < selectedProfile.questions.length ? (
                    
                    // QUESTION STEPS
                    <div className="space-y-6 py-4">
                      {(() => {
                        const q = selectedProfile.questions[currentStep];
                        return (
                          <div className="space-y-4">
                            <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-start gap-2 leading-relaxed">
                              <HelpCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                              {q.label}
                            </h4>

                            {q.type === "select" && (
                              <div className="space-y-3">
                                {q.options?.map((opt, i) => {
                                  const isSelected = answers[q.id] === opt;
                                  return (
                                    <button
                                      key={i}
                                      onClick={() => {
                                        handleInputChange(q.id, opt);
                                        // Auto-advance for select questions
                                        setTimeout(() => {
                                          setCurrentStep(currentStep + 1);
                                        }, 200);
                                      }}
                                      className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                                        isSelected 
                                          ? "bg-mint/5 border-mint text-mint-dark dark:text-mint" 
                                          : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-850 hover:bg-slate-100/30 text-slate-650 dark:text-zinc-400"
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {q.type === "range" && (
                              <div className="space-y-5 py-4">
                                <div className="flex justify-between items-center px-1">
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{q.labelMin}</span>
                                  <span className="font-serif text-3xl font-black text-mint font-mono">{answers[q.id]}</span>
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{q.labelMax}</span>
                                </div>
                                <input 
                                  type="range"
                                  min={q.min}
                                  max={q.max}
                                  value={answers[q.id] || 5}
                                  onChange={(e) => handleInputChange(q.id, Number(e.target.value))}
                                  className="w-full accent-mint"
                                />
                                <button
                                  onClick={() => setCurrentStep(currentStep + 1)}
                                  className="w-full py-3.5 bg-mint hover:bg-teal-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer border-none shadow-sm flex items-center justify-center gap-1.5"
                                >
                                  Next Question
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                  ) : (
                    
                    // SYMPTOMS CHECKLIST STEP
                    <div className="space-y-6 py-4">
                      <div className="space-y-1">
                        <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-100">Verify Constitutional Modalities</h4>
                        <p className="text-[11px] text-slate-400 leading-normal">Select any specific active symptoms to calculate homeopathic miasmatic loads.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProfile.symptomsList.map(sym => {
                          const isChecked = selectedSymptoms.includes(sym);
                          return (
                            <div
                              key={sym}
                              onClick={() => toggleSymptom(sym)}
                              className={`p-3.5 rounded-2xl border text-xs cursor-pointer flex items-start gap-2.5 transition-all duration-200 ${
                                isChecked 
                                  ? "bg-mint/5 border-mint text-mint-dark dark:text-mint" 
                                  : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-850 hover:bg-slate-100/30 text-slate-650 dark:text-zinc-400"
                              }`}
                            >
                              <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                isChecked ? "bg-mint border-mint text-white" : "border-slate-350 dark:border-slate-850 bg-white dark:bg-slate-900"
                              }`}>
                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="leading-snug">{sym}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="py-3 px-5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-zinc-400 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleCalculateAssessment}
                          disabled={isCalculating}
                          className="flex-1 py-3.5 bg-mint hover:bg-teal-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer border-none shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5"
                        >
                          {isCalculating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Compiling report...
                            </>
                          ) : (
                            <>
                              <Activity className="w-4 h-4" />
                              Compile Intelligence Report
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wizard navigation indicators */}
                  {currentStep < selectedProfile.questions.length && (
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {currentStep > 0 ? (
                        <button 
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="text-slate-450 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                        >
                          Previous Question
                        </button>
                      ) : (
                        <div />
                      )}
                      <span>Step {currentStep + 1} of {selectedProfile.questions.length + 1}</span>
                    </div>
                  )}

                </motion.div>
              )}

              {/* VIEW: CONSTITUTIONAL PARAMETERS WIZARD */}
              {activeView === "constitutional" && (
                <motion.div
                  key="constitutional"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/75 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 max-w-xl mx-auto"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-500 bg-violet-50 dark:bg-violet-950/20 px-2.5 py-1 rounded-full">
                      Step {constStep + 1} of {CONSTITUTIONAL_QUESTIONS.length}
                    </span>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                      <Layers className="w-5 h-5 text-violet-500" />
                      Constitutional Intelligence Module
                    </h3>
                  </div>

                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="bg-violet-600 h-full transition-all duration-300"
                      style={{ width: `${((constStep + 1) / CONSTITUTIONAL_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>

                  {constIsCalculating ? (
                    <div className="text-center py-8 space-y-4">
                      <RefreshCw className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                      <p className="text-xs text-slate-500">Processing constitutional modalities & remedy matching...</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {(() => {
                        const q = CONSTITUTIONAL_QUESTIONS[constStep];
                        return (
                          <div className="space-y-4">
                            <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-150 leading-relaxed">
                              {q.label}
                            </h4>
                            <div className="space-y-3">
                              {q.options.map((opt, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleConstitutionalAnswer(q.id, opt)}
                                  className="w-full text-left p-4 rounded-2xl border text-xs font-semibold cursor-pointer hover:bg-violet-50/50 dark:hover:bg-violet-950/20 border-slate-200/60 dark:border-slate-850 text-slate-650 dark:text-zinc-400 transition-all"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex gap-4 pt-4">
                        {constStep > 0 && (
                          <button
                            onClick={() => setConstStep(constStep - 1)}
                            className="py-3 px-5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-zinc-400 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            Back
                          </button>
                        )}
                        <button
                          onClick={() => setActiveView("dashboard")}
                          className="py-3 px-5 border border-transparent text-slate-400 hover:text-slate-600 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-colors border-none bg-transparent"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* VIEW: LAB REPORT OCR ANALYSIS RESULTS */}
              {activeView === "lab_upload" && labResult && (
                <motion.div
                  key="lab_upload"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/75 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-mint bg-mint/5 px-2.5 py-1 rounded-full">
                        OCR Interpretation
                      </span>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        Biomarker Summary Analysis
                      </h3>
                    </div>

                    <button
                      onClick={() => setActiveView("dashboard")}
                      className="py-2.5 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-zinc-300 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Summary paragraph */}
                  <div className="p-4 bg-mint/5 dark:bg-mint/5 rounded-2xl border border-mint/20 text-xs leading-relaxed text-slate-750 dark:text-zinc-300 font-medium flex gap-2">
                    <Info className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                    <span>{labResult.summary}</span>
                  </div>

                  {/* Biomarkers Table */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                      Extracted Biomarker Ranges
                    </span>
                    
                    <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-150 dark:divide-slate-800/80">
                      {labResult.extractedData.map((data, idx) => (
                        <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 dark:bg-slate-950/10">
                          <div className="space-y-1 md:max-w-[65%]">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-slate-800 dark:text-white">{data.marker}</h5>
                              <span className={`text-[8.5px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                data.status === "Normal" 
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" 
                                  : data.status === "Elevated" 
                                    ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400" 
                                    : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                              }`}>
                                {data.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">{data.significance}</p>
                          </div>
                          
                          <div className="flex md:flex-col justify-between items-end shrink-0">
                            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{data.value}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">Ref: {data.range}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Questions & Follow-ups */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Questions for your Doctor:
                      </span>
                      <div className="space-y-2">
                        {labResult.questions.map((q, idx) => (
                          <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-xl text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Recommended Follow-ups:
                      </span>
                      <div className="space-y-2">
                        {labResult.followUp.map((f, idx) => (
                          <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-xl text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-mint shrink-0"></span>
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lab booking CTA */}
                  <div className="p-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-teal-100 max-w-md">
                      These biomarkers suggest subclinical pathways. A comprehensive homeopathic diagnostic session will map constitutional remedies to restore normal ranges.
                    </p>
                    <Link
                      href="https://homeo.healthcare/#booking"
                      className="py-3 px-5 bg-white text-teal-700 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm text-center shrink-0 transition-transform active:scale-98"
                    >
                      Book Consultation
                    </Link>
                  </div>

                </motion.div>
              )}

              {/* VIEW: DETAILED AI HEALTH INTELLIGENCE REPORT */}
              {activeView === "report" && activeReport && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 print:w-full print:p-0 print:m-0"
                >
                  
                  {/* Report Header Card */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/75 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint bg-mint/5 px-2.5 py-1 rounded-full">
                        AI HEALTH REPORT
                      </span>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                        {selectedProfile?.name}
                      </h2>
                      <p className="text-xs text-slate-400">Analysis completed on {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-4 items-center shrink-0 w-full md:w-auto justify-between">
                      {/* Metric Score Dial */}
                      <div className="text-right">
                        <span className="text-[8.5px] text-slate-400 uppercase tracking-widest block font-extrabold mb-0.5">Homeostatic Index</span>
                        <span className="text-3xl font-serif font-black text-slate-900 dark:text-white">{activeReport.healthScore}%</span>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                        activeReport.riskClass === "High Risk" 
                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/20" 
                          : activeReport.riskClass === "Moderate Risk" 
                            ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border border-amber-100 dark:border-amber-900/20" 
                            : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/20"
                      }`}>
                        {activeReport.riskClass}
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Executive Summary */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                      Executive Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Priority Actions:</h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-350">
                          {activeReport.priorityAreas.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 leading-relaxed font-semibold">
                              <Check className="w-4.5 h-4.5 text-mint shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Gauge Indicators */}
                      <div className="space-y-4">
                        {/* Target organ load indicator */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-slate-500 uppercase tracking-widest text-[9.5px]">Computed Organ stress load</span>
                            <span className="text-rose-500 font-mono font-bold">{activeReport.organLoad}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${activeReport.organLoad > 70 ? "bg-rose-500" : activeReport.organLoad > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${activeReport.organLoad}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Miasmatic balance details */}
                        <div className="grid grid-cols-3 gap-3 text-center pt-2">
                          <div className="p-2 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-xl">
                            <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-extrabold mb-1">Psora</span>
                            <span className="text-xs font-bold text-amber-500 font-mono">{activeReport.miasmaticProfile.psora}%</span>
                          </div>
                          <div className="p-2 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-xl">
                            <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-extrabold mb-1">Sycosis</span>
                            <span className="text-xs font-bold text-teal-500 font-mono">{activeReport.miasmaticProfile.sycosis}%</span>
                          </div>
                          <div className="p-2 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-xl">
                            <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-extrabold mb-1">Syphilis</span>
                            <span className="text-xs font-bold text-rose-500 font-mono">{activeReport.miasmaticProfile.syphilis}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Possible Contributing Factors */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                      Possible Contributing Factors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-1 p-3.5 bg-slate-50/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Lifestyle</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.contributingFactors.lifestyle}</p>
                      </div>
                      <div className="space-y-1 p-3.5 bg-slate-50/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Nutrition</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.contributingFactors.nutrition}</p>
                      </div>
                      <div className="space-y-1 p-3.5 bg-slate-50/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Stress Factor</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.contributingFactors.stress}</p>
                      </div>
                      <div className="space-y-1 p-3.5 bg-slate-50/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Sleep Architecture</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.contributingFactors.sleep}</p>
                      </div>
                      <div className="space-y-1 p-3.5 bg-slate-50/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Genetics</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.contributingFactors.genetics}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Suggested Investigations */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                      Suggested Investigations
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      The clinical rules engine suggests the following laboratory testing to evaluate subclinical homeostatic biomarkers:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeReport.suggestedLabs.map((lab, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2.5">
                          <span className="p-1.5 bg-mint/10 rounded-lg text-mint">
                            <FileText className="w-4 h-4" />
                          </span>
                          {lab}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Personalized Recommendations */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                      Personalized Recommendations
                    </h3>
                    
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      <div className="py-3.5 flex flex-col md:flex-row md:items-start gap-4">
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider w-36 shrink-0 mt-0.5">Dietary Protocol</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.recommendations.diet}</p>
                      </div>
                      <div className="py-3.5 flex flex-col md:flex-row md:items-start gap-4">
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider w-36 shrink-0 mt-0.5">Exercise Guidelines</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.recommendations.exercise}</p>
                      </div>
                      <div className="py-3.5 flex flex-col md:flex-row md:items-start gap-4">
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider w-36 shrink-0 mt-0.5">Sleep & Circadian</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.recommendations.sleep}</p>
                      </div>
                      <div className="py-3.5 flex flex-col md:flex-row md:items-start gap-4">
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider w-36 shrink-0 mt-0.5">Stress Regulation</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.recommendations.stress}</p>
                      </div>
                      <div className="py-3.5 flex flex-col md:flex-row md:items-start gap-4">
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider w-36 shrink-0 mt-0.5">Preventative Care</span>
                        <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">{activeReport.recommendations.preventive}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Homeopathic Insights */}
                  {activeReport.homeopathicInsights && (
                    <div className="glass-panel border border-violet-200/50 dark:border-violet-900/20 bg-violet-50/5 dark:bg-violet-950/5 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-violet-500 border-b border-violet-100 dark:border-violet-850 pb-2 mb-4 flex items-center gap-1.5">
                        <Layers className="w-5 h-5" />
                        Homeopathic Clinical Insights
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-350 font-medium italic">
                        {activeReport.homeopathicInsights}
                      </p>
                      <div className="p-3 bg-violet-100/10 border border-violet-200/20 rounded-xl text-[10px] text-violet-500 font-semibold leading-normal">
                        * Note: Homeopathic constitutional observations map biological reactivity tendencies (diathesis) to aid lifestyle balance. They are educational and do not constitute direct medical diagnostic claims.
                      </div>
                    </div>
                  )}

                  {/* Booking and Print Actions (print:hidden) */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-slate-900/40 p-4 border border-slate-200/50 dark:border-slate-800/80 rounded-[28px] print:hidden">
                    <button
                      onClick={() => window.print()}
                      className="py-3 px-5 border border-slate-250 dark:border-slate-800 hover:border-slate-450 bg-white dark:bg-slate-950 text-slate-700 dark:text-zinc-200 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 active:scale-98"
                    >
                      <Printer className="w-4.5 h-4.5" />
                      Print Health Report
                    </button>

                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => { setActiveView("dashboard"); setSelectedProfileId(null); setAnswers({}); }}
                        className="py-3 px-5 text-slate-500 hover:text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer border-none bg-transparent"
                      >
                        Dashboard
                      </button>
                      
                      <Link
                        href="https://homeo.healthcare/#booking"
                        className="py-3 px-6 bg-mint hover:bg-teal-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer shadow-sm text-center transition-all flex items-center gap-1 active:scale-98"
                      >
                        Request Professional Review
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* Floating AI Health Assistant Chat Widget (print:hidden) */}
      <div className="print:hidden">
        <HealthAssistant 
          twin={digitalTwin} 
          theme={theme}
          onSelectProfile={handleSelectProfile}
        />
      </div>

    </div>
  );
}
