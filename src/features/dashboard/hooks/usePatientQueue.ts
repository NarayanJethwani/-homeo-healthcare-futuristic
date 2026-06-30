import { useMemo } from "react";
import { Patient } from "../types";
import { getProcessedPatientQueue } from "../selectors/dashboardSelectors";

export function usePatientQueue(patients: Patient[] = []) {
  const queue = useMemo(() => {
    return getProcessedPatientQueue(patients);
  }, [patients]);

  return {
    queue,
    totalCount: patients.length
  };
}
