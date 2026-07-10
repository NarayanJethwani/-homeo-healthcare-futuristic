export interface PractitionerPreferences {
  defaultDashboardTab?: string;
  compactMode?: boolean;
  showClinicalDisclaimers?: boolean;
}

export const defaultPreferences: PractitionerPreferences = {
  defaultDashboardTab: "dashboard",
  compactMode: false,
  showClinicalDisclaimers: true
};
