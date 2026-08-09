"use client";

import React, { useState } from "react";
import {
  StructuredClinicalNotes,
  ChiefComplaintItem,
  ThermalState,
  MiasmaticState,
} from "../types/clinical-notes.types";
import { evaluateCompletionReadiness } from "../utils/consultation-validation";
import { ConsultationOutcome } from "../domain/consultation.types";

interface ClinicalNotesPanelProps {
  notes: StructuredClinicalNotes;
  onChange: (updatedNotes: StructuredClinicalNotes) => void;
  outcome?: ConsultationOutcome;
  readOnly?: boolean;
}

export function ClinicalNotesPanel({
  notes,
  onChange,
  outcome,
  readOnly = false,
}: ClinicalNotesPanelProps) {
  const [activeTab, setActiveTab] = useState<"complaints" | "physical" | "mental" | "vitals">("complaints");

  const readiness = evaluateCompletionReadiness(outcome, notes);

  // --- Chief Complaints Handlers ---
  const handleAddComplaint = () => {
    const newItem: ChiefComplaintItem = {
      id: `cc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      complaint: "",
      severity: "moderate",
    };
    onChange({
      ...notes,
      chiefComplaints: [...notes.chiefComplaints, newItem],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateComplaint = (id: string, updates: Partial<ChiefComplaintItem>) => {
    const updated = notes.chiefComplaints.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    onChange({
      ...notes,
      chiefComplaints: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRemoveComplaint = (id: string) => {
    onChange({
      ...notes,
      chiefComplaints: notes.chiefComplaints.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  // --- Vitals BMI Calculator ---
  const handleVitalChange = (field: string, val: number | undefined) => {
    const updatedVitals = { ...notes.vitals, [field]: val, recordedAt: new Date().toISOString() };
    if (updatedVitals.weightKg && updatedVitals.heightCm && updatedVitals.heightCm > 0) {
      const heightM = updatedVitals.heightCm / 100;
      updatedVitals.bmiCalculated = Number((updatedVitals.weightKg / (heightM * heightM)).toFixed(1));
    }
    onChange({
      ...notes,
      vitals: updatedVitals,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Panel Header & Navigation Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Structured Clinical Notes
          </h2>
        </div>
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === "complaints"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Complaints & HPI ({notes.chiefComplaints.length})
          </button>
          <button
            onClick={() => setActiveTab("physical")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === "physical"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Physical Generals
          </button>
          <button
            onClick={() => setActiveTab("mental")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === "mental"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Mind & Miasm
          </button>
          <button
            onClick={() => setActiveTab("vitals")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === "vitals"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Vitals
          </button>
        </div>
      </div>

      {/* Completion Readiness Summary Bar */}
      {(() => {
        const allErrors = [...readiness.clinicalValidationErrors, ...readiness.prescriptionValidationErrors];
        return (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
              readiness.ready
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                : "bg-amber-950/40 border-amber-800/60 text-amber-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{readiness.ready ? "✅ Documentation Complete" : "⚠️ Requirements Remaining:"}</span>
              {!readiness.ready && (
                <span className="font-mono text-amber-400">
                  {allErrors.join(" • ")}
                </span>
              )}
            </div>
            <span className="text-slate-400 text-[10px]">
              Last modified: {notes.updatedAt ? new Date(notes.updatedAt).toLocaleTimeString() : "Not saved"}
            </span>
          </div>
        );
      })()}

      {/* Main Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Chief Complaints & HPI */}
        {activeTab === "complaints" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Chief Complaints
                </h3>
                {!readOnly && (
                  <button
                    onClick={handleAddComplaint}
                    className="px-2.5 py-1 text-xs font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-md transition-colors"
                  >
                    + Add Complaint
                  </button>
                )}
              </div>

              {notes.chiefComplaints.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  No chief complaints recorded yet. Click &quot;+ Add Complaint&quot; above.
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.chiefComplaints.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                        <input
                          type="text"
                          disabled={readOnly}
                          value={item.complaint}
                          onChange={(e) => handleUpdateComplaint(item.id, { complaint: e.target.value })}
                          placeholder="e.g. Throbbing frontal headache aggravates 3 PM"
                          className="flex-1 px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                        <select
                          disabled={readOnly}
                          value={item.severity}
                          onChange={(e) =>
                            handleUpdateComplaint(item.id, {
                              severity: e.target.value as ChiefComplaintItem["severity"],
                            })
                          }
                          className="px-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                          <option value="unbearable">Unbearable</option>
                        </select>
                        {!readOnly && (
                          <button
                            onClick={() => handleRemoveComplaint(item.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors text-xs"
                            title="Remove complaint"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          disabled={readOnly}
                          value={item.location || ""}
                          onChange={(e) => handleUpdateComplaint(item.id, { location: e.target.value })}
                          placeholder="Location / Organs"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder:text-slate-600"
                        />
                        <input
                          type="text"
                          disabled={readOnly}
                          value={item.sensation || ""}
                          onChange={(e) => handleUpdateComplaint(item.id, { sensation: e.target.value })}
                          placeholder="Sensation / Character"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder:text-slate-600"
                        />
                        <input
                          type="text"
                          disabled={readOnly}
                          value={item.modalityAggravation || ""}
                          onChange={(e) =>
                            handleUpdateComplaint(item.id, { modalityAggravation: e.target.value })
                          }
                          placeholder="Aggravation (<)"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder:text-slate-600"
                        />
                        <input
                          type="text"
                          disabled={readOnly}
                          value={item.modalityAmelioration || ""}
                          onChange={(e) =>
                            handleUpdateComplaint(item.id, { modalityAmelioration: e.target.value })
                          }
                          placeholder="Amelioration (>)"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                History of Present Illness (HPI)
              </label>
              <textarea
                disabled={readOnly}
                rows={4}
                value={notes.historyOfPresentIllness}
                onChange={(e) =>
                  onChange({
                    ...notes,
                    historyOfPresentIllness: e.target.value,
                    updatedAt: new Date().toISOString(),
                  })
                }
                placeholder="Document detailed onset, course, causation, prior treatment, and constitutional totality..."
                className="w-full p-3 text-xs bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Physical Generals */}
        {activeTab === "physical" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Thirst</label>
                <select
                  disabled={readOnly}
                  value={notes.physicalGenerals.thirst || "normal"}
                  onChange={(e) =>
                    onChange({
                      ...notes,
                      physicalGenerals: { ...notes.physicalGenerals, thirst: e.target.value as any },
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                >
                  <option value="normal">Normal</option>
                  <option value="absent">Thirstless (Thirst Absent)</option>
                  <option value="small_quantity_frequent">Small quantities, frequent</option>
                  <option value="large_quantity_infrequent">Large quantities, long intervals</option>
                  <option value="unquenchable">Unquenchable</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Perspiration / Sweat</label>
                <select
                  disabled={readOnly}
                  value={notes.physicalGenerals.sweat || "normal"}
                  onChange={(e) =>
                    onChange({
                      ...notes,
                      physicalGenerals: { ...notes.physicalGenerals, sweat: e.target.value as any },
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                >
                  <option value="normal">Normal</option>
                  <option value="profuse">Profuse</option>
                  <option value="scanty">Scanty</option>
                  <option value="offensive">Offensive / Malodorous</option>
                  <option value="staining">Staining Linen</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Food Cravings</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={notes.physicalGenerals.cravings?.join(", ") || ""}
                  onChange={(e) =>
                    onChange({
                      ...notes,
                      physicalGenerals: {
                        ...notes.physicalGenerals,
                        cravings: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  placeholder="e.g. Sweets, Salt, Warm drinks, Acids"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Food Aversions</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={notes.physicalGenerals.aversions?.join(", ") || ""}
                  onChange={(e) =>
                    onChange({
                      ...notes,
                      physicalGenerals: {
                        ...notes.physicalGenerals,
                        aversions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  placeholder="e.g. Fats, Milk, Meat, Bread"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Sleep & Dreams</label>
              <textarea
                disabled={readOnly}
                rows={2}
                value={notes.physicalGenerals.sleep || ""}
                onChange={(e) =>
                  onChange({
                    ...notes,
                    physicalGenerals: { ...notes.physicalGenerals, sleep: e.target.value },
                    updatedAt: new Date().toISOString(),
                  })
                }
                placeholder="Sleep position, unrefreshing sleep, nightmare themes..."
                className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Mental Generals & Miasm */}
        {activeTab === "mental" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Thermal State</label>
                <select
                  disabled={readOnly}
                  value={notes.thermalState}
                  onChange={(e) =>
                    onChange({
                      ...notes,
                      thermalState: e.target.value as ThermalState,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                >
                  <option value="ambithermal">Ambithermal (Neither Hot nor Chilly)</option>
                  <option value="chilly">Chilly Patient (&lt; Cold)</option>
                  <option value="hot">Hot Patient (&lt; Heat)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Miasmatic Expression</label>
                <select
                  disabled={readOnly}
                  value={notes.miasmaticExpression}
                  onChange={(e) =>
                    onChange({
                      ...notes,
                      miasmaticExpression: e.target.value as MiasmaticState,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                >
                  <option value="mixed">Mixed Miasmatic State</option>
                  <option value="psora">Psora (Functional / Hypersensitive)</option>
                  <option value="sycosis">Sycosis (Overgrowth / Infiltration)</option>
                  <option value="syphilis">Syphilis (Destructive / Ulcerative)</option>
                  <option value="tubercular">Tubercular (Rapid Change / Hemorrhagic)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Temperament & Disposition</label>
              <select
                disabled={readOnly}
                value={notes.mentalGenerals.temperament || "mild_yielding"}
                onChange={(e) =>
                  onChange({
                    ...notes,
                    mentalGenerals: { ...notes.mentalGenerals, temperament: e.target.value as any },
                    updatedAt: new Date().toISOString(),
                  })
                }
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
              >
                <option value="mild_yielding">Mild, Gentle & Yielding (Pulsatilla)</option>
                <option value="irritable">Irritable & Fastidious (Nux Vomica / Arsenicum)</option>
                <option value="reserved">Reserved, Grief & Taciturn (Ignatia / Natrum Mur)</option>
                <option value="restless">Restless & Anxious (Arsenicum / Aconite)</option>
                <option value="depressed">Depressed, Indifferent (Sepia / Phosphoric Acid)</option>
                <option value="obstinate">Obstinate & Headstrong (Calcarea Carb)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Mind State & Emotional Totality</label>
              <textarea
                disabled={readOnly}
                rows={3}
                value={notes.mentalGenerals.mindState || ""}
                onChange={(e) =>
                  onChange({
                    ...notes,
                    mentalGenerals: { ...notes.mentalGenerals, mindState: e.target.value },
                    updatedAt: new Date().toISOString(),
                  })
                }
                placeholder="Dominant emotion, fears, anxieties, consolation response..."
                className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Patient Vitals */}
        {activeTab === "vitals" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={notes.vitals.bloodPressureSystolic || ""}
                  onChange={(e) =>
                    handleVitalChange("bloodPressureSystolic", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="120"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={notes.vitals.bloodPressureDiastolic || ""}
                  onChange={(e) =>
                    handleVitalChange("bloodPressureDiastolic", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="80"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Heart Rate (BPM)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={notes.vitals.heartRateBpm || ""}
                  onChange={(e) =>
                    handleVitalChange("heartRateBpm", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="72"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={readOnly}
                  value={notes.vitals.temperatureCelsius || ""}
                  onChange={(e) =>
                    handleVitalChange("temperatureCelsius", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="37.0"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={notes.vitals.spo2Percentage || ""}
                  onChange={(e) =>
                    handleVitalChange("spo2Percentage", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="98"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Calculated BMI</label>
                <div className="px-2.5 py-1.5 bg-slate-950/40 border border-slate-800 rounded text-emerald-400 font-mono font-bold">
                  {notes.vitals.bmiCalculated ? notes.vitals.bmiCalculated : "--"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  disabled={readOnly}
                  value={notes.vitals.weightKg || ""}
                  onChange={(e) =>
                    handleVitalChange("weightKg", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="70"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={notes.vitals.heightCm || ""}
                  onChange={(e) =>
                    handleVitalChange("heightCm", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="175"
                  className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
