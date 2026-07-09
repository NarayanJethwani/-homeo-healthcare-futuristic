"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodayOverviewStats;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
// Compact SVG Sparkline renderer with zero external dependencies
function Sparkline({ points, colorClass = "text-teal-500" }) {
    const width = 60;
    const height = 18;
    if (!points || points.length < 2)
        return null;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min === 0 ? 1 : max - min;
    const coords = points.map((p, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return ((0, jsx_runtime_1.jsxs)("svg", { width: width, height: height, className: `overflow-visible shrink-0 ${colorClass}`, "aria-hidden": "true", children: [(0, jsx_runtime_1.jsx)("path", { d: `M 0,${height} L ${coords.join(" L ")} L ${width},${height} Z`, fill: "currentColor", fillOpacity: "0.12", stroke: "none" }), (0, jsx_runtime_1.jsx)("path", { d: `M ${coords.join(" L ")}`, fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
function TodayOverviewStats({ stats, isLoading = false, error = null, onRetry, reduceMotion = false, }) {
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6", children: [...Array(6)].map((_, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-[20px] shadow-xs space-y-2.5 animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 w-20 bg-slate-305 dark:bg-slate-700 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 w-14 bg-slate-200 dark:bg-slate-800 rounded" })] }, i))) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 dark:bg-rose-955/25 border border-rose-200 dark:border-rose-900/60 p-4 rounded-[20px] mb-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-rose-600 dark:text-rose-455 shrink-0" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-rose-850 dark:text-rose-300", children: ["Failed to load clinical overview stats: ", error] })] }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3" }), "Retry"] }))] }));
    }
    const defaultStats = stats || {
        appointmentsCount: 0,
        followUpsCount: 0,
        abnormalReportsCount: 0,
        emergencyCasesCount: 0,
        revenueCollected: 0,
        recoveryIndex: "94.2%",
    };
    const statItems = [
        {
            label: "Appointments",
            value: defaultStats.appointmentsCount,
            trend: "+12%",
            isPositive: true,
            period: "Vs yesterday",
            icon: lucide_react_1.Calendar,
            sparkPoints: [3, 2, 4, 3, 5, 4],
            colorClass: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
            sparkColor: "text-blue-500 dark:text-blue-400",
        },
        {
            label: "Follow-ups Due",
            value: defaultStats.followUpsCount,
            trend: "-8%",
            isPositive: true, // fewer followups pending is positive
            period: "Vs last week",
            icon: lucide_react_1.RefreshCw,
            sparkPoints: [6, 5, 4, 5, 3, 3],
            colorClass: "text-sky-500 bg-sky-50 dark:bg-sky-950/20",
            sparkColor: "text-sky-500 dark:text-sky-400",
        },
        {
            label: "Abnormal Reports",
            value: defaultStats.abnormalReportsCount,
            trend: "+2 cases",
            isPositive: false,
            period: "Requires signoff",
            icon: lucide_react_1.AlertTriangle,
            sparkPoints: [0, 1, 2, 1, 1, 2],
            colorClass: defaultStats.abnormalReportsCount > 0
                ? "text-amber-500 bg-amber-50 dark:bg-amber-955/20"
                : "text-slate-400 bg-slate-50 dark:bg-slate-800/40",
            sparkColor: "text-amber-500 dark:text-amber-400",
        },
        {
            label: "Emergencies",
            value: defaultStats.emergencyCasesCount,
            trend: "Critical",
            isPositive: defaultStats.emergencyCasesCount === 0,
            period: "Active triage",
            icon: lucide_react_1.ShieldAlert,
            sparkPoints: [0, 0, 1, 0, 1, 1],
            colorClass: defaultStats.emergencyCasesCount > 0
                ? "text-rose-500 bg-rose-50 dark:bg-rose-955/20 animate-pulse"
                : "text-slate-400 bg-slate-50 dark:bg-slate-800/40",
            sparkColor: "text-rose-500 dark:text-rose-455",
        },
        {
            label: "Today's Collection",
            value: `₹${defaultStats.revenueCollected.toLocaleString("en-IN")}`,
            trend: "+24%",
            isPositive: true,
            period: "Vs target limit",
            icon: lucide_react_1.IndianRupee,
            sparkPoints: [1200, 2400, 1800, 3100, 4800, 5200],
            colorClass: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
            sparkColor: "text-emerald-500 dark:text-emerald-400",
        },
        {
            label: "Recovery Index",
            value: defaultStats.recoveryIndex,
            trend: "+1.2%",
            isPositive: true,
            period: "Outcomes rate",
            icon: lucide_react_1.TrendingUp,
            sparkPoints: [92.1, 93.4, 92.8, 93.9, 94.2, 94.2],
            colorClass: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20",
            sparkColor: "text-indigo-500 dark:text-indigo-400",
        },
    ];
    return ((0, jsx_runtime_1.jsx)("section", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6", "aria-label": "Clinical metrics overview stats", children: statItems.map((item, idx) => {
            const Icon = item.icon;
            return ((0, jsx_runtime_1.jsx)("div", { className: `bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 h-[155px] rounded-[22px] shadow-xs flex flex-col justify-between select-text transition-all ${reduceMotion ? "" : "hover:-translate-y-0.5 hover:shadow-sm duration-300"}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-grow flex flex-col justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wide truncate", children: item.label }), (0, jsx_runtime_1.jsx)("div", { className: `w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 ${item.colorClass}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-3.5 h-3.5" }) })] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-extrabold text-slate-850 dark:text-slate-100 mt-1.5 truncate tracking-tight", children: item.value }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 mt-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-0.5 text-[9px] font-bold shrink-0 ${item.isPositive
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-rose-600 dark:text-rose-455"}`, children: [item.isPositive ? (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpRight, { className: "w-2.5 h-2.5 shrink-0" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDownRight, { className: "w-2.5 h-2.5 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: item.trend })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[8px] text-slate-400 dark:text-slate-500 truncate font-medium", children: item.period })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-end mt-2 pt-2 border-t border-slate-100/30 dark:border-slate-850/40", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[8px] text-slate-400 dark:text-slate-550 font-medium", children: "Trend Log" }), (0, jsx_runtime_1.jsx)(Sparkline, { points: item.sparkPoints, colorClass: item.sparkColor })] })] }) }, idx));
        }) }));
}
