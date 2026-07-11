import { useState, useEffect } from "react";
import { ReaderPreferences, DEFAULT_PREFERENCES } from "../components/reader/preferences";
import { readerPreferenceStorage } from "../services/readerPreferenceStorage";

export function useReaderPreferences() {
  const [preferences, setPreferencesState] = useState<ReaderPreferences>(DEFAULT_PREFERENCES);

  // Safely initialize state after mount to avoid server-client mismatches
  useEffect(() => {
    setPreferencesState(readerPreferenceStorage.load());
  }, []);

  const setPreferences = (newPrefs: Partial<ReaderPreferences>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...newPrefs };
      readerPreferenceStorage.save(updated);
      return updated;
    });
  };

  return {
    preferences,
    setPreferences,
  };
}
