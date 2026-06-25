/* -------------------------------------------------------------
   Lucy — AI Doctor Assistant — Logic Controller
   Homeo Healthcare — Evidence-Based Homeopathy
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Detect embed or chat-only mode
    const urlParams = new URLSearchParams(window.location.search);
    const isEmbed = urlParams.get('embed') === 'true' || urlParams.get('chat-only') === 'true';
    if (isEmbed) {
        document.body.classList.add('embed-mode');
    }

    const initialTab = urlParams.get('tab');
    if (initialTab) {
        setTimeout(() => {
            const tabBtn = document.querySelector(`[data-tab="${initialTab}"]`);
            if (tabBtn) tabBtn.click();
        }, 350);
    } else if (isEmbed) {
        // Embed mode defaults to showing chat companion only
        document.body.classList.add('show-chat-only');
        setTimeout(() => {
            const chatBtn = document.querySelector('[data-tab="chat"]');
            if (chatBtn) {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                chatBtn.classList.add('active');
            }
        }, 100);
    }

    // Listen to parent events to switch tabs programmatically
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'open-tab') {
            const tabName = event.data.tab;
            const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
            if (tabBtn) tabBtn.click();
        }
    });

    // ---------------------------------------------------------
    // App State Management
    // ---------------------------------------------------------
    let state = {
        userName: "Guest Patient",
        lang: "en",
        vitalityScore: 100,
        chronologicalAge: 35,
        biologicalAge: 35,
        ttsEnabled: true,
        activeAssessment: null,
        assessQuestionIndex: 0,
        assessAnswers: [],
        wellnessCompletedChecks: {},
        activeWellnessDay: 1,
        dailyLogs: {
            sleep: 7,
            water: 6,
            exercise: 30,
            stress: 4,
            weight: 70
        },
        assessmentsCompleted: {
            vitality: null,
            stress: null,
            sleep: null,
            digestive: null,
            metabolic: null,
            womens: null,
            mens: null
        }
    };

    // Helper to generate WhatsApp URL with assessment details
    function getWhatsAppLink(basePurpose = "book a consultation") {
        let waMsg = `Hi Dr. Narayan Jethwani,\n\nI have completed my health assessments on the Homeo Healthcare portal. Here is my current status:\n`;
        
        const PATH = [
            { id: 'vitality', title: 'Vitality Profile' },
            { id: 'stress', title: 'Stress & Nervous System' },
            { id: 'sleep', title: 'Sleep & Recovery' },
            { id: 'digestive', title: 'Digestive & Gut Health' },
            { id: 'metabolic', title: 'Metabolic & Energy' },
            { id: 'womens', title: 'Women\'s Endocrine' },
            { id: 'mens', title: 'Men\'s Stamina' }
        ];
        
        let completedCount = 0;
        let scoresText = "";
        PATH.forEach(item => {
            const score = state.assessmentsCompleted[item.id];
            if (score !== null && score !== undefined) {
                scoresText += `- ${item.title}: ${score}/100\n`;
                completedCount++;
            }
        });
        
        if (completedCount > 0) {
            waMsg += scoresText;
            waMsg += `\nOverall Health Twin Vitality Score: ${state.vitalityScore}/100\n\n`;
            waMsg += `I would like to ${basePurpose} to discuss these results.`;
        } else {
            waMsg = `Hi Dr. Narayan Jethwani,\n\nI'd like to ${basePurpose} from Homeo Healthcare.`;
        }
        
        return `https://wa.me/919000000000?text=${encodeURIComponent(waMsg)}`;
    }

    // Load State from LocalStorage
    function loadState() {
        // Sync from parent digital twin state
        const parentTwinStr = localStorage.getItem('homeo_health_digital_twin_2026_v2');
        let hasParentTwin = false;
        let parentOverallScore = 100;
        let parentHasAssessments = false;
        
        if (parentTwinStr) {
            try {
                const parentTwin = JSON.parse(parentTwinStr);
                if (parentTwin && typeof parentTwin === 'object') {
                    hasParentTwin = true;
                    parentOverallScore = parentTwin.overallScore ?? 100;
                    const completedKeys = Object.keys(parentTwin.completedAssessments || {});
                    const hasHistory = (parentTwin.history && parentTwin.history.length > 0);
                    if (completedKeys.length > 0 || hasHistory) {
                        parentHasAssessments = true;
                    }
                }
            } catch (e) {
                console.error("Failed to parse parent twin state:", e);
            }
        }

        const saved = localStorage.getItem('lucy_health_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
                // Sync select boxes and indicators
                document.getElementById('lang-select').value = state.lang;
                document.getElementById('track-sleep').value = state.dailyLogs.sleep;
                document.getElementById('water-count').innerText = state.dailyLogs.water;
                document.getElementById('track-exercise').value = state.dailyLogs.exercise;
                document.getElementById('track-stress').value = state.dailyLogs.stress;
                document.getElementById('stress-val').innerText = `${state.dailyLogs.stress}/10`;
                document.getElementById('track-weight').value = state.dailyLogs.weight;
            } catch (e) {
                console.error("Failed to load local state:", e);
            }
        }

        if (hasParentTwin) {
            state.vitalityScore = parentOverallScore;
            state.hasAssessments = parentHasAssessments;
        } else {
            let lucyAssessCount = 0;
            for (const [key, val] of Object.entries(state.assessmentsCompleted)) {
                if (val !== null) {
                    lucyAssessCount++;
                }
            }
            state.hasAssessments = (lucyAssessCount > 0);
        }

        recalculateHealthMetrics();
    }

    // Save State to LocalStorage
    function saveState() {
        localStorage.setItem('lucy_health_state', JSON.stringify(state));

        // Bidirectional sync: write back to parent's digital twin state key in localStorage
        try {
            const parentTwinStr = localStorage.getItem('homeo_health_digital_twin_2026_v2');
            let parentTwin = {};
            if (parentTwinStr) {
                parentTwin = JSON.parse(parentTwinStr) || {};
            }

            parentTwin.completedAssessments = parentTwin.completedAssessments || {};
            parentTwin.history = parentTwin.history || [];

            const mapping = {
                vitality: 'metabolic_profile',
                stress: 'anxiety_assessment',
                sleep: 'sleep_apnea',
                digestive: 'ibs_assessment',
                metabolic: 'insulin_resistance',
                womens: 'pcos_assessment'
            };

            let updatedAny = false;
            for (const [lucyKey, val] of Object.entries(state.assessmentsCompleted)) {
                if (val !== null && val !== undefined) {
                    const parentId = mapping[lucyKey];
                    if (parentId) {
                        const existing = parentTwin.completedAssessments[parentId];
                        if (!existing || existing.score !== val) {
                            parentTwin.completedAssessments[parentId] = {
                                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                                score: val,
                                answers: {},
                                symptoms: []
                            };
                            updatedAny = true;
                        }
                    }
                }
            }

            if (state.vitalityScore !== parentTwin.overallScore || state.biologicalAge !== parentTwin.biologicalAge) {
                parentTwin.overallScore = state.vitalityScore;
                parentTwin.biologicalAge = state.biologicalAge;
                updatedAny = true;
            }

            if (updatedAny) {
                localStorage.setItem('homeo_health_digital_twin_2026_v2', JSON.stringify(parentTwin));
            }
        } catch (e) {
            console.error("Failed to sync state to parent digital twin:", e);
        }

        // Trigger real-time postMessage event to parent page
        try {
            window.parent.postMessage({
                type: 'sync-digital-twin',
                vitalityScore: state.vitalityScore,
                biologicalAge: state.biologicalAge,
                assessments: state.assessmentsCompleted
            }, '*');
        } catch (e) {
            // Ignore if parent window is inaccessible
        }
    }

    function cancelSpeaking() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            avatarRing.classList.remove('speaking');
        }
    }

    // Recalculate Vitality and Biological Age
    function recalculateHealthMetrics() {
        let baseVitality = 65;

        // Sleep contribution
        const sleep = parseFloat(state.dailyLogs.sleep);
        if (sleep >= 7 && sleep <= 9) baseVitality += 10;
        else if (sleep === 6 || sleep === 10) baseVitality += 5;
        else baseVitality -= 5;

        // Water contribution
        const water = parseInt(state.dailyLogs.water);
        if (water >= 8) baseVitality += 10;
        else if (water >= 6) baseVitality += 5;
        else baseVitality -= 10;

        // Exercise contribution
        const exercise = parseInt(state.dailyLogs.exercise);
        if (exercise >= 30) baseVitality += 10;
        else if (exercise > 0) baseVitality += 5;
        else baseVitality -= 5;

        // Stress contribution (negative impact)
        const stress = parseInt(state.dailyLogs.stress);
        if (stress >= 8) baseVitality -= 15;
        else if (stress >= 6) baseVitality -= 8;
        else if (stress <= 3) baseVitality += 5;

        // Assessment overrides/contribution (average of completed assessments if any)
        let assessSum = 0;
        let assessCount = 0;
        for (const [key, val] of Object.entries(state.assessmentsCompleted)) {
            if (val !== null) {
                assessSum += val;
                assessCount++;
            }
        }
        if (assessCount > 0) {
            const assessAvg = assessSum / assessCount;
            // Balance vitality with assessment history
            baseVitality = Math.round((baseVitality + assessAvg) / 2);
        }

        // Wellness checklist contribution (gamified reward: +1 vitality point per task, max 10 points)
        let checksCount = 0;
        if (state.wellnessCompletedChecks) {
            for (const [key, val] of Object.entries(state.wellnessCompletedChecks)) {
                if (val === true) checksCount++;
            }
        }
        baseVitality += Math.min(10, checksCount);

        // Clamp Vitality Score 10 - 100
        state.vitalityScore = Math.max(10, Math.min(100, baseVitality));

        // Sync and update hasAssessments flag dynamically
        let lucyAssessCount = 0;
        for (const [key, val] of Object.entries(state.assessmentsCompleted)) {
            if (val !== null) lucyAssessCount++;
        }
        state.hasAssessments = (lucyAssessCount > 0) || !!state.hasAssessments;

        // Biological Age calculation: Higher vitality makes cells younger!
        const diff = (state.vitalityScore - 70) * 0.15;
        state.biologicalAge = Math.round((state.chronologicalAge - diff) * 10) / 10;

        // Update UI Vitals Dashboard Elements
        document.getElementById('vitality-val').innerText = state.vitalityScore;
        document.getElementById('bio-age-val').innerText = `${state.biologicalAge} yrs`;
        
        const ageDiff = Math.round((state.biologicalAge - state.chronologicalAge) * 10) / 10;
        const diffEl = document.getElementById('bio-age-diff');
        if (ageDiff < 0) {
            diffEl.innerText = `${ageDiff} yrs`;
            diffEl.className = "meta-value text-teal";
        } else if (ageDiff > 0) {
            diffEl.innerText = `+${ageDiff} yrs`;
            diffEl.className = "meta-value text-red";
        } else {
            diffEl.innerText = "Baseline";
            diffEl.className = "meta-value text-muted";
        }

        // Update Stroke dash offset of Vitality Ring
        const circumference = 264;
        const offset = circumference - (state.vitalityScore / 100) * circumference;
        document.getElementById('vitality-stroke').setAttribute('stroke-dashoffset', offset);

        // Update Goal Status Lists on Dashboard
        updateDashboardGoals();

        // Recalculate Risks and update Wellness Plan
        calculatePredictiveRisks();
        if (typeof renderWellnessPlan === 'function') {
            renderWellnessPlan(state.activeWellnessDay || 1);
        }

        // Update dashboard WhatsApp link with current scores
        const dashWaBtn = document.getElementById('dash-whatsapp-btn');
        if (dashWaBtn) {
            dashWaBtn.href = getWhatsAppLink("book a constitutional consultation");
        }
    }

    function updateDashboardGoals() {
        const waterVal = state.dailyLogs.water;
        const waterGoal = document.getElementById('goal-water');
        if (waterGoal) {
            if (waterVal >= 8) {
                waterGoal.innerHTML = `<span class="goal-icon"><i class="fa-solid fa-circle-check text-emerald"></i></span>
                    <div class="goal-details"><strong>Water Intake</strong><span>${waterVal} / 8 glasses (100% - Fully Hydrated)</span></div>`;
            } else {
                waterGoal.innerHTML = `<span class="goal-icon"><i class="fa-solid fa-circle-notch text-muted"></i></span>
                    <div class="goal-details"><strong>Water Intake</strong><span>${waterVal} / 8 glasses (${Math.round((waterVal/8)*100)}% of target)</span></div>`;
            }
        }

        const sleepVal = state.dailyLogs.sleep;
        const sleepGoal = document.getElementById('goal-sleep');
        if (sleepGoal) {
            if (sleepVal >= 7 && sleepVal <= 9) {
                sleepGoal.innerHTML = `<span class="goal-icon"><i class="fa-solid fa-circle-check text-emerald"></i></span>
                    <div class="goal-details"><strong>Sleep Target</strong><span>${sleepVal} Hours (Optimal Recovery)</span></div>`;
            } else {
                sleepGoal.innerHTML = `<span class="goal-icon"><i class="fa-solid fa-circle-exclamation text-yellow"></i></span>
                    <div class="goal-details"><strong>Sleep Target</strong><span>${sleepVal} Hours (Outside optimal range)</span></div>`;
            }
        }

        const stressVal = state.dailyLogs.stress;
        const stressGoal = document.getElementById('goal-stress');
        if (stressGoal) {
            if (stressVal <= 4) {
                stressGoal.innerHTML = `<span class="goal-icon"><i class="fa-solid fa-circle-check text-emerald"></i></span>
                    <div class="goal-details"><strong>Stress Resilience</strong><span>Level ${stressVal} (Healthy/Under Control)</span></div>`;
            } else if (stressVal <= 7) {
                stressGoal.innerHTML = `<span class="goal-icon"><i class="fa-solid fa-circle-notch text-yellow"></i></span>
                    <div class="goal-details"><strong>Stress Resilience</strong><span>Level ${stressVal} (Moderate Overload)</span></div>`;
            } else {
                stressGoal.innerHTML = `<span class="goal-icon"><i class="fa-solid fa-triangle-exclamation text-red"></i></span>
                    <div class="goal-details"><strong>Stress Resilience</strong><span>Level ${stressVal} (High Adrenal Exhaustion)</span></div>`;
            }
        }

        // Adjust Lucy's tip based on logs
        const tipEl = document.getElementById('coach-speech-text');
        if (tipEl) {
            if (waterVal < 8) {
                tipEl.innerText = `"Increasing your water intake today to 8 glasses will help clear metabolites and support your kidney vitality score."`;
            } else if (stressVal > 6) {
                tipEl.innerText = `"Your stress level is elevated. Taking a 5-minute deep breathing break (4-7-8 breathing) can quickly regulate your nervous system."`;
            } else if (sleepVal < 7) {
                tipEl.innerText = `"You got less than 7 hours of sleep. Try to wind down 30 minutes earlier tonight, keeping all screens out of the bedroom."`;
            } else {
                tipEl.innerText = `"Excellent balance! Your daily logs are within optimal ranges, helping to build constitutional health stability."`;
            }
        }
    }


    // ---------------------------------------------------------
    // Layout and Theme Controls
    // ---------------------------------------------------------
    
    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const body = document.body;
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });

    // Layout Switching
    const appMain = document.getElementById('app-main');
    const modeChips = document.querySelectorAll('.mode-chip');
    const floatingTrigger = document.getElementById('floating-bubble-trigger');
    const assistantArea = document.getElementById('assistant-area');

    modeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            modeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const mode = chip.dataset.mode;
            
            // Remove previous classes
            appMain.classList.remove('layout-fullscreen', 'layout-sidebar', 'layout-bubble');
            assistantArea.classList.remove('collapsed', 'active');
            floatingTrigger.classList.add('hidden');

            if (mode === 'fullscreen') {
                appMain.classList.add('layout-fullscreen');
            } else if (mode === 'sidebar') {
                appMain.classList.add('layout-sidebar');
                // By default display sidebar, but user can collapse
            } else if (mode === 'bubble') {
                appMain.classList.add('layout-bubble');
                floatingTrigger.classList.remove('hidden');
            }
        });
    });

    // Toggle Floating Bubble Chat Popup
    floatingTrigger.addEventListener('click', () => {
        assistantArea.classList.toggle('active');
        // Hide unread dot if clicked
        const dot = floatingTrigger.querySelector('.unread-dot');
        if (dot) dot.classList.add('hidden');
    });

    // ---------------------------------------------------------
    // Chat Font Size and Fullscreen Controls
    // ---------------------------------------------------------
    state.chatFontSize = 14; // Default starting font size (equivalent to 0.85rem ~ 14px)

    const fontDecBtn = document.getElementById('font-dec-btn');
    const fontIncBtn = document.getElementById('font-inc-btn');
    const chatFullscreenBtn = document.getElementById('chat-fullscreen-btn');

    if (fontDecBtn && fontIncBtn) {
        fontDecBtn.addEventListener('click', () => {
            if (state.chatFontSize > 12) {
                state.chatFontSize -= 2;
                document.getElementById('chat-thread-container').style.setProperty('--chat-font-size', (state.chatFontSize / 16) + 'rem');
            }
        });

        fontIncBtn.addEventListener('click', () => {
            if (state.chatFontSize < 24) {
                state.chatFontSize += 2;
                document.getElementById('chat-thread-container').style.setProperty('--chat-font-size', (state.chatFontSize / 16) + 'rem');
            }
        });
    }

    if (chatFullscreenBtn) {
        chatFullscreenBtn.addEventListener('click', () => {
            assistantArea.classList.toggle('fullscreen-chat');
            const icon = chatFullscreenBtn.querySelector('i');
            const isNowFullscreen = assistantArea.classList.contains('fullscreen-chat');
            if (isNowFullscreen) {
                icon.className = 'fa-solid fa-compress';
                chatFullscreenBtn.title = "Exit Fullscreen Mode";
            } else {
                icon.className = 'fa-solid fa-expand';
                chatFullscreenBtn.title = "Toggle Fullscreen Mode";
            }
            try {
                window.parent.postMessage({
                    type: 'toggle-fullscreen',
                    isFullscreen: isNowFullscreen
                }, '*');
            } catch (e) {
                console.error("Failed to post message to parent:", e);
            }
        });
    }

    // ---------------------------------------------------------
    // Dashboard Tabs
    // ---------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cancelSpeaking();
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            
            const tabName = btn.dataset.tab;
            
            if (tabName === 'chat') {
                document.body.classList.add('show-chat-only');
            } else {
                document.body.classList.remove('show-chat-only');
                const targetPane = document.getElementById(`tab-${tabName}`);
                if (targetPane) targetPane.classList.add('active');
            }
        });
    });

    // Show Dashboard Header Button (back to tabs from chat)
    const showDashBtn = document.getElementById('show-dash-btn');
    if (showDashBtn) {
        showDashBtn.addEventListener('click', () => {
            const overviewBtn = document.querySelector('[data-tab="overview"]');
            if (overviewBtn) overviewBtn.click();
        });
    }


    // ---------------------------------------------------------
    // Daily Logs Inputs Events
    // ---------------------------------------------------------
    const waterMinus = document.getElementById('water-minus');
    const waterPlus = document.getElementById('water-plus');
    const waterCount = document.getElementById('water-count');

    waterMinus.addEventListener('click', () => {
        let val = parseInt(waterCount.innerText);
        if (val > 0) {
            val--;
            waterCount.innerText = val;
            state.dailyLogs.water = val;
            saveState();
            recalculateHealthMetrics();
        }
    });

    waterPlus.addEventListener('click', () => {
        let val = parseInt(waterCount.innerText);
        val++;
        waterCount.innerText = val;
        state.dailyLogs.water = val;
        saveState();
        recalculateHealthMetrics();
    });

    document.getElementById('track-stress').addEventListener('input', (e) => {
        const val = e.target.value;
        document.getElementById('stress-val').innerText = `${val}/10`;
        state.dailyLogs.stress = val;
        saveState();
        recalculateHealthMetrics();
    });

    document.getElementById('track-sleep').addEventListener('change', (e) => {
        state.dailyLogs.sleep = parseFloat(e.target.value) || 0;
        saveState();
        recalculateHealthMetrics();
    });

    document.getElementById('track-exercise').addEventListener('change', (e) => {
        state.dailyLogs.exercise = parseInt(e.target.value) || 0;
        saveState();
        recalculateHealthMetrics();
    });

    document.getElementById('track-weight').addEventListener('change', (e) => {
        state.dailyLogs.weight = parseFloat(e.target.value) || 0;
        saveState();
        recalculateHealthMetrics();
    });

    document.getElementById('save-vitals-btn').addEventListener('click', () => {
        recalculateHealthMetrics();
        saveState();
        appendLucyMessage("I have saved your daily logs and updated your health metrics on the dashboard. Keep up the good work!");
    });


    // ---------------------------------------------------------
    // Language & Translation Helpers
    // ----------------------------------------------------        // ---------------------------------------------------------
    // Language & Translation Helpers
    // ---------------------------------------------------------
    const langSelect = document.getElementById('lang-select');
    langSelect.addEventListener('change', (e) => {
        state.lang = e.target.value;
        saveState();
        updateUILocalization();
        
        // Auto greet in chosen language
        let greeting = "";
        if (state.lang === 'hi') {
            greeting = "नमस्ते! मैं लूसी हूँ, आपकी एआई स्वास्थ्य मार्गदर्शिका। मैं आज आपकी क्या मदद कर सकती हूँ?";
        } else if (state.lang === 'mr') {
            greeting = "नमस्कार! मी लुसी आहे, तुमची एआय आरोग्य मार्गदर्शिका. मी आज तुम्हाला काय मदत करू शकते?";
        } else if (state.lang === 'gu') {
            greeting = "નમસ્તે! હું લ્યુસી છું, તમારી AI હેલ્થ ગાઇડ. આજે હું તમને કેવી રીતે મદદ કરી શકું?";
        } else if (state.lang === 'bn') {
            greeting = "নমস্কার! আমি লুসি, আপনার এআই হেলথ গাইড। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
        } else if (state.lang === 'te') {
            greeting = "నమస్తే! నేను లూసీ, మీ AI హెల్త్ గైడ్. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?";
        } else if (state.lang === 'ta') {
            greeting = "வணக்கம்! நான் லூசி, உங்கள் AI ஹெல்த் கைடு. இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?";
        } else if (state.lang === 'kn') {
            greeting = "ನಮಸ್ತೆ! ನಾನು ಲೂಸಿ, ನಿಮ್ಮ AI ಹೆಲ್ತ್ ಗೈಡ್. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?";
        } else {
            greeting = "Hello! I am Lucy, your AI health guide. How can I help you today?";
        }
        appendLucyMessage(greeting);
    });

    // Basic Multi-lingual response dictionary
    const TRANSLATIONS = {
        emergency: {
            en: "⚠️ CRITICAL ALERT: These symptoms may require urgent medical attention. Please contact emergency services (112 or 108) or visit the nearest hospital emergency room immediately.",
            hi: "⚠️ आपातकालीन चेतावनी: इन लक्षणों के लिए तत्काल चिकित्सा सहायता की आवश्यकता हो सकती है। कृपया तुरंत आपातकालीन सेवाओं (112 या 108) से संपर्क करें या निकटतम अस्पताल के आपातकालीन कक्ष में जाएं।",
            mr: "⚠️ तातडीची चेतावणी: या लक्षणांसाठी तात्काळ वैद्यकीय मदतीची आवश्यकता असू शकते. कृपया त्वरित आपत्कालीन सेवांशी (112 किंवा 108) संपर्क साधा किंवा जवळच्या रुग्णालयातील आपत्कालीन विभागात जा.",
            gu: "⚠️ કટોકટીની ચેતવણી: આ લક્ષણો માટે તાત્કાલિક તબીબી સારવારની જરૂર પડી શકે છે. કૃપા કરીને તાત્કાલિક કટોકટી સેવાઓ (112 અથવા 108) નો સંપર્ક કરો અથવા નજીકની હોસ્પિટલના ઇમરજન્સી રૂમની મુલાકાત લો.",
            bn: "⚠️ জরুরি সতর্কতা: এই লক্ষণগুলির জন্য জরুরি চিকিৎসার প্রয়োজন হতে পারে। অনুগ্রহ করে অবিলম্বে জরুরি পরিষেবা (112 বা 108) এর সাথে যোগাযোগ করুন অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যান।",
            te: "⚠️ అత్యவసర హెచ్చరిక: ఈ లక్షణాలకు తక్షణ వైద్య సహాయం అవసరం కావచ్చు. దయచేసి వెంటనే అత్యవసర సేవలను (112 లేదా 108) సంప్రదించండి లేదా సమీపంలోని ఆసుపత్రి అత్యవసర విభాగానికి వెళ్లండి.",
            ta: "⚠️ அவசர எச்சரிக்கை: இந்த அறிகுறிகளுக்கு அவசர மருத்துவ சிகிச்சை தேவைப்படலாம். தயவுசெய்து உடனடியாக அவசர சேவைகளை (112 లేదా 108) தொடர்பு கொள்ளவும் அல்லது அருகிலுள்ள மருத்துவமனையின் அவசர சிகிச்சைப் பிரிவுக்குச் செல்லவும்.",
            kn: "⚠️ ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಈ ರೋಗಲಕ್ಷಣಗಳಿಗೆ ತಕ್ಷಣದ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆಯ ಅಗತ್ಯವಿರಬಹುದು. ದಯವಿಟ್ಟು ತಕ್ಷಣವೇ ತುರ್ತು ಸೇವೆಗಳನ್ನು (112 ಅಥವಾ 108) ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಯ ತುರ್ತು ಚಿಕಿತ್ಸಾ ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ."
        },
        disclaimer: {
            en: "Treatment recommendations should be confirmed by a qualified homeopathic physician.",
            hi: "उपचार संबंधी सिफारिशों की पुष्टि एक योग्य होम्योपैथिक चिकित्सक द्वारा की जानी चाहिए।",
            mr: "औषधोपचाराच्या शिफारसींची खात्री पात्र होमिओपॅथी डॉक्टरांकडून केली पाहिजे.",
            gu: "સારવારની ભલામણો લાયક હોમિયોપેથિક ડૉક્ટર દ્વારા કન્ફર્મ થવી જોઈએ.",
            bn: "চিকিৎসার সুপারিশগুলি একজন যোগ্যতাসম্পন্ন হোমিওপ্যাথিক চিকিৎসক দ্বারা নিশ্চিত করা উচিত।",
            te: "చిकीత్స సిఫార్సులు అర్హత కలిగిన హోమియోపతి వైద్యునిచే ధృవీకరించబడాలి.",
            ta: "சிகிச்சை பரிந்துரைகள் தகுதி வாய்ந்த ஹோமியோபதி மருத்துவரால் உறுதிப்படுத்தப்பட வேண்டும்.",
            kn: "ಚಿಕಿತ್ಸೆಯ ಶಿಫಾರಸುಗಳನ್ನು ಅರ್ಹ ಹೋಮಿಯೋಪತಿ ವೈದ್ಯರಿಂದ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಬೇಕು."
        }
    };

    const UI_LOCALIZATION = {
        en: {
            welcome_title: "Welcome to Your Health Intelligence Hub",
            welcome_desc: "Lucy analyzes your vitals, daily logs, and health assessments to model your constitutional Vitality Score in real-time.",
            organ_title: "Organ Performance Indices",
            organ_sub: "Functional Biomarker Estimates",
            risk_title: "Health Risk Assessment",
            risk_sub: "Preventive Screening Profile",
            consult_title: "Constitutional Consultation",
            consult_sub: "Connect with Dr. Narayan Jethwani, MD (Hom.)",
            daily_title: "Log Daily Vitals",
            daily_sub: "Updates your overall Vitality Score in real-time",
            sleep_duration: "Sleep Duration (Hours)",
            water_intake: "Water Intake (Glasses / 250ml)",
            water_glasses: "Glasses",
            exercise_dur: "Exercise (Minutes)",
            stress_lvl: "Stress Level (1-10)",
            weight_lbs: "Current Weight (kg)",
            save_vitals: "Save Daily Metrics",
            goals_title: "Health Goals & Achievements",
            goals_sub: "Lucy's Real-time Feedback",
            assessments_title: "Health Assessments",
            assessments_sub: "Take an assessment to identify sub-health patterns",
            symptoms_title: "Symptom Navigator",
            symptoms_sub: "Document symptoms systematically for your next consultation",
            symp_concern: "What is your main health concern / symptoms?",
            symp_duration: "Duration (How long?)",
            symp_triggers: "Aggravating Factors (What makes it worse?)",
            symp_relieving: "Relieving Factors (What makes it better?)",
            symp_associated: "Associated Symptoms",
            generate_symp_btn: "Generate Doctor Summary",
            reports_title: "Health Report Interpreter",
            reports_sub: "Upload blood test reports (CBC, Thyroid, Lipid, etc.) for a simple breakdown",
            materia_title: "Homeopathic Materia Medica (Educational Mode)",
            materia_sub: "Search common remedies, sources, keynotes, and modalities.",
            materia_search_placeholder: "Search by name, symptom, or keyword...",
            wellness_title: "Your Personalized 7-Day Wellness Plan",
            wellness_sub: "Customized routines based on your vitality assessments and risk factors.",
            tab_chat: "Chat Companion",
            tab_companion: "AI Companion Logs",
            tab_assessments: "Vitals Assessments",
            tab_symptoms: "Symptom Navigator",
            tab_reports: "Report Interpreter",
            tab_materia: "Materia Medica",
            tab_wellness: "Wellness Plan",
            result_desc: "Your completed {title} score is {score}/100.",
            advice_high: "Excellent baseline vitality! Continue maintaining your current hydration and sleep patterns. Regular checks support keeping this state.",
            advice_mid: "Moderate sub-health patterns identified. Optimization of sleep hygiene, daily hydration, and consideration of constitutional remedies will help restore optimal balance.",
            advice_low: "Low vital force resilience. We highly recommend booking a comprehensive consultation with Dr. Narayan Jethwani to build a personalized therapeutic plan.",
            save_update_btn: "Save & Update Dashboard"
        },
        hi: {
            welcome_title: "आपके स्वास्थ्य खुफिया हब में आपका स्वागत है",
            welcome_desc: "लूसी आपके विटल्स, दैनिक लॉग और स्वास्थ्य आकलन का विश्लेषण करती है ताकि वास्तविक समय में आपकी जीवन शक्ति (वाइटैलिटी) स्कोर का निर्धारण किया जा सके।",
            organ_title: "अंग प्रदर्शन सूचकांक",
            organ_sub: "कार्यात्मक बायोमार्कर अनुमान",
            risk_title: "स्वास्थ्य जोखिम मूल्यांकन",
            risk_sub: "निवारक स्क्रीनिंग प्रोफाइल",
            consult_title: "संवैधानिक परामर्श",
            consult_sub: "डॉ. नारायण जेठवानी, एमडी (होम) से जुड़ें",
            daily_title: "दैनिक विटल्स लॉग करें",
            daily_sub: "आपकी समग्र जीवन शक्ति स्कोर को वास्तविक समय में अपडेट करता है",
            sleep_duration: "नींद की अवधि (घंटे)",
            water_intake: "पानी का सेवन (गिलास / 250 मिली)",
            water_glasses: "गिलास",
            exercise_dur: "व्यायाम (मिनट)",
            stress_lvl: "तनाव का स्तर (1-10)",
            weight_lbs: "वर्तमान वजन (किग्रा)",
            save_vitals: "दैनिक मेट्रिक्स सहेजें",
            goals_title: "स्वास्थ्य लक्ष्य और उपलब्धियां",
            goals_sub: "लूसी की वास्तविक समय प्रतिक्रिया",
            assessments_title: "स्वास्थ्य आकलन",
            assessments_sub: "उप-स्वास्थ्य पैटर्न की पहचान करने के लिए एक मूल्यांकन लें",
            symptoms_title: "लक्षण नेविगेटर",
            symptoms_sub: "अपने अगले परामर्श के लिए लक्षणों को व्यवस्थित रूप से दस्तावेज करें",
            symp_concern: "आपकी मुख्य स्वास्थ्य चिंता / लक्षण क्या हैं?",
            symp_duration: "अवधि (कब से?)",
            symp_triggers: "बढ़ाने वाले कारक (किससे तकलीफ बढ़ती है?)",
            symp_relieving: "राहत देने वाले कारक (किससे आराम मिलता है?)",
            symp_associated: "संबद्ध लक्षण",
            generate_symp_btn: "डॉक्टर सारांश तैयार करें",
            reports_title: "स्वास्थ्य रिपोर्ट विश्लेषक",
            reports_sub: "सरल विश्लेषण के लिए रक्त परीक्षण रिपोर्ट (CBC, थायराइड, लिपिड, आदि) अपलोड करें",
            materia_title: "होम्योपैथिक मटेरिया मेडिका (शैक्षिक मोड)",
            materia_sub: "सामान्य उपचार, स्रोत, मुख्य लक्षण और तौर-तरीके खोजें।",
            materia_search_placeholder: "नाम, लक्षण या कीवर्ड द्वारा खोजें...",
            wellness_title: "आपकी व्यक्तिगत 7-दिवसीय कल्याण योजना",
            wellness_sub: "आपके जीवन शक्ति आकलन और जोखिम कारकों पर आधारित अनुकूलित दिनचर्या।",
            tab_chat: "चैट गाइड",
            tab_companion: "स्वास्थ्य लॉग",
            tab_assessments: "स्वास्थ्य आकलन",
            tab_symptoms: "लक्षण नेविगेटर",
            tab_reports: "रिपोर्ट विश्लेषक",
            tab_materia: "मटेरिया मेडिका",
            tab_wellness: "वेलनेस योजना",
            result_desc: "आपका पूरा किया गया {title} स्कोर {score}/100 है।",
            advice_high: "बेहतरीन जीवन शक्ति! अपने वर्तमान पानी पीने और सोने के पैटर्न को बनाए रखें। नियमित जांच इस स्थिति को बनाए रखने में सहायता करती है।",
            advice_mid: "मध्यम उप-स्वास्थ्य पैटर्न की पहचान की गई है। नींद की स्वच्छता, दैनिक पानी का सेवन और संवैधानिक उपचारों पर विचार करने से इष्टतम संतुलन बहाल करने में मदद मिलेगी।",
            advice_low: "कम जीवन शक्ति। हम व्यक्तिगत चिकित्सीय योजना बनाने के लिए डॉ. नारायण जेठवानी के साथ एक व्यापक परामर्श बुक करने की अत्यधिक अनुशंसा करते हैं।",
            save_update_btn: "सहेजें और डैशबोर्ड अपडेट करें"
        },
        mr: {
            welcome_title: "तुमच्या आरोग्य बुद्धिमत्ता हबमध्ये आपले स्वागत आहे",
            welcome_desc: "ल्युसी तुमच्या विटल्स, दैनिक लॉग आणि आरोग्य मूल्यांकनाचे विश्लेषण करते आणि रिअल-टाइममध्ये तुमच्या वाइटॅलिटी स्कोअरचे मॉडेल तयार करते.",
            organ_title: "अंग कामगिरी निर्देशांक",
            organ_sub: "कार्यात्मक बायोमार्कर अंदाज",
            risk_title: "आरोग्य जोखीम मूल्यांकन",
            risk_sub: "प्रतिबंधात्मक स्क्रीनिंग प्रोफाइल",
            consult_title: "संवैधानिक सल्लामसलत",
            consult_sub: "डॉ. नारायण जेठवानी, एमडी (होम) यांच्याशी संपर्क साधा",
            daily_title: "दैनिक विटल्सची नोंद करा",
            daily_sub: "रिअल-टाइममध्ये तुमचा वाइटॅलिटी स्कोअर अद्ययावत करते",
            sleep_duration: "झोपेचा कालावधी (तास)",
            water_intake: "पाण्याचे सेवन (ग्लास / २५० मिली)",
            water_glasses: "ग्लास",
            exercise_dur: "व्यायाम (मिनिटे)",
            stress_lvl: "तणाव पातळी (१-१०)",
            weight_lbs: "सध्याचे वजन (किग्रॅ)",
            save_vitals: "दैनिक मेट्रिक्स जतन करा",
            goals_title: "आरोग्य उद्दिष्टे आणि यश",
            goals_sub: "ल्युसीचा रिअल-टाइम अभिप्राय",
            assessments_title: "आरोग्य मूल्यांकन",
            assessments_sub: "उप-आरोग्य नमुने ओळखण्यासाठी मूल्यांकन घ्या",
            symptoms_title: "लक्षण नेव्हिगेटर",
            symptoms_sub: "तुमच्या पुढील सल्लामसलतीसाठी लक्षणांचे व्यवस्थित दस्तऐवजीकरण करा",
            symp_concern: "तुमची मुख्य आरोग्य काळजी / लक्षणे काय आहेत?",
            symp_duration: "कालावधी (किती काळापासून?)",
            symp_triggers: "त्रास वाढवणारे घटक (कशाने त्रास वाढतो?)",
            symp_relieving: "आराम देणारे घटक (कशाने आराम मिळतो?)",
            symp_associated: "संबंधित लक्षणे",
            generate_symp_btn: "डॉक्टर सारांश तयार करा",
            reports_title: "आरोग्य अहवाल दुभाषा",
            reports_sub: "सोप्या विश्लेषणासाठी रक्त चाचणी अहवाल (CBC, थायरॉईड, लिपिड इ.) अपलोड करा",
            materia_title: "होमिओपॅथिक मटेरिया मेडिका (शैक्षणिक मोड)",
            materia_sub: "सामान्य उपाय, स्रोत, कीनोट्स आणि पद्धती शोधा.",
            materia_search_placeholder: "नाव, लक्षण किंवा कीवर्डद्वारे शोधा...",
            wellness_title: "तुमची वैयक्तिककृत ७-दिवसीय वेलनेस योजना",
            wellness_sub: "तुमच्या वाइटॅलिटी मूल्यांकनांवर आणि जोखीम घटकांवर आधारित सानुकूलित दिनचर्या.",
            tab_chat: "चॅट मार्गदर्शक",
            tab_companion: "आरोग्य लॉग",
            tab_assessments: "आरोग्य मूल्यांकन",
            tab_symptoms: "लक्षण नेव्हिगेटर",
            tab_reports: "रिपोर्ट विश्लेषक",
            tab_materia: "मटेरिया मेडिका",
            tab_wellness: "वेलनेस योजना",
            result_desc: "तुमचा पूर्ण झालेला {title} स्कोअर {score}/100 आहे.",
            advice_high: "उत्कृष्ट जीवन शक्ती! आपले पाण्याचे प्रमाण आणि झोपेची पद्धत व्यवस्थित राखा. नियमित तपासणी या स्थितीला टिकवून ठेवण्यास मदत करते.",
            advice_mid: "मध्यम उप-आरोग्य समस्या आढळल्या आहेत. झोपेची शिस्त, पाण्याचे प्रमाण आणि संवैधानिक होमिओपॅथिक उपचारांचा विचार केल्यास शरीराला पुन्हा योग्य स्थितीत आणता येईल.",
            advice_low: "कमी जीवन शक्ती. आम्ही शिफारस करतो की आपण डॉ. नारायण जेठवानी यांच्यासोबत सल्लामसलत बुक करावी जेणेकरून वैयक्तिक उपचार योजना तयार करता येईल.",
            save_update_btn: "जतन करा आणि डॅशबोर्ड अद्ययावत करा"
        },
        gu: {
            welcome_title: "તમારા હેલ્થ ઇન્ટેલિજન્સ હબમાં આપનું સ્વાગત છે",
            welcome_desc: "લ્યુસી તમારા વિટલ્સ, દૈનિક લોગ અને આરોગ્ય મૂલ્યાંકનનું વિશ્લેષણ કરે છે જેથી રીઅલ-ટાઇમમાં તમારા વાઇટેલિટી સ્કોરનું મોડેલ બનાવી શકાય.",
            organ_title: "અંગ કામગીરી સૂચકાંક",
            organ_sub: "કાર્યાત્મક બાયોમાર્કર અંદાજ",
            risk_title: "આરોગ્ય જોખમ મૂલ્યાંકન",
            risk_sub: "નિવારક સ્ક્રીનીંગ પ્રોફાઇલ",
            consult_title: "બંધારણીય પરામર્શ",
            consult_sub: "ડૉ. નારાયણ જેઠવાની, MD (હોમ) સાથે જોડાઓ",
            daily_title: "દૈનિક વિટલ્સ લોગ કરો",
            daily_sub: "રીઅલ-ટાઇમમાં તમારા વાઇટેલિટી સ્કોરને અપડેટ કરે છે",
            sleep_duration: "ઊંઘનો સમયગાળો (કલાક)",
            water_intake: "પાણીનું સેવન (ગ્લાસ / 250 મિલી)",
            water_glasses: "ગ્લાસ",
            exercise_dur: "કસરત (મિનિટ)",
            stress_lvl: "તણાવ સ્તર (1-10)",
            weight_lbs: "વર્તમાન વજન (કિલો)",
            save_vitals: "દૈનિક મેટ્રિક્સ સાચવો",
            goals_title: "આરોગ્ય લક્ષ્યો અને સિદ્ધિઓ",
            goals_sub: "લ્યુસીનો રીઅલ-ટાઇમ પ્રતિસાદ",
            assessments_title: "આરોગ્ય મૂલ્યાંકન",
            assessments_sub: "પેટર્ન ઓળખવા માટે મૂલ્યાંકન લો",
            symptoms_title: "લક્ષણ નેવિગેટર",
            symptoms_sub: "તમારા આગામી પરામર્શ માટે લક્ષણો દસ્તાવેજ કરો",
            symp_concern: "તમારી મુખ્ય આરોગ્ય ચિંતા / લક્ષણો શું છે?",
            symp_duration: "સમયગાળો (કેટલા સમયથી?)",
            symp_triggers: "તકલીફ વધારતા પરિબળો",
            symp_relieving: "રાહત આપતા પરિબળો",
            symp_associated: "સંબંધિત લક્ષણો",
            generate_symp_btn: "ડૉક્ટર સારાંશ બનાવો",
            reports_title: "હેલ્થ રિપોર્ટ ઇન્ટરપ્રિટર",
            reports_sub: "સરળ વિશ્લેષણ માટે બ્લડ રિપોર્ટ પીડીએફ અપલોડ કરો",
            materia_title: "હોમિયોપેથિક મટેરિયા મેડિકા (શૈક્ષણિક મોડ)",
            materia_sub: "સામાન્ય ઉપાયો, સ્ત્રોતો, મુખ્ય લક્ષણો શોધો.",
            materia_search_placeholder: "નામ કે લક્ષણ દ્વારા શોધો...",
            wellness_title: "તમારી વ્યક્તિગત 7-દિવસીય સુખાકારી યોજના",
            wellness_sub: "તમારી વ્યક્તિગત દિનચર્યા.",
            tab_chat: "ચેટ ગાઇડ",
            tab_companion: "હેલ્થ લોગ",
            tab_assessments: "આરોગ્ય મૂલ્યાંકન",
            tab_symptoms: "લક્ષણ નેવિગેટર",
            tab_reports: "રિપોર્ટ વિશ્લેષક",
            tab_materia: "મટેરિયા મેડિકા",
            tab_wellness: "વેલનેસ યોજના",
            result_desc: "તમારો પૂર્ણ થયેલ {title} સ્કોર {score}/100 છે.",
            advice_high: "ઉત્તમ જીવનશક્તિ! તમારી વર્તમાન દિનચર્યા જાળવી રાખો.",
            advice_mid: "મધ્યમ પેટર્ન ઓળખવામાં આવી છે. તેને સુધારી શકાય છે.",
            advice_low: "ઓછી જીવનશક્તિ. ડૉ. જેઠવાની સાથે પરામર્શ બુક કરો.",
            save_update_btn: "સાચવો અને ડેશબોર્ડ અપડેટ કરો"
        },
        bn: {
            welcome_title: "আপনার হেলথ ইন্টেলিজেন্স হাবে স্বাগতম",
            welcome_desc: "লুসি রিয়েল-টাইমে আপনার ভাইট্যালিটি স্কোর নির্ধারণ করতে আপনার দৈনন্দিন স্বাস্থ্য তথ্য বিশ্লেষণ করে।",
            organ_title: "অঙ্গ পারফরম্যান্স সূচক",
            organ_sub: "শারীরিক বায়োমার্কার অনুমান",
            risk_title: "স্বাস্থ্য ঝুঁকি মূল্যায়ন",
            risk_sub: "প্রতিরোধমূলক স্ক্রীনিং প্রোফাইল",
            consult_title: "সাংবিধানিক পরামর্শ",
            consult_sub: "ডাঃ নারায়ণ জেঠওয়ানি, এমডি (হোম) এর সাথে যোগাযোগ করুন",
            daily_title: "দৈনিক ভাইটালস নথিভুক্ত করুন",
            daily_sub: "রিয়েল-টাইমে আপনার সামগ্রিক ভাইট্যালিটি স্কোর আপডেট করে",
            sleep_duration: "ঘুমের সময়কাল (ঘণ্টা)",
            water_intake: "জল পান (গ্লাস / ২৫০ মিলি)",
            water_glasses: "গ্লাস",
            exercise_dur: "ব্যায়াম (মিনিট)",
            stress_lvl: "মানসিক চাপ (১-১০)",
            weight_lbs: "বর্তমান ওজন (কেজি)",
            save_vitals: "দৈনিক তথ্য সংরক্ষণ করুন",
            goals_title: "স্বাস্থ্য লক্ষ্য ও অর্জন",
            goals_sub: "লুসির রিয়েল-টাইম মতামত",
            assessments_title: "স্বাস্থ্য মূল্যায়ন",
            assessments_sub: "লক্ষণ বোঝার জন্য একটি মূল্যায়ন নিন",
            symptoms_title: "লক্ষণ নেভিগেটর",
            symptoms_sub: "পরবর্তী পরামর্শের জন্য লক্ষণগুলি লিপিবদ্ধ করুন",
            symp_concern: "আপনার প্রধান স্বাস্থ্য সমস্যা / লক্ষণগুলি কী?",
            symp_duration: "স্থায়ীত্ব (কতদিন ধরে?)",
            symp_triggers: "বৃদ্ধিজনিত কারণ (কিসে কষ্ট বাড়ে?)",
            symp_relieving: "উপশমকারী কারণ (কিসে আরাম হয়?)",
            symp_associated: "আনুষঙ্গিক লক্ষণ",
            generate_symp_btn: "ডাক্তারের জন্য সংক্ষিপ্ত বিবরণ তৈরি করুন",
            reports_title: "স্বাস্থ্য রিপোর্ট বিশ্লেষক",
            reports_sub: "রক্ত পরীক্ষার রিপোর্ট (CBC, থাইরয়েড ইত্যাদি) আপলোড করুন",
            materia_title: "হোমিওপ্যাথিক মেটেরিয়া মেডিকা (শিক্ষামূলক)",
            materia_sub: "সাধারণ ওষুধ, উৎস এবং লক্ষণগুলি অনুসন্ধান করুন।",
            materia_search_placeholder: "নাম বা লক্ষণ দিয়ে খুঁজুন...",
            wellness_title: "আপনার ব্যক্তিগত ৭ দিনের ওয়েলনেস প্ল্যান",
            wellness_sub: "আপনার ভাইট্যালিটি মূল্যায়নের ভিত্তিতে রুটিন।",
            tab_chat: "চ্যাট গাইড",
            tab_companion: "স্বাস্থ্য লগ",
            tab_assessments: "স্বাস্থ্য মূল্যায়ন",
            tab_symptoms: "লক্ষণ নেভিগেটর",
            tab_reports: "রিপোর্ট বিশ্লেষক",
            tab_materia: "মেটেরিয়া মেডিকা",
            tab_wellness: "ওয়েলনেস পরিকল্পনা",
            result_desc: "আপনার সম্পন্ন করা {title} স্কোর হল {score}/100।",
            advice_high: "চমৎকার জীবনশক্তি! আপনার বর্তমান রুটিন বজায় রাখুন।",
            advice_mid: "কিছু সমস্যা দেখা গেছে। লাইফস্টাইল উন্নত করুন।",
            advice_low: "কম জীবনশক্তি। ডাঃ জেঠওয়ানির সাথে পরামর্শ করুন।",
            save_update_btn: "সংরক্ষণ করুন এবং ড্যাশবোর্ড আপডেট করুন"
        },
        te: {
            welcome_title: "మీ హెల్త్ ఇంటెలిజెన్స్ హబ్‌కు స్వాగతం",
            welcome_desc: "ఆరోగ్య వైటాలిటీ స్కోర్‌ను లెక్కించేందుకు లూసీ మీకు సహాయపడుతుంది.",
            organ_title: "అవయవ పనితీరు సూచీలు",
            organ_sub: "బయోమార్కర్ అంచనాలు",
            risk_title: "ఆరోగ్య ప్రమాద అంచనా",
            risk_sub: "నివారణ స్క్రీనింగ్ ప్రొఫైల్",
            consult_title: "రాజ్యాంగ సంప్రదింపులు",
            consult_sub: "డాక్టర్ నారాయణ్ జెత్వాని, MD (హోమ్) ని కలవండి",
            daily_title: "దినసరి వైటల్స్ నమోదు",
            daily_sub: "వైటాలిటీ స్కోర్‌ను నిజ సమయానికి అప్‌డేట్ చేస్తుంది",
            sleep_duration: "నిద్ర సమయం (గంటలు)",
            water_intake: "తాగిన నీరు (గ్లాసులు / 250మిలీ)",
            water_glasses: "గ్లాసులు",
            exercise_dur: "వ్యాయామం (నిమిషాలు)",
            stress_lvl: "ఒత్తిడి స్థాయి (1-10)",
            weight_lbs: "ప్రస్తుత బరువు (కిలోలు)",
            save_vitals: "దినసరి వివరాలు దాచండి",
            goals_title: "ఆరోగ్య లక్ష్యాలు & విజయాలు",
            goals_sub: "లూసీ నిజ-సమయ ఫీడ్‌బ్యాక్",
            assessments_title: "ఆరోగ్య అంచనాలు",
            assessments_sub: "ఆరోగ్య సమస్యల గుర్తింపు కొరకు పరీక్ష తీసుకోండి",
            symptoms_title: "లక్షణాల నావిగేటర్",
            symptoms_sub: "వైద్య సంప్రదింపుల కొరకు మీ లక్షణాలను సిద్ధం చేయండి",
            symp_concern: "మీ ప్రధాన ఆరోగ్య సమస్య / లక్షణాలు ఏమిటి?",
            symp_duration: "వ్యవధి (ఎంత కాలంగా?)",
            symp_triggers: "సమస్యను పెంచే అంశాలు",
            symp_relieving: "సమస్యను తగ్గించే అంశాలు",
            symp_associated: "సంబంధిత లక్షణాలు",
            generate_symp_btn: "డాక్టర్ కొరకు సారాంశం సృష్టించు",
            reports_title: "రిపోర్ట్ విశ్లేషకుడు",
            reports_sub: "రక్త పరీక్షల నివేదికలను అప్‌లోడ్ చేయండి",
            materia_title: "హోమియోపతి మెటీరియా మెడికా (విద్యా విధానం)",
            materia_sub: "ఔషధాల వివరాలు, మూలాలు, లక్షణాలను వెతకండి.",
            materia_search_placeholder: "పేరు లేదా లక్షణంతో వెతకండి...",
            wellness_title: "మీ వ్యక్తిగతీకరించిన 7-రోజుల వెల్‌నెస్ ప్లాన్",
            wellness_sub: "మీ వైటాలిటీ ఆధారంగా రూపొందించిన దినచర్య.",
            tab_chat: "చాట్ సహాయకం",
            tab_companion: "ఆరోగ్య లాగ్స్",
            tab_assessments: "ఆరోగ్య అంచనాలు",
            tab_symptoms: "లక్షణాల నావిగేటర్",
            tab_reports: "రిపోర్ట్ విశ్లేషణ",
            tab_materia: "మెటీరియా మెడికా",
            tab_wellness: "వెల్‌నెస్ ప్లాన్",
            result_desc: "మీరు పూర్తి చేసిన {title} స్కోరు {score}/100.",
            advice_high: "అద్భుతమైన వైటాలిటీ! ఈ జీవనశైలిని కొనసాగించండి.",
            advice_mid: "కొన్ని ఆరోగ్య మార్పులు అవసరం. తగిన జాగ్రత్తలు తీసుకోండి.",
            advice_low: "తక్కువ వైటాలిటీ. డాక్టర్ జెత్వానిని సంప్రదించండి.",
            save_update_btn: "సేవ్ చేయండి మరియు డాష్‌బోర్డ్ అప్‌డేట్ చేయండి"
        },
        ta: {
            welcome_title: "உங்கள் ஹெல்த் இன்டெலிஜென்ஸ் மையத்திற்கு வரவேற்கிறோம்",
            welcome_desc: "லூசி உங்கள் தினசரி பதிவுகளை ஆராய்ந்து உங்கள் வைட்டாலிറ്റി ஸ்கோரை உடனுக்குடன் கணக்கிடுகிறது.",
            organ_title: "உறுப்பு செயல்திறன் குறியீடுகள்",
            organ_sub: "உயிரியல் அடையாள மதிப்பீடுகள்",
            risk_title: "ஆரோக்கிய ஆபத்து மதிப்பீடு",
            risk_sub: "முன்னெச்சரிக்கை பரிசோதனை விவரம்",
            consult_title: "அரசியலமைப்பு ஆலோசனை",
            consult_sub: "டாக்டர் நாராயண் ஜெத்வானி, MD (Hom.) ஐ அணுகவும்",
            daily_title: "தினசரி பதிவுகளை உள்ளிடவும்",
            daily_sub: "வைட்டாலிറ്റി ஸ்கோரை உடனுக்குடன் புதுப்பிக்கிறது",
            sleep_duration: "தூக்க நேரம் (மணிநேரம்)",
            water_intake: "நீர் உட்கொள்ளல் (கிளாஸ் / 250ml)",
            water_glasses: "கிளாஸ்கள்",
            exercise_dur: "உடற்பயிற்சி (நிமிடங்கள்)",
            stress_lvl: "மன அழுத்தம் (1-10)",
            weight_lbs: "தற்போதைய எடை (கிலோ)",
            save_vitals: "தினசரி விவரங்களை சேமிக்கவும்",
            goals_title: "ಆರೋಗ್ಯ ಇಲಕ್ಕುಗಳು & சாதனைகள்",
            goals_sub: "ಲೂಸಿಯಿನ್ நேரடி கருத்து",
            assessments_title: "உடல்நல மதிப்பீடுகள்",
            assessments_sub: "உடல்நல பாதிப்புகளை கண்டறிய மதிப்பீட்டை எடுக்கவும்",
            symptoms_title: "அறிகுறி வழிகாட்டி",
            symptoms_sub: "அடுத்த ஆலோசனைக்காக உங்கள் அறிகுறிகளை ஆவணப்படுத்தவும்",
            symp_concern: "உங்கள் முக்கிய உடல்நல பாதிப்பு / அறிகுறிகள் என்ன?",
            symp_duration: "கால அளவு (எவ்வளவு நாட்களாக?)",
            symp_triggers: "பாதிப்பை அதிகரிக்கும் காரணிகள்",
            symp_relieving: "நிவாரணம் அளிக்கும் காரணிகள்",
            symp_associated: "தொடர்புடைய அறிகுறிகள்",
            generate_symp_btn: "மருத்துவர் சுருக்கத்தை உருவாக்கவும்",
            reports_title: "ஆரோக்கிய அறிக்கை பகுப்பாய்வி",
            reports_sub: "இரத்த பரிசோதனை அறிக்கைகளை பதிவேற்றவும்",
            materia_title: "ஹோமியோபதி மெட்டீரியா மெடிகா (கல்வி முறை)",
            materia_sub: "மருந்துகள், அவற்றின் மூலங்கள் மற்றும் அறிகுறிகளைத் தேடுங்கள்.",
            materia_search_placeholder: "பெயர் அல்லது அறிகுறி கொண்டு தேடுக...",
            wellness_title: "உங்களின் தனிப்பயனாக்கப்பட்ட 7-நாள் நல்வாழ்வு திட்டம்",
            wellness_sub: "உங்கள் வைட்டாலிட்டி மதிப்பீட்டின் அடிப்படையில் அமைக்கப்பட்ட திட்டம்.",
            tab_chat: "அரட்டை வழிகாட்டி",
            tab_companion: "உடல்நலப் பதிவுகள்",
            tab_assessments: "உடல்நல மதிப்பீடு",
            tab_symptoms: "அறிகுறி வழிகாட்டி",
            tab_reports: "அறிக்கை பகுப்பாய்வு",
            tab_materia: "மெட்டீரியா மெடிகா",
            tab_wellness: "நல்வாழ்வு திட்டம்",
            result_desc: "உங்களது முடிக்கப்பட்ட {title} ஸ்கோர் {score}/100 ஆகும்.",
            advice_high: "சிறந்த வைட்டாலிட்டி! இதே பழக்கங்களை தொடரவும்.",
            advice_mid: "மிதமான மாற்றங்கள் தேவை. நல்வாழ்வில் கவனம் செலுத்துங்கள்.",
            advice_low: "குறைந்த வைட்டாலிட்டி. மருத்துவரை அணுகவும்.",
            save_update_btn: "சேமித்து டாஷ்போர்டை புதுப்பிக்கவும்"
        },
        kn: {
            welcome_title: "ನಿಮ್ಮ ಹೆಲ್ತ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಹಬ್‌ಗೆ ಸುಸ್ವಾಗತ",
            welcome_desc: "ಲೂಸಿ ನಿಮ್ಮ ದಿನಚರಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ ನಿಮ್ಮ ವೈಟಾಲಿಟಿ ಸ್ಕೋರ್ ಅನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
            organ_title: "ಅಂಗಾಂಗ ಕಾರ್ಯಕ್ಷಮತೆ ಸೂಚ್ಯಂಕಗಳು",
            organ_sub: "ಜೈವಿಕ ಗುರುತುಗಳ ಅಂದಾಜು",
            risk_title: "ಆರೋಗ್ಯ ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ",
            risk_sub: "ಮುನ್ನೆಚ್ಚರಿಕೆ ತಪಾಸಣೆ ವಿವರ",
            consult_title: "ಸಾಂವಿಧಾನಿಕ ಸಮಾಲೋಚನೆ",
            consult_sub: "ಡಾ. ನಾರಾಯಣ್ ಜೇಠ್ವಾನಿ, MD (ಹೋಮ್) ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ",
            daily_title: "ದೈನಂದಿನ ವೈಟಲ್ಸ್ ನಮೂದಿಸಿ",
            daily_sub: "ನೈಜ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಒಟ್ಟಾರೆ ವೈಟಾಲಿಟಿ ಸ್ಕೋರ್ ನವೀಕರಿಸುತ್ತದೆ",
            sleep_duration: "ನಿದ್ರೆಯ ಅವಧಿ (ಗಂಟೆಗಳು)",
            water_intake: "ಕುಡಿದ ನೀರು (ಗ್ಲಾಸ್ / 250ml)",
            water_glasses: "ಗ್ಲಾಸ್‌ಗಳು",
            exercise_dur: "ವ್ಯಾಯಾಮ (ನಿಮಿಷಗಳು)",
            stress_lvl: "ಒತ್ತಡದ ಮಟ್ಟ (1-10)",
            weight_lbs: "ಪ್ರಸ್ತುತ ತೂಕ (ಕೆಜಿ)",
            save_vitals: "ದೈನಂದಿನ ವಿವರಗಳನ್ನು ಉಳಿಸಿ",
            goals_title: "ಆರೋಗ್ಯ ಗುರಿಗಳು & ಸಾಧನೆಗಳು",
            goals_sub: "ಲೂಸಿ ನೀಡುವ ನೈಜ ಸಮಯದ ಸಲಹೆಗಳು",
            assessments_title: "ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನಗಳು",
            assessments_sub: "ಆರೋಗ್ಯದ ಸ್ಥಿತಿಯನ್ನು ತಿಳಿಯಲು ಮೌಲ್ಯಮಾಪನ ತಪಾಸಣೆ ಮಾಡಿ",
            symptoms_title: "ಲಕ್ಷಣ ನ್ಯಾವಿಗೇಟರ್",
            symptoms_sub: "ನಿಮ್ಮ ಮುಂದಿನ ವೈದ್ಯಕೀಯ ಭೇಟಿಗಾಗಿ ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಿ",
            symp_concern: "ನಿಮ್ಮ ಪ್ರಮುಖ ಆರೋಗ್ಯದ ಲಕ್ಷಣಗಳು / ಕಾಳಜಿ ಏನು?",
            symp_duration: "ಅವಧಿ (ಎಷ್ಟು ದಿನಗಳಿಂದ?)",
            symp_triggers: "ಲಕ್ಷಣಗಳನ್ನು ಉಲ್ಬಣಗೊಳಿಸುವ ಅಂಶಗಳು",
            symp_relieving: "ಲಕ್ಷಣಗಳನ್ನು ಕಡಿಮೆ ಮಾಡುವ ಅಂಶಗಳು",
            symp_associated: "ಸಂಬಂಧಿತ ಲಕ್ಷಣಗಳು",
            generate_symp_btn: "ವೈದ್ಯರ ವರದಿ ಸಿದ್ಧಪಡಿಸಿ",
            reports_title: "ಆರೋಗ್ಯ ವರದಿ ವಿಶ್ಲೇಷಕ",
            reports_sub: "ರಕ್ತ ತಪಾಸಣೆ ವರದಿಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ",
            materia_title: "ಹೋಮಿಯೋಪತಿ ಮೆಟೀರಿಯಾ ಮೆಡಿಕಾ (ಶೈಕ್ಷಣಿಕ)",
            materia_sub: "ಸಾಮಾನ್ಯ ಔಷಧಗಳು, ಮೂಲ ಮತ್ತು ಗುಣಲಕ್ಷಣಗಳನ್ನು ಹುಡುಕಿ.",
            materia_search_placeholder: "ಹೆಸರು ಅಥವಾ ಲಕ್ಷಣದಿಂದ ಹುಡುಕಿ...",
            wellness_title: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ 7 ದಿನಗಳ ವೆಲ್ನೆಸ್ ಯೋಜನೆ",
            wellness_sub: "ನಿಮ್ಮ ವೈಟಾಲಿಟಿ ಮೌಲ್ಯಮಾಪನದ ಆಧಾರದ ಮೇಲೆ ತಯಾರಿಸಿದ ದೈನಂದಿನ ದಿನಚರಿ.",
            tab_chat: "ಚಾಟ್ ಗೈಡ್",
            tab_companion: "ಆರೋಗ್ಯ ಲಾಗ್‌ಗಳು",
            tab_assessments: "ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನ",
            tab_symptoms: "ಲಕ್ಷಣ ನ್ಯಾವಿಗೇಟರ್",
            tab_reports: "ವರದಿ ವಿಶ್ಲೇಷಕ",
            tab_materia: "ಮೆಟೀರಿಯಾ ಮೆಡಿಕಾ",
            tab_wellness: "ವೆಲ್ನೆಸ್ ಯೋಜನೆ",
            result_desc: "ನಿಮ್ಮ ಪೂರ್ಣಗೊಂಡ {title} ಸ್ಕೋರ್ {score}/100 ಆಗಿದೆ.",
            advice_high: "ಅತ್ಯುತ್ತಮ ವೈಟಾಲಿಟಿ! ಉತ್ತಮ ದಿನಚರಿಯನ್ನು ಮುಂದುವರಿಸಿ.",
            advice_mid: "ಕೆಲವು ಬದಲಾವಣೆಗಳು ಅಗತ್ಯವಿದೆ. ಗಮನ ಹರಿಸಿ.",
            advice_low: "ಕಡಿಮೆ ವೈಟಾಲಿಟಿ. ಡಾ. ಜೇಠ್ವಾನಿ ಅವರ ಸಮಾಲೋಚನೆ ಪಡೆಯಿರಿ.",
            save_update_btn: "ಉಳಿಸಿ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನವೀಕರಿಸಿ"
        }
    };

    const LOCALIZED_ASSESSMENTS = {
        hi: {
            vitality: {
                title: "जीवन शक्ति मूल्यांकन (Vitality)",
                questions: [
                    {
                        q: "दिन के दौरान आप कितनी बार शारीरिक थकान या ऊर्जा में गिरावट का अनुभव करते हैं?",
                        options: ["शायद ही कभी, ऊर्जा का स्तर लगातार बना रहता है।", "कभी-कभी, मुख्य रूप से दोपहर के दौरान।", "अक्सर, जिससे दिनचर्या के काम भारी लगते हैं।", "लगातार, जागने के बाद भी थकान रहती है।"],
                        explanation: "लगातार ऊर्जा एक संतुलित चयापचय इंजन और मजबूत जीवन शक्ति (वाइटल फ़ोर्स) के प्रवाह को दर्शाती है।"
                    },
                    {
                        q: "सुबह जागने पर अपनी स्थिति को रेट करें:",
                        options: ["तरोजा, ऊर्जावान और स्पष्ट दिमाग।", "थोड़ा भारीपन, लेकिन 15 मिनट में ठीक हो जाता है।", "थकान महसूस होना, काम करने के लिए चाय/कॉफ़ी की आवश्यकता होना।", "बेहद थका हुआ, ऐसा महसूस होना जैसे बिल्कुल सोए ही नहीं थे।"],
                        explanation: "जागने की स्थिति गहरी नींद (REM) और एड्रेनल रिकवरी चक्र की दक्षता को दर्शाती है।"
                    },
                    {
                        q: "आपका शरीर तापमान में अचानक बदलाव या मौसम के बदलाव पर कैसी प्रतिक्रिया देता है?",
                        options: ["आसानी से ढल जाता है, शायद ही कभी सर्दी-जुकाम होता है।", "मामूली अकड़न/छींकें, जो 24 घंटे में ठीक हो जाती हैं।", "मौसम बदलने पर अक्सर संक्रमण या बीमारियां होती हैं।", "अत्यंत संवेदनशील; मौसम बदलते ही पुरानी बीमारियां बढ़ जाती हैं।"],
                        explanation: "मौसम के बदलावों के प्रति संवेदनशीलता होम्योपैथी में एक क्लासिक संवैधानिक नैदानिक पैरामीटर है।"
                    }
                ]
            },
            stress: {
                title: "तनाव और तंत्रिका तंत्र मूल्यांकन (Stress)",
                questions: [
                    {
                        q: "दैनिक छोटे-मोटे कार्यों को लेकर आप कितनी बार चिंतित या तनावग्रस्त महसूस करते हैं?",
                        options: ["शायद ही कभी, मैं शांत रहकर कार्य संभालता हूँ।", "कभी-कभी, जब काम का दबाव बढ़ जाता है।", "अक्सर, जिससे शारीरिक तनाव (कंधे/जबड़े में) होता है।", "लगभग हमेशा; दिमाग हमेशा दौड़ता रहता है।"],
                        explanation: "चिंता से अनुकंपी तंत्रिका तंत्र (sympathetic system) पर दबाव पड़ता है, जिससे प्रतिरक्षा कमजोर होती है।"
                    },
                    {
                        q: "क्या आप तनाव में दिल की धड़कन तेज होना या उथली सांस लेने का अनुभव करते हैं?",
                        options: ["नहीं, सांस सामान्य रहती है।", "शायद ही कभी, केवल अत्यधिक दबाव में।", "हाँ, सांसें उथली और धड़कन काफी तेज हो जाती हैं।", "अक्सर, कभी-कभी घबराहट (पैनिक) जैसा महसूस होने लगता है।"],
                        explanation: "दिल की धड़कन तेज होना स्वायत्त तंत्रिका तंत्र की उच्च संवेदनशीलता को दर्शाता है, जिसे संवैधानिक उपचारों से शांत किया जा सकता है।"
                    }
                ]
            },
            sleep: {
                title: "नींद और रिकवरी मूल्यांकन (Sleep)",
                questions: [
                    {
                        q: "आप प्रति रात औसतन कितने घंटे की निर्बाध नींद लेते हैं?",
                        options: ["7 से 9 घंटे लगातार।", "6 से 7 घंटे; मध्यम आराम मिलता है।", "5 से 6 घंटे; सुबह थकान रहती है।", "5 घंटे से कम; पुरानी नींद की कमी।"],
                        explanation: "गहरी, निर्बाध नींद शरीर की कोशिकाओं की मरम्मत और जीवन शक्ति की रिकवरी में मदद करती है।"
                    },
                    {
                        q: "क्या आपको सोने में कठिनाई होती है या रात में बार-बार नींद खुलती है?",
                        options: ["शायद ही कभी, आसानी से सो जाता हूँ और पूरी रात सोता हूँ।", "कभी-कभी सोने में 30 मिनट तक का समय लगता है।", "अक्सर नींद खुलती है, लेकिन फिर से सो जाता हूँ।", "गंभीर अनिद्रा; रात में कई बार नींद खुलती है और दोबारा सोना मुश्किल होता है।"],
                        explanation: "बार-बार नींद खुलना तंत्रिका तंत्र की अति-सक्रियता या कोर्टिसोल असंतुलन का संकेत देता है।"
                    }
                ]
            },
            digestive: {
                title: "पाचन और आंत स्वास्थ्य मूल्यांकन (Digestive)",
                questions: [
                    {
                        q: "भोजन के बाद आपको कितनी बार सूजन, गैस या एसिड रिफ्लक्स का अनुभव होता है?",
                        options: ["शायद ही कभी, पाचन सुचारू और हल्का होता है।", "कभी-कभी, गरिष्ठ या मसालेदार भोजन के बाद।", "अक्सर, साधारण घर के बने भोजन के बाद भी।", "लगभग रोज़ाना; पुरानी गैस और सूजन की समस्या रहती है।"],
                        explanation: "पाचन की कार्यक्षमता पोषक तत्वों के अवशोषण और सेलुलर ऊर्जा उत्पादन की नींव है।"
                    },
                    {
                        q: "अपने मल त्याग की नियमितता और स्थिति को रेट करें:",
                        options: ["नियमित दैनिक मल त्याग; सामान्य मल।", "थोड़ी अनियमितता (कभी-कभी एक दिन छूटना) या ढीला मल।", "अक्सर कब्ज या पुराना ढीला मल रहना।", "गंभीर कब्ज या रोज़ाना आईबीएस (IBS) की शिकायत।"],
                        explanation: "आंतों का स्वास्थ्य शरीर की विषहरण (detoxification) क्षमता और आंतों के फ्लोरा का सीधा प्रतिनिधित्व करता है।"
                    }
                ]
            },
            metabolic: {
                title: "चयापचय और ऊर्जा मूल्यांकन (Metabolic)",
                questions: [
                    {
                        q: "आपका वजन कैसा रहता है और भोजन के बाद शरीर की प्रतिक्रिया (सुस्ती/लालसा) कैसी होती है?",
                        options: ["स्थिर वजन, संतुलित भूख, मीठे की कोई तीव्र लालसा नहीं।", "मामूली उतार-चढ़ाव, कभी-कभी दोपहर में मीठे की लालसा।", "वजन घटाने में कठिनाई, भोजन के बाद सुस्ती महसूस होना।", "पुरानी चयापचय सुस्ती, तीव्र लालसा, तेजी से वजन बदलना।"],
                        explanation: "चयापचय स्वास्थ्य आपके थायराइड, इंसुलिन संवेदनशीलता और शारीरिक सहनशक्ति को परिभाषित करता है।"
                    },
                    {
                        q: "क्या आप शरीर के तापमान के प्रति संवेदनशीलता (ठंडे हाथ/पैर या गर्मी सहन न होना) महसूस करते हैं?",
                        options: ["सामान्य तापमान में सहज; कोई अत्यधिक संवेदनशीलता नहीं।", "सर्दियों में कभी-कभी हाथ-पैर ठंडे होना।", "अक्सर हाथ और पैर ठंडे रहना; अतिरिक्त कपड़ों की आवश्यकता होना।", "अत्यधिक गर्मी या ठंड सहन न होना; शरीर तापमान को नियंत्रित नहीं कर पाता।"],
                        explanation: "तापमान के प्रति संवेदनशीलता होम्योपैथी में थायराइड या परिसंचरण असंतुलन का संकेत देती है।"
                    }
                ]
            },
            womens: {
                title: "महिला स्वास्थ्य मूल्यांकन (Women's Health)",
                questions: [
                    {
                        q: "क्या आपकी मासिक धर्म चक्र नियमित है, और क्या आप पीएमएस (PMS) या ऐंठन का अनुभव करती हैं?",
                        options: ["नियमित चक्र, न्यूनतम या कोई दर्द/मूड में बदलाव नहीं।", "मामूली दर्द या मूड में बदलाव, 25-35 दिनों के भीतर चक्र।", "अक्सर ऐंठन, भारी रक्तस्राव, या अनियमित चक्र।", "गंभीर पीएमएस, पुरानी अनियमितता, या दर्दनाक चक्र।"],
                        explanation: "हॉर्मोनल संतुलन सेलुलर हाइड्रेशन, तनाव सहनशीलता और हड्डियों के स्वास्थ्य को नियंत्रित करता है।"
                    },
                    {
                        q: "क्या आप हार्मोनल बदलावों के लक्षणों जैसे कि मुंहासे, बालों का पतला होना या हॉट फ्लैशेस का अनुभव करती हैं?",
                        options: ["नहीं, त्वचा और बाल स्वस्थ और स्थिर रहते हैं।", "मासिक धर्म से पहले मामूली मुंहासे या कभी-कभी बालों का झड़ना।", "बालों का ध्यान देने योग्य पतला होना, पुराने मुंहासे या हॉट फ्लैशेस।", "गंभीर पीसीओएस (PCOS) या रजोनिवृत्ति के लक्षण जो दैनिक जीवन को प्रभावित करते हैं।"],
                        explanation: "अंतःस्रावी (endocrine) संतुलन तनाव और संवैधानिक जीवन शक्ति के प्रति अत्यधिक संवेदनशील होता है।"
                    }
                ]
            },
            mens: {
                title: "पुरुष स्वास्थ्य मूल्यांकन (Men's Health)",
                questions: [
                    {
                        q: "शारीरिक परिश्रम के बाद आपकी सहनशक्ति और रिकवरी का समय कैसा रहता है?",
                        options: ["उत्कृष्ट सहनशक्ति, बहुत जल्दी ठीक हो जाना।", "अच्छी सहनशक्ति, कभी-कभी अगले दिन थकान महसूस होना।", "कम सहनशक्ति, मध्यम व्यायाम से ठीक होने में भी कई दिन लगना।", "लगातार थका हुआ महसूस करना; न्यूनतम शारीरिक क्षमता।"],
                        explanation: "शारीरिक सहनशक्ति हृदय स्वास्थ्य और ऑक्सीजन के स्तर का एक प्रमुख संकेतक है।"
                    },
                    {
                        q: "दिन भर में अपने मानसिक ध्यान, ऊर्जा की स्थिरता और एकाग्रता को रेट करें:",
                        options: ["तीक्ष्ण, स्थिर ध्यान, कोई दिमागी कोहरा (brain fog) नहीं।", "अच्छा ध्यान, अत्यधिक तनाव के दौरान मामूली धुंधलापन।", "बार-बार दिमागी कोहरा होना, ध्यान केंद्रित करने में संघर्ष।", "एकाग्रता की गंभीर कमी, दोपहर में अत्यधिक थकावट।"],
                        explanation: "सहनशक्ति और ध्यान एड्रेनल भंडार और टेस्टोस्टेरोन-कोर्टिसोल संतुलन को दर्शाते हैं।"
                    }
                ]
            }
        },
        mr: {
            vitality: {
                title: "वाइटॅलिटी (जीवन शक्ती) मूल्यांकन",
                questions: [
                    {
                        q: "दिवसभरात तुम्हाला किती वेळा शारीरिक थकवा किंवा ऊर्जेची कमतरता जाणवते?",
                        options: ["क्वचितच, ऊर्जेची पातळी सतत चांगली राहते.", "कधीकधी, प्रामुख्याने दुपारच्या वेळी.", "नेहमीच थकवा जाणवतो, ज्यामुळे दैनंदिन कामे कठीण वाटतात.", "सतत थकवा असतो, सकाळी उठल्यावरही थकल्यासारखे वाटते."],
                        explanation: "सतत चांगली ऊर्जा असणे संतुलित चयापचय आणि मजबूत जीवन शक्ती (Vital Force) दर्शवते."
                    },
                    {
                        q: "सकाळी उठल्यावर तुम्हाला कसे वाटते?",
                        options: ["ताजेतवाने, उत्साही आणि मन प्रसन्न असते.", "थोडं जड वाटतं, पण १५ मिनिटांत ठीक होतं.", "थकल्यासारखे वाटते, काम करण्यासाठी चहा/कॉफीची गरज पडते.", "अतिशय थकवा जाणवतो, जणू काही झोपच झाली नाही."],
                        explanation: "सकाळची स्थिती गाढ झोप (REM Sleep) आणि शारीरिक पुनर्प्राप्तीची कार्यक्षमता दर्शवते."
                    },
                    {
                        q: "तुमचे शरीर तापमानातील बदल किंवा हवामानातील बदलांना कसा प्रतिसाद देते?",
                        options: ["सहजपणे जुळवून घेते, क्वचितच सर्दी-खोकला होतो.", "किरकोळ जडपणा/शिंका येतात, पण २४ तासांत बरे वाटते.", "हवामान बदलल्यावर वारंवार संसर्ग किंवा आजार होतात.", "अतिशय संवेदनशील आहे; हवामान बदलले की जुने आजार बळावतात."],
                        explanation: "हवामानातील बदलांना शरीराने दिलेला प्रतिसाद हा होमिओपॅथीमधील एक महत्त्वाचा संवैधानिक निकष आहे."
                    }
                ]
            },
            stress: {
                title: "तणाव आणि मज्जासंस्था मूल्यांकन",
                questions: [
                    {
                        q: "दैनिक छोट्या-छोट्या कामांबद्दल तुम्हाला किती वेळा काळजी किंवा तणाव जाणवतो?",
                        options: ["क्वचितच, मी शांतपणे कामे हाताळतो.", "कधीकधी, जेव्हा कामाचा ताण वाढतो.", "वारंवार तणाव येतो, ज्यामुळे खांदे किंवा जबड्यामध्ये ताण जाणवतो.", "जवळजवळ सतत; डोक्यात सतत विचार चालू असतात."],
                        explanation: "तणावामुळे मज्जासंस्थेवर जास्त भार पडतो, ज्यामुळे हळूहळू रोगप्रतिकारक शक्ती कमी होते."
                    },
                    {
                        q: "तणावाखाली असताना छातीत धडधडणे किंवा श्वास आखडल्यासारखा वाटतो का?",
                        options: ["नाही, श्वासोच्छ्वास सामान्य राहतो.", "क्वचितच, फक्त अत्यंत दबावाच्या वेळी.", "होय, श्वास आखडतो आणि हृदयाचे ठोके वेगाने पडतात.", "नेहमीच धडधडते, कधीकधी पॅनिक झाल्यासारखे वाटते."],
                        explanation: "धडधडणे मज्जासंस्थेची उच्च संवेदनशीलता दर्शवते, जी संवैधानिक होमिओपॅथिक उपचारांनी बरी केली जाऊ शकते."
                    }
                ]
            },
            sleep: {
                title: "झोप आणि पुनर्प्राप्ती मूल्यांकन",
                questions: [
                    {
                        q: "तुम्हाला रात्री सरासरी किती तास अखंड आणि शांत झोप मिळते?",
                        options: ["७ ते ९ तास सतत शांत झोप.", "६ ते ७ तास; साधारण विश्रांती मिळते.", "५ ते ६ तास; सकाळी उठल्यावर थकवा जाणवतो.", "५ तासांपेक्षा कमी; झोपेची तीव्र कमतरता."],
                        explanation: "शांत आणि गाढ झोप शरीराच्या पेशींची दुरुस्ती आणि जीवन शक्ती पुनर्संचयित करण्यास मदत करते."
                    },
                    {
                        q: "तुम्हाला झोप लागण्यास अडचण येते का किंवा रात्री वारंवार डोळे उघडतात का?",
                        options: ["خوپ क्वचितच, लगेच झोप लागते आणि रात्रभर झोप मिळते.", "कधीकधी झोप लागण्यास ३० मिनिटांपर्यंत वेळ लागतो.", "वारंवार झोप मोड होते, पण पुन्हा झोप लागते.", "तीव्र निद्रानाश; रात्री अनेकदा उठणे आणि पुन्हा झोप न लागणे."],
                        explanation: "वारंवार झोप मोड होणे मज्जासंस्थेची अति-संवेदनशीलता किंवा कॉर्टिसोल संप्रेरकाचे असंतुलन दर्शवते."
                    }
                ]
            },
            digestive: {
                title: "पाचन आणि आतड्यांचे आरोग्य मूल्यांकन",
                questions: [
                    {
                        q: "जेवणानंतर तुम्हाला किती वेळा पोट फुगणे, गॅस किंवा ॲसिडिटीचा त्रास होतो?",
                        options: ["क्वचितच, पचनक्रिया सुरळीत आणि हलकी वाटते.", "कधीकधी, तिखट किंवा तेलकट जेवणानंतर.", "वारंवार, अगदी साध्या घरगुती जेवणानंतरही.", "जवळपास दररोज; गॅस आणि पोट फुगण्याचा तीव्र त्रास होतो."],
                        explanation: "पाचन क्षमता ही पोषक तत्वांचे शोषण आणि पेशींच्या ऊर्जा निर्मितीचा पाया आहे."
                    },
                    {
                        q: "पोट साफ होण्याच्या नियमिततेचे मूल्यांकन करा:",
                        options: ["दररोज नियमित पोट साफ होते; सामान्य मलप्रवृत्ती.", "किरकोळ अनियमितता (कधीतरी एखादा दिवस चुकणे) किंवा पातळ मल.", "वारंवार बद्धकोष्ठता (Constipation) किंवा जुनाट पातळ जुलाब.", "तीव्र बद्धकोष्ठता किंवा रोज आयबीएस (IBS) चा त्रास."],
                        explanation: "आतड्यांचे आरोग्य हे शरीराची डिटॉक्स (विषारी घटक बाहेर टाकणे) क्षमता दर्शवते."
                    }
                ]
            },
            metabolic: {
                title: "चयापचय आणि ऊर्जा मूल्यांकन",
                questions: [
                    {
                        q: "तुमचे वजन किती स्थिर राहते आणि जेवणानंतर कशी प्रतिक्रिया होते (सुस्ती/गोड खाण्याची तीव्र इच्छा)?",
                        options: ["वजन स्थिर असते, भूक संतुलित राहते, गोड खाण्याची तीव्र इच्छा होत नाही.", "किरकोळ चढ-उतार, कधीकधी दुपारच्या वेळी गोड खाण्याची इच्छा.", "वजन कमी करण्यास अडचण येते, जेवणानंतर सुस्ती येते.", "चयापचय मंदावणे, तीव्र इच्छा होणे, वजन वेगाने बदलणे."],
                        explanation: "चयापचय आरोग्य तुमचे थायरॉईड, इन्सुलिन संवेदनशीलता आणि शारीरिक क्षमता ठरवते."
                    },
                    {
                        q: "तुम्हाला तापमानातील बदलांची संवेदनशीलता जाणवते का (हात-पाय थंड पडणे किंवा उष्णता सहन न होणे)?",
                        options: ["सामान्य तापमानात सहज राहू शकतो; कोणतीही अति-संवेदनशीलता नाही.", "हिवाळ्यात कधीतरी हात-पाय थंड पडणे.", "नेहमीच हात आणि पाय थंड पडतात; गरम कपड्यांची गरज भासते.", "उष्णता किंवा थंडी अजिबात सहन न होणे; शरीर तापमान राखू शकत नाही."],
                        explanation: "तापमानाची संवेदनशीलता होमिओपॅथीमध्ये थायरॉईड किंवा रक्ताभिसरणातील असंतुलन दर्शवते."
                    }
                ]
            },
            womens: {
                title: "महिलांचे आरोग्य मूल्यांकन",
                questions: [
                    {
                        q: "तुमचे मासिक पाळीचे चक्र नियमित आहे का आणि पाळीच्या वेळी वेदನಾ किंवा मुड बदलतात का?",
                        options: ["नियमित चक्र, खूप कमी किंवा अजिबात वेदना/मूड बदलत नाही.", "किरकोळ वेदना किंवा चिडचिड, २५-३५ दिवसांच्या दरम्यान नियमित चक्र.", "वारंवार पोट दुखणे, जास्त रक्तस्त्राव किंवा अनियमित पाळी.", "पाळीपूर्वी तीव्र त्रास (PMS/PMDD), पाळीचे सतत अनियमित असणे."],
                        explanation: "हॉर्मोनल संतुलन पेशींचे हायड्रेशन, तणाव प्रतिकारक्षमता आणि हाडांचे आरोग्य नियंत्रित करते."
                    },
                    {
                        q: "तुम्हाला संप्रेरकांच्या (Hormones) बदलांमुळे मुरुम, केस पातळ होणे किंवा हॉट फ्लॅशेस जाणवतात का?",
                        options: ["नाही, त्वचा आणि केस निरोगी व स्थिर राहतात.", "पाळीपूर्वी किरकोळ मुरुम येथे किंवा थोडे केस गळणे.", "केस स्पष्टपणे पातळ होणे, जुनाट मुरुम किंवा हॉट फ्लॅशेस येणे.", "तीव्र पीसीओएस (PCOS) किंवा रजोनिवृत्तीचा त्रास ज्याचा दैनंदिन जीवनावर परिणाम होतो."],
                        explanation: "अंतःस्रावी (Endocrine) संतुलन तणाव आणि जीवन शक्तीच्या तीव्रतेवर अवलंबून असते."
                    }
                ]
            },
            mens: {
                title: "पुरुषांचे आरोग्य मूल्यांकन",
                questions: [
                    {
                        q: "शारीरिक कष्टांनंतर तुमची क्षमता आणि पूर्वस्थितीत येण्याचा कालावधी (Recovery time) कसा असतो?",
                        options: ["उत्कृष्ट क्षमता, खूप लवकर रिकव्हरी होते.", "चांगली क्षमता, कधीकधी दुसऱ्या दिवशी थकवा जाणवतो.", "कमी क्षमता, मध्यम व्यायामातून बरे होण्यासाठीही काही दिवस लागतात.", "सतत थकल्यासारखे वाटते; शारीरिक क्षमता अगदी नगण्य."],
                        explanation: "शारीरिक क्षमता हृदयाची ताकद आणि शरीरातील ऑक्सिजन पातळी दर्शवते."
                    },
                    {
                        q: "दिवसभरातील तुमचे मानसिक लक्ष, ऊर्जेची स्थिरता आणि एकाग्रतेची पातळी कशी असते?",
                        options: ["अतिशय तीक्ष्ण आणि स्थिर लक्ष, कोणताही गोंधळ (Brain fog) नसतो.", "चांगले लक्ष असते, जास्त तणावाच्या वेळी किरकोळ गोंधळ जाणवतो.", "वारंवार गोंधळ होतो, एकाग्रतेसाठी संघर्ष करावा लागतो.", "लक्ष केंद्रित करण्यास तीव्र अडचण, दुपारच्या वेळी जास्त थकवा जाणवणे."],
                        explanation: "शारीरिक क्षमता आणि लक्ष एकाग्रता ॲड्रिनल ग्रंथींचे कार्य आणि टेस्टोस्टेरॉन-कॉर्टिसोल पातळी दर्शवते."
                    }
                ]
            }
        }
    };

    function updateUILocalization() {
        const dict = UI_LOCALIZATION[state.lang] || UI_LOCALIZATION.en;
        
        // Update Tab Button Labels (preserving font-awesome icons)
        const tabsMap = {
            chat: { icon: 'fa-comments', text: dict.tab_chat },
            companion: { icon: 'fa-heart-pulse', text: dict.tab_companion },
            assessments: { icon: 'fa-clipboard-question', text: dict.tab_assessments },
            symptoms: { icon: 'fa-notes-medical', text: dict.tab_symptoms },
            reports: { icon: 'fa-file-medical', text: dict.tab_reports },
            materia: { icon: 'fa-book-medical', text: dict.tab_materia },
            wellness: { icon: 'fa-calendar-days', text: dict.tab_wellness }
        };
        
        Object.entries(tabsMap).forEach(([tabName, data]) => {
            const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
            if (btn) {
                btn.innerHTML = `<i class="fa-solid ${data.icon}"></i> ${data.text}`;
            }
        });

        // Update Headings and Labels
        const selectors = {
            '#lbl-welcome-title': dict.welcome_title,
            '#lbl-welcome-desc': dict.welcome_desc,
            '#lbl-organ-title': `<i class="fa-solid fa-lungs"></i> ${dict.organ_title}`,
            '#lbl-organ-sub': dict.organ_sub,
            '#lbl-risk-title': `<i class="fa-solid fa-shield-halved"></i> ${dict.risk_title}`,
            '#lbl-risk-sub': dict.risk_sub,
            '#lbl-consult-title': `<i class="fa-solid fa-calendar-check"></i> ${dict.consult_title}`,
            '#lbl-consult-sub': dict.consult_sub,
            '#lbl-daily-title': `<i class="fa-solid fa-pen-to-square"></i> ${dict.daily_title}`,
            '#lbl-daily-sub': dict.daily_sub,
            '#lbl-sleep-duration': `<i class="fa-solid fa-bed"></i> ${dict.sleep_duration}`,
            '#lbl-water-intake': `<i class="fa-solid fa-glass-water"></i> ${dict.water_intake}`,
            '#lbl-water-glasses': dict.water_glasses,
            '#lbl-exercise-dur': `<i class="fa-solid fa-person-running"></i> ${dict.exercise_dur}`,
            '#lbl-stress-lvl': `<i class="fa-solid fa-brain"></i> ${dict.stress_lvl}`,
            '#lbl-weight-lbs': `<i class="fa-solid fa-weight-scale"></i> ${dict.weight_lbs}`,
            '#lbl-save-vitals-btn': dict.save_vitals,
            '#lbl-goals-title': `<i class="fa-solid fa-ranking-stars"></i> ${dict.goals_title}`,
            '#lbl-goals-sub': dict.goals_sub,
            '#lbl-assessments-title': `<i class="fa-solid fa-clipboard-list"></i> ${dict.assessments_title}`,
            '#lbl-assessments-sub': dict.assessments_sub,
            '#lbl-symptoms-title': `<i class="fa-solid fa-notes-medical"></i> ${dict.symptoms_title}`,
            '#lbl-symptoms-sub': dict.symptoms_sub,
            '#lbl-symp-concern': dict.symp_concern,
            '#lbl-symp-duration': dict.symp_duration,
            '#lbl-symp-triggers': dict.symp_triggers,
            '#lbl-symp-relieving': dict.symp_relieving,
            '#lbl-symp-associated': dict.symp_associated,
            '#generate-symp-btn': dict.generate_symp_btn,
            '#lbl-reports-title': `<i class="fa-solid fa-file-pdf"></i> ${dict.reports_title}`,
            '#lbl-reports-sub': dict.reports_sub,
            '#lbl-materia-title': `<i class="fa-solid fa-book-medical"></i> ${dict.materia_title}`,
            '#lbl-materia-sub': dict.materia_sub,
            '#lbl-wellness-title': `<i class="fa-solid fa-calendar-days"></i> ${dict.wellness_title}`,
            '#lbl-wellness-sub': dict.wellness_sub
        };

        Object.entries(selectors).forEach(([sel, text]) => {
            const el = document.querySelector(sel);
            if (el) {
                el.innerHTML = text;
            }
        });

        // Search inputs placeholders
        const materiaInput = document.getElementById('materia-search-input');
        if (materiaInput) {
            materiaInput.placeholder = dict.materia_search_placeholder;
        }
    }


    // ---------------------------------------------------------
    // Chat & Dialog Engine
    // ---------------------------------------------------------
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatContainer = document.getElementById('chat-thread-container');
    const typingIndicator = document.getElementById('typing-indicator');
    const avatarRing = document.querySelector('.avatar-ring');

    // Send Message
    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Append User Msg
        appendUserMessage(text);
        chatInput.value = "";

        // Trigger Lucy Thinking & Response
        showTyping(true);
        setTimeout(() => {
            generateLucyResponse(text);
        }, 1200);
    }

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
    chatInput.addEventListener('focus', cancelSpeaking);
    chatInput.addEventListener('input', cancelSpeaking);

    function appendUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = "chat-msg user-msg";
        msg.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
            <div class="msg-content">
                <p>${escapeHTML(text)}</p>
            </div>
        `;
        chatContainer.appendChild(msg);
        scrollToBottom();
    }

    function appendLucyMessage(text, isDisclaimerNeeded = false, isEmergency = false) {
        showTyping(false);
        const msg = document.createElement('div');
        msg.className = isEmergency ? "chat-msg lucy-msg emergency-msg" : "chat-msg lucy-msg";
        
        let disclaimerHTML = "";
        if (isDisclaimerNeeded) {
            disclaimerHTML = `<span class="msg-disclaimer"><i class="fa-solid fa-circle-exclamation"></i> ${TRANSLATIONS.disclaimer[state.lang]}</span>`;
        }

        // Generate WhatsApp CTA button if not an emergency message and context matches
        let whatsappBtnHTML = "";
        if (!isEmergency) {
            const textLower = text.toLowerCase();
            const triggers = ["book", "appointment", "consultation", "consult with", "whatsapp", "schedule a", "cannot prescribe", "can't prescribe", "prescription"];
            const hasTrigger = triggers.some(trigger => textLower.includes(trigger));
            
            if (hasTrigger) {
                const waUrl = getWhatsAppLink("book a consultation");
                whatsappBtnHTML = `
                    <div class="chat-cta-container" style="margin-top: 12px; margin-bottom: 4px;">
                        <a href="${waUrl}" target="_blank" class="chat-whatsapp-btn" style="
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            background: #25D366;
                            color: white;
                            text-decoration: none;
                            padding: 8px 14px;
                            border-radius: 8px;
                            font-size: 0.8rem;
                            font-weight: 500;
                            box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2);
                            transition: all 0.2s;
                        ">
                            <i class="fa-brands fa-whatsapp"></i> Book Consultation via WhatsApp
                        </a>
                    </div>
                `;
            }
        }

        msg.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-user-doctor"></i></div>
            <div class="msg-content">
                <p>${text}</p>
                ${whatsappBtnHTML}
                ${disclaimerHTML}
            </div>
        `;
        chatContainer.appendChild(msg);
        scrollToBottom();

        // Voice output (TTS) if enabled
        if (state.ttsEnabled && !isEmergency) {
            speakText(text);
        }
    }

    function showTyping(show) {
        if (show) {
            typingIndicator.classList.remove('hidden');
            scrollToBottom();
        } else {
            typingIndicator.classList.add('hidden');
        }
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Safety Layer check
    function checkForEmergency(text) {
        const emergencyKeywords = [
            "chest pain", "chest tightness", "heart attack", "left arm pain",
            "stroke", "slurred speech", "facial drooping", "face numbness",
            "severe breathing difficulty", "cant breathe", "difficulty breathing",
            "suicide", "suicidal", "kill myself", "end my life"
        ];

        const lowercase = text.toLowerCase();
        return emergencyKeywords.some(keyword => lowercase.includes(keyword));
    }

    const MOCK_LOCAL_TRANSLATIONS = {
        appointment: {
            en: "Would you like me to help schedule a consultation with **Dr. Narayan Jethwani**? You can use the Quick Call to Action buttons on the dashboard or directly chat with the reception on WhatsApp.",
            hi: "क्या आप डॉ. नारायण जेठवानी के साथ परामर्श का समय निर्धारित करना चाहते हैं? कृपया डैशबोर्ड पर अपॉइंटमेंट बटन का उपयोग करें या सीधे व्हाट्सएप पर चैट करें।",
            mr: "तुम्हाला डॉ. नारायण जेठवानी यांच्यासोबत भेटीची वेळ बुक करायची आहे का? कृपया यासाठी डाव्या बाजूच्या अपॉइंटमेंट पॅनेलचा वापर करा किंवा थेट व्हॉट्सॲपवर संपर्क साधा.",
            gu: "શું તમે ડૉ. નારાયણ જેઠવાની સાથે પરામર્શ નક્કી કરવા માંગો છો? કૃપા કરીને ડેશબોર્ડ પરના એપોઇન્ટમેન્ટ બટનનો ઉપયોગ કરો અથવા સીધા વોટ્સએપ પર ચેટ કરો.",
            bn: "আপনি কি ডাঃ নারায়ণ জেঠওয়ানির সাথে অ্যাপয়েন্টমেন্ট নির্ধারণ করতে চান? দয়া করে ড্যাশবোর্ডের অ্যাপয়েন্টমেন্ট বোতামটি ব্যবহার করুন বা সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন।",
            te: "మీరు డాక్టర్ నారాయణ్ జెత్వాని గారితో కన్సల్టేషన్ బుక్ చేయాలనుకుంటున్నారా? దయచేసి డ్యాష్‌బోర్డ్ లో ఉన్న అపాయింట్‌మెంట్ బటన్ ఉపయోగించండి లేదా నేరుగా వాట్సాప్ లో చాట్ చేయండి.",
            ta: "நீங்கள்  டாக்டர் நாராயண் ஜெத்வானியுடன் ஆலோசனைக்கான சந்திப்பை ஒதுக்க விரும்புகிறீர்களா? தயவுசெய்து டேஷ்போர்டில் உள்ள அப்பாயிண்ட்மெண்ட் பட்டனைப் பயன்படுத்தவும் அல்லது நேரடியாக வாட்ஸ்அப்பில் அரட்டையடிக்கவும்.",
            kn: "ನೀವು ಡಾ. ನಾರಾಯಣ್ ಜೇಠ್ವಾನಿ ಅವರೊಂದಿಗೆ ಸಮಾಲೋಚನೆಯನ್ನು ನಿಗದಿಪಡಿಸಲು ಬಯಸುತ್ತೀರಾ? ದಯವಿಟ್ಟು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬಟನ್ ಬಳಸಿ ಅಥವಾ ನೇರವಾಗಿ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ."
        },
        vitality: {
            en: "Your current **Vitality Score is {score}/100** and estimated **Biological Age is {age} years** (chronological baseline is 35). A comprehensive vitality metric is calibrated using sleep patterns, exercise, stress levels, and completed wellness profile assessments.",
            hi: "आपका वर्तमान **वाइटैलिटी स्कोर {score}/100** है और अनुमानित **जैविक आयु {age} वर्ष** है (कालानुक्रमिक आधार 35 है)। यह स्कोर आपके दैनिक लॉग और पूर्ण किए गए स्वास्थ्य आकलनों पर आधारित है।",
            mr: "तुमचा चालू **वाइटॅलिटी स्कोअर {score}/100** असून अंदाजित **जैविक वय {age} वर्षे** आहे (chronological baseline ३५ वर्षे आहे). हे वय तुमच्या झोप, व्यायाम, पाणी आणि दैनंदिन स्वास्थ्य आकलनावरून ठरवले जाते.",
            gu: "તમારો વર્તમાન **વાઇટેલિટી સ્કોર {score}/100** છે અને જૈવિક ઉંમર {age} વર્ષ છે. સ્વસ્થ જીવનશૈલી અપનાવીને તેને હજી સુધારી શકાય છે.",
            bn: "আপনার বর্তমান **ভাইট্যালিটি স্কোর {score}/100** এবং জৈবিক বয়স {age} বছর। স্বাস্থ্যকর জীবনযাত্রার মাধ্যমে এটি আরও উন্নত করা সম্ভব।",
            te: "మీ ప్రస్తుత **వైటాలిటీ స్కోర్ {score}/100** మరియు జీవసంబంధ వయస్సు {age} సంవత్సరాలు. ఆరోగ్యకరమైన జీవనశైలితో దీనిని మరింత మెరుగుపరచవచ్చు.",
            ta: "உங்களது தற்போதைய **வைட்டாலிటీ ஸ்கோர் {score}/100** மற்றும் உயிரியல் வயது {age} ஆண்டுகள் ஆகும். ஆரோக்கியமான வாழ்க்கை முறை மூலம் இதை மேலும் மேம்படுத்தலாம்.",
            kn: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ **ವೈಟಾಲಿಟಿ ಸ್ಕೋರ್ {score}/100** ಮತ್ತು ಜೈವಿಕ ವಯಸ್ಸು {age} ವರ್ಷಗಳು. ಆರೋಗ್ಯಕರ ಜೀವನಶೈಲಿಯಿಂದ ಇದನ್ನು ಇನ್ನಷ್ಟು ಸುಧಾರಿಸಬಹುದು."
        },
        water: {
            en: "Proper hydration is crucial. You've logged {water} glasses of water today. Drinking 2.5 to 3 liters of filtered water daily maintains cellular hydration and supports renal clearance. Aim for at least 8 glasses!",
            hi: "पानी पीना अत्यंत आवश्यक है। आज आपने {water} गिलास पानी पिया है। आदर्श रूप से प्रतिदिन कम से कम 8 गिलास (2 लीटर) पानी पीना चाहिए ताकि शरीर के विषैले तत्व बाहर निकल सकें।",
            mr: "योग्य जलhydration महत्वाचे आहे. आपण आज {water} ग्लास पाणी प्यायले आहे. दररोज किमान ८ ग्लास (२ लीटर) पाणी पिण्याचे ध्येय ठेवा जेणेकरून शरीरातील विषारी घटक बाहेर पडतील.",
            gu: "યોગ્ય હાઇડ્રેશન ખૂબ મહત્વનું છે. આજે તમે {water} ગ્લાસ પાણી પીધું છે. દરરોજ ઓછામાં ઓછા ૮ ગ્લાસ (૨ લિટર) પાણી પીવાનું લક્ષ્ય રાખો!",
            bn: "পর্যাপ্ত জল পান করা অত্যন্ত গুরুত্বপূর্ণ। আজ আপনি {water} গ্লাস জল পান করেছেন। প্রতিদিন কমপক্ষে ৮ গ্লাস (২ লিটার) জল পান করার লক্ষ্য রাখুন!",
            te: "శరీరానికి తగినంత నీరు అందించడం చాలా ముఖ్యం. ఈరోజు మీరు {water} గ్లాసుల నీరు తాగారు. ప్రతిరోజూ కనీసం 8 గ్లాసుల (2 లీటర్లు) నీరు తాగాలని లక్ష్యంగా పెట్టుకోండి!",
            ta: "சரியான நீரேற்றம் மிகவும் முக்கியம். இன்று நீங்கள் {water} ग्लास தண்ணீர் குடித்திருக்கிறீர்கள். தினமும் குறைந்தது 8 கிளாஸ் (2 லிட்டர்) தண்ணீர் குடிக்க இலக்கு வையுங்கள்!",
            kn: "ದೇಹದ ಹೈಡ್ರೇಶನ್ ತುಂಬಾ ಮುಖ್ಯವಾಗಿದೆ. ಇಂದು ನೀವು {water} ಗ್ಲಾಸ್ ನೀರು ಕುಡಿದಿದ್ದೀರಿ. ಪ್ರತಿದಿನ ಕನಿಷ್ಠ 8 ಗ್ಲಾಸ್ (2 ಲೀಟರ್) ನೀರು ಕುಡಿಯುವ ಗುರಿ ಇಟ್ಟುಕೊಳ್ಳಿ!"
        },
        sleep: {
            en: "You logged {sleep} hours of sleep last night. Tips for optimal sleep recovery include: maintaining a consistent sleep schedule and avoiding screen exposure at least 1 hour before sleeping to support natural melatonin production.",
            hi: "आपने कल रात {sleep} घंटे की नींद ली। बेहतर नींद के लिए सुझाव: मोबाइल/स्क्रीन सोने से 1 घंटे पहले बंद करें और सोने का समय निश्चित रखें ताकि प्राकृतिक मेलाटोनिन बन सके।",
            mr: "तुम्ही काल रात्री {sleep} तास झोप घेतली. चांगल्या झोपेसाठी टिप्स: झोपण्यापूर्वी १ तास आधी स्क्रीन बंद करा आणि वेळेवर झोपा जेणेकरून शांत झोप येईल.",
            gu: "તમે ગઈકાલે રાત્રે {sleep} કલાકની ઊંઘ લીધી. સારી ઊંઘ માટે ટિપ્સ: સૂવાના ૧ કલાક પહેલા સ્ક્રીન બંધ કરો અને સમય નક્કી રાખો.",
            bn: "আপনি গত রাতে {sleep} ঘণ্টা ঘুমিয়েছেন। ভালো ঘুমের জন্য পরামর্শ: ঘুমানোর ১ ঘণ্টা আগে স্ক্রিন বন্ধ করুন এবং নিয়মিত সময় বজায় রাখুন।",
            te: "మీరు నిన్న రాత్రి {sleep} గంటలు నిద్రపోయారు. మంచి నిద్ర కోసం చిట్కాలు: నిద్రపోయే 1 గంట ముందు స్క్రీన్ ఆపివేయండి.",
            ta: "நீங்கள் நேற்று இரவு {sleep} மணிநேரம் தூங்கினீர்கள். நல்ல தூக்கத்திற்கான குறிப்புகள்: தூங்குவதற்கு 1 மணி நேரத்திற்கு முன் மொபைலைத் தவிர்க்கவும்.",
            kn: "ನಿಮ್ಮು ನಿನ್ನೆ ರಾತ್ರಿ {sleep} ಗಂಟೆ ನಿದ್ರಿಸಿದ್ದೀರಿ. ಉತ್ತಮ ನಿದ್ರೆಗಾಗಿ ಸಲಹೆಗಳು: ಮಲಗುವ 1 ಗಂಟೆ ಮೊದಲು ಮೊಬೈಲ್ ಬಳಕೆಯನ್ನು ನಿಲ್ಲಿಸಿ."
        },
        assess: {
            en: "I can guide you through a comprehensive wellness assessment (Vitality, Stress, Digestive, Metabolic, Sleep). Please use the **Vitals Assessments** tab on the left to start a structured questionnaire!",
            hi: "मैं स्वास्थ्य मूल्यांकन (वाइटैलिटी, तनाव, पाचन, चयापचय, नींद) में आपका मार्गदर्शन कर सकती हूँ। कृपया शुरू करने के लिए बाईं ओर 'Vitals Assessments' टैब पर जाएँ।",
            mr: "मी आरोग्य मूल्यांकन (वाइटॅलिटी, ताण, पचन, चयापचय, झोप) मध्ये मदत करू शकते। कृपया डाव्या बाजूच्या 'Vitals Assessments' टॅबचा वापर करा।",
            gu: "હું તમને આરોગ્ય મૂલ્યાંકન (વાઇટેલિટી, તણાવ, પાચન, ચયાપચય, ઊંઘ) માં માર્ગદર્શન આપી શકું છું. કૃપા કરીને શરૂ કરવા માટે ડાબી બાજુના 'Vitals Assessments' ટેબ પર જાઓ.",
            bn: "আমি আপনাকে স্বাস্থ্য মূল্যায়নের (ভাইট্যালিটি, মানসিক চাপ, পরিপাক, বিপাক, ঘুম) নির্দেশিকা দিতে পারি। দয়া করে বাম দিকের 'Vitals Assessments' ট্যাবে যান।",
            te: "నేను మీకు ఆరోగ్య అంచనా (వైటాలిటీ, ఒత్తిడి, జీర్ణక్రియ, జీవక్రియ, నిద్ర) లో సహాయపడగలను. దయచేసి ఎడమ వైపున ఉన్న 'Vitals Assessments' ట్యాబ్‌ను ఉపయోగించండి.",
            ta: "நான் உங்களுக்கு ஆரோக்கிய மதிப்பீட்டில் (வைட்டாலிటీ, மன அழுத்தம், செரிமானம், வளர்சிதை மாற்றம், தூக்கம்) வழிகாட்ட முடியும். தயவுசெய்து இடதுபுறத்தில் உள்ள 'Vitals Assessments' தாவலுக்குச் செல்லவும்.",
            kn: "ನಾನು ನಿಮಗೆ ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನದಲ್ಲಿ (ವೈಟಾಲಿಟಿ, ಒತ್ತಡ, ಜೀರ್ಣಕ್ರಿಯೆ, ಚಯಾಪಚಯ, ನಿದ್ರೆ) ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ದಯವಿಟ್ಟು ಎಡಭಾಗದಲ್ಲಿರುವ 'Vitals Assessments' ಟ್ಯಾಬ್ ಬಳಸಿ."
        },
        symptoms: {
            en: "I see you are mentioning symptoms. To help you prepare a structured summary for Dr. Jethwani, please go to the **Symptom Navigator** tab on the left. Type your duration, triggers, and severity, and I will generate a clean report for you.",
            hi: "यदि आप लक्षणों के बारे में बात कर रहे हैं, तो डॉ. जेठवानी के लिए एक संरचित रिपोर्ट तैयार करने के लिए बाईं ओर 'Symptom Navigator' टैब का उपयोग करें।",
            mr: "डॉ. जेठवानी यांच्यासाठी लक्षणांचा अहवाल तयार करण्यासाठी डाव्या बाजूच्या 'Symptom Navigator' टॅबचा वापर करा।",
            gu: "ડૉ. જેઠવાની માટે લક્ષણોનો અહેવાલ તૈયાર કરવા માટે ડાબી બાજુના 'Symptom Navigator' ટેબનો ઉપયોગ કરો.",
            bn: "ডাঃ জেঠওয়ানির জন্য একটি কাঠামোগত লক্ষণ রিপোর্ট তৈরি করতে বাম দিকের 'Symptom Navigator' ট্যাবে যান।",
            te: "డాక్టర్ జెత్వాని గారి కోసం లక్షణాల నివేదికను రూపొందించడానికి ఎడమ వైపున ఉన్న 'Symptom Navigator' ట్యాబ్‌ను సందర్శించండి.",
            ta: "டாக்டர் ஜெத்வானிக்கான அறிகுறிகளின் சுருக்கத்தை உருவாக்க இடதுபுறத்தில் உள்ள 'Symptom Navigator' தாவலுக்குச் செல்லவும்.",
            kn: "ಡಾ. ಜೇಠ್ವಾನಿ ಅವರಿಗಾಗಿ ಲಕ್ಷಣಗಳ ವರದಿಯನ್ನು ತಯಾರಿಸಲು ಎಡಭಾಗದಲ್ಲಿರುವ 'Symptom Navigator' ಟ್ಯಾಬ್ ಬಳಸಿ."
        },
        report: {
            en: "To interpret blood reports or labs (CBC, Lipid panel, Thyroid panel), navigate to the **Report Interpreter** tab on the left. You can simulate file uploads there to see immediate easy-to-understand findings.",
            hi: "रक्त परीक्षण रिपोर्ट (CBC, लिपिड, थायराइड) को समझने के लिए बाईं ओर 'Report Interpreter' टैब पर जाएँ। वहाँ रिपोर्ट अपलोड का अनुकरण करें।",
            mr: "रक्त अहवाल समजून घेण्यासाठी डाव्या बाजूच्या 'Report Interpreter' टॅबवर जा।",
            gu: "લોહીના રિપોર્ટ (CBC, લિપિડ, થાઇરોઇડ) સમજવા માટે ડાબી બાજુના 'Report Interpreter' ટેબ પર જાઓ.",
            bn: "রক্ত পরীক্ষার রিপোর্ট (CBC, লিপিড, থাইরয়েড) বোঝার জন্য বাম দিকের 'Report Interpreter' ট্যাবে যান।",
            te: "రక్త పరీక్షల నివేదికలను (CBC, లిపిడ్, థైరాయిడ్) అర్థం చేసుకోవడానికి ఎడమ వైపున ఉన్న 'Report Interpreter' ట్యాబ్‌కు వెళ్లండి.",
            ta: "இரத்த பரிசோதனை அறிக்கைகளை (CBC, லிப்பிட், தைராய்டு) புரிந்து கொள்ள இடதுபுறத்தில் உள்ள 'Report Interpreter' தாவலுக்குச் செல்லவும்.",
            kn: "ರಕ್ತ ಪರೀಕ್ಷೆಗಳ ವರದಿಯನ್ನು (CBC, ಲಿಪಿಡ್, ಥೈರಾಯ್ಡ್) ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಎಡಭಾಗದಲ್ಲಿರುವ 'Report Interpreter' ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ."
        },
        welcome: {
            en: "Hello! I'm Lucy, your AI health guide. I'm here to translate complex medical data, help you record symptoms, and support you on your wellness path. Remember, I support Dr. Jethwani's clinical assessment but never replace direct physician consultations.",
            hi: "नमस्ते! मैं लूसी हूँ, आपकी एआई स्वास्थ्य मार्गदर्शिका। मैं यहाँ आपके स्वास्थ्य डेटा को समझाने और लक्षणों को रिकॉर्ड करने में मदद के लिए हूँ। कृपया ध्यान दें कि मैं केवल डॉक्टर की सहायता करती हूँ, परामर्श का विकल्प नहीं हूँ।",
            mr: "नमस्कार! मी लुसी आहे, तुमची एआय आरोग्य मार्गदर्शिका. मी येथे आपल्या आरोग्य डेटा स्पष्ट करण्यासाठी आणि लक्षणे नोंदवण्यासाठी आहे। कृपया नोंद घ्या की मी डॉक्टरांचा पर्याय नाही.",
            gu: "નમસ્તે! હું લ્યુસી છું, તમારી AI હેલ્થ ગાઇડ. આજે હું તમને કેવી રીતે મદદ કરી શકું? હું અહીં તમારા સ્વાસ્થ્ય ડેટાને સમજાવવા અને લક્ષણોને રેકોર્ડ કરવામાં મદદ કરવા માટે છું.",
            bn: "নমস্কার! আমি লুসি, আপনার এআই হেলথ গাইড। আমি এখানে আপনার স্বাস্থ্য সম্পর্কিত ডেটা সহজ করতে এবং লক্ষণ রেকর্ড করতে সাহায্য করতে আছি।",
            te: "నమస్తే! నేను లూసీ, మీ AI హెల్త్ గైడ్. మీ ఆరోగ్య సమాచారాన్ని సులభంగా అర్థం చేసుకోవడానికి మరియు మీ లక్షణాలను నమోదు చేయడానికి నేను ఇక్కడ ఉన్నాను.",
            ta: "வணக்கம்! நான் லூசி, உங்கள் AI ஹெல்த் கைடு. உங்கள் ஆரோக்கிய தரவை விளக்கவும், அறிகுறிகளை பதிவு செய்யவும் நான் இங்கு இருக்கிறேன்.",
            kn: "ನಮಸ್ತೆ! ನಾನು ಲೂಸಿ, ನಿಮ್ಮ AI ಹೆಲ್ತ್ ಗೈಡ್. ನಿಮ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ."
        },
        materia: {
            en: "For patient safety, I cannot recommend specific homeopathic remedies, medicines, or dosages in this chat. Remedy selection must be customized to your constitution by a qualified doctor.<br><br>I highly recommend scheduling a clinical consultation with **Dr. Narayan Jethwani** to receive a personalized evaluation and prescription. In the meantime, feel free to ask me about general wellness optimization, hydration guidelines, or sleep hygiene tips.",
            hi: "रोगी की सुरक्षा के लिए, मैं इस चैट में विशिष्ट होम्योपैथिक दवाओं या खुराकों की सिफारिश नहीं कर सकती। दवा का चयन एक योग्य डॉक्टर द्वारा आपके संविधान के अनुसार अनुकूलित किया जाना चाहिए। परामर्श के लिए डॉ. नारायण जेठवानी से संपर्क करें।",
            mr: "रुग्णाच्या सुरक्षेसाठी, मी या चॅटमध्ये होमिओपॅथीक औषधांची किंवा डोसची शिफारस करू शकत नाही। औषध निवड डॉक्टरांद्वारे तुमच्या प्रकृतीनुसार केली पाहिजे. डॉ. नारायण जेठवानी यांच्याशी सल्लामसलत करा।",
            gu: "દર્દીની સુરક્ષા માટે, હું આ ચેટમાં વિશિષ્ટ હોમિયોપેથિક દવાઓની ભલામણ કરી શકતો નથી. દવાઓની પસંદગી ડૉક્ટર દ્વારા તમારા બંધારણ અનુસાર થવી જોઈએ. પરામર્શ માટે ડૉ. નારાયણ જેઠવાની સાથે સંપર્ક કરો.",
            bn: "রোগীর সুরক্ষার জন্য, আমি এই চ্যাটে নির্দিষ্ট হোমিওপ্যাথিক ওষুধের পরামর্শ দিতে পারি না। ওষুধের নির্বাচন একজন ডাক্তারের দ্বারা আপনার সংবিধান অনুযায়ী হওয়া উচিত। অনুগ্রহ করে ডাঃ নারায়ণ জেঠওয়ানির সাথে অ্যাপয়েন্টমেন্ট করুন।",
            te: "రోగి భద్రత కొరకు, నేను ఈ చాట్‌లో నిర్దిష్ట హోమియోపతి మందులను సిఫార్సు చేయలేను. మందుల ఎంపిక డాక్టర్ ద్వారా మీ శరీర తత్వానికి అనుగుణంగా జరగాలి. దయచేసి డాక్టర్ నారాయణ్ జెత్వాని గారిని సంప్రదించండి.",
            ta: "நோயாளி பாதுகாப்பிற்காக, இந்த அரட்டையில் நான் குறிப்பிட்ட ஹோமியோபதி மருந்துகளை பரிந்துரைக்க முடியாது. மருந்து தேர்வு தகுதியான மருத்துவரால் உறுதி செய்யப்பட வேண்டும். தயவுசெய்து டாக்டர் நாராயண் ஜெத்வானியை அணுகவும்.",
            kn: "ರೋಗಿಯ ಸುರಕ್ಷತೆಗಾಗಿ, ಈ ಚಾಟ್‌ನಲ್ಲಿ ನಿರ್ದಿಷ್ಟ ಹೋಮಿಯೋಪತಿ ಔಷಧಿಗಳನ್ನು ಶಿಫారಸು ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ಔಷಧಿಯ ಆಯ್ಕೆಯು ವೈದ್ಯರಿಂದ ನಿಮ್ಮ ದೇಹ ಪ್ರಕೃತಿಗೆ ತಕ್ಕಂತೆ ನಿರ್ಧರಿಸಲ್ಪಡಬೇಕು. ದಯವಿಟ್ಟು ಡಾ. ನಾರಾಯಣ್ ಜೇಠ್ವಾನಿ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ."
        },
        fallback: {
            en: "I understand you are asking about health. To provide the best help, you can use the quick chips below or select a tab on the dashboard to take a **Vitality Assessment**, map your **Symptoms**, or upload a **Health Report** for interpretation.",
            hi: "मुझे आपकी बात समझ आई। स्वास्थ्य संबंधी अधिक सटीक जानकारी के लिए आप वाइटैलिटी मूल्यांकन, लक्षण लॉगिंग, या लैब रिपोर्ट अपलोड विकल्पों का चयन कर सकते हैं।",
            mr: "मला समजले. अधिक माहितीसाठी तुम्ही डाव्या बाजूला असणारे आरोग्य मूल्यांकन पूर्ण करू शकता किंवा तुमची वैद्यकीय रिपोर्ट अपलोड करू शकता.",
            gu: "મને તમારી વાત સમજાઈ. આરોગ્ય સંબંધિત વધુ સચોટ માહિતી માટે તમે વાઇટેલિટી મૂલ્યાંકન પૂર્ણ કરી શકો છો અથવા લેબ રિપોર્ટ અપલોડ કરી શકો છો.",
            bn: "আমি আপনার প্রশ্নটি বুঝতে পেরেছি। স্বাস্থ্য সম্পর্কিত আরও সঠিক তথ্যের জন্য আপনি ভাইট্যালিটি মূল্যায়ন সম্পূর্ণ করতে পারেন বা ল্যাব রিপোর্ট আপলোড করতে পারেন।",
            te: "నేను మీ ప్రశ్నను అర్థం చేసుకున్నాను. మరింత సమాచారం కోసం మీరు వైటాలిటీ అసెస్‌మెంట్ పూర్తి చేయవచ్చు లేదా ల్యాబ్ రిపోర్ట్ అప్‌లోడ్ చేయవచ్చు.",
            ta: "உங்களது கேள்வி எனக்குப் புரிகிறது. ஆரோக்கியம் தொடர்பான கூடுதல் விவரங்களுக்கு நீங்கள் வைட்டாலிட்டி மதிப்பீட்டை முடிக்கலாம் அல்லது ஆய்வக அறிக்கையை பதிவேற்றலாம்.",
            kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ನನಗೆ ಅರ್ಥವಾಯಿತು. ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ನೀವು ವೈಟಾಲಿಟಿ ಮೌಲ್ಯಮಾಪನವನ್ನು ಪೂರ್ಣಗೊಳಿಸಬಹುದು ಅಥವಾ ಲ್ಯಾಬ್ ವರದಿಯನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಬಹುದು."
        }
    };

    // Lucy AI Response Generator
    function generateLucyResponse(inputText) {
        // 1. Safety Filter first
        if (checkForEmergency(inputText)) {
            const emergencyAlert = TRANSLATIONS.emergency[state.lang];
            appendLucyMessage(`<strong>${state.lang === 'hi' ? 'आपातकालीन चेतावनी' : state.lang === 'mr' ? 'आपत्कालीन चेतावणी' : 'EMERGENCY PROTOCOL TRIGGERED'}</strong><br>${emergencyAlert}`, false, true);
            // Alert voice output
            const speechAlerts = {
                en: "This is a medical emergency. Please contact emergency services immediately.",
                hi: "यह एक आपातकालीन स्थिति हो सकती है। कृपया तुरंत डॉक्टर या आपातकालीन चिकित्सा सेवा से संपर्क करें।",
                mr: "ही एक आपत्कालीन वैद्यकीय स्थिती असू शकते. कृपया त्वरित डॉक्टर किंवा आपत्कालीन सेवांशी संपर्क साधा.",
                gu: "આ એક તબીબી કટોકटी હોઈ શકે છે. કૃપા કરીને તાત્કાલિક ડૉક્ટર અથવા ઇમરજન્સી સેવાનો સંપર્ક કરો.",
                bn: "এটি একটি জরুরি চিকিৎসা परिस्थिति হতে পারে। অনুগ্রহ করে অবিলম্বে ডাক্তার বা জরুরি পরিষেবার সাথে যোগাযোগ করুন।",
                te: "ఇది అత్యవసర వైద్య పరిస్థితి కావచ్చు. దయచేసి వెంటనే వైద్యుడిని లేదా అత్యవసర సేవలను సంప్రదించండి.",
                ta: "இது ஒரு அவசர மருத்துவ நிலைமையாக இருக்கலாம். தயவுசெய்து உடனடியாக மருத்துவர் அல்லது அவசர சேவையை தொடர்பு கொள்ளவும்.",
                kn: "ಇದು ತುರ್ತು ವೈದ್ಯಕೀಯ ಪರಿಸ್ಥಿತಿಯಾಗಿರಬಹುದು. ದಯವಿಟ್ಟು ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಅಥವಾ ತುರ್ತು ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ।"
            };
            speakText(speechAlerts[state.lang] || speechAlerts.en);
            return;
        }

        const lowercase = inputText.toLowerCase();

        // 2. Simple Auto Language Detection
        if (/नमस्ते|हैलो|मदद|कैसे हो/.test(inputText)) {
            state.lang = 'hi';
            langSelect.value = 'hi';
        } else if (/नमस्कार|कसे|आरोग्य|मदत/.test(inputText)) {
            state.lang = 'mr';
            langSelect.value = 'mr';
        } else if (/કેમ છો|નમસ્તે|મદદ/.test(inputText)) {
            state.lang = 'gu';
            langSelect.value = 'gu';
        } else if (/নমস্কার|কেমন|সাহায্য/.test(inputText)) {
            state.lang = 'bn';
            langSelect.value = 'bn';
        } else if (/నమస్తే|ఎలా|సహాయం/.test(inputText)) {
            state.lang = 'te';
            langSelect.value = 'te';
        } else if (/வணக்கம்|எப்படி|உதவி/.test(inputText)) {
            state.lang = 'ta';
            langSelect.value = 'ta';
        } else if (/ನಮಸ್ತೆ|ಹೇಗೆ|ಸಹಾಯ/.test(inputText)) {
            state.lang = 'kn';
            langSelect.value = 'kn';
        }

        // 3. Dialogue Routers
        let response = "";
        let requiresDisclaimer = false;

        // Metric questions
        if (lowercase.includes("vitality") || lowercase.includes("biological age") || lowercase.includes("bio age")) {
            const template = MOCK_LOCAL_TRANSLATIONS.vitality[state.lang] || MOCK_LOCAL_TRANSLATIONS.vitality.en;
            response = template.replace("{score}", state.vitalityScore).replace("{age}", state.biologicalAge);
        }
        // Daily trackers
        else if (lowercase.includes("water") || lowercase.includes("drink")) {
            const template = MOCK_LOCAL_TRANSLATIONS.water[state.lang] || MOCK_LOCAL_TRANSLATIONS.water.en;
            response = template.replace("{water}", state.dailyLogs.water);
        }
        else if (lowercase.includes("sleep") || lowercase.includes("insomnia") || lowercase.includes("rest")) {
            const template = MOCK_LOCAL_TRANSLATIONS.sleep[state.lang] || MOCK_LOCAL_TRANSLATIONS.sleep.en;
            response = template.replace("{sleep}", state.dailyLogs.sleep);
        }
        // Doctor consulting
        else if (lowercase.includes("appointment") || lowercase.includes("book") || lowercase.includes("schedule") || lowercase.includes("doctor") || lowercase.includes("jethwani")) {
            response = MOCK_LOCAL_TRANSLATIONS.appointment[state.lang] || MOCK_LOCAL_TRANSLATIONS.appointment.en;
        }
        // Assessment initiation
        else if (lowercase.includes("assess") || lowercase.includes("quiz") || lowercase.includes("test")) {
            response = MOCK_LOCAL_TRANSLATIONS.assess[state.lang] || MOCK_LOCAL_TRANSLATIONS.assess.en;
        }
        // Symptom tracking
        else if (lowercase.includes("symptom") || lowercase.includes("pain") || lowercase.includes("ache")) {
            response = MOCK_LOCAL_TRANSLATIONS.symptoms[state.lang] || MOCK_LOCAL_TRANSLATIONS.symptoms.en;
        }
        // Report interpretation
        else if (lowercase.includes("report") || lowercase.includes("blood") || lowercase.includes("interpret") || lowercase.includes("pdf")) {
            response = MOCK_LOCAL_TRANSLATIONS.report[state.lang] || MOCK_LOCAL_TRANSLATIONS.report.en;
        }
        // General Welcome / Lucy introduction
        else if (lowercase.includes("hello") || lowercase.includes("hi") || lowercase.includes("lucy") || lowercase.includes("who are you")) {
            response = MOCK_LOCAL_TRANSLATIONS.welcome[state.lang] || MOCK_LOCAL_TRANSLATIONS.welcome.en;
        }
        // Materia Medica query check
        else if (lowercase.includes("materia medica") || lowercase.includes("remedy") || lowercase.includes("remedies") || 
                 LUCY_KB.materiaMedica.some(rem => lowercase.includes(rem.name.toLowerCase()) || lowercase.includes(rem.commonName.toLowerCase().split(' ')[0].toLowerCase()))) {
            response = MOCK_LOCAL_TRANSLATIONS.materia[state.lang] || MOCK_LOCAL_TRANSLATIONS.materia.en;
            requiresDisclaimer = false;
        }

        // If we matched a local dialogue rule, return immediately
        if (response) {
            appendLucyMessage(response, requiresDisclaimer);
            return;
        }

        // 4. REST request to consult Gemini AI via Next.js Vercel API
        const xhr = new XMLHttpRequest();
        const apiBase = (window.location.hostname !== "portal.homeo.healthcare")
            ? "https://portal.homeo.healthcare"
            : "";
        xhr.open("POST", apiBase + "/api/consult-ai", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function() {
            let reply = "";
            let isDisclaimerNeeded = true;
            if (xhr.status === 200) {
                try {
                    const res = JSON.parse(xhr.responseText);
                    reply = res.response || "No response received.";
                } catch(e) {
                    reply = "Error parsing response from the clinical AI service.";
                }
            } else {
                reply = "Failed to connect to the clinical AI service. Serving offline fallback:<br><br>" + getOfflineFallback();
                isDisclaimerNeeded = false;
            }

            appendLucyMessage(formatMarkdown(reply), isDisclaimerNeeded);
        };

        xhr.onerror = function() {
            const fallback = "A network error occurred while connecting to the clinical AI. Serving offline fallback:<br><br>" + getOfflineFallback();
            appendLucyMessage(fallback, false);
        };

        xhr.send(JSON.stringify({
            query: inputText,
            score: state.vitalityScore,
            hasAssessments: state.hasAssessments,
            answers: state.assessAnswers,
            logs: state.dailyLogs,
            mode: "patient",
            lang: state.lang
        }));
    }

    function getOfflineFallback() {
        return "I understand you are asking about health. To provide the best help, you can use the quick chips below or select a tab on the dashboard to take a **Vitality Assessment**, map your **Symptoms**, or upload a **Health Report** for interpretation.";
    }

    function formatMarkdown(str) {
        if (!str) return "";
        return str
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br/>');
    }

    // Mock translators for demonstration UI
    function translateToHindiMock(query, englishResp) {
        if (query.includes("appointment") || query.includes("book")) {
            return "क्या आप डॉ. नारायण जेठवानी के साथ परामर्श का समय निर्धारित करना चाहते हैं? कृपया डैशबोर्ड पर अपॉइंटमेंट बटन का उपयोग करें।";
        }
        if (query.includes("vitality") || query.includes("age")) {
            return `आपका वर्तमान वाइटैलिटी स्कोर ${state.vitalityScore}/100 है और जैविक आयु ${state.biologicalAge} वर्ष है। स्वस्थ जीवनशैली अपनाकर इसे और बेहतर किया जा सकता है।`;
        }
        if (query.includes("water") || query.includes("drink")) {
            return "पानी पीना अत्यंत आवश्यक है। आज आपने 6 गिलास पानी पिया है। आदर्श रूप से प्रतिदिन कम से कम 8 गिलास (2 लीटर) पानी पीना चाहिए।";
        }
        return "मुझे आपकी बात समझ आई। स्वास्थ्य संबंधी अधिक सटीक जानकारी के लिए आप वॉटैलिटी मूल्यांकन, लक्षण लॉगिंग, या लैब रिपोर्ट अपलोड विकल्पों का चयन कर सकते हैं।";
    }

    function translateToMarathiMock(query, englishResp) {
        if (query.includes("appointment") || query.includes("book")) {
            return "तुम्हाला डॉ. नारायण जेठवानी यांच्यासोबत भेटीची वेळ बुक करायची आहे का? कृपया यासाठी डाव्या बाजूच्या अपॉइंटमेंट पॅनेलचा वापर करा.";
        }
        if (query.includes("vitality") || query.includes("age")) {
            return `तुमचा चालू वाइटॅलिटी स्कोअर ${state.vitalityScore}/100 असून अंदाजित जैविक वय ${state.biologicalAge} वर्षे आहे. होमिओपॅथी उपचारांनी हे अधिक संतुलित करता येते.`;
        }
        return "मला समजले. अधिक माहितीसाठी तुम्ही डाव्या बाजूला असणारे आरोग्य मूल्यांकन पूर्ण करू शकता किंवा तुमची वैद्यकीय रिपोर्ट अपलोड करू शकता.";
    }


    // ---------------------------------------------------------
    // Text-To-Speech (TTS)
    // ---------------------------------------------------------
    const ttsBtn = document.getElementById('tts-toggle-btn');
    ttsBtn.addEventListener('click', () => {
        state.ttsEnabled = !state.ttsEnabled;
        if (state.ttsEnabled) {
            ttsBtn.classList.add('active');
            ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            ttsBtn.classList.remove('active');
            ttsBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            window.speechSynthesis.cancel(); // Stop talking
        }
        saveState();
    });

    function speakText(text, onStartCallback) {
        if (!('speechSynthesis' in window)) return;
        if (!state.ttsEnabled) return;

        // Cancel current speak
        window.speechSynthesis.cancel();

        // Strip HTML tags for speaking
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/\*\*|__/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        const langMap = {
            hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN', en: 'en-US'
        };
        const activeLangTag = langMap[state.lang] || 'en-US';
        utterance.lang = activeLangTag;

        const speakWithVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            let voice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(activeLangTag.toLowerCase()));
            if (!voice) {
                voice = voices.find(v => v.lang.toLowerCase().startsWith(state.lang));
            }
            if (!voice && state.lang === 'en') {
                voice = voices.find(v => v.name.toLowerCase().includes('female') || 
                                    v.name.toLowerCase().includes('zira') || 
                                    v.name.toLowerCase().includes('samantha'));
            }
            if (voice) {
                utterance.voice = voice;
            }
            
            utterance.rate = 0.95;
            utterance.onstart = () => {
                avatarRing.classList.add('speaking');
                if (onStartCallback) onStartCallback();
            };
            utterance.onend = () => {
                avatarRing.classList.remove('speaking');
            };
            utterance.onerror = () => {
                avatarRing.classList.remove('speaking');
            };

            window.speechSynthesis.speak(utterance);
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = speakWithVoice;
        } else {
            speakWithVoice();
        }
    }

    // Ensure voices are loaded
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {};
    }


    // ---------------------------------------------------------
    // Speech-To-Text (STT)
    // ---------------------------------------------------------
    const micBtn = document.getElementById('mic-btn');
    const voiceWaveContainer = document.getElementById('voice-wave-container');
    let recognition = null;
    let isListening = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        const sttLangMap = {
            hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN'
        };
        recognition.lang = sttLangMap[state.lang] || 'en-US';

        recognition.onstart = () => {
            isListening = true;
            micBtn.classList.add('active-mic');
            voiceWaveContainer.classList.remove('hidden');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            setTimeout(() => {
                handleSendMessage();
            }, 600);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            stopListening();
            
            if (event.error === 'not-allowed') {
                appendLucyMessage("🎤 <strong>Microphone Permission Blocked</strong><br>It looks like microphone access is blocked in your browser settings. Please check your browser's address bar (look for the lock, camera, or microphone icon) or go to your site settings, and change the microphone permission to <strong>'Allow'</strong> to speak with me.");
            } else if (event.error === 'service-not-allowed') {
                appendLucyMessage("🎤 <strong>Voice Service Restricted</strong><br>The browser's speech recognition service is not allowed (error: <em>service-not-allowed</em>). This typically happens if the browser cannot connect to its cloud-based speech servers (Google/Apple), or if voice input is disabled by your system policies. Please verify your internet connection, ensure dictation is enabled on your device, or try using Chrome/Safari.");
            } else if (event.error === 'no-speech') {
                // Silent check fallback
                console.log("Speech recognition: No speech detected.");
            } else {
                appendLucyMessage(`🎤 <strong>Voice Input Error</strong><br>I encountered a speech recognition error: <em>${event.error}</em>. Please try speaking again or typing your message.`);
            }
        };

        recognition.onend = () => {
            stopListening();
        };
    } else {
        micBtn.style.display = 'none'; // Hide mic if not supported
    }

    function stopListening() {
        isListening = false;
        micBtn.classList.remove('active-mic');
        voiceWaveContainer.classList.add('hidden');
        if (recognition) recognition.stop();
    }

    micBtn.addEventListener('click', () => {
        if (!recognition) return;
        if (isListening) {
            stopListening();
        } else {
            // Cancel speech synthesis if Lucy is currently speaking
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            // Set lang context
            const sttLangMap = {
                hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN'
            };
            recognition.lang = sttLangMap[state.lang] || 'en-US';
            recognition.start();
        }
    });


    // ---------------------------------------------------------
    // Quick Chips Clicks
    // ---------------------------------------------------------
    const chipsContainer = document.getElementById('quick-chips-container');
    chipsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.classList.contains('chip-btn')) return;

        cancelSpeaking();
        const action = target.dataset.action;
        const text = target.innerText;

        if (action === 'assess') {
            document.querySelector('[data-tab="assessments"]').click();
            appendLucyMessage("I have opened the Vitals Assessments page. Choose your assessment type above and click 'Start Assessment'!");
        } else if (action === 'symptoms') {
            document.querySelector('[data-tab="symptoms"]').click();
            appendLucyMessage("You can document symptoms inside the navigator tab. Answer the questions to compose a structured clinical report.");
        } else if (action === 'report') {
            document.querySelector('[data-tab="reports"]').click();
            appendLucyMessage("I've opened the report interpreter panel. You can drop PDFs here or click the quick simulation buttons to see blood report analysis.");
        } else if (action === 'appointment') {
            document.querySelector('[data-tab="overview"]').click();
            appendLucyMessage("Let's set up a consultation with Dr. Jethwani. You can book on WhatsApp or via our calendar scheduling system.");
        } else if (action === 'homeo') {
            appendUserMessage("Explain Homeopathy Principle");
            showTyping(true);
            setTimeout(() => {
                appendLucyMessage(`Homeopathic treatment focuses on <strong>Individualization</strong> and the <strong>Law of Similars</strong>. Remedies work by stimulating the Vital Force to trigger deep constitutional recovery.`, true);
            }, 1000);
        }
    });


    // ---------------------------------------------------------
    // Health Assessment Wizard Logic
    // ---------------------------------------------------------
    const startAssessBtn = document.getElementById('start-assess-btn');
    const assessIntro = document.getElementById('assessment-intro');
    const assessActive = document.getElementById('assessment-active');
    const assessResult = document.getElementById('assessment-result');
    const assessQuestion = document.getElementById('assess-question');
    const assessOptions = document.getElementById('assess-options');
    const assessProgress = document.getElementById('assess-progress');
    const assessTitle = document.getElementById('assess-title');
    const assessExplanation = document.getElementById('assess-explanation');
    const assessNextBtn = document.getElementById('assess-next-btn');
    const assessPrevBtn = document.getElementById('assess-prev-btn');
    const assessFinishBtn = document.getElementById('assess-finish-btn');
    const assessTypeSelect = document.getElementById('assessment-type');

    const ASSESSMENT_DATA = {
        vitality: {
            title: "Vitality Assessment",
            questions: [
                {
                    q: "How frequently do you experience physical fatigue or energy slumps during the day?",
                    options: [
                        { text: "Rarely, energy levels stay consistent.", score: 20 },
                        { text: "Occasionally, mainly during mid-afternoon.", score: 15 },
                        { text: "Frequently, making routine tasks feel heavy.", score: 10 },
                        { text: "Constantly, even after waking up.", score: 5 }
                    ],
                    explanation: "Consistent energy indicates a balanced metabolic engine and robust Vital Force flow."
                },
                {
                    q: "Rate the quality of your waking state in the morning:",
                    options: [
                        { text: "Refreshed, energetic, and clear-headed.", score: 20 },
                        { text: "Slightly groggy, but wake up within 15 mins.", score: 15 },
                        { text: "Tired, requiring stimulants (tea/coffee) to function.", score: 10 },
                        { text: "Exhausted, feel like I didn't sleep at all.", score: 5 }
                    ],
                    explanation: "Waking state reflects the efficiency of deep REM sleep and adrenal recovery cycles."
                },
                {
                    q: "How does your body react to acute temperature shifts or weather changes?",
                    options: [
                        { text: "Adapt easily, rarely catch colds or fall ill.", score: 20 },
                        { text: "Notice minor stiffness/sneezing, but recover within 24 hrs.", score: 15 },
                        { text: "Catch infections frequently with seasonal transitions.", score: 10 },
                        { text: "Extremely sensitive; weather shifts trigger chronic flares.", score: 5 }
                    ],
                    explanation: "Susceptibility to weather changes is a classic constitutional diagnostic parameter in homeopathy."
                }
            ]
        },
        stress: {
            title: "Stress & Nervous System Assessment",
            questions: [
                {
                    q: "How often do you find yourself worrying or feeling anxious about minor daily tasks?",
                    options: [
                        { text: "Rarely, I handle tasks calmly.", score: 20 },
                        { text: "Occasionally, when deadlines stack up.", score: 15 },
                        { text: "Frequently, leading to physical tension (shoulders/jaw).", score: 10 },
                        { text: "Almost constantly; mind is always racing.", score: 5 }
                    ],
                    explanation: "Anxiety triggers sympathetic overload, depleting immune resilience over time."
                },
                {
                    q: "Do you experience heart palpitations or shallow breathing when stressed?",
                    options: [
                        { text: "No, breathing remains normal.", score: 20 },
                        { text: "Seldom, only under extreme pressures.", score: 15 },
                        { text: "Yes, noticeably shallow breaths and fast heartbeat.", score: 10 },
                        { text: "Frequently, sometimes leading to panic sensations.", score: 5 }
                    ],
                    explanation: "Palpitations indicate high autonomic nervous excitability, which can be calmed by constitutional remedies."
                }
            ]
        },
        sleep: {
            title: "Sleep & Recovery Assessment",
            questions: [
                {
                    q: "How many hours of actual, uninterrupted sleep do you get on average per night?",
                    options: [
                        { text: "7 to 9 hours consistently.", score: 20 },
                        { text: "6 to 7 hours; feel moderately rested.", score: 15 },
                        { text: "5 to 6 hours; wake up tired.", score: 10 },
                        { text: "Less than 5 hours; chronic sleep deficit.", score: 5 }
                    ],
                    explanation: "Deep, uninterrupted sleep allows for protein synthesis, tissue repair, and vital force recovery."
                },
                {
                    q: "Do you have difficulty falling asleep or waking up repeatedly during the night?",
                    options: [
                        { text: "Rarely, fall asleep easily and sleep through the night.", score: 20 },
                        { text: "Occasionally takes up to 30 mins to fall asleep.", score: 15 },
                        { text: "Frequently wake up, but manage to fall back asleep.", score: 10 },
                        { text: "Severe insomnia; wake up multiple times and can't sleep.", score: 5 }
                    ],
                    explanation: "Frequent waking indicates nervous system hyper-arousal or cortisol balance issues."
                }
            ]
        },
        digestive: {
            title: "Digestive & Gut Health Assessment",
            questions: [
                {
                    q: "How frequently do you experience bloating, gas, or acid reflux after meals?",
                    options: [
                        { text: "Rarely, digestion is smooth and light.", score: 20 },
                        { text: "Occasionally, after eating rich or spicy food.", score: 15 },
                        { text: "Frequently, even with simple home-cooked meals.", score: 10 },
                        { text: "Almost daily; chronic bloating and gas distress.", score: 5 }
                    ],
                    explanation: "Digestion efficiency is the absolute foundation of nutrition assimilation and cellular energy production."
                },
                {
                    q: "Rate your bowel regularity and stool consistency:",
                    options: [
                        { text: "Regular daily bowel movement; formed stools.", score: 20 },
                        { text: "Slight irregularity (miss a day occasionally) or loose stools.", score: 15 },
                        { text: "Frequent constipation or chronic loose stools.", score: 10 },
                        { text: "Severe constipation/IBS flare-ups daily.", score: 5 }
                    ],
                    explanation: "Bowel health is a direct representation of detoxification capacity and gut flora health."
                }
            ]
        },
        metabolic: {
            title: "Metabolic & Energy Assessment",
            questions: [
                {
                    q: "How is your weight stability and response to meals (sluggishness/cravings)?",
                    options: [
                        { text: "Stable weight, balanced appetite, no sugar crashes.", score: 20 },
                        { text: "Minor fluctuations, occasional afternoon sugar cravings.", score: 15 },
                        { text: "Difficulty losing weight, sluggish after meals.", score: 10 },
                        { text: "Chronic metabolic sluggishness, intense cravings, rapid weight changes.", score: 5 }
                    ],
                    explanation: "Metabolic health defines your thyroid, insulin sensitivity, and physical stamina."
                },
                {
                    q: "Do you experience body temperature sensitivity (cold hands/feet or heat intolerance)?",
                    options: [
                        { text: "Comfortable in normal temperatures; no extreme sensitivity.", score: 20 },
                        { text: "Occasional cold extremities in winter.", score: 15 },
                        { text: "Frequently cold hands and feet; require extra layers.", score: 10 },
                        { text: "Intense heat or cold intolerance; body cannot regulate temperature.", score: 5 }
                    ],
                    explanation: "Thermal sensitivity indicates underlying thyroid or circulatory imbalances in homeopathy."
                }
            ]
        },
        womens: {
            title: "Women's Health Assessment",
            questions: [
                {
                    q: "Are your menstrual cycles regular, and do you experience PMS or cramps?",
                    options: [
                        { text: "Regular cycles, minimal to no pain or mood shifts.", score: 20 },
                        { text: "Minor pain or moodiness, cycles within 25-35 days.", score: 15 },
                        { text: "Frequent cramps, heavy bleeding, or irregular cycles.", score: 10 },
                        { text: "Severe PMS/PMDD, chronic irregularity, or painful cycles.", score: 5 }
                    ],
                    explanation: "Hormonal balance regulates cellular hydration, stress resilience, and bone health."
                },
                {
                    q: "Do you experience symptoms of hormonal shifts like skin acne, hair thinning, or hot flashes?",
                    options: [
                        { text: "No, skin and hair remain healthy and stable.", score: 20 },
                        { text: "Minor breakouts before cycles or occasional thinning.", score: 15 },
                        { text: "Noticeable hair thinning, chronic acne, or hot flashes.", score: 10 },
                        { text: "Severe PCOS/menopause symptoms affecting daily life.", score: 5 }
                    ],
                    explanation: "Endocrine balance is highly responsive to stress and constitutional vitality."
                }
            ]
        },
        mens: {
            title: "Men's Health Assessment",
            questions: [
                {
                    q: "How are your physical endurance levels and recovery times after physical exertion?",
                    options: [
                        { text: "Excellent stamina, recover very quickly.", score: 20 },
                        { text: "Good stamina, occasionally feel tired the next day.", score: 15 },
                        { text: "Low stamina, take days to recover from moderate exercise.", score: 10 },
                        { text: "Constantly exhausted; minimal physical capacity.", score: 5 }
                    ],
                    explanation: "Physical endurance is a key indicator of cardiovascular reserves and oxygenation."
                },
                {
                    q: "Rate your overall mental focus, energy stability, and concentration throughout the day:",
                    options: [
                        { text: "Sharp, steady focus, no brain fog.", score: 20 },
                        { text: "Good focus, minor brain fog during high stress.", score: 15 },
                        { text: "Frequent brain fog, struggle to concentrate.", score: 10 },
                        { text: "Chronic lack of focus, severe afternoon exhaustion.", score: 5 }
                    ],
                    explanation: "Stamina and focus reflect adrenal reserves and testosterone-cortisol balances."
                }
            ]
        }
    };

    let currentAssessType = "";
    let activeQuestions = [];
    let selectedScore = null;

    // Dynamic Assessment Guide PATH Rendering
    function renderAssessmentGuide() {
        const guideListContainer = document.getElementById('assessment-guide-list');
        if (!guideListContainer) return;

        guideListContainer.innerHTML = "";

        const PATH = [
            { id: 'vitality', step: 'Step 1: Baseline', title: 'Vitality Profile', desc: 'Calibrate your base vital force and morning recovery capacity. (Start here!)' },
            { id: 'stress', step: 'Step 2: Recommended', title: 'Stress & Nervous System', desc: 'Evaluate sympathetic load, adrenal reserves, and anxiety levels.' },
            { id: 'sleep', step: 'Step 3: Advanced', title: 'Sleep & Recovery Quality', desc: 'Measure deep sleep latency, waking states, and tissue restoration.' },
            { id: 'digestive', step: 'Step 4: Advanced', title: 'Digestive & Gut Health', desc: 'Analyze post-meal bloating, gastric regularity, and absorption dynamics.' },
            { id: 'metabolic', step: 'Step 5: Advanced', title: 'Metabolic & Energy Rate', desc: 'Check thermal sensitivity, weight stability, and afternoon sluggishness.' },
            { id: 'womens', step: 'Step 6: Optional', title: 'Women\'s Endocrine Profile', desc: 'Optional: Gauge hormonal stability, PMS/cycle regularity, and PCOS signals.' },
            { id: 'mens', step: 'Step 7: Optional', title: 'Men\'s Stamina Profile', desc: 'Optional: Evaluate recovery rate, focus stability, and physical stamina.' }
        ];

        let firstPendingFound = false;

        PATH.forEach((item) => {
            const score = state.assessmentsCompleted[item.id];
            const isCompleted = score !== null && score !== undefined;
            
            let statusText = "Pending";
            let statusClass = "pending";
            let cardClass = "";

            if (isCompleted) {
                statusText = `Score: ${score}/100`;
                statusClass = "complete";
                cardClass = "completed";
            } else if (!firstPendingFound) {
                statusText = "Recommended Next";
                statusClass = "recommended";
                cardClass = "next";
                firstPendingFound = true;
            }

            const card = document.createElement('div');
            card.className = `guide-card ${cardClass}`;
            card.innerHTML = `
                <div class="guide-info">
                    <span class="guide-step">${item.step}</span>
                    <span class="guide-title">${item.title}</span>
                    <p class="guide-desc">${item.desc}</p>
                </div>
                <div class="guide-action">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem; color: var(--text-muted);"></i>
                </div>
            `;

            card.addEventListener('click', () => {
                // Set active select value and trigger click
                assessTypeSelect.value = item.id;
                startAssessBtn.click();
            });

            guideListContainer.appendChild(card);
        });
    }

    // Reset All Assessments Button Event
    const resetAssessBtn = document.getElementById('reset-assess-btn');
    if (resetAssessBtn) {
        resetAssessBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset all completed assessments? This will recalibrate your Health Twin Vitality Score back to baseline.")) {
                for (const key of Object.keys(state.assessmentsCompleted)) {
                    state.assessmentsCompleted[key] = null;
                }
                state.hasAssessments = false;
                recalculateHealthMetrics();
                saveState();
                renderAssessmentGuide();
                
                // Communicate to parent twin to wipe parent cache
                try {
                    window.parent.postMessage({ type: 'reset-assessments' }, '*');
                } catch (e) {
                    console.error("Failed to post reset message to parent:", e);
                }
                
                assessTypeSelect.value = "vitality";
            }
        });
    }

    startAssessBtn.addEventListener('click', () => {
        cancelSpeaking();
        currentAssessType = assessTypeSelect.value;
        const quiz = ASSESSMENT_DATA[currentAssessType] || ASSESSMENT_DATA['vitality'];
        activeQuestions = quiz.questions;
        state.activeAssessment = quiz;
        state.assessQuestionIndex = 0;
        state.assessAnswers = [];

        assessTitle.innerText = quiz.title;
        assessIntro.classList.add('hidden');
        assessResult.classList.add('hidden');
        assessActive.classList.remove('hidden');

        loadQuestion();
    });

    function loadQuestion() {
        const qData = activeQuestions[state.assessQuestionIndex];
        
        let displayQ = qData.q;
        let displayExp = qData.explanation;
        
        const localQuiz = LOCALIZED_ASSESSMENTS[state.lang] ? LOCALIZED_ASSESSMENTS[state.lang][currentAssessType] : null;
        if (localQuiz && localQuiz.questions[state.assessQuestionIndex]) {
            const localQ = localQuiz.questions[state.assessQuestionIndex];
            displayQ = localQ.q;
            displayExp = localQ.explanation;
        }

        assessProgress.innerText = `Question ${state.assessQuestionIndex + 1} of ${activeQuestions.length}`;
        assessQuestion.innerText = displayQ;
        assessExplanation.innerText = displayExp;

        assessOptions.innerHTML = "";
        selectedScore = null;
        assessNextBtn.disabled = true;

        qData.options.forEach((opt, idx) => {
            let displayOptText = opt.text;
            if (localQuiz && localQuiz.questions[state.assessQuestionIndex]) {
                const localQ = localQuiz.questions[state.assessQuestionIndex];
                if (localQ.options && localQ.options[idx]) {
                    displayOptText = localQ.options[idx];
                }
            }

            const card = document.createElement('div');
            card.className = "option-card";
            card.tabIndex = 0;
            card.setAttribute('role', 'radio');
            card.setAttribute('aria-checked', 'false');
            card.innerHTML = `
                <span class="option-radio"></span>
                <span>${displayOptText}</span>
            `;
            
            const selectOption = () => {
                document.querySelectorAll('.option-card').forEach(c => {
                    c.classList.remove('selected');
                    c.setAttribute('aria-checked', 'false');
                });
                card.classList.add('selected');
                card.setAttribute('aria-checked', 'true');
                selectedScore = opt.score;
                assessNextBtn.disabled = false;
            };

            card.addEventListener('click', selectOption);
            card.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    selectOption();
                }
            });
            
            assessOptions.appendChild(card);
        });

        if (state.ttsEnabled) {
            speakText(displayExp);
        }
    }

    assessNextBtn.addEventListener('click', () => {
        cancelSpeaking();
        state.assessAnswers.push(selectedScore);
        
        if (state.assessQuestionIndex < activeQuestions.length - 1) {
            state.assessQuestionIndex++;
            loadQuestion();
        } else {
            showAssessmentResult();
        }
    });

    function showAssessmentResult() {
        const totalPossible = activeQuestions.length * 20;
        const totalLogged = state.assessAnswers.reduce((a, b) => a + b, 0);
        const percentScore = Math.round((totalLogged / totalPossible) * 100);

        state.assessmentsCompleted[currentAssessType] = percentScore;
        saveState();

        assessActive.classList.add('hidden');
        assessResult.classList.remove('hidden');

        const desc = document.getElementById('assess-result-desc');
        const advice = document.getElementById('assess-result-advice');

        const dict = UI_LOCALIZATION[state.lang] || UI_LOCALIZATION.en;
        
        let localTitle = state.activeAssessment.title;
        const localQuiz = LOCALIZED_ASSESSMENTS[state.lang] ? LOCALIZED_ASSESSMENTS[state.lang][currentAssessType] : null;
        if (localQuiz) {
            localTitle = localQuiz.title;
        }
        
        const descTemplate = dict.result_desc || "Your completed {title} score is {score}/100.";
        desc.innerText = descTemplate.replace("{title}", localTitle).replace("{score}", percentScore);
        
        if (percentScore >= 80) {
            advice.innerText = dict.advice_high || "Excellent baseline vitality! Continue maintaining your current hydration and sleep patterns. Regular checks support keeping this state.";
        } else if (percentScore >= 60) {
            advice.innerText = dict.advice_mid || "Moderate sub-health patterns identified. Optimization of sleep hygiene, daily hydration, and consideration of constitutional remedies will help restore optimal balance.";
        } else {
            advice.innerText = dict.advice_low || "Low vital force resilience. We highly recommend booking a comprehensive consultation with Dr. Narayan Jethwani to build a personalized therapeutic plan.";
        }
        
        const finishBtnElement = document.getElementById('assess-finish-btn');
        if (finishBtnElement) {
            finishBtnElement.innerText = dict.save_update_btn || "Save & Update Dashboard";
        }
        }

        // 1. Populate Cumulative Scores List
        const scoresDiv = document.getElementById('assess-result-scores');
        if (scoresDiv) {
            let completedHtml = "";
            let completedCount = 0;
            const PATH = [
                { id: 'vitality', title: 'Vitality Profile' },
                { id: 'stress', title: 'Stress & Nervous System' },
                { id: 'sleep', title: 'Sleep & Recovery' },
                { id: 'digestive', title: 'Digestive & Gut Health' },
                { id: 'metabolic', title: 'Metabolic & Energy' },
                { id: 'womens', title: 'Women\'s Endocrine' },
                { id: 'mens', title: 'Men\'s Stamina' }
            ];
            PATH.forEach(item => {
                const score = state.assessmentsCompleted[item.id];
                if (score !== null && score !== undefined) {
                    completedHtml += `
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                            <span style="color: var(--text-muted);">${item.title}</span>
                            <strong style="color: var(--text-color);">${score}/100</strong>
                        </div>`;
                    completedCount++;
                }
            });
            
            // Recalculate health metrics to get the latest vitality score
            recalculateHealthMetrics();

            scoresDiv.innerHTML = `
                <div style="font-size: 0.85rem; font-weight: bold; margin-bottom: 8px; color: var(--text-color);">
                    Cumulative Status (${completedCount} completed):
                </div>
                ${completedHtml}
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-top: 8px; border-top: 1px solid rgba(13, 148, 136, 0.2); padding-top: 8px; color: var(--teal-500); font-weight: bold;">
                    <span>Overall Vitality Score:</span>
                    <span>${state.vitalityScore}/100</span>
                </div>
            `;
        }

        // 2. Identify the Next Recommended Assessment
        const ORDER = ['vitality', 'stress', 'sleep', 'digestive', 'metabolic', 'womens', 'mens'];
        const NAMES = {
            vitality: "Vitality Profile",
            stress: "Stress & Nervous System",
            sleep: "Sleep & Recovery",
            digestive: "Digestive & Gut Health",
            metabolic: "Metabolic & Energy",
            womens: "Women's Endocrine Profile",
            mens: "Men's Stamina Profile"
        };
        
        let nextAssessId = null;
        const currentIndex = ORDER.indexOf(currentAssessType);
        for (let i = 1; i <= ORDER.length; i++) {
            const nextIdx = (currentIndex + i) % ORDER.length;
            const nextId = ORDER[nextIdx];
            if (state.assessmentsCompleted[nextId] === null || state.assessmentsCompleted[nextId] === undefined) {
                nextAssessId = nextId;
                break;
            }
        }

        // 3. Render Dynamic Buttons
        const actionsContainer = document.getElementById('assess-result-actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = "";
            
            // Create WhatsApp Share Button
            const waBtn = document.createElement('a');
            waBtn.className = "btn-whatsapp";
            waBtn.href = getWhatsAppLink("book a consultation");
            waBtn.target = "_blank";
            waBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Share & Book via WhatsApp`;
            waBtn.style.padding = "10px 20px";
            waBtn.style.borderRadius = "8px";
            waBtn.style.fontWeight = "bold";
            waBtn.style.cursor = "pointer";
            waBtn.style.background = "#25D366";
            waBtn.style.color = "white";
            waBtn.style.textDecoration = "none";
            waBtn.style.display = "inline-flex";
            waBtn.style.alignItems = "center";
            waBtn.style.gap = "8px";
            waBtn.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.2)";
            waBtn.style.transition = "transform 0.2s, box-shadow 0.2s";
            waBtn.addEventListener('mouseenter', () => {
                waBtn.style.transform = "scale(1.03)";
            });
            waBtn.addEventListener('mouseleave', () => {
                waBtn.style.transform = "none";
            });
            waBtn.addEventListener('click', () => {
                recalculateHealthMetrics();
                saveState();
                renderAssessmentGuide();
            });

            if (nextAssessId) {
                // Option A: Save & Start Next Assessment
                const nextBtn = document.createElement('button');
                nextBtn.className = "btn-primary";
                nextBtn.innerText = `Save & Start Next: ${NAMES[nextAssessId]}`;
                nextBtn.style.padding = "10px 20px";
                nextBtn.style.borderRadius = "8px";
                nextBtn.style.fontWeight = "bold";
                nextBtn.style.cursor = "pointer";
                nextBtn.addEventListener('click', () => {
                    recalculateHealthMetrics();
                    saveState();
                    renderAssessmentGuide();
                    
                    assessResult.classList.add('hidden');
                    assessTypeSelect.value = nextAssessId;
                    startAssessBtn.click();
                    
                    appendLucyMessage(`I have saved your score for the completed assessment and started the next recommended one: <strong>${NAMES[nextAssessId]}</strong>. Keep going to calibrate your full Health Twin!`);
                });
                actionsContainer.appendChild(nextBtn);

                // Add WhatsApp button
                actionsContainer.appendChild(waBtn);

                // Option B: Save & Chat with Lucy
                const chatBtnOpt = document.createElement('button');
                chatBtnOpt.className = "btn-secondary";
                chatBtnOpt.innerText = "Save & Chat with Lucy";
                chatBtnOpt.style.padding = "10px 20px";
                chatBtnOpt.style.borderRadius = "8px";
                chatBtnOpt.style.fontWeight = "bold";
                chatBtnOpt.style.cursor = "pointer";
                chatBtnOpt.addEventListener('click', () => {
                    recalculateHealthMetrics();
                    saveState();
                    renderAssessmentGuide();

                    const chatBtn = document.querySelector('[data-tab="chat"]');
                    if (chatBtn) chatBtn.click();
                    
                    assessResult.classList.add('hidden');
                    assessIntro.classList.remove('hidden');

                    appendLucyMessage(`Congratulations on completing your assessment! Your overall Vitality Score is now updated to ${state.vitalityScore}/100. Let me know if you would like me to explain any recommendations.`);
                });
                actionsContainer.appendChild(chatBtnOpt);
            } else {
                // Option C: Save & Go to Chat Companion (All completed)
                waBtn.style.fontSize = "1.05rem";
                waBtn.style.padding = "12px 24px";
                actionsContainer.appendChild(waBtn);

                const finishBtn = document.createElement('button');
                finishBtn.className = "btn-primary";
                finishBtn.innerText = "Save & Go to Chat Companion";
                finishBtn.style.padding = "12px 24px";
                finishBtn.style.borderRadius = "8px";
                finishBtn.style.fontWeight = "bold";
                finishBtn.style.cursor = "pointer";
                finishBtn.addEventListener('click', () => {
                    recalculateHealthMetrics();
                    saveState();
                    renderAssessmentGuide();

                    const chatBtn = document.querySelector('[data-tab="chat"]');
                    if (chatBtn) chatBtn.click();
                    
                    assessResult.classList.add('hidden');
                    assessIntro.classList.remove('hidden');

                    appendLucyMessage(`Congratulations on completing all assessments! Your overall Vitality Score is now updated to ${state.vitalityScore}/100. Let me know if you would like me to explain any recommendations.`);
                });
                actionsContainer.appendChild(finishBtn);
            }
        }
    }

    if (assessFinishBtn) {
        assessFinishBtn.addEventListener('click', () => {
            recalculateHealthMetrics();
            saveState();
            renderAssessmentGuide();

            const chatBtn = document.querySelector('[data-tab="chat"]');
            if (chatBtn) chatBtn.click();
            
            assessResult.classList.add('hidden');
            assessIntro.classList.remove('hidden');

            appendLucyMessage(`Congratulations on completing your assessment! Your overall Vitality Score is now updated to ${state.vitalityScore}/100. Let me know if you would like me to explain any recommendations.`);
        });
    }

    // Run dynamic guide initialization on startup
    renderAssessmentGuide();


    // ---------------------------------------------------------
    // Symptom Navigator Logic
    // ---------------------------------------------------------
    const generateSympBtn = document.getElementById('generate-symp-btn');
    const copySympBtn = document.getElementById('copy-symp-btn');
    const sympOutput = document.getElementById('symptom-summary-output');

    generateSympBtn.addEventListener('click', () => {
        const concern = document.getElementById('symp-concern').value.trim();
        const duration = document.getElementById('symp-duration').value.trim();
        const triggers = document.getElementById('symp-triggers').value.trim();
        const relieving = document.getElementById('symp-relieving').value.trim();
        const associated = document.getElementById('symp-associated').value.trim();

        if (!concern) {
            alert("Please fill in at least your main health concern before generating the summary.");
            return;
        }

        const summaryText = `Symptom Summary (Homeo Healthcare Clinic Note)
=========================================
Main Concern:        ${concern}
Duration:            ${duration || "Not specified"}
Aggravating Factors: ${triggers || "None identified"}
Relieving Factors:   ${relieving || "None identified"}
Associated Symptoms: ${associated || "None"}
Recommended Next Step: Constitutional Consultation with Dr. Narayan Jethwani.

-----------------------------------------
Note: Treatment recommendations should be confirmed by a qualified homeopathic physician.`;

        sympOutput.innerHTML = `<pre>${summaryText}</pre>`;
        copySympBtn.disabled = false;

        // Auto dialogue with Lucy
        appendLucyMessage("I have structured your symptoms into a clinical summary. You can copy it using the copy button and share it during your consultation with Dr. Narayan Jethwani.");
    });

    copySympBtn.addEventListener('click', () => {
        const text = sympOutput.innerText;
        navigator.clipboard.writeText(text).then(() => {
            copySympBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
                copySympBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    });


    // ---------------------------------------------------------
    // Report Interpreter Simulated Uploads
    // ---------------------------------------------------------
    const dropzone = document.getElementById('report-dropzone');
    const simulateButtons = document.querySelectorAll('.simulate-file-btn');
    const reportBadge = document.getElementById('report-type-badge');
    const reportContent = document.getElementById('report-summary-output');

    const MOCK_REPORTS = {
        cbc: {
            type: "Complete Blood Count (CBC)",
            html: `
                <div class="interpreted-report">
                    <div class="report-section">
                        <h5><i class="fa-solid fa-list-check"></i> Key Findings</h5>
                        <ul>
                            <li>Hemoglobin: 11.2 g/dL (Mildly Low, Ref: 12.0 - 15.0)</li>
                            <li>Mean Corpuscular Volume (MCV): 78 fL (Low, Ref: 80 - 96)</li>
                            <li>Total WBC & Platelets: Within optimal ranges.</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-microscope"></i> Possible Meaning</h5>
                        <p>Results suggest mild microcytic hypochromic anemia, commonly associated with early iron deficiency or inadequate nutritional absorption.</p>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-carrot"></i> Lifestyle Considerations</h5>
                        <ul>
                            <li>Include iron-rich foods: beetroot, spinach, pomegranates, and vitamin C sources (amla/lemon) to enhance absorption.</li>
                            <li>Avoid tea or coffee immediately after meals, as tannins block iron absorption.</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-circle-question"></i> Questions To Discuss With Doctor</h5>
                        <ul>
                            <li>Should we evaluate serum ferritin and iron levels?</li>
                            <li>Could constitutional remedies support digestive assimilation to improve iron absorption?</li>
                        </ul>
                    </div>
                </div>
            `
        },
        lipid: {
            type: "Lipid Profile",
            html: `
                <div class="interpreted-report">
                    <div class="report-section">
                        <h5><i class="fa-solid fa-list-check"></i> Key Findings</h5>
                        <ul>
                            <li>Total Cholesterol: 242 mg/dL (Elevated, Ref: &lt;200)</li>
                            <li>LDL (Bad) Cholesterol: 158 mg/dL (Borderline High, Ref: &lt;130)</li>
                            <li>HDL (Good) Cholesterol: 42 mg/dL (Normal, Ref: &gt;40)</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-microscope"></i> Possible Meaning</h5>
                        <p>Elevated circulating lipids indicate moderate cardiovascular susceptibility, which often responds exceptionally well to metabolic regulation.</p>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-carrot"></i> Lifestyle Considerations</h5>
                        <ul>
                            <li>Focus on soluble fibers (oats, legumes) and reduce saturated fats/refined sugars.</li>
                            <li>Engage in 30-45 minutes of brisk cardiovascular exercise daily to boost lipid metabolism.</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-circle-question"></i> Questions To Discuss With Doctor</h5>
                        <ul>
                            <li>Is constitutional therapy suitable for restoring lipid metabolism balance alongside my current diet?</li>
                            <li>Are lipid-regulating homeopathic mother tinctures indicated?</li>
                        </ul>
                    </div>
                </div>
            `
        },
        thyroid: {
            type: "Thyroid Panel",
            html: `
                <div class="interpreted-report">
                    <div class="report-section">
                        <h5><i class="fa-solid fa-list-check"></i> Key Findings</h5>
                        <ul>
                            <li>Thyroid Stimulating Hormone (TSH): 5.8 mIU/L (Mildly Elevated, Ref: 0.4 - 4.5)</li>
                            <li>Free T3 & Free T4: Normal baseline levels.</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-microscope"></i> Possible Meaning</h5>
                        <p>Indicates early Subclinical Hypothyroidism, where the pituitary gland is working harder to stimulate thyroid hormone production. Often associated with fatigue, slow metabolism, and cold sensitivity.</p>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-carrot"></i> Lifestyle Considerations</h5>
                        <ul>
                            <li>Support thyroid function with trace elements like selenium (brazil nuts) and iodine.</li>
                            <li>Incorporate daily stress-reduction practices, as high cortisol suppresses thyroid pathway sensitivity.</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h5><i class="fa-solid fa-circle-question"></i> Questions To Discuss With Doctor</h5>
                        <ul>
                            <li>Should we monitor TSH levels again in 3 months?</li>
                            <li>How can constitutional treatment stimulate natural thyroid gland balance?</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };

    function interpretReport(key) {
        const report = MOCK_REPORTS[key];
        if (!report) return;

        reportBadge.innerText = report.type;
        reportBadge.classList.remove('hidden');
        reportContent.innerHTML = report.html;

        // Auto dialogue with Lucy
        appendLucyMessage(`I have interpreted your ${report.type} report. Please review the key findings, lifestyle adjustments, and questions to discuss with Dr. Jethwani.`);
    }

    simulateButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering dropzone click
            const file = btn.dataset.file;
            interpretReport(file);
        });
    });

    dropzone.addEventListener('click', () => {
        document.getElementById('report-file-input').click();
    });

    document.getElementById('report-file-input').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            // Choose a random mock report to simulate parsing
            const reports = ['cbc', 'lipid', 'thyroid'];
            const randomReport = reports[Math.floor(Math.random() * reports.length)];
            interpretReport(randomReport);
        }
    });

    // Calendar scheduling simulate click
    document.getElementById('book-calendar-btn').addEventListener('click', () => {
        appendLucyMessage("I can schedule a follow-up consultation with Dr. Narayan Jethwani. Booking requests are handled via email or phone. I will prompt Dr. Jethwani's calendar manager, and they will connect with you via your registered details shortly.");
    });


    // ---------------------------------------------------------
    // Homeopathic Materia Medica Logic
    // ---------------------------------------------------------
    const materiaGrid = document.getElementById('materia-grid-container');
    const materiaSearch = document.getElementById('materia-search-input');

    function renderMateriaMedica(filterText = "") {
        if (!materiaGrid) return;
        materiaGrid.innerHTML = "";
        
        const filtered = LUCY_KB.materiaMedica.filter(rem => {
            const term = filterText.toLowerCase();
            return rem.name.toLowerCase().includes(term) || 
                   rem.commonName.toLowerCase().includes(term) || 
                   rem.keynotes.toLowerCase().includes(term) || 
                   rem.modalities.toLowerCase().includes(term) ||
                   rem.source.toLowerCase().includes(term);
        });

        if (filtered.length === 0) {
            materiaGrid.innerHTML = `
                <div class="empty-state-output" style="grid-column: 1/-1; min-height: 180px;">
                    <i class="fa-solid fa-book-open"></i>
                    <p>No matching remedies found in the Materia Medica database.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(rem => {
            const card = document.createElement('div');
            card.className = "remedy-card";
            card.innerHTML = `
                <div class="remedy-card-header">
                    <span class="remedy-name">${rem.name}</span>
                    <span class="remedy-source">${rem.source}</span>
                </div>
                <div class="remedy-common">Common: ${rem.commonName}</div>
                <div class="remedy-keynotes">${rem.keynotes}</div>
                <div class="remedy-modalities"><strong>Modalities:</strong> ${rem.modalities}</div>
                <div class="remedy-disclaimer-card"><i class="fa-solid fa-circle-exclamation"></i> Educational Profile Only</div>
            `;
            
            // Clicking a remedy card automatically queries Lucy about it in the chat panel!
            card.addEventListener('click', () => {
                // Ensure assistant panel is visible in bubble/sidebar mode
                if (appMain.classList.contains('layout-bubble')) {
                    assistantArea.classList.add('active');
                } else if (appMain.classList.contains('layout-sidebar')) {
                    assistantArea.classList.remove('collapsed');
                }
                
                chatInput.value = `Tell me about the remedy ${rem.name}`;
                handleSendMessage();
            });

            materiaGrid.appendChild(card);
        });
    }

    if (materiaSearch) {
        materiaSearch.addEventListener('input', (e) => {
            renderMateriaMedica(e.target.value);
        });
    }

    // Render on startup
    renderMateriaMedica();


    // ---------------------------------------------------------
    // Phase 2: Predictive Health Risk Engine
    // ---------------------------------------------------------
    function calculatePredictiveRisks() {
        const stress = parseInt(state.dailyLogs.stress);
        const sleep = parseFloat(state.dailyLogs.sleep);
        const exercise = parseInt(state.dailyLogs.exercise);
        const water = parseInt(state.dailyLogs.water);
        const weight = parseFloat(state.dailyLogs.weight);

        // 1. Cardiovascular Susceptibility
        let cardioRisk = 30;
        if (exercise < 15) cardioRisk += 15;
        else if (exercise < 30) cardioRisk += 5;
        if (stress > 5) cardioRisk += (stress - 5) * 6;
        if (sleep < 7) cardioRisk += (7 - sleep) * 8;
        if (state.vitalityScore > 80) cardioRisk -= 10;
        else if (state.vitalityScore < 60) cardioRisk += 10;
        cardioRisk = Math.max(5, Math.min(95, cardioRisk));

        updateRiskGauge("cardio", cardioRisk);

        // 2. Metabolic Dysregulation
        let metabolicRisk = 35;
        if (water < 6) metabolicRisk += 15;
        else if (water < 8) metabolicRisk += 5;
        if (sleep < 6) metabolicRisk += 10;
        if (exercise === 0) metabolicRisk += 15;
        if (weight > 85 || weight < 50) metabolicRisk += 12;
        if (state.vitalityScore > 80) metabolicRisk -= 10;
        metabolicRisk = Math.max(5, Math.min(95, metabolicRisk));

        updateRiskGauge("metabolic", metabolicRisk);

        // 3. Chronic Inflammation Risk
        let inflammationRisk = 25;
        if (stress > 4) inflammationRisk += (stress - 4) * 8;
        if (sleep < 6) inflammationRisk += 10;
        if (exercise < 15) inflammationRisk += 8;
        if (state.vitalityScore > 80) inflammationRisk -= 12;
        inflammationRisk = Math.max(5, Math.min(95, inflammationRisk));

        updateRiskGauge("inflammation", inflammationRisk);
    }

    function updateRiskGauge(type, score) {
        const marker = document.getElementById(`${type}-marker`);
        const text = document.getElementById(`${type}-text`);
        if (!marker || !text) return;

        // Position marker
        marker.style.left = `${score}%`;

        // Update Text & Classes
        if (score < 35) {
            text.innerText = "Low Risk";
            text.style.color = "var(--emerald)";
        } else if (score < 70) {
            text.innerText = "Moderate Risk";
            text.style.color = "var(--yellow)";
        } else {
            text.innerText = "High Risk";
            text.style.color = "var(--red)";
        }
    }


    // ---------------------------------------------------------
    // Phase 2: Personalized 7-Day Wellness Plan
    // ---------------------------------------------------------
    const wellnessRoutinesContent = document.getElementById('wellness-routines-content');
    const wellnessDaysTabs = document.getElementById('wellness-days-tabs');

    const ROUTINE_TEMPLATES = {
        hydration: { title: "Cellular Hydration", icon: "fa-glass-water" },
        activity: { title: "Dynamic Vigor", icon: "fa-person-running" },
        stress: { title: "Nervous Regimen", icon: "fa-spa" },
        sleep: { title: "Somnus Recovery", icon: "fa-bed" },
        nutrition: { title: "Nutri-Vitality", icon: "fa-apple-whole" }
    };

    function getWellnessPlanData(dayNum) {
        const stress = parseInt(state.dailyLogs.stress);
        const sleep = parseFloat(state.dailyLogs.sleep);
        
        let plan = {
            morning: [],
            afternoon: [],
            evening: []
        };

        // Morning Routines
        plan.morning.push({
            time: "07:00 AM",
            type: "hydration",
            desc: "Drink 1-2 glasses of warm lemon water to stimulate kidney filtration and digestive vitality."
        });

        if (stress > 6) {
            plan.morning.push({
                time: "07:30 AM",
                type: "stress",
                desc: "Practice 5 minutes of 4-7-8 breathing followed by constitutional grounding (barefoot walking on soil/grass)."
            });
        } else {
            plan.morning.push({
                time: "07:30 AM",
                type: "activity",
                desc: "15 minutes of gentle aerobic yoga/stretching to activate metabolic circulation."
            });
        }

        plan.morning.push({
            time: "08:30 AM",
            type: "nutrition",
            desc: "Warm cooked breakfast (e.g., steel-cut oats with almonds). Avoid iced beverages."
        });

        // Afternoon Routines
        plan.afternoon.push({
            time: "01:00 PM",
            type: "nutrition",
            desc: "Pre-meal prebiotic: 1 tablespoon of fermented curd or sauerkraut. Warm lunch with bitter greens."
        });

        plan.afternoon.push({
            time: "03:30 PM",
            type: "hydration",
            desc: "Drink 250ml of warm water or herbal infusion. (Aromatic check: avoid strong peppermint if remedy taken nearby)."
        });

        if (stress > 5) {
            plan.afternoon.push({
                time: "04:30 PM",
                type: "stress",
                desc: "Nervous System Reset: 5 mins eye-exercises and neck stretches. Rest eyes from digital screens."
            });
        }

        // Evening Routines
        if (sleep < 7) {
            plan.evening.push({
                time: "06:30 PM",
                type: "activity",
                desc: "30-minute brisk outdoor walk to stimulate oxygenation and lower baseline cortisol."
            });
        } else {
            plan.evening.push({
                time: "07:00 PM",
                type: "activity",
                desc: "30 minutes moderate exercise or cardiovascular routine."
            });
        }

        plan.evening.push({
            time: "08:00 PM",
            type: "nutrition",
            desc: "Light dinner: vegetable stew or soup. Chew each bite thoroughly to reduce digestive workload."
        });

        if (sleep < 7 || stress > 6) {
            plan.evening.push({
                time: "09:30 PM",
                type: "sleep",
                desc: "Warm foot bath with rock salt/camphor. Shut off mobile phone and keep bedroom dark."
            });
        } else {
            plan.evening.push({
                time: "10:00 PM",
                type: "sleep",
                desc: "Review daily achievements, read 10 minutes, and aim for deep rest by 10:30 PM."
            });
        }

        // Remedy lookup integration (educational alert notes)
        if (stress > 6) {
            plan.morning.push({
                time: "Before Meals",
                type: "stress",
                desc: "Educational Note: Irritability and overindulgence can relate to Nux vomica indications. Check with Dr. Jethwani."
            });
        }
        if (sleep < 7) {
            plan.evening.push({
                time: "Before Bed",
                type: "sleep",
                desc: "Educational Note: Insomnia from overactive thoughts is linked to Coffea cruda indications. Check with Dr. Jethwani."
            });
        }

        return plan;
    }

    function renderWellnessPlan(dayNum = 1) {
        if (!wellnessRoutinesContent) return;
        
        state.activeWellnessDay = dayNum;
        saveState();

        // Highlight active day button
        if (wellnessDaysTabs) {
            const btns = wellnessDaysTabs.querySelectorAll('.day-nav-btn');
            btns.forEach(btn => {
                if (parseInt(btn.dataset.day) === dayNum) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        const data = getWellnessPlanData(dayNum);
        wellnessRoutinesContent.innerHTML = "";

        const slots = ['morning', 'afternoon', 'evening'];
        slots.forEach(slot => {
            const block = document.createElement('div');
            block.className = "routine-block";
            
            let slotIcon = "fa-sun";
            let slotTitle = "Morning Routine";
            if (slot === 'afternoon') {
                slotIcon = "fa-cloud-sun";
                slotTitle = "Afternoon Routine";
            } else if (slot === 'evening') {
                slotIcon = "fa-moon";
                slotTitle = "Evening Routine";
            }

            block.innerHTML = `
                <div class="routine-block-header">
                    <i class="fa-solid ${slotIcon}"></i>
                    <h4>${slotTitle}</h4>
                </div>
                <div class="routine-items-list" id="routine-${slot}-list"></div>
            `;

            wellnessRoutinesContent.appendChild(block);
            const itemsList = block.querySelector('.routine-items-list');

            data[slot].forEach((item, index) => {
                const itemKey = `day${dayNum}-${slot}-item${index}`;
                const isChecked = state.wellnessCompletedChecks[itemKey] === true;

                const itemDiv = document.createElement('div');
                itemDiv.className = isChecked ? "routine-item checked" : "routine-item";
                itemDiv.innerHTML = `
                    <div class="routine-checkbox"></div>
                    <div class="routine-details">
                        <span class="routine-time">${item.time} — ${ROUTINE_TEMPLATES[item.type]?.title || "Routine"}</span>
                        <span class="routine-desc">${item.desc}</span>
                    </div>
                `;

                // Handle check/uncheck clicking
                itemDiv.addEventListener('click', () => {
                    const currentChecked = state.wellnessCompletedChecks[itemKey] === true;
                    state.wellnessCompletedChecks[itemKey] = !currentChecked;
                    saveState();
                    
                    // Re-calculate to reward vitality points!
                    recalculateHealthMetrics();
                });

                itemsList.appendChild(itemDiv);
            });
        });
    }

    // Day Buttons Click Handlers
    if (wellnessDaysTabs) {
        wellnessDaysTabs.addEventListener('click', (e) => {
            const btn = e.target;
            if (!btn.classList.contains('day-nav-btn')) return;
            const day = parseInt(btn.dataset.day);
            renderWellnessPlan(day);
        });
    }

    // Export Plan Download Button
    const downloadBtn = document.getElementById('download-wellness-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            let fileContent = `Homeo Healthcare — 7-Day Personalized Wellness Plan\n`;
            fileContent += `Prepared by Lucy AI Assistant for Guest Patient\n`;
            fileContent += `========================================================\n\n`;
            fileContent += `Current Vitality Baseline: ${state.vitalityScore}/100\n`;
            fileContent += `Estimated Biological Age: ${state.biologicalAge} years\n`;
            fileContent += `--------------------------------------------------------\n\n`;

            for (let d = 1; d <= 7; d++) {
                fileContent += `### DAY ${d} SCHEDULE ###\n`;
                const data = getWellnessPlanData(d);
                
                fileContent += `Morning Routine:\n`;
                data.morning.forEach(i => fileContent += `  [ ] ${i.time} - ${i.desc}\n`);
                
                fileContent += `Afternoon Routine:\n`;
                data.afternoon.forEach(i => fileContent += `  [ ] ${i.time} - ${i.desc}\n`);
                
                fileContent += `Evening Routine:\n`;
                data.evening.forEach(i => fileContent += `  [ ] ${i.time} - ${i.desc}\n`);
                
                fileContent += `\n--------------------------------------------------------\n\n`;
            }

            fileContent += `DISCLAIMER: This wellness plan is for educational support. Remedy selections and health plans should be confirmed by Dr. Narayan Jethwani MD (Hom.) or a qualified homeopathic physician.\n`;

            // Trigger file download
            const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `Lucy_7_Day_Wellness_Plan.txt`;
            link.click();

            appendLucyMessage("I have compiled your 7-Day Personalized Wellness Plan and downloaded it as a text file. You can save or print it to keep track of your routines!");
        });
    }


    // ---------------------------------------------------------
    // Init Application
    // ---------------------------------------------------------
    loadState();
    updateUILocalization();
    
    // Initial welcome logic with browser autoplay compatibility
    let welcomeSpoken = false;
    let welcomeSpeakingRequested = false;
    function speakWelcome() {
        if (welcomeSpoken || welcomeSpeakingRequested || !state.ttsEnabled) return;

        welcomeSpeakingRequested = true;
        const welcomeTexts = {
            en: "Hello! I am Lucy, your AI Health Intelligence Assistant for Homeo Healthcare. How may I assist you today?",
            hi: "नमस्ते! मैं लूसी हूँ, होमियो हेल्थकेयर के लिए आपकी एआई स्वास्थ्य मार्गदर्शिका। आज मैं आपकी क्या मदद कर सकती हूँ?",
            mr: "नमस्कार! मी लुसी आहे, होमिओ हेल्थकेअरसाठी तुमची एआय आरोग्य मार्गदर्शिका. मी आज तुम्हाला काय मदत करू शकते?",
            gu: "નમસ્તે! હું લ્યુસી છું, હોમિયો હેલ્થકેર માટે તમારી AI હેલ્થ ગાઇડ. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
            bn: "নমস্কার! আমি লুসি, হোমীয় হেলথকেয়ারের জন্য আপনার এআই হেলথ গাইড। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
            te: "నమస్తే! నేను లూసీ, హోమియో హెల్త్‌కేర్ కోసం మీ AI హెల్త్ గైడ్. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?",
            ta: "வணக்கம்! நான் லூசி, ஹோமியோ ஹெல்த்கேருக்கான உங்கள் AI ஹெல்த் கைடு. இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
            kn: "ನಮಸ್ತೆ! ನಾನು ಲೂಸಿ, ಹೋಮಿಯೋ ಹೆಲ್ತ್‌ಕೇರ್‌ಗಾಗಿ ನಿಮ್ಮ AI ಹೆಲ್ತ್ ಗೈಡ್. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"
        };
        const text = welcomeTexts[state.lang] || welcomeTexts.en;
        speakText(text, () => {
            welcomeSpoken = true;
            // Remove fallback listeners immediately
            document.body.removeEventListener('click', speakWelcome);
            document.body.removeEventListener('keydown', speakWelcome);
        });

        // If it doesn't start speaking in 2 seconds, reset requested flag so another click can retry
        setTimeout(() => {
            if (!welcomeSpoken) {
                welcomeSpeakingRequested = false;
            }
        }, 2000);
    }

    // Try to speak after a delay (works if browser allows autoplay or user already interacted)
    setTimeout(() => {
        speakWelcome();
    }, 1000);

    // Fallback: Speak on the very first click or keypress inside the chat box iframe
    document.body.addEventListener('click', speakWelcome);
    document.body.addEventListener('keydown', speakWelcome);

});

// Helper to escape HTML characters
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
