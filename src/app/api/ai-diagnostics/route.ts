import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getKnowledgeGraph } from "@/lib/knowledgeGraph";
import { MASTER_REMEDY_DB } from "@/lib/materiaMedicaDb";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

function findRemedyInDb(queryName: string): any {
  if (!queryName) return null;
  const q = queryName.trim().toLowerCase();
  
  // 1. Match by exact abbreviation or name
  let match = MASTER_REMEDY_DB.find(
    (r) => r.identity.abbreviation.toLowerCase() === q || r.identity.name.toLowerCase() === q
  );
  if (match) return match;

  // 2. Match by id (e.g. "rem_sulphur" for "Sulphur" or "Sulph")
  const idToTry = `rem_${q.replace(/[^a-z0-9]/g, "")}`;
  match = MASTER_REMEDY_DB.find((r) => r.id.toLowerCase() === idToTry);
  if (match) return match;

  // 3. Match by name substring
  match = MASTER_REMEDY_DB.find(
    (r) => r.identity.name.toLowerCase().includes(q) || q.includes(r.identity.name.toLowerCase())
  );
  if (match) return match;

  return null;
}

export function compileLocalSynthesisResponse(taskType: string, body: any): any {
  const patientName = body?.patientInfo?.name || body?.patientName || "Patient";
  const age = body?.patientInfo?.age || body?.age || "35";
  const gender = body?.patientInfo?.gender || body?.gender || "Male";
  const complaint = body?.patientInfo?.complaint || body?.complaint || "Chronic complaints";

  if (taskType === "clinical_reasoning") {
    const rubrics = body?.rubrics || [];
    const mainRemedy = body?.repertorizationResults?.[0]?.remedyName || "Sulphur";
    const secondaryRemedy = body?.repertorizationResults?.[1]?.remedyName || "Lycopodium";
    
    const thermals = rubrics.some((r: any) => r.name.toLowerCase().includes("warm") || r.name.toLowerCase().includes("heat")) ? "Warm-blooded" : "Chilly";
    const hasSkin = rubrics.some((r: any) => r.chapter.toLowerCase().includes("skin") || r.name.toLowerCase().includes("skin") || r.name.toLowerCase().includes("itching"));
    const hasDigestive = rubrics.some((r: any) => r.chapter.toLowerCase().includes("stomach") || r.chapter.toLowerCase().includes("abdomen") || r.name.toLowerCase().includes("flatulence") || r.name.toLowerCase().includes("bloat"));
    const hasMind = rubrics.some((r: any) => r.chapter.toLowerCase().includes("mind") || r.name.toLowerCase().includes("anxiety") || r.name.toLowerCase().includes("fear"));

    const systems: string[] = [];
    if (hasSkin) systems.push("Integumentary System");
    if (hasDigestive) systems.push("Gastrointestinal System");
    if (hasMind) systems.push("Nervous System (Autonomic)");
    if (systems.length === 0) systems.push("Constitutional / Systemic Regulation");

    const patterns: string[] = [];
    if (hasSkin) patterns.push("Dermal Inflammatory Reactivity with Suppression Risk");
    if (hasDigestive) patterns.push("Functional Gastric Dysmotility & Visceral Hypersensitivity");
    if (hasMind) patterns.push("Sympathetic Nervous Overdrive with Health Anticipation");
    if (patterns.length === 0) patterns.push("Functional Somatic Energy Stagnation");

    return {
      success: true,
      isMock: true,
      analysis: {
        clinical_reasoning_v2: {
          constitutional_interpretation: `A ${age}-year-old ${gender} presenting with ${complaint || "chronic functional symptoms"}. Constitutional profile suggests a reactive state matching the ${thermals.toLowerCase()} axis with sensitivity to environmental changes.`,
          etiological_analysis: `Pathology represents a classic inward shift of functional disturbances. Chronicity aggravated by nervous tension and susceptibility to external stressors.`,
          miasmatic_analysis_summary: `Predominantly Psoric hypersensitivity (${hasSkin ? "itching and sensory reactivity" : "functional irritations"}), with secondary Sycotic retention (${hasDigestive ? "flatulence and bloating" : "chronic tissue slow down"}).`,
          affected_organ_systems: systems,
          probable_clinical_patterns: patterns,
          differential_diagnoses: [
            `${mainRemedy} (Indicated by primary symptom coverage and physical generals)`,
            `${secondaryRemedy} (Indicated by secondary modalities but lacks the primary thermal agreement)`,
            "Arsenicum Album (Ruled out unless restlessness and midnight aggravation dominate)"
          ],
          remedy_justification: `Prescription of ${mainRemedy} is justified by its high coverage of the patient's symptoms (${rubrics.slice(0, 3).map((r: any) => r.name).join(", ")}) and matching thermal affinity.`,
          remedy_rejection_logic: `${secondaryRemedy} is deferred to a secondary tier as it does not align with the patient's key modal triggers or thermal axis.`,
          confirmation_questions: [
            `Do you experience worsening of ${complaint || "symptoms"} at any specific hour of the day?`,
            `How does fresh open air affect your energy and comfort levels?`
          ],
          clinical_red_flags: [
            "Development of severe breathing difficulty or asthma-like symptoms",
            "Rapid, unexplained weight loss or significant loss of appetite",
            "Onset of deep clinical depression or suicidal feelings"
          ]
        },
        clinical_hypothesis_engine: [
          {
            condition: hasSkin ? "Atopic Dermatitis (Eczema)" : hasDigestive ? "Irritable Bowel Syndrome (IBS)" : "Generalized Anxiety Disorder / Autonomic Dysregulation",
            likelihood: hasSkin ? 85 : hasDigestive ? 80 : 75,
            supporting_findings: [
              `Age 34, chief complaint of ${complaint}`,
              `Thermal axis: ${thermals}`,
              ...(hasSkin ? ["Somatic dermatological symptoms"] : []),
              ...(hasDigestive ? ["Gastrointestinal bloating/flatulence"] : [])
            ],
            missing_findings: [
              hasSkin ? "IgE levels, detailed history of contact irritants" : hasDigestive ? "Stool culture, lactose intolerance test" : "Adrenal stress profile, serum electrolytes"
            ],
            suggested_investigations: [
              hasSkin ? "Complete Blood Count (CBC) with absolute eosinophil count, IgE" : hasDigestive ? "Celiac disease panel, abdominal ultrasound" : "TSH thyroid screen, fasting cortisol"
            ]
          }
        ]
      }
    };
  }

  if (taskType === "clinical_conference") {
    const rubrics = body?.rubrics || [];
    const mainRemedy = body?.repertorizationResults?.[0]?.remedyName || "Sulphur";
    const secondaryRemedy = body?.repertorizationResults?.[1]?.remedyName || "Lycopodium";
    const thirdRemedy = body?.repertorizationResults?.[2]?.remedyName || "Nux Vomica";

    const hasSkin = rubrics.some((r: any) => r.chapter?.toLowerCase().includes("skin") || r.name?.toLowerCase().includes("skin") || r.name?.toLowerCase().includes("itching"));
    const hasDigestive = rubrics.some((r: any) => r.chapter?.toLowerCase().includes("stomach") || r.chapter?.toLowerCase().includes("abdomen") || r.name?.toLowerCase().includes("flatulence") || r.name?.toLowerCase().includes("bloat"));

    const miasm = hasSkin ? "Psora" : (hasDigestive ? "Sycosis" : "Tubercular");
    const constitutional = hasSkin ? "Warm-blooded Psoric" : (hasDigestive ? "Chilly Sycotic" : "Warm-blooded Tubercular");

    return {
      success: true,
      isMock: true,
      analysis: {
        clinical_conference: {
          gemini: {
            analysis: `Based on a classical synthesis of the case, I recommend ${mainRemedy}. The patient's constitutional profile shows deep susceptibility matching the ${miasm} miasmatic dynamics. The primary focus should be on systemic regulation and addressing the mental-emotional core of anxiety and anticipation.`,
            remedy: mainRemedy,
            miasm: miasm,
            constitutional_type: constitutional,
            differential_diagnosis: `Differentiated from ${secondaryRemedy} due to primary thermal modalities and the absence of late-afternoon aggravations.`,
            clinical_pattern: "Systemic constitutional dysregulation with reactive nervous exhaustion.",
            confidence: 88
          },
          qwen: {
            analysis: `Analyzing the physical keynotes and modalities, I agree that ${mainRemedy} is the primary simillimum, but we must closely watch ${secondaryRemedy} if there is any gastrointestinal bloating or 4-8 PM aggravation. The thermal modality of open-air amelioration is a major keynote indicator for the patient.`,
            remedy: mainRemedy,
            miasm: miasm,
            constitutional_type: constitutional,
            differential_diagnosis: `We must rule out ${thirdRemedy} because the patient lacks the extreme sensitivity to drafts and cold characteristic of that remedy.`,
            clinical_pattern: "Functional organ hyper-reactivity aggravated by warmth and rest.",
            confidence: 82
          },
          deepseek: {
            analysis: `From a miasmatic and pathological standpoint, this case shows a strong ${miasm} layer, likely triggered by suppressed dermal or emotional conditions in the past. Recommending ${mainRemedy} in a moderate potency (30C or 200C) to safely initiate healing without triggering violent aggravations. If a secondary sycotic layer emerges, ${secondaryRemedy} should follow.`,
            remedy: mainRemedy,
            miasm: miasm,
            constitutional_type: constitutional,
            differential_diagnosis: `${mainRemedy} corresponds to the acute reactive layer, while Lycopodium corresponds to the deep-seated metabolic weakness.`,
            clinical_pattern: "Miasmatic blockage preventing complete resolution of functional symptoms.",
            confidence: 91
          },
          consensus: {
            remedy: mainRemedy,
            miasm: miasm,
            constitutional_type: constitutional,
            differential_diagnosis: `Primary agreement on ${mainRemedy}. Differential focus remains on Lycopodium and Arsenicum Album.`,
            clinical_pattern: `Holistic dysregulation of the ${hasSkin ? "dermal-integumentary" : (hasDigestive ? "gastrointestinal" : "autonomic nervous")} system.`,
            agreement_percentage: 95,
            confidence_percentage: 87,
            conflict_alerts: [
              `Thermal modality verification: Dr. Qwen reports a potential contradiction if patient is chilly, since ${mainRemedy} is predominantly warm-blooded.`,
              "Potency conflict: Dr. Gemini recommends 200C for nervous system symptoms, while Dr. DeepSeek cautions and prefers 30C."
            ],
            areas_of_agreement: [
              `Agreement on the primary role of ${mainRemedy} for the chief symptoms of ${complaint}.`,
              "Agreement on the psoric-sycotic miasmatic classification of the current active layer."
            ],
            areas_of_disagreement: [
              `Potency selection (30C vs 200C vs LM potencies).`,
              "Differentiating whether Lycopodium is currently active as a secondary layer."
            ],
            missing_data: [
              "Detailed thermal reaction: open air vs warm room effects.",
              "Aggravation timeline: exact time of day symptoms worsen.",
              "Thirst pattern: thirst vs thirstless state during peak aggravation."
            ],
            confirmation_questions: [
              "Are your symptoms significantly worse in a warm, closed room compared to fresh open air?",
              "Do you notice an increase in gas, bloating, or fatigue between 4 PM and 8 PM?",
              "Do you prefer ice-cold drinks or warm beverages when feeling unwell?"
            ],
            citations: [
              `Kent's Repertory, Mind - Anxiety: ${mainRemedy} (p. 6)`,
              `Boericke's Materia Medica, ${mainRemedy} - Generalities & Modalities: (p. 574)`,
              `Allen's Keynotes, ${mainRemedy} - Skin & Digestive symptoms: (p. 238)`
            ],
            reasoning_chain: `Dr. Gemini initiated the discussion by presenting ${mainRemedy} as the constitutional simillimum. Dr. Qwen seconded, highlighting the physical keynote correlations with rubrics. Dr. DeepSeek refined the analysis by highlighting the anti-miasmatic path, warning about possible aggravations and proposing a conservative potency strategy.`,
            report: `Virtual Consultation Consensus Report\nPatient: ${patientName} (${age}yo ${gender})\n\nThe panel convened and reviewed the active repertorial rubrics and chief complaint (${complaint}).\n\nThere is clear consensus that ${mainRemedy} is the primary indicated remedy for the current active symptom layer. The underlying miasm is determined to be predominantly ${miasm}. The panel recommends starting with ${mainRemedy} 30C, single dose, and monitoring the patient's symptoms for 14 days.\n\nClinician next steps:\n1. Ask the patient the conflict resolution questions regarding thermal and time modalities.\n2. Verify the presence of any suppressive skin treatments in the patient's history.\n3. Dispense ${mainRemedy} 30C if modalities confirm.`
          }
        }
      }
    };
  }

  if (taskType === "intake") {
    const thermals = body?.thermalGenerals || "Unspecified thermal profile";
    const mentals = body?.mentalProfile || "Unspecified mental/emotional state";
    const suppression = body?.suppressionHistory || "No suppression history noted";

    return {
      success: true,
      isMock: true,
      analysis: {
        symptom_synthesis: {
          chief_complaint_analysis: `Chronic manifestation of ${complaint} in a ${age}-year-old ${gender}. Symptoms show a gradual onset with marked functional disturbances.`,
          hpi_timeline: `Onset traced back 6-12 months following a period of high emotional stress and physical fatigue. Symptoms are intermittent but progressive. Suppression history: ${suppression}.`,
          constitutional_tendencies: `Constitutional profile indicates sensitivity aligned with: ${thermals}. Psoric-dominated reaction capacity.`,
          emotional_triggers: `Stress and anxiety profile: ${mentals}. Suppression history details: ${suppression}.`,
          thermal_axis: `Thermal reaction profile: ${thermals}.`,
          suppression_history: `Prior suppressive history noted: ${suppression}.`
        },
        clinical_recommendations: {
          rubrics_to_consider: [
            `GENERALS - ${thermals.toUpperCase().includes("WARM") ? "WARM" : "COLD"} - agg.`,
            `MIND - ANXIETY - ${mentals.toLowerCase().includes("health") ? "health, about" : "future, about"}`,
            "GENERALS - COLD - damp weather agg.",
            "STOMACH - BLOATING - eating, after"
          ],
          suggested_questions: [
            "Does the patient experience any sudden sinking sensation around 11 AM?",
            "Are the burning sensations worse from the warmth of the bed?",
            "How does the patient feel emotionally when consoled during irritable states?"
          ],
          miasmatic_orientation: "Predominantly Psoric, with active Sycotic layering shown in tissue fluid retention and bloating."
        }
      }
    };
  }

  if (taskType === "diagnostics") {
    const organSystem = body?.organSystem || "All";
    const searchQuery = (body?.searchQuery || "").toLowerCase();
    
    const conditions = [
      {
        condition: "Gastroesophageal Reflux Disease (GERD)",
        organ_system: "Digestive",
        pathophysiology: "Lower esophageal sphincter dysfunction leading to acid regurgitation and burning retrosternal pain.",
        homeopathic_remedies: ["Nux Vomica (spasmodic, worse stimulants)", "Phosphorus (burning, wants cold drinks)", "Lycopodium (bloating, worse 4-8 PM)", "Carbo Veg (gas, wants air)"],
        grade_of_match: "High"
      },
      {
        condition: "Irritable Bowel Syndrome (IBS)",
        organ_system: "Digestive",
        pathophysiology: "Gut-brain axis dysregulation, altered motility, and visceral hypersensitivity.",
        homeopathic_remedies: ["Nux Vomica", "Lycopodium", "Argentum Nitricum", "Colocynthis"],
        grade_of_match: "High"
      },
      {
        condition: "Atopic Dermatitis (Eczema)",
        organ_system: "Integumentary",
        pathophysiology: "Epidermal barrier dysfunction with immune dysregulation causing dry, pruritic lesions.",
        homeopathic_remedies: ["Sulphur (burning, worse warmth of bed)", "Graphites (honey-like discharge)", "Mezereum (crusts, burning)", "Psorinum (dirty skin, chilly)"],
        grade_of_match: "High"
      },
      {
        condition: "Generalized Anxiety Disorder (GAD)",
        organ_system: "Nervous",
        pathophysiology: "Hyperactive amygdala and dysregulated neurotransmitter pathways causing chronic anticipatory anxiety.",
        homeopathic_remedies: ["Arsenicum Album (restless, chilly)", "Gelsemium (paralyzed by fear)", "Argentum Nitricum (hurried)", "Aconite (panic)"],
        grade_of_match: "High"
      },
      {
        condition: "Hypothyroidism",
        organ_system: "Endocrine",
        pathophysiology: "Autoimmune destruction (Hashimoto's) or thyroid insufficiency leading to metabolic slowing.",
        homeopathic_remedies: ["Calcarea Carbonica (chilly, sluggish)", "Thyroidinum (metabolic support)", "Lycopodium", "Graphites"],
        grade_of_match: "Moderate"
      }
    ];

    const filtered = conditions.filter(c => {
      const matchOrgan = organSystem === "All" || c.organ_system.toLowerCase() === organSystem.toLowerCase();
      const matchSearch = !searchQuery || c.condition.toLowerCase().includes(searchQuery) || c.pathophysiology.toLowerCase().includes(searchQuery);
      return matchOrgan && matchSearch;
    });

    return {
      success: true,
      isMock: true,
      analysis: {
        matching_conditions: filtered.length > 0 ? filtered : [conditions[0]],
        clinical_notes: `Clinical review recommended for organ system: ${organSystem}. Consider constitutional homeopathic coverage to address the underlying miasm.`
      }
    };
  }

  if (taskType === "analyzer") {
    const rawText = body?.rawText || "Fasting Blood Sugar: 126 mg/dL, HbA1c: 7.8%, Fasting Insulin: 18.2 uIU/mL";
    const rawLower = rawText.toLowerCase();
    const findings: any[] = [];

    // 1. Fasting Blood Sugar
    if (rawLower.includes("sugar") || rawLower.includes("glucose") || rawLower.includes("diabetes") || rawLower.includes("hba1c")) {
      const isHigh = rawLower.includes("126") || rawLower.includes("high") || !rawLower.includes("normal");
      findings.push({
        marker: "Fasting Blood Sugar",
        value: isHigh ? "126 mg/dL" : "85 mg/dL",
        status: isHigh ? "Abnormal" : "Normal",
        severity: isHigh ? "orange" : "green",
        ref_range: "70 - 99 mg/dL",
        patient_percentile: isHigh ? 88 : 45,
        organs: ["endocrine", "cardio", "digestive"],
        clinical_significance: isHigh ? "Elevated fasting blood glucose levels suggest impaired fasting glucose or active Type 2 Diabetes." : "Fasting blood glucose resides in the optimal homeostatic range.",
        why_abnormal: isHigh ? "Insulin resistance in peripheral tissues leads to reduced glucose uptake and elevated circulating sugar." : "Optimal cellular insulin sensitivity and glycogen storage.",
        possible_causes: isHigh ? "Chronic high glycemic index diet, physical inactivity, insulin receptor down-regulation, or high stress load." : "Healthy metabolic regulation and balanced autonomic tone.",
        associated_symptoms: isHigh ? "Increased thirst, frequent urination (especially at night), post-meal sleepiness, or energy crashes." : "Stable energy levels, absence of polyuria or polydipsia.",
        recommended_action: isHigh ? "Limit refined carbohydrates, check fasting insulin to calculate HOMA-IR, and monitor daily glucose." : "Maintain general balanced dietary intake.",
        confidence_score: 95,
        homeopathic_correlation: isHigh ? "Syzygium Jambolanum Q (specific pancreatic regulator), Uranium Nitricum 6C, Phosphoricum Acidum 30C." : "N/A"
      });
    }

    // 2. HbA1c (Glycated Hemoglobin)
    if (rawLower.includes("hba1c") || rawLower.includes("glycated") || rawLower.includes("diabetes")) {
      const isHigh = rawLower.includes("7.8") || rawLower.includes("high") || !rawLower.includes("normal");
      findings.push({
        marker: "Glycated Hemoglobin (HbA1c)",
        value: isHigh ? "7.8%" : "5.4%",
        status: isHigh ? "Abnormal" : "Normal",
        severity: isHigh ? "red" : "green",
        ref_range: "4.0 - 5.6% (Normal), 5.7 - 6.4% (Prediabetes)",
        patient_percentile: isHigh ? 92 : 38,
        organs: ["endocrine", "cardio", "hormonal", "blood"],
        clinical_significance: isHigh ? "HbA1c of 7.8% indicates persistent hyperglycemia over the past 90 days, confirming Type 2 Diabetes." : "Glycemic control is stable and within physiological normal limits.",
        why_abnormal: isHigh ? "High ambient glucose levels result in irreversible non-enzymatic glycosylation of red blood cell hemoglobin." : "No excess glycosylation of hemoglobin observed.",
        possible_causes: isHigh ? "Insulin receptor fatigue, chronic caloric excess, lack of muscle-glycogen depletion." : "Healthy diet and active insulin signaling pathways.",
        associated_symptoms: isHigh ? "Widespread fatigue, slow wound healing, dry skin, burning in feet or neuropathic tingling." : "Vital skin healing, normal nerve sensitivity.",
        recommended_action: isHigh ? "Incorporate high-intensity walking post-meals, strict carbohydrate restriction, and retest in 90 days." : "Routine yearly screening.",
        confidence_score: 98,
        homeopathic_correlation: isHigh ? "Syzygium Jambolanum Q, Gymnema Sylvestre Q, Insulinum 30C." : "N/A"
      });
    }

    // 3. Fasting Insulin
    if (rawLower.includes("insulin") || rawLower.includes("resistance") || rawLower.includes("hba1c")) {
      const isHigh = rawLower.includes("18.2") || rawLower.includes("high") || !rawLower.includes("normal");
      findings.push({
        marker: "Fasting Insulin",
        value: isHigh ? "18.2 uIU/mL" : "5.2 uIU/mL",
        status: isHigh ? "Abnormal" : "Normal",
        severity: isHigh ? "orange" : "green",
        ref_range: "2.0 - 19.6 uIU/mL (Optimal: < 6.0 uIU/mL)",
        patient_percentile: isHigh ? 85 : 30,
        organs: ["endocrine", "hormonal"],
        clinical_significance: isHigh ? "High fasting insulin indicates hyperinsulinemia, the classic marker of active insulin resistance." : "Fasting insulin is optimal, indicating high tissue insulin sensitivity.",
        why_abnormal: isHigh ? "The pancreas over-produces insulin to force glucose into resistant liver and muscle cells." : "Cells respond efficiently to basal insulin releases.",
        possible_causes: isHigh ? "Visceral fat accumulation, constant snacking, lack of intermittent fasting intervals." : "Healthy body composition and balanced macronutrient distribution.",
        associated_symptoms: isHigh ? "Abdominal fat distribution, brain fog, fatigue shortly after eating carbohydrate meals." : "Stable post-meal focus and clean energy patterns.",
        recommended_action: isHigh ? "Implement a 16:8 intermittent fasting protocol, supplement with Chromium/Berberine." : "Continue current healthy lifestyle habits.",
        confidence_score: 92,
        homeopathic_correlation: isHigh ? "Thyroidinum 30C (metabolic stimulant), Lycopodium 30C (flatulence with sugar cravings)." : "N/A"
      });
    }

    // 4. Thyroid Stimulating Hormone (TSH)
    if (rawLower.includes("tsh") || rawLower.includes("thyroid") || rawLower.includes("hypothyroid")) {
      findings.push({
        marker: "Thyroid Stimulating Hormone (TSH)",
        value: "8.4 uIU/mL",
        status: "Abnormal",
        severity: "orange",
        ref_range: "0.45 - 4.5 uIU/mL",
        patient_percentile: 85,
        organs: ["endocrine", "hormonal"],
        clinical_significance: "Mild primary subclinical hypothyroidism. Pituitary gland is over-compensating to stimulate a sluggish thyroid.",
        why_abnormal: "Elevated TSH indicates thyroid gland fatigue requiring increased pituitary signaling.",
        possible_causes: "Hashimoto's autoimmune thyroiditis, chronic severe stress (high cortisol), or mineral depletion (iodine/selenium).",
        associated_symptoms: "Unexplained weight gain, chilly sensation, chronic constipation, dry skin, morning sluggishness.",
        recommended_action: "Test Anti-TPO antibodies, check free T3/T4 levels, avoid goitrogens, and manage adrenal load.",
        confidence_score: 96,
        homeopathic_correlation: "Thyroidinum 30C, Calcarea Carbonica 200C (chilly, sluggish), Bromium 30C."
      });
    }

    // 5. Vitamin D (25-Hydroxy)
    if (rawLower.includes("vitamin d") || rawLower.includes("vit d") || rawLower.includes("deficiency")) {
      findings.push({
        marker: "Vitamin D (25-Hydroxy)",
        value: "14 ng/ml",
        status: "Deficient",
        severity: "red",
        ref_range: "30 - 100 ng/ml",
        patient_percentile: 12,
        organs: ["immune", "hormonal"],
        clinical_significance: "Severe Vitamin D deficiency. Impears mineral absorption, bone remodeling, and immune cell function.",
        why_abnormal: "Serum 25(OH)D levels fall far below the physiological baseline of 30 ng/mL.",
        possible_causes: "Insufficient solar exposure, malabsorption syndrome, liver/kidney conversion blocks.",
        associated_symptoms: "Widespread bone pain, chronic fatigue, muscle weakness, recurring infections, depression.",
        recommended_action: "Vitamin D3 supplementation (60,000 IU weekly for 8 weeks). Daily sun exposure.",
        confidence_score: 98,
        homeopathic_correlation: "Calcarea Carbonica 30C (calcium assimilation block), Silicea 200C (mineral utilization)."
      });
    }

    // 6. Serum Creatinine
    if (rawLower.includes("creatinine") || rawLower.includes("kidney") || rawLower.includes("renal")) {
      findings.push({
        marker: "Serum Creatinine",
        value: "1.2 mg/dL",
        status: "Borderline",
        severity: "yellow",
        ref_range: "0.50 - 1.10 mg/dL",
        patient_percentile: 68,
        organs: ["kidney", "blood"],
        clinical_significance: "Borderline elevated creatinine. Suggests mild renal filtration stress or muscle turnover load.",
        why_abnormal: "Creatinine level is slightly above normal range midpoint.",
        possible_causes: "Mild dehydration, high protein intake, renal clearance overload.",
        associated_symptoms: "Occasional water retention, dry mouth, mild back soreness.",
        recommended_action: "Ensure adequate hydration (2.5L+ daily). Re-test kidney panel in 30 days.",
        confidence_score: 90,
        homeopathic_correlation: "Serum Anguillae 6C (eel serum - specific for acute renal stress), Lycopodium 30C."
      });
    }

    // 7. Hemoglobin (Hb)
    if (rawLower.includes("hemoglobin") || rawLower.includes("hb") || rawLower.includes("cbc") || rawLower.includes("anemia")) {
      findings.push({
        marker: "Hemoglobin (Hb)",
        value: "10.2 g/dL",
        status: "Abnormal",
        severity: "orange",
        ref_range: "12.0 - 16.0 g/dL",
        patient_percentile: 15,
        organs: ["blood"],
        clinical_significance: "Anemia. Reduced oxygen-carrying capacity. Often linked to nutritional iron deficiency.",
        why_abnormal: "Hemoglobin production is low due to insufficient iron, B12, or bone marrow stimulation.",
        possible_causes: "Iron deficiency anemia, blood loss, or nutrient absorption defects.",
        associated_symptoms: "Fatigue, shortness of breath on exertion, cold hands and feet, pale tongue/nails.",
        recommended_action: "Check serum ferritin, TIBC, and Vitamin B12. Focus on iron-rich foods.",
        confidence_score: 94,
        homeopathic_correlation: "Ferrum Metallicum 30C (iron absorption), China 200C (debility from vital fluid loss)."
      });
    }

    // Default Fallback if none matched
    if (findings.length === 0) {
      findings.push({
        marker: "General Screening Panel",
        value: "Homeostatic",
        status: "Normal",
        severity: "green",
        ref_range: "Stable baseline bounds",
        patient_percentile: 50,
        organs: ["blood"],
        clinical_significance: "All parsed parameters are within the standard reference ranges.",
        why_abnormal: "No biochemical abnormalities detected.",
        possible_causes: "Optimal health maintenance.",
        associated_symptoms: "Normal energy levels and metabolic function.",
        recommended_action: "Continue current healthy diet and routine.",
        confidence_score: 90,
        homeopathic_correlation: "No active organ drainage required. Continue constitutional remedy support."
      });
    }

    // Build overall summary variables
    const abnormalCount = findings.filter(f => f.status !== "Normal").length;
    const hasRed = findings.some(f => f.severity === "red");
    const risk = hasRed ? "High" : (abnormalCount > 1 ? "Moderate" : "Low");

    return {
      success: true,
      isMock: true,
      analysis: {
        risk_level: risk,
        findings,
        interpretation: `Laboratory analysis reveals ${abnormalCount} abnormal markers representing metabolic/endocrine strain. Homeopathic support should prioritize organ drainage and constitutional support.`,
        significance: `Active metabolic dysregulation indicated by out-of-range markers. Requires dietary carbohydrate control and endocrine check.`,
        symptoms: "Fatigue, occasional brain fog, muscle soreness, and digestive sluggishness.",
        risk_factors: "Cardiovascular overload, subclinical endocrine sluggishness, and structural bone mineral depletion.",
        followup: "Re-evaluate critical panels in 12 weeks.",
        investigations: "Anti-TPO Antibodies, HOMA-IR fasting insulin index, Serum Ferritin, and 25-OH Vitamin D.",
        homeopathic_intelligence: {
          constitutional: "Sluggish, chilly, carbonaceous constitution (Calcarea Carbonica archetype).",
          miasmatic: "Dominant Psora (deficiency, hypersensitivity) with secondary Sycotic overlay.",
          affected_systems: ["Endocrine System", "Gastrointestinal System", "Nervous System (Autonomic)"],
          rubrics: ["GENERALS - CHILLY - sensitive to cold", "MIND - FATIGUE - mental", "STOMACH - DISTENSION - eating, after"],
          remedy_families: "Mineral Kingdom (Carbonates & Halogens)",
          differential_remedies: [
            { name: "Calcarea Carbonica", reason: "Chilly, sluggish metabolism, tendency to weight gain, cold damp feet." },
            { name: "Thyroidinum", reason: "Specific thyroid gland stimulation to resolve metabolic inertia." },
            { name: "Syzygium Jambolanum", reason: "Pancreatic action to regulate blood sugar spikes." }
          ],
          lifestyle: "Walk 20 minutes daily, implement intermittent fasting intervals, obtain direct solar exposure.",
          drainage: "Chelidonium Majus Q (liver support), Solidago Virgaurea Q (kidney drainage).",
          tissue_salts: "Calcarea Phosphorica 6x, Natrum Muriaticum 6x.",
          nutrition: "Chromium Picolinate, Vitamin D3 cholecalciferol, Magnesium Glycinate."
        },
        patient_education: {
          friendly_explanation: "Your tests indicate that your body is working harder to clear blood sugars and stimulate thyroid output, and your Vitamin D stores are low.",
          what_means: "Improving these markers will restore energy reserves, clear brain fog, and support bone and immune health.",
          diet: "Strictly limit refined sugar and white carbs. Eat more leafy greens and protein.",
          lifestyle: "Maintain a consistent sleep routine and get 15 minutes of sun exposure daily.",
          questions: [
            "Are thyroid antibodies present?",
            "Can we reverse the sugar levels with dietary changes?"
          ]
        },
        output_communication: {
          whatsapp: `Dr. Narayan Jethwani Clinic Info:\nDear Patient, your report analysis is ready. Your clinical risk level is ${risk.toUpperCase()} due to metabolic markers. Please avoid gluten/sugar, take your remedy Calcarea Carbonica 30C, and keep us updated.`,
          email: `Subject: Clinical Report Interpretation & Homeopathic Support Plan\n\nDear Patient,\n\nWe have reviewed your recent laboratory panels. Here is your structured clinical assessment:\n\n- Risk Level: ${risk}\n- Core issues: Metabolic/Endocrine strain\n\nHomeopathic Plan:\n- Prescribed: Calcarea Carbonica 30C (1 dose weekly)\n- Support: Syzygium Q (5 drops twice daily)\n\nDietary Instructions: Strictly avoid high glycemic index foods. Focus on high protein and solar exposure.\n\nWarm regards,\nDr. Narayan Jethwani`,
          pdf_preview: `Dr. Narayan Jethwani Clinical Report Digest\nPatient Name: Clinical Case\nRisk Level: ${risk}\nMiasm: Psora\nPrescription: Calc. Carb 30C`,
          doctor_notes: "Hypothyroid state coupled with pre-diabetic glycemic spike. Focus on endocrine balance. Prescribed Calc Carb as chronic constitutional. Monitor glucose.",
          follow_up: "Check fasting blood sugar weekly. Schedule clinic follow-up in 4 weeks.",
          diet_plan: "Breakfast: Oats bran with almonds. Lunch: Salad, Lentil soup, steamed vegetables. Dinner: Warm pumpkin soup, grilled paneer/tofu.",
          lifestyle_plan: "20 minutes brisk walking. 15 minutes solar exposure. Avoid digital screens past 9:30 PM."
        }
      }
    };
  }

  if (taskType === "diet-lifestyle") {
    const dietPreference = body?.dietPreference || "Vegetarian";
    const restrictions = body?.restrictions || "None";
    
    const vegetarianMenu = {
      breakfast: "Oats porridge with almonds and chia seeds, or warm Ragi malt. Avoid iced milk.",
      lunch: "Steamed brown rice, yellow mung dal, and sauteed bottle gourd (Lauki) with a pinch of cumin.",
      dinner: "Warm vegetable soup (pumpkin/carrots) with toasted sourdough bread, or steamed Moong dal khichdi.",
      snacks: "Handful of dry roasted walnuts and pumpkin seeds. Warm herbal infusions (Ginger/Fennel).",
      restrictions: [
        "Avoid raw cold salads, heavy raw cabbage/broccoli (goitrogenic if thyroid issues), and ice-cold water.",
        "Limit refined white sugar, heavy gluten, and deep-fried items."
      ],
      rationale: "Optimizes digestive fire (Agni) and reduces bloating by providing warm, easy-to-digest, psoric-soothing foods."
    };

    const jainMenu = {
      breakfast: "Warm roasted semolina (Suji Upma) with curry leaves, peanuts, and grated coconut.",
      lunch: "Wheat chapatis, yellow split-lentil soup (dal), and bottle gourd or zucchini curry. No root vegetables.",
      dinner: "Mung dal khichdi with ghee, taken before sunset. Warm water with dry ginger.",
      snacks: "Roasted lotus seeds (Makhana) or plain roasted puffed rice (Mamra).",
      restrictions: [
        "Strictly avoid potatoes, onions, garlic, carrots, and all root crops (ground-grown).",
        "No food intake after sunset to respect classical digestive and ethical cycles."
      ],
      rationale: "Adheres to ethical guidelines while supporting gut motility and reducing intestinal fermentation."
    };

    const menu = dietPreference.toLowerCase().includes("jain") ? jainMenu : vegetarianMenu;

    return {
      success: true,
      isMock: true,
      analysis: {
        diet_plan: menu,
        lifestyle_prescriptions: {
          routines: [
            "Wake up by 6:00 AM. Drink a glass of warm water on an empty stomach.",
            "Ensure a 10-15 minute walk in open air after dinner to assist gastric emptying.",
            "Establish a firm sleep schedule: in bed by 10:30 PM."
          ],
          sleep_hygiene: "No digital screens 1 hour before sleeping. Dim all lights, apply sesame oil to soles of feet if restless.",
          breathing_exercises: [
            "Nadi Shodhana Pranayama (Alternate Nostril Breathing) - 10 cycles twice daily to balance the autonomic nervous system.",
            "Bhramari Pranayama (Humming Bee Breath) - 5 cycles at night to soothe anticipatory health anxiety."
          ]
        }
      }
    };
  }

  if (taskType === "education") {
    const remedy = body?.prescribedRemedy || "Sulphur";
    const potency = body?.potency || "30C";
    const dose = body?.doseInstructions || "Single dose weekly on empty stomach";
    
    return {
      success: true,
      isMock: true,
      analysis: {
        handout_title: `Understanding Your Constitutional Remedy: ${remedy} ${potency}`,
        key_points: [
          `Your homeopathic remedy, ${remedy}, has been selected based on your unique thermal profile, digestive markers, and emotional response axis.`,
          "Homeopathy triggers your body's self-healing vital force. It works gently from within.",
          "You may experience a brief, temporary worsening of some skin or discharge symptoms. This is a positive sign of healing (homeopathic aggravation) and should not be suppressed."
        ],
        dosage_instructions: `Take ${potency} potency exactly as prescribed: ${dose}. Avoid eating or drinking anything 20 minutes before and after taking the medicine. Avoid touching the pills with your bare hands.`,
        lifestyle_guidance: "Avoid strong aromatics (camphor, eucalyptus, strong mint toothpaste) as they can antidote or disrupt the subtle action of the remedy. Limit excessive caffeine.",
        whatsapp_template: `Dr. Jethwani's Clinic Notification: Hello ${patientName}, your constitutional remedy is ${remedy} ${potency}. Dose: ${dose}. Avoid mint, coffee, and camphor around dosing. Feel free to message us with updates!`,
        email_template: `Subject: Dr. Jethwani Clinical Intelligence OS - Consultation Summary & Handout\n\nDear ${patientName},\n\nThank you for your visit today. Based on our clinical assessment, you have been prescribed:\n- Remedy: ${remedy} ${potency}\n- Instructions: ${dose}\n\nEnclosed is your patient guide outlining diet modifications, lifestyle routines, and instructions to ensure optimal therapeutic action. Please contact us in case of any acute skin flares.\n\nWarm regards,\nDr. Jethwani Clinic`
      }
    };
  }

  if (taskType === "organon_tutor") {
    const question = (body?.question || "").toLowerCase();
    const aphorismNumber = body?.aphorismNumber || "";
    const studyMode = body?.studyMode || "Student";
    
    let answer = "";
    let references = ["Organon of Medicine, 6th Edition"];
    
    if (aphorismNumber === "§153" || question.includes("153")) {
      answer = `Greetings. Let us examine Aphorism 153, which is the foundational guide to homeopathic individualization. When selecting the specific medicine (the Simillimum), we must bypass the common, general symptoms (like fever, pain, or nausea) which belong to all diseases. Instead, we must focus 'chiefly and almost solely' on the striking, singular, uncommon, and peculiar (characteristic) signs. These PQRS symptoms are the true signature of the patient's individual vital derangement.

Clinical Application:
In a case of chronic migraine, standard pathology focuses on vascular dilation. A homeopath, however, seeks the peculiar characteristics: for example, if the migraine is relieved only by binding the head tightly (Argentum Nitricum) or is accompanied by a sensation of coldness in the brain (Phosphorus). These peculiar keynotes guide us to the curative simillimum.`;
      references.push("Aphorism 153", "Aphorism 3");
    } else if (question.includes("vital force") || question.includes("vital principle") || question.includes("dynamis")) {
      answer = `The Vital Force (§9-15) is the spiritual, dynamic force that animates the physical body. In health, it rules with unbounded sway, maintaining all parts of the organism in perfect, harmonious operation, so that our indwelling, reason-gifted mind can freely employ this healthy instrument for the higher purposes of our existence. When dynamically deranged by morbific agents, it manifests this internal imbalance as symptoms. Curing consists of dynamically restoring its harmony.`;
      references.push("Aphorisms 9, 10, 11, 12");
    } else if (question.includes("single remedy") || question.includes("why single")) {
      answer = `Aphorisms 272-274 establish the absolute rule of the Single Remedy. Since we only prove single, simple substances on healthy human beings, we only know the pathogenetic profile of one medicine at a time. Prescribing combination formulas or alternating remedies is unscientific. It creates unpredictable interactions within the vital force, makes it impossible to know which substance cured, and prevents true clinical learning.`;
      references.push("Aphorisms 272, 273, 274");
    } else if (question.includes("second prescription")) {
      answer = `The Second Prescription (§249-253) requires the utmost patience and unprejudiced observation of remedy reactions. The primary rule is: if the patient is improving from the inside out (e.g. sleep, energy, and mood improve first), do not interfere; wait and let the remedy act. If the progress stops, we may repeat or escalate the potency. If the symptom picture shifts completely or new symptoms emerge, a new remedy is selected.`;
      references.push("Aphorisms 248, 249, 250");
    } else if (question.includes("acute") && question.includes("chronic")) {
      answer = `Acute diseases (§73) are rapid, self-limiting processes of the vital force, often triggered by exciting factors like climate shifts, injuries, or infections. They run their course and resolve or lead to death. Chronic diseases (§78-82) are insidious, progressive derangements caused by chronic miasms (Psora, Sycosis, Syphilis) that the vital force cannot resolve on its own, requiring deep constitutional anti-miasmatic remedies.`;
      references.push("Aphorisms 73, 78, 80");
    } else {
      answer = `Greetings. As a homeopath, we must always remember that cure is a dynamic restoration of harmony. Regarding your query: '${body?.question || "the principles of homeopathy"}', we must look at the patient's totality. The spiritual vital force responds to similar dynamic stimuli. Let us examine the symptoms, extract the striking characteristic signs (§153), select a single simple remedy (§273), and administer it in the minimum dose (§276) to achieve a rapid, gentle, and permanent restoration of health.`;
    }
    
    return {
      success: true,
      isMock: true,
      analysis: {
        tutorResponse: {
          answer,
          modeUsed: studyMode,
          aphorismContext: aphorismNumber || "General Philosophy",
          references,
          suggestedFollowUps: [
            "Can you explain this with a clinical case example?",
            "How does this relate to Hering's law?",
            "What is the difference between centesimal and LM potencies?"
          ]
        }
      }
    };
  }

  // DEFAULT: Classical synthesis mock (dynamically computed from patient data)
  const rubrics = body?.rubrics || [];
  const repertorizationResults = body?.repertorizationResults || [];

  const mainRemedy = repertorizationResults[0]?.remedyName || "Sulphur";
  const secondaryRemedy = repertorizationResults[1]?.remedyName || "Lycopodium";
  const thirdRemedy = repertorizationResults[2]?.remedyName || "Arsenicum Album";

  const thermals = rubrics.some((r: any) => r.name.toLowerCase().includes("warm") || r.name.toLowerCase().includes("heat") || r.name.toLowerCase().includes("hot")) ? "Warm-blooded" : "Chilly";
  const hasSkin = rubrics.some((r: any) => r.chapter.toLowerCase().includes("skin") || r.name.toLowerCase().includes("skin") || r.name.toLowerCase().includes("itching") || r.name.toLowerCase().includes("eruption"));
  const hasDigestive = rubrics.some((r: any) => r.chapter.toLowerCase().includes("stomach") || r.chapter.toLowerCase().includes("abdomen") || r.name.toLowerCase().includes("flatulence") || r.name.toLowerCase().includes("bloat") || r.name.toLowerCase().includes("constipation"));
  const hasMind = rubrics.some((r: any) => r.chapter.toLowerCase().includes("mind") || r.name.toLowerCase().includes("anxiety") || r.name.toLowerCase().includes("fear") || r.name.toLowerCase().includes("irritab"));

  let psoraScore = 45;
  let sycosisScore = 20;
  let syphilisScore = 15;
  let tubercularScore = 20;

  if (hasSkin) psoraScore += 20;
  if (hasDigestive) sycosisScore += 20;
  if (hasMind) psoraScore += 15;
  if (thermals === "Chilly") sycosisScore += 10;

  const totalMiasm = psoraScore + sycosisScore + syphilisScore + tubercularScore;
  const psoraPct = Math.round((psoraScore / totalMiasm) * 100);
  const sycosisPct = Math.round((sycosisScore / totalMiasm) * 100);
  const syphilisPct = Math.round((syphilisScore / totalMiasm) * 100);
  const tubercularPct = 100 - (psoraPct + sycosisPct + syphilisPct);

  const dominantMiasm = psoraPct >= sycosisPct ? "Psora" : "Sycosis";

  return {
    constitutional_profile: {
      type: `${mainRemedy} / ${secondaryRemedy} Constitutional Mix`,
      dominant_state: `Chronic constitutional disturbance with ${hasSkin ? "cutaneous reactivity, " : ""}${hasDigestive ? "digestive weakness, " : ""}${hasMind ? "anticipatory anxiety, " : ""}and marked ${thermals.toLowerCase()} reaction profile.`,
      vitality_level: "Medium (recovering reaction capacity)",
      reaction_type: `${dominantMiasm}-dominated active reactive state`,
      anxiety_profile: hasMind ? "Anticipatory anxiety centering on health, performance, and social alignment." : "Low to moderate general anxiety.",
      control_tendency: "Strong; utilizes structure, fastidiousness, and routines to manage internal stress.",
      insecurity: "Moderate; expresses as high sensitivity to criticism and fear of failure.",
      perfectionism: "High; fastidious regarding professional output but can be disorganized domestically.",
      hypersensitivity: `High sensory reactivity to environmental transitions, ${thermals === "Warm-blooded" ? "warm rooms," : "cold drafts,"} and emotional noise.`,
      digestive_axis: hasDigestive ? "Functional digestive dysmotility with post-prandial bloating and gas." : "Relatively stable gastric axis.",
      thermal_axis: `${thermals}; strongly influenced by changes in temperature and seasonal transitions.`,
      stress_response: "Initial nervous excitability followed by physical fatigue and somatic outbursts.",
      nervous_excitability: "High; overactive mind preventing easy sleep initiation.",
      suppression_history: hasSkin ? "Prior history of suppressive topical applications for dermal flares." : "No major suppressive history noted."
    },
    constitutional_vector: {
      anxiety: hasMind ? 88 : 45,
      control: 75,
      insecurity: 68,
      perfectionism: 70,
      sensitivity: 82,
      digestive: hasDigestive ? 80 : 35,
      vitality: 65,
      thermal: 80
    },
    case_essence: `A ${age}-year-old ${gender} presenting with ${complaint}. Symptom picture indicates a primary ${dominantMiasm.toLowerCase()} miasmatic state, with matching affinity for ${mainRemedy} and secondary support for ${secondaryRemedy}.`,
    central_disturbance: `Primary ${dominantMiasm.toLowerCase()} hypersensitivity manifesting as ${complaint}, aggravated by ${thermals === "Warm-blooded" ? "heat and warm environments" : "cold and damp drafts"}.`,
    constitutional_archetype: {
      name: mainRemedy === "Sulphur" ? "The Philosophical Scholar" : (mainRemedy === "Lycopodium" ? "The Apprehensive Intellect" : "The Sensitive Reactor"),
      description: `Strives to maintain control through intellect and structure, hiding physical and emotional susceptibilities under a protective facade.`,
      traits: [
        "High anticipatory anxiety",
        "Sensitive to temperature changes",
        "Digestive or skin reactive history",
        "Reacts to suppression with somatic shifts"
      ]
    },
    remedy_battlefield: [
      {
        remedy: mainRemedy,
        match_pct: 90,
        confidence_pct: 92,
        mental_match: hasMind ? 85 : 60,
        general_match: 90,
        modality_match: 90,
        constitution_match: 88
      },
      {
        remedy: secondaryRemedy,
        match_pct: 82,
        confidence_pct: 80,
        mental_match: 80,
        general_match: 75,
        modality_match: 78,
        constitution_match: 80
      }
    ],
    remedy_confirmation: [
      {
        remedy: mainRemedy,
        confirm_questions: [
          `Do your ${complaint} worsen at a specific time of day?`,
          `How does ${thermals === "Warm-blooded" ? "fresh open air" : "warm wrapping"} affect your energy?`
        ],
        rule_out_questions: [
          `Are you completely unaffected by changes in temperature?`,
          `Do your symptoms remain static regardless of sleep quality?`
        ]
      }
    ],
    contradictions: [
      {
        symptom: `Aggravation from ${thermals === "Warm-blooded" ? "cold" : "heat"}`,
        remedy: mainRemedy,
        reason: `${mainRemedy} corresponds primarily to a ${thermals.toLowerCase()} state.`
      }
    ],
    missing_information: [
      "Thermal state: precise reaction to weather transitions remains unverified.",
      "Time modality: exact hour of peak aggravation has not been charted."
    ],
    followup_predictions: {
      improvement_order: [
        `Gradual relief of chief symptom (${complaint}) during Weeks 1-3`,
        "Stabilization of sleep quality and energy margins during Weeks 4-6",
        "Reduction of anticipatory tension and stress reactions during Weeks 8-12"
      ],
      aggravations: [
        "Transient mild worsening of active symptoms during first 48 hours.",
        "Short-lived return of old skin or discharge symptoms."
      ],
      constitutional_shifts: [
        "Transition from a tense, sycotic defense layer to a clean, reactive psoric response as healing begins."
      ]
    },
    clinical_confidence: {
      level: "High",
      reasons: [
        `Symptoms match the core keynote profile of ${mainRemedy}.`,
        `Thermal axis (${thermals}) aligns with the primary remedy.`
      ]
    },
    explainability_layer: [
      {
        conclusion: `${mainRemedy} selected as primary chronic prescription`,
        rationale: `Strongest match to the patient's complaint of ${complaint} and general physical modalities.`,
        rubrics: rubrics.slice(0, 3).map((r: any) => r.name),
        constitutional_factors: [`${thermals} thermal axis`, `${dominantMiasm} miasmatic baseline`]
      }
    ],
    ai_transparency: [
      {
        rubric: rubrics[0]?.name || "Chief Complaint Alignment",
        weight_pct: 35,
        influence_pct: 40,
        remedy_impacts: [
          { remedy: mainRemedy, impact: 9 },
          { remedy: secondaryRemedy, impact: 7 }
        ]
      }
    ],
    remedy_evolution: [
      { visit: "Initial", [mainRemedy]: 10, [secondaryRemedy]: 8, [thirdRemedy]: 6 }
    ],
    followup_progress: [
      { date: "Baseline", severity: 85 }
    ],
    mental_generals: [
      { symptom: hasMind ? "Anticipatory anxiety" : "Mild stress sensitivity", grade: 2, interpretation: `Nervous system reaction state matching ${mainRemedy}.` }
    ],
    physical_generals: [
      { symptom: `${thermals} reaction`, grade: 3, interpretation: "Decisive thermal axis indicator." }
    ],
    modalities: [
      { modality: thermals === "Warm-blooded" ? "Warm room" : "Cold draft", aggravates: true, ameliorates: false, remedy_relevance: "Governs general physical reaction." }
    ],
    miasmatic_analysis: {
      psora: psoraPct,
      sycosis: sycosisPct,
      syphilis: syphilisPct,
      tubercular: tubercularPct,
      dominant_miasm: dominantMiasm,
      description: `Dominant ${dominantMiasm} miasm indicated by patient's reactive susceptibility and tissue symptoms.`
    },
    constitutional_axis: {
      mental_axis: hasMind ? 85 : 45,
      thermal_axis: 80,
      vitality: 65,
      emotional_sensitivity: 75,
      nervous_reactivity: 70,
      digestive_involvement: hasDigestive ? 80 : 40
    },
    top_remedies: [
      { 
        name: mainRemedy, 
        coverage: `${Math.min(5, rubrics.length)}/${rubrics.length || 5}`, 
        score: repertorizationResults[0]?.score || 12, 
        confidence: 92, 
        kingdom: mainRemedy === "Sulphur" ? "Mineral" : (mainRemedy === "Lycopodium" ? "Plant" : "Constitutional Kingdom"), 
        family: mainRemedy === "Sulphur" ? "Element" : (mainRemedy === "Lycopodium" ? "Lycopodiaceae" : "Constitutional Family"),
        brief_keynotes: `${thermals === "Warm-blooded" ? "Warm-blooded" : "Chilly"}, matching ${complaint}.`, 
        relationship_to_patient: "Primary constitutional remedy selection.",
        why_selected: `Matches chief symptoms of ${complaint} and fits the ${thermals.toLowerCase()} profile.`,
        why_not_selected: "N/A",
        differentiation_points: `Aligned with the thermal axis (${thermals}), distinguishing it from opposing modalities.`,
        relationships: { complementary: secondaryRemedy, inimicals: "None", follows_well: "Nux Vomica" } 
      }
    ],
    differential_matrix: [
      {
        remedy: mainRemedy,
        matches: rubrics.slice(0, 3).map((r: any) => r.name),
        contradicts: [thermals === "Warm-blooded" ? "Desire for warm wraps" : "Aggravation from cold air"],
        differential_verdict: "Strongly indicated Chronic Prescribing Choice"
      },
      {
        remedy: secondaryRemedy,
        matches: rubrics.slice(1, 4).map((r: any) => r.name),
        contradicts: [thermals === "Warm-blooded" ? "Aggravation from fresh air" : "Amelioration from cold drinks"],
        differential_verdict: "Secondary option, reserved for follow-up layers"
      }
    ],
    potency_strategy: {
      suggested_potency: "30C",
      dosing_frequency: "Once a week, single dose",
      justification: "Allows gentle stimulation of the Vital Force without inducing risk of violent homeopathic aggravations."
    },
    followup_questions: [
      "How have your energy levels changed in the morning?",
      "Are you experiencing any changes in food preferences?"
    ],
    materia_medica_analysis: {
      remedy_deep_dive: {
        emotional_pattern: "Egotistical, critical",
        relationship_pattern: "Demands appreciation",
        reaction_pattern: "Skin-centered eruptions",
        stress_pattern: "Somatic skin triggers",
        miasmatic_expression: "Psoric",
        kingdom: "Mineral",
        family: "Element",
        source_substance: "Sublimed sulphur"
      },
      differential_comparison: [],
      confirmatory_questions: [],
      contradictions: [],
      confidence_scores: { overall: 92, mental: 85, general: 95, modality: 95, constitution: 90, pathology: 88 },
      readiness_index: { status: "Ready to Prescribe", reasons: ["Matches thermal and skin keys"] },
      potency_intelligence: { suggested_potency: "30C", repetition: "Weekly", aggravation_risk: "Moderate", followup_timeline: "4 weeks", direction_of_cure: "Outward skin healing", confidence_score: 88 },
      followup_predictions: { mental_changes: "Calmer anxiety", sleep_changes: "Fewer wakings", energy_changes: "11 AM sinking clears", physical_changes: "Skin eruption flaring temporarily then clearing", warning_signs: "Suppression of skin", reevaluate_weeks: 4 }
    },
    clinical_reasoning_v2: {
      constitutional_interpretation: `A ${age}-year-old ${gender} showing constitutional susceptibility matching ${mainRemedy} profile. Symptoms indicate a ${thermals.toLowerCase()} reactive state.`,
      etiological_analysis: `Chronicity triggered or aggravated by: ${complaint || "environmental stressors"}. Pathological load indicates an inward functional shift.`,
      miasmatic_analysis_summary: `Predominantly ${dominantMiasm} miasmatic layer (Psora: ${psoraPct}%, Sycosis: ${sycosisPct}%, Syphilis: ${syphilisPct}%, Tubercular: ${tubercularPct}%).`,
      affected_organ_systems: [
        ...(hasSkin ? ["Integumentary System"] : []),
        ...(hasDigestive ? ["Gastrointestinal System"] : []),
        ...(hasMind ? ["Nervous System (Autonomic)"] : []),
        ...(!hasSkin && !hasDigestive && !hasMind ? ["Constitutional / Systemic Regulation"] : [])
      ],
      probable_clinical_patterns: [
        ...(hasSkin ? ["Dermal Inflammatory Reactivity with Suppression Risk"] : []),
        ...(hasDigestive ? ["Functional Gastric Dysmotility & Visceral Hypersensitivity"] : []),
        ...(hasMind ? ["Sympathetic Nervous Overdrive with Health Anticipation"] : []),
        ...(!hasSkin && !hasDigestive && !hasMind ? ["Functional Somatic Energy Stagnation"] : [])
      ],
      differential_diagnoses: [
        `${mainRemedy} (Primary covered remedy matching physical generals and chief modalities)`,
        `${secondaryRemedy} (Secondary coverage; rule out if key modalities/thermals conflict)`,
        `${thirdRemedy} (Tertiary covered remedy; check for specific temporal or emotional triggers)`
      ],
      remedy_justification: `Prescription of ${mainRemedy} is justified by high symptom coverage and alignment with patient's ${thermals.toLowerCase()} thermal axis.`,
      remedy_rejection_logic: `${secondaryRemedy} is deferred because it lacks matching modalities or thermal alignment. ${thirdRemedy} is ruled out unless specific keynotes emerge.`,
      confirmation_questions: [
        `Do the symptoms of ${complaint || "your complaint"} aggravate at any specific hour of the day or night?`,
        `How does change of weather, temperature, or open fresh air affect your overall comfort?`
      ],
      clinical_red_flags: [
        "Development of severe breathing difficulty or sudden chest constriction",
        "Rapid unexplained weight loss or severe appetite depletion",
        "Onset of deep clinical depression or feelings of helplessness"
      ]
    },
    confidence_score: 88,
    case_complexity: 65
  };
}

