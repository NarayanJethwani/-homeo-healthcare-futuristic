"use client";

import React, { useState } from "react";
import { TrendingUp, BarChart4, DollarSign, Award, Percent, ThumbsUp, Activity, Check } from "lucide-react";

interface AnalyticsPanelProps {
  timeframe: "today" | "week" | "month" | "year";
  setTimeframe: (val: "today" | "week" | "month" | "year") => void;
}

export default function AnalyticsPanel({ timeframe, setTimeframe }: AnalyticsPanelProps) {
  const [activeTab, setActiveTab] = useState<"recovery" | "volume" | "revenue">("recovery");

  // SVG dimensions for charts
  const width = 500;
  const height = 150;

  // Chart data points based on selected timeframe
  const chartData = React.useMemo(() => {
    switch (timeframe) {
      case "today":
        return {
          recoveryPoints: [94.0, 94.2, 94.1, 94.5, 94.2],
          volumeBars: [2, 4, 3, 5, 2],
          labels: ["09 AM", "11 AM", "01 PM", "03 PM", "05 PM"],
          revenuePoints: [1500, 3500, 4700, 7200, 8400],
        };
      case "week":
        return {
          recoveryPoints: [93.1, 93.5, 94.0, 93.8, 94.2, 94.1, 94.5],
          volumeBars: [8, 12, 10, 15, 9, 7, 5],
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          revenuePoints: [4500, 12000, 18000, 24000, 32000, 38000, 42000],
        };
      case "month":
        return {
          recoveryPoints: [91.8, 92.5, 93.0, 94.2],
          volumeBars: [32, 45, 38, 52],
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          revenuePoints: [15000, 38000, 62000, 89000],
        };
      default: // year
        return {
          recoveryPoints: [89.5, 90.2, 91.8, 92.4, 93.5, 94.2],
          volumeBars: [120, 145, 160, 195, 210, 245],
          labels: ["Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sep-Oct", "Nov-Dec"],
          revenuePoints: [50000, 120000, 210000, 340000, 480000, 620000],
        };
    }
  }, [timeframe]);

  // Compute SVG line paths
  const recoveryLinePath = React.useMemo(() => {
    const pts = chartData.recoveryPoints;
    const min = Math.min(...pts) - 0.5;
    const max = Math.max(...pts) + 0.5;
    const range = max - min;

    const coords = pts.map((val, idx) => {
      const x = (idx / (pts.length - 1)) * (width - 40) + 20;
      const y = height - ((val - min) / range) * (height - 40) - 20;
      return { x, y };
    });

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      // Smooth cubic bezier calculation
      const cpX1 = coords[i - 1].x + (coords[i].x - coords[i - 1].x) / 2;
      const cpY1 = coords[i - 1].y;
      const cpX2 = coords[i - 1].x + (coords[i].x - coords[i - 1].x) / 2;
      const cpY2 = coords[i].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
    }

    const closedPath = `${path} L ${coords[coords.length - 1].x} ${height - 10} L ${coords[0].x} ${height - 10} Z`;

    return { line: path, area: closedPath, coords };
  }, [chartData]);

  const revenueLinePath = React.useMemo(() => {
    const pts = chartData.revenuePoints;
    const min = 0;
    const max = Math.max(...pts) * 1.1;
    const range = max - min;

    const coords = pts.map((val, idx) => {
      const x = (idx / (pts.length - 1)) * (width - 40) + 20;
      const y = height - ((val - min) / range) * (height - 40) - 20;
      return { x, y };
    });

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const cpX1 = coords[i - 1].x + (coords[i].x - coords[i - 1].x) / 2;
      const cpY1 = coords[i - 1].y;
      const cpX2 = coords[i - 1].x + (coords[i].x - coords[i - 1].x) / 2;
      const cpY2 = coords[i].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
    }

    const closedPath = `${path} L ${coords[coords.length - 1].x} ${height - 10} L ${coords[0].x} ${height - 10} Z`;

    return { line: path, area: closedPath, coords };
  }, [chartData]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 select-text">
      
      {/* Header and timeframe filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250 flex items-center gap-2">
          <BarChart4 className="w-4 h-4 text-emerald-500" />
          <span>Clinical & Financial Analytics</span>
        </h3>
        
        {/* Timeframe pill selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 max-w-fit">
          {(["today", "week", "month", "year"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-[9.5px] font-bold uppercase transition-all border-none cursor-pointer ${
                timeframe === tf
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Chart selector tabs */}
          <div className="flex gap-2">
            {[
              { id: "recovery", label: "Recovery Trend", icon: TrendingUp },
              { id: "volume", label: "Consultation Volume", icon: Activity },
              { id: "revenue", label: "Revenue Growth", icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    activeTab === tab.id
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900 text-emerald-650 dark:text-emerald-400"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-850 dark:hover:text-slate-205"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* SVG Canvas */}
          <div className="w-full bg-slate-50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Grid Lines */}
              <line x1="20" y1="20" x2={width - 20} y2="20" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3" />
              <line x1="20" y1="65" x2={width - 20} y2="65" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3" />
              <line x1="20" y1="110" x2={width - 20} y2="110" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3" />

              {/* RENDER: Recovery Trend Line */}
              {activeTab === "recovery" && (
                <>
                  <defs>
                    <linearGradient id="recoveryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={recoveryLinePath.area} fill="url(#recoveryAreaGrad)" />
                  <path
                    d={recoveryLinePath.line}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {recoveryLinePath.coords.map((c, idx) => (
                    <circle
                      key={idx}
                      cx={c.x}
                      cy={c.y}
                      r="3.5"
                      fill="#ffffff"
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )}

              {/* RENDER: Revenue Growth Line */}
              {activeTab === "revenue" && (
                <>
                  <defs>
                    <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={revenueLinePath.area} fill="url(#revenueAreaGrad)" />
                  <path
                    d={revenueLinePath.line}
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {revenueLinePath.coords.map((c, idx) => (
                    <circle
                      key={idx}
                      cx={c.x}
                      cy={c.y}
                      r="3.5"
                      fill="#ffffff"
                      stroke="#0EA5E9"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )}

              {/* RENDER: Volume Bars */}
              {activeTab === "volume" &&
                chartData.volumeBars.map((val, idx) => {
                  const barCount = chartData.volumeBars.length;
                  const barWidth = Math.min(30, (width - 80) / barCount);
                  const x = (idx / barCount) * (width - 40) + 30;
                  const maxBar = Math.max(...chartData.volumeBars);
                  const barHeight = (val / maxBar) * (height - 40);
                  const y = height - barHeight - 15;

                  return (
                    <rect
                      key={idx}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill="#6366F1"
                      opacity="0.85"
                      className="transition-all duration-300"
                    />
                  );
                })}

              {/* X Axis Labels */}
              {chartData.labels.map((label, idx) => {
                const count = chartData.labels.length;
                const x = (idx / (count - 1)) * (width - 50) + 25;
                return (
                  <text
                    key={idx}
                    x={x}
                    y={height - 2}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="7.5"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
            <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-3 px-1 border-t border-slate-150/40 dark:border-slate-800 pt-2 shrink-0 select-none">
              <span>Timeframe: {timeframe.toUpperCase()}</span>
              {activeTab === "recovery" && (
                <span>Avg Recovery Rate: <span className="text-emerald-500 font-bold">94.2%</span></span>
              )}
              {activeTab === "volume" && (
                <span>Total Consultations: <span className="text-indigo-500 font-bold">384 cases</span></span>
              )}
              {activeTab === "revenue" && (
                <span>Total Revenue: <span className="text-sky-500 font-bold">₹8.4L</span></span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mini stats (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* General Stats progress lines */}
          <div className="space-y-4">
            {/* 1. Disease Distribution */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-550 block">
                Disease Affinity
              </span>
              <div className="space-y-2">
                {[
                  { name: "GERD / Digestive", pct: 40, color: "bg-emerald-500" },
                  { name: "Suppressed Eczema", pct: 35, color: "bg-indigo-500" },
                  { name: "Thyroid Endocrine", pct: 25, color: "bg-sky-500" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-350">
                      <span>{item.name}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Top remedies compound */}
            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-550 block">
                Top Remedy Afinities
              </span>
              <div className="flex flex-wrap gap-2 pt-1.5">
                {[
                  { name: "Sulphur", qty: 42 },
                  { name: "Lycopodium", qty: 31 },
                  { name: "Nux Vomica", qty: 28 },
                  { name: "Thyroidinum", qty: 14 },
                ].map((rem, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
                  >
                    <span>{rem.name}</span>
                    <span className="bg-slate-200 dark:bg-slate-750 px-1 py-0.25 rounded text-[8.5px] text-slate-500">
                      {rem.qty}x
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Follow-up and AI accuracy */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-center space-y-1 border border-slate-100 dark:border-slate-800">
                <Percent className="w-4 h-4 text-emerald-500 mx-auto" />
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">
                  Compliance
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  88.5%
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-center space-y-1 border border-slate-100 dark:border-slate-800">
                <ThumbsUp className="w-4 h-4 text-indigo-500 mx-auto" />
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">
                  AI Accuracy
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  96.2%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
