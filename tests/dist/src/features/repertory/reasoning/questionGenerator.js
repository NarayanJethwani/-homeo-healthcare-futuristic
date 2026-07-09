"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionGenerator = void 0;
const repertoryDb_1 = require("../database/repertoryDb");
class QuestionGenerator {
    /**
     * Identifies missing constitutional information items based on the active symptoms.
     */
    static async getMissingInformation(symptoms) {
        const rubrics = [];
        for (const s of symptoms) {
            const rub = await repertoryDb_1.repertoryRepository.getRubricById(s.rubricId);
            if (rub)
                rubrics.push(rub);
        }
        const matchedCats = new Set(rubrics.map(r => r.category));
        const hasThirst = rubrics.some(r => r.thirstPattern && r.thirstPattern !== 'normal');
        const missingItems = [];
        if (!matchedCats.has('Thermal State')) {
            missingItems.push({
                category: 'Thermal State',
                displayName: 'Thermal State',
                key: 'thermal',
                clinicianPrompt: 'Clarify if patient is chilly or warm-blooded.'
            });
        }
        if (!hasThirst) {
            missingItems.push({
                category: 'Thirst Pattern',
                displayName: 'Thirst Pattern',
                key: 'thirst',
                clinicianPrompt: 'Clarify thirst level (large gulps, small sips, or thirstless).'
            });
        }
        if (!matchedCats.has('Modalities')) {
            missingItems.push({
                category: 'Modalities',
                displayName: 'Aggravations & Ameliorations',
                key: 'modalities',
                clinicianPrompt: 'Clarify what makes the symptoms better or worse (motion, rest, position).'
            });
        }
        if (!matchedCats.has('Food & Cravings')) {
            missingItems.push({
                category: 'Food & Cravings',
                displayName: 'Food Cravings',
                key: 'cravings',
                clinicianPrompt: 'Clarify any food cravings or aversions.'
            });
        }
        if (!matchedCats.has('Female / Menses')) {
            missingItems.push({
                category: 'Female / Menses',
                displayName: 'Menstrual History',
                key: 'menses',
                clinicianPrompt: 'Clarify menstrual cycle characteristics if female.'
            });
        }
        if (!matchedCats.has('Sleep')) {
            missingItems.push({
                category: 'Sleep',
                displayName: 'Sleep Characteristics',
                key: 'sleep',
                clinicianPrompt: 'Clarify sleep quality, timing (e.g. 3 AM waking), or sleep aggravation.'
            });
        }
        if (!matchedCats.has('Etiology / Causation')) {
            missingItems.push({
                category: 'Etiology / Causation',
                displayName: 'Etiology / Trigger',
                key: 'etiology',
                clinicianPrompt: 'Clarify if symptoms started after grief, anger, shock, or weather exposure.'
            });
        }
        if (!matchedCats.has('Mental & Emotional')) {
            missingItems.push({
                category: 'Mental & Emotional',
                displayName: 'Mental Generals',
                key: 'mental',
                clinicianPrompt: 'Clarify dominant emotional state (apathy, anxiety, irritability).'
            });
        }
        return missingItems;
    }
    /**
     * Generates prioritized follow-up questions.
     */
    static async generateQuestions(symptoms) {
        const missing = await this.getMissingInformation(symptoms);
        const questions = [];
        const QUESTION_MAP = {
            thermal: {
                key: 'thermal',
                questionText: 'How does the patient react to temperature changes or room environment?',
                options: [
                    'Highly chilly, needs extra blankets, cold drafts are intolerable',
                    'Warm-blooded, wants fresh open air and cool breezes, warm rooms feel stuffy',
                    'No notable sensitivity to ambient temperature'
                ],
                priority: 1
            },
            thirst: {
                key: 'thirst',
                questionText: 'What is the patient\'s current water intake or thirst behavior?',
                options: [
                    'Extremely thirsty, drinks large quantities at long intervals',
                    'Thirsty for small sips, mouth feels dry but cannot gulp water',
                    'Completely thirstless, forgets to drink water'
                ],
                priority: 1
            },
            modalities: {
                key: 'modalities',
                questionText: 'How does physical movement or rest affect the pains or general state?',
                options: [
                    'Pain is much worse from the slightest motion, must lie still',
                    'Stiffness is worse when first starting to move, but better by continuous slow walking',
                    'Resting or quiet lying down relieves the symptoms completely'
                ],
                priority: 1
            },
            cravings: {
                key: 'cravings',
                questionText: 'Are there any intense food cravings or strong dislikes?',
                options: [
                    'Strong craving for sweets or sugary foods',
                    'Strong craving for salt or salty foods',
                    'Aversion to milk or fatty foods',
                    'No strong cravings or aversions'
                ],
                priority: 2
            },
            menses: {
                key: 'menses',
                questionText: 'What is the character of the menstrual cycle?',
                options: [
                    'Extremely painful cramping (dysmenorrhea) relieved by bending double',
                    'Scanty, delayed, or suppressed cycle',
                    'Profuse, early, or long-lasting cycle',
                    'Cycle is normal or not applicable'
                ],
                priority: 2
            },
            sleep: {
                key: 'sleep',
                questionText: 'Are there any sleep difficulties or specific aggravation times related to sleep?',
                options: [
                    'Wakes up around 3 AM thinking about work or responsibilities',
                    'Wakes up feeling worse, breathless, or anxious after sleeping (sleep aggravation)',
                    'Restless sleep, tossing and turning constantly',
                    'No notable sleep issues'
                ],
                priority: 2
            },
            etiology: {
                key: 'etiology',
                questionText: 'Did the symptoms begin after any specific emotional shock or physical event?',
                options: [
                    'Triggered after suppressed anger, indignation, or frustration',
                    'Triggered after grief, silent sorrow, or loss of a loved one',
                    'Triggered after a sudden fright, bad news, or shock',
                    'Triggered after exposure to cold damp weather or getting feet wet',
                    'No specific causative event identified'
                ],
                priority: 1
            },
            mental: {
                key: 'mental',
                questionText: 'What is the patient\'s dominant emotional or mental state during this illness?',
                options: [
                    'Intense anticipatory anxiety, stage fright, or hurry',
                    'Apathy, indifference, lack of interest in family or work',
                    'Extreme irritability, easily angered, competitive drive',
                    'Anxious restlessness, fear of death, wants company'
                ],
                priority: 1
            }
        };
        missing.forEach(m => {
            if (QUESTION_MAP[m.key]) {
                questions.push(QUESTION_MAP[m.key]);
            }
        });
        // Sort: high priority first
        return questions.sort((a, b) => a.priority - b.priority);
    }
}
exports.QuestionGenerator = QuestionGenerator;
