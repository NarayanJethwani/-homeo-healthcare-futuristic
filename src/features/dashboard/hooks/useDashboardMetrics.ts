import { useMemo } from "react";
import { Patient } from "../types";
import { getTodayOverviewStats } from "../selectors/dashboardSelectors";

export function useDashboardMetrics(patients: Patient[] = [], invoicesList: any[] = []) {
  const overviewStats = useMemo(() => {
    return getTodayOverviewStats(patients, invoicesList);
  }, [patients, invoicesList]);

  return {
    stats: overviewStats
  };
}
