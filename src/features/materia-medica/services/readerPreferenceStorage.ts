import { ReaderPreferences, DEFAULT_PREFERENCES, validatePreferences } from "../reader/preferences";

const STORAGE_KEY = "materia_medica_reader_prefs_v1";

export const readerPreferenceStorage = {
  load(): ReaderPreferences {
    if (typeof window === "undefined") {
      return DEFAULT_PREFERENCES;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;
      
      const parsed = JSON.parse(stored);
      // Validate schema version
      if (parsed.version !== 1 || !parsed.data) {
        return DEFAULT_PREFERENCES;
      }
      return validatePreferences(parsed.data);
    } catch (e) {
      console.warn("Failed to load reader preferences from localStorage", e);
      return DEFAULT_PREFERENCES;
    }
  },

  save(prefs: ReaderPreferences): boolean {
    if (typeof window === "undefined") return false;
    try {
      const envelope = {
        version: 1,
        data: prefs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
      return true;
    } catch (e) {
      console.warn("Failed to save reader preferences to localStorage", e);
      return false;
    }
  }
};
export default readerPreferenceStorage;
