"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardSkeleton;
const jsx_runtime_1 = require("react/jsx-runtime");
const AlertsSkeleton_1 = __importDefault(require("./AlertsSkeleton"));
const QueueSkeleton_1 = __importDefault(require("./QueueSkeleton"));
const AnalyticsSkeleton_1 = __importDefault(require("./AnalyticsSkeleton"));
function DashboardSkeleton() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 select-none animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-5 bg-slate-950 border border-slate-900 rounded-3xl h-24 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 w-2/3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-2.5 bg-slate-800 rounded w-1/2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-slate-800 rounded w-3/4" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-slate-900 rounded-2xl" })] }, i))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-8 space-y-6", children: [(0, jsx_runtime_1.jsx)(QueueSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(AnalyticsSkeleton_1.default, {})] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-4", children: (0, jsx_runtime_1.jsx)(AlertsSkeleton_1.default, {}) })] })] }));
}
