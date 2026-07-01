import { SEARCH_SYNONYMS } from '../../../lib/repertoryData';
import { repertoryRepository } from '../database/repertoryDb';
import { RepertoryRubric, AIIntakeMappingResult, AIIntakeMatch } from '../types';

export class RepertorySearch {
  
  /**
   * Performs a synonym-expanded multi-field text search on rubrics.
   */
  static async searchRubrics(
    queryText: string,
    filters?: {
      category?: string;
      organSystem?: string;
      miasm?: string;
      remedy?: string;
    }
  ): Promise<Array<{ rubric: RepertoryRubric; score: number }>> {
    const rubrics = await repertoryRepository.getRubrics(filters);
    const normalizedQuery = queryText.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return rubrics.map(r => ({ rubric: r, score: 0 }));
    }

    // Tokenize query
    const queryTokens = normalizedQuery
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(t => t.length > 2);

    // Expand query tokens with synonyms
    const expandedTerms = new Set<string>();
    queryTokens.forEach(token => {
      expandedTerms.add(token);
      
      // Load fallback synonyms from existing library
      const syns = SEARCH_SYNONYMS[token] || [];
      syns.forEach(s => expandedTerms.add(s.toLowerCase()));
    });

    const scoredList = rubrics.map(rubric => {
      let score = 0;
      const titleLower = rubric.title.toLowerCase();
      const classicalLower = rubric.classicalWording.toLowerCase();
      const meaningLower = rubric.plainLanguageMeaning.toLowerCase();
      const keysLower = rubric.clinicalKeywords.map(k => k.toLowerCase());
      const synsLower = rubric.synonyms.map(s => s.toLowerCase());
      const expressionsLower = rubric.patientExpressions.map(e => e.toLowerCase());

      // 1. Direct match on title
      if (titleLower === normalizedQuery) {
        score += 200;
      } else if (titleLower.includes(normalizedQuery)) {
        score += 120;
      }

      // 2. Token-by-token checks
      expandedTerms.forEach(term => {
        // Title contains term
        if (titleLower.includes(term)) score += 30;
        
        // Classical wording contains term
        if (classicalLower.includes(term)) score += 25;
        
        // Plain language meaning contains term
        if (meaningLower.includes(term)) score += 20;

        // Keywords contain term
        if (keysLower.some(k => k.includes(term))) score += 15;

        // Synonyms contain term
        if (synsLower.some(s => s.includes(term))) score += 15;

        // Patient expressions contain term
        if (expressionsLower.some(e => e.includes(term))) score += 25;

        // Remedy match (e.g. searching "nux" matches Nux-v)
        const remMatch = rubric.relatedRemedies.some(
          r => r.remedyId.toLowerCase() === term || r.remedyName.toLowerCase().includes(term)
        );
        if (remMatch) score += 40;
      });

      return { rubric, score };
    });

    // Filter out 0 scores and sort descending
    return scoredList
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Maps natural language intake blocks to rubrics and infers intensity and coverage.
   */
  static async parseAIIntakeText(intakeText: string): Promise<AIIntakeMappingResult> {
    const result: AIIntakeMappingResult = {
      nlpPhrase: intakeText,
      matchedRubrics: [],
      suggestedRemedies: [],
      missingClarificationQuestions: [],
      repertoryScore: 0
    };

    if (!intakeText.trim()) return result;

    // Split text into phrases/sentences
    const phrases = intakeText
      .split(/[.,;\n]+/)
      .map(p => p.trim())
      .filter(p => p.length > 5);

    const rubricMatchesMap = new Map<string, AIIntakeMatch>();

    for (const phrase of phrases) {
      const searchResults = await this.searchRubrics(phrase);
      if (searchResults.length > 0) {
        // Grab top match
        const topHit = searchResults[0];
        if (topHit.score >= 35) {
          const rubricId = topHit.rubric.rubricId;
          const confidence = Math.min(1.0, topHit.score / 200);

          // Infer severity from text triggers
          let severity = 5;
          const phraseLower = phrase.toLowerCase();
          if (/\b(extreme|severe|intense|terrible|unbearable|very|constantly)\b/.test(phraseLower)) {
            severity = 9;
          } else if (/\b(mild|slight|occasional|sometimes|rarely)\b/.test(phraseLower)) {
            severity = 3;
          }

          // Determine matched field
          let matchedField: AIIntakeMatch['matchedOnField'] = 'synonyms';
          if (topHit.rubric.title.toLowerCase().includes(phrase.toLowerCase())) {
            matchedField = 'title';
          } else if (topHit.rubric.classicalWording.toLowerCase().includes(phrase.toLowerCase())) {
            matchedField = 'classicalWording';
          } else if (topHit.rubric.patientExpressions.some(e => e.toLowerCase().includes(phrase.toLowerCase()))) {
            matchedField = 'patientExpressions';
          }

          const existingMatch = rubricMatchesMap.get(rubricId);
          if (!existingMatch || existingMatch.confidence < confidence) {
            rubricMatchesMap.set(rubricId, {
              rubricId,
              confidence,
              matchedOnField: matchedField,
              suggestedSeverity: severity
            });
          }
        }
      }
    }

    result.matchedRubrics = Array.from(rubricMatchesMap.values());

    // Compute remedy coverages
    const remedyScores: Record<string, { remedyId: string; remedyName: string; rawScore: number; matchCount: number }> = {};
    
    for (const match of result.matchedRubrics) {
      const rub = await repertoryRepository.getRubricById(match.rubricId);
      if (rub) {
        rub.relatedRemedies.forEach(rem => {
          if (!remedyScores[rem.remedyId]) {
            remedyScores[rem.remedyId] = {
              remedyId: rem.remedyId,
              remedyName: rem.remedyName,
              rawScore: 0,
              matchCount: 0
            };
          }
          const item = remedyScores[rem.remedyId];
          item.rawScore += rem.grade * match.confidence * match.suggestedSeverity;
          item.matchCount += 1;
        });
      }
    }

    // Convert scores to sorted candidates with confidence percentage
    const maxScore = Math.max(...Object.values(remedyScores).map(r => r.rawScore), 1);
    result.suggestedRemedies = Object.values(remedyScores)
      .map(r => ({
        remedyId: r.remedyId,
        remedyName: r.remedyName,
        confidence: Math.round((r.rawScore / maxScore) * 100)
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // top 5 suggestions

    // Set a baseline score
    result.repertoryScore = Math.round(result.matchedRubrics.reduce((acc, r) => acc + r.confidence * 10, 0));

    // Clarification logic: find missing crucial constitutional parameters
    const matchedCategories = new Set<string>();
    for (const match of result.matchedRubrics) {
      const rub = await repertoryRepository.getRubricById(match.rubricId);
      if (rub) matchedCategories.add(rub.category);
    }

    if (!matchedCategories.has('Thermal State')) {
      result.missingClarificationQuestions.push("Is the patient generally chilly (aggravated by cold/drafts) or warm-blooded (aggravated by stuffy warm rooms)?");
    }
    if (!matchedCategories.has('Food & Cravings')) {
      result.missingClarificationQuestions.push("Does the patient have specific strong food cravings (e.g., salt, sweets, spicy foods)?");
    }
    if (!matchedCategories.has('Sleep')) {
      result.missingClarificationQuestions.push("Are there notable sleep disturbances or recurring dreams?");
    }
    if (!matchedCategories.has('Etiology / Causation')) {
      result.missingClarificationQuestions.push("Did these symptoms trigger after a specific event (e.g., flu/infection, grief, loss, anger)?");
    }

    return result;
  }
}
