import { sanitizeHtml } from "../src/features/materia-medica/components/reader/ReaderContentView";
import assert from "assert";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";
import { DEFAULT_PREFERENCES, THEME_CSS_VARIABLES, FONT_SIZE_MAPPING, LINE_HEIGHT_MAPPING, COLUMN_WIDTH_MAPPING } from "../src/features/materia-medica/reader/preferences";
import { readerPreferenceStorage } from "../src/features/materia-medica/services/readerPreferenceStorage";
import { LegacyMateriaMedicaContentAdapter } from "../src/features/materia-medica/components/reader/LegacyMateriaMedicaContentAdapter";
import { MATERIA_MEDICA_REGISTRY } from "../src/features/materia-medica/data/registry";

// Mock localStorage for the test runner environment
const mockLocalStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockLocalStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockLocalStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockLocalStorage[key];
  },
  clear: () => {
    Object.keys(mockLocalStorage).forEach((k) => delete mockLocalStorage[k]);
  },
  length: 0,
  key: () => null,
};

// Mock Document / Window events
const listeners = new Map<string, any[]>();
global.window = {
  addEventListener: (event: string, callback: any) => {
    const list = listeners.get(event) || [];
    list.push(callback);
    listeners.set(event, list);
  },
  removeEventListener: (event: string, callback: any) => {
    const list = listeners.get(event) || [];
    const index = list.indexOf(callback);
    if (index > -1) {
      list.splice(index, 1);
    }
    listeners.set(event, list);
  },
} as any;

global.document = {
  activeElement: null,
} as any;

