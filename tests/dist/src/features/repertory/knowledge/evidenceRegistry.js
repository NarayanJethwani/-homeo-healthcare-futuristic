"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JETHWANI_EVIDENCE_REGISTRY = void 0;
exports.JETHWANI_EVIDENCE_REGISTRY = {
    'Ars': {
        remedyId: 'Ars',
        editorialStatus: 'Verified',
        clinicalPearls: [
            {
                id: 'ars_pearl_heat',
                text: 'Amelioration from heat is absolute (warm drinks, hot wraps), except for the head which is ameliorated by cold.',
                type: 'characteristic',
                origin: 'source-backed',
                caution: 'Verify that burning pains are relieved by heat, not aggravated.'
            },
            {
                id: 'ars_pearl_restlessness',
                text: 'Anxious restlessness causes patient to constantly change positions, but they are too weak to do so without extreme exhaustion.',
                type: 'constitutional',
                origin: 'Dr. Jethwani clinical note'
            },
            {
                id: 'ars_pearl_caution',
                text: 'Contraindicated in patients with low vital heat if warm wraps cannot be tolerated.',
                type: 'caution',
                origin: 'editorial'
            },
            {
                id: 'ars_pearl_miasm',
                text: 'Miasmatic clue: Predominantly Syphilitic/destructive miasm target, indicated in ulcerations and gangrenous tendencies.',
                type: 'characteristic',
                origin: 'editorial'
            }
        ],
        evidenceItems: [
            {
                id: 'ars_ev_respiratory',
                title: 'Midnight Asthma Paroxysm',
                summary: 'Strong affinity to respiratory dyspnea peaking between 11 PM and 2 AM, relieved by sitting upright and warm drinks.',
                strength: 'Keynote',
                confidence: 95,
                editorialStatus: 'Verified',
                reviewer: 'Dr. Jethwani',
                lastReviewed: '2026-07-01',
                origin: 'source-backed',
                sourceReferences: ["Kent's Lectures on Homoeopathic Materia Medica"]
            },
            {
                id: 'ars_ev_gastric',
                title: 'Gastralgia with Burning Pain',
                summary: 'Indicated in severe burning gastralgia from cold food/drinks, accompanied by vomiting and cold sweat.',
                strength: 'Strong',
                confidence: 90,
                editorialStatus: 'Reviewed',
                reviewer: 'CIE Board',
                lastReviewed: '2026-06-15',
                origin: 'editorial',
                sourceReferences: ["Hahnemann Chronic Diseases"]
            }
        ],
        pathologyRelations: ['Asthma', 'Gastroenteritis', 'Eczema'],
        remedyRelations: ['Thuja (complementary)', 'Nux Vomica (antidote)', 'Sulphur (chronic)']
    },
    'Nux-v': {
        remedyId: 'Nux-v',
        editorialStatus: 'Verified',
        clinicalPearls: [
            {
                id: 'nux_pearl_irritability',
                text: 'Competitive, easily angered, and hyper-sensitive to external impressions like noise, light, and odors.',
                type: 'constitutional',
                origin: 'source-backed'
            },
            {
                id: 'nux_pearl_stool',
                text: 'Ineffectual urging to stool; patient feels temporarily better only after passing a small quantity.',
                type: 'characteristic',
                origin: 'Dr. Jethwani clinical note',
                caution: 'Do not prescribe if constipation is painless with no urge.'
            },
            {
                id: 'nux_pearl_miasm',
                text: 'Miasmatic clue: Mixed Psoric and active Sycotic miasm target, showing spasmodic and congestive manifestations.',
                type: 'characteristic',
                origin: 'editorial'
            }
        ],
        evidenceItems: [
            {
                id: 'nux_ev_digestive',
                title: 'Business-Stress Gastric Spasm',
                summary: 'High success rates in treating gastric spasms, portal congestion, and dyspepsia caused by overwork and stimulants.',
                strength: 'Strong',
                confidence: 92,
                editorialStatus: 'Verified',
                reviewer: 'Dr. Jethwani',
                lastReviewed: '2026-07-02',
                origin: 'Dr. Jethwani clinical note',
                sourceReferences: []
            }
        ],
        pathologyRelations: ['Dyspepsia', 'Constipation', 'Migraine'],
        remedyRelations: ['Sulphur (chronic complementary)', 'Coffea (antidote)', 'Arsenicum (acute parallel)']
    },
    'Lyc': {
        remedyId: 'Lyc',
        editorialStatus: 'Verified',
        clinicalPearls: [
            {
                id: 'lyc_pearl_sides',
                text: 'Symptoms display a marked right-sided affinity or migrate from right to left (throat, chest, kidney).',
                type: 'characteristic',
                origin: 'source-backed'
            },
            {
                id: 'lyc_pearl_cravings',
                text: 'Intense desire for warm drinks and sweets; cold foods cause immediate flatulence.',
                type: 'constitutional',
                origin: 'Dr. Jethwani clinical note'
            },
            {
                id: 'lyc_pearl_miasm',
                text: 'Miasmatic clue: Deeply Sycotic miasm target with secondary Psoric layers, marked by gradual tissue changes.',
                type: 'characteristic',
                origin: 'editorial'
            }
        ],
        evidenceItems: [
            {
                id: 'lyc_ev_flatulence',
                title: '4-8 PM Abdominal Flatulence Peak',
                summary: 'Key constitutional indicator where severe abdominal distension peaking between 4 PM and 8 PM resolves.',
                strength: 'Keynote',
                confidence: 96,
                editorialStatus: 'Verified',
                reviewer: 'Dr. Jethwani',
                lastReviewed: '2026-07-03',
                origin: 'source-backed',
                sourceReferences: ["Allen's Keynotes"]
            }
        ],
        pathologyRelations: ['IBS', 'Gout', 'Pneumonia'],
        remedyRelations: ['Lachesis (moves right-to-left complementary)', 'Pulsatilla (antidote)', 'Sulphur (chronic affinity)']
    },
    'Sulph': {
        remedyId: 'Sulph',
        editorialStatus: 'Verified',
        clinicalPearls: [
            {
                id: 'sulph_pearl_heat',
                text: 'Highly warm-blooded; puts feet out of bed at night to cool them because of burning soles.',
                type: 'characteristic',
                origin: 'source-backed'
            },
            {
                id: 'sulph_pearl_philosophical',
                text: 'Philosophical or untidy disposition; often values old or ragged possessions highly.',
                type: 'constitutional',
                origin: 'source-backed'
            },
            {
                id: 'sulph_pearl_miasm',
                text: 'Miasmatic clue: Chief representative of the Psoric miasm, acting as the fundamental reactor to clear suppressions.',
                type: 'characteristic',
                origin: 'source-backed'
            }
        ],
        evidenceItems: [
            {
                id: 'sulph_ev_skin',
                title: 'Eczema with Burning after Scratching',
                summary: 'Indicated in dry skin eruptions where intense itching is followed by severe burning pain and bleeding.',
                strength: 'Keynote',
                confidence: 98,
                editorialStatus: 'Verified',
                reviewer: 'Dr. Jethwani',
                lastReviewed: '2026-06-30',
                origin: 'source-backed',
                sourceReferences: ["Hering's Guiding Symptoms"]
            }
        ],
        pathologyRelations: ['Eczema', 'Hemorrhoids', 'Chronic Diarrhea'],
        remedyRelations: ['Pulsatilla (complementary)', 'Nux Vomica (antidote)', 'Calcarea Carb (remedy cycle)']
    },
    'Puls': {
        remedyId: 'Puls',
        editorialStatus: 'Verified',
        clinicalPearls: [
            {
                id: 'puls_pearl_emotional',
                text: 'Mild, yielding, and weepy disposition; patient craves sympathy, consolidation, and attention.',
                type: 'constitutional',
                origin: 'source-backed'
            },
            {
                id: 'puls_pearl_air',
                text: 'Highly ameliorated by slow walking in fresh open air; warm rooms make symptoms intolerable.',
                type: 'characteristic',
                origin: 'source-backed',
                caution: 'prescribe only if thirstlessness is confirmed.'
            },
            {
                id: 'puls_pearl_miasm',
                text: 'Miasmatic clue: Principally Sycotic miasm target, producing thick mucous discharge and venous congestions.',
                type: 'characteristic',
                origin: 'editorial'
            }
        ],
        evidenceItems: [
            {
                id: 'puls_ev_mucosa',
                title: 'Thick Yellow-Green Discharges',
                summary: 'Key signature of bland, thick, yellow-green catarrhal discharges from eyes, nose, or lungs.',
                strength: 'Keynote',
                confidence: 94,
                editorialStatus: 'Verified',
                reviewer: 'Dr. Jethwani',
                lastReviewed: '2026-07-04',
                origin: 'source-backed',
                sourceReferences: ["Nash's Leaders in Homoeopathic Therapeutics"]
            }
        ],
        pathologyRelations: ['Otitis Media', 'Bronchitis', 'Dysmenorrhea'],
        remedyRelations: ['Silicea (complementary chronic)', 'Chamomilla (antidote)', 'Lycopodium (remedy cycle)']
    }
};
