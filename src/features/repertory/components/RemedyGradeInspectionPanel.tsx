"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, Info, AlertTriangle, CheckCircle, X, HelpCircle, FileText } from "lucide-react";
import { RubricRemedyGradeView } from "../types/remedyTypes";

interface RemedyGradeInspectionPanelProps {
  rubricId: string;
  rubricLabel?: string;
  onClose?: () => void;
}

export function RemedyGradeInspectionPanel({
  rubricId,
  rubricLabel,
  onClose
}: RemedyGradeInspectionPanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RubricRemedyGradeView[]>([]);
  const [sourceVersion, setSourceVersion] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<RubricRemedyGradeView | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/v1/repertory/knowledge/rubrics/${encodeURIComponent(rubricId)}/remedies`);
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("Access denied: You are not authorized to view this repertory edition.");
          }
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Failed to fetch remedies (HTTP ${res.status})`);
        }

        const json = await res.json();
        if (active) {
          // Sort alphabetically by source abbreviation for clinical neutrality
          const sorted = (json.data || []).sort((a: RubricRemedyGradeView, b: RubricRemedyGradeView) =>
            a.remedyRecord.sourceAbbreviation.localeCompare(b.remedyRecord.sourceAbbreviation)
          );
          setData(sorted);
          setSourceVersion(json.metadata?.sourceVersions?.active || "1.0.0");
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [rubricId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <section
      className="flex flex-col h-full bg-[#FCFDFD] dark:bg-[#0D1311] border-l border-teal-100/50 dark:border-teal-900/30 text-[#1A2421] dark:text-[#E2E8F0] shadow-xl w-full max-w-2xl"
      role="region"
      aria-label="Repertory Remedy Grade Inspection"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-teal-100/50 dark:border-teal-900/30 bg-teal-50/20 dark:bg-teal-950/10">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-teal-800 dark:text-teal-400">
            Remedy Grade Inspection
          </h2>
          <p className="text-xs text-[#5C6E69] dark:text-slate-400 mt-0.5 truncate max-w-md">
            Rubric: {rubricLabel || rubricId}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5C6E69] hover:text-[#1A2421] dark:hover:text-white hover:bg-teal-50/50 dark:hover:bg-teal-900/30 transition-colors"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3" role="status">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
            <p className="text-xs text-[#5C6E69] dark:text-slate-400">Loading remedy grades...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/20 flex gap-3" role="alert">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-red-800 dark:text-red-400">Unable to retrieve grades</h3>
              <p className="text-xs text-red-700 dark:text-red-400/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-8 w-8 text-[#5C6E69] dark:text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-[#5C6E69] dark:text-slate-400">No remedies or grades recorded under this rubric.</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="space-y-6">
            {/* Overview Banner */}
            <div className="rounded-xl border border-teal-100/50 dark:border-teal-900/20 bg-teal-50/20 dark:bg-teal-950/5 p-4 flex gap-3">
              <Info className="h-4 w-4 text-teal-700 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-[#5C6E69] dark:text-slate-400">
                <p>
                  Showing recorded remedies and source grades for this edition.
                </p>
                <p className="font-mono text-[10px]">
                  Corpus Version: {sourceVersion}
                </p>
              </div>
            </div>

            {/* Remedy Table */}
            <div className="border border-teal-100/50 dark:border-teal-900/30 rounded-xl overflow-hidden bg-white dark:bg-[#121A18]">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-teal-50/30 dark:bg-teal-950/20 text-[#5C6E69] dark:text-slate-400 border-b border-teal-100/50 dark:border-teal-900/30 font-bold">
                    <th className="px-4 py-3">Remedy Abbreviation</th>
                    <th className="px-4 py-3">Mapping Status</th>
                    <th className="px-4 py-3 text-right">Recorded Notation</th>
                    <th className="px-4 py-3 text-right">Normalized Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50 dark:divide-teal-900/20">
                  {data.map((item, index) => {
                    const isSelected = selectedGrade?.grade.id === item.grade.id;
                    const hasErr = item.hasConflict || item.remedyRecord.mappingStatus === "unresolved" || item.remedyRecord.mappingStatus === "conflicted";

                    return (
                      <tr
                        key={item.grade.id}
                        onClick={() => setSelectedGrade(item)}
                        className={`cursor-pointer hover:bg-teal-50/10 dark:hover:bg-teal-900/10 transition-colors ${
                          isSelected ? "bg-teal-50/30 dark:bg-teal-950/20" : ""
                        }`}
                        tabIndex={0}
                        aria-selected={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedGrade(item);
                          }
                        }}
                      >
                        <td className="px-4 py-3 font-mono font-bold flex items-center gap-1.5">
                          {item.remedyRecord.sourceAbbreviation}
                          {hasErr && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.remedyRecord.mappingStatus === "verified"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          }`}>
                            {item.remedyRecord.mappingStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold">
                          {item.grade.originalGrade}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-teal-700 dark:text-teal-400">
                          {item.grade.normalizedGrade ?? "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Remedy Details & Provenance (Structured Sections) */}
            {selectedGrade && (
              <div className="rounded-xl border border-teal-100/50 dark:border-teal-900/30 bg-white dark:bg-[#121A18] p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-teal-50 dark:border-teal-900/20 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-400">
                    Recorded Grade Details
                  </h3>
                  <span className="text-[10px] font-mono text-[#5C6E69] dark:text-slate-500">
                    ID: {selectedGrade.grade.id}
                  </span>
                </div>

                {/* Section 1: Rubric and Edition Context */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    1. Rubric & Edition Context
                  </h4>
                  <div className="text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg space-y-1">
                    <div>Rubric ID: <span className="font-mono">{selectedGrade.grade.rubricRecordId}</span></div>
                    <div>Concept ID: <span className="font-mono">{selectedGrade.grade.rubricConceptId}</span></div>
                    <div>Edition ID: <span className="font-mono">{selectedGrade.grade.sourceProvenance.editionId}</span></div>
                  </div>
                </div>

                {/* Section 2: Recorded Remedy Notation */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    2. Recorded Remedy Notation
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[#5C6E69] dark:text-slate-500 text-[10px] mb-0.5">Source Abbreviation</span>
                      <span className="font-mono font-bold bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">
                        {selectedGrade.remedyRecord.sourceAbbreviation}
                      </span>
                    </div>
                    {selectedGrade.remedyRecord.sourceDisplayName && (
                      <div>
                        <span className="block text-[#5C6E69] dark:text-slate-500 text-[10px] mb-0.5">Source Display Name</span>
                        <span className="font-semibold">{selectedGrade.remedyRecord.sourceDisplayName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Canonical Mapping */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    3. Canonical Mapping
                  </h4>
                  <div className="text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg space-y-1">
                    <div>Concept UUID: <span className="font-mono font-bold text-teal-800 dark:text-teal-400">{selectedGrade.remedyRecord.conceptId}</span></div>
                    <div>Mapping Status: <span className="capitalize font-semibold">{selectedGrade.remedyRecord.mappingStatus}</span></div>
                    {selectedGrade.remedyConcept && (
                      <>
                        <div>Latin Name: <span className="font-semibold italic">{selectedGrade.remedyConcept.latinName}</span></div>
                        <div>Scientific Name: <span className="font-semibold italic">{selectedGrade.remedyConcept.scientificName}</span></div>
                        <div>Family: <span className="font-semibold">{selectedGrade.remedyConcept.family}</span></div>
                        <div>Kingdom: <span className="font-semibold">{selectedGrade.remedyConcept.kingdom}</span></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Section 4 & 5: Grades & Disclaimers */}
                <div className="grid grid-cols-2 gap-4 border-t border-teal-50 dark:border-teal-900/20 pt-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400 mb-1.5">
                      4. Original Source Grade
                    </h4>
                    <span className="font-mono font-bold text-lg bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded">
                      {selectedGrade.grade.originalGrade}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400 mb-1.5">
                      5. Normalized Representation
                    </h4>
                    <span className="font-mono font-bold text-lg text-teal-700 dark:text-teal-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded">
                      {selectedGrade.grade.normalizedGrade ?? "-"}
                    </span>
                  </div>
                </div>

                {/* Normalized Grade Disclaimer */}
                <div className="text-[10px] text-[#5C6E69] dark:text-slate-500 italic bg-teal-50/10 dark:bg-teal-950/10 p-2.5 rounded-lg border border-teal-50 dark:border-teal-900/10">
                  Normalized representation is provided for technical consistency. It does not establish equivalence between repertory grading systems.
                </div>

                {/* Section 6: Grading-System Explanation */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    6. Grading-System Explanation
                  </h4>
                  <p className="text-xs text-[#5C6E69] dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg">
                    {selectedGrade.grade.gradingSystemId === "kent_3_grade"
                      ? "Kent's 3-Grade Scale: 1 = plain text (slight), 2 = italics (moderate), 3 = bold (strong)."
                      : "Boericke's 3-Grade Scale: 1 = plain text (slight), 2 = italics or * (moderate), 3 = bold or ** (strong)."}
                  </p>
                </div>

                {/* Section 7: Source Citation */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    7. Source Citation
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg font-mono">
                    <div>Page: {selectedGrade.grade.sourceProvenance.page || "N/A"}</div>
                    <div>Column: {selectedGrade.grade.sourceProvenance.column || "N/A"}</div>
                    <div>Paragraph: {selectedGrade.grade.sourceProvenance.paragraph || "N/A"}</div>
                    <div>Year: {selectedGrade.grade.sourceProvenance.publicationYear || "N/A"}</div>
                    <div className="col-span-2">Citation: {selectedGrade.grade.sourceProvenance.sourceLocation || "Unknown"}</div>
                  </div>
                </div>

                {/* Section 8: Extraction Provenance */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    8. Extraction Provenance
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg font-mono">
                    <div>Method: {selectedGrade.grade.extractionProvenance.extractionMethod}</div>
                    <div>Version: {selectedGrade.grade.extractionProvenance.extractionVersion}</div>
                    <div>Extracted: {selectedGrade.grade.extractionProvenance.extractedAt ? new Date(selectedGrade.grade.extractionProvenance.extractedAt).toLocaleDateString() : "N/A"}</div>
                  </div>
                </div>

                {/* Section 9: Mapping Provenance */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    9. Mapping Provenance
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg font-mono">
                    <div>Method: {selectedGrade.grade.mappingProvenance.mappingMethod}</div>
                    <div>Rule Version: {selectedGrade.grade.mappingProvenance.mappingRuleVersion}</div>
                    <div>Mapped By: {selectedGrade.grade.mappingProvenance.mappedBy || "system"}</div>
                  </div>
                </div>

                {/* Section 10: Editorial Status & Conflicts */}
                <div className="space-y-1.5 border-t border-teal-50 dark:border-teal-900/20 pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                    10. Editorial & Conflict State
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGrade.grade.editorialStatuses.map(status => (
                      <span key={status} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                        {status}
                      </span>
                    ))}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/20 dark:text-teal-400">
                      State: {selectedGrade.grade.gradeState}
                    </span>
                  </div>

                  {selectedGrade.hasConflict && (
                    <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20 flex gap-2.5 mt-2">
                      <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-[11px] font-bold text-amber-800 dark:text-amber-400">Conflict / Dispute Notice</h5>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400/80 mt-0.5">
                          {selectedGrade.conflictDetails || "Deduplication and conflict flags active."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 11: Cross-Edition Observations */}
                {selectedGrade.crossEditionObservations && selectedGrade.crossEditionObservations.length > 0 && (
                  <div className="space-y-1.5 border-t border-teal-50 dark:border-teal-900/20 pt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E69] dark:text-slate-400">
                      11. Edition Comparison (Observations)
                    </h4>
                    <ul className="list-disc pl-4 text-xs text-[#5C6E69] dark:text-slate-400 space-y-1 font-mono">
                      {selectedGrade.crossEditionObservations.map((obs, oIdx) => (
                        <li key={oIdx}>{obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
