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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const KeyboardShortcutsModal_1 = __importDefault(require("./KeyboardShortcutsModal"));
function DashboardHeader({ session, handleLogout, onTriggerQuickAction, onOpenSearch, onOpenDisplayDrawer, reduceMotion = false, telemetryLogs = [], onOpenDiagnostics, }) {
    const [isQuickActionsOpen, setIsQuickActionsOpen] = (0, react_1.useState)(false);
    const [isProfileOpen, setIsProfileOpen] = (0, react_1.useState)(false);
    const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = (0, react_1.useState)(false);
    const [comingSoonFeature, setComingSoonFeature] = (0, react_1.useState)(null);
    const dropdownRef = react_1.default.useRef(null);
    react_1.default.useEffect(() => {
        if (!isProfileOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsProfileOpen(false);
                return;
            }
            if (!dropdownRef.current)
                return;
            const focusableElements = dropdownRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
            if (focusableElements.length === 0)
                return;
            const activeElement = document.activeElement;
            const index = Array.from(focusableElements).indexOf(activeElement);
            if (e.key === "ArrowDown") {
                e.preventDefault();
                const nextIndex = (index + 1) % focusableElements.length;
                focusableElements[nextIndex].focus();
            }
            else if (e.key === "ArrowUp") {
                e.preventDefault();
                const prevIndex = (index - 1 + focusableElements.length) % focusableElements.length;
                focusableElements[prevIndex].focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isProfileOpen]);
    // Mock notifications
    const unreadMessages = 3;
    const alertCount = 2;
    // Determine if the AI Router is currently experiencing warning or fallback conditions based on the latest request
    const latestLog = telemetryLogs[0];
    const isAiRouterDegraded = latestLog
        ? latestLog.status === "failed" || (latestLog.failoverTrace && latestLog.failoverTrace.length > 0)
        : false;
    const degradedCount = isAiRouterDegraded ? 1 : 0;
    const offlineCount = latestLog && latestLog.status === "failed" ? 1 : 0;
    let overallColorDot = "bg-emerald-500";
    let overallStatusText = "Healthy";
    if (offlineCount > 0) {
        overallColorDot = "bg-rose-500";
        overallStatusText = "Offline";
    }
    else if (degradedCount > 0) {
        overallColorDot = "bg-amber-500";
        overallStatusText = "Degraded";
    }
    return ((0, jsx_runtime_1.jsxs)("header", { className: "sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-xs select-none", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4 flex-1 max-w-md", children: (0, jsx_runtime_1.jsxs)("button", { onClick: onOpenSearch, className: "flex items-center justify-between w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-750/80 rounded-xl text-slate-450 dark:text-slate-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none text-left transition-colors", "aria-label": "Open search command palette", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4 text-slate-400 dark:text-slate-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-sans", children: "Search patient, remedy..." })] }), (0, jsx_runtime_1.jsx)("kbd", { className: "hidden sm:inline-block px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono text-slate-450 shadow-xs", children: "\u2318K" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-5 sm:gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsQuickActionsOpen(!isQuickActionsOpen), className: "px-3.5 py-2 bg-teal-500 hover:bg-teal-600 active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none shadow-xs shadow-teal-100 dark:shadow-none focus-visible:ring-2 focus-visible:ring-teal-555 outline-none", "aria-haspopup": "menu", "aria-expanded": isQuickActionsOpen, "aria-label": "Quick actions menu", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-3.5 h-3.5" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Quick Action" })] }), isQuickActionsOpen && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-40", onClick: () => setIsQuickActionsOpen(false) }), (0, jsx_runtime_1.jsx)("div", { className: `absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-1.5 flex flex-col gap-1 ${reduceMotion ? "" : "animate-in slide-in-from-top-1 duration-150"}`, role: "menu", children: [
                                            { key: "new-patient", label: "New Patient", icon: lucide_react_1.User },
                                            { key: "ai-intake", label: "AI Intake", icon: lucide_react_1.Sparkles },
                                            { key: "upload-report", label: "Upload Report", icon: lucide_react_1.FileText },
                                            { key: "create-prescription", label: "Create Prescription", icon: lucide_react_1.Sparkles },
                                            { key: "schedule-appointment", label: "Schedule Appointment", icon: lucide_react_1.Send },
                                            { key: "generate-invoice", label: "Generate Invoice", icon: lucide_react_1.IndianRupee },
                                            { key: "emergency-case", label: "Emergency Case", icon: lucide_react_1.Bell },
                                        ].map((act) => {
                                            const Icon = act.icon;
                                            return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                    onTriggerQuickAction(act.key);
                                                    setIsQuickActionsOpen(false);
                                                }, className: "w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer border-none bg-transparent flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none", role: "menuitem", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 text-slate-400 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: act.label })] }, act.key));
                                        }) })] }))] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => onTriggerQuickAction("message-center"), className: "p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-teal-555 outline-none transition-colors cursor-pointer border-none bg-transparent relative", title: "Unread Messages", "aria-label": `${unreadMessages} unread messages`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-4.5 h-4.5" }), unreadMessages > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" }))] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => onTriggerQuickAction("alerts-center"), className: "p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-teal-555 outline-none transition-colors cursor-pointer border-none bg-transparent relative", title: "Clinical Alerts", "aria-label": `${alertCount} clinical alerts`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "w-4.5 h-4.5" }), alertCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900 shrink-0 animate-pulse" }))] }), (0, jsx_runtime_1.jsxs)("button", { onClick: onOpenDiagnostics, className: "p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-teal-555 outline-none transition-colors cursor-pointer border-none bg-transparent relative", title: `Clinical OS Health: ${overallStatusText}`, "aria-label": `Clinical OS Health: ${overallStatusText}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "w-4.5 h-4.5 animate-pulse" }), (0, jsx_runtime_1.jsx)("span", { className: `absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${overallColorDot} border-2 border-white dark:border-slate-900 shrink-0` })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onOpenDisplayDrawer, className: "p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-teal-555 outline-none transition-colors cursor-pointer border-none bg-transparent", title: "Display Accessibility Settings", "aria-label": "Display accessibility settings", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4.5 h-4.5 hover:rotate-45 transition-transform duration-300" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsProfileOpen(!isProfileOpen), className: "flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-850 border-none bg-transparent cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-teal-555 outline-none", "aria-haspopup": "menu", "aria-expanded": isProfileOpen, "aria-label": "Doctor Profile Menu", children: (0, jsx_runtime_1.jsx)("div", { className: "w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-350 flex items-center justify-center text-xs font-bold font-serif shadow-xs", children: session?.name ? session.name.substring(0, 2).toUpperCase() : (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" }) }) }), isProfileOpen && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-40", onClick: () => setIsProfileOpen(false) }), (0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: `absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-1 text-slate-800 dark:text-slate-200 dashboard-dropdown-dark ${reduceMotion ? "" : "animate-in slide-in-from-top-1 duration-150"}`, role: "menu", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-3 py-2 border-b border-slate-100 dark:border-slate-850 mb-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold truncate text-slate-900 dark:text-slate-100", children: session?.name || "Clinician" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-slate-400 dark:text-slate-300 truncate mt-0.5", children: session?.email || "doctor@clinic.com" })] }), [
                                                { key: "profile", label: "Profile", icon: lucide_react_1.User },
                                                { key: "preferences", label: "My Preferences", icon: lucide_react_1.Settings },
                                                { key: "accessibility", label: "Accessibility Settings", icon: lucide_react_1.Settings },
                                                { key: "shortcuts", label: "Keyboard Shortcuts", icon: lucide_react_1.FileText },
                                                { key: "knowledge-settings", label: "Knowledge Settings", icon: lucide_react_1.Settings },
                                            ].map((item) => {
                                                const Icon = item.icon;
                                                return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                        setIsProfileOpen(false);
                                                        if (item.key === "accessibility") {
                                                            onOpenDisplayDrawer();
                                                        }
                                                        else if (item.key === "shortcuts") {
                                                            setIsKeyboardShortcutsOpen(true);
                                                        }
                                                        else {
                                                            setComingSoonFeature(item.label);
                                                        }
                                                    }, className: "w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer border-none bg-transparent flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-teal-555 outline-none dashboard-focus-ring", role: "menuitem", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 text-slate-400 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: item.label })] }, item.key));
                                            }), (0, jsx_runtime_1.jsx)("div", { className: "border-t border-slate-100 dark:border-slate-850 my-1" }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleLogout, className: "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-all cursor-pointer border-none bg-transparent flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none dashboard-focus-ring", role: "menuitem", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "w-4 h-4 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: "Sign Out" })] })] })] }))] })] }), (0, jsx_runtime_1.jsx)(KeyboardShortcutsModal_1.default, { isOpen: isKeyboardShortcutsOpen, onClose: () => setIsKeyboardShortcutsOpen(false) }), comingSoonFeature && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm", onClick: () => setComingSoonFeature(null) }), (0, jsx_runtime_1.jsx)("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "coming-soon-title", className: "relative w-full max-w-sm bg-white dark:bg-[#1D2B3E] border border-slate-205 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-200 dashboard-dropdown-dark", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-3.5", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-650 dark:text-teal-400 flex items-center justify-center mx-auto", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsx)("h2", { id: "coming-soon-title", className: "text-sm font-extrabold text-slate-900 dark:text-slate-100", children: comingSoonFeature }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-550 dark:text-slate-400 leading-normal", children: "This feature is currently being designed and developed for the clinical workflow portal. Stay tuned for upcoming clinical intelligence updates!" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setComingSoonFeature(null), className: "mt-2 w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-xs font-bold border-none transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-555", children: "Close" })] }) })] }))] }));
}