export function getPromptsForTask(taskType: string, body: any): { systemPrompt: string, userPrompt: string } {
  const patientName = body?.patientInfo?.name || body?.patientName || "Patient";
  const age = body?.patientInfo?.age || body?.age || "35";
  const gender = body?.patientInfo?.gender || body?.gender || "Male";
  const complaint = body?.patientInfo?.complaint || body?.complaint || "";

  if (taskType === "clinical_conference") {
    const systemPrompt = `You are the AI Clinical Case Conference Facilitator. Your mission is to coordinate a virtual consultation room between three expert models:
1. Dr. Gemini (Expert Homeopathic Synthesizer): Focuses on holistic analysis, mental state integration, and classical Kentian repertory synthesis.
2. Dr. Qwen (Clinical Keynote & Repertory Auditor): Focuses on physical keynotes, modalities (aggravation/amelioration conditions), and specific Boericke-style clinical associations.
3. Dr. DeepSeek (Miasmatic & Pathological Differentiator): Focuses on underlying miasmatic load (Psora, Sycosis, Syphilis, Tubercular), pathological changes, and clinical differentiation.

You MUST return a JSON object with this EXACT schema:
{
  "clinical_conference": {
    "gemini": {
      "analysis": "Dr. Gemini's detailed analysis of the case and mental dynamics.",
      "remedy": "Recommended remedy (e.g., Sulphur, Lycopodium, Lachesis)",
      "miasm": "Primary miasm recommended (Psora, Sycosis, Syphilis, Tubercular)",
      "constitutional_type": "Constitutional type (e.g., Warm-blooded Psoric, Chilly Sycotic)",
      "differential_diagnosis": "Differential analysis of secondary options",
      "clinical_pattern": "Clinical pattern (e.g., Suppressed cutaneous irritation with reactive anxiety)",
      "confidence": 85
    },
    "qwen": {
      "analysis": "Dr. Qwen's detailed physical keynote and modality audit.",
      "remedy": "Recommended remedy",
      "miasm": "Primary miasm recommended",
      "constitutional_type": "Constitutional type",
      "differential_diagnosis": "Differential analysis",
      "clinical_pattern": "Clinical pattern description",
      "confidence": 80
    },
    "deepseek": {
      "analysis": "Dr. DeepSeek's miasmatic and pathological differentiation.",
      "remedy": "Recommended remedy",
      "miasm": "Primary miasm recommended",
      "constitutional_type": "Constitutional type",
      "differential_diagnosis": "Differential analysis",
      "clinical_pattern": "Clinical pattern description",
      "confidence": 90
    },
    "consensus": {
      "remedy": "The consensus remedy reached after debate",
      "miasm": "The consensus miasmatic load",
      "constitutional_type": "The consensus constitutional type",
      "differential_diagnosis": "Differential diagnosis overview",
      "clinical_pattern": "Clinical pattern overview",
      "agreement_percentage": 90,
      "confidence_percentage": 85,
      "conflict_alerts": ["Alerts indicating discrepancies or critical contradictions between the models' findings (e.g., thermal contradictions or potency clashes)"],
      "areas_of_agreement": ["Key symptoms or remedy indicators that all three models agree upon"],
      "areas_of_disagreement": ["Specific modalities or mental-emotional state interpretations where models conflict"],
      "missing_data": ["Important historical or diagnostic details missing from the present symptom picture"],
      "confirmation_questions": ["Key questions the clinician should ask the patient to resolve the debate conflicts"],
      "citations": ["Medical literature and repertory page citations (e.g. Kent's Repertory p. 45, Boericke's Materia Medica p. 112)"],
      "reasoning_chain": "Detailed step-by-step panel consensus debate synthesis (Dr. Gemini proposed X, Dr. DeepSeek argued Y, Dr. Qwen reconciled with Z).",
      "report": "Comprehensive Final Case Conference Report summarizing the panel's findings and plan."
    }
  }
}`;

    const rubricsText = (body?.rubrics || []).map((r: any) => `- ${r.chapter}: ${r.name} (Grade: ${r.grade || 1})`).join("\n");
    const userPrompt = `Convene a case conference for this patient:
Name: ${patientName}
Age: ${age}
Gender: ${gender}
Chief Symptoms / Complaint: ${complaint}

Active Repertory Rubrics Evaluated:
${rubricsText || "No active rubrics selected."}

Please synthesize the individual expert analyses and compile the consensus report. Ensure all fields in the JSON response are populated fully with detailed clinical reasoning. Do not return empty fields or placeholders.`;

    return { systemPrompt, userPrompt };
  }

  if (taskType === "clinical_reasoning") {
    const systemPrompt = `You are the AI Clinical Reasoning Engine (V2). Your goal is to analyze the patient's symptom profile and selected remedies to generate a deep clinical reasoning report.
You MUST return a JSON object with this EXACT schema:
{
  "clinical_reasoning_v2": {
    "constitutional_interpretation": "string analyzing the patient's underlying constitution",
    "etiological_analysis": "string analyzing the root causes / Causa Occasionalis",
    "miasmatic_analysis_summary": "string summarizing miasmatic weights and patterns",
    "affected_organ_systems": ["string names of affected organ systems"],
    "probable_clinical_patterns": ["string probable clinical syndromes/patterns"],
    "differential_diagnoses": ["string comparisons of differential remedies"],
    "remedy_justification": "string justifying the selected remedy based on modalities",
    "remedy_rejection_logic": "string explaining why other major remedies were ruled out",
    "confirmation_questions": ["string specific questions to ask the patient to confirm"],
    "clinical_red_flags": ["string red flag warning symptoms for safety and referral"]
  },
  "clinical_hypothesis_engine": [
    {
      "condition": "string probable clinical condition (e.g. Atopic Dermatitis, Irritable Bowel Syndrome)",
      "likelihood": number, // likelihood percentage as an integer from 0 to 100
      "supporting_findings": ["string supporting clinical findings from the intake"],
      "missing_findings": ["string missing findings needed to confirm"],
      "suggested_investigations": ["string suggested investigations or tests"]
    }
  ]
}`;
    const rubricsPrompt = (body?.rubrics || []).map((r: any) => `- [${r.chapter}] ${r.name} (Intensity/Severity Grade: ${r.grade})`).join("\n");
    const repertorizationResults = body?.repertorizationResults || [];
    const userPrompt = `Patient Case details:
- Name: ${patientName}
- Age / Gender: ${age} / ${gender}
- Chief Complaint: ${complaint}

Selected Symptom Rubrics:
${rubricsPrompt}

Repertorization Scores:
${repertorizationResults.map((res: any) => `- ${res.remedyName}: Coverage = ${res.coverage}, Sum of Grades = ${res.score}`).join("\n")}

Perform clinical reasoning analysis. Return the exact JSON structure specified above.`;
    return { systemPrompt, userPrompt };
  }

  if (taskType === "intake") {
    const systemPrompt = `You are the AI Clinical Intake Engine. Your goal is to synthesize the patient's intake information (complaint, HPI, PMH, mental/emotional, thermals, food desires/aversions, sleep modalities, suppression history) into a highly structured homeopathic assessment.
You MUST return a JSON object with this EXACT schema:
{
  "symptom_synthesis": {
    "chief_complaint_analysis": "string summarizing complaint depth and duration",
    "hpi_timeline": "string mapping symptom onset and events",
    "constitutional_tendencies": "string assessing general physical traits",
    "emotional_triggers": "string identifying psychological stresses",
    "thermal_axis": "string specifying thermal state (Hot, Chilly, Ambithermal)",
    "suppression_history": "string detail of past suppression (steroids, suppressive pills)"
  },
  "clinical_recommendations": {
    "rubrics_to_consider": ["string rubric names matching Kent classical index"],
    "suggested_questions": ["string clarifying questions for the next consultation"],
    "miasmatic_orientation": "string detail of dominant miasmatic expression"
  }
}`;
    const userPrompt = `Patient Intake Details:
- Name: ${patientName}
- Age / Gender: ${age} / ${gender}
- Chief Complaint: ${complaint}
- Thermal / General Modal States: ${body?.thermalGenerals || "Unspecified"}
- Mental / Emotional Profile: ${body?.mentalProfile || "Unspecified"}
- Previous suppression details: ${body?.suppressionHistory || "Unspecified"}`;
    return { systemPrompt, userPrompt };
  }

  if (taskType === "diagnostics") {
    const systemPrompt = `You are the Diagnostic Intelligence Engine. Your goal is to map organ systems and search queries to specific clinical pathologies and list their corresponding homeopathic remedies, pathophysiology, and grade of match.
You MUST return a JSON object with this EXACT schema:
{
  "matching_conditions": [
    {
      "condition": "string condition name",
      "organ_system": "string matching organ system",
      "pathophysiology": "string brief clinical details",
      "homeopathic_remedies": ["string remedy names"],
      "grade_of_match": "string ('High' | 'Moderate' | 'Low')"
    }
  ],
  "clinical_notes": "string overall clinical guidance"
}`;
    const userPrompt = `Diagnostic search inputs:
- Organ System filter: ${body?.organSystem || "All"}
- Query / Conditions input: ${body?.searchQuery || "All"}`;
    return { systemPrompt, userPrompt };
  }

  if (taskType === "analyzer") {
    const systemPrompt = `You are the Medical Report Analyzer (v2.0). Your goal is to inspect raw text from laboratory blood panels or radiology scans, research standard clinical reference/normal ranges, extract values, assign severity levels, and map findings to potential homeopathic drainage/assimilation remedies.
You MUST return a JSON object with this EXACT schema:
{
  "risk_level": "string ('Low' | 'Moderate' | 'High' | 'Urgent')",
  "findings": [
    {
      "marker": "string marker name (e.g. Thyroid Stimulating Hormone (TSH))",
      "value": "string patient value (e.g. 8.4 uIU/mL)",
      "status": "string ('Normal' | 'Borderline' | 'Abnormal' | 'Deficient')",
      "severity": "string ('green' | 'yellow' | 'orange' | 'red')",
      "ref_range": "string normal range (e.g. 0.45 - 4.5 uIU/mL)",
      "patient_percentile": number (0-100 estimate where patient sits; e.g. 85),
      "organs": ["string matching keys like 'blood', 'endocrine', 'cardio', 'liver', 'kidney', 'resp', 'digestive', 'neuro', 'immune', 'hormonal'"],
      "clinical_significance": "string clinical importance details",
      "why_abnormal": "string pathophysiology detail",
      "possible_causes": "string potential etiology",
      "associated_symptoms": "string typical symptoms",
      "recommended_action": "string recommended diagnostic/clinical actions",
      "confidence_score": number (0-100),
      "homeopathic_correlation": "string remedy suggestions with homeopathic logic"
    }
  ],
  "interpretation": "string overview of report implications",
  "significance": "string clinical summary",
  "symptoms": "string potential symptoms linked to findings",
  "risk_factors": "string chronic risk factors",
  "followup": "string follow-up timeline",
  "investigations": "string suggested next investigations",
  "homeopathic_intelligence": {
    "constitutional": "string constitutional type matching archetype",
    "miasmatic": "string miasmatic expression",
    "affected_systems": ["string systems like 'Endocrine System'"],
    "rubrics": ["string Kent rubrics list"],
    "remedy_families": "string remedy families",
    "differential_remedies": [
      { "name": "string", "reason": "string" }
    ],
    "lifestyle": "string patient lifestyle advice",
    "drainage": "string drainage remedies",
    "tissue_salts": "string tissue salts suggestions",
    "nutrition": "string nutrients required"
  },
  "patient_education": {
    "friendly_explanation": "string simple explanation",
    "what_means": "string meaning for vitality",
    "diet": "string diet changes",
    "lifestyle": "string daily routines",
    "questions": ["string questions to ask doctor"]
  },
  "output_communication": {
    "whatsapp": "string WhatsApp message template",
    "email": "string email summary template",
    "pdf_preview": "string PDF page preview content",
    "doctor_notes": "string clinical notes",
    "follow_up": "string tracking suggestions",
    "diet_plan": "string meal suggestions",
    "lifestyle_plan": "string daily activity tips"
  }
}`;
    const userPrompt = `Laboratory / Radiology Report Text:
${body?.rawText || "No text provided"}`;
    return { systemPrompt, userPrompt };
  }

  if (taskType === "diet-lifestyle") {
    const systemPrompt = `You are the Diet & Lifestyle Planner. Your goal is to design a personalized nutrition and routine prescription (diet menus, snacks, restrictions, exercise, and sleep hygiene) tailored to the patient's diet preference and health complaints.
You MUST return a JSON object with this EXACT schema:
{
  "diet_plan": {
    "breakfast": "string breakfast menu",
    "lunch": "string lunch menu",
    "dinner": "string dinner menu",
    "snacks": "string snacks menu",
    "restrictions": ["string restricted foods"],
    "rationale": "string nutrition logic details"
  },
  "lifestyle_prescriptions": {
    "routines": ["string daily routine tasks"],
    "sleep_hygiene": "string sleep routine recommendations",
    "breathing_exercises": ["string pranayama/breathing exercises instructions"]
  }
}`;
    const userPrompt = `Dietary Plan Request:
- Diet Preference: ${body?.dietPreference || "Vegetarian"}
- Special Restrictions / Conditions: ${body?.restrictions || "None"}
- Primary Pathology details: ${complaint}`;
    return { systemPrompt, userPrompt };
  }

  if (taskType === "education") {
    const systemPrompt = `You are the Patient Outreach Coordinator. Your goal is to write custom patient handouts, dosage guides, WhatsApp checklist alerts, and copyable email summaries for a prescribed remedy.
You MUST return a JSON object with this EXACT schema:
{
  "handout_title": "string title",
  "key_points": ["string clinical/homeopathic explanations for the patient"],
  "dosage_instructions": "string exact remedy dosage instructions",
  "lifestyle_guidance": "string things to avoid (mint, camphor, stimulants)",
  "whatsapp_template": "string copyable SMS text with dosage instructions",
  "email_template": "string formatted email body text"
}`;
    const userPrompt = `Prescription and Patient Details:
- Patient Name: ${patientName}
- Prescribed Remedy: ${body?.prescribedRemedy || "Sulphur"}
- Potency: ${body?.potency || "30C"}
- Dose Instructions: ${body?.doseInstructions || "Take once a week"}`;
    return { systemPrompt, userPrompt };
  }

  if (taskType === "organon_tutor") {
    const question = body?.question || "";
    const aphorismNumber = body?.aphorismNumber || "";
    const studyMode = body?.studyMode || "Student";
    const aphorismContextText = body?.aphorismText ? `\nSelected Aphorism Context: ${body.aphorismText}` : "";

    const systemPrompt = `You are "Chat with Hahnemann™", an expert clinical homeopathic tutor speaking in the wise, authoritative, yet gentle tone of Dr. Samuel Hahnemann. 
Your goal is to guide students and practitioners on the principles of the Organon of Medicine.
Adapt your explanation complexity according to the requested Study Mode:
- Beginner: Use simple analogies, avoid heavy jargon, explain core concepts step-by-step.
- Student: Focus on standard academic definitions, BHMS syllabus alignment, and clear structure.
- Practitioner: Include advanced clinical reasoning, comparative prescribing tips, and miasmatic analysis.
- Advanced Practitioner: Focus on complex clinical scenarios, dynamic posology shifts, and potential obstacles to cure.
- Teacher: Focus on explaining how to teach this concept, history of editions, and pedagogical analogies.

You MUST return a JSON object with this EXACT schema:
{
  "tutorResponse": {
    "answer": "Your detailed response explaining the concept, referencing the Organon text, and providing clinical/daily examples in the persona of Hahnemann.",
    "modeUsed": "${studyMode}",
    "aphorismContext": "${aphorismNumber || "General Philosophy"}",
    "references": ["Organon Aphorism §X", "Chronic Diseases p. Y"],
    "suggestedFollowUps": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
  }
}`;
    const userPrompt = `Query: "${question}"
Aphorism Selection: ${aphorismNumber || "None"}${aphorismContextText}
Study Mode: ${studyMode}

Please provide your tutor response. Ensure the JSON is completely filled.`;
    return { systemPrompt, userPrompt };
  }

  // DEFAULT: Classical synthesis prompt
  const graph = getKnowledgeGraph();
  const matchedGraphRemedies = (body?.repertorizationResults || []).map((res: any) => {
    const normalizedName = res.remedyName.toLowerCase();
    const node = graph.nodes.find(n => n.type === 'remedy' && n.label.toLowerCase().includes(normalizedName));
    if (!node) return null;
    const edges = graph.edges.filter(e => e.source === node.id || e.target === node.id);
    const connections = edges.map(e => {
      const otherId = e.source === node.id ? e.target : e.source;
      const otherNode = graph.nodes.find(n => n.id === otherId);
      return { type: e.type, label: otherNode?.label || otherId, nodeType: otherNode?.type || 'unknown', weight: e.weight };
    });
    return {
      remedyName: node.label,
      essence: node.metadata?.profile?.essence || '',
      miasm: connections.filter(c => c.nodeType === 'miasm').map(c => `${c.label} (Grade ${c.weight})`).join(", "),
      relationships: connections.filter(c => ['complementary', 'inimical', 'follows_well'].includes(c.type)).map(c => `${c.type}: ${c.label}`).join(", "),
      modalities: connections.filter(c => c.nodeType === 'modality').map(c => `${c.type === 'aggravates_by' ? 'aggravates' : 'ameliorates'} on ${c.label}`).join(", "),
      family: connections.filter(c => c.nodeType === 'family').map(c => c.label).join(", "),
      kingdom: connections.filter(c => c.nodeType === 'kingdom').map(c => c.label).join(", ")
    };
  }).filter(Boolean);

  const graphInsightsPrompt = matchedGraphRemedies.length > 0 
    ? `\n\nKNOWLEDGE GRAPH RELATIONSHIP INSIGHTS (Cross-Referenced Classical Connections):\n${matchedGraphRemedies.map((r: any) => `- ${r.remedyName} (Kingdom: ${r.kingdom}, Family: ${r.family})\n  - Essence: ${r.essence}\n  - Key Modalities: ${r.modalities}`).join("\n")}`
    : "";

  const systemPrompt = `You are the AI Constitutional Homeopathic Intelligence Engine, a master clinical decision support system. Combine Kent's classical methodologies with modern clinical pathology.
You MUST return a single, valid JSON object following this EXACT schema, with NO markdown formatting around it (no backticks, no \`\`\`json blocks):
{
  "constitutional_profile": {
    "type": "string", "dominant_state": "string", "vitality_level": "string", "reaction_type": "string", "anxiety_profile": "string", "control_tendency": "string", "insecurity": "string", "perfectionism": "string", "hypersensitivity": "string", "digestive_axis": "string", "thermal_axis": "string", "stress_response": "string", "nervous_excitability": "string", "suppression_history": "string"
  },
  "constitutional_vector": { "anxiety": number, "control": number, "insecurity": number, "perfectionism": number, "sensitivity": number, "digestive": number, "vitality": number, "thermal": number },
  "case_essence": "string", "central_disturbance": "string",
  "constitutional_archetype": { "name": "string", "description": "string", "traits": ["string"] },
  "remedy_battlefield": [ { "remedy": "string", "match_pct": number, "confidence_pct": number, "mental_match": number, "general_match": number, "modality_match": number, "constitution_match": number } ],
  "remedy_confirmation": [ { "remedy": "string", "confirm_questions": ["string"], "rule_out_questions": ["string"] } ],
  "contradictions": [ { "symptom": "string", "remedy": "string", "reason": "string" } ],
  "missing_information": ["string"],
  "followup_predictions": { "improvement_order": ["string"], "aggravations": ["string"], "constitutional_shifts": ["string"] },
  "clinical_confidence": { "level": "string", "reasons": ["string"] },
  "explainability_layer": [ { "conclusion": "string", "rationale": "string", "rubrics": ["string"], "constitutional_factors": ["string"] } ],
  "ai_transparency": [ { "rubric": "string", "weight_pct": number, "influence_pct": number, "remedy_impacts": [ { "remedy": "string", "impact": number } ] } ],
  "remedy_evolution": [ { "visit": "string", "Sulphur": number, "Lycopodium": number, "NuxVomica": number, "Arsenicum": number } ],
  "followup_progress": [ { "date": "string", "severity": number } ],
  "mental_generals": [ { "symptom": "string", "grade": number, "interpretation": "string" } ],
  "physical_generals": [ { "symptom": "string", "grade": number, "interpretation": "string" } ],
  "modalities": [ { "modality": "string", "aggravates": boolean, "ameliorates": boolean, "remedy_relevance": "string" } ],
  "miasmatic_analysis": { "psora": number, "sycosis": number, "syphilis": number, "tubercular": number, "dominant_miasm": "string", "description": "string" },
  "constitutional_axis": { "mental_axis": number, "thermal_axis": number, "vitality": number, "emotional_sensitivity": number, "nervous_reactivity": number, "digestive_involvement": number },
  "top_remedies": [ { "name": "string", "coverage": "string", "score": number, "confidence": number, "kingdom": "string", "family": "string", "brief_keynotes": "string", "relationship_to_patient": "string", "why_selected": "string", "why_not_selected": "string", "differentiation_points": "string", "relationships": { "complementary": "string", "inimicals": "string", "follows_well": "string" } } ],
  "differential_matrix": [ { "remedy": "string", "matches": ["string"], "contradicts": ["string"], "differential_verdict": "string" } ],
  "potency_strategy": { "suggested_potency": "string", "dosing_frequency": "string", "justification": "string" },
  "followup_questions": ["string"],
  "materia_medica_analysis": {
    "remedy_deep_dive": { "remedy": "string", "constitutional_portrait": "string", "core_fears": ["string"], "core_motivations": ["string"], "thermal_state": "string", "energy_pattern": "string", "digestive_profile": "string", "sleep_pattern": "string", "emotional_pattern": "string", "relationship_pattern": "string", "reaction_pattern": "string", "stress_pattern": "string", "miasmatic_expression": "string", "kingdom": "string", "family": "string", "source_substance": "string" },
    "differential_comparison": [], "confirmatory_questions": [], "contradictions": [], "confidence_scores": { "overall": number, "mental": number, "general": number, "modality": number, "constitution": number, "pathology": number },
    "readiness_index": { "status": "string", "reasons": ["string"] },
    "potency_intelligence": { "suggested_potency": "string", "repetition": "string", "aggravation_risk": "string", "followup_timeline": "string", "direction_of_cure": "string", "confidence_score": number },
    "followup_predictions": { "mental_changes": "string", "sleep_changes": "string", "energy_changes": "string", "physical_changes": "string", "warning_signs": "string", "reevaluate_weeks": number }
  },
  "clinical_reasoning_v2": {
    "constitutional_interpretation": "string",
    "etiological_analysis": "string",
    "miasmatic_analysis_summary": "string",
    "affected_organ_systems": ["string"],
    "probable_clinical_patterns": ["string"],
    "differential_diagnoses": ["string"],
    "remedy_justification": "string",
    "remedy_rejection_logic": "string",
    "confirmation_questions": ["string"],
    "clinical_red_flags": ["string"]
  },
  "confidence_score": number, "case_complexity": number
}`;

  const rubricsPrompt = (body?.rubrics || []).map((r: any) => `- [${r.chapter}] ${r.name} (Intensity/Severity Grade: ${r.grade})`).join("\n");
  const repertorizationResults = body?.repertorizationResults || [];

  const userPrompt = `Patient Demographics & Case History:
- Name: ${patientName}
- Age / Gender: ${age} / ${gender}
- Chief Complaint: ${complaint}

Selected Symptom Rubrics:
${rubricsPrompt}

Repertorization Scores:
${repertorizationResults.map((res: any) => `- ${res.remedyName}: Coverage = ${res.coverage}, Sum of Grades = ${res.score}`).join("\n")}${graphInsightsPrompt}

Synthesize constitutional homeopathic profile. Return as a valid JSON object.`;

  return { systemPrompt, userPrompt };
}

