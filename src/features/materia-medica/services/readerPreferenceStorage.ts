import { ReaderPreferences, DEFAULT_PREFERENCES, validatePreferences } from "../components/reader/preferences";

const STORAGE_KEY = "materia_medica_reader_prefs_v1";
const STORAGE_VERSION = 1;

type PreferenceEnvelope = {
  version: number;
  data: ReaderPreferences;
};

export const readerPreferenceStorage = {
  load(): ReaderPreferences {
    if (typeof window === "undefined") {
      return DEFAULT_PREFERENCES;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return DEFAULT_PREFERENCES;
      }

      const envelope: PreferenceEnvelope = JSON.parse(raw);
      if (envelope && typeof envelope === "object" && envelope.version === STORAGE_VERSION) {
        return validatePreferences(envelope.data);
      }

      // Default back if version mismatch or corrupt structure
      return DEFAULT_PREFERENCES;
    } catch (err) {
      // Fail-safe: load default preferences if localStorage is disabled or corrupt
      console.warn("Materia Medica preference load failed:", err);
      return DEFAULT_PREFERENCES;
    }
  },

  save(data: ReaderPreferences): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      const envelope: PreferenceEnvelope = {
        version: STORAGE_VERSION,
        data: validatePreferences(data),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
      return true;
    } catch (err) {
      // Fail-safe: ignore storage save errors (e.g. quota exceeded or Private Browsing mode)
      console.warn("Materia Medica preference save failed:", err);
      return false;
    }
  }
};
