import { AssessmentProfile } from "./types";

export const ASSESSMENT_CATEGORIES = [
  { id: "metabolic", name: "Metabolic Intelligence" },
  { id: "endocrine", name: "Endocrine Intelligence" },
  { id: "cardiovascular", name: "Cardiovascular Intelligence" },
  { id: "respiratory", name: "Respiratory Intelligence" },
  { id: "digestive", name: "Digestive Intelligence" },
  { id: "skin", name: "Skin Intelligence" },
  { id: "mental", name: "Mental Health Intelligence" },
  { id: "womens", name: "Women's Health Intelligence" },
  { id: "childrens", name: "Children's Health Intelligence" }
];

export const ASSESSMENT_PROFILES: AssessmentProfile[] = [
  // ==================== METABOLIC INTELLIGENCE ====================
  {
    id: "metabolic_profile",
    name: "Metabolic Health Profile",
    category: "metabolic",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 hover:border-teal-500/50",
    textClass: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
    description: "Evaluates systemic metabolic rate, energy conversion efficiency, and general cellular vitality.",
    questions: [
      { id: "appetite_rate", label: "Appetite level and post-meal satiation", type: "select", options: ["Normal satiation", "Constant hunger / never full", "Poor appetite / easily full", "Appetite spikes during stress"] },
      { id: "bloating_freq", label: "Digestive gas, bloating, or abdominal distention", type: "select", options: ["Rarely", "Occasionally (after heavy meals)", "Frequently (daily)", "Severe and constant bloating"] },
      { id: "energy_drop", label: "Energy drop or fatigue after eating carbohydrates", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Severe Drowsiness" },
      { id: "cold_warm_pref", label: "Thermal sensitivity and environment preference", type: "select", options: ["Chilly (worse in cold)", "Warm-blooded (worse in heat)", "Neutral / normal", "Highly sensitive to drafts"] },
      { id: "sluggishness", label: "Systemic heavy feeling or morning lethargy", type: "range", min: 1, max: 10, labelMin: "Light/Active", labelMax: "Constantly Sluggish" }
    ],
    symptomsList: [
      "Abdominal flatulence worse 4:00 PM - 8:00 PM",
      "Craving for sweets, warm drinks, and spicy foods",
      "Sour belching or slow gastric emptying",
      "Tendency to weight accumulation on abdominal waistline"
    ]
  },
  {
    id: "obesity_risk",
    name: "Obesity & Adipose Risk Assessment",
    category: "metabolic",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 hover:border-teal-500/50",
    textClass: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
    description: "Analyzes metabolic predisposition to fat storage, adipokine levels, and visceral loading.",
    questions: [
      { id: "waist_height", label: "Waist circumference relative to height ratio", type: "select", options: ["Healthy (Waist < half height)", "Slightly elevated", "Noticeable abdominal weight", "Significantly elevated waist ratio"] },
      { id: "weight_gain_rate", label: "Ease of gaining weight / difficulty losing it", type: "select", options: ["Gain/lose easily", "Slow weight gain", "Gain weight rapidly, lose very slowly", "Constant gradual weight increase"] },
      { id: "daily_steps", label: "Daily step count & active calorie output", type: "range", min: 1, max: 10, labelMin: "Under 2k steps", labelMax: "Over 12k steps" },
      { id: "fatty_cravings", label: "Cravings for fatty, oily, or fried foods", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Extremely Intense" },
      { id: "breathlessness", label: "Dyspnea or breathlessness under light exertion", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Constant" }
    ],
    symptomsList: [
      "Sensation of general heavy body and slow gait",
      "Profuse sweat under minimal exertion or movement",
      "Swollen ankles or fluid retention in legs",
      "Chilly baseline with cold extremities"
    ]
  },
  {
    id: "insulin_resistance",
    name: "Insulin Resistance Score",
    category: "metabolic",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 hover:border-teal-500/50",
    textClass: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
    description: "Evaluates peripheral insulin sensitivity, postprandial glucose swings, and skin markers.",
    questions: [
      { id: "carb_cravings", label: "Intense hunger or carb cravings shortly after meals", type: "select", options: ["None", "Occasional mild cravings", "Frequent sweet cravings within 2h of eating", "Intense uncontrollable carbohydrate craving"] },
      { id: "skin_markers", label: "Velvety skin patches (neck, underarms) or skin tags", type: "select", options: ["None", "Few skin tags", "Hyperpigmentation patches", "Active skin tags and dark creases"] },
      { id: "brain_fog_post_meal", label: "Postprandial brain fog, drowsiness, or memory lag", type: "range", min: 1, max: 10, labelMin: "Clear", labelMax: "Extremely Sleepy" },
      { id: "waist_gain", label: "Concentration of adipose tissue on lower abdomen", type: "select", options: ["Even distribution", "Mild abdominal focus", "Distinct visceral belly fat", "Severe abdominal weight retention"] },
      { id: "energy_stability", label: "Energy stability throughout the day", type: "range", min: 1, max: 10, labelMin: "Highly Fluctuating", labelMax: "Completely Stable" }
    ],
    symptomsList: [
      "Sudden irritability or shakiness when meals are delayed",
      "Frequent nocturia without urinary infection",
      "Persistent skin tags around neck and armpits",
      "Inability to stay focused without carbohydrate intake"
    ]
  },
  {
    id: "metabolic_syndrome",
    name: "Metabolic Syndrome Evaluation",
    category: "metabolic",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 hover:border-teal-500/50",
    textClass: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
    description: "Screens for clustering risks (visceral fat, dysglycemia, blood pressure, lipid shifts).",
    questions: [
      { id: "bp_baseline", label: "Baseline resting blood pressure levels", type: "select", options: ["Optimal (< 120/80)", "Pre-hypertensive", "Mild hypertension (140+ systolic)", "Moderate to high hypertension"] },
      { id: "triglycerides", label: "Triglycerides or cholesterol patterns if known", type: "select", options: ["Healthy range", "Borderline high", "High triglycerides (>150 mg/dL)", "Elevated and on medication"] },
      { id: "blood_sugar", label: "Fasting blood glucose baseline values", type: "select", options: ["Normal (<100 mg/dL)", "Impaired fasting glucose (100-125)", "Diabetic values (126+)", "Varying significantly"] },
      { id: "abdominal_fat", label: "Abdominal waist circumference markers", type: "range", min: 1, max: 10, labelMin: "Lean", labelMax: "High Visceral Load" },
      { id: "cardio_stamina", label: "Cardiorespiratory stamina during walking", type: "range", min: 1, max: 10, labelMin: "Excellent", labelMax: "Very Poor" }
    ],
    symptomsList: [
      "Headache in occipital area upon waking",
      "Occasional heart palpitations or chest heaviness",
      "Slow wound healing or dry skin patches",
      "Severe fatigue worse after starchy foods"
    ]
  },
  {
    id: "nutritional_deficiency",
    name: "Nutritional Deficiency Assessment",
    category: "metabolic",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 hover:border-teal-500/50",
    textClass: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
    description: "Identifies vital vitamin, mineral, and cellular assimilation gaps via somatic cues.",
    questions: [
      { id: "muscle_cramping", label: "Frequency of muscle cramps, twitching, or spasms", type: "select", options: ["Never", "Occasionally (after exercise)", "Frequently (especially at night)", "Constant muscle spasms"] },
      { id: "hair_nails", label: "Nail strength and hair structure changes", type: "select", options: ["Strong nails & hair", "Brittle nails or white spots", "Hair splitting / thinning nails", "Dry, peeling nails and severe hair loss"] },
      { id: "bleeding_gums", label: "Spontaneous bleeding gums or skin bruising", type: "select", options: ["Never", "Rarely during brushing", "Frequent gum bleeding", "Spontaneous bruising & gum bleed"] },
      { id: "bone_ache", label: "Deep bone aching, joint pain, or backache", type: "range", min: 1, max: 10, labelMin: "No Pain", labelMax: "Chronic Aching" },
      { id: "mouth_ulcers", label: "Recurrent mouth ulcers or tongue burning", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Very Frequent" }
    ],
    symptomsList: [
      "White spots or horizontal ridges on fingernails",
      "Cracks at the corners of the mouth (cheilosis)",
      "Numbness or tingling sensation in feet and hands",
      "Chronic daytime fatigue unrelieved by sleep"
    ]
  },
  {
    id: "biological_age",
    name: "Biological Age Calculator",
    category: "metabolic",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 hover:border-teal-500/50",
    textClass: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
    description: "Calculates cellular age relative to chronological age via functional biomarkers.",
    questions: [
      { id: "skin_elasticity", label: "Pinch test on hand back (elasticity return speed)", type: "select", options: ["Instant (<1s)", "1 - 2 seconds", "3 - 5 seconds", "Slow drag (>5s)"] },
      { id: "grip_strength", label: "General grip and upper limb physical strength", type: "select", options: ["High strength", "Average grip", "Noticeable muscle loss", "Weak hands / joint stiffness"] },
      { id: "lung_capacity", label: "Breath hold duration (seconds) comfort level", type: "range", min: 10, max: 60, labelMin: "10s (Poor)", labelMax: "60s+ (Excellent)" },
      { id: "memory_recall", label: "Memory recall speed and cognitive precision", type: "range", min: 1, max: 10, labelMin: "Instant/Sharp", labelMax: "Slow/Forgetful" },
      { id: "flexibility", label: "Spine and hamstring flexibility range", type: "select", options: ["Can touch toes easily", "Reach mid-shin", "Can barely bend past knees", "Severe structural rigidity"] }
    ],
    symptomsList: [
      "Joint stiffness worse in the morning, better with movement",
      "Slow recovery of heart rate after mild exertion",
      "Thinning skin with prominent visible veins",
      "Diminishing nighttime vision or hearing acuity"
    ]
  },

  // ==================== ENDOCRINE INTELLIGENCE ====================
  {
    id: "diabetes_risk",
    name: "Diabetes Risk Evaluation",
    category: "endocrine",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    description: "Evaluates pancreatic endocrine strain, glucose clearance index, and secondary diabetic indicators.",
    questions: [
      { id: "polyuria", label: "Frequent urination (especially nocturnal urination)", type: "select", options: ["Normal (0-1 times)", "Slightly elevated (2 times)", "Frequent (3-4 times)", "Constant nocturnal urination"] },
      { id: "polydipsia", label: "Intense thirst and dry throat index", type: "select", options: ["Normal hydration", "Mild dry mouth", "Frequent thirst", "Constant dry mouth, thirstless or thirst for cold water"] },
      { id: "vision_blur", label: "Fluctuating or blurry vision patterns", type: "select", options: ["Clear vision", "Minor dry eyes", "Intermittent blurry vision", "Progressive loss of focus"] },
      { id: "wounds", label: "Healing speed of cuts, scratches, or insect bites", type: "range", min: 1, max: 10, labelMin: "Fast", labelMax: "Very Slow" },
      { id: "fatigue_levels", label: "Chronic exhaustion unrelieved by sleep", type: "range", min: 1, max: 10, labelMin: "Energetic", labelMax: "Debilitating Fatigue" }
    ],
    symptomsList: [
      "Frequent skin tags and dark velvety patches",
      "Numbness or tingling in toes and feet",
      "Sudden exhaustion at 11:00 AM or late afternoon",
      "Recurrent fungal or skin infections"
    ]
  },
  {
    id: "thyroid_assessment",
    name: "Thyroid Axis Assessment",
    category: "endocrine",
    gradient: "from-sky-500/10 to-blue-500/10 border-sky-500/20 hover:border-sky-500/50",
    textClass: "text-sky-600 dark:text-sky-400",
    badgeBg: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400",
    description: "Evaluates thyroid hormone feedback loop, basal metabolic rate, and thermoregulatory profile.",
    questions: [
      { id: "chill_factor", label: "Sensitivity to cold environments and drafts", type: "select", options: ["Warm baseline", "Comfortable / neutral", "Sensitive to cold drafts", "Intense cold sensitivity, cannot get warm"] },
      { id: "skin_dry", label: "Dryness in skin and brittle nail texture", type: "select", options: ["Hydrated", "Slightly dry skin", "Very dry skin and cracking heels", "Brittle nails and flaky skin"] },
      { id: "bowel_speed", label: "Bowel movement frequency and sluggishness", type: "select", options: ["Daily regular", "Intermittent loose stools", "Tendency to constipation", "Stubborn constipation with dry stools"] },
      { id: "pulse_rate", label: "Resting pulse rate index (if known)", type: "range", min: 50, max: 90, labelMin: "50 bpm (Low)", labelMax: "90 bpm (High)" },
      { id: "mental_clarity", label: "Concentration capability and memory processing", type: "range", min: 1, max: 10, labelMin: "Sharp", labelMax: "Severe Brain Fog" }
    ],
    symptomsList: [
      "Swelling of face, especially around eyelids in morning",
      "Thinning of the outer third of eyebrows",
      "Voice hoarse or weak throat easily fatigued",
      "Fatigue worse by cold, damp weather; better warm room"
    ]
  },
  {
    id: "pcos_assessment",
    name: "PCOS & Ovarian Assessment",
    category: "endocrine",
    gradient: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 hover:border-purple-500/50",
    textClass: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
    description: "Maps reproductive-endocrine signaling, cycle regulation, and androgen indicators.",
    questions: [
      { id: "cycle_length", label: "Average menstrual cycle length (days)", type: "select", options: ["Regular (28-32 days)", "Delayed / Scanty menses", "Highly irregular (varying)", "Absent for multiple months"] },
      { id: "hirsutism", label: "Excess facial or body hair growth", type: "select", options: ["None", "Mild upper lip", "Moderate on chin/chest", "Significant androgenic hirsutism"] },
      { id: "hormonal_acne", label: "Acne outbreaks around jawline and chin", type: "range", min: 1, max: 10, labelMin: "Clear Skin", labelMax: "Severe Cystic Acne" },
      { id: "insulin_sync", label: "Carb cravings linked to weight gain", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Highly Correlated" },
      { id: "pelvic_pain", label: "Pelvic heaviness or bearing-down sensation", type: "select", options: ["None", "Mild cramping", "Heavy pelvic congestion", "Sharp cutting pain during cycles"] }
    ],
    symptomsList: [
      "Scanty menses, delayed cycles, or dark clotted flow",
      "Mood changes, irritability, and weepiness before cycles",
      "Water retention and bloating prior to menstruation",
      "Amelioration of emotional state from open cool air"
    ]
  },
  {
    id: "adrenal_fatigue",
    name: "Adrenal Fatigue Assessment",
    category: "endocrine",
    gradient: "from-sky-500/10 to-blue-500/10 border-sky-500/20 hover:border-sky-500/50",
    textClass: "text-sky-600 dark:text-sky-400",
    badgeBg: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400",
    description: "Measures HPA-axis exhaustion, baseline cortisol response, and sleep wake cycles.",
    questions: [
      { id: "waking_style", label: "Morning energy level immediately after waking", type: "select", options: ["Refreshed / awake", "Slightly tired", "Exhausted, needs stimulants to start", "Severe brain fog, groggy for hours"] },
      { id: "evening_energy", label: "Sudden second wind or hyperactive energy late night", type: "select", options: ["Never", "Occasionally", "Frequently awake after 9 PM", "Constant late night hyperactivity"] },
      { id: "salt_cravings", label: "Craving for salty foods, chips, or pickles", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Intense Cravings" },
      { id: "dizzy_standing", label: "Dizziness or orthostatic drop when standing up", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Very Frequent" },
      { id: "stress_tolerance", label: "Ability to handle minor daily stressful tasks", type: "range", min: 1, max: 10, labelMin: "Resilient", labelMax: "Easily Overwhelmed" }
    ],
    symptomsList: [
      "Sudden crash of energy around 3:00 PM - 4:00 PM",
      "Orthostatic dizziness or lightheadedness when rising",
      "Inability to fall asleep before 1:00 AM despite fatigue",
      "Susceptibility to recurrent respiratory or sinus colds"
    ]
  },
  {
    id: "hormonal_balance",
    name: "Hormonal Balance Assessment",
    category: "endocrine",
    gradient: "from-sky-500/10 to-blue-500/10 border-sky-500/20 hover:border-sky-500/50",
    textClass: "text-sky-600 dark:text-sky-400",
    badgeBg: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400",
    description: "Screens for progesterone-estrogen balance, cortisol-DHEA levels, and endocrine shifts.",
    questions: [
      { id: "pms_mood", label: "PMS symptoms, emotional shifts, or irritation", type: "select", options: ["None", "Mild PMS moodiness", "Moderate anxiety/weepiness", "Severe mood swings, anger loops"] },
      { id: "fluid_retention", label: "Fluid retention, breast tenderness, or swelling", type: "select", options: ["None", "Occasional bloating", "Frequent breast tenderness", "Severe edema and swelling before cycles"] },
      { id: "sleep_cycles", label: "Sleep disturbances related to monthly cycles", type: "range", min: 1, max: 10, labelMin: "Perfect Sleep", labelMax: "Insomnia Cycle" },
      { id: "libido", label: "General libido and physical vitality levels", type: "range", min: 1, max: 10, labelMin: "Very Low", labelMax: "Optimal" },
      { id: "temp_flashes", label: "Hot flashes, night sweats, or sudden chills", type: "select", options: ["None", "Occasional night sweat", "Frequent hot flashes", "Constant thermal deregulation"] }
    ],
    symptomsList: [
      "Estrogen dominance signs (bloating, breast pain)",
      "Progesterone deficiency signs (anxiety, short cycles)",
      "Mood swings relieved by cool open air or quiet rooms",
      "Headache at the beginning or end of cycle"
    ]
  },

  // ==================== CARDIOVASCULAR INTELLIGENCE ====================
  {
    id: "hypertension",
    name: "Hypertension Risk Assessment",
    category: "cardiovascular",
    gradient: "from-red-500/10 to-rose-500/10 border-red-500/20 hover:border-red-500/50",
    textClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
    description: "Evaluates arterial wall pressure, vascular compliance indicators, and capillary resistance.",
    questions: [
      { id: "sys_bp", label: "Average systolic (upper) blood pressure reading", type: "select", options: ["Optimal (< 120)", "Elevated (120-129)", "Stage 1 Hypertension (130-139)", "Stage 2 Hypertension (140+)"] },
      { id: "dia_bp", label: "Average diastolic (lower) blood pressure reading", type: "select", options: ["Optimal (< 80)", "Normal (80-84)", "Stage 1 Hypertension (85-89)", "Stage 2 Hypertension (90+)"] },
      { id: "occipital_pain", label: "Headache at the back of head (occiput) in morning", type: "select", options: ["Never", "Rarely", "Frequently upon waking", "Almost constant morning headache"] },
      { id: "salt_sodium", label: "Sodium sensitivity & consumption index", type: "range", min: 1, max: 10, labelMin: "Low Sodium", labelMax: "Very High Sodium" },
      { id: "stress_reactivity", label: "Blood pressure spikes during emotional stress", type: "range", min: 1, max: 10, labelMin: "No effect", labelMax: "Immediate flushing/spikes" }
    ],
    symptomsList: [
      "Morning headache in occiput, easing after rising",
      "Occasional ringing in ears (tinnitus) or vertigo",
      "Nosebleeds under sudden pressure elevation",
      "Redness in face and warmth in hands/feet"
    ]
  },
  {
    id: "heart_disease",
    name: "Heart Disease Risk Score",
    category: "cardiovascular",
    gradient: "from-red-500/10 to-rose-500/10 border-red-500/20 hover:border-red-500/50",
    textClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
    description: "Computes Framingham-aligned risk factors for coronary artery disease and myocardial stress.",
    questions: [
      { id: "chest_tightness", label: "Sensation of tightness or pressure in chest", type: "select", options: ["Never", "Rarely (after extreme exercise)", "Intermittently under stress", "Frequent tightness, needs rest"] },
      { id: "cholesterol_profile", label: "Total cholesterol / LDL levels if checked", type: "select", options: ["Healthy range", "Borderline high", "High LDL / Low HDL", "Significantly elevated lipid markers"] },
      { id: "heredity_heart", label: "Family history of coronary events or attacks", type: "select", options: ["No history", "One relative over 60", "Early onset heart event in parent", "Multiple close family events"] },
      { id: "stamina_slope", label: "Cardio stamina when walking uphill/stairs", type: "range", min: 1, max: 10, labelMin: "Excellent", labelMax: "Extreme dyspnea" },
      { id: "smoker_vape", label: "Exposure to nicotine or smoking history", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Active Smoker" }
    ],
    symptomsList: [
      "Stitching chest pain radiating to the left arm",
      "Palpitations from minor startle or excitement",
      "Bilateral ankle swelling worse by evening",
      "Sudden dry cough from lying down"
    ]
  },
  {
    id: "stroke_risk",
    name: "Stroke Risk Evaluation",
    category: "cardiovascular",
    gradient: "from-red-500/10 to-rose-500/10 border-red-500/20 hover:border-red-500/50",
    textClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
    description: "Evaluates cerebral perfusion risk, carotid flow dynamics, and microvascular factors.",
    questions: [
      { id: "vertigo_freq", label: "Frequency of sudden dizziness, vertigo, or unsteadiness", type: "select", options: ["Never", "Occasionally on rising", "Frequent lightheadedness", "Persistent balance issues"] },
      { id: "speech_lag", label: "Transient speech slurring or motor coordination lag", type: "select", options: ["None", "Rarely when fatigued", "Temporary numbness in fingers", "Occasional motor clumsiness"] },
      { id: "atrial_fibrillation", label: "Arrhythmia or rapid fluttering heart baseline", type: "select", options: ["Regular rhythm", "Frequent premature beats", "Atrial fibrillation confirmed", "Constant palpitations"] },
      { id: "diet_healthy_fats", label: "Dietary intake of omega fats and greens", type: "range", min: 1, max: 10, labelMin: "Very Poor", labelMax: "Excellent" },
      { id: "hypertensive_episodes", label: "Frequency of hypertensive spikes (>160)", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Very Frequent" }
    ],
    symptomsList: [
      "Transient numbness or coldness in one hand or leg",
      "Sudden severe headache of unknown origin",
      "Visual blur or blind spots appearing suddenly",
      "Tinnitus (buzzing or whistling sounds in ears)"
    ]
  },
  {
    id: "lipid_health",
    name: "Lipid Health Assessment",
    category: "cardiovascular",
    gradient: "from-red-500/10 to-rose-500/10 border-red-500/20 hover:border-red-500/50",
    textClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
    description: "Assesses lipid transport dynamics, LDL particle sizing indicators, and hepatic synthesis.",
    questions: [
      { id: "fatty_deposits", label: "Yellow skin deposits (xanthomas) on eyelids", type: "select", options: ["None", "Suspected patches", "Visible deposits", "Active xanthoma spots"] },
      { id: "dietary_lipids", label: "Consumption of processed oils or trans fats", type: "select", options: ["Zero trans fats", "Low raw intake", "Frequent fried/fast food", "High daily consumption"] },
      { id: "hdl_levels", label: "HDL (good) cholesterol levels if known", type: "range", min: 25, max: 70, labelMin: "25 mg/dL (Low)", labelMax: "70 mg/dL+ (Optimal)" },
      { id: "digestive_fat", label: "Difficulty digesting fats (oily stools, nausea)", type: "range", min: 1, max: 10, labelMin: "Easy digestion", labelMax: "Nausea/indigestion" },
      { id: "family_cholesterol", label: "Family history of hypercholesterolemia", type: "select", options: ["No history", "One relative", "Parent with severe high cholesterol", "Universal family trait"] }
    ],
    symptomsList: [
      "Right hypochondriac sluggishness or fullness",
      "Stool light-colored or greasy after fatty food",
      "Headache better by cold applications, worse warmth",
      "Metallic taste in mouth, especially mornings"
    ]
  },
  {
    id: "cardio_age",
    name: "Cardiovascular Age Calculator",
    category: "cardiovascular",
    gradient: "from-red-500/10 to-rose-500/10 border-red-500/20 hover:border-red-500/50",
    textClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
    description: "Estimates arterial flexibility and cardiovascular cellular age.",
    questions: [
      { id: "climbing_stairs", label: "Shortness of breath climbing 2 flights of stairs", type: "select", options: ["None / energetic", "Mild acceleration", "Noticeably breathless", "Cannot complete without stopping"] },
      { id: "recovery_time", label: "Time for pulse rate to return to resting state", type: "select", options: ["Instant (< 2 mins)", "3 to 5 minutes", "Over 5 minutes", "Pulse remains high for hours"] },
      { id: "resting_heart_rate", label: "Resting heart rate (bpm) baseline", type: "range", min: 50, max: 100, labelMin: "50 (Excellent)", labelMax: "100 (Unfavorable)" },
      { id: "arterial_flex", label: "Cold feet & hands frequency", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Constant" },
      { id: "exercise_frequency", label: "Aerobic cardiovascular exercise per week", type: "select", options: ["Daily (45 mins+)", "3-4 times a week", "1-2 times a week", "Sedentary lifestyle"] }
    ],
    symptomsList: [
      "Numbness in limbs during sleep or static sitting",
      "Coldness of skin on legs and feet, blue nails",
      "Sensation of chest heaviness worse at night",
      "Tension in neck muscles linked to pulse beats"
    ]
  },

  // ==================== RESPIRATORY INTELLIGENCE ====================
  {
    id: "asthma_control",
    name: "Asthma Control Assessment",
    category: "respiratory",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    description: "Evaluates bronchial hyper-reactivity, spasm control, and daytime dyspnea thresholds.",
    questions: [
      { id: "wheeze_freq", label: "Frequency of wheezing or chest whistling", type: "select", options: ["Never", "Rarely (seasonal)", "Frequently (weekly)", "Almost daily"] },
      { id: "night_waking_asthma", label: "Nocturnal waking due to coughing or chest tightness", type: "select", options: ["Never", "1-2 times a month", "Weekly", "Almost every night"] },
      { id: "inhaler_use", label: "Rescue inhaler use frequency", type: "select", options: ["Zero", "Rarely (< 1 time/week)", "Frequently (3+ times/week)", "Multiple times daily"] },
      { id: "trigger_response", label: "Bronchial spasm response to cold air/exercise", type: "range", min: 1, max: 10, labelMin: "No effect", labelMax: "Immediate spasm" },
      { id: "cough_severity", label: "Dry spasmodic coughing severity", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Severe Spasms" }
    ],
    symptomsList: [
      "Dry spasmodic cough worse between 2:00 AM - 4:00 AM",
      "Tightness in chest relieved by sitting upright",
      "Cough triggered immediately by transition to cold air",
      "Sticky, stringy mucus difficult to expectorate"
    ]
  },
  {
    id: "allergy_profile",
    name: "Allergy Intelligence Profile",
    category: "respiratory",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    description: "Maps IgE-mediated response triggers, sinus reactivity, and mucosal sensitivity.",
    questions: [
      { id: "sneezing_fits", label: "Frequency of violent sneezing fits in mornings", type: "select", options: ["Never", "Rarely", "Frequently upon waking", "Violent morning fits daily"] },
      { id: "eye_itching", label: "Itching, redness, or watery eyes from pollen/dust", type: "select", options: ["None", "Mild seasonal", "Moderate frequent", "Severe allergic conjunctivitis"] },
      { id: "nasal_discharge", label: "Nature of nasal discharge when allergic", type: "select", options: ["Dry", "Thick white mucus", "Thin, watery, excoriating discharge", "Thick yellow crusty discharge"] },
      { id: "odor_sensitivity", label: "Mucosal irritation from strong perfumes or chemical fumes", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Immediate reaction" },
      { id: "skin_allergy", label: "Frequency of urticaria or hives under skin exposure", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Very Frequent" }
    ],
    symptomsList: [
      "Watery nasal discharge which burns or excoriates the lip",
      "Violent sneezing immediately upon putting feet on floor",
      "Allergic symptoms better in cool open air, worse warm room",
      "Dry tickling in throat triggering spasmodic coughing"
    ]
  },
  {
    id: "sinus_health",
    name: "Sinus Health Assessment",
    category: "respiratory",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    description: "Tracks paranasal congestion, frontal headaches, and post-nasal drip indicators.",
    questions: [
      { id: "sinus_pain", label: "Frontal or maxillary facial pressure and pain", type: "select", options: ["None", "Occasional mild block", "Frequent pain over eyebrow/cheek", "Chronic severe sinus pressure"] },
      { id: "post_nasal_drip", label: "Sensation of mucus dropping in throat (post-nasal)", type: "select", options: ["Never", "Occasionally when cold", "Frequently, triggers throat clearing", "Constant post-nasal drip"] },
      { id: "smell_loss", label: "Diminished sense of smell or taste", type: "select", options: ["Normal", "Mildly impaired", "Frequently blocked", "Anosmia (complete loss of smell)"] },
      { id: "weather_change_spikes", label: "Sinus blockage triggered by damp weather changes", type: "range", min: 1, max: 10, labelMin: "No effect", labelMax: "Immediate Blockage" },
      { id: "nasal_polyps", label: "Tendency to nasal blockage or snoring", type: "range", min: 1, max: 10, labelMin: "Clear", labelMax: "Severe obstruction" }
    ],
    symptomsList: [
      "Frontal sinus headache worse by shaking head or bending forward",
      "Thick yellow-green post-nasal discharge worse in morning",
      "Pressure at the root of the nose relieved by discharge",
      "Sinus congestion worse by damp cold weather, better dry heat"
    ]
  },
  {
    id: "copd_risk",
    name: "COPD Risk Evaluation",
    category: "respiratory",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    description: "Evaluates alveolar obstruction progression and chronic mucus loading.",
    questions: [
      { id: "chronic_cough", label: "Duration of chronic morning cough with mucus", type: "select", options: ["No cough", "Few weeks in winter", "Multiple months (> 3 months)", "Years of constant morning cough"] },
      { id: "sputum_nature", label: "Typical appearance and color of expectorated mucus", type: "select", options: ["None", "Clear / thin", "Thick white or gray", "Yellow, green, or purulent mucus"] },
      { id: "dyspnea_stairs", label: "Dyspnea climbing a single flight of stairs", type: "range", min: 1, max: 10, labelMin: "No dyspnea", labelMax: "Must stop mid-flight" },
      { id: "pollutant_exposure", label: "Long term exposure to smoke, wood stoves, or dust", type: "range", min: 1, max: 10, labelMin: "Clean Air", labelMax: "Severe Exposure" },
      { id: "chest_barrel", label: "Barrel chest configuration or physical thoracic expansion", type: "select", options: ["Normal chest", "Mild hyperinflation", "Noticeable barrel shape", "Severe expansion limitation"] }
    ],
    symptomsList: [
      "Chronic loose cough with rattling sound in chest",
      "Expectoration difficult, worse lying down at night",
      "Shortness of breath worse by cold air, better hot tea",
      "Systemic cyanosis signs (bluish nailbeds or lips)"
    ]
  },
  {
    id: "sleep_apnea",
    name: "Sleep Apnea Screening",
    category: "respiratory",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    description: "Screens for obstructive airway collapse, nocturnal hypoxia, and morning fatigue.",
    questions: [
      { id: "snoring_loud", label: "Loud, disruptive snoring reported by others", type: "select", options: ["Never", "Occasionally", "Loud frequent snoring", "Choking/gasping sounds during sleep"] },
      { id: "sleep_gasping", label: "Waking up suddenly gasping or choking for air", type: "select", options: ["Never", "Rarely", "Frequently (1-2 times/week)", "Almost every night"] },
      { id: "morning_headache", label: "Dull headache across forehead upon waking", type: "select", options: ["Never", "Occasionally", "Frequently", "Daily morning headaches"] },
      { id: "daytime_drowsiness_apnea", label: "Tendency to fall asleep during passive tasks (reading, TV)", type: "range", min: 1, max: 10, labelMin: "Alert", labelMax: "Uncontrollable sleep" },
      { id: "neck_circumference", label: "Neck size measurement (thick neck risk factor)", type: "select", options: ["Standard", "Thicker neck (>16 inches)", "Very thick neck (>17 inches)", "Obese neck indicators"] }
    ],
    symptomsList: [
      "Sensation of dry mouth and throat immediately upon waking",
      "Restless sleep with heavy tossing and night sweats",
      "Chronic daytime sleepiness unresolved by long sleep hours",
      "Frequent nighttime urination without bladder infection"
    ]
  },

  // ==================== DIGESTIVE INTELLIGENCE ====================
  {
    id: "ibs_assessment",
    name: "IBS & Colon Assessment",
    category: "digestive",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    description: "Evaluates bowel dysmotility, visceral hypersensitivity, and gut nervous system tone.",
    questions: [
      { id: "bowel_pain", label: "Abdominal cramping relieved by bowel movements", type: "select", options: ["Never", "Rarely", "Frequently", "Almost always after eating"] },
      { id: "bowel_regularity", label: "Consistency and transit pattern of stools", type: "select", options: ["Regular formed", "Chronic constipation", "Chronic diarrhea", "Alternating constipation & diarrhea"] },
      { id: "mucus_stool", label: "Presence of clear or white mucus in stools", type: "select", options: ["Never", "Rarely", "Frequently", "Constant mucosal coating"] },
      { id: "stress_gut", label: "Bowel disturbances triggered by emotional stress/anxiety", type: "range", min: 1, max: 10, labelMin: "No connection", labelMax: "Immediate diarrhea/spasms" },
      { id: "bloat_post_meal", label: "Abdominal bloating beginning immediately after eating", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Severe distention" }
    ],
    symptomsList: [
      "Pain in colon before stool, relieved instantly after passing",
      "Bowel irritation worse mornings, better warm drinks",
      "Constant flatulence and rumbling sound in gut",
      "Urgent call for stool immediately after waking up"
    ]
  },
  {
    id: "gut_health",
    name: "Gut Health & Microbiome Score",
    category: "digestive",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    description: "Measures mucosal barrier integrity (leaky gut indicators) and microbial diversity markers.",
    questions: [
      { id: "food_sensitivities", label: "Sensitivities or reactions to multiple food groups", type: "select", options: ["None", "Lactose / Dairy only", "Gluten / Grains sensitivity", "Reactions to almost all solid foods"] },
      { id: "antibiotic_history", label: "Recent or repeated use of broad-spectrum antibiotics", type: "select", options: ["No use in 3 years", "Single course", "Multiple courses in past year", "Chronic/recurrent antibiotic use"] },
      { id: "skin_gut_link", label: "Skin breakouts (acne, eczema) linked to diet shifts", type: "range", min: 1, max: 10, labelMin: "No effect", labelMax: "Immediate breakout" },
      { id: "processed_foods", label: "Dietary intake of ultra-processed foods & sweeteners", type: "range", min: 1, max: 10, labelMin: "Zero processed", labelMax: "Very High" },
      { id: "immune_resistance", label: "General immune resistance (frequency of catch-colds)", type: "range", min: 1, max: 10, labelMin: "Excellent", labelMax: "Catch colds easily" }
    ],
    symptomsList: [
      "Unexplained skin rashes or hives linked to digestion",
      "Joint pain or brain fog starting after heavy meals",
      "Tongue coated with thick white or yellowish fur",
      "Persistent sugar cravings indicating yeast overgrowth"
    ]
  },
  {
    id: "gerd_evaluation",
    name: "GERD & Gastric Acid Evaluation",
    category: "digestive",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    description: "Evaluates cardiac sphincter tone, acid regurgitation, and stomach lining stress.",
    questions: [
      { id: "heartburn", label: "Heartburn or retrosternal burning sensation", type: "select", options: ["Never", "Occasionally (spicy food)", "Weekly (after dinners)", "Daily burning, requires antacids"] },
      { id: "regurgitation", label: "Sour or bitter gastric juice entering the mouth", type: "select", options: ["Never", "Rarely", "Frequently when lying down", "Almost daily regurgitation"] },
      { id: "acid_cough", label: "Dry tickling cough worse when lying flat in bed", type: "select", options: ["Never", "Rarely", "Frequently at night", "Constant nocturnal cough & hoarseness"] },
      { id: "eating_speed", label: "Speed of eating and chewing habits", type: "range", min: 1, max: 10, labelMin: "Slow & Chewed", labelMax: "Very Fast" },
      { id: "spicy_fatty_trigger", label: "Gastric burning triggered by coffee, fats, or spices", type: "range", min: 1, max: 10, labelMin: "No reaction", labelMax: "Severe immediate burn" }
    ],
    symptomsList: [
      "Burning pain in stomach chest-area worse lying down",
      "Sour hot eructations, leaving a burning trail in esophagus",
      "Stomach bloating worse after drinking cold water",
      "Heartburn relieved temporarily by drinking warm water"
    ]
  },
  {
    id: "liver_health",
    name: "Liver Health & Detox Assessment",
    category: "digestive",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    description: "Tracks hepatic detoxification phase markers, bile excretion, and hepatic load.",
    questions: [
      { id: "right_side_fullness", label: "Fullness or dull ache under right rib cage", type: "select", options: ["None", "Occasional heaviness", "Frequent dull pressure", "Constant painful heaviness"] },
      { id: "tongue_coating", label: "Appearance of tongue surface upon waking", type: "select", options: ["Clean pink", "Thin white coating", "Thick yellow-greasy coating", "Cracked tongue with dry map-like spots"] },
      { id: "chemical_sensitivity", label: "Sensitivity to chemical smells, perfumes, or alcohol", type: "select", options: ["Normal", "Sensitive to alcohol", "Headaches from perfume fumes", "Extreme sensitivity to all chemical products"] },
      { id: "fatigue_liver", label: "General fatigue beginning around midday (12-2 PM)", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Severe exhaustion" },
      { id: "skin_itchiness", label: "Unexplained generalized skin itching (no rash)", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Severe itching" }
    ],
    symptomsList: [
      "Bitter taste in mouth, especially in the mornings",
      "Stools light clay-colored or floating/greasy",
      "Itching skin worse warmth of bed, better cold water",
      "Irritability, anger loops, and midday sluggishness"
    ]
  },
  {
    id: "fatty_liver_risk",
    name: "Fatty Liver (NAFLD) Risk Evaluation",
    category: "digestive",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    description: "Assesses risks of hepatic triglyceride accumulation (fatty infiltration).",
    questions: [
      { id: "visceral_belly", label: "Waistline visceral adipose concentration", type: "select", options: ["Flat / lean", "Mild subcutaneous fat", "Prominent round firm belly", "Severe visceral obesity"] },
      { id: "lipid_panel_tg", label: "Serum Triglycerides (TG) levels if known", type: "select", options: ["Optimal (<100 mg/dL)", "Normal (100-149)", "Elevated (150-199)", "Severe high TG (>200)"] },
      { id: "sugar_fructose", label: "Fructose, soda, and high-carb dietary index", type: "range", min: 1, max: 10, labelMin: "Zero soda", labelMax: "Daily high sugar" },
      { id: "exercise_resistance", label: "Stamina limitations due to fat accumulation", type: "range", min: 1, max: 10, labelMin: "Active", labelMax: "Very sluggish" },
      { id: "alt_ast_levels", label: "Liver enzymes (ALT/AST) level patterns if known", type: "select", options: ["Perfectly normal", "Slightly elevated AST/ALT", "Confirmed elevated enzymes", "Chronic hepatic fatty changes"] }
    ],
    symptomsList: [
      "Dull aching pressure in the right upper abdomen",
      "Fatigue worse after meals, especially heavy carbs",
      "Nausea and aversion to rich, fatty, or fried foods",
      "Yellowish tint in eyes (mild subicterus) under stress"
    ]
  },

  // ==================== SKIN INTELLIGENCE ====================
  {
    id: "psoriasis_severity",
    name: "Psoriasis Severity Assessment",
    category: "skin",
    gradient: "from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/50",
    textClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400",
    description: "Evaluates epidermal turn-over rate, silver plaque coverage, and dermal cracks.",
    questions: [
      { id: "plaque_location", label: "Distribution of skin scaling or red plaques", type: "select", options: ["None", "Scalp only", "Extensor surfaces (elbows/knees)", "Generalized body coverage"] },
      { id: "scaling_thickness", label: "Thickness of silver-white scales on patches", type: "select", options: ["No scales", "Thin powdery flakes", "Thick distinct silver plaques", "Extremely thick peeling layers"] },
      { id: "joint_stiffness_skin", label: "Joint stiffness or painful fingers linked to skin", type: "select", options: ["None", "Occasional finger stiffness", "Frequent joint pain", "Confirmed psoriatic arthritis"] },
      { id: "skin_cracking", label: "Plaques cracking and bleeding spontaneously", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Constantly Cracking" },
      { id: "itch_burn", label: "Itching and burning intensity in plaques", type: "range", min: 1, max: 10, labelMin: "No sensation", labelMax: "Agonizing Pruritus" }
    ],
    symptomsList: [
      "Silvery scaling plaques on red base skin",
      "Skin lesions worse in winter, better from solar heat",
      "Psoriatic plaques worse on extensor limbs (knees, elbows)",
      "Itching worse during dry drafty weather, better hot baths"
    ]
  },
  {
    id: "eczema_assessment",
    name: "Eczema Assessment",
    category: "skin",
    gradient: "from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/50",
    textClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400",
    description: "Maps atopic skin barrier defects, oozing vs dry eczema, and itching triggers.",
    questions: [
      { id: "eczema_nature", label: "Typical presentation of eczematous patches", type: "select", options: ["Dry, scaly, leathery skin", "Red, inflamed, moist spots", "Oozing thin yellow fluid", "Dry cracks alternating with oozing vesicles"] },
      { id: "itch_worse_time", label: "Time of day when skin itching is most severe", type: "select", options: ["Constant low itch", "Worse in morning", "Worse late afternoon", "Severe worsening at night, scratching in sleep"] },
      { id: "atopic_history", label: "Family history of atopy (asthma, hay fever, eczema)", type: "select", options: ["No history", "One parent", "Self has asthma / seasonal allergies", "Atopic triad present in family"] },
      { id: "bath_reaction", label: "Skin reaction to bathing or contact with water", type: "range", min: 1, max: 10, labelMin: "Soothes skin", labelMax: "Aggravates itching severely" },
      { id: "stress_breakouts_skin", label: "Skin flare-ups triggered by emotional stress", type: "range", min: 1, max: 10, labelMin: "No reaction", labelMax: "Immediate breakout" }
    ],
    symptomsList: [
      "Eczema on flexor creases (insides of elbows, behind knees)",
      "Intense itching worse by warmth of bed, scratching till bleeds",
      "Vesicles oozing clear or sticky, honey-like fluid",
      "Eczema lesions worse in cold winter air, better dry warmth"
    ]
  },
  {
    id: "acne_evaluation",
    name: "Acne Severity Evaluation",
    category: "skin",
    gradient: "from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/50",
    textClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400",
    description: "Evaluates sebum production, follicular hyperkeratinization, and acne scarring.",
    questions: [
      { id: "acne_types", label: "Primary types of acne lesions visible", type: "select", options: ["Comedones (blackheads/whiteheads)", "Inflamed papules/pustules", "Deep painful nodules/cysts", "Severe cystic acne with scarring"] },
      { id: "sebum_production", label: "Sebum output and skin oiliness index", type: "select", options: ["Normal / dry", "T-zone oily", "Oily face and scalp", "Excessive oil output, constant shine"] },
      { id: "acne_locations", label: "Distribution of acne eruptions", type: "select", options: ["Face only", "Face and forehead", "Face, neck, and upper chest", "Generalized (face, back, chest, shoulders)"] },
      { id: "healing_scars", label: "Propensity of acne spots to leave dark marks/scars", type: "range", min: 1, max: 10, labelMin: "Heals clean", labelMax: "Severe scarring/marks" },
      { id: "diet_acne", label: "Acne aggravation linked to dairy, sugars, or chocolate", type: "range", min: 1, max: 10, labelMin: "No effect", labelMax: "Immediate flare-up" }
    ],
    symptomsList: [
      "Cystic acne worse around chin and jawline, hormone-driven",
      "Acne pustules with thick yellow discharge, slow to heal",
      "Skin oily, dirty-looking, with prominent blackheads",
      "Eruptions worse in warm room, better open cool air"
    ]
  },
  {
    id: "skin_barrier",
    name: "Skin Barrier Health Score",
    category: "skin",
    gradient: "from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/50",
    textClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400",
    description: "Assesses trans-epidermal water loss (TEWL), lipid matrix, and sensitivity thresholds.",
    questions: [
      { id: "product_sting", label: "Stinging or burning when applying standard skin products", type: "select", options: ["Never", "Occasionally (active products)", "Frequently (basic moisturizers)", "Severe burning from all cosmetics"] },
      { id: "skin_flakiness", label: "Persistent flakiness, peeling, or tightness", type: "select", options: ["Hydrated skin", "Mild winter tightness", "Frequent flakiness on cheeks/nose", "Constant tight, peeling skin barrier"] },
      { id: "environmental_react", label: "Skin redness response to sun, wind, or cold drafts", type: "range", min: 1, max: 10, labelMin: "Resilient", labelMax: "Immediate redness" },
      { id: "dryness_season", label: "Dryness level changes during seasonal shifts", type: "range", min: 1, max: 10, labelMin: "Stable", labelMax: "Extreme dehydration" },
      { id: "trans_epidermal_water", label: "Skin feels dry despite thick creams", type: "select", options: ["Cream hydrates", "Requires frequent reapplication", "Dry after 1 hour", "Skin remains dry and tight always"] }
    ],
    symptomsList: [
      "Skin feels tight, dry, and hot to the touch",
      "Fine dry lines and cracks appearing on face and hands",
      "Skin sensitive to soap, better washing with water only",
      "Sudden flushing and redness under slight temperature change"
    ]
  },

  // ==================== MENTAL HEALTH INTELLIGENCE ====================
  {
    id: "anxiety_assessment",
    name: "Anxiety Assessment",
    category: "mental",
    gradient: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20 hover:border-indigo-500/50",
    textClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
    description: "Evaluates chronic worry index, somatic anxiety manifestations, and startle responses.",
    questions: [
      { id: "worry_control", label: "Inability to control intrusive worrying thoughts", type: "select", options: ["Never", "Occasionally", "Frequently (daily loops)", "Constant uncontrollable worry"] },
      { id: "somatic_anxiety", label: "Physical symptoms (muscle tension, heart racing, dry mouth)", type: "select", options: ["None", "Occasional mild tension", "Frequent heart racing under stress", "Severe somatic anxiety (trembling, dyspnea)"] },
      { id: "startle_reflex", label: "Exaggerated startle response to sudden noises", type: "select", options: ["Normal response", "Slightly startle-prone", "Easily startle-frightened", "Constant hyper-vigilance"] },
      { id: "anticipatory_dread", label: "Anticipatory anxiety or fear of upcoming tasks", type: "range", min: 1, max: 10, labelMin: "Confident", labelMax: "Debilitating Dread" },
      { id: "night_wake_panic", label: "Nocturnal waking with panic or fear", type: "range", min: 1, max: 10, labelMin: "Never", labelMax: "Very Frequent" }
    ],
    symptomsList: [
      "Anticipatory anxiety worse before exams or public speaking",
      "Restlessness, pacing, or need to stay constantly moving",
      "Panic attacks with sensation of choking, better fresh air",
      "Worry worse by isolation, better in company"
    ]
  },
  {
    id: "depression_screening",
    name: "Depression Screening",
    category: "mental",
    gradient: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20 hover:border-indigo-500/50",
    textClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
    description: "Evaluates anhedonia, low mood, sleep disturbances, and self-worth indices.",
    questions: [
      { id: "anhedonia", label: "Loss of interest in previously enjoyed activities", type: "select", options: ["None", "Mild disinterest", "Moderate lack of joy", "Complete anhedonia / flat emotion"] },
      { id: "low_mood", label: "Persistent sad, empty, or tearful mood", type: "select", options: ["Never", "Occasional sad days", "Frequently down", "Constant dark, heavy depression"] },
      { id: "guilt_worthless", label: "Feelings of worthlessness or excessive guilt", type: "select", options: ["None", "Occasional mild regret", "Frequent self-criticism", "Severe debilitating guilt"] },
      { id: "psychomotor_speed", label: "Sluggishness in speech and physical movements", type: "range", min: 1, max: 10, labelMin: "Active", labelMax: "Extremely Heavy" },
      { id: "appetite_shift", label: "Unusual changes in appetite or weight", type: "select", options: ["Stable", "Loss of appetite", "Increased emotional eating", "Severe swings in weight"] }
    ],
    symptomsList: [
      "Depressive weeping state, worse in evenings, better open air",
      "Silent grief, closed emotions, aversion to consolation",
      "Morning heavy sadness, improving slightly as day goes on",
      "Lack of vital heat, chilly, desires warm wraps"
    ]
  },
  {
    id: "burnout_assessment",
    name: "Burnout Assessment",
    category: "mental",
    gradient: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20 hover:border-indigo-500/50",
    textClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
    description: "Evaluates emotional exhaustion, professional cynicism, and energy reserves.",
    questions: [
      { id: "emotional_exhaustion", label: "Sensation of being emotionally drained by work", type: "select", options: ["Never", "Occasionally", "Frequently exhausted", "Complete emotional collapse"] },
      { id: "cynicism", label: "Feelings of detachment, sarcasm, or cynicism", type: "select", options: ["Empathetic / positive", "Occasional mild frustration", "High cynicism / checking out", "Total professional detachment"] },
      { id: "brain_fog_fatigue", label: "Daytime cognitive exhaustion or focus depletion", type: "range", min: 1, max: 10, labelMin: "Energetic", labelMax: "Unrelieved Fog" },
      { id: "physical_ailments", label: "Somatization (headaches, gastric spasms, neck ache)", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Severe somatic pain" },
      { id: "restoration", label: "Recovery from fatigue during weekends or holidays", type: "select", options: ["Fully restores", "Partially restores", "Rarely recovers", "Chronic exhaustion unresolved by rest"] }
    ],
    symptomsList: [
      "Brain fog worse by mental exertion, better closing eyes",
      "Constant muscular stiffness in neck and traps",
      "Aversion to mental work or speaking with others",
      "General chilly baseline, better resting in dark room"
    ]
  },
  {
    id: "resilience_score",
    name: "Emotional Resilience Score",
    category: "mental",
    gradient: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20 hover:border-indigo-500/50",
    textClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
    description: "Calculates baseline emotional recovery and psychological safety index.",
    questions: [
      { id: "bounce_back", label: "Ease of bouncing back after setbacks or failures", type: "select", options: ["Bounce back instantly", "Requires a few days", "Takes weeks of processing", "Difficulty moving past failures"] },
      { id: "emotional_recovery", label: "Speed of calming down after high anger or shock", type: "select", options: ["Instant recovery", "Slight delay", "Spikes last for hours", "Days of residual emotional loops"] },
      { id: "support_network", label: "Availability of strong emotional support systems", type: "range", min: 1, max: 10, labelMin: "Isolated", labelMax: "Highly Supported" },
      { id: "optimism_index", label: "Baseline perspective on future plans", type: "range", min: 1, max: 10, labelMin: "Pessimistic", labelMax: "Highly Optimistic" },
      { id: "boundary_setting", label: "Ability to establish personal health boundaries", type: "select", options: ["Easy boundary control", "Occasionally over-commits", "Difficulty saying no", "Severe boundary collapse"] }
    ],
    symptomsList: [
      "Anxiety or shock loops causing cold perspiration on head",
      "Emotional baseline stabilized by regular physical walking",
      "Tendency to suppress grief, causing somatic colon spasms",
      "Highly sensitive to sensory overstimulation (noise, lights)"
    ]
  },
  {
    id: "cognitive_perf",
    name: "Cognitive Performance Evaluation",
    category: "mental",
    gradient: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20 hover:border-indigo-500/50",
    textClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
    description: "Measures working memory, processing speed, and sustained attention.",
    questions: [
      { id: "attention_span", label: "Sustained attention on single task without distraction", type: "select", options: ["Highly focused (>1h)", "Slight drift (30m)", "Frequent distraction (10m)", "Inability to focus for 5 minutes"] },
      { id: "word_retrieval", label: "Difficulty retrieving names, dates, or specific words", type: "select", options: ["Never", "Rarely", "Frequently ('tip of the tongue')", "Constant memory retrieval blocks"] },
      { id: "mental_exhaustion_perf", label: "Mental fatigue after short periods of analytical study", type: "range", min: 1, max: 10, labelMin: "Resilient", labelMax: "Immediate exhaustion" },
      { id: "decisiveness", label: "Ability to make decisions under complex options", type: "range", min: 1, max: 10, labelMin: "Decisive", labelMax: "Severe Indecision" },
      { id: "sleep_fog", label: "Brain fog thickness after poor night sleep", type: "select", options: ["Minimal fog", "Mild grogginess", "Severe cognitive decline", "Complete inability to perform complex tasks"] }
    ],
    symptomsList: [
      "Mental fatigue relieved by short afternoon nap",
      "Word retrieval errors, saying wrong words in speech",
      "Headache from study, worse writing or looking down",
      "Brain fog better in open cool air or washing face"
    ]
  },

  // ==================== WOMEN'S HEALTH INTELLIGENCE ====================
  {
    id: "womens_pcos",
    name: "Women's PCOS & Metabolism Profile",
    category: "womens",
    gradient: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 hover:border-purple-500/50",
    textClass: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
    description: "Evaluates follicle health parameters, hormonal acne, cycle tracking, and insulin link.",
    questions: [
      { id: "menstruation_cycle", label: "Cycle tracking and ovulation predictability", type: "select", options: ["Predictable regular", "Scanty / delayed cycle", "Irregular cycle timelines", "Long-term amenorrhea"] },
      { id: "androgen_balance", label: "Signs of elevated androgens (facial hair, hair loss)", type: "select", options: ["None", "Mild", "Moderate", "Severe androgenic indicators"] },
      { id: "weight_visceral", label: "Belly fat accumulation speed", type: "range", min: 1, max: 10, labelMin: "No effect", labelMax: "Extremely Fast" },
      { id: "cravings_sugar_pcos", label: "Severe cravings for refined sugar and bakery items", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Constant Cravings" },
      { id: "basal_temp", label: "Basal body temperature baseline trend", type: "select", options: ["Stable normal", "Consistently chilly", "Fluctuating", "Tendency to night sweats"] }
    ],
    symptomsList: [
      "Delayed menses with bearing-down pelvic weight",
      "Hormonal breakouts along jawline and under neck",
      "Swelling of abdomen and ankles before cycle starts",
      "Consolation and open air relieve emotional PMS loop"
    ]
  },
  {
    id: "menstrual_health",
    name: "Menstrual Health & Ovulation Sync",
    category: "womens",
    gradient: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 hover:border-purple-500/50",
    textClass: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
    description: "Evaluates follicular phase, luteal phase length, dysmenorrhea, and cycle flow.",
    questions: [
      { id: "flow_nature", label: "Volume and color of menstrual flow", type: "select", options: ["Moderate red flow", "Scanty/thin flow", "Heavy clotted flow", "Scanty clotted alternating with hemorrhage"] },
      { id: "dysmenorrhea_pain", label: "Menstrual cramping location and relief modalities", type: "select", options: ["No pain", "Cramps better by warmth", "Cramps better by movement/pressure", "Spasms radiating to back/thighs"] },
      { id: "ovulation_pain", label: "Sharp mid-cycle pain (mittelschmerz)", type: "select", options: ["Never", "Rarely", "Frequently every month", "Constant mid-cycle pain & spot-bleeding"] },
      { id: "pms_days", label: "Duration of premenstrual syndrome (days)", type: "range", min: 1, max: 14, labelMin: "1 day", labelMax: "14 days" },
      { id: "irritation_index", label: "Baseline irritability during follicular phase", type: "range", min: 1, max: 10, labelMin: "Calm", labelMax: "Extremely Irritated" }
    ],
    symptomsList: [
      "Spasmodic uterine cramping relieved by applying hot water bag",
      "Cycle preceded by intense migraine or gastric upset",
      "Scanty dark flow worse lying down, better walking",
      "Leucorrhea thick, white, or yellow between cycles"
    ]
  },
  {
    id: "menopause_profile",
    name: "Menopause & Thermoregulatory Assessment",
    category: "womens",
    gradient: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 hover:border-purple-500/50",
    textClass: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
    description: "Tracks estrogen deceleration, vasomotor flashes, and bone mineral integrity indicators.",
    questions: [
      { id: "hot_flashes", label: "Frequency and intensity of hot flashes", type: "select", options: ["None", "Mild / occasional", "Frequent hot flashes daily", "Severe hourly flashes with sweating"] },
      { id: "sleep_sweats", label: "Night sweats requiring changes of clothing", type: "select", options: ["Never", "Rarely", "Frequently (1-2 times/week)", "Almost every night"] },
      { id: "vaginal_dryness", label: "Vaginal mucosal dryness and irritation", type: "select", options: ["Hydrated normal", "Mild discomfort", "Significant mucosal dryness", "Severe cracking and pain"] },
      { id: "bone_ache_menopause", label: "Bone stiffness or backache post-menopause", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Severe Aching" },
      { id: "anxiety_menopause", label: "Anxiety, brain fog, or sudden mood drops", type: "range", min: 1, max: 10, labelMin: "Stable", labelMax: "High Anxiety" }
    ],
    symptomsList: [
      "Hot flashes spreading upwards from chest to face",
      "Night sweats worse between 12:00 AM - 3:00 AM",
      "Palpitations and heat flashes relieved by cold drafts",
      "Aversion to tight collars or clothing around neck"
    ]
  },
  {
    id: "fertility_wellness",
    name: "Fertility Wellness Assessment",
    category: "womens",
    gradient: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 hover:border-purple-500/50",
    textClass: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
    description: "Maps luteal wellness, endometrial receptivity factors, and mucus quality.",
    questions: [
      { id: "cervical_mucus", label: "Observation of fertile egg-white cervical mucus", type: "select", options: ["Clear elastic mucus", "Thick sticky mucus", "Very dry / scanty mucus", "Inconsistent patterns"] },
      { id: "basal_temp_biphasic", label: "Biphasic basal body temperature shift (thermal spike)", type: "select", options: ["Confirmed thermal spike", "Unclear temperature shift", "Monophasic graph (no spike)", "Highly erratic temperature line"] },
      { id: "cycle_length_luteal", label: "Length of luteal phase (days from ovulation to cycle)", type: "select", options: ["Healthy (12-14 days)", "Short luteal phase (<10 days)", "Erratic phase length", "Absent ovulation signals"] },
      { id: "pelvic_circulation", label: "Cold sensation in lower abdomen or pelvic region", type: "range", min: 1, max: 10, labelMin: "Warm baseline", labelMax: "Constantly Cold" },
      { id: "stress_impact_fertility", label: "Perceived impact of stress on ovulation timelines", type: "range", min: 1, max: 10, labelMin: "No effect", labelMax: "Stress delays cycle" }
    ],
    symptomsList: [
      "Scanty cervical mucus, dry vaginal baseline during fertile window",
      "Anxiety or fear loops regarding fertility timelines",
      "Heaviness in pelvis, feeling as if viscera would escape",
      "Physical baseline improved by gentle exercise, open air"
    ]
  },

  // ==================== CHILDREN'S HEALTH INTELLIGENCE ====================
  {
    id: "immunity_assessment",
    name: "Children's Immunity Assessment",
    category: "childrens",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/50",
    textClass: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
    description: "Evaluates child's immune resilience, lymphatic response, and allergy profiles.",
    questions: [
      { id: "catch_colds_child", label: "Frequency of seasonal colds or throat infections", type: "select", options: ["Rare (0-1 times/year)", "Normal (2-3 times/year)", "Frequent (6+ times/year)", "Catch colds immediately with weather change"] },
      { id: "tonsil_swelling", label: "Lymphatic tonsil swelling or adenoid blocks", type: "select", options: ["Never", "Rarely swelling", "Frequent tonsillitis / snoring", "Chronic adenoid enlargement, mouth breathing"] },
      { id: "recovery_duration", label: "Average recovery time from simple febrile colds", type: "select", options: ["Fast (2-3 days)", "Standard (5-7 days)", "Slow (> 10 days)", "Colds linger for weeks with chest rattle"] },
      { id: "perspiration_head", label: "Profuse head sweating during sleep (especially back of head)", type: "range", min: 1, max: 10, labelMin: "None", labelMax: "Sweats wet the pillow" },
      { id: "appetite_stagnation", label: "Craving for unusual items (chalk, soil) or selective diet", type: "range", min: 1, max: 10, labelMin: "Healthy diet", labelMax: "Severe selectiveness" }
    ],
    symptomsList: [
      "Profuse sweating on head, wetting the pillow during sleep",
      "Mouth breathing during sleep, due to enlarged adenoid tissues",
      "Susceptibility to catch cold from damp weather, feet getting wet",
      "Tonsils swollen, red, worse swallowing cold liquids, better warm"
    ]
  },
  {
    id: "growth_dev",
    name: "Growth & Development Evaluation",
    category: "childrens",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/50",
    textClass: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
    description: "Tracks physical milestones, bone growth indicators, and assimilation parameters.",
    questions: [
      { id: "milestones_walk", label: "Milestones timing (dentition, walking, talking)", type: "select", options: ["On time / early", "Slight delay in walking", "Delayed dentition and talking", "Significant developmental delay"] },
      { id: "bone_strength", label: "Bone structure indicators (soft bones, teething issues)", type: "select", options: ["Strong normal bones", "Slow teething / fontanelle closing", "Weak ankles, child falls easily", "Delayed structural growth"] },
      { id: "digestive_assimilation", label: "Bowel assimilation and stool consistency", type: "select", options: ["Formed normal", "Loose stools with undigested food", "Tendency to dry hard stools", "Sour-smelling diarrhea with teething"] },
      { id: "height_percentile", label: "Height progression percentile range", type: "range", min: 10, max: 99, labelMin: "10% (Low)", labelMax: "99% (High)" },
      { id: "sleep_excitability", label: "Night terrors or child talking during sleep", type: "range", min: 1, max: 10, labelMin: "Peaceful", labelMax: "Very Restless" }
    ],
    symptomsList: [
      "Teething difficulties accompanied by green, sour stools",
      "Child has large head, open fontanelles, and sweating back of neck",
      "Weakness of limbs, ankles turn easily when walking",
      "Craving for boiled eggs, cold milk, and starches"
    ]
  },
  {
    id: "learning_concentration",
    name: "Learning & Concentration Assessment",
    category: "childrens",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/50",
    textClass: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
    description: "Evaluates child's cognitive focus, memory retention, and hyperactive behaviors.",
    questions: [
      { id: "sitting_still", label: "Ability to sit quietly during simple classroom study", type: "select", options: ["Sits focused (>30m)", "Slightly fidgety", "Inability to sit still, runs around", "Constant hyperactive movement, cannot focus"] },
      { id: "memory_retention", label: "Retention speed for spelling or short poems", type: "select", options: ["Retains quickly", "Needs repetition", "Forgets easily under stress", "Severe difficulty remembering basic details"] },
      { id: "sensory_overload_child", label: "Behavioral outbursts under noise or bright environments", type: "range", min: 1, max: 10, labelMin: "Calm", labelMax: "Immediate meltdown" },
      { id: "impulsivity", label: "Impulsive behaviors or talking out of turn", type: "range", min: 1, max: 10, labelMin: "Controlled", labelMax: "Highly Impulsive" },
      { id: "handwriting_control", label: "Fine motor handwriting control index", type: "select", options: ["Steady control", "Messy but readable", "Illegible / spelling reversal", "Coordination challenges"] }
    ],
    symptomsList: [
      "Hyperactivity accompanied by continuous talking and laughing",
      "Memory lag due to lack of attention, easily distracted by noises",
      "Spells of anger or obstinacy when corrected or consoled",
      "Sleep fragmentation, grinding teeth at night"
    ]
  }
];

export const getAssessmentsByCategory = (catId: string) => {
  return ASSESSMENT_PROFILES.filter(p => p.category === catId);
};
