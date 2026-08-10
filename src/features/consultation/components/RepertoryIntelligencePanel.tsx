"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  BookOpen,
  Trash2,
  Star,
  EyeOff,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  FileText,
  BarChart3,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import {
  SelectedRubric,
  RepertoryScoringConfiguration,
  DEFAULT_SCORING_CONFIGURATION,
  RankedRemedyResult,
  SafetyAssessment,
  MateriaMedicaRemedyProfile,
} from "../types/repertory-intelligence.types";
import {
  CanonicalRubricSearchResult,
  defaultRepertoryAdapter,
  CANONICAL_REPERTORY_DATABASE,
} from "../services/repertoryConsultationAdapter";
import { computeInputSnapshotHash, computeRemedyTotality } from "../services/remedyTotalityScorer";
import { evaluateClinicalSafety } from "../services/clinicalRedFlagEngine";

interface RepertoryIntelligencePanelProps {
  patientId: string;
  consultationId: string;
  chiefComplaints?: string[];
  patientThermal?: "chilly" | "warm" | "ambithermal";
  patientMiasm?: string;
  initialSelectedRubrics?: SelectedRubric[];
  onSelectedRubricsChange?: (rubrics: SelectedRubric[]) => void;
  onAnalysisSnapshotChange?: (snapshotHash: string) => void;
  onSelectRemedyForPrescription: (
    remedyId: string,
    remedyName: string,
    analysisSnapshotHash: string
  ) => void;
}

