"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeyboardShortcutsModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function KeyboardShortcutsModal({ isOpen, onClose, }) {
    const closeButtonRef = (0, react_1.useRef)(null);
    const modalRef = (0, react_1.useRef)(null);
    // Focus trap and Escape listener
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        // Focus close button on mount
        setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 50);
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key === "Tab" && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
                if (focusableElements.length === 0)
                    return;
                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                }
                else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const shortcuts = [
        { keys: ["⌘", "K"], desc: "Open Global Command Search" },
        { keys: ["⌘", "["], desc: "Toggle Navigation Sidebar collapse" },
        { keys: ["Esc"], desc: "Dismiss open modals, menus, and overlays" },
        { keys: ["↑", "↓"], desc: "Navigate command palette and menu listings" },
        { keys: ["Enter"], desc: "Confirm selection / Trigger active action" },
        { keys: ["?"], desc: "Toggle this Keyboard Shortcuts help board" },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose }), (0, jsx_runtime_1.jsxs)("div", { ref: modalRef, role: "dialog", "aria-modal": "true", "aria-labelledby": "shortcuts-modal-title", className: "relative w-full max-w-md bg-white dark:bg-[#1D2B3E] border border-slate-205 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-200 transition-all select-none dashboard-dropdown-dark", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-850/60 pb-3.5 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-650 dark:text-teal-400 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Keyboard, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("h2", { id: "shortcuts-modal-title", className: "text-sm font-extrabold text-slate-900 dark:text-slate-100", children: "Keyboard Shortcuts" })] }), (0, jsx_runtime_1.jsx)("button", { ref: closeButtonRef, onClick: onClose, className: "p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 cursor-pointer border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-teal-555 outline-none dashboard-focus-ring", "aria-label": "Close keyboard shortcuts dialog", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3.5 max-h-[300px] overflow-y-auto pr-1", children: shortcuts.map((shortcut, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs py-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-600 dark:text-slate-400 font-semibold", children: shortcut.desc }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1.5 shrink-0", children: shortcut.keys.map((key, keyIdx) => ((0, jsx_runtime_1.jsx)("kbd", { className: "inline-flex items-center justify-center px-2 py-1 min-w-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-lg text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 shadow-xs", children: key }, keyIdx))) })] }, idx))) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-5 pt-4 border-t border-slate-100 dark:border-slate-850/60 flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-xs font-bold border-none transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-555 outline-none dashboard-focus-ring", children: "Got it" }) })] })] }));
}
