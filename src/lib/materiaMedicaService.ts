import { db } from "./firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { MateriaMedicaDocument } from "./materiaMedicaSchema";
import { FirestoreRemedyBridge } from "./materiaMedicaDb";

/**
 * Fetches a single remedy profile from Cloud Firestore by its document ID.
 */
export async function fetchRemedyProfileFromFirestore(remedyId: string): Promise<MateriaMedicaDocument | null> {
  try {
    const remedyDocRef = doc(db, "remedies", remedyId);
    const docSnap = await getDoc(remedyDocRef);
    if (docSnap.exists()) {
      return FirestoreRemedyBridge.deserialize(docSnap.data());
    }
    return null;
  } catch (err) {
    console.error(`Error fetching remedy profile ${remedyId} from Firestore:`, err);
    return null;
  }
}

/**
 * Searches remedies in Firestore by matching a query string in the identity name.
 */
export async function searchRemediesInFirestore(queryText: string): Promise<MateriaMedicaDocument[]> {
  try {
    const term = queryText.trim();
    if (!term) return [];

    // Prefix match queries in Firestore
    const q = query(
      collection(db, "remedies"),
      where("identity.name", ">=", term),
      where("identity.name", "<=", term + "\uf8ff")
    );
    const snapshot = await getDocs(q);
    const results: MateriaMedicaDocument[] = [];
    snapshot.forEach(docSnap => {
      results.push(FirestoreRemedyBridge.deserialize(docSnap.data()));
    });
    return results;
  } catch (err) {
    console.error("Error searching remedies in Firestore:", err);
    return [];
  }
}

/**
 * Fetches details of a specific chapter in a book from `/homeopathic_books/{bookId}/chapters/{chapterId}`.
 */
export async function fetchBookChapterFromFirestore(bookId: string, chapterId: string): Promise<any> {
  try {
    const chapterRef = doc(db, "homeopathic_books", bookId, "chapters", chapterId);
    const docSnap = await getDoc(chapterRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error(`Error fetching chapter ${chapterId} of book ${bookId} from Firestore:`, err);
    return null;
  }
}

/**
 * Fetches a specific repertory rubric from `/repertory_rubrics/{rubricId}`.
 */
export async function fetchRepertoryRubricFromFirestore(rubricId: string): Promise<any> {
  try {
    const rubricRef = doc(db, "repertory_rubrics", rubricId);
    const docSnap = await getDoc(rubricRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error(`Error fetching repertory rubric ${rubricId} from Firestore:`, err);
    return null;
  }
}
