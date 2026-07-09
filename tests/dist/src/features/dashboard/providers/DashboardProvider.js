"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardProvider = DashboardProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DashboardContext_1 = require("../contexts/DashboardContext");
const useDashboardPreferences_1 = require("../hooks/useDashboardPreferences");
function DashboardProvider({ children, initialTab = "dashboard" }) {
    const prefs = (0, useDashboardPreferences_1.useDashboardPreferences)();
    const [activeTab, setActiveTab] = (0, react_1.useState)(initialTab);
    const [immersiveMode, setImmersiveMode] = (0, react_1.useState)(false);
    const value = {
        ...prefs,
        activeTab,
        setActiveTab,
        immersiveMode,
        setImmersiveMode
    };
    return ((0, jsx_runtime_1.jsx)(DashboardContext_1.DashboardContext.Provider, { value: value, children: children }));
}
