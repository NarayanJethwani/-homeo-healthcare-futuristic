export interface KnowledgeVisual {
  src: string;
  alt: string;
  label: string;
}

/**
 * Curated, topic-specific artwork. Images are added only after visual and
 * clinical-review checks; topics without an entry simply do not show a gallery.
 */
export const KNOWLEDGE_VISUALS: Record<string, KnowledgeVisual[]> = {
  "gastroesophageal-reflux-disease": [
    {
      src: "/images/knowledge/gerd/anatomy-v1.png",
      alt: "Illustrated view of the stomach and lower esophagus showing reflux",
      label: "Understanding reflux",
    },
    {
      src: "/images/knowledge/gerd/symptoms-v1.png",
      alt: "Illustrated upper torso showing the esophagus and stomach",
      label: "Recognising symptoms",
    },
    {
      src: "/images/knowledge/gerd/lifestyle-v1.png",
      alt: "Calm bedroom with an elevated head of bed",
      label: "Lifestyle support",
    },
  ],
  migraine: [
    {
      src: "/images/knowledge/migraine/understanding-v1.png",
      alt: "Profile of a person with an illuminated illustration of the head and temple area",
      label: "Understanding migraine",
    },
    {
      src: "/images/knowledge/migraine/recognising-v1.png",
      alt: "Person resting in a leafy outdoor setting with one hand gently at the temple",
      label: "Recognising a pattern",
    },
    {
      src: "/images/knowledge/migraine/support-v1.png",
      alt: "Person resting comfortably in a calm, low-light bedroom",
      label: "Making space to recover",
    },
  ],
  ibs: [
    {
      src: "/images/knowledge/ibs/understanding-v1.png",
      alt: "Stylised view of the digestive system with a gentle gut–brain connection motif",
      label: "Understanding IBS",
    },
    {
      src: "/images/knowledge/ibs/recognising-v1.png",
      alt: "Person keeping a blank journal at a kitchen table beside water and herbal infusion",
      label: "Noticing everyday patterns",
    },
    {
      src: "/images/knowledge/ibs/support-v1.png",
      alt: "Person taking an unhurried walk through a leafy garden",
      label: "Supporting daily routines",
    },
  ],
  heartburn: [
    {
      src: "/images/knowledge/heartburn/understanding-v1.png",
      alt: "Stylised upper torso showing the lower esophagus and stomach with a warm glow at their junction",
      label: "Understanding heartburn",
    },
    {
      src: "/images/knowledge/heartburn/recognising-v1.png",
      alt: "Person at a dining table taking a sip of water after a light meal",
      label: "Recognising the feeling",
    },
    {
      src: "/images/knowledge/heartburn/support-v1.png",
      alt: "Person sitting upright and reading in a calm evening room",
      label: "A calm next step",
    },
  ],
  indigestion: [
    {
      src: "/images/knowledge/indigestion/understanding-v1.png",
      alt: "Stylised view of the upper digestive system with the stomach softly illuminated",
      label: "Understanding indigestion",
    },
    {
      src: "/images/knowledge/indigestion/recognising-v1.png",
      alt: "Person enjoying a simple meal and glass of water at a home dining table",
      label: "Noticing after a meal",
    },
    {
      src: "/images/knowledge/indigestion/support-v1.png",
      alt: "Person writing in a blank notebook beside water and a houseplant",
      label: "Preparing your questions",
    },
  ],
  bloating: [
    {
      src: "/images/knowledge/bloating/understanding-v1.png",
      alt: "Stylised lower torso showing the stomach and intestines with a soft abdominal glow",
      label: "Understanding bloating",
    },
    {
      src: "/images/knowledge/bloating/recognising-v1.png",
      alt: "Person sitting comfortably after a meal with one hand resting gently over the abdomen",
      label: "Recognising the feeling",
    },
    {
      src: "/images/knowledge/bloating/support-v1.png",
      alt: "Person noting everyday patterns in a blank notebook beside a paper calendar",
      label: "Noticing patterns",
    },
  ],
  constipation: [
    {
      src: "/images/knowledge/constipation/understanding-v1.png",
      alt: "Transparent multicolour torso showing the large intestine and pelvic digestive tract",
      label: "Understanding constipation",
    },
    {
      src: "/images/knowledge/constipation/recognising-v1.png",
      alt: "Older man caring for potted herbs on a colourful sunny balcony",
      label: "Everyday routines",
    },
    {
      src: "/images/knowledge/constipation/support-v1.png",
      alt: "Doctor having a calm conversation with a patient in a colourful consultation room",
      label: "Knowing when to ask",
    },
  ],
  diarrhea: [
    {
      src: "/images/knowledge/diarrhea/understanding-v1.png",
      alt: "Prismatic transparent torso showing the intestines with soft aqua and magenta light flow",
      label: "Understanding diarrhoea",
    },
    {
      src: "/images/knowledge/diarrhea/recognising-v1.png",
      alt: "Young man taking a calm pause with a glass of water in a bright co-working studio",
      label: "Paying attention during the day",
    },
    {
      src: "/images/knowledge/diarrhea/learning-v1.png",
      alt: "Abstract microscopic-style intestinal landscape in aqua, magenta and gold",
      label: "A closer look at the gut",
    },
  ],
  "fatty-liver": [
    {
      src: "/images/knowledge/fatty-liver/understanding-v1.png",
      alt: "Transparent torso with the liver illuminated in jade, gold and copper tones",
      label: "Understanding fatty liver",
    },
    {
      src: "/images/knowledge/fatty-liver/recognising-v1.png",
      alt: "Woman choosing leafy vegetables at a vibrant outdoor produce market",
      label: "Everyday choices",
    },
    {
      src: "/images/knowledge/fatty-liver/learning-v1.png",
      alt: "Abstract microscopic-style landscape of translucent liver-cell-like forms",
      label: "A closer look at the liver",
    },
  ],
  "peptic-ulcer": [
    {
      src: "/images/knowledge/peptic-ulcer/understanding-v1.png",
      alt: "Transparent upper torso showing the stomach and duodenum with a subtle warm focal highlight",
      label: "Understanding peptic ulcers",
    },
    {
      src: "/images/knowledge/peptic-ulcer/learning-v1.png",
      alt: "Student studying anatomy at a sunlit university library",
      label: "Learning the basics",
    },
    {
      src: "/images/knowledge/peptic-ulcer/stomach-lining-v1.png",
      alt: "Abstract macro image inspired by translucent folds of the stomach lining",
      label: "A closer look at the stomach lining",
    },
  ],
  "gallstones-cholelithiasis": [
    {
      src: "/images/knowledge/gallstones-cholelithiasis/understanding-v1.png",
      alt: "Transparent upper torso showing the liver, gallbladder and bile duct in aquamarine and gold",
      label: "Understanding gallstones",
    },
    {
      src: "/images/knowledge/gallstones-cholelithiasis/lifestyle-v1.png",
      alt: "Father and daughter taking an easy stroll along a colourful waterfront promenade",
      label: "Everyday life and support",
    },
    {
      src: "/images/knowledge/gallstones-cholelithiasis/imaging-v1.png",
      alt: "Abstract imaging-inspired gallbladder in turquoise and gold light",
      label: "How imaging can help",
    },
  ],
  "tension-headache": [
    {
      src: "/images/knowledge/tension-headache/understanding-v1.png",
      alt: "Transparent side profile of the head and neck with gentle coloured bands around the temples and upper neck",
      label: "Understanding tension headache",
    },
    {
      src: "/images/knowledge/tension-headache/lifestyle-v1.png",
      alt: "Graphic designer taking a relaxed shoulder stretch in a colourful daylight art studio",
      label: "Making space to reset",
    },
    {
      src: "/images/knowledge/tension-headache/learning-v1.png",
      alt: "Abstract translucent ribbons inspired by neck and shoulder muscle fibres",
      label: "A closer look at muscle tension",
    },
  ],
  dizziness: [
    {
      src: "/images/knowledge/dizziness/understanding-v1.png",
      alt: "Transparent head profile with the inner ear and balance pathways softly illuminated",
      label: "Understanding dizziness",
    },
    {
      src: "/images/knowledge/dizziness/lifestyle-v1.png",
      alt: "Woman pausing calmly beside a bright conservatory window",
      label: "Pausing and noticing",
    },
    {
      src: "/images/knowledge/dizziness/learning-v1.png",
      alt: "Abstract seafoam and coral forms inspired by the inner ear balance system",
      label: "A closer look at balance",
    },
  ],
  vertigo: [
    {
      src: "/images/knowledge/vertigo/understanding-v1.png",
      alt: "Transparent head profile with inner-ear canals and vestibular pathways highlighted in indigo, tangerine and sea-glass green",
      label: "Understanding vertigo",
    },
    {
      src: "/images/knowledge/vertigo/lifestyle-v1.png",
      alt: "Older woman enjoying a calm moment on a colourful tiled terrace overlooking the sea",
      label: "Taking a steady moment",
    },
    {
      src: "/images/knowledge/vertigo/learning-v1.png",
      alt: "Abstract glassy inner-ear forms with fine geometric orientation arcs",
      label: "A closer look at orientation",
    },
  ],
  anxiety: [
    {
      src: "/images/knowledge/anxiety/understanding-v1.png",
      alt: "Transparent profile showing a calm brain and heart connection",
      label: "Understanding anxiety",
    },
    {
      src: "/images/knowledge/anxiety/lifestyle-v1.png",
      alt: "Woman shaping clay in a sunlit ceramics workshop",
      label: "A grounding moment",
    },
    {
      src: "/images/knowledge/anxiety/learning-v1.png",
      alt: "Abstract neural and heart-rhythm-inspired light threads",
      label: "Mind-body connection",
    },
  ],
  "mental-brain-fog": [
    {
      src: "/images/knowledge/mental-brain-fog/understanding-v1.png",
      alt: "Transparent profile showing a softly illuminated cognitive network emerging through a gentle mist",
      label: "Understanding brain fog",
    },
    {
      src: "/images/knowledge/mental-brain-fog/lifestyle-v1.png",
      alt: "Woman thinking in a bright botanical conservatory library beside a blank notebook",
      label: "Finding your focus",
    },
    {
      src: "/images/knowledge/mental-brain-fog/learning-v1.png",
      alt: "Abstract cognitive pathways resolving from lavender mist into aqua and amber light",
      label: "A closer look at cognition",
    },
  ],
  "peripheral-neuropathy": [
    {
      src: "/images/knowledge/peripheral-neuropathy/understanding-v1.png",
      alt: "Transparent lower-leg and foot anatomy with peripheral nerve pathways illuminated in multiple colours",
      label: "Understanding peripheral nerves",
    },
    {
      src: "/images/knowledge/peripheral-neuropathy/lifestyle-v1.png",
      alt: "Middle-aged man putting on walking shoes in a bright community greenhouse",
      label: "Preparing for a walk",
    },
    {
      src: "/images/knowledge/peripheral-neuropathy/learning-v1.png",
      alt: "Glass-like full-body peripheral nerve pathways in turquoise, violet, and amber light",
      label: "A closer look at nerve pathways",
    },
  ],
  sciatica: [
    {
      src: "/images/knowledge/sciatica/understanding-v1.png",
      alt: "Transparent side-view lower-back, pelvis, and leg anatomy with the sciatic nerve highlighted in gold",
      label: "Understanding the sciatic nerve",
    },
    {
      src: "/images/knowledge/sciatica/lifestyle-v1.png",
      alt: "Young woman enjoying a relaxed walk along a colourful riverside public-art walkway",
      label: "A gentle movement moment",
    },
    {
      src: "/images/knowledge/sciatica/learning-v1.png",
      alt: "Warm glass sculpture of lumbar vertebrae flowing into a leg-shaped nerve pathway",
      label: "A closer look at the pathway",
    },
  ],
  eczema: [
    {
      src: "/images/knowledge/eczema/understanding-v1.png",
      alt: "Transparent pastel skin layers with gentle moisture-like droplets and a luminous surface",
      label: "Understanding the skin barrier",
    },
    {
      src: "/images/knowledge/eczema/lifestyle-v2.png",
      alt: "Indian woman with a mild eczema patch on her forearm seated calmly by a bright home window",
      label: "Living with eczema",
    },
    {
      src: "/images/knowledge/eczema/learning-v1.png",
      alt: "Abstract translucent cellular layers and water-like glass droplets in soft pastel light",
      label: "A closer look at the barrier",
    },
  ],
  "acne-vulgaris": [
    {
      src: "/images/knowledge/acne-vulgaris/understanding-v1.png",
      alt: "Colourful close view of skin layers, a hair follicle, and a sebaceous gland",
      label: "Understanding the follicle",
    },
    {
      src: "/images/knowledge/acne-vulgaris/lifestyle-v1.png",
      alt: "Young man with mild to moderate acne on his cheeks in a bright independent record and book shop",
      label: "Living with acne",
    },
    {
      src: "/images/knowledge/acne-vulgaris/learning-v1.png",
      alt: "Abstract colourful glass forms inspired by skin follicles and cellular pathways",
      label: "A closer look at the skin",
    },
  ],
  psoriasis: [
    {
      src: "/images/knowledge/psoriasis/understanding-v1.png",
      alt: "Transparent colourful layers of skin with stylised cellular forms rising above the surface",
      label: "Understanding skin renewal",
    },
    {
      src: "/images/knowledge/psoriasis/lifestyle-v1.png",
      alt: "Woman with a mild psoriasis plaque on her elbow seated calmly at a colourful community garden table",
      label: "Living with psoriasis",
    },
    {
      src: "/images/knowledge/psoriasis/learning-v1.png",
      alt: "Abstract iridescent cell clusters moving through colourful concentric waves",
      label: "A closer look at skin activity",
    },
  ],
  "hair-fall": [
    {
      src: "/images/knowledge/hair-fall/understanding-v1.png",
      alt: "Transparent cross-section of a scalp and hair follicle with fine cellular detail",
      label: "Understanding the hair follicle",
    },
    {
      src: "/images/knowledge/hair-fall/lifestyle-v1.png",
      alt: "Indian woman with subtle diffuse hair thinning arranging colourful flowers in a bright florist studio",
      label: "Living with hair fall",
    },
    {
      src: "/images/knowledge/hair-fall/learning-v1.png",
      alt: "Abstract translucent hair strands flowing through luminous cellular rings",
      label: "A closer look at hair cycles",
    },
  ],
  "alopecia-areata": [
    {
      src: "/images/knowledge/alopecia-areata/understanding-v1.png",
      alt: "Transparent scalp and hair-follicle anatomy with gentle coloured cell-like light forms",
      label: "Understanding the follicle",
    },
    {
      src: "/images/knowledge/alopecia-areata/lifestyle-v1.png",
      alt: "Indian woman with a small visible hair-loss patch seated confidently in a colourful art-supply store",
      label: "Living with alopecia areata",
    },
    {
      src: "/images/knowledge/alopecia-areata/learning-v1.png",
      alt: "Abstract glass follicles arranged as luminous constellations with coloured cellular rings",
      label: "A closer look at the process",
    },
  ],
  vitiligo: [
    {
      src: "/images/knowledge/vitiligo/understanding-v1.png",
      alt: "Transparent skin layers with luminous melanocyte-like cells and pigment particles",
      label: "Understanding skin pigment",
    },
    {
      src: "/images/knowledge/vitiligo/lifestyle-v1.png",
      alt: "Indian man with visible vitiligo patches on his hand and neck creating a colourful community mural",
      label: "Living with vitiligo",
    },
    {
      src: "/images/knowledge/vitiligo/learning-v1.png",
      alt: "Abstract glass ribbon carrying colourful luminous pigment-like particles",
      label: "A closer look at pigment",
    },
  ],
  "allergic-rhinitis": [
    {
      src: "/images/knowledge/allergic-rhinitis/understanding-v1.png",
      alt: "Transparent side-profile head anatomy with nasal passages, sinuses, and soft airflow ribbons",
      label: "Understanding nasal passages",
    },
    {
      src: "/images/knowledge/allergic-rhinitis/lifestyle-v1.png",
      alt: "Indian woman walking through a colourful open-air weekend book market",
      label: "A fresh-air moment",
    },
    {
      src: "/images/knowledge/allergic-rhinitis/learning-v1.png",
      alt: "Abstract translucent pollen-like spheres moving along flowing glass ribbons",
      label: "A closer look at allergens",
    },
  ],
  sinusitis: [
    {
      src: "/images/knowledge/sinusitis/understanding-v1.png",
      alt: "Transparent side-profile head anatomy with frontal and maxillary sinuses softly illuminated",
      label: "Understanding the sinuses",
    },
    {
      src: "/images/knowledge/sinusitis/lifestyle-v1.png",
      alt: "Indian man enjoying a calm early-morning walk through a colourful heritage courtyard",
      label: "An outdoor moment",
    },
    {
      src: "/images/knowledge/sinusitis/learning-v1.png",
      alt: "Abstract translucent branching chambers inspired by air passages",
      label: "A closer look at airflow",
    },
  ],
  asthma: [
    {
      src: "/images/knowledge/asthma/understanding-v1.png",
      alt: "Transparent upper-torso anatomy showing lungs, bronchi, and fine branching airways",
      label: "Understanding the airways",
    },
    {
      src: "/images/knowledge/asthma/lifestyle-v1.png",
      alt: "Indian woman taking a calm sunrise walk along a colourful garden promenade",
      label: "An everyday outdoor moment",
    },
    {
      src: "/images/knowledge/asthma/learning-v1.png",
      alt: "Abstract translucent airway branches ending in luminous alveoli-inspired spheres",
      label: "A closer look at breathing",
    },
  ],
  "chronic-cough": [
    {
      src: "/images/knowledge/chronic-cough/understanding-v1.png",
      alt: "Transparent throat-to-chest anatomy showing the larynx, trachea, bronchi, and lungs",
      label: "Understanding the airways",
    },
    {
      src: "/images/knowledge/chronic-cough/lifestyle-v1.png",
      alt: "Indian man relaxing in a colourful sunlit music studio with a classical string instrument",
      label: "An everyday creative moment",
    },
    {
      src: "/images/knowledge/chronic-cough/learning-v1.png",
      alt: "Abstract glass larynx and branching airway sculpture with delicate coloured resonance ribbons",
      label: "A closer look at the airway",
    },
  ],
  "recurrent-cold": [
    {
      src: "/images/knowledge/recurrent-cold/understanding-v1.png",
      alt: "Transparent side-profile anatomy showing the nasal cavity, throat, and upper airway lining",
      label: "Understanding the upper airway",
    },
    {
      src: "/images/knowledge/recurrent-cold/lifestyle-v1.png",
      alt: "Indian woman arranging fresh flowers by a sunny window in a colourful home",
      label: "An everyday home moment",
    },
    {
      src: "/images/knowledge/recurrent-cold/learning-v1.png",
      alt: "Abstract translucent cilia-like fibres with softly illuminated protective wave layers",
      label: "A closer look at the lining",
    },
  ],
  "sore-throat": [
    {
      src: "/images/knowledge/sore-throat/understanding-v1.png",
      alt: "Transparent lower-face and neck anatomy showing the mouth, pharynx, larynx, and upper trachea",
      label: "Understanding the throat",
    },
    {
      src: "/images/knowledge/sore-throat/lifestyle-v1.png",
      alt: "Indian man making colourful paper kites on a sunny rooftop terrace",
      label: "An everyday creative moment",
    },
    {
      src: "/images/knowledge/sore-throat/learning-v1.png",
      alt: "Abstract transparent larynx-inspired sculpture with flowing coral and aqua resonance ribbons",
      label: "A closer look at the voice box",
    },
  ],
  laryngitis: [
    {
      src: "/images/knowledge/laryngitis/understanding-v1.png",
      alt: "Transparent neck anatomy focused on the larynx, vocal folds, and upper trachea",
      label: "Understanding the voice box",
    },
    {
      src: "/images/knowledge/laryngitis/lifestyle-v1.png",
      alt: "Indian woman adjusting a hand-painted stage backdrop in a colourful community theatre",
      label: "An everyday creative moment",
    },
    {
      src: "/images/knowledge/laryngitis/learning-v1.png",
      alt: "Abstract glass vocal-fold-inspired sculpture with flowing violet and gold resonance ribbons",
      label: "A closer look at voice",
    },
  ],
  sleeplessness: [
    {
      src: "/images/knowledge/sleeplessness/understanding-v1.png",
      alt: "Transparent side-profile head anatomy with a softly illuminated brain and neural pathways",
      label: "Understanding sleep regulation",
    },
    {
      src: "/images/knowledge/sleeplessness/lifestyle-v1.png",
      alt: "Indian woman writing in a notebook on a softly lit apartment balcony at twilight",
      label: "An evening reflection moment",
    },
    {
      src: "/images/knowledge/sleeplessness/learning-v1.png",
      alt: "Abstract translucent indigo and mint arcs orbiting a softly glowing amber core",
      label: "A closer look at rhythms",
    },
  ],
  hypothyroidism: [
    {
      src: "/images/knowledge/hypothyroidism/understanding-v1.png",
      alt: "Transparent front-of-neck anatomy showing the butterfly-shaped thyroid gland and surrounding structures",
      label: "Understanding the thyroid",
    },
    {
      src: "/images/knowledge/hypothyroidism/lifestyle-v1.png",
      alt: "Indian woman viewing a colourful abstract painting in a contemporary art gallery",
      label: "An everyday gallery moment",
    },
    {
      src: "/images/knowledge/hypothyroidism/learning-v1.png",
      alt: "Abstract emerald glass thyroid-inspired form with rose-gold luminous signalling pathways",
      label: "A closer look at signalling",
    },
  ],
  hyperthyroidism: [
    {
      src: "/images/knowledge/hyperthyroidism/understanding-v1.png",
      alt: "Transparent front-of-neck anatomy showing the thyroid gland, trachea, and surrounding vessels",
      label: "Understanding the thyroid",
    },
    {
      src: "/images/knowledge/hyperthyroidism/lifestyle-v1.png",
      alt: "Indian man reviewing a personal journal and appointment folder at a sunlit home worktable",
      label: "A patient-owned planning moment",
    },
    {
      src: "/images/knowledge/hyperthyroidism/learning-v1.png",
      alt: "Abstract cobalt glass thyroid-inspired form with marigold particles and smooth signalling pathways",
      label: "A closer look at signalling",
    },
  ],
  "diabetes-mellitus": [
    {
      src: "/images/knowledge/diabetes-mellitus/understanding-v1.png",
      alt: "Transparent upper-abdomen anatomy showing the pancreas, liver, stomach, and surrounding structures",
      label: "Understanding the pancreas",
    },
    {
      src: "/images/knowledge/diabetes-mellitus/lifestyle-v1.png",
      alt: "Indian woman writing her own questions in a notebook in a bright community health-centre lounge",
      label: "A patient-owned preparation moment",
    },
    {
      src: "/images/knowledge/diabetes-mellitus/learning-v1.png",
      alt: "Abstract translucent islet-inspired core with coral and gold spheres moving through aqua glass pathways",
      label: "A closer look at signalling",
    },
  ],
  hypertension: [
    {
      src: "/images/knowledge/hypertension/understanding-v1.png",
      alt: "Transparent upper-torso anatomy showing the heart, great vessels, and branching arteries",
      label: "Understanding circulation",
    },
    {
      src: "/images/knowledge/hypertension/lifestyle-v1.png",
      alt: "Older Indian man sharing his own notebook questions with his daughter on a sunlit verandah",
      label: "A patient-led support moment",
    },
    {
      src: "/images/knowledge/hypertension/learning-v1.png",
      alt: "Abstract transparent teal and burgundy vessel-like sculpture with coral and gold light pulses",
      label: "A closer look at circulation",
    },
  ],
  pcos: [
    {
      src: "/images/knowledge/pcos/understanding-v1.png",
      alt: "Transparent clinical anatomy model showing the uterus, ovaries, and fallopian tubes",
      label: "Understanding the ovaries",
    },
    {
      src: "/images/knowledge/pcos/lifestyle-v1.png",
      alt: "Indian woman privately filling in a personal planner in a colourful community library",
      label: "A patient-owned planning moment",
    },
    {
      src: "/images/knowledge/pcos/learning-v1.png",
      alt: "Abstract ruby and aqua glass contours surrounding a luminous cluster of pearl-like spheres",
      label: "A closer look at signalling",
    },
  ],
  "menstrual-irregularity": [
    {
      src: "/images/knowledge/menstrual-irregularity/understanding-v1.png",
      alt: "Transparent clinical anatomy model showing the uterus, ovaries, and fallopian tubes",
      label: "Understanding the cycle",
    },
    {
      src: "/images/knowledge/menstrual-irregularity/lifestyle-v1.png",
      alt: "Indian woman discussing her personal planning notes with a trusted friend in a light-filled community setting",
      label: "A supported conversation",
    },
    {
      src: "/images/knowledge/menstrual-irregularity/learning-v1.png",
      alt: "Abstract translucent indigo and coral glass layers expressing a changing cycle pattern",
      label: "A closer look at patterns",
    },
  ],
  dysmenorrhea: [
    {
      src: "/images/knowledge/dysmenorrhea/understanding-v1.png",
      alt: "Close transparent educational cutaway of uterine muscle layers with gentle coral rhythmic waveforms",
      label: "Understanding cramp patterns",
    },
    {
      src: "/images/knowledge/dysmenorrhea/lifestyle-v1.png",
      alt: "Indian woman taking a quiet, intentional pause in a warm home reading corner",
      label: "A patient-led comfort moment",
    },
    {
      src: "/images/knowledge/dysmenorrhea/learning-v1.png",
      alt: "Abstract rose, periwinkle, and teal translucent ribbons gently wrapped around a luminous core",
      label: "A closer look at rhythm",
    },
  ],
  "urinary-tract-infection": [
    {
      src: "/images/knowledge/urinary-tract-infection/understanding-v1.png",
      alt: "Transparent clinical anatomy model showing the kidneys, ureters, and bladder",
      label: "Understanding the urinary system",
    },
    {
      src: "/images/knowledge/urinary-tract-infection/lifestyle-v1.png",
      alt: "Indian woman leading a question-focused conversation with a clinician in a calm consultation room",
      label: "A patient-led care conversation",
    },
    {
      src: "/images/knowledge/urinary-tract-infection/learning-v1.png",
      alt: "Abstract emerald glass pathways carrying luminous copper droplets through a deep teal space",
      label: "A closer look at pathways",
    },
  ],
  "vitamin-d-deficiency": [
    {
      src: "/images/knowledge/vitamin-d-deficiency/understanding-v1.png",
      alt: "Transparent educational bone cross-section with a fine honeycomb-like internal architecture",
      label: "Understanding bone health",
    },
    {
      src: "/images/knowledge/vitamin-d-deficiency/lifestyle-v1.png",
      alt: "Indian woman leading a family food-planning moment in a colourful sunlit kitchen",
      label: "A patient-led everyday plan",
    },
    {
      src: "/images/knowledge/vitamin-d-deficiency/learning-v1.png",
      alt: "Abstract aqua-and-pearl crystalline lattice illuminated by golden light in a cobalt space",
      label: "A closer look at balance",
    },
  ],
  "vitamin-b12-deficiency": [
    {
      src: "/images/knowledge/vitamin-b12-deficiency/understanding-v1.png",
      alt: "Educational composition of translucent ruby-red blood cells beside a violet nerve fibre",
      label: "Understanding blood and nerves",
    },
    {
      src: "/images/knowledge/vitamin-b12-deficiency/lifestyle-v1.png",
      alt: "Indian man leading a personal question conversation with his adult daughter in a community library",
      label: "A patient-led support moment",
    },
    {
      src: "/images/knowledge/vitamin-b12-deficiency/learning-v1.png",
      alt: "Abstract copper pathways weaving between ruby discs and violet glass filaments",
      label: "A closer look at connections",
    },
  ],
  anemia: [
    {
      src: "/images/knowledge/anemia/understanding-v1.png",
      alt: "Educational ruby-red blood cell forms moving through a translucent jade vessel",
      label: "Understanding blood health",
    },
    {
      src: "/images/knowledge/anemia/lifestyle-v1.png",
      alt: "Indian woman leading an everyday food-planning moment at a colourful produce market",
      label: "A patient-led everyday plan",
    },
    {
      src: "/images/knowledge/anemia/learning-v1.png",
      alt: "Abstract ruby discs rising through a jade-and-copper transparent spiral",
      label: "A closer look at patterns",
    },
  ],
  cbc: [
    {
      src: "/images/knowledge/cbc/understanding-v1.png",
      alt: "Educational composition of ruby-red cells, a pearl-white cell, and small violet platelet-like discs",
      label: "Understanding the main cell types",
    },
    {
      src: "/images/knowledge/cbc/lifestyle-v1.png",
      alt: "Indian man preparing his own questions from a plain lab report in a light-filled café",
      label: "A patient-led report review",
    },
    {
      src: "/images/knowledge/cbc/learning-v1.png",
      alt: "Abstract ruby, pearl, and violet cell-inspired forms moving through transparent indigo rings",
      label: "A closer look at the count",
    },
  ],
  dandruff: [
    {
      src: "/images/knowledge/dandruff/understanding-v1.png",
      alt: "Transparent scalp cross-section with hair follicles, skin layers, and fine dandruff flakes at the surface",
      label: "Understanding the scalp",
    },
    {
      src: "/images/knowledge/dandruff/lifestyle-v1.png",
      alt: "Indian man with subtle scalp flaking checking his hair in a bright modern barbershop",
      label: "A real-world scalp check",
    },
    {
      src: "/images/knowledge/dandruff/learning-v1.png",
      alt: "Abstract hair strands emerging through luminous skin layers with fine white flakes and golden droplets",
      label: "A closer look at scalp renewal",
    },
  ],
  urticaria: [
    {
      src: "/images/knowledge/urticaria/understanding-v1.png",
      alt: "Transparent skin cross-section with a raised wheal, fine vessels, and gentle luminous particles",
      label: "Understanding hives",
    },
    {
      src: "/images/knowledge/urticaria/lifestyle-v1.png",
      alt: "Indian woman using a cool compress on a mild hives flare on her forearm at home",
      label: "A calm self-care moment",
    },
    {
      src: "/images/knowledge/urticaria/learning-v1.png",
      alt: "Abstract transparent skin contours with raised waves and colourful vessel-like pathways",
      label: "A closer look at a flare",
    },
  ],
  "seborrheic-dermatitis": [
    {
      src: "/images/knowledge/seborrheic-dermatitis/understanding-v1.png",
      alt: "Transparent facial and scalp skin illustration showing flaky areas around the hairline, brows, and nose",
      label: "Understanding affected areas",
    },
    {
      src: "/images/knowledge/seborrheic-dermatitis/lifestyle-v1.png",
      alt: "Indian man using gentle moisturiser along a flaky hairline on a sunlit home balcony",
      label: "An everyday care moment",
    },
    {
      src: "/images/knowledge/seborrheic-dermatitis/learning-v1.png",
      alt: "Abstract translucent skin planes with hair filaments, coral flakes, and amber droplets",
      label: "A closer look at skin balance",
    },
  ],
  intertrigo: [
    {
      src: "/images/knowledge/intertrigo/understanding-v1.png",
      alt: "Transparent skin-fold illustration showing mild irritation and moisture between skin surfaces",
      label: "Understanding skin-fold irritation",
    },
    {
      src: "/images/knowledge/intertrigo/lifestyle-v1.png",
      alt: "Indian woman preparing a clean towel and water for a comfortable cooling-and-drying routine at home",
      label: "A practical everyday routine",
    },
    {
      src: "/images/knowledge/intertrigo/learning-v1.png",
      alt: "Abstract translucent skin-like planes separated by clear aqua moisture droplets",
      label: "A closer look at moisture and friction",
    },
  ],
  "dry-skin": [
    {
      src: "/images/knowledge/dry-skin/understanding-v1.png",
      alt: "Transparent skin layers with fine surface texture, water droplets, and lipid-like forms beneath the barrier",
      label: "Understanding the skin barrier",
    },
    {
      src: "/images/knowledge/dry-skin/lifestyle-v1.png",
      alt: "Older Indian woman applying fragrance-free moisturiser to a mildly dry lower leg in a sunlit bedroom",
      label: "An everyday moisturising routine",
    },
    {
      src: "/images/knowledge/dry-skin/learning-v1.png",
      alt: "Abstract pearl and peach skin-like membranes carrying luminous aqua droplets and golden ribbons",
      label: "A closer look at hydration",
    },
  ],
  "skin-rash": [
    {
      src: "/images/knowledge/skin-rash/understanding-v1.png",
      alt: "Warm-brown forearm with a few mild rash patches beside a transparent skin-layer illustration",
      label: "Understanding a rash",
    },
    {
      src: "/images/knowledge/skin-rash/lifestyle-v1.png",
      alt: "Indian young adult noticing a few mild rash patches on her upper arm in a colourful ceramics studio",
      label: "Noticing a new change",
    },
    {
      src: "/images/knowledge/skin-rash/learning-v1.png",
      alt: "Abstract coral and violet skin-like contours with teal and gold cellular light forms",
      label: "A closer look at skin responses",
    },
  ],
  "contact-dermatitis": [
    {
      src: "/images/knowledge/contact-dermatitis/understanding-v1.png",
      alt: "Indian adult with a mild wrist rash and a transparent skin-layer illustration",
      label: "Understanding contact dermatitis",
    },
    {
      src: "/images/knowledge/contact-dermatitis/lifestyle-v1.png",
      alt: "Indian florist using protective gloves while handling flowers in a bright shop",
      label: "Noticing everyday triggers",
    },
    {
      src: "/images/knowledge/contact-dermatitis/learning-v1.png",
      alt: "Transparent skin-barrier illustration with leaf, metal clasp, and fragrance-droplet motifs",
      label: "A closer look at the barrier",
    },
  ],
  "ringworm-tinea-corporis": [
    {
      src: "/images/knowledge/ringworm-tinea-corporis/understanding-v1.png",
      alt: "Indian adult's forearm with a small ring-shaped patch and a transparent skin-layer overlay",
      label: "Understanding ringworm",
    },
    {
      src: "/images/knowledge/ringworm-tinea-corporis/lifestyle-v1.png",
      alt: "Indian young adult packing a dry T-shirt, clean towel, and water bottle after badminton",
      label: "An everyday prevention habit",
    },
    {
      src: "/images/knowledge/ringworm-tinea-corporis/learning-v1.png",
      alt: "Abstract skin-layer illustration with delicate branching fungal-like forms above the surface",
      label: "A closer look at the skin surface",
    },
  ],
  "athletes-foot-tinea-pedis": [
    {
      src: "/images/knowledge/athletes-foot-tinea-pedis/understanding-v1.png",
      alt: "Transparent foot illustration with skin layers highlighted between the toes",
      label: "Understanding athlete’s foot",
    },
    {
      src: "/images/knowledge/athletes-foot-tinea-pedis/lifestyle-v1.png",
      alt: "Indian young adult putting on clean dry socks after exercise at a climbing studio",
      label: "A practical prevention habit",
    },
    {
      src: "/images/knowledge/athletes-foot-tinea-pedis/learning-v1.png",
      alt: "Abstract translucent skin-like layers with water droplets lifting into a gentle airflow",
      label: "A closer look at keeping feet dry",
    },
  ],
  "jock-itch-tinea-cruris": [
    {
      src: "/images/knowledge/jock-itch-tinea-cruris/understanding-v1.png",
      alt: "Fully clothed side-view lower-torso illustration with a transparent overlay at the inner thigh skin fold",
      label: "Understanding jock itch",
    },
    {
      src: "/images/knowledge/jock-itch-tinea-cruris/lifestyle-v1.png",
      alt: "Indian woman packing a clean towel and fresh workout clothing into a gym bag in a bright laundry room",
      label: "An everyday hygiene habit",
    },
    {
      src: "/images/knowledge/jock-itch-tinea-cruris/learning-v1.png",
      alt: "Abstract breathable fabric and skin-like layers with moisture droplets lifting into circulating air",
      label: "A closer look at airflow and moisture",
    },
  ],
  "tinea-versicolor": [
    {
      src: "/images/knowledge/tinea-versicolor/understanding-v1.png",
      alt: "Indian woman viewed from behind with subtle patchy shoulder skin colour changes and a transparent skin-layer cutaway",
      label: "Understanding tinea versicolor",
    },
    {
      src: "/images/knowledge/tinea-versicolor/lifestyle-v1.png",
      alt: "Indian woman choosing a breathable cotton shirt in a sunlit textile-design studio",
      label: "An everyday comfort choice",
    },
    {
      src: "/images/knowledge/tinea-versicolor/learning-v1.png",
      alt: "Abstract translucent mosaic of varied skin-like tones under a gentle curved lens of light",
      label: "A closer look at skin colour variation",
    },
  ],
  "onychomycosis-fungal-nail-infection": [
    {
      src: "/images/knowledge/onychomycosis-fungal-nail-infection/understanding-v1.png",
      alt: "Indian woman’s foot with a subtle fungal nail change and a transparent nail-layer cutaway",
      label: "Understanding fungal nail infection",
    },
    {
      src: "/images/knowledge/onychomycosis-fungal-nail-infection/lifestyle-v1.png",
      alt: "Older Indian man putting on a fresh sock and breathable walking shoe at home",
      label: "An everyday prevention habit",
    },
    {
      src: "/images/knowledge/onychomycosis-fungal-nail-infection/learning-v1.png",
      alt: "Transparent three-dimensional nail cutaway with layers beneath the nail plate",
      label: "A closer look at the nail layers",
    },
  ],
  "plantar-warts-verrucas": [
    {
      src: "/images/knowledge/plantar-warts-verrucas/understanding-v1.png",
      alt: "Indian woman inspecting a small sole spot with a transparent pressure-ring overlay",
      label: "Understanding plantar warts",
    },
    {
      src: "/images/knowledge/plantar-warts-verrucas/lifestyle-v1.png",
      alt: "Indian swimmer putting on clean sandals in a bright pool changing area",
      label: "A practical prevention habit",
    },
    {
      src: "/images/knowledge/plantar-warts-verrucas/learning-v1.png",
      alt: "Transparent three-dimensional sole-skin cutaway with a small contained plantar-wart area",
      label: "A closer look at the sole skin",
    },
  ],
  "scabies": [
    {
      src: "/images/knowledge/scabies/understanding-v1.png",
      alt: "Indian woman noticing a mild itchy hand rash with a transparent skin-barrier overlay",
      label: "Understanding scabies",
    },
    {
      src: "/images/knowledge/scabies/lifestyle-v1.png",
      alt: "Indian couple working together with linens in a bright home laundry room",
      label: "A coordinated household step",
    },
    {
      src: "/images/knowledge/scabies/learning-v1.png",
      alt: "Transparent skin-layer illustration with a delicate conceptual pathway in the outer layer",
      label: "A closer look at the skin surface",
    },
  ],
  "impetigo": [
    {
      src: "/images/knowledge/impetigo/understanding-v1.png",
      alt: "Indian mother gently checking a child’s mild healing crust near the mouth with a transparent skin-barrier overlay",
      label: "Understanding impetigo",
    },
    {
      src: "/images/knowledge/impetigo/lifestyle-v1.png",
      alt: "Indian father helping a child wash hands in a colourful family bathroom",
      label: "A practical hygiene habit",
    },
    {
      src: "/images/knowledge/impetigo/learning-v1.png",
      alt: "Transparent skin-layer illustration with a small contained golden surface crust area",
      label: "A closer look at the skin surface",
    },
  ],
  "hand-foot-mouth-disease": [
    { src: "/images/knowledge/hand-foot-mouth-disease/understanding-v1.png", alt: "Indian mother offering a cool drink to a comfortable child with mild hand spots", label: "Understanding hand, foot and mouth disease" },
    { src: "/images/knowledge/hand-foot-mouth-disease/lifestyle-v1.png", alt: "Indian parent and child washing hands together after school", label: "A practical prevention habit" },
    { src: "/images/knowledge/hand-foot-mouth-disease/learning-v1.png", alt: "Transparent abstract medical illustration connecting mouth, hand, and foot skin layers", label: "A closer look at the pattern" },
  ],
  "chickenpox-varicella": [
    { src: "/images/knowledge/chickenpox-varicella/understanding-v1.png", alt: "Indian mother comforting a school-age child with a few mild healing upper-arm spots", label: "Understanding chickenpox" },
    { src: "/images/knowledge/chickenpox-varicella/lifestyle-v1.png", alt: "Indian father preparing a calm child bedroom with fresh sleepwear, water, and a storybook", label: "A comfort-care routine" },
    { src: "/images/knowledge/chickenpox-varicella/learning-v1.png", alt: "Transparent skin-layer illustration showing a spot, a small blister, and a dry crust stage", label: "A closer look at rash stages" },
  ],
};

export function getKnowledgeVisuals(slug: string): KnowledgeVisual[] {
  return KNOWLEDGE_VISUALS[slug] || [];
}
