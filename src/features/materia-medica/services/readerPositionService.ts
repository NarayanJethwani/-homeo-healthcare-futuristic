import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { MateriaMedicaReaderPosition, PersistenceState } from "../types/persistenceTypes";
import { GovernedMateriaMedicaRepository } from "./GovernedMateriaMedicaRepository";
import { getPrivateWorkspaceOwnerKey } from "./privateWorkspaceStorage";

const LOCAL_STORAGE_KEY_PREFIX = "homeo-healthcare:mm:positions:v1:";

export function getLocalStorageKey(): string {
  const uid = getPrivateWorkspaceOwnerKey(auth.currentUser?.uid);
  return `${LOCAL_STORAGE_KEY_PREFIX}${uid}`;
}

export function getLocalPositions(): Record<string, MateriaMedicaReaderPosition> {
  if (typeof window === "undefined") return {};
  try {
    const key = getLocalStorageKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Local storage read error for positions:", e);
    return {};
  }
}

export function saveLocalPosition(position: MateriaMedicaReaderPosition): void {
  if (typeof window === "undefined") return;
  try {
    const positions = getLocalPositions();
    positions[position.bookId] = position;
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(positions));
  } catch (e) {
    console.error("Local storage write error for positions:", e);
  }
}

export function clearLocalGuestPositions(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${getPrivateWorkspaceOwnerKey()}`);
  } catch (e) {
    console.error("Failed to clear guest positions:", e);
  }
}

export async function getLastReaderPosition(bookId: string): Promise<MateriaMedicaReaderPosition | null> {
  const user = auth.currentUser;
  let position: MateriaMedicaReaderPosition | null = null;

  if (!user) {
    const locals = getLocalPositions();
    position = locals[bookId] || null;
  } else {
    const docRef = doc(db, "practitioners", user.uid, "materiaMedicaReaderPositions", bookId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        position = docSnap.data() as MateriaMedicaReaderPosition;
        saveLocalPosition(position);
      } else {
        const locals = getLocalPositions();
        position = locals[bookId] || null;
      }
    } catch (e) {
      console.error("Failed to fetch reader position from Firestore, falling back to local cache:", e);
      const locals = getLocalPositions();
      position = locals[bookId] || null;
    }
  }

  if (!position) return null;

  try {
    // 1. Check if the passage remains approved and get the passage
    const passage = await GovernedMateriaMedicaRepository.getApprovedPassage(position.passageId);
    if (!passage) return null;

    // 2. Check if the source version remains approved
    if (passage.sourceVersionId !== position.sourceVersionId) return null;

    // 3. Check if the passage belongs to the manifest
    const manifest = await GovernedMateriaMedicaRepository.getManifest();
    if (!manifest.passageIds.includes(position.passageId)) return null;

    return position;
  } catch (e) {
    console.error("Reader position validation failed, returning null:", e);
    return null;
  }
}

export async function saveReaderPosition(position: MateriaMedicaReaderPosition): Promise<PersistenceState> {
  const user = auth.currentUser;
  const updated = {
    ...position,
    updatedAt: new Date().toISOString()
  };

  if (!user) {
    saveLocalPosition(updated);
    return "local-only";
  }

  const docRef = doc(db, "practitioners", user.uid, "materiaMedicaReaderPositions", position.bookId);

  try {
    await setDoc(docRef, updated);
    saveLocalPosition(updated);
    return "synced";
  } catch (e) {
    console.error("Firestore save reader position failed:", e);
    saveLocalPosition(updated);
    return "offline-pending";
  }
}
