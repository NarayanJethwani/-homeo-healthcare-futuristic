"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Sparkles, Heart, Sliders, ChevronRight, Play, Check, 
  ArrowLeft, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, FileText, Calendar 
} from "lucide-react";
import Link from "next/link";

// 6 Health Assessments metadata
const ASSESSMENT_PROFILES = [
  {
    id: "metabolic",
    name: "Metabolic Health Profile",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 hover:border-teal-500/50",
    textClass: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
    description: "Evaluates metabolic rate, digestive efficiency, cellular energy levels, and metabolic indicators.",
    questions: [
      { id: "weight_change", label: "Recent unexplained weight fluctuation", type: "select", options: ["None", "Minor increase", "Significant increase", "Fluctuating"] },
      { id: "bloating", label: "Digestive gas & bloating frequency", type: "select", options: ["Rarely", "Occasionally (after meals)", "Frequently", "Almost constant"] },
      { id: "thermal", label: "General temperature sensation", type: "select", options: ["Warm-blooded (prefer cold)", "Chilly (sensitive to cold)", "Neutral / normal", "Highly sensitive to both"] },
      { id: "sweet_craving", label: "Craving for sweets and carbs", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Extremely Intense" },
      { id: "metabolic_sluggishness", label: "Sluggishness or heavy feeling in body", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Constant" }
    ],
    symptomsList: [
      "Abdominal flatulence worse 4-8 PM",
      "Post-meal drowsiness and brain fog",
      "Constipation alternating with loose stools",
      "Sour eructations or acid reflux"
    ]
  },
  {
    id: "diabetes",
    name: "Diabetes & Glycemic Risk Evaluation",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    description: "Measures glycemic patterns, insulin sensitivity trends, hydration requirements, and genetic markers.",
    questions: [
      { id: "thirst", label: "Unusual dry mouth & constant thirst", type: "select", options: ["Normal", "Mild thirst", "Frequent intense thirst", "Polydipsia (extreme thirst)"] },
      { id: "urination", label: "Urination frequency (especially at night)", type: "select", options: ["Normal (0-1 times)", "Slightly increased (2 times)", "Frequent nocturia (3+ times)", "Extremely high frequency"] },
      { id: "family_history", label: "Family history of glycemic challenges", type: "select", options: ["No history", "One parent / grandparent", "Both parents", "Multiple relatives"] },
      { id: "activity_level", label: "Daily physical activity index", type: "range", min: 1, max: 10, labelMin: "Sedentary", labelMax: "Highly Active" },
      { id: "sugar_intake", label: "Refined sugar & simple starch intake", type: "range", min: 1, max: 10, labelMin: "Zero Sugar", labelMax: "Very High" }
    ],
    symptomsList: [
      "Frequent tingling in toes/fingertips",
      "Slow-healing small scratches or dry skin",
      "Urgent sweet cravings late afternoon",
      "Energy spikes followed by rapid crashes"
    ]
  },
  {
    id: "thyroid",
    name: "Thyroid & Endocrine Axis Wellness",
    gradient: "from-sky-500/10 to-blue-500/10 border-sky-500/20 hover:border-sky-500/50",
    textClass: "text-sky-600 dark:text-sky-400",
    badgeBg: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400",
    description: "Tracks thyroid axis health, basal metabolic markers, endocrine rhythms, and physical vitality.",
    questions: [
      { id: "skin_dryness", label: "Dryness in skin and hair texture", type: "select", options: ["Hydrated", "Slightly dry", "Noticeably dry/flaky", "Extremely dry & cracked"] },
      { id: "hair_thinning", label: "Hair thinning or excessive shedding", type: "select", options: ["None", "Mild thinning", "Moderate shedding", "Severe hair loss"] },
      { id: "cold_sensitivity", label: "Sensitivity to cold drafts & cold weather", type: "select", options: ["Comfortable in cold", "Normal adaptation", "Sensitive to cold", "Extremely chilly / cannot tolerate cold"] },
      { id: "morning_fatigue", label: "Morning fatigue level upon waking", type: "range", min: 1, max: 10, labelMin: "Fully Refreshed", labelMax: "Utterly Exhausted" },
      { id: "mental_speed", label: "Cognitive processing speed & memory accuracy", type: "range", min: 1, max: 10, labelMin: "Sharp/Fast", labelMax: "Sluggish/Foggy" }
    ],
    symptomsList: [
      "Puffiness under eyes or face in morning",
      "Constantly cold fingertips and toes",
      "Tendency to hoarseness or weak voice",
      "Sluggish pulse or low physical stamina"
    ]
  },
  {
    id: "stress",
    name: "Stress & Autonomic Fatigue",
    gradient: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20 hover:border-indigo-500/50",
    textClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
    description: "Evaluates HPA axis regulation, cortisol release patterns, autonomic imbalance, and nerve fatigue.",
    questions: [
      { id: "mind_racing", label: "Racing thoughts at night when trying to sleep", type: "select", options: ["Never", "Occasionally", "Frequently", "Almost every night"] },
      { id: "tension", label: "Muscle tension in shoulders & neck area", type: "select", options: ["Relaxed", "Mild tension", "Moderate stiffness", "Severe chronic tension"] },
      { id: "irritability", label: "Irritability or anxiety under minor stressors", type: "select", options: ["Calm / stable", "Mild stress response", "Easily triggered", "High baseline anxiety"] },
      { id: "caffeine_reliance", label: "Reliance on stimulants (coffee, tea, soda)", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Extremely Dependent" },
      { id: "daily_stress_level", label: "Perceived daily psychological strain", type: "range", min: 1, max: 10, labelMin: "Serene", labelMax: "Maximum Burnout" }
    ],
    symptomsList: [
      "Sudden heart palpitations under slight worry",
      "Tension headaches in forehead or back of head",
      "Digestive spasms or IBS triggered by stress",
      "Exhaustion at 3 PM but wide awake at 11 PM"
    ]
  },
  {
    id: "sleep",
    name: "Sleep Architecture & Recovery",
    gradient: "from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/50",
    textClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400",
    description: "Assesses circadian rhythm alignment, sleep latency, sleep efficiency, and recovery quality.",
    questions: [
      { id: "sleep_latency", label: "Average time to fall asleep (minutes)", type: "select", options: ["Under 15 mins", "15 - 30 mins", "30 - 60 mins", "Over 60 mins"] },
      { id: "wakings", label: "Waking up in the middle of the night", type: "select", options: ["Never", "1 time (quick return to sleep)", "2-3 times (restless)", "Cannot fall back asleep"] },
      { id: "unrefreshing_sleep", label: "Waking up feeling tired or unrefreshed", type: "select", options: ["Rarely", "Occasionally", "Frequently", "Always unrefreshed"] },
      { id: "sleep_duration", label: "Average sleep duration (hours per night)", type: "range", min: 4, max: 10, labelMin: "4 hours", labelMax: "10 hours" },
      { id: "daytime_drowsiness", label: "Daytime fatigue or napping requirement", type: "range", min: 1, max: 10, labelMin: "Energized", labelMax: "Highly Drowsy" }
    ],
    symptomsList: [
      "Waking up precisely between 2:00 AM - 4:00 AM",
      "Restless legs or twitching during sleep",
      "Vivid, exhausting, or anxiety-inducing dreams",
      "Frequent snoring or dry throat upon waking"
    ]
  },
  {
    id: "womens",
    name: "Women's Hormonal Balance (PCOS)",
    gradient: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 hover:border-purple-500/50",
    textClass: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
    description: "Evaluates menstrual cycle regularity, hormonal metabolism, and PCOS-related physical symptoms.",
    questions: [
      { id: "cycle_regularity", label: "Cycle predictability & regular timeline", type: "select", options: ["Highly regular (28-32 days)", "Scanty / delayed", "Irregular / unpredictable", "Absent for multiple months"] },
      { id: "mood_swings", label: "Emotional changes or PMS severity", type: "select", options: ["None / minimal", "Mild mood swings", "Moderate anxiety/weepiness", "Severe distress / PMS loops"] },
      { id: "breakouts", label: "Hormonal acne flare-ups or skin changes", type: "select", options: ["Clear skin", "Mild congestion", "Frequent jawline acne", "Severe cystic breakout"] },
      { id: "pain_index", label: "Menstrual cramping & physical discomfort", type: "range", min: 1, max: 10, labelMin: "No Pain", labelMax: "Intense Spasms" },
      { id: "thermal_environment", label: "Thermal preference in warm rooms", type: "range", min: 1, max: 10, labelMin: "Love warmth", labelMax: "Suffocate/need fresh air" }
    ],
    symptomsList: [
      "Scanty, delayed menses with painful bearing down",
      "Water retention and swelling in ankles",
      "Emotional relief from consolation & cool open air",
      "Hirsutism or male-pattern thinning hair"
    ]
  }
];

export default function HealthIntelligencePage() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  // Initialize answers when profile changes
  const handleSelectProfile = (id: string) => {
    setSelectedProfile(id);
    setSelectedSymptoms([]);
    const profile = ASSESSMENT_PROFILES.find(p => p.id === id);
    const initial: Record<string, any> = {};
    profile?.questions.forEach(q => {
      initial[q.id] = q.type === "range" ? Math.round(((q.max || 10) + (q.min || 1)) / 2) : q.options?.[0] || "";
    });
    setAnswers(initial);
    setResults(null);
  };

  const handleInputChange = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Logic for calculating scores dynamically
      let vitalityScore = 85;
      let psora = 30;
      let sycosis = 20;
      let syphilis = 10;
      let organLoad = 15;
      let constitutionalRemedy = "Nux Vomica";
      let primaryDiathesis = "Psoric (Functional Deficit)";
      let organRecommendation = "General metabolic conditioning";
      let riskLevel = "Low";
      let riskPct = 15;

      const profile = ASSESSMENT_PROFILES.find(p => p.id === selectedProfile);

      // Deduct vitality based on symptom selections
      vitalityScore -= selectedSymptoms.length * 8;

      if (selectedProfile === "metabolic") {
        const sluggishVal = Number(answers.metabolic_sluggishness || 5);
        const sweetsVal = Number(answers.sweet_craving || 5);
        const thermalVal = answers.thermal;
        const bloatingVal = answers.bloating;

        vitalityScore -= (sluggishVal * 2.5) + (sweetsVal * 1.5);
        sycosis += sluggishVal * 6 + (bloatingVal === "Frequently" ? 15 : bloatingVal === "Almost constant" ? 25 : 5);
        psora += sweetsVal * 5 + (thermalVal === "Warm-blooded" ? 12 : 5);
        
        organLoad = Math.min(95, sluggishVal * 7 + selectedSymptoms.length * 10);

        if (thermalVal === "Chilly (sensitive to cold)") {
          constitutionalRemedy = "Lycopodium Clavatum";
          primaryDiathesis = "Sycotic (Metabolic Sluggishness)";
          organRecommendation = "Liver & Gut detoxification. Support hepatic conversion mechanisms.";
        } else if (thermalVal === "Warm-blooded (prefer cold)") {
          constitutionalRemedy = "Sulphur";
          primaryDiathesis = "Psoric (Elimination Blockage)";
          organRecommendation = "Digestive tract and skin elimination regulation. Metabolic activation.";
        } else {
          constitutionalRemedy = "Nux Vomica";
          primaryDiathesis = "Psoric-Sycotic Mixed";
          organRecommendation = "Gastrointestinal tract rhythm synchronization. Reduce toxic load.";
        }

        riskPct = Math.round(organLoad * 0.8);
        riskLevel = riskPct > 70 ? "High Risk" : riskPct > 40 ? "Moderate Risk" : "Low Risk";
      } 
      else if (selectedProfile === "diabetes") {
        const sugarVal = Number(answers.sugar_intake || 5);
        const activityVal = Number(answers.activity_level || 5);
        const thirstVal = answers.thirst;
        const familyVal = answers.family_history;

        vitalityScore -= (sugarVal * 3) + (10 - activityVal) * 2.5;
        vitalityScore += activityVal * 1.5;

        sycosis += (10 - activityVal) * 6 + (familyVal !== "No history" ? 20 : 5);
        psora += sugarVal * 5 + (thirstVal.includes("thirst") ? 15 : 5);

        organLoad = Math.min(95, (10 - activityVal) * 6 + sugarVal * 5 + selectedSymptoms.length * 8);
        riskPct = Math.round((organLoad + (familyVal === "Both parents" ? 30 : familyVal === "One parent / grandparent" ? 15 : 0)) * 0.7);
        riskLevel = riskPct > 70 ? "High Risk" : riskPct > 40 ? "Moderate Risk" : "Low Risk";

        primaryDiathesis = "Sycotic Overlay with Psoric Exhaustion";
        organRecommendation = "Pancreatic endocrine pathway regulation & cellular insulin receptor sensitizing.";
        
        if (answers.thermal === "Warm-blooded (prefer cold)") {
          constitutionalRemedy = "Sulphur / Syzygium Jambolanum";
        } else {
          constitutionalRemedy = "Lycopodium Clavatum / Phosphoric Acid";
        }
      }
      else if (selectedProfile === "thyroid") {
        const morningFatigue = Number(answers.morning_fatigue || 5);
        const mentalSpeed = Number(answers.mental_speed || 5);
        const coldSens = answers.cold_sensitivity;
        const skinDry = answers.skin_dryness;

        vitalityScore -= (morningFatigue * 3) + (mentalSpeed * 1.5);
        psora += morningFatigue * 5 + (skinDry.includes("dry") ? 15 : 5);
        sycosis += (coldSens.includes("chilly") ? 20 : 5);

        organLoad = Math.min(95, morningFatigue * 7 + (coldSens.includes("chilly") ? 15 : 0) + selectedSymptoms.length * 9);
        riskPct = Math.round(organLoad * 0.75);
        riskLevel = riskPct > 70 ? "High Risk" : riskPct > 40 ? "Moderate Risk" : "Low Risk";

        primaryDiathesis = "Psoric (Functional Deficient & Assimilation Block)";
        organRecommendation = "Thyroid-pituitary feedback loop sensitization and basal metabolic rate support.";

        if (coldSens.includes("chilly") || skinDry.includes("dry")) {
          constitutionalRemedy = "Calcarea Carbonica / Thyroidinum";
        } else {
          constitutionalRemedy = "Pulsatilla / Bromium";
        }
      }
      else if (selectedProfile === "stress") {
        const dailyStress = Number(answers.daily_stress_level || 5);
        const caffeine = Number(answers.caffeine_reliance || 5);
        const racing = answers.mind_racing;

        vitalityScore -= (dailyStress * 3.5) + (caffeine * 1.5);
        psora += dailyStress * 7 + (racing === "Almost every night" ? 20 : 5);
        syphilis += (racing === "Almost every night" ? 12 : 3);

        organLoad = Math.min(95, dailyStress * 8 + selectedSymptoms.length * 7);
        riskPct = Math.round(organLoad * 0.85);
        riskLevel = riskPct > 70 ? "High Risk" : riskPct > 40 ? "Moderate Risk" : "Low Risk";

        primaryDiathesis = "Psoric Hyper-excitability progressing to Adrenal Fatigue";
        organRecommendation = "HPA Axis regulation. Autonomic nervous system decompression.";

        if (dailyStress > 7) {
          constitutionalRemedy = "Kali Phosphoricum / Phosphoric Acid";
        } else {
          constitutionalRemedy = "Ignatia Amara / Coffea Cruda";
        }
      }
      else if (selectedProfile === "sleep") {
        const sleepHours = Number(answers.sleep_duration || 7);
        const drowsiness = Number(answers.daytime_drowsiness || 5);
        const unrefreshing = answers.unrefreshing_sleep;
        const wakings = answers.wakings;

        vitalityScore -= (10 - sleepHours) * 4 + drowsiness * 2.5;
        psora += drowsiness * 6 + (unrefreshing === "Always unrefreshed" ? 18 : 5);
        syphilis += (wakings === "Cannot fall back asleep" ? 15 : 5);

        organLoad = Math.min(95, (10 - sleepHours) * 7 + drowsiness * 5 + selectedSymptoms.length * 8);
        riskPct = Math.round(organLoad * 0.8);
        riskLevel = riskPct > 70 ? "High Risk" : riskPct > 40 ? "Moderate Risk" : "Low Risk";

        primaryDiathesis = "Circadian Rhythm Dysregulation (Mixed Miasmatic)";
        organRecommendation = "Melatonin-cortisol pathway alignment. Central nervous system recovery.";

        if (selectedSymptoms.includes("Waking up precisely between 2:00 AM - 4:00 AM")) {
          constitutionalRemedy = "Nux Vomica / Arsenicum Album";
        } else {
          constitutionalRemedy = "Coffea Cruda / Passiflora Incarnata";
        }
      }
      else if (selectedProfile === "womens") {
        const painVal = Number(answers.pain_index || 5);
        const thermalEnv = Number(answers.thermal_environment || 5);
        const regularity = answers.cycle_regularity;
        const mood = answers.mood_swings;

        vitalityScore -= (painVal * 2.5) + (regularity !== "Highly regular (28-32 days)" ? 15 : 0);
        psora += painVal * 4 + (mood === "Severe distress / PMS loops" ? 15 : 5);
        sycosis += (regularity !== "Highly regular (28-32 days)" ? 20 : 5) + (thermalEnv > 7 ? 12 : 0);

        organLoad = Math.min(95, painVal * 6 + (regularity !== "Highly regular (28-32 days)" ? 20 : 0) + selectedSymptoms.length * 10);
        riskPct = Math.round(organLoad * 0.75);
        riskLevel = riskPct > 70 ? "High Risk" : riskPct > 40 ? "Moderate Risk" : "Low Risk";

        primaryDiathesis = "Sycotic Stagnation (Pelvic & Endocrine Congestion)";
        organRecommendation = "Ovarian cycle rhythm synchronization and pelvic lymphatic drainage.";

        if (thermalEnv > 7 || mood.includes("weepiness")) {
          constitutionalRemedy = "Pulsatilla Nigricans";
        } else {
          constitutionalRemedy = "Sepia Officinalis / Thuja Occidentalis";
        }
      }

      // Ensure vitality stays within bounds
      vitalityScore = Math.max(25, Math.min(98, vitalityScore));
      
      // Normalize miasmatic totals to percentages
      const miasmTotal = psora + sycosis + syphilis;
      psora = Math.round((psora / miasmTotal) * 100);
      sycosis = Math.round((sycosis / miasmTotal) * 100);
      syphilis = 100 - psora - sycosis;

      setResults({
        vitalityIndex: vitalityScore,
        diseaseBurden: 100 - vitalityScore,
        miasmaticProfile: { psora, sycosis, syphilis },
        organLoad,
        risk: { level: riskLevel, percentage: riskPct },
        constitutionalRemedy,
        primaryDiathesis,
        organRecommendation
      });

      setIsCalculating(false);
    }, 1800);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-pearl dark:bg-[#070b13] text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-500">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-mint/5 dark:bg-mint/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb / Back Navigation */}
        {selectedProfile && (
          <button 
            onClick={() => { setSelectedProfile(null); setResults(null); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-mint hover:text-mint-dark dark:hover:text-mint transition-all mb-6 group cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Health Profiles
          </button>
        )}

        {/* Header Block */}
        <div className="max-w-3xl mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/10 dark:bg-mint/5 border border-mint/20 text-[10.5px] font-bold uppercase tracking-wider text-mint mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Health Analytics</span>
          </motion.div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4">
            {selectedProfile 
              ? ASSESSMENT_PROFILES.find(p => p.id === selectedProfile)?.name 
              : "Public Health Intelligence Center™"}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">
            {selectedProfile 
              ? "Complete the clinical self-assessment below. The engine will calculate your wellness indices, evaluate regulatory risks, and map your constitutional profile."
              : "Discover your homeostatic health profile. Select an evaluation module below to run a guided self-assessment mapping your metabolic, endocrine, or stress pathways."}
          </p>
        </div>

        {/* main workspace layout */}
        <AnimatePresence mode="wait">
          {!selectedProfile ? (
            
            // PROFILE SELECTION GRID
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {ASSESSMENT_PROFILES.map((profile) => (
                <div 
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className={`glass-panel border rounded-3xl p-6 flex flex-col justify-between h-[230px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white/70 dark:bg-slate-900/60 ${profile.gradient}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${profile.textClass}`}>
                        <Sliders className="w-5 h-5" />
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${profile.badgeBg}`}>
                        Evaluation
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {profile.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {profile.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-mint group mt-2">
                    Begin Assessment
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </motion.div>

          ) : (
            
            // QUESTIONNAIRE WIZARD & RESULTS VIEW
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Left Column: Form Intake Questionnaire (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/80 dark:bg-slate-900/50 rounded-3xl p-6 md:p-8 shadow-md">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-mint" />
                    Clinical Symptoms & Parameters
                  </h3>

                  {/* Dynamic Questions Form */}
                  <div className="space-y-6">
                    {ASSESSMENT_PROFILES.find(p => p.id === selectedProfile)?.questions.map((q) => (
                      <div key={q.id} className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            {q.label}
                          </label>
                          {q.type === "range" && (
                            <span className="font-mono font-bold text-mint bg-mint/5 px-2 py-0.5 rounded-md text-[11px]">
                              {answers[q.id]} / {q.max}
                            </span>
                          )}
                        </div>

                        {q.type === "select" && (
                          <select 
                            value={answers[q.id]}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-xs focus:border-mint focus:outline-none transition-colors"
                          >
                            {q.options?.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}

                        {q.type === "range" && (
                          <div className="space-y-1">
                            <input 
                              type="range"
                              min={q.min}
                              max={q.max}
                              value={answers[q.id] || 5}
                              onChange={(e) => handleInputChange(q.id, Number(e.target.value))}
                              className="w-full accent-mint"
                            />
                            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                              <span>{q.labelMin}</span>
                              <span>{q.labelMax}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Symptom checklist */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Verify Constitutional Modalities
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {ASSESSMENT_PROFILES.find(p => p.id === selectedProfile)?.symptomsList.map((symptom) => {
                        const isChecked = selectedSymptoms.includes(symptom);
                        return (
                          <div 
                            key={symptom}
                            onClick={() => toggleSymptom(symptom)}
                            className={`p-3.5 rounded-2xl border text-xs cursor-pointer flex items-start gap-2.5 transition-all duration-200 ${
                              isChecked 
                                ? "bg-mint/5 border-mint text-mint-dark dark:text-mint" 
                                : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 text-slate-600 dark:text-zinc-400"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isChecked ? "bg-mint border-mint text-white" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            }`}>
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="leading-snug">{symptom}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calculation triggers */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="flex-1 py-4.5 bg-mint hover:bg-mint-dark text-white font-bold rounded-2xl cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-mint/15 transition-all active:scale-98 border-none"
                    >
                      {isCalculating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing Biological Vectors...
                        </>
                      ) : (
                        <>
                          <Activity className="w-4.5 h-4.5" />
                          Generate Health Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculations Outputs (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Loader Placeholder */}
                {isCalculating && (
                  <div className="glass-panel border rounded-3xl p-8 shadow-md bg-white/80 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center min-h-[450px] space-y-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute w-full h-full border-4 border-mint/10 border-t-mint rounded-full animate-spin"></div>
                      <Heart className="w-6 h-6 text-mint animate-pulse" />
                    </div>
                    
                    <div className="space-y-2 max-w-xs">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">Analyzing Homeostatic Markers</h4>
                      <p className="text-xs text-slate-400 leading-normal">
                        Mapping clinical modalities, calculating miasmatic layers, and processing organ stress quotients...
                      </p>
                    </div>
                  </div>
                )}

                {/* Empty State Prompt */}
                {!results && !isCalculating && (
                  <div className="glass-panel border rounded-3xl p-8 shadow-md bg-white/80 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center min-h-[450px] space-y-4">
                    <Sliders className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-bounce" />
                    
                    <div className="space-y-1.5 max-w-xs">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">Awaiting Input Data</h4>
                      <p className="text-xs text-slate-400 leading-normal">
                        Select your symptoms and adjust parameter metrics, then click **Generate Health Profile** to view your analysis.
                      </p>
                    </div>
                  </div>
                )}

                {/* REAL-TIME RESULTS CARDS */}
                {results && !isCalculating && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* Vitality Score Banner */}
                    <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/85 dark:bg-slate-900/60 rounded-3xl p-6 shadow-md text-center space-y-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Estimated Vitality Quotient™
                      </span>

                      {/* SVG Gauge Dial */}
                      <div className="flex justify-center items-center relative w-40 h-40 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background Track */}
                          <circle 
                            cx="50" cy="50" r="42" 
                            className="stroke-slate-100 dark:stroke-slate-800 fill-none" 
                            strokeWidth="8"
                          />
                          {/* Active Indicator */}
                          <motion.circle 
                            cx="50" cy="50" r="42" 
                            className="stroke-mint fill-none" 
                            strokeWidth="8"
                            strokeDasharray={263.8}
                            initial={{ strokeDashoffset: 263.8 }}
                            animate={{ strokeDashoffset: 263.8 - (263.8 * results.vitalityIndex) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-serif font-black text-slate-900 dark:text-white">
                            {results.vitalityIndex}%
                          </span>
                          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                            Compensated
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold">
                        <div className="text-center">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-extrabold mb-0.5">Vitality Index</span>
                          <span className="text-slate-800 dark:text-white font-mono">{results.vitalityIndex}%</span>
                        </div>
                        <div className="text-center border-l border-slate-100 dark:border-slate-800">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-extrabold mb-0.5">Disease Burden</span>
                          <span className="text-rose-500 font-mono">{results.diseaseBurden}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Miasmatic Profile Chart */}
                    <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/85 dark:bg-slate-900/60 rounded-3xl p-6 shadow-md space-y-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Miasmatic Predisposition Profile™
                      </span>

                      <div className="space-y-3">
                        {/* Psora */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 dark:text-zinc-300">Psora (Deficiency / Hypersensitivity)</span>
                            <span className="font-bold text-amber-500 font-mono">{results.miasmaticProfile.psora}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${results.miasmaticProfile.psora}%` }}></div>
                          </div>
                        </div>

                        {/* Sycosis */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 dark:text-zinc-300">Sycosis (Excess / Sluggish Accumulation)</span>
                            <span className="font-bold text-teal-500 font-mono">{results.miasmaticProfile.sycosis}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${results.miasmaticProfile.sycosis}%` }}></div>
                          </div>
                        </div>

                        {/* Syphilis */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 dark:text-zinc-300">Syphilis (Structural Degradation)</span>
                            <span className="font-bold text-rose-500 font-mono">{results.miasmaticProfile.syphilis}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${results.miasmaticProfile.syphilis}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mapped Homeopathic Assessment & Remedies */}
                    <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/85 dark:bg-slate-900/60 rounded-3xl p-6 shadow-md space-y-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Constitutional Remedy Vector
                      </span>

                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-bold">Suggested Remedy Group</span>
                          <span className="text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider">{results.constitutionalRemedy}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-bold">Miasmatic Layer</span>
                          <span className="text-slate-800 dark:text-zinc-200 font-bold">{results.primaryDiathesis}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[9px] block">
                          Organ System Recommendation
                        </span>
                        <p className="text-slate-650 dark:text-zinc-350 leading-relaxed font-semibold">
                          {results.organRecommendation}
                        </p>
                      </div>

                      {/* Organ load indicator */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[9px]">Target System stress Load</span>
                          <span className="font-mono font-bold text-rose-500">{results.organLoad}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${results.organLoad > 75 ? "bg-rose-500" : results.organLoad > 45 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${results.organLoad}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Booking CTA Link */}
                    <div className="p-6 bg-gradient-to-br from-[#0F766E] to-[#042f2c] text-white rounded-3xl space-y-4 shadow-lg shadow-teal-950/20">
                      <div className="space-y-1">
                        <h4 className="font-serif text-base font-bold">Request Professional Review</h4>
                        <p className="text-[11px] text-teal-150 leading-normal">
                          This assessment matches constitutional remedies but does not replace clinical diagnosis. Schedule a detailed review with Dr. Narayan Jethwani.
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3">
                        <Link 
                          href="https://homeo.healthcare/#booking"
                          className="flex-1 py-3 bg-white text-[#0F766E] hover:bg-teal-50 font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-md transition-all active:scale-98"
                        >
                          Book Consultation
                        </Link>
                        <button
                          onClick={() => window.print()}
                          className="flex items-center justify-center gap-1.5 px-4 py-3 border border-white/20 hover:border-white/50 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-98"
                        >
                          <FileText className="w-4 h-4" />
                          Print Analysis
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
