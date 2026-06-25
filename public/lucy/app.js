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
    // ---------------------------------------------------------
    const langSelect = document.getElementById('lang-select');
    langSelect.addEventListener('change', (e) => {
        state.lang = e.target.value;
        saveState();
        
        // Auto greet in chosen language
        let greeting = "";
        if (state.lang === 'hi') {
            greeting = "नमस्ते! मैं क्लारा हूँ, आपकी एआई स्वास्थ्य सहायक। मैं आपकी क्या मदद कर सकती हूँ?";
        } else if (state.lang === 'mr') {
            greeting = "नमस्कार! मी क्लारा आहे, तुमची एआय आरोग्य सहाय्यक. मी तुम्हाला काय मदत करू शकते?";
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
            mr: "⚠️ तातडीची चेतावणी: या लक्षणांसाठी तात्काळ वैद्यकीय मदतीची आवश्यकता असू शकते. कृपया त्वरित आपत्कालीन सेवांशी (112 किंवा 108) संपर्क साधा किंवा जवळच्या रुग्णालयातील आपत्कालीन विभागात जा."
        },
        disclaimer: {
            en: "Treatment recommendations should be confirmed by a qualified homeopathic physician.",
            hi: "उपचार संबंधी सिफारिशों की पुष्टि एक योग्य होम्योपैथिक चिकित्सक द्वारा की जानी चाहिए।",
            mr: "औषधोपचाराच्या शिफारसींची खात्री पात्र होमिओपॅथी डॉक्टरांकडून केली पाहिजे."
        }
    };


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
                const waText = encodeURIComponent("Hi, I'd like to book a consultation with Dr. Narayan Jethwani from Homeo Healthcare.");
                whatsappBtnHTML = `
                    <div class="chat-cta-container" style="margin-top: 12px; margin-bottom: 4px;">
                        <a href="https://wa.me/919000000000?text=${waText}" target="_blank" class="chat-whatsapp-btn" style="
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

    // Lucy AI Response Generator
    function generateLucyResponse(inputText) {
        // 1. Safety Filter first
        if (checkForEmergency(inputText)) {
            const emergencyAlert = TRANSLATIONS.emergency[state.lang];
            appendLucyMessage(`<strong>${state.lang === 'hi' ? 'आपातकालीन चेतावनी' : state.lang === 'mr' ? 'आपत्कालीन चेतावणी' : 'EMERGENCY PROTOCOL TRIGGERED'}</strong><br>${emergencyAlert}`, false, true);
            // Alert voice output
            speakText(state.lang === 'hi' ? "यह एक आपातकालीन स्थिति हो सकती है। कृपया तुरंत डॉक्टर या आपातकालीन चिकित्सा सेवा से संपर्क करें।" : "This is a medical emergency. Please contact emergency services immediately.");
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
        }

        // 3. Dialogue Routers
        let response = "";
        let requiresDisclaimer = false;

        // Metric questions
        if (lowercase.includes("vitality") || lowercase.includes("biological age") || lowercase.includes("bio age")) {
            response = `Your current **Vitality Score is ${state.vitalityScore}/100** and your estimated **Biological Age is ${state.biologicalAge} years** (chronological baseline is 35). ${LUCY_KB.metrics.vitality.description}`;
        }
        // Daily trackers
        else if (lowercase.includes("water") || lowercase.includes("drink")) {
            response = `Proper hydration is crucial. You've logged ${state.dailyLogs.water} glasses of water today. ${LUCY_KB.lifestyleTips[1].tips[1]} Aim for at least 8 glasses!`;
        }
        else if (lowercase.includes("sleep") || lowercase.includes("insomnia") || lowercase.includes("rest")) {
            response = `You logged ${state.dailyLogs.sleep} hours of sleep last night. Tips for optimal sleep recovery include: <ul><li>${LUCY_KB.lifestyleTips[0].tips[2]}</li><li>${LUCY_KB.lifestyleTips[0].tips[0]}</li></ul>`;
        }
        // Doctor consulting
        else if (lowercase.includes("appointment") || lowercase.includes("book") || lowercase.includes("schedule") || lowercase.includes("doctor") || lowercase.includes("jethwani")) {
            response = `Would you like me to help schedule a consultation with **Dr. Narayan Jethwani**? You can use the Quick Call to Action buttons on the dashboard or directly chat with the reception on WhatsApp.`;
        }
        // Assessment initiation
        else if (lowercase.includes("assess") || lowercase.includes("quiz") || lowercase.includes("test")) {
            response = `I can guide you through a comprehensive wellness assessment (Vitality, Stress, Digestive, Metabolic, Sleep). Please use the **Vitals Assessments** tab on the left to start a structured questionnaire!`;
        }
        // Symptom tracking
        else if (lowercase.includes("symptom") || lowercase.includes("pain") || lowercase.includes("ache")) {
            response = `I see you are mentioning symptoms. To help you prepare a structured summary for Dr. Jethwani, please go to the **Symptom Navigator** tab on the left. Type your duration, triggers, and severity, and I will generate a clean report for you.`;
        }
        // Report interpretation
        else if (lowercase.includes("report") || lowercase.includes("blood") || lowercase.includes("interpret") || lowercase.includes("pdf")) {
            response = `To interpret blood reports or labs (CBC, Lipid panel, Thyroid panel), navigate to the **Report Interpreter** tab on the left. You can simulate file uploads there to see immediate easy-to-understand findings.`;
        }
        // General Welcome / Lucy introduction
        else if (lowercase.includes("hello") || lowercase.includes("hi") || lowercase.includes("lucy") || lowercase.includes("who are you")) {
            response = `Hello! I'm Lucy, your AI health guide. I'm here to translate complex medical data, help you record symptoms, and support you on your wellness path. Remember, I support Dr. Jethwani's clinical assessment but never replace direct physician consultations.`;
        }
        // Materia Medica query check (prevent specific remedy/dosage recommendation)
        else if (lowercase.includes("materia medica") || lowercase.includes("remedy") || lowercase.includes("remedies") || 
                 LUCY_KB.materiaMedica.some(rem => lowercase.includes(rem.name.toLowerCase()) || lowercase.includes(rem.commonName.toLowerCase().split(' ')[0].toLowerCase()))) {
            response = `For patient safety, I cannot recommend specific homeopathic remedies, medicines, or dosages in this chat. Remedy selection must be customized to your constitution by a qualified doctor.<br><br>I highly recommend scheduling a clinical consultation with Dr. Narayan Jethwani to receive a personalized evaluation and prescription. In the meantime, feel free to ask me about general wellness optimization, hydration guidelines, or sleep hygiene tips.`;
            requiresDisclaimer = false;
        }

        // If we matched a local dialogue rule, return immediately
        if (response) {
            if (state.lang === 'hi') {
                response = `[हिन्दी अनुवाद]: ` + translateToHindiMock(lowercase, response);
            } else if (state.lang === 'mr') {
                response = `[मराठी अनुवाद]: ` + translateToMarathiMock(lowercase, response);
            }
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
            mode: "patient"
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

        // Cancel current speak
        window.speechSynthesis.cancel();

        // Strip HTML tags for speaking
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/\*\*|__/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Select friendly female voice if available
        const voices = window.speechSynthesis.getVoices();
        let voice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha'));
        if (voice) utterance.voice = voice;

        // Speed adjust
        utterance.rate = 0.95;

        // Visual animation link
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
        recognition.lang = state.lang === 'hi' ? 'hi-IN' : state.lang === 'mr' ? 'mr-IN' : 'en-US';

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
            recognition.lang = state.lang === 'hi' ? 'hi-IN' : state.lang === 'mr' ? 'mr-IN' : 'en-US';
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
        assessProgress.innerText = `Question ${state.assessQuestionIndex + 1} of ${activeQuestions.length}`;
        assessQuestion.innerText = qData.q;
        assessExplanation.innerText = qData.explanation;

        assessOptions.innerHTML = "";
        selectedScore = null;
        assessNextBtn.disabled = true;

        qData.options.forEach((opt, idx) => {
            const card = document.createElement('div');
            card.className = "option-card";
            card.innerHTML = `
                <span class="option-radio"></span>
                <span>${opt.text}</span>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedScore = opt.score;
                assessNextBtn.disabled = false;
            });
            assessOptions.appendChild(card);
        });

        if (state.ttsEnabled) {
            speakText(qData.explanation);
        }
    }

    assessNextBtn.addEventListener('click', () => {
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

        desc.innerText = `Your completed ${state.activeAssessment.title} score is ${percentScore}/100.`;
        
        if (percentScore >= 80) {
            advice.innerText = "Excellent baseline vitality! Continue maintaining your current hydration and sleep patterns. Regular checks support keeping this state.";
        } else if (percentScore >= 60) {
            advice.innerText = "Moderate sub-health patterns identified. Optimization of sleep hygiene, daily hydration, and consideration of constitutional remedies will help restore optimal balance.";
        } else {
            advice.innerText = "Low vital force resilience. We highly recommend booking a comprehensive consultation with Dr. Narayan Jethwani to build a personalized therapeutic plan.";
        }
    }

    assessFinishBtn.addEventListener('click', () => {
        recalculateHealthMetrics();
        saveState();
        renderAssessmentGuide();

        // Switch back to Chat Companion (both in embed and standalone modes)
        const chatBtn = document.querySelector('[data-tab="chat"]');
        if (chatBtn) chatBtn.click();
        
        assessResult.classList.add('hidden');
        assessIntro.classList.remove('hidden');

        appendLucyMessage(`Congratulations on completing your assessment! Your overall Vitality Score is now updated to ${state.vitalityScore}/100. Let me know if you would like me to explain any recommendations.`);
    });

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
    
    // Initial welcome logic with browser autoplay compatibility
    let welcomeSpoken = false;
    let welcomeSpeakingRequested = false;
    function speakWelcome() {
        if (welcomeSpoken || welcomeSpeakingRequested || !state.ttsEnabled) return;

        welcomeSpeakingRequested = true;
        speakText("Hello! I am Lucy, your AI Health Intelligence Assistant for Homeo Healthcare. How may I assist you today?", () => {
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
