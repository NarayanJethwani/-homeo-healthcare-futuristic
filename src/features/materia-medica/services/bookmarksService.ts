import { db, auth } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { MateriaMedicaBookmark, PersistenceState } from "../types/persistenceTypes";
import { getPrivateWorkspaceOwnerKey } from "./privateWorkspaceStorage";

const LOCAL_STORAGE_KEY_PREFIX = "homeo-healthcare:mm:bookmarks:v1:";

export function getLocalStorageKey(): string {
  const uid = getPrivateWorkspaceOwnerKey(auth.currentUser?.uid);
  return `${LOCAL_STORAGE_KEY_PREFIX}${uid}`;
}

export async function computeSha256(text: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error("Secure bookmark hashing is unavailable");
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function getLocalBookmarks(): MateriaMedicaBookmark[] {
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

export function saveLocalBookmark(bookmark: MateriaMedicaBookmark): void {
  if (typeof window === "undefined") return;
  try {
    const bookmarks = getLocalBookmarks();
    const idx = bookmarks.findIndex(b => b.id === bookmark.id);
    if (idx < 0) {
      bookmarks.push(bookmark);
      localStorage.setItem(getLocalStorageKey(), JSON.stringify(bookmarks));
    }
  } catch (e) {
    console.error("Local storage write error:", e);
  }
}

export function deleteLocalBookmark(bookmarkId: string): void {
  if (typeof window === "undefined") return;
  try {
    const bookmarks = getLocalBookmarks();
    const filtered = bookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(filtered));
  } catch (e) {
    console.error("Local storage delete error:", e);
  }
}

export function clearLocalGuestBookmarks(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${getPrivateWorkspaceOwnerKey()}`);
  } catch (e) {
    console.error("Failed to clear guest bookmarks:", e);
  }
}

export async function getBookmarks(bookId: string): Promise<MateriaMedicaBookmark[]> {
  const user = auth.currentUser;
  if (!user) {
    return getLocalBookmarks().filter(b => b.bookId === bookId);
  }

  try {
    const bookmarksRef = collection(db, "practitioners", user.uid, "materiaMedicaBookmarks");
    const q = query(bookmarksRef, where("bookId", "==", bookId));
    const snapshot = await getDocs(q);
    const remoteBookmarks = snapshot.docs.map(doc => doc.data() as MateriaMedicaBookmark);
    
    // Cache locally
    for (const b of remoteBookmarks) {
      saveLocalBookmark(b);
    }
    
    return remoteBookmarks;
  } catch (e) {
    console.error("Failed to fetch bookmarks from Firestore, falling back to local cache:", e);
    return getLocalBookmarks().filter(b => b.bookId === bookId);
  }
}

export async function isBookmarked(bookId: string, passageId: string, blockId?: string): Promise<boolean> {
  const user = auth.currentUser;
  const practitionerId = getPrivateWorkspaceOwnerKey(user?.uid);
  const sourceVersionId = bookId + "_v1";
  const bookmarkId = await computeSha256(practitionerId + sourceVersionId + passageId + (blockId || ""));
  
  const locals = getLocalBookmarks();
  return locals.some(b => b.id === bookmarkId);
}

export async function toggleBookmark(bookmark: MateriaMedicaBookmark): Promise<PersistenceState> {
  const user = auth.currentUser;
  const practitionerId = getPrivateWorkspaceOwnerKey(user?.uid);
  
  const bookmarkId = await computeSha256(practitionerId + bookmark.sourceVersionId + bookmark.passageId + (bookmark.blockId || ""));
  const updatedBookmark = {
    ...bookmark,
    id: bookmarkId,
    practitionerId
  };

  const locals = getLocalBookmarks();
  const exists = locals.some(b => b.id === bookmarkId);

  if (!user) {
    if (exists) {
      deleteLocalBookmark(bookmarkId);
    } else {
      saveLocalBookmark(updatedBookmark);
    }
    return "local-only";
  }

  const docRef = doc(db, "practitioners", user.uid, "materiaMedicaBookmarks", bookmarkId);

  try {
    if (exists) {
      await deleteDoc(docRef);
      deleteLocalBookmark(bookmarkId);
    } else {
      await setDoc(docRef, updatedBookmark);
      saveLocalBookmark(updatedBookmark);
    }
    return "synced";
  } catch (e) {
    console.error("Firestore toggle bookmark failed:", e);
    if (exists) {
      deleteLocalBookmark(bookmarkId);
    } else {
      saveLocalBookmark(updatedBookmark);
    }
    return "offline-pending";
  }
}
