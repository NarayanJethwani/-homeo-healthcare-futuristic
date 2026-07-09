"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCdss = useCdss;
const react_1 = require("react");
const dashboardSelectors_1 = require("../selectors/dashboardSelectors");
const cdss_1 = require("../domain/cdss");
function useCdss(patients = []) {
    const recommendations = (0, react_1.useMemo)(() => {
        return (0, dashboardSelectors_1.getProcessedAiRecommendations)(patients).map(cdss_1.enforceCdssAdvisory);
    }, [patients]);
    return {
        recommendations
    };
}
