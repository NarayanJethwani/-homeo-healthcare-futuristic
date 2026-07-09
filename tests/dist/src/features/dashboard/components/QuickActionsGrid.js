"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuickActionsGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
function QuickActionsGrid({ onTriggerQuickAction, reduceMotion = false, }) {
    const actions = [
        {
            key: "new-patient",
            label: "New Patient Case",
            description: "Register patient case",
            icon: lucide_react_1.UserPlus,
            color: "from-blue-500 to-indigo-605",
            shadow: "shadow-blue-100 dark:shadow-none",
        },
        {
            key: "ai-intake",
            label: "Start AI Intake",
            description: "Trigger guided intake",
            icon: lucide_react_1.Sparkles,
            color: "from-amber-500 to-orange-500",
            shadow: "shadow-amber-100 dark:shadow-none",
        },
        {
            key: "upload-report",
            label: "Upload Report",
            description: "Ingest lab diagnostic PDF",
            icon: lucide_react_1.UploadCloud,
            color: "from-indigo-505 to-violet-500",
            shadow: "shadow-indigo-100 dark:shadow-none",
        },
        {
            key: "create-prescription",
            label: "Create Prescription",
            description: "Compound remedies planner",
            icon: lucide_react_1.FileText,
            color: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-100 dark:shadow-none",
        },
        {
            key: "schedule-appointment",
            label: "Schedule Visit",
            description: "Open appointment outreach",
            icon: lucide_react_1.Calendar,
            color: "from-sky-500 to-blue-500",
            shadow: "shadow-sky-100 dark:shadow-none",
        },
        {
            key: "generate-invoice",
            label: "Generate Invoice",
            description: "Compile billing breakdown",
            icon: lucide_react_1.Receipt,
            color: "from-teal-500 to-emerald-600",
            shadow: "shadow-teal-100 dark:shadow-none",
        },
        {
            key: "emergency-case",
            label: "Emergency Case",
            description: "Urgent case registration",
            icon: lucide_react_1.ShieldAlert,
            color: "from-rose-500 to-red-650",
            shadow: "shadow-rose-100 dark:shadow-none",
        },
        {
            key: "knowledge-editor",
            label: "Knowledge Editor",
            description: "Materia Medica KMS",
            icon: lucide_react_1.BookOpen,
            color: "from-violet-500 to-fuchsia-600",
            shadow: "shadow-violet-100 dark:shadow-none",
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 select-none", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-500 px-1", children: "Clinical Shortcuts & Quick Actions" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4", children: actions.map((act) => {
                    const Icon = act.icon;
                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onTriggerQuickAction(act.key), className: `group p-4 bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-[20px] text-left hover:border-slate-350 dark:hover:border-slate-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none flex flex-col justify-between gap-4 transition-all ${reduceMotion ? "" : "active:scale-98"}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `w-9 h-9 rounded-xl bg-gradient-to-br ${act.color} text-white flex items-center justify-center shadow-md ${act.shadow} ${reduceMotion ? "" : "group-hover:scale-105 duration-200"}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-4.5 h-4.5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors", children: act.label }), (0, jsx_runtime_1.jsx)("div", { className: "text-[9.5px] text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-350 mt-0.5 leading-snug font-medium transition-colors", children: act.description })] })] }, act.key));
                }) })] }));
}
