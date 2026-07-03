import { ClinicalRepertorizationSession, SerializedClinicalSession } from "./types";

export function serializeClinicalSession(session: ClinicalRepertorizationSession): string {
  const payload: SerializedClinicalSession = {
    version: 1,
    session,
  };

  return JSON.stringify(payload);
}

export function deserializeClinicalSession(serialized: string): ClinicalRepertorizationSession {
  const parsed = JSON.parse(serialized) as SerializedClinicalSession;

  if (parsed.version !== 1) {
    throw new Error(`Unsupported clinical repertorization session version: ${parsed.version}`);
  }

  if (!parsed.session?.id || !Array.isArray(parsed.session.selectedRubrics)) {
    throw new Error("Invalid clinical repertorization session payload");
  }

  return parsed.session;
}
