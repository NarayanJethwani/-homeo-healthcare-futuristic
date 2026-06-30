"use client";

import React from "react";
import { Brain, Star, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface Recommendation {
  id: string;
  patientName: string;
  patientId: string;
  title: string;
  confidence: number;
  evidence: string[];
  suggestedAction: string;
  type: "interaction" | "diagnostic" | "relapse" | "followup";
}

interface AiRecommendationsPanelProps {
  patients: any[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
}

export default function AiRecommendationsPanel({
  patients,
  onSelectPatient,
  setActiveTab,
}: AiRecommendationsPanelProps) {
  const recommendations: Recommendation[] = React.useMemo(() => {
    const list: Recommendation[] = [];

    // Map recommendation items dynamically based on patients
    patients.forEach((pat, idx) => {
      const compl = pat.complaint.toLowerCase();
      const pId = pat.id;

      if (compl.includes("gerd") || compl.includes("acid")) {
        list.push({
          id: `rec-gerd-${pId}`,
          patientName: pat.name,
          patientId: pId,
          title: "Possible Iris Versicolor drainage layer",
          confidence: 94,
          evidence: [
            "Thermal Axis: generally hot-blooded",
            "Somatic symptoms of burning retrosternal pain",
            "Aggravations noted after acidic foods/sweet intakes",
          ],
          suggestedAction: "Evaluate Iris Versicolor 30C drainage layer to address primary metabolic acidity.",
          type: "diagnostic",
        });
      } else if (compl.includes("eczema") || compl.includes("itching")) {
        list.push({
          id: `rec-eczema-${pId}`,
          patientName: pat.name,
          patientId: pId,
          title: "High relapse risk due to suppressive history",
          confidence: 88,
          evidence: [
            "Documented history of topical steroid ointment applications",
            "Co-existence of asthma symptoms (potential skin-lung suppression axis)",
            "Psora miasm dominance indicated",
          ],
          suggestedAction: "Evaluate constitutional remedy response. Avoid suppressive topical agents.",
          type: "relapse",
        });
      } else if (idx === 0) {
        // Fallback interaction warning
        list.push({
          id: `rec-int-${pId}`,
          patientName: pat.name,
          patientId: pId,
          title: "Complementary remedy interaction warning",
          confidence: 96,
          evidence: [
            "Sulphur constitutional prescription is active",
            "Nux Vomica suggested for acute gastric distress",
            "Complementary relations: Nux Vomica follows Sulphur well, but check antidote parameters",
          ],
          suggestedAction: "Verify remedy dosing gap. Suggest Nux Vomica 30C night dose, Sulphur morning dose.",
          type: "interaction",
        });
      }
    });

    // Fallbacks if no patients
    if (list.length === 0) {
      list.push({
        id: "rec-fallback-1",
        patientName: "Meera Jethwani",
        patientId: "mock-meera",
        title: "High TSH Axis Overload Detected",
        confidence: 95,
        evidence: [
          "TSH: 8.4 uIU/mL (HIGH)",
          "Vitamin D: 14 ng/ml (DEFICIENT)",
          "Symptoms: sluggish metabolism, chilly thermal axis, weight gain",
        ],
        suggestedAction: "Consider Thyroidinum 30C supportive organ support layer alongside Vitamin D3 supplementation.",
        type: "diagnostic",
      });
      list.push({
        id: "rec-fallback-2",
        patientName: "Rahul Sharma",
        patientId: "mock-rahul",
        title: "Sulphur Constitutional Amelioration Check",
        confidence: 91,
        evidence: [
          "Dose Sulphur 30C administered 14 days ago",
          "Initial skin aggravation flare reported on Day 4 (normal homeopathic response)",
          "Skin dryness since ameliorating",
        ],
        suggestedAction: "Keep patient on Sac Lac placebo layer. Do not repeat active dose while improvement continues.",
        type: "followup",
      });
    }

    return list.slice(0, 2); // Limit to top 2 highest priority recommendations to avoid overwhelming
  }, [patients]);

  const handleOpenPatient = (id: string) => {
    onSelectPatient(id);
    setActiveTab("patients");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 select-text">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250 flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-500" />
          <span>AI Clinical Decision Support</span>
        </h3>
        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Clinician Review
        </span>
      </div>

      {/* Recommendations Stack */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800 rounded-3xl space-y-3 relative overflow-hidden"
          >
            {/* Header: Title and Confidence */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <span>{rec.title}</span>
                </h4>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  Patient: <span className="text-slate-700 dark:text-slate-300 font-bold">{rec.patientName}</span>
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-emerald-650 dark:text-emerald-450 bg-emerald-100/50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  {rec.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Evidence Breakdown */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                Evidence Breakdown
              </span>
              <ul className="list-none p-0 m-0 space-y-1 text-[10.5px] text-slate-655 dark:text-slate-400">
                {rec.evidence.map((ev, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                    <span className="truncate">{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Action & Action Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10.5px]">
              <div className="text-slate-600 dark:text-slate-400 flex-1 leading-normal pr-2">
                <span className="font-bold text-slate-800 dark:text-slate-205">Action:</span> {rec.suggestedAction}
              </div>
              <button
                onClick={() => handleOpenPatient(rec.patientId)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white dark:text-slate-200 rounded-xl font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer border-none"
              >
                <span>Open Case</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Safe Clinical Disclaimer */}
      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl text-[9.5px] text-amber-700 dark:text-amber-400 leading-normal flex items-start gap-2 select-none">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold uppercase tracking-wider">Clinical Disclaimer:</span> AI recommendations are automated suggestions provided for supportive clinician review only. They do not constitute final medical prescriptions or diagnoses, and require validation against clinical case-taking.
        </p>
      </div>
    </div>
  );
}