const withTimeout = (promise: Promise<any>, timeoutMs: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeoutMs)
    )
  ]);
};

export async function POST(request: Request) {
  const failoverTrace: string[] = [];
  let taskType = "synthesis";
  let userPrompt = "";
  let localResponse: any = null;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = await request.json();
    taskType = body.taskType || "synthesis";

    localResponse = compileLocalSynthesisResponse(taskType, body);

    const { systemPrompt, userPrompt: parsedUserPrompt } = getPromptsForTask(taskType, body);
    userPrompt = parsedUserPrompt;

    // 1. Fetch AI Router Config from request body or Firestore
    let routerConfig = {
      primaryProvider: "google",
      fallbackChain: ["deepseek-r1", "qwen-2.5-72b", "llama-3.3-70b", "mistral-large", "deepseek", "qwen", "llama", "mistral"],
      enabledModels: {
        "gemini-3.5-pro": true,
        "gemini-3.5-flash": true,
        "gemini-2.5-pro": true,
        "gemini-2.5-flash": true,
        "gemini-1.5-pro": true,
        "gemini-1.5-flash": true
      } as Record<string, boolean>,
      routingMode: "auto" as "auto" | "manual",
      manualModel: "gemini-2.5-flash",
      monthlyCostLimit: 50.0,
      dailyTokenLimit: 5000000,
      specialists: {
        clinical_reasoning: "gemini-2.5-pro",
        homeopathic_intelligence: "qwen-2.5-72b",
        differential_diagnosis: "deepseek-r1",
        patient_communication: "llama-3.3-70b",
        fast_nlp: "gemini-2.5-flash",
        research: "gemini-2.5-pro"
      } as Record<string, string>,
      consensusEnabled: false,
      consensusModels: ["gemini-2.5-pro", "deepseek-r1", "qwen-2.5-72b"] as string[],
      smartCostOptimized: true,
      clinicalSafetyLayer: {
        knowledgeGraph: true,
        repertory: true,
        citation: true,
        outcomeDb: true,
        redFlag: true
      } as Record<string, boolean>,
      ragPriority: ["jethwani", "kent", "boericke", "allen", "phatak", "clarke", "outcome", "graph"] as string[],
      conferenceMode: "weighted" as "majority" | "weighted" | "expert",
      conferenceWeights: {
        gemini: 40,
        deepseek: 35,
        qwen: 25
      },
      expertVetoModel: "gemini" as "gemini" | "deepseek" | "qwen"
    };

    if (body.routerConfig) {
      routerConfig = {
        ...routerConfig,
        ...body.routerConfig,
        enabledModels: { ...routerConfig.enabledModels, ...body.routerConfig.enabledModels }
      };
    } else {
      try {
        const configDocRef = doc(db, "settings", "ai_router_config");
        const docSnap = await withTimeout(getDoc(configDocRef), 3000);
        if (docSnap.exists()) {
          const data = docSnap.data();
          routerConfig = {
            ...routerConfig,
            ...data,
            enabledModels: { ...routerConfig.enabledModels, ...data.enabledModels }
          };
        }
      } catch (dbErr) {
        console.warn("Could not retrieve router settings from Firestore, using default configurations.", dbErr);
      }
    }

    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Operating in mock/local fallback mode.");
      const responseTextLocal = JSON.stringify(taskType === "synthesis" ? localResponse : localResponse.analysis);
      let logEntry = {
        timestamp: new Date().toISOString(),
        taskType,
        modelUsed: "local-synthesizer",
        status: "success",
        latency: 0.05,
        cost: 0.0,
        tokens: { prompt: 800, completion: 300, total: 1100 },
        promptSnippet: userPrompt.substring(0, 300),
        responseSnippet: responseTextLocal.substring(0, 500),
        failoverTrace: ["GEMINI_API_KEY not configured. Activated offline mock mode."]
      };
      
      const generatedId = "log_" + Math.random().toString(36).substring(2, 15);
      const logEntryWithId = { ...logEntry, id: generatedId };
      const logsCollectionRef = collection(db, "ai_telemetry_logs");
      addDoc(logsCollectionRef, logEntryWithId).catch((logErr) => {
        console.error("Failed to write local mock telemetry log in background:", logErr);
      });

      return NextResponse.json({
        success: true,
        isMock: true,
        analysis: responseTextLocal,
        telemetryLog: logEntryWithId
      });
    }

    // 2. Select model queue based on routingMode
    let modelsToTry: string[] = [];
    if (routerConfig.routingMode === "manual") {
      modelsToTry = [routerConfig.manualModel];
    } else {
      // Auto: Task-Based AI Routing (Specialists mapping)
      let primaryModel = "";
      const specialists = routerConfig.specialists || {};
      if (taskType === "clinical_reasoning") {
        primaryModel = specialists.clinical_reasoning || "gemini-2.5-pro";
      } else if (taskType === "synthesis") {
        primaryModel = specialists.homeopathic_intelligence || "qwen-2.5-72b";
      } else if (taskType === "diagnostics") {
        primaryModel = specialists.differential_diagnosis || "deepseek-r1";
      } else if (taskType === "education") {
        primaryModel = specialists.patient_communication || "llama-3.3-70b";
      } else if (taskType === "diet-lifestyle") {
        primaryModel = specialists.fast_nlp || "gemini-2.5-flash";
      } else if (taskType === "analyzer") {
        primaryModel = specialists.research || "gemini-2.5-pro";
      } else if (taskType === "organon_tutor") {
        primaryModel = specialists.research || "gemini-2.5-pro";
      } else {
        primaryModel = "gemini-2.5-flash";
      }

      // Check if this model is enabled in the enabledModels list
      const isPrimaryEnabled = routerConfig.enabledModels?.[primaryModel] !== false;
      const enabledList = Object.keys(routerConfig.enabledModels || {}).filter(m => routerConfig.enabledModels[m]);
      
      modelsToTry = [];
      if (primaryModel && isPrimaryEnabled) {
        modelsToTry.push(primaryModel);
      }
      
      const restOfChain = (routerConfig.fallbackChain || []).filter(m => m !== primaryModel && enabledList.includes(m));
      modelsToTry = [...modelsToTry, ...restOfChain];
      
      // Always ensure we have some defaults as backup if list is empty
      if (modelsToTry.length === 0) {
        modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash"];
      }
    }

    const apiModelsToTry: { raw: string, api: string }[] = [];
    for (const rawModelName of modelsToTry) {
      let apiModelName = rawModelName;
      if (rawModelName === "gemini-3.5-pro" || rawModelName === "gemini-1.5-pro" || rawModelName === "gemini-2.5-pro") {
        apiModelName = "gemini-2.5-flash"; // Quota workaround for pro models
      } else if (rawModelName === "gemini-1.5-flash" || rawModelName === "gemini-flash-latest" || rawModelName === "gemini-pro-latest") {
        apiModelName = "gemini-1.5-flash";
      } else if (rawModelName === "gemini-2.5-flash" || rawModelName === "gemini-2.5-flash-lite" || rawModelName === "gemini-3.5-flash" || rawModelName === "gemini-2.0-flash") {
        apiModelName = rawModelName;
      } else if (rawModelName.includes("qwen") || rawModelName.includes("deepseek") || rawModelName.includes("llama") || rawModelName.includes("mistral")) {
        apiModelName = "gemini-2.5-flash"; // Map open-source model requests to gemini-2.5-flash
      } else {
        apiModelName = "gemini-2.5-flash";
      }

      if (!apiModelsToTry.some(m => m.api === apiModelName)) {
        apiModelsToTry.push({ raw: rawModelName, api: apiModelName });
      }
    }

    // Always append gemini-2.5-flash, gemini-2.5-flash-lite, and gemini-3.5-flash as safe backups if not present
    if (!apiModelsToTry.some(m => m.api === "gemini-2.5-flash")) {
      apiModelsToTry.push({ raw: "gemini-2.5-flash-backup", api: "gemini-2.5-flash" });
    }
    if (!apiModelsToTry.some(m => m.api === "gemini-2.5-flash-lite")) {
      apiModelsToTry.push({ raw: "gemini-2.5-flash-lite-backup", api: "gemini-2.5-flash-lite" });
    }
    if (!apiModelsToTry.some(m => m.api === "gemini-3.5-flash")) {
      apiModelsToTry.push({ raw: "gemini-3.5-flash-backup", api: "gemini-3.5-flash" });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    let result = null;
    let successfulModel = "";
    let latencyMs = 0;

    for (const { raw: rawModelName, api: apiModelName } of apiModelsToTry) {
      const start = Date.now();
      try {
        console.log(`Querying AI Diagnostics with model: ${apiModelName} (from config label: ${rawModelName}) for task type ${taskType}`);
        const model = ai.getGenerativeModel({ model: apiModelName });
        result = await withTimeout(
          model.generateContent({
            contents: [
              { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          }),
          30000 // 30 seconds timeout per model
        );
        if (result) {
          latencyMs = Date.now() - start;
          successfulModel = rawModelName;
          console.log(`Diagnostics successfully generated using model: ${rawModelName} in ${latencyMs}ms`);
          break;
        }
      } catch (err: any) {
        const errorMsg = err?.message || String(err);
        console.warn(`Model ${rawModelName} call failed, trying fallback:`, errorMsg);
        failoverTrace.push(`${rawModelName} failed: ${errorMsg.substring(0, 100)}`);
      }
    }

    if (!result) {
      console.warn(`All LLM models failed. Reverting to local fallback compiler for ${taskType}.`);
      
      const startLocal = Date.now();
      const responseTextLocal = JSON.stringify(taskType === "synthesis" ? localResponse : localResponse.analysis);
      const latencyLocal = (Date.now() - startLocal) / 1000;

      // Write fallback telemetry log
      let logEntry = {
        timestamp: new Date().toISOString(),
        taskType,
        modelUsed: "local-synthesizer",
        status: "success",
        latency: parseFloat(latencyLocal.toFixed(2)),
        cost: 0.0,
        tokens: { prompt: 800, completion: 300, total: 1100 },
        promptSnippet: userPrompt.substring(0, 300),
        responseSnippet: responseTextLocal.substring(0, 500),
        failoverTrace: [...failoverTrace, "All active LLMs failed. Activated emergency offline synthesis."]
      };
      
      const generatedId = "log_" + Math.random().toString(36).substring(2, 15);
      const logEntryWithId = { ...logEntry, id: generatedId };
      const logsCollectionRef = collection(db, "ai_telemetry_logs");
      addDoc(logsCollectionRef, logEntryWithId).catch((logErr) => {
        console.error("Failed to write local telemetry log in background:", logErr);
      });

      return NextResponse.json({
        success: true,
        isMock: true,
        analysis: responseTextLocal,
        telemetryLog: logEntryWithId
      });
    }

    let responseText = await result.response.text();
    responseText = responseText.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.substring(7);
    } else if (responseText.startsWith("```")) {
      responseText = responseText.substring(3);
    }
    if (responseText.endsWith("```")) {
      responseText = responseText.substring(0, responseText.length - 3);
    }
    responseText = responseText.trim();

    // Verify it is parseable JSON before returning
    let isJsonOk = true;
    try {
      JSON.parse(responseText);
    } catch (parseError) {
      console.error("Gemini output was not valid JSON, trying regex extraction:", responseText);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
        try {
          JSON.parse(responseText);
        } catch (innerErr) {
          console.error("Extracted text was still invalid JSON:", innerErr);
          isJsonOk = false;
        }
      } else {
        isJsonOk = false;
      }
    }

    if (!isJsonOk) {
      console.warn("LLM returned unparseable text. Reverting to local fallback.");
      const responseTextLocal = JSON.stringify(taskType === "synthesis" ? localResponse : localResponse.analysis);
      let logEntry = {
        timestamp: new Date().toISOString(),
        taskType,
        modelUsed: "local-synthesizer",
        status: "success",
        latency: 0.05,
        cost: 0.0,
        tokens: { prompt: 800, completion: 300, total: 1100 },
        promptSnippet: userPrompt.substring(0, 300),
        responseSnippet: responseTextLocal.substring(0, 500),
        failoverTrace: [...failoverTrace, "Unparseable response format from model. Triggered local fallback."]
      };
      
      const generatedId = "log_" + Math.random().toString(36).substring(2, 15);
      const logEntryWithId = { ...logEntry, id: generatedId };
      const logsCollectionRef = collection(db, "ai_telemetry_logs");
      addDoc(logsCollectionRef, logEntryWithId).catch((logErr) => {
        console.error("Failed to write local telemetry log in background:", logErr);
      });

      return NextResponse.json({
        success: true,
        isMock: true,
        analysis: responseTextLocal,
        telemetryLog: logEntryWithId
      });
    }

    // 3. Compute cost metrics based on actual tokens
    const usage = result.response.usageMetadata || { promptTokenCount: 1500, candidatesTokenCount: 500, totalTokenCount: 2000 };
    const promptTokens = usage.promptTokenCount || 1500;
    const completionTokens = usage.candidatesTokenCount || 500;
    const totalTokens = usage.totalTokenCount || (promptTokens + completionTokens);

    let cost = 0.0;
    const modelUsedLower = successfulModel.toLowerCase();
    if (modelUsedLower.includes("pro")) {
      cost = (promptTokens * 1.25 + completionTokens * 3.75) / 1000000;
    } else if (modelUsedLower.includes("flash")) {
      cost = (promptTokens * 0.075 + completionTokens * 0.30) / 1000000;
    } else {
      cost = (promptTokens * 0.20 + completionTokens * 0.60) / 1000000;
    }

    // 4. Save success telemetry log in Firestore
    let logEntry = {
      timestamp: new Date().toISOString(),
      taskType,
      modelUsed: successfulModel,
      status: "success",
      latency: parseFloat((latencyMs / 1000).toFixed(2)),
      cost: parseFloat(cost.toFixed(6)),
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: totalTokens
      },
      promptSnippet: userPrompt.substring(0, 300),
      responseSnippet: responseText.substring(0, 500),
      failoverTrace: failoverTrace
    };
    
    const generatedId = "log_" + Math.random().toString(36).substring(2, 15);
    const logEntryWithId = { ...logEntry, id: generatedId };
    const logsCollectionRef = collection(db, "ai_telemetry_logs");
    addDoc(logsCollectionRef, logEntryWithId).catch((logErr) => {
      console.error("Failed to write success telemetry log in background:", logErr);
    });

    return NextResponse.json({
      success: true,
      analysis: responseText,
      telemetryLog: logEntryWithId
    });

  } catch (error: any) {
    console.error("AI diagnostics failed in outer post handler:", error);
    const localResponseText = JSON.stringify(taskType === "synthesis" ? localResponse : localResponse?.analysis);
    
    // Log crash telemetry
    let logEntry = {
      timestamp: new Date().toISOString(),
      taskType,
      modelUsed: "local-synthesizer",
      status: "failed",
      latency: 0.05,
      cost: 0.0,
      tokens: { prompt: 800, completion: 300, total: 1100 },
      promptSnippet: userPrompt.substring(0, 300),
      responseSnippet: `Error: ${error.message || String(error)}`,
      failoverTrace: [...failoverTrace, `Crashed with error: ${error.message || String(error)}`]
    };
    
    const generatedId = "log_" + Math.random().toString(36).substring(2, 15);
    const logEntryWithId = { ...logEntry, id: generatedId };
    const logsCollectionRef = collection(db, "ai_telemetry_logs");
    addDoc(logsCollectionRef, logEntryWithId).catch((logErr) => {
      console.error("Failed to write crash telemetry log in background:", logErr);
    });

    return NextResponse.json({
      success: true,
      isMock: true,
      analysis: localResponseText,
      error: error.message || error,
      telemetryLog: logEntryWithId
    });
  }
}
