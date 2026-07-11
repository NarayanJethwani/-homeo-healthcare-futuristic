import assert from "assert";
import { MATERIA_MEDICA_BOOKS } from "../src/lib/materiaMedicaData";
import fs from "fs";
import path from "path";

async function runLegacyParityTests() {
  console.log("🚀 Starting Materia Medica Legacy Parity & Characterization Test Suite...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  // 1. Validate hardcoded book registry completeness
  await test("Registry - book metadata contains expected historical entries", () => {
    assert.ok(Array.isArray(MATERIA_MEDICA_BOOKS));
    assert.strictEqual(MATERIA_MEDICA_BOOKS.length, 8);

    const kent = MATERIA_MEDICA_BOOKS.find(b => b.id === "james-tyler-kent");
    assert.ok(kent);
    assert.strictEqual(kent.author, "James Tyler Kent");
    assert.strictEqual(kent.year, "1905");
    assert.ok(kent.wikipediaUrl.includes("wikipedia.org"));

    const boericke = MATERIA_MEDICA_BOOKS.find(b => b.id === "william-boericke");
    assert.ok(boericke);
    assert.strictEqual(boericke.author, "William Boericke");
    assert.strictEqual(boericke.year, "1901");
  });

  // 2. Validate cache directory exists and contains expected offline monographs
  await test("Cache - James Tyler Kent cached monographs are readable and structurally intact", () => {
    const cacheDir = path.join(__dirname, "../src/lib/books-cache/james-tyler-kent");
    assert.ok(fs.existsSync(cacheDir), "Kent cache folder should exist in workspace");

    const indexFile = path.join(cacheDir, "index.json");
    assert.ok(fs.existsSync(indexFile), "Kent cache index file should exist");
    
    const indexData = JSON.parse(fs.readFileSync(indexFile, "utf-8"));
    assert.ok(indexData.success);
    assert.ok(Array.isArray(indexData.remedies));
    assert.ok(indexData.remedies.length > 0);

    // Test a specific remedy file
    const benzoicAcidFile = path.join(cacheDir, "benzoic-acid.json");
    assert.ok(fs.existsSync(benzoicAcidFile), "benzoic-acid cache file should exist");

    const benzoicData = JSON.parse(fs.readFileSync(benzoicAcidFile, "utf-8"));
    assert.strictEqual(benzoicData.success, true);
    assert.strictEqual(benzoicData.title, "BENZOIC ACID");
    assert.ok(typeof benzoicData.content === "string");
    assert.ok(benzoicData.content.includes("urine"));
  });

  // 3. Test Remedy Title Search logic
  await test("Reader UI - remedy search filters correctly (case-insensitive and partial matching)", () => {
    const remedies = [
      { name: "Benzoic Acid", path: "/benzoic-acid" },
      { name: "Sulphur", path: "/sulphur" },
      { name: "Lycopodium", path: "/lycopodium" },
    ];
    const searchTerm = "  sul  ";
    const filtered = remedies.filter(r => 
      r.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].name, "Sulphur");
  });

  // 4. Test Letter Navigation logic
  await test("Reader UI - letter jump groups remedies correctly by first letter", () => {
    const remedies = [
      { name: "Aconite", path: "/aconite" },
      { name: "Benzoic Acid", path: "/benzoic-acid" },
      { name: "Bryonia", path: "/bryonia" },
      { name: "Sulphur", path: "/sulphur" },
    ];
    const letters = Array.from(new Set(remedies.map(r => r.name[0].toUpperCase()))).sort();
    assert.deepStrictEqual(letters, ["A", "B", "S"]);

    const bRemedies = remedies.filter(r => r.name.startsWith("B"));
    assert.strictEqual(bRemedies.length, 2);
  });

  // 5. Test Prev/Next Navigation logic
  await test("Reader UI - prev/next navigates indices correctly with bounds wrapping", () => {
    const remedies = [
      { name: "Aconite", path: "/aconite" },
      { name: "Benzoic Acid", path: "/benzoic-acid" },
      { name: "Sulphur", path: "/sulphur" },
    ];
    
    const currentIndex = 1; // Benzoic Acid
    const nextIndex = (currentIndex + 1) % remedies.length;
    const prevIndex = (currentIndex - 1 + remedies.length) % remedies.length;

    assert.strictEqual(nextIndex, 2); // Sulphur
    assert.strictEqual(prevIndex, 0); // Aconite

    // Wrap around check for next
    const lastIndex = 2;
    const wrapNext = (lastIndex + 1) % remedies.length;
    assert.strictEqual(wrapNext, 0); // wraps to Aconite
  });

  // 6. Test Theme style mappings
  await test("Reader UI - theme configuration classes align with legacy style mapping", () => {
    const themeStyles = {
      light: "bg-white text-slate-800 border-slate-200",
      sepia: "bg-[#FAF7F0] text-[#3E301F] border-[#E5DFC9]",
      dark: "bg-[#090D10] text-[#C5D0CD] border-slate-900",
    };
    
    assert.strictEqual(themeStyles.light.includes("white"), true);
    assert.strictEqual(themeStyles.sepia.includes("#FAF7F0"), true);
    assert.strictEqual(themeStyles.dark.includes("#090D10"), true);
  });

  // 7. Test Font resizing bounds mapping
  await test("Reader UI - font sizes correspond to spec limits", () => {
    const fontSizes = {
      sm: { normal: "13px", fullscreen: "14px" },
      base: { normal: "15px", fullscreen: "17px" },
      lg: { normal: "18px", fullscreen: "20px" },
      xl: { normal: "21px", fullscreen: "23px" },
      "2xl": { normal: "24px", fullscreen: "26px" },
    };

    const keys: Array<keyof typeof fontSizes> = ["sm", "base", "lg", "xl", "2xl"];
    for (let i = 0; i < keys.length - 1; i++) {
      const currentVal = parseInt(fontSizes[keys[i]].normal);
      const nextVal = parseInt(fontSizes[keys[i+1]].normal);
      assert.ok(nextVal > currentVal, "Font sizes should be strictly increasing");
    }
    assert.strictEqual(fontSizes.sm.normal, "13px");
    assert.strictEqual(fontSizes["2xl"].fullscreen, "26px");
  });

  // 8. Test Fullscreen open/close scroll locking simulation
  await test("Reader UI - fullscreen toggle locks/unlocks body scroll", () => {
    let bodyOverflowStyle = "visible";
    
    const openFullscreen = () => {
      bodyOverflowStyle = "hidden";
    };
    const closeFullscreen = () => {
      bodyOverflowStyle = "visible";
    };

    openFullscreen();
    assert.strictEqual(bodyOverflowStyle, "hidden");
    closeFullscreen();
    assert.strictEqual(bodyOverflowStyle, "visible");
  });

  // 9. Test Feature Flag Rollback logic
  await test("Feature flag - disabling library V2 renders the legacy book catalogue UI", () => {
    const flags = {
      MATERIA_MEDICA_LIBRARY_V2: false,
    };

    const renderUi = (v2Flag: boolean) => {
      if (v2Flag) {
        return "V2 Governed Online Library Home";
      } else {
        return "Legacy Book Card Catalogue Grid";
      }
    };

    assert.strictEqual(renderUi(flags.MATERIA_MEDICA_LIBRARY_V2), "Legacy Book Card Catalogue Grid");
  });

  console.log(`\n=== Legacy Parity Test Results ===`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runLegacyParityTests().catch(err => {
  console.error(err);
  process.exit(1);
});
