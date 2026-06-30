import { useMemo } from "react";
import { getMockRecoveryTrends, getMockDiseaseDistribution } from "../services/dashboardAnalytics";
import { Patient } from "../types";
import { calculateRecoveryIndex } from "../domain/analytics";

export function useAnalytics(patients: Patient[] = []) {
  const recoveryTrends = useMemo(() => getMockRecoveryTrends(), []);
  const diseaseDistribution = useMemo(() => getMockDiseaseDistribution(), []);

  const recoveryIndex = useMemo(() => {
    const activeCount = patients.filter((p) => p.status === "active").length;
    return calculateRecoveryIndex(activeCount, patients.length);
  }, [patients]);

  return {
    recoveryTrends,
    diseaseDistribution,
    recoveryIndex
  };
}
