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
exports.default = GlobalCommandPalette;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
function GlobalCommandPalette({ isOpen, onClose, patients, onSelectPatient, invoicesList, onOpenInvoice, setActiveTab, onTriggerQuickAction, clinicians, remediesKeynotes, reduceMotion = false, }) {
    const [query, setQuery] = (0, react_1.useState)("");
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const containerRef = (0, react_1.useRef)(null);
    const itemsContainerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);
    const searchResults = (0, react_1.useMemo)(() => {
        const items = [];
        const normalizedQuery = query.toLowerCase().trim();
        // 1. Settings / Navigation Tabs
        const tabs = [
            { id: "dashboard", label: "Dashboard", desc: "View clinical metrics, alerts, and today's schedule" },
            { id: "intake", label: "AI Intake", desc: "Run guided patient intake and constitutional synthesis" },
            { id: "patients", label: "Patients Directory", desc: "Manage patient registry and clinical timelines" },
            { id: "diagnostics", label: "Diagnostics Affinity", desc: "Search conditions database and affinity index" },
            { id: "analyzer", label: "Report Analyzer", desc: "Ingest lab reports and extract clinical markers" },
            { id: "diet-lifestyle", label: "Diet & Lifestyle", desc: "Set dietary restrictions and meal routines" },
            { id: "treatment-planner", label: "Treatment Planner", desc: "Calculate consultation packages and billing" },
            { id: "nexus-atlas", label: "Nexus Atlas", desc: "Explore repertory rubrics and materia medica" },
            { id: "cie", label: "Clinical OS", desc: "View intelligence cockpit and miasms radar" },
            { id: "medical-academy", label: "Medical Academy", desc: "Participate in physician education and quizzes" },
            { id: "learning-hub", label: "Learning Hub", desc: "Access adaptive learning, simulator labs, and history" },
            { id: "communication", label: "Communications", desc: "Send automated outreach and messages" },
            { id: "ai-router", label: "AI Router Settings", desc: "Manage LLM failover configuration and token budgets" },
            { id: "team", label: "Manage Doctors", desc: "Registry of medical officers and access privileges" },
            { id: "health-intelligence", label: "Public Intake Portal", desc: "Import assessments from patient self-intake" },
        ];
        tabs.forEach((t) => {
            if (!query || t.label.toLowerCase().includes(normalizedQuery) || t.desc.toLowerCase().includes(normalizedQuery)) {
                items.push({
                    id: `tab-${t.id}`,
                    type: "setting",
                    title: t.label,
                    subtitle: t.desc,
                    icon: lucide_react_1.Settings,
                    action: () => {
                        setActiveTab(t.id);
                        onClose();
                    },
                });
            }
        });
        // 2. Quick Actions
        const actions = [
            { key: "new-patient", label: "New Patient Case", desc: "Register patient case record" },
            { key: "ai-intake", label: "Start AI Intake", desc: "Launch new guided interview session" },
            { key: "upload-report", label: "Upload Report", desc: "Upload and analyze diagnostic PDF reports" },
            { key: "create-prescription", label: "Create Prescription", desc: "Open treatment plan compound config" },
            { key: "schedule-appointment", label: "Schedule Appointment", desc: "Open outreach tab to schedule visit" },
            { key: "generate-invoice", label: "Generate Invoice", desc: "Create billing breakdown statement" },
            { key: "emergency-case", label: "Emergency Intake", desc: "Flag case as urgent and initiate triage" },
            { key: "knowledge-editor", label: "Knowledge Editor", desc: "Open Repertory & Materia Medica KMS Editor" },
        ];
        actions.forEach((a) => {
            if (!query || a.label.toLowerCase().includes(normalizedQuery) || a.desc.toLowerCase().includes(normalizedQuery)) {
                items.push({
                    id: `action-${a.key}`,
                    type: "action",
                    title: a.label,
                    subtitle: a.desc,
                    icon: lucide_react_1.Sparkles,
                    action: () => {
                        onTriggerQuickAction(a.key);
                        onClose();
                    },
                });
            }
        });
        // 3. Patients Directory Search
        patients.forEach((p) => {
            if (query &&
                (p.name.toLowerCase().includes(normalizedQuery) ||
                    p.complaint.toLowerCase().includes(normalizedQuery) ||
                    (p.phone && p.phone.includes(normalizedQuery)))) {
                items.push({
                    id: `patient-${p.id}`,
                    type: "patient",
                    title: p.name,
                    subtitle: `Age: ${p.age}y/o | Chief Complaint: ${p.complaint}`,
                    icon: lucide_react_1.User,
                    action: () => {
                        onSelectPatient(p.id);
                        setActiveTab("patients");
                        onClose();
                    },
                });
            }
        });
        // 4. Invoices
        invoicesList.forEach((inv) => {
            if (query &&
                ((inv.invoiceNo && inv.invoiceNo.toLowerCase().includes(normalizedQuery)) ||
                    (inv.patientName && inv.patientName.toLowerCase().includes(normalizedQuery)))) {
                items.push({
                    id: `invoice-${inv.id || inv.invoiceNo}`,
                    type: "invoice",
                    title: inv.invoiceNo || "Invoice Record",
                    subtitle: `Patient: ${inv.patientName} | Amount: ₹${inv.amount || inv.grandTotal} | Status: ${inv.status}`,
                    icon: lucide_react_1.FileText,
                    action: () => {
                        onOpenInvoice(inv);
                        onClose();
                    },
                });
            }
        });
        // 5. Remedies Keynotes
        Object.entries(remediesKeynotes).forEach(([remCode, meta]) => {
            const keynotesStr = meta.keynotes.join(", ").toLowerCase();
            if (query &&
                (remCode.toLowerCase().includes(normalizedQuery) ||
                    keynotesStr.includes(normalizedQuery) ||
                    meta.miasm.toLowerCase().includes(normalizedQuery))) {
                items.push({
                    id: `remedy-${remCode}`,
                    type: "remedy",
                    title: remCode,
                    subtitle: `Miasm: ${meta.miasm} | Keynotes: ${meta.keynotes.slice(0, 2).join(", ")}...`,
                    icon: lucide_react_1.BookOpen,
                    action: () => {
                        setActiveTab("nexus-atlas");
                        onClose();
                    },
                });
            }
        });
        // 6. Clinicians
        clinicians.forEach((c) => {
            if (query &&
                (c.name.toLowerCase().includes(normalizedQuery) ||
                    c.email.toLowerCase().includes(normalizedQuery) ||
                    c.role.toLowerCase().includes(normalizedQuery))) {
                items.push({
                    id: `doctor-${c.uid || c.email}`,
                    type: "doctor",
                    title: c.name,
                    subtitle: `Role: ${c.role === "admin" ? "Master Clinician" : "Junior Medical Officer"} | Email: ${c.email}`,
                    icon: lucide_react_1.User,
                    action: () => {
                        setActiveTab("team");
                        onClose();
                    },
                });
            }
        });
        // Relevance Category Sorting Map (Clinician priority: Patients > Actions > Navigation > Knowledge > Settings)
        const typePriority = {
            patient: 1,
            action: 2,
            setting: 3,
            remedy: 4,
            invoice: 5,
            doctor: 6,
        };
        return items.sort((a, b) => typePriority[a.type] - typePriority[b.type]);
    }, [query, patients, invoicesList, remediesKeynotes, clinicians, setActiveTab, onSelectPatient, onOpenInvoice, onTriggerQuickAction, onClose]);
    // Reset index when query changes
    (0, react_1.useEffect)(() => {
        setSelectedIndex(0);
    }, [query]);
    // Keyboard navigation listeners
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (!isOpen)
                return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
            }
            else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
            }
            else if (e.key === "Enter") {
                e.preventDefault();
                if (searchResults[selectedIndex]) {
                    searchResults[selectedIndex].action();
                }
            }
            else if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, searchResults, selectedIndex, onClose]);
    // Scroll selected item into view in container
    (0, react_1.useEffect)(() => {
        if (itemsContainerRef.current) {
            const children = Array.from(itemsContainerRef.current.children);
            // Filter out headers to get correct DOM elements for items
            const itemElements = children.filter((child) => child.getAttribute("role") === "option");
            const selectedEl = itemElements[selectedIndex];
            if (selectedEl) {
                const container = itemsContainerRef.current;
                const containerTop = container.scrollTop;
                const containerBottom = containerTop + container.clientHeight;
                const elemTop = selectedEl.offsetTop;
                const elemBottom = elemTop + selectedEl.clientHeight;
                if (elemTop < containerTop) {
                    container.scrollTop = elemTop;
                }
                else if (elemBottom > containerBottom) {
                    container.scrollTop = elemBottom - container.clientHeight;
                }
            }
        }
    }, [selectedIndex]);
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] transition-opacity", onClick: onClose }), (0, jsx_runtime_1.jsxs)("div", { ref: containerRef, className: `fixed inset-x-4 top-[12%] mx-auto max-w-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[60vh] select-none text-slate-850 dark:text-slate-200 ${reduceMotion ? "" : "animate-in fade-in zoom-in-95 duration-150"}`, role: "combobox", "aria-expanded": "true", "aria-haspopup": "listbox", "aria-owns": "search-results-list", "aria-label": "Global search command palette", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-850 shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-5 h-5 text-slate-450" }), (0, jsx_runtime_1.jsx)("input", { type: "text", className: "flex-grow bg-transparent border-none outline-none text-xs text-slate-850 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 font-sans", placeholder: "Search patient, remedy, page setting, action... (Use \u2191\u2193 Enter)", autoFocus: true, value: query, onChange: (e) => setQuery(e.target.value), "aria-autocomplete": "list", "aria-controls": "search-results-list", "aria-activedescendant": searchResults[selectedIndex] ? `item-${searchResults[selectedIndex].id}` : undefined }), (0, jsx_runtime_1.jsx)("kbd", { className: "hidden sm:inline-block px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-202 dark:border-slate-700 rounded text-[9px] font-mono text-slate-450 shadow-2xs", children: "ESC" })] }), (0, jsx_runtime_1.jsx)("div", { ref: itemsContainerRef, id: "search-results-list", role: "listbox", className: "flex-grow overflow-y-auto p-2 scrollbar-thin", children: searchResults.length > 0 ? (searchResults.map((item, idx) => {
                            const Icon = item.icon;
                            const isSelected = idx === selectedIndex;
                            // Determine group header visibility
                            const showHeader = idx === 0 || searchResults[idx - 1].type !== item.type;
                            const categoryTitles = {
                                patient: "Active Patient Records",
                                action: "Clinical Shortcuts & Actions",
                                setting: "System Navigation & Settings",
                                remedy: "Materia Medica & Knowledge Base",
                                invoice: "Invoice & Billing Ledgers",
                                doctor: "Medical Officer Directory"
                            };
                            return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [showHeader && ((0, jsx_runtime_1.jsx)("div", { className: "text-[8.5px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-550 px-3.5 pt-3 pb-1 select-none border-t border-slate-100/50 dark:border-slate-800/40 first:border-none", children: categoryTitles[item.type] || item.type })), (0, jsx_runtime_1.jsxs)("div", { id: `item-${item.id}`, role: "option", "aria-selected": isSelected, onClick: item.action, className: `flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all border border-transparent ${isSelected
                                            ? "bg-slate-50 dark:bg-slate-850 border-teal-202 dark:border-teal-900 text-teal-650 dark:text-teal-400 shadow-2xs"
                                            : "hover:bg-slate-50/50 dark:hover:bg-slate-850/50"}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected
                                                    ? "bg-teal-100/50 dark:bg-teal-950/40 text-teal-650 dark:text-teal-400"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-500"}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-grow min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[11px] font-extrabold truncate leading-tight text-slate-900 dark:text-slate-200", children: item.title }), item.subtitle && ((0, jsx_runtime_1.jsx)("div", { className: "text-[9.5px] text-slate-450 dark:text-slate-500 truncate mt-0.5 font-medium", children: item.subtitle }))] })] })] }, item.id));
                        })) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center space-y-2", role: "status", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-slate-400 dark:text-slate-550", children: "No matching results found" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-slate-350 dark:text-slate-650 max-w-xs mx-auto leading-relaxed", children: "Try searching for specific patient names, clinical complaints, or remedies keynotes." })] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "px-5 py-2.5 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-850 text-[9px] text-slate-400 dark:text-slate-550 flex items-center justify-between shrink-0 font-medium select-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2191\u2193 to navigate" }), (0, jsx_runtime_1.jsx)("span", { className: "w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" }), (0, jsx_runtime_1.jsx)("span", { children: "Enter to select" }), (0, jsx_runtime_1.jsx)("span", { className: "w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" }), (0, jsx_runtime_1.jsx)("span", { children: "ESC to close" })] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Results: ", searchResults.length] })] })] })] }));
}
