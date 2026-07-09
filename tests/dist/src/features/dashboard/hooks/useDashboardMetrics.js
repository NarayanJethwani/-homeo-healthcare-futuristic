"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardMetrics = useDashboardMetrics;
const react_1 = require("react");
const dashboardSelectors_1 = require("../selectors/dashboardSelectors");
function useDashboardMetrics(patients = [], invoicesList = []) {
    const overviewStats = (0, react_1.useMemo)(() => {
        return (0, dashboardSelectors_1.getTodayOverviewStats)(patients, invoicesList);
    }, [patients, invoicesList]);
    return {
        stats: overviewStats
    };
}
