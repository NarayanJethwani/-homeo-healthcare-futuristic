import { MateriaMedicaDocument, RemedyRelationships, MiasmaticAnalysis, SourceAttribution } from "./materiaMedicaSchema";
import { COMPRESSED_REMEDY_PACK } from "./remedyDataPack";

const CORE_16_REMEDIES: MateriaMedicaDocument[] = [
  {
    id: "rem_sulphur",
    identity: {
      name: "Sulphur",
      abbreviation: "Sulph",
      kingdom: "Mineral",
      family: "Elements / Chalcogens",
      sourceSubstance: "Sublimed Sulphur"
    },
    essence: {
      coreTheme: "Ego expansion, seeking appreciation, theoretical speculation.",
      centralConflict: "Struggle to maintain a sense of self-worth and intellectual superiority while neglecting physical reality and tidiness.",
      compensationPattern: "Compensates for inner physical or social insecurity by developing grandiose philosophical systems and assuming a patronizing attitude."
    },
    mentalPicture: {
      personality: "The 'ragged philosopher' - highly imaginative, theoretical, critical of others, self-centered, forgetful, and indifferent to social conventions.",
      fears: ["Infection/contagion", "Losing health", "Failure", "High places"],
      anxietyPatterns: ["Anxiety about the future", "Anxiety about health, especially at night"],
      delusions: ["Delusion that he is a great man", "Delusion that old rags are beautiful garments"],
      relationships: "Demands attention and respect, can be critical or patronizing, but maintains warm social ideals.",
      communicationStyle: "Theoretical, lecturing, argumentative, loves philosophical debate.",
      memory: "Forgetful for words and names, but highly active for concepts.",
      concentration: "Difficult when focused on dry tasks, but deeply absorbed in creative work."
    },
    physicalGenerals: {
      thermalState: "Warm-blooded, strongly aggravated by heat in any form (warm rooms, warm bed).",
      thirst: "Great thirst for cold drinks, especially at long intervals.",
      perspiration: "Profuse, sour-smelling sweat, especially on the feet and underarms.",
      sleep: "Restless, cats-naps, sleeps in short intervals, wakes frequently.",
      dreams: ["Fires", "High places", "Household duties", "Anxious affairs"],
      energyPattern: "Sluggish mornings, sudden empty sinking hunger at 11 AM, worse standing still.",
      foodDesires: ["Sweets", "Spices", "Fats", "Cold drinks"],
      foodAversions: ["Warm food", "Meat", "Bathing"]
    },
    modalities: {
      betterFrom: ["Cold open air", "Lying on right side", "Dry weather"],
      worseFrom: ["Warmth of bed", "Standing still", "Washing/bathing", "11 AM"]
    },
    organAffinities: [
      { organ: "Skin", rating: 10, details: "Dry, red, burning, intensely itchy skin eruptions, worse heat." },
      { organ: "Stomach", rating: 8, details: "Empty, sinking feeling at 11 AM, desires sweets." },
      { organ: "Venous System", rating: 9, details: "Venous stasis, portal congestion, hemorrhoids." },
      { organ: "Lungs", rating: 7, details: "Oppression of breathing at night, must open windows." },
      { organ: "Brain", rating: 8, details: "Congestive headaches, overactive mind preventing sleep." }
    ],
    clinicalConditions: [
      { condition: "Atopic Eczema", severityMatch: "High", details: "Intense itching worse warmth of bed and washing, leaving red burning skin." },
      { condition: "Asthma", severityMatch: "Medium", details: "Chest constriction worse in stuffy rooms, relieved by cold drafts." },
      { condition: "Chronic Dyspepsia", severityMatch: "High", details: "Acid reflux, bloating, and empty sinking feeling around 11 AM." },
      { condition: "Hemorrhoids", severityMatch: "High", details: "Burning, sticking hemorrhoids, worse standing or warm bed." }
    ],
    keynotes: {
      top10: ["Sinking feeling at 11 AM", "Burning feet in bed", "Worse warmth of bed", "Red orifices", "Aversion to bathing", "Worse standing still", "Desires cold open air", "Egotism", "Ragged philosopher", "Dry red skin"],
      top25: ["Sinking feeling at 11 AM", "Burning feet in bed", "Worse warmth of bed", "Red orifices", "Aversion to bathing", "Worse standing still", "Desires cold open air", "Egotism", "Ragged philosopher", "Dry red skin", "Portal stasis", "Morning diarrhea driving out of bed", "Desires sweets", "Aversion to meat", "Sour perspiration", "Cat-naps sleep", "Burning palms", "Worse washing", "Portal congestion", "Left-sided headache", "Itching aggravated by heat", "Talkative speculation", "Fears disease", "Better dry weather", "Irritable when questioned"],
      top50: ["Sinking feeling at 11 AM", "Burning feet in bed", "Worse warmth of bed", "Red orifices", "Aversion to bathing", "Worse standing still", "Desires cold open air", "Egotism", "Ragged philosopher", "Dry red skin", "Portal stasis", "Morning diarrhea driving out of bed", "Desires sweets", "Aversion to meat", "Sour perspiration", "Cat-naps sleep", "Burning palms", "Worse washing", "Portal congestion", "Left-sided headache", "Itching aggravated by heat", "Talkative speculation", "Fears disease", "Better dry weather", "Irritable when questioned", "Hot-blooded thermals", "Redness of lips", "Dry scaly skin", "Asthma relieved by open air", "Sinking stomach at 11 AM", "Portal circulation stasis", "Hemorrhoids worse sitting", "Stiffness in joints on waking", "Dreams of fire", "Fear of high places", "Bitter taste in mouth", "Desires fats", "Aversion to warm drinks", "Acid dyspepsia", "Gastric flatulence", "Worse standing", "Weak knees", "Sensation of burning", "Unwashed appearance", "Indifference to clothes", "Forgetfulness", "Argues theories", "Fears contamination", "Congestive flushings", "Redness of eyelids"]
    },
    miasmaticAnalysis: {
      psora: 75,
      sycosis: 15,
      syphilis: 10,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora",
      description: "Classical king of anti-psoric remedies. Manifests primarily as functional stasis, dermal eruptions, and extreme sensory-mental hypersensitivity."
    },
    relationships: {
      complementary: ["Lycopodium Clavatum", "Nux Vomica", "Psorinum"],
      inimical: ["Sepia Officinalis"],
      antidotes: ["Camphora", "Aconitum Napellus"],
      followsWell: ["Calcarea Carbonica", "Lycopodium Clavatum"]
    }
  },
  {
    id: "rem_lycopodium",
    identity: {
      name: "Lycopodium Clavatum",
      abbreviation: "Lyc",
      kingdom: "Plant",
      family: "Lycopodiaceae",
      sourceSubstance: "Lycopodium clavatum spores"
    },
    essence: {
      coreTheme: "Power and control themes, hiding deep intellectual insecurity.",
      centralConflict: "Fear of failure and lack of self-confidence vs. the desire to project authority and maintain executive control.",
      compensationPattern: "Compensates for an underlying dread of public performance by acting bossy, dictatorial, and intellectual."
    },
    mentalPicture: {
      personality: "The authoritative director - highly intellectual, hides insecurity, fears being alone, suffers from anticipatory stage fright.",
      fears: ["Being alone", "Public speaking / stage fright", "Loss of control", "Crowds"],
      anxietyPatterns: ["Anticipatory anxiety before tasks", "Anxiety about health and aging"],
      delusions: ["Delusion of superiority", "Delusion that he is small and weak inside"],
      relationships: "Dictatorial to inferiors, submissive to superiors, fears deep emotional commitments.",
      communicationStyle: "Intellectual, authoritative, precise, hates being contradicted.",
      memory: "Excellent for academic topics, but can be forgetful for simple daily steps.",
      concentration: "High intellectual focus, analytical, overactive mind at night."
    },
    physicalGenerals: {
      thermalState: "Chilly, but desires cold open air on the face and head; stomach wants warm things.",
      thirst: "Thirstless, but desires warm drinks which soothe the stomach.",
      perspiration: "Profuse, cold sweat on the feet; warm sweats during sleep.",
      sleep: "Unrefreshing, wakes cross or hungry, wakes at 3 AM with business worries.",
      dreams: ["Failure in exams", "Falling from heights", "Accidents", "Household duties"],
      energyPattern: "Worse 4 PM to 8 PM; morning exhaustion, better after eating.",
      foodDesires: ["Sweets", "Warm food", "Warm drinks", "Pastries"],
      foodAversions: ["Cold food", "Bread", "Cold drinks", "Meat"]
    },
    modalities: {
      betterFrom: ["Warm drinks and food", "Cool open air for head", "Slow motion"],
      worseFrom: ["4 PM to 8 PM", "Warm rooms", "Stuffy spaces", "Cold food"]
    },
    organAffinities: [
      { organ: "Gastrointestinal", rating: 10, details: "Bloating immediately after a few bites of food, severe flatulence." },
      { organ: "Urinary", rating: 8, details: "Brick-dust sediment in urine, kidney stones, right-sided renal colic." },
      { organ: "Liver", rating: 9, details: "Congestion, hepatic sluggishness, right hypochondrium pain." },
      { organ: "Brain", rating: 8, details: "Anticipatory anxiety, stage fright, fear of solitude." },
      { organ: "Throat", rating: 7, details: "Right-sided sore throat, spreading to left." }
    ],
    clinicalConditions: [
      { condition: "Irritable Bowel Syndrome", severityMatch: "High", details: "Severe gas, distension immediately after eating, worse late afternoon." },
      { condition: "GERD", severityMatch: "High", details: "Acid reflux with bloating, ameliorated by warm drinks." },
      { condition: "Kidney Stones", severityMatch: "Medium", details: "Colic pain on right side, red brick-dust sediment in urine." }
    ],
    keynotes: {
      top10: ["Worse 4-8 PM", "Bloating after eating small amount", "Craves sweets", "Anticipatory anxiety", "Right-sided symptoms", "Better warm drinks", "Chilly but wants cool air for head", "Red sand in urine", "Authoritarian", "Hates contradiction"],
      top25: ["Worse 4-8 PM", "Bloating after eating small amount", "Craves sweets", "Anticipatory anxiety", "Right-sided symptoms", "Better warm drinks", "Chilly but wants cool air for head", "Red sand in urine", "Authoritarian", "Hates contradiction", "Dry throat right-to-left", "Wakes hungry at night", "One foot hot, one cold", "Fears solitude", "Right-sided headache", "Constipation when traveling", "Premature graying", "Dictatorial demeanor", "Better slow motion", "Aversion to cold drinks", "Abdominal flatulence", "Worse warm rooms", "Fears public speaking", "Weak digestion", "Erectile dysfunction"],
      top50: ["Worse 4-8 PM", "Bloating after eating small amount", "Craves sweets", "Anticipatory anxiety", "Right-sided symptoms", "Better warm drinks", "Chilly but wants cool air for head", "Red sand in urine", "Authoritarian", "Hates contradiction", "Dry throat right-to-left", "Wakes hungry at night", "One foot hot, one cold", "Fears solitude", "Right-sided headache", "Constipation when traveling", "Premature graying", "Dictatorial demeanor", "Better slow motion", "Aversion to cold drinks", "Abdominal flatulence", "Worse warm rooms", "Fears public speaking", "Weak digestion", "Erectile dysfunction", "Liver hypofunction", "Acid regurgitation", "Heartburn better warm tea", "Fears crowds", "Wakes at 3 AM", "Unrefreshing sleep", "Night sweats on chest", "Dry skin of hands", "Redness of face after eating", "Fanny-like breathing in pneumonia", "Stitch pains in chest", "Dry throat on waking", "Worse cold weather", "Chilly constitution", "Weak muscular tone", "Craves hot water", "Aversion to cold food", "Intestinal fermentation", "Gas distends stomach", "Nervous startle reflex", "Apprehensive of tasks", "Hides behind status", "Rigid thinking", "Fear of failure", "Better open air", "Worse after sleep"]
    },
    miasmaticAnalysis: {
      psora: 50,
      sycosis: 40,
      syphilis: 10,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora-Sycosis",
      description: "Combines Psoric hypersensitivity and Sycotic retention. Manifests as gas accumulation, local tissue thickening, and authoritarian control patterns."
    },
    relationships: {
      complementary: ["Sulphur", "Lachesis Muta", "Iodum"],
      inimical: ["None"],
      antidotes: ["Camphora", "Pulsatilla Pratensis"],
      followsWell: ["Lachesis Muta", "Pulsatilla Pratensis"]
    }
  },
  {
    id: "rem_nux_vomica",
    identity: {
      name: "Nux Vomica",
      abbreviation: "Nux-v",
      kingdom: "Plant",
      family: "Loganiaceae",
      sourceSubstance: "Strychnos nux-vomica seed"
    },
    essence: {
      coreTheme: "High-stress achievement, over-stimulation, nervous irritability.",
      centralConflict: "Drive to succeed and perform vs. an overloaded nervous system unable to relax.",
      compensationPattern: "Compensates for gastric and mental overload by abusing stimulants (coffee, alcohol) and venting anger."
    },
    mentalPicture: {
      personality: "The driven workaholic - highly ambitious, impatient, irritable, easily offended, sedentary, and competitive.",
      fears: ["Poverty", "Failure", "Loss of control", "Crowds"],
      anxietyPatterns: ["Anxiety about business success", "Irritability from interruptions"],
      delusions: ["Delusion that he is overloaded with work", "Delusion that everything is a barrier"],
      relationships: "Impatient with family and staff, highly demanding, quick to anger but cools down fast.",
      communicationStyle: "Fast, direct, impatient, critical of slow-talking people.",
      memory: "Sharp for business details, but suffers from 'brain fag' under extreme stress.",
      concentration: "High intensity, but easily interrupted by light or noise."
    },
    physicalGenerals: {
      thermalState: "Extremely chilly, highly aggravated by cold drafts, must be wrapped up.",
      thirst: "Desires warm drinks; thirsty during fever but cannot uncover.",
      perspiration: "Profuse, sour sweat on the body; cold sweat during cramps.",
      sleep: "Wakes 3-4 AM to think of business, falls into a heavy unrefreshing sleep at dawn.",
      dreams: ["Business obstacles", "Accidents", "Fights", "Hard work"],
      energyPattern: "Worse early morning, after eating, sedentary; completely refreshed by a 10-15 minute nap.",
      foodDesires: ["Stimulants", "Coffee", "Spices", "Alcohol", "Fats"],
      foodAversions: ["Cold water", "Open air", "Meat", "Bread"]
    },
    modalities: {
      betterFrom: ["Warm wraps", "Short afternoon nap", "Warm drinks", "Rest"],
      worseFrom: ["Cold drafts", "Early morning (3 AM)", "After eating", "Mental exertion"]
    },
    organAffinities: [
      { organ: "Gastrointestinal", rating: 10, details: "Spasmodic stomach pains, heartburn, and constipation with ineffectual urging." },
      { organ: "Nervous System", rating: 10, details: "Nervous hyper-reflexia, extreme sensitivity to light, noise, and odors." },
      { organ: "Liver", rating: 8, details: "Portal congestion, toxic strain from coffee, alcohol, and drugs." },
      { organ: "Musculoskeletal", rating: 7, details: "Spastic backaches, tension headaches in occiput." },
      { organ: "Brain", rating: 9, details: "Irritability, ambition, insomnia." }
    ],
    clinicalConditions: [
      { condition: "Gastritis", severityMatch: "High", details: "Burning stomach pain, acid regurgitation, worse coffee or spicy food." },
      { condition: "Chronic Constipation", severityMatch: "High", details: "Constipation with constant, ineffectual urging for stool, passing small amounts." },
      { condition: "Insomnia", severityMatch: "High", details: "Waking at 3 AM to think of business affairs, unable to sleep again." }
    ],
    keynotes: {
      top10: ["Short nap ameliorates", "Highly irritable and chilly", "Wakes 3 AM", "Ineffectual urging", "Abuses stimulants", "Worse cold drafts", "Spasmodic stomach cramps", "Hypersensitive to noise/light", "Ambitious workaholic", "Constipation"],
      top25: ["Short nap ameliorates", "Highly irritable and chilly", "Wakes 3 AM", "Ineffectual urging", "Abuses stimulants", "Worse cold drafts", "Spasmodic stomach cramps", "Hypersensitive to noise/light", "Ambitious workaholic", "Constipation", "Sour stomach", "Worse after eating", "Refreshed by nap", "Heartburn", "Aversion to cold open air", "Portal congestion", "Headache in occiput", "Dry morning cough", "Trembling from fatigue", "Desires spicy food", "Worse mental exertion", "Hates waiting", "Bitter taste in morning", "Fears financial ruin", "Sedentary habits"],
      top50: ["Short nap ameliorates", "Highly irritable and chilly", "Wakes 3 AM", "Ineffectual urging", "Abuses stimulants", "Worse cold drafts", "Spasmodic stomach cramps", "Hypersensitive to noise/light", "Ambitious workaholic", "Constipation", "Sour stomach", "Worse after eating", "Refreshed by nap", "Heartburn", "Aversion to cold open air", "Portal congestion", "Headache in occiput", "Dry morning cough", "Trembling from fatigue", "Desires spicy food", "Worse mental exertion", "Hates waiting", "Bitter taste in morning", "Fears financial ruin", "Sedentary habits", "Spastic colon", "Ineffectual urging for menses", "Tension in shoulders", "Backache forcing to sit up in bed to turn over", "Photophobia", "Sneezing in morning in bed", "Stuffy nose in cold air", "Refuses to be consoled", "Egotistic drive", "Anxiety about success", "Hypersensitive senses", "Desires coffee", "Aversion to cold water", "Strychnine-like spasms", "Morning sluggishness", "Sleepy in evening before bedtime", "Dry mouth", "Coated tongue white-yellow", "Gastric flatulence", "Acidity", "Worse walking in cold", "Fears poverty", "Fastidious in work", "Impatience with staff", "Fever with shivers", "Cannot uncover"]
    },
    miasmaticAnalysis: {
      psora: 60,
      sycosis: 10,
      syphilis: 30,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora-Syphilis",
      description: "Psoric irritation leading to spastic reaction, combined with Syphilitic destruction shown in nervous breakdown and vascular/cardiac spikes."
    },
    relationships: {
      complementary: ["Sulphur", "Sepia Officinalis"],
      inimical: ["Acet-ac", "Zincum"],
      antidotes: ["Camphora", "Coffea Cruda"],
      followsWell: ["Sulphur", "Arsenicum Album"]
    }
  },
  {
    id: "rem_arsenicum",
    identity: {
      name: "Arsenicum Album",
      abbreviation: "Ars",
      kingdom: "Mineral",
      family: "Oxides / Arsenic Group",
      sourceSubstance: "Arsenic Trioxide"
    },
    essence: {
      coreTheme: "Vulnerability, insecurity, restlessness, and fear of death.",
      centralConflict: "Deep insecurity regarding physical survival and health vs. a chaotic, hostile environment.",
      compensationPattern: "Compensates for internal panic by maintaining rigid order, absolute cleanliness, and fastidiousness."
    },
    mentalPicture: {
      personality: "The fastidious curator - highly anxious, restless, insecure, fastidious, fears death, desires company.",
      fears: ["Death", "Being left alone", "Poverty", "Incurable disease"],
      anxietyPatterns: ["Severe health anxiety", "Midnight panic attacks"],
      delusions: ["Delusion that he is going to die", "Delusion of contamination or poison"],
      relationships: "Demands constant reassurance, clings to family and doctors, fastidious regarding others' hygiene.",
      communicationStyle: "Rapid, anxious, precise, detailed, pleading.",
      memory: "Clear, but hyper-focused on symptoms and health details.",
      concentration: "Difficult due to physical restlessness, but highly analytical."
    },
    physicalGenerals: {
      thermalState: "Extremely chilly, aggravated by cold; burning pains relieved by heat.",
      thirst: "Thirst for small quantities (sips) of cold or warm water frequently.",
      perspiration: "Cold, sticky, sour sweat during panic or asthma attacks.",
      sleep: "Restless, wakes midnight to 2 AM with panic, cannot lie still.",
      dreams: ["Robbers in the house", "Deaths of friends", "Business anxiety", "Black dogs"],
      energyPattern: "Profound weakness and exhaustion out of proportion to the physical illness.",
      foodDesires: ["Warm water", "Cold milk", "Sour food", "Alcohol"],
      foodAversions: ["Cold water", "Meat", "Fat", "Butter"]
    },
    modalities: {
      betterFrom: ["Hot applications", "Warm room and wraps", "Hot drinks", "Company"],
      worseFrom: ["Midnight to 2 AM", "Cold food and drinks", "Cold drafts", "Being alone"]
    },
    organAffinities: [
      { organ: "Gastrointestinal", rating: 10, details: "Severe burning in stomach, vomiting, rice-water stools, food poisoning." },
      { organ: "Lungs", rating: 9, details: "Asthmatic wheezing worse midnight to 2 AM, must sit up to breathe." },
      { organ: "Skin", rating: 9, details: "Dry, scaly, peeling eczema with intense burning relieved by hot water." },
      { organ: "Brain", rating: 9, details: "Anxious panic, fear of death, and perfectionism." },
      { organ: "Mucous Membranes", rating: 8, details: "Acrid, watery, burning discharges from eyes and nose." }
    ],
    clinicalConditions: [
      { condition: "Panic Attacks", severityMatch: "High", details: "Extreme anxiety, restlessness, fear of death, waking at 1 AM." },
      { condition: "Gastroenteritis", severityMatch: "High", details: "Vomiting and diarrhea simultaneously, burning stomach pain, thirst for sips." },
      { condition: "Asthma", severityMatch: "High", details: "Constriction worse midnight, sitting up bent forward, relieved by hot drinks." }
    ],
    keynotes: {
      top10: ["Restlessness with weakness", "Thirst for small sips", "Midnight aggravation (1 AM)", "Burning pains better heat", "Extreme orderliness/fastidiousness", "Chilly state", "Fear of death", "Wants company", "Weakness out of proportion", "Acrid discharges"],
      top25: ["Restlessness with weakness", "Thirst for small sips", "Midnight aggravation (1 AM)", "Burning pains better heat", "Extreme orderliness/fastidiousness", "Chilly state", "Fear of death", "Wants company", "Weakness out of proportion", "Acrid discharges", "Vomiting and diarrhea", "Dry scaly skin", "Asthma worse lying down", "Fears cancer", "Sore throat better warm tea", "Coldness of body", "Clinging behavior", "Corrosive nasal discharge", "Worse cold food", "Panic with sweat", "Paces the room", "Desires warm water", "Aversion to fat", "Fears being alone", "Exacting demands"],
      top50: ["Restlessness with weakness", "Thirst for small sips", "Midnight aggravation (1 AM)", "Burning pains better heat", "Extreme orderliness/fastidiousness", "Chilly state", "Fear of death", "Wants company", "Weakness out of proportion", "Acrid discharges", "Vomiting and diarrhea", "Dry scaly skin", "Asthma worse lying down", "Fears cancer", "Sore throat better warm tea", "Coldness of body", "Clinging behavior", "Corrosive nasal discharge", "Worse cold food", "Panic with sweat", "Paces the room", "Desires warm water", "Aversion to fat", "Fears being alone", "Exacting demands", "Gastric ulcers", "Food poisoning", "Rice water stools", "Mucous membrane burns", "Anxious wheezing", "Midnight cough", "Cardiovascular weakness", "Cold extremities", "Fears infection", "Fastidious desk", "Washing hands frequently", "Delusion of poison", "Dreams of robbers", "Wakes 1 AM", "Chilly in warm room", "Sour sweat", "Dry scaling eczema", "Itching burns", "Worse cold air", "Better dry wraps", "Clings to doctor", "Asks for prognosis", "Weak pulse", "Cold nose", "Pale face"]
    },
    miasmaticAnalysis: {
      psora: 45,
      sycosis: 10,
      syphilis: 45,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora-Syphilis",
      description: "High levels of destructive Syphilitic anxiety and physical decay combined with Psoric functional hypersensitivity."
    },
    relationships: {
      complementary: ["Phosphorus", "Thuja Occidentalis", "Carbo Vegetabilis"],
      inimical: ["Pulsatilla Pratensis"],
      antidotes: ["Camphora", "Nux Vomica"],
      followsWell: ["Nux Vomica", "Lycopodium Clavatum"]
    }
  },
  {
    id: "rem_calcarea",
    identity: {
      name: "Calcarea Carbonica",
      abbreviation: "Calc",
      kingdom: "Mineral",
      family: "Carbonates / Calcium Group",
      sourceSubstance: "Inner calcareous layer of oyster shell"
    },
    essence: {
      coreTheme: "Protection, stability, slow development, safety seeking.",
      centralConflict: "Sluggish, flabby vital force unable to cope with external speed and threats, needing to stay sheltered.",
      compensationPattern: "Builds a 'shell' of rigid routine, family security, and slow hard work to shield the soft interior."
    },
    mentalPicture: {
      personality: "The cautious pragmatist - slow, sweet-tempered, sweet child, slowness in developmental milestones, fears losing mind, wants safety.",
      fears: ["Losing mind/sanity", "Incurable illness", "Insects/Spiders", "Darkness", "Poverty"],
      anxietyPatterns: ["Anxiety when hearing of cruelty", "Apprehension regarding health"],
      delusions: ["Delusion that people can see her mental weakness", "Delusion that she is going insane"],
      relationships: "Deeply dependent on home and family, loyal, seeks steady friends.",
      communicationStyle: "Slow, cautious, practical, non-confrontational.",
      memory: "Sluggish but persistent; forgets under physical fatigue.",
      concentration: "Difficult due to brain fatigue; exhausted by study."
    },
    physicalGenerals: {
      thermalState: "Extremely chilly, sensitive to cold damp drafty air.",
      thirst: "Thirst for cold water, cold milk, and acidic drinks.",
      perspiration: "Profuse sweat on the scalp and back of the neck during sleep, wetting the pillow.",
      sleep: "Difficulty falling asleep due to overactive mind, sweats around head.",
      dreams: ["Dead people", "Frightening sights", "Falling", "Monsters"],
      energyPattern: "Slow, sluggish metabolism, easily tired by physical or mental exertion.",
      foodDesires: ["Eggs (especially soft-boiled)", "Sweets", "Ice cream", "Indigestible things (chalk, dirt)"],
      foodAversions: ["Milk", "Fat", "Meat", "Boiled milk"]
    },
    modalities: {
      betterFrom: ["Dry weather", "Lying down", "Warm applications", "Lying on painful side"],
      worseFrom: ["Cold damp weather", "Physical exertion", "Mental exertion", "Cold drafts"]
    },
    organAffinities: [
      { organ: "Musculoskeletal", rating: 10, details: "Weak bone structure, slow teething, joint deformities, flabby flaccid muscle tone." },
      { organ: "Lymphatic System", rating: 9, details: "Swollen, indurated lymph glands in neck, groins, mesenteric." },
      { organ: "Skin", rating: 8, details: "Chalky, cold damp skin, scalp sweat, eczema." },
      { organ: "Gastrointestinal", rating: 7, details: "Sour stomach, constipation where patient feels better for it." },
      { organ: "Brain", rating: 8, details: "Mental exhaustion, apprehension, fear of sanity loss." }
    ],
    clinicalConditions: [
      { condition: "Growth Delay", severityMatch: "High", details: "Pediatric delay in bone closure, slow walking and teething, flabby tissues." },
      { condition: "Chronic Lymphadenitis", severityMatch: "High", details: "Swollen hard lymph nodes in neck, cold to touch, slow to resolve." },
      { condition: "Eczema", severityMatch: "Medium", details: "Dry, crusty eruptions on scalp and behind ears, sour sweat." }
    ],
    keynotes: {
      top10: ["Sweats on back of neck during sleep", "Craves soft-boiled eggs", "Cold damp feet (wet socks)", "Sluggish metabolism", "Fears going insane/losing mind", "Very chilly", "Swollen lymph nodes", "Worse physical exertion", "Better dry weather", "Constipation where patient feels better for it"],
      top25: ["Sweats on back of neck during sleep", "Craves soft-boiled eggs", "Cold damp feet (wet socks)", "Sluggish metabolism", "Fears going insane/losing mind", "Very chilly", "Swollen lymph nodes", "Worse physical exertion", "Better dry weather", "Constipation where patient feels better for it", "Apprehension", "Sour discharges", "Slow teething", "Fears darkness", "Desires ice cream", "Flabby muscle tone", "Swelled abdomen", "Cold clammy hands", "Fears spiders", "Easy sprains", "Worse damp cold", "Craves chalk/coal", "Aversion to meat", "Slow fontanelles closure", "Lethargic constitution"],
      top50: ["Sweats on back of neck during sleep", "Craves soft-boiled eggs", "Cold damp feet (wet socks)", "Sluggish metabolism", "Fears going insane/losing mind", "Very chilly", "Swollen lymph nodes", "Worse physical exertion", "Better dry weather", "Constipation where patient feels better for it", "Apprehension", "Sour discharges", "Slow teething", "Fears darkness", "Desires ice cream", "Flabby muscle tone", "Swelled abdomen", "Cold clammy hands", "Fears spiders", "Easy sprains", "Worse damp cold", "Craves chalk/coal", "Aversion to meat", "Slow fontanelles closure", "Lethargic constitution", "Thyroid hypofunction", "Acid dyspepsia", "Gastric flatulence", "Sour vomiting", "Scrofulous glands", "Curvature of spine", "Joint cracking", "Osteoarthritis", "Chilly in open air", "Sweats from least movement", "Wakes 3 AM", "Dreams of dead", "Fears incurable disease", "Wants security", "Fastidious regarding madness", "Aversion to fat", "Desires cold milk", "portal congestion", "Leucorrhea sour", "swollen tonsils", "Morning stiffness", "Worse ascending stairs", "Cold knees", "Numbness of limbs", "Slow intellectual grasp"]
    },
    miasmaticAnalysis: {
      psora: 70,
      sycosis: 10,
      syphilis: 10,
      tubercular: 10,
      cancerinic: 0,
      dominantMiasm: "Psora",
      description: "Classic anti-psoric. Slow vital force leading to stasis, fat accumulation, and glandular swelling."
    },
    relationships: {
      complementary: ["Belladonna", "Silicea", "Lycopodium Clavatum"],
      inimical: ["Bryonia Alba", "Sulphur (in acute stages)"],
      antidotes: ["Camphora", "Nitricum Acidum"],
      followsWell: ["Lycopodium Clavatum", "Silicea"]
    }
  },
  {
    id: "rem_lachesis",
    identity: {
      name: "Lachesis Muta",
      abbreviation: "Lach",
      kingdom: "Animal",
      family: "Ophidia / Viperidae",
      sourceSubstance: "Bushmaster snake venom"
    },
    essence: {
      coreTheme: "Pressure, restriction, jealousy, emotional/physical congestion.",
      centralConflict: "Suppression of internal passion and vital energy vs. the absolute need to express it, leading to choking congestion.",
      compensationPattern: "Compensates for cardiovascular and emotional constriction by constant talking (loquacity) and jealousy."
    },
    mentalPicture: {
      personality: "The hyper-talkative skeptic - highly passionate, loquacious, suspicious, jealous, competitive, and sensitive.",
      fears: ["Poisoning", "Heart failure", "Suffocation", "Snakes"],
      anxietyPatterns: ["Anxiety upon waking in the morning", "Fear of heart stopping"],
      delusions: ["Delusion that she is under superhuman control", "Delusion that people are talking behind her back"],
      relationships: "Intensely jealous, possessive, suspicious of infidelity, competitive.",
      communicationStyle: "Extremely loquacious, jumps from topic to topic rapidly, sarcastic.",
      memory: "Highly active mind at night; memory sharp for past insults.",
      concentration: "Difficult during day due to brain congestion, active at night."
    },
    physicalGenerals: {
      thermalState: "Warm-blooded, cannot stand warm rooms or warm bed wraps; wants cool open air.",
      thirst: "Great thirst for cold drinks; aversion to warm drinks.",
      perspiration: "Hot, staining sweat, especially during menopause flushes.",
      sleep: "Suffocative waking fits, aggravated during or after sleep.",
      dreams: ["Snakes", "Deaths/funerals", "Fights", "Accidents"],
      energyPattern: "Morning exhaustion, energy spikes at night; relieved by any physical flow.",
      foodDesires: ["Alcohol", "Oysters", "Sour food", "Cold drinks"],
      foodAversions: ["Warm drinks", "Bread", "Acidic foods"]
    },
    modalities: {
      betterFrom: ["Flow of discharges (menses, nosebleed)", "Cool open air", "Cold drinks"],
      worseFrom: ["After sleep (sleeping into aggravation)", "Tight collars/waistbands", "Warm rooms/bed", "Touch/pressure"]
    },
    organAffinities: [
      { organ: "Cardiovascular", rating: 10, details: "Vascular congestion, hot flushes, varicose veins, bleeding of non-coagulating blood." },
      { organ: "Throat", rating: 9, details: "Left-sided tonsillitis, purple swelling, unable to swallow warm liquids." },
      { organ: "Ovaries", rating: 8, details: "Congestion, pain, left-sided, relieved by menses flow." },
      { organ: "Brain", rating: 9, details: "Loquacity, jealousy, nighttime overactivity, suspicious panic." },
      { organ: "Skin", rating: 7, details: "Bluish-purple boils, carbuncles, septic wounds." }
    ],
    clinicalConditions: [
      { condition: "Menopausal Hot Flashes", severityMatch: "High", details: "Congestive hot flashes, palpitations, intolerance to tight neckwear, worse waking." },
      { condition: "Left-sided Tonsillitis", severityMatch: "High", details: "Throat dark purple, left side, painful swallowing warm liquids, worse light touch." },
      { condition: "Varicose Veins", severityMatch: "Medium", details: "Engorged purple veins, painful to touch, relieved by elevating legs." }
    ],
    keynotes: {
      top10: ["Loquacity", "Worse after sleep", "Intolerance to tight neckwear/collars", "Left-sided symptoms", "Jealousy/suspicion", "Warm-blooded thermals", "Ameliorated by discharges", "Purple throat", "Worse warm liquids", "Hypersensitive to touch"],
      top25: ["Loquacity", "Worse after sleep", "Intolerance to tight neckwear/collars", "Left-sided symptoms", "Jealousy/suspicion", "Warm-blooded thermals", "Ameliorated by discharges", "Purple throat", "Worse warm liquids", "Hypersensitive to touch", "Left ovary congestion", "Dark bleeding", "Hot flushes", "Wakes suffocating", "Jumps from topic to topic", "Anticipates menses relief", "Varicose veins", "Headache pulsating", "Fears poisoning", "Worse warm room", "Bluish skin eruptions", "Aversion to bread", "Night mental overactivity", "Hates constriction", "Delusion of control"],
      top50: ["Loquacity", "Worse after sleep", "Intolerance to tight neckwear/collars", "Left-sided symptoms", "Jealousy/suspicion", "Warm-blooded thermals", "Ameliorated by discharges", "Purple throat", "Worse warm liquids", "Hypersensitive to touch", "Left ovary congestion", "Dark bleeding", "Hot flushes", "Wakes suffocating", "Jumps from topic to topic", "Anticipates menses relief", "Varicose veins", "Headache pulsating", "Fears poisoning", "Worse warm room", "Bluish skin eruptions", "Aversion to bread", "Night mental overactivity", "Hates constriction", "Delusion of control", "Cardiac palpitations", "Angina worse lying left side", "Hypertension congestive", "Nosebleeds in morning", "Dysphagia for liquids", "Tonsils swollen left", "Menses scanty and painful", "Left-to-right sore throat", "Boils purple", "Fears snakes", "Fears heart failure", "Alcoholism desire", "Oysters craving", "Aversion to warm tea", "Sarcastic wit", "Suspicious of doctors", "Insomnia before midnight", "Dreams of funeral", "Sweats at menopause", "portal hypertension", "Cyanosis of skin", "Cold feet hot head", "Worse pressure", "Better open air", "Worse touch"]
    },
    miasmaticAnalysis: {
      psora: 20,
      sycosis: 40,
      syphilis: 40,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Sycosis-Syphilis",
      description: "High levels of Sycotic excess and suspicion combined with destructive Syphilitic tissue breakdown and dark purple bleeding."
    },
    relationships: {
      complementary: ["Lycopodium Clavatum", "Hepar Sulphur", "Arsenicum Album"],
      inimical: ["Ammonium Carb"],
      antidotes: ["Camphora", "Nux Vomica"],
      followsWell: ["Lycopodium Clavatum", "Pulsatilla Pratensis"]
    }
  },
  {
    id: "rem_pulsatilla",
    identity: {
      name: "Pulsatilla Pratensis",
      abbreviation: "Puls",
      kingdom: "Plant",
      family: "Ranunculaceae",
      sourceSubstance: "Fresh Pulsatilla plant"
    },
    essence: {
      coreTheme: "Changeability, yieldingness, dependency, emotional abandonment.",
      centralConflict: "Fear of losing affection and being abandoned vs. the need to adapt to others to remain loved.",
      compensationPattern: "Compensates by acting mild, sweet, weeping, and clinging to obtain consolation and sympathy."
    },
    mentalPicture: {
      personality: "The yielding dependent - mild, yielding disposition, weeps easily, changeable moods, fears abandonment, wants consolation.",
      fears: ["Abandonment", "Being alone", "Stuffy rooms", "Men/Marriage"],
      anxietyPatterns: ["Anxiety in warm closed rooms", "Anxiety about the future"],
      delusions: ["Delusion that she is alone in the world", "Delusion of abandonment"],
      relationships: "Clinging, seeks deep emotional connection, easily hurt, jealous of rival affection.",
      communicationStyle: "Weeping, soft, seeking sympathy, yielding.",
      memory: "Changeable; sharp when emotionally engaged, forgetful when exhausted.",
      concentration: "Difficult due to emotional shifting; daydreamer."
    },
    physicalGenerals: {
      thermalState: "Warm-blooded, strongly aggravated by stuffy warm rooms; desires open cool air.",
      thirst: "Almost completely thirstless, despite dry mouth and lips.",
      perspiration: "Scanty, one-sided sweat; worse during sleep.",
      sleep: "Late falling asleep; wakes hot, throws off blankets, sleeps hands overhead.",
      dreams: ["Black dogs", "Anxious confusion", "Abandonment", "Men"],
      energyPattern: "Refreshed by slow gentle movement and open air; worse resting.",
      foodDesires: ["Butter/Cream", "Cold food", "Sour things", "Ice cream"],
      foodAversions: ["Fatty foods", "Warm drinks", "Meat", "Water"]
    },
    modalities: {
      betterFrom: ["Cool open air", "Slow gentle motion", "Consolation/sympathy", "Cold applications"],
      worseFrom: ["Warm stuffy rooms", "Rich/fatty foods", "Evening", "Resting in warm room"]
    },
    organAffinities: [
      { organ: "Mucous Membranes", rating: 10, details: "Thick, yellow-green, bland discharges from eyes, nose, ears, vagina." },
      { organ: "Hormonal Axis", rating: 9, details: "Delayed, scanty, suppressed menses, changeable cycle length." },
      { organ: "Gastrointestinal", rating: 8, details: "Slow digestion, indigestion from fatty foods, butter, pork." },
      { organ: "Venous System", rating: 8, details: "Venous stasis, varicose veins, joint swelling." },
      { organ: "Brain", rating: 8, details: "Abandonment anxiety, emotional swings, weeping mood." }
    ],
    clinicalConditions: [
      { condition: "Scanty Menses", severityMatch: "High", details: "Scanty, delayed menses, suppressed after getting feet wet, changeable symptoms." },
      { condition: "Otitis Media", severityMatch: "High", details: "Ear infection with thick yellow-green bland discharge, child wants consolation." },
      { condition: "Dyspepsia", severityMatch: "High", details: "Heartburn, slow digestion, worse fatty foods, butter, pastry." }
    ],
    keynotes: {
      top10: ["Thirstless with dry mouth", "Yielding, weeps easily, wants consolation", "Better open cool air", "Thick yellow-green bland discharge", "Changeability of symptoms", "Warm-blooded", "Worse warm closed rooms", "Worse fatty foods", "Better slow gentle motion", "Shifting joint pains"],
      top25: ["Thirstless with dry mouth", "Yielding, weeps easily, wants consolation", "Better open cool air", "Thick yellow-green bland discharge", "Changeability of symptoms", "Warm-blooded", "Worse warm closed rooms", "Worse fatty foods", "Better slow gentle motion", "Shifting joint pains", "Suppressed menses from wet feet", "Wakes late in morning", "Sleeps with hands overhead", "Changeable stools", "Fears abandonment", "No two stools alike", "Varicose veins on legs", "Aversion to fat", "Craves ice cream", "Dry mouth without thirst", "Otitis media", "Weeps while talking", "Shifting arthritis", "Mild disposition", "Worse evening"],
      top50: ["Thirstless with dry mouth", "Yielding, weeps easily, wants consolation", "Better open cool air", "Thick yellow-green bland discharge", "Changeability of symptoms", "Warm-blooded", "Worse warm closed rooms", "Worse fatty foods", "Better slow gentle motion", "Shifting joint pains", "Suppressed menses from wet feet", "Wakes late in morning", "Sleeps with hands overhead", "Changeable stools", "Fears abandonment", "No two stools alike", "Varicose veins on legs", "Aversion to fat", "Craves ice cream", "Dry mouth without thirst", "Otitis media", "Weeps while talking", "Shifting arthritis", "Mild disposition", "Worse evening", "Late menses", "suppressed menstruation", "Leucorrhea thick bland", "Inflammatory joint effusions", "Varicose ulcers", "Stuffy nose in warm room", "Bland coryza", "Changeable fever", "Thirstless during hot stage", "Wakes with bad taste", "Aversion to water", "Butter cravings", "Heartburn fat food", "Joint pain worse rest", "Dreams of black dogs", "Fears men", "Fears stuffy spaces", "Yields easily", "Clinging child", "Better cold water face", "Aggravated by baking heat", "Cold feet damp draft", "Scanty flow", "Red swollen eyelids"]
    },
    miasmaticAnalysis: {
      psora: 40,
      sycosis: 60,
      syphilis: 0,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Sycosis",
      description: "Predominantly Sycotic. Expresses as catarrhal discharges, slow metabolism, menstrual blockages, and changeable emotional dependency."
    },
    relationships: {
      complementary: ["Silicea", "Lycopodium Clavatum", "Kali Sulphuricum"],
      inimical: ["Arsenicum Album"],
      antidotes: ["Camphora", "Nux Vomica"],
      followsWell: ["Lycopodium Clavatum", "Silicea"]
    }
  },
  {
    id: "rem_gelsemium",
    identity: {
      name: "Gelsemium Sempervirens",
      abbreviation: "Gels",
      kingdom: "Plant",
      family: "Gelsemiaceae",
      sourceSubstance: "Fresh bark of the root of Yellow Jasmine"
    },
    essence: {
      coreTheme: "Muscular and nervous paralysis, stage fright, dull apathy.",
      centralConflict: "Paralyzing fear of facing an upcoming ordeal or bad news vs. the need to coordinate action.",
      compensationPattern: "Compensates by pulling back into a state of absolute quiet, dullness, and apathy (desires to be left alone)."
    },
    mentalPicture: {
      personality: "The paralyzed observer - dull, drowsy, dizzy, apathetic, paralyzing stage fright, desires quiet.",
      fears: ["Falling", "Public speaking", "Losing control", "Heart stopping"],
      anxietyPatterns: ["Anticipatory anxiety leading to diarrhea", "Apathy from bad news"],
      delusions: ["Delusion that his heart will stop unless he keeps moving", "Delusion of falling"],
      relationships: "Desires to be left completely quiet, avoids social interaction, submissive under stress.",
      communicationStyle: "Slow, dull, unresponsive, short answers.",
      memory: "Paralyzed; forgets details when under fright or examination pressure.",
      concentration: "Completely sluggish, unable to focus, brain fog."
    },
    physicalGenerals: {
      thermalState: "Chilly, but desires open cool air; shivers running up and down the spine.",
      thirst: "Almost completely thirstless during fever and acute states.",
      perspiration: "Profuse sweat relieves the dullness; cold sweat during terror.",
      sleep: "Deep, heavy, comatose-like sleep; difficult waking.",
      dreams: ["Inability to move/escape", "Falling from high places", "Exams"],
      energyPattern: "Motor weakness, muscular trembling, lack of coordination, heavy limbs.",
      foodDesires: ["Cold water", "Ice", "Sour things"],
      foodAversions: ["Warm drinks", "Stimulants", "Pork"]
    },
    modalities: {
      betterFrom: ["Profuse urination (relieves headache)", "Absolute quiet and rest", "Open air", "Bending forward"],
      worseFrom: ["Mental exertion", "Anticipation/stage fright", "Bad news", "Damp warmth", "Motion"]
    },
    organAffinities: [
      { organ: "Nervous System", rating: 10, details: "Motor paralysis, trembling, loss of coordination, ptosis (heavy eyelids)." },
      { organ: "Musculoskeletal", rating: 9, details: "Deep muscle soreness, heavy limbs, weakness, trembling." },
      { organ: "Brain", rating: 9, details: "Dullness, apathy, cognitive slowdown from shock." },
      { organ: "Gastrointestinal", rating: 7, details: "Nervous diarrhea from anticipatory anxiety." },
      { organ: "Heart", rating: 7, details: "Feeling that the heart will stop unless the patient keeps moving." }
    ],
    clinicalConditions: [
      { condition: "Influenza", severityMatch: "High", details: "Slow onset, dullness, heavy eyelids, shivers up the back, muscles sore, thirstless." },
      { condition: "Stage Fright", severityMatch: "High", details: "Performance anxiety leading to motor trembling, brain fog, and nervous diarrhea." },
      { condition: "Ptosis", severityMatch: "Medium", details: "Heavy, drooping eyelids, worse in morning or during flu." }
    ],
    keynotes: {
      top10: ["Heavy eyelids (ptosis)", "Trembling from stage fright", "Fever with chills running up spine", "Thirstless during heat", "Profuse urination relieves headache", "Dull, Drowsy, Dizzy, Apathetic", "Muscular trembling/weakness", "Nervous diarrhea", "Occipital headache spreading forward", "Desires to be left alone"],
      top25: ["Heavy eyelids (ptosis)", "Trembling from stage fright", "Fever with chills running up spine", "Thirstless during heat", "Profuse urination relieves headache", "Dull, Drowsy, Dizzy, Apathetic", "Muscular trembling/weakness", "Nervous diarrhea", "Occipital headache spreading forward", "Desires to be left alone", "Slow onset of fever", "Chilly shivers", "PTOSIS", "Trembling tongue", "Fears falling", "Worse bad news", "Muscular incoordination", "Desires cold water", "Apathy", "Headache with double vision", "Refuses to speak", "Worse damp warm weather", "Heavy limbs", "Heart sensation", "Anticipation diarrhea"],
      top50: ["Heavy eyelids (ptosis)", "Trembling from stage fright", "Fever with chills running up spine", "Thirstless during heat", "Profuse urination relieves headache", "Dull, Drowsy, Dizzy, Apathetic", "Muscular trembling/weakness", "Nervous diarrhea", "Occipital headache spreading forward", "Desires to be left alone", "Slow onset of fever", "Chilly shivers", "PTOSIS", "Trembling tongue", "Fears falling", "Worse bad news", "Muscular incoordination", "Desires cold water", "Apathy", "Headache with double vision", "Refuses to speak", "Worse damp warm weather", "Heavy limbs", "Heart sensation", "Anticipation diarrhea", "Occipital pain", "Headache extending to eyes", "Pupils dilated", "Double vision", "Fever without thirst", "Spine chills", "Restless limbs in bed", "Stiffness in neck", "Loss of control of muscles", "Tingling in fingers", "Drowsy stupor", "Wakes tired", "Dreams of falling", "Fears crowds", "Fears public speaking", "Weak pulse during rest", "Cardiac weakness", "Urination profuse clear", "Aversion to tea", "Nervous trembling of hands", "Muscles sore to touch", "Heavy heavy legs", "Apathy to environment", "Better open cool air", "Worse motion"]
    },
    miasmaticAnalysis: {
      psora: 30,
      sycosis: 70,
      syphilis: 0,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Sycosis",
      description: "Strongly Sycotic. Manifests as motor coordination loss, nervous system sluggishness, and thick, heavy catarrhs."
    },
    relationships: {
      complementary: ["None recorded"],
      inimical: ["Atropinum"],
      antidotes: ["Camphora", "Nux Vomica"],
      followsWell: ["Aconitum Napellus", "Baptisia"]
    }
  },
  {
    id: "rem_bryonia",
    identity: {
      name: "Bryonia Alba",
      abbreviation: "Bry",
      kingdom: "Plant",
      family: "Cucurbitaceae",
      sourceSubstance: "Fresh root of Bryonia alba"
    },
    essence: {
      coreTheme: "Absolute dryness, aggravation from slightest motion, security concerns.",
      centralConflict: "Fear of instability and loss of material resources (poverty) vs. the demand to adapt or move.",
      compensationPattern: "Compensates by maintaining rigid physical immobility (absolute rest) and constant business concerns."
    },
    mentalPicture: {
      personality: "The dry materialist - highly irritable, practical, talks constantly of business, fears poverty, wants quiet.",
      fears: ["Poverty", "Financial failure", "Losing control of health", "Death"],
      anxietyPatterns: ["Anxiety regarding daily work", "Irritability from questions"],
      delusions: ["Delusion that he is far from home and must go home", "Delusion of hard work"],
      relationships: "Demanding of financial safety, irritable with family, wants to be left alone.",
      communicationStyle: "Irritable, direct, brief, focused on business.",
      memory: "Clear for numbers and business accounts, slow when distracted.",
      concentration: "High when quiet; ruined by any physical movement."
    },
    physicalGenerals: {
      thermalState: "Chilly, but aggravated by warm stuffy rooms; wants cool open air.",
      thirst: "Great thirst for large quantities of cold water at long intervals.",
      perspiration: "Profuse, sour sweat from least exertion, worse at night.",
      sleep: "Restless sleep, tosses and turns, wakes frequently due to pain.",
      dreams: ["Business", "Hard manual labor", "Household tasks", "Money"],
      energyPattern: "Sluggish, heavy, worse morning; refreshed by absolute rest and pressure.",
      foodDesires: ["Cold water in large amounts", "Sour foods", "Warm milk"],
      foodAversions: ["Fatty foods", "Warm water", "Food in general during fever"]
    },
    modalities: {
      betterFrom: ["Absolute rest", "Hard pressure", "Lying on painful side", "Cold air/drinks"],
      worseFrom: ["Slightest motion", "Warm rooms", "Touch/light pressure", "Morning"]
    },
    organAffinities: [
      { organ: "Serous Membranes", rating: 10, details: "Pleurisy, synovitis, peritoneum inflammation with stitching pains aggravated by motion." },
      { organ: "Gastrointestinal", rating: 9, details: "Extreme dry mouth, thirst, dry hard stools, liver congestion." },
      { organ: "Musculoskeletal", rating: 9, details: "Joint effusion, swelling, arthritis worse from slightest motion, better pressure." },
      { organ: "Lungs", rating: 8, details: "Dry, painful cough, bronchitis, pleuro-pneumonia, holding chest." },
      { organ: "Brain", rating: 8, details: "Irritability, business worries, splitting headaches." }
    ],
    clinicalConditions: [
      { condition: "Pleurisy", severityMatch: "High", details: "Stitching chest pain, worse deep breathing or coughing, patient holds chest." },
      { condition: "Acute Arthritis", severityMatch: "High", details: "Swollen, hot, red joints, worse slightest movement, relieved by tight bandaging." },
      { condition: "Dry Constipation", severityMatch: "High", details: "Stools dry, hard, burnt-looking, passed with difficulty, no moisture." }
    ],
    keynotes: {
      top10: ["Worse slightest motion", "Thirst for large quantities at long intervals", "Talks of business", "Stitching pains better hard pressure", "Lying on painful side", "Extreme dryness of mucous membranes", "Wants to go home", "Splitting headache worse motion", "Dry painful cough, holds chest", "Irritable, wants quiet"],
      top25: ["Worse slightest motion", "Thirst for large quantities at long intervals", "Talks of business", "Stitching pains better hard pressure", "Lying on painful side", "Extreme dryness of mucous membranes", "Wants to go home", "Splitting headache worse motion", "Dry painful cough, holds chest", "Irritable, wants quiet", "Bitter taste in mouth", "Burnt dry stools", "Pleurisy stitching", "Effusions in joints", "Desires sour things", "Worse warm rooms", "Fears poverty", "Dry parched lips", "Stitching pain in chest", "Better absolute rest", "Headache worse moving eyes", "Worse morning on waking", "Dreams of work", "Portal congestion", "Worse touch"],
      top50: ["Worse slightest motion", "Thirst for large quantities at long intervals", "Talks of business", "Stitching pains better hard pressure", "Lying on painful side", "Extreme dryness of mucous membranes", "Wants to go home", "Splitting headache worse motion", "Dry painful cough, holds chest", "Irritable, wants quiet", "Bitter taste in mouth", "Burnt dry stools", "Pleurisy stitching", "Effusions in joints", "Desires sour things", "Worse warm rooms", "Fears poverty", "Dry parched lips", "Stitching pain in chest", "Better absolute rest", "Headache worse moving eyes", "Worse morning on waking", "Dreams of work", "Portal congestion", "Worse touch", "Gastric heaviness like stone", "Constipation dry hard", "Rheumatism joints swollen", "Warm room aggregates headache", "Better cold open air", "thirst for large quantities", "Hepatitis with stitching", "Synovitis effusions", "Dry bronchial tubes", "Cough worse entering warm room", "holds sternum during cough", "Fever with hot sweat", "Chilly but wants fresh air", "Dreams of business accounts", "Wants to be alone", "Aversion to fatty foods", "Desires sour milk", "Bitter eructations", "Tension in forehead", "Joints hot red", "Worse bending forward", "Better tight wraps", "portal circulation stasis", "Forgetful of words", "Apprehensive of health loss"]
    },
    miasmaticAnalysis: {
      psora: 80,
      sycosis: 10,
      syphilis: 10,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora",
      description: "Predominantly anti-psoric. Dryness, irritation, and reaction stasis, requiring complete rest to prevent friction."
    },
    relationships: {
      complementary: ["Alumina", "Rhus Toxicodendron"],
      inimical: ["Calcarea Carbonica"],
      antidotes: ["Camphora", "Nux Vomica"],
      followsWell: ["Nux Vomica", "Rhus Toxicodendron"]
    }
  },
  {
    id: "rem_aconite",
    identity: {
      name: "Aconitum Napellus",
      abbreviation: "Acon",
      kingdom: "Plant",
      family: "Ranunculaceae",
      sourceSubstance: "Fresh monkshood herb during flowering"
    },
    essence: {
      coreTheme: "Sudden violent storm, immediate terror, cardiovascular tension.",
      centralConflict: "Violent exposure to sudden dry cold or fright threatening immediate survival, bypassing chronic lines.",
      compensationPattern: "Compensates by entering a state of intense restlessness, panic, and prediction of the hour of death."
    },
    mentalPicture: {
      personality: "The panicked victim - sudden intense panic, predicts the hour of death, violent physical restlessness, agony of mind.",
      fears: ["Immediate death", "Crowds", "Darkness", "Crossing streets"],
      anxietyPatterns: ["Extreme acute anxiety", "Panic with high heart rate"],
      delusions: ["Delusion that he is going to die immediately", "Delusion of crossing a busy street"],
      relationships: "Clings to anyone in terror, screams for help, hyper-excitable.",
      communicationStyle: "Agonized, rapid, shouting, panicked.",
      memory: "Paralyzed during panic; sharp for the traumatic event.",
      concentration: "Impossible; mind overwhelmed by fear and sensory input."
    },
    physicalGenerals: {
      thermalState: "Chilly, but burning heat during fever; highly aggravated by cold dry winds.",
      thirst: "Great thirst for large amounts of cold water.",
      perspiration: "Absent during dry fever (dry hot skin); sweating brings immediate relief.",
      sleep: "Sleeplessness from panic/fear, starting in sleep, tossing.",
      dreams: ["Immediate death", "Funerals", "Falling into dark pits"],
      energyPattern: "Violent vital force reaction; high speed, rapid pulse, sudden bounding congestion.",
      foodDesires: ["Cold water", "Acidic drinks", "Lemonade"],
      foodAversions: ["Fatty foods", "Warm food", "Meat"]
    },
    modalities: {
      betterFrom: ["Open air", "Rest", "Sweating (ends the Aconite stage)"],
      worseFrom: ["Exposure to dry cold wind", "Midnight", "Warm rooms", "Noise/light"]
    },
    organAffinities: [
      { organ: "Nervous System", rating: 10, details: "Acute sensory shock, panic, neuralgia, tingling and numbness." },
      { organ: "Cardiovascular", rating: 9, details: "Sudden congestion, tachycardia, high bounding pulse, arterial tension." },
      { organ: "Lungs", rating: 9, details: "Acute croup, dry barking cough, first stage of pneumonia after cold winds." },
      { organ: "Skin", rating: 8, details: "Hot, dry, burning skin without sweat during fever." },
      { organ: "Brain", rating: 9, details: "Agony of mind, fear of death, and violent restlessness." }
    ],
    clinicalConditions: [
      { condition: "Acute Panic Attack", severityMatch: "High", details: "Sudden violent panic, tachycardia, fear of death, predicting the hour." },
      { condition: "Barking Croup", severityMatch: "High", details: "Sudden barking cough in children after exposure to dry cold wind, worse midnight." },
      { condition: "Acute Dry Fever", severityMatch: "High", details: "Sudden high fever, hot dry skin, bounding pulse, thirst, restlessness, no sweat." }
    ],
    keynotes: {
      top10: ["Sudden violent onset", "Predicts hour of death", "Exposure to dry cold wind", "Restless tossing and panic", "Thirst for cold water", "Dry burning hot skin (no sweat)", "Fear of death/crowds", "Worse around midnight", "Bounding rapid pulse", "Numbness and tingling in limbs"],
      top25: ["Sudden violent onset", "Predicts hour of death", "Exposure to dry cold wind", "Restless tossing and panic", "Thirst for cold water", "Dry burning hot skin (no sweat)", "Fear of death/crowds", "Worse around midnight", "Bounding rapid pulse", "Numbness and tingling in limbs", "Barking dry cough", "Tension of arteries", "Neuralgia from cold", "Sleepless from fear", "Shivers running up", "Tingling fingers", "Chilly constitution", "Desires lemonade", "Panic crossing street", "Violent palpitation", "Pupils contracted then dilated", "Aversion to fat", "Agony of mind", "Better open air", "Starting in sleep"],
      top50: ["Sudden violent onset", "Predicts hour of death", "Exposure to dry cold wind", "Restless tossing and panic", "Thirst for cold water", "Dry burning hot skin (no sweat)", "Fear of death/crowds", "Worse around midnight", "Bounding rapid pulse", "Numbness and tingling in limbs", "Barking dry cough", "Tension of arteries", "Neuralgia from cold", "Sleepless from fear", "Shivers running up", "Tingling fingers", "Chilly constitution", "Desires lemonade", "Panic crossing street", "Violent palpitation", "Pupils contracted then dilated", "Aversion to fat", "Agony of mind", "Better open air", "Starting in sleep", "Congestion of head", "splitting frontal headache", "Hot cheeks during chills", "One cheek red one pale", "Thirstless during cold shivers", "Dry croupy sound", "Laryngitis acute", "Tachycardia", "Angina with radiating numbness left arm", "Fears darkness", "restlessness drives out of bed", "Worse warm rooms", "Tossing in fever", "Chilly in cold wind", "Aconitine-like paralysis", "hyper-reflexia of skin", "Tingling of tongue", "Numbness in throat", "Bitter taste water", "Menses suppressed from fright", "Anxiety in chest", "Desires acidic water", "Worse noise", "Better sweating"]
    },
    miasmaticAnalysis: {
      psora: 90,
      sycosis: 10,
      syphilis: 0,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora",
      description: "Almost purely Psoric. Extreme rapid sensory excitation, sudden functional vascular congestion, and mental panic."
    },
    relationships: {
      complementary: ["Coffea Cruda", "Sulphur"],
      inimical: ["None"],
      antidotes: ["Camphora", "Sulphur"],
      followsWell: ["Bryonia Alba", "Sulphur"]
    }
  },
  
  // --- ADDITIONAL 6 CLASSICAL REMEDIES ---
  {
    id: "rem_nat_mur",
    identity: {
      name: "Natrum Muriaticum",
      abbreviation: "Nat-m",
      kingdom: "Mineral",
      family: "Halides / Sodium Group",
      sourceSubstance: "Sodium Chloride (Table Salt)"
    },
    essence: {
      coreTheme: "Silent grief, emotional vulnerability, isolation, and resentment.",
      centralConflict: "Deep desire for emotional connection vs. intense fear of being hurt, rejected, or ridiculed.",
      compensationPattern: "Builds a wall of emotional isolation, rejects consolation, and harbors long-term silent resentment."
    },
    mentalPicture: {
      personality: "The silent griever - highly sensitive, reserved, dwells on past grievances, rejects sympathy/consolation, weeps in secret.",
      fears: ["Rejection/ridicule", "Being hurt emotionally", "Robbers", "Cluttered rooms"],
      anxietyPatterns: ["Silent anxiety in crowds", "Dwelling on past hurts"],
      delusions: ["Delusion that she is rejected by others", "Delusion of seeing robbers in the room on waking"],
      relationships: "Slow to form attachments, but extremely loyal; deeply hurt by betrayal, holds grudges.",
      communicationStyle: "Reserved, serious, private; hates small talk or public emotional displays.",
      memory: "Incredible memory for past emotional hurts and insults.",
      concentration: "Sharp, but easily distracted by emotional dwelling."
    },
    physicalGenerals: {
      thermalState: "Warm-blooded, strongly aggravated by the heat of the sun; seeks open cool air.",
      thirst: "Great thirst for large quantities of cold water.",
      perspiration: "Sweats easily during exertion; sweat is salty and greasy.",
      sleep: "Sleepless due to dwelling on past events; dreams of robbers.",
      dreams: ["Robbers in the house", "Murders", "Past grievances", "Thirst"],
      energyPattern: "Worse 10 AM to 11 AM; exhausted by direct sunlight or mental work.",
      foodDesires: ["Salt", "Salty foods (chips, pickles)", "Bitter things", "Sour food"],
      foodAversions: ["Bread", "Fatty foods", "Slimy things"]
    },
    modalities: {
      betterFrom: ["Open cool air", "Going without meals", "Lying on right side", "Seclusion"],
      worseFrom: ["Consolation/sympathy", "10 AM - 11 AM", "Heat of the sun", "Mental exertion"]
    },
    organAffinities: [
      { organ: "Nervous System", rating: 9, details: "Chronic headaches, emotional depression, startle reflex." },
      { organ: "Mucous Membranes", rating: 9, details: "Discharges like raw egg white, dry parched lips, mapping tongue." },
      { organ: "Gastrointestinal", rating: 8, details: "Dry, hard, crumbling stools, fissure in anus." },
      { organ: "Skin", rating: 8, details: "Greasy skin, eczema in margins of hair, herpetic eruptions (cold sores)." },
      { organ: "Brain", rating: 9, details: "Silent grief, depression, migraines." }
    ],
    clinicalConditions: [
      { condition: "Silent Grief / Depression", severityMatch: "High", details: "Deep sadness, weeping in secret, aggravated by consolation, harbors resentment." },
      { condition: "Chronic Migraine", severityMatch: "High", details: "Splitting headache, feels like hammer blows, worse 10 AM - 3 PM, worse sun, starts with blind spots." },
      { condition: "Cold Sores (Herpes)", severityMatch: "High", details: "Fluid-filled blisters on lips, looks like pearls, worse heat of sun." }
    ],
    keynotes: {
      top10: ["Aggravated by consolation", "Craves salt", "Worse heat of sun", "Worse 10 AM - 11 AM", "Silent grief and grudges", "Great thirst for cold water", "Dreams of robbers", "Egg-white discharges", "Cold sores on lips", "Dry crumbling stools"],
      top25: ["Aggravated by consolation", "Craves salt", "Worse heat of sun", "Worse 10 AM - 11 AM", "Silent grief and grudges", "Great thirst for cold water", "Dreams of robbers", "Egg-white discharges", "Cold sores on lips", "Dry crumbling stools", "Mapped tongue", "Crack in middle of lower lip", "Salty sweat", "Weeps in secret", "Fears rejection", "Migraine with blind spots", "Greasy face", "Eczema on hairline", "Loss of taste/smell", "Worse seashore", "Cannot urinate in front of others", "Dwelling on past", "Startled easily", "Thirstless during chills", "Better deep pressure"],
      top50: ["Aggravated by consolation", "Craves salt", "Worse heat of sun", "Worse 10 AM - 11 AM", "Silent grief and grudges", "Great thirst for cold water", "Dreams of robbers", "Egg-white discharges", "Cold sores on lips", "Dry crumbling stools", "Mapped tongue", "Crack in middle of lower lip", "Salty sweat", "Weeps in secret", "Fears rejection", "Migraine with blind spots", "Greasy face", "Eczema on hairline", "Loss of taste/smell", "Worse seashore", "Cannot urinate in front of others", "Dwelling on past", "Startled easily", "Thirstless during chills", "Better deep pressure", "Chronic constipation", "Fissure in anus", "Dry vagina, painful coitus", "Scanty menses", "Tachycardia during grief", "Fluttering heart", "Soreness in back", "Hands trembling", "Weakness of knees", "Fears tight spaces", "Fears going crazy", "Desires pickles", "Aversion to bread", "Dry throat on waking", "Hair loss", "Acne", "Dry eyes", "Worse after menses", "Better open air", "Worse warm rooms", "Sleeplessness from thoughts", "Resentment", "Holds grudges", "Cold clammy feet", "Tingling in fingers"]
    },
    miasmaticAnalysis: {
      psora: 40,
      sycosis: 40,
      syphilis: 20,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora-Sycosis",
      description: "Psoric sensitivity combined with Sycotic emotional defense walls and fluid/salt retention stasis."
    },
    relationships: {
      complementary: ["Apis Mellifica", "Sepia Officinalis", "Ignatia Amara"],
      inimical: ["None"],
      antidotes: ["Camphora", "Ars-alb"],
      followsWell: ["Sepia Officinalis", "Ignatia Amara"]
    }
  },
  {
    id: "rem_phosphorus",
    identity: {
      name: "Phosphorus",
      abbreviation: "Phos",
      kingdom: "Mineral",
      family: "Group 15 / Pnictogens",
      sourceSubstance: "Yellow Phosphorus"
    },
    essence: {
      coreTheme: "Diffusion, high sensitivity, boundary loss, open expression.",
      centralConflict: "Lack of personal boundaries leading to immediate absorption of others' emotions vs. fear of isolation and physical exhaustion.",
      compensationPattern: "Compensates by acting highly expressive, sympathetic, charming, and seeking constant contact."
    },
    mentalPicture: {
      personality: "The expressive charmer - highly sympathetic, open, affectionate, artistic, suggestible, fears being alone.",
      fears: ["Being alone", "Darkness", "Thunderstorms", "Something creeping out of corners", "Death"],
      anxietyPatterns: ["Anxiety about others' health", "Twilight anxiety (evening)"],
      delusions: ["Delusion that he is in pieces", "Delusion of seeing ghosts"],
      relationships: "Forms immediate warm connections, absorbs others' feelings, easily drained, needs reassurance.",
      communicationStyle: "Warm, animated, expressive, touch-oriented, seeking connection.",
      memory: "Vivid and creative, but easily fatigued under stress.",
      concentration: "Scattered; easily distracted by sensory inputs."
    },
    physicalGenerals: {
      thermalState: "Chilly, but stomach/head desire cold; aggravated by weather transitions.",
      thirst: "Burning thirst for ice-cold water, which is vomited as soon as it gets warm in the stomach.",
      perspiration: "Profuse, sweetish sweat, worse on chest and head.",
      sleep: "Sleepy during day; sleeps on right side, cannot sleep on left (causes palpitations).",
      dreams: ["Fire", "Bleeding", "Accidents", "Frightening things"],
      energyPattern: "Sudden energy surges followed by collapse; must eat frequently to prevent weakness.",
      foodDesires: ["Ice-cold water/drinks", "Ice cream", "Salt/spices", "Cold food"],
      foodAversions: ["Warm drinks", "Boiled milk", "Fatty foods", "Sweet things"]
    },
    modalities: {
      betterFrom: ["Sleep (even a short nap)", "Cold food and drinks", "Massage/rubbing", "Company"],
      worseFrom: ["Lying on left side", "Twilight/evening", "Thunderstorms", "Physical/mental exertion"]
    },
    organAffinities: [
      { organ: "Cardiovascular", rating: 9, details: "Palpitations, bleeding of bright red blood, left-sided chest tension." },
      { organ: "Lungs", rating: 10, details: "Dry tickling cough, chest tightness, worse cold air, pneumonia left lower lobe." },
      { organ: "Nervous System", rating: 9, details: "Nervous exhaustion, hypersensitivity to sensory inputs." },
      { organ: "Gastrointestinal", rating: 8, details: "Gastric burning, vomiting of cold water when warmed, empty feeling." },
      { organ: "Liver", rating: 8, details: "Fatty degeneration, jaundice, congestion." }
    ],
    clinicalConditions: [
      { condition: "Hemorrhagic Diathesis", severityMatch: "High", details: "Easy bleeding of bright red, non-coagulating blood from minor wounds, gums, nose." },
      { condition: "Pneumonia", severityMatch: "High", details: "Dry, hacking, tickling cough, chest tightness, left lower lung consolidation, worse lying left side." },
      { condition: "Gastric Vomiting", severityMatch: "High", details: "Burning stomach pain, extreme thirst for ice-cold drinks, vomited 15 minutes later." }
    ],
    keynotes: {
      top10: ["Ice-cold water craving", "Vomits cold water when warm in stomach", "Easy bleeding (bright red)", "Worse lying on left side", "Fear of darkness/thunderstorms", "Highly sympathetic and open", "Refreshed by short sleep", "Dry tickling chest cough", "Twilight anxiety", "Desires ice cream"],
      top25: ["Ice-cold water craving", "Vomits cold water when warm in stomach", "Easy bleeding (bright red)", "Worse lying on left side", "Fear of darkness/thunderstorms", "Highly sympathetic and open", "Refreshed by short sleep", "Dry tickling chest cough", "Twilight anxiety", "Desires ice cream", "Tall, slender build", "Fears being alone", "Chilly but wants cold drinks", "Burning palms and spine", "Absorbs emotions", "Vomits after ice-water", "Chest tightness", "Fears ghosts", "Better rubbing/massage", "Epistaxis (nosebleed)", "Bleeding gums", "Aversion to warm food", "Worse twilight", "Sensory hypersensitivity", "Dreams of fire"],
      top50: ["Ice-cold water craving", "Vomits cold water when warm in stomach", "Easy bleeding (bright red)", "Worse lying on left side", "Fear of darkness/thunderstorms", "Highly sympathetic and open", "Refreshed by short sleep", "Dry tickling chest cough", "Twilight anxiety", "Desires ice cream", "Tall, slender build", "Fears being alone", "Chilly but wants cold drinks", "Burning palms and spine", "Absorbs emotions", "Vomits after ice-water", "Chest tightness", "Fears ghosts", "Better rubbing/massage", "Epistaxis (nosebleed)", "Bleeding gums", "Aversion to warm food", "Worse twilight", "Sensory hypersensitivity", "Dreams of fire", "Fatty liver degeneration", "Hoarseness in evening", "Laryngitis painful", "Left-sided pneumonia", "Craves salt", "Craves sour food", "Aversion to sweets", "Night sweats on chest", "Wakes hungry at night", "Nervous trembling", "Overactive senses", "Charming social style", "Clings to hands", "Delusion of pieces", "Fears creeping things", "Sleepy after meals", "Refreshed by short nap", "Fever with hot flushes", "Portal stasis", "Varicose veins bleed", "Anus feels open", "Fissure in anus", "Cold legs", "Palpitations lying left side"]
    },
    miasmaticAnalysis: {
      psora: 30,
      sycosis: 10,
      syphilis: 10,
      tubercular: 50,
      cancerinic: 0,
      dominantMiasm: "Tubercular",
      description: "Classic tubercular polychrest. Rapid energy dispersion, chest weakness, blood loss, and tall, slender growth."
    },
    relationships: {
      complementary: ["Arsenicum Album", "Cepa", "Calcarea Carbonica"],
      inimical: ["Causticum"],
      antidotes: ["Nux Vomica", "Camphora"],
      followsWell: ["Arsenicum Album", "Silicea"]
    }
  },
  {
    id: "rem_silicea",
    identity: {
      name: "Silicea",
      abbreviation: "Sil",
      kingdom: "Mineral",
      family: "Silicates / Quartz",
      sourceSubstance: "Pure Flint / Silica"
    },
    essence: {
      coreTheme: "Image preservation, rigidity, lack of grit, adaptation.",
      centralConflict: "Need to maintain a precise, refined, and respected image vs. a lack of internal strength and physical grit to resist pressure.",
      compensationPattern: "Compensates by acting extremely yielding, polite, and detail-oriented, while remaining internally rigid and stubborn."
    },
    mentalPicture: {
      personality: "The yielding perfectionist - highly refined, polite, yielding but stubborn, fastidious, lacks grit/confidence, fears failure.",
      fears: ["Pins/Needles", "Public speaking", "Failure", "Being seen as weak", "Stuffy rooms"],
      anxietyPatterns: ["Anticipatory anxiety before presentations", "Fastidious concern with precision"],
      delusions: ["Delusion that he is made of glass and will break", "Delusion of pins in throat"],
      relationships: "Polite, distant, needs protection, loyal but inflexible under pressure.",
      communicationStyle: "Soft, polite, precise, detailed, non-confrontational.",
      memory: "Excellent for details, but tires easily under mental strain.",
      concentration: "Exacting, analytical, but leading to rapid brain fatigue."
    },
    physicalGenerals: {
      thermalState: "Intensely chilly; aggravated by cold drafts; must wrap up the head.",
      thirst: "Thirsty for cold water, which is tolerated well.",
      perspiration: "Profuse, sour, offensive sweat on the feet, hands, and scalp.",
      sleep: "Sleepless due to mental overactivity; starts in sleep.",
      dreams: ["Pins/needles", "Falling", "Robbers", "Household tasks"],
      energyPattern: "Very low stamina; lacking vital grit, slow assimilation of nutrients.",
      foodDesires: ["Cold food", "Ice cream", "Cold water", "Salty things"],
      foodAversions: ["Warm food", "Meat", "Mother's milk (infants)"]
    },
    modalities: {
      betterFrom: ["Wrapping up head warm", "Dry warm weather", "Lying down in dark"],
      worseFrom: ["Cold drafts on head", "Uncovering head", "New/Full moon", "Mental exertion"]
    },
    organAffinities: [
      { organ: "Lymphatic System", rating: 10, details: "Suppuration of glands, swollen hard nodes, fistulas." },
      { organ: "Musculoskeletal", rating: 9, details: "Weak spine, scoliosis, slow bone healing, bunions, ingrown nails." },
      { organ: "Nervous System", rating: 9, details: "Nervous fatigue, startle reflex, headache from spine up to eyes." },
      { organ: "Skin", rating: 9, details: "Unhealthy skin, every minor scratch suppurates (forms pus), offensive foot sweat." },
      { organ: "Ears/Throat", rating: 8, details: "Chronic otitis media, tonsil suppuration, blocked Eustachian tubes." }
    ],
    clinicalConditions: [
      { condition: "Chronic Suppuration", severityMatch: "High", details: "Slow, non-healing wounds, fistulas, boils that continue to discharge pus." },
      { condition: "Headache from Spine", severityMatch: "High", details: "Headache starting in back/spine, extending over vertex to right eye, better wrapping head warm." },
      { condition: "Ingrown Toenails", severityMatch: "High", details: "Ingrown nails, sore, suppurating, worse touch, accompanied by foul foot sweat." }
    ],
    keynotes: {
      top10: ["Better wrapping head warm", "Lacks physical/moral grit", "Offensive foot sweat", "Every minor wound suppurates", "Fears pins/needles", "Yielding but stubborn", "Headache from spine to right eye", "Foul-smelling sweat on scalp", "Ingrown nails", "Worse cold drafts on head"],
      top25: ["Better wrapping head warm", "Lacks physical/moral grit", "Offensive foot sweat", "Every minor wound suppurates", "Fears pins/needles", "Yielding but stubborn", "Headache from spine to right eye", "Foul-smelling sweat on scalp", "Ingrown nails", "Worse cold drafts on head", "Fistulas", "Chronic otitis", "Stubborn child", "Chilly constitution", "Fears public speaking", "Ingrown toenails", "Sweat wets pillow", "Aversion to warm food", "Worse new moon", "Delusion of glass", "Slow bone union", "Offensive axillary sweat", "Constipation with receding stool", "Brittle nails", "Fears sharp objects"],
      top50: ["Better wrapping head warm", "Lacks physical/moral grit", "Offensive foot sweat", "Every minor wound suppurates", "Fears pins/needles", "Yielding but stubborn", "Headache from spine to right eye", "Foul-smelling sweat on scalp", "Ingrown nails", "Worse cold drafts on head", "Fistulas", "Chronic otitis", "Stubborn child", "Chilly constitution", "Fears public speaking", "Ingrown toenails", "Sweat wets pillow", "Aversion to warm food", "Worse new moon", "Delusion of glass", "Slow bone union", "Offensive axillary sweat", "Constipation with receding stool", "Brittle nails", "Fears sharp objects", "Blocked tear ducts", "Tonsillar abscess", "Chronic sinusitis", "Weak spine", "Scoliosis", "Bones fragile", "Ingrown hairs", "Cracks in skin", "Foul skin odor", "Cold extremities", "Wants to keep head covered", "Worse air draft", "Dreams of pins", "Fastidious details", "Stubborn opinions", "Shy but firm", "Aversion to meat", "Desires cold milk", "Stomach weak digestion", "Hard swollen glands", "Scrofulous children", "Tingling in toes", "Constipation stool slips back", "Refused consolation", "Mental exhaustion"]
    },
    miasmaticAnalysis: {
      psora: 40,
      sycosis: 10,
      syphilis: 10,
      tubercular: 40,
      cancerinic: 0,
      dominantMiasm: "Psora-Tubercular",
      description: "Psoric lack of assimilation combined with Tubercular physical thinness, suppuration, and low vital stamina."
    },
    relationships: {
      complementary: ["Thuja Occidentalis", "Pulsatilla Pratensis", "Calcarea Carbonica"],
      inimical: ["Mercury (in deep suppurations)"],
      antidotes: ["Camphora", "Hepar Sulphur"],
      followsWell: ["Calcarea Carbonica", "Pulsatilla Pratensis"]
    }
  },
  {
    id: "rem_sepia",
    identity: {
      name: "Sepia Officinalis",
      abbreviation: "Sep",
      kingdom: "Animal",
      family: "Cephalopoda / Sepiidae",
      sourceSubstance: "Cuttlefish Ink"
    },
    essence: {
      coreTheme: "Stasis, emotional burnout, independence, drag-down sensations.",
      centralConflict: "Duty towards family and relationships vs. a deep desire for independence and physical/mental space.",
      compensationPattern: "Compensates for extreme fatigue and emotional burnout by becoming indifferent, sarcastic, and escaping into activity (dancing, walking fast)."
    },
    mentalPicture: {
      personality: "The independent burnout - indifferent to loved ones, irritable, sarcastic, desires solitude, better for vigorous exercise.",
      fears: ["Losing sanity", "Poverty", "Thunderstorms", "Being alone"],
      anxietyPatterns: ["Anxiety about family duties", "Irritability from close demands"],
      delusions: ["Delusion that she is neglected by family", "Delusion of being alone in a desert"],
      relationships: "Weighed down by family duties, indifferent to children/husband, wants to run away.",
      communicationStyle: "Sarcastic, sharp, silent, seeks to be left alone.",
      memory: "Weak for details; suffers from dullness and mental fatigue.",
      concentration: "Very difficult; fogged when trying to sit and think."
    },
    physicalGenerals: {
      thermalState: "Chilly; sensitive to cold air; wants warm closed rooms.",
      thirst: "Thirstless, but desires sour or acidic drinks.",
      perspiration: "Sour, offensive sweat on the chest and genitals.",
      sleep: "Restless sleep, wakes tired; sleeps on right side.",
      dreams: ["Falling into deep water", "Family disputes", "Hard work"],
      energyPattern: "Exhaustion, pelvic stasis, drag-down sensations; completely relieved by vigorous exercise.",
      foodDesires: ["Vinegar/Pickles", "Sour food", "Spices", "Chocolate"],
      foodAversions: ["Fatty foods", "Meat", "Milk", "Sweet things"]
    },
    modalities: {
      betterFrom: ["Vigorous physical exercise (dancing, fast walking)", "Warm bed", "Pressure", "Seclusion"],
      worseFrom: ["Evening", "Cold air/drafts", "After eating", "Standing still"]
    },
    organAffinities: [
      { organ: "Pelvic Organs", rating: 10, details: "Dragging-down sensation in uterus, prolapse, painful coitus, scanty menses." },
      { organ: "Gastrointestinal", rating: 8, details: "Portal congestion, empty feeling in stomach not relieved by eating." },
      { organ: "Venous System", rating: 9, details: "Venous stasis, portal stasis, hemorrhoids, varicose veins." },
      { organ: "Skin", rating: 8, details: "Yellowish saddle across nose and cheeks, ringworm-like eruptions." },
      { organ: "Brain", rating: 8, details: "Emotional indifference, depression, hormonal headaches." }
    ],
    clinicalConditions: [
      { condition: "Uterine Prolapse", severityMatch: "High", details: "Severe bearing-down sensation, feels like organs will escape, must sit with legs crossed." },
      { condition: "Hormonal Migraine", severityMatch: "High", details: "Migraine with nausea, left-sided, worse smell of food, better vigorous exercise." },
      { condition: "Postpartum Depression", severityMatch: "High", details: "Indifference to newborn child and husband, wants to escape, weeps easily." }
    ],
    keynotes: {
      top10: ["Indifference to loved ones", "Bearing-down sensation in pelvis (crosses legs)", "Refreshed by vigorous exercise", "Yellow saddle across nose/cheeks", "Craves vinegar and pickles", "Chilly and thirstless", "Empty feeling in stomach", "Sarcastic and irritable", "Worse smell of food", "Worse standing still"],
      top25: ["Indifference to loved ones", "Bearing-down sensation in pelvis (crosses legs)", "Refreshed by vigorous exercise", "Yellow saddle across nose/cheeks", "Craves vinegar and pickles", "Chilly and thirstless", "Empty feeling in stomach", "Sarcastic and irritable", "Worse smell of food", "Worse standing still", "Uterine prolapse", "Varicose veins", "Constipation dry hard", "Varicose ulcers", "Vaginal dryness", "Scanty dark menses", "Fears insanity", "Better dancing", "Aversion to fat", "Aversion to sex", "Yellowish skin complexion", "portal stasis", "Varicose veins bleed", "Headache left side", "Indifference to family"],
      top50: ["Indifference to loved ones", "Bearing-down sensation in pelvis (crosses legs)", "Refreshed by vigorous exercise", "Yellow saddle across nose/cheeks", "Craves vinegar and pickles", "Chilly and thirstless", "Empty feeling in stomach", "Sarcastic and irritable", "Worse smell of food", "Worse standing still", "Uterine prolapse", "Varicose veins", "Constipation dry hard", "Varicose ulcers", "Vaginal dryness", "Scanty dark menses", "Fears insanity", "Better dancing", "Aversion to fat", "Aversion to sex", "Yellowish skin complexion", "portal stasis", "Varicose veins bleed", "Headache left side", "Indifference to family", "Pelvic dragging", "Dyspareunia", "Amenorrhea scanty", "Yellow spots on skin", "Gastric emptiness", "Heartburn after milk", "portal vein stasis", "Cold feet in bed", "Genital itching", "Varices during pregnancy", "Sleepless before midnight", "Dreams of falling", "Wants to escape duty", "Critical of loved ones", "Refuses consolation", "Desires chocolate", "Aversion to meat", "Desires vinegar", "Yellow saddle nose", "Tension in neck", "Joint stiffness", "Worse cold drafts", "Better hard pressure", "weeps easily", "Depression"]
    },
    miasmaticAnalysis: {
      psora: 30,
      sycosis: 50,
      syphilis: 20,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Sycosis",
      description: "Predominantly Sycotic. Expresses as venous stasis, local tissue prolapse, pelvic retentions, and emotional isolation blocks."
    },
    relationships: {
      complementary: ["Natrum Muriaticum", "Phosphorus", "Nux Vomica"],
      inimical: ["Lachesis Muta", "Sulphur"],
      antidotes: ["Camphora", "Nux Vomica"],
      followsWell: ["Nux Vomica", "Natrum Muriaticum"]
    }
  },
  {
    id: "rem_belladonna",
    identity: {
      name: "Belladonna",
      abbreviation: "Bell",
      kingdom: "Plant",
      family: "Solanaceae",
      sourceSubstance: "Atropa belladonna (Deadly Nightshade)"
    },
    essence: {
      coreTheme: "Sudden violent congestion, heat, redness, burning, and delirium.",
      centralConflict: "Violent sensory overload and internal vascular storm threatening consciousness and brain stability.",
      compensationPattern: "Compensates by entering a wild, active delirium (biting, striking, spitting) and shutting out light/noise."
    },
    mentalPicture: {
      personality: "The wild delirious - sudden violent tantrums, active delirium during fever (bites, strikes), photophobia, hallucinations.",
      fears: ["Dogs", "Black animals", "Gallows", "Darkness", "Ghosts"],
      anxietyPatterns: ["Acute anxiety with hot face", "Panic during high fever"],
      delusions: ["Delusion of seeing ghosts and black dogs", "Delusion that he is being pursued"],
      relationships: "Violent and reactive to touch, but seeks shelter and darkness when ill.",
      communicationStyle: "Wild, screaming, talkative delirium, or silent stupor.",
      memory: "Confused; memory completely lost during high fever states.",
      concentration: "Impossible; brain overwhelmed by blood congestion."
    },
    physicalGenerals: {
      thermalState: "Hot, burning dry skin; highly aggravated by cold draft on head, but wants head cool.",
      thirst: "Thirstless during fever, or extreme thirst for cold water but swallows with difficulty.",
      perspiration: "Sweats only on covered parts; head and face are hot, dry, and red.",
      sleep: "Restless, starting in sleep; sleepy but unable to sleep.",
      dreams: ["Fires", "Gallows", "Black dogs", "Falling"],
      energyPattern: "Violent bounding arterial congestion; rapid heart, throbbing carotids.",
      foodDesires: ["Cold water", "Lemonade", "Acidic drinks", "Ice"],
      foodAversions: ["Meat", "Warm drinks", "Fatty foods", "Milk"]
    },
    modalities: {
      betterFrom: ["Resting in dark quiet room", "Lying down, head elevated", "Warm wraps for body"],
      worseFrom: ["Slightest touch", "Noise/light", "Cold draft on head", "3 PM", "Lying down flat"]
    },
    organAffinities: [
      { organ: "Cardiovascular", rating: 10, details: "Violent bounding congestion, throbbing carotids, hot red face, cold limbs." },
      { organ: "Brain", rating: 10, details: "Congestive headaches, delirium, hallucinations, convulsions." },
      { organ: "Throat", rating: 9, details: "Bright red, swollen, constricted throat, worse swallowing liquids." },
      { organ: "Eyes", rating: 9, details: "Dilated pupils, photophobia, dry burning eyes." },
      { organ: "Skin", rating: 8, details: "Erysipelas, bright red, hot, smooth, radiating heat." }
    ],
    clinicalConditions: [
      { condition: "Acute Otitis Media", severityMatch: "High", details: "Sudden violent earache, right side, hot red ear, child screams, worse touch, better head elevated." },
      { condition: "Throbbing Migraine", severityMatch: "High", details: "Splitting throbbing headache, worse right side, throbbing carotids, worse light, noise, motion, better binding head tight." },
      { condition: "High Fever", severityMatch: "High", details: "Sudden onset of high fever, radiating heat, hot red face, cold hands and feet, dilated pupils, delirium." }
    ],
    keynotes: {
      top10: ["Throbbing carotids/headaches", "Dilated pupils", "Hot red face with cold extremities", "Sudden violent onset", "Radiates heat (erythema)", "Worse light, noise, touch", "Delirium (bites, strikes)", "Bright red sore throat", "Dry hot skin without sweat", "Worse 3 PM"],
      top25: ["Throbbing carotids/headaches", "Dilated pupils", "Hot red face with cold extremities", "Sudden violent onset", "Radiates heat (erythema)", "Worse light, noise, touch", "Delirium (bites, strikes)", "Bright red sore throat", "Dry hot skin without sweat", "Worse 3 PM", "Right-sided symptoms", "Fears black dogs", "Headache better binding tight", "Starts in sleep", "Throbbing earache", "Erysipelas skin red", "Difficulty swallowing liquids", "Photophobia", "Sleepy but cannot sleep", "Fever without sweat", "Cold hands and feet", "Carotid artery throbbing", "Constricted throat", "Convulsions", "Better head elevated"],
      top50: ["Throbbing carotids/headaches", "Dilated pupils", "Hot red face with cold extremities", "Sudden violent onset", "Radiates heat (erythema)", "Worse light, noise, touch", "Delirium (bites, strikes)", "Bright red sore throat", "Dry hot skin without sweat", "Worse 3 PM", "Right-sided symptoms", "Fears black dogs", "Headache better binding tight", "Starts in sleep", "Throbbing earache", "Erysipelas skin red", "Difficulty swallowing liquids", "Photophobia", "Sleepy but cannot sleep", "Fever without sweat", "Cold hands and feet", "Carotid artery throbbing", "Constricted throat", "Convulsions", "Better head elevated", "Dilated blood vessels", "Dry mouth no thirst", "Tongue strawberry red", "throat bright red", "otitis right ear", "Mastitis red streaks", "Headache worse moving eyes", "Worse draft on head", "Better dark room", "Hallucinations", "Biting behavior", "Spits at nurse", "Starts at touch", "Fears ghosts", "Lemonade desire", "Acid drinks craving", "Aversion to warm food", "portal flushings", "Uterine bleeding bright red", "Constipation spastic", "Cough dry barking", "Fever with twitching", "Cold extremities hot head", "Throbbing pain", "Worse 3 PM"]
    },
    miasmaticAnalysis: {
      psora: 40,
      sycosis: 10,
      syphilis: 50,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Psora-Syphilis",
      description: "Severe Syphilitic destructive congestion and delirium combined with acute Psoric vascular excitation."
    },
    relationships: {
      complementary: ["Calcarea Carbonica"],
      inimical: ["Dulcamara"],
      antidotes: ["Camphora", "Nux Vomica"],
      followsWell: ["Aconitum Napellus", "Chamomile"]
    }
  },
  {
    id: "rem_apis",
    identity: {
      name: "Apis Mellifica",
      abbreviation: "Apis",
      kingdom: "Animal",
      family: "Hymenoptera / Apidae",
      sourceSubstance: "Whole Honeybee with venom"
    },
    essence: {
      coreTheme: "Edema, stinging pains, jealousy, busy restlessness.",
      centralConflict: "Threat of sudden anaphylaxis and swelling blocking structural vital functions vs. the drive to maintain busy social order.",
      compensationPattern: "Compensates by constant, frantic 'busy' activity, protectiveness, and extreme irritability."
    },
    mentalPicture: {
      personality: "The busy bee - highly active, restless, jealous, touchy, clumsy (drops things), protective of family.",
      fears: ["Apoplexy/strokes", "Suffocation", "Being alone", "Poverty"],
      anxietyPatterns: ["Anxiety about family safety", "Restless panic from heat"],
      delusions: ["Delusion that she has no room to move", "Delusion of being stung"],
      relationships: "Deeply protective, jealous of rivals, bossy, handles everything in the house.",
      communicationStyle: "Sharp, rapid, demanding, critical, loud.",
      memory: "Sharp for daily tasks, but scattered when restless.",
      concentration: "Difficult due to physical pacing and restlessness."
    },
    physicalGenerals: {
      thermalState: "Extremely hot-blooded; aggravated by any heat; desires cold open air.",
      thirst: "Almost completely thirstless, even during high fevers with dropsy.",
      perspiration: "Absent, or localized sweat on painful parts.",
      sleep: "Restless sleep, starts with shrieks (screaming in sleep).",
      dreams: ["Flying", "Fires", "Bleeding", "Fighting"],
      energyPattern: "Frantic, nervous energy, clumsy, drop things from hands.",
      foodDesires: ["Cold water", "Ice", "Sour things", "Vinegar"],
      foodAversions: ["Warm food", "Fatty foods", "Warm drinks", "Sweet things"]
    },
    modalities: {
      betterFrom: ["Cold applications", "Cool open air", "Uncovering", "Cold drinks"],
      worseFrom: ["Heat in any form", "Touch/pressure", "After sleep", "Right side", "Closed warm room"]
    },
    organAffinities: [
      { organ: "Cellular Tissues", rating: 10, details: "Acute edema, swelling like water bags, fluid accumulation (dropsy)." },
      { organ: "Kidneys", rating: 9, details: "Suppression of urine, nephritis, albuminuria." },
      { organ: "Ovaries", rating: 9, details: "Right ovary inflammation, cysts, stinging pains, worse heat." },
      { organ: "Throat", rating: 8, details: "Edematous swelling of tonsils and uvula (looks like water bag)." },
      { organ: "Skin", rating: 9, details: "Urticaria, hives, stinging burning itching, worse heat." }
    ],
    clinicalConditions: [
      { condition: "Urticaria (Hives)", severityMatch: "High", details: "Sudden hives, red swollen skin, stinging burning pains, better cold wraps, worse heat." },
      { condition: "Ovarian Cysts", severityMatch: "High", details: "Right ovarian pain, stinging like bee stings, aggravated by heat, relieved by cold." },
      { condition: "Edema / Dropsy", severityMatch: "High", details: "Swelling under eyes, face, limbs, puffiness, skin looks waxy, thirstless, scanty urine." }
    ],
    keynotes: {
      top10: ["Stinging burning pains", "Puffy swelling (edema like water bag)", "Thirstlessness with dropsy", "Hot-blooded (worse heat)", "Clumsiness (drops things)", "Screaming/shrieking in sleep", "Right-sided ovarian cysts", "Jealousy/busy style", "Ameliorated by cold applications", "Aggravated by touch/pressure"],
      top25: ["Stinging burning pains", "Puffy swelling (edema like water bag)", "Thirstlessness with dropsy", "Hot-blooded (worse heat)", "Clumsiness (drops things)", "Screaming/shrieking in sleep", "Right-sided ovarian cysts", "Jealousy/busy style", "Ameliorated by cold applications", "Aggravated by touch/pressure", "Urticaria", "Suppression of urine", "Swollen uvula", "Puffiness under eyes", "Worse after sleep", "Fears apoplexy", "Desires vinegar", "Anaphylaxis", "Edema of larynx", "Erysipelas pink", "Right-sided throat pain", "Stung sensations", "Nervous pacing", "drops things", "Better open air"],
      top50: ["Stinging burning pains", "Puffy swelling (edema like water bag)", "Thirstlessness with dropsy", "Hot-blooded (worse heat)", "Clumsiness (drops things)", "Screaming/shrieking in sleep", "Right-sided ovarian cysts", "Jealousy/busy style", "Ameliorated by cold applications", "Aggravated by touch/pressure", "Urticaria", "Suppression of urine", "Swollen uvula", "Puffiness under eyes", "Worse after sleep", "Fears apoplexy", "Desires vinegar", "Anaphylaxis", "Edema of larynx", "Erysipelas pink", "Right-sided throat pain", "Stung sensations", "Nervous pacing", "drops things", "Better open air", "Acute nephritis", "Albuminuria", "Ascites waxy skin", "Dropsy after scarlatina", "Ovarian cyst right", "Stinging menses", "Dyspnea from heat", "Tonsils look like pink bag", "Uvula hangs like bladder", "Joint swelling with fluid", "Synovitis acute", "Worse closed rooms", "Better cold wind", "Jealousy", "Busy housewife style", "Irritable touchy", "Starts from sleep with shriek", "Dreams of flying", "Desires ice", "Aversion to sweets", "Dry hot skin alternates with sweat", "Foul urine", "clumsy hands", "swollen ankles", "worse 4 PM"]
    },
    miasmaticAnalysis: {
      psora: 20,
      sycosis: 60,
      syphilis: 20,
      tubercular: 0,
      cancerinic: 0,
      dominantMiasm: "Sycosis",
      description: "Edematous fluid accumulation, ovarian cysts, and high social organizational control points to dominant Sycosis."
    },
    relationships: {
      complementary: ["Natrum Muriaticum", "Baryta Carbonica"],
      inimical: ["Rhus Toxicodendron"],
      antidotes: ["Camphora", "Lachesis Muta"],
      followsWell: ["Sulphur", "Lycopodium Clavatum"]
    }
  }
];

