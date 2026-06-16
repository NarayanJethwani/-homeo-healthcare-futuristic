"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Sparkles, Heart, Sliders, ChevronRight, Play, Check, X,
  ArrowLeft, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, FileText, Calendar,
  UploadCloud, Info, Trash2, Printer, Plus, Award, User, Layers, BookOpen, MessageSquare,
  TrendingUp, Clock, Flame, ShieldAlert, HeartPulse, ChevronDown, Send, Copy, Maximize2, Minimize2
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
  ConstitutionalProfile,
  HealthHistoryEntry,
  BiologicalAgeMetrics,
  ClinicalPortalSync,
  WearableSyncData
} from "./types";
import { analyzeDigitalTwin, getRelatedContent, RelatedContent } from "./clinicalRulesEngine";
import { parseLabReport, LabAnalysisResult } from "./labOcrEngine";
import RadarChart from "./radarChart";
import SchemaMarkup from "./schemaMarkup";
import HealthAssistant from "./HealthAssistant";
import MarkdownRenderer from "./MarkdownRenderer";

function getLocalFallbackResponse(query: string, twin: HealthDigitalTwin): string {
  const textLower = query.toLowerCase();

  // 1. Psora / Miasm
  if (textLower.includes("psora") || textLower.includes("miasm")) {
    return `### 🧠 Quick Insight
In Homeopathy, a **Miasm** represents an inherited or acquired chronic biological predisposition.

What would you like to do?
[Explore Miasms] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Moderate
**Data Used**: Constitutional Profile, chronic history
**Active Signals**:
🟢 Recovery Capacity: Stable
🟡 New Symptom: Miasmatic strain predisposition
⚪ Clinical Concern Level: Low

### What This Means
Miasms represent metabolic and cellular predispositions:
- **Psora**: The miasm of functional deficiency, sensory hypersensitivity, and irritation (fatigue, allergies, skin itching).
- **Sycosis**: The miasm of metabolic accumulation, stagnation, and sluggish overgrowths (bloating, water retention, PCOS).
- **Syphilis**: The miasm of structural destruction, ulceration, and nocturnal deterioration.

### Why It Matters
Understanding your miasmatic profile helps identify the chronic pattern behind active symptoms, preventing them from developing into structural diseases.

### Personalized Insight
Your profile suggests primary metabolic markers. Understanding if your fatigue is Psoric (sensory hyperactivity) or your bloating is Sycotic (accumulation) helps customize your lifestyle support.

### Recommended Next Steps
- Take the **Constitutional Assessment** to map your dominant miasm.
- Follow a clean, whole-foods diet to reduce Sycotic accumulation.
- Practice daily mindfulness to soothe Psoric hypersensitivity.

### 👨⚕️ Clinical Insight
Dr. Jethwani advocates addressing root miasmatic patterns rather than treating symptoms in isolation. True healing occurs when the inherited chronic block is resolved.

### Follow-Up Questions
1. Do you experience symptoms that are worse at night?
2. Do you have a history of skin eruptions that were suppressed?
3. How is your overall vitality score trending?

### Continue on WhatsApp
📱 Let's schedule a miasmatic review:
[Remind Me in 4 Hours] [Track Miasms] [Send Miasm Guide]`;
  }

  // 2. eGFR / Kidney / Creatinine
  if (textLower.includes("egfr") || textLower.includes("kidney") || textLower.includes("creatinine")) {
    return `### 🧠 Quick Insight
eGFR (Estimated Glomerular Filtration Rate) measures your kidney filtration efficiency. Low levels suggest functional load on the kidneys.

What would you like to do?
[Explore Kidney Health] [Kidney Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: High (lab-validated)
**Data Used**: eGFR index, creatinine level, hydration parameters
**Active Signals**:
🟢 Recovery Capacity: Stable
🟡 New Symptom: Kidney load / filtration shift
⚪ Clinical Concern Level: Low-Moderate

### What This Means
An eGFR above 60 mL/min/1.73m² is normal. Below 60 indicates a filtration decline. Creatinine is a waste product filtered by the kidneys; high blood creatinine indicates slower filtration.

### Why It Matters
Chronic kidney load affects fluid balance, waste clearance, and blood pressure. Supporting the kidneys early prevents structural wear.

### Personalized Insight
Based on your Health Twin insights, your overall Vitality is **${twin.overallScore}%**, indicating good vascular reserves to assist renal filtration.

### Recommended Next Steps
- Maintain stable daily hydration (2.5-3 liters of water).
- Reduce excessive sodium and processed protein intake.
- Complete the **Renal & Urinary Health Assessment**.

### 👨⚕️ Clinical Insight
Dr. Jethwani emphasizes that renal load is often aggravated by high blood pressure or insulin resistance. Focus on vascular support and stress reduction.

### Follow-Up Questions
1. What was your latest eGFR and Creatinine value?
2. Do you experience puffiness around the eyes or ankle swelling?
3. What is your daily water consumption?

### Continue on WhatsApp
📱 Let's track your kidney biomarkers:
[Remind Me in 4 Hours] [Track Water Intake] [Send Renal Guide]`;
  }

  // 3. PCOS
  if (textLower.includes("pcos") || textLower.includes("polycystic")) {
    return `### 🧠 Quick Insight
Polycystic Ovary Syndrome (PCOS) is a common endocrine disorder characterized by hormonal imbalances, irregular ovulation, and metabolic loading.

What would you like to do?
[Explore Causes] [PCOS Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Moderate (based on lifestyle parameters)
**Data Used**: Metabolic Score, Constitutional Profile, Symptom logs
**Active Signals**:
🟢 Recovery Capacity: Stable
🟡 New Symptom: Hormonal/ovulatory indicators
⚪ Clinical Concern Level: Moderate

### What This Means
PCOS is characterized by elevated androgen levels (male hormones), irregular menstrual cycles, and small cysts on the ovaries. It is heavily linked to insulin resistance and low-grade systemic inflammation.

### Why It Matters
Unmanaged PCOS can lead to metabolic dysfunction, insulin resistance, fertility challenges, and cardiovascular load over time. Understanding your specific driver (e.g. inflammatory, adrenal, or insulin-resistant) is crucial.

### Personalized Insight
Based on your Health Twin insights, your Metabolic score is currently at **${twin.systemScores?.endocrine ?? 100}%**, suggesting a strong baseline for hormone regulation. However, we should monitor any insulin markers.

### Recommended Next Steps
- Consider a low-glycemic, anti-inflammatory whole-food diet.
- Incorporate strength training and moderate aerobic exercise.
- Track menstrual cycle regularity.
- Take the **Hormonal & Metabolic Assessment** on our platform.

### 👨⚕️ Clinical Insight
Dr. Jethwani’s clinical approach emphasizes that PCOS is a systemic metabolic pattern rather than an isolated ovarian issue. Restoring insulin sensitivity and reducing inflammatory load can help return natural cycle rhythms.

### Follow-Up Questions
1. Have you been formally diagnosed with PCOS?
2. Are your menstrual cycles regular, delayed, or absent?
3. Do you experience symptoms like hair thinning, acne, or fatigue?

### Continue on WhatsApp
📱 Let's map your metabolic trends together:
[Remind Me in 4 Hours] [Track PCOS Symptoms] [Send PCOS Guide]`;
  }

  // 4. HbA1c / Insulin / Diabetes
  if (textLower.includes("hba1c") || textLower.includes("diabetes") || textLower.includes("glycated") || textLower.includes("glucose")) {
    return `### 🧠 Quick Insight
HbA1c (Glycated Hemoglobin) reflects your average blood sugar levels over the past 3 months. Elevated levels suggest insulin resistance or impaired glucose tolerance.

What would you like to do?
[Explore Glucose Regulation] [Metabolic Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: High (lab-validated)
**Data Used**: Blood glucose, Vitality score, System reserves
**Active Signals**:
🟢 Recovery Capacity: Strong
🟡 New Symptom: Elevated glucose profile
⚪ Clinical Concern Level: Low-Moderate

### What This Means
An HbA1c under 5.7% is normal. Levels between 5.7% and 6.4% indicate prediabetes (impaired glucose regulation), and 6.5% or higher indicates diabetes.

### Why It Matters
Elevated HbA1c points to cellular insulin resistance, which increases oxidative stress, loads the vascular system, and depletes metabolic reserves.

### Personalized Insight
Your digestive and endocrine scores stand at **${twin.systemScores?.digestive ?? 100}%** and **${twin.systemScores?.endocrine ?? 100}%** respectively, indicating solid metabolic reserves. Let's use this capacity to optimize glucose sensitivity.

### Recommended Next Steps
- Reduce refined carbohydrate and sugar intake.
- Walk for 10-15 minutes immediately after meals.
- Consider fasting glucose and fasting insulin tests.
- Take the **Metabolic Health Assessment** on this platform.

### 👨⚕️ Clinical Insight
Dr. Jethwani emphasizes that HbA1c is a lagging indicator. Focus on restoring early phase insulin response by eating fiber and proteins before carbohydrates in meals.

### Follow-Up Questions
1. What was your last HbA1c value?
2. Is there a family history of diabetes or metabolic loading?
3. Do you experience afternoon energy crashes or sugar cravings?

### Continue on WhatsApp
📱 We can monitor your daily energy logs:
[Remind Me in 4 Hours] [Track Sugar Cravings] [Send Glucose Protocol]`;
  }

  // 5. Ferritin / Iron
  if (textLower.includes("ferritin") || textLower.includes("iron") || textLower.includes("anemia")) {
    return `### 🧠 Quick Insight
Ferritin measures the amount of stored iron in your body. Low ferritin points to iron deficiency, while high levels can signal systemic inflammation.

What would you like to do?
[Explore Iron Absorption] [Anemia Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: High (lab-validated)
**Data Used**: Ferritin index, Vitality score, fatigue logs
**Active Signals**:
🟢 Recovery Capacity: Stable
🟡 New Symptom: Low iron reserve/fatigue
⚪ Clinical Concern Level: Low-Moderate

### What This Means
Typical reference ranges are 20-250 ng/mL for males and 10-120 ng/mL for females. Low ferritin is the earliest indicator of iron depletion before anemia develops.

### Why It Matters
Iron is essential for producing hemoglobin, which carries oxygen to your cells. Depleted stores lead to tissue hypoxia, causing fatigue, brain fog, and poor recovery.

### Personalized Insight
Your immunological and cardiovascular scores are currently at **${twin.systemScores?.immune ?? 100}%** and **${twin.systemScores?.cardiovascular ?? 100}%**, meaning oxygen transport pathways are well-supported.

### Recommended Next Steps
- Consume iron-rich foods combined with Vitamin C to enhance absorption.
- Avoid tea or coffee within 1 hour of meals (tannins block absorption).
- Complete the **Cardiovascular & Fatigue Assessment** on this platform.

### 👨⚕️ Clinical Insight
Dr. Jethwani points out that iron deficiency is often an absorption issue in the gut rather than lack of intake. Focus on improving digestive enzyme reserves.

### Follow-Up Questions
1. What was your latest Ferritin result?
2. Are you experiencing fatigue, hair loss, or cold sensitivity?
3. What is your typical diet (vegetarian, vegan, non-vegetarian)?

### Continue on WhatsApp
📱 Let's monitor your fatigue score over time:
[Remind Me in 4 Hours] [Track Fatigue levels] [Send Iron Absorption Tips]`;
  }

  // 6. Thyroid / TSH
  if (textLower.includes("thyroid") || textLower.includes("tsh") || textLower.includes("hypothyroid") || textLower.includes("hyperthyroid")) {
    return `### 🧠 Quick Insight
Thyroid Stimulating Hormone (TSH) regulates cellular metabolic rate. Abnormal TSH indicates an underactive (hypo) or overactive (hyper) thyroid state.

What would you like to do?
[Explore Thyroid Metabolism] [Thyroid Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: High (lab-validated)
**Data Used**: TSH value, Vitality score, thermal modalities
**Active Signals**:
🟢 Recovery Capacity: Stable
🟡 New Symptom: Metabolic/thermal sluggishness
⚪ Clinical Concern Level: Moderate

### What This Means
TSH values between 0.4 and 4.0 mIU/L are typical. High TSH (>4.0) suggests hypothyroid loading (thyroid underactive), while low TSH (<0.4) suggests hyperthyroidism.

### Why It Matters
Thyroid hormones control how your body uses energy. Sluggish thyroid function slows down digestive, cognitive, and cardiovascular systems.

### Personalized Insight
Your thermal profile is **${twin.constitutional?.thermal || "uncalibrated"}**, which is a vital indicator in thyroid evaluation. Keeping metabolic stress low will support thyroid reserves.

### Recommended Next Steps
- Monitor morning basal body temperature.
- Optimize selenium and iodine intake under clinical guidance.
- Take the **Endocrine & Thyroid Assessment** on our platform.

### 👨⚕️ Clinical Insight
Dr. Jethwani explains that thyroid load is heavily connected to adrenal stress and cortisol. Protecting your sleep and neurological reserves helps thyroid regulation.

### Follow-Up Questions
1. What was your latest TSH, Free T3, or Free T4 score?
2. Do you experience cold sensitivity, weight changes, or dry skin?
3. How is your sleep quality and stress load?

### Continue on WhatsApp
📱 We can check in on your recovery stats:
[Remind Me in 4 Hours] [Track Cold Modality] [Send Thyroid Care Guide]`;
  }

  // 7. Headache / Migraine
  if (textLower.includes("headache") || textLower.includes("migraine")) {
    return `### 🧠 Quick Insight
A headache represents sensory tension or vascular load. Migraine represents a neurovascular reaction to internal or external triggers.

What would you like to do?
[Explore Migraine Triggers] [Headache Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Moderate (symptom-logged)
**Data Used**: Sleep index, stress burden, constitutional thermal profile
**Active Signals**:
🟢 Recovery Capacity: Strong
🟡 New Symptom: Headache/Migraine tension
⚪ Clinical Concern Level: Low

### What This Means
Headaches are often triggered by acute stressors, sleep disruption, neck strain, dehydration, or blood sugar drops. Migraines have a deeper genetic and vascular component.

### Why It Matters
Frequent headaches suggest that your nervous system is operating under high sympathetic load, draining your recovery reserves.

### Personalized Insight
Your overall Health Reserve stands at **${twin.overallScore}%** and your stress flags are **${twin.activeRulesFlags.join(", ") || "None"}**, suggesting strong recovery capacity to bounce back.

### Recommended Next Steps
- Drink a large glass of warm water immediately.
- Practice 4-7-8 breathing exercises (5 cycles) to reset autonomic balance.
- Take the **Neurological & Stress Assessment** to identify triggers.

### 👨⚕️ Clinical Insight
Dr. Jethwani advises looking at transient triggers first when underlying vitality is high. Check hydration, screen exposure, and last night's sleep before anything else.

### Follow-Up Questions
1. Where is the pain located (throbbing, one side, front, neck)?
2. Are you experiencing light sensitivity or nausea?
3. How many hours of sleep did you get last night?

### Continue on WhatsApp
📱 Let's do a follow-up check-in later today:
[Remind Me in 4 Hours] [Track Headache Severity] [Send Recovery Plan]`;
  }

  // 8. Fatigue / Tired
  if (textLower.includes("fatigue") || textLower.includes("tired") || textLower.includes("sleepy") || textLower.includes("weak")) {
    return `### 🧠 Quick Insight
Fatigue represents depleted biological energy reserves, often linked to sleep disruption, mitochondrial load, or hormonal sluggishness.

What would you like to do?
[Explore Fatigue Causes] [Energy Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Moderate (symptom-logged)
**Data Used**: Sleep quality, HRV metrics, immune scores
**Active Signals**:
🟢 Recovery Capacity: Sluggish
🟡 New Symptom: Low cellular vitality / fatigue
⚪ Clinical Concern Level: Low

### What This Means
Fatigue is a multi-system signal indicating that energy expenditure exceeds recovery rate. It can be due to poor sleep structure, iron status, or adrenal load.

### Why It Matters
Prolonged fatigue depletes your immune and cardiovascular reserves, reducing your adaptive capacity to daily stress.

### Personalized Insight
Your current Sleep metrics show **${twin.wearables?.appleHealth?.metrics?.sleepHours ?? "untracked"}** hours of sleep, which is a major driver of your overall Vitality.

### Recommended Next Steps
- Establish a strict sleep-wake rhythm.
- Walk in natural sunlight for 10 minutes every morning.
- Complete the **Sleep & Vitality Profile** on this platform.

### 👨⚕️ Clinical Insight
Dr. Jethwani emphasizes addressing sleep restoration and metabolic reserves together. True energy comes from mitochondrial health and nervous system rest.

### Follow-Up Questions
1. Is your fatigue worse in the morning, afternoon, or constant?
2. How is your sleep quality and stress load?
3. Have you had recent blood tests checking ferritin, TSH, or vitamin D?

### Continue on WhatsApp
📱 I can check in on your energy patterns tomorrow:
[Remind Me in 4 Hours] [Track Energy Levels] [Send Fatigue Protocol]`;
  }

  // 9. Bloated / Gas / Digestion
  if (textLower.includes("bloat") || textLower.includes("gas") || textLower.includes("acid") || textLower.includes("indigestion") || textLower.includes("constip")) {
    return `### 🧠 Quick Insight
Bloating is a symptom of sluggish digestive enzyme reserves, altered gut microbiome dynamics, or slow motility.

What would you like to do?
[Explore Gut Health] [Digestive Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Moderate (symptom-logged)
**Data Used**: Digestive Score, Appetite profile, constitutional modality
**Active Signals**:
🟢 Recovery Capacity: Stable
🟡 New Symptom: Digestive loading / bloating
⚪ Clinical Concern Level: Low

### What This Means
Bloating occurs when gas accumulates in the gastrointestinal tract due to incomplete digestion of foods or microbial fermentation.

### Why It Matters
Sluggish digestion reduces nutrient absorption, increases systemic toxic load, and affects neurotransmitter synthesis in the gut.

### Personalized Insight
Your Digestive Score is currently at **${twin.systemScores?.digestive ?? 100}%**. This shows solid underlying reserves, meaning we can resolve this with simple lifestyle adjustments.

### Recommended Next Steps
- Chew food thoroughly (30 times per bite) to support saliva enzyme mixing.
- Avoid drinking large volumes of water during meals.
- Complete the **Metabolic & Digestive Health Profile** on our platform.

### 👨⚕️ Clinical Insight
Dr. Jethwani emphasizes that gut health depends on constitutional digestive fire. Do not eat when anxious or rushed, as stress halts stomach acid production.

### Follow-Up Questions
1. Does the bloating occur immediately after eating or hours later?
2. Are you experiencing abdominal discomfort, gas, or bowel changes?
3. How is your daily hydration and dietary fiber intake?

### Continue on WhatsApp
📱 Let's monitor your digestion symptoms:
[Remind Me in 4 Hours] [Track Bloating Severity] [Send Gut Health Plan]`;
  }

  // 10. Result / Score / Health
  if (textLower.includes("result") || textLower.includes("score") || textLower.includes("health")) {
    const completedCount = Object.keys(twin.completedAssessments || {}).length;
    if (completedCount === 0) {
      return `### 🧠 Quick Insight
You have not completed any self-assessments yet. We recommend starting with a profile assessment to initialize your insights.

What would you like to do?
[Initialize My Twin] [Take Metabolic Assessment] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Limited
**Data Used**: None (Baseline configuration)
**Active Signals**:
🟢 Recovery Capacity: Strong
🟢 No Active Symptoms reported
⚪ Clinical Concern Level: Low

### What This Means
Completing assessments is the key to building Your Health Twin Insights, helping the companion identify system reserve shifts and active stress signals.

### Why It Matters
Without completed assessments, we cannot determine recovery capacity or personalize your epigenetic recommendations.

### Recommended Next Steps
- Complete the **Metabolic Health Profile** or **Stress & Anxiety Assessment** today.
- Sync your Apple Health or Google Fit wearables in the dashboard.

### 👨⚕️ Clinical Insight
Dr. Jethwani emphasizes starting with baseline measurements. Knowing your starting system reserves is the first step toward preventive balance.

### Follow-Up Questions
1. What is your primary health or wellness goal?
2. Are you experiencing any active symptoms today?

### Continue on WhatsApp
📱 Let's set up a reminder to complete your first assessment:
[Remind Me in 4 Hours] [Start Assessment Now] [Send Assessment Guide]`;
    }

    return `### 🧠 Quick Insight
Your overall health reserve stands at **${twin.overallScore}%** based on ${completedCount} completed assessments.

What would you like to do?
[Review All Scores] [Constitutional Remedy Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: High
**Data Used**: Vitality score, system reserves, history
**Active Signals**:
🟢 Recovery Capacity: Strong
🟢 Active stress flags: ${twin.activeRulesFlags.join(", ") || "None"}
⚪ Clinical Concern Level: Low

### What This Means
Your overall score represents the aggregate functional capacity of your organ systems. High scores mean your body has strong adaptive and self-regulatory capacities.

### Why It Matters
High system scores indicate robust vitality reserves, enabling your body to recover quickly from acute stressors.

### Personalized Insight
Your system scores show strong reserves. Let's ensure these are maintained by resolving any minor active stress flags.

### Recommended Next Steps
- Complete the **Constitutional Assessment** next.
- Review your lowest system scores to target optimization areas.

### 👨⚕️ Clinical Insight
Dr. Jethwani recommends looking at system reserve preservation. Maintaining high vitality scores prevents chronic functional strain.

### Follow-Up Questions
1. Do you notice energy dips or recovery delays despite strong scores?
2. Have you completed your constitutional profile assessment?

### Continue on WhatsApp
📱 I can check in weekly to report your score trends:
[Remind Me in 4 Hours] [Track Score Weekly] [Send Monthly Health Report]`;
  }

  // 11. Remedy / Constitutional / Homeopath
  if (textLower.includes("remedy") || textLower.includes("constitutional") || textLower.includes("homeopath")) {
    if (twin.constitutional) {
      return `### 🧠 Quick Insight
Your constitutional assessment matches the **${twin.constitutional.remedyMatch}** profile, showing primary **${twin.constitutional.systemDominance}** dominance.

What would you like to do?
[Explore Remedy Profile] [Constitutional Recovery Plan] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: High
**Data Used**: Constitutional assessment answers, thermal modalities, temperament
**Active Signals**:
🟢 Recovery Capacity: Strong
🟢 Constitutional Match: ${twin.constitutional.remedyMatch}
⚪ Clinical Concern Level: Low

### What This Means
Your constitutional match identifies your body's specific adaptive reaction pattern: **${twin.constitutional.adaptivePattern}**. It aligns your thermal, sleep, and emotional tendencies.

### Why It Matters
Constitutional prescribing helps target the root predisposition rather than treating isolated symptoms, strengthening your overall system reserves.

### Recommended Next Steps
- Review the core modal triggers for **${twin.constitutional.remedyMatch}** to see what makes you feel better or worse.
- Connect with Dr. Jethwani to discuss how to apply this constitutional match.

### 👨⚕️ Clinical Insight
Dr. Jethwani frequently emphasizes that addressing your core constitutional balance is the most effective way to improve cellular recovery.

### Follow-Up Questions
1. Do you feel your symptoms align with the ${twin.constitutional.remedyMatch} modalities?
2. Are you ready to review this profile in a clinical consultation?

### Continue on WhatsApp
📱 We can send your full constitutional report:
[Remind Me in 4 Hours] [Send Constitutional PDF] [Request Clinical Review]`;
    }

    return `### 🧠 Quick Insight
Constitutional analysis matches your unique thermal, sleep, appetites, and mood modalities with a matching homeopathic profile.

What would you like to do?
[Take Constitutional Assessment] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Limited (not assessed yet)
**Data Used**: None
**Active Signals**:
🟢 Recovery Capacity: Strong
⚪ Clinical Concern Level: Low

### What This Means
A constitutional profile maps how your body reacts to stress, temperature, food, and emotional triggers, helping identify your primary remedy match.

### Recommended Next Steps
- Click the **Constitutional Profile** button in the dashboard to map yours.
- Answer all questions accurately to get your matching profile.

### Continue on WhatsApp
📱 We can send you a guide on constitutional homeopathy:
[Remind Me in 4 Hours] [Send Homeopathy Guide] [Start Assessment]`;
  }

  // 12. Book / Consult / Doctor / Jethwani / WhatsApp
  if (textLower.includes("book") || textLower.includes("consult") || textLower.includes("doctor") || textLower.includes("jethwani") || textLower.includes("whatsapp")) {
    return `### 🧠 Quick Insight
You can easily schedule a clinical review with Chief Consultant Dr. Narayan Jethwani directly via WhatsApp or our web scheduler.

What would you like to do?
[Book Web Consultation] [Chat on WhatsApp] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: High
**Data Used**: Clinic booking links, contact info
**Active Signals**:
🟢 Booking Pathways Active
⚪ Clinical Concern Level: Low

### What This Means
Dr. Jethwani reviews your Your Health Twin Insights, assessments, and lab reports to compile your customized constitutional remedy protocol.

### Recommended Next Steps
- Click the **Chat on WA** button at the top of the chat widget to instantly share your digital twin data and book directly on WhatsApp (+91 84460 56789).
- Or book online directly here: https://homeo.healthcare/#booking

### Continue on WhatsApp
📱 Select a WhatsApp clinical action:
[Remind Me in 4 Hours] [Request WhatsApp Review] [Book Consultation]`;
  }

  // Default Fallback
  return `### 🧠 Quick Insight
I understand your question. Let's look at your Your Health Twin Insights and how we can best support your health goals.

What would you like to do?
[Explore Causes] [Compare with My Health Data] [Ask Dr. Jethwani’s Guidance]

### Health Twin Insights Summary
**Confidence**: Moderate
**Data Used**: Vitals, overall score, system scores
**Active Signals**:
🟢 Recovery Capacity: Strong
🟢 Stress Burden: Low
🟡 General Query Reported
⚪ Clinical Concern Level: Low

### What This Means
To guide you precisely, we should evaluate this symptom in relation to your active system scores and history.

### Recommended Next Steps
- Keep hydratated and maintain a consistent sleep rhythm.
- Ask me specific terms like "What is PCOS?" or "Explain my HbA1c" to get condition snapshots.
- Take the **Metabolic** or **Stress Assessments** to update your profile.

### 👨⚕️ Clinical Insight
Dr. Jethwani advises focusing on core vitality reserves rather than treating symptoms in isolation. True recovery builds from the ground up.

### Follow-Up Questions
1. Are you experiencing active symptoms today?
2. Have you completed your main assessments?

### Continue on WhatsApp
📱 Select a check-in action:
[Remind Me in 4 Hours] [Track This Symptom] [Send General Guide]`;
}

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
  history: [],
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
  ],
  wearables: {
    "Apple Health": { device: "Apple Health", connected: false },
    "Google Fit": { device: "Google Fit", connected: false },
    "Fitbit": { device: "Fitbit", connected: false },
    "Garmin": { device: "Garmin", connected: false }
  },
  clinicalPortal: { connected: false }
};

