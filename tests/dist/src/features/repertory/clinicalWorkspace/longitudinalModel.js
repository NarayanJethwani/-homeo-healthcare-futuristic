"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongitudinalCaseModel = void 0;
class LongitudinalCaseModel {
    /**
     * Summarizes a patient's historical visit entries into a structured timeline analysis.
     */
    static buildLongitudinalSummary(patientId, timeline, rubricTitles) {
        if (!timeline || timeline.length === 0) {
            return {
                patientId,
                timeline: [],
                symptomTrends: [],
                rubricsHistory: [],
                remedyOutcomes: [],
                confidenceHistory: []
            };
        }
        // Sort timeline chronologically
        const sortedTimeline = [...timeline].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const symptomTrends = this.calculateSymptomEvolution(sortedTimeline, rubricTitles);
        const rubricsHistory = this.calculateRubricsHistory(sortedTimeline);
        const remedyOutcomes = this.calculateRemedyOutcomes(sortedTimeline);
        const confidenceHistory = this.calculateConfidenceHistory(sortedTimeline);
        // Step 3 & Step 8 analysis
        const lastVisit = sortedTimeline[sortedTimeline.length - 1];
        const prevVisit = sortedTimeline.length >= 2 ? sortedTimeline[sortedTimeline.length - 2] : null;
        let responseTrend = 'stable';
        if (lastVisit.generalAmeliorationRating > 1) {
            responseTrend = 'improving';
        }
        else if (lastVisit.generalAmeliorationRating < -1) {
            responseTrend = 'regressing';
        }
        // 1. Suppression Warnings (Hering's Law Check)
        const suppressionWarnings = [];
        if (prevVisit) {
            const skinImproved = prevVisit.activeSymptoms.some(prevSym => {
                const title = (rubricTitles[prevSym.rubricId] || '').toLowerCase();
                const currSym = lastVisit.activeSymptoms.find(s => s.rubricId === prevSym.rubricId);
                const resolvedOrImproved = !currSym || currSym.observedIntensity < prevSym.observedIntensity;
                return resolvedOrImproved && (title.includes('skin') || title.includes('eczema') || title.includes('eruption') || title.includes('psoriasis'));
            });
            const internalWorsened = lastVisit.activeSymptoms.some(currSym => {
                const title = (rubricTitles[currSym.rubricId] || '').toLowerCase();
                const prevSym = prevVisit.activeSymptoms.find(s => s.rubricId === currSym.rubricId);
                const worsened = !prevSym || currSym.observedIntensity > prevSym.observedIntensity;
                return worsened && (title.includes('asthma') || title.includes('anxiety') || title.includes('fear') || title.includes('chest') || title.includes('lungs'));
            });
            if (skinImproved && internalWorsened) {
                responseTrend = 'suppressed';
                suppressionWarnings.push("Hering's Law Alert: Possible suppression detected! Superficial skin eruptions resolved/improved, but deeper internal respiratory or mental anxiety symptoms have worsened.");
            }
        }
        // 2. Relapse Indicators
        const relapseIndicators = [];
        symptomTrends.forEach(trend => {
            const history = trend.intensityHistory;
            if (history.length >= 3) {
                const initial = history[0].intensity;
                const middle = history[history.length - 2].intensity;
                const current = history[history.length - 1].intensity;
                if (middle < initial && current > middle) {
                    relapseIndicators.push(`Relapse warning: "${trend.rubricTitle}" was improving (intensity ${middle}) but has flared up again (intensity ${current}).`);
                }
            }
        });
        // 3. Unexpected Findings
        const unexpectedFindings = [];
        if (prevVisit) {
            const newSymptoms = lastVisit.activeSymptoms.filter(curr => !prevVisit.activeSymptoms.some(prev => prev.rubricId === curr.rubricId));
            if (newSymptoms.length >= 2) {
                unexpectedFindings.push(`Unexpected shift: ${newSymptoms.length} new symptoms appeared in the current visit: ${newSymptoms.map(s => rubricTitles[s.rubricId] || s.rubricId).join(', ')}.`);
            }
        }
        const expectedResponseOutcome = lastVisit.prescribedRemedyId
            ? `Patient is on ${lastVisit.prescribedRemedyId}. Expect gentle systemic amelioration of mental/general state first, followed by outward projection of chronic load.`
            : "No remedy currently prescribed. Ready for initial constitutional analysis.";
        return {
            patientId,
            timeline: sortedTimeline,
            symptomTrends,
            rubricsHistory,
            remedyOutcomes,
            confidenceHistory,
            responseTrend,
            expectedResponseOutcome,
            unexpectedFindings,
            relapseIndicators,
            suppressionWarnings
        };
    }
    static calculateSymptomEvolution(timeline, rubricTitles) {
        const trendsMap = new Map();
        timeline.forEach(visit => {
            visit.activeSymptoms.forEach(sym => {
                if (!trendsMap.has(sym.rubricId)) {
                    trendsMap.set(sym.rubricId, []);
                }
                trendsMap.get(sym.rubricId).push({
                    date: visit.date,
                    intensity: sym.observedIntensity
                });
            });
        });
        return Array.from(trendsMap.entries()).map(([rubricId, history]) => {
            let status = 'active';
            if (history.length >= 2) {
                const initial = history[0].intensity;
                const current = history[history.length - 1].intensity;
                if (current === 0)
                    status = 'resolved';
                else if (current < initial)
                    status = 'improving';
                else if (current > initial)
                    status = 'aggravated';
            }
            return {
                rubricId,
                rubricTitle: rubricTitles[rubricId] || rubricId,
                intensityHistory: history,
                status
            };
        });
    }
    static calculateRubricsHistory(timeline) {
        const rubricsMap = new Map();
        timeline.forEach((visit, visitIdx) => {
            const activeIds = visit.activeSymptoms.map(s => s.rubricId);
            activeIds.forEach(id => {
                const existing = rubricsMap.get(id);
                if (!existing) {
                    rubricsMap.set(id, {
                        firstObserved: visit.date,
                        lastObserved: visit.date,
                        isActive: visitIdx === timeline.length - 1,
                        totalActive: 1
                    });
                }
                else {
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
    static calculateRemedyOutcomes(timeline) {
        const remedyMap = new Map();
        timeline.forEach((visit, idx) => {
            const remedy = visit.prescribedRemedyId;
            if (!remedy)
                return;
            if (!remedyMap.has(remedy)) {
                remedyMap.set(remedy, {
                    remedyName: remedy,
                    visits: [],
                    improvements: []
                });
            }
            const outcome = remedyMap.get(remedy);
            outcome.visits.push(visit.visitId);
            const nextVisit = timeline[idx + 1];
            if (nextVisit) {
                const rate = nextVisit.generalAmeliorationRating;
                const improvementPercentage = Math.round((rate / 5.0) * 100);
                outcome.improvements.push({
                    visitId: visit.visitId,
                    improvementPercentage
                });
            }
        });
        // Seed expected remedy response timelines (Step 6)
        return Array.from(remedyMap.entries()).map(([remedyId, outcome]) => {
            let expectedAcuteResponse = "General improvement of energy, sleep and cognitive clarity.";
            let expectedChronicResponse = "Gradual reduction of chronic constitutional complaints.";
            let expectedTimeline = "7-14 days.";
            let warningSigns = ["Aggravation of mental anxiety", "Disruptions in sleep cycle"];
            let followUpCheckpoints = ["Re-evaluate case symptoms at 10 days", "Perform potency audit"];
            if (remedyId === 'Ars') {
                expectedAcuteResponse = "Reduction in burning pain, temporary restless aggravation followed by restful sleep.";
                expectedChronicResponse = "Anxiety levels stabilize, respiratory capacity improves within 3-5 days.";
                expectedTimeline = "Initial shift within 24-48 hours.";
                warningSigns = ["Aggravated panic anxiety", "Gastric distress"];
                followUpCheckpoints = ["Evaluate sleep quality at 7 days", "Audit warm-affinity modalities"];
            }
            else if (remedyId === 'Nux-v') {
                expectedAcuteResponse = "Easing of spasms/cramps, improved digestive motility.";
                expectedChronicResponse = "Irritability decreases, morning energy levels improve.";
                expectedTimeline = "Rapid response within 12-24 hours.";
                warningSigns = ["Severe morning headache", "Sleep disruption"];
                followUpCheckpoints = ["Assess bowel frequency at 5 days", "Audit stress triggers"];
            }
            else if (remedyId === 'Lyc') {
                expectedAcuteResponse = "Reduction in bloating and digestive pressure after eating.";
                expectedChronicResponse = "Confidence levels increase, 4-8 PM aggravation episodes subside.";
                expectedTimeline = "Gradual improvement over 4-7 days.";
                warningSigns = ["Right-sided abdominal pain shift", "Afternoon fatigue"];
                followUpCheckpoints = ["Track bloating intensity at 10 days", "Audit sweet cravings"];
            }
            else if (remedyId === 'Sulph') {
                expectedAcuteResponse = "Brief skin eruption aggravation, followed by peeling/healing.";
                expectedChronicResponse = "Burning sensations in soles/palms subside, constitutional energy rises.";
                expectedTimeline = "Shift within 3-6 days.";
                warningSigns = ["Intense skin itching escalation"];
                followUpCheckpoints = ["Assess skin itching cycle at 14 days", "Audit morning diarrhea"];
            }
            else if (remedyId === 'Puls') {
                expectedAcuteResponse = "Calming of emotional weeping, relief in open air.";
                expectedChronicResponse = "Digestive tolerance to rich foods improves, hormonal symptoms stabilize.";
                expectedTimeline = "Gentle shift within 2-4 days.";
                warningSigns = ["Increased emotional clinginess", "Sudden cold sensitivity"];
                followUpCheckpoints = ["Track emotional response at 7 days", "Audit thirst levels"];
            }
            return {
                remedyId,
                remedyName: outcome.remedyName,
                visitsPrescribed: outcome.visits,
                observedImprovementRates: outcome.improvements,
                expectedAcuteResponse,
                expectedChronicResponse,
                expectedTimeline,
                warningSigns,
                followUpCheckpoints
            };
        });
    }
    static calculateConfidenceHistory(timeline) {
        return timeline.map(visit => {
            let scoringConfidence = 85;
            if (visit.generalAmeliorationRating > 3)
                scoringConfidence += 10;
            else if (visit.generalAmeliorationRating < 0)
                scoringConfidence -= 15;
            return {
                visitId: visit.visitId,
                date: visit.date,
                scoringConfidence: Math.max(10, Math.min(100, scoringConfidence))
            };
        });
    }
}
exports.LongitudinalCaseModel = LongitudinalCaseModel;
