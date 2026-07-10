"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertCircle, 
  FileText, 
  UserCheck, 
  ArrowRight,
  RefreshCw,
  Search,
  Info
} from "lucide-react";
import { ReviewedLabResult, PatientLabTimelineEntry } from "./types";
import { fetchLabTimeline, fetchLabSummary } from "./labClient";
import { downloadAttachment, listPatientAttachments } from "../patient-attachments/attachmentClient";

interface PatientLabTimelinePanelProps {
  patientId: string;
  onGoToExtraction?: () => void;
}

export default function PatientLabTimelinePanel({ patientId, onGoToExtraction }: PatientLabTimelinePanelProps) {
  const [summary, setSummary] = useState<ReviewedLabResult[]>([]);
  const [abnormal, setAbnormal] = useState<ReviewedLabResult[]>([]);
  const [timeline, setTimeline] = useState<PatientLabTimelineEntry[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTest, setFilterTest] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  useEffect(() => {
    loadTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, filterTest]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch summary and abnormal values
      const sumData = await fetchLabSummary(patientId);
      setSummary(sumData.summary || []);
      setAbnormal(sumData.abnormal || []);

      // 2. Fetch attachments to count pending review
      const attachments = await listPatientAttachments(patientId);
      const pendingReviewCount = attachments.filter(
        a => a.status === "review-required" || a.extractionStatus === "requires-clinician-review"
      ).length;
      setPendingCount(pendingReviewCount);

    } catch (err: any) {
      setError(err.message || "Failed to load reviewed lab data.");
    } finally {
      setLoading(false);
    }
  }

  async function loadTimeline() {
    try {
      const timeData = await fetchLabTimeline(patientId, filterTest || undefined);
      setTimeline(timeData);
    } catch (err: any) {
      console.error("Failed to load timeline entries:", err.message);
    }
  }

  async function handleDownloadSource(attachmentId: string) {
    try {
      const { downloadUrl } = await downloadAttachment(patientId, attachmentId);
      window.open(downloadUrl, "_blank");
    } catch (err: any) {
      alert(err.message || "Failed to download source report.");
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    await loadTimeline();
    setRefreshing(false);
  }

  // Generate simple SVG line trend path from timeline entries
  function renderTrendLine() {
    // We only plot numeric values for the currently filtered test
    if (!filterTest || timeline.length < 2) return null;

    // Filter values that have numeric values
    const numericPoints = timeline
      .filter(entry => entry.numericValue !== undefined)
      .map(entry => ({
        val: entry.numericValue as number,
        date: new Date(entry.date)
      }))
      // Sort oldest to newest for plotting left-to-right
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (numericPoints.length < 2) {
      return (
        <div className="text-center py-6 text-slate-400 text-xs italic">
          Need at least 2 historical entries to render a trend graph.
        </div>
      );
    }

    const values = numericPoints.map(p => p.val);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    // SVG Viewbox dimensions
    const width = 500;
    const height = 150;
    const padding = 20;

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = numericPoints.map((p, idx) => {
      const x = padding + (idx / (numericPoints.length - 1)) * chartWidth;
      // y is inverted in SVG, higher value is lower coordinate
      const y = padding + chartHeight - ((p.val - minVal) / range) * chartHeight;
      return { x, y, val: p.val, date: p.date };
    });

    const pathData = points.reduce(
      (path, pt, idx) => path + `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y} `,
      ""
    );

    return (
      <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">Trend Analysis: {filterTest}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            Range: {minVal} - {maxVal} {timeline[0].unit || ""}
          </span>
        </div>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
            {/* Draw grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E2E8F0" strokeDasharray="3,3" className="dark:stroke-slate-800" />
            <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="#E2E8F0" strokeDasharray="3,3" className="dark:stroke-slate-800" />
            <line x1={padding} y1={padding + chartHeight} x2={width - padding} y2={padding + chartHeight} stroke="#E2E8F0" strokeDasharray="3,3" className="dark:stroke-slate-800" />

            {/* Render Line Path */}
            <path
              d={pathData}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Render Points and value labels */}
            {points.map((pt, idx) => (
              <g key={idx} className="group">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-emerald-500 stroke-white dark:stroke-slate-950 stroke-2 hover:r-7 transition-all cursor-pointer"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-slate-700 dark:fill-slate-300 opacity-0 group-hover:opacity-100 transition-opacity font-mono"
                >
                  {pt.val}
                </text>
                <text
                  x={pt.x}
                  y={height - 2}
                  textAnchor="middle"
                  className="text-[7.5px] font-semibold fill-slate-400 dark:fill-slate-500 font-mono"
                >
                  {pt.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-xs text-slate-400 gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
        <span>Loading validated clinical lab context...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-500/10 text-rose-600 text-xs rounded-xl flex items-center gap-2 border border-rose-200 dark:border-rose-900/30">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Notice at Top */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 p-4.5 rounded-[22px] flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-250">Reviewed Lab Data Information Gate</h4>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Lab values are clinician-reviewed clinical context. They do not generate diagnosis or treatment recommendations automatically. All data shown here has been verified and confirmed by a licensed clinician.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns: summary cards & abnormal items */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Summary Cards Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-[24px] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinician Reviewed Lab Summary</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Latest confirmed results per test category</p>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1.5 border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>

            {summary.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-450 italic">
                No clinician-reviewed lab parameters available. Confirm parameters in the attachment review tab.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.map((lab) => {
                  const isAbnormal = lab.flag === "low" || lab.flag === "high" || lab.flag === "critical";
                  return (
                    <div 
                      key={lab.id} 
                      className={`p-3.5 border rounded-2xl flex flex-col justify-between transition-all ${
                        isAbnormal 
                          ? "bg-rose-500/5 border-rose-200 dark:border-rose-900/30" 
                          : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-150 dark:border-slate-850"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{lab.testName}</span>
                        {isAbnormal && (
                          <span className="text-[8.5px] uppercase tracking-wider font-extrabold bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded-md">
                            {lab.flag}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{lab.value}</span>
                        {lab.unit && <span className="text-[10px] text-slate-450 font-bold">{lab.unit}</span>}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[9px] text-slate-400">
                        <div className="flex items-center gap-1 font-semibold text-slate-500">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          <span className="truncate max-w-[80px]">UID: {lab.confirmedBy.substring(0, 5)}</span>
                        </div>
                        <span>{new Date(lab.confirmedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tabular Timeline logs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-[24px] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chronological Lab Log</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Chronological record of verified metrics</p>
              </div>

              {/* Filter Test Selector */}
              <div className="flex items-center gap-2 max-w-xs w-full bg-slate-50 dark:bg-slate-950 px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-xl">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterTest}
                  onChange={(e) => setFilterTest(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer w-full p-0"
                >
                  <option value="">All Verified Tests</option>
                  {/* Extract unique verified tests for dropdown */}
                  {Array.from(new Set(summary.map(s => s.normalizedTestName))).map((test) => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display svg mini trend chart */}
            {renderTrendLine()}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-450 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2">Date Verified</th>
                    <th>Test Name</th>
                    <th>Value</th>
                    <th>Reference Range</th>
                    <th>Source Document</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                        No verified records fit this search criteria.
                      </td>
                    </tr>
                  ) : (
                    timeline.map((entry) => (
                      <tr 
                        key={entry.id} 
                        className="border-b border-slate-100 dark:border-slate-850/60 hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <td className="py-2.5 font-mono text-[10px] text-slate-450">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="font-bold text-slate-850 dark:text-slate-250">{entry.testName}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {entry.value} {entry.unit}
                            </span>
                            {(entry.flag === "low" || entry.flag === "high" || entry.flag === "critical") && (
                              <span className="text-[7.5px] uppercase font-black bg-rose-500/10 text-rose-500 px-1 py-0.5 rounded">
                                {entry.flag}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-slate-450 font-mono text-[10px]">{entry.referenceRange || "N/A"}</td>
                        <td>
                          <button
                            onClick={() => handleDownloadSource(entry.sourceAttachmentId)}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Download Report</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Pending handoffs, Abnormal lists */}
        <div className="space-y-6">
          
          {/* Pending extraction workflow card */}
          {onGoToExtraction && (
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-[24px] border border-indigo-850 shadow-md space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">Extraction Workflow</h4>
                  <h3 className="text-base font-bold font-serif mt-1">Pending Lab Reviews</h3>
                </div>
                <span className="text-xs bg-indigo-500/25 border border-indigo-500/40 text-indigo-200 px-2 py-1 rounded-xl font-bold font-mono">
                  {pendingCount} Left
                </span>
              </div>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Extracted lab metrics are blocked from clinical decision contexts until verified. Confirm or correct parameter details inside the Secure Attachments review grid.
              </p>
              <button
                onClick={onGoToExtraction}
                className="w-full mt-2.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                <span>Open Attachment Review Grid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Abnormal Labs details sidebar panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-[24px] space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Abnormal Value Flags</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Active outlier ranges requiring observation</p>
            </div>

            {abnormal.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs italic">
                All reviewed metrics fall within normal reference ranges.
              </div>
            ) : (
              <div className="space-y-3">
                {abnormal.map((lab) => (
                  <div key={lab.id} className="p-3 bg-rose-500/5 border border-rose-200 dark:border-rose-900/35 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-250">{lab.testName}</div>
                      <div className="text-[9.5px] font-mono text-slate-400 mt-1">
                        Ref: {lab.referenceRange || "N/A"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-rose-600">
                        {lab.value} {lab.unit}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider font-extrabold text-rose-500 bg-rose-500/10 px-1 py-0.5 rounded mt-0.5 inline-block">
                        {lab.flag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