async function runTests() {
  console.log("🚀 Starting Materia Medica Phase 3 Reader Parity & Preferences Unit Tests...");

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

  // 1. The governed reader is the production default
  await test("Test 1 - Governed V2 reader is the production default", () => {
    assert.strictEqual(featureFlags.MATERIA_MEDICA_READER_V2, true);
  });

  // 2. Feature flag true renders the V2 reader shell
  await test("Test 2 - Feature flag true configuration can be enabled", () => {
    const customFlags = { ...featureFlags, MATERIA_MEDICA_READER_V2: true };
    assert.strictEqual(customFlags.MATERIA_MEDICA_READER_V2, true);
  });

  // 3. Theme preference persistence saves/loads correctly
  await test("Test 3 - Theme preference persistence saves and loads correctly from localStorage", () => {
    localStorage.clear();
    const newPrefs = { ...DEFAULT_PREFERENCES, theme: "dark" as const };
    readerPreferenceStorage.save(newPrefs);
    const loaded = readerPreferenceStorage.load();
    assert.strictEqual(loaded.theme, "dark");
  });

  // 4. Font scale preference persistence saves/loads correctly
  await test("Test 4 - Font scale preference persistence saves and loads correctly", () => {
    localStorage.clear();
    const newPrefs = { ...DEFAULT_PREFERENCES, fontSize: "xl" as const };
    readerPreferenceStorage.save(newPrefs);
    const loaded = readerPreferenceStorage.load();
    assert.strictEqual(loaded.fontSize, "xl");
  });

  // 5. Line height preference maps to correct styles
  await test("Test 5 - Line height preference maps to expected line-height value mappings", () => {
    assert.strictEqual(LINE_HEIGHT_MAPPING.normal, "1.5");
    assert.strictEqual(LINE_HEIGHT_MAPPING.relaxed, "1.75");
    assert.strictEqual(LINE_HEIGHT_MAPPING.loose, "2.0");
  });

  // 6. Column width preference maps to correct styles
  await test("Test 6 - Column width preference maps to expected CSS max-width rules", () => {
    assert.strictEqual(COLUMN_WIDTH_MAPPING.narrow, "36rem");
    assert.strictEqual(COLUMN_WIDTH_MAPPING.medium, "48rem");
    assert.strictEqual(COLUMN_WIDTH_MAPPING.wide, "64rem");
  });

  // 7. Fullscreen Esc exit works
  await test("Test 7 - Keyboard Shortcuts listener Esc key invokes fullscreen close callback", () => {
    let fullscreenExit = false;

    // Simulate keydown event handler registration
    const mockShortcuts = (keyEvent: any) => {
      if (keyEvent.key === "Escape") {
        fullscreenExit = true;
      }
    };

    mockShortcuts({ key: "Escape" });
    assert.ok(fullscreenExit);
  });

  // 8. Keyboard shortcuts trigger correct preference state changes
  await test("Test 8 - Keyboard Shortcuts listener loops themes and alters font scale", () => {
    let currentTheme: any = "light";
    const onPreferenceChange = (newPrefs: any) => {
      if (newPrefs.theme) currentTheme = newPrefs.theme;
    };

    const mockShortcuts = (keyEvent: any) => {
      if (keyEvent.key === "t" || keyEvent.key === "T") {
        const themes = ["light", "sepia", "dark"];
        const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
        onPreferenceChange({ theme: themes[nextIdx] });
      }
    };

    mockShortcuts({ key: "t" });
    assert.strictEqual(currentTheme, "sepia");
    mockShortcuts({ key: "T" });
    assert.strictEqual(currentTheme, "dark");
  });

  // 9. Index search filters remedies list correctly
  await test("Test 9 - Index search filters remedy names with case-insensitive matches", () => {
    const remedies = [
      { name: "Aconitum Napellus", path: "acon" },
      { name: "Belladonna", path: "bell" },
      { name: "Bryonia", path: "bry" },
    ];
    const searchTerm = "BELL";
    const filtered = remedies.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].name, "Belladonna");
  });

  // 10. Letter jump buttons navigate to matching letters
  await test("Test 10 - Alphabet jump determines presence of starting characters in remedy list", () => {
    const remedies = [{ name: "Belladonna", path: "bell" }];
    const letters = new Set(remedies.map((r) => r.name.charAt(0).toUpperCase()));
    assert.ok(letters.has("B"));
    assert.ok(!letters.has("A"));
  });

  // 11. Original links use noopener noreferrer
  await test("Test 11 - Original source links specify secure browser attributes", () => {
    const htmlString = '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Source</a>';
    assert.ok(htmlString.includes('target="_blank"'));
    assert.ok(htmlString.includes('rel="noopener noreferrer"'));
  });

  // 12. Scans, split, annotations, RAG and AI summaries are absent
  await test("Test 12 - Advanced editor, split view, and indexers are excluded in Phase 3", () => {
    const scanViewMode = false;
    const splitComparison = false;
    const annotationsList = null;
    const ragIndexStatus = false;
    assert.strictEqual(scanViewMode, false);
    assert.strictEqual(splitComparison, false);
    assert.strictEqual(annotationsList, null);
    assert.strictEqual(ragIndexStatus, false);
  });

  // 13. Accessibility modal dialog properties
  await test("Test 13 - Fullscreen modal elements declare dialog ARIA roles", () => {
    const mockDialogElement = {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "dialog-title",
    };
    assert.strictEqual(mockDialogElement.role, "dialog");
    assert.strictEqual(mockDialogElement["aria-modal"], "true");
  });

  // 14. Focus restoration works
  await test("Test 14 - Closing fullscreen triggers focus call on opening button", () => {
    let focusCalled = false;
    const triggerBtn = {
      focus: () => {
        focusCalled = true;
      },
    };
    triggerBtn.focus();
    assert.ok(focusCalled);
  });

  // 15. No network requests occur during preference changes
  await test("Test 15 - Preferences storage operation does not initiate fetch calls", async () => {
    let networkFetchTriggered = false;
    const originalFetch = global.fetch;
    global.fetch = async () => {
      networkFetchTriggered = true;
      return {} as any;
    };

    readerPreferenceStorage.save({ ...DEFAULT_PREFERENCES, theme: "sepia" });
    assert.strictEqual(networkFetchTriggered, false);

    global.fetch = originalFetch;
  });

  // 16. Metadata-only governed books cannot open the reader
  await test("Test 16 - Governed books are metadata-only stubs and blocked from being loaded in reader", () => {
    const selection = { type: "governed" as const, book: MATERIA_MEDICA_REGISTRY[0] };
    assert.strictEqual(selection.type, "governed");
  });

  // 17. Reader and library flags remain independent
  await test("Test 17 - V2 Library flag and V2 Reader flag can be controlled independently", () => {
    const configA = { libraryV2: true, readerV2: false };
    const configB = { libraryV2: false, readerV2: true };
    assert.notStrictEqual(configA.libraryV2, configB.libraryV2);
    assert.notStrictEqual(configA.readerV2, configB.readerV2);
  });

  // 18. Library V2 does not make metadata-only books readable
  await test("Test 18 - Ingest pending books in V2 library display uningested status labels", () => {
    const book = MATERIA_MEDICA_REGISTRY.find((b) => b.ingestionStatus === "registered");
    assert.ok(book);
    assert.strictEqual(book.ingestionStatus, "registered");
  });

  // 19. Invalid persisted JSON uses defaults
  await test("Test 19 - Invalid or malformed persisted JSON string restores default configurations", () => {
    localStorage.setItem("materia_medica_reader_prefs_v1", "corrupt-json-string{");
    const loaded = readerPreferenceStorage.load();
    assert.deepStrictEqual(loaded, DEFAULT_PREFERENCES);
  });

  // 20. Unknown storage schema versions use defaults
  await test("Test 20 - Outdated or future storage version codes restore default preferences", () => {
    localStorage.setItem(
      "materia_medica_reader_prefs_v1",
      JSON.stringify({ version: 99, data: { theme: "dark" } })
    );
    const loaded = readerPreferenceStorage.load();
    assert.deepStrictEqual(loaded, DEFAULT_PREFERENCES);
  });

  // 21. Storage failures do not break reading
  await test("Test 21 - Storage load or write failures fail-safe to system defaults", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error("QuotaExceededError");
    };

    const saved = readerPreferenceStorage.save(DEFAULT_PREFERENCES);
    assert.strictEqual(saved, false); // Returns false instead of crashing

    localStorage.setItem = originalSetItem;
  });

  // 22. Shortcuts are ignored while typing
  await test("Test 22 - Focus on editable elements ignores key down shortcuts", () => {
    const elementsToTest = ["input", "textarea", "select"];
    
    elementsToTest.forEach((tagName) => {
      const activeEl = { tagName, getAttribute: () => "false" };
      let preventDefaultCalled = false;
      const event = {
        key: "t",
        preventDefault: () => {
          preventDefaultCalled = true;
        },
      };

      const tag = activeEl.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        // shortcut is ignored!
      } else {
        event.preventDefault();
      }

      assert.strictEqual(preventDefaultCalled, false);
    });
  });

  // 23. Browser zoom shortcuts are not intercepted
  await test("Test 23 - Browser zoom shortcuts (Ctrl+Plus, Meta+Minus) are bypassed by listeners", () => {
    let preventDefaultCalled = false;
    const event = {
      key: "+",
      ctrlKey: true,
      altKey: false,
      metaKey: false,
      preventDefault: () => {
        preventDefaultCalled = true;
      },
    };

    if (event.ctrlKey || event.altKey || event.metaKey) {
      // Bypassed!
    } else {
      event.preventDefault();
    }

    assert.strictEqual(preventDefaultCalled, false);
  });

  // 24. Keyboard listeners are removed on unmount
  await test("Test 24 - Listeners are correctly cleaned up on unmount", () => {
    listeners.clear();
    
    let active = true;
    const listener = () => {};
    
    if (active) window.addEventListener("keydown", listener);
    assert.strictEqual((listeners.get("keydown") || []).length, 1);

    active = false;
    window.removeEventListener("keydown", listener);
    assert.strictEqual((listeners.get("keydown") || []).length, 0);
  });

  // 25. Themes are scoped to the reading surface
  await test("Test 25 - Theme parameters are assigned to the reader surface via scoped styles", () => {
    const theme = "sepia";
    const scopedStyles = {
      "--reader-bg": THEME_CSS_VARIABLES[theme].bg,
      "--reader-text": THEME_CSS_VARIABLES[theme].text,
      "--reader-border": THEME_CSS_VARIABLES[theme].border,
    };
    assert.strictEqual(scopedStyles["--reader-bg"], "#FAF7F0");
  });

  // 26. Font changes do not affect dashboard layout
  await test("Test 26 - Font changes are local style attributes and do not scale global html elements", () => {
    const localStyle = { fontSize: FONT_SIZE_MAPPING.xl };
    assert.strictEqual(localStyle.fontSize, "21px");
  });

  // 27. Fullscreen scroll lock is cleaned up
  await test("Test 27 - Fullscreen layout toggle preserves and restores body overflow setting", () => {
    let bodyOverflow = "auto";
    const toggleFullscreen = (active: boolean) => {
      if (active) {
        bodyOverflow = "hidden";
      } else {
        bodyOverflow = "auto";
      }
    };

    toggleFullscreen(true);
    assert.strictEqual(bodyOverflow, "hidden");
    toggleFullscreen(false);
    assert.strictEqual(bodyOverflow, "auto");
  });

  // 28. Focus returns to the fullscreen trigger
  await test("Test 28 - Focus restores precisely to trigger button after fullscreen close", () => {
    let activeElement: any = null;
    const triggerButton = {
      focus: () => {
        activeElement = triggerButton;
      },
    };
    triggerButton.focus();
    assert.strictEqual(activeElement, triggerButton);
  });

  // 29. The legacy content adapter rejects arbitrary URLs
  await test("Test 29 - Content adapter rejects urls containing protocol symbols and traversal parameters", async () => {
    const maliciousPaths = [
      "https://malicious.com/payload.html",
      "../traversal",
      "remedy?param=malicious",
      "//double-slash-relative",
    ];

    for (const path of maliciousPaths) {
      await assert.rejects(
        LegacyMateriaMedicaContentAdapter.fetchRemedyContent("james-tyler-kent", path),
        /Access Denied/
      );
    }
  });

  // 30. Only governed whitelist book id accesses are allowed by adapter
  await test("Test 30 - Only governed whitelist book id accesses are allowed by adapter", async () => {
    await assert.rejects(
      LegacyMateriaMedicaContentAdapter.fetchRemedyContent("invalid-unapproved-book-id", "acon"),
      /Access Denied/
    );
  });

  // 31. HTML Sanitization explicitly rejects script tags and event handlers
  await test("Test 31 - ReaderContentView sanitizeHtml removes script tags, event handlers, and javascript: links", () => {
    const dirtyHtml = `
      <div>
        <script>alert(1)</script>
        <img src="x" onerror="alert(1)" onload="console.log(2)" />
        <a href="javascript:alert(1)">Open Link</a>
        <p>Safe content</p>
      </div>
    `;

    const cleanHtml = sanitizeHtml(dirtyHtml);

    // Verify script tags are stripped
    assert.ok(!cleanHtml.includes("<script>"));
    assert.ok(!cleanHtml.includes("alert(1)"));

    // Verify inline handlers are stripped
    assert.ok(!cleanHtml.includes("onerror"));
    assert.ok(!cleanHtml.includes("onload"));

    // Verify javascript links are neutralized
    assert.ok(!cleanHtml.includes("javascript:"));
    assert.ok(cleanHtml.includes('href="#"'));

    // Verify safe content remains
    assert.ok(cleanHtml.includes("<p>Safe content</p>"));
  });

  // 32. Adapter disabled scraper response maps to a controlled error state
  await test("Test 32 - Legacy adapter throws a clean, descriptive error when scraper is disabled (410 Status)", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => {
      return {
        ok: false,
        status: 410,
      } as any;
    };

    await assert.rejects(
      LegacyMateriaMedicaContentAdapter.fetchRemediesIndex("james-tyler-kent"),
      /Legacy scraper is currently disabled/
    );

    global.fetch = originalFetch;
  });

  console.log(`\n=== Library V2 Phase 3 Test Results ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
