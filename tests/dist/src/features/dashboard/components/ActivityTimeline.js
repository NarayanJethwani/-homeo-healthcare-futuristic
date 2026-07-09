"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivityTimeline;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function ActivityTimeline({ patients = [], onSelectPatient, setActiveTab, isLoading = false, error = null, onRetry, reduceMotion = false, }) {
    const timelineData = (0, react_1.useMemo)(() => {
        if (patients.length === 0)
            return [];
        const list = [];
        // Map live activities based on patients
        patients.forEach((pat, idx) => {
            const pId = pat.id;
            const name = pat.name;
            if (idx === 0) {
                list.push({
                    id: `timeline-checkin-${pId}`,
                    icon: lucide_react_1.UserCheck,
                    iconColor: "text-teal-650 bg-teal-50 dark:bg-teal-950/20",
                    title: "Patient checked in for appointment",
                    time: "2 hours ago",
                    patientName: name,
                    patientId: pId,
                    actionLabel: "Open Case",
                    actionTab: "patients",
                });
            }
            else if (idx === 1) {
                list.push({
                    id: `timeline-report-${pId}`,
                    icon: lucide_react_1.FileText,
                    iconColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20",
                    title: "Diagnostic blood report uploaded",
                    time: "4 hours ago",
                    patientName: name,
                    patientId: pId,
                    actionLabel: "Open Report Analyzer",
                    actionTab: "analyzer",
                });
            }
            else if (idx === 2) {
                list.push({
                    id: `timeline-presc-${pId}`,
                    icon: lucide_react_1.ShieldCheck,
                    iconColor: "text-teal-605 bg-teal-50 dark:bg-teal-950/20",
                    title: "Prescription compound generated",
                    time: "1 day ago",
                    patientName: name,
                    patientId: pId,
                    actionLabel: "Open Treatment Plan",
                    actionTab: "treatment-planner",
                });
            }
        });
        if (list.length < 3) {
            list.push({
                id: "timeline-fallback-1",
                icon: lucide_react_1.CreditCard,
                iconColor: "text-sky-600 bg-sky-50 dark:bg-sky-950/20",
                title: "Invoice #INV-2026-004 paid successfully",
                time: "1 day ago",
                patientName: "Baby Kabir",
                patientId: "mock-kabir",
                actionLabel: "View Billing",
                actionTab: "treatment-planner",
            });
            list.push({
                id: "timeline-fallback-2",
                icon: lucide_react_1.Sparkles,
                iconColor: "text-amber-605 bg-amber-50 dark:bg-amber-955/20",
                title: "AI CDSS advisory recommendation generated",
                time: "2 days ago",
                patientName: "Meera Jethwani",
                patientId: "mock-meera",
                actionLabel: "Review Recommendation",
                actionTab: "dashboard",
            });
            list.push({
                id: "timeline-fallback-3",
                icon: lucide_react_1.FileSpreadsheet,
                iconColor: "text-rose-650 bg-rose-50 dark:bg-rose-955/20",
                title: "Case record details synchronized to Firestore",
                time: "3 days ago",
                patientName: "Rahul Sharma",
                patientId: "mock-rahul",
                actionLabel: "Open Patients",
                actionTab: "patients",
            });
        }
        return list;
    }, [patients]);
    const handleAction = (item) => {
        if (item.actionTab) {
            onSelectPatient(item.patientId);
            setActiveTab(item.actionTab);
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" }), (0, jsx_runtime_1.jsxs)("div", { className: "pl-6 space-y-4 relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-850" }), [1, 2, 3].map((i) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 items-center justify-between p-3 animate-pulse", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 w-1/3 bg-slate-200 dark:bg-slate-850 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-2.5 w-1/2 bg-slate-150 dark:bg-slate-800 rounded" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 w-12 bg-slate-200 dark:bg-slate-850 rounded" })] }, i)))] })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[32px] flex items-center justify-between select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-rose-650" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-rose-850 dark:text-rose-350", children: ["Error loading timeline: ", error] })] }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold border-none cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3" }), "Retry"] }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 select-text", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-4 h-4 text-teal-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Recent Clinical Timeline" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider", children: "Chronological Audit Feed" })] }), timelineData.length > 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative pl-6 space-y-5", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" }), timelineData.map((item) => {
                        const Icon = item.icon;
                        return ((0, jsx_runtime_1.jsxs)("div", { className: `relative flex flex-col gap-1.5 ${reduceMotion ? "" : "animate-in fade-in duration-200"}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `absolute -left-6 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 ${item.iconColor}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-3 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-bold text-slate-850 dark:text-slate-100 leading-snug", children: item.title }), (0, jsx_runtime_1.jsxs)("div", { className: "text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-normal", children: ["Patient: ", (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-700 dark:text-slate-350", children: item.patientName })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right shrink-0 flex items-center gap-3 select-none", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9.5px] text-slate-400 dark:text-slate-550 font-mono font-medium block", children: item.time }), item.actionLabel && ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleAction(item), className: `px-2 py-0.5 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-955/20 text-slate-550 dark:text-slate-400 hover:text-teal-650 dark:hover:text-teal-400 rounded-lg text-[9px] font-bold border border-slate-200 dark:border-slate-750 cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-500 outline-none transition-all ${reduceMotion ? "" : "active:scale-98"}`, children: item.actionLabel }))] })] })] }, item.id));
                    })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 select-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ClipboardList, { className: "w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: "No activity registered today" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-400 dark:text-slate-600 max-w-xs mx-auto", children: "Audit logs and intake events will begin populating here as actions occur." })] }))] }));
}
