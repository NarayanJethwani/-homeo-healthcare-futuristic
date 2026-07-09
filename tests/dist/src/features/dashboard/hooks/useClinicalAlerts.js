"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClinicalAlerts = useClinicalAlerts;
const react_1 = require("react");
const dashboardSelectors_1 = require("../selectors/dashboardSelectors");
const branded_1 = require("../types/branded");
function useClinicalAlerts(patients = [], dismissedAlerts = []) {
    const [pinnedAlertIds, setPinnedAlertIds] = (0, react_1.useState)([]);
    const [mutedAlertIds, setMutedAlertIds] = (0, react_1.useState)([]);
    const [acknowledgedAlerts, setAcknowledgedAlerts] = (0, react_1.useState)({});
    const [localDismissed, setLocalDismissed] = (0, react_1.useState)([]);
    const compiledAlerts = (0, react_1.useMemo)(() => {
        return (0, dashboardSelectors_1.getProcessedSmartAlerts)(patients).map((alert) => {
            const isPinned = pinnedAlertIds.includes(alert.id);
            const isMuted = mutedAlertIds.includes(alert.id);
            const isAcknowledged = !!acknowledgedAlerts[alert.id];
            return {
                ...alert,
                id: (0, branded_1.toAlertId)(alert.id),
                isPinned,
                isMuted,
                isAcknowledged
            };
        });
    }, [patients, pinnedAlertIds, mutedAlertIds, acknowledgedAlerts]);
    const activeDismissed = dismissedAlerts.map(branded_1.toAlertId).concat(localDismissed);
    const togglePin = (id) => {
        setPinnedAlertIds((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
    };
    const toggleMute = (id) => {
        setMutedAlertIds((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
    };
    const acknowledgeAlert = (id) => {
        if (acknowledgedAlerts[id])
            return;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setAcknowledgedAlerts((prev) => ({
            ...prev,
            [id]: { time: now, user: "Dr. Narayan Jethwani" }
        }));
    };
    const dismissAlert = (id) => {
        setLocalDismissed((prev) => [...prev, id]);
    };
    return {
        alerts: compiledAlerts,
        activeDismissed,
        togglePin,
        toggleMute,
        acknowledgeAlert,
        dismissAlert,
        acknowledgedAlerts
    };
}
