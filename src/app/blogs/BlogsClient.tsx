"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, Clock, ArrowRight, ArrowLeft, X, Calendar, 
  User, Sparkles, Sun, AlignLeft, Maximize2, Minimize2, Type,
  Share2, Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import Portal from "@/components/Portal";

export interface Article {
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

const localStaticArticles: Article[] = [   {
    id: "migraine-uiux",
    title: "Beyond the Headache: Visualizing Migraine Pathways and Personalized Homeopathic Care",
    category: "Joints & Neuro",
    date: "June 19, 2026",
    readTime: "15 min read",
    author: "Dr. Narayan Jethwani",
    excerpt: "An in-depth clinical and visual communication analysis of migraine pathophysiology, triggers, and personalized homeopathic care, designed for high-clarity patient education.",
    content: `<style>
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0% { box-shadow: 0 8px 30px -10px rgba(20,184,166,0.15); border-color: rgba(20,184,166,0.1); }
    50% { box-shadow: 0 15px 40px 0px rgba(20,184,166,0.3); border-color: rgba(20,184,166,0.3); }
    100% { box-shadow: 0 8px 30px -10px rgba(20,184,166,0.15); border-color: rgba(20,184,166,0.1); }
  }
  @keyframes textShimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .wp-content-container {
    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .animated-heading {
    display: inline-block;
    background: linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #10b981 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShimmer 6s ease infinite;
    font-weight: 800;
  }

  .clinical-image-card {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    animation: pulseGlow 5s ease-in-out infinite;
    border: 1px solid rgba(20,184,166,0.1);
  }
  
  .clinical-image-card:hover {
    transform: scale(1.025) translateY(-6px);
    box-shadow: 0 25px 50px -12px rgba(20,184,166,0.35) !important;
    border-color: rgba(20,184,166,0.4) !important;
  }
  
  .premium-pill-card {
    background: linear-gradient(135deg, rgba(20, 184, 166, 0.03) 0%, rgba(6, 182, 212, 0.03) 100%);
    border: 1px solid rgba(20, 184, 166, 0.1);
    border-left: 4px solid #0d9488;
    border-radius: 16px;
    padding: 18px;
    transition: all 0.4s ease;
  }
  
  .premium-pill-card:hover {
    background: linear-gradient(135deg, rgba(20, 184, 166, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%);
    border-color: rgba(20, 184, 166, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(20,184,166,0.08);
  }
  
  .scientific-badge {
    background: rgba(20, 184, 166, 0.08);
    color: #0f766e;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: inline-block;
    margin-bottom: 8px;
    border: 1px solid rgba(20,184,166,0.15);
  }

  .interactive-table tr {
    transition: background-color 0.2s ease;
  }

  .interactive-table tr:hover {
    background-color: rgba(20, 184, 166, 0.02) !important;
  }
</style>

<div class="wp-content-container prose prose-slate max-w-none">
  <p class="lead text-base md:text-lg text-slate-800 font-semibold mb-6">
    Many people describe migraine as "just a headache." Those who experience it know it can be far more complex. It is not merely a transient pain that can be easily dismissed with a quick remedy; rather, it is a multi-systemic, neurovascular disorder that disrupts every dimension of daily life. For those affected, an attack can mean lost workdays, missed family milestones, fractured sleep patterns, and a profound strain on emotional well-being. By moving beyond a simple focus on head pain and exploring the intricate pathways of the brain and nervous system, we can begin to appreciate the true nature of this condition. Understanding these biological pathways is the first essential step in helping patients make sense of their symptoms and navigate their way back to a balanced, healthy life.
  </p>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">1. Introduction: The Neurovascular Reality of Migraine</span></h2>
  <p class="mb-4">
    At its core, a migraine is a reflection of a hyper-responsive brain. While a normal headache is often the result of temporary muscle tension or transient sinus pressure, a migraine involves a complex chain reaction of electrical, chemical, and vascular events within the central nervous system. When the brain detects a trigger, it initiates a neurochemical cascade that alters how we process sensory information. For a person experiencing an attack, normal light is felt as a blinding glare, quiet sounds are perceived as painful noise, and even the simple pulsation of blood vessels is experienced as an intense, throbbing ache. 
  </p>
  <p class="mb-4">
    This hypersensitivity has a major impact on quality of life. The unpredictability of attacks often leads to anticipatory anxiety, where patients live in constant fear of their next episode. It influences their ability to maintain steady work schedules, enjoy social gatherings, and establish consistent sleep patterns. At <strong>Homeo Healthcare</strong>, led by <strong>Dr. Narayan Jethwani MD (Hom.)</strong>, we believe that effective care must begin with patient education. When patients can visualize what is happening inside their nervous system, they are empowered to make informed health decisions, identify personal triggers, and actively participate in their personalized, constitutional care plans.
  </p>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">2. What Exactly Is a Migraine?</span></h2>
  <p class="mb-4">
    To understand migraine, we must first distinguish it from a normal, everyday headache. A tension headache is typically characterized by a dull, constant, bilateral ache that feels like a tight band wrapped around the forehead. It is rarely accompanied by other symptoms and generally does not prevent a person from carrying out their daily tasks. A migraine, on the other hand, is a neurological event characterized by moderate-to-severe throbbing pain, which is typically unilateral (one-sided) and worsens significantly with normal physical activity. A migraine is also accompanied by a range of systemic symptoms, including intense nausea, vomiting, and extreme sensitivity to light, sound, and smell.
  </p>
  <p class="mb-4">
    Clinical medicine categorizes migraines based on their frequency and characteristics:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Episodic Migraine:</strong> Characterized by experiencing headache days on fewer than 15 days per month. While these attacks are intermittent, they can still be highly disruptive and require proactive management.</li>
    <li><strong>Chronic Migraine:</strong> Defined as experiencing headaches on 15 or more days per month for at least three months, with at least 8 of those days meeting the criteria for a full migraine attack. Chronic migraine is a highly disabling condition that requires comprehensive, multi-disciplinary care.</li>
  </ul>
  <p class="mb-4">
    Migraine is an incredibly common condition, affecting over 1 billion people worldwide. It stands as the third most prevalent illness globally and the second leading cause of years lived with disability, particularly affecting individuals during their most productive working years (ages 15 to 49). The socioeconomic impact is immense, costing billions in lost productivity and healthcare expenditures annually. Yet, the personal cost is even greater, often leading to isolation, depression, and a reduced quality of life.
  </p>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">Normal Headache vs. Migraine Comparison</h3>
  <div class="my-8 overflow-x-auto">
    <table class="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden shadow-sm interactive-table">
      <thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <tr>
          <th class="px-6 py-3 text-left">Clinical Feature</th>
          <th class="px-6 py-3 text-left">Normal Tension Headache</th>
          <th class="px-6 py-3 text-left">Migraine Attack</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-slate-200 text-xs font-medium text-slate-700">
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Pain Location</td>
          <td class="px-6 py-4">Bilateral (both sides of the head), often wrapping around the forehead or temples like a tight band.</td>
          <td class="px-6 py-4">Unilateral (one-sided) in 70% of cases, typically localized behind one eye, temple, or the back of the head.</td>
        </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Pain Character</td>
          <td class="px-6 py-4">Dull, aching, steady pressure. Feels like a constant squeeze or a heavy weight.</td>
          <td class="px-6 py-4">Throbbing, pulsating, synchronous with the heartbeat. Feels like an intense hammering sensation.</td>
          </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Response to Movement</td>
          <td class="px-6 py-4">Remains constant; is not aggravated by normal walking, climbing stairs, or minor physical efforts.</td>
          <td class="px-6 py-4">Significantly worsens with physical movement, bending over, shaking the head, or light exertion.</td>
        </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Associated Symptoms</td>
          <td class="px-6 py-4">Absent. No nausea, vomiting, visual aura, or significant sensitivity to light and sound.</td>
          <td class="px-6 py-4">Present and severe: nausea, vomiting, photophobia, phonophobia, visual disturbances, and cognitive brain fog.</td>
        </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Duration</td>
          <td class="px-6 py-4">Variable, typically lasting 30 minutes to a few hours. Rarely disables the patient.</td>
          <td class="px-6 py-4">4 to 72 hours if left untreated. Highly disabling, usually requiring rest in a quiet, dark room.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">3. Visualizing the Migraine Brain</span></h2>
  <p class="mb-4">
    To understand how a migraine develops, we must look at the underlying structures of the brain and nervous system. A migraine is not a disease of the blood vessels alone, nor is it a simple muscular spasm. It is a complex neurovascular event that involves several key anatomical regions working in sequence:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>The Cerebral Cortex:</strong> The outer layer of the brain responsible for processing sensory information, thought, and voluntary movement. It is the site where cortical spreading depression (CSD) takes place, altering neurological activity and triggering visual and sensory aura symptoms.</li>
    <li><strong>The Brainstem:</strong> Located at the base of the brain, the brainstem acts as the main generator of the migraine attack. It houses the trigeminal nucleus caudalis (TNC), a key relay center that processes pain signals from the head, neck, and face.</li>
    <li><strong>The Hypothalamus:</strong> The brain's main control center for maintaining internal balance (homeostasis). Hyperactivity in the hypothalamus explains the pre-monitory symptoms (prodrome) that occur before the pain begins, such as fatigue, yawning, fluid retention, and food cravings.</li>
    <li><strong>The Trigeminal Nerve System:</strong> The largest cranial nerve, which provides sensory information to the face, teeth, and scalp. It projects fibers that wrap around the major blood vessels of the brain and the surrounding meninges (dura mater).</li>
    <li><strong>Cerebral Blood Vessels:</strong> The networks of arteries and veins that supply blood to the brain. During a migraine, the release of inflammatory neuropeptides causes these blood vessels to dilate and become inflamed, sending pain signals to the brain.</li>
  </ul>
  <p class="mb-4">
    During a migraine attack, the communication between these structures becomes disrupted. The process begins when a wave of electrical hyperexcitability, followed by a wave of neural depression, spreads across the cerebral cortex. This electrical wave stimulates the trigeminal nerve endings in the meninges, prompting them to release vasoactive neuropeptides, most notably <strong>Calcitonin Gene-Related Peptide (CGRP)</strong> and Substance P.
  </p>
  <p class="mb-4">
    These neuropeptides cause local vasodilation and trigger a sterile neurogenic inflammatory response in the surrounding meningeal tissues. This inflammation sensitizes the local pain receptors of the trigeminal nerve, which transmit pain signals back to the trigeminal nucleus caudalis (TNC) in the brainstem. From the TNC, pain signals travel upward to the thalamus, which acts as the sensory gatekeeper of the brain. Under constant stimulation, the thalamus becomes sensitized, losing its ability to filter incoming sensory inputs. This central sensitization explains why patients experience allodynia—where normally non-painful stimuli, such as brushing one's hair or a light touch to the face, are perceived as highly painful.
  </p>

  <div class="my-8 text-center">
    <img src="/images/image_1_migraine.png" alt="3D Migraine Pathway Anatomy" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE 1: 3D Migraine Pathway Anatomy] High-fidelity 3D transparent head model illustrating active trigeminal nerve pathways and unilateral pain distribution during a migraine attack.</p>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">4. The Four Phases of a Migraine Attack</span></h2>
  <p class="mb-4">
    A migraine is not a single moment of head pain; it is a clinical event that progresses through four distinct phases. While not every patient experiences every phase during an attack, understanding the timeline helps patients identify early warning signs and manage their condition more effectively.
  </p>

  <div class="space-y-6 my-6">
    <div class="premium-pill-card">
      <span class="scientific-badge">Phase 1: Prodrome (The Pre-Monitory Phase)</span>
      <h4 class="font-bold text-slate-800 text-sm mb-1">Duration: 24 to 48 Hours Before the Headache</h4>
      <p class="text-xs text-slate-600 font-semibold leading-relaxed mb-2">
        The prodrome phase acts as an early warning system. During this phase, patients may experience subtle symptoms, including frequent yawning, unexplained neck stiffness, food cravings (especially for sweets or chocolate), irritability, fluid retention, and increased sensitivity to light and sound.
      </p>
      <p class="text-xs text-slate-500 italic">
        <strong>Brain Mechanism:</strong> Driven by hyperactivity in the hypothalamus, which disrupts autonomic functions and alters dopamine levels before any physical pain begins.
      </p>
    </div>

    <div class="premium-pill-card">
      <span class="scientific-badge">Phase 2: Aura</span>
      <h4 class="font-bold text-slate-800 text-sm mb-1">Duration: 5 to 60 Minutes Preceding the Headache</h4>
      <p class="text-xs text-slate-600 font-semibold leading-relaxed mb-2">
        The aura phase involves transient, fully reversible neurological symptoms. The most common form is visual aura, where patients see shimmering lights, blind spots (scotomas), or zig-zag fortification spectra. Other forms include sensory aura (tingling or numbness starting in the hand and traveling to the face) and dysphasic aura (temporary difficulty finding words or slurred speech).
      </p>
      <p class="text-xs text-slate-500 italic">
        <strong>Brain Mechanism:</strong> Caused by a wave of cortical spreading depression (CSD) traveling slowly across the visual and sensory regions of the cerebral cortex.
      </p>
    </div>

    <div class="premium-pill-card">
      <span class="scientific-badge">Phase 3: Headache (The Pain Phase)</span>
      <h4 class="font-bold text-slate-800 text-sm mb-1">Duration: 4 to 72 Hours</h4>
      <p class="text-xs text-slate-600 font-semibold leading-relaxed mb-2">
        The headache phase is the most debilitating part of the attack. The pain is typically throbbing, unilateral, and worsens with any physical activity. It is accompanied by systemic symptoms, including nausea, vomiting, photophobia, phonophobia, and severe cognitive impairment (brain fog).
      </p>
      <p class="text-xs text-slate-500 italic">
        <strong>Brain Mechanism:</strong> Initiated by the activation of the trigeminovascular system, leading to neurogenic inflammation of meningeal blood vessels and central sensitization of the thalamus.
      </p>
    </div>

    <div class="premium-pill-card">
      <span class="scientific-badge">Phase 4: Postdrome (The "Migraine Hangover")</span>
      <h4 class="font-bold text-slate-800 text-sm mb-1">Duration: 24 to 48 Hours After the Headache</h4>
      <p class="text-xs text-slate-600 font-semibold leading-relaxed mb-2">
        Once the pain resolves, the postdrome phase begins. Patients often describe feeling physically exhausted, mentally sluggish, and emotionally drained—a state commonly referred to as a "migraine hangover." Some individuals may experience transient feelings of euphoria as the nervous system resets.
      </p>
      <p class="text-xs text-slate-500 italic">
        <strong>Brain Mechanism:</strong> Represents the gradual recovery and normalization of cortical, brainstem, and hypothalamic activity following the hyper-excitation of the attack.
      </p>
    </div>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">5. Understanding Migraine Aura</span></h2>
  <p class="mb-4">
    Migraine aura is a striking demonstration of the brain's electrical activity. Visual aura is the most common form, affecting approximately 90% of patients who experience aura. It typically begins as a small, shimmering spot in the center of the visual field that slowly expands over several minutes. This spot often develops into a scintillating scotoma—a blind spot bordered by shimmering, flickering, or multicolored zig-zag lights that resemble the battlements of a medieval fortress (fortification spectra).
  </p>
  <p class="mb-4">
    Other types of aura include:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Sensory Aura:</strong> Typically manifests as a "pins and needles" sensation (paresthesia) that starts in the fingers of one hand, slowly travels up the arm, and then spreads to the face, lips, and tongue on the same side.</li>
    <li><strong>Dysphasic Aura:</strong> Causes temporary language disturbances, where the patient struggles to find the right words, mixes up syllables, or experiences difficulty understanding spoken language.</li>
  </ul>
  <p class="mb-4">
    The physiological mechanism driving these symptoms is <strong>cortical spreading depression (CSD)</strong>. CSD is a slow-moving wave of cellular depolarization (intense electrical activity) followed by hyperpolarization (a wave of neural silence) that sweeps across the cerebral cortex. When this wave travels across the occipital lobe at the back of the brain, it disrupts the primary visual cortex, causing visual aura. If the wave continues forward into the somatosensory cortex, it triggers sensory aura; if it reaches the motor and speech areas, it causes language disturbances. CSD also stimulates the local trigeminal nerve endings in the meninges, initiating the pain phase of the migraine.
  </p>

  <div class="my-8 text-center">
    <img src="/images/image_5_aura.png" alt="Migraine Aura Visual Representation" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE 2: Migraine Aura Visual Representation] Experiential simulation showing visual aura symptoms (scintillating scotoma, zig-zag lines) paired with a brain profile highlighting occipital lobe activation.</p>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">6. Common Migraine Triggers</span></h2>
  <p class="mb-4">
    For individuals with a hyper-reactive brain, identifying and managing triggers is a key part of long-term prevention. Triggers are not the direct cause of a migraine; rather, they are external or internal events that accumulate and exceed the patient’s individual migraine threshold. When a patient's overall trigger load is low, they remain symptom-free. However, when multiple triggers occur together, they combine to cross the threshold, initiating the trigeminovascular cascade.
  </p>
  <p class="mb-4">
    Key factors that contribute to this cumulative trigger load include:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Emotional and Physiological Stress:</strong> High stress levels trigger cortisol release. Crucially, the sudden drop in stress—such as during weekends—is a common trigger due to rapid vascular changes.</li>
    <li><strong>Sleep Deprivation or Excess:</strong> Disruptions in circadian rhythms affect hypothalamic function, destabilizing the nervous system's internal clock.</li>
    <li><strong>Hormonal Fluctuations:</strong> Estrogen withdrawal (the sharp drop in estrogen levels before menstruation) alter serotonin pathways, lowering the pain threshold in women.</li>
    <li><strong>Skipped Meals & Hypoglycemia:</strong> Fluctuations in blood sugar levels trigger cerebral vasospasms, activating the trigeminovascular system.</li>
    <li><strong>Dehydration:</strong> A drop in blood volume and electrolyte balance can activate meningeal nociceptors, lowering the threshold for pain.</li>
    <li><strong>Environmental and Weather Changes:</strong> Fluctuations in barometric pressure, high winds, extreme heat, or sudden humidity changes are frequent triggers.</li>
    <li><strong>Screen Exposure and Sensory Overload:</strong> Flickering fluorescent lights, loud noises, strong odors, and prolonged screen glare directly overstimulate sensitive sensory networks.</li>
  </ul>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">Migraine Trigger Checklist</h3>
  <div class="my-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3 text-xs font-semibold text-slate-700">
    <div class="flex items-start gap-2">
      <input type="checkbox" readonly checked class="mt-1 accent-[#0d9488]" />
      <span><strong>Stress Levels:</strong> Sudden changes in workload, emotional tension, or the sudden relief of stress ("weekend headaches").</span>
    </div>
    <div class="flex items-start gap-2">
      <input type="checkbox" readonly checked class="mt-1 accent-[#0d9488]" />
      <span><strong>Sleep Patterns:</strong> Insufficient sleep, late nights, or sleeping in past your normal wake time.</span>
    </div>
    <div class="flex items-start gap-2">
      <input type="checkbox" readonly checked class="mt-1 accent-[#0d9488]" />
      <span><strong>Hydration Status:</strong> Skipping water intake, leading to minor cellular dehydration.</span>
    </div>
    <div class="flex items-start gap-2">
      <input type="checkbox" readonly checked class="mt-1 accent-[#0d9488]" />
      <span><strong>Dietary Intake:</strong> Vasoactive foods containing tyramines (aged cheeses, red wine), MSG, nitrites (cured meats), or skipped meals.</span>
    </div>
    <div class="flex items-start gap-2">
      <input type="checkbox" readonly checked class="mt-1 accent-[#0d9488]" />
      <span><strong>Hormonal Cycles:</strong> Tracking the pre-menstrual or mid-cycle phases in female patients.</span>
    </div>
    <div class="flex items-start gap-2">
      <input type="checkbox" readonly checked class="mt-1 accent-[#0d9488]" />
      <span><strong>Environmental Exposure:</strong> Glare from digital devices, strong perfumes, flickering lights, or sudden barometric pressure changes.</span>
    </div>
  </div>

  <div class="my-8 text-center">
    <img src="/images/image_3_triggers.png" alt="Migraine Triggers" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE 3: Migraine Trigger Infographic] Node-based information graphic mapping internal, environmental, and metabolic triggers around a central brain model.</p>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">7. Why Every Migraine Patient Is Different</span></h2>
  <p class="mb-4">
    One of the most challenging aspects of migraine is its variability. No two migraine patients share the exact same clinical profile. For one individual, an attack may be triggered solely by a sudden drop in barometric pressure, while for another, it may be the result of a skipped meal combined with a late night. The symptoms themselves can also vary widely: some patients experience visual aura before their headache, while others face intense abdominal symptoms (nausea, vomiting, acid reflux) with little to no sensory changes.
  </p>
  <p class="mb-4">
    This variability is shaped by a range of individual factors:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Trigger Signatures:</strong> Every patient has a unique combination of triggers that affect their individual threshold.</li>
    <li><strong>Symptom Expressions:</strong> Differences in the pain location (right-sided vs. left-sided), pain quality (throbbing vs. heavy pressure), and associated autonomic symptoms (nausea vs. cold sweats).</li>
    <li><strong>Physical Constitution:</strong> Variations in thermal sensitivities (worse in hot weather vs. cold weather), food cravings, and digestive health.</li>
    <li><strong>Emotional Profiles:</strong> The role of stress, anxiety, or emotional suppression in lowering the pain threshold.</li>
    <li><strong>Hereditary Influences:</strong> A family history of migraines can shape the age of onset, frequency of attacks, and response to treatment.</li>
  </ul>
  </p>
  <p class="mb-4">
    This clinical diversity highlights why a "one-size-fits-all" approach to migraine management is often ineffective. Suppressing pain pathways using generic medications may provide temporary relief, but it does not address the underlying neurovascular patterns or raise the patient's individual threshold. A personalized, comprehensive evaluation is essential to identify these unique patterns and support the body's natural self-regulatory mechanisms.
  </p>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">8. The Role of Homeopathy in Migraine Management: Understanding the Individual Behind the Migraine</span></h2>
  <p class="mb-4">
    Migraine is not experienced the same way by every individual. While two people may carry the same diagnosis, their symptom patterns, triggers, sensitivities, lifestyle factors, and overall health experiences may differ significantly. For one individual, migraine attacks may manifest as a sudden, intense left-sided throbbing accompanied by extreme photophobia and vomiting. For another, the attack may develop as a dull, heavy occipital ache preceded by a visual aura and triggered by weather changes.
  </p>
  <p class="mb-4">
    Individualized homeopathic care focuses on understanding the person as a whole rather than only the disease label. In classical homeopathy, a diagnosis of <strong class="text-[#0d9488]">chronic migraine</strong> is simply the starting point. To select a personalized homeopathic treatment plan, a practitioner must conduct a comprehensive assessment of the individual's unique symptom expression, physical constitution, and emotional profile, including:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Location of Pain:</strong> Whether the pain is strictly unilateral (right-sided vs. left-sided), bilateral, frontal, occipital, or retro-orbital (behind the eye).</li>
    <li><strong>Nature of Pain:</strong> Detailing the exact sensation, such as throbbing, pulsating, burning, dull, heavy, splitting, or pressing.</li>
    <li><strong>Frequency of Attacks:</strong> Assessing whether the migraine symptoms are episodic, cyclical, or chronic.</li>
    <li><strong>Trigger Factors:</strong> Identifying specific catalysts like emotional stress, certain foods, physical exhaustion, or sensory hyper-stimulation.</li>
    <li><strong>Aggravating Factors:</strong> What worsens the pain (e.g., light, noise, motion, heat, lying down, or the time of day).</li>
    <li><strong>Relieving Factors (Modalities):</strong> What eases the pain (e.g., firm pressure, cold applications, resting in a completely dark room, or moderate eating).</li>
    <li><strong>Sleep Patterns:</strong> Evaluating insomnia, sleep-wake cycles, and how sleep quality correlates with the onset of migraine attacks.</li>
    <li><strong>Stress Responses:</strong> Understanding the patient's physiological and psychological reaction to acute and chronic stress.</li>
    <li><strong>Emotional Health:</strong> Exploring underlying anxiety, suppressed emotions, grief, or mood patterns that lower the threshold of pain.</li>
    <li><strong>Digestive Health:</strong> Investigating the gut-brain axis, including acidity, bloating, constipation, or gastroparesis during an attack.</li>
    <li><strong>Hormonal Influences:</strong> Assessing the relationship between headaches and the menstrual cycle, pregnancy, or menopause in female patients.</li>
    <li><strong>Environmental Sensitivities:</strong> Tracking reactivity to weather changes, barometric pressure fluctuations, strong scents, or screen exposure.</li>
  </ul>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">8.1 Why Individualization Matters</h3>
  <p class="mb-4">
    By mapping these unique variables, clinical practitioners can identify distinct, recurring patterns in a patient's migraine journey. Recognizing these patterns helps create a more personalized care strategy that goes beyond simple pain suppression. For instance, we frequently identify several common individualized patterns:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Stress-Associated Migraine:</strong> Dominated by HPA axis hyper-reactivity, where attacks develop during intense work cycles or immediately after a stressful period ends (let-down headaches).</li>
    <li><strong>Hormonal Migraine:</strong> Strictly linked to hormonal fluctuations, particularly the pre-menstrual estrogen drop, altering central serotonin activity.</li>
    <li><strong>Weather-Triggered Migraine:</strong> Highly sensitive to changes in barometric pressure, sudden temperature shifts, or high winds, indicating autonomic instability.</li>
    <li><strong>Sleep-Related Migraine:</strong> Sparked by sleep deprivation, irregular wake times, or oversleeping, which destabilize hypothalamic function.</li>
    <li><strong>Digestive-Associated Migraine:</strong> Strongly linked to gut-brain microbiome axis disruptions, accompanied by acid reflux, sluggish digestion, or nausea.</li>
    <li><strong>Sensory-Triggered Migraine:</strong> Driven by cortical hyper-excitability, where bright screen exposure, flickering lights, or loud noises rapidly cross the migraine threshold.</li>
  </ul>

  <div class="my-8 text-center">
    <img src="/images/image_8_patterns.png" alt="Individualized Migraine Patterns and Triggers" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE: Individualized Migraine Patterns and Triggers] Visual mapping of stress, hormonal, sleep, weather, and food triggers illustrating the importance of individualization in migraine management.</p>
  </div>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">8.2 The Homeopathic Consultation Process</h3>
  <p class="mb-4">
    At Homeo Healthcare, our consultation process is a structured, collaborative assessment designed to uncover these individual patterns. Unlike standard clinical visits that focus only on selecting a drug for the diagnosis, our consultations evaluate the whole person. This comprehensive evaluation includes:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Detailed Health History:</strong> Exploring your medical background, past conditions, family history, and lifestyle baselines.</li>
    <li><strong>Migraine Timeline Analysis:</strong> Mapping when your headaches first began, how they have evolved over years, and the frequency of current episodes.</li>
    <li><strong>Trigger Identification:</strong> Systematically tracking environmental, activity, dietary, and hormonal factors that precede your attacks.</li>
    <li><strong>Lifestyle Assessment:</strong> Reviewing daily habits, physical activity levels, hydration consistency, and nutrition.</li>
    <li><strong>Sleep Evaluation:</strong> Analyzing your sleep quality, duration, and consistency of wake times.</li>
    <li><strong>Emotional Well-being Assessment:</strong> Exploring stress levels, mood fluctuations, and coping mechanisms.</li>
    <li><strong>Review of Previous Treatments:</strong> Evaluating past medications, their effectiveness, and any side effects or rebound patterns.</li>
    <li><strong>Personalized Symptom Mapping:</strong> Structuring your unique symptoms into a cohesive profile to guide remedy selection.</li>
  </ul>
  <p class="mb-4">
    These precise clinical observations contribute directly to individualized decision-making, allowing us to select a constitutional remedy that matches your specific symptom blueprint.
  </p>

  <div class="my-8 text-center">
    <img src="/images/image_9_assessment.png" alt="Personalized Homeopathic Migraine Assessment" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE: Personalized Homeopathic Migraine Assessment] Professional clinical consultation diagram illustrating the structured steps of a personalized health history and symptom assessment.</p>
  </div>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">8.3 Homeopathy Within a Migraine Health Intelligence Framework</h3>
  <p class="mb-4">
    To support this personalized care, we have developed the **Homeo Healthcare Migraine Health Intelligence Framework**. This multidimensional framework recognizes that long-term recovery requires understanding and optimizing multiple dimensions of health.
  </p>
  
  <div class="my-8 text-center">
    <img src="/images/image_10_framework.png" alt="Homeo Healthcare Migraine Health Intelligence Framework" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE: Homeo Healthcare Migraine Health Intelligence Framework] Integrative health framework chart mapping the nine core dimensions of the Migraine Health Intelligence Plan.</p>
  </div>

  <p class="mb-4">
    The framework consists of nine integrated dimensions:
  </p>
  <ol class="list-decimal pl-6 mb-6 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Migraine Assessment:</strong> Structuring the unique physical and neurological symptoms of your attacks.</li>
    <li><strong>Trigger Mapping:</strong> Identifying and tracking environmental, dietary, and physiological catalysts.</li>
    <li><strong>Sleep Intelligence:</strong> Optimizing sleep-wake rhythms and sleep hygiene to support hypothalamic stability.</li>
    <li><strong>Stress Pattern Analysis:</strong> Assessing stress responses and implementing daily parasympathetic recovery.</li>
    <li><strong>Lifestyle Intelligence:</strong> Structuring regular exercise and healthy daily habits.</li>
    <li><strong>Nutritional Review:</strong> Providing guidance on regular meals and identifying vasoactive foods.</li>
    <li><strong>Personalized Homeopathic Care:</strong> Prescribing a constitutional remedy aligned with your overall health profile.</li>
    <li><strong>Progress Monitoring:</strong> Evaluating changes in attack frequency, duration, and pain intensity.</li>
    <li><strong>Longitudinal Health Tracking:</strong> Monitoring long-term health metrics and autonomic recovery.</li>
  </ol>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">8.4 Integrative and Patient-Centered Care</h3>
  <p class="mb-4">
    At Homeo Healthcare, we advocate for an integrative, patient-centered approach. We recognize that patients benefit most from a comprehensive care strategy that combines the strengths of multiple disciplines. Treatment plans are designed in collaboration with the patient, emphasizing education and informed decision-making. 
  </p>
  <p class="mb-4">
    A comprehensive migraine management plan may include:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li>Professional medical evaluation by qualified healthcare providers to rule out secondary causes.</li>
    <li>Trigger awareness and avoidance strategies to lower the overall trigger load.</li>
    <li>Lifestyle modifications, including hydration and physical activity schedules.</li>
    <li>Sleep optimization routines to regulate circadian rhythms.</li>
    <li>Stress management techniques, such as mindfulness, biofeedback, or breathing exercises.</li>
    <li>Nutritional guidance to stabilize blood sugar and avoid common dietary triggers.</li>
    <li>Personalized homeopathic care to support natural self-regulation.</li>
  </ul>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">8.5 Current Research and Evidence</h3>
  <p class="mb-4">
    As clinical interest in personalized healthcare grows, researchers are increasingly exploring the efficacy of individualized approaches to migraine management. Research studying homeopathy in migraine has shown mixed findings. Some randomized controlled trials and observational studies suggest potential benefit in reducing the frequency and severity of attacks in selected patients under the care of a professional homeopath, while other clinical trials show no statistically significant difference compared to placebo.
  </p>
  <p class="mb-4">
    Further high-quality, large-scale clinical research is needed to fully clarify the therapeutic role and mechanism of homeopathic dilutions. Because treatment efficacy can vary, healthcare decisions should always be individualized, discussed with qualified healthcare professionals, and integrated into a safe, comprehensive medical framework.
  </p>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">8.6 What Patients Commonly Seek</h3>
  <p class="mb-4">
    Patients explore personalized homeopathic care for a variety of reasons. Many are seeking options for recurrent migraine episodes that continue to affect their daily activities despite conventional treatments. Others are interested in a holistic health assessment that looks at the relationship between physical, emotional, and lifestyle factors. Ultimately, patients seek individualized care to support their body's natural self-regulatory pathways and achieve long-term health optimization. In our clinical practice, we aim to address these needs by focusing on the individual behind the diagnosis, providing support without the risk of side effects or rebound headaches.
  </p>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">8.7 Homeo Healthcare Perspective</h3>
  <p class="mb-4">
    At Homeo Healthcare, our objective is not merely to focus on the headache itself but to understand the broader patterns influencing health. Through Health Intelligence, personalized assessment, patient education, and individualized homeopathic care, we aim to help patients better understand their migraine journey and make informed healthcare decisions. We believe that empowering patients with scientific clarity and personalized strategies is the key to achieving sustainable, long-term wellness.
  </p>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">9. Migraine and the Mind-Body Connection</span></h2>
  <p class="mb-4">
    The nervous system does not operate in isolation. It is connected to every organ system in the body, particularly the endocrine, immune, and gastrointestinal networks. In migraine patients, this mind-body connection plays a critical role in shaping the frequency and intensity of attacks.
  </p>
  <p class="mb-4">
    The primary pathway connecting the mind and body during a migraine involves:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>The Stress Response System:</strong> The hypothalamic-pituitary-adrenal (HPA) axis regulates the body's response to stress. Chronic activation of the HPA axis leads to sustained levels of cortisol and adrenaline, which can lower the migraine threshold and make the nervous system hyper-reactive.</li>
    <li><strong>The Autonomic Nervous System (ANS):</strong> The ANS maintains balance between the sympathetic ("fight-or-flight") and parasympathetic ("rest-and-digest") networks. Migraineurs often exhibit sympathetic dominance, which causes vascular instability and increases the risk of vasospastic attacks.</li>
    <li><strong>The Brain-Gut Relationship:</strong> The gut and brain communicate via the vagus nerve and the enteric nervous system. Imbalances in gut health, alterations in gut flora (microbiome), and inflammatory changes in the digestive tract can directly influence neuroinflammation in the brain, contributing to migraine symptoms.</li>
    <li><strong>Emotional Regulation:</strong> Emotional stress, anxiety, and suppressed feelings can directly affect serotonin levels in the brain, altering how we process pain and lowering the threshold for trigeminal activation.</li>
  </ul>
  <p class="mb-4">
    By recognizing these interconnected pathways, we can see that managing migraines requires a comprehensive approach. Supporting gut health, restoring autonomic balance, and implementing stress-reduction techniques are essential to raising the migraine threshold and encouraging long-term neurological stability.
  </p>

  <div class="my-8 text-center">
    <img src="/images/image_2_symptoms.png" alt="Brain-Body Connection Illustration" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE 4: Brain–Body Connection Illustration] Multi-sensory symptom map illustrating how neurological, autonomic, and gastrointestinal symptoms are linked during a migraine attack.</p>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">10. Personalized Homeopathic Care for Migraine</span></h2>
  <p class="mb-4">
    Conventional migraine management typically focuses on using abortive drugs to stop acute pain or daily prophylactic medications to reduce attack frequency. While these treatments are important, some patients experience side effects, incomplete relief, or medication overuse headaches from frequent use.
  </p>
  <p class="mb-4">
    <strong>Personalized Homeopathic Care</strong> offers an alternative, constitutional approach. Rather than focusing solely on a generic disease label, homeopathic care evaluates the patient as a whole. The goal is to support the body's natural self-regulatory mechanisms and improve overall vitality by selecting a remedy that matches the patient's unique physical, emotional, and hereditary profile.
  </p>
  <p class="mb-4">
    During a comprehensive consultation at Homeo Healthcare, Dr. Narayan Jethwani MD (Hom.) conducts a detailed case evaluation, looking at several key areas:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Precise Symptom Patterns:</strong> Assessing the location of the pain (right-sided vs. left-sided), the character of the pain (throbbing, heavy, or pressing), and the accompanying symptoms (nausea, visual aura, or numbness).</li>
    <li><strong>Modalities:</strong> Identifying what makes the pain better or worse (e.g., cold applications, firm pressure, resting in a quiet, dark room, or light movement).</li>
    <li><strong>Trigger Profiles:</strong> Evaluating how stress, food preferences, sleep patterns, weather changes, and hormonal cycles influence the onset of attacks.</li>
    <li><strong>Emotional and Mental Well-being:</strong> Understanding how stress, anxiety, or emotional factors shape the patient's overall health.</li>
    <li><strong>Physical Constitution:</strong> Analyzing the patient's thermal preferences (sensitivity to heat or cold), food cravings, and digestive patterns.</li>
    <li><strong>Family and Genetic History:</strong> Evaluating hereditary influences to understand the patient's underlying health baseline.</li>
  </ul>
  <p class="mb-4">
    By matching these unique characteristics, we can select a **constitutional remedy** tailored to the individual's needs. Homeopathic remedies act as gentle signaling agents that support the body's self-regulatory processes, helping to restore internal balance without the risk of side effects or rebound headaches.
  </p>

  <div class="my-8 text-center">
    <img src="/images/image_6_consultation.png" alt="Personalized Homeopathic Consultation" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE 5: Personalized Homeopathic Consultation] Reassuring clinical consultation scene depicting a supportive discussion between a practitioner and a patient.</p>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">11. Building a Migraine Health Intelligence Plan</span></h2>
  <p class="mb-4">
    Managing migraines effectively requires moving from reactive care to proactive health management. By tracking your daily habits and symptoms, you can identify patterns, recognize early warning signs, and understand how lifestyle modifications help raise your migraine threshold.
  </p>
  <p class="mb-4">
    An effective Health Intelligence Plan involves tracking key parameters:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Attack Frequency and Intensity:</strong> Documenting when attacks occur and grading the pain on a scale of 1 to 10.</li>
    <li><strong>Trigger Identification:</strong> Note any potential triggers, such as stress, changes in sleep patterns, specific foods, dehydration, or weather changes.</li>
    <li><strong>Sleep Quality and Duration:</strong> Tracking sleep consistency and any disruptions in sleep/wake times.</li>
    <li><strong>Stress and Recovery:</strong> Monitoring daily stress levels and times set aside for relaxation or parasympathetic recovery.</li>
    <li><strong>Hydration and Nutrition:</strong> Keeping track of daily water intake and meal consistency.</li>
    <li><strong>Hormonal Cycles:</strong> For women, mapping migraine occurrences against their menstrual cycles.</li>
  </ul>

  <h3 class="text-lg font-serif font-bold mt-6 mb-3 text-[#0f766e]">Patient Self-Monitoring Template</h3>
  <div class="my-8 overflow-x-auto">
    <table class="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden shadow-sm interactive-table">
      <thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <tr>
          <th class="px-6 py-3 text-left">Tracking Parameter</th>
          <th class="px-6 py-3 text-left">Daily Objective Target</th>
          <th class="px-6 py-3 text-left">Method of Documentation</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-slate-200 text-xs font-medium text-slate-700">
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Sleep Consistency</td>
          <td class="px-6 py-4">Maintain identical bedtimes and wake times within a 30-minute window, seven days a week. Target 7 to 8 hours.</td>
          <td class="px-6 py-4">Log sleep/wake times in a diary or track using a wearable sleep monitor.</td>
        </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Hydration Level</td>
          <td class="px-6 py-4">Drink 2.5 to 3 liters of water daily, evenly distributed throughout the day.</td>
          <td class="px-6 py-4">Track daily water intake using a water bottle scale or a mobile hydration app.</td>
        </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Meal Consistency</td>
          <td class="px-6 py-4">Eat balanced meals at regular intervals. Avoid skipping meals or going more than 5 hours without eating.</td>
          <td class="px-6 py-4">Note meal times and any foods containing tyramines or food additives.</td>
        </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Stress & HRV</td>
          <td class="px-6 py-4">Dedicate 15 minutes daily to deep breathing, meditation, or progressive muscle relaxation.</td>
          <td class="px-6 py-4">Track daily stress levels (1-10) or monitor Heart Rate Variability (HRV) metrics.</td>
        </tr>
        <tr>
          <td class="px-6 py-4 font-bold text-[#0d9488]">Symptom Timeline</td>
          <td class="px-6 py-4">Document any pre-monitory signs, visual aura, pain duration, and postdrome symptoms.</td>
          <td class="px-6 py-4">Record symptom phases, pain location, and any acute treatments in a headache diary.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="my-8 text-center">
    <img src="/images/image_7_habits.png" alt="Lifestyle Management Dashboard" class="rounded-3xl shadow-lg max-w-full mx-auto aspect-[1/1] w-full max-w-[480px] clinical-image-card" />
    <p class="text-xs text-slate-500 mt-3 italic">[IMAGE 6: Lifestyle Management / Health Intelligence Dashboard] Grid system highlighting sleep, hydration, nutrition, stress management, and exercise for migraine prevention.</p>
  </div>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">12. When to Seek Medical Attention</span></h2>
  <p class="mb-4">
    Although migraines are chronic and disabling, they are generally benign. However, sudden changes in headache patterns or the presence of specific symptoms can indicate a secondary headache caused by an underlying medical emergency, such as a stroke, aneurysm, meningitis, or intracranial pressure changes. Clinicians use the **SNOOP criteria** to identify these warning signs.
  </p>
  <p class="mb-4">
    Patients should seek immediate emergency medical evaluation if they experience any of the following warning signs:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Systemic Symptoms:</strong> Unexplained fever, weight loss, night sweats, or a history of cancer.</li>
    <li><strong>Neurological Deficits:</strong> Persistent weakness, numbness on one side of the body, double vision, slurred speech, confusion, or difficulty walking.</li>
    <li><strong>Onset Sudden:</strong> A "thunderclap" headache that reaches maximum intensity within seconds or minutes.</li>
    <li><strong>Older Age:</strong> A new type of headache developing for the first time in a patient over 50 years of age.</li>
    <li><strong>Pattern Change:</strong> A headache that is steadily worsening over weeks, changes with body position, or is triggered by coughing or straining.</li>
  </ul>
  
  <p class="text-xs text-slate-500 italic mt-6 border-t border-slate-200 pt-4">
    <strong>Medical Disclaimer:</strong> This article is intended for educational purposes only and should not replace professional medical advice. Individuals experiencing sudden severe headaches, new neurological symptoms, vision changes, head injury, fever-associated headaches, or other concerning symptoms should seek prompt medical evaluation.
  </p>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">13. The Future of Migraine Care</span></h2>
  <p class="mb-4">
    The landscape of migraine management is evolving rapidly, moving from reactive symptom suppression to proactive health management. This shift is driven by the integration of digital health tools, clinical wearables, and personalized medicine:
  </p>
  <ul class="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-700 font-semibold">
    <li><strong>Digital Health Tracking:</strong> Mobile health platforms allow patients to log their daily habits, track symptoms in real time, and share detailed reports with their clinical providers, improving diagnostic accuracy.</li>
    <li><strong>Clinical Wearables:</strong> Wearable sensors track physiological markers, including sleep quality, activity levels, heart rate, and Heart Rate Variability (HRV). Monitoring HRV helps evaluate autonomic balance and track recovery over time.</li>
    <li><strong>AI-Assisted Trigger Analysis:</strong> Machine learning algorithms can analyze a patient's sleep, nutrition, activity, and weather data to identify hidden trigger patterns and warn patients before they cross their migraine threshold.</li>
    <li><strong>Personalized Medicine:</strong> Moving away from one-size-fits-all treatments to focus on the individual's unique physical, metabolic, and emotional characteristics.</li>
  </ul>
  <p class="mb-4">
    At <strong>Homeo Healthcare</strong>, we are committed to this future. By combining scientific clinical care with personalized health tracking, we seek to help patients understand their unique trigger patterns, support their body's self-regulatory mechanisms, and navigate a clear path to long-term well-being.
  </p>

  <h2 class="text-xl md:text-2xl font-serif font-bold mt-8 mb-4"><span class="animated-heading">14. Conclusion</span></h2>
  <p class="mb-4">
    Living with chronic migraines can feel overwhelming and isolating. However, by understanding the underlying neurological pathways and identifying your personal trigger thresholds, you can take control of your health. The goal of effective care is not simply to suppress symptoms, but to understand your body's patterns, identify triggers, and build a strong foundation for long-term health intelligence.
  </p>
  <p class="mb-4">
    At Homeo Healthcare, we are here to support you at every stage of your journey. If you or a loved one is struggling with recurrent migraines, we invite you to take the first step toward recovery by scheduling a comprehensive evaluation.
  </p>
  
  <div class="not-prose my-8 p-6 rounded-3xl border border-[#0d9488]/20 bg-[#0d9488]/5 backdrop-blur-md max-w-2xl mx-auto text-center space-y-4">
    <h3 class="font-serif text-lg font-bold text-[#0f766e]">Start Your Personalized Migraine Recovery Plan</h3>
    <p class="text-xs text-slate-700 font-semibold leading-relaxed">
      Schedule a comprehensive evaluation or online video consultation with Dr. Narayan Jethwani MD (Hom.). We will review your clinical history, map your trigger thresholds, and design a personalized, evidence-based homeopathic treatment plan.
    </p>
    <div class="flex flex-col sm:flex-row justify-center gap-4 pt-2">
      <a href="https://wa.me/918446056789" style="background-color: #25D366 !important; color: #ffffff !important; display: inline-block;" class="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-md transition-all hover:opacity-90">
        WhatsApp: +91 84460 56789
      </a>
      <a href="https://homeo.healthcare" style="border: 1px solid #0d9488 !important; background-color: #ffffff !important; color: #0d9488 !important; display: inline-block;" class="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-sm transition-all hover:bg-slate-50">
        Visit homeo.healthcare
      </a>
    </div>
  </div>

  <div class="mt-12 border-t border-slate-200 pt-8 text-xs text-slate-600 space-y-4">
    <h4 class="font-bold text-sm text-slate-800 uppercase tracking-wider">About the Author</h4>
    <p class="font-bold text-slate-700 text-sm">Dr. Narayan Jethwani MD (Hom.)<br/><span class="text-xs font-normal text-slate-500">Founder Director, Homeo Healthcare</span></p>
    <p class="leading-relaxed">
      Homeo Healthcare is dedicated to transforming healthcare through Health Intelligence, personalized assessment, evidence-informed homeopathic care, and patient education.
    </p>
    <p>
      Explore more evidence-based health resources at:<br/>
      <a href="https://homeo.healthcare" class="text-[#0d9488] hover:underline font-bold">https://homeo.healthcare</a>
    </p>
  </div>
</div>`,
    glowColor: "rgba(168,85,247,0.15)",
    image: "/images/migraine_article_hero.png"
  },
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


// Dynamic Category Gradients for animated text and visual styles
const categoryGradients: Record<string, string> = {
  "Skin & Digestive": "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #14b8a6 100%)",
  "Respiratory & Lungs": "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0ea5e9 100%)",
  "Hormones & Diabetes": "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #8b5cf6 100%)",
  "Heart & Lipids": "linear-gradient(135deg, #e11d48 0%, #be123c 50%, #f43f5e 100%)",
  "Joints & Neuro": "linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #6366f1 100%)",
  "Kidney & Urology": "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0ea5e9 100%)",
  "Immunity & Infections": "linear-gradient(135deg, #059669 0%, #047857 50%, #10b981 100%)",
  "Lifestyle & Wellness": "linear-gradient(135deg, #d97706 0%, #b45309 50%, #f59e0b 100%)",
  "Cancer Care": "linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #6366f1 100%)",
  "Children's Health": "linear-gradient(135deg, #d97706 0%, #b45309 50%, #f59e0b 100%)",
  "Homeopathy": "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #14b8a6 100%)",
  "Healthcare": "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0ea5e9 100%)",
  "Skin": "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #14b8a6 100%)",
  "Lungs": "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0ea5e9 100%)",
  "Gut & Hormones": "linear-gradient(135deg, #059669 0%, #047857 50%, #10b981 100%)",
  "Research": "linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #6366f1 100%)"
};

const getCategoryClass = (category: string) => {
  const map: Record<string, string> = {
    "Skin & Digestive": "category-skin-digestive",
    "Respiratory & Lungs": "category-respiratory-lungs",
    "Hormones & Diabetes": "category-hormones-diabetes",
    "Heart & Lipids": "category-heart-lipids",
    "Joints & Neuro": "category-joints-neuro",
    "Kidney & Urology": "category-kidney-urology",
    "Immunity & Infections": "category-immunity-infections",
    "Lifestyle & Wellness": "category-lifestyle-wellness",
    "Cancer Care": "category-cancer-care",
    "Children's Health": "category-childrens-health",
    "Homeopathy": "category-homeopathy",
    "Healthcare": "category-healthcare",
    "Skin": "category-skin-digestive",
    "Lungs": "category-respiratory-lungs",
    "Gut & Hormones": "category-skin-digestive",
    "Research": "category-research"
  };
  return map[category] || "category-healthcare";
};
const WhatsAppLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 2.5-5.778 5.776-5.778 1.57 0 2.92.117 3.314.169v3.842l-2.274.001c-1.982 0-2.365.942-2.365 2.324v1.022h4.257l-.556 3.667h-3.701v7.98h-3.701z" />
  </svg>
);

const InstagramLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function BlogsClient({ initialArticles }: { initialArticles: Article[] }) {
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
  const [copied, setCopied] = useState(false);
  const [baseDomain, setBaseDomain] = useState("https://homeo.healthcare");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const domain = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? window.location.origin
        : "https://homeo.healthcare";
      setBaseDomain(domain);
    }
  }, []);

  const handleShareLink = useCallback(() => {
    if (!selectedArticle) return;
    const shareUrl = `${baseDomain}/blogs?article=${selectedArticle.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [selectedArticle, baseDomain]);

  const handleInstagramShare = useCallback(() => {
    if (!selectedArticle) return;
    const shareUrl = `${baseDomain}/blogs?article=${selectedArticle.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.open("https://www.instagram.com/drnarayanjethwani/", "_blank", "noopener,noreferrer");
    });
  }, [selectedArticle, baseDomain]);
  
  // Reading mode state
  const [isFullPage, setIsFullPage] = useState(false);
  const [isSepia, setIsSepia] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("sm");
  const [showReadingToolbar, setShowReadingToolbar] = useState(false);

  const [liveArticles] = useState<Article[]>(() => {
    const customArticles = localStaticArticles.filter(art => art.id === "migraine-uiux");
    const customTitles = customArticles.map(art => art.title.toLowerCase());
    const others = (initialArticles.length > 0 ? initialArticles : localStaticArticles).filter(
      art => art.id !== "migraine-uiux" && !customTitles.includes(art.title.toLowerCase())
    );
    return [...customArticles, ...others];
  });
  const [loading, setLoading] = useState(false);

  // Per-card cursor tracking
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [cursorMap, setCursorMap] = useState<Record<string, { x: number; y: number }>>({});
  const isUrlReadRef = useRef(false);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const el = cardRefs.current.get(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCursorMap(prev => ({ ...prev, [id]: { x: e.clientX - rect.left, y: e.clientY - rect.top } }));
  }, []);

  const handleCardMouseLeave = useCallback((id: string) => {
    setCursorMap(prev => { const next = { ...prev }; delete next[id]; return next; });
  }, []);

  // Dynamic unique hover palette — each article gets its own vibrant glow color
  const dynamicHoverPalettes: Record<string, { glow: string; ring: string; text: string }> = {
    "Skin": { glow: "rgba(20,184,166,0.25)", ring: "#14b8a6", text: "#0d9488" },
    "Lungs": { glow: "rgba(14,165,233,0.25)", ring: "#38bdf8", text: "#0284c7" },
    "Children's Health": { glow: "rgba(245,158,11,0.25)", ring: "#fbbf24", text: "#d97706" },
    "Gut & Hormones": { glow: "rgba(168,85,247,0.25)", ring: "#c084fc", text: "#9333ea" },
    "Joints & Neuro": { glow: "rgba(99,102,241,0.25)", ring: "#818cf8", text: "#4f46e5" },
    "Research": { glow: "rgba(79,70,229,0.22)", ring: "#6366f1", text: "#3730a3" },
    "Homeopathy": { glow: "rgba(20,184,166,0.22)", ring: "#2dd4bf", text: "#0f766e" },
    "Healthcare": { glow: "rgba(6,182,212,0.22)", ring: "#22d3ee", text: "#0e7490" },
    "Heart Care": { glow: "rgba(244,63,94,0.22)", ring: "#fb7185", text: "#e11d48" },
    "Cancer Care": { glow: "rgba(79,70,229,0.22)", ring: "#a5b4fc", text: "#4338ca" },
    "Skin & Digestive": { glow: "rgba(20,184,166,0.22)", ring: "#14b8a6", text: "#0d9488" },
    "Respiratory & Lungs": { glow: "rgba(14,165,233,0.22)", ring: "#38bdf8", text: "#0369a1" },
    "Hormones & Diabetes": { glow: "rgba(168,85,247,0.22)", ring: "#d946ef", text: "#7c3aed" },
    "Heart & Lipids": { glow: "rgba(244,63,94,0.22)", ring: "#f43f5e", text: "#be123c" },
    "Kidney & Urology": { glow: "rgba(14,165,233,0.22)", ring: "#7dd3fc", text: "#0284c7" },
    "Immunity & Infections": { glow: "rgba(16,185,129,0.22)", ring: "#34d399", text: "#059669" },
    "Lifestyle & Wellness": { glow: "rgba(245,158,11,0.22)", ring: "#fcd34d", text: "#b45309" },
  };
  const getPalette = (cat: string) => dynamicHoverPalettes[cat] ?? { glow: "rgba(20,184,166,0.20)", ring: "#14b8a6", text: "#0d9488" };

  // Reset reading mode when article changes
  useEffect(() => {
    if (!selectedArticle) {
      setIsFullPage(false);
      setIsSepia(false);
      setFontSize("sm");
      setShowReadingToolbar(false);
    }
  }, [selectedArticle]);

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

  // Read URL query parameter on mount/load to auto-select article
  useEffect(() => {
    if (typeof window !== "undefined" && liveArticles.length > 0 && !isUrlReadRef.current) {
      isUrlReadRef.current = true;
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get("article");
      if (articleId) {
        const matched = liveArticles.find(
          art => art.id === articleId || art.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === articleId
        );
        if (matched) {
          setSelectedArticle(matched);
        }
      }
    }
  }, [liveArticles]);

  // Sync selected article to URL query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Avoid deleting query param before the initial read has completed
      if (!isUrlReadRef.current) return;

      const params = new URLSearchParams(window.location.search);
      if (selectedArticle) {
        if (params.get("article") !== selectedArticle.id) {
          params.set("article", selectedArticle.id);
          const newPath = window.location.pathname + "?" + params.toString();
          window.history.replaceState(null, "", newPath);
        }
      } else {
        if (params.has("article")) {
          params.delete("article");
          const newPath = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
          window.history.replaceState(null, "", newPath);
        }
      }
    }
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
  
  const activeTabs = categoriesList.filter(
    cat => cat === "All" || liveArticles.some(art => art.category === cat)
  );

  const handleBookConsultation = () => {
    router.push("/#booking");
  };

  return (
    <div className="pt-32 pb-24 px-6 relative">\n      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: textShimmer 5s ease infinite;
        }
        .card-title {
          transition: all 0.3s ease;
          background-size: 200% auto;
        }
        .group:hover .card-title {
          animation: textShimmer 4s linear infinite;
        }
        /* Category specific title hover states */
        .category-skin-digestive:hover .card-title { background: linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #14b8a6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-respiratory-lungs:hover .card-title { background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0ea5e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-hormones-diabetes:hover .card-title { background: linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #e879f9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-heart-lipids:hover .card-title { background: linear-gradient(135deg, #e11d48 0%, #be123c 50%, #f43f5e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-joints-neuro:hover .card-title { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-kidney-urology:hover .card-title { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-immunity-infections:hover .card-title { background: linear-gradient(135deg, #10b981 0%, #059669 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-lifestyle-wellness:hover .card-title { background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-cancer-care:hover .card-title { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-childrens-health:hover .card-title { background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-homeopathy:hover .card-title { background: linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #14b8a6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-healthcare:hover .card-title { background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0ea5e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .category-research:hover .card-title { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      ` }} />
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
              filteredArticles.map((art, artIdx) => {
                const palette = getPalette(art.category);
                const cursor = cursorMap[art.id];
                const isHovered = !!cursor;
                return (
                <motion.div
                  key={art.id}
                  ref={(el) => { if (el) cardRefs.current.set(art.id, el); else cardRefs.current.delete(art.id); }}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: artIdx * 0.04 }}
                  className={`glass-panel border-white/60 bg-white/40 rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden cursor-pointer ${getCategoryClass(art.category)}`}
                  style={{
                    transition: "box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: isHovered
                      ? `0 8px 40px -8px ${palette.glow}, 0 0 0 1.5px ${palette.ring}33`
                      : "0 4px 24px rgba(0,0,0,0.01)",
                    transform: isHovered ? "translateY(-4px) scale(1.008)" : "translateY(0) scale(1)",
                    borderColor: isHovered ? `${palette.ring}55` : "rgba(255,255,255,0.6)",
                  }}
                  onClick={() => setSelectedArticle(art)}
                  onMouseMove={(e) => handleCardMouseMove(e, art.id)}
                  onMouseLeave={() => handleCardMouseLeave(art.id)}
                >
                  {/* Dynamic cursor-tracking spotlight */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: cursor
                        ? `radial-gradient(320px circle at ${cursor.x}px ${cursor.y}px, ${palette.glow} 0%, transparent 70%)`
                        : "none",
                    }}
                  />
                  {/* Soft edge shimmer ring on hover */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: `linear-gradient(135deg, ${palette.ring}18 0%, transparent 60%, ${palette.ring}10 100%)`,
                    }}
                  />
                  {/* "NEW" badge for first article */}
                  {artIdx === 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${palette.ring}, ${palette.text})` }}>
                        <Sparkles className="w-2.5 h-2.5" /> New
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Article Banner Image */}
                    <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden relative border border-slate-900/5 bg-slate-100">
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                        style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Article Metadata */}
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: isHovered ? palette.text : "#475569" }}>
                      <span style={{ color: isHovered ? palette.ring : undefined, transition: "color 0.3s" }}>{art.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {art.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {art.readTime}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold leading-snug card-title"
                      style={{
                        color: isHovered ? palette.text : "#1A2421",
                        transition: "color 0.3s",
                      }}>
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
                    <div className="flex items-center gap-1 transition-all duration-300"
                      style={{
                        color: isHovered ? palette.ring : "#0d9488",
                        transform: isHovered ? "translateX(6px)" : "translateX(0)",
                      }}>
                      Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </motion.div>
                );
              })
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
              className={`fixed right-0 top-0 bottom-0 border-l border-white/50 z-[51] shadow-2xl flex flex-col pointer-events-auto overflow-hidden transition-all duration-500 ${
                isFullPage ? "w-full" : "w-full sm:w-[640px]"
              } ${
                isSepia ? "bg-[#f5eed6]/98" : "bg-[#FAF9F6]/97"
              }`}
              style={{ backdropFilter: "blur(16px)" }}
            >
              {/* Reading Mode Toolbar */}
              <div className={`border-b transition-all duration-300 ${
                isSepia ? "border-amber-200/40 bg-amber-50/80" : "border-slate-900/5 bg-white/70"
              } backdrop-blur-sm`}>
                {/* Main Header Row */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-2xl border shadow-sm ${
                      isSepia ? "bg-amber-100 border-amber-200 text-amber-700" : "bg-white border-slate-100 text-mint"
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        isSepia ? "text-amber-600" : "text-mint"
                      }`}>Scientific Essay</span>
                      <h3 className={`text-sm font-bold leading-none ${
                        isSepia ? "text-amber-900" : "text-slate-800"
                      }`}>{selectedArticle.category}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Share Link Button */}
                    <button
                      onClick={handleShareLink}
                      title="Copy share link"
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        copied
                          ? isSepia ? "bg-amber-200 border-amber-300 text-amber-800" : "bg-mint/10 border-mint/40 text-mint"
                          : isSepia ? "border-amber-200 text-amber-600 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-mint" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Share on WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Check out this article: "${selectedArticle.title}"\n\nRead here: ${baseDomain}/blogs?article=${selectedArticle.id}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on WhatsApp"
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isSepia ? "border-amber-200 text-amber-600 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <WhatsAppLogo className="w-3.5 h-3.5 text-emerald-500 hover:scale-110 transition-transform" />
                    </a>

                    {/* Share on Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `${baseDomain}/blogs?article=${selectedArticle.id}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on Facebook"
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isSepia ? "border-amber-200 text-amber-600 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <FacebookLogo className="w-3.5 h-3.5 text-[#1877F2] hover:scale-110 transition-transform" />
                    </a>

                    {/* Facebook Profile Link */}
                    <a
                      href="https://www.facebook.com/narayan.jethwani/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Dr. Narayan Jethwani on Facebook"
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isSepia ? "border-amber-200 text-amber-600 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <FacebookLogo className="w-3.5 h-3.5 text-slate-400 hover:text-[#1877F2] transition-colors hover:scale-110 transition-transform" />
                    </a>

                    {/* Instagram Profile & Copy Share Link */}
                    <button
                      onClick={handleInstagramShare}
                      title="Copy link and open Instagram"
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isSepia ? "border-amber-200 text-amber-600 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <InstagramLogo className="w-3.5 h-3.5 text-pink-500 hover:scale-110 transition-transform" />
                    </button>

                    {/* Toggle reading toolbar */}
                    <button
                      onClick={() => setShowReadingToolbar(v => !v)}
                      title="Reading options"
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        showReadingToolbar
                          ? isSepia ? "bg-amber-200 border-amber-300 text-amber-800" : "bg-mint/10 border-mint/40 text-mint"
                          : isSepia ? "border-amber-200 text-amber-600 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    {/* Close */}
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                        isSepia ? "border-amber-200 text-amber-600 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:border-slate-800 hover:text-slate-800"
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expandable reading controls */}
                <AnimatePresence>
                  {showReadingToolbar && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={`px-5 pb-4 flex flex-wrap items-center gap-3 border-t ${
                        isSepia ? "border-amber-200/50" : "border-slate-100"
                      }`}>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          isSepia ? "text-amber-600" : "text-slate-400"
                        }`}>Reading Mode</span>

                        {/* Sepia Toggle */}
                        <button
                          onClick={() => setIsSepia(v => !v)}
                          title={isSepia ? "Switch to Default" : "Sepia Mode"}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-200 cursor-pointer ${
                            isSepia
                              ? "bg-amber-400 border-amber-400 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600"
                          }`}
                        >
                          <Sun className="w-3 h-3" />
                          Sepia
                        </button>

                        {/* Full Page Toggle */}
                        <button
                          onClick={() => setIsFullPage(v => !v)}
                          title={isFullPage ? "Panel Mode" : "Full Page Mode"}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-200 cursor-pointer ${
                            isFullPage
                              ? isSepia ? "bg-amber-500 border-amber-500 text-white" : "bg-mint border-mint text-white shadow-sm"
                              : isSepia ? "bg-white border-amber-200 text-amber-700 hover:border-amber-400" : "bg-white border-slate-200 text-slate-600 hover:border-mint hover:text-mint"
                          }`}
                        >
                          {isFullPage ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                          {isFullPage ? "Panel" : "Full Page"}
                        </button>

                        {/* Font Size Controls */}
                        <div className={`flex items-center gap-0.5 rounded-full border overflow-hidden ${
                          isSepia ? "border-amber-200" : "border-slate-200"
                        }`}>
                          <button
                            onClick={() => setFontSize("sm")}
                            title="Small text"
                            className={`px-2.5 py-1.5 text-[9px] font-black border-r transition-colors cursor-pointer ${
                              fontSize === "sm"
                                ? isSepia ? "bg-amber-400 text-white" : "bg-mint text-white"
                                : isSepia ? "text-amber-600 hover:bg-amber-100 border-amber-200" : "text-slate-500 hover:bg-slate-50 border-slate-200"
                            }`}
                          ><Type className="w-3 h-3" /></button>
                          <button
                            onClick={() => setFontSize("base")}
                            title="Medium text"
                            className={`px-2.5 py-1.5 text-[10px] font-black border-r transition-colors cursor-pointer ${
                              fontSize === "base"
                                ? isSepia ? "bg-amber-400 text-white" : "bg-mint text-white"
                                : isSepia ? "text-amber-600 hover:bg-amber-100 border-amber-200" : "text-slate-500 hover:bg-slate-50 border-slate-200"
                            }`}
                          >A</button>
                          <button
                            onClick={() => setFontSize("lg")}
                            title="Large text"
                            className={`px-2.5 py-1.5 text-[11px] font-black transition-colors cursor-pointer ${
                              fontSize === "lg"
                                ? isSepia ? "bg-amber-400 text-white" : "bg-mint text-white"
                                : isSepia ? "text-amber-600 hover:bg-amber-100" : "text-slate-500 hover:bg-slate-50"
                            }`}
                          >A+</button>
                        </div>

                        <span className={`text-[9px] font-semibold ml-auto ${
                          isSepia ? "text-amber-500" : "text-slate-400"
                        }`}>{isFullPage ? "Full Page" : "Panel"} · {isSepia ? "Sepia" : "Default"} · {fontSize === "sm" ? "Small" : fontSize === "base" ? "Medium" : "Large"} Text</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Drawer Scrollable Content */}
              <div 
                data-lenis-prevent
                className={`flex-1 overflow-y-auto select-text transition-colors duration-500 ${
                  isSepia ? "bg-[#f5eed6]/60" : ""
                }`}
              >
                <div className={`${
                  isFullPage ? "max-w-3xl mx-auto px-8 py-10" : "p-6 md:p-8"
                } space-y-6`}>
                  {/* Large Banner Image */}
                  <div className="w-full aspect-video rounded-2xl overflow-hidden relative border border-slate-900/5 bg-slate-100 mb-6">
                    <img 
                      src={selectedArticle.image} 
                      alt={selectedArticle.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                  </div>

                  <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider ${
                    isSepia ? "text-amber-700" : "text-slate-700"
                  }`}>
                    <span className="flex items-center gap-1"><Calendar className={`w-3.5 h-3.5 ${ isSepia ? "text-amber-500" : "text-slate-500"}`} /> {selectedArticle.date}</span>
                    <span className={`w-1 h-1 rounded-full ${ isSepia ? "bg-amber-400" : "bg-slate-400" }`} />
                    <span className="flex items-center gap-1"><Clock className={`w-3.5 h-3.5 ${ isSepia ? "text-amber-500" : "text-slate-500"}`} /> {selectedArticle.readTime}</span>
                  </div>

                  <h1 className={`font-serif font-semibold tracking-tight leading-tight ${
                    isSepia ? "text-amber-950" : "text-[#1A2421]"
                  } ${
                    fontSize === "lg" ? "text-3xl md:text-4xl" : fontSize === "base" ? "text-2xl md:text-3xl" : "text-2xl md:text-3xl"
                  }`}>
                    {selectedArticle.title}
                  </h1>

                  <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-2xl w-fit ${
                    isSepia ? "bg-amber-200/50 text-amber-900" : "bg-slate-900/5 text-slate-900"
                  }`}>
                    <User className={`w-4 h-4 ${ isSepia ? "text-amber-600" : "text-slate-500" }`} />
                    <span>Written by {selectedArticle.author} · MD (Hom.)</span>
                  </div>

                  <hr className={isSepia ? "border-amber-200" : "border-slate-100"} />

                  {/* Article body content */}
                  <div className={`space-y-6 font-semibold leading-relaxed wp-content ${
                    isSepia ? "text-amber-900" : "text-slate-700"
                  } ${
                    fontSize === "lg" ? "text-base" : fontSize === "base" ? "text-sm" : "text-sm"
                  }`}>
                    {typeof selectedArticle.content === "string" ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                    ) : (
                      selectedArticle.content.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className={`p-5 md:p-6 backdrop-blur-sm border-t flex flex-col items-center ${
                isSepia ? "bg-amber-50/80 border-amber-200/50" : "bg-white/70 border-slate-900/5"
              }`}>
                <div className="w-full max-w-md mx-auto text-center space-y-3">
                  <h4 className={`text-sm font-bold ${ isSepia ? "text-amber-950" : "text-[#1A2421]" }`}>Interested in constitutional treatment?</h4>
                  <p className={`text-xs font-semibold ${ isSepia ? "text-amber-700" : "text-slate-700" }`}>
                    Schedule a clinical or telehealth video call setup directly with Dr. Jethwani.
                  </p>
                  <Magnetic>
                    <button
                      onClick={handleBookConsultation}
                      className="w-full py-3.5 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
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
