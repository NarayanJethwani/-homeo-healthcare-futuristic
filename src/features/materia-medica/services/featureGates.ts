import { featureFlags } from "../../dashboard/constants/featureFlags";

export function canUseMateriaMedicaLocalSearch(): boolean {
  return (
    !!featureFlags.MATERIA_MEDICA_LIBRARY_V2 &&
    !!featureFlags.MATERIA_MEDICA_READER_V2 &&
    !!featureFlags.MATERIA_MEDICA_SAMPLE_CORPUS &&
    !!featureFlags.MATERIA_MEDICA_LOCAL_SEARCH
  );
}

export function canUseMateriaMedicaComparison(): boolean {
  return (
    canUseMateriaMedicaLocalSearch() &&
    !!featureFlags.MATERIA_MEDICA_REMEDY_COMPARISON
  );
}
