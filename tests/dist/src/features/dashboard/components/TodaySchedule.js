"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodaySchedule;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
function TodaySchedule({ patients = [], onSelectPatient, setActiveTab, isLoading = false, error = null, onRetry, reduceMotion = false, }) {
    // Map clinical schedule metadata from patient registry
    const appointments = react_1.default.useMemo(() => {
        if (patients.length === 0)
            return [];
        return patients.slice(0, 4).map((p, idx) => {
            const times = ["10:30 AM", "11:45 AM", "02:00 PM", "04:30 PM"];
            const purposes = [
                "Chronic Asthma & Eczema Review",
                "Severe GERD & Gastric Assessment",
                "Thyroid Axis Follow-up Evaluation",
                "Acute Throat and Congestion Flare",
            ];
            const priorities = [
                "Critical",
                "Important",
                "Informational",
                "Critical",
            ];
            const statuses = [
                "Waiting",
                "Upcoming",
                "Upcoming",
                "Completed",
            ];
            const rooms = ["Room 1", "Room 3", "Telehealth", "Room 2"];
            const visitTypes = [
                "Critical",
                "Follow-up",
                "First Visit",
                "Emergency",
            ];
            const durations = ["30 mins", "45 mins", "20 mins", "15 mins"];
            const doctors = ["Dr. N. Jethwani", "Dr. R. Lokhande", "Dr. N. Jethwani", "Dr. R. Lokhande"];
            const arrivalStatuses = [
                "Checked In",
                "Waiting",
                "Seen",
                "Completed",
            ];
            return {
                id: p.id,
                name: p.name,
                age: p.age,
                time: times[idx % times.length],
                purpose: purposes[idx % purposes.length],
                priority: priorities[idx % priorities.length],
                status: statuses[idx % statuses.length],
                patientId: p.id,
                room: rooms[idx % rooms.length],
                visitType: visitTypes[idx % visitTypes.length],
                duration: durations[idx % durations.length],
                doctor: doctors[idx % doctors.length],
                arrivalStatus: arrivalStatuses[idx % arrivalStatuses.length],
            };
        });
    }, [patients]);
    const handleOpenPatient = (patientId) => {
        onSelectPatient(patientId);
        setActiveTab("patients");
    };
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };
    // Row accents & backgrounds based on visit type / urgency
    const getRowStyle = (visitType) => {
        switch (visitType) {
            case "Emergency":
                return "border-l-[4px] border-l-rose-600 bg-rose-50/10 dark:bg-rose-955/5";
            case "Critical":
                return "border-l-[4px] border-l-amber-500 bg-amber-50/10 dark:bg-amber-955/5";
            case "First Visit":
                return "border-l-[4px] border-l-teal-500 bg-teal-50/10 dark:bg-teal-955/5";
            default: // Follow-up
                return "border-l-[4px] border-l-sky-500 bg-sky-50/10 dark:bg-sky-955/5";
        }
    };
    const getArrivalStatusBadge = (status) => {
        switch (status) {
            case "Checked In":
                return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
            case "Waiting":
                return "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
            case "Seen":
                return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30";
            default: // Completed
                return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30";
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-40 bg-slate-150 dark:bg-slate-800 rounded animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [1, 2, 3].map((i) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 items-center justify-between p-3 border-b border-slate-50 dark:border-slate-850", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full bg-slate-150 dark:bg-slate-800 animate-pulse" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 w-28 bg-slate-150 dark:bg-slate-800 rounded animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "h-2.5 w-44 bg-slate-150 dark:bg-slate-800 rounded animate-pulse" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 w-16 bg-slate-150 dark:bg-slate-800 rounded-full animate-pulse" })] }, i))) })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[24px] flex items-center justify-between select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-rose-600 dark:text-rose-455" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-rose-850 dark:text-rose-350", children: ["Error loading clinical schedule: ", error] })] }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold border-none cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3" }), "Retry"] }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-202/80 dark:border-slate-800/80 shadow-xs space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-teal-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Today's Clinical Schedule" })] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold", children: [appointments.length, " Patients Scheduled"] })] }), appointments.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto select-text", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[8.5px] tracking-wider", children: [(0, jsx_runtime_1.jsx)("th", { className: "pb-3 pl-3", children: "Patient" }), (0, jsx_runtime_1.jsx)("th", { className: "pb-3", children: "Time & Length" }), (0, jsx_runtime_1.jsx)("th", { className: "pb-3", children: "Consultation Purpose" }), (0, jsx_runtime_1.jsx)("th", { className: "pb-3", children: "Assigned Doc / Room" }), (0, jsx_runtime_1.jsx)("th", { className: "pb-3", children: "Workflow State" }), (0, jsx_runtime_1.jsx)("th", { className: "pb-3 pr-3 text-right", children: "Action" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-slate-100/50 dark:divide-slate-850", children: appointments.map((apt) => ((0, jsx_runtime_1.jsxs)("tr", { className: `hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all ${getRowStyle(apt.visitType)}`, children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 pl-3 font-bold text-slate-850 dark:text-slate-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-650 dark:text-teal-400 flex items-center justify-center shrink-0 text-[10px] font-extrabold shadow-2xs", children: getInitials(apt.name) }), (0, jsx_runtime_1.jsxs)("div", { className: "truncate", children: [(0, jsx_runtime_1.jsx)("div", { className: "truncate max-w-[120px]", children: apt.name }), apt.age && ((0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] text-slate-400 dark:text-slate-500 font-semibold", children: [apt.age, " y/o \u2022 ", apt.visitType] }))] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 text-slate-550 dark:text-slate-400 font-mono text-[10px]", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 font-bold", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3.5 h-3.5 text-slate-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: apt.time }), (0, jsx_runtime_1.jsx)("div", { className: "text-[8px] text-slate-400 font-normal mt-0.5", children: apt.duration })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 text-slate-550 dark:text-slate-400 max-w-xs truncate font-medium", children: apt.purpose }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 text-slate-550 dark:text-slate-400 text-[10px]", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-0.5", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-bold flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Stethoscope, { className: "w-3 h-3 text-slate-400 shrink-0" }), apt.doctor] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] text-slate-400 dark:text-slate-550 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-3 h-3 text-slate-400 shrink-0" }), apt.room] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3", children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase ${getArrivalStatusBadge(apt.arrivalStatus)}`, children: apt.arrivalStatus }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 pr-3 text-right", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => handleOpenPatient(apt.patientId), className: `px-3 py-1 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-955/20 text-slate-700 dark:text-slate-400 hover:text-teal-650 dark:hover:text-teal-400 border border-slate-205 dark:border-slate-700 hover:border-teal-205 dark:hover:border-teal-900/50 rounded-xl text-[9.5px] font-extrabold cursor-pointer inline-flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${reduceMotion ? "" : "active:scale-98"}`, children: [(0, jsx_runtime_1.jsx)("span", { children: "Open" }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-3 h-3" })] }) })] }, apt.id))) })] }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[20px] space-y-2 select-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ClipboardCheck, { className: "w-8 h-8 text-slate-350 dark:text-slate-600 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: "No appointments scheduled today" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-400 dark:text-slate-650 max-w-sm mx-auto leading-relaxed", children: "All consultations for today have been completed or there are no bookings active in the planner." })] }))] }));
}