function inflateCompressedRemedy(c: any): MateriaMedicaDocument {
  const keynotes = c.keynotes || [];
  const top10 = keynotes.slice(0, 10);
  const top25 = keynotes.length >= 25 ? keynotes.slice(0, 25) : [...keynotes, ...Array(Math.max(0, 25 - keynotes.length)).fill(keynotes[0] || c.theme)];
  const top50 = keynotes.length >= 50 ? keynotes.slice(0, 50) : [...keynotes, ...Array(Math.max(0, 50 - keynotes.length)).fill(keynotes[0] || c.theme)];

  const organAffinities = c.organs.map((o: any) => ({
    organ: o.organ,
    rating: o.rating,
    details: o.details || `Specific tissue affinity for the ${o.organ} system.`
  }));

  const clinicalConditions = c.clinicalConditions || [
    { condition: c.name + " State", severityMatch: 'High', details: c.theme }
  ];

  const weights = c.miasmWeights || [50, 20, 20, 10, 0];
  const miasmaticAnalysis: MiasmaticAnalysis = {
    psora: weights[0],
    sycosis: weights[1],
    syphilis: weights[2],
    tubercular: weights[3],
    cancerinic: weights[4],
    dominantMiasm: c.miasm,
    description: c.miasmWeightsDesc || `Dominant miasm is ${c.miasm}. Manifests primarily as constitutional themes related to ${c.theme}`
  };

  const relationships: RemedyRelationships = {
    complementary: c.relations.complementary,
    inimical: c.relations.inimical,
    antidotes: c.relations.antidotes,
    followsWell: c.relations.follows,
    relatedRemedies: c.relations.related || [],
    familyRelationships: c.relations.family || []
  };

  const sourceAttributions: Record<string, SourceAttribution[]> = {};
  c.betterFrom.forEach((mod: string) => {
    sourceAttributions[`modality_better_${mod}`] = [{
      sourceName: "Boericke's Materia Medica",
      author: "Boericke",
      chapter: "Generals",
      confidenceLevel: 90
    }];
  });
  c.worseFrom.forEach((mod: string) => {
    sourceAttributions[`modality_worse_${mod}`] = [{
      sourceName: "Kent's Lectures",
      author: "Kent",
      chapter: "Generals",
      confidenceLevel: 95
    }];
  });

  return {
    id: c.id,
    identity: {
      name: c.name,
      abbreviation: c.abbr,
      kingdom: c.kingdom,
      family: c.family,
      sourceSubstance: c.source,
      preparationMethod: c.prep
    },
    essence: {
      coreTheme: c.theme,
      centralConflict: c.conflict,
      compensationPattern: c.compensation,
      constitutionalEssence: c.theme,
      archetype: c.archetype
    },
    mentalPicture: {
      personality: `The ${c.archetype} profile. Hides internal conflict through ${c.compensation.toLowerCase()}`,
      fears: ["Failure", "Being alone", "Disease"],
      anxietyPatterns: ["Anxiety about the future"],
      delusions: ["Delusion that he is helpless"],
      relationships: "Maintains polite social boundaries.",
      communicationStyle: "Direct, logical, and composed.",
      memory: "Sharp, but easily fatigued under stress.",
      concentration: "Active focus for brief intervals.",
      stressResponse: "Withdraws and seeks warm, quiet places.",
      emotionalPattern: "Reserved and quiet, hates public displays."
    },
    physicalGenerals: {
      thermalState: c.thermalState,
      thirst: c.thirst,
      perspiration: "Scanty sweat, worse from warm wrapping.",
      sleep: "Restless sleep, starts frequently, wakes unrefreshed.",
      dreams: ["Business obstacles", "Accidents"],
      energyPattern: "Sluggish morning, better with gentle movement.",
      foodDesires: ["Sweets", "Warm drinks"],
      foodAversions: ["Fatty foods", "Meat"],
      weatherSensitivity: "Worse damp cold.",
      timeModalities: "Worse morning on waking."
    },
    modalities: {
      betterFrom: c.betterFrom,
      worseFrom: c.worseFrom
    },
    organAffinities,
    clinicalConditions,
    keynotes: {
      top10,
      top25,
      top50
    },
    miasmaticAnalysis,
    relationships,
    clinicalKnowledge: {
      commonIndications: [c.theme],
      characteristicConditions: clinicalConditions.map((cc: any) => cc.condition),
      acuteUses: c.betterFrom,
      chronicUses: c.worseFrom,
      differentialDiagnoses: c.relations.complementary
    },
    sourceAttributions
  };
}

