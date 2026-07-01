import { JETHWANI_REMEDY_CONFIRMATIONS } from '../../../lib/repertoryData';
import { repertoryRepository } from '../database/repertoryDb';
import { 
  ClinicalReasoningSummary, RemedyReasoning, 
  ScoringResult, RepertoryRubric 
} from '../types';
import { ConfidenceEngine } from './confidenceEngine';
import { EvidenceBreakdownEngine } from './evidenceBreakdown';
import { ExplanationBuilder } from './explanationBuilder';
import { QuestionGenerator } from './questionGenerator';
import { DifferentialEngine } from './differentialEngine';

export class ReasoningEngine {
  /**
   * Generates a complete, structured clinical reasoning summary.
   */
  static async generateReasoning(
    symptoms: Array<{
      rubricId: string;
      severity: number;
      frequency: 'constant' | 'frequent' | 'occasional';
      impact: 'severe' | 'moderate' | 'mild';
    }>,
    scoringResult: ScoringResult | null
  ): Promise<ClinicalReasoningSummary> {
    const selectedIds = symptoms.map(s => s.rubricId);
    
    // Safe empty fallback
    if (!scoringResult || scoringResult.topRemedies.length === 0 || symptoms.length === 0) {
      return {
        selectedRubrics: selectedIds,
        topRemedies: [],
        missingInformation: [],
        suggestedQuestions: [],
        differentialComparisons: [],
        confidenceBreakdown: {},
        evidenceBreakdown: { remedyScores: {} },
        safetyLabel: "Clinical reasoning support for clinician review only."
      };
    }

    const rubrics: RepertoryRubric[] = [];
    for (const s of symptoms) {
      const rub = await repertoryRepository.getRubricById(s.rubricId);
      if (rub) rubrics.push(rub);
    }

    const topReasonings: RemedyReasoning[] = [];
    const confidenceBreakdown: Record<string, any> = {};
    const topRemediesToProcess = scoringResult.topRemedies.slice(0, 5);

    for (const scored of topRemediesToProcess) {
      const remedyId = scored.remedyId;
      const remedyName = scored.remedyName;
      
      const conf = await ConfidenceEngine.getConfidenceBreakdown(remedyId, symptoms);
      confidenceBreakdown[remedyId] = conf;

      const matched: string[] = [];
      const strongest: string[] = [];
      const weakest: string[] = [];
      const supportingEvidence: Record<string, number> = {};

      for (const sym of symptoms) {
        const rub = rubrics.find(r => r.rubricId === sym.rubricId);
        if (!rub) continue;

        const rel = rub.relatedRemedies.find(r => r.remedyId === remedyId);
        if (rel) {
          matched.push(rub.title);
          supportingEvidence[rub.rubricId] = rel.grade;
          if (rel.grade >= 3) {
            strongest.push(rub.title);
          } else {
            weakest.push(rub.title);
          }
        }
      }

      const confData = JETHWANI_REMEDY_CONFIRMATIONS[remedyId]?.confirmatory || [];
      const missingInfo = confData.filter(c => 
        !rubrics.some(rub => 
          rub.relatedRemedies.some(r => r.remedyId === remedyId) &&
          (rub.title.toLowerCase().includes(c.toLowerCase()) || 
           rub.plainLanguageMeaning.toLowerCase().includes(c.toLowerCase()))
        )
      );

      const differentialRemedies = topRemediesToProcess
        .filter(r => r.remedyId !== remedyId)
        .map(r => r.remedyName);

      const explanation = await ExplanationBuilder.buildExplanation(
        remedyId,
        remedyName,
        conf.overall,
        symptoms
      );

      topReasonings.push({
        remedyId,
        remedyName,
        confidence: conf.overall,
        matchedRubrics: matched,
        strongestRubrics: strongest,
        weakestRubrics: weakest,
        supportingEvidence,
        missingInformation: missingInfo,
        differentialRemedies,
        explanation
      });
    }

    const missingInformation = await QuestionGenerator.getMissingInformation(symptoms);
    const suggestedQuestions = await QuestionGenerator.generateQuestions(symptoms);
    const evidenceBreakdown = await EvidenceBreakdownEngine.getEvidenceBreakdown(symptoms);

    const differentialComparisons: any[] = [];
    const topScored = scoringResult.topRemedies.slice(0, 3);
    for (let i = 0; i < topScored.length; i++) {
      for (let j = i + 1; j < topScored.length; j++) {
        const comp = await DifferentialEngine.compareRemedies(
          topScored[i].remedyId,
          topScored[j].remedyId,
          symptoms,
          confidenceBreakdown[topScored[i].remedyId]?.overall || 0,
          confidenceBreakdown[topScored[j].remedyId]?.overall || 0
        );
        differentialComparisons.push(comp);
      }
    }

    return {
      selectedRubrics: selectedIds,
      topRemedies: topReasonings,
      missingInformation,
      suggestedQuestions,
      differentialComparisons,
      confidenceBreakdown,
      evidenceBreakdown,
      safetyLabel: "Clinical reasoning support for clinician review only."
    };
  }
}
