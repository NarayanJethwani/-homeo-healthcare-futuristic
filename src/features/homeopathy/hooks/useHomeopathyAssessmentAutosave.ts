import { useState, useRef, useEffect } from "react";
import { HomeopathicAssessment } from "../domain/homeopathy.types";
import { HomeopathyService } from "../services/homeopathyService";

export type SaveState = "unsaved" | "saving" | "saved" | "error" | "conflict" | "offline_demo_only";

interface UseAutosaveProps {
  assessment: HomeopathicAssessment | null;
  homeopathyService: HomeopathyService;
  actorId: string;
  onUpdateAssessment: (updated: HomeopathicAssessment) => void;
}

export function useHomeopathyAssessmentAutosave({
  assessment,
  homeopathyService,
  actorId,
  onUpdateAssessment
}: UseAutosaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveState>("saved");
  const [lastSaved, setLastSaved] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const currentAssessment = useRef<HomeopathicAssessment | null>(assessment);

  useEffect(() => {
    currentAssessment.current = assessment;
  }, [assessment]);

  const triggerAutosave = (updatedFields: Partial<HomeopathicAssessment>) => {
    if (!currentAssessment.current) return;

    setSaveStatus("unsaved");

    // Compose updated preview locally immediately
    const updated = {
      ...currentAssessment.current,
      ...updatedFields,
      provenance: {
        ...currentAssessment.current.provenance,
        updatedAt: new Date().toISOString(),
        updatedBy: actorId
      }
    };
    onUpdateAssessment(updated);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      await performSave(updated);
    }, 2000);
  };

  const performSave = async (targetAssessment: HomeopathicAssessment) => {
    setSaveStatus("saving");
    try {
      const result = await homeopathyService.saveDraft(
        targetAssessment.id,
        targetAssessment,
        targetAssessment.recordVersion,
        actorId
      );

      if (result.status === "updated") {
        setSaveStatus("saved");
        setLastSaved(new Date().toLocaleTimeString());
        onUpdateAssessment(result.assessment);
      } else if (result.status === "version_conflict") {
        setSaveStatus("conflict");
        setErrorMessage("Autosave rejected: A concurrent modification conflict occurred on the server.");
      } else {
        setSaveStatus("error");
        setErrorMessage("Failed to persist assessment draft.");
      }
    } catch (err: any) {
      setSaveStatus("error");
      setErrorMessage(err.message || "A network error occurred during autosave.");
    }
  };

  const forceSave = async () => {
    if (!currentAssessment.current) return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    await performSave(currentAssessment.current);
  };

  return {
    saveStatus,
    lastSaved,
    errorMessage,
    triggerAutosave,
    forceSave
  };
}
