import { 
  VisitTimelineEntry, SymptomEvolution, 
  RubricEvolution, RemedyResponse, 
  ConfidenceTrend, LongitudinalCaseSummary 
} from './longitudinalTypes';

export class LongitudinalCaseModel {
  
  /**
   * Summarizes a patient's historical visit entries into a structured timeline analysis.
   */
  public static buildLongitudinalSummary(
    patientId: string,
    timeline: VisitTimelineEntry[],
    rubricTitles: Record<string, string>
  ): LongitudinalCaseSummary {
    // Sort timeline chronologically
    const sortedTimeline = [...timeline].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const symptomTrends = this.calculateSymptomEvolution(sortedTimeline, rubricTitles);
    const rubricsHistory = this.calculateRubricsHistory(sortedTimeline);
    const remedyOutcomes = this.calculateRemedyOutcomes(sortedTimeline);
    const confidenceHistory = this.calculateConfidenceHistory(sortedTimeline);

    return {
      patientId,
      timeline: sortedTimeline,
      symptomTrends,
      rubricsHistory,
      remedyOutcomes,
      confidenceHistory
    };
  }

  private static calculateSymptomEvolution(
    timeline: VisitTimelineEntry[],
    rubricTitles: Record<string, string>
  ): SymptomEvolution[] {
    const trendsMap = new Map<string, Array<{ date: string; intensity: number }>>();

    timeline.forEach(visit => {
      visit.activeSymptoms.forEach(sym => {
        if (!trendsMap.has(sym.rubricId)) {
          trendsMap.set(sym.rubricId, []);
        }
        trendsMap.get(sym.rubricId)!.push({
          date: visit.date,
          intensity: sym.observedIntensity
        });
      });
    });

    return Array.from(trendsMap.entries()).map(([rubricId, history]) => {
      // Determine status based on historical change
      let status: SymptomEvolution['status'] = 'active';
      if (history.length >= 2) {
        const initial = history[0].intensity;
        const current = history[history.length - 1].intensity;
        if (current === 0) status = 'resolved';
        else if (current < initial) status = 'improving';
        else if (current > initial) status = 'aggravated';
      }

      return {
        rubricId,
        rubricTitle: rubricTitles[rubricId] || rubricId,
        intensityHistory: history,
        status
      };
    });
  }

  private static calculateRubricsHistory(timeline: VisitTimelineEntry[]): RubricEvolution[] {
    const rubricsMap = new Map<string, {
      firstObserved: string;
      lastObserved: string;
      isActive: boolean;
      totalActive: number;
    }>();

    timeline.forEach((visit, visitIdx) => {
      const activeIds = visit.activeSymptoms.map(s => s.rubricId);
      
      activeIds.forEach(id => {
        const existing = rubricsMap.get(id);
        if (!existing) {
          rubricsMap.set(id, {
            firstObserved: visit.date,
            lastObserved: visit.date,
            isActive: visitIdx === timeline.length - 1, // Active if present in final visit
            totalActive: 1
          });
        } else {
          existing.lastObserved = visit.date;
          existing.totalActive += 1;
          existing.isActive = visitIdx === timeline.length - 1;
        }
      });
    });

    return Array.from(rubricsMap.entries()).map(([rubricId, history]) => ({
      rubricId,
      firstObservedDate: history.firstObserved,
      lastObservedDate: history.lastObserved,
      isActive: history.isActive,
      totalVisitsActive: history.totalActive
    }));
  }

  private static calculateRemedyOutcomes(timeline: VisitTimelineEntry[]): RemedyResponse[] {
    const remedyMap = new Map<string, {
      remedyName: string;
      visits: string[];
      improvements: Array<{ visitId: string; improvementPercentage: number }>;
    }>();

    timeline.forEach((visit, idx) => {
      const remedy = visit.prescribedRemedyId;
      if (!remedy) return;

      if (!remedyMap.has(remedy)) {
        remedyMap.set(remedy, {
          remedyName: remedy,
          visits: [],
          improvements: []
        });
      }

      const outcome = remedyMap.get(remedy)!;
      outcome.visits.push(visit.visitId);

      // Check next visit to determine improvement
      const nextVisit = timeline[idx + 1];
      if (nextVisit) {
        const rate = nextVisit.generalAmeliorationRating;
        // Map rating scale (-5 to +5) to percentage improvement (-100% to +100%)
        const improvementPercentage = Math.round((rate / 5.0) * 100);
        outcome.improvements.push({
          visitId: visit.visitId,
          improvementPercentage
        });
      }
    });

    return Array.from(remedyMap.entries()).map(([remedyId, outcome]) => ({
      remedyId,
      remedyName: outcome.remedyName,
      visitsPrescribed: outcome.visits,
      observedImprovementRates: outcome.improvements
    }));
  }

  private static calculateConfidenceHistory(timeline: VisitTimelineEntry[]): ConfidenceTrend[] {
    return timeline.map(visit => {
      // Inferred confidence based on symptom resolution progress and visit numbers
      let scoringConfidence = 85;
      if (visit.generalAmeliorationRating > 3) scoringConfidence += 10;
      else if (visit.generalAmeliorationRating < 0) scoringConfidence -= 15;

      return {
        visitId: visit.visitId,
        date: visit.date,
        scoringConfidence: Math.max(10, Math.min(100, scoringConfidence))
      };
    });
  }
}