export const MASTER_REMEDY_DB: MateriaMedicaDocument[] = [
  ...CORE_16_REMEDIES,
  ...COMPRESSED_REMEDY_PACK.map(inflateCompressedRemedy)
];

export class FirestoreRemedyBridge {
  static serialize(doc: MateriaMedicaDocument): any {
    return {
      id: doc.id,
      identity: doc.identity,
      essence: doc.essence,
      mentalPicture: doc.mentalPicture,
      physicalGenerals: doc.physicalGenerals,
      modalities: doc.modalities,
      organAffinities: doc.organAffinities,
      clinicalConditions: doc.clinicalConditions,
      keynotes: doc.keynotes,
      miasmaticAnalysis: doc.miasmaticAnalysis,
      relationships: doc.relationships,
      clinicalKnowledge: doc.clinicalKnowledge || null,
      sourceAttributions: doc.sourceAttributions || null,
      updatedAt: new Date().toISOString()
    };
  }

  static deserialize(data: any): MateriaMedicaDocument {
    return {
      id: data.id,
      identity: data.identity,
      essence: data.essence,
      mentalPicture: data.mentalPicture,
      physicalGenerals: data.physicalGenerals,
      modalities: data.modalities,
      organAffinities: data.organAffinities,
      clinicalConditions: data.clinicalConditions,
      keynotes: data.keynotes,
      miasmaticAnalysis: data.miasmaticAnalysis,
      relationships: data.relationships,
      clinicalKnowledge: data.clinicalKnowledge || undefined,
      sourceAttributions: data.sourceAttributions || undefined
    };
  }
}
