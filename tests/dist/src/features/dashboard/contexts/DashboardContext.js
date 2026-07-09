"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardContext = void 0;
exports.useDashboard = useDashboard;
const react_1 = require("react");
exports.DashboardContext = (0, react_1.createContext)(undefined);
function useDashboard() {
    const context = (0, react_1.useContext)(exports.DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
