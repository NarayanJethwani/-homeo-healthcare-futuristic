"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PatientQueue;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const usePatientQueue_1 = require("../hooks/usePatientQueue");
function PatientQueue({ patients = [], onSelectPatient, setActiveTab, isLoading = false, error = null, onRetry, reduceMotion = false, }) {
    const { queue } = (0, usePatientQueue_1.usePatientQueue)(patients);
    // Track expanded card IDs locally for progressive disclosure
    const [expandedCardIds, setExpandedCardIds] = (0, react_1.useState)({});
    const displayQueue = react_1.default.useMemo(() => {
        return queue.length > 0 ? queue : [
            {
                id: "pat-rahul-01",
                name: "Rahul Sharma",
                age: "34",
                gender: "Male",
                complaint: "Suppressed Eczema & Chronic Asthma flares",
                priority: "Critical",
                lastVisit: "12 Mar 2026",
                assignedDoctor: "Dr. N. Jethwani",
                currentRemedy: "Sulphur 200C",
                followUpDue: "Jul 14, 2026",
                outstandingReports: "2 files",
                paymentStatus: "Paid",
                stage: "Intake Pending",
                pendingReports: ["IgE Panel", "Absolute Eosinophils"],
            },
            {
                id: "pat-meera-02",
                name: "Meera Jethwani",
                age: "62",
                gender: "Female",
                complaint: "Severe GERD & Autonomic Dysregulation",
                priority: "High",
                lastVisit: "22 Feb 2026",
                assignedDoctor: "Dr. N. Jethwani",
                currentRemedy: "Nux Vomica 200C",
                followUpDue: "Jul 18, 2026",
                outstandingReports: "2 files",
                paymentStatus: "Pending",
                stage: "Report Analyzer",
                pendingReports: ["TSH Axis", "Fasting Glucose"],
            },
            {
                id: "pat-kabir-03",
                name: "Baby Kabir",
                age: "5",
                gender: "Male",
                complaint: "Dry Psoric Skin Itching & eruptions",
                priority: "Medium",
                lastVisit: "08 Jan 2026",
                assignedDoctor: "Dr. R. Lokhande",
                currentRemedy: "Graphites 6C",
                followUpDue: "Jul 22, 2026",
                outstandingReports: "1 file",
                paymentStatus: "Partial",
                stage: "Outreach Pending",
                pendingReports: ["CBC Count"],
            },
        ];
    }, [queue]);
    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const handleOpenPatient = (id) => {
        onSelectPatient(id);
        setActiveTab("patients");
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Critical":
                return "bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
            case "High":
                return "bg-amber-50 text-amber-800 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
            default:
                return "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [1, 2].map((i) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-slate-50 dark:bg-slate-850 rounded-[20px] border border-slate-205 dark:border-slate-800 animate-pulse space-y-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-5/6 bg-slate-150 dark:bg-slate-850 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" })] }, i))) })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[24px] flex items-center justify-between select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-rose-650" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-rose-850 dark:text-rose-350", children: ["Error loading intake queue: ", error] })] }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5 border-none focus-visible:ring-2 focus-visible:ring-rose-500 outline-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3" }), "Retry"] }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-202/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-4 h-4 text-teal-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Patient Intake Queue" })] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold", children: ["Active cases: ", displayQueue.length] })] }), displayQueue.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: displayQueue.map((pat) => {
                    const isExpanded = !!expandedCardIds[pat.id];
                    return ((0, jsx_runtime_1.jsx)("div", { onClick: (e) => toggleExpand(pat.id, e), className: `p-4 bg-slate-50 dark:bg-slate-850/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border border-slate-202/50 dark:border-slate-800 rounded-[20px] flex flex-col justify-between gap-3 select-text relative cursor-pointer transition-all ${reduceMotion ? "" : "hover:-translate-y-0.5 duration-200"}`, children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-2 border-b border-slate-100/60 dark:border-slate-800/40 pb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-extrabold text-slate-850 dark:text-slate-105", children: pat.name }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[9.5px] text-slate-400 dark:text-slate-550 font-bold mt-0.5 block", children: [pat.age, " y/o \u2022 ", pat.gender] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase ${getPriorityColor(pat.priority)}`, children: pat.priority }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => toggleExpand(pat.id, e), className: "p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 cursor-pointer border-none bg-transparent text-slate-400 outline-none", "aria-label": isExpanded ? "Collapse details" : "Expand details", children: isExpanded ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "w-3.5 h-3.5" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3.5 h-3.5" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-x-2 gap-y-1 mt-2.5 text-[9.5px] text-slate-600 dark:text-slate-450 font-medium", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[8px] text-slate-400 font-semibold uppercase leading-none", children: "Last Visit" }), (0, jsx_runtime_1.jsx)("div", { className: "font-extrabold text-slate-800 dark:text-slate-200 mt-0.5", children: pat.lastVisit })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[8px] text-slate-400 font-semibold uppercase leading-none", children: "Remedy" }), (0, jsx_runtime_1.jsx)("div", { className: "font-extrabold text-slate-800 dark:text-slate-200 truncate mt-0.5 max-w-[80px]", title: pat.currentRemedy, children: pat.currentRemedy })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[8px] text-slate-400 font-semibold uppercase leading-none", children: "Payment" }), (0, jsx_runtime_1.jsx)("div", { className: `font-extrabold uppercase text-[8.5px] mt-0.5 ${pat.paymentStatus === "Paid"
                                                                ? "text-emerald-600 dark:text-emerald-450"
                                                                : pat.paymentStatus === "Partial"
                                                                    ? "text-amber-600 dark:text-amber-450"
                                                                    : "text-rose-600 dark:text-rose-455"}`, children: pat.paymentStatus })] })] })] }), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-[10px] text-slate-655 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 border border-slate-202/60 dark:border-slate-800 p-2.5 rounded-xl", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-slate-450 dark:text-slate-550 mr-1.5", children: "Chief Complaint:" }), pat.complaint] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2 text-[9.5px] text-slate-600 dark:text-slate-450", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400 dark:text-slate-550", children: "Patient ID (UHID):" }), " ", (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-850 dark:text-slate-200", children: pat.id })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400 dark:text-slate-550", children: "Follow-up Due:" }), " ", (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-850 dark:text-slate-200", children: pat.followUpDue })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400 dark:text-slate-550", children: "Assigned Doc:" }), " ", (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-850 dark:text-slate-200 truncate", children: pat.assignedDoctor })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400 dark:text-slate-550", children: "Intake Stage:" }), " ", (0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-slate-750 dark:text-slate-350", children: pat.stage })] })] }), pat.pendingReports && pat.pendingReports.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-[8.5px] font-extrabold text-slate-400 dark:text-slate-550 flex items-center gap-1 shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-3 h-3 text-slate-400" }), (0, jsx_runtime_1.jsx)("span", { children: "Pending Reports:" })] }), pat.pendingReports.map((rep, idx) => ((0, jsx_runtime_1.jsx)("span", { className: "bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-750 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold text-slate-550 dark:text-slate-450", children: rep }, idx)))] })), (0, jsx_runtime_1.jsx)("div", { className: "pt-2 flex justify-end", children: (0, jsx_runtime_1.jsxs)("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleOpenPatient(pat.id);
                                                }, className: `px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[9px] font-extrabold cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${reduceMotion ? "" : "active:scale-98"}`, "aria-label": `Open case files for patient ${pat.name}`, children: [(0, jsx_runtime_1.jsx)("span", { children: "Open Case Workspace" }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-3 h-3" })] }) })] }))] }) }, pat.id));
                }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[20px] space-y-2 select-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: "Intake queue is empty" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-450 dark:text-slate-600 max-w-xs mx-auto", children: "No patients currently registered in the clinical intake cycle." })] }))] }));
}
