import { initializeTestEnvironment, RulesTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import fs from "fs";
import path from "path";

async function runTests() {
  console.log("🚀 Starting Materia Medica Phase 6 Workspace Persistence & rules-unit-testing Emulator Tests...");
  let passed = 0;
  let failed = 0;

  const test = async (name: string, fn: () => void | Promise<void>) => {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err);
      failed++;
    }
  };

  // Mock global window/localStorage for node test runner
  if (typeof global.window === "undefined") {
    (global as any).window = {};
  }
  const localStoreMock: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => localStoreMock[key] || null,
    setItem: (key: string, val: string) => { localStoreMock[key] = val; },
    removeItem: (key: string) => { delete localStoreMock[key]; },
    clear: () => { for (const key in localStoreMock) delete localStoreMock[key]; }
  };

  // Setup Firestore Rules Unit Testing
  const rulesContent = fs.readFileSync(path.join(__dirname, "../firestore.rules"), "utf8");
  let testEnv: RulesTestEnvironment;

  try {
    testEnv = await initializeTestEnvironment({
      projectId: "materia-medica-persistence-test-" + Date.now(),
      firestore: {
        rules: rulesContent,
        host: "127.0.0.1",
        port: 8080
      }
    });
  } catch (e: any) {
    console.error("Failed to initialize RulesTestEnvironment. Is the Firestore emulator running on port 8080?", e);
    process.exit(1);
  }

  // Clear emulator data before starting
  await testEnv.clearFirestore();

  // Test cases:
  // 1. Unauthenticated users cannot write to practitioner annotations
  await test("Test 1 - Unauthenticated users cannot read/write practitioner subcollections", async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    const docRef = unauthDb.doc("practitioners/practitioner-A/materiaMedicaAnnotations/ann-1");
    await assertFails(docRef.get());
    await assertFails(docRef.set({ id: "ann-1", practitionerId: "practitioner-A" }));
  });

  // 2. Practitioner A cannot read Practitioner B's annotations
  await test("Test 2 - Practitioner A cannot read or write Practitioner B's annotations", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    const docRefB = dbA.doc("practitioners/practitioner-B/materiaMedicaAnnotations/ann-1");
    await assertFails(docRefB.get());
    await assertFails(docRefB.set({ id: "ann-1", practitionerId: "practitioner-B" }));
  });

  // 3. Practitioner A can read/write their own annotations with valid schema
  await test("Test 3 - Practitioner A can write their own annotation with a valid schema", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    const docRef = dbA.doc("practitioners/practitioner-A/materiaMedicaAnnotations/ann-1");
    const validAnn = {
      id: "ann-1",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      blockId: "block_1",
      annotationType: "personal",
      noteText: "Valid note text",
      anchor: {
        startOffset: 0,
        endOffset: 10,
        textChecksum: "abcdef"
      },
      anchorState: "valid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revision: 1
    };
    await assertSucceeds(docRef.set(validAnn));
    await assertSucceeds(docRef.get());
  });

  // 4. Note text length exceeding 2000 characters is rejected
  await test("Test 4 - Note text exceeding 2000 characters is rejected", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    const docRef = dbA.doc("practitioners/practitioner-A/materiaMedicaAnnotations/ann-2");
    const longNote = "a".repeat(2001);
    const invalidAnn = {
      id: "ann-2",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      blockId: "block_1",
      annotationType: "personal",
      noteText: longNote,
      anchor: {
        startOffset: 0,
        endOffset: 10,
        textChecksum: "abcdef"
      },
      anchorState: "valid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revision: 1
    };
    await assertFails(docRef.set(invalidAnn));
  });

  // 5. Invalid annotation category is rejected
  await test("Test 5 - Invalid annotation category is rejected", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    const docRef = dbA.doc("practitioners/practitioner-A/materiaMedicaAnnotations/ann-3");
    const invalidAnn = {
      id: "ann-3",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      blockId: "block_1",
      annotationType: "invalid-category",
      anchor: {
        startOffset: 0,
        endOffset: 10,
        textChecksum: "abcdef"
      },
      anchorState: "valid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revision: 1
    };
    await assertFails(docRef.set(invalidAnn));
  });

  // 6. Invalid offsets (negative or end < start) are rejected
  await test("Test 6 - Invalid offsets (negative or end < start) are rejected", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    
    // Negative offset
    const invalidAnn1 = {
      id: "ann-4",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      blockId: "block_1",
      annotationType: "personal",
      anchor: {
        startOffset: -1,
        endOffset: 10,
        textChecksum: "abcdef"
      },
      anchorState: "valid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revision: 1
    };
    await assertFails(dbA.doc("practitioners/practitioner-A/materiaMedicaAnnotations/ann-4").set(invalidAnn1));

    // endOffset < startOffset
    const invalidAnn2 = {
      id: "ann-5",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      blockId: "block_1",
      annotationType: "personal",
      anchor: {
        startOffset: 10,
        endOffset: 5,
        textChecksum: "abcdef"
      },
      anchorState: "valid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revision: 1
    };
    await assertFails(dbA.doc("practitioners/practitioner-A/materiaMedicaAnnotations/ann-5").set(invalidAnn2));
  });

  // 7. Test Bookmark rules schema validation
  await test("Test 7 - Bookmark schema validation checks", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    const docRef = dbA.doc("practitioners/practitioner-A/materiaMedicaBookmarks/book-1");
    
    const validBookmark = {
      id: "book-1",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      createdAt: new Date().toISOString()
    };
    await assertSucceeds(docRef.set(validBookmark));

    const invalidBookmark = {
      id: "book-1",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      extraField: "not-allowed",
      createdAt: new Date().toISOString()
    };
    await assertFails(docRef.set(invalidBookmark));
  });

  // 8. Test Reader Position rules schema validation
  await test("Test 8 - Reader Position schema validation checks", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    const docRef = dbA.doc("practitioners/practitioner-A/materiaMedicaReaderPositions/pos-1");
    
    const validPosition = {
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      relativeOffset: 0.55,
      updatedAt: new Date().toISOString()
    };
    await assertSucceeds(docRef.set(validPosition));

    const invalidPosition = {
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      relativeOffset: "not-a-number",
      updatedAt: new Date().toISOString()
    };
    await assertFails(docRef.set(invalidPosition));
  });

  await test("Test 9 - Annotation source anchors are immutable and revisions increment exactly once", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    const docRef = dbA.doc("practitioners/practitioner-A/materiaMedicaAnnotations/ann-revision");
    const createdAt = new Date().toISOString();
    const annotation = {
      id: "ann-revision",
      practitionerId: "practitioner-A",
      bookId: "james-tyler-kent",
      sourceVersionId: "james-tyler-kent_v1",
      passageId: "james-tyler-kent_aconitum-napellus_passage",
      blockId: "block_1",
      annotationType: "personal",
      noteText: "Original",
      anchor: { startOffset: 0, endOffset: 8, textChecksum: "abcdef" },
      anchorState: "valid",
      createdAt,
      updatedAt: createdAt,
      revision: 1
    };
    await assertSucceeds(docRef.set(annotation));
    await assertSucceeds(docRef.update({ noteText: "Updated", revision: 2, updatedAt: new Date().toISOString() }));
    await assertFails(docRef.update({ noteText: "Stale", revision: 2, updatedAt: new Date().toISOString() }));
    await assertFails(docRef.update({ blockId: "block_2", revision: 3, updatedAt: new Date().toISOString() }));
    await assertFails(docRef.update({ anchor: { startOffset: 1, endOffset: 8, textChecksum: "abcdef" }, revision: 3, updatedAt: new Date().toISOString() }));
  });

  await test("Test 10 - Cross-practitioner bookmark and reader-position access is denied", async () => {
    const dbA = testEnv.authenticatedContext("practitioner-A").firestore();
    await assertFails(dbA.doc("practitioners/practitioner-B/materiaMedicaBookmarks/book-1").get());
    await assertFails(dbA.doc("practitioners/practitioner-B/materiaMedicaReaderPositions/book-1").get());
  });

  // Cleanup unit tests context
  await testEnv.cleanup();

  if (failed > 0) {
    console.error(`❌ Complete: ${passed} passed, ${failed} failed`);
    process.exit(1);
  } else {
    console.log(`\n🎉 All ${passed} Firestore Emulator security rules tests passed successfully!`);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
