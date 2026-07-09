"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function AnalyticsPanel({ timeframe, setTimeframe, isLoading = false, error = null, onRetry, reduceMotion = false, }) {
    const [activeTab, setActiveTab] = (0, react_1.useState)("recovery");
    // SVG dimensions for charts
    const width = 500;
    const height = 150;
    // Chart data points based on selected timeframe
    const chartData = (0, react_1.useMemo)(() => {
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
    // Compute SVG line paths for recovery
    const recoveryLinePath = (0, react_1.useMemo)(() => {
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
            const cpX1 = coords[i - 1].x + (coords[i].x - coords[i - 1].x) / 2;
            const cpY1 = coords[i - 1].y;
            const cpX2 = coords[i - 1].x + (coords[i].x - coords[i - 1].x) / 2;
            const cpY2 = coords[i].y;
            path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
        }
        const closedPath = `${path} L ${coords[coords.length - 1].x} ${height - 10} L ${coords[0].x} ${height - 10} Z`;
        return { line: path, area: closedPath, coords };
    }, [chartData]);
    // Compute SVG line paths for revenue
    const revenueLinePath = (0, react_1.useMemo)(() => {
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
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs animate-pulse space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-6 w-24 bg-slate-250 dark:bg-slate-850 rounded" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-8 h-40 bg-slate-100 dark:bg-slate-850/50 rounded-3xl" }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-4 space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-5/6 bg-slate-150 dark:bg-slate-850 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-4/6 bg-slate-150 dark:bg-slate-850 rounded" })] })] })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[32px] flex items-center justify-between select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-rose-650" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-rose-850 dark:text-rose-350", children: ["Error loading analytics: ", error] })] }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5 border-none focus-visible:ring-2 focus-visible:ring-rose-500 outline-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3" }), "Retry"] }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 select-text", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 select-none", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart4, { className: "w-4.5 h-4.5 text-teal-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Clinical & Financial Analytics" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 max-w-fit border border-slate-100 dark:border-slate-750", children: ["today", "week", "month", "year"].map((tf) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setTimeframe(tf), className: `px-3 py-1 rounded-lg text-[9.5px] font-bold uppercase transition-all border-none cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-555 outline-none ${timeframe === tf
                                ? "bg-white dark:bg-slate-900 text-teal-655 dark:text-teal-400 shadow-xs"
                                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent"}`, children: tf }, tf))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-8 space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 select-none", children: [
                                    { id: "recovery", label: "Recovery Trend", icon: lucide_react_1.TrendingUp },
                                    { id: "volume", label: "Consultation Volume", icon: lucide_react_1.Activity },
                                    { id: "revenue", label: "Revenue Growth", icon: lucide_react_1.DollarSign },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab(tab.id), className: `px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${activeTab === tab.id
                                            ? "bg-teal-50/50 dark:bg-teal-955/20 border-teal-200 dark:border-teal-900 text-teal-655 dark:text-teal-400"
                                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"}`, children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-3.5 h-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: tab.label })] }, tab.id));
                                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "w-full bg-slate-50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between", children: [(0, jsx_runtime_1.jsxs)("svg", { viewBox: `0 0 ${width} ${height}`, className: "w-full h-auto overflow-visible select-none", role: "img", "aria-label": `Analytics chart rendering ${activeTab}`, children: [(0, jsx_runtime_1.jsx)("line", { x1: "20", y1: "20", x2: width - 20, y2: "20", stroke: "rgba(148, 163, 184, 0.08)", strokeDasharray: "3" }), (0, jsx_runtime_1.jsx)("line", { x1: "20", y1: "65", x2: width - 20, y2: "65", stroke: "rgba(148, 163, 184, 0.08)", strokeDasharray: "3" }), (0, jsx_runtime_1.jsx)("line", { x1: "20", y1: "110", x2: width - 20, y2: "110", stroke: "rgba(148, 163, 184, 0.08)", strokeDasharray: "3" }), activeTab === "recovery" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: "recoveryAreaGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "#10B981", stopOpacity: "0.25" }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "#10B981", stopOpacity: "0.0" })] }) }), (0, jsx_runtime_1.jsx)("path", { d: recoveryLinePath.area, fill: "url(#recoveryAreaGrad)" }), (0, jsx_runtime_1.jsx)("path", { d: recoveryLinePath.line, fill: "none", stroke: "#10B981", strokeWidth: "2.5", strokeLinecap: "round" }), recoveryLinePath.coords.map((c, idx) => ((0, jsx_runtime_1.jsx)("circle", { cx: c.x, cy: c.y, r: "3.5", fill: "#ffffff", stroke: "#10B981", strokeWidth: "2" }, idx)))] })), activeTab === "revenue" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: "revenueAreaGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "#0EA5E9", stopOpacity: "0.25" }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "#0EA5E9", stopOpacity: "0.0" })] }) }), (0, jsx_runtime_1.jsx)("path", { d: revenueLinePath.area, fill: "url(#revenueAreaGrad)" }), (0, jsx_runtime_1.jsx)("path", { d: revenueLinePath.line, fill: "none", stroke: "#0EA5E9", strokeWidth: "2.5", strokeLinecap: "round" }), revenueLinePath.coords.map((c, idx) => ((0, jsx_runtime_1.jsx)("circle", { cx: c.x, cy: c.y, r: "3.5", fill: "#ffffff", stroke: "#0EA5E9", strokeWidth: "2" }, idx)))] })), activeTab === "volume" &&
                                                chartData.volumeBars.map((val, idx) => {
                                                    const barCount = chartData.volumeBars.length;
                                                    const barWidth = Math.min(30, (width - 80) / barCount);
                                                    const x = (idx / barCount) * (width - 40) + 30;
                                                    const maxBar = Math.max(...chartData.volumeBars);
                                                    const barHeight = (val / maxBar) * (height - 40);
                                                    const y = height - barHeight - 15;
                                                    return ((0, jsx_runtime_1.jsx)("rect", { x: x, y: y, width: barWidth, height: barHeight, rx: "4", fill: "#6366F1", opacity: "0.85", className: reduceMotion ? "" : "transition-all duration-350" }, idx));
                                                }), chartData.labels.map((label, idx) => {
                                                const count = chartData.labels.length;
                                                const x = (idx / (count - 1)) * (width - 50) + 25;
                                                return ((0, jsx_runtime_1.jsx)("text", { x: x, y: height - 2, textAnchor: "middle", fill: "#94A3B8", fontSize: "7.5", fontWeight: "bold", fontFamily: "sans-serif", children: label }, idx));
                                            })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-3 px-1 border-t border-slate-150/40 dark:border-slate-800 pt-2 shrink-0 select-none", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Timeframe: ", timeframe.toUpperCase()] }), activeTab === "recovery" && ((0, jsx_runtime_1.jsxs)("span", { children: ["Avg Recovery Rate: ", (0, jsx_runtime_1.jsx)("span", { className: "text-emerald-500 font-bold", children: "94.2%" })] })), activeTab === "volume" && ((0, jsx_runtime_1.jsxs)("span", { children: ["Total Consultations: ", (0, jsx_runtime_1.jsx)("span", { className: "text-indigo-500 font-bold", children: "384 cases" })] })), activeTab === "revenue" && ((0, jsx_runtime_1.jsxs)("span", { children: ["Total Revenue: ", (0, jsx_runtime_1.jsx)("span", { className: "text-sky-555 font-bold", children: "\u20B98.4L" })] }))] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-4 space-y-5", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-slate-405 dark:text-slate-500 block", children: "Disease Affinity" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 pt-1", children: [
                                                { name: "GERD / Digestive", pct: 40, color: "bg-emerald-500" },
                                                { name: "Suppressed Eczema", pct: 35, color: "bg-indigo-500" },
                                                { name: "Thyroid Endocrine", pct: 25, color: "bg-sky-500" },
                                            ].map((item, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between font-bold text-slate-700 dark:text-slate-350", children: [(0, jsx_runtime_1.jsx)("span", { children: item.name }), (0, jsx_runtime_1.jsxs)("span", { children: [item.pct, "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full ${item.color} ${reduceMotion ? "" : "transition-all duration-500"}`, style: { width: `${item.pct}%` } }) })] }, idx))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 pt-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-slate-405 dark:text-slate-500 block", children: "Top Remedy affinities" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 pt-1.5", children: [
                                                { name: "Sulphur", qty: 42 },
                                                { name: "Lycopodium", qty: 31 },
                                                { name: "Nux Vomica", qty: 28 },
                                                { name: "Thyroidinum", qty: 14 },
                                            ].map((rem, idx) => ((0, jsx_runtime_1.jsxs)("span", { className: "bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-800 px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 select-none", children: [(0, jsx_runtime_1.jsx)("span", { children: rem.name }), (0, jsx_runtime_1.jsxs)("span", { className: "bg-slate-200 dark:bg-slate-750 px-1 py-0.25 rounded text-[8.5px] text-slate-500", children: [rem.qty, "x"] })] }, idx))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-center space-y-1 border border-slate-100 dark:border-slate-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Percent, { className: "w-4 h-4 text-emerald-500 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[9px] uppercase tracking-widest text-slate-400 font-extrabold", children: "Compliance" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-855 dark:text-slate-100", children: "88.5%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 dark:bg-slate-855/50 rounded-2xl text-center space-y-1 border border-slate-100 dark:border-slate-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsUp, { className: "w-4 h-4 text-indigo-500 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[9px] uppercase tracking-widest text-slate-400 font-extrabold", children: "AI Accuracy" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-855 dark:text-slate-100", children: "96.2%" })] })] })] }) })] })] }));
}
