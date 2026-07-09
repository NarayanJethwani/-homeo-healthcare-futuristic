"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalValidationFramework = void 0;
const repertoryScoring_1 = require("../scoring/repertoryScoring");
const scoringConfig_1 = require("../scoring/scoringConfig");
class ClinicalValidationFramework {
    /**
     * Executes validation cases against the active repertorization engine.
     */
    static async runValidationSuite() {
        const results = [];
        let passedCases = 0;
        for (const caseData of this.BENCHMARK_CASES) {
            const scoringResult = await repertoryScoring_1.RepertoryScoring.calculateRepertorization(caseData.selectedRubrics);
            const actualRanked = scoringResult.topRemedies.map(r => r.remedyId);
            // Look for the expected remedy in the top 3 results
            const top3 = actualRanked.slice(0, 3);
            const matchedExpected = caseData.expectedRemedies.filter(r => top3.includes(r));
            let outcome = 'Mismatched';
            if (matchedExpected.length === caseData.expectedRemedies.length) {
                outcome = 'Matched';
                passedCases++;
            }
            else if (matchedExpected.length > 0) {
                outcome = 'Partially Matched';
                passedCases++;
            }
            results.push({
                ...caseData,
                actualRankedRemedies: actualRanked,
                outcome,
                confidence: scoringResult.confidenceScore
            });
        }
        const totalCases = this.BENCHMARK_CASES.length;
        const accuracy = totalCases > 0 ? Math.round((passedCases / totalCases) * 100) : 0;
        return {
            generatedAt: new Date().toISOString(),
            engineVersion: this.ENGINE_VERSION,
            scoringConfigVersion: this.SCORING_CONFIG_VERSION,
            scoringConfig: scoringConfig_1.CLINICAL_SCORING_CONFIG,
            casesEvaluated: totalCases,
            passedCases,
            failedCases: totalCases - passedCases,
            overallAccuracyPercentage: accuracy,
            results
        };
    }
}
exports.ClinicalValidationFramework = ClinicalValidationFramework;
ClinicalValidationFramework.ENGINE_VERSION = '2.5.0';
ClinicalValidationFramework.SCORING_CONFIG_VERSION = '1.0.0';
ClinicalValidationFramework.BENCHMARK_CASES = [
    {
        id: 'anxious_chilly_panicky',
        caseTitle: 'Anxious, panicky, chilly patient with fear of death',
        symptoms: [
            'Sudden intense panic and fear of death',
            'Sensitive to cold, constitutional chilliness'
        ],
        selectedRubrics: [
            { rubricId: 'jeth_rb_panic_death_terror', severity: 9, frequency: 'frequent', impact: 'severe' },
            { rubricId: 'jeth_rb_chilly_sensitive', severity: 8, frequency: 'constant', impact: 'moderate' }
        ],
        expectedRemedies: ['Ars'],
        clinicianNotes: 'Classic Arsenicum Album picture: cold, extremely anxious, and panicky with fear of death.',
        engineVersion: ClinicalValidationFramework.ENGINE_VERSION,
        scoringConfigVersion: ClinicalValidationFramework.SCORING_CONFIG_VERSION
    },
    {
        id: 'exhausted_irritable_manager',
        caseTitle: 'Workaholic business manager with severe adrenal burnout and stress',
        symptoms: [
            'Adrenal burnout, work exhaustion, cognitive collapse'
        ],
        selectedRubrics: [
            { rubricId: 'jeth_rb_adrenal_burnout', severity: 9, frequency: 'frequent', impact: 'severe' }
        ],
        expectedRemedies: ['Nux-v'],
        clinicianNotes: 'Classic Nux Vomica picture: workaholic manager collapsed from chronic overwork and stress.',
        engineVersion: ClinicalValidationFramework.ENGINE_VERSION,
        scoringConfigVersion: ClinicalValidationFramework.SCORING_CONFIG_VERSION
    },
    {
        id: 'warm_blooded_sweet_craver',
        caseTitle: 'Intellectual patient, warm-blooded, with intense sweet craving',
        symptoms: [
            'Heat intolerance, warm-blooded constitution',
            'Intense food craving for sweets and sugar'
        ],
        selectedRubrics: [
            { rubricId: 'jeth_rb_warm_blooded', severity: 8, frequency: 'constant', impact: 'moderate' },
            { rubricId: 'jeth_rb_craves_sweets', severity: 9, frequency: 'frequent', impact: 'severe' }
        ],
        expectedRemedies: ['Sulph'],
        clinicianNotes: 'Classic Sulphur presentation: runs hot, intense sugar cravings, intellectual generals.',
        engineVersion: ClinicalValidationFramework.ENGINE_VERSION,
        scoringConfigVersion: ClinicalValidationFramework.SCORING_CONFIG_VERSION
    }
];
