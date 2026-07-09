"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CriticalAlertsPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const useClinicalAlerts_1 = require("../hooks/useClinicalAlerts");
function CriticalAlertsPanel({ patients = [], onSelectPatient, setActiveTab, dismissedAlerts = [], onDismissAlert, isLoading = false, error = null, onRetry, reduceMotion = false, }) {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)("");
    const [severityFilter, setSeverityFilter] = (0, react_1.useState)("all");
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(false);
    const { alerts: baseAlerts, activeDismissed, togglePin, toggleMute, acknowledgeAlert, dismissAlert, acknowledgedAlerts, } = (0, useClinicalAlerts_1.useClinicalAlerts)(patients, dismissedAlerts);
    const handleDismiss = (id) => {
        if (onDismissAlert) {
            onDismissAlert(id);
        }
        else {
            dismissAlert(id);
        }
    };
    const handleTogglePin = (id, e) => {
        e.stopPropagation();
        togglePin(id);
    };
    const handleToggleMute = (id, e) => {
        e.stopPropagation();
        toggleMute(id);
    };
    const handleAcknowledge = (id, e) => {
        e.stopPropagation();
        acknowledgeAlert(id);
    };
    const handleOpenPatient = (patientId) => {
        onSelectPatient(patientId);
        setActiveTab("patients");
    };
    // Filter alerts by search query, severity, and dismissed status
    const processedAlerts = (0, react_1.useMemo)(() => {
        return baseAlerts
            .filter((alert) => !activeDismissed.includes(alert.id))
            .filter((alert) => {
            if (severityFilter !== "all" && alert.level !== severityFilter)
                return false;
            if (!searchQuery)
                return true;
            const query = searchQuery.toLowerCase();
            return (alert.message.toLowerCase().includes(query) ||
                (alert.patientName && alert.patientName.toLowerCase().includes(query)) ||
                (alert.category && alert.category.toLowerCase().includes(query)));
        })
            .sort((a, b) => {
            // Pinned alerts always float to top
            if (a.isPinned && !b.isPinned)
                return -1;
            if (!a.isPinned && b.isPinned)
                return 1;
            return 0;
        });
    }, [baseAlerts, activeDismissed, severityFilter, searchQuery]);
    const levelCounts = (0, react_1.useMemo)(() => {
        const counts = { critical: 0, high: 0, medium: 0, info: 0 };
        baseAlerts
            .filter((a) => !activeDismissed.includes(a.id))
            .forEach((a) => {
            if (a.level in counts)
                counts[a.level]++;
        });
        return counts;
    }, [baseAlerts, activeDismissed]);
    const getAlertStyles = (level) => {
        switch (level) {
            case "critical":
                return {
                    border: "border-rose-250/60 dark:border-rose-950/20 bg-rose-50/20 dark:bg-rose-955/5",
                    text: "text-rose-900 dark:text-rose-400",
                    badge: "bg-rose-100 dark:bg-rose-955/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30",
                    iconColor: "text-rose-600 dark:text-rose-455",
                };
            case "high":
                return {
                    border: "border-amber-250/60 dark:border-amber-955/20 bg-amber-50/20 dark:bg-amber-955/5",
                    text: "text-amber-900 dark:text-amber-400",
                    badge: "bg-amber-100 dark:bg-amber-955/30 text-amber-700 dark:text-amber-450 border border-amber-200/50 dark:border-amber-900/30",
                    iconColor: "text-amber-600 dark:text-amber-455",
                };
            case "medium":
                return {
                    border: "border-sky-200/60 dark:border-sky-950/20 bg-sky-50/15 dark:bg-sky-955/5",
                    text: "text-sky-900 dark:text-sky-400",
                    badge: "bg-sky-100 dark:bg-sky-955/30 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-900/30",
                    iconColor: "text-sky-600 dark:text-sky-455",
                };
            default:
                return {
                    border: "border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10",
                    text: "text-slate-700 dark:text-slate-350",
                    badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750",
                    iconColor: "text-slate-500 dark:text-slate-400",
                };
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [1, 2].map((i) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3.5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-5/6 bg-slate-150 dark:bg-slate-850 rounded" })] }, i))) })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[32px] flex items-center justify-between select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-rose-650" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-rose-850 dark:text-rose-350", children: ["Error loading smart alerts: ", error] })] }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none border-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3 animate-spin" }), "Retry"] }))] }));
    }
    const activeAlertsCount = baseAlerts.filter((a) => !activeDismissed.includes(a.id)).length;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-4.5 h-4.5 text-rose-500 shrink-0" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-bold text-slate-800 dark:text-slate-200", children: "Smart Alerts" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [activeAlertsCount > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] bg-rose-50 dark:bg-rose-955/35 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20 px-2 py-0.5 rounded-full font-bold", children: [activeAlertsCount, " Active"] })), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsCollapsed(!isCollapsed), className: "p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 cursor-pointer border-none bg-transparent focus-visible:ring-2 focus-visible:ring-teal-500 outline-none", "aria-label": isCollapsed ? "Expand alerts panel" : "Collapse alerts panel", children: isCollapsed ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3.5 h-3.5" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "w-3.5 h-3.5" }) })] })] }), !isCollapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-2 select-none border-b border-slate-50 dark:border-slate-850 pb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search alerts by patient name, keyword...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-8.5 pr-3 py-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-555" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none", children: ["all", "critical", "high", "medium", "info"].map((level) => {
                                    const count = level === "all" ? activeAlertsCount : levelCounts[level];
                                    const isSelected = severityFilter === level;
                                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setSeverityFilter(level), className: `px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold uppercase border cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-555 outline-none transition-all ${isSelected
                                            ? "bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-300 dark:border-teal-500/30 font-extrabold"
                                            : "bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-850/60"}`, children: [level, " (", count, ")"] }, level));
                                }) })] }), processedAlerts.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3 max-h-[360px] overflow-y-auto pr-1", children: processedAlerts.map((alert) => {
                            const isMuted = alert.isMuted;
                            const isPinned = alert.isPinned;
                            const styles = getAlertStyles(alert.level);
                            const ack = acknowledgedAlerts[alert.id];
                            return ((0, jsx_runtime_1.jsxs)("div", { className: `p-4 rounded-2xl border flex gap-3 text-xs items-start relative group transition-all ${styles.border} ${isMuted ? "opacity-60" : "opacity-100"}`, role: "alert", children: [alert.level === "critical" || alert.level === "high" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: `w-4 h-4 shrink-0 mt-0.5 ${styles.iconColor} ${isMuted ? "" : "animate-pulse"}` })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: `w-4 h-4 shrink-0 mt-0.5 ${styles.iconColor}` })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0 pr-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-wrap", children: [alert.category && ((0, jsx_runtime_1.jsx)("span", { className: "text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500", children: alert.category })), (0, jsx_runtime_1.jsx)("span", { className: `text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded ${styles.badge}`, children: alert.level }), isPinned && ((0, jsx_runtime_1.jsx)(lucide_react_1.Pin, { className: "w-3 h-3 text-amber-500 fill-amber-500 shrink-0" })), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-slate-400 dark:text-slate-550 ml-auto font-mono", children: alert.timestamp })] }), (0, jsx_runtime_1.jsxs)("div", { className: `mt-1.5 leading-normal ${styles.text}`, children: [alert.patientName && ((0, jsx_runtime_1.jsxs)("span", { className: "font-extrabold text-slate-800 dark:text-slate-100 mr-1.5", children: [alert.patientName, ":"] })), alert.message] }), ack && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2.5 flex items-center gap-1.5 text-[10px] text-teal-650 dark:text-teal-400 font-semibold bg-teal-50/40 dark:bg-teal-950/10 p-1.5 rounded-lg border border-teal-100/50 dark:border-teal-900/20 select-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3.5 h-3.5 text-teal-555 shrink-0" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Acknowledged at ", ack.time, " by ", ack.user] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3.5 flex items-center gap-2 flex-wrap select-none", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => handleOpenPatient(alert.id.split("-").pop() || ""), className: "px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[10px] font-bold border-none transition-all flex items-center gap-1 cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-500 outline-none", children: [(0, jsx_runtime_1.jsx)("span", { children: "Open Case" }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-3 h-3" })] }), !ack && ((0, jsx_runtime_1.jsx)("button", { onClick: (e) => handleAcknowledge(alert.id, e), className: "px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-650 border border-teal-100 rounded-xl text-[10px] font-bold transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-550 outline-none", children: "Acknowledge" })), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => handleTogglePin(alert.id, e), className: `p-1 rounded-lg border border-slate-205 dark:border-slate-800 transition-all cursor-pointer bg-transparent focus-visible:ring-1 focus-visible:ring-teal-500 outline-none ${isPinned ? "text-amber-500 bg-amber-50 dark:bg-amber-950/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`, title: isPinned ? "Unpin alert" : "Pin alert", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pin, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => handleToggleMute(alert.id, e), className: `p-1 rounded-lg border border-slate-205 dark:border-slate-800 transition-all cursor-pointer bg-transparent focus-visible:ring-1 focus-visible:ring-teal-555 outline-none ${isMuted ? "text-slate-600 bg-slate-100 dark:bg-slate-800" : "text-slate-400 hover:text-slate-655"}`, title: isMuted ? "Unmute alert" : "Mute alert", children: (0, jsx_runtime_1.jsx)(lucide_react_1.VolumeX, { className: "w-3 h-3" }) })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDismiss(alert.id), className: "absolute top-3.5 right-3.5 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all border-none bg-transparent cursor-pointer", title: "Dismiss alert", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3.5 h-3.5" }) })] }, alert.id));
                        }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] space-y-4 select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 animate-pulse" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: "All Systems Operational" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto", children: "No active critical alerts. AI router, KMS, and CDSS clinical rules are synchronized." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3 pt-2 text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500", children: "System Uptime" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5", children: "99.98% (Stable)" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500", children: "AI Router Status" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-0.5 flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" }), (0, jsx_runtime_1.jsx)("span", { children: "Connected" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500", children: "CDSS Knowledge KMS" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5", children: "Synchronized (2.4k rules)" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500", children: "Active Telemetry" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5", children: "0 errors / min" })] })] })] }))] })), isCollapsed && activeAlertsCount > 0 && ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsCollapsed(false), className: "w-full text-center py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-[10.5px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer border-none transition-colors select-none", children: ["Show ", activeAlertsCount, " collapsed smart alerts..."] }))] }));
}
