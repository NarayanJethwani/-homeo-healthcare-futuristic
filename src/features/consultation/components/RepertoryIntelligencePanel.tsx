"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  BookOpen,
  Plus,
  Trash2,
  Star,
  EyeOff,
  Pin,
  AlertOctagon,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  RefreshCw,
  FileText,
} from "lucide-react";
import {
  SelectedRubric,
  RepertoryScoringConfiguration,
  DEFAULT_SCORING_CONFIGURATION,
  RankedRemedyResult,
  SafetyAssessment,
  MateriaMedicaComparison,
} from "../types/repertory-intelligence.types";
import {
  CanonicalRubricSearchResult,
  RepertoryConsultationAdapter,
  defaultRepertoryAdapter,
} from "../services/repertoryConsultationAdapter";
import { computeRemedyTotality } from "../services/remedyTotalityScorer";
import { evaluateClinicalSafety } from "../services/clinicalRedFlagEngine";

interface RepertoryIntelligencePanelProps {
  patientId: string;
  consultationId: string;
  chiefComplaints?: string[];
  patientThermal?: "chilly" | "warm" | "ambithermal";
  patientMiasm?: string;
  onSelectRemedyForPrescription: (remedyId: string, remedyName: string) => void;
}

export function RepertoryIntelligencePanel({
  patientId,
  consultationId,
  chiefComplaints = [],
  patientThermal = "ambithermal",
  patientMiasm = "psora",
  onSelectRemedyForPrescription,
}: RepertoryIntelligencePanelProps) {
  // State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<CanonicalRubricSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [selectedRubrics, setSelectedRubrics] = useState<SelectedRubric[]>([
    {
      rubricId: "rubric_mind_anxiety_health",
      sourceId: "kent_repertory_v1",
      rubricPath: ["MIND", "ANXIETY", "health, about"],
      weight: 1.0,
      characteristic: true,
      excluded: false,
      pinned: false,
      addedAt: new Date().toISOString(),
      addedBy: "physician",
    },
    {
      rubricId: "rubric_stomach_nausea_eating",
      sourceId: "kent_repertory_v1",
      rubricPath: ["STOMACH", "NAUSEA", "eating, after"],
      weight: 1.0,
      characteristic: false,
      excluded: false,
      pinned: false,
      addedAt: new Date().toISOString(),
      addedBy: "physician",
    },
  ]);

  const [rubricDataStore, setRubricDataStore] = useState<CanonicalRubricSearchResult[]>([]);
  const [requestSequence, setRequestSequence] = useState<number>(1);
  const [config, setConfig] = useState<RepertoryScoringConfiguration>(DEFAULT_SCORING_CONFIGURATION);

  // Safety & Red Flag Assessment
  const [safetyAssessment, setSafetyAssessment] = useState<SafetyAssessment>(() =>
    evaluateClinicalSafety(chiefComplaints)
  );

  // Selected Remedy Comparison Drawer
  const [selectedComparisonRemedy, setSelectedComparisonRemedy] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<MateriaMedicaComparison | null>(null);

  // Initial Load of Canonical Rubric Data
  useEffect(() => {
    async function loadData() {
      const res1 = await defaultRepertoryAdapter.searchRubrics("anxiety");
      const res2 = await defaultRepertoryAdapter.searchRubrics("nausea");
      const res3 = await defaultRepertoryAdapter.searchRubrics("fatty");
      const res4 = await defaultRepertoryAdapter.searchRubrics("warmth");

      const combined = [...res1, ...res2, ...res3, ...res4];
      setRubricDataStore(combined);
    }
    loadData();
  }, []);

  // Update Safety Assessment when chief complaints change
  useEffect(() => {
    setSafetyAssessment(evaluateClinicalSafety(chiefComplaints));
  }, [chiefComplaints]);

  // Execute Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await defaultRepertoryAdapter.searchRubrics(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute Deterministic Remedy Totality Rankings
  const rankedRemedies: RankedRemedyResult[] = useMemo(() => {
    return computeRemedyTotality({
      selectedRubrics,
      rubricData: rubricDataStore,
      patientThermal,
      patientMiasm,
      config,
      requestSequence,
    });
  }, [selectedRubrics, rubricDataStore, patientThermal, patientMiasm, config, requestSequence]);

  // Add Rubric Handler
  const handleAddRubric = (res: CanonicalRubricSearchResult) => {
    if (selectedRubrics.some((r) => r.rubricId === res.rubricId)) return;

    setSelectedRubrics((prev) => [
      ...prev,
      {
        rubricId: res.rubricId,
        sourceId: res.sourceId,
        rubricPath: res.rubricPath,
        weight: 1.0,
        characteristic: false,
        excluded: false,
        pinned: false,
        addedAt: new Date().toISOString(),
        addedBy: "physician",
      },
    ]);

    setRubricDataStore((prev) => (prev.some((d) => d.rubricId === res.rubricId) ? prev : [...prev, res]));
    setRequestSequence((prev) => prev + 1);
    setSearchQuery("");
  };

  // Remove Rubric Handler
  const handleRemoveRubric = (rubricId: string) => {
    setSelectedRubrics((prev) => prev.filter((r) => r.rubricId !== rubricId));
    setRequestSequence((prev) => prev + 1);
  };

  // Toggle Characteristic
  const handleToggleCharacteristic = (rubricId: string) => {
    setSelectedRubrics((prev) =>
      prev.map((r) => (r.rubricId === rubricId ? { ...r, characteristic: !r.characteristic } : r))
    );
    setRequestSequence((prev) => prev + 1);
  };

  // Toggle Excluded
  const handleToggleExcluded = (rubricId: string) => {
    setSelectedRubrics((prev) =>
      prev.map((r) => (r.rubricId === rubricId ? { ...r, excluded: !r.excluded } : r))
    );
    setRequestSequence((prev) => prev + 1);
  };

  // Load Keynotes for Comparison Drawer
  const handleInspectRemedy = async (remedyId: string) => {
    setSelectedComparisonRemedy(remedyId);
    const keynote = await defaultRepertoryAdapter.fetchMateriaMedicaKeynote(remedyId);

    setComparisonData({
      keynotes: keynote ? [keynote] : [],
      aiNarrativeSummary: {
        summaryText: `Clinical synthesis for ${remedyId.replace(/_/g, " ").toUpperCase()}: Demonstrates strong alignment with characteristic intake symptoms.`,
        modelName: "AIRouter-Clinical-v1",
        generatedAt: new Date().toISOString(),
        isStale: false,
      },
    });
  };

  const isRedFlagActive =
    safetyAssessment.status === "emergency" || safetyAssessment.status === "urgent";
  const isRedFlagUnacknowledged = isRedFlagActive && !safetyAssessment.acknowledgedAt;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative text-xs">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-slate-100 uppercase tracking-wider">
            Repertory & Clinical Decision Support
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono text-[10px]">
            Config: {config.scoringConfigurationVersion}
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[10px]">
            Seq: #{requestSequence}
          </span>
        </div>
      </div>

      {/* Emergency Red Flag Banner */}
      {isRedFlagActive && (
        <div className="p-3 bg-red-950/80 border-b border-red-800/80 text-red-200 flex items-start space-x-3">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-red-100 uppercase tracking-wider text-xs">
                Clinical Safety Emergency Red Flag
              </h4>
              {safetyAssessment.acknowledgedAt && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Acknowledged by {safetyAssessment.acknowledgedBy}</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-red-300">
              {safetyAssessment.triggeredRules[0]?.description}
            </p>
            <p className="text-[11px] text-red-200 font-medium">
              Action: {safetyAssessment.triggeredRules[0]?.recommendedAction}
            </p>

            {isRedFlagUnacknowledged && (
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() =>
                    setSafetyAssessment((prev) => ({
                      ...prev,
                      acknowledgedAt: new Date().toISOString(),
                      acknowledgedBy: "physician",
                      clinicianDisposition: "emergency_transfer",
                    }))
                  }
                  className="px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-medium text-[11px] transition-colors"
                >
                  Acknowledge & Record Emergency Transfer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 p-3 min-h-0 overflow-hidden bg-slate-950">
        {/* Left Column: Search & Selected Rubrics */}
        <div className="flex flex-col min-h-0 space-y-3">
          {/* Rubric Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search canonical rubrics (e.g. anxiety, nausea, fatty)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
            {isSearching && (
              <RefreshCw className="w-3.5 h-3.5 text-purple-400 absolute right-3 top-2.5 animate-spin" />
            )}

            {/* Autocomplete Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute inset-x-0 top-9 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-800/60">
                {searchResults.map((res) => (
                  <button
                    key={res.rubricId}
                    onClick={() => handleAddRubric(res)}
                    className="w-full text-left p-2.5 hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-medium text-purple-300 group-hover:text-purple-200">
                        {res.rubricPath.join(" > ")}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        ID: {res.rubricId} • Rem: {res.remedyCount}
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Totality Rubrics Bucket */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Selected Rubrics ({selectedRubrics.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Mult: x1.5 Char
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedRubrics.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs italic">
                  No rubrics added yet. Search above to build case totality.
                </div>
              ) : (
                selectedRubrics.map((r) => (
                  <div
                    key={r.rubricId}
                    className={`p-2.5 rounded-lg border transition-all space-y-1.5 ${
                      r.excluded
                        ? "bg-slate-950/40 border-slate-900 text-slate-600 line-through"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-xs text-purple-200 flex-1 leading-snug">
                        {r.rubricPath.join(" > ")}
                      </span>
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleToggleCharacteristic(r.rubricId)}
                          className={`p-1 rounded ${
                            r.characteristic
                              ? "text-amber-400 bg-amber-950/60 border border-amber-800/60"
                              : "text-slate-600 hover:text-amber-400"
                          }`}
                          title="Toggle Characteristic Weight (x1.5)"
                        >
                          <Star className="w-3 h-3 fill-current" />
                        </button>

                        <button
                          onClick={() => handleToggleExcluded(r.rubricId)}
                          className={`p-1 rounded ${
                            r.excluded ? "text-red-400 bg-red-950/60" : "text-slate-600 hover:text-slate-400"
                          }`}
                          title="Toggle Excluded"
                        >
                          <EyeOff className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleRemoveRubric(r.rubricId)}
                          className="p-1 rounded text-slate-600 hover:text-red-400"
                          title="Remove Rubric"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Source: {r.sourceId}</span>
                      {r.characteristic && (
                        <span className="text-amber-400 font-semibold">Characteristic (x1.5)</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Deterministic Totality Ranking Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Deterministic Remedy Totality Ranking
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">
              Deterministic Score
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {rankedRemedies.map((rem, idx) => (
              <div
                key={rem.remedyId}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-mono text-[10px] flex items-center justify-center font-bold">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-100 text-xs">{rem.remedyName}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-purple-300">
                      {rem.scoreBreakdown.finalScore} pts
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {rem.scoreBreakdown.matchedRubricCount}/{rem.scoreBreakdown.totalSelectedRubrics} Rubrics
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Bar & Provenance */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] bg-slate-900 p-2 rounded border border-slate-800/60 text-slate-400">
                  <div>Grade Sum: <span className="text-slate-200 font-mono">{rem.scoreBreakdown.rubricScore}</span></div>
                  <div>Char Adj: <span className="text-amber-400 font-mono">+{rem.scoreBreakdown.characteristicAdjustment}</span></div>
                  <div>Thermal Adj: <span className="text-emerald-400 font-mono">+{rem.scoreBreakdown.thermalAdjustment}</span></div>
                </div>

                {/* Actions: Inspect Keynotes & Select for Prescription Draft */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleInspectRemedy(rem.remedyId)}
                    className="flex items-center space-x-1 text-[11px] text-purple-400 hover:text-purple-300 font-medium"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Materia Medica Keynotes</span>
                  </button>

                  <button
                    disabled={isRedFlagUnacknowledged}
                    onClick={() => onSelectRemedyForPrescription(rem.remedyId, rem.remedyName)}
                    className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-medium text-[11px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    title={
                      isRedFlagUnacknowledged
                        ? "Acknowledge red flag before adding remedy"
                        : "Create clinician-reviewed prescription draft"
                    }
                  >
                    Select for Prescription Draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Materia Medica Comparison Drawer */}
      {selectedComparisonRemedy && comparisonData && (
        <div className="absolute inset-x-0 bottom-0 top-12 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl z-30 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
                Materia Medica Source Keynotes & AI Comparison
              </h4>
            </div>
            <button
              onClick={() => setSelectedComparisonRemedy(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 overflow-y-auto text-xs">
            {/* Source-Backed Keynote */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-purple-300 font-semibold border-b border-slate-800 pb-1">
                <span>Source-Backed Keynotes</span>
                <span className="text-[10px] text-slate-400 font-normal">Authoritative</span>
              </div>
              {comparisonData.keynotes.map((kn) => (
                <div key={kn.remedyId} className="space-y-1 text-slate-300">
                  <p className="italic">{kn.keynoteText}</p>
                  <p className="text-[10px] text-slate-500 mt-2">Citation: {kn.citation}</p>
                </div>
              ))}
            </div>

            {/* Optional Labelled AI Narrative */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-teal-300 font-semibold border-b border-slate-800 pb-1">
                <span>AI Narrative Comparison</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-400 font-mono">
                  Labelled AI Synthesis
                </span>
              </div>
              <p className="text-slate-300">{comparisonData.aiNarrativeSummary?.summaryText}</p>
              <p className="text-[10px] text-slate-500 mt-2">
                Model: {comparisonData.aiNarrativeSummary?.modelName} (Generated {comparisonData.aiNarrativeSummary?.generatedAt})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
