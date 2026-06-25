const LUCY_KB = {
  brand: {
    name: "Homeo Healthcare",
    tagline: "Evidence-Based Homeopathy",
    founder: "Dr. Narayan Jethwani, MD (Hom.)",
    philosophy: "We integrate classical homeopathic principles with modern diagnostic science to deliver individualized, evidence-based constitutional treatments."
  },

  philosophy: [
    {
      title: "Law of Similars (Similia Similibus Curentur)",
      keywords: ["similars", "law of similars", "like cures like", "philosophy", "basic principle"],
      content: "The cornerstone of homeopathy: 'Like cures like'. A substance that can produce symptoms in a healthy person can, when prepared homeopathically, stimulate the body's natural defense mechanisms to cure similar symptoms in a sick person."
    },
    {
      title: "Individualized Treatment",
      keywords: ["individualized", "individual", "customized", "constitution", "constitutional"],
      content: "Homeopathy does not treat diseases; it treats the individual who has the disease. Two people with the same clinical diagnosis (e.g., migraine) may receive entirely different remedies based on their unique physical makeup, emotional state, triggers, and modalities (what makes symptoms better or worse)."
    },
    {
      title: "Minimum Dose & Potentization",
      keywords: ["minimum dose", "dose", "dilution", "potency", "potentization", "dilute"],
      content: "Homeopathic remedies are prepared through a process of serial dilution and succussion (vigorous shaking), known as potentization. This process activates the therapeutic properties of the substance while eliminating any chemical toxicity, making it safe for all ages."
    },
    {
      title: "Chronic Disease Management",
      keywords: ["chronic", "long term", "old disease", "asthma", "arthritis", "eczema", "migraine"],
      content: "Homeopathy excels in chronic disease management by addressing the underlying constitutional susceptibility (known as miasms) rather than just suppressing acute flare-ups. This leads to long-lasting healing and reduced recurrence."
    },
    {
      title: "Vital Force Concept",
      keywords: ["vital force", "vitality", "energy", "life force", "healing energy"],
      content: "Homeopathy views health as a state of dynamic equilibrium maintained by a spiritual, self-regulating energy called the Vital Force. Disease is a disruption of this force. Remedies act as catalysts to restore the balance of the Vital Force."
    }
  ],

  faqs: [
    {
      question: "Is Homeopathy evidence-based?",
      keywords: ["evidence", "science", "scientific", "proven", "research", "study"],
      answer: "Yes. Modern homeopathy utilizes clinical research, randomized controlled trials (RCTs), and observational studies. At Homeo Healthcare, Dr. Narayan Jethwani focuses on evidence-based homeopathy, documenting clinical progression using objective parameters like blood tests, scans, and standardized quality-of-life scores."
    },
    {
      question: "Are homeopathic medicines just placebos?",
      keywords: ["placebo", "sugar pills", "water", "nothing in them", "mind over matter"],
      answer: "No. Numerous laboratory studies demonstrate that homeopathic dilutions affect biological systems, including cell cultures, plants, and animals (where placebo effects do not apply). High-dilution remedies retain nanoparticle structures of the original substance that interact with cellular membranes."
    },
    {
      question: "How long does homeopathic treatment take?",
      keywords: ["slow", "how long", "duration", "fast", "speed of cure"],
      answer: "Homeopathic action is not inherently slow. Acute conditions (like fevers or acute digestive issues) often respond within minutes to hours. For long-standing chronic diseases, treatment takes longer because it aims to correct deep-seated constitutional imbalances. A general rule is one month of treatment for every year of illness."
    },
    {
      question: "Can I take homeopathy alongside conventional medicines?",
      keywords: ["allopathy", "conventional", "other drugs", "english medicine", "side effects", "combine"],
      answer: "Yes. Homeopathic remedies generally do not interfere with conventional pharmaceuticals (allopathy) because they operate on a different physiological level. Always inform your homeopath about all medications you are taking so they can monitor your progress and coordinate any gradual tapering with your prescribing physician."
    },
    {
      question: "What are the dietary restrictions during treatment?",
      keywords: ["restrictions", "diet", "onion", "garlic", "coffee", "what not to eat", "avoid"],
      answer: "Generally, it is advised to avoid strong aromatic substances like raw onion, raw garlic, mint, coffee, and camphor close to taking the remedy (at least 15-20 minutes before and after). These strong substances can sometimes antidote or reduce the efficacy of highly sensitive homeopathic potencies."
    }
  ],

  metrics: {
    vitality: {
      title: "Vitality Score",
      description: "A comprehensive metric of your overall energy, cellular health, and stress resilience. A score above 80 indicates excellent vital force, 60-80 indicates moderate vitality with room for optimization, and below 60 suggests dynamic imbalance requiring constitutional support."
    },
    bioAge: {
      title: "Biological Age",
      description: "An index reflecting the functional age of your cells and organs compared to your chronological age. Lifestyle optimization, stress control, and homeopathy aim to reduce biological age relative to actual age by boosting cellular regeneration."
    },
    stress: {
      title: "Stress Level",
      description: "Measures sympathetic nervous system dominance. High chronic stress depletes the Vital Force, leading to digestive, sleep, and immune issues."
    },
    organPerformance: {
      title: "Organ Performance Index",
      description: "An assessment of key physiological systems (Digestive, Metabolic, Renal, Sleep-Recovery, and Immune status) compiled from patient questionnaires and laboratory biomarkers."
    }
  },

  lifestyleTips: [
    {
      category: "Sleep",
      tips: [
        "Maintain a consistent sleep schedule, even on weekends.",
        "Ensure your bedroom is dark, quiet, and cool (around 18-20°C).",
        "Avoid screen exposure at least 1 hour before sleeping to support natural melatonin production.",
        "Take a warm bath or practice deep breathing exercises before bed."
      ]
    },
    {
      category: "Hydration",
      tips: [
        "Aim for 2.5 to 3 liters of filtered water daily to maintain cellular hydration.",
        "Drink water warm or at room temperature; avoid ice-cold water, which slows down digestion.",
        "Add a slice of lemon or cucumber to infuse mild electrolytes naturally."
      ]
    },
    {
      category: "Stress Management",
      tips: [
        "Practice 4-7-8 breathing technique (inhale 4s, hold 7s, exhale 8s) when feeling overwhelmed.",
        "Spend 15-20 minutes daily in contact with nature (grounding/earthing).",
        "Set clear boundaries between work and personal relaxation time.",
        "Consider gentle restorative yoga or meditation in the morning."
      ]
    },
    {
      category: "Nutrition & Digestion",
      tips: [
        "Eat fresh, warm, cooked meals. Avoid heavily processed, stale, or frozen foods.",
        "Chew your food thoroughly (about 32 times per bite) to ease digestive load.",
        "Include natural prebiotics (yogurt, fermented foods) and fiber-rich greens in your daily meals.",
        "Do not eat when anxious or distracted; mindful eating enhances nutrient absorption."
      ]
    }
  ],
  materiaMedica: [
    {
      name: "Arnica montana",
      commonName: "Leopard's Bane / Mountain Daisy",
      source: "Plant Kingdom",
      keynotes: "Sore, bruised feeling all over. Injuries, sprains, falls, muscular strain from overexertion. Fear of being touched or approached. Head hot, body cold.",
      modalities: "Worse from touch, damp cold, motion. Better from lying down, head low."
    },
    {
      name: "Nux vomica",
      commonName: "Poison Nut",
      source: "Plant Kingdom",
      keynotes: "Highly irritable, nervous, impatient disposition. Digestive issues, heartburn, bloating, and constipation with ineffectual urging. Overindulgence in stimulants, coffee, alcohol, or rich foods. Very sensitive to draft, cold, and noise.",
      modalities: "Worse from cold air, draft, morning, eating. Better from warmth, rest, damp weather."
    },
    {
      name: "Aconitum napellus",
      commonName: "Monkshood",
      source: "Plant Kingdom",
      keynotes: "Sudden, acute onset of symptoms, often after exposure to cold, dry wind. High fever, burning skin, extreme restlessness, anxiety, and fear of death.",
      modalities: "Worse from dry cold wind, evening, warm room. Better from open air, rest."
    },
    {
      name: "Belladonna",
      commonName: "Deadly Nightshade",
      source: "Plant Kingdom",
      keynotes: "Sudden, violent onset of symptoms with intense redness, heat, throbbing, and burning. High fever with hot head, cold hands and feet. Throbbing headache, dilated pupils.",
      modalities: "Worse from touch, noise, light, lying down. Better from semi-erect position, warmth."
    },
    {
      name: "Gelsemium sempervirens",
      commonName: "Yellow Jasmine",
      source: "Plant Kingdom",
      keynotes: "Dullness, drowsiness, dizziness, and muscular weakness (4 Ds). Performance anxiety, stage fright, or bad news triggering symptoms. Heavy eyelids, trembling limbs. Influenza with deep muscle aches.",
      modalities: "Worse from damp weather, emotion, thinking of symptoms. Better from urination, open air, sweating."
    },
    {
      name: "Lycopodium clavatum",
      commonName: "Club Moss",
      source: "Plant Kingdom",
      keynotes: "Digestive weakness with flatulence, bloating, and gas starting immediately after eating a few bites. Symptoms worse on the right side of the body. Lack of self-confidence but covers it with authoritative behavior. Craving for warm foods and sweets.",
      modalities: "Worse from 4 PM to 8 PM, warm room, cold drinks. Better from warm food and drinks, being active."
    },
    {
      name: "Arsenicum album",
      commonName: "Arsenic Trioxide",
      source: "Mineral Kingdom",
      keynotes: "Great anxiety, restlessness (moves from bed to chair), and fear of disease/death. Burning pains relieved by heat. Thirst for small sips of water at frequent intervals. Food poisoning, gastric irritation.",
      modalities: "Worse from midnight (12-2 AM), cold food/drinks. Better from heat, hot drinks, keeping head elevated."
    },
    {
      name: "Pulsatilla pratensis",
      commonName: "Wind Flower",
      source: "Plant Kingdom",
      keynotes: "Mild, gentle, yielding disposition; weeps easily. Symptoms are highly changeable. Thirstless with almost all complaints. Seeks open air, cannot tolerate warm, stuffy rooms.",
      modalities: "Worse from warm room, rich/fatty foods, lying on left side. Better from open air, gentle motion, cold applications."
    }
  ]
};
