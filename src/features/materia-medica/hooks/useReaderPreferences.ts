import { useState, useEffect } from "react";
import { ReaderPreferences, DEFAULT_PREFERENCES } from "../reader/preferences";
import { readerPreferenceStorage } from "../services/readerPreferenceStorage";

export function useReaderPreferences() {
  const [preferences, setPreferencesState] = useState<ReaderPreferences>(DEFAULT_PREFERENCES);

  // Load preferences once on mount
  useEffect(() => {
    const loaded = readerPreferenceStorage.load();
    setPreferencesState(loaded);
  }, []);

  const setPreferences = (newPrefs: ReaderPreferences | ((prev: ReaderPreferences) => ReaderPreferences)) => {
    setPreferencesState((prev) => {
      const updated = typeof newPrefs === "function" ? newPrefs(prev) : newPrefs;
      readerPreferenceStorage.save(updated);
      return updated;
    });
  };

  return { preferences, setPreferences };
}
export default useReaderPreferences;
