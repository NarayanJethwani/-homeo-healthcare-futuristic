import { getKnowledgeGraph } from "./knowledgeGraph";

export interface OrganRating {
  organ: string;
  rating: number; // 1-10
  details: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface HistoricalMilestone {
  year: string;
  author: string;
  milestone: string;
}

export interface RemedyLearningData {
  remedyId: string;
  label: string;
  stories: {
    title: string;
    narrative: string;
  };
  mnemonics: {
    acronym: string;
    lines: { letter: string; description: string }[];
  };
  organAffinities: OrganRating[];
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
  timeline: HistoricalMilestone[];
}

export const REMEDY_LEARNING_DB: Record<string, RemedyLearningData> = {
  rem_sulphur: {
    remedyId: "rem_sulphur",
    label: "Sulphur",
    stories: {
      title: "The Ragged Philosopher's Dilemma",
      narrative: "Imagine a brilliant scholar sitting in a dusty room surrounded by piles of unread books. His hair is unkempt, his clothes are stained, and he couldn't care less about what others think of his appearance. He is deep in philosophical speculation, conceiving grand theories about the universe. Suddenly, it's 11 AM, and his stomach drops with an empty, sinking hunger. That night, he tosses and turns under warm blankets, his feet burning like fire until he throws them out of bed. This is Sulphur—hot-blooded, theoretical, untidy, and prone to fiery skin eruptions that are aggravated by the very warmth of bed that should soothe them."
    },
    mnemonics: {
      acronym: "SULPHUR",
      lines: [
        { letter: "S", description: "Soles of feet burning at night in bed." },
        { letter: "U", description: "Untidy, ragged philosopher archetype." },
        { letter: "L", description: "Late morning sinking hunger at 11 AM." },
        { letter: "P", description: "Philosophical speculation and egotism." },
        { letter: "H", description: "Heat aggravation; strongly warm-blooded." },
        { letter: "U", description: "Uncomfortable standing still; causes backache." },
        { letter: "R", description: "Redness of all mucous membranes and external orifices." }
      ]
    },
    organAffinities: [
      { organ: "Skin", rating: 10, details: "Dry, red, intensely itchy skin eruptions aggravated by warmth and washing." },
      { organ: "Stomach", rating: 8, details: "Empty, weak, sinking sensation at 11 AM; craves sweets and fats." },
      { organ: "Venous System", rating: 9, details: "Venous congestion, portal stasis, hemorrhoids, and aggravation from standing." },
      { organ: "Lungs", rating: 7, details: "Oppression of chest at night, requiring open windows." },
      { organ: "Brain", rating: 8, details: "Intellectual overactivity, egotism, and insomnia." }
    ],
    flashcards: [
      { question: "What is the classic Sulphur thermal state?", answer: "Extremely warm-blooded, aggravated by heat and warm bed, relieved by cold open air." },
      { question: "What specific time does Sulphur experience empty stomach hunger?", answer: "Exactly at 11 AM." },
      { question: "How does Sulphur react to standing in place?", answer: "Aggravated; standing causes lower backache, physical weariness, and venous congestion." }
    ],
    quizzes: [
      {
        question: "Which of the following modalities is a primary keynote of Sulphur?",
        options: [
          "Ameliorated by warmth of bed",
          "Aggravated by washing/bathing",
          "Better standing still",
          "Worse midnight to 2 AM"
        ],
        correctIdx: 1,
        explanation: "Sulphur is strongly aggravated by washing/bathing, which triggers itching and dermal heat outbursts."
      },
      {
        question: "What is Sulphur's dominant miasmatic association?",
        options: ["Psora", "Sycosis", "Syphilis", "Tubercular"],
        correctIdx: 0,
        explanation: "Sulphur is classically known as the king of anti-psoric remedies, representing primary functional hypersensitivity."
      },
      {
        question: "Which physical keynote is typical of Sulphur?",
        options: [
          "Cold, damp feet like wet socks",
          "Aggravation from warm drinks",
          "Redness of all external orifices",
          "Left-to-right symptom spread"
        ],
        correctIdx: 2,
        explanation: "Sulphur causes extreme congestion and redness of all external orifices (lips, eyelids, anus, etc.)."
      }
    ],
    timeline: [
      { year: "1805", author: "Samuel Hahnemann", milestone: "First proving of Sulphur published in Fragmenta de viribus." },
      { year: "1828", author: "Samuel Hahnemann", milestone: "Established as the primary anti-psoric polychrest in Chronic Diseases." },
      { year: "1900", author: "J.T. Kent", milestone: "Detailed description of the 'Ragged Philosopher' in Lectures on Homoeopathic Materia Medica." }
    ]
  },
  rem_lycopodium: {
    remedyId: "rem_lycopodium",
    label: "Lycopodium Clavatum",
    stories: {
      title: "The Mask of the Insecure Director",
      narrative: "Lycopodium is like a newly promoted manager who acts authoritarian and dictatorial to hide a deep, paralyzing insecurity. Inside, he is terrified of public speaking and stage fright, but outside he projects supreme confidence. He is highly intellectual and hates contradiction. Physically, his weakness lies in his digestive system—eating even a tiny bite makes him bloated and flatulent, specifically between 4 PM and 8 PM. He is chilly but loves cool air on his face, and his symptoms typically start on the right side of the body and move to the left."
    },
    mnemonics: {
      acronym: "LYCOPODIUM",
      lines: [
        { letter: "L", description: "Lack of self-confidence hidden by authority." },
        { letter: "Y", description: "Yielding mind in private, dictatorial in public." },
        { letter: "C", description: "Chilly, but desires cold air on the face." },
        { letter: "O", description: "Oppressed by gas, bloating immediately after food." },
        { letter: "P", description: "Periodic aggravation from 4 PM to 8 PM." },
        { letter: "O", description: "One foot hot, one foot cold." },
        { letter: "D", description: "Desires sweets, warm foods, and warm drinks." },
        { letter: "I", description: "Intellectual supremacy over physical power." },
        { letter: "U", description: "Urinary symptoms; red sand in urine." },
        { letter: "M", description: "Moves from right side to left side." }
      ]
    },
    organAffinities: [
      { organ: "Gastrointestinal", rating: 10, details: "Severe flatulence, fermentation, bloating immediately after eating, and weak liver." },
      { organ: "Urinary", rating: 8, details: "Kidney stone predisposition, brick-dust sediment in urine." },
      { organ: "Liver", rating: 9, details: "Hepatic congestion, metabolic sluggishness, right-sided hypochondrium pain." },
      { organ: "Brain", rating: 8, details: "High intellectual capacity, anticipatory stage fright, fear of solitude." },
      { organ: "Throat", rating: 7, details: "Right-sided tonsillitis or dryness spreading left." }
    ],
    flashcards: [
      { question: "What is Lycopodium's primary time aggravation?", answer: "Late afternoon, specifically between 4 PM and 8 PM." },
      { question: "Does Lycopodium prefer hot or cold food and drinks?", answer: "Strongly prefers warm food and warm drinks, which soothe the weak digestive tract." },
      { question: "Which side of the body is primarily affected by Lycopodium?", answer: "The right side, often spreading to the left (e.g. sore throats, chest pains, ovarian pain)." }
    ],
    quizzes: [
      {
        question: "Which mental theme characterizes Lycopodium?",
        options: [
          "Aversion to company, wants absolute silence",
          "Authoritarian behavior compensating for low self-confidence",
          "Indifference to daily business",
          "Aversion to warm wraps"
        ],
        correctIdx: 1,
        explanation: "Lycopodium covers a deep lack of self-confidence by acting dictatorial, authoritarian, and controlling."
      },
      {
        question: "What physical symptom is associated with Lycopodium's urinary profile?",
        options: [
          "Brick-dust or red sand sediment in urine",
          "Profuse urination relieving a headache",
          "Involuntary urination when coughing",
          "Inability to pass urine except when standing"
        ],
        correctIdx: 0,
        explanation: "Lycopodium is known for red sand/brick-dust sediment in urine, indicating sluggish uric acid excretion."
      },
      {
        question: "Which digestive keynote is typical of Lycopodium?",
        options: [
          "Gastric pain relieved by eating cold food",
          "Empty stomach hunger at 11 AM",
          "Bloating and fullness after eating a small amount of food",
          "Ineffectual urging refreshed by short naps"
        ],
        correctIdx: 2,
        explanation: "Lycopodium has a weak digestion where a few bites fill the stomach to capacity, causing bloating and gas."
      }
    ],
    timeline: [
      { year: "1828", author: "Samuel Hahnemann", milestone: "Included in Chronic Diseases after proving the club moss spores." },
      { year: "1880", author: "C. von Boenninghausen", milestone: "Documented the right-to-left sides of body relationship and verified it." },
      { year: "1905", author: "J.T. Kent", milestone: "Detailed the cognitive stage fright and performance anxiety layers in lectures." }
    ]
  },
  rem_nux_vomica: {
    remedyId: "rem_nux_vomica",
    label: "Nux Vomica",
    stories: {
      title: "The Driven Executive's Breakdown",
      narrative: "Nux Vomica is the ambitious, workaholic trial lawyer or corporate executive. He runs on coffee, alcohol, spices, and high-stress meetings. He has zero patience for slow-talking people and gets extremely irritable over minor interruptions. Physically, he is intensely chilly, flinching at the slightest cold draft. His digestive system is spastic—he suffers from cramps, heartburn, and constipation with a frustrating 'ineffectual urging' (feeling like he has to go but cannot). If he can take a 10-minute nap in the afternoon, he wakes up completely refreshed. This is Nux Vomica—spastic, chilly, irritable, and driven."
    },
    mnemonics: {
      acronym: "NUXVOMICA",
      lines: [
        { letter: "N", description: "Nap of 10-15 minutes refreshes completely." },
        { letter: "U", description: "Urging for stool that is ineffectual and spastic." },
        { letter: "X", description: "Xerostomia (dry mouth) with morning bitter taste." },
        { letter: "V", description: "Violent anger, impatience, and irritability." },
        { letter: "O", description: "Over-stimulated by coffee, alcohol, and stress." },
        { letter: "M", description: "Morning aggravation, especially around 3-4 AM." },
        { letter: "I", description: "Intense chilliness; cannot uncover in bed." },
        { letter: "C", description: "Cramps and spastic pains in stomach." },
        { letter: "A", description: "Ambitious workaholic seeking stimulants." }
      ]
    },
    organAffinities: [
      { organ: "Gastrointestinal", rating: 10, details: "Spasmodic stomach pains, acid reflux, and constipation with ineffectual urging." },
      { organ: "Nervous System", rating: 10, details: "Extreme hyper-reflexia, hypersensitivity to light, noise, and odors." },
      { organ: "Liver", rating: 8, details: "Detoxification failure, liver congestion from stimulants and alcohol." },
      { organ: "Musculoskeletal", rating: 7, details: "Spasmodic backaches and tetanic muscle tightness." },
      { organ: "Brain", rating: 9, details: "Ambitious overactivity, irritability, and insomnia." }
    ],
    flashcards: [
      { question: "What is Nux Vomica's reaction to cold drafts?", answer: "Highly aggravated; Nux Vomica is extremely chilly and must be wrapped up warm." },
      { question: "What is the keynote regarding sleep/naps for Nux Vomica?", answer: "A short sleep or afternoon nap of 10-15 minutes completely relieves physical and mental symptoms." },
      { question: "What is the typical bowel keynote of Nux Vomica?", answer: "Constipation characterized by constant, ineffectual urging for stool, passing only small amounts." }
    ],
    quizzes: [
      {
        question: "Which stimulant abuse profile is most characteristic of Nux Vomica?",
        options: [
          "Desire for soft-boiled eggs and chalk",
          "Abuse of coffee, alcohol, and spices to manage work stress",
          "Desire for cold water in small frequent sips",
          "Aversion to warm wraps or blankets"
        ],
        correctIdx: 1,
        explanation: "Nux Vomica is the prime remedy for the consequences of over-stimulation, sedentary lifestyles, and abuse of stimulants."
      },
      {
        question: "What time does Nux Vomica typically wake in the night with an overactive mind?",
        options: ["11 AM", "Midnight to 2 AM", "3 AM to 4 AM", "4 PM to 8 PM"],
        correctIdx: 2,
        explanation: "Nux Vomica typically wakes around 3-4 AM, lies awake thinking of business, and then falls into a heavy, unrefreshing sleep at dawn."
      },
      {
        question: "How are Nux Vomica pains characterized?",
        options: ["Burning and relieved by cold application", "Spasmodic, cramping, and radiating", "Dull and numb with heavy eyelids", "Changeable and shifting rapidly"],
        correctIdx: 1,
        explanation: "Nux Vomica pains are spasmodic, spastic, and cramping, matching its hyper-excitable nervous state."
      }
    ],
    timeline: [
      { year: "1805", author: "Samuel Hahnemann", milestone: "Proved and published in Fragmenta de viribus, documenting its anti-spasmodic nature." },
      { year: "1890", author: "E.B. Nash", milestone: "Highlighted Nux Vomica as one of the 'Leaders in Typhoid and Dyspeptic States'." },
      { year: "1905", author: "J.T. Kent", milestone: "Established the correlation between Nux Vomica and modern sedentary lifestyle stressors." }
    ]
  },
  rem_arsenicum: {
    remedyId: "rem_arsenicum",
    label: "Arsenicum Album",
    stories: {
      title: "The Terrified Curator",
      narrative: "Arsenicum is the fastidious art gallery curator who lives in constant terror of disease, death, and financial ruin. Every painting must be hung exactly straight; if a desk is slightly cluttered, it triggers intense anxiety. He is highly restless, pacing the room in panic, yet physically very weak. He is extremely chilly and experiences burning pains (like hot coals) that are paradoxically relieved by warm applications. When sick, he is thirsty for warm water, which he takes in tiny, frequent sips because large gulps aggravate his stomach."
    },
    mnemonics: {
      acronym: "ARSENIC",
      lines: [
        { letter: "A", description: "Anxiety about health, death, and cleanliness." },
        { letter: "R", description: "Restlessness physically, combined with extreme weakness." },
        { letter: "S", description: "Sips of warm water, taken frequently." },
        { letter: "E", description: "Exacting orderliness and fastidiousness." },
        { letter: "N", description: "Night aggravation, specifically 12 AM - 2 AM." },
        { letter: "I", description: "Ice-cold sensations, yet burning pains relieved by heat." },
        { letter: "C", description: "Chilly state; desires extreme physical warmth." }
      ]
    },
    organAffinities: [
      { organ: "Gastrointestinal", rating: 10, details: "Severe burning in stomach, vomiting, rice-water diarrhea, and food poisoning." },
      { organ: "Lungs", rating: 9, details: "Asthmatic wheezing worse midnight to 2 AM, must sit up in bed to breathe." },
      { organ: "Skin", rating: 9, details: "Dry, scaly, peeling eczema with intense burning relieved by hot water." },
      { organ: "Brain", rating: 9, details: "Anxious panic, fear of death, and perfectionism." },
      { organ: "Mucous Membranes", rating: 8, details: "Acrid, watery, burning discharges from eyes and nose." }
    ],
    flashcards: [
      { question: "What is the peculiar modality of Arsenicum's burning pains?", answer: "The burning pains are relieved by heat or warm applications (unlike most other remedies)." },
      { question: "What is Arsenicum's drinking pattern?", answer: "Thirsty for small quantities (sips) of cold or warm water at frequent intervals." },
      { question: "What is Arsenicum's primary aggravation time?", answer: "Between midnight and 2 AM, especially at 1 AM." }
    ],
    quizzes: [
      {
        question: "Which physical keynote is typical of Arsenicum Album?",
        options: [
          "Sensation of wet socks on the feet",
          "Burning pains relieved by warm applications",
          "Left-sided throat pain moving right",
          "Bloating worse 4-8 PM"
        ],
        correctIdx: 1,
        explanation: "Arsenicum has burning pains that are paradoxically ameliorated by warm wraps and hot applications."
      },
      {
        question: "What is Arsenicum's dominant emotional state?",
        options: [
          "Authoritarian with high confidence",
          "Restless anxiety about health, contamination, and death",
          "Mild and weeping, begging for consolation",
          "Extreme egotism and messy habits"
        ],
        correctIdx: 1,
        explanation: "Arsenicum is characterized by intense health anxiety, fear of death, and fastidious concern with hygiene."
      },
      {
        question: "In respiratory distress, how does Arsenicum behave?",
        options: [
          "Wants to lie down flat in a warm room",
          "Cannot lie down; must sit up bent forward, worse 12-2 AM",
          "Ameliorated by slow walking in open cool air",
          "Aggravated by warm food or drinks"
        ],
        correctIdx: 1,
        explanation: "During asthma attacks, Arsenicum patients are highly restless, weak, and must sit up bent forward to breathe, worse midnight to 2 AM."
      }
    ],
    timeline: [
      { year: "1805", author: "Samuel Hahnemann", milestone: "First clinical provings of Arsenic Trioxide published in Fragmenta." },
      { year: "1850", author: "C. Hering", milestone: "Documented the toxicological and pathogenetic patterns of Arsenicum." },
      { year: "1900", author: "J.H. Clarke", milestone: "Aggregated the respiratory, gastrointestinal, and dermatological differentials in Dictionary." }
    ]
  },
  rem_calcarea: {
    remedyId: "rem_calcarea",
    label: "Calcarea Carbonica",
    stories: {
      title: "The Sluggish Oyster",
      narrative: "Calcarea Carbonica is the chubby, sluggish, sweet-tempered child who develops slowly. He is extremely chilly, sensitive to damp drafty air, and sweats profusely around the back of his neck and head when sleeping, wetting his pillow. He craves soft-boiled eggs and ice cream, and sometimes indigestible things like chalk or dirt. He is slow to walk and slow to teething. When stressed, he develops a deep apprehension that he is going insane or that others will perceive his mental weakness. Like the oyster, he builds a thick protective calcium shell of security and routine to shield his flabby, vulnerable core."
    },
    mnemonics: {
      acronym: "CALCAREA",
      lines: [
        { letter: "C", description: "Chilly, damp feet feeling like cold wet socks." },
        { letter: "A", description: "Apprehension and fear of losing one's mind." },
        { letter: "L", description: "Lymph node enlargement and glandular swelling." },
        { letter: "C", description: "Craves soft-boiled eggs and indigestible things." },
        { letter: "A", description: "Aggravated by damp, cold drafts, and physical exertion." },
        { letter: "R", description: "Rooted in slow development and sluggish metabolism." },
        { letter: "E", description: "Easy sweating, especially on the back of neck during sleep." },
        { letter: "A", description: "Ameliorated by dry weather and lying down." }
      ]
    },
    organAffinities: [
      { organ: "Musculoskeletal", rating: 10, details: "Weak bone structure, slow teething, osteoarthritis, and flabby musculature." },
      { organ: "Lymphatic System", rating: 9, details: "Swollen, indurated lymph nodes in neck, groin, and abdomen." },
      { organ: "Skin", rating: 8, details: "Chalky, cold skin, easy eczema, and sweat on scalp." },
      { organ: "Gastrointestinal", rating: 7, details: "Sour stomach, constipation where the patient feels better physically." },
      { organ: "Brain", rating: 8, details: "Apprehension, mental exhaustion, fear of insanity." }
    ],
    flashcards: [
      { question: "What is Calcarea Carbonica's peculiar sweat keynote?", answer: "Profuse sweating on the scalp and back of the neck during sleep, wetting the pillow." },
      { question: "What food craving is highly characteristic of Calcarea?", answer: "Soft-boiled eggs, sweets, and indigestible substances like chalk, coal, or dirt." },
      { question: "How does Calcarea react to constipation?", answer: "Peculiarly, the patient feels better both physically and mentally when constipated." }
    ],
    quizzes: [
      {
        question: "Which physical keynote belongs to Calcarea Carbonica?",
        options: [
          "Burning soles of feet at night",
          "Cold, damp feet feeling like wet socks",
          "Heavy eyelids that cannot be opened",
          "Left-sided throat pain"
        ],
        correctIdx: 1,
        explanation: "Calcarea Carbonica is famous for cold damp feet, described as if the patient is wearing cold, wet socks."
      },
      {
        question: "What is Calcarea Carbonica's reaction to exertion?",
        options: [
          "Ameliorated by vigorous exercise and running",
          "Aggravated by physical or mental exertion, causing sweat and fatigue",
          "Better standing still in a warm room",
          "Relieved by slow motion in open cool air"
        ],
        correctIdx: 1,
        explanation: "Calcarea has a sluggish vital force that is easily exhausted and aggravated by any physical or mental exertion."
      },
      {
        question: "Which mental fear is highly characteristic of Calcarea?",
        options: [
          "Fear of poisoning by family members",
          "Fear of going insane or losing their mind",
          "Fear of standing in high places",
          "Fear of warm rooms and blankets"
        ],
        correctIdx: 1,
        explanation: "Calcarea patients suffer from a deep apprehension that they are going insane or that others will notice their mental weakness."
      }
    ],
    timeline: [
      { year: "1828", author: "Samuel Hahnemann", milestone: "Introduced Calcarea Carbonica in Chronic Diseases, proving the inner oyster shell." },
      { year: "1897", author: "H.C. Allen", milestone: "Detailed its pediatric growth delay, bone development, and egg-craving indicators." },
      { year: "1910", author: "J.T. Kent", milestone: "Sourced clinical cases linking Calcarea sluggishness with metabolic hypofunction." }
    ]
  },
  rem_lachesis: {
    remedyId: "rem_lachesis",
    label: "Lachesis Muta",
    stories: {
      title: "The Overflowing Cauldron",
      narrative: "Lachesis is the hyper-talkative, passionate, and highly suspicious character who speaks with rapid loquacity, jumping from topic to topic. She cannot stand any physical constriction—she will rip off tight collars, neckties, or waistbands because she feels suffocated by them. She is warm-blooded, congestive, and suffers from dark purple throat swelling that begins on the left side and moves to the right. Her worst time is upon waking from sleep; she wakes in a suffocative fit of panic. Physically, she is relieved by any discharge, like nosebleeds or menstruation, which releases the internal pressure of her 'compressed steam valve' constitution."
    },
    mnemonics: {
      acronym: "LACHESIS",
      lines: [
        { letter: "L", description: "Left-sided symptoms, especially throat and ovaries." },
        { letter: "A", description: "Aggravation after sleep; wakes in suffocative fits." },
        { letter: "C", description: "Constriction intolerable; cannot bear tight collars." },
        { letter: "H", description: "Hemorrhages of dark, liquid, non-coagulating blood." },
        { letter: "E", description: "Extreme loquacity, speaking rapidly with changing topics." },
        { letter: "S", description: "Suspicion, jealousy, and competitive anxiety." },
        { letter: "I", description: "Intolerance to touch or pressure, even of light clothes." },
        { letter: "S", description: "Soothed and relieved by flow of discharges." }
      ]
    },
    organAffinities: [
      { organ: "Cardiovascular", rating: 10, details: "Blood congestion, hot flushes during menopause, varicose veins, and hemorrhages." },
      { organ: "Throat", rating: 9, details: "Left-sided tonsillitis or dysphagia, throat purple and swollen, unable to swallow warm liquids." },
      { organ: "Ovaries", rating: 8, details: "Congestion and pain, especially left ovary, relieved by menses flow." },
      { organ: "Brain", rating: 9, details: "Loquacity, jealousy, nighttime mental overactivity, and suspicious panic." },
      { organ: "Skin", rating: 7, details: "Dark, bluish-purple boils, carbuncles, and septic wounds." }
    ],
    flashcards: [
      { question: "What is Lachesis's primary physical restriction keynote?", answer: "Intolerance to any tight constriction or touch, particularly around the neck (collars, ties) or waist." },
      { question: "When are Lachesis symptoms at their worst?", answer: "Immediately after sleep, or during sleep ('sleeping into an aggravation')." },
      { question: "What side-progression does Lachesis follow?", answer: "Starts on the left side of the body and moves to the right side." }
    ],
    quizzes: [
      {
        question: "Which mental theme characterizes Lachesis Muta?",
        options: [
          "Mild, yielding disposition desiring company",
          "Extreme loquacity and intense suspicion/jealousy",
          "Apprehension about business affairs and fear of poverty",
          "Sedentary ambitions supported by coffee and spices"
        ],
        correctIdx: 1,
        explanation: "Lachesis represents an intense, animalistic speed, showing rapid loquacity, jealousy, and suspicious thoughts."
      },
      {
        question: "How does Lachesis react to bodily discharges (like menses or nosebleeds)?",
        options: [
          "Discharges aggravate all physical symptoms",
          "Discharges completely relieve all congestive symptoms",
          "Discharges cause trembling and heavy eyelids",
          "Discharges have no clinical effect"
        ],
        correctIdx: 1,
        explanation: "Lachesis operates under high internal congestion, meaning any flow or discharge brings immediate relief."
      },
      {
        question: "Which throat keynote is typical of Lachesis?",
        options: [
          "Sore throat better by swallowing warm food",
          "Throat purple-red, left-sided, aggravated by swallowing warm liquids and light touch",
          "Right-sided throat pain relieved by cold drinks",
          "Tonsils covered in dry, white patches, better by swallowing"
        ],
        correctIdx: 1,
        explanation: "Lachesis throats are dark purple, left-sided, extremely sensitive to touch, and aggravated by warm liquids."
      }
    ],
    timeline: [
      { year: "1837", author: "Constantine Hering", milestone: "Proved Lachesis Muta using venom he extracted himself from a live Surukuku snake in South America." },
      { year: "1880", author: "C. Hering", milestone: "Published detailed ophidian toxicology and clinical notes in Guiding Symptoms." },
      { year: "1905", author: "J.T. Kent", milestone: "Clarified the menopausal hot flushes and sleeping-into-aggravation dynamics." }
    ]
  },
  rem_pulsatilla: {
    remedyId: "rem_pulsatilla",
    label: "Pulsatilla Pratensis",
    stories: {
      title: "The Weeping Anemone",
      narrative: "Pulsatilla is the gentle, emotional, and dependency-seeking 'windflower' that bends with every breeze. She weeps easily when telling her symptoms, but is instantly comforted by sympathy and consolation. Physically, she is warm-blooded but paradoxically thirstless, even with a dry mouth. She cannot tolerate stuffy, warm rooms, which make her feel suffocated; she constantly seeks open, cool air. Her symptoms are highly changeable—she might have joint pain that shifts from knee to elbow, or a stool that is never the same twice. Her discharges are thick, yellow-green, and bland (non-irritating)."
    },
    mnemonics: {
      acronym: "PULSATILLA",
      lines: [
        { letter: "P", description: "Pliable, gentle, and yielding disposition." },
        { letter: "U", description: "Unstable, changeable symptoms (shifting pains)." },
        { letter: "L", description: "Lacks thirst, despite dry mouth." },
        { letter: "S", description: "Soothed by consolation and gentle sympathy." },
        { letter: "A", description: "Aggravated by warm, stuffy, unventilated rooms." },
        { letter: "T", description: "Thick, yellow-green, bland discharges." },
        { letter: "I", description: "Intolerance to rich, fatty foods and pastry." },
        { letter: "L", description: "Likes slow motion in open cool air." },
        { letter: "L", description: "Lies with hands overhead during restless sleep." },
        { letter: "A", description: "Abandonment fears; clings to company." }
      ]
    },
    organAffinities: [
      { organ: "Mucous Membranes", rating: 10, details: "Thick, yellow-green, bland discharges from eyes, nose, ears, and vagina." },
      { organ: "Hormonal Axis", rating: 9, details: "Delayed, scanty, or suppressed menses, and changeable menstrual cycles." },
      { organ: "Gastrointestinal", rating: 8, details: "Slow digestion, heartburn, indigestion from fatty foods or butter." },
      { organ: "Venous System", rating: 8, details: "Venous stasis, varicose veins in legs, and swollen joints." },
      { organ: "Brain", rating: 8, details: "Emotional dependency, abandonment anxiety, weeping mood." }
    ],
    flashcards: [
      { question: "What is Pulsatilla's thermal and thirst state?", answer: "Warm-blooded (wants open cool air, aggravated by warm rooms) yet completely thirstless." },
      { question: "How does Pulsatilla react to fat and rich foods?", answer: "Highly aggravated; pastries, pork, butter, and rich foods cause indigestion and gastric sluggishness." },
      { question: "What characterizes Pulsatilla discharges?", answer: "Thick, yellow-green, and bland (non-acrid, doesn't burn the skin)." }
    ],
    quizzes: [
      {
        question: "Which of the following modalities brings relief to the Pulsatilla patient?",
        options: [
          "Hard pressure and lying on the painful side",
          "Consolation, sympathy, and slow walking in open air",
          "Hot applications and a warm closed room",
          "Profuse urination in the morning"
        ],
        correctIdx: 1,
        explanation: "Pulsatilla is strongly comforted by consolation, sympathy, and slow motion in cool open air."
      },
      {
        question: "What is a major keynote of Pulsatilla's physical pains?",
        options: [
          "Sticking pains worse from slightest movement",
          "Cramping pains relieved by short naps",
          "Changeable, shifting pains moving from joint to joint",
          "Burning pains relieved by warm wraps"
        ],
        correctIdx: 2,
        explanation: "Pulsatilla is known for changeability; pains shift rapidly from one part of the body to another."
      },
      {
        question: "Which of the following describes Pulsatilla's emotional archetype?",
        options: [
          "The Egotist Ragged Philosopher",
          "The Gentle, Clinging, Yielding Vine",
          "The Suspicious, Loquacious Competitor",
          "The Chilly, Fastidious Curator"
        ],
        correctIdx: 1,
        explanation: "Pulsatilla represents the gentle, yielding, clinging flower that needs support and consolation."
      }
    ],
    timeline: [
      { year: "1805", author: "Samuel Hahnemann", milestone: "First published provings of Pulsatilla in Fragmenta de viribus." },
      { year: "1885", author: "J.H. Clarke", milestone: "Mapped its gynecological, venous, and pediatric profiles in Dictionary." },
      { year: "1905", author: "J.T. Kent", milestone: "Synthesized the emotional dependencies and thirstless-warm modalities in lectures." }
    ]
  },
  rem_gelsemium: {
    remedyId: "rem_gelsemium",
    label: "Gelsemium Sempervirens",
    stories: {
      title: "The Paralyzed Performer",
      narrative: "Gelsemium is the student facing a major board exam, or the musician about to go on stage, who is paralyzed with fear. His muscles tremble, his eyelids droop with a heavy dullness, and his bowels suddenly purge with nervous diarrhea. When he gets the flu, he lies in bed completely motionless, apathetic, and dull. He doesn't want to speak, move, or be disturbed. He is chilly, feeling shivers run up and down his spine, but is thirstless even during a high fever. His splitting headache starts at the base of the neck (occiput) and is peculiarly relieved by a profuse flow of urine."
    },
    mnemonics: {
      acronym: "GELS",
      lines: [
        { letter: "G", description: "Grave muscular weakness, trembling, and paralysis." },
        { letter: "E", description: "Eyelids heavy and drooping (ptosis); sleepy look." },
        { letter: "L", description: "Loose bowels (diarrhea) triggered by stage fright." },
        { letter: "S", description: "Splitting occipital headache relieved by profuse urination." }
      ]
    },
    organAffinities: [
      { organ: "Nervous System", rating: 10, details: "Motor paralysis, trembling, loss of coordination, and ptosis." },
      { organ: "Musculoskeletal", rating: 9, details: "Deep muscle soreness, heavy limbs, weakness, and trembling." },
      { organ: "Brain", rating: 9, details: "Dullness, apathy, cognitive slowdown from fright or bad news." },
      { organ: "Gastrointestinal", rating: 7, details: "Nervous diarrhea from anticipatory anxiety or fear." },
      { organ: "Heart", rating: 7, details: "Feeling that the heart will stop unless the patient keeps moving." }
    ],
    flashcards: [
      { question: "What is Gelsemium's unique headache relief keynote?", answer: "Headache originating in the occiput is relieved by passing a large, profuse quantity of watery urine." },
      { question: "What are the '4 D's' of Gelsemium's clinical picture?", answer: "Dull, Drowsy, Dumb (apathetic), and Dizzy." },
      { question: "How does Gelsemium react to fright or bad news?", answer: "Triggers immediate trembling, nervous diarrhea, or mental paralysis." }
    ],
    quizzes: [
      {
        question: "Which symptom is a major keynote of Gelsemium?",
        options: [
          "Heavy eyelids (ptosis) that the patient cannot keep open",
          "Burning feet soles at night in bed",
          "Craving for soft-boiled eggs",
          "Constant ineffectual urging for stool"
        ],
        correctIdx: 0,
        explanation: "Heavy, drooping eyelids (ptosis) accompanying dullness is a classic Gelsemium signature."
      },
      {
        question: "What is Gelsemium's thirst status during acute fever?",
        options: [
          "Thirst for large quantities of cold water",
          "Thirsty for small sips frequently",
          "Thirstless, even during high heat and fever",
          "Desires warm drinks only"
        ],
        correctIdx: 2,
        explanation: "Like Pulsatilla, Gelsemium is characterized by thirstlessness during fevers and acute states."
      },
      {
        question: "Where does the Gelsemium headache typically begin?",
        options: [
          "On the right side, moving to the left",
          "In the occiput (base of skull), spreading over the head",
          "Strictly on the left forehead, worse touch",
          "Behind the eyes, relieved by cold application"
        ],
        correctIdx: 1,
        explanation: "The Gelsemium headache originates in the occiput, radiates forward to the forehead/eyes, and is relieved by urination."
      }
    ],
    timeline: [
      { year: "1852", author: "Edwin M. Hale", milestone: "Introduced Gelsemium into homoeopathic practice, documenting its neural paralysis." },
      { year: "1875", author: "T.F. Allen", milestone: "Proved and documented the Ptosis (heavy eyelids) and muscle trembling in Encyclopedia." },
      { year: "1905", author: "J.T. Kent", milestone: "Outlined the 'Dull, Drowsy, Dizzy' flu characteristics in lectures." }
    ]
  },
  rem_bryonia: {
    remedyId: "rem_bryonia",
    label: "Bryonia Alba",
    stories: {
      title: "The Dry Miser",
      narrative: "Bryonia is the irritable, practical businessman who is obsessed with financial security and talks constantly about his business affairs. When sick, his mind is consumed with a fear of poverty. He wants to lie absolutely still; the slightest motion—even moving his eyes or breathing deeply—causes intense, splitting, stitching pain. Every mucous membrane in his body is bone dry: he has dry lips, a dry painful cough where he must hold his chest to prevent movement, and a dry, hard, burnt-looking stool. He has a massive thirst for huge quantities of cold water at long intervals, and is relieved by lying directly on his painful side, which applies pressure and keeps the tissue still."
    },
    mnemonics: {
      acronym: "BRYONIA",
      lines: [
        { letter: "B", description: "Business talk; obsessed with financial security and work." },
        { letter: "R", description: "Rest absolute is required; slightest motion aggravates." },
        { letter: "Y", description: "Yearns for large quantities of cold water." },
        { letter: "O", description: "Occipital headache extending to forehead, worse moving eyes." },
        { letter: "N", description: "No moisture; extreme dryness of mucous membranes." },
        { letter: "I", description: "Intense stitching or stitching-like pains." },
        { letter: "A", description: "Ameliorated by lying on the painful side (hard pressure)." }
      ]
    },
    organAffinities: [
      { organ: "Serous Membranes", rating: 10, details: "Pleurisy, synovitis, and peritoneum inflammation with stitching pains aggravated by motion." },
      { organ: "Gastrointestinal", rating: 9, details: "Extreme dry mouth, thirst, dry burnt stools, and liver congestion." },
      { organ: "Musculoskeletal", rating: 9, details: "Joint effusion, swelling, arthritis worse from slightest motion, better pressure." },
      { organ: "Lungs", rating: 8, details: "Dry, painful cough, bronchitis, pleuro-pneumonia, holding chest." },
      { organ: "Brain", rating: 8, details: "Irritability, business worries, split headaches." }
    ],
    flashcards: [
      { question: "What is Bryonia's primary motion keynote?", answer: "Aggravated by the slightest motion; ameliorated by absolute rest." },
      { question: "How does Bryonia want to lie on the bed when in pain?", answer: "Wants to lie directly on the painful side, which applies hard pressure, restricting movement and relieving stitching pains." },
      { question: "What is Bryonia's drinking profile?", answer: "Thirsty for large quantities of cold water at long, separated intervals." }
    ],
    quizzes: [
      {
        question: "Which modality is typical of Bryonia Alba?",
        options: [
          "Better by slow motion in open cool air",
          "Better by absolute rest and hard pressure",
          "Worse lying on the painful side",
          "Worse midnight to 2 AM"
        ],
        correctIdx: 1,
        explanation: "Bryonia is relieved by absolute rest and hard pressure (which is why they lie on the painful side)."
      },
      {
        question: "What is the typical state of Bryonia's mucous membranes?",
        options: [
          "Acrid, burning, profuse watery discharges",
          "Extreme dryness of mouth, throat, lungs, and bowels",
          "Thick, yellow-green, bland discharges",
          "Bluish-purple swelling with loose secretions"
        ],
        correctIdx: 1,
        explanation: "Bryonia is characterized by complete dryness of all mucous membranes, leading to intense thirst and dry constipation."
      },
      {
        question: "What is Bryonia's dominant mental theme during illness?",
        options: [
          "Authoritarian stage fright",
          "Talks constantly of business, with a fear of poverty",
          "Gentle weeping, begging for sympathy",
          "Egotist theories and philosophical ideas"
        ],
        correctIdx: 1,
        explanation: "Even when delirious with fever, Bryonia patients talk about business and want to go home to protect their financial security."
      }
    ],
    timeline: [
      { year: "1816", author: "Samuel Hahnemann", milestone: "Proved Bryonia Alba and published it in Materia Medica Pura." },
      { year: "1880", author: "C. von Boenninghausen", milestone: "Clarified the stitching pains and rest/motion modalities in Therapeutic Pocket Book." },
      { year: "1900", author: "J.T. Kent", milestone: "Outlined the business worries and physical dryness layers in Lectures." }
    ]
  },
  rem_aconite: {
    remedyId: "rem_aconite",
    label: "Aconitum Napellus",
    stories: {
      title: "The Sudden Storm of Terror",
      narrative: "Aconite is like a violent lightning storm that comes out of nowhere. A patient is exposed to a cold, dry, biting wind, and within hours, develops a sky-high fever, dry burning skin, and an intense, agonizing panic. He is convinced he is going to die immediately, even predicting the exact hour of his death. He tosses and turns in bed in absolute restlessness. His cough is a sudden, dry, barking croup. This is Aconite—characterized by sudden onset, violent intensity, dry burning heat, and supreme mental terror."
    },
    mnemonics: {
      acronym: "ACONITE",
      lines: [
        { letter: "A", description: "Acute onset, sudden and violent in nature." },
        { letter: "C", description: "Cold dry wind exposure is the primary trigger." },
        { letter: "O", description: "Obvious panic and prediction of the hour of death." },
        { letter: "N", description: "Night aggravation, especially around midnight." },
        { letter: "I", description: "Intense restlessness, tossing, and turning." },
        { letter: "T", description: "Thirsty for large amounts of cold water." },
        { letter: "E", description: "Extreme dry burning skin with high fever." }
      ]
    },
    organAffinities: [
      { organ: "Nervous System", rating: 10, details: "Acute sensory shock, panic, neuralgia, and tingling/numbness." },
      { organ: "Cardiovascular", rating: 9, details: "Sudden congestion, tachycardia, high arterial tension, and bounding pulse." },
      { organ: "Lungs", rating: 9, details: "Acute croup, dry barking cough, and first stage of pneumonia after cold exposure." },
      { organ: "Skin", rating: 8, details: "Hot, dry, burning skin without sweat during fever." },
      { organ: "Brain", rating: 9, details: "Agony of mind, fear of death, and violent restlessness." }
    ],
    flashcards: [
      { question: "What is the primary etiology (cause) of Aconite symptoms?", answer: "Exposure to dry, cold, biting winds or sudden emotional shock/fright." },
      { question: "What is the extreme mental symptom of Aconite?", answer: "Agonizing fear of immediate death; the patient predicts the exact hour or day they will die." },
      { question: "What characterizes Aconite fevers?", answer: "Sudden onset, dry burning heat, hot skin, bounding pulse, thirst, and intense restlessness, but NO sweat." }
    ],
    quizzes: [
      {
        question: "Which of the following describes the typical onset of Aconite?",
        options: [
          "Slow and insidious, developing over weeks",
          "Sudden, violent, and storm-like, coming on within hours",
          "Periodic, returning every afternoon at 4 PM",
          "Changeable, moving from left to right"
        ],
        correctIdx: 1,
        explanation: "Aconite symptoms come on with extreme suddenness and violence, like a sudden storm."
      },
      {
        question: "What is the state of the skin during an Aconite fever?",
        options: [
          "Profuse sweat around the back of the neck",
          "Cold, clammy, and covered in blue spots",
          "Hot, dry, and burning, with NO sweat",
          "Damp with thick yellow discharges"
        ],
        correctIdx: 2,
        explanation: "During Aconite's high fever phase, the skin is dry, hot, and burning, and sweat is absent. Sweating brings immediate relief and signals the end of the Aconite stage."
      },
      {
        question: "What is Aconite's reaction to dry, cold winds?",
        options: [
          "Ameliorated by cold winds",
          "Aggravated; dry, cold wind is the primary trigger of Aconite acute conditions",
          "Causes left-sided tonsillitis moving right",
          "Relieves the splitting occipital headache"
        ],
        correctIdx: 1,
        explanation: "Exposure to dry cold wind is a classic etiologic trigger for Aconite inflammatory and nervous episodes."
      }
    ],
    timeline: [
      { year: "1805", author: "Samuel Hahnemann", milestone: "Proved Aconitum Napellus and published it in Fragmenta, establishing it as the first acute remedy." },
      { year: "1870", author: "A. Lippe", milestone: "Clarified the differentiation between Aconite (dry wind) and Gelsemium (damp heat) flu profiles." },
      { year: "1905", author: "J.T. Kent", milestone: "Emphasized the cardiovascular tension and mental agony keynote in lectures." }
    ]
  }
};

export const parseLearningTutorQuery = (queryText: string): { 
  interpretedQuery: string; 
  remedyId: string; 
  mode: string; 
  content: string; 
  quizData?: QuizQuestion[];
} => {
  const norm = queryText.toLowerCase().trim();
  const graph = getKnowledgeGraph();
  
  // Find remedy mentioned
  let remedyId = "rem_sulphur"; // default
  let label = "Sulphur";
  
  const remediesList = graph.nodes.filter(n => n.type === 'remedy');
  for (const rem of remediesList) {
    if (norm.includes(rem.label.toLowerCase()) || 
        (rem.label === "Lycopodium Clavatum" && norm.includes("lycopodium")) ||
        (rem.label === "Arsenicum Album" && norm.includes("arsenicum")) ||
        (rem.label === "Aconitum Napellus" && norm.includes("aconite")) ||
        (rem.label === "Calcarea Carbonica" && norm.includes("calcarea")) ||
        (rem.label === "Pulsatilla Pratensis" && norm.includes("pulsatilla")) ||
        (rem.label === "Gelsemium Sempervirens" && norm.includes("gelsemium")) ||
        (rem.label === "Lachesis Muta" && norm.includes("lachesis"))
    ) {
      remedyId = rem.id;
      label = rem.label;
      break;
    }
  }

  const db = REMEDY_LEARNING_DB[remedyId] || REMEDY_LEARNING_DB.rem_sulphur;

  // 1. Quiz Me On...
  if (norm.includes('quiz') || norm.includes('test')) {
    return {
      interpretedQuery: `Active Tutor Session: Quiz mode triggered for ${label}`,
      remedyId,
      mode: "quiz",
      content: `Let's test your clinical knowledge on <strong>${label}</strong>! I have loaded 3 questions based on keynotes, modalities, and relationships. Select an answer below to verify.`,
      quizData: db.quizzes
    };
  }

  // 2. Compare...
  if (norm.includes('compare') || norm.includes('versus') || norm.includes('vs')) {
    // Look for second remedy
    let secondLabel = "Lycopodium";
    let secondId = "rem_lycopodium";
    for (const rem of remediesList) {
      if (rem.id !== remedyId && (norm.includes(rem.label.toLowerCase()) || 
          (rem.label === "Lycopodium Clavatum" && norm.includes("lycopodium")) ||
          (rem.label === "Arsenicum Album" && norm.includes("arsenicum")) ||
          (rem.label === "Aconitum Napellus" && norm.includes("aconite")) ||
          (rem.label === "Calcarea Carbonica" && norm.includes("calcarea")) ||
          (rem.label === "Pulsatilla Pratensis" && norm.includes("pulsatilla")) ||
          (rem.label === "Gelsemium Sempervirens" && norm.includes("gelsemium")) ||
          (rem.label === "Lachesis Muta" && norm.includes("lachesis")))
      ) {
        secondId = rem.id;
        secondLabel = rem.label;
        break;
      }
    }
    
    const db2 = REMEDY_LEARNING_DB[secondId] || REMEDY_LEARNING_DB.rem_lycopodium;
    const diff1 = graph.nodes.find(n => n.id === remedyId)?.metadata?.profile;
    const diff2 = graph.nodes.find(n => n.id === secondId)?.metadata?.profile;

    return {
      interpretedQuery: `Active Tutor Session: Comparative Differential generated`,
      remedyId,
      mode: "comparison",
      content: `
        <div class="space-y-4">
          <p>Analyzing comparative monographs for <strong>${label}</strong> vs <strong>${secondLabel}</strong>:</p>
          <div class="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-900">
            <div>
              <h4 class="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-1 mb-2">${label}</h4>
              <p class="text-[10px]"><strong class="text-slate-400">Kingdom/Family:</strong> ${diff1?.kingdom} (${diff1?.family})</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Thermals:</strong> ${diff1?.thermals}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Miasms:</strong> ${diff1?.miasms.join(", ")}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Keynotes:</strong> ${db.flashcards[0].answer}</p>
            </div>
            <div>
              <h4 class="text-xs font-bold text-violet-400 border-b border-slate-800 pb-1 mb-2">${secondLabel}</h4>
              <p class="text-[10px]"><strong class="text-slate-400">Kingdom/Family:</strong> ${diff2?.kingdom} (${diff2?.family})</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Thermals:</strong> ${diff2?.thermals}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Miasms:</strong> ${diff2?.miasms.join(", ")}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Keynotes:</strong> ${db2.flashcards[0].answer}</p>
            </div>
          </div>
          <p class="text-[10px] leading-relaxed text-slate-400 italic">
            * Clinical Hint: Choose ${label} when matching ${db.flashcards[1].question.split(' ').slice(0, 4).join(' ')} -> ${db.flashcards[1].answer.substring(0, 30)}. Consider ${secondLabel} when matching ${db2.flashcards[1].question.split(' ').slice(0, 4).join(' ')} -> ${db2.flashcards[1].answer.substring(0, 30)}.
          </p>
        </div>
      `
    };
  }

  // 3. Explain like a professor...
  if (norm.includes('professor') || norm.includes('explain') || norm.includes('teach')) {
    const profArchetypes: Record<string, string> = {
      rem_sulphur: "Professor Hahnemann III: 'Aha! Class, pay attention. Sulphur represents the absolute expansion of the ego. This is a ragged philosopher who spends his last copper on books while wearing dirty shirts. Note the gastric stasis at 11 AM, burning soles, and skin eruptions that flare up when warm under bedclothes!'",
      rem_lycopodium: "Professor Lycopodium: 'Notice, class, how Lycopodium Clavatum acts as a shield for weak confidence. Underneath the authoritative, bossy exterior lies a child afraid of stage fright. He suffers from right-sided throat blockages and immediate gas bloating after eating! Chilly but demands cool air.'",
      rem_nux_vomica: "Professor Nux: 'Ah! Here we have the modern office workaholic. Driven, high-strung, irritable. Constipation with a constant, ineffectual urging that is spastic in nature. He cannot stand cold drafts, but a 10-minute nap clears his mind entirely. Excellent anti-spasmodic!'",
      rem_arsenicum: "Professor Arsenic: 'Observe the fastidious curator! Terrified of infection, germs, and death. Restless pacing but physically exhausted. Burning pains (like hot coals) that are paradoxically relieved by warm wraps. Thirst for small sips frequents.'"
    };

    const profExplanation = profArchetypes[remedyId] || `Professor Hahnemann: 'Let us discuss ${label}. A profound polychrest representing a unique vital force disturbance. Focus on its keynotes, thermals, and organ affinities. It relates closely to its plant/mineral relatives and responds well to careful potencies.'`;

    return {
      interpretedQuery: `Active Tutor Session: Professorial Explanation Mode`,
      remedyId,
      mode: "story",
      content: `
        <div class="space-y-3 font-serif">
          <p class="italic text-emerald-400 text-xs font-semibold">${profExplanation}</p>
          <div class="text-[10px] text-slate-400 font-sans border-t border-slate-900 pt-2 leading-relaxed">
            <strong>Professor's Academic Summary:</strong> ${db.stories.narrative}
          </div>
        </div>
      `
    };
  }

  // 4. Default: Complete Drug Picture
  const node = graph.nodes.find(n => n.id === remedyId);
  const profile = node?.metadata?.profile;
  return {
    interpretedQuery: `Active Tutor Session: Complete Drug Picture of ${label}`,
    remedyId,
    mode: "clinical",
    content: `
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-emerald-400 border-b border-slate-900 pb-1 uppercase tracking-wider">Drug Picture: ${label}</h4>
        <p class="text-[10.5px] leading-relaxed"><strong class="text-slate-300">Essence:</strong> ${profile?.essence}</p>
        <p class="text-[10px]"><strong class="text-slate-400">Kingdom / Family:</strong> ${profile?.kingdom} / ${profile?.family}</p>
        <p class="text-[10px]"><strong class="text-slate-400">Miasmatic Focus:</strong> ${profile?.miasms.join(", ")}</p>
        <p class="text-[10px]"><strong class="text-slate-400">Thermal Axis:</strong> ${profile?.thermals}</p>
        
        <div class="grid grid-cols-2 gap-2 text-[9.5px] pt-1">
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
            <span className="font-extrabold text-emerald-400 uppercase tracking-widest text-[8px] block mb-1">Mental Themes</span>
            <ul class="list-disc pl-3.5 space-y-0.5 text-slate-400">
              ${profile?.mentalThemes.slice(0, 3).map(m => `<li>${m}</li>`).join("")}
            </ul>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
            <span className="font-extrabold text-emerald-400 uppercase tracking-widest text-[8px] block mb-1">Keynotes</span>
            <ul class="list-disc pl-3.5 space-y-0.5 text-slate-400">
              ${profile?.keynotes.slice(0, 3).map(k => `<li>${k}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    `
  };
};
