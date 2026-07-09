"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const dashboardLogger_1 = require("../utils/dashboardLogger");
class DashboardErrorBoundary extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false
        };
        this.handleRetry = () => {
            this.setState({ hasError: false });
        };
    }
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        dashboardLogger_1.dashboardLogger.widgetFailure(this.props.widgetName || "Unnamed Widget", { message: error.message, stack: error.stack, componentStack: errorInfo.componentStack });
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-950/20 border border-rose-900/40 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-8 h-8 text-rose-500 animate-bounce" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-bold text-rose-250 font-serif", children: "Widget Diagnostic Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[11px] text-rose-400 font-sans max-w-sm leading-relaxed", children: "Clinical telemetry failed to render this segment. An alert has been sent to technical support." })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: this.handleRetry, className: "flex items-center gap-1.5 py-1.5 px-4 bg-rose-900 hover:bg-rose-850 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3.5 h-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: "Reload Segment" })] })] }));
        }
        return this.props.children;
    }
}
exports.default = DashboardErrorBoundary;
