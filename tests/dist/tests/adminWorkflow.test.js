"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const clinicalDecisionSupport_1 = require("../src/lib/clinicalDecisionSupport");
const ragService_1 = require("../src/lib/ragService");
const aiRouter_1 = require("../src/lib/aiRouter");
const vectorStore_1 = require("../src/features/knowledge/retrieval/vectorStore");
const ollama_1 = require("../src/lib/ollama");
async function runTests() {
    console.log("🚀 Starting Clinical Portal Suite E2E Regression Tests...");
    let passed = 0;
    let failed = 0;
    function test(name, fn) {
        try {
            fn();
            console.log(`✅ TEST PASSED: ${name}`);
            passed++;
        }
        catch (err) {
            console.error(`❌ TEST FAILED: ${name}`);
            console.error(err.stack || err);
            failed++;
        }
    }
    // ==========================================
    // 1. Prescription Safety Engine Tests
    // ==========================================
    test("checkPrescriptionSafety - Silicea with pacemaker implant contraindication", () => {
        const res = (0, clinicalDecisionSupport_1.checkPrescriptionSafety)("Silicea", ["Patient has pacemaker installed in 2024"], []);
        assert_1.default.strictEqual(res.isSafe, false);
        assert_1.default.ok(res.warnings.some(w => w.includes("Foreign Body Expulsion Hazard")));
    });
    test("checkPrescriptionSafety - Silicea safe when no implants exist", () => {
        const res = (0, clinicalDecisionSupport_1.checkPrescriptionSafety)("Silicea", ["Patient has atopic dermatitis and joint stiffness"], []);
        assert_1.default.strictEqual(res.isSafe, true);
        assert_1.default.strictEqual(res.warnings.length, 0);
    });
    test("checkPrescriptionSafety - Antagonistic (inimical) pair Sulphur & Sepia", () => {
        const res = (0, clinicalDecisionSupport_1.checkPrescriptionSafety)("Sepia", [], ["Sulphur 200C"]);
        assert_1.default.strictEqual(res.isSafe, false);
        assert_1.default.ok(res.warnings.some(w => w.includes("Antagonistic Pair")));
    });
    test("checkPrescriptionSafety - Safe combination Lycopodium & Sulphur", () => {
        const res = (0, clinicalDecisionSupport_1.checkPrescriptionSafety)("Lycopodium", [], ["Sulphur 30C"]);
        assert_1.default.strictEqual(res.isSafe, true);
        assert_1.default.strictEqual(res.warnings.length, 0);
    });
    // ==========================================
    // 2. AI Routing Task Classification Tests
    // ==========================================
    test("aiRouterService - Classify coding task query", () => {
        const cat = aiRouter_1.aiRouterService.classifyTask("write a python script to parse intake notes");
        assert_1.default.strictEqual(cat, "coding");
    });
    test("aiRouterService - Classify FAQ query", () => {
        const cat = aiRouter_1.aiRouterService.classifyTask("how long does homeopathic treatment take to show results?");
        assert_1.default.strictEqual(cat, "faq");
    });
    test("aiRouterService - Classify medical reasoning query", () => {
        const cat = aiRouter_1.aiRouterService.classifyTask("explain the pathophysiological mechanism of HPA axis dysregulation");
        assert_1.default.strictEqual(cat, "reasoning");
    });
    // ==========================================
    // 3. RAG Grounding Search Tests
    // ==========================================
    console.log("\n🔍 Running RAG Knowledge Base Hybrid Search tests...");
    // Seed/Stub the vector store with live mock embeddings for search testing compatibility
    const originalGetVector = vectorStore_1.globalVectorStore.getVector;
    vectorStore_1.globalVectorStore.getVector = async (id) => {
        const doc = ragService_1.ragService.getUnifiedDb().find((d) => d.id === id);
        if (!doc)
            return null;
        try {
            const vector = await ollama_1.ollamaService.getEmbeddings(doc.content);
            return {
                id,
                entityType: doc.category,
                title: doc.title,
                vector,
                dimensions: vector.length
            };
        }
        catch {
            return null;
        }
    };
    try {
        const searchResults = await ragService_1.ragService.hybridSearch("Like cures like");
        const topDoc = searchResults[0];
        test("ragService - Hybrid search matches Law of Similars", () => {
            assert_1.default.ok(topDoc.document.title.includes("The Law of Similars"));
            assert_1.default.ok(topDoc.score >= 0.70);
        });
    }
    catch (err) {
        console.error("❌ RAG Search test failed: ", err.message);
        failed++;
    }
    try {
        const searchResults = await ragService_1.ragService.hybridSearch("who founded homeo healthcare");
        const topDoc = searchResults[0];
        test("ragService - Hybrid search matches Dr. Narayan Jethwani", () => {
            assert_1.default.ok(topDoc.document.title.includes("Philosophy"));
            assert_1.default.ok(topDoc.document.content.includes("Narayan Jethwani"));
        });
    }
    catch (err) {
        console.error("❌ RAG Search test failed: ", err.message);
        failed++;
    }
    finally {
        vectorStore_1.globalVectorStore.getVector = originalGetVector;
    }
    // ==========================================
    // 4. Summarize Results
    // ==========================================
    console.log(`\n🎉 Test Run Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
    process.exit(0);
}
runTests().catch(err => {
    console.error("Fatal Test Failure: ", err);
    process.exit(1);
});
