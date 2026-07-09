"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRemedyProfileFromFirestore = fetchRemedyProfileFromFirestore;
exports.searchRemediesInFirestore = searchRemediesInFirestore;
exports.fetchBookChapterFromFirestore = fetchBookChapterFromFirestore;
exports.fetchRepertoryRubricFromFirestore = fetchRepertoryRubricFromFirestore;
const firebase_1 = require("./firebase");
const firestore_1 = require("firebase/firestore");
const materiaMedicaDb_1 = require("./materiaMedicaDb");
/**
 * Fetches a single remedy profile from Cloud Firestore by its document ID.
 */
async function fetchRemedyProfileFromFirestore(remedyId) {
    try {
        const remedyDocRef = (0, firestore_1.doc)(firebase_1.db, "remedies", remedyId);
        const docSnap = await (0, firestore_1.getDoc)(remedyDocRef);
        if (docSnap.exists()) {
            return materiaMedicaDb_1.FirestoreRemedyBridge.deserialize(docSnap.data());
        }
        return null;
    }
    catch (err) {
        console.error(`Error fetching remedy profile ${remedyId} from Firestore:`, err);
        return null;
    }
}
/**
 * Searches remedies in Firestore by matching a query string in the identity name.
 */
async function searchRemediesInFirestore(queryText) {
    try {
        const term = queryText.trim();
        if (!term)
            return [];
        // Prefix match queries in Firestore
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, "remedies"), (0, firestore_1.where)("identity.name", ">=", term), (0, firestore_1.where)("identity.name", "<=", term + "\uf8ff"));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const results = [];
        snapshot.forEach(docSnap => {
            results.push(materiaMedicaDb_1.FirestoreRemedyBridge.deserialize(docSnap.data()));
        });
        return results;
    }
    catch (err) {
        console.error("Error searching remedies in Firestore:", err);
        return [];
    }
}
/**
 * Fetches details of a specific chapter in a book from `/homeopathic_books/{bookId}/chapters/{chapterId}`.
 */
async function fetchBookChapterFromFirestore(bookId, chapterId) {
    try {
        const chapterRef = (0, firestore_1.doc)(firebase_1.db, "homeopathic_books", bookId, "chapters", chapterId);
        const docSnap = await (0, firestore_1.getDoc)(chapterRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    }
    catch (err) {
        console.error(`Error fetching chapter ${chapterId} of book ${bookId} from Firestore:`, err);
        return null;
    }
}
/**
 * Fetches a specific repertory rubric from `/repertory_rubrics/{rubricId}`.
 */
async function fetchRepertoryRubricFromFirestore(rubricId) {
    try {
        const rubricRef = (0, firestore_1.doc)(firebase_1.db, "repertory_rubrics", rubricId);
        const docSnap = await (0, firestore_1.getDoc)(rubricRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    }
    catch (err) {
        console.error(`Error fetching repertory rubric ${rubricId} from Firestore:`, err);
        return null;
    }
}
