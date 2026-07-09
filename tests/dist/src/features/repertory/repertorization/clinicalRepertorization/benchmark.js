"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmarkClinicalRepertorization = benchmarkClinicalRepertorization;
const rankingEngine_1 = require("./rankingEngine");
const session_1 = require("./session");
const BENCHMARK_REMEDIES = ["Acon", "Ars", "Nux-v", "Lyc", "Sulph", "Calc", "Puls", "Nat-m", "Phos", "Sep"];
function memoryUsageBytes() {
    const maybeProcess = globalThis;
    return maybeProcess.process?.memoryUsage?.().heapUsed || 0;
}
function syntheticRubric(index) {
    const remedies = BENCHMARK_REMEDIES.slice(0, 5 + (index % 5)).map((remedyId, remedyIndex) => ({
        remedyId,
        sourceRemedyId: remedyId,
        grade: ((remedyIndex + index) % 4 + 1),
    }));
    return {
        id: `benchmark-rubric-${index}`,
        title: `Benchmark rubric ${index}`,
        source: "jethwani",
        category: "unknown",
        clinicalSystem: "unknown",
        status: "active",
        searchWeight: 1 + (index % 3) * 0.25,
        synonyms: [],
        keywords: [`benchmark-${index}`],
        modalities: [],
        miasms: [],
        remedies,
        originalRecord: { benchmark: true, index },
        warnings: [],
    };
}
function isRankingStable(firstTopRemedyId, secondTopRemedyId) {
    return firstTopRemedyId === secondTopRemedyId;
}
function benchmarkClinicalRepertorization(strategyId = "weighted_grades", rubricCounts = [10, 50, 100, 500, 1000]) {
    const cases = rubricCounts.map((rubricCount) => {
        const rubrics = Array.from({ length: rubricCount }, (_, index) => syntheticRubric(index));
        const session = (0, session_1.createClinicalRepertorizationSession)({
            id: `benchmark-session-${rubricCount}`,
            rubrics,
            strategyId,
        });
        const memoryBefore = memoryUsageBytes();
        const startedAt = Date.now();
        const first = (0, rankingEngine_1.repertorizeClinicalSession)(session);
        const executionMs = Date.now() - startedAt;
        const memoryAfter = memoryUsageBytes();
        const second = (0, rankingEngine_1.repertorizeClinicalSession)(session);
        const topRemedyId = first.rankings[0]?.remedyId;
        return {
            rubricCount,
            executionMs,
            memoryDeltaBytes: memoryAfter && memoryBefore ? memoryAfter - memoryBefore : 0,
            rankingStable: isRankingStable(topRemedyId, second.rankings[0]?.remedyId),
            topRemedyId,
        };
    });
    return {
        strategyId,
        cases,
        generatedAt: new Date().toISOString(),
    };
}
