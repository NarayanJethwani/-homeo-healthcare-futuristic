import { db, auth } from "@/lib/firebase";
import { doc, deleteDoc, collection, getDocs, query, where, runTransaction } from "firebase/firestore";
import { MateriaMedicaAnnotation, PersistenceState } from "../types/persistenceTypes";
import { getPrivateWorkspaceOwnerKey } from "./privateWorkspaceStorage";

const LOCAL_STORAGE_KEY_PREFIX = "homeo-healthcare:mm:annotations:v1:";

export function getLocalStorageKey(): string {
  const uid = getPrivateWorkspaceOwnerKey(auth.currentUser?.uid);
  return `${LOCAL_STORAGE_KEY_PREFIX}${uid}`;
}

export function getLocalAnnotations(): MateriaMedicaAnnotation[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getLocalStorageKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Local storage read error:", e);
    return [];
  }
}

export function saveLocalAnnotation(annotation: MateriaMedicaAnnotation): void {
  if (typeof window === "undefined") return;
  try {
    const annotations = getLocalAnnotations();
    const idx = annotations.findIndex(a => a.id === annotation.id);
    if (idx >= 0) {
      annotations[idx] = annotation;
    } else {
      annotations.push(annotation);
    }
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(annotations));
  } catch (e) {
    console.error("Local storage write error:", e);
  }
}

export function deleteLocalAnnotation(annotationId: string): void {
  if (typeof window === "undefined") return;
  try {
    const annotations = getLocalAnnotations();
    const filtered = annotations.filter(a => a.id !== annotationId);
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(filtered));
  } catch (e) {
    console.error("Local storage delete error:", e);
  }
}

export function clearLocalGuestAnnotations(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${getPrivateWorkspaceOwnerKey()}`);
  } catch (e) {
    console.error("Failed to clear guest annotations:", e);
  }
}

export async function getAnnotationsForBook(bookId: string): Promise<MateriaMedicaAnnotation[]> {
  const user = auth.currentUser;
  if (!user) {
    // Guest mode: get from localStorage
    return getLocalAnnotations().filter(a => a.bookId === bookId);
  }

  try {
    const annotationsRef = collection(db, "practitioners", user.uid, "materiaMedicaAnnotations");
    const q = query(annotationsRef, where("bookId", "==", bookId));
    const snapshot = await getDocs(q);
    const remoteAnnotations = snapshot.docs.map(doc => doc.data() as MateriaMedicaAnnotation);
    
    // Merge remote annotations into localStorage cache quietly for offline support
    for (const ann of remoteAnnotations) {
      saveLocalAnnotation(ann);
    }
    
    return remoteAnnotations;
  } catch (e) {
    console.error("Failed to fetch annotations from Firestore, falling back to local cache:", e);
    return getLocalAnnotations().filter(a => a.bookId === bookId);
  }
}

export async function saveAnnotation(annotation: MateriaMedicaAnnotation): Promise<PersistenceState> {
  const user = auth.currentUser;
  if (!user) {
    // Guest mode
    const updated = {
      ...annotation,
      practitionerId: getPrivateWorkspaceOwnerKey(),
      updatedAt: new Date().toISOString()
    };
    saveLocalAnnotation(updated);
    return "local-only";
  }

  // Ensure practitionerId matches current user
  if (annotation.practitionerId !== user.uid) {
    throw new Error("Mismatched practitioner ID");
  }

  const docRef = doc(db, "practitioners", user.uid, "materiaMedicaAnnotations", annotation.id);

  try {
    let toSave!: MateriaMedicaAnnotation;
    await runTransaction(db, async transaction => {
      const docSnap = await transaction.get(docRef);
      if (docSnap.exists()) {
        const existing = docSnap.data() as MateriaMedicaAnnotation;
        if (annotation.revision !== existing.revision) {
          throw new Error("ANNOTATION_REVISION_CONFLICT");
        }
        toSave = {
          ...annotation,
          revision: existing.revision + 1,
          createdAt: existing.createdAt,
          updatedAt: new Date().toISOString()
        };
      } else {
        if (annotation.revision !== 0) throw new Error("ANNOTATION_REVISION_CONFLICT");
        toSave = { ...annotation, revision: 1, updatedAt: new Date().toISOString() };
      }
      transaction.set(docRef, toSave);
    });
    saveLocalAnnotation(toSave);
    return "synced";
  } catch (e: any) {
    if (e instanceof Error && e.message === "ANNOTATION_REVISION_CONFLICT") return "conflict";
    console.error("Firestore save failed:", e);
    // Remote write failure, return offline-pending
    saveLocalAnnotation(annotation);
    return "offline-pending";
  }
}

export async function deleteAnnotation(annotationId: string): Promise<PersistenceState> {
  const user = auth.currentUser;
  if (!user) {
    deleteLocalAnnotation(annotationId);
    return "local-only";
  }

  const docRef = doc(db, "practitioners", user.uid, "materiaMedicaAnnotations", annotationId);

  try {
    await deleteDoc(docRef);
    deleteLocalAnnotation(annotationId);
    return "synced";
  } catch (e) {
    console.error("Firestore delete failed:", e);
    return "failed";
  }
}
