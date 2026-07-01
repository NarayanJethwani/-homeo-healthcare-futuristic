import { REMEDIES_METADATA } from '../../../lib/repertoryData';
import { repertoryRepository } from '../database/repertoryDb';
import { RepertoryRubric, ValidationReport, DuplicateMatch, ProhibitedClaimMatch } from '../types';

export class DatabaseValidator {
  
  /**
   * Helper to calculate Levenshtein distance between two strings.
   */
  private static calculateLevenshtein(a: string, b: string): number {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,    // deletion
            matrix[i][j - 1] + 1,    // insertion
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
  private static getSimilarity(a: string, b: string): number {
    const distance = this.calculateLevenshtein(a.toLowerCase(), b.toLowerCase());
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1.0;
    return 1.0 - distance / maxLen;
  }

  /**
   * Runs an audit on all rubrics and relationships and returns a validation report.
   */
  static async validateDatabase(): Promise<ValidationReport> {
    const report: ValidationReport = {
      isValid: true,
      duplicates: [],
      missingSynonyms: [],
      missingRemedyGrades: [],
      orphanRubrics: [],
      invalidRemedyIds: [],
      missingSourceOrReviewer: [],
      weakClinicalWording: [],
      prohibitedClaims: []
    };

    const rubrics = await repertoryRepository.getRubrics();
    const triples = await repertoryRepository.getTriples();

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
      const fieldsToCheck: Array<{ name: string; val: string }> = [
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
        if (!REMEDIES_METADATA[rem.remedyId]) {
          report.invalidRemedyIds.push({
            rubricId: rub1.rubricId,
            remedyId: rem.remedyId
          });
        }
      });

      // 7. Check if rubric is an orphan in the relationship graph
      const isOrphan = !triples.some(t => t.subjectId === rub1.rubricId || t.objectId === rub1.rubricId);
      if (isOrphan) {
        report.orphanRubrics.push(rub1.rubricId);
      }
    }

    // Set isValid boolean
    if (
      report.duplicates.length > 0 ||
      report.invalidRemedyIds.length > 0 ||
      report.prohibitedClaims.length > 0 ||
      report.missingRemedyGrades.length > 0
    ) {
      report.isValid = false;
    }

    return report;
  }
}
