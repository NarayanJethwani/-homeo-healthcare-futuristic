"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueueSkeleton;
const jsx_runtime_1 = require("react/jsx-runtime");
const PatientCardSkeleton_1 = __importDefault(require("./PatientCardSkeleton"));
function QueueSkeleton() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-950 border border-slate-900 rounded-3xl p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-slate-900", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5 w-1/3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-slate-800 rounded w-2/3" }), (0, jsx_runtime_1.jsx)("div", { className: "h-2.5 bg-slate-800 rounded w-full" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-7 bg-slate-800 rounded-lg w-16" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(PatientCardSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(PatientCardSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(PatientCardSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(PatientCardSkeleton_1.default, {})] })] }));
}
