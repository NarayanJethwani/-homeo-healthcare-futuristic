"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RubricCoverageHeatmap = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const RubricCoverageHeatmap = ({ confidenceBreakdown, remedyId }) => {
    const conf = confidenceBreakdown[remedyId];
    if (!conf) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-400 italic", children: "No category coverage breakdown available." }) }));
    }
    const items = [
        { name: 'Mental & Emotional Generals', pct: conf.mental, color: 'from-purple-500 to-indigo-500' },
        { name: 'Physical Particulars', pct: conf.physical, color: 'from-emerald-400 to-emerald-600' },
        { name: 'Modalities (Better / Worse)', pct: conf.modalities, color: 'from-blue-400 to-blue-600' },
        { name: 'Etiological Triggers / Causation', pct: conf.etiology, color: 'from-rose-400 to-rose-600' },
        { name: 'Thermal State & Cravings', pct: conf.thermals, color: 'from-amber-400 to-amber-600' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Layers, { className: "w-4 h-4 text-emerald-500" }), "Symptom Coverage Heatmap"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-250/30 font-mono", children: "Decision Support" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: items.map((item, idx) => {
                    const filledBlocks = Math.round(item.pct / 10);
                    const blocks = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-[9px] font-semibold text-slate-600", children: [(0, jsx_runtime_1.jsx)("span", { children: item.name }), (0, jsx_runtime_1.jsxs)("span", { children: [item.pct, "% Coverage"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-mono text-xs tracking-wider text-emerald-600 font-black select-none", children: blocks }), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full bg-gradient-to-r ${item.color} rounded-full`, style: { width: `${item.pct}%` } }) })] })] }, idx));
                }) })] }));
};
exports.RubricCoverageHeatmap = RubricCoverageHeatmap;
