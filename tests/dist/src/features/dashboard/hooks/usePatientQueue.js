"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePatientQueue = usePatientQueue;
const react_1 = require("react");
const dashboardSelectors_1 = require("../selectors/dashboardSelectors");
function usePatientQueue(patients = []) {
    const queue = (0, react_1.useMemo)(() => {
        return (0, dashboardSelectors_1.getProcessedPatientQueue)(patients);
    }, [patients]);
    return {
        queue,
        totalCount: patients.length
    };
}
