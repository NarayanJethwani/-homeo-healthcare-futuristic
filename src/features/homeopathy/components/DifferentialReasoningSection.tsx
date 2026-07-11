import React from "react";
import { DifferentialRubricReasoning, TotalitySymptom, SelectedRubric } from "../domain/homeopathy.types";
import { toDifferentialReasoningId } from "../../../shared/domain/identifiers";
import { Scale, Info, Plus } from "lucide-react";

interface DifferentialReasoningSectionProps {
  differentialReasoning: DifferentialRubricReasoning[];
  totalitySymptoms: TotalitySymptom[];
  selectedRubrics: SelectedRubric[];
  onChange: (updated: DifferentialRubricReasoning[]) => void;
}

export function DifferentialReasoningSection({
  differentialReasoning,
  totalitySymptoms,
  selectedRubrics,
  onChange
}: DifferentialReasoningSectionProps) {

  const handleCreateReasoning = (symptomId: string) => {
    const exists = differentialReasoning.some(d => d.sourceSymptomId === symptomId);
    if (exists) return;

    const newDiff: DifferentialRubricReasoning = {
      id: toDifferentialReasoningId(`dr_${Math.random().toString(36).substring(2, 11)}`),
      sourceSymptomId: symptomId as any,
      interpretation: "",
      candidateRubricIds: [],
      rejectedRubricIds: [],
      rejectionRationales: {}
    };

    onChange([...differentialReasoning, newDiff]);
  };

  const handleUpdateItem = (id: string, fields: Partial<DifferentialRubricReasoning>) => {
    const updated = differentialReasoning.map(d => {
      if (d.id === id) {
        return { ...d, ...fields };
      }
      return d;
    });
    onChange(updated);
  };

  const handleToggleCandidate = (id: string, item: DifferentialRubricReasoning, rubricId: string) => {
    const currentCandidates = item.candidateRubricIds || [];
    const exists = currentCandidates.includes(rubricId as any);

    const updatedCandidates = exists 
      ? currentCandidates.filter(rid => rid !== rubricId) 
      : [...currentCandidates, rubricId as any];

    handleUpdateItem(id, { candidateRubricIds: updatedCandidates });
  };

  const handleToggleRejected = (id: string, item: DifferentialRubricReasoning, rubricId: string, rationaleText: string) => {
    const currentRejected = item.rejectedRubricIds || [];
    const exists = currentRejected.includes(rubricId as any);

    const updatedRejected = exists 
      ? currentRejected.filter(rid => rid !== rubricId) 
      : [...currentRejected, rubricId as any];

    const updatedRationales = { ...item.rejectionRationales };
    if (!exists) {
      updatedRationales[rubricId] = rationaleText;
    } else {
      delete updatedRationales[rubricId];
    }

    handleUpdateItem(id, {
      rejectedRubricIds: updatedRejected,
      rejectionRationales: updatedRationales
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" /> Differential Rubric Reasoning
        </h3>
        <p className="text-xs text-slate-500 mt-1">Compare candidate rubrics, record clinical interpretations, and document reasons for selecting or rejecting alternative rubrics.</p>
      </div>

      <div className="space-y-4">
        {/* Trigger additions of new comparison entries */}
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl">
          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">Initialize Differential Reasoning for Totality Symptoms</label>
          <div className="flex gap-2 flex-wrap">
            {totalitySymptoms.map(ts => {
              const hasEntry = differentialReasoning.some(d => d.sourceSymptomId === ts.sourceSymptomId);
              return (
                <button
                  key={ts.id}
                  type="button"
                  disabled={hasEntry}
                  onClick={() => handleToggleSymptom(ts.sourceSymptomId)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors border ${
                    hasEntry 
                      ? "bg-slate-900 border-slate-850 text-slate-600 cursor-not-allowed" 
                      : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                  }`}
                >
                  + {ts.sourceSnapshot.normalizedName}
                </button>
              );
            })}
          </div>
        </div>

        {/* List of Differential Rubric Reasoning Panels */}
        {differentialReasoning.length > 0 ? (
          <div className="space-y-4">
            {differentialReasoning.map(item => {
              const symptom = totalitySymptoms.find(ts => ts.sourceSymptomId === item.sourceSymptomId);
              if (!symptom) return null;

              return (
                <div key={item.id} className="bg-slate-900 border border-slate-850 p-5 rounded-xl space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-emerald-400">{symptom.sourceSnapshot.normalizedName}</h4>
                    <p className="text-[10px] text-slate-500 italic mt-0.5">"{symptom.sourceSnapshot.patientWording}"</p>
                  </div>

                  <div>
                    <label htmlFor={`interp-${item.id}`} className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Clinical Interpretation</label>
                    <textarea
                      id={`interp-${item.id}`}
                      rows={2}
                      value={item.interpretation}
                      onChange={e => handleUpdateItem(item.id, { interpretation: e.target.value })}
                      placeholder="Write how this symptom expresses the patient's individual state or miasmatic path..."
                      className="w-full bg-slate-950 border border-slate-850 rounded p-2.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Select Candidate Rubrics to Compare</label>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto bg-slate-950 border border-slate-850 p-2.5 rounded">
                      {selectedRubrics.map(rubric => {
                        const isCandidate = (item.candidateRubricIds || []).includes(rubric.rubricId);
                        const isRejected = (item.rejectedRubricIds || []).includes(rubric.rubricId);
                        const rejectionRationale = item.rejectionRationales[rubric.rubricId] || "";

                        return (
                          <div key={rubric.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-slate-900 border border-slate-850 rounded">
                            <div>
                              <span className="text-[10px] text-slate-355 font-bold block">{rubric.displayText}</span>
                              <span className="text-[9px] text-slate-550 block">{rubric.chapter} &gt; {rubric.rubricPath.join(" &gt; ")}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Toggle candidate */}
                              <button
                                type="button"
                                onClick={() => handleToggleCandidate(item.id, item, rubric.rubricId)}
                                className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                                  isCandidate 
                                    ? "bg-emerald-950 border-emerald-800 text-emerald-400" 
                                    : "bg-slate-950 border-slate-850 text-slate-500"
                                }`}
                              >
                                Candidate
                              </button>

                              {/* Toggle reject */}
                              {isCandidate && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleRejected(item.id, item, rubric.rubricId, "Excludes clinical state")}
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                                      isRejected 
                                        ? "bg-rose-955 border-rose-950 text-rose-450" 
                                        : "bg-slate-955 border-slate-850 text-slate-500"
                                    }`}
                                  >
                                    Reject
                                  </button>

                                  {isRejected && (
                                    <input
                                      type="text"
                                      value={rejectionRationale}
                                      onChange={e => {
                                        const updatedRationales = { ...item.rejectionRationales, [rubric.rubricId]: e.target.value };
                                        handleUpdateItem(item.id, { rejectionRationales: updatedRationales });
                                      }}
                                      placeholder="Reason for rejection..."
                                      className="bg-slate-950 border border-slate-850 rounded px-2 py-0.5 text-[9px] focus:outline-none w-[120px]"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`notes-${item.id}`} className="block text-[9px] text-slate-505 font-bold uppercase mb-1">Clinician Differential Notes</label>
                    <textarea
                      id={`notes-${item.id}`}
                      rows={2}
                      value={item.clinicianNotes || ""}
                      onChange={e => handleUpdateItem(item.id, { clinicianNotes: e.target.value })}
                      placeholder="Write details comparing modalities, causation nuances, or matching remedies..."
                      className="w-full bg-slate-950 border border-slate-850 rounded p-2.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-550 italic">Initialize differential reasoning comparing your totality symptoms rubrics.</p>
        )}
      </div>
    </div>
  );

  // Fallback trigger helper
  function handleToggleSymptom(symptomId: string) {
    handleCreateReasoning(symptomId);
  }
}
