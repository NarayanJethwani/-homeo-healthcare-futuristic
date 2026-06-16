"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Brain, HelpCircle, Calendar, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HealthDigitalTwin } from "./types";
import MarkdownRenderer from "./MarkdownRenderer";

interface HealthAssistantProps {
  twin: HealthDigitalTwin;
  theme: "light" | "dark";
  onSelectProfile: (id: string) => void;
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

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

export default function HealthAssistant({ twin, theme, onSelectProfile }: HealthAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "Hello! 🌟 I'm your AI Health Companion, but you can think of me as your personal health partner and dedicated wellness guide. I'm here to walk alongside you, make sense of your assessments, and help you find pathways to balance. What wellness goals can we explore together today? 🍃"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { sender: "user", text: textToSend };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs, twin })
      });
      const data = await res.json();
      
      if (data.success && data.text) {
        setMessages(prev => [...prev, { sender: "assistant", text: data.text }]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.error("Failed to query Gemini assistant api, falling back to local reasoning:", err);
    }

    // Local/Fallback reasoning logic in case of failure or missing API key
    const reply = getLocalFallbackResponse(textToSend, twin);

    setMessages(prev => [...prev, { sender: "assistant", text: reply }]);
    setIsTyping(false);
  };

  const getWhatsAppLink = () => {
    let message = "Hello Dr. Jethwani, I completed my Health Intelligence assessment and would like to book a consultation.\n\n";
    message += `Overall Health Score: ${twin.overallScore}%\n`;
    if (twin.biologicalAge) {
      message += `Biological Age: ${twin.biologicalAge.bioAge} years (Chronological: ${twin.biologicalAge.chronologicalAge})\n`;
    }
    const completedKeys = Object.keys(twin.completedAssessments || {});
    if (completedKeys.length > 0) {
      message += "\nCompleted Assessments:\n";
      completedKeys.forEach(cat => {
        const item = twin.completedAssessments[cat];
        message += `- ${cat.toUpperCase()}: Score ${item.score}%\n`;
      });
    }
    return `https://wa.me/918446056789?text=${encodeURIComponent(message)}`;
  };

  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };

  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-[340px] md:w-[380px] h-[520px] rounded-[28px] border shadow-2xl flex flex-col justify-between overflow-hidden mb-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/80 dark:border-slate-800`}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 animate-pulse text-teal-200" />
                <div>
                  <h4 className="text-xs font-bold font-sans">AI Health Companion</h4>
                  <p className="text-[8.5px] text-teal-150 uppercase tracking-widest font-black leading-none">Homeo Healthcare</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer border-none"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* WhatsApp Doctor CTA Banner */}
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2.5 flex justify-between items-center gap-2">
              <span className="text-[9.5px] text-emerald-800 dark:text-emerald-350 font-bold leading-normal">
                Want Dr. Jethwani to review your digital health twin?
              </span>
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all no-underline shrink-0 text-center shadow-sm active:scale-95"
              >
                Chat on WA
              </a>
            </div>

            {/* Chat Body */}
            <div 
              ref={chatContainerRef} 
              data-lenis-prevent="true"
              className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-zinc-200 rounded-tr-none border border-slate-200/50 dark:border-slate-800"
                        : "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-slate-800 dark:text-zinc-200 rounded-tl-none"
                    }`}
                  >
                    <MarkdownRenderer text={msg.text} onActionClick={(action) => handleSend(action)} />
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/10 rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-wrap gap-1.5 shrink-0">
              <button 
                onClick={() => handleQuickQuestion("Help me understand my health scores in simple terms")}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[9.5px] text-slate-650 dark:text-zinc-350 cursor-pointer font-bold transition-all"
              >
                📊 Simple Score Summary
              </button>
              <button 
                onClick={() => handleQuickQuestion("I feel tired/stressed lately, what should I do next?")}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[9.5px] text-slate-650 dark:text-zinc-350 cursor-pointer font-bold transition-all"
              >
                🛌 Tired/Stressed Check-in
              </button>
              <button 
                onClick={() => handleQuickQuestion("How can I restore balance using my homeopathic constitutional match?")}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[9.5px] text-slate-650 dark:text-zinc-350 cursor-pointer font-bold transition-all"
              >
                ✨ Constitutional Remedy Guide
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
                placeholder="Ask your clinical question here..."
                className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-mint focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-zinc-100"
              />
              <button
                onClick={() => handleSend(input)}
                className="p-2.5 bg-mint hover:bg-mint-dark text-white rounded-xl cursor-pointer flex items-center justify-center border-none shadow-sm active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full shadow-lg shadow-teal-500/20 cursor-pointer border-none flex items-center justify-center relative group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm whitespace-nowrap">
          AI Companion
        </span>
      </motion.button>
      
    </div>
  );
}
