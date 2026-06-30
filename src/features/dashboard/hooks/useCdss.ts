import { useMemo } from "react";
import { Patient } from "../types";
import { getProcessedAiRecommendations } from "../selectors/dashboardSelectors";
import { enforceCdssAdvisory, CdssDomainModel } from "../domain/cdss";

export function useCdss(patients: Patient[] = []) {
  const recommendations: CdssDomainModel[] = useMemo(() => {
    return getProcessedAiRecommendations(patients).map(enforceCdssAdvisory);
  }, [patients]);

  return {
    recommendations
  };
}
