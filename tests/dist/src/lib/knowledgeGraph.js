"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemedyProfile = exports.getKnowledgeGraph = exports.KNOWLEDGE_GRAPH_EDGES = exports.KNOWLEDGE_GRAPH_NODES = void 0;
const materiaMedicaDb_1 = require("./materiaMedicaDb");
const normalizationEngine_1 = require("./normalizationEngine");
// Seed data structures
exports.KNOWLEDGE_GRAPH_NODES = [
    // --- REMEDIES (10) ---
    {
        id: 'rem_sulphur',
        label: 'Sulphur',
        type: 'remedy',
        metadata: {
            description: 'Pure sublimed sulphur. The king of chronic remedies, matching the psoric constitution.',
            profile: {
                mentalThemes: ['Egotism', 'Philosophical speculation', 'Disorganized/untidy', 'Irritability when questioned', 'Indifference to beauty/appearances'],
                generals: ['Hot-blooded', 'Worse standing', 'Empty, sinking feeling in stomach at 11 AM', 'Desires open air', 'Aversion to bathing'],
                particulars: ['Burning heat in soles of feet at night', 'Dry, red, itchy skin eruptions', 'Redness of all external orifices'],
                modalities: ['Worse warmth of bed', 'Worse standing still', 'Worse washing/bathing', 'Better cold open air'],
                thermals: 'Hot-blooded (aggravated by heat, desires cold)',
                cravings: ['Sweets', 'Spices', 'Fats', 'Cold drinks'],
                aversions: ['Warm food', 'Meat', 'Bathing'],
                sleep: 'Restless, wakes frequently, cats-naps, burns soles of feet in bed forcing to throw off blankets',
                dreams: 'Vivid, anxious, dreams of fires, high places',
                fears: ['Infection', 'Disease', 'Failure', 'High places'],
                miasms: ['Psora'],
                kingdom: 'Mineral',
                family: 'Elements / Chalcogens',
                sourceSubstance: 'Sublimed Sulphur',
                relationships: {
                    complementaries: ['Lycopodium Clavatum', 'Nux Vomica', 'Psorinum'],
                    inimicals: ['Sepia Officinalis'],
                    followWell: ['Calcarea Carbonica', 'Lycopodium Clavatum']
                },
                clinicalUses: ['Atopic eczema', 'Asthma', 'Chronic dyspepsia', 'Hemorrhoids', 'Boils'],
                keynotes: ['Sinking feeling at 11 AM', 'Burning feet in bed', 'Worse warmth of bed', 'Red orifices', 'Ragged philosopher'],
                toxicology: 'Dermal irritation, breathing distress, liver congestion, metabolic sluggishness.',
                essence: 'The ego expansion. Outward expression of heat, theories, and eruptions. Struggle between self-worth and messy physical reality.'
            }
        }
    },
    {
        id: 'rem_lycopodium',
        label: 'Lycopodium Clavatum',
        type: 'remedy',
        metadata: {
            description: 'Club moss spores. A deep-acting polychrest matching weak digestion and anticipatory anxiety.',
            profile: {
                mentalThemes: ['Lack of self-confidence', 'Hiding anxiety behind authoritarian behavior', 'Anticipatory stage fright', 'Fear of failure', 'Intellectual supremacy'],
                generals: ['Right-sided symptoms', 'Symptoms worse 4 PM to 8 PM', 'Sweets craving', 'Chilly but wants cool air for head'],
                particulars: ['Abdominal flatulence and bloating immediately after eating', 'Right-sided headaches', 'Dry throat, right side to left'],
                modalities: ['Worse 4 PM to 8 PM', 'Worse warm rooms', 'Better warm drinks and food', 'Better open cool air'],
                thermals: 'Chilly, yet desires cold open air (except stomach, which wants warm)',
                cravings: ['Sweets', 'Warm food', 'Warm drinks', 'Pastries'],
                aversions: ['Cold food', 'Bread', 'Meat'],
                sleep: 'Unrefreshing, wakes cross or hungry, wakes at 3 AM with overactive mind',
                dreams: 'Anxious, academic failures, falling',
                fears: ['Being alone', 'Public speaking / stage fright', 'Loss of control', 'Crowds'],
                miasms: ['Psora', 'Sycosis'],
                kingdom: 'Plant',
                family: 'Lycopodiaceae / Fern-Ally',
                sourceSubstance: 'Lycopodium clavatum spores',
                relationships: {
                    complementaries: ['Sulphur', 'Lachesis Muta', 'Iodum'],
                    inimicals: ['None'],
                    followWell: ['Lachesis Muta', 'Pulsatilla Pratensis']
                },
                clinicalUses: ['Irritable bowel syndrome', 'GERD', 'Erectile dysfunction', 'Kidney stones', 'Pneumonia'],
                keynotes: ['Worse 4-8 PM', 'Abdominal bloating eating a small amount', 'Craves sweets', 'Anticipatory anxiety', 'Right-sided'],
                toxicology: 'Mild skin rash, renal stone formation, hepatic sluggishness in raw form.',
                essence: 'The mask of power. Compensation for deep intellectual insecurity by exercising control, combined with lower-GI weakness.'
            }
        }
    },
    {
        id: 'rem_nux_vomica',
        label: 'Nux Vomica',
        type: 'remedy',
        metadata: {
            description: 'Poison nut seed. The leading remedy for hyper-stimulated, sedentary, stressed modern life.',
            profile: {
                mentalThemes: ['High irritability', 'Impatience', 'Ambitious/workaholic', 'Sedentary habits', 'Easily offended'],
                generals: ['Extremely chilly', 'Hypersensitive to light, noise, odors', 'Spasmodic digestive cramps', 'Ineffectual Urging'],
                particulars: ['Short sleep refreshing (naps)', 'Sour stomach, heartburn', 'Dry morning cough, loose at night'],
                modalities: ['Worse cold drafts', 'Worse early morning (3-4 AM)', 'Worse after eating', 'Better warm wraps', 'Better short nap'],
                thermals: 'Highly chilly (cannot uncover, aggravated by cold and drafts)',
                cravings: ['Stimulants', 'Coffee', 'Spicy foods', 'Alcohol', 'Fats'],
                aversions: ['Cold water', 'Open air', 'Bread'],
                sleep: 'Wakes at 3 AM to think, falls asleep as morning approaches, wakes tired',
                dreams: 'Business affairs, disputes, obstacles',
                fears: ['Poverty', 'Failure', 'Crowds'],
                miasms: ['Psora', 'Syphilis'],
                kingdom: 'Plant',
                family: 'Loganiaceae',
                sourceSubstance: 'Strychnos nux-vomica seed',
                relationships: {
                    complementaries: ['Sulphur', 'Sepia'],
                    inimicals: ['Acet-ac', 'Zincum'],
                    followWell: ['Sulphur', 'Arsenicum Album']
                },
                clinicalUses: ['Gastritis', 'Insomnia', 'Chronic constipation', 'Tension headache', 'Drug detox support'],
                keynotes: ['Short nap ameliorates', 'Highly irritable and chilly', 'Wakes 3 AM', 'Ineffectual Urging', 'Abuses stimulants'],
                toxicology: 'Strychnine poisoning causes tetanic muscle spasms, respiratory failure, hyper-reflexia.',
                essence: 'The driven achiever. Over-stimulated nervous system, spastic gastrointestinal system, and complete intolerance to frustration.'
            }
        }
    },
    {
        id: 'rem_arsenicum',
        label: 'Arsenicum Album',
        type: 'remedy',
        metadata: {
            description: 'Arsenic trioxide. The supreme remedy for intense anxiety, restlessness, and burning pains.',
            profile: {
                mentalThemes: ['Anxiety about health', 'Extreme fastidiousness/order', 'Restlessness (moving from bed to bed)', 'Fear of death', 'Desire for company'],
                generals: ['Chilly', 'Burning pains relieved by heat', 'Thirst for small sips frequently', 'Weakness out of proportion to illness'],
                particulars: ['Acrid watery discharges', 'Dry, scaly, burning skin eruptions', 'Asthmatic wheezing worse at midnight'],
                modalities: ['Worse midnight to 2 AM', 'Worse cold food and drinks', 'Worse cold air', 'Better warm applications', 'Better hot drinks'],
                thermals: 'Extremely chilly (aggravated by cold, desires extreme warmth)',
                cravings: ['Warm water', 'Cold milk', 'Sour food', 'Alcohol'],
                aversions: ['Cold water', 'Meat', 'Fat'],
                sleep: 'Restless sleep, wakes 12 AM - 2 AM with panic, cannot rest in bed',
                dreams: 'Robbers, deaths, business anxiety',
                fears: ['Death', 'Being left alone', 'Poverty', 'Cancer/Incurable disease'],
                miasms: ['Psora', 'Syphilis'],
                kingdom: 'Mineral',
                family: 'Oxides / Arsenic Group',
                sourceSubstance: 'Arsenious Acid / Arsenic Trioxide',
                relationships: {
                    complementaries: ['Phosphorus', 'Thuja Occidentalis', 'Carbo Vegetabilis'],
                    inimicals: ['Pulsatilla Pratensis'],
                    followWell: ['Nux Vomica', 'Lycopodium Clavatum']
                },
                clinicalUses: ['Asthma', 'Gastroenteritis', 'Eczema with burning', 'Panic attacks', 'Food poisoning'],
                keynotes: ['Restlessness with weakness', 'Thirst for small sips', 'Midnight aggravation', 'Burning pains better heat', 'Extreme orderliness'],
                toxicology: 'Severe mucosal burning, vomiting, rice-water stools, peripheral neuropathy, garlic odor.',
                essence: 'The vulnerable preservationist. Anxiety regarding physical survival, leading to an obsessive need for cleanliness, control, and doctors.'
            }
        }
    },
    {
        id: 'rem_calcarea',
        label: 'Calcarea Carbonica',
        type: 'remedy',
        metadata: {
            description: 'Calcium carbonate from oyster shells. The anchor for slow development, sluggish metabolism, and vulnerability.',
            profile: {
                mentalThemes: ['Fear of losing mind', 'Apprehension', 'Fastidiousness regarding others viewing their weakness', 'Sluggishness', 'Desires stability'],
                generals: ['Sluggish metabolism', 'Chilly, sensitive to damp drafts', 'Sweat on back of neck/head during sleep', 'Flabby muscle tone'],
                particulars: ['Swollen lymph nodes', 'Cold damp feet (like wet socks)', 'Sour discharges', 'Constipation where patient feels better for it'],
                modalities: ['Worse cold damp weather', 'Worse physical exertion', 'Worse mental exertion', 'Better dry weather', 'Better lying down'],
                thermals: 'Very chilly (aggravated by damp, cold drafts)',
                cravings: ['Eggs (especially soft-boiled)', 'Indigestible things (chalk, dirt)', 'Sweets', 'Ice cream'],
                aversions: ['Milk', 'Fat', 'Meat'],
                sleep: 'Difficulty falling asleep due to overactive mind, sweats around head and neck wetting pillow',
                dreams: 'Frightening, dead people, falling',
                fears: ['Losing mind/sanity', 'Incurable illness', 'Insects/Spiders', 'Darkness', 'Poverty'],
                miasms: ['Psora', 'Tubercular'],
                kingdom: 'Mineral',
                family: 'Carbonates / Calcium Group',
                sourceSubstance: 'Inner calcareous layer of oyster shell',
                relationships: {
                    complementaries: ['Belladonna', 'Silicea', 'Lycopodium Clavatum'],
                    inimicals: ['Bryonia Alba', 'Sulphur (in acute cases)'],
                    followWell: ['Lycopodium Clavatum', 'Silicea']
                },
                clinicalUses: ['Eczema', 'Thyroid dysfunction', 'Pediatric growth delay', 'Osteoarthritis', 'Chronic bronchitis'],
                keynotes: ['Sweats on back of neck', 'Craves eggs', 'Cold damp feet', 'Sluggish metabolism', 'Fears going insane'],
                toxicology: 'Excessive calcium causes alkalosis, calcifications, renal stones, muscular fatigue.',
                essence: 'The protective shell. Slow, passive vital force seeking stability and shelter to avoid exposure to a harsh, cold world.'
            }
        }
    },
    {
        id: 'rem_lachesis',
        label: 'Lachesis Muta',
        type: 'remedy',
        metadata: {
            description: 'Bushmaster snake venom. A deep animal remedy representing pressure, congestion, and heat release.',
            profile: {
                mentalThemes: ['Extreme loquacity (non-stop talking)', 'Suspiciousness/jealousy', 'Suppressed emotions', 'Intolerance to restriction (physical or mental)', 'Mental activity active at night'],
                generals: ['Left-sided symptoms (or left-to-right)', 'Worse after sleep', 'Intolerance to collars, tight waistbands', 'Congestive hot flushes'],
                particulars: ['Dark purple throat, worse left side', 'Pulsating headaches', 'Hemorrhages with dark, non-coagulating blood'],
                modalities: ['Worse after sleep', 'Worse warm room/bed', 'Worse pressure or touch', 'Better open air', 'Better flow of discharges'],
                thermals: 'Warm-blooded (cannot stand warmth of bed or room, wants cool ventilation)',
                cravings: ['Alcohol', 'Oysters', 'Sour food', 'Cold drinks'],
                aversions: ['Warm drinks', 'Bread', 'Acidic foods'],
                sleep: 'Aggravation of all symptoms during or on waking from sleep, suffocative fits',
                dreams: 'Snakes, deaths, funerals, fighting',
                fears: ['Poisoning', 'Heart failure', 'Suffocation', 'Snakes'],
                miasms: ['Sycosis', 'Syphilis'],
                kingdom: 'Animal',
                family: 'Ophidia / Viperidae',
                sourceSubstance: 'Bushmaster snake venom',
                relationships: {
                    complementaries: ['Lycopodium Clavatum', 'Hepar Sulphur', 'Arsenicum Album'],
                    inimicals: ['Ammonium Carb'],
                    followWell: ['Lycopodium Clavatum', 'Pulsatilla Pratensis']
                },
                clinicalUses: ['Menopausal hot flashes', 'Severe tonsillitis', 'Hypertension', 'Insomnia', 'Varicose veins'],
                keynotes: ['Loquacity', 'Worse after sleep', 'Intolerance to tight neckwear', 'Left-sided', 'Jealousy/suspicion'],
                toxicology: 'Hemotoxins cause coagulation failure, tissue necrosis, severe cellular breakdown, cardiovascular shock.',
                essence: 'The compressed steam valve. Blockage of emotional expression and physical discharges leads to toxic congestion, jealousy, and relief on release.'
            }
        }
    },
    {
        id: 'rem_pulsatilla',
        label: 'Pulsatilla Pratensis',
        type: 'remedy',
        metadata: {
            description: 'Windflower. The leading gentle remedy, showing changeable symptoms and emotional dependency.',
            profile: {
                mentalThemes: ['Mild, yielding disposition', 'Desire for consolation and company', 'Weeps easily', 'Changeable moods', 'Fear of being abandoned'],
                generals: ['Warm-blooded but lacks thirst', 'Changeable symptoms', 'Aggravated by warm closed rooms', 'Relieved by slow motion'],
                particulars: ['Thick, green-yellow, bland discharges', 'Dry mouth but no thirst', 'Ear infections with mild pain and yellow discharge'],
                modalities: ['Worse warm room', 'Worse rich/fatty foods', 'Worse evening', 'Better cool open air', 'Better slow motion', 'Better consolation'],
                thermals: 'Warm-blooded (desires open air, highly aggravated by stuffy spaces)',
                cravings: ['Butter/Cream (though aggravates)', 'Cold food', 'Sour things', 'Ice cream'],
                aversions: ['Fatty foods', 'Warm drinks', 'Meat', 'Water (thirstless)'],
                sleep: 'Difficulty falling asleep, wakes hot, throws off blankets, sleeps with hands overhead',
                dreams: 'Anxious, confused, black dogs',
                fears: ['Abandonment', 'Being alone', 'Stuffy rooms', 'Men/Marriage'],
                miasms: ['Sycosis'],
                kingdom: 'Plant',
                family: 'Ranunculaceae',
                sourceSubstance: 'Fresh Pulsatilla plant',
                relationships: {
                    complementaries: ['Silicea', 'Lycopodium Clavatum', 'Kali Sulphuricum'],
                    inimicals: ['Arsenicum Album'],
                    followWell: ['Lycopodium Clavatum', 'Silicea']
                },
                clinicalUses: ['Otitis media', 'Amenorrhea', 'Irritable bowel syndrome', 'Allergic rhinitis', 'Varicose veins'],
                keynotes: ['Thirstless with dry mouth', 'Yielding, weeps easily, wants consolation', 'Better open cool air', 'Thick yellow-green bland discharge', 'Changeability'],
                toxicology: 'Anemonin content causes gastrointestinal spasms, mucosal irritation, bradycardia.',
                essence: 'The seeking vine. Changeable physical symptoms and an emotional state centered on obtaining support and affection through weeping and sweetness.'
            }
        }
    },
    {
        id: 'rem_gelsemium',
        label: 'Gelsemium Sempervirens',
        type: 'remedy',
        metadata: {
            description: 'Yellow jessamine. The prime remedy for emotional paralyzing fear and heavy flu-like dullness.',
            profile: {
                mentalThemes: ['Anticipatory stage fright leading to diarrhea', 'Dullness and apathy', 'Mental paralysis from bad news', 'Desire to be left quiet'],
                generals: ['Heavy eyelids (ptosis)', 'Trembling from weakness or fright', 'Muscular coordination loss', 'Thirstless during fever'],
                particulars: ['Heavy, dull ache in occiput base', 'Trembling of hands and tongue', 'Fever with chills running up and down back'],
                modalities: ['Worse mental exertion', 'Worse excitement/fear', 'Worse motion', 'Better profuse urination', 'Better open air'],
                thermals: 'Chilly, yet wants open air; fever with cold shivers',
                cravings: ['Cold water', 'Ice', 'Sour things'],
                aversions: ['Warm drinks', 'Stimulants'],
                sleep: 'Deep, comatose sleep; wakes with dull headache, restless limbs',
                dreams: 'Anxious, inability to move, falling',
                fears: ['Falling', 'Public speaking', 'Losing control', 'Crowds'],
                miasms: ['Sycosis'],
                kingdom: 'Plant',
                family: 'Gelsemiaceae',
                sourceSubstance: 'Fresh bark of the root of Yellow Jasmine',
                relationships: {
                    complementaries: ['None recorded'],
                    inimicals: ['Atropinum'],
                    followWell: ['Aconitum Napellus', 'Baptisia']
                },
                clinicalUses: ['Influenza', 'Stage fright/Performance anxiety', 'Migraine with heavy eyelids', 'Multiple sclerosis support', 'Acute anxiety diarrhea'],
                keynotes: ['Heavy eyelids, cannot open them', 'Trembling from stage fright', 'Fever with chills running up the spine', 'Thirstless during heat', 'Profuse urination relieves headache'],
                toxicology: 'Gelseminine content causes motor paralysis, respiratory failure, severe muscular relaxation.',
                essence: 'The paralysis of threat. Heavy muscular collapse, mental dullness, and visceral purging in response to upcoming performance or shock.'
            }
        }
    },
    {
        id: 'rem_bryonia',
        label: 'Bryonia Alba',
        type: 'remedy',
        metadata: {
            description: 'White bryony root. The remedy of absolute dryness and aggravation from the slightest motion.',
            profile: {
                mentalThemes: ['Fear of poverty / constantly talks about business', 'Irritability', 'Wants to go home (even when at home)', 'Desire for quiet'],
                generals: ['Worse from the slightest motion', 'Extreme dryness of all mucous membranes', 'Sticking/stitching pains', 'Great thirst for large quantities of cold water'],
                particulars: ['Splitting headache, worse motion, holding head', 'Dry painful dry cough, holds chest', 'Painful swollen joints, worse motion, better pressure'],
                modalities: ['Worse slightest motion', 'Worse warm room', 'Worse touch', 'Better absolute rest', 'Better hard pressure', 'Better lying on painful side'],
                thermals: 'Chilly, but aggravated by warm stuffy rooms; wants cool open air',
                cravings: ['Cold water in large quantities', 'Sour foods', 'Warm milk'],
                aversions: ['Fatty foods', 'Warm water', 'Food in general during fever'],
                sleep: 'Restless, wakes frequently, dreams of business and daily tasks',
                dreams: 'Business, household duties, hard work',
                fears: ['Poverty', 'Financial failure', 'Losing control of health'],
                miasms: ['Psora'],
                kingdom: 'Plant',
                family: 'Cucurbitaceae',
                sourceSubstance: 'Fresh root of Bryonia alba',
                relationships: {
                    complementaries: ['Alumina', 'Rhus Toxicodendron'],
                    inimicals: ['Calcarea Carbonica'],
                    followWell: ['Nux Vomica', 'Rhus Toxicodendron']
                },
                clinicalUses: ['Pleurisy', 'Pneumonia', 'Acute arthritis', 'Migraine', 'Dry constipation'],
                keynotes: ['Worse slightest motion', 'Thirst for large quantities at long intervals', 'Talks of business', 'Stitching pains better hard pressure', 'Lies on painful side'],
                toxicology: 'Severe mucosal inflammation, purging diarrhea, respiratory arrest, vomiting.',
                essence: 'The structure under stress. Intolerance to movement and change, reflecting physically as friction/dryness and mentally as security-obsession.'
            }
        }
    },
    {
        id: 'rem_aconite',
        label: 'Aconitum Napellus',
        type: 'remedy',
        metadata: {
            description: 'Monkshood plant. The acute storm remedy, matching sudden terror and dry fevers.',
            profile: {
                mentalThemes: ['Sudden intense panic', 'Predicts the hour of death', 'Extreme restlessness from fear', 'Agony of mind'],
                generals: ['Sudden onset of symptoms', 'Dry, burning hot skin', 'Extreme restlessness', 'Great thirst for cold water'],
                particulars: ['Sudden croupy barking cough', 'High dry fever following cold dry wind exposure', 'Numbness and tingling in extremities'],
                modalities: ['Worse dry cold wind', 'Worse midnight', 'Worse warm room', 'Better open air', 'Better rest'],
                thermals: 'Chilly, but burning heat during fever; highly aggravated by cold dry winds',
                cravings: ['Cold water', 'Acidic drinks', 'Lemonade'],
                aversions: ['Fatty foods', 'Warm food'],
                sleep: 'Sleeplessness from fear/panic, tossing and turning, starting in sleep',
                dreams: 'Frightening, deaths, falls',
                fears: ['Immediate death', 'Crowds', 'Darkness', 'Crossing streets'],
                miasms: ['Psora'],
                kingdom: 'Plant',
                family: 'Ranunculaceae',
                sourceSubstance: 'Fresh monkshood herb during flowering',
                relationships: {
                    complementaries: ['Coffea Cruda', 'Sulphur'],
                    inimicals: ['None'],
                    followWell: ['Bryonia Alba', 'Sulphur']
                },
                clinicalUses: ['Acute panic attacks', 'First stage of croup/influenza', 'Neuralgia from cold exposure', 'Post-traumatic shock', 'Hypertension crisis'],
                keynotes: ['Sudden violent onset', 'Predicts hour of death', 'Exposure to dry cold wind', 'Restless tossing and panic', 'Thirst for cold water'],
                toxicology: 'Aconitine cardiotoxin causes ventricular arrhythmia, immediate sensory paralysis, respiratory failure, shock.',
                essence: 'The acute storm. Panic, speed, and congestion triggered by exposure to sudden dry cold, bypassing chronic layers.'
            }
        }
    },
    {
        id: 'rem_nat_mur',
        label: 'Natrum Muriaticum',
        type: 'remedy',
        metadata: {
            description: 'Sodium Chloride. Deep acting chronic remedy matching silent grief, water imbalance, and sun sensitivity.',
            profile: {
                mentalThemes: ['Silent grief', 'Dwelling on past hurts', 'Rejects consolation', 'Reserved', 'Loyal'],
                generals: ['Warm-blooded', 'Worse sun heat', 'Worse 10-11 AM', 'Salty sweat', 'Great thirst for cold water'],
                particulars: ['Hammer blow migraine', 'Dry parched lips with crack in middle', 'Constipation with dry crumbling stool', 'Herpetic cold sores'],
                modalities: ['Worse consolation', 'Worse heat of sun', 'Worse 10 AM', 'Better open cool air', 'Better deep pressure'],
                thermals: 'Warm-blooded (worse sun, desires cool air)',
                cravings: ['Salt', 'Salty food', 'Sour things'],
                aversions: ['Bread', 'Fatty food'],
                sleep: 'Sleepless from thoughts, dreams of robbers',
                dreams: 'Robbers, murders, past events',
                fears: ['Rejection', 'Robbers', 'Losing control'],
                miasms: ['Psora', 'Sycosis'],
                kingdom: 'Mineral',
                family: 'Halides / Sodium Group',
                sourceSubstance: 'Sodium Chloride (Rock Salt)',
                relationships: {
                    complementaries: ['Apis Mellifica', 'Sepia Officinalis'],
                    inimicals: ['None'],
                    followWell: ['Sepia Officinalis', 'Ignatia Amara']
                },
                clinicalUses: ['Silent grief', 'Chronic migraine', 'Herpes labialis', 'Dry constipation'],
                keynotes: ['Aggravated by consolation', 'Craves salt', 'Worse sun', 'Worse 10 AM', 'Cold sores'],
                toxicology: 'Cellular dehydration, water retention, venous tension.',
                essence: 'The silent griever. Emotional reserve and isolation walls to protect a highly sensitive interior.'
            }
        }
    },
    {
        id: 'rem_phosphorus',
        label: 'Phosphorus',
        type: 'remedy',
        metadata: {
            description: 'Yellow phosphorus. The open, brilliant, highly sensitive remedy matching bleeding and lung complaints.',
            profile: {
                mentalThemes: ['Openness/charm', 'Highly sympathetic', 'Suggestible', 'Fears isolation', 'Boundary loss'],
                generals: ['Chilly patient', 'Worse lying left side', 'Craves ice-cold drinks', 'refreshed by short sleep'],
                particulars: ['Dry tickling chest cough', 'Palpitations lying left side', 'Bright red nosebleeds and bleeding gums', 'Gastric burning'],
                modalities: ['Worse lying left side', 'Worse twilight/evening', 'Worse thunderstorms', 'Better short sleep', 'Better cold food/drinks', 'Better company'],
                thermals: 'Chilly, but stomach and head desire cold',
                cravings: ['Ice-cold water', 'Ice cream', 'Salt', 'Spices'],
                aversions: ['Warm drinks', 'Boiled milk', 'Sweet things'],
                sleep: 'Sleepless in evening, sleeps on right side',
                dreams: 'Fire, bleeding, accidents, ghosts',
                fears: ['Being alone', 'Darkness', 'Thunderstorms', 'Ghosts'],
                miasms: ['Tubercular'],
                kingdom: 'Mineral',
                family: 'Group 15 / Pnictogens',
                sourceSubstance: 'Yellow Phosphorus',
                relationships: {
                    complementaries: ['Arsenicum Album', 'Calcarea Carbonica'],
                    inimicals: ['Causticum'],
                    followWell: ['Arsenicum Album', 'Silicea']
                },
                clinicalUses: ['Dry tickling cough', 'Pneumonia left lobe', 'Hemorrhages', 'Nervous burnout'],
                keynotes: ['Ice-cold water craving', 'Vomits cold water when warm', 'Bright red bleeding', 'Worse lying left side', 'Fear of thunderstorms'],
                toxicology: 'Fatty degeneration of liver, tissue necrosis, severe hemorrhage, jaw necrosis.',
                essence: 'The brilliant diffuser. Emits warmth and brightness but has thin boundaries, leading to rapid energy dispersion and physical weakness.'
            }
        }
    },
    {
        id: 'rem_silicea',
        label: 'Silicea',
        type: 'remedy',
        metadata: {
            description: 'Pure silica/quartz. The refined, yielding but stubborn remedy matching lack of stamina and suppurations.',
            profile: {
                mentalThemes: ['Yielding but stubborn', 'Polite/refined', 'Lacks grit/confidence', 'Fastidious', 'Image conscious'],
                generals: ['Intensely chilly', 'Worse cold drafts on head', 'Foul offensive sweat on feet/scalp', 'Every scratch suppurates'],
                particulars: ['Headache from spine extending to right eye', 'Suppurating lymph nodes', 'Ingrown toenails with pus', 'Receding stools in constipation'],
                modalities: ['Worse cold drafts', 'Worse new or full moon', 'Worse uncovering head', 'Better wrapping head warm', 'Better warm room'],
                thermals: 'Extremely chilly (must cover head warm)',
                cravings: ['Cold food', 'Ice cream', 'Salty things'],
                aversions: ['Warm food', 'Meat', 'Milk'],
                sleep: 'Sleepless from overactive mind, sweats on scalp',
                dreams: 'Pins, needles, falling, robbers',
                fears: ['Pins/needles', 'Public speaking', 'Failure'],
                miasms: ['Psora', 'Tubercular'],
                kingdom: 'Mineral',
                family: 'Silicates / Quartz',
                sourceSubstance: 'Pure Flint / Silica',
                relationships: {
                    complementaries: ['Thuja Occidentalis', 'Pulsatilla Pratensis'],
                    inimicals: ['Mercury (in deep suppuration)'],
                    followWell: ['Calcarea Carbonica', 'Pulsatilla Pratensis']
                },
                clinicalUses: ['Boils and abscesses', 'Ingrown toenails', 'Spine weakness', 'Chronic otitis media'],
                keynotes: ['Better wrapping head warm', 'Lacks physical/moral grit', 'Offensive foot sweat', 'Every scratch suppurates', 'Fears pins/needles'],
                toxicology: 'Silicosis, connective tissue fibrosis, glandular induration.',
                essence: 'The structural grid. Lacks internal grit/strength, compensating with intellectual rigidity and a refined social image.'
            }
        }
    },
    {
        id: 'rem_sepia',
        label: 'Sepia Officinalis',
        type: 'remedy',
        metadata: {
            description: 'Cuttlefish ink. The uterine-hormonal remedy matching stasis, pelvic dragging-down, and emotional burnout.',
            profile: {
                mentalThemes: ['Indifference to loved ones', 'Burnout/fatigue', 'Desires independence', 'Sarcastic/irritable', 'Weeps easily'],
                generals: ['Chilly patient', 'Pelvic dragging-down sensation', 'Refreshed by vigorous exercise', 'Thirstless'],
                particulars: ['Yellow saddle across nose/cheeks', 'Uterine prolapse (crosses legs)', 'Hormonal migraine with nausea', 'Varicose veins and stasis'],
                modalities: ['Worse standing still', 'Worse cold drafts', 'Worse smell of food', 'Better vigorous exercise', 'Better warm bed', 'Better pressure'],
                thermals: 'Chilly patient (aggravated by cold, wants warmth)',
                cravings: ['Vinegar', 'Pickles', 'Acidic foods', 'Chocolate'],
                aversions: ['Fatty foods', 'Meat', 'Milk'],
                sleep: 'Restless sleep, wakes tired, sleeps right side',
                dreams: 'Falling in water, family disputes, work',
                fears: ['Losing sanity', 'Poverty', 'Solitude'],
                miasms: ['Sycosis'],
                kingdom: 'Animal',
                family: 'Cephalopoda / Sepiidae',
                sourceSubstance: 'Cuttlefish Ink',
                relationships: {
                    complementaries: ['Natrum Muriaticum', 'Phosphorus'],
                    inimicals: ['Lachesis Muta', 'Sulphur'],
                    followWell: ['Nux Vomica', 'Natrum Muriaticum']
                },
                clinicalUses: ['Uterine prolapse', 'Postpartum depression', 'Hormonal migraines', 'Dyspareunia'],
                keynotes: ['Indifference to loved ones', 'Dragging-down in pelvis', 'Refreshed by vigorous exercise', 'Yellow saddle', 'Craves vinegar'],
                toxicology: 'Hormonal stasis, portal congestion, uterine hypertonicity.',
                essence: 'The exhausted independence. Pelvic stasis and emotional burnout from relational overload, relieved by running away and vigorous activity.'
            }
        }
    },
    {
        id: 'rem_belladonna',
        label: 'Belladonna',
        type: 'remedy',
        metadata: {
            description: 'Deadly Nightshade. The congestive acute remedy matching sudden high heat, redness, and wild delirium.',
            profile: {
                mentalThemes: ['Wild delirium during fever', 'Fierce tantrums', 'Hallucinations', 'Photophobia', 'Starts at touch'],
                generals: ['Sudden violent onset', 'Dry burning skin', 'Throbbing carotids', 'dilated pupils', 'no thirst during fever'],
                particulars: ['Throbbing splitting migraine', 'Throbbing otitis media', 'Constricted bright red throat', 'Smooth red skin rashes'],
                modalities: ['Worse 3 PM', 'Worse light/noise', 'Worse draft on head', 'Worse touch', 'Better rest in dark room', 'Better head elevated'],
                thermals: 'Intensely hot (burning dry heat, but cold hands/feet)',
                cravings: ['Lemonade', 'Acidic drinks', 'Cold water'],
                aversions: ['Meat', 'Warm drinks', 'Fatty food'],
                sleep: 'Restless sleep, starts in sleep, sleepy but cannot sleep',
                dreams: 'Fires, black dogs, gallows',
                fears: ['Black dogs', 'Ghosts', 'Darkness', 'Touch'],
                miasms: ['Psora', 'Syphilis'],
                kingdom: 'Plant',
                family: 'Solanaceae',
                sourceSubstance: 'Atropa belladonna (Deadly Nightshade)',
                relationships: {
                    complementaries: ['Calcarea Carbonica'],
                    inimicals: ['Dulcamara'],
                    followWell: ['Aconitum Napellus', 'Chamomile']
                },
                clinicalUses: ['Sudden high fever', 'Otitis media', 'Throbbing migraine', 'Acute tonsillitis'],
                keynotes: ['Throbbing headaches', 'Dilated pupils', 'Hot face with cold extremities', 'Sudden violent onset', 'Worse 3 PM'],
                toxicology: 'Atropine poisoning blocks parasympathetic pathways: hot as a hare, red as a beet, dry as a bone, blind as a bat, mad as a hatter.',
                essence: 'The vascular storm. Sudden violent bounding congestion of blood to the head, creating sensory overload and wild delirium.'
            }
        }
    },
    {
        id: 'rem_apis',
        label: 'Apis Mellifica',
        type: 'remedy',
        metadata: {
            description: 'Honeybee. The edematous inflammatory remedy matching puffiness, stinging pains, jealousy, and heat aggravations.',
            profile: {
                mentalThemes: ['Busy/active', 'Jealousy/suspicion', 'Irritability', 'Clumsy (drops things)', 'Protective'],
                generals: ['Extremely hot-blooded', 'Thirstless during dropsy/fever', 'Edema and puffiness', 'Stinging burning pains'],
                particulars: ['Right ovary pain and cysts', 'Swollen tonsils like water bags', 'Puffiness under eyes', 'Synovitis with effusions'],
                modalities: ['Worse heat in any form', 'Worse touch/pressure', 'Worse after sleep', 'Worse right side', 'Better cold applications', 'Better open cool air'],
                thermals: 'Extremely hot-blooded (highly aggravated by warmth)',
                cravings: ['Cold water', 'Ice', 'Vinegar'],
                aversions: ['Warm food', 'Sweet things', 'Fatty food'],
                sleep: 'Restless, wakes starting with loud shrieks',
                dreams: 'Flying, fires, fighting',
                fears: ['Apoplexy/strokes', 'Suffocation', 'Solitude'],
                miasms: ['Sycosis'],
                kingdom: 'Animal',
                family: 'Hymenoptera / Apidae',
                sourceSubstance: 'Whole Honeybee with venom',
                relationships: {
                    complementaries: ['Natrum Muriaticum', 'Baryta Carbonica'],
                    inimicals: ['Rhus Toxicodendron'],
                    followWell: ['Sulphur', 'Lycopodium Clavatum']
                },
                clinicalUses: ['Urticaria (hives)', 'Right-sided ovarian cysts', 'Dropsy/Edema', 'Acute joint synovitis'],
                keynotes: ['Stinging burning pains', 'Edema like water bags', 'Thirstless with dropsy', 'Hot-blooded (worse heat)', 'Clumsiness'],
                toxicology: 'Bee venom causes histamine release, rapid swelling, capillary leakage, acute inflammation, anaphylaxis.',
                essence: 'The inflammatory sting. Sudden edematous swelling and sharp stinging pains in tissues, accompanied by busy, jealous mental energy.'
            }
        }
    },
    // --- MIASMS (4) ---
    {
        id: 'mias_psora',
        label: 'Psora',
        type: 'miasm',
        metadata: {
            miasmaticExpression: 'Hyper-sensitivity, functional disturbances, itching, dry skin, anxiety, deficiency.',
            description: 'The foundation of all chronic diseases, representing functional deficiency and hyper-sensory reaction.'
        }
    },
    {
        id: 'mias_sycosis',
        label: 'Sycosis',
        type: 'miasm',
        metadata: {
            miasmaticExpression: 'Excess, proliferation, warts, retention, suspicion, coordination failure, morning stiffness.',
            description: 'The miasm of excess, representing structural growths, retentions, and psychological defense screens.'
        }
    },
    {
        id: 'mias_syphilis',
        label: 'Syphilis',
        type: 'miasm',
        metadata: {
            miasmaticExpression: 'Destruction, ulceration, deep structural decay, night aggravation, fixed ideas, hopelessness.',
            description: 'The miasm of destruction, representing degenerative ulceration, necrosis, and deep mental paralysis.'
        }
    },
    {
        id: 'mias_tubercular',
        label: 'Tubercular',
        type: 'miasm',
        metadata: {
            miasmaticExpression: 'Allergic reactivity, chest weakness, rapid weight loss, travel desires, restlessness.',
            description: 'The miasm of consumption, combining Psora and Syphilis, showing rapid destruction and shifting symptoms.'
        }
    },
    // --- KINGDOMS (3) ---
    {
        id: 'king_mineral',
        label: 'Mineral Kingdom',
        type: 'kingdom',
        metadata: {
            origin: 'Inorganic elements and compounds.',
            description: 'Focuses on themes of structure, organization, identity, security, relationships, and performance.'
        }
    },
    {
        id: 'king_plant',
        label: 'Plant Kingdom',
        type: 'kingdom',
        metadata: {
            origin: 'Organic flora and botanical families.',
            description: 'Focuses on themes of sensitivity, reactivity, adaptation, sensations, and how external forces impact internal state.'
        }
    },
    {
        id: 'king_animal',
        label: 'Animal Kingdom',
        type: 'kingdom',
        metadata: {
            origin: 'Fauna venoms, secretions, and milk.',
            description: 'Focuses on themes of survival, hierarchy, competition, jealousy, sexuality, dominance, and victimization.'
        }
    },
    // --- FAMILIES (9) ---
    {
        id: 'fam_chalcogen',
        label: 'Elements / Chalcogens',
        type: 'family',
        metadata: {
            origin: 'Group 16 elements of the periodic table.',
            description: 'Themes of ego, self-worth, theories, untidiness, thermal stagnation, and structural combustion.'
        }
    },
    {
        id: 'fam_lycopodiaceae',
        label: 'Lycopodiaceae / Fern-Ally',
        type: 'family',
        metadata: {
            origin: 'Spore-bearing clubmosses.',
            description: 'Themes of ancient lineage, power structures, digestive gas production, right-to-left bias, and hidden weakness.'
        }
    },
    {
        id: 'fam_loganiaceae',
        label: 'Loganiaceae Family',
        type: 'family',
        metadata: {
            origin: 'Strychnine-containing plants.',
            description: 'Themes of hyper-excitability, spasms, high sensitivity to light/sound/irritants, and ambition.'
        }
    },
    {
        id: 'fam_arsenic_oxide',
        label: 'Oxides / Arsenic Group',
        type: 'family',
        metadata: {
            origin: 'Arsenical minerals.',
            description: 'Themes of toxic decay, extreme anxiety regarding survival, burning pains, coldness, and orderliness.'
        }
    },
    {
        id: 'fam_calcium_carb',
        label: 'Carbonates / Calcium Group',
        type: 'family',
        metadata: {
            origin: 'Salts of Carbonic Acid and Calcium.',
            description: 'Themes of shelter, shell defense, slow metabolic accumulation, dampness, and glandular congestion.'
        }
    },
    {
        id: 'fam_serpent',
        label: 'Ophidia / Snake Venoms',
        type: 'family',
        metadata: {
            origin: 'Snake venom extractions.',
            description: 'Themes of constriction, loquacity, jealousy, nighttime activation, circulatory stagnation, and relief from flow.'
        }
    },
    {
        id: 'fam_ranunculaceae',
        label: 'Ranunculaceae / Buttercups',
        type: 'family',
        metadata: {
            origin: 'Crowfoot family.',
            description: 'Themes of extreme sensitivity, emotional changes, weeping, sudden storm-like flares, and thermal shifts.'
        }
    },
    {
        id: 'fam_gelsemiaceae',
        label: 'Gelsemiaceae Family',
        type: 'family',
        metadata: {
            origin: 'Yellow Jasmine complex plants.',
            description: 'Themes of motor paralysis, heavy congestion, fright-induced weakness, diarrhea, and trembling.'
        }
    },
    {
        id: 'fam_cucurbitaceae',
        label: 'Cucurbitaceae / Gourds',
        type: 'family',
        metadata: {
            origin: 'Gourd family plants.',
            description: 'Themes of extreme tightness, dryness, friction, talks of business, absolute aggravation from motion, and pressure relief.'
        }
    },
    {
        id: 'fam_halides',
        label: 'Halides / Sodium Group',
        type: 'family',
        metadata: {
            origin: 'Halogen salts and sodium groups.',
            description: 'Themes of silent grief, emotional containment, water retention, and relationship vulnerability.'
        }
    },
    {
        id: 'fam_pnictogens',
        label: 'Group 15 / Pnictogens',
        type: 'family',
        metadata: {
            origin: 'Group 15 elements (nitrogen, phosphorus).',
            description: 'Themes of brilliant emission, boundary diffusion, high sensitivity, and rapid physical exhaustion.'
        }
    },
    {
        id: 'fam_silicates',
        label: 'Silicates / Quartz',
        type: 'family',
        metadata: {
            origin: 'Silicon dioxide compounds.',
            description: 'Themes of structural rigidity, lack of grit, polite image presentation, and suppurative tendencies.'
        }
    },
    {
        id: 'fam_cephalopoda',
        label: 'Cephalopoda / Sepiidae',
        type: 'family',
        metadata: {
            origin: 'Marine cuttlefish ink.',
            description: 'Themes of dragging-down, hormonal stasis, emotional burnout, independence, and sarcastically keeping distance.'
        }
    },
    {
        id: 'fam_solanaceae',
        label: 'Solanaceae Family',
        type: 'family',
        metadata: {
            origin: 'Deadly nightshade plants.',
            description: 'Themes of sudden violent congestions, dry heat, dilated pupils, delirium, and fear of black animals.'
        }
    },
    {
        id: 'fam_apidae',
        label: 'Hymenoptera / Apidae',
        type: 'family',
        metadata: {
            origin: 'Whole honeybee and venom.',
            description: 'Themes of busy activity, stinging pains, dropsical swelling, jealousy, and extreme heat aggravation.'
        }
    },
    // --- CLINICAL CONDITIONS (8) ---
    {
        id: 'cond_eczema',
        label: 'Eczema / Atopic Dermatitis',
        type: 'condition',
        metadata: {
            pathology: 'Inflammatory dry skin with redness, pruritus, and tendency to suppressions.',
            description: 'Corresponds strongly to psoric skin manifestations, worse warmth of bed.'
        }
    },
    {
        id: 'cond_asthma',
        label: 'Asthma / Bronchospasm',
        type: 'condition',
        metadata: {
            pathology: 'Reversible airway obstruction with expiratory wheezing, suppressed eruptions history.',
            description: 'Often indicates psoric or tubercular miasmatic shifts inward.'
        }
    },
    {
        id: 'cond_flatulence',
        label: 'Chronic Flatulence & Bloating',
        type: 'condition',
        metadata: {
            pathology: 'Weak stomach digestion with delayed gastric emptying, gas accumulation.',
            description: 'Linked to Lycopodium, Carbo Veg, Nux Vomica profiles.'
        }
    },
    {
        id: 'cond_anxiety',
        label: 'Generalized Anxiety Disorder',
        type: 'condition',
        metadata: {
            pathology: 'Chronic nervous apprehension, anticipatory fears, panic reactions.',
            description: 'Keynotes for Arsenicum (health anxiety), Lycopodium (stage fright), Gelsemium (paralyzing fear).'
        }
    },
    {
        id: 'cond_insomnia',
        label: 'Insomnia / Sleep Disorders',
        type: 'condition',
        metadata: {
            pathology: 'Overactive mind at night, startle reflexes, restless sleep.',
            description: 'Worse at 3 AM (Nux Vomica), worse midnight (Arsenicum), sleep-onset paralysis (Lachesis).'
        }
    },
    {
        id: 'cond_headache',
        label: 'Migraine / Right-sided Headaches',
        type: 'condition',
        metadata: {
            pathology: 'Vascular pulsatile headache, lateralized presentation.',
            description: 'Right-sided (Lycopodium, Bryonia, Chelidonium), left-sided (Lachesis, Spigelia).'
        }
    },
    {
        id: 'cond_influenza',
        label: 'Influenza / Acute Fevers',
        type: 'condition',
        metadata: {
            pathology: 'Viral acute onset with high temperatures, shivers, ache, weakness.',
            description: 'Treated by Aconitum (first storm), Gelsemium (heavy ptosis), Bryonia (motion agg).'
        }
    },
    {
        id: 'cond_arthritis',
        label: 'Rheumatoid Arthritis / Joint Pain',
        type: 'condition',
        metadata: {
            pathology: 'Chronic synovial inflammation with joint stiffness, worse damp cold.',
            description: 'Worse motion (Bryonia), better motion (Rhus Tox), cold aggravation (Calcarea).'
        }
    },
    // --- MODALITIES (10) ---
    {
        id: 'mod_warmth_bed_agg',
        label: 'Worse Warmth of Bed',
        type: 'modality',
        metadata: {
            aggFactors: ['Under blankets', 'Warm bedroom', 'Bed heat'],
            description: 'Triggers dermal itching, venous stagnation, and skin burning.'
        }
    },
    {
        id: 'mod_standing_agg',
        label: 'Worse Standing Still',
        type: 'modality',
        metadata: {
            aggFactors: ['Standing in line', 'Upright stationary posture'],
            description: 'Causes physical fatigue, lower back aches, and venous congestion.'
        }
    },
    {
        id: 'mod_open_air_amel',
        label: 'Better Open Cool Air',
        type: 'modality',
        metadata: {
            aggFactors: ['Draft of wind', 'Uncovered spaces', 'Windows open'],
            description: 'Ameliorates respiratory oppression, skin burning, and headache.'
        }
    },
    {
        id: 'mod_4_8_pm_agg',
        label: 'Worse 4 PM - 8 PM',
        type: 'modality',
        metadata: {
            aggFactors: ['Late afternoon', 'Twilight hours'],
            description: 'Corresponds to metabolic temperature shifts and flatulence cycles.'
        }
    },
    {
        id: 'mod_warm_drinks_amel',
        label: 'Better Warm Drinks / Food',
        type: 'modality',
        metadata: {
            aggFactors: ['Hot tea', 'Warm soup'],
            description: 'Relieves stomach spasms, flatulence, and throat pain.'
        }
    },
    {
        id: 'mod_3_am_agg',
        label: 'Worse 3 AM',
        type: 'modality',
        metadata: {
            aggFactors: ['Late night waking', 'Liver cycles'],
            description: 'Nervous system waking, stomach irritation, chest aggravation.'
        }
    },
    {
        id: 'mod_midnight_agg',
        label: 'Worse Midnight - 2 AM',
        type: 'modality',
        metadata: {
            aggFactors: ['Midnight panic', 'Worse dry cold wind'],
            description: 'Corresponds to intense nervous panic, asthma, and severe chills.'
        }
    },
    {
        id: 'mod_cold_draft_agg',
        label: 'Worse Cold Damp Drafts / Dry Wind',
        type: 'modality',
        metadata: {
            aggFactors: ['Air conditioning', 'Sudden cold weather', 'Dry wind'],
            description: 'Triggers neuralgia, acute dry croup, and muscular stiffness.'
        }
    },
    {
        id: 'mod_motion_agg',
        label: 'Worse Slightest Motion',
        type: 'modality',
        metadata: {
            aggFactors: ['Turning in bed', 'Moving fingers', 'Standing up'],
            description: 'Intolerable friction in membranes, stitching pains, headaches.'
        }
    },
    {
        id: 'mod_pressure_amel',
        label: 'Better Hard Pressure',
        type: 'modality',
        metadata: {
            aggFactors: ['Bandages', 'Lying on painful side', 'Hard compression'],
            description: 'Soothes stitching inflammation, stabilizes vascular pulse.'
        }
    },
    // --- RUBRICS / SYMPTOMS (18) ---
    {
        id: 'rub_health_anxiety',
        label: 'Mind; Anxiety; health, about',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - ANXIETY - health, about',
            description: 'Obsessive concern regarding physical symptoms and impending disease.'
        }
    },
    {
        id: 'rub_anticipatory_anxiety',
        label: 'Mind; Anxiety; anticipatory / stage fright',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - ANXIETY - anticipatory',
            description: 'Anxiety prior to public speaking, examinations, or performance.'
        }
    },
    {
        id: 'rub_irritable_questioned',
        label: 'Mind; Irritability; questioned, when',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - IRRITABILITY - questioned, when',
            description: 'Irritable reaction when interrupted, spoken to, or queried.'
        }
    },
    {
        id: 'rub_fastidious',
        label: 'Mind; Fastidious',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - FASTIDIOUS',
            description: 'Obsessive cleanliness, orderliness, and attention to small details.'
        }
    },
    {
        id: 'rub_burning_feet_bed',
        label: 'Generals; Burning; soles of feet, out of bed',
        type: 'rubric',
        metadata: {
            rubricCode: 'GENERALS - HEAT - feet, burning - bed, out of',
            description: 'Burning heat forcing the patient to uncover or stick feet out of bed.'
        }
    },
    {
        id: 'rub_empty_11am',
        label: 'Stomach; Emptiness; 11 AM',
        type: 'rubric',
        metadata: {
            rubricCode: 'STOMACH - EMPTINESS - 11 AM',
            description: 'Sinking, empty sensation in the epigastrium at 11 AM.'
        }
    },
    {
        id: 'rub_bloating_after_eating',
        label: 'Stomach; Distension; eating, after',
        type: 'rubric',
        metadata: {
            rubricCode: 'STOMACH - DISTENSION - eating, after',
            description: 'Severe post-prandial bloating, gas distension, and fullness.'
        }
    },
    {
        id: 'rub_right_sided_headache',
        label: 'Head; Pain; right-sided',
        type: 'rubric',
        metadata: {
            rubricCode: 'HEAD - PAIN - right-sided',
            description: 'Headache primarily lateralized to the right temple, forehead, or occiput.'
        }
    },
    {
        id: 'rub_startled_noise',
        label: 'Mind; Startled; noise, from',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - STARTLED - noise, from',
            description: 'High startle reflex from sudden sounds, shutting doors.'
        }
    },
    {
        id: 'rub_fear_death',
        label: 'Mind; Fear; death, of',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - FEAR - death, of',
            description: 'Intense terror of dying, predicting the hour during acute panic.'
        }
    },
    {
        id: 'rub_fear_poverty',
        label: 'Mind; Fear; poverty, of',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - FEAR - poverty, of',
            description: 'Anxiety regarding financial collapse, starvation, or job loss.'
        }
    },
    {
        id: 'rub_apprehensive_fears',
        label: 'Mind; Apprehensive / Fears',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - APPREHENSIVE',
            description: 'Chronic sense of impending doom or that something bad will happen.'
        }
    },
    {
        id: 'rub_sleep_catnaps',
        label: 'Sleep; Restless; cat-naps',
        type: 'rubric',
        metadata: {
            rubricCode: 'SLEEP - RESTLESS - cat-naps',
            description: 'Light sleep in short intervals, waking frequently, unrefreshing.'
        }
    },
    {
        id: 'rub_thirst_small_sips',
        label: 'Stomach; Thirst; small sips, frequently',
        type: 'rubric',
        metadata: {
            rubricCode: 'STOMACH - THIRST - small quantities, frequently',
            description: 'Frequent thirst for minor sips of water, typically cold.'
        }
    },
    {
        id: 'rub_grief_suppressed',
        label: 'Mind; Grief; suppressed, silent',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - GRIEF - silent, suppressed',
            description: 'Somatic retention of emotional sadness, silent weeping, refuse sympathy.'
        }
    },
    {
        id: 'rub_restlessness_anxious',
        label: 'Mind; Restlessness; anxious',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - RESTLESSNESS - anxious',
            description: 'Tossing and turning, moving from place to place from internal panic.'
        }
    },
    {
        id: 'rub_fever_dry_hot',
        label: 'Generals; Fever; dry heat, burning',
        type: 'rubric',
        metadata: {
            rubricCode: 'GENERALS - FEVER - heat, dry',
            description: 'Dry fever heat without perspiration, intense red skin, hot to touch.'
        }
    },
    {
        id: 'rub_dullness_drowsiness',
        label: 'Mind; Dullness; drowsiness',
        type: 'rubric',
        metadata: {
            rubricCode: 'MIND - DULLNESS - drowsiness',
            description: 'Mental paralysis, comatose state, inability to focus eyes or think.'
        }
    }
];
exports.KNOWLEDGE_GRAPH_EDGES = [
    // --- REMEDIES -> KINGDOMS (10 edges) ---
    { id: 'e1', source: 'rem_sulphur', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e2', source: 'rem_lycopodium', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e3', source: 'rem_nux_vomica', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e4', source: 'rem_arsenicum', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e5', source: 'rem_calcarea', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e6', source: 'rem_lachesis', target: 'king_animal', type: 'belongs_to', weight: 3 },
    { id: 'e7', source: 'rem_pulsatilla', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e8', source: 'rem_gelsemium', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e9', source: 'rem_bryonia', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e10', source: 'rem_aconite', target: 'king_plant', type: 'belongs_to', weight: 3 },
    // --- REMEDIES -> FAMILIES (10 edges) ---
    { id: 'e11', source: 'rem_sulphur', target: 'fam_chalcogen', type: 'belongs_to', weight: 3 },
    { id: 'e12', source: 'rem_lycopodium', target: 'fam_lycopodiaceae', type: 'belongs_to', weight: 3 },
    { id: 'e13', source: 'rem_nux_vomica', target: 'fam_loganiaceae', type: 'belongs_to', weight: 3 },
    { id: 'e14', source: 'rem_arsenicum', target: 'fam_arsenic_oxide', type: 'belongs_to', weight: 3 },
    { id: 'e15', source: 'rem_calcarea', target: 'fam_calcium_carb', type: 'belongs_to', weight: 3 },
    { id: 'e16', source: 'rem_lachesis', target: 'fam_serpent', type: 'belongs_to', weight: 3 },
    { id: 'e17', source: 'rem_pulsatilla', target: 'fam_ranunculaceae', type: 'belongs_to', weight: 3 },
    { id: 'e18', source: 'rem_gelsemium', target: 'fam_gelsemiaceae', type: 'belongs_to', weight: 3 },
    { id: 'e19', source: 'rem_bryonia', target: 'fam_cucurbitaceae', type: 'belongs_to', weight: 3 },
    { id: 'e20', source: 'rem_aconite', target: 'fam_ranunculaceae', type: 'belongs_to', weight: 3 },
    // --- REMEDIES -> MIASMS (16 edges) ---
    { id: 'e21', source: 'rem_sulphur', target: 'mias_psora', type: 'has_miasm', weight: 3 },
    { id: 'e22', source: 'rem_lycopodium', target: 'mias_psora', type: 'has_miasm', weight: 2 },
    { id: 'e23', source: 'rem_lycopodium', target: 'mias_sycosis', type: 'has_miasm', weight: 3 },
    { id: 'e24', source: 'rem_nux_vomica', target: 'mias_psora', type: 'has_miasm', weight: 3 },
    { id: 'e25', source: 'rem_nux_vomica', target: 'mias_syphilis', type: 'has_miasm', weight: 2 },
    { id: 'e26', source: 'rem_arsenicum', target: 'mias_psora', type: 'has_miasm', weight: 3 },
    { id: 'e27', source: 'rem_arsenicum', target: 'mias_syphilis', type: 'has_miasm', weight: 3 },
    { id: 'e28', source: 'rem_calcarea', target: 'mias_psora', type: 'has_miasm', weight: 3 },
    { id: 'e29', source: 'rem_calcarea', target: 'mias_tubercular', type: 'has_miasm', weight: 3 },
    { id: 'e30', source: 'rem_lachesis', target: 'mias_sycosis', type: 'has_miasm', weight: 2 },
    { id: 'e31', source: 'rem_lachesis', target: 'mias_syphilis', type: 'has_miasm', weight: 3 },
    { id: 'e32', source: 'rem_pulsatilla', target: 'mias_sycosis', type: 'has_miasm', weight: 3 },
    { id: 'e33', source: 'rem_gelsemium', target: 'mias_sycosis', type: 'has_miasm', weight: 3 },
    { id: 'e34', source: 'rem_bryonia', target: 'mias_psora', type: 'has_miasm', weight: 3 },
    { id: 'e35', source: 'rem_aconite', target: 'mias_psora', type: 'has_miasm', weight: 3 },
    { id: 'e36', source: 'rem_sulphur', target: 'mias_sycosis', type: 'has_miasm', weight: 1 },
    // --- REMEDIES -> CONDITIONS (treats_condition) (22 edges) ---
    { id: 'e37', source: 'rem_sulphur', target: 'cond_eczema', type: 'treats_condition', weight: 3 },
    { id: 'e38', source: 'rem_sulphur', target: 'cond_asthma', type: 'treats_condition', weight: 3 },
    { id: 'e39', source: 'rem_lycopodium', target: 'cond_flatulence', type: 'treats_condition', weight: 3 },
    { id: 'e40', source: 'rem_lycopodium', target: 'cond_anxiety', type: 'treats_condition', weight: 2 },
    { id: 'e41', source: 'rem_nux_vomica', target: 'cond_insomnia', type: 'treats_condition', weight: 3 },
    { id: 'e42', source: 'rem_nux_vomica', target: 'cond_flatulence', type: 'treats_condition', weight: 3 },
    { id: 'e43', source: 'rem_arsenicum', target: 'cond_eczema', type: 'treats_condition', weight: 2 },
    { id: 'e44', source: 'rem_arsenicum', target: 'cond_asthma', type: 'treats_condition', weight: 3 },
    { id: 'e45', source: 'rem_arsenicum', target: 'cond_anxiety', type: 'treats_condition', weight: 3 },
    { id: 'e46', source: 'rem_calcarea', target: 'cond_eczema', type: 'treats_condition', weight: 2 },
    { id: 'e47', source: 'rem_calcarea', target: 'cond_arthritis', type: 'treats_condition', weight: 3 },
    { id: 'e48', source: 'rem_lachesis', target: 'cond_insomnia', type: 'treats_condition', weight: 3 },
    { id: 'e49', source: 'rem_lachesis', target: 'cond_headache', type: 'treats_condition', weight: 3 },
    { id: 'e50', source: 'rem_pulsatilla', target: 'cond_eczema', type: 'treats_condition', weight: 2 },
    { id: 'e51', source: 'rem_pulsatilla', target: 'cond_flatulence', type: 'treats_condition', weight: 2 },
    { id: 'e52', source: 'rem_gelsemium', target: 'cond_influenza', type: 'treats_condition', weight: 3 },
    { id: 'e53', source: 'rem_gelsemium', target: 'cond_anxiety', type: 'treats_condition', weight: 3 },
    { id: 'e54', source: 'rem_bryonia', target: 'cond_influenza', type: 'treats_condition', weight: 2 },
    { id: 'e55', source: 'rem_bryonia', target: 'cond_arthritis', type: 'treats_condition', weight: 3 },
    { id: 'e56', source: 'rem_bryonia', target: 'cond_headache', type: 'treats_condition', weight: 2 },
    { id: 'e57', source: 'rem_aconite', target: 'cond_influenza', type: 'treats_condition', weight: 2 },
    { id: 'e58', source: 'rem_aconite', target: 'cond_anxiety', type: 'treats_condition', weight: 3 },
    // --- REMEDIES -> MODALITIES (aggravated_by, ameliorated_by) (23 edges) ---
    { id: 'e59', source: 'rem_sulphur', target: 'mod_warmth_bed_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e60', source: 'rem_sulphur', target: 'mod_standing_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e61', source: 'rem_sulphur', target: 'mod_open_air_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e62', source: 'rem_lycopodium', target: 'mod_4_8_pm_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e63', source: 'rem_lycopodium', target: 'mod_warm_drinks_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e64', source: 'rem_lycopodium', target: 'mod_open_air_amel', type: 'ameliorates_by', weight: 2 },
    { id: 'e65', source: 'rem_nux_vomica', target: 'mod_3_am_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e66', source: 'rem_nux_vomica', target: 'mod_cold_draft_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e67', source: 'rem_nux_vomica', target: 'mod_warm_drinks_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e68', source: 'rem_arsenicum', target: 'mod_midnight_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e69', source: 'rem_arsenicum', target: 'mod_cold_draft_agg', type: 'aggravates_by', weight: 2 },
    { id: 'e70', source: 'rem_arsenicum', target: 'mod_warm_drinks_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e71', source: 'rem_calcarea', target: 'mod_cold_draft_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e72', source: 'rem_lachesis', target: 'mod_warmth_bed_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e73', source: 'rem_lachesis', target: 'mod_open_air_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e74', source: 'rem_pulsatilla', target: 'mod_warmth_bed_agg', type: 'aggravates_by', weight: 2 },
    { id: 'e75', source: 'rem_pulsatilla', target: 'mod_open_air_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e76', source: 'rem_gelsemium', target: 'mod_motion_agg', type: 'aggravates_by', weight: 2 },
    { id: 'e77', source: 'rem_bryonia', target: 'mod_motion_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e78', source: 'rem_bryonia', target: 'mod_pressure_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e79', source: 'rem_aconite', target: 'mod_cold_draft_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e80', source: 'rem_aconite', target: 'mod_midnight_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e81', source: 'rem_calcarea', target: 'mod_warmth_bed_agg', type: 'aggravates_by', weight: 1 },
    // --- REMEDIES -> RUBRICS (covers_rubric) (43 edges) ---
    { id: 'e82', source: 'rem_sulphur', target: 'rub_health_anxiety', type: 'covers_rubric', weight: 2 },
    { id: 'e83', source: 'rem_sulphur', target: 'rub_irritable_questioned', type: 'covers_rubric', weight: 3 },
    { id: 'e84', source: 'rem_sulphur', target: 'rub_burning_feet_bed', type: 'covers_rubric', weight: 3 },
    { id: 'e85', source: 'rem_sulphur', target: 'rub_empty_11am', type: 'covers_rubric', weight: 3 },
    { id: 'e86', source: 'rem_sulphur', target: 'rub_sleep_catnaps', type: 'covers_rubric', weight: 3 },
    { id: 'e87', source: 'rem_lycopodium', target: 'rub_health_anxiety', type: 'covers_rubric', weight: 2 },
    { id: 'e88', source: 'rem_lycopodium', target: 'rub_anticipatory_anxiety', type: 'covers_rubric', weight: 3 },
    { id: 'e89', source: 'rem_lycopodium', target: 'rub_irritable_questioned', type: 'covers_rubric', weight: 2 },
    { id: 'e90', source: 'rem_lycopodium', target: 'rub_bloating_after_eating', type: 'covers_rubric', weight: 3 },
    { id: 'e91', source: 'rem_lycopodium', target: 'rub_right_sided_headache', type: 'covers_rubric', weight: 3 },
    { id: 'e92', source: 'rem_lycopodium', target: 'rub_fear_poverty', type: 'covers_rubric', weight: 2 },
    { id: 'e93', source: 'rem_lycopodium', target: 'rub_apprehensive_fears', type: 'covers_rubric', weight: 3 },
    { id: 'e94', source: 'rem_nux_vomica', target: 'rub_irritable_questioned', type: 'covers_rubric', weight: 3 },
    { id: 'e95', source: 'rem_nux_vomica', target: 'rub_bloating_after_eating', type: 'covers_rubric', weight: 2 },
    { id: 'e96', source: 'rem_nux_vomica', target: 'rub_startled_noise', type: 'covers_rubric', weight: 3 },
    { id: 'e97', source: 'rem_nux_vomica', target: 'rub_fastidious', type: 'covers_rubric', weight: 2 },
    { id: 'e98', source: 'rem_arsenicum', target: 'rub_health_anxiety', type: 'covers_rubric', weight: 3 },
    { id: 'e99', source: 'rem_arsenicum', target: 'rub_fear_death', type: 'covers_rubric', weight: 3 },
    { id: 'e100', source: 'rem_arsenicum', target: 'rub_fear_poverty', type: 'covers_rubric', weight: 2 },
    { id: 'e101', source: 'rem_arsenicum', target: 'rub_fastidious', type: 'covers_rubric', weight: 3 },
    { id: 'e102', source: 'rem_arsenicum', target: 'rub_thirst_small_sips', type: 'covers_rubric', weight: 3 },
    { id: 'e103', source: 'rem_arsenicum', target: 'rub_restlessness_anxious', type: 'covers_rubric', weight: 3 },
    { id: 'e104', source: 'rem_calcarea', target: 'rub_apprehensive_fears', type: 'covers_rubric', weight: 3 },
    { id: 'e105', source: 'rem_calcarea', target: 'rub_fear_poverty', type: 'covers_rubric', weight: 2 },
    { id: 'e106', source: 'rem_calcarea', target: 'rub_startled_noise', type: 'covers_rubric', weight: 2 },
    { id: 'e107', source: 'rem_lachesis', target: 'rub_startled_noise', type: 'covers_rubric', weight: 3 },
    { id: 'e108', source: 'rem_lachesis', target: 'rub_grief_suppressed', type: 'covers_rubric', weight: 3 },
    { id: 'e109', source: 'rem_lachesis', target: 'rub_right_sided_headache', type: 'covers_rubric', weight: 2 },
    { id: 'e110', source: 'rem_pulsatilla', target: 'rub_health_anxiety', type: 'covers_rubric', weight: 2 },
    { id: 'e111', source: 'rem_pulsatilla', target: 'rub_apprehensive_fears', type: 'covers_rubric', weight: 2 },
    { id: 'e112', source: 'rem_pulsatilla', target: 'rub_grief_suppressed', type: 'covers_rubric', weight: 2 },
    { id: 'e113', source: 'rem_gelsemium', target: 'rub_anticipatory_anxiety', type: 'covers_rubric', weight: 3 },
    { id: 'e114', source: 'rem_gelsemium', target: 'rub_dullness_drowsiness', type: 'covers_rubric', weight: 3 },
    { id: 'e115', source: 'rem_gelsemium', target: 'rub_apprehensive_fears', type: 'covers_rubric', weight: 2 },
    { id: 'e116', source: 'rem_bryonia', target: 'rub_right_sided_headache', type: 'covers_rubric', weight: 3 },
    { id: 'e117', source: 'rem_bryonia', target: 'rub_fear_poverty', type: 'covers_rubric', weight: 3 },
    { id: 'e118', source: 'rem_bryonia', target: 'rub_irritable_questioned', type: 'covers_rubric', weight: 2 },
    { id: 'e119', source: 'rem_aconite', target: 'rub_fear_death', type: 'covers_rubric', weight: 3 },
    { id: 'e120', source: 'rem_aconite', target: 'rub_fever_dry_hot', type: 'covers_rubric', weight: 3 },
    { id: 'e121', source: 'rem_aconite', target: 'rub_restlessness_anxious', type: 'covers_rubric', weight: 3 },
    { id: 'e122', source: 'rem_sulphur', target: 'rub_fastidious', type: 'covers_rubric', weight: 1 },
    { id: 'e123', source: 'rem_lachesis', target: 'rub_sleep_catnaps', type: 'covers_rubric', weight: 2 },
    { id: 'e124', source: 'rem_pulsatilla', target: 'rub_sleep_catnaps', type: 'covers_rubric', weight: 2 },
    // --- REMEDIES -> REMEDIES (relationships) (12 edges) ---
    { id: 'e125', source: 'rem_sulphur', target: 'rem_lycopodium', type: 'complementary', weight: 3 },
    { id: 'e126', source: 'rem_sulphur', target: 'rem_nux_vomica', type: 'complementary', weight: 3 },
    { id: 'e127', source: 'rem_sulphur', target: 'rem_calcarea', type: 'follows_well', weight: 3 },
    { id: 'e128', source: 'rem_lycopodium', target: 'rem_lachesis', type: 'complementary', weight: 3 },
    { id: 'e129', source: 'rem_lycopodium', target: 'rem_pulsatilla', type: 'follows_well', weight: 2 },
    { id: 'e130', source: 'rem_nux_vomica', target: 'rem_sulphur', type: 'complementary', weight: 3 },
    { id: 'e131', source: 'rem_nux_vomica', target: 'rem_calcarea', type: 'inimical', weight: 3 },
    { id: 'e132', source: 'rem_lachesis', target: 'rem_calcarea', type: 'inimical', weight: 3 },
    { id: 'e133', source: 'rem_pulsatilla', target: 'rem_arsenicum', type: 'inimical', weight: 3 },
    { id: 'e134', source: 'rem_pulsatilla', target: 'rem_lycopodium', type: 'complementary', weight: 2 },
    { id: 'e135', source: 'rem_arsenicum', target: 'rem_nux_vomica', type: 'follows_well', weight: 2 },
    { id: 'e136', source: 'rem_gelsemium', target: 'rem_aconite', type: 'follows_well', weight: 2 },
    // --- CONDITIONS -> RUBRICS (has_symptom) (14 edges) ---
    { id: 'e137', source: 'cond_eczema', target: 'rub_burning_feet_bed', type: 'has_symptom', weight: 2 },
    { id: 'e138', source: 'cond_anxiety', target: 'rub_health_anxiety', type: 'has_symptom', weight: 3 },
    { id: 'e139', source: 'cond_anxiety', target: 'rub_anticipatory_anxiety', type: 'has_symptom', weight: 3 },
    { id: 'e140', source: 'cond_anxiety', target: 'rub_fear_death', type: 'has_symptom', weight: 3 },
    { id: 'e141', source: 'cond_anxiety', target: 'rub_fear_poverty', type: 'has_symptom', weight: 2 },
    { id: 'e142', source: 'cond_anxiety', target: 'rub_apprehensive_fears', type: 'has_symptom', weight: 3 },
    { id: 'e143', source: 'cond_anxiety', target: 'rub_restlessness_anxious', type: 'has_symptom', weight: 3 },
    { id: 'e144', source: 'cond_flatulence', target: 'rub_bloating_after_eating', type: 'has_symptom', weight: 3 },
    { id: 'e145', source: 'cond_flatulence', target: 'rub_empty_11am', type: 'has_symptom', weight: 2 },
    { id: 'e146', source: 'cond_headache', target: 'rub_right_sided_headache', type: 'has_symptom', weight: 3 },
    { id: 'e147', source: 'cond_insomnia', target: 'rub_startled_noise', type: 'has_symptom', weight: 3 },
    { id: 'e148', source: 'cond_insomnia', target: 'rub_sleep_catnaps', type: 'has_symptom', weight: 2 },
    { id: 'e149', source: 'cond_influenza', target: 'rub_dullness_drowsiness', type: 'has_symptom', weight: 3 },
    { id: 'e150', source: 'cond_influenza', target: 'rub_fever_dry_hot', type: 'has_symptom', weight: 3 },
    // --- MIASMS -> CONDITIONS (predisposes_to) (7 edges) ---
    { id: 'e151', source: 'mias_psora', target: 'cond_eczema', type: 'predisposes_to', weight: 3 },
    { id: 'e152', source: 'mias_psora', target: 'cond_anxiety', type: 'predisposes_to', weight: 2 },
    { id: 'e153', source: 'mias_psora', target: 'cond_flatulence', type: 'predisposes_to', weight: 2 },
    { id: 'e154', source: 'mias_sycosis', target: 'cond_flatulence', type: 'predisposes_to', weight: 3 },
    { id: 'e155', source: 'mias_sycosis', target: 'cond_arthritis', type: 'predisposes_to', weight: 3 },
    { id: 'e156', source: 'mias_syphilis', target: 'cond_insomnia', type: 'predisposes_to', weight: 2 },
    { id: 'e157', source: 'mias_tubercular', target: 'cond_asthma', type: 'predisposes_to', weight: 3 },
    // --- MODALITIES -> CONDITIONS (aggravates / ameliorates) (8 edges) ---
    { id: 'e158', source: 'mod_warmth_bed_agg', target: 'cond_eczema', type: 'aggravates', weight: 3 },
    { id: 'e159', source: 'mod_cold_draft_agg', target: 'cond_arthritis', type: 'aggravates', weight: 3 },
    { id: 'e160', source: 'mod_cold_draft_agg', target: 'cond_influenza', type: 'aggravates', weight: 2 },
    { id: 'e161', source: 'mod_motion_agg', target: 'cond_arthritis', type: 'aggravates', weight: 3 },
    { id: 'e162', source: 'mod_motion_agg', target: 'cond_headache', type: 'aggravates', weight: 2 },
    { id: 'e163', source: 'mod_pressure_amel', target: 'cond_headache', type: 'ameliorates', weight: 3 },
    { id: 'e164', source: 'mod_4_8_pm_agg', target: 'cond_flatulence', type: 'aggravates', weight: 3 },
    { id: 'e165', source: 'mod_warm_drinks_amel', target: 'cond_flatulence', type: 'ameliorates', weight: 3 },
    // --- FAMILIES -> KINGDOMS (9 edges) ---
    { id: 'e166', source: 'fam_chalcogen', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e167', source: 'fam_lycopodiaceae', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e168', source: 'fam_loganiaceae', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e169', source: 'fam_arsenic_oxide', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e170', source: 'fam_calcium_carb', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e171', source: 'fam_serpent', target: 'king_animal', type: 'belongs_to', weight: 3 },
    { id: 'e172', source: 'fam_ranunculaceae', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e173', source: 'fam_gelsemiaceae', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e174', source: 'fam_cucurbitaceae', target: 'king_plant', type: 'belongs_to', weight: 3 },
    // --- NEW EDGES FOR EXPANDED 6 REMEDIES ---
    // Remedies -> Kingdoms
    { id: 'e175', source: 'rem_nat_mur', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e176', source: 'rem_phosphorus', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e177', source: 'rem_silicea', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e178', source: 'rem_sepia', target: 'king_animal', type: 'belongs_to', weight: 3 },
    { id: 'e179', source: 'rem_belladonna', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e180', source: 'rem_apis', target: 'king_animal', type: 'belongs_to', weight: 3 },
    // Remedies -> Families
    { id: 'e181', source: 'rem_nat_mur', target: 'fam_halides', type: 'belongs_to', weight: 3 },
    { id: 'e182', source: 'rem_phosphorus', target: 'fam_pnictogens', type: 'belongs_to', weight: 3 },
    { id: 'e183', source: 'rem_silicea', target: 'fam_silicates', type: 'belongs_to', weight: 3 },
    { id: 'e184', source: 'rem_sepia', target: 'fam_cephalopoda', type: 'belongs_to', weight: 3 },
    { id: 'e185', source: 'rem_belladonna', target: 'fam_solanaceae', type: 'belongs_to', weight: 3 },
    { id: 'e186', source: 'rem_apis', target: 'fam_apidae', type: 'belongs_to', weight: 3 },
    // Remedies -> Miasms
    { id: 'e187', source: 'rem_nat_mur', target: 'mias_psora', type: 'has_miasm', weight: 3 },
    { id: 'e188', source: 'rem_nat_mur', target: 'mias_sycosis', type: 'has_miasm', weight: 2 },
    { id: 'e189', source: 'rem_phosphorus', target: 'mias_tubercular', type: 'has_miasm', weight: 3 },
    { id: 'e190', source: 'rem_silicea', target: 'mias_psora', type: 'has_miasm', weight: 2 },
    { id: 'e191', source: 'rem_silicea', target: 'mias_tubercular', type: 'has_miasm', weight: 3 },
    { id: 'e192', source: 'rem_sepia', target: 'mias_sycosis', type: 'has_miasm', weight: 3 },
    { id: 'e193', source: 'rem_belladonna', target: 'mias_psora', type: 'has_miasm', weight: 2 },
    { id: 'e194', source: 'rem_belladonna', target: 'mias_syphilis', type: 'has_miasm', weight: 3 },
    { id: 'e195', source: 'rem_apis', target: 'mias_sycosis', type: 'has_miasm', weight: 3 },
    // Remedies -> Conditions (treats_condition)
    { id: 'e196', source: 'rem_nat_mur', target: 'cond_headache', type: 'treats_condition', weight: 3 },
    { id: 'e197', source: 'rem_phosphorus', target: 'cond_asthma', type: 'treats_condition', weight: 3 },
    { id: 'e198', source: 'rem_silicea', target: 'cond_arthritis', type: 'treats_condition', weight: 2 },
    { id: 'e199', source: 'rem_sepia', target: 'cond_headache', type: 'treats_condition', weight: 3 },
    { id: 'e200', source: 'rem_sepia', target: 'cond_insomnia', type: 'treats_condition', weight: 2 },
    { id: 'e201', source: 'rem_belladonna', target: 'cond_influenza', type: 'treats_condition', weight: 3 },
    { id: 'e202', source: 'rem_belladonna', target: 'cond_headache', type: 'treats_condition', weight: 3 },
    { id: 'e203', source: 'rem_apis', target: 'cond_eczema', type: 'treats_condition', weight: 3 },
    // Remedies -> Modalities
    { id: 'e204', source: 'rem_nat_mur', target: 'mod_open_air_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e205', source: 'rem_nat_mur', target: 'mod_pressure_amel', type: 'ameliorates_by', weight: 2 },
    { id: 'e206', source: 'rem_nat_mur', target: 'mod_warmth_bed_agg', type: 'aggravates_by', weight: 2 },
    { id: 'e207', source: 'rem_phosphorus', target: 'mod_midnight_agg', type: 'aggravates_by', weight: 2 },
    { id: 'e208', source: 'rem_phosphorus', target: 'mod_open_air_amel', type: 'ameliorates_by', weight: 2 },
    { id: 'e209', source: 'rem_silicea', target: 'mod_cold_draft_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e210', source: 'rem_sepia', target: 'mod_standing_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e211', source: 'rem_sepia', target: 'mod_cold_draft_agg', type: 'aggravates_by', weight: 2 },
    { id: 'e212', source: 'rem_sepia', target: 'mod_pressure_amel', type: 'ameliorates_by', weight: 3 },
    { id: 'e213', source: 'rem_belladonna', target: 'mod_cold_draft_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e214', source: 'rem_belladonna', target: 'mod_motion_agg', type: 'aggravates_by', weight: 2 },
    { id: 'e215', source: 'rem_apis', target: 'mod_warmth_bed_agg', type: 'aggravates_by', weight: 3 },
    { id: 'e216', source: 'rem_apis', target: 'mod_open_air_amel', type: 'ameliorates_by', weight: 3 },
    // Remedies -> Rubrics
    { id: 'e217', source: 'rem_nat_mur', target: 'rub_grief_suppressed', type: 'covers_rubric', weight: 3 },
    { id: 'e218', source: 'rem_nat_mur', target: 'rub_fear_poverty', type: 'covers_rubric', weight: 2 },
    { id: 'e219', source: 'rem_phosphorus', target: 'rub_fear_death', type: 'covers_rubric', weight: 3 },
    { id: 'e220', source: 'rem_phosphorus', target: 'rub_health_anxiety', type: 'covers_rubric', weight: 2 },
    { id: 'e221', source: 'rem_silicea', target: 'rub_fastidious', type: 'covers_rubric', weight: 3 },
    { id: 'e222', source: 'rem_silicea', target: 'rub_apprehensive_fears', type: 'covers_rubric', weight: 2 },
    { id: 'e223', source: 'rem_sepia', target: 'rub_sleep_catnaps', type: 'covers_rubric', weight: 2 },
    { id: 'e224', source: 'rem_sepia', target: 'rub_grief_suppressed', type: 'covers_rubric', weight: 2 },
    { id: 'e225', source: 'rem_belladonna', target: 'rub_fever_dry_hot', type: 'covers_rubric', weight: 3 },
    { id: 'e226', source: 'rem_belladonna', target: 'rub_startled_noise', type: 'covers_rubric', weight: 3 },
    { id: 'e227', source: 'rem_apis', target: 'rub_burning_feet_bed', type: 'covers_rubric', weight: 2 },
    // Relationships (Remedy -> Remedy)
    { id: 'e228', source: 'rem_nat_mur', target: 'rem_apis', type: 'complementary', weight: 3 },
    { id: 'e229', source: 'rem_nat_mur', target: 'rem_sepia', type: 'complementary', weight: 3 },
    { id: 'e230', source: 'rem_nat_mur', target: 'rem_sepia', type: 'follows_well', weight: 2 },
    { id: 'e231', source: 'rem_phosphorus', target: 'rem_arsenicum', type: 'complementary', weight: 3 },
    { id: 'e232', source: 'rem_phosphorus', target: 'rem_calcarea', type: 'complementary', weight: 3 },
    { id: 'e233', source: 'rem_silicea', target: 'rem_calcarea', type: 'complementary', weight: 2 },
    { id: 'e234', source: 'rem_silicea', target: 'rem_pulsatilla', type: 'complementary', weight: 3 },
    { id: 'e235', source: 'rem_silicea', target: 'rem_pulsatilla', type: 'follows_well', weight: 2 },
    // Families -> Kingdoms
    { id: 'e236', source: 'fam_halides', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e237', source: 'fam_pnictogens', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e238', source: 'fam_silicates', target: 'king_mineral', type: 'belongs_to', weight: 3 },
    { id: 'e239', source: 'fam_cephalopoda', target: 'king_animal', type: 'belongs_to', weight: 3 },
    { id: 'e240', source: 'fam_solanaceae', target: 'king_plant', type: 'belongs_to', weight: 3 },
    { id: 'e241', source: 'fam_apidae', target: 'king_animal', type: 'belongs_to', weight: 3 }
];
const getKnowledgeGraph = () => {
    const nodes = [...exports.KNOWLEDGE_GRAPH_NODES];
    const edges = [...exports.KNOWLEDGE_GRAPH_EDGES];
    const nodeIds = new Set(nodes.map(n => n.id));
    const edgeIds = new Set(edges.map(e => e.id));
    const addNode = (node) => {
        if (!nodeIds.has(node.id)) {
            nodes.push(node);
            nodeIds.add(node.id);
        }
    };
    const addEdge = (edge) => {
        if (!edgeIds.has(edge.id)) {
            edges.push(edge);
            edgeIds.add(edge.id);
        }
    };
    const kingdoms = ["Mineral", "Plant", "Animal", "Nosode"];
    kingdoms.forEach(k => {
        const kid = `king_${k.toLowerCase()}`;
        addNode({
            id: kid,
            label: `${k} Kingdom`,
            type: 'kingdom',
            metadata: {
                origin: `Organic/Inorganic source substances of ${k} origin.`,
                description: `Homeopathic kingdom category for all remedies derived from ${k} sources.`
            }
        });
    });
    const miasms = ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancerinic"];
    miasms.forEach(m => {
        const mid = `mias_${m.toLowerCase()}`;
        addNode({
            id: mid,
            label: m,
            type: 'miasm',
            metadata: {
                miasmaticExpression: `Constitutional state characterized by ${m} dynamics.`,
                description: `Miasmatic archetype of ${m} progression.`
            }
        });
    });
    materiaMedicaDb_1.MASTER_REMEDY_DB.forEach(remedy => {
        const rid = remedy.id;
        const profile = {
            mentalThemes: remedy.keynotes.top10,
            generals: remedy.physicalGenerals.weatherSensitivity ? [remedy.physicalGenerals.weatherSensitivity] : [],
            particulars: remedy.organAffinities.map(o => `${o.organ}: ${o.details}`),
            modalities: [...remedy.modalities.betterFrom, ...remedy.modalities.worseFrom],
            thermals: remedy.physicalGenerals.thermalState,
            cravings: remedy.physicalGenerals.foodDesires || [],
            aversions: remedy.physicalGenerals.foodAversions || [],
            sleep: remedy.physicalGenerals.sleep || '',
            dreams: remedy.physicalGenerals.dreams?.join(', ') || '',
            fears: remedy.mentalPicture.fears || [],
            miasms: [remedy.miasmaticAnalysis.dominantMiasm],
            kingdom: remedy.identity.kingdom,
            family: remedy.identity.family,
            sourceSubstance: remedy.identity.sourceSubstance,
            relationships: {
                complementaries: remedy.relationships.complementary,
                inimicals: remedy.relationships.inimical,
                followWell: remedy.relationships.followsWell || []
            },
            clinicalUses: remedy.clinicalConditions.map(c => c.condition),
            keynotes: remedy.keynotes.top10,
            toxicology: 'Toxic details listed in classical pharmacopoeia. Active in potentized microdoses.',
            essence: remedy.essence.coreTheme
        };
        const existingNode = nodes.find(n => n.id === rid);
        if (existingNode) {
            if (!existingNode.metadata) {
                existingNode.metadata = {};
            }
            existingNode.metadata.profile = {
                ...profile,
                ...existingNode.metadata.profile,
                relationships: {
                    complementaries: Array.from(new Set([...profile.relationships.complementaries, ...(existingNode.metadata.profile?.relationships?.complementaries || [])])),
                    inimicals: Array.from(new Set([...profile.relationships.inimicals, ...(existingNode.metadata.profile?.relationships?.inimicals || [])])),
                    followWell: Array.from(new Set([...profile.relationships.followWell, ...(existingNode.metadata.profile?.relationships?.followWell || [])]))
                }
            };
        }
        else {
            addNode({
                id: rid,
                label: remedy.identity.name,
                type: 'remedy',
                metadata: {
                    description: remedy.essence.coreTheme,
                    profile
                }
            });
        }
        const kid = `king_${remedy.identity.kingdom.toLowerCase()}`;
        addEdge({
            id: `edge_${rid}_${kid}`,
            source: rid,
            target: kid,
            type: 'belongs_to',
            weight: 3
        });
        const famId = `fam_${remedy.identity.family.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        addNode({
            id: famId,
            label: remedy.identity.family,
            type: 'family',
            metadata: {
                origin: `${remedy.identity.kingdom} origin.`,
                description: `Family classification for ${remedy.identity.family}.`
            }
        });
        addEdge({
            id: `edge_${rid}_${famId}`,
            source: rid,
            target: famId,
            type: 'belongs_to',
            weight: 3
        });
        addEdge({
            id: `edge_${famId}_${kid}`,
            source: famId,
            target: kid,
            type: 'belongs_to',
            weight: 3
        });
        const miasmWeights = remedy.miasmaticAnalysis;
        const miasmKeys = ['psora', 'sycosis', 'syphilis', 'tubercular', 'cancerinic'];
        miasmKeys.forEach(mKey => {
            const weight = miasmWeights[mKey] || 0;
            if (weight >= 20) {
                const mid = `mias_${mKey}`;
                addEdge({
                    id: `edge_${rid}_${mid}`,
                    source: rid,
                    target: mid,
                    type: 'has_miasm',
                    weight: weight >= 50 ? 3 : (weight >= 30 ? 2 : 1)
                });
            }
        });
        remedy.clinicalConditions.forEach(cond => {
            const condId = `cond_${cond.condition.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            addNode({
                id: condId,
                label: cond.condition,
                type: 'condition',
                metadata: {
                    pathology: cond.details
                }
            });
            addEdge({
                id: `edge_${rid}_${condId}`,
                source: rid,
                target: condId,
                type: 'treats_condition',
                weight: cond.severityMatch === 'High' ? 3 : (cond.severityMatch === 'Medium' ? 2 : 1)
            });
        });
        const connectRel = (relName, type) => {
            const targetId = (0, normalizationEngine_1.resolveCanonicalRemedyId)(relName);
            if (targetId && targetId !== rid && targetId.startsWith("rem_")) {
                addEdge({
                    id: `edge_${rid}_${targetId}_${type}`,
                    source: rid,
                    target: targetId,
                    type,
                    weight: 2
                });
            }
        };
        remedy.relationships.complementary.forEach(r => connectRel(r, 'complementary'));
        remedy.relationships.inimical.forEach(r => connectRel(r, 'inimical'));
        remedy.relationships.followsWell.forEach(r => connectRel(r, 'follows_well'));
    });
    return {
        nodes,
        edges
    };
};
exports.getKnowledgeGraph = getKnowledgeGraph;
const getRemedyProfile = (remedyId) => {
    const node = (0, exports.getKnowledgeGraph)().nodes.find(n => n.id === remedyId && n.type === 'remedy');
    return node?.metadata?.profile;
};
exports.getRemedyProfile = getRemedyProfile;
