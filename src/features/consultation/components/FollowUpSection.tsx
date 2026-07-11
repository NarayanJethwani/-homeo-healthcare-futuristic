import React, { useState } from "react";
import { FollowUpClinicalIntake, SymptomRecord, FollowUpSymptomUpdate } from "../domain/consultation.types";
import { toSymptomId } from "../../../shared/domain/identifiers";
import { Plus, Trash2, Heart } from "lucide-react";

interface FollowUpSectionProps {
  followUpDetails?: FollowUpClinicalIntake;
  chiefComplaints: SymptomRecord[];
  onChange: (updated: FollowUpClinicalIntake) => void;
}

export function FollowUpSection({ followUpDetails, chiefComplaints, onChange }: FollowUpSectionProps) {
  // If undefined, initialize default empty follow up structure
  const details = followUpDetails || {
    responseSincePreviousTreatment: "",
    symptomUpdates: [],
    newSymptoms: [],
    currentAssessment: "",
    updatedPlanNotes: ""
  };

  const [newSymptomWording, setNewSymptomWording] = useState("");
  const [newSymptomNormalized, setNewSymptomNormalized] = useState("");

  const updateField = (key: keyof FollowUpClinicalIntake, value: any) => {
    onChange({
      ...details,
      [key]: value
    });
  };

  const handleSymptomChangeStatus = (symId: string, status: any) => {
    const symptom = chiefComplaints.find(s => s.id === symId);
    if (!symptom) return;

    const currentUpdates = details.symptomUpdates || [];
    const existingIdx = currentUpdates.findIndex(u => u.symptomId === symId);

    const updated = [...currentUpdates];
    const newUpdate: FollowUpSymptomUpdate = {
      symptomId: toSymptomId(symId),
      patientWording: symptom.patientWording,
      normalizedName: symptom.normalizedName,
      changeStatus: status
    };

    if (existingIdx >= 0) {
      updated[existingIdx] = newUpdate;
    } else {
      updated.push(newUpdate);
    }

    updateField("symptomUpdates", updated);
  };

  const handleAddNewSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptomWording.trim() || !newSymptomNormalized.trim()) return;

    const record: SymptomRecord = {
      id: toSymptomId(`sym_${Math.random().toString(36).substring(2, 11)}`),
      patientWording: newSymptomWording.trim(),
      normalizedName: newSymptomNormalized.trim(),
      aggravations: [],
      ameliorations: [],
      concomitants: [],
      causation: [],
      isCharacteristic: false
    };

    updateField("newSymptoms", [...(details.newSymptoms || []), record]);
    setNewSymptomWording("");
    setNewSymptomNormalized("");
  };

  const handleRemoveNewSymptom = (id: string) => {
    updateField("newSymptoms", (details.newSymptoms || []).filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100">Follow-up Assessment</h3>
        <p className="text-xs text-slate-500 mt-1">Record responses to previous prescriptions, symptom updates, and current assessment plans.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="responseSummary" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
            Response since previous treatment <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="responseSummary"
            rows={3}
            value={details.responseSincePreviousTreatment}
            onChange={e => updateField("responseSincePreviousTreatment", e.target.value)}
            placeholder="Describe action of the remedy, aggravation levels, or general improvements..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none placeholder-slate-650"
            required
          />
        </div>

        {/* Existing Symptoms status updates */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Track Chief Complaint Progress</label>
          {chiefComplaints.length > 0 ? (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {chiefComplaints.map(s => {
                const update = (details.symptomUpdates || []).find(u => u.symptomId === s.id);
                return (
                  <div key={s.id} className="bg-slate-950 border border-slate-950 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{s.normalizedName}</p>
                      <p className="text-[10px] text-slate-500 italic mt-0.5">"{s.patientWording}"</p>
                    </div>
                    <select
                      value={update ? update.changeStatus : ""}
                      onChange={e => handleSymptomChangeStatus(s.id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-[11px] text-slate-350 px-2 py-1 rounded focus:outline-none"
                    >
                      <option value="">Track status...</option>
                      <option value="better">Better (Improved)</option>
                      <option value="no_change">No Change</option>
                      <option value="worse">Worse (Aggravated)</option>
                      <option value="resolved">Resolved</option>
                      <option value="new_pattern">New Pattern</option>
                    </select>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-550 italic">No existing chief complaints loaded to track progress on.</p>
          )}
        </div>

        {/* New Symptoms that popped up */}
        <div className="border-t border-slate-900 pt-4">
          <label className="block text-[10px] text-slate-550 font-bold uppercase mb-2">New Symptoms / Reactions</label>
          {(details.newSymptoms || []).length > 0 && (
            <div className="space-y-2 mb-3">
              {(details.newSymptoms || []).map(ns => (
                <div key={ns.id} className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{ns.normalizedName}</p>
                    <p className="text-[10px] text-slate-500 italic">"{ns.patientWording}"</p>
                  </div>
                  <button type="button" onClick={() => handleRemoveNewSymptom(ns.id)} className="p-1 text-slate-650 hover:text-rose-400 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddNewSymptom} className="flex gap-2">
            <input
              type="text"
              placeholder="Patient verbatim description"
              value={newSymptomWording}
              onChange={e => setNewSymptomWording(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none"
            />
            <input
              type="text"
              placeholder="Normalized rubric"
              value={newSymptomNormalized}
              onChange={e => setNewSymptomNormalized(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none"
            />
            <button type="submit" className="px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] text-slate-350 hover:bg-slate-800 font-bold rounded cursor-pointer">
              Add New
            </button>
          </form>
        </div>

        <div className="border-t border-slate-900 pt-4">
          <label htmlFor="assessment" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
            Current Clinical Assessment <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="assessment"
            rows={3}
            value={details.currentAssessment}
            onChange={e => updateField("currentAssessment", e.target.value)}
            placeholder="Write clinical diagnosis assessment, miasmatic evaluation, or potency direction..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none placeholder-slate-650"
            required
          />
        </div>

        <div>
          <label htmlFor="planNotes" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Updated Plan Notes</label>
          <textarea
            id="planNotes"
            rows={2}
            value={details.updatedPlanNotes || ""}
            onChange={e => updateField("updatedPlanNotes", e.target.value)}
            placeholder="Instructions for dosage, diet constraints (avoid coffee/perfumes), or next visit..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none placeholder-slate-650"
          />
        </div>
      </div>
    </div>
  );
}
