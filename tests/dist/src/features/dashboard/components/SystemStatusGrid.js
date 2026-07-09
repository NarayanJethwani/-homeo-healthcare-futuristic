"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SystemStatusGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function SystemStatusGrid({ telemetryLogs = [], failedLogsCount = 0, isLoading = false, error = null, onRetry, reduceMotion = false, }) {
    const services = (0, react_1.useMemo)(() => {
        // Determine dynamic states based on telemetry logs
        const totalLogs = telemetryLogs.length;
        const isAiRouterOverloaded = failedLogsCount > 2 || (totalLogs > 0 && (failedLogsCount / totalLogs) > 0.05);
        return [
            { name: "Firebase db", status: "online", latency: "14ms" },
            { name: "AI Router service", status: isAiRouterOverloaded ? "warning" : "online", latency: "185ms" },
            { name: "Primary LLMs", status: "online", latency: "1.2s" },
            { name: "Clinical Storage", status: "online", latency: "24ms" },
            { name: "Communications (SMTP/WA)", status: "online", latency: "95ms" },
            { name: "Billing & Invoices", status: "online", latency: "12ms" },
        ];
    }, [telemetryLogs, failedLogsCount]);
    const getStatusIcon = (status) => {
        switch (status) {
            case "warning":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" });
            case "offline":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" });
        }
    };
    const getStatusClass = (status) => {
        switch (status) {
            case "warning":
                return "text-amber-600 dark:text-amber-400";
            case "offline":
                return "text-rose-605 dark:text-rose-400";
            default:
                return "text-emerald-600 dark:text-emerald-400";
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: [...Array(6)].map((_, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl animate-pulse space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-2.5 w-20 bg-slate-150 dark:bg-slate-800 rounded" })] }, i))) })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[32px] flex items-center justify-between select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-rose-650" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-rose-850 dark:text-rose-350", children: ["Error loading engine metrics: ", error] })] }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold border-none cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3" }), "Retry"] }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Server, { className: "w-4 h-4 text-teal-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Clinical OS Engine Status" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider", children: "Live Services" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-text", children: services.map((srv, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: `p-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-start gap-2.5 hover:shadow-xs transition-shadow duration-150 ${reduceMotion ? "" : "hover:shadow-sm"}`, children: [getStatusIcon(srv.status), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] font-bold text-slate-850 dark:text-slate-100 truncate leading-tight", children: srv.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1.5 flex justify-between gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `font-bold capitalize ${getStatusClass(srv.status)}`, children: srv.status }), (0, jsx_runtime_1.jsxs)("span", { children: ["\u2022 ", srv.latency] })] })] })] }, idx))) })] }));
}
