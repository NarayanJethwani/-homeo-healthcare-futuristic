import { SEARCH_SYNONYMS } from '../../../lib/repertoryData';
import { repertoryRepository } from '../database/repertoryDb';
import { RepertoryRubric, AIIntakeMappingResult, AIIntakeMatch } from '../types';
import { RepertoryGraph } from '../graph/repertoryGraph';

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
      sourceId?: string;
      author?: string;
      editorialStatus?: string;
      includeDrafts?: boolean;
    },
    boostRelationships: boolean = false,
    enableSemanticExpansion: boolean = false
  ): Promise<Array<{ rubric: RepertoryRubric; score: number }>> {
    let rubrics = await repertoryRepository.getRubrics(filters);

    // Apply additional corpus-aware filters
    if (filters) {
      if (filters.sourceId && filters.sourceId !== 'All') {
        rubrics = rubrics.filter(r => r.sourceId === filters.sourceId || r.source === filters.sourceId);
      }
      if (filters.author && filters.author !== 'All') {
        rubrics = rubrics.filter(r => r.author === filters.author);
      }
      if (filters.editorialStatus) {
        rubrics = rubrics.filter(r => r.editorialStatus === filters.editorialStatus);
      }
      if (!filters.includeDrafts) {
        // Exclude unapproved/draft items by default in production search
        rubrics = rubrics.filter(r => r.editorialStatus === undefined || r.editorialStatus === "approved" || r.editorialStatus === "published");
      }
    } else {
      // By default exclude drafts
      rubrics = rubrics.filter(r => r.editorialStatus === undefined || r.editorialStatus === "approved" || r.editorialStatus === "published");
    }

    const normalizedQuery = queryText.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return rubrics.map(r => ({ rubric: r, score: 0 }));
    }

    const STOP_WORDS = new Set([
      'and', 'the', 'for', 'with', 'from', 'that', 'this', 'have', 'has', 'had', 'been', 'was', 'were', 'about', 'some', 'any', 'but', 'not', 'when', 'where', 'who', 'how', 'why', 'what', 'you', 'your', 'his', 'her', 'their', 'them', 'they', 'our', 'after', 'before', 'since',
      'feel', 'feels', 'felt', 'feeling', 'want', 'wants', 'wanted'
    ]);

    // Tokenize query, splitting hyphenated/punctuation to check individual words
    const queryTokens = normalizedQuery
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t));

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

      // Helper function to check word match with boundaries
      const hasWord = (text: string, term: string) => {
        const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp('\\b' + escaped + '\\b', 'i');
        return regex.test(text);
      };

      const hasWordInArray = (arr: string[], term: string) => {
        return arr.some(item => hasWord(item, term));
      };

      // 2. Token-by-token checks, taking max score among the token and its synonyms
      queryTokens.forEach(token => {
        const tokenTerms = new Set<string>();
        tokenTerms.add(token);
        
        // Expand with synonyms
        const syns = SEARCH_SYNONYMS[token] || [];
        syns.forEach(s => {
          const lowerSyn = s.toLowerCase();
          if (!STOP_WORDS.has(lowerSyn)) {
            tokenTerms.add(lowerSyn);
          }
        });

        let maxTokenScore = 0;

        tokenTerms.forEach(term => {
          let maxTermScore = 0;
          if (hasWord(titleLower, term)) {
            maxTermScore = Math.max(maxTermScore, 30);
          }
          if (hasWord(classicalLower, term)) {
            maxTermScore = Math.max(maxTermScore, 25);
          }
          if (hasWord(meaningLower, term)) {
            maxTermScore = Math.max(maxTermScore, 20);
          }
          if (hasWordInArray(keysLower, term)) {
            maxTermScore = Math.max(maxTermScore, 15);
          }
          if (hasWordInArray(synsLower, term)) {
            maxTermScore = Math.max(maxTermScore, 15);
          }
          if (hasWordInArray(expressionsLower, term)) {
            maxTermScore = Math.max(maxTermScore, 25);
          }

          // Remedy match (e.g. searching "nux" matches Nux-v)
          const remMatch = rubric.relatedRemedies.some(
            r => r.remedyId.toLowerCase() === term || hasWord(r.remedyName.toLowerCase(), term)
          );
          if (remMatch) {
            maxTermScore = Math.max(maxTermScore, 40);
          }

          maxTokenScore = Math.max(maxTokenScore, maxTermScore);
        });

        score += maxTokenScore;
      });

      if (boostRelationships) {
        // Modality / Etiology relationship boost
        if (normalizedQuery.includes('better') || normalizedQuery.includes('worse') || normalizedQuery.includes('ameliorated') || normalizedQuery.includes('aggravated')) {
          if (rubric.category === 'Modalities') {
            score += 40;
          }
        }
        if (normalizedQuery.includes('cause') || normalizedQuery.includes('after') || normalizedQuery.includes('trigger') || normalizedQuery.includes('from')) {
          if (rubric.category === 'Etiology / Causation') {
            score += 40;
          }
        }
        // Constitutional boost
        if (normalizedQuery.includes('chilly') || normalizedQuery.includes('warm') || normalizedQuery.includes('craving') || normalizedQuery.includes('sleep')) {
          if (['Constitutional Generals', 'Thermal State', 'Food & Cravings', 'Sleep'].includes(rubric.category)) {
            score += 30;
          }
        }
      }

      return { rubric, score };
    });

    // Apply semantic query expansion if requested
    if (enableSemanticExpansion && scoredList.some(item => item.score >= 40)) {
      const topMatches = [...scoredList]
        .sort((a, b) => b.score - a.score)
        .filter(item => item.score >= 40)
        .slice(0, 3);

      for (const match of topMatches) {
        const neighbors = await RepertoryGraph.getSemanticNeighbours(match.rubric.rubricId);
        for (const neigh of neighbors) {
          const targetItem = scoredList.find(item => item.rubric.rubricId === neigh.rubricId);
          if (targetItem) {
            const semanticBoost = Math.round(neigh.score * 0.4);
            targetItem.score += semanticBoost;
          }
        }
      }
    }

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
    const rawPhrases = intakeText
      .split(/[.,;\n]+/)
      .map(p => p.trim())
      .filter(p => p.length >= 2);

    const phrases = [...rawPhrases];
    if (phrases.length === 1 && phrases[0].includes(' ')) {
      const words = phrases[0].split(/\s+/).map(w => w.trim()).filter(w => w.length >= 3);
      phrases.push(...words);
    }

    const rubricMatchesMap = new Map<string, AIIntakeMatch>();

    for (const phrase of phrases) {
      const searchResults = await this.searchRubrics(phrase);
      if (searchResults.length > 0) {
        const topScore = searchResults[0].score;
        // Keep top 3 matches per phrase that meet score threshold
        const validHits = searchResults
          .filter(hit => hit.score >= 30 && hit.score >= topScore * 0.6)
          .slice(0, 3);

        for (const hit of validHits) {
          const rubricId = hit.rubric.rubricId;
          const confidence = Math.min(1.0, hit.score / 200);

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
          if (hit.rubric.title.toLowerCase().includes(phrase.toLowerCase())) {
            matchedField = 'title';
          } else if (hit.rubric.classicalWording.toLowerCase().includes(phrase.toLowerCase())) {
            matchedField = 'classicalWording';
          } else if (hit.rubric.patientExpressions.some(e => e.toLowerCase().includes(phrase.toLowerCase()))) {
            matchedField = 'patientExpressions';
          }

          let classification: AIIntakeMatch['classification'] = 'Particular';
          if (hit.rubric.category === 'Mental & Emotional') {
            classification = 'Mental General';
          } else if (['Constitutional Generals', 'Thermal State', 'Food & Cravings', 'Sleep'].includes(hit.rubric.category)) {
            classification = 'Physical General';
          } else if (hit.rubric.category === 'Modalities') {
            classification = 'Modality';
          } else if (hit.rubric.category === 'Etiology / Causation') {
            classification = 'Etiology';
          } else if (hit.rubric.category === 'Pain') {
            classification = 'Sensation';
          } else if (hit.rubric.category === 'Modern Clinical Conditions') {
            classification = 'Pathology';
          } else if (hit.rubric.category === 'Miasmatic Load') {
            classification = 'Miasmatic clue';
          }

          const existingMatch = rubricMatchesMap.get(rubricId);
          if (!existingMatch || existingMatch.confidence < confidence) {
            rubricMatchesMap.set(rubricId, {
              rubricId,
              confidence,
              matchedOnField: matchedField,
              suggestedSeverity: severity,
              classification
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
          item.rawScore += (rem.grade ?? 0) * match.confidence * match.suggestedSeverity;
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
