"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseValidator = void 0;
const repertoryData_1 = require("../../../lib/repertoryData");
const repertoryDb_1 = require("../database/repertoryDb");
const caseScenarios_1 = require("../data/caseScenarios");
const repertorySearch_1 = require("../search/repertorySearch");
const repertoryScoring_1 = require("../scoring/repertoryScoring");
class DatabaseValidator {
    /**
     * Helper to calculate Levenshtein distance between two strings.
     */
    static calculateLevenshtein(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++)
            matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++)
            matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j] + 1, // deletion
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j - 1] + 1 // substitution
                    );
                }
            }
        }
        return matrix[a.length][b.length];
    }
    /**
     * Helper to get string similarity percentage.
     */
    static getSimilarity(a, b) {
        const distance = this.calculateLevenshtein(a.toLowerCase(), b.toLowerCase());
        const maxLen = Math.max(a.length, b.length);
        if (maxLen === 0)
            return 1.0;
        return 1.0 - distance / maxLen;
    }
    /**
     * Runs an audit on all rubrics and relationships and returns a validation report.
     */
    static async validateDatabase() {
        const report = {
            isValid: true,
            duplicates: [],
            missingSynonyms: [],
            missingRemedyGrades: [],
            orphanRubrics: [],
            invalidRemedyIds: [],
            missingSourceOrReviewer: [],
            weakClinicalWording: [],
            prohibitedClaims: [],
            weakDifferentialNotes: []
        };
        const rubrics = await repertoryDb_1.repertoryRepository.getRubrics();
        const triples = await repertoryDb_1.repertoryRepository.getTriples();
        const PROHIBITED_WORDS = [
            /\bcures?\b/i,
            /\bguarantees?\b/i,
            /\bconfirmed diagnosis\b/i,
            /\bproven to heal\b/i,
            /\bguaranteed remedy\b/i,
            /\bautomatic prescription\b/i,
            /\bprevents disease\b/i
        ];
        for (let i = 0; i < rubrics.length; i++) {
            const rub1 = rubrics[i];
            // 1. Check duplicate rubrics
            for (let j = i + 1; j < rubrics.length; j++) {
                const rub2 = rubrics[j];
                const similarity = this.getSimilarity(rub1.title, rub2.title);
                if (similarity >= 0.8) {
                    report.duplicates.push({
                        rubricId1: rub1.rubricId,
                        rubricId2: rub2.rubricId,
                        title1: rub1.title,
                        title2: rub2.title,
                        distance: Math.round(similarity * 100) / 100
                    });
                }
            }
            // 2. Check missing synonyms / keywords
            if (!rub1.synonyms || rub1.synonyms.length === 0) {
                report.missingSynonyms.push(rub1.rubricId);
            }
            // 3. Check source, author, and reviewer
            if (!rub1.source || !rub1.author || !rub1.reviewer) {
                report.missingSourceOrReviewer.push(rub1.rubricId);
            }
            // 4. Check weak clinical wording (titles under 10 chars)
            if (rub1.title.length < 10) {
                report.weakClinicalWording.push(rub1.rubricId);
            }
            // 5. Check prohibited definitive claims
            const fieldsToCheck = [
                { name: 'title', val: rub1.title },
                { name: 'plainLanguageMeaning', val: rub1.plainLanguageMeaning },
                { name: 'classicalWording', val: rub1.classicalWording },
                { name: 'clinicalNotes', val: rub1.clinicalNotes || '' }
            ];
            fieldsToCheck.forEach(field => {
                PROHIBITED_WORDS.forEach(regex => {
                    const match = field.val.match(regex);
                    if (match) {
                        report.prohibitedClaims.push({
                            rubricId: rub1.rubricId,
                            field: field.name,
                            text: field.val,
                            term: match[0]
                        });
                    }
                });
            });
            // 6. Check remedy grading and validation
            rub1.relatedRemedies.forEach(rem => {
                if (!rem.grade || rem.grade < 1 || rem.grade > 4) {
                    report.missingRemedyGrades.push({
                        rubricId: rub1.rubricId,
                        remedyId: rem.remedyId
                    });
                }
                // Check if remedy abbreviation is valid
                if (!repertoryData_1.REMEDIES_METADATA[rem.remedyId]) {
                    report.invalidRemedyIds.push({
                        rubricId: rub1.rubricId,
                        remedyId: rem.remedyId
                    });
                }
                // Check weak differential notes
                if (!rem.differentialNotes || rem.differentialNotes.trim().length < 10) {
                    report.weakDifferentialNotes.push({
                        rubricId: rub1.rubricId,
                        remedyId: rem.remedyId,
                        notes: rem.differentialNotes
                    });
                }
            });
            // 7. Check if rubric is an orphan in the relationship graph
            const isOrphan = !triples.some(t => t.subjectId === rub1.rubricId || t.objectId === rub1.rubricId);
            if (isOrphan) {
                report.orphanRubrics.push(rub1.rubricId);
            }
        }
        // 8. Validate Clinical Case Scenarios
        const expectedRubricsMissed = [];
        const expectedRemediesNotInTop3 = [];
        let passedCases = 0;
        let failedCases = 0;
        for (const scenario of caseScenarios_1.CLINICAL_CASE_SCENARIOS) {
            // Step A: Parse intake text
            const searchResult = await repertorySearch_1.RepertorySearch.parseAIIntakeText(scenario.intakeText);
            const matchedIds = searchResult.matchedRubrics.map(m => m.rubricId);
            // Check missed rubrics
            let hasMissedRubric = false;
            for (const reqRubricId of scenario.expectedRubrics) {
                if (!matchedIds.includes(reqRubricId)) {
                    expectedRubricsMissed.push({
                        caseId: scenario.caseId,
                        rubricId: reqRubricId
                    });
                    hasMissedRubric = true;
                }
            }
            // Step B: Calculate repertorization scoring
            const symptomsInput = searchResult.matchedRubrics.map(m => ({
                rubricId: m.rubricId,
                severity: m.suggestedSeverity,
                frequency: 'constant',
                impact: 'severe'
            }));
            const scoreResult = await repertoryScoring_1.RepertoryScoring.calculateRepertorization(symptomsInput);
            const top3Remedies = scoreResult.topRemedies.slice(0, 3).map(r => r.remedyId);
            let remedyInTop3 = top3Remedies.includes(scenario.expectedRemedyId);
            if (!remedyInTop3) {
                expectedRemediesNotInTop3.push({
                    caseId: scenario.caseId,
                    expectedRemedyId: scenario.expectedRemedyId,
                    actualTopRemedies: top3Remedies
                });
            }
            // Check if both matched rubrics and top-3 remedy are correct
            if (!hasMissedRubric && remedyInTop3) {
                passedCases++;
            }
            else {
                failedCases++;
            }
        }
        report.caseValidationSummary = {
            totalCases: caseScenarios_1.CLINICAL_CASE_SCENARIOS.length,
            passedCases,
            failedCases,
            expectedRubricsMissed,
            expectedRemediesNotInTop3
        };
        // Set isValid boolean
        if (report.duplicates.length > 0 ||
            report.invalidRemedyIds.length > 0 ||
            report.prohibitedClaims.length > 0 ||
            report.missingRemedyGrades.length > 0 ||
            report.weakDifferentialNotes.length > 0 ||
            failedCases > 0) {
            report.isValid = false;
        }
        return report;
    }
}
exports.DatabaseValidator = DatabaseValidator;
