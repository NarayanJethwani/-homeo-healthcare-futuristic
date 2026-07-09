"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnalytics = useAnalytics;
const react_1 = require("react");
const dashboardAnalytics_1 = require("../services/dashboardAnalytics");
const analytics_1 = require("../domain/analytics");
function useAnalytics(patients = []) {
    const recoveryTrends = (0, react_1.useMemo)(() => (0, dashboardAnalytics_1.getMockRecoveryTrends)(), []);
    const diseaseDistribution = (0, react_1.useMemo)(() => (0, dashboardAnalytics_1.getMockDiseaseDistribution)(), []);
    const recoveryIndex = (0, react_1.useMemo)(() => {
        const activeCount = patients.filter((p) => p.status === "active").length;
        return (0, analytics_1.calculateRecoveryIndex)(activeCount, patients.length);
    }, [patients]);
    return {
        recoveryTrends,
        diseaseDistribution,
        recoveryIndex
    };
}