export function RepertoryIntelligencePanel({
  chiefComplaints = [],
  patientThermal = "ambithermal",
  patientMiasm,
  initialSelectedRubrics = [],
  onSelectedRubricsChange,
  onAnalysisSnapshotChange,
  onSelectRemedyForPrescription,
}: RepertoryIntelligencePanelProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<CanonicalRubricSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [remedyViewMode, setRemedyViewMode] = useState<"3d_chart" | "cards">("3d_chart");
  const [selectedRepertorySource, setSelectedRepertorySource] = useState<string>("all");
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>("all");

  const [selectedRubrics, setSelectedRubrics] = useState<SelectedRubric[]>(initialSelectedRubrics);

  const [rubricDataStore, setRubricDataStore] = useState<CanonicalRubricSearchResult[]>(CANONICAL_REPERTORY_DATABASE);
  const [requestSequence, setRequestSequence] = useState<number>(1);
  const [config] = useState<RepertoryScoringConfiguration>(DEFAULT_SCORING_CONFIGURATION);

  // Safety & Red Flag Assessment
  const [safetyAssessment, setSafetyAssessment] = useState<SafetyAssessment>(() =>
    evaluateClinicalSafety(chiefComplaints)
  );

  // Selected Remedy Comparison Drawer
  const [selectedComparisonRemedy, setSelectedComparisonRemedy] = useState<string | null>(null);
  const [materiaMedicaProfile, setMateriaMedicaProfile] = useState<MateriaMedicaRemedyProfile | null>(null);
  const [isMateriaMedicaLoading, setIsMateriaMedicaLoading] = useState(false);
  const [materiaMedicaError, setMateriaMedicaError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedRubrics(initialSelectedRubrics);
  }, [initialSelectedRubrics]);

  // Initial Hydration of Canonical Rubric Data
  useEffect(() => {
    async function loadData() {
      const res1 = await defaultRepertoryAdapter.searchRubrics("anxiety");
      const res2 = await defaultRepertoryAdapter.searchRubrics("nausea");
      const res3 = await defaultRepertoryAdapter.searchRubrics("fatty");
      const res4 = await defaultRepertoryAdapter.searchRubrics("warmth");

      const combined = [...res1, ...res2, ...res3, ...res4];
      setRubricDataStore((prev) => {
        const map = new Map<string, CanonicalRubricSearchResult>();
        for (const item of [...prev, ...combined]) {
          map.set(item.rubricId, item);
        }
        return Array.from(map.values());
      });
    }
    loadData();
  }, []);

  // Update Safety Assessment when chief complaints change
  useEffect(() => {
    setSafetyAssessment(evaluateClinicalSafety(chiefComplaints));
  }, [chiefComplaints]);

  // Execute Search & Chapter Filtering with Active Repertory Filter
  useEffect(() => {
    if (!searchQuery.trim() && selectedChapterFilter === "all") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await defaultRepertoryAdapter.searchRubrics(
        searchQuery,
        selectedChapterFilter !== "all" ? selectedChapterFilter : undefined,
        selectedRepertorySource
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedRepertorySource, selectedChapterFilter]);

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

  const analysisSnapshotHash = useMemo(
    () => computeInputSnapshotHash(selectedRubrics, patientThermal, patientMiasm),
    [selectedRubrics, patientThermal, patientMiasm]
  );

  useEffect(() => {
    onSelectedRubricsChange?.(selectedRubrics);
    onAnalysisSnapshotChange?.(analysisSnapshotHash);
  }, [analysisSnapshotHash, onAnalysisSnapshotChange, onSelectedRubricsChange, selectedRubrics]);

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

  // Load the governed remedy profile and the selected local source transcription.
  const handleInspectRemedy = async (remedyId: string, sourceId?: string) => {
    setSelectedComparisonRemedy(remedyId);
    setIsMateriaMedicaLoading(true);
    setMateriaMedicaError(null);
    try {
      const profile = await defaultRepertoryAdapter.fetchMateriaMedicaProfile(remedyId, sourceId);
      setMateriaMedicaProfile(profile);
      if (!profile) setMateriaMedicaError("No governed Materia Medica record was found for this remedy.");
    } catch (error) {
      setMateriaMedicaProfile(null);
      setMateriaMedicaError(error instanceof Error ? error.message : "Unable to load Materia Medica.");
    } finally {
      setIsMateriaMedicaLoading(false);
    }
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
      <div className="flex-1 grid grid-cols-1 gap-3 p-3 min-h-0 overflow-y-auto bg-slate-950">
        {/* Left Column: Search & Selected Rubrics */}
        <div className="flex flex-col min-h-0 space-y-3">
          {/* Multi-Repertory Source & Chapter Selector Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2 gap-2 shadow-sm">
            <div className="flex items-center space-x-1.5 shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Repertory Lab:
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <select
                value={selectedRepertorySource}
                onChange={(e) => setSelectedRepertorySource(e.target.value)}
                className="flex-1 bg-slate-950 text-purple-300 border border-purple-800/80 rounded-lg text-xs py-1.5 px-2.5 font-bold focus:outline-none focus:border-purple-400 cursor-pointer shadow-inner min-w-0 truncate"
                title="Select Repertory Corpus Source"
              >
                <option value="all">🌐 All Repertories Combined</option>
                <option value="kent_repertory_v1">📘 Kent's Repertory of Homeopathic Materia Medica</option>
                <option value="boericke_repertory_v1">📗 Boericke's Pocket Manual & Repertory</option>
                <option value="bbcr_repertory_v1">📙 Boger Boenninghausen (BBCR)</option>
                <option value="tpb_repertory_v1">📕 Boenninghausen Therapeutic Pocketbook (TPB)</option>
                <option value="jethwani_clinical_v1">⚡ Dr. Jethwani Integrative Clinical Repertory</option>
              </select>

              <select
                value={selectedChapterFilter}
                onChange={(e) => setSelectedChapterFilter(e.target.value)}
                className="bg-slate-950 text-indigo-300 border border-indigo-800/80 rounded-lg text-xs py-1.5 px-2.5 font-bold focus:outline-none focus:border-indigo-400 cursor-pointer shadow-inner shrink-0 max-w-[155px] truncate"
                title="Browse by Homeopathic Chapter"
              >
                <option value="all">📁 All Chapters</option>
                <option value="SLEEP">😴 SLEEP & DREAMS</option>
                <option value="MIND">🧠 MIND & EMOTIONS</option>
                <option value="HEAD">🗣️ HEAD & VERTIGO</option>
                <option value="STOMACH">🍲 STOMACH & DYSPEPSIA</option>
                <option value="RESPIRATION">🫁 RESPIRATION & ASTHMA</option>
                <option value="COUGH">🗣️ COUGH & THROAT</option>
                <option value="SKIN">✨ SKIN & ERUPTIONS</option>
                <option value="GENERALITIES">⚡ GENERALITIES & MODALITIES</option>
                <option value="EXTREMITIES">🦵 EXTREMITIES & JOINTS</option>
                <option value="RECTUM">🚽 RECTUM & STOOL</option>
                <option value="ABDOMEN">🩺 ABDOMEN & LIVER</option>
                <option value="CHEST">❤️ CHEST & HEART</option>
                <option value="FEVER">🌡️ FEVER & CHILL</option>
                <option value="CLINICAL">🔬 CLINICAL & INTEGRATIVE</option>
              </select>
            </div>
          </div>

          {/* Rubric Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rubrics in selected repertory (e.g. anxiety, nausea, fatty)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
            {isSearching && (
              <RefreshCw className="w-3.5 h-3.5 text-purple-400 absolute right-3 top-2.5 animate-spin" />
            )}

            {/* Autocomplete Results Dropdown */}
            {searchResults.length > 0 ? (
              <div className="absolute inset-x-0 top-9 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-800/60">
                {searchResults.map((res) => (
                  <button
                    key={res.rubricId}
                    onClick={() => handleAddRubric(res)}
                    className="w-full text-left p-2.5 hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs group cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-purple-300 group-hover:text-purple-200 flex items-center space-x-2">
                        <span>{res.rubricPath.join(" > ")}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/80">
                          {res.sourceId === "kent_repertory_v1"
                            ? "📘 Kent"
                            : res.sourceId === "boericke_repertory_v1"
                            ? "📗 Boericke"
                            : res.sourceId === "bbcr_repertory_v1"
                            ? "📙 BBCR"
                            : res.sourceId === "tpb_repertory_v1"
                            ? "📕 TPB"
                            : "⚡ Dr. Jethwani"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Source: {res.sourceTitle} • Rem: {res.remedyCount}
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 shrink-0">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim().length > 0 && !isSearching ? (
              <div className="absolute inset-x-0 top-9 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-30 p-3 text-xs text-slate-300 flex items-center justify-between">
                <span>No rubrics found for <strong className="text-purple-300">"{searchQuery}"</strong> in selected source.</span>
                {selectedRepertorySource !== "all" && (
                  <button
                    onClick={() => setSelectedRepertorySource("all")}
                    className="ml-2 px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-md text-[10px] font-bold border border-purple-700/60 cursor-pointer shrink-0"
                  >
                    Search All Repertories 🌐
                  </button>
                )}
              </div>
            ) : null}
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
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] truncate">
              Remedy Totality Ranking
            </span>

            {/* View Mode Switcher: 3D Spectrum vs Standard Cards */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setRemedyViewMode("3d_chart")}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 transition-all ${
                  remedyViewMode === "3d_chart"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Interactive 3D Bar Chart Remedy Spectrum"
              >
                <BarChart3 className="w-3 h-3" />
                <span>3D Spectrum</span>
              </button>

              <button
                type="button"
                onClick={() => setRemedyViewMode("cards")}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 transition-all ${
                  remedyViewMode === "cards"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Standard Remedy Detail Cards"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Cards</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {rankedRemedies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center p-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/60">
                <Sparkles className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-300">No Remedy Totality Data</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Select symptoms from the left panel or choose a chapter from the Chapter Browser to calculate remedy totality rankings.
                </p>
              </div>
            ) : remedyViewMode === "3d_chart" ? (
              /* Interactive 3D Bar Chart Spectrum View */
              (() => {
                const maxScore = Math.max(...rankedRemedies.map((r) => r.scoreBreakdown.finalScore), 1);
                return rankedRemedies.map((rem, idx) => {
                  const scorePercent = Math.min(100, Math.max(15, (rem.scoreBreakdown.finalScore / maxScore) * 100));
                  return (
                    <div
                      key={rem.remedyId}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-purple-500/60 transition-all space-y-2 group shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 text-white font-mono text-[10px] flex items-center justify-center font-bold shadow">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-slate-100 text-xs tracking-wide group-hover:text-teal-300 transition-colors">
                            {rem.remedyName}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-xs font-mono font-black text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/80 shadow-inner">
                            {rem.scoreBreakdown.finalScore} pts
                          </span>
                          <button
                            disabled={isRedFlagUnacknowledged}
                            onClick={() => onSelectRemedyForPrescription(rem.remedyId, rem.remedyName, analysisSnapshotHash)}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-bold text-[11px] transition-all shadow disabled:opacity-40 shrink-0 cursor-pointer"
                            title={
                              isRedFlagUnacknowledged
                                ? "Acknowledge red flag before adding remedy"
                                : "Add remedy to prescription draft"
                            }
                          >
                            Select Rx
                          </button>
                        </div>
                      </div>

                      {/* 3D Bar Visual Container */}
                      <div className="relative w-full h-7 bg-slate-900 rounded-lg p-1 border border-slate-800/80 overflow-hidden shadow-inner flex items-center">
                        <div
                          className="h-full rounded-md bg-gradient-to-r from-purple-600 via-teal-500 to-emerald-400 transition-all duration-500 relative flex items-center px-2 shadow.md border-t border-l border-white/30"
                          style={{ width: `${scorePercent}%` }}
                        >
                          <span className="text-[10px] font-mono font-bold text-slate-950 drop-shadow-sm truncate">
                            {rem.scoreBreakdown.matchedRubricCount}/{rem.scoreBreakdown.totalSelectedRubrics} Rubrics Matched
                          </span>
                        </div>
                      </div>

                      {/* Micro Score Tags & Materia Medica Link */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5 border-t border-slate-900/60">
                        <span>Grade Sum: <strong className="text-slate-200">{rem.scoreBreakdown.rubricScore}</strong></span>
                        <span>Char: <strong className="text-amber-400">+{rem.scoreBreakdown.characteristicAdjustment}</strong></span>
                        <span>Thermal: <strong className="text-emerald-400">+{rem.scoreBreakdown.thermalAdjustment}</strong></span>
                        <button
                          onClick={() => handleInspectRemedy(rem.remedyId)}
                          className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2"
                        >
                          Keynotes
                        </button>
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              /* Standard Remedy Detail Cards View */
              rankedRemedies.map((rem, idx) => (
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
                      onClick={() => onSelectRemedyForPrescription(rem.remedyId, rem.remedyName, analysisSnapshotHash)}
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Governed Materia Medica Reader */}
      {selectedComparisonRemedy && (
        <div className="absolute inset-x-0 bottom-0 top-12 bg-slate-950/98 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl z-30 flex min-h-0 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-purple-400" />
              <div className="min-w-0">
                <h4 className="truncate text-xs font-semibold uppercase tracking-wider text-slate-100">
                  {materiaMedicaProfile?.remedyName || selectedComparisonRemedy.replace(/_/g, " ")} — Materia Medica
                </h4>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Governed remedy record connected to the existing Homeo Healthcare source library
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {materiaMedicaProfile?.canonicalUrl && (
                <a
                  href={materiaMedicaProfile.canonicalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-purple-700/70 bg-purple-950/60 px-2.5 py-1.5 text-[10px] font-semibold text-purple-300 hover:bg-purple-900/60"
                >
                  Open complete remedy page
                </a>
              )}
              <button
                onClick={() => {
                  setSelectedComparisonRemedy(null);
                  setMateriaMedicaProfile(null);
                  setMateriaMedicaError(null);
                }}
                className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {isMateriaMedicaLoading && (
            <div className="flex flex-1 items-center justify-center gap-2 text-slate-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading governed remedy record and source text…</span>
            </div>
          )}

          {!isMateriaMedicaLoading && materiaMedicaError && (
            <div className="m-auto max-w-lg rounded-lg border border-amber-800/60 bg-amber-950/30 p-4 text-center text-amber-200">
              <p className="font-semibold">Materia Medica unavailable</p>
              <p className="mt-1 text-[11px] text-amber-300/80">{materiaMedicaError}</p>
              <button
                onClick={() => handleInspectRemedy(selectedComparisonRemedy)}
                className="mt-3 rounded bg-amber-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-amber-600"
              >
                Retry
              </button>
            </div>
          )}

          {!isMateriaMedicaLoading && materiaMedicaProfile && (
            <div
              className="grid min-h-0 flex-1 gap-4 overflow-y-auto"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))" }}
            >
              <div className="min-h-[480px] space-y-3 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/80 p-3 pr-2">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="font-semibold text-purple-300">
                    {materiaMedicaProfile.editorialStatus ? "Clinician-reviewed remedy profile" : "Source-library remedy record"}
                  </span>
                  {materiaMedicaProfile.editorialStatus && (
                    <span className="rounded border border-emerald-800 bg-emerald-950/60 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
                      {materiaMedicaProfile.editorialStatus}
                    </span>
                  )}
                  {materiaMedicaProfile.reviewStatus && (
                    <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                      {materiaMedicaProfile.reviewStatus}
                    </span>
                  )}
                </div>

                {(materiaMedicaProfile.summary || materiaMedicaProfile.description) && (
                  <section className="space-y-1.5">
                    <h5 className="font-semibold uppercase tracking-wide text-slate-300">Overview</h5>
                    <p className="leading-relaxed text-slate-300">
                      {materiaMedicaProfile.description || materiaMedicaProfile.summary}
                    </p>
                  </section>
                )}

                {!!materiaMedicaProfile.keynotes.length && (
                  <section className="space-y-1.5">
                    <h5 className="font-semibold uppercase tracking-wide text-purple-300">Keynotes</h5>
                    <ul className="space-y-1.5 text-slate-300">
                      {materiaMedicaProfile.keynotes.map((item) => (
                        <li key={item} className="flex gap-2 leading-relaxed">
                          <span className="text-purple-400">•</span><span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {!!materiaMedicaProfile.mentalSymptoms.length && (
                  <section className="space-y-1.5">
                    <h5 className="font-semibold uppercase tracking-wide text-slate-300">Mind</h5>
                    <ul className="space-y-1 text-slate-400">
                      {materiaMedicaProfile.mentalSymptoms.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </section>
                )}

                {!!materiaMedicaProfile.physicalSymptoms.length && (
                  <section className="space-y-1.5">
                    <h5 className="font-semibold uppercase tracking-wide text-slate-300">Physical generals</h5>
                    <ul className="space-y-1 text-slate-400">
                      {materiaMedicaProfile.physicalSymptoms.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </section>
                )}

                {(materiaMedicaProfile.modalitiesBetter.length > 0 || materiaMedicaProfile.modalitiesWorse.length > 0) && (
                  <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded border border-emerald-900/70 bg-emerald-950/20 p-2">
                      <h5 className="font-semibold text-emerald-400">Better</h5>
                      <p className="mt-1 leading-relaxed text-slate-400">{materiaMedicaProfile.modalitiesBetter.join("; ") || "Not recorded"}</p>
                    </div>
                    <div className="rounded border border-rose-900/70 bg-rose-950/20 p-2">
                      <h5 className="font-semibold text-rose-400">Worse</h5>
                      <p className="mt-1 leading-relaxed text-slate-400">{materiaMedicaProfile.modalitiesWorse.join("; ") || "Not recorded"}</p>
                    </div>
                  </section>
                )}

                {materiaMedicaProfile.clinicalPearl && (
                  <section className="rounded border border-teal-800/70 bg-teal-950/30 p-2.5">
                    <h5 className="font-semibold text-teal-300">Clinical pearl</h5>
                    <p className="mt-1 leading-relaxed text-slate-300">{materiaMedicaProfile.clinicalPearl}</p>
                  </section>
                )}

                {!!materiaMedicaProfile.citations.length && (
                  <section className="space-y-1.5 border-t border-slate-800 pt-2">
                    <h5 className="font-semibold uppercase tracking-wide text-slate-300">Verified references</h5>
                    {materiaMedicaProfile.citations.map((citation) => (
                      <div key={citation.id} className="text-[10px] leading-relaxed text-slate-500">
                        {citation.canonicalUrl ? (
                          <a href={citation.canonicalUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">
                            {citation.authors.join(", ")} ({citation.year}). {citation.title}
                          </a>
                        ) : (
                          <span>{citation.authors.join(", ")} ({citation.year}). {citation.title}</span>
                        )}
                        {citation.verificationStatus && <span className="ml-1 font-mono">[{citation.verificationStatus}]</span>}
                      </div>
                    ))}
                  </section>
                )}
              </div>

              <div className="flex min-h-[480px] flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80">
                <div className="space-y-2 border-b border-slate-800 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h5 className="font-semibold text-teal-300">Original source reader</h5>
                      <p className="mt-0.5 text-[10px] text-slate-500">Select an existing corpus edition to read its remedy passage.</p>
                    </div>
                    {materiaMedicaProfile.selectedSource?.sourceUrl && (
                      <a
                        href={materiaMedicaProfile.selectedSource.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-semibold text-teal-400 hover:underline"
                      >
                        View source archive ↗
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {materiaMedicaProfile.availableSources.map((source) => (
                      <button
                        key={source.bookId}
                        onClick={() => handleInspectRemedy(selectedComparisonRemedy, source.bookId)}
                        disabled={isMateriaMedicaLoading}
                        className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                          materiaMedicaProfile.selectedSource?.bookId === source.bookId
                            ? "border-teal-600 bg-teal-950 text-teal-300"
                            : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                        title={`${source.title} — ${source.author}, ${source.year}`}
                      >
                        {source.author} · {source.title}
                      </button>
                    ))}
                  </div>
                  {materiaMedicaProfile.selectedSource && (
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                      <span>{materiaMedicaProfile.selectedSource.title}</span>
                      <span className="rounded border border-amber-900/80 bg-amber-950/30 px-1.5 py-0.5 font-mono text-amber-500">
                        {materiaMedicaProfile.selectedSource.correctionStatus}
                      </span>
                      <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono">
                        {materiaMedicaProfile.selectedSource.editorialStatus}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  {materiaMedicaProfile.selectedSource?.text ? (
                    <pre className="whitespace-pre-wrap font-sans text-[11px] leading-6 text-slate-300">
                      {materiaMedicaProfile.selectedSource.text}
                    </pre>
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-slate-500">
                      No local source transcription is available for this remedy. The clinician-reviewed profile remains available on the left.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
