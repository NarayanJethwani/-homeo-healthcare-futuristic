"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceBreakdownPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const ConfidenceBreakdownPanel = ({ evidenceBreakdown, remedyId }) => {
    const scores = evidenceBreakdown.remedyScores[remedyId];
    if (!scores) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-400 italic", children: "No score breakdown available for this remedy." }) }));
    }
    const items = [
        { label: 'Mental Generals & State', value: scores.mental, color: 'bg-indigo-500' },
        { label: 'Physical Generals & Particulars', value: scores.physical, color: 'bg-emerald-500' },
        { label: 'Modalities / Aggravation / Amelioration', value: scores.modalities, color: 'bg-blue-500' },
        { label: 'Thermal Affinities', value: scores.thermals, color: 'bg-amber-500' },
        { label: 'Miasmatic Load Match', value: scores.miasm, color: 'bg-purple-500' },
        { label: 'Clinical Experience Weighting', value: scores.clinicalWeight, color: 'bg-rose-500' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-4 h-4 text-emerald-500" }), "Evidence & Score Breakdown"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-250/30 font-mono", children: "Decision Support" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-slate-200/60 pb-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-[10px] font-black text-slate-800 uppercase tracking-wider", children: ["Metric Breakdown for ", remedyId] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-black text-slate-900", children: ["Total: ", scores.total] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: items.map((item, idx) => {
                            const pct = scores.total > 0 ? Math.min(100, Math.round((item.value / scores.total) * 100)) : 0;
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-[9px] font-semibold text-slate-600", children: [(0, jsx_runtime_1.jsx)("span", { children: item.label }), (0, jsx_runtime_1.jsxs)("span", { children: [item.value, " points (", pct, "%)"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full ${item.color} rounded-full`, style: { width: `${pct}%` } }) })] }, idx));
                        }) })] })] }));
};
exports.ConfidenceBreakdownPanel = ConfidenceBreakdownPanel;
