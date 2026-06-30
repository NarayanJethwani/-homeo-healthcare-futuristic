import { useState, useMemo } from "react";
import { Patient } from "../types";
import { getProcessedSmartAlerts } from "../selectors/dashboardSelectors";
import { shouldAlertBeVisible, AlertDomainModel } from "../domain/alerts";
import { AlertId, toAlertId } from "../types/branded";

export function useClinicalAlerts(patients: Patient[] = [], dismissedAlerts: string[] = []) {
  const [pinnedAlertIds, setPinnedAlertIds] = useState<AlertId[]>([]);
  const [mutedAlertIds, setMutedAlertIds] = useState<AlertId[]>([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, { time: string; user: string }>>({});
  const [localDismissed, setLocalDismissed] = useState<AlertId[]>([]);

  const compiledAlerts = useMemo(() => {
    return getProcessedSmartAlerts(patients).map((alert) => {
      const isPinned = pinnedAlertIds.includes(alert.id as AlertId);
      const isMuted = mutedAlertIds.includes(alert.id as AlertId);
      const isAcknowledged = !!acknowledgedAlerts[alert.id];
      return {
        ...alert,
        id: toAlertId(alert.id),
        isPinned,
        isMuted,
        isAcknowledged
      } as AlertDomainModel;
    });
  }, [patients, pinnedAlertIds, mutedAlertIds, acknowledgedAlerts]);

  const activeDismissed = dismissedAlerts.map(toAlertId).concat(localDismissed);

  const togglePin = (id: AlertId) => {
    setPinnedAlertIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleMute = (id: AlertId) => {
    setMutedAlertIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const acknowledgeAlert = (id: AlertId) => {
    if (acknowledgedAlerts[id]) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAcknowledgedAlerts((prev) => ({
      ...prev,
      [id]: { time: now, user: "Dr. Narayan Jethwani" }
    }));
  };

  const dismissAlert = (id: AlertId) => {
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
