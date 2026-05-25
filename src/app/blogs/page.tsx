"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, Clock, ArrowRight, ArrowLeft, X, Calendar, 
  User, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import Portal from "@/components/Portal";

interface Article {
  id: string;
  title: string;
  category: 
    | "Skin" 
    | "Lungs" 
    | "Children's Health" 
    | "Research" 
    | "Gut & Hormones" 
    | "Joints & Neuro"
    | "Homeopathy"
    | "Healthcare"
    | "Heart Care"
    | "Cancer Care"
    | "Skin & Digestive"
    | "Respiratory & Lungs"
    | "Hormones & Diabetes"
    | "Heart & Lipids"
    | "Kidney & Urology"
    | "Immunity & Infections"
    | "Lifestyle & Wellness";
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  content: string | string[];
  glowColor: string;
  image: string;
}

const articles: Article[] = [
  // RESEARCH ARTICLES
  {
    id: "epigenetics",
    title: "Understanding Epigenetics: How Homeopathy Affects Gene Expression",
    category: "Research",
    date: "May 10, 2026",
    readTime: "6 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Discover how constitutional homeopathic remedies act as signals that influence epigenetic switches, modulating immune pathways in autoimmune disease.",
    content: [
      "In modern biology, we are discovering that our genetic blueprint is not a fixed sentence, but a dynamic library. Epigenetics is the study of how environmental factors, stress, nutrition, and therapies turn genes 'on' or 'off' without changing the DNA sequence itself.",
      "In classical homeopathy, constitutional prescribing has always targeted the 'miasmatic background'—what we now recognize as the hereditary epigenetic predisposition to disease. A remedy acts as a microscopic, highly specific signal to cellular receptors, initiating a cascade of intracellular events that can modify gene expression.",
      "Clinical trials tracking autoimmune conditions have shown that when a patient receives their simillimum (the perfect constitutional match), inflammatory markers and autoantibody counts drop significantly. This isn't because the remedy contains chemical suppressors, but because it triggers the body's self-regulating pathways to methylate or demethylate specific DNA regions, restoring cell-tolerance.",
      "By mapping these shifts against contemporary lab biomarkers, the framework of Evidence-Based Homeopathy demonstrates that natural therapeutics operate at the very cutting edge of molecular medicine."
    ],
    glowColor: "rgba(168,85,247,0.15)",
    image: "/images/epigenetics_gene.png"
  },
  {
    id: "nanoparticles",
    title: "The Nanotechnology of Dilution: Physical Proof of Homeopathic Potencies",
    category: "Research",
    date: "May 02, 2026",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How scanning electron microscopy (SEM) reveals the presence of source nanoparticles in extremely high dilutions.",
    content: [
      "For decades, critics argued that homeopathic remedies diluted past Avogadro's number ($10^{-23}$) contain nothing but water. However, state-of-the-art nanotechnology and physical chemistry are challenging this assumption.",
      "Research published in peer-reviewed materials science journals using Scanning Electron Microscopy (SEM) and Transmission Electron Microscopy (TEM) reveals that high homeopathic potencies (such as 30C and 200C) are not empty solutions. They contain nanoparticles of the starting raw materials.",
      "During the process of 'succussion' (vigorous shaking in a systematic sequence), the raw mineral or plant particles are reduced to nano-scale dimensions. These nanoparticles then rise to the top layer of the solution and adsorb onto micro-bubbles, remaining structurally intact even through successive dilutions.",
      "These stable nanoparticles interact with cellular membranes and ion channels, triggering biological responses. This nanoscience model shifts homeopathy from a chemical framework to a physical, information-based model of cellular communication."
    ],
    glowColor: "rgba(168,85,247,0.15)",
    image: "/images/nanoparticles_dilution.png"
  },
  {
    id: "cellular-resilience",
    title: "Micro-Dosing & Hormesis: Scientific Paradigms of Cellular Self-Regulation",
    category: "Research",
    date: "March 30, 2026",
    readTime: "6 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Understanding the law of hormesis: how ultra-low doses of bioactive substances stimulate positive cellular adaptations.",
    content: [
      "Hormesis is a well-documented toxicological phenomenon where a substance that is toxic in high doses produces beneficial, stimulating effects in extremely small doses. This biological principle explains the core mechanism of homeopathy.",
      "When a cell is exposed to an ultra-low concentration of a corrective substance, it does not experience chemical toxicity. Instead, it perceives a subtle stress signal. This signal triggers the cell's internal defense pathways, prompting the synthesis of heat shock proteins and antioxidant enzymes.",
      "This mild stimulation strengthens cellular resilience, allowing the body to correct chronic functional imbalances on its own. It is a process of training the organism, rather than overriding its systems with brute chemical force.",
      "Understanding hormesis bridges the gap between conventional pharmacology and the refined micro-dosing methods of evidence-based homeopathy."
    ],
    glowColor: "rgba(168,85,247,0.15)",
    image: "/images/hormesis_microdose.png"
  },
  {
    id: "allergic-desensitization",
    title: "Immunological Tolerance: Retraining Allergen Responses via Diluted Antigens",
    category: "Research",
    date: "March 18, 2026",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How micro-dilutions of environmental allergens assist the body in building long-term immunological tolerance.",
    content: [
      "Allergies occur when the immune system treats harmless substances (like pollen, dust, or food proteins) as dangerous threats, releasing IgE antibodies and triggering mast cells to flood the body with histamine.",
      "Conventional antihistamines block histamine receptors but do not stop mast cells from reacting. Homeopathy utilizes micro-diluted allergens to retrain the immune system, gradually building tolerance.",
      "By introducing highly diluted, succussed preparations of specific triggers (such as house dust mite or pollen extracts), we prompt the immune system to shift its response from an IgE-mediated allergic cascade to a protective IgG-mediated pathway.",
      "This gradual desensitization reduces seasonal allergy symptoms and decreases the frequency and severity of acute allergic episodes over time."
    ],
    glowColor: "rgba(168,85,247,0.15)",
    image: "/images/immunological_tolerance.png"
  },

  // SKIN ARTICLES
  {
    id: "psoriasis-recovery",
    title: "Overcoming Psoriasis: The Psoric Miasm and Dermal Recovery Stages",
    category: "Skin",
    date: "March 15, 2026",
    readTime: "10 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Exploring skin disorders from a deep-rooted cellular perspective, focusing on the three recovery phases and avoiding suppressive steroid cycles.",
    content: [
      "Psoriasis is not a disease of the skin; it is a multi-systemic immune disorder that manifests outwardly. Topical steroid creams provide brief cosmetic clearance by suppressing epidermal division, but they push the underlying auto-inflammatory trigger deeper, leading to severe relapses.",
      "Advanced homeopathy views psoriasis through the lens of the 'Psoric Miasm'—an inherited vulnerability characterizing cellular hyper-reactivity. Our treatments aim to regulate the immune signals driving rapid epidermal turn-over, reducing it from a rapid 4-day cycle back to the normal 28-day rate.",
      "During constitutional treatment, patients navigate three distinct recovery phases. Phase 1 involves superficial detoxification, where prior steroid suppression is unloaded. Phase 2 leads to cellular normalization, calming itching and scaling. Phase 3 consolidates the epidermal barrier, sealing moisture and preventing relapse.",
      "Measuring this progress against clinical quality-of-life scales ensures that patients see real, lasting remission without biological side effects."
    ],
    glowColor: "rgba(20,184,166,0.15)",
    image: "/images/psoriasis_dermal.png"
  },
  {
    id: "eczema-root-causes",
    title: "Eczema in Adults and Children: Addressing the Core Epidermal Barrier Deficit",
    category: "Skin",
    date: "March 05, 2026",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How systemic constitutional remedies repair filaggrin deficiency and prevent recurrent eczematous itching.",
    content: [
      "Eczema, or atopic dermatitis, is characterized by a dry, cracked, and intensely itchy skin barrier, often linked to a deficiency in filaggrin, a structural protein essential for skin hydration and integrity.",
      "When the epidermal barrier is compromised, moisture escapes easily, and environmental irritants and allergens penetrate the deeper skin layers, triggering chronic inflammation and scratching cycles.",
      "Systemic homeopathic remedies stimulate the body to repair the skin barrier from within. Instead of relying on topical barriers, constitutional prescriptions optimize lipid synthesis and support cellular repair pathways.",
      "As the barrier heals, skin hydration improves, itchiness subsides, and the frequency of eczematous flare-ups is significantly reduced, helping break the scratch-itch cycle."
    ],
    glowColor: "rgba(20,184,166,0.15)",
    image: "/images/eczema_barrier.png"
  },
  {
    id: "vitiligo-melanocytes",
    title: "Vitiligo (Leucoderma): Stimulating Melanocyte Repigmentation Constitutionally",
    category: "Skin",
    date: "Feb 10, 2026",
    readTime: "9 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "An inside-out clinical approach to calming the auto-immune destruction of melanin-producing cells.",
    content: [
      "Vitiligo is an autoimmune condition where the body's immune system attacks and destroys melanocytes—the cells responsible for skin pigment—resulting in depigmented white patches.",
      "Applying topical steroids to bleach surrounding skin does not stop the immune system's attack on melanocytes. A comprehensive constitutional approach is needed.",
      "Homeopathic treatment aims to calm the specific autoimmune response targeting melanocytes. By reducing cellular stress, we help protect existing pigment-producing cells.",
      "Over time, this helps stimulate melanocyte migration from hair follicles and patch borders, leading to gradual repigmentation and restoring natural skin tone."
    ],
    glowColor: "rgba(20,184,166,0.15)",
    image: "/images/vitiligo_repigmentation.png"
  },
  {
    id: "urticaria-histamine",
    title: "Chronic Urticaria (Hives): Stabilising Mast Cells and Reducing Histamine Waves",
    category: "Skin",
    date: "Jan 25, 2026",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How to resolve chronic itchy wheals by desensitising the body's overactive inflammatory response.",
    content: [
      "Chronic urticaria is characterized by sudden, itchy, swollen wheals on the skin, triggered by mast cells releasing histamine into the surrounding tissues.",
      "While antihistamines block histamine receptors, they do not prevent mast cells from releasing histamine, often leading to a cycle of dependency on medication.",
      "Homeopathic treatment focuses on stabilizing mast cell membranes and regulating the autonomic nervous system pathways that trigger their release.",
      "By addressing underlying systemic sensitivities, we help reduce the frequency and severity of hives, offering long-term relief from chronic itching."
    ],
    glowColor: "rgba(20,184,166,0.15)",
    image: "/images/urticaria_hives.png"
  },
  {
    id: "dermatitis-steroids",
    title: "Steroid Withdrawal Syndrome (TSW): Easing Skin Recovery After Suppression",
    category: "Skin",
    date: "Jan 12, 2026",
    readTime: "9 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Supporting patients navigating Topical Steroid Withdrawal using gentle lymphatic drainage and cellular soothing.",
    content: [
      "Topical Steroid Withdrawal (TSW) can occur when patients stop using strong steroid creams, leading to severe redness, burning, swelling, and flaking of the skin.",
      "This happens because long-term steroid use constricts local blood vessels and suppresses adrenal functions, leaving the skin fragile and inflamed when the cream is stopped.",
      "Homeopathic support for TSW focus on gentle lymphatic drainage and soothing systemic inflammation without further suppressing the skin.",
      "By supporting the skin's natural healing processes and restoring adrenal balance, we help patients manage TSW symptoms and rebuild a healthy skin barrier."
    ],
    glowColor: "rgba(20,184,166,0.15)",
    image: "/images/steroid_withdrawal.png"
  },

  // LUNGS ARTICLES
  {
    id: "respiratory-reflex",
    title: "COPD & Asthma Recovery: Regulating the Bronchial Reflex Arc",
    category: "Lungs",
    date: "February 22, 2026",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How constitutional homeopathy desensitizes airway hyper-reactivity to pollens, dust, and temperature drops.",
    content: [
      "Asthma and chronic obstructive pulmonary disease (COPD) are characterized by bronchial hyper-reactivity. When exposed to allergens, cold air, or emotional stress, the vagal nerve triggers rapid spasms in the bronchial smooth muscles, causing airway constriction and wheezing.",
      "Inhalers provide immediate relief by forcing dilation, but they do not address why the nerve reflex is hypersensitive in the first place. Over time, chronic bronchial spasms lead to tissue remodeling and decreased lung elasticity.",
      "Homeopathic lung care programs target this spasmolytic arc. Remedies work on the autonomic pathways to desensitize vagal nerve reactivity, soothing spasmodic coughing and liquefying thick, stuck mucosal blockages for easy clearance.",
      "Over a 3-to-12 month cycle, constitutional remedies fortify the alveolar cell membranes and rebuild lung vital capacity, allowing patients to reduce their reliance on emergency inhalers safely."
    ],
    glowColor: "rgba(6,182,212,0.15)",
    image: "/images/asthma_bronchial.png"
  },
  {
    id: "allergic-rhinitis",
    title: "Allergic Rhinitis and Sinusitis: Calming Airway Hyper-reactivity to Pollens",
    category: "Lungs",
    date: "February 08, 2026",
    readTime: "6 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Addressing chronic sneezing, nasal congestion, and sinus headaches through mucosal desensitisation.",
    content: [
      "Allergic rhinitis and chronic sinusitis are caused by inflammation of the nasal passages and sinuses in response to environmental allergens like pollen, mold, or dust.",
      "This inflammation leads to mucosal congestion, sneezing, and sinus pressure, often treated with temporary decongestant sprays or antihistamines.",
      "Homeopathic remedies focus on reducing mucosal sensitivity and supporting healthy sinus drainage, helping clear blockages and ease pressure naturally.",
      "By addressing the body's underlying allergic tendencies, we help prevent recurrent sinus infections and reduce sensitivity to environmental triggers."
    ],
    glowColor: "rgba(6,182,212,0.15)",
    image: "/images/respiratory_flow.png"
  },
  {
    id: "bronchitis-drainage",
    title: "Chronic Bronchitis: Restoring Mucociliary Clearance and Alveolar Stamina",
    category: "Lungs",
    date: "January 20, 2026",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How systemic remedies clear chronic phlegm, reduce cough fits, and optimize oxygen exchange.",
    content: [
      "Chronic bronchitis involves long-term inflammation of the bronchial tubes, leading to excess mucus production and a persistent, productive cough.",
      "This excess mucus blocks airways and reduces the efficiency of the cilia—small, hair-like structures that clear debris from the lungs.",
      "Homeopathic remedies support mucociliary clearance by thinning thick mucus, making it easier to cough up and clear from the airways.",
      "By reducing bronchial inflammation and supporting alveolar health, we help improve oxygen exchange and restore respiratory stamina."
    ],
    glowColor: "rgba(6,182,212,0.15)",
    image: "/images/microscopic_remedy.png"
  },
  {
    id: "cough-reflex",
    title: "The Chronic Spasmodic Cough: Soothing Neurological and Vagal Airway Sensitivity",
    category: "Lungs",
    date: "January 03, 2026",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Resolving tickling dry coughs triggered by cold air, talking, or laughing by calming hyperactive nerve endings.",
    content: [
      "A chronic spasmodic cough is a dry, persistent cough that occurs in sudden fits, often triggered by minor stimuli like cold air, talking, or laughing.",
      "This is often due to hypersensitive vagal nerve endings in the throat and larynx, which send exaggerated cough signals to the brain.",
      "Homeopathic treatment targets this nervous sensitivity, helping calm hyperactive nerve endings and soothe spasmodic throat tickling.",
      "By relaxing the larynx and upper airway muscles, we help reduce the frequency of cough fits and support throat healing."
    ],
    glowColor: "rgba(6,182,212,0.15)",
    image: "/images/cough_vagal_calm.png"
  },
  {
    id: "post-viral-fatigue",
    title: "Post-Viral Respiratory Fatigue: Restoring Lung Vitality and Cellular Energy",
    category: "Lungs",
    date: "December 15, 2025",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How constitutional support resolves lingering tightness, chest heaviness, and breathlessness after viral infections.",
    content: [
      "Lingering respiratory symptoms like tightness, heaviness, or mild breathlessness can persist for weeks or months after a viral respiratory infection.",
      "This is often due to low-grade, persistent inflammation in the lung tissues and temporary depletion of cellular energy reserves.",
      "Homeopathic support focuses on reducing lingering inflammation and supporting the body's natural energy production pathways.",
      "By encouraging tissue repair and restoring vitality, we help clear chest congestion and support a full return to healthy breathing."
    ],
    glowColor: "rgba(6,182,212,0.15)",
    image: "/images/lung_alveolar_energy.png"
  },
  {
    id: "childhood-asthma",
    title: "Childhood Asthma: Restoring Airway Immunity Without Heavy Inhaler Dependence",
    category: "Lungs",
    date: "December 01, 2025",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "A gentle approach to reducing bronchial reactivity in young children, supporting natural lung development.",
    content: [
      "Childhood asthma involves chronic inflammation of the airways, making children highly sensitive to triggers like cold air, viral infections, or exercise.",
      "While inhalers are necessary for acute relief, over-reliance can sometimes delay the natural development of airway immunity.",
      "Homeopathic care aims to reduce bronchial reactivity by addressing underlying sensitivities, supporting natural lung growth and immunity.",
      "By strengthening the child's constitutional health, we help reduce the frequency of asthma episodes and support healthy, active breathing."
    ],
    glowColor: "rgba(6,182,212,0.15)",
    image: "/images/pediatric_bronchial_shield.png"
  },

  // CHILDREN'S HEALTH ARTICLES
  {
    id: "pediatric-immunity",
    title: "The Pediatric Immunity Wave: Resolving Chronic Tonsillitis and Adenoid Hypertrophy",
    category: "Children's Health",
    date: "April 28, 2026",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "A clinical look at why children suffer from recurrent tonsil swelling, and how gentle systemic medicine avoids surgical removal.",
    content: [
      "Tonsils and adenoids are the body's first line of defense, acting as training grounds for a child's developing immune system. When a child experiences recurrent tonsillitis or adenoid hypertrophy, it is a signal that their lymphatic system is overwhelmed, not that these organs are redundant.",
      "Conventional approaches frequently resort to surgical removal (tonsillectomy). However, removing these defense gates often pushes immune imbalances deeper, sometimes manifesting as childhood asthma or chronic allergies later in life.",
      "Homeopathic pediatric care utilizes sweet, highly accepted remedies to gently shrink enlarged adenoid and tonsillar tissues. By draining stagnant lymphatic fluid and soothing airway inflammation, we restore comfortable nasal breathing and eliminate nighttime snoring.",
      "More importantly, constitutional remedies stimulate the child's innate vitality. Rather than artificially suppressing symptoms with antibiotics, homeopathy trains the immune system to recognize and clear pathogens efficiently, breaking the cycle of monthly seasonal infections."
    ],
    glowColor: "rgba(245,158,11,0.15)",
    image: "/images/pediatric_immunity.png"
  },
  {
    id: "child-development",
    title: "Constitutional Support for Pediatric Growth and Developmental Delays",
    category: "Children's Health",
    date: "April 15, 2026",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "How child constitutional remedies balance nutrition absorption, bone assimilation, and cognitive milestones.",
    content: [
      "Healthy pediatric growth requires proper nutrition absorption, metabolic balance, and bone assimilation, alongside meeting cognitive and physical milestones.",
      "Developmental delays or growth struggles can stem from constitutional weaknesses, poor digestive assimilation, or chronic illnesses.",
      "Homeopathic support uses gentle remedies to optimize digestive function, helping the body absorb essential minerals like calcium and iron more effectively.",
      "By supporting the child's overall vitality and metabolic processes, we help balance physical growth and support cognitive development."
    ],
    glowColor: "rgba(245,158,11,0.15)",
    image: "/images/pediatric_growth_cellular.png"
  },
  {
    id: "recurrent-fevers",
    title: "Recurrent Childhood Fevers: Training Lymphatic Drainage and Natural Resistance",
    category: "Children's Health",
    date: "March 20, 2026",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Why suppressing every temperature spike hinders immune development, and how to build natural defense responses.",
    content: [
      "A fever is a natural immune response to infection, helping the body fight pathogens and develop long-term resistance.",
      "Frequently suppressing mild fevers with medication can sometimes interrupt this natural immune training, leading to recurrent infections.",
      "Homeopathic remedies focus on supporting lymphatic drainage and clearing congestion, assisting the body's natural defense processes.",
      "By helping the immune system manage infections naturally, we support the child in building stronger resistance and reducing recurrent fevers."
    ],
    glowColor: "rgba(245,158,11,0.15)",
    image: "/images/pediatric_lymphatic_drainage.png"
  },
  {
    id: "childhood-eczema",
    title: "Atopic Dermatitis in Toddlers: Healing the Skin from the Inside Out",
    category: "Children's Health",
    date: "February 24, 2026",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Resolving red, dry, itchy toddler patches by supporting digestive assimilation and calming inherited allergic traits.",
    content: [
      "Atopic dermatitis, or eczema, in toddlers is characterized by red, dry, and itchy patches on the skin, often linked to an inherited allergic tendency.",
      "While topical creams can soothe the skin surface, they do not address the digestive and immune factors behind the flare-ups.",
      "Homeopathic care focuses on improving digestion and balancing the immune system's response to environmental triggers.",
      "By addressing these internal factors, we support the skin in healing from within, reducing the severity and recurrence of eczema patches."
    ],
    glowColor: "rgba(245,158,11,0.15)",
    image: "/images/skin_cellular.png"
  },

  // GUT & HORMONES ARTICLES
  {
    id: "intestinal-permeability",
    title: "The Brain-Gut-Skin Axis: How Gut Permeability Drives Inflammatory Flare-ups",
    category: "Gut & Hormones",
    date: "April 11, 2026",
    readTime: "9 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Investigating the biological link between intestinal dysbiosis, systemic inflammation, and chronic skin flares.",
    content: [
      "The gut, brain, and skin are closely connected. Clinical observations show that patients with eczema, psoriasis, or acne frequently suffer from chronic digestive issues like bloating, acidity, or irregular bowel habits.",
      "When the mucosal lining of the intestines is compromised (often called 'leaky gut' or hyper-permeability), undigested proteins and microbial toxins escape into the bloodstream. This triggers a systemic immune response, manifesting as inflammation in distant target organs, most notably the skin.",
      "Homeopathic remedies address this axis at the root. Constitutional prescriptions target enteric nervous system stress, reducing gut hypersensitivity while supporting the cellular repair of the intestinal epithelial lining.",
      "By healing the gut barrier and restoring metabolic balance in the liver, we reduce the systemic inflammatory load, leading to a natural clearing of chronic, stubborn skin conditions from the inside out."
    ],
    glowColor: "rgba(232,121,249,0.15)",
    image: "/images/gut_skin_axis.png"
  },
  {
    id: "digestive-colic",
    title: "Infant Colic and Pediatric Indigestion: Balancing the Enteric Nervous System",
    category: "Gut & Hormones",
    date: "April 02, 2026",
    readTime: "6 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Soothing infant abdominal spasms and reflux gently without artificial drops or enzyme suppressors.",
    content: [
      "Infant colic and pediatric indigestion can cause distress for both babies and parents, often due to an immature digestive system and gas buildup.",
      "Standard drops or enzyme treatments may offer temporary relief but do not address the natural development of digestive rhythms.",
      "Homeopathic care targets the enteric nervous system, helping soothe abdominal spasms and reduce gas buildup gently.",
      "By supporting healthy digestion and calming gut spasms, we help ease discomfort and encourage regular digestive rhythms."
    ],
    glowColor: "rgba(232,121,249,0.15)",
    image: "/images/enteric_nervous_calm.png"
  },
  {
    id: "acne-hormones",
    title: "Adult Acne and Hormonal Fluctuations: Resolving Metabolic and Liver Stagnation",
    category: "Gut & Hormones",
    date: "Feb 28, 2026",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Looking beyond topical face washes to address sebum overproduction through endocrine and liver detoxification pathways.",
    content: [
      "Adult acne is often driven by hormonal imbalances, particularly excess androgens that trigger overactive sebaceous glands to produce thick sebum, leading to clogged pores and bacterial breakouts.",
      "Conventional topical washes and antibiotics offer temporary relief, but they do not address the hormonal and metabolic factors behind sebum production.",
      "Homeopathic remedies focus on the endocrine system and liver pathways. The liver plays a key role in processing excess hormones; when it is sluggish, these hormones circulate longer, worsening skin conditions.",
      "By supporting liver function and restoring endocrine balance, we help reduce sebum thickness and clear breakouts, improving skin texture naturally."
    ],
    glowColor: "rgba(232,121,249,0.15)",
    image: "/images/hormonal_acne.png"
  },

  // JOINTS & NEURO ARTICLES
  {
    id: "autoimmune-mechanisms",
    title: "Autoimmune Pathways: Calming the Hyperactive Immune System Without Suppression",
    category: "Joints & Neuro",
    date: "April 20, 2026",
    readTime: "8 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "An analysis of constitutional homeopathy's ability to modulate regulatory T-cells and inflammatory cytokines.",
    content: [
      "In autoimmune diseases, the immune system loses its capacity for 'self-tolerance,' mistakenly targeting healthy tissues. Conventional treatments rely on immunosuppressants and steroids to mute the immune response, which relieves symptoms but leaves the body vulnerable to infections.",
      "Homeopathic research focuses on immunomodulation. Rather than shutting down the immune system, constitutional remedies work on the feedback loops of regulatory T-cells (Tregs) and helper T-cells (Th1/Th2/Th17 balance).",
      "By stimulating the body's natural homeostatic regulators, homeopathy helps reduce the overexpression of pro-inflammatory cytokines like TNF-alpha and Interleukin-6. This allows the body to restore self-recognition and slow down tissue destruction naturally.",
      "Through systematic biomarker monitoring, we observe a steady reduction in autoantibody levels (such as ANA, Anti-CCP, or Thyroid Peroxidase) over a 6-to-12 month treatment timeline, demonstrating deep-rooted immunological stabilization."
    ],
    glowColor: "rgba(14,165,233,0.15)",
    image: "/images/autoimmune_balance.png"
  },
  {
    id: "hyperactivity-sleep",
    title: "Restlessness and Insomnia in Children: Soothing Autonomic Hyper-excitability",
    category: "Joints & Neuro",
    date: "March 08, 2026",
    readTime: "7 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "Addressing sleep disturbances, nightmares, and sensory overload using gentle, calming natural remedies.",
    content: [
      "Restlessness, sleep issues, or nightmares in children can stem from an overactive nervous system, often aggravated by sensory overload.",
      "These struggles can affect behavior, learning, and overall health, and are best addressed by calming the nervous system naturally.",
      "Homeopathic remedies focus on soothing autonomic hyper-excitability, helping the nervous system transition into a relaxed state.",
      "By supporting restful sleep and reducing sensory sensitivity, we help children feel more grounded and balanced during the day."
    ],
    glowColor: "rgba(14,165,233,0.15)",
    image: "/images/neural_synapse_sleep.png"
  }
];