export default function HealthIntelligencePage() {
  const [digitalTwin, setDigitalTwin] = useState<HealthDigitalTwin>(DEFAULT_TWIN);
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "assessment" | "lab_upload" | "report">("dashboard");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [dashboardTab, setDashboardTab] = useState<"overview" | "labs" | "bioage" | "directory">("overview");
  
  // Clinical Portal Connection Modal States
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({
    name: "",
    age: "30",
    gender: "Male",
    phone: "",
    email: "",
    city: "Pune",
    branch: "Baner Clinic, Pune"
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("metabolic");
  
  // Questionnaire States
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeReport, setActiveReport] = useState<IntelligenceReport | null>(null);
  const [activeReportCategory, setActiveReportCategory] = useState<string>("metabolic");

  // Lab Report States
  const [labRawText, setLabRawText] = useState("");
  const [labParsing, setLabParsing] = useState(false);
  const [labResult, setLabResult] = useState<LabAnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const labUploadCardRef = useRef<HTMLDivElement>(null);
  const labResultsRef = useRef<HTMLDivElement>(null);

  // Scroll helper
  const scrollToUpload = () => {
    labUploadCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Scroll to results when view changes to lab_upload
  useEffect(() => {
    if (activeView === "lab_upload" && labResult) {
      setTimeout(() => {
        labResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [activeView, labResult]);

  // Top Assistant States
  const [isTopAssistantOpen, setIsTopAssistantOpen] = useState(false);
  const [isTopAssistantFullscreen, setIsTopAssistantFullscreen] = useState(false);
  const [topMessages, setTopMessages] = useState<Array<{sender: "user" | "assistant"; text: string}>>([
    {
      sender: "assistant",
      text: "Hello! 🌟 I'm your AI Health Companion, but you can think of me as your personal health partner and dedicated wellness guide. I'm here to walk alongside you, make sense of your assessments, and help you find pathways to balance. What wellness goals can we explore together today? 🍃"
    }
  ]);
  const [topInput, setTopInput] = useState("");
  const [isTopTyping, setIsTopTyping] = useState(false);
  const topChatContainerRef = useRef<HTMLDivElement>(null);
  const topChatFullscreenContainerRef = useRef<HTMLDivElement>(null);

  // New features states: Font Size (number from 10 to 24), Empathetic vs Clinical Tone, Copied status
  const [chatFontSize, setChatFontSize] = useState<number>(13);
  const [chatTone, setChatTone] = useState<"empathetic" | "professional">("empathetic");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const decreaseFontSize = () => {
    setChatFontSize(prev => Math.max(10, prev - 2));
  };

  const increaseFontSize = () => {
    setChatFontSize(prev => Math.min(24, prev + 2));
  };

  const clearChat = () => {
    setTopMessages([
      {
        sender: "assistant",
        text: "Hello! 🌟 I've reset our conversation history. How can I help you on your health journey today? 🍃"
      }
    ]);
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    const targetRef = isTopAssistantFullscreen ? topChatFullscreenContainerRef : topChatContainerRef;
    if (targetRef.current) {
      targetRef.current.scrollTo({
        top: targetRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [topMessages, isTopTyping, isTopAssistantFullscreen]);

  const handleTopSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Check if it's a WhatsApp action first (ensures synchronous call for popup blockers)
    const isWhatsAppAction = 
      textToSend.startsWith("Remind Me") ||
      textToSend.startsWith("Track ") ||
      textToSend.startsWith("Send ") ||
      textToSend.startsWith("Request ") ||
      textToSend === "Book Consultation";

    if (isWhatsAppAction) {
      let waMessage = `Hello Dr. Jethwani, I am checking in from the Homeo Healthcare Health Intelligence Portal.\n\n`;
      waMessage += `Action Request: *${textToSend}*\n\n`;
      waMessage += `My Health Profile Summary:\n`;
      waMessage += `- Overall Health Score: ${digitalTwin.overallScore}%\n`;
      if (digitalTwin.biologicalAge) {
        waMessage += `- Biological Age: ${digitalTwin.biologicalAge.bioAge} years (Chronological: ${digitalTwin.biologicalAge.chronologicalAge})\n`;
      }
      
      const lastAssessments = Object.keys(digitalTwin.completedAssessments || {});
      if (lastAssessments.length > 0) {
        waMessage += `- Active Assessments: ${lastAssessments.join(", ")}\n`;
      }
      
      const waLink = `https://wa.me/918446056789?text=${encodeURIComponent(waMessage)}`;
      
      // Open immediately in user interaction stack
      const newWin = window.open(waLink, "_blank");
      if (!newWin || newWin.closed || typeof newWin.closed === "undefined") {
        window.location.href = waLink;
      }
      
      const userMsg = { sender: "user" as const, text: textToSend };
      setTopInput("");
      setTopMessages(prev => [
        ...prev, 
        userMsg, 
        { 
          sender: "assistant" as const, 
          text: `📱 **WhatsApp Continuity Triggered:**\nI've prepared your request for *"${textToSend}"* and opened a secure WhatsApp chat with Dr. Jethwani. You can continue our conversation directly on WhatsApp now! 🍃` 
        }
      ]);
      setIsTopTyping(false);
      return;
    }

    const userMsg = { sender: "user" as const, text: textToSend };
    setTopInput("");
    const newMsgs = [...topMessages, userMsg];
    setTopMessages(newMsgs);
    setIsTopTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs, twin: digitalTwin, tone: chatTone })
      });
      const data = await res.json();
      
      if (data.success && data.text) {
        setTopMessages(prev => [...prev, { sender: "assistant" as const, text: data.text }]);
        setIsTopTyping(false);
        return;
      }
    } catch (err) {
      console.error("Failed to query Gemini assistant api, falling back to local reasoning:", err);
    }

    // Local/Fallback reasoning logic in case of failure or missing API key
    const reply = getLocalFallbackResponse(textToSend, digitalTwin);

    setTopMessages(prev => [...prev, { sender: "assistant" as const, text: reply }]);
    setIsTopTyping(false);
  };

  // Theme State
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load digital twin state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("homeo_health_digital_twin_2026_v2");
    if (saved) {
      try {
        const twin = JSON.parse(saved);
        if (twin && typeof twin === "object") {
          const safeTwin = {
            ...DEFAULT_TWIN,
            ...twin,
            systemScores: {
              ...DEFAULT_TWIN.systemScores,
              ...(twin.systemScores || {})
            },
            completedAssessments: twin.completedAssessments || {},
            activeRulesFlags: twin.activeRulesFlags || [],
            priorityGoals: twin.priorityGoals || DEFAULT_TWIN.priorityGoals,
            wearables: {
              ...DEFAULT_TWIN.wearables,
              ...(twin.wearables || {})
            },
            clinicalPortal: {
              ...DEFAULT_TWIN.clinicalPortal,
              ...(twin.clinicalPortal || {})
            }
          };
          setDigitalTwin(safeTwin);
          if (twin.labResult) {
            setLabResult(twin.labResult);
          }
        }
      } catch (e) {
        console.error("Error loading health digital twin:", e);
      }
    }
    setMounted(true);
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
    localStorage.setItem("homeo_health_digital_twin_2026_v2", JSON.stringify(updated));
  };

  // Reset digital twin helper
  const handleResetTwin = () => {
    if (window.confirm("Are you sure you want to clear your Health Digital Twin profile? This will reset all scores, biological age index, and completed assessments timeline.")) {
      setDigitalTwin(DEFAULT_TWIN);
      localStorage.removeItem("homeo_health_digital_twin_2026_v2");
      setActiveView("dashboard");
      setLabResult(null);
      setActiveReport(null);
    }
  };

  // Wearable & Clinical Portal Integration Sync handlers
  const handleToggleWearable = (device: "Apple Health" | "Google Fit" | "Fitbit" | "Garmin") => {
    const updatedWearables = { ...(digitalTwin.wearables || {
      "Apple Health": { device: "Apple Health", connected: false },
      "Google Fit": { device: "Google Fit", connected: false },
      "Fitbit": { device: "Fitbit", connected: false },
      "Garmin": { device: "Garmin", connected: false }
    }) };
    const currentDevice = updatedWearables[device] || { device, connected: false };
    
    if (currentDevice.connected) {
      updatedWearables[device] = { device, connected: false };
    } else {
      const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const lastSyncDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
      updatedWearables[device] = {
        device,
        connected: true,
        lastSync: `${lastSyncDate} at ${now}`,
        metrics: {
          heartRateAvg: Math.round(62 + Math.random() * 8),
          steps: Math.round(7200 + Math.random() * 3000),
          sleepHours: Number((6.8 + Math.random() * 1.5).toFixed(1)),
          hrv: Math.round(45 + Math.random() * 25)
        }
      };
      alert(`${device} successfully linked to HIOS™. Epigenetic and cardiorespiratory telemetry synced.`);
    }
    
    saveDigitalTwin({
      ...digitalTwin,
      wearables: updatedWearables
    });
  };

  const handleToggleClinicalPortal = () => {
    const isConnected = digitalTwin.clinicalPortal?.connected || false;
    if (isConnected) {
      if (window.confirm("Are you sure you want to disconnect from the Clinician Portal? Real-time synchronizations will be paused.")) {
        saveDigitalTwin({
          ...digitalTwin,
          clinicalPortal: { connected: false }
        });
      }
    } else {
      setIsConnectModalOpen(true);
      setConnectionSuccess(false);
    }
  };

  const handleSubmitClinicalPortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectForm.name || !connectForm.phone) {
      alert("Please fill in your Name and Phone Number.");
      return;
    }
    setIsConnecting(true);

    try {
      const portalId = `HCP-2026-${Math.round(1000 + Math.random() * 9000)}`;
      
      // Compile completed self-assessments
      let selfAssessmentDetails = "Patient self-assessment intake summary:\n";
      const completedKeys = Object.keys(digitalTwin.completedAssessments || {});
      if (completedKeys.length > 0) {
        completedKeys.forEach(cat => {
          const item = digitalTwin.completedAssessments[cat];
          selfAssessmentDetails += `- ${cat.toUpperCase()} assessment: Score: ${item.score}/100 on ${item.date}\n`;
        });
      } else {
        selfAssessmentDetails += "- Digital twin initialized. No specific self-assessments completed yet.\n";
      }

      // Add recent history symptoms
      if (digitalTwin.history && digitalTwin.history.length > 0) {
        const recentSymptoms = digitalTwin.history[0].symptoms || [];
        if (recentSymptoms.length > 0) {
          selfAssessmentDetails += `Symptoms reported: ${recentSymptoms.join(", ")}\n`;
        }
      }

      // Add parsed lab results if present
      if (labResult && labResult.extractedData && labResult.extractedData.length > 0) {
        selfAssessmentDetails += `\nExtracted Lab Biomarkers:\n`;
        labResult.extractedData.forEach(marker => {
          selfAssessmentDetails += `- ${marker.marker}: ${marker.value} (Range: ${marker.range}, Status: ${marker.status})\n`;
        });
        if (labResult.summary) {
          selfAssessmentDetails += `Lab Summary: ${labResult.summary}\n`;
        }
      }

      // Send to Firestore/Mock drive via /api/intake
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: portalId,
          name: connectForm.name,
          age: connectForm.age,
          gender: connectForm.gender,
          phone: connectForm.phone,
          email: connectForm.email,
          city: connectForm.city,
          complaint: selfAssessmentDetails,
          careLevel: "Digital Twin Intake",
          status: "pending"
        })
      });

      const data = await response.json();

      const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const lastSyncDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

      saveDigitalTwin({
        ...digitalTwin,
        clinicalPortal: {
          connected: true,
          lastSync: `${lastSyncDate} at ${now}`,
          portalId: data.patientId || portalId,
          doctorApproved: true
        }
      });

      setConnectionSuccess(true);
      setTimeout(() => {
        setIsConnectModalOpen(false);
      }, 1500);

    } catch (err) {
      console.error("Clinical sync registration failed:", err);
      alert("Database connection failed. Digital Twin synced in sandbox fallback mode.");
      
      const portalId = `HCP-2026-${Math.round(1000 + Math.random() * 9000)}`;
      const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const lastSyncDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      saveDigitalTwin({
        ...digitalTwin,
        clinicalPortal: {
          connected: true,
          lastSync: `${lastSyncDate} at ${now}`,
          portalId,
          doctorApproved: true
        }
      });
      setIsConnectModalOpen(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const getWhatsAppConsultationLink = () => {
    let message = "Hello Dr. Jethwani, I completed my Health Intelligence assessment and would like to book a consultation.\n\n";
    message += `Overall Health Score: ${digitalTwin.overallScore}%\n`;
    if (digitalTwin.biologicalAge) {
      message += `Biological Age: ${digitalTwin.biologicalAge.bioAge} years (Chronological: ${digitalTwin.biologicalAge.chronologicalAge})\n`;
    }
    const completedKeys = Object.keys(digitalTwin.completedAssessments || {});
    if (completedKeys.length > 0) {
      message += "\nCompleted Assessments:\n";
      completedKeys.forEach(cat => {
        const item = digitalTwin.completedAssessments[cat];
        message += `- ${cat.toUpperCase()}: Score ${item.score}%\n`;
      });
    }
    if (labResult) {
      message += `\nLab Summary: ${labResult.summary}\n`;
      if (labResult.extractedData && labResult.extractedData.length > 0) {
        message += "Biomarkers parsed:\n";
        labResult.extractedData.slice(0, 3).forEach(marker => {
          message += `- ${marker.marker}: ${marker.value} (${marker.status})\n`;
        });
      }
    }
    return `https://wa.me/918446056789?text=${encodeURIComponent(message)}`;
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

  // Score & Report calculation
  const handleCalculateAssessment = () => {
    if (!selectedProfileId) return;
    setIsCalculating(true);

    setTimeout(() => {
      const profile = ASSESSMENT_PROFILES.find(p => p.id === selectedProfileId);
      if (!profile) return;

      let score = 85;

      // Handle Biological Age Calculation specifically
      if (selectedProfileId === "biological_age") {
        // Chronological age index mapping
        const chronRange = answers.chronological_age;
        let chronAge = 35;
        if (chronRange === "Under 25") chronAge = 21;
        else if (chronRange === "25 - 34") chronAge = 29;
        else if (chronRange === "35 - 44") chronAge = 39;
        else if (chronRange === "45 - 54") chronAge = 49;
        else if (chronRange === "55 - 64") chronAge = 59;
        else if (chronRange === "65 or older") chronAge = 72;

        // Biological shifts calculation
        let epigeneticAcceleration = 0;
        const dietVal = answers.dietary_oxidants;
        if (dietVal.includes("Whole organic")) epigeneticAcceleration -= 3;
        else if (dietVal.includes("processed carb")) epigeneticAcceleration += 3;
        else if (dietVal.includes("Inflammatory")) epigeneticAcceleration += 6;

        const sleepVal = answers.circadian_repair;
        if (sleepVal.includes("Restorative")) epigeneticAcceleration -= 3;
        else if (sleepVal.includes("Fragmented")) epigeneticAcceleration += 3;
        else if (sleepVal.includes("Severe insomnia")) epigeneticAcceleration += 6;

        const cardioVal = Number(answers.cardio_reserve || 5);
        if (cardioVal >= 8) epigeneticAcceleration -= 4;
        else if (cardioVal <= 3) epigeneticAcceleration += 4;

        const stressVal = Number(answers.mitochondrial_strain || 5);
        if (stressVal >= 8) epigeneticAcceleration += 4;
        else if (stressVal <= 3) epigeneticAcceleration -= 2;

        // Symptoms add penalty years
        epigeneticAcceleration += selectedSymptoms.length * 1.5;

        // Cap values
        const bioAge = Math.round(chronAge + epigeneticAcceleration);
        const longevityScore = Math.max(38, Math.min(99, Math.round(95 - epigeneticAcceleration * 2.2)));
        const wellnessIndex = Math.max(30, Math.min(100, Math.round(100 - (epigeneticAcceleration + 10) * 1.8)));
        const lifestyleRiskIndex: "Low" | "Moderate" | "High" = longevityScore > 80 ? "Low" : longevityScore > 55 ? "Moderate" : "High";

        score = wellnessIndex;

        const bioMetrics: BiologicalAgeMetrics = {
          chronologicalAge: chronAge,
          bioAge,
          longevityScore,
          lifestyleRiskIndex,
          wellnessIndex
        };

        const completedAssessments = { ...digitalTwin.completedAssessments };
        const attemptId = "att_" + Date.now();
        const newHistoryEntry: HealthHistoryEntry = {
          id: attemptId,
          profileId: selectedProfileId,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          score,
          answers: { ...answers },
          symptoms: [...selectedSymptoms]
        };

        completedAssessments[selectedProfileId] = {
          date: newHistoryEntry.date,
          score,
          answers: { ...answers },
          symptoms: [...selectedSymptoms]
        };

        const updatedHistory = [newHistoryEntry, ...(digitalTwin.history || [])];

        const updatedTwin: HealthDigitalTwin = {
          ...digitalTwin,
          biologicalAge: bioMetrics,
          completedAssessments,
          history: updatedHistory
        };

        saveDigitalTwin(updatedTwin);
        
        // Generate Report
        const report = generateReport(selectedProfileId, score, answers, selectedSymptoms);
        setActiveReport(report);
        setActiveReportCategory(profile.category);
        setIsCalculating(false);
        setActiveView("report");
        return;
      }

      // General assessment scoring
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
      score = Math.round(100 - finalBurden);

      // Save Attempt to history
      const attemptId = "att_" + Date.now();
      const newHistoryEntry: HealthHistoryEntry = {
        id: attemptId,
        profileId: selectedProfileId,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        score,
        answers: { ...answers },
        symptoms: [...selectedSymptoms]
      };

      const completedAssessments = { ...digitalTwin.completedAssessments };
      completedAssessments[selectedProfileId] = {
        date: newHistoryEntry.date,
        score,
        answers: { ...answers },
        symptoms: [...selectedSymptoms]
      };

      const updatedHistory = [newHistoryEntry, ...(digitalTwin.history || [])];

      const intermediateTwin: HealthDigitalTwin = {
        ...digitalTwin,
        completedAssessments,
        history: updatedHistory
      };

      const analysis = analyzeDigitalTwin(intermediateTwin);
      const systemScoresValues = Object.values(analysis.systemScores);
      const overallScore = Math.round(systemScoresValues.reduce((a, b) => a + b, 0) / systemScoresValues.length);

      const updatedTwin: HealthDigitalTwin = {
        ...digitalTwin,
        overallScore,
        systemScores: analysis.systemScores,
        completedAssessments,
        history: updatedHistory,
        organLoad: analysis.organLoad,
        riskLevel: analysis.riskLevel,
        activeRulesFlags: analysis.activeFlags,
        priorityGoals: analysis.priorityGoals
      };

      const report = generateReport(selectedProfileId, score, answers, selectedSymptoms);
      report.miasmaticProfile = analysis.miasmaticProfile;

      saveDigitalTwin(updatedTwin);
      setActiveReport(report);
      setActiveReportCategory(profile.category);
      setIsCalculating(false);
      setActiveView("report");
    }, 1800);
  };

  // Report details generator
  const generateReport = (profileId: string, score: number, answers: Record<string, any>, symptoms: string[]): IntelligenceReport => {
    const profile = ASSESSMENT_PROFILES.find(p => p.id === profileId);
    const category = profile?.category || "metabolic";
    
    let riskClass: "Low Risk" | "Moderate Risk" | "High Risk" = "Low Risk";
    if (score < 55) riskClass = "High Risk";
    else if (score < 85) riskClass = "Moderate Risk";

    const priorityAreas: string[] = [];
    if (score < 55) {
      priorityAreas.push("Immediate clinical review of target biomarkers is suggested.");
      priorityAreas.push("Incorporate cell anti-inflammatory diet resets.");
    } else if (score < 85) {
      priorityAreas.push("Stabilize circadian timing and cortisol feedback loops.");
      priorityAreas.push("Decongest localized endocrine system reserves.");
    } else {
      priorityAreas.push("Maintain current systemic vitality.");
      priorityAreas.push("Target anti-aging antioxidant behaviors.");
    }

    if (symptoms.length > 0) {
      priorityAreas.push(`Symptom alerts: ${symptoms.slice(0, 2).join(", ")}`);
    }

    if (profileId === "metabolic_profile" && answers.bmi) {
      const bmiVal = Number(answers.bmi);
      const bmiCategory = bmiVal >= 30 ? "Obese" : bmiVal >= 25 ? "Overweight" : bmiVal >= 18.5 ? "Optimal Weight" : "Underweight";
      priorityAreas.push(`Calculated BMI is ${bmiVal} (${bmiCategory}).`);
    }

    // Default factors
    let contributingFactors = {
      lifestyle: "Irregular exercise levels, elevated workstation fatigue.",
      nutrition: "Suboptimal fiber consumption, mineral loading delay.",
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

    if (profileId === "biological_age") {
      contributingFactors = {
        lifestyle: "Epigenetic rate accelerated by low daily compound physical conditioning.",
        nutrition: "Oxidative food baseline increases cellular glycation loads.",
        stress: "Allostatic load suppresses mitochondrial ATP energy synthesis.",
        sleep: "Fragmented sleep compromises overnight cellular autophagy.",
        genetics: "Familial longevity markers and telomere length indicators."
      };
      suggestedLabs = ["Fasting Insulin (HOMA-IR)", "hs-CRP (Inflammation)", "DHEA-S", "Homocysteine"];
      recommendations = {
        diet: "Incorporate antioxidant polyphenol-rich foods (berries, green tea) and cruciferous greens.",
        exercise: "Engage in compounds and resistance strength training 3x/week plus Zone 2 cardio.",
        sleep: "Restore deep sleep architecture; aim for 7.5-8.5 hours in total darkness.",
        stress: "Autonomic vagus nerve toning to downregulate chronic cortisol release.",
        preventive: "Check markers of cellular oxidation, lipid fractions, and systemic inflammation."
      };
      homeopathicInsights = "Longevity and cellular vitality profile indicates psoric stress depletion. constitutional remedies such as Arsenicum Album or Calcarea Carbonica help regulate cellular reserves.";
    } else if (category === "metabolic") {
      contributingFactors = {
        lifestyle: "Irregular nutritional windows, minimal daily movement index.",
        nutrition: "Frequent simple starch spikes, low prebiotic fiber intake.",
        stress: "Elevated cortisol promoting abdominal fat deposition.",
        sleep: "Sleep duration deficits increasing morning insulin resistance.",
        genetics: "Familial history of sluggish metabolic conversions."
      };
      suggestedLabs = ["HbA1c", "Fasting Blood Sugar", "Fasting Insulin (HOMA-IR)", "Lipid Panel"];
      recommendations = {
        diet: "Eat low-glycemic foods, increase fiber (35g/day), restrict late-night eating.",
        exercise: "Zone 2 aerobic exercise combined with compound resistance training.",
        sleep: "Target 8 hours of sleep; minimize blue light exposure before bed.",
        stress: "Adrenal decompressing exercises, daily walk in nature.",
        preventive: "Measure waist-to-height ratio quarterly; check fasting glucose semi-annually."
      };
      homeopathicInsights = "Sluggish digestive or energy conversions match a sycotic pattern. Remedies like Lycopodium Clavatum are indicated when symptoms worsen late afternoon (4-8 PM).";
    } else if (category === "endocrine") {
      contributingFactors = {
        lifestyle: "Exposure to endocrine disruptors (BPA, parabens), high screen activity.",
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
      homeopathicInsights = "Endocrine Axis Wellness profile reveals a psoric-sycotic axis strain (Psoric deficit). Constitutional remedies such as Calcarea Carbonica or Pulsatilla are traditionally indicated.";
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
        nutrition: "Lack of antioxidant vitamin C/E and anti-inflammatory essential fats.",
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
        lifestyle: "Exposure to xenoestrogenic plastics, lack of pelvic movement.",
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
      miasmaticProfile: { psora: 33, sycosis: 33, syphilis: 34 },
      organLoad: score === 100 ? 10 : Math.round(100 - score * 0.95),
      contributingFactors,
      suggestedLabs,
      recommendations,
      homeopathicInsights
    };
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
      processLabFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLabFile(e.target.files[0]);
    }
  };

  const updateLabResultStateAndTwin = (result: LabAnalysisResult) => {
    setLabResult(result);
    // Use functional state update to ensure we don't get stale closures
    setDigitalTwin((prev) => {
      const updated = { ...prev, labResult: result };
      localStorage.setItem("homeo_health_digital_twin_2026_v2", JSON.stringify(updated));
      return updated;
    });
  };

  const processLabFile = (file: File) => {
    setLabParsing(true);
    const reader = new FileReader();
    reader.onload = async (eEvent) => {
      try {
        const base64Data = eEvent.target?.result as string;
        const base64Content = base64Data.split(",")[1];
        
        const response = await fetch("/api/import-lab", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fileData: base64Content,
            mimeType: file.type || "application/pdf",
            fileName: file.name
          })
        });
        
        const data = await response.json();
        if (data.success && data.result) {
          updateLabResultStateAndTwin(data.result);
          setLabRawText(data.rawText || JSON.stringify(data.result, null, 2));
        } else if (data.success && data.text) {
          const result = parseLabReport(file.name, data.text);
          updateLabResultStateAndTwin(result);
          setLabRawText(data.text);
        } else {
          const result = parseLabReport(file.name, "");
          updateLabResultStateAndTwin(result);
        }
      } catch (err) {
        console.error("Error calling import-lab API:", err);
        const result = parseLabReport(file.name, "");
        updateLabResultStateAndTwin(result);
      } finally {
        setLabParsing(false);
        setActiveView("lab_upload");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleLab = (name: string) => {
    setLabParsing(true);
    setTimeout(() => {
      const result = parseLabReport(name, "");
      updateLabResultStateAndTwin(result);
      setLabParsing(false);
      setActiveView("lab_upload");
    }, 1500);
  };

  // Calculation of progress/improvements for Priority 5 Timeline
  const getTimelineHistory = () => {
    if (!digitalTwin.history || digitalTwin.history.length === 0) return [];
    
    // Sort chronological: oldest first to calculate progress sequentially
    const sorted = [...digitalTwin.history].reverse();
    const latestAttempts: Record<string, number> = {};
    
    const timelineData = sorted.map(entry => {
      const prof = ASSESSMENT_PROFILES.find(p => p.id === entry.profileId);
      const prevScore = latestAttempts[entry.profileId];
      let improvementText = "";
      
      if (prevScore !== undefined) {
        const diff = entry.score - prevScore;
        const pct = Math.round((Math.abs(diff) / prevScore) * 100);
        // If it's a wellness score, a higher value is better
        if (diff > 0) {
          improvementText = `Improvement: +${pct}%`;
        } else if (diff < 0) {
          improvementText = `Regression: -${pct}%`;
        } else {
          improvementText = "Stable";
        }
      }
      
      latestAttempts[entry.profileId] = entry.score;
      
      let status: "Compensated" | "Sluggish" | "Depleted" = "Compensated";
      if (entry.score < 55) status = "Depleted";
      else if (entry.score < 80) status = "Sluggish";

      return {
        id: entry.id,
        date: entry.date,
        name: prof?.name || "Longevity Index",
        score: entry.score,
        trend: improvementText,
        status,
        profileId: entry.profileId,
        answers: entry.answers,
        symptoms: entry.symptoms
      };
    });
    
    return timelineData.reverse(); // Return newest first for timeline view
  };

  const selectedProfile = ASSESSMENT_PROFILES.find(p => p.id === selectedProfileId);

  // Suggested next assessments logic
  const getSuggestedNextAssessments = () => {
    const activeFlags = digitalTwin.activeRulesFlags || [];
    const completed = digitalTwin.completedAssessments || {};
    const uncompleted = ASSESSMENT_PROFILES.filter(p => !completed[p.id]);

    const suggestions: typeof ASSESSMENT_PROFILES = [];

    // Rule 1: Check active axis flags and suggest matching assessments
    if (activeFlags.includes("Endocrine-Stress Axis Strain")) {
      const targetIds = ["adrenal_fatigue", "thyroid_assessment", "sleep"];
      targetIds.forEach(id => {
        const found = uncompleted.find(p => p.id === id);
        if (found && !suggestions.find(s => s.id === id)) suggestions.push(found);
      });
    }
    if (activeFlags.includes("Visceral-Glycemic Syndrome Profile")) {
      const targetIds = ["insulin_resistance", "obesity_risk", "metabolic_profile", "diabetes_risk"];
      targetIds.forEach(id => {
        const found = uncompleted.find(p => p.id === id);
        if (found && !suggestions.find(s => s.id === id)) suggestions.push(found);
      });
    }
    if (activeFlags.includes("Autonomic Brain-Gut Dysregulation")) {
      const targetIds = ["ibs_assessment", "gut_health", "anxiety_assessment", "burnout_assessment"];
      targetIds.forEach(id => {
        const found = uncompleted.find(p => p.id === id);
        if (found && !suggestions.find(s => s.id === id)) suggestions.push(found);
      });
    }
    if (activeFlags.includes("Atopic Dermal-Respiratory Axis")) {
      const targetIds = ["skin_barrier", "eczema_assessment", "allergy_profile", "asthma_control"];
      targetIds.forEach(id => {
        const found = uncompleted.find(p => p.id === id);
        if (found && !suggestions.find(s => s.id === id)) suggestions.push(found);
      });
    }

    // Rule 2: If we still need suggestions, find profiles in vulnerable systems (score <= 75)
    Object.keys(digitalTwin.systemScores).forEach(sysKey => {
      const score = digitalTwin.systemScores[sysKey as keyof SystemScores] || 100;
      if (score <= 75) {
        // Find uncompleted assessments matching this category
        const matching = uncompleted.filter(p => p.category === sysKey);
        matching.forEach(p => {
          if (suggestions.length < 4 && !suggestions.find(s => s.id === p.id)) {
            suggestions.push(p);
          }
        });
      }
    });

    // Rule 3: Fill up with standard uncompleted assessments
    uncompleted.forEach(p => {
      if (suggestions.length < 3 && !suggestions.find(s => s.id === p.id) && p.id !== "biological_age") {
        suggestions.push(p);
      }
    });

    // Fallback: default baseline set
    if (suggestions.length === 0) {
      return ASSESSMENT_PROFILES.filter(p => ["metabolic_profile", "diabetes_risk", "thyroid_assessment"].includes(p.id)).slice(0, 3);
    }

    return suggestions.slice(0, 3);
  };

  // Get Related Content links for Priority 8
  const relatedContent: RelatedContent = activeReport 
    ? getRelatedContent(activeReportCategory)
    : { conditions: [], treatments: [], blogs: [], protocols: [] };

  const hiosAnalysis = analyzeDigitalTwin(digitalTwin);

  // Strength and Vulnerability analysis from system scores
  const strengths: string[] = [];
  const vulnerabilities: string[] = [];
  Object.keys(digitalTwin.systemScores).forEach(key => {
    const val = digitalTwin.systemScores[key as keyof SystemScores];
    const systemName = key.charAt(0).toUpperCase() + key.slice(1);
    if (val >= 90) strengths.push(`Excellent ${systemName} efficiency`);
    else if (val <= 75) vulnerabilities.push(`${systemName} reserve depleted`);
  });

  const renderCompanionContent = (isFullscreen: boolean) => {
    return (
      <div className={`glass-panel bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-955/95 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-12 gap-0 ${
        isFullscreen ? "w-full h-full rounded-3xl" : "md:h-[460px]"
      }`}>
        
        {/* Left Column: Digital Twin Telemetry & Friend Header */}
        <div 
          data-lenis-prevent="true"
          className={`md:col-span-5 p-5 bg-gradient-to-b from-slate-50/70 to-slate-100/30 dark:from-slate-950/40 dark:to-slate-950/10 border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between space-y-4 md:h-full overflow-y-auto scrollbar-thin ${
            isFullscreen ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="space-y-4">
            {/* Animated Greeting Header */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mint to-teal-400 flex items-center justify-center shadow-md text-white font-black text-sm">
                  💚
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-850 dark:text-zinc-200">
                  Your Health Ally
                </h3>
                <p className="text-[9.5px] text-mint font-bold uppercase tracking-wider">
                  Always here to guide you
                </p>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Think of me as your personal health advocate. I keep track of your wellness profile and biological rhythms so you don't have to carry the weight alone.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                <span className="text-[11px] text-slate-550 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                  📊 Overall Health Reserve
                </span>
                <span className="text-xs font-black text-mint bg-mint/10 px-2 py-0.5 rounded-md">
                  {digitalTwin.overallScore}%
                </span>
              </div>

              {digitalTwin.biologicalAge && (
                <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                  <span className="text-[11px] text-slate-550 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                    🧬 Epigenetic Age Clock
                  </span>
                  <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {digitalTwin.biologicalAge.bioAge} yrs
                  </span>
                </div>
              )}

              {digitalTwin.activeRulesFlags.length > 0 ? (
                <div className="space-y-1.5 bg-rose-500/5 dark:bg-rose-500/3 p-3 rounded-xl border border-rose-500/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-455 block">
                    ⚠️ Functional Strain Signals
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {digitalTwin.activeRulesFlags.slice(0, 3).map((flag, idx) => (
                      <span key={idx} className="text-[8.5px] font-bold text-rose-500 dark:text-rose-400 bg-white dark:bg-slate-900/80 border border-rose-500/20 px-2 py-0.5 rounded-md shadow-sm">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {digitalTwin.constitutional && (
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Constitutional Profile</span>
                  <p className="text-[11px] text-slate-650 dark:text-zinc-350 leading-relaxed">
                    Primary remedy: <strong className="text-mint font-semibold">{digitalTwin.constitutional.remedyMatch}</strong>
                    <br />
                    Dominance: <span className="font-medium text-slate-700 dark:text-slate-300">{digitalTwin.constitutional.systemDominance}</span>
                  </p>
                </div>
              )}
            </div>

            {/* 🧠 AI Health Memory Card */}
            <div className="mt-3 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 dark:from-teal-500/10 dark:to-emerald-500/10 border border-teal-500/10 dark:border-teal-500/20 p-3 rounded-2xl space-y-2 shrink-0">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-teal-650 dark:text-teal-400 flex items-center gap-1.5">
                🧠 AI Health Memory
              </span>
              <div className="space-y-1.5 text-[10.5px] text-slate-700 dark:text-zinc-350 leading-relaxed">
                <p className="font-bold border-b border-slate-200/50 dark:border-slate-800/50 pb-1">What I've Learned About You:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-650 dark:text-zinc-400">
                  <li>Sleep usually impacts your vitality most.</li>
                  <li>Stress burden is improving (Score: {100 - (digitalTwin.systemScores?.mentalHealth ?? 100)}% load).</li>
                  {digitalTwin.history.some(h => h.symptoms?.includes("headache")) || topMessages.some(m => m.text.toLowerCase().includes("headache")) ? (
                    <li>Headache first reported today.</li>
                  ) : (
                    <li>Baseline reserves are currently stable.</li>
                  )}
                  <li>Goal: Improve resilience and recovery.</li>
                </ul>
                <div className="text-[8.5px] text-slate-400 dark:text-zinc-500 text-right pt-0.5">
                  Last Updated: Today
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <p className="text-[9.5px] text-slate-400 dark:text-zinc-500 leading-normal italic">
              Need a professional review? Let's connect you directly with Dr. Jethwani:
            </p>
            <a 
              href={`https://wa.me/918446056789?text=${encodeURIComponent(
                `Hello Dr. Narayan Jethwani, I completed my Health Intelligence profile and would like to review my digital health twin metrics with you.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 no-underline shadow-sm hover:shadow-emerald-500/20 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Book WA Review with Dr. Jethwani
            </a>
          </div>
        </div>

        {/* Right Column: Chat Interface (7 cols) */}
        <div className={`${
          isFullscreen ? "col-span-12 md:col-span-7 h-full" : "md:col-span-7 h-[400px] md:h-full"
        } flex flex-col bg-white dark:bg-slate-900 overflow-hidden min-h-0`}>
          
          {/* Chat Control Bar */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/20 flex flex-wrap justify-between items-center gap-2 shrink-0">
            {/* Empathy Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-450 dark:text-zinc-455">Tone:</span>
              <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-sm">
                <button
                  onClick={() => setChatTone("empathetic")}
                  className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md cursor-pointer transition-all ${
                    chatTone === "empathetic" 
                      ? "bg-mint text-white" 
                      : "text-slate-500 hover:text-slate-750 dark:hover:text-zinc-350"
                  }`}
                >
                  Empathetic 💚
                </button>
                <button
                  onClick={() => setChatTone("professional")}
                  className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md cursor-pointer transition-all ${
                    chatTone === "professional" 
                      ? "bg-indigo-600 text-white" 
                      : "text-slate-500 hover:text-slate-750 dark:hover:text-zinc-350"
                  }`}
                >
                  Clinical 🔬
                </button>
              </div>
            </div>

            {/* Font Size Adjusters & Reset */}
            <div className="flex items-center gap-2.5">
              {/* Font sizing */}
              <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-sm">
                <button 
                  onClick={decreaseFontSize}
                  title="Decrease Font Size"
                  className="w-5 h-5 flex items-center justify-center text-[10px] font-black text-slate-555 hover:text-mint transition-colors cursor-pointer border-none bg-transparent"
                >
                  A-
                </button>
                <span className="text-[9px] font-black text-slate-500 dark:text-zinc-400 px-1.5 min-w-[28px] text-center bg-slate-50 dark:bg-slate-900 rounded">
                  {chatFontSize}px
                </span>
                <button 
                  onClick={increaseFontSize}
                  title="Increase Font Size"
                  className="w-5 h-5 flex items-center justify-center text-[10px] font-black text-slate-555 hover:text-mint transition-colors cursor-pointer border-none bg-transparent"
                >
                  A+
                </button>
              </div>

              {/* Reset Chat */}
              <button
                onClick={clearChat}
                title="Reset Chat History"
                className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsTopAssistantFullscreen(!isTopAssistantFullscreen)}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                className="p-1 text-slate-400 hover:text-mint hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div 
            ref={isFullscreen ? topChatFullscreenContainerRef : topChatContainerRef} 
            data-lenis-prevent="true"
            className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3.5 scrollbar-thin"
          >
            {topMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl relative group/msg ${
                    msg.sender === "user"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-zinc-200 rounded-tr-none border border-slate-200/50 dark:border-slate-800"
                      : "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-slate-800 dark:text-zinc-200 rounded-tl-none"
                  }`}
                >
                  {/* Copy Button (visible on hover) */}
                  <button
                    onClick={() => handleCopyMessage(msg.text, i)}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded shadow-sm opacity-0 group-hover/msg:opacity-100 transition-opacity cursor-pointer text-slate-450 hover:text-mint"
                    title="Copy message"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  <div 
                    className="leading-relaxed pr-4"
                    style={{ fontSize: `${chatFontSize}px` }}
                  >
                    <MarkdownRenderer text={msg.text} onActionClick={(action) => handleTopSend(action)} />
                  </div>
                </div>
              </div>
            ))}
            {isTopTyping && (
              <div className="flex justify-start">
                <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/10 rounded-2xl rounded-tl-none p-3 text-[11px] text-slate-400 animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Quick question recommendation chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/10 flex flex-wrap gap-1.5 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button 
              onClick={() => handleTopSend("Help me understand my health scores in simple terms")}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[9.5px] text-slate-650 dark:text-zinc-350 cursor-pointer font-bold transition-all shrink-0 hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              🍃 Simple Score Summary
            </button>
            <button 
              onClick={() => handleTopSend("I feel tired/stressed lately, what should I do next?")}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[9.5px] text-slate-650 dark:text-zinc-350 cursor-pointer font-bold transition-all shrink-0 hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              🛌 Tired/Stressed Check-in
            </button>
            <button 
              onClick={() => handleTopSend("How can I restore balance using my homeopathic constitutional match?")}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[9.5px] text-slate-650 dark:text-zinc-350 cursor-pointer font-bold transition-all shrink-0 hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              ✨ Constitutional Remedy Guide
            </button>
            <button 
              onClick={() => handleTopSend("What are the best next assessments for me to complete?")}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[9.5px] text-slate-650 dark:text-zinc-350 cursor-pointer font-bold transition-all shrink-0 hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              📋 Next Assessment Tips
            </button>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 shrink-0">
            <input
              type="text"
              value={topInput}
              onChange={(e) => setTopInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleTopSend(topInput); }}
              placeholder="Ask your AI Companion a clinical question..."
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-880 rounded-xl text-xs outline-none focus:border-mint focus:bg-white dark:focus:bg-slate-955 transition-all text-slate-800 dark:text-zinc-100"
            />
            <button
              onClick={() => handleTopSend(topInput)}
              className="p-2 bg-mint hover:bg-teal-600 text-white rounded-xl cursor-pointer flex items-center justify-center border-none shadow-sm active:scale-95 transition-all w-9 h-9"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-pearl dark:bg-[#070b13] text-slate-800 dark:text-zinc-150 font-sans transition-colors duration-500">
      
      {/* Dynamic SEO JSON-LD Injected Schema */}
      <SchemaMarkup profileId={selectedProfileId || ""} />

      {/* Global Lab Parsing Overlay */}
      <AnimatePresence>
        {labParsing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center space-y-4 print:hidden"
          >
            <div className="glass-panel border border-slate-200/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 rounded-3xl p-8 max-w-sm text-center shadow-2xl flex flex-col items-center space-y-4">
              <RefreshCw className="w-10 h-10 text-mint animate-spin" />
              <div className="space-y-1.5">
                <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white">Analyzing Lab Biomarkers</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Our clinical OCR engine is scanning files, verifying reference ranges, and formulating medical diagnostic guidelines...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Blur Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-mint/5 dark:bg-mint/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Dynamic Nav Breadcrumbs (print:hidden) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
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

        {/* ========================================================= */}
        {/* PRIORITY 1: MY HEALTH INTELLIGENCE DASHBOARD (HERO BLOCK)  */}
        {/* ========================================================= */}
        {activeView === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 print:hidden"
          >
            <div className="glass-panel border border-slate-200/50 dark:border-slate-850 bg-white/80 dark:bg-slate-900/60 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    My Health Intelligence Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Personalized precision medicine portal & epigenetic health tracker.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      scrollToUpload();
                      setTimeout(() => {
                        document.getElementById("lab-upload-input-2")?.click();
                      }, 200);
                    }}
                    className="py-2.5 px-4 bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-850 hover:border-mint text-[11px] font-bold uppercase tracking-wider text-slate-650 dark:text-zinc-350 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-4 h-4 text-mint" />
                    Upload Lab
                  </button>
                  <button
                    onClick={() => handleSelectProfile("biological_age")}
                    className="py-2.5 px-4 bg-mint hover:bg-teal-600 text-white font-bold rounded-xl text-[11px] uppercase tracking-wider cursor-pointer border-none transition-all flex items-center gap-1.5"
                  >
                    <Flame className="w-4 h-4 text-amber-300" />
                    Bio-Age Check
                  </button>
                  <button
                    onClick={() => setIsTopAssistantOpen(!isTopAssistantOpen)}
                    className={`py-2.5 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden group ${
                      isTopAssistantOpen 
                        ? "bg-slate-100 dark:bg-slate-800 text-mint border border-mint" 
                        : "bg-white dark:bg-slate-950 text-slate-650 dark:text-zinc-350 border border-slate-200/70 dark:border-slate-850 hover:border-mint hover:text-mint"
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <Sparkles className={`w-4 h-4 transition-transform duration-500 group-hover:rotate-180 ${isTopAssistantOpen ? "text-mint animate-pulse" : "text-emerald-500"}`} />
                    <span>AI Companion</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isTopAssistantOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Collapsable AI Companion Panel */}
              <AnimatePresence>
                {isTopAssistantOpen && !isTopAssistantFullscreen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-3 pt-2">
                      {renderCompanionContent(false)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Four Column Dashboard Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                
                {/* Gauge 1: Overall Vitality Score */}
                <div className="glass-panel bg-white/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Overall Vitality</span>
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                      <circle 
                        cx="50" cy="50" r="42" 
                        className="stroke-mint fill-none" 
                        strokeWidth="6"
                        strokeDasharray={263.8}
                        strokeDashoffset={263.8 - (263.8 * digitalTwin.overallScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{digitalTwin.overallScore}%</span>
                      <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Up +3% this month</span>
                  </div>
                </div>

                {/* Gauge 2: Intersecting SVG Health Rings */}
                <div className="glass-panel bg-white/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">System Reserves</span>
                  
                  {/* Glowing 3 Concentric Rings */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Outer Ring: Metabolic (Radius 36) */}
                      <circle cx="50" cy="50" r="36" className="stroke-slate-100/50 dark:stroke-slate-800/40 fill-none" strokeWidth="5" />
                      <circle 
                        cx="50" cy="50" r="36" 
                        className="stroke-teal-500 fill-none" 
                        strokeWidth="5"
                        strokeDasharray={226.2}
                        strokeDashoffset={226.2 - (226.2 * (digitalTwin.systemScores.endocrine * 0.9 + 10)) / 100}
                        strokeLinecap="round"
                      />
                      {/* Middle Ring: Endocrine (Radius 27) */}
                      <circle cx="50" cy="50" r="27" className="stroke-slate-100/50 dark:stroke-slate-800/40 fill-none" strokeWidth="5" />
                      <circle 
                        cx="50" cy="50" r="27" 
                        className="stroke-violet-500 fill-none" 
                        strokeWidth="5"
                        strokeDasharray={169.6}
                        strokeDashoffset={169.6 - (169.6 * digitalTwin.systemScores.endocrine) / 100}
                        strokeLinecap="round"
                      />
                      {/* Inner Ring: Digestive (Radius 18) */}
                      <circle cx="50" cy="50" r="18" className="stroke-slate-100/50 dark:stroke-slate-800/40 fill-none" strokeWidth="5" />
                      <circle 
                        cx="50" cy="50" r="18" 
                        className="stroke-emerald-500 fill-none" 
                        strokeWidth="5"
                        strokeDasharray={113.1}
                        strokeDashoffset={113.1 - (113.1 * digitalTwin.systemScores.digestive) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <HeartPulse className="w-5 h-5 text-mint" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex gap-2.5 text-[8.5px] font-bold text-slate-400 justify-center">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>Met</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>Endo</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Dig</span>
                  </div>
                </div>

                {/* Gauge 3: Epigenetic Longevity Index */}
                <div className="glass-panel bg-white/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 text-center block mb-2">Epigenetic longevity</span>
                  
                  {digitalTwin.biologicalAge ? (
                    <div className="space-y-2.5 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{digitalTwin.biologicalAge.bioAge}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">yrs bio-age</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-semibold border-t border-slate-100 dark:border-slate-800/80 pt-2 text-slate-650 dark:text-zinc-350">
                        <span>Chron Age: {digitalTwin.biologicalAge.chronologicalAge}</span>
                        <span className="text-emerald-500 font-bold">-{digitalTwin.biologicalAge.chronologicalAge - digitalTwin.biologicalAge.bioAge} yrs</span>
                      </div>
                      <div className="text-[9px] bg-mint/5 border border-mint/20 rounded-md p-1 font-bold text-mint uppercase tracking-wider">
                        Risk: {digitalTwin.biologicalAge.lifestyleRiskIndex} Risk Index
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 space-y-2 flex-grow flex flex-col justify-center items-center">
                      <p className="text-[10px] text-slate-500">Epigenetic clock not calibrated.</p>
                      <button
                        onClick={() => handleSelectProfile("biological_age")}
                        className="py-1.5 px-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider cursor-pointer border-none transition-colors"
                      >
                        Calibrate Age
                      </button>
                    </div>
                  )}
                </div>

                {/* Gauge 4: Public Health Index (Priority 11) */}
                <div className="glass-panel bg-white/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 text-center block mb-2">Public Health Index™</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      <span className="text-slate-500">Stress Burden Index</span>
                      <span className="font-mono font-bold text-amber-500">64%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      <span className="text-slate-500">Sleep Quality Index</span>
                      <span className="font-mono font-bold text-emerald-500">68/100</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      <span className="text-slate-500">Metabolic Risks</span>
                      <span className="font-mono font-bold text-rose-500">38%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      <span className="text-slate-500">Thyroid Wellness</span>
                      <span className="font-mono font-bold text-teal-500">76%</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* Outer Workspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* SIDEBAR: PERSISTENT HEALTH DIGITAL TWIN VIEW (4 cols)      */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            
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

            {/* FUTURE-READY: HEALTH OS & SYNC INTEGRATIONS */}
            <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Health OS & Wearable Sync
              </span>

              {/* Wearable integrations */}
              <div className="space-y-3">
                <div className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-500">
                  Wearable Connections:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {(["Apple Health", "Google Fit", "Fitbit", "Garmin"] as const).map(device => {
                    const status = (digitalTwin.wearables || {})[device] || { device, connected: false };
                    return (
                      <button
                        key={device}
                        onClick={() => handleToggleWearable(device)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-[70px] ${
                          status.connected
                            ? "bg-mint/5 border-mint text-slate-800 dark:text-zinc-150"
                            : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 text-slate-500"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10.5px] font-bold">{device}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.connected ? "bg-emerald-500" : "bg-slate-300"}`} />
                        </div>
                        {status.connected && status.metrics ? (
                          <div className="text-[8.5px] text-slate-450 leading-none space-y-0.5 font-bold">
                            <div>HR: {status.metrics.heartRateAvg} bpm</div>
                            <div>Steps: {status.metrics.steps}</div>
                          </div>
                        ) : (
                          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Connect</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Connections */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-500">
                  Clinical Portal Sync:
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] font-bold text-slate-800 dark:text-zinc-150 block">Clinician Portal</span>
                    {digitalTwin.clinicalPortal?.connected ? (
                      <span className="text-[8.5px] text-emerald-500 font-bold block leading-none">
                        Synced: {digitalTwin.clinicalPortal.portalId}
                      </span>
                    ) : (
                      <span className="text-[8.5px] text-slate-400 font-bold block leading-none">Not Connected</span>
                    )}
                  </div>
                  <button
                    onClick={handleToggleClinicalPortal}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider cursor-pointer border-none transition-colors ${
                      digitalTwin.clinicalPortal?.connected
                        ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                        : "bg-mint text-white hover:bg-teal-600"
                    }`}
                  >
                    {digitalTwin.clinicalPortal?.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50/30 dark:bg-slate-950/10 border border-slate-100 dark:border-slate-850/60 rounded-xl text-[9.5px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${digitalTwin.clinicalPortal?.connected ? "bg-emerald-500" : "bg-amber-400"}`} />
                    Clinical AI Engine:
                  </span>
                  <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-350">
                    {digitalTwin.clinicalPortal?.connected ? "Operational" : "Standby"}
                  </span>
                </div>
              </div>
            </div>

            {/* PRIORITY 5: LONGITUDINAL HEALTH TIMELINE */}
            {digitalTwin.history && digitalTwin.history.length > 0 && (
              <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-5 shadow-sm space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-mint animate-pulse" />
                  Health Progress Timeline
                </span>
                
                <div data-lenis-prevent="true" className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                  {getTimelineHistory().map((item, idx) => (
                    <div key={item.id} className="relative pl-4 border-l border-slate-100 dark:border-slate-800/80 last:border-none pb-2 space-y-1">
                      {/* Timeline dot */}
                      <div className="absolute left-[-4.5px] top-1 w-2.5 h-2.5 rounded-full bg-mint" />
                      
                      <div className="flex justify-between items-start text-xs font-semibold">
                        <span className="text-slate-800 dark:text-zinc-200 leading-tight block max-w-[70%]">{item.name}</span>
                        <span className="font-mono font-bold text-mint">{item.score}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                        <span>{item.date}</span>
                        <span className={`px-2 py-0.5 rounded ${
                          item.status === "Compensated" 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450" 
                            : item.status === "Sluggish" 
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450" 
                              : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      
                      {item.trend && (
                        <div className={`text-[9.5px] font-bold flex items-center gap-1 ${
                          item.trend.includes("Improvement") 
                            ? "text-emerald-500" 
                            : item.trend.includes("Regression") 
                              ? "text-rose-500" 
                              : "text-slate-450"
                        }`}>
                          {item.trend.includes("Improvement") && <TrendingUp className="w-3.5 h-3.5" />}
                          <span>{item.trend}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* MAIN VIEWPORT: ACTIVE DISPLAY (8 cols)                     */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
                         {/* VIEW: MAIN DASHBOARD AND ACCORDIONS CATEGORIES SELECTOR */}
              {activeView === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  
                  {/* Health OS Tab Navigation Bar */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-1 md:gap-4 overflow-x-auto pb-1 scrollbar-thin print:hidden">
                    {[
                      { id: "overview", label: "Health OS Overview", icon: Layers },
                      { id: "labs", label: "AI Lab Intelligence", icon: FileText },
                      { id: "bioage", label: "Biological Age Clock", icon: Flame },
                      { id: "directory", label: "Assessments Directory", icon: BookOpen }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = dashboardTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setDashboardTab(tab.id as any)}
                          className={`py-3 px-4 border-b-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer bg-transparent border-none ${
                            isActive 
                              ? "border-mint text-mint" 
                              : "border-transparent text-slate-455 hover:text-slate-655 dark:hover:text-zinc-200"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* TAB CONTENT: OVERVIEW */}
                  {dashboardTab === "overview" && (
                    <div className="space-y-8">
                      {/* Welcome Banner */}
                      <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent rounded-[24px] p-6 flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm">
                        <div className="space-y-2 text-center md:text-left">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/15 dark:bg-mint/5 text-[9.5px] font-bold uppercase tracking-wider text-mint shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>Clinical OS Active</span>
                          </div>
                          <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                            Personal Health Digital Twin
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md leading-relaxed">
                            {Object.keys(digitalTwin.completedAssessments).length > 0
                              ? "Your clinical digital twin computes multi-system organ risks, active diathesis states, and suggests preventative medical screenings."
                              : "Configure your biological twin. Complete self-assessments or upload laboratory reports to calibrate your homeostatic telemetry."}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                          <a
                            href={getWhatsAppConsultationLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all text-center no-underline flex items-center justify-center gap-1.5 active:scale-98"
                          >
                            <MessageSquare className="w-4 h-4" />
                            WhatsApp Consultation
                          </a>
                          <button
                            onClick={handleToggleClinicalPortal}
                            className={`py-2.5 px-4 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all border shadow-sm flex items-center justify-center gap-1.5 active:scale-98 ${
                              digitalTwin.clinicalPortal?.connected
                                ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 text-rose-600 hover:bg-rose-100/30"
                                : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-zinc-200 hover:border-mint"
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4 text-mint" />
                            {digitalTwin.clinicalPortal?.connected ? "Disconnect Portal" : "Connect Portal"}
                          </button>
                        </div>
                      </div>

                      {/* System Reserves Grid */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                          System Reserves Assessment Dashboard
                        </span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.keys(digitalTwin.systemScores).map(key => {
                            const score = digitalTwin.systemScores[key as keyof SystemScores] || 100;
                            const label = key.charAt(0).toUpperCase() + key.slice(1);
                            
                            // Determine status
                            let status = "Optimal";
                            let statusColor = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/20";
                            let ringColor = "stroke-emerald-500";
                            
                            if (score < 55) {
                              status = "Depleted";
                              statusColor = "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-100/20";
                              ringColor = "stroke-rose-500";
                            } else if (score < 75) {
                              status = "Sluggish";
                              statusColor = "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100/20";
                              ringColor = "stroke-amber-500";
                            } else if (score < 90) {
                              status = "Compensated";
                              statusColor = "text-teal-500 bg-teal-50 dark:bg-teal-950/20 border-teal-100/20";
                              ringColor = "stroke-teal-500";
                            }

                            return (
                              <div 
                                key={key} 
                                className="glass-panel bg-white/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-4.5 rounded-2xl flex flex-col items-center text-center justify-between h-[150px] transition-all hover:border-slate-350 dark:hover:border-slate-750"
                              >
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">{label}</span>
                                
                                <div className="relative w-16 h-16 flex items-center justify-center my-1.5">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="8" />
                                    <circle 
                                      cx="50" cy="50" r="42" 
                                      className={`${ringColor} fill-none`} 
                                      strokeWidth="8"
                                      strokeDasharray={263.8}
                                      strokeDashoffset={263.8 - (263.8 * score) / 100}
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-black text-slate-800 dark:text-white font-mono">{score}%</span>
                                  </div>
                                </div>

                                <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColor}`}>
                                  {status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Organ Loads & Miasmatic Burden */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Organ Loads */}
                        <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-5 space-y-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                            Computed Organ Stress Loads
                          </span>
                          <div className="space-y-3">
                            {Object.keys(digitalTwin.organLoad).slice(0, 5).map(organ => {
                              const load = digitalTwin.organLoad[organ] || 10;
                              return (
                                <div key={organ} className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-slate-650 dark:text-zinc-350 capitalize">{organ}</span>
                                    <span className={`font-mono ${load > 60 ? "text-rose-500" : load > 30 ? "text-amber-500" : "text-emerald-500"}`}>{load}%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        load > 60 ? "bg-rose-500" : load > 30 ? "bg-amber-500" : "bg-emerald-500"
                                      }`}
                                      style={{ width: `${load}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Miasmatic Burden */}
                        <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-5 space-y-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                            Miasmatic Burden Profile
                          </span>
                          
                          <div className="space-y-4">
                            {/* Psora */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10.5px] font-bold">
                                <span className="text-amber-500 uppercase tracking-wider">Psora (Functional Strain)</span>
                                <span className="font-mono text-amber-500">{hiosAnalysis.miasmaticProfile?.psora || 30}%</span>
                              </div>
                              <p className="text-[9.5px] text-slate-400 leading-normal">Governs basic dry skin, transient allergies, nervous irritation, and hyper-sensitivities.</p>
                              <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${hiosAnalysis.miasmaticProfile?.psora || 30}%` }} />
                              </div>
                            </div>
                            
                            {/* Sycosis */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10.5px] font-bold">
                                <span className="text-teal-500 uppercase tracking-wider">Sycosis (Excess / Adiposity)</span>
                                <span className="font-mono text-teal-500">{hiosAnalysis.miasmaticProfile?.sycosis || 20}%</span>
                              </div>
                              <p className="text-[9.5px] text-slate-400 leading-normal">Governs water retention, fat deposition, cyst growths, skin tags, and slow sluggish metabolism.</p>
                              <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
                                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${hiosAnalysis.miasmaticProfile?.sycosis || 20}%` }} />
                              </div>
                            </div>

                            {/* Syphilis */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10.5px] font-bold">
                                <span className="text-rose-500 uppercase tracking-wider">Syphilis (Destructive / Organic)</span>
                                <span className="font-mono text-rose-500">{hiosAnalysis.miasmaticProfile?.syphilis || 10}%</span>
                              </div>
                              <p className="text-[9.5px] text-slate-400 leading-normal">Governs cracks, ulcers, memory decays, vascular stiffness, and organic degeneration trends.</p>
                              <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
                                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${hiosAnalysis.miasmaticProfile?.syphilis || 10}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cross-System Axis Map */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                          Cross-System Axis Intelligence & Alerts
                        </span>
                        
                        {/* Axis Alerts if active */}
                        {digitalTwin.activeRulesFlags.length > 0 && (
                          <div className="p-4 bg-amber-50/10 dark:bg-amber-950/5 border border-amber-250 dark:border-amber-900/30 rounded-2xl space-y-2.5">
                            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-450 text-xs font-extrabold uppercase tracking-wider">
                              <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                              <span>Active Clinical Axis Alerts</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {digitalTwin.activeRulesFlags.map((flag, idx) => (
                                <div key={idx} className="p-3 bg-white dark:bg-slate-900/60 border border-amber-200/50 dark:border-amber-900/20 rounded-xl space-y-1.5">
                                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-150 block">{flag}</span>
                                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
                                    {flag === "Endocrine-Stress Axis Strain" && "Thyroid gland conversion speed is lowered due to chronic HPA axis stress/cortisol activation."}
                                    {flag === "Visceral-Glycemic Syndrome Profile" && "Clustering metabolic load from abdominal fat storage and insulin resistance cues."}
                                    {flag === "Autonomic Brain-Gut Dysregulation" && "Enteric nervous signaling dysregulated by high mental/stress burden, causing spastic gut symptoms."}
                                    {flag === "Atopic Dermal-Respiratory Axis" && "Hyper-reactive IgE loops correlating skin barrier splits and respiratory mucosal hypersensitivity."}
                                  </p>
                                  <a 
                                    href={getWhatsAppConsultationLink()} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[9px] text-emerald-500 hover:text-emerald-600 font-extrabold uppercase tracking-wider flex items-center gap-0.5 no-underline mt-1 cursor-pointer"
                                  >
                                    Consult Dr. Jethwani on WhatsApp <ArrowRight className="w-3 h-3" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Visual Health Axes Map */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              name: "Endocrine-Metabolic Axis",
                              description: "Interaction between adrenal cortisol release, thyroid speed, and pancreatic insulin sensitivity.",
                              isVulnerable: digitalTwin.activeRulesFlags.includes("Endocrine-Stress Axis Strain") || digitalTwin.activeRulesFlags.includes("Visceral-Glycemic Syndrome Profile") || digitalTwin.systemScores.endocrine <= 75,
                              insight: "Thyroid conversion requires healthy cortisol baseline; excess sugar spikes deplete thyroid reserves.",
                              icon: Sliders
                            },
                            {
                              name: "Gut-Brain Autonomic Axis",
                              description: "Vagal nerve bidirectional signaling between gut flora, peristalsis, and central stress levels.",
                              isVulnerable: digitalTwin.activeRulesFlags.includes("Autonomic Brain-Gut Dysregulation") || digitalTwin.systemScores.digestive <= 75 || digitalTwin.systemScores.mentalHealth <= 75,
                              insight: "Elevated stress triggers sympathetic tone, downregulating gastric acids and causing IBS spasm.",
                              icon: Heart
                            },
                            {
                              name: "Sleep-Cardiovascular Loop",
                              description: "Circadian sleep phases impacting blood pressure dipping, vascular elasticity, and heart rate variability.",
                              isVulnerable: digitalTwin.systemScores.cardiovascular <= 75,
                              insight: "Fragmented sleep blocks overnight cellular cleanup, increasing systemic vascular tension.",
                              icon: Activity
                            },
                            {
                              name: "Dermal-Immune (Atopic) Axis",
                              description: "The feedback loop linking epidermal lipid barrier splits to mucosal allergen sensitivities.",
                              isVulnerable: digitalTwin.activeRulesFlags.includes("Atopic Dermal-Respiratory Axis") || digitalTwin.systemScores.skin <= 75 || digitalTwin.systemScores.immune <= 75,
                              insight: "Leaky skin layers correlate with respiratory mucosal hypersensitivity and chronic eczema.",
                              icon: ShieldAlert
                            }
                          ].map((axis, i) => {
                            const Icon = axis.icon;
                            return (
                              <div 
                                key={i} 
                                className={`p-4 bg-white/40 dark:bg-slate-950/10 border rounded-2xl space-y-2 transition-all hover:border-slate-350 dark:hover:border-slate-750 ${
                                  axis.isVulnerable 
                                    ? "border-rose-250 dark:border-rose-900/30 bg-rose-50/5 dark:bg-rose-950/5" 
                                    : "border-slate-150 dark:border-slate-850"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`p-1.5 rounded-lg ${axis.isVulnerable ? "bg-rose-100/50 dark:bg-rose-950/30 text-rose-500" : "bg-mint/10 text-mint"}`}>
                                      <Icon className="w-4.5 h-4.5" />
                                    </span>
                                    <span className="text-xs font-bold text-slate-850 dark:text-zinc-150">{axis.name}</span>
                                  </div>
                                  <span className={`text-[8.5px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                    axis.isVulnerable 
                                      ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 border border-rose-100/20" 
                                      : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 border border-emerald-100/20"
                                  }`}>
                                    {axis.isVulnerable ? "Axis Strain" : "Stable"}
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-505 dark:text-zinc-400 leading-normal">{axis.description}</p>
                                <div className="text-[9.5px] bg-slate-50/80 dark:bg-slate-900/40 p-2 rounded-xl text-slate-650 dark:text-zinc-300 border border-slate-100 dark:border-slate-800/80">
                                  <strong className="text-mint">OS Insight:</strong> {axis.insight}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Smart Recommendations */}
                      <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-6 space-y-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                          HIOS™ Smart Recommendations
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {getSuggestedNextAssessments().map(prof => (
                            <div 
                              key={prof.id} 
                              className="p-4 bg-white/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 hover:border-mint rounded-2xl flex flex-col justify-between h-[140px] transition-all duration-300"
                            >
                              <div className="space-y-1">
                                <span className="text-[8px] font-extrabold text-mint uppercase tracking-wider">Recommended Next Step</span>
                                <h5 className="text-xs font-bold text-slate-850 dark:text-zinc-105 leading-snug">{prof.name}</h5>
                                <p className="text-[9.5px] text-slate-450 dark:text-zinc-400 line-clamp-2 leading-relaxed">{prof.description}</p>
                              </div>
                              <button 
                                onClick={() => handleSelectProfile(prof.id)}
                                className="text-[9.5px] font-bold text-mint hover:text-teal-600 flex items-center gap-0.5 uppercase tracking-wider border-none bg-transparent cursor-pointer mt-2 w-full text-left"
                              >
                                Run Assessment <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline History */}
                      {getTimelineHistory().length > 0 && (
                        <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[28px] p-6 space-y-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                            Longitudinal Assessment Timeline History
                          </span>
                          <div className="divide-y divide-slate-100 dark:divide-slate-850/80">
                            {getTimelineHistory().map(entry => (
                              <div key={entry.id} className="py-3.5 flex justify-between items-center text-xs">
                                <div className="space-y-1">
                                  <span className="font-bold text-slate-800 dark:text-zinc-100">{entry.name}</span>
                                  <div className="flex gap-2.5 text-[9.5px] text-slate-400 font-semibold">
                                    <span>{entry.date}</span>
                                    <span>•</span>
                                    <span className={`px-1.5 py-0.5 rounded-md ${
                                      entry.status === "Compensated" 
                                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450" 
                                        : entry.status === "Sluggish" 
                                          ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450" 
                                          : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450"
                                    }`}>
                                      {entry.status}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right shrink-0">
                                    <span className="text-[8.5px] text-slate-450 uppercase tracking-widest block font-extrabold">Index</span>
                                    <span className="font-mono font-bold text-mint text-sm">{entry.score}%</span>
                                  </div>
                                  
                                  <button 
                                    onClick={() => {
                                      const report = generateReport(entry.profileId, entry.score, entry.answers, entry.symptoms);
                                      const analysis = analyzeDigitalTwin({
                                        ...digitalTwin,
                                        completedAssessments: {
                                          ...digitalTwin.completedAssessments,
                                          [entry.profileId]: { score: entry.score, date: entry.date, answers: entry.answers, symptoms: entry.symptoms }
                                        }
                                      });
                                      report.miasmaticProfile = analysis.miasmaticProfile;
                                      setActiveReport(report);
                                      setSelectedProfileId(entry.profileId);
                                      setActiveReportCategory(ASSESSMENT_PROFILES.find(p => p.id === entry.profileId)?.category || "metabolic");
                                      setActiveView("report");
                                    }}
                                    className="py-1.5 px-3 border border-slate-200 dark:border-slate-800 hover:border-mint hover:bg-mint/5 rounded-xl text-[10px] font-bold text-slate-650 dark:text-zinc-350 cursor-pointer transition-colors"
                                  >
                                    Report
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT: AI LAB INTELLIGENCE */}
                  {dashboardTab === "labs" && (
                    <div className="space-y-8">
                      {labResult ? (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850/80 pb-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-mint bg-mint/5 px-2.5 py-1 rounded-full">
                                Lab Telemetry Calibrated
                              </span>
                              <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                Extracted Biomarkers Overview
                              </h3>
                            </div>
                            <button
                              onClick={() => {
                                setLabResult(null);
                                const updated = { ...digitalTwin, labResult: undefined };
                                saveDigitalTwin(updated);
                              }}
                              className="py-2 px-3 border border-rose-200 dark:border-rose-900/30 text-rose-500 hover:bg-rose-500/10 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              Reset & Upload New
                            </button>
                          </div>

                          {/* Summary message */}
                          <div className="p-4 bg-mint/5 dark:bg-mint/5 rounded-2xl border border-mint/20 text-xs leading-relaxed text-slate-755 dark:text-zinc-300 font-medium flex gap-2">
                            <Info className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                            <span>{labResult.summary}</span>
                          </div>

                          {/* Biomarkers Table */}
                          <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-150 dark:divide-slate-800/80">
                            {labResult.extractedData.map((data, idx) => (
                              <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 dark:bg-slate-950/10">
                                <div className="space-y-1 md:max-w-[65%]">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-bold text-slate-800 dark:text-white">{data.marker}</h5>
                                    <span className={`text-[8.5px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                      data.status === "Normal" 
                                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100/10" 
                                        : data.status === "Elevated" 
                                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100/10" 
                                          : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border border-amber-100/10"
                                    }`}>
                                      {data.status}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-505 dark:text-zinc-400 leading-normal">{data.significance}</p>
                                </div>
                                
                                <div className="flex md:flex-col justify-between items-end shrink-0">
                                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{data.value}</span>
                                  <span className="text-[10px] text-slate-405 font-mono mt-0.5">Ref: {data.range}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Direct Consultation Link */}
                          <div className="p-5 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-slate-200/60 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="space-y-1 text-center sm:text-left">
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-mint">Biomarker Consultation</span>
                              <p className="text-xs text-slate-655 dark:text-zinc-300 leading-relaxed font-semibold">
                                Share these extracted biomarkers directly with Dr. Jethwani on WhatsApp to map constitutional homeopathic therapeutics.
                              </p>
                            </div>
                            <a
                              href={getWhatsAppConsultationLink()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all text-center no-underline flex items-center justify-center gap-1.5 shrink-0"
                            >
                              <MessageSquare className="w-4 h-4" />
                              WhatsApp Dr. Jethwani
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Laboratory Report Upload & Parser Segment */}
                          <div ref={labUploadCardRef} className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 shadow-sm space-y-4">
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
                                id="lab-upload-input-2" 
                                className="hidden" 
                                onChange={handleFileChange} 
                                accept="image/*,application/pdf"
                              />
                              <label htmlFor="lab-upload-input-2" className="cursor-pointer space-y-3 block">
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
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT: BIOLOGICAL AGE CLOCK */}
                  {dashboardTab === "bioage" && (
                    <div className="space-y-8">
                      {digitalTwin.biologicalAge ? (
                        <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 space-y-6">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850/80 pb-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-mint bg-mint/5 px-2.5 py-1 rounded-full">
                                Longevity Clock Calibrated
                              </span>
                              <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                Epigenetic Age Diagnostics
                              </h3>
                            </div>
                            <button 
                              onClick={() => handleSelectProfile("biological_age")}
                              className="py-2 px-3 border border-violet-250 dark:border-violet-900/30 text-violet-500 hover:bg-violet-500/10 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              Recalibrate Clock
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {/* Dial gauge comparing Chronological Age and Biological Age */}
                            <div className="flex flex-col items-center text-center justify-center p-4 bg-slate-50/40 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 rounded-2xl">
                              <div className="relative w-40 h-40 flex items-center justify-center">
                                {/* Simple visual age gauge circles */}
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="40" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                                  <circle 
                                    cx="50" cy="50" r="40" 
                                    className="stroke-violet-500 fill-none" 
                                    strokeWidth="6"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * (digitalTwin.biologicalAge.wellnessIndex)) / 100}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-4xl font-serif font-black text-slate-900 dark:text-white font-mono">{digitalTwin.biologicalAge.bioAge}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bio Age Yrs</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex gap-6 text-xs font-bold text-slate-500">
                                <div>Chronological: <span className="text-slate-800 dark:text-zinc-200 font-mono">{digitalTwin.biologicalAge.chronologicalAge} yrs</span></div>
                                <div>Offset: <span className="text-emerald-500 font-mono">-{digitalTwin.biologicalAge.chronologicalAge - digitalTwin.biologicalAge.bioAge} yrs</span></div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="p-4 bg-violet-50/10 dark:bg-violet-950/5 border border-violet-200/20 rounded-2xl space-y-2">
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-500 block">Longevity Insights</span>
                                <p className="text-xs text-slate-655 dark:text-zinc-300 leading-relaxed font-semibold">
                                  Your cell oxidation rate indicates a <strong>{digitalTwin.biologicalAge.longevityScore}% Longevity Score</strong> and a <strong>{digitalTwin.biologicalAge.lifestyleRiskIndex} Risk Index</strong>. Cellular senescence matches a younger profile, reflecting slow biological aging.
                                </p>
                              </div>

                              <div className="p-4 bg-emerald-50/15 dark:bg-emerald-950/5 border border-emerald-200/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
                                <p className="text-[10.5px] text-slate-500 leading-normal">
                                  Consult Dr. Jethwani on WhatsApp to map constitutional homeopathic therapeutics designed to maintain or improve cell reserve index.
                                </p>
                                <a 
                                  href={getWhatsAppConsultationLink()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm text-center transition-all no-underline flex items-center gap-1.5 shrink-0"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Discuss Clock
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 text-center space-y-5 max-w-lg mx-auto">
                          <div className="w-16 h-16 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center mx-auto">
                            <Flame className="w-8 h-8 animate-pulse text-violet-500" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                              Epigenetic Longevity Clock
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
                              Calculate your cellular age compared to chronological age. The algorithm maps hand skin elasticity return speed, breath hold capacities, cardiovascular recovery, and nutritional oxidation loads.
                            </p>
                          </div>
                          <button 
                            onClick={() => handleSelectProfile("biological_age")}
                            className="py-3 px-6 bg-violet-500 hover:bg-violet-650 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer border-none transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto active:scale-98"
                          >
                            <Play className="w-4 h-4" />
                            Calibrate Biological Age Clock
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT: ASSESSMENTS DIRECTORY */}
                  {dashboardTab === "directory" && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Clinical Intelligence Accordion Domains
                      </span>

                      <div className="space-y-3.5">
                        {ASSESSMENT_CATEGORIES.map(category => {
                          const isExpanded = expandedCategory === category.id;
                          const subAssessments = ASSESSMENT_PROFILES.filter(p => p.category === category.id);
                          
                          return (
                            <div 
                              key={category.id} 
                              className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/80 dark:bg-slate-900/70 rounded-3xl overflow-hidden shadow-sm transition-all"
                            >
                              {/* Accordion trigger */}
                              <button
                                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 dark:text-zinc-100 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all border-none bg-transparent cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="p-2 bg-mint/10 rounded-xl text-mint">
                                    <Sliders className="w-4 h-4" />
                                  </span>
                                  <div>
                                    <span className="font-serif text-sm md:text-base font-bold text-slate-900 dark:text-white block">
                                      {category.name}
                                    </span>
                                    <span className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider block">
                                      {subAssessments.length} assessments
                                    </span>
                                  </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                              </button>

                              {/* Accordion content grid */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-slate-100 dark:border-slate-850/80 overflow-hidden"
                                  >
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30 dark:bg-slate-950/10">
                                      {subAssessments.map(profile => {
                                        const isCompleted = !!digitalTwin.completedAssessments[profile.id];
                                        const lastScore = digitalTwin.completedAssessments[profile.id]?.score;
                                        
                                        return (
                                          <div
                                            key={profile.id}
                                            onClick={() => handleSelectProfile(profile.id)}
                                            className={`border border-slate-150 dark:border-slate-850/80 p-4.5 rounded-2xl flex flex-col justify-between h-[155px] bg-white dark:bg-slate-900/60 hover:-translate-y-0.5 hover:shadow transition-all duration-300 cursor-pointer ${profile.gradient}`}
                                          >
                                            <div className="space-y-1.5">
                                              <div className="flex justify-between items-center">
                                                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${profile.badgeBg}`}>
                                                  Evaluation
                                                </span>
                                                {isCompleted && (
                                                  <span className="font-mono text-[9px] font-bold text-mint bg-mint/5 px-2 py-0.5 rounded">
                                                    Score: {lastScore}%
                                                  </span>
                                                )}
                                              </div>
                                              <h5 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-100 leading-tight">
                                                {profile.name}
                                              </h5>
                                              <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                                                {profile.description}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-mint group">
                                              {isCompleted ? "Re-evaluate" : "Run assessment"}
                                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

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
                  {(() => {
                    const hasBmiStep = selectedProfile.id === "metabolic_profile";
                    const totalStepsForProgress = selectedProfile.questions.length + (hasBmiStep ? 2 : 1);
                    const isQuestionsPhase = currentStep < selectedProfile.questions.length;
                    const isBmiStep = hasBmiStep && currentStep === selectedProfile.questions.length;
                    const isSymptomsPhase = hasBmiStep 
                      ? currentStep === selectedProfile.questions.length + 1 
                      : currentStep === selectedProfile.questions.length;

                    // Compute BMI values (metric format)
                    const height = answers.height !== undefined ? Number(answers.height) : 170;
                    const weight = answers.weight !== undefined ? Number(answers.weight) : 70;
                    const bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));

                    return (
                      <>
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-mint bg-mint/5 px-2.5 py-1 rounded-full">
                            Step {currentStep + 1} of {totalStepsForProgress}
                          </span>
                          <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                            {selectedProfile.name}
                          </h3>
                        </div>

                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="bg-mint h-full transition-all duration-300"
                            style={{ width: `${((currentStep) / totalStepsForProgress) * 100}%` }}
                          ></div>
                        </div>

                        {isQuestionsPhase && (
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
                        )}

                        {isBmiStep && (
                          <div className="space-y-6 py-4 animate-fadeIn">
                            <div className="space-y-1">
                              <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-mint" />
                                Body Mass Index (BMI) Calculator
                              </h4>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                Input your height and weight to calculate your BMI and determine clinical weight status.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-850 rounded-2xl">
                              {/* Height Input */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Height</label>
                                  <span className="font-mono text-xs font-bold text-mint bg-mint/5 px-2 py-0.5 rounded">{height} cm</span>
                                </div>
                                <input 
                                  type="range"
                                  min="100"
                                  max="220"
                                  value={height}
                                  onChange={(e) => handleInputChange("height", Number(e.target.value))}
                                  className="w-full accent-mint"
                                />
                                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                  <span>100 cm</span>
                                  <span>220 cm</span>
                                </div>
                              </div>

                              {/* Weight Input */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Weight</label>
                                  <span className="font-mono text-xs font-bold text-mint bg-mint/5 px-2 py-0.5 rounded">{weight} kg</span>
                                </div>
                                <input 
                                  type="range"
                                  min="30"
                                  max="180"
                                  value={weight}
                                  onChange={(e) => handleInputChange("weight", Number(e.target.value))}
                                  className="w-full accent-mint"
                                />
                                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                  <span>30 kg</span>
                                  <span>180 kg</span>
                                </div>
                              </div>
                            </div>

                            {/* BMI Output Card */}
                            {(() => {
                              let statusColor = "text-emerald-500 dark:text-emerald-400";
                              let statusBg = "bg-emerald-500/10 border-emerald-500/20";
                              let statusLabel = "Optimal Weight";
                              let statusDesc = "Your weight falls in the healthy, optimal range. This minimizes cardiovascular load and metabolic strain.";
                              let gaugeOffset = 0;

                              if (bmi < 18.5) {
                                statusColor = "text-amber-500 dark:text-amber-400";
                                statusBg = "bg-amber-500/10 border-amber-500/20";
                                statusLabel = "Underweight";
                                statusDesc = "Your weight is below the standard healthy range. This may suggest nutritional assimilation deficits.";
                                gaugeOffset = Math.max(0, Math.min(25, ((bmi - 10) / 8.5) * 25));
                              } else if (bmi <= 24.9) {
                                statusLabel = "Optimal Weight";
                                statusColor = "text-emerald-500 dark:text-emerald-400";
                                statusBg = "bg-emerald-500/10 border-emerald-500/20";
                                statusDesc = "Your weight falls in the healthy, optimal range. This minimizes cardiovascular load and metabolic strain.";
                                gaugeOffset = 25 + ((bmi - 18.5) / 6.4) * 25;
                              } else if (bmi <= 29.9) {
                                statusLabel = "Overweight";
                                statusColor = "text-orange-500 dark:text-orange-400";
                                statusBg = "bg-orange-500/10 border-orange-500/20";
                                statusDesc = "Your weight is slightly elevated. Consider lifestyle adjustments to reduce metabolic congestion.";
                                gaugeOffset = 50 + ((bmi - 25) / 4.9) * 25;
                              } else {
                                statusLabel = "Obese";
                                statusColor = "text-rose-500 dark:text-rose-450";
                                statusBg = "bg-rose-500/10 border-rose-500/20";
                                statusDesc = "Your weight is significantly elevated, pointing to metabolic stress and increased visceral organ loading.";
                                gaugeOffset = 75 + Math.min(25, ((bmi - 30) / 15) * 25);
                              }

                              return (
                                <div className="space-y-4 p-5 border border-slate-200/60 dark:border-slate-850 rounded-2xl bg-white dark:bg-slate-900/60 shadow-inner">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">Calculated BMI</span>
                                      <span className="font-serif text-3xl font-black text-slate-900 dark:text-white">{bmi}</span>
                                    </div>
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${statusBg} ${statusColor}`}>
                                      {statusLabel}
                                    </span>
                                  </div>

                                  {/* Gauge Bar */}
                                  <div className="space-y-1.5 pt-2">
                                    <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-visible flex">
                                      <div className="h-full w-[25%] bg-amber-450/30 rounded-l-full border-r border-slate-200/30" />
                                      <div className="h-full w-[25%] bg-emerald-450/30 border-r border-slate-200/30" />
                                      <div className="h-full w-[25%] bg-orange-450/30 border-r border-slate-200/30" />
                                      <div className="h-full w-[25%] bg-rose-450/30 rounded-r-full" />

                                      {/* Indicator pointer */}
                                      <div 
                                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-white border-[2.5px] border-mint rounded-full shadow transition-all duration-300 flex items-center justify-center"
                                        style={{ left: `${gaugeOffset}%` }}
                                      >
                                        <div className="w-1.5 h-1.5 bg-mint rounded-full" />
                                      </div>
                                    </div>
                                    <div className="flex justify-between text-[8px] text-slate-450 font-bold uppercase tracking-wider px-0.5">
                                      <span>Under</span>
                                      <span>Optimal</span>
                                      <span>Over</span>
                                      <span>Obese</span>
                                    </div>
                                  </div>

                                  <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 leading-relaxed pt-1">
                                    {statusDesc}
                                  </p>
                                </div>
                              );
                            })()}

                            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                              <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="py-3 px-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-650 dark:text-zinc-400 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                              >
                                Back
                              </button>
                              <button
                                onClick={() => {
                                  handleInputChange("height", height);
                                  handleInputChange("weight", weight);
                                  handleInputChange("bmi", bmi);
                                  setCurrentStep(currentStep + 1);
                                }}
                                className="flex-1 py-3.5 bg-mint hover:bg-teal-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer border-none shadow-sm flex items-center justify-center gap-1.5"
                              >
                                Save & Proceed
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {isSymptomsPhase && (
                          <div className="space-y-6 py-4 animate-fadeIn">
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
                                className="py-3 px-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-zinc-400 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
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

                        {isQuestionsPhase && (
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
                            <span>Step {currentStep + 1} of {totalStepsForProgress}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </motion.div>
              )}



              {/* VIEW: LAB REPORT OCR ANALYSIS RESULTS */}
              {activeView === "lab_upload" && labResult && (
                <motion.div
                  ref={labResultsRef}
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
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450" 
                                  : data.status === "Elevated" 
                                    ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450" 
                                    : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450"
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
                        Recommended Follow-ups & Related Assessments:
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
                  <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl flex flex-col md:flex-row justify-between items-center gap-5">
                    <p className="text-xs text-teal-100 max-w-md">
                      These biomarkers suggest subclinical pathways. A comprehensive homeopathic diagnostic session with Dr. Jethwani will map constitutional remedies to restore normal ranges.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                      <a
                        href={getWhatsAppConsultationLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm text-center transition-all no-underline flex items-center justify-center gap-1.5"
                      >
                        WhatsApp Dr. Jethwani
                      </a>
                      <Link
                        href="https://homeo.healthcare/#booking"
                        className="py-3 px-5 bg-white text-teal-700 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm text-center transition-all flex items-center justify-center"
                      >
                        Book Calendar
                      </Link>
                    </div>
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
                      
                      <div className="space-y-4">
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

                  {/* ========================================================= */}
                  {/* PRIORITY 8: CONDITION & TREATMENT LINKING (INTERNAL LINKS) */}
                  {/* ========================================================= */}
                  <div className="glass-panel border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/65 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 flex items-center gap-1.5">
                      <ShieldCheck className="w-5 h-5 text-mint" />
                      Clinically Related Resources
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      Explore our evidence-based clinical articles, treatment pathways, and blog posts matching your stress pattern indicators.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Related Conditions */}
                      <div className="space-y-2">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-450 block">Related Conditions:</span>
                        <div className="space-y-1.5">
                          {relatedContent.conditions.map((item, i) => (
                            <Link 
                              key={i} 
                              href={item.url}
                              className="text-xs font-bold text-mint hover:text-teal-600 block transition-all hover:translate-x-0.5"
                            >
                              • {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Related Treatments */}
                      <div className="space-y-2">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-450 block">Related Treatments:</span>
                        <div className="space-y-1.5">
                          {relatedContent.treatments.map((item, i) => (
                            <Link 
                              key={i} 
                              href={item.url}
                              className="text-xs font-bold text-mint hover:text-teal-600 block transition-all hover:translate-x-0.5"
                            >
                              • {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Related Blogs */}
                      <div className="space-y-2">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-450 block">Related Medical Blogs:</span>
                        <div className="space-y-1.5">
                          {relatedContent.blogs.map((item, i) => (
                            <Link 
                              key={i} 
                              href={item.url}
                              className="text-xs font-bold text-mint hover:text-teal-600 block transition-all hover:translate-x-0.5"
                            >
                              • {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Related Protocols */}
                      <div className="space-y-2">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-450 block">Clinical Protocols:</span>
                        <div className="space-y-1.5">
                          {relatedContent.protocols.map((item, i) => (
                            <Link 
                              key={i} 
                              href={item.url}
                              className="text-xs font-bold text-mint hover:text-teal-600 block transition-all hover:translate-x-0.5"
                            >
                              • {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Related assessments recommendations */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4.5 space-y-2.5">
                      <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block">Recommended Next Assessments:</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getSuggestedNextAssessments().map(nextProf => (
                          <button
                            key={nextProf.id}
                            onClick={() => handleSelectProfile(nextProf.id)}
                            className="p-3 border border-slate-150 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-mint hover:bg-mint/5 rounded-xl text-[11px] font-bold text-slate-650 dark:text-zinc-350 cursor-pointer transition-all flex items-center justify-between text-left"
                          >
                            <span>{nextProf.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-mint" />
                          </button>
                        ))}
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

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => { setActiveView("dashboard"); setSelectedProfileId(null); setAnswers({}); }}
                        className="py-3 px-5 text-slate-500 hover:text-slate-750 font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer border-none bg-transparent"
                      >
                        Dashboard
                      </button>
                      
                      <a
                        href={getWhatsAppConsultationLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer shadow-sm text-center transition-all no-underline flex items-center justify-center gap-1 active:scale-98"
                      >
                        WhatsApp Review
                      </a>

                      <Link
                        href="https://homeo.healthcare/#booking"
                        className="py-3 px-6 bg-mint hover:bg-teal-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider cursor-pointer shadow-sm text-center transition-all flex items-center gap-1 active:scale-98"
                      >
                        Book Consultation
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

      {/* Fullscreen AI Health Companion Overlay */}
      {mounted && createPortal(
        <AnimatePresence>
          {isTopAssistantOpen && isTopAssistantFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-6"
              onClick={() => setIsTopAssistantFullscreen(false)}
              data-lenis-prevent="true"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-7xl h-[90vh] flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
              >
                {renderCompanionContent(true)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

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
