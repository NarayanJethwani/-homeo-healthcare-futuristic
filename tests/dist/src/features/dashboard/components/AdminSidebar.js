"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminSidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Portal_1 = __importDefault(require("../../../components/Portal"));
const lucide_react_1 = require("lucide-react");
// Icon mappings based on active tab IDs
const TABS_METADATA = {
    dashboard: { label: "Dashboard", icon: lucide_react_1.Gauge, gradient: "from-teal-500 to-emerald-500", shadow: "shadow-[0_4px_12px_rgba(20,184,166,0.3)]" },
    intake: { label: "AI Intake", icon: lucide_react_1.Sparkles, gradient: "from-amber-500 to-orange-500", shadow: "shadow-[0_4px_12px_rgba(245,158,11,0.3)]" },
    patients: { label: "Patients", icon: lucide_react_1.Users, gradient: "from-sky-500 to-blue-500", shadow: "shadow-[0_4px_12px_rgba(14,165,233,0.3)]" },
    diagnostics: { label: "Diagnostics", icon: lucide_react_1.Compass, gradient: "from-emerald-600 to-green-500", shadow: "shadow-[0_4px_12px_rgba(16,185,129,0.3)]" },
    "treatment-planner": { label: "Treatment Planner", icon: lucide_react_1.IndianRupee, gradient: "from-emerald-600 to-teal-500", shadow: "shadow-[0_4px_12px_rgba(16,185,129,0.3)]" },
    "diet-lifestyle": { label: "Diet & Lifestyle", icon: lucide_react_1.Layers, gradient: "from-rose-500 to-pink-500", shadow: "shadow-[0_4px_12px_rgba(244,63,94,0.3)]" },
    analyzer: { label: "Report Analyzer", icon: lucide_react_1.FileText, gradient: "from-indigo-500 to-violet-500", shadow: "shadow-[0_4px_12px_rgba(99,102,241,0.3)]" },
    cie: { label: "Clinical OS", icon: lucide_react_1.Activity, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-[0_4px_12px_rgba(16,185,129,0.3)]" },
    "ai-router": { label: "AI Router Settings", icon: lucide_react_1.Cpu, gradient: "from-slate-700 to-slate-800", shadow: "shadow-[0_4px_12px_rgba(71,85,105,0.3)]" },
    "nexus-atlas": { label: "Nexus Atlas", icon: lucide_react_1.Network, gradient: "from-violet-600 to-fuchsia-600", shadow: "shadow-[0_4px_12px_rgba(139,92,246,0.3)]" },
    "medical-academy": { label: "Medical Academy", icon: lucide_react_1.Award, gradient: "from-blue-600 to-indigo-600", shadow: "shadow-[0_4px_12px_rgba(37,99,235,0.3)]" },
    "learning-hub": { label: "Learning Hub", icon: lucide_react_1.Award, gradient: "from-fuchsia-500 to-purple-600", shadow: "shadow-[0_4px_12px_rgba(217,70,239,0.3)]" },
    communication: { label: "Communications", icon: lucide_react_1.Send, gradient: "from-cyan-500 to-teal-500", shadow: "shadow-[0_4px_12px_rgba(6,182,212,0.3)]" },
    team: { label: "Manage Doctors", icon: lucide_react_1.UserPlus, gradient: "from-violet-600 to-purple-600", shadow: "shadow-[0_4px_12px_rgba(124,58,237,0.3)]", adminOnly: true },
    "health-intelligence": { label: "Public Intake", icon: lucide_react_1.Activity, gradient: "from-teal-600 to-cyan-600", shadow: "shadow-[0_4px_12px_rgba(13,148,136,0.3)]" },
};
const SIDEBAR_GROUPS = [
    {
        name: "Clinical",
        items: ["dashboard", "intake", "patients", "diagnostics", "treatment-planner", "diet-lifestyle"],
    },
    {
        name: "AI",
        items: ["analyzer", "cie", "ai-router"],
    },
    {
        name: "Knowledge",
        items: ["nexus-atlas", "medical-academy", "learning-hub"],
    },
    {
        name: "Administration",
        items: ["communication", "team"],
    },
    {
        name: "Public",
        items: ["health-intelligence"],
    },
];
const SUBTABS_CONFIG = {
    dashboard: [
        { id: "dashboard-metrics", label: "Metrics & Status" },
        { id: "dashboard-queue", label: "Patient Queue" },
        { id: "dashboard-alerts", label: "Clinical Alerts" }
    ],
    intake: [
        { id: "intake-builder", label: "Guided Interview" },
        { id: "live-synthesis", label: "Constitutional Synthesis" }
    ],
    patients: [
        { id: "patients-directory", label: "Search & Registry" },
        { id: "patients-list", label: "Clinical Database" }
    ],
    diagnostics: [
        { id: "diagnostics-search", label: "Search Nexus" },
        { id: "diagnostics-list", label: "Conditions Database" },
        { id: "diagnostics-details", label: "Homeopathic Affinity" }
    ],
    analyzer: [
        { id: "analyzer-ingestion", label: "Upload & Ingest" },
        { id: "analyzer-results", label: "AI Analysis" }
    ],
    "diet-lifestyle": [
        { id: "diet-constraints", label: "Diet Constraints" },
        { id: "diet-prescriptions", label: "Meal & Routines" }
    ],
    "treatment-planner": [
        { id: "planner-config", label: "Plan Configuration" },
        { id: "planner-breakdown", label: "Pricing Breakdown" }
    ],
    "nexus-atlas": [
        { id: "remedy-materia-medica", label: "Remedies Map" },
        { id: "constitutional-mindmap", label: "Constitutional Mind Map" },
        { id: "specialists-routing", label: "Specialists Router" }
    ],
    "learning-hub": [
        { id: "learning-monograph", label: "Remedy Monograph" },
        { id: "learning-differential", label: "Differential Comparison" },
        { id: "learning-tutor", label: "AI Tutor" }
    ],
    communication: [
        { id: "comm-inputs", label: "Outreach Inputs" },
        { id: "comm-templates", label: "Outreach Templates" }
    ],
    "ai-router": [
        { id: "router-routing-matrix", label: "Routing Settings Matrix" },
        { id: "router-benchmarks", label: "Model Benchmarks" },
        { id: "router-consensus", label: "Consensus Console" },
        { id: "router-sandbox", label: "Live Test Sandbox" },
        { id: "router-telemetry-logs", label: "Telemetry Live Logs" }
    ],
    "health-intelligence": [
        { id: "portal-engagement", label: "Engagement Portals" },
        { id: "intake-queue", label: "Intake Queue" }
    ],
    cie: [
        { id: "cie-cockpit", label: "Clinical Cockpit" },
        { id: "cie-intake", label: "Guided Case Intake" },
        { id: "cie-miasms", label: "Miasmatic Analysis" },
        { id: "cie-reports", label: "Clinical Reports" }
    ],
    "medical-academy": [
        { id: "academy-home", label: "Home" },
        { id: "academy-learn", label: "Learn" },
        { id: "academy-explore", label: "Explore" },
        { id: "academy-practice", label: "Practice" },
        { id: "academy-assess", label: "Assess" },
        { id: "academy-research", label: "Research" },
        { id: "academy-certify", label: "Certify" }
    ],
    team: [
        { id: "team-directory", label: "Doctors Directory" },
        { id: "team-access", label: "Access Controls" }
    ]
};
function AdminSidebar({ isCollapsed, setIsCollapsed, activeTab, setActiveTab, session, favorites, setFavorites, handleSubTabClick, reduceMotion = false, patients = [], }) {
    const [openSubmenuTab, setOpenSubmenuTab] = (0, react_1.useState)(null);
    const [hoveredTabId, setHoveredTabId] = (0, react_1.useState)(null);
    const [hoveredTabTop, setHoveredTabTop] = (0, react_1.useState)(0);
    const hoverTimeoutRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        return () => {
            if (hoverTimeoutRef.current)
                clearTimeout(hoverTimeoutRef.current);
        };
    }, []);
    const isAdmin = session?.role === "admin";
    const toggleFavorite = (tabId, e) => {
        e.stopPropagation();
        setFavorites((prev) => prev.includes(tabId) ? prev.filter((id) => id !== tabId) : [...prev, tabId]);
    };
    const getNotificationDot = (tabId) => {
        if (!patients || patients.length === 0)
            return null;
        switch (tabId) {
            case "intake":
                const hasIntakePending = patients.some(p => p.status === "awaiting-consult" || p.stage?.includes("Intake"));
                if (hasIntakePending)
                    return (0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0", title: "Intake pending cases active" });
                break;
            case "patients":
                const hasCriticalPatients = patients.some(p => p.careLevel === "high" || p.priority === "Critical");
                if (hasCriticalPatients)
                    return (0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0", title: "Critical patients in registry" });
                break;
            case "analyzer":
                const hasPendingReports = patients.some(p => p.pendingReports && p.pendingReports.length > 0);
                if (hasPendingReports)
                    return (0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0", title: "Pending reports to extract" });
                break;
        }
        return null;
    };
    const renderTabItem = (tabId) => {
        const meta = TABS_METADATA[tabId];
        if (!meta)
            return null;
        if (meta.adminOnly && !isAdmin)
            return null;
        const Icon = meta.icon;
        const isActive = activeTab === tabId;
        const isFavorited = favorites.includes(tabId);
        const hasDot = getNotificationDot(tabId);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full space-y-1 relative", onMouseEnter: (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (hoverTimeoutRef.current)
                    clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredTabId(tabId);
                    setHoveredTabTop(rect.top);
                }, 150);
            }, onMouseLeave: () => {
                if (hoverTimeoutRef.current)
                    clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredTabId(null);
                }, 150);
            }, children: [isActive && ((0, jsx_runtime_1.jsx)("span", { className: "absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]", "aria-hidden": "true" })), (0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                        setActiveTab(tabId);
                    }, className: `group flex w-full items-center justify-between pl-4 pr-3 py-2.5 rounded-xl cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-teal-555 outline-none transition-all bg-transparent ${isActive
                        ? "bg-teal-50/70 dark:bg-teal-950/30 text-teal-650 dark:text-teal-400 font-bold border border-teal-100/50 dark:border-teal-900/30 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"}`, title: isCollapsed ? meta.label : undefined, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 min-w-0 flex-grow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative shrink-0", children: [(0, jsx_runtime_1.jsx)("div", { className: `shrink-0 ${isActive ? "text-teal-555" : "text-slate-400 group-hover:text-slate-605 dark:group-hover:text-slate-300"}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4" }) }), isCollapsed && hasDot && ((0, jsx_runtime_1.jsx)("span", { className: "absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-500 border border-white dark:border-slate-900" }))] }), !isCollapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between flex-grow min-w-0 pr-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs tracking-wide truncate", children: meta.label }), hasDot] }))] }), !isCollapsed && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity", children: (0, jsx_runtime_1.jsx)("button", { onClick: (e) => toggleFavorite(tabId, e), className: `p-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50 cursor-pointer border-none bg-transparent focus-visible:ring-1 focus-visible:ring-teal-555 outline-none transition-colors ${isFavorited ? "text-amber-500 opacity-100" : "text-slate-300 dark:text-slate-600 hover:text-slate-500"}`, title: isFavorited ? "Remove from Favorites" : "Add to Favorites", "aria-label": isFavorited ? `Unfavorite ${meta.label}` : `Favorite ${meta.label}`, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: `w-3.5 h-3.5 ${isFavorited ? "fill-amber-500 text-amber-500" : ""}` }) }) }))] })] }, tabId));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("aside", { className: `bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 select-none ${isCollapsed ? "w-20" : "w-64"} hidden md:flex ${reduceMotion ? "" : "transition-all duration-300 ease-in-out"}`, "aria-label": "Clinical Navigation Sidebar", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-16 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0", children: !isCollapsed ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-800", children: (0, jsx_runtime_1.jsx)("img", { src: "/images/logo.png", alt: "Clinical OS Logo", className: "w-full h-full object-cover" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "truncate", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-serif text-[11px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none mb-0.5", children: "Dr. Jethwani's" }), (0, jsx_runtime_1.jsx)("div", { className: "font-sans text-[10px] text-teal-650 dark:text-teal-400 font-extrabold leading-none", children: "Clinical OS\u2122" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsCollapsed(true), className: "p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer text-slate-400 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-colors", title: "Collapse sidebar (Ctrl+[)", "aria-label": "Collapse sidebar", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "w-4 h-4" }) })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full flex justify-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsCollapsed(false), className: "p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer text-slate-400 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-colors", title: "Expand sidebar (Ctrl+[)", "aria-label": "Expand sidebar", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-4 h-4" }) }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin", children: [!isCollapsed && favorites.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400 px-3 flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-3 h-3 text-amber-500 fill-amber-500 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: "Favorites" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: favorites.map((favId) => renderTabItem(favId)) })] })), SIDEBAR_GROUPS.map((group) => {
                                // Check if any item in the group is visible
                                const visibleItems = group.items.filter((item) => {
                                    const tabMeta = TABS_METADATA[item];
                                    if (!tabMeta)
                                        return false;
                                    if (tabMeta.adminOnly && !isAdmin)
                                        return false;
                                    if (!isCollapsed && favorites.includes(item))
                                        return false;
                                    return true;
                                });
                                if (visibleItems.length === 0)
                                    return null;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5", children: [!isCollapsed && ((0, jsx_runtime_1.jsx)("h4", { className: "text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400 px-3", children: group.name })), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: visibleItems.map((item) => renderTabItem(item)) })] }, group.name));
                            })] })] }), (0, jsx_runtime_1.jsx)("nav", { className: "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-4 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]", "aria-label": "Mobile Navigation", children: [
                    { id: "dashboard", label: "Home", icon: lucide_react_1.Gauge },
                    { id: "intake", label: "Intake", icon: lucide_react_1.Sparkles },
                    { id: "patients", label: "Patients", icon: lucide_react_1.Users },
                    { id: "nexus-atlas", label: "Nexus", icon: lucide_react_1.Network },
                    { id: "cie", label: "ClinicalOS", icon: lucide_react_1.Activity },
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab(item.id), className: `flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer py-1 px-3 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${isActive
                            ? "text-teal-555 dark:text-teal-400 font-bold"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`, "aria-current": isActive ? "page" : undefined, children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-4.5 h-4.5" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-sans font-bold", children: item.label })] }, item.id));
                }) }), hoveredTabId && (() => {
                const subtabs = SUBTABS_CONFIG[hoveredTabId] || [];
                if (subtabs.length === 0)
                    return null;
                return ((0, jsx_runtime_1.jsx)(Portal_1.default, { children: (0, jsx_runtime_1.jsx)("div", { style: {
                            position: "fixed",
                            top: `${hoveredTabTop}px`,
                            left: isCollapsed ? "76px" : "248px"
                        }, className: "z-[9999] pl-2 min-w-[210px] animate-in fade-in slide-in-from-left-1 duration-100", onMouseEnter: () => {
                            if (hoverTimeoutRef.current)
                                clearTimeout(hoverTimeoutRef.current);
                        }, onMouseLeave: () => {
                            setHoveredTabId(null);
                        }, children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/85 p-2 rounded-2xl shadow-xl flex flex-col gap-1", children: subtabs.map((sub) => ((0, jsx_runtime_1.jsxs)("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    handleSubTabClick(hoveredTabId, sub.id);
                                    setHoveredTabId(null);
                                }, className: "w-full text-left px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer border-none bg-transparent flex items-center gap-2 focus-visible:ring-1 focus-visible:ring-teal-555 outline-none", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors duration-200 hover:bg-mint dark:hover:bg-teal-400" }), sub.label] }, sub.id))) }) }) }));
            })()] }));
}
