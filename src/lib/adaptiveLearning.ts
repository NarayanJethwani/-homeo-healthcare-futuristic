export interface SM2State {
  cardId: string;
  repetitions: number;
  interval: number;
  easeFactor: number;
  nextDueDate: string;
}

export interface StudentMastery {
  remedyId: string;
  masteryScore: number;
  retentionRate: number;
  weakPoints: string[];
  lastStudied: string;
}

/**
 * SuperMemo SM-2 Spaced Repetition Scheduler
 * Calculates next review interval and ease factor based on performance score [0 - 5].
 */
export function calculateSM2(currentState: SM2State, quality: number): SM2State {
  // Bounded quality score check
  const q = Math.max(0, Math.min(5, quality));
  
  let repetitions = currentState.repetitions;
  let interval = currentState.interval;
  let easeFactor = currentState.easeFactor;

  if (q < 3) {
    // Incorrect answer: reset repetitions count and schedule next review for tomorrow (1 day)
    repetitions = 0;
    interval = 1;
  } else {
    // Correct answer: increment repetitions
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  }

  // Calculate new Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  
  // Set lower bound on Ease Factor to 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next due date
  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + interval);

  return {
    cardId: currentState.cardId,
    repetitions,
    interval,
    easeFactor,
    nextDueDate: nextDue.toISOString()
  };
}

/**
 * Calculates updated Student Mastery metric using an exponential moving average.
 * Mastery = 70% current mastery + 30% recent quiz performance score.
 */
export function updateStudentMastery(
  currentMastery: StudentMastery,
  quizScore: number,
  totalQuestions: number,
  missedSymptoms: string[]
): StudentMastery {
  const percentScore = totalQuestions > 0 ? (quizScore / totalQuestions) * 100 : 0;
  
  // Exponential moving average for overall mastery
  const updatedMasteryScore = Math.round(currentMastery.masteryScore * 0.7 + percentScore * 0.3);

  // Update retention rate based on score
  const updatedRetentionRate = Math.round(currentMastery.retentionRate * 0.8 + percentScore * 0.2);

  // Merge weak points list, keeping only unique values
  const weakPointsSet = new Set([...currentMastery.weakPoints, ...missedSymptoms]);
  
  // If user scored 100%, remove those symptoms from weak points
  if (percentScore === 100) {
    missedSymptoms.forEach(sym => weakPointsSet.delete(sym));
  }

  return {
    remedyId: currentMastery.remedyId,
    masteryScore: Math.min(100, Math.max(0, updatedMasteryScore)),
    retentionRate: Math.min(100, Math.max(0, updatedRetentionRate)),
    weakPoints: Array.from(weakPointsSet).slice(0, 10), // cap at 10 items
    lastStudied: new Date().toISOString()
  };
}

/**
 * Initializes a default state for a student starting to study a remedy.
 */
export function initDefaultMastery(remedyId: string): StudentMastery {
  return {
    remedyId,
    masteryScore: 0,
    retentionRate: 50,
    weakPoints: [],
    lastStudied: new Date().toISOString()
  };
}

/**
 * Initializes a default spaced repetition flashcard scheduler state.
 */
export function initDefaultSM2(cardId: string): SM2State {
  return {
    cardId,
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    nextDueDate: new Date().toISOString()
  };
}