export default function BlogsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<
    | "All" 
    | "Skin" 
    | "Lungs" 
    | "Children's Health" 
    | "Research" 
    | "Gut & Hormones" 
    | "Joints & Neuro"
    | "Homeopathy"
    | "Healthcare"
    | "Heart Care"
    | "Cancer Care"
    | "Skin & Digestive"
    | "Respiratory & Lungs"
    | "Hormones & Diabetes"
    | "Heart & Lipids"
    | "Kidney & Urology"
    | "Immunity & Infections"
    | "Lifestyle & Wellness"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const [liveArticles, setLiveArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live articles from Headless WordPress on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("https://admin.homeo.healthcare/wp-json/wp/v2/posts?_embed&per_page=20");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const posts = await res.json();
        
        const mapped: Article[] = posts.map((post: any) => {
          // Extract category
          let category: Article["category"] = "Research";
          try {
            const title = (post.title?.rendered || "").toLowerCase();
            const terms = post._embedded?.['wp:term']?.[0];
            const catName = (terms && terms.length > 0) ? terms[0].name.toLowerCase() : "";
            const slug = (terms && terms.length > 0) ? (terms[0].slug?.toLowerCase() || "") : "";

            // Title keyword check first
            if (['skin', 'eczema', 'psoriasis', 'liver', 'gall', 'digest', 'stomach', 'gut', 'acne', 'gerd', 'acidity', 'constipation', 'abdomen', 'gastric', 'bowel', 'ibs', 'crohn', 'ulcer', 'fistula', 'fissure', 'piles', 'hemorrhoid', 'pancreas', 'digestive'].some(w => title.includes(w))) {
              category = "Skin & Digestive";
            } else if (['asthma', 'bronchial', 'lung', 'throat', 'sinus', 'cough', 'rhinitis', 'respiratory', 'breathing', 'copd', 'cold', 'tonsil', 'adenoid', 'sneeze'].some(w => title.includes(w))) {
              category = "Respiratory & Lungs";
            } else if (['diabetes', 'thyroid', 'hormon', 'endocrine', 'gland', 'pcos', 'obesity', 'metabolic', 'weight', 'insulin', 'adrenal', 'goitre', 'pcod', 'hormonal'].some(w => title.includes(w))) {
              category = "Hormones & Diabetes";
            } else if (['heart', 'lipid', 'cholesterol', 'triglyceride', 'cardio', 'blood pressure', 'hypertension', 'angina', 'artery', 'vascular', 'circulat', 'cardiac'].some(w => title.includes(w))) {
              category = "Heart & Lipids";
            } else if (['joint', 'spondylosis', 'neck', 'spine', 'arthritis', 'rheumat', 'bone', 'neuro', 'back', 'sciatica', 'gout', 'muscul', 'paralysis', 'neuropathy', 'headache', 'migraine', 'disc', 'lumbar', 'nerve'].some(w => title.includes(w))) {
              category = "Joints & Neuro";
            } else if (['kidney', 'urolog', 'renal', 'urine', 'bladder', 'prostate', 'calculi', 'stone', 'uti', 'nephro'].some(w => title.includes(w))) {
              category = "Kidney & Urology";
            } else if (['infect', 'viral', 'fever', 'immun', 'flu', 'covid', 'chickenpox', 'measles', 'allergy', 'allergies', 'parasite', 'bacteri', 'autoimmune'].some(w => title.includes(w))) {
              category = "Immunity & Infections";
            } else if (['diet', 'nutrition', 'stress', 'summer', 'health care', 'lifestyle', 'prevent', 'detox', 'sleep', 'wellness', 'anxiety', 'depress', 'mental', 'mind', 'insomnia', 'fatigue', 'fitness', 'exercise'].some(w => title.includes(w))) {
              category = "Lifestyle & Wellness";
            } else if (['cancer', 'oncology', 'tumor', 'malignan', 'chemo', 'radiat'].some(w => title.includes(w))) {
              category = "Cancer Care";
            } else if (['kids', 'child', 'pediatric', 'infant', 'baby', 'toddler', 'autism', 'adhd'].some(w => title.includes(w))) {
              category = "Children's Health";
            } else {
              // Fallback to category terms matching
              if (catName.includes("skin") || catName.includes("eczema") || catName.includes("psoriasis")) {
                category = "Skin & Digestive";
              } else if (catName.includes("lung") || catName.includes("respiratory") || catName.includes("asthma")) {
                category = "Respiratory & Lungs";
              } else if (catName.includes("child") || catName.includes("pediatric") || catName.includes("kids") || slug.includes("kids")) {
                category = "Children's Health";
              } else if (catName.includes("gut") || catName.includes("digestive") || catName.includes("hormone") || catName.includes("endocrine")) {
                category = "Skin & Digestive";
              } else if (catName.includes("joint") || catName.includes("neuro") || catName.includes("spine") || catName.includes("headache")) {
                category = "Joints & Neuro";
              } else if (catName.includes("heart") || slug.includes("heart")) {
                category = "Heart & Lipids";
              } else if (catName.includes("cancer") || slug.includes("cancer")) {
                category = "Cancer Care";
              } else if (catName.includes("healthcare") || slug.includes("healthcare")) {
                category = "Healthcare";
              } else if (catName.includes("homeopathy") || slug === "uncategorized") {
                category = "Homeopathy";
              }
            }
          } catch (e) {}

          // Determine glowColor
          const glowColors: Record<Article["category"], string> = {
            "Skin": "rgba(20,184,166,0.15)",
            "Lungs": "rgba(6,182,212,0.15)",
            "Children's Health": "rgba(245,158,11,0.15)",
            "Gut & Hormones": "rgba(16,185,129,0.15)",
            "Joints & Neuro": "rgba(168,85,247,0.15)",
            "Research": "rgba(99,102,241,0.15)",
            "Homeopathy": "rgba(20,184,166,0.15)",
            "Healthcare": "rgba(14,165,233,0.15)",
            "Heart Care": "rgba(244,63,94,0.15)",
            "Cancer Care": "rgba(99,102,241,0.15)",
            "Skin & Digestive": "rgba(20,184,166,0.15)",
            "Respiratory & Lungs": "rgba(6,182,212,0.15)",
            "Hormones & Diabetes": "rgba(232,121,249,0.15)",
            "Heart & Lipids": "rgba(244,63,94,0.15)",
            "Kidney & Urology": "rgba(14,165,233,0.15)",
            "Immunity & Infections": "rgba(16,185,129,0.15)",
            "Lifestyle & Wellness": "rgba(99,102,241,0.15)"
          };

          // Get featured image
          let image = "/images/epigenetics_gene.png";
          try {
            const media = post._embedded?.['wp:featuredmedia']?.[0];
            if (media?.source_url) {
              image = media.source_url;
            }
          } catch (e) {}

          // Get excerpt
          const excerpt = post.excerpt?.rendered 
            ? post.excerpt.rendered.replace(/<[^>]*>/g, '').replace(/\[&hellip;\]/, '...').trim()
            : "";

          // Calculate read time
          const wordCount = post.content?.rendered 
            ? post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length 
            : 0;
          const readTime = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;

          // Format Date
          const date = new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          });

          return {
            id: post.slug || post.id.toString(),
            title: post.title?.rendered || "Untitled Post",
            category,
            date,
            readTime,
            author: post._embedded?.author?.[0]?.name || "Dr. Narayan Jethwani",
            excerpt,
            content: post.content?.rendered || "",
            glowColor: glowColors[category],
            image
          };
        });

        // Merge with existing static articles to ensure no blank page if WP is empty, or prefer live ones
        setLiveArticles(mapped.length > 0 ? mapped : articles);
      } catch (err) {
        console.error("Error fetching live posts:", err);
        // Fallback to local static articles on failure
        setLiveArticles(articles);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Sync scroll lock with drawer open/close
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedArticle]);

  const filteredArticles = liveArticles.filter((art) => {
    const matchesFilter = filter === "All" || art.category === filter;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categoriesList: (typeof filter)[] = [
    "All", 
    "Skin & Digestive", 
    "Respiratory & Lungs", 
    "Hormones & Diabetes", 
    "Heart & Lipids", 
    "Joints & Neuro", 
    "Kidney & Urology", 
    "Immunity & Infections", 
    "Lifestyle & Wellness", 
    "Cancer Care", 
    "Children's Health", 
    "Homeopathy", 
    "Healthcare", 
    "Skin", 
    "Lungs", 
    "Gut & Hormones", 
    "Research"
  ];
  
  const activeTabs = loading 
    ? categoriesList 
    : categoriesList.filter(cat => cat === "All" || liveArticles.some(art => art.category === cat));

  const handleBookConsultation = () => {
    router.push("/#booking");
  };

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Back to Homepage Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Magnetic>
            <Link
              href="https://homeo.healthcare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to the Future
            </Link>
          </Magnetic>
        </motion.div>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Educational Journal
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Science & Healing Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-700 font-semibold leading-relaxed"
          >
            Explore clinical essays, patient recovery case-studies, and scientific validations of advanced homeopathic therapeutics written by Dr. Narayan Jethwani.
          </motion.p>
        </div>

        {/* Filters and Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-900/5">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {activeTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  filter === cat
                    ? "bg-mint text-white shadow-sm shadow-mint/10"
                    : "glass-panel border-slate-200 hover:border-slate-800 text-slate-700 hover:text-[#1A2421] bg-white/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-6 py-2.5 rounded-full border border-slate-200 focus:border-mint bg-white/60 focus:bg-white text-xs font-semibold placeholder:text-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Shimmer Skeleton Loader
              Array.from({ length: 4 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.01)] animate-pulse"
                >
                  <div className="space-y-4 w-full">
                    {/* Image Skeleton */}
                    <div className="w-full aspect-[2/1] rounded-2xl bg-slate-200/50 border border-slate-900/5" />
                    {/* Meta Skeleton */}
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-16 bg-slate-200/50 rounded-full" />
                      <div className="h-3 w-16 bg-slate-200/50 rounded-full" />
                    </div>
                    {/* Title Skeleton */}
                    <div className="h-6 w-3/4 bg-slate-200/50 rounded-full" />
                    {/* Excerpt Skeleton */}
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-200/50 rounded-full" />
                      <div className="h-3 w-5/6 bg-slate-200/50 rounded-full" />
                    </div>
                  </div>
                  {/* Footer Skeleton */}
                  <div className="mt-8 pt-4 border-t border-slate-900/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200/50" />
                      <div className="h-3 w-20 bg-slate-200/50 rounded-full" />
                    </div>
                    <div className="h-3 w-24 bg-slate-200/50 rounded-full" />
                  </div>
                </div>
              ))
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((art) => (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-panel border-white/60 hover:border-white/90 bg-white/40 rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.01)] cursor-pointer"
                  onClick={() => setSelectedArticle(art)}
                >
                  {/* Spotlight glow on hover */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at 80% 20%, ${art.glowColor} 0%, transparent 60%)`
                    }}
                  />

                  <div className="space-y-4">
                    {/* Article Banner Image */}
                    <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden relative border border-slate-900/5 bg-slate-100">
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Article Metadata */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-700 font-bold uppercase tracking-wider">
                      <span className="text-mint">{art.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {art.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {art.readTime}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-[#1A2421] group-hover:text-mint transition-colors duration-300 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-700 font-semibold leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* Read CTA */}
                  <div className="mt-8 pt-4 border-t border-slate-900/5 flex items-center justify-between text-xs font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">NJ</div>
                      <span>{art.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-mint group-hover:translate-x-1.5 transition-transform duration-300">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500 font-semibold">
                No articles found matching your criteria.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Slide-over Full Read Drawer */}
      <Portal>
        <AnimatePresence>
          {selectedArticle && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-50 pointer-events-auto"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[600px] bg-[#FAF9F6]/95 border-l border-white/50 z-[51] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 md:p-8 border-b border-slate-900/5 flex items-center justify-between bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm text-mint">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-mint font-bold uppercase tracking-wider">Scientific Essay</span>
                    <h3 className="text-sm font-bold text-slate-800 leading-none">{selectedArticle.category}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500 group-hover:text-slate-800" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div 
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-text"
              >
                {/* Large Banner Image */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden relative border border-slate-900/5 bg-slate-100 mb-6">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-700 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {selectedArticle.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {selectedArticle.readTime}</span>
                </div>

                <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1A2421] leading-tight">
                  {selectedArticle.title}
                </h1>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-slate-900/5 px-4 py-2.5 rounded-2xl w-fit">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Written by {selectedArticle.author} · MD (Hom.)</span>
                </div>

                <hr className="border-slate-100" />

                {/* Article body content */}
                <div className="space-y-6 text-sm text-slate-700 font-semibold leading-relaxed wp-content">
                  {typeof selectedArticle.content === "string" ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                  ) : (
                    selectedArticle.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))
                  )}
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-6 md:p-8 bg-white/70 backdrop-blur-sm border-t border-slate-900/5 flex flex-col items-center">
                <div className="w-full text-center space-y-4">
                  <h4 className="text-sm font-bold text-[#1A2421]">Interested in constitutional treatment?</h4>
                  <p className="text-xs text-slate-700 font-semibold">
                    Schedule a clinical or telehealth video call setup directly with Dr. Jethwani.
                  </p>
                  <Magnetic>
                    <button
                      onClick={handleBookConsultation}
                      className="w-full py-4 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      Book Consultation with Dr. Jethwani
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Magnetic>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
      </Portal>
    </div>
  );
}
