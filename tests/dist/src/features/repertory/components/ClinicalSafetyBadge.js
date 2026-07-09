"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalSafetyBadge = ClinicalSafetyBadge;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
function ClinicalSafetyBadge() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "h-3.5 w-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: "Clinical review required - do not auto-prescribe" })] }));
}
