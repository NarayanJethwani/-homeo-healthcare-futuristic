/**
 * Homeo Healthcare Premium Global Javascript
 * Theme Switcher, Mobile Navigation Drawer, Custom Cursor, and Scroll Tracking
 */

function initAll() {
    initThemeSwitcher();
    initMobileNav();
    initScrollTracking();
    initSEOFallbacks();
    initShopFilters();
    initDomainToggle();
    initNavigationDomainFix();
    initScrollAnimations();
    initLucyWidget();
    initCinematicVideos();
    initWhatsAppCTA();
}
window.initAll = initAll;

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAll();
} else {
    document.addEventListener('DOMContentLoaded', initAll);
}

/* ── 1. LIGHT / DARK THEME SWITCHER ── */

function initThemeSwitcher() {
    // Retrieve active theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Check if system prefers dark mode or light mode (fallback)
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    // Apply light theme if saved as light OR no saved theme and system prefers light
    const isLightDefault = savedTheme === 'light' || (!savedTheme && systemPrefersLight);
    if (isLightDefault) {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    function syncThemeToIframe(isLight) {
        const iframe = document.getElementById('lucy-iframe');
        if (!iframe) return;
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && iframeDoc.body) {
                const body = iframeDoc.body;
                if (isLight) {
                    body.classList.remove('dark-mode');
                    body.classList.add('light-mode');
                } else {
                    body.classList.remove('light-mode');
                    body.classList.add('dark-mode');
                }
                
                const iframeThemeBtn = iframeDoc.getElementById('theme-toggle') || iframeDoc.getElementById('theme-btn');
                if (iframeThemeBtn) {
                    iframeThemeBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
                }

                if (iframe.contentWindow.localStorage) {
                    iframe.contentWindow.localStorage.setItem('cios-theme', isLight ? 'light' : 'dark');
                    iframe.contentWindow.localStorage.setItem('theme', isLight ? 'light' : 'dark');
                }
            }
        } catch (e) {
            // Suppress cross-origin warnings or loading errors
        }
    }

    // Click handler for theme toggle
    const themeBtn = document.getElementById('theme-btn') || document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            syncThemeToIframe(isLight);
        });
    }

    // Synchronize theme on iframe load and bind back-syncing click event
    const iframe = document.getElementById('lucy-iframe');
    if (iframe) {
        const handleIframeLoad = () => {
            const isLight = document.body.classList.contains('light-theme') || !document.documentElement.classList.contains('dark');
            syncThemeToIframe(isLight);

            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    const iframeThemeBtn = iframeDoc.getElementById('theme-toggle') || iframeDoc.getElementById('theme-btn');
                    if (iframeThemeBtn && !iframeThemeBtn.dataset.syncBound) {
                        iframeThemeBtn.dataset.syncBound = 'true';
                        iframeThemeBtn.addEventListener('click', () => {
                            setTimeout(() => {
                                const isIframeLight = iframeDoc.body.classList.contains('light-mode') || iframeDoc.body.classList.contains('light-theme');
                                const isParentLight = document.body.classList.contains('light-theme');
                                if (isIframeLight !== isParentLight) {
                                    document.body.classList.toggle('light-theme', isIframeLight);
                                    localStorage.setItem('theme', isIframeLight ? 'light' : 'dark');
                                }
                            }, 50);
                        });
                    }
                }
            } catch (e) {
                console.warn('Cannot bind iframe click listener:', e);
            }
        };

        iframe.addEventListener('load', handleIframeLoad);
        // Sync immediately if already loaded
        try {
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                handleIframeLoad();
            }
        } catch (e) {}
    }

    // Setup MutationObserver to watch classes on html and body elements
    // so we synchronize theme switches done by Next.js components
    try {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    const isBodyLight = document.body.classList.contains('light-theme');
                    if (isDark && isBodyLight) {
                        document.body.classList.remove('light-theme');
                        syncThemeToIframe(false);
                    } else if (!isDark && !isBodyLight) {
                        document.body.classList.add('light-theme');
                        syncThemeToIframe(true);
                    }
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {
        console.warn('MutationObserver not supported or failed to bind:', e);
    }
}

/* ── 2. MOBILE NAVIGATION DRAWER ── */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (!mobileToggle || !mobileDrawer) return;

    // Dynamically clone desktop navigation links into the mobile drawer
    const desktopNavList = document.querySelector('.wp-block-navigation__container');
    if (desktopNavList) {
        const mobileList = mobileDrawer.querySelector('ul');
        if (mobileList) {
            mobileList.innerHTML = ''; // Clear hardcoded links
            const desktopLinks = desktopNavList.querySelectorAll('.wp-block-navigation-item > a');
            desktopLinks.forEach(link => {
                const li = document.createElement('li');
                const clone = link.cloneNode(true);
                li.appendChild(clone);
                mobileList.appendChild(li);
            });
        }
    }

    // Hamburger button click handler
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
        
        // Prevent body scroll when menu is active
        if (mobileDrawer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close drawer when a navigation link is clicked
    mobileDrawer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileToggle.classList.remove('active');
            mobileDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ── 3. SCROLL PROGRESS & HEADER TRANSITION ── */
function initScrollTracking() {
    const progressBar = document.getElementById('sp');
    const navContainer = document.getElementById('nav-container');

    window.addEventListener('scroll', () => {
        // 1. Scroll progress bar width
        if (progressBar) {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollableHeight > 0) {
                const scrollPercent = (window.scrollY / scrollableHeight) * 100;
                progressBar.style.width = `${scrollPercent}%`;
            }
        }

        // 2. Add class 's' to nav-container when scrolled > 50px
        if (navContainer) {
            if (window.scrollY > 50) {
                navContainer.classList.add('s');
            } else {
                navContainer.classList.remove('s');
            }
        }
    }, { passive: true });
}

/* ── 4. SEO FALLBACK META DESCRIPTION ── */
function initSEOFallbacks() {
    if (!document.querySelector('meta[name="description"]')) {
        let desc = "";
        const title = document.title.split("-")[0].trim();
        const path = window.location.pathname;
        
        if (path === "/" || path === "/healing-experience/") {
            desc = "Evidence-based, personalized homeopathic care in Baner, Pune. Guided by 20+ years of clinical experience, treating chronic respiratory, skin, joint, and cardiac conditions at the root cause.";
        } else if (path.includes("/services/")) {
            desc = "Explore the chronic and acute conditions we treat using personalized, evidence-based homeopathy. Comprehensive treatments for respiratory, joint, skin, and cardiac health.";
        } else if (path.includes("/store/")) {
            desc = "Browse and order personalized homeopathic treatment plans, medicine kits, and consult packages online, developed and supervised by Dr. Narayan Jethwani.";
        } else if (path.includes("/blogs/")) {
            desc = "Read clinical insights, case studies, and research-backed homeopathy articles on respiratory health, pediatrics, skin disorders, and metabolic support.";
        } else if (path.includes("/contact-us/")) {
            desc = "Get in touch with Homeo Healthcare in Baner, Pune. Book a consultation or WhatsApp us directly for personalized, evidence-based homeopathic treatment plans.";
        } else if (path.includes("/cart/")) {
            desc = "Your treatment planner shopping cart. Review selected homeopathic consultations and care programmes before secure checkout.";
        } else if (path.includes("/my-account/")) {
            desc = "Access your patient portal. Manage consultations, check treatment orders, view order messages, and message Dr. Narayan Jethwani.";
        } else {
            const p = document.querySelector("p");
            const mainText = p ? p.innerText.substring(0, 120).replace(/\s+/g, " ") : "";
            desc = `${title} - Professional evidence-based homeopathic care by Dr. Narayan Jethwani. ${mainText}`;
        }
        
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = desc;
        document.head.appendChild(meta);
    }
}

/* ── 5. SHOP FILTER ACTIVE STATE ── */
function initShopFilters() {
    const tabs = document.querySelectorAll('.shop-filter-tab');
    if (!tabs.length) return;

    const path = window.location.pathname;
    tabs.forEach(tab => {
        tab.classList.remove('active');
        const href = tab.getAttribute('href');
        if (!href) return;
        
        // Remove protocol + domain for clean matching
        const cleanHref = href.replace(/^https?:\/\/[^\/]+/, '');
        
        // Match All tab
        if (cleanHref === '/store/' || cleanHref === '/store') {
            if (path === '/store/' || path === '/store') {
                tab.classList.add('active');
            }
        } else if (path.includes(cleanHref)) {
            tab.classList.add('active');
        }
    });
}

/* ── 6. DYNAMIC DOMAIN TOGGLE (Public Site / Back to Future) ── */
function initDomainToggle() {
    const toggleBtns = document.querySelectorAll('.domain-toggle-btn');
    if (!toggleBtns.length) return;

    const hostname = window.location.hostname;
    // Check if we are on homeo.healthcare or localhost testing domain mapped to it
    const isPublic = !hostname.includes('admin.') && (hostname.includes('homeo.healthcare') || hostname.includes('localhost') || hostname.includes('127.0.0.1'));

    toggleBtns.forEach(btn => {
        if (isPublic) {
            btn.href = 'https://admin.homeo.healthcare' + window.location.pathname + window.location.search;
            btn.innerHTML = 'Clinical Workspace';
        } else {
            btn.href = 'https://homeo.healthcare' + window.location.pathname + window.location.search;
            btn.innerHTML = 'Public Site';
        }
    });
}

/* ── 7. DOMAIN CORRECTOR FOR LOCAL SITE NAVIGATION ── */
function initNavigationDomainFix() {
    const hostname = window.location.hostname;
    const isPublic = !hostname.includes('admin.') && (hostname.includes('homeo.healthcare') || hostname.includes('localhost') || hostname.includes('127.0.0.1'));

    if (isPublic) {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('https://admin.homeo.healthcare/')) {
                const relativePath = href.substring('https://admin.homeo.healthcare'.length);
                link.href = window.location.origin + relativePath;
            }
        });
    }
}

/* ── 8. SCROLL ENTRANCE OBSERVER FOR PREMIUM BLOCKS ── */
function initScrollAnimations() {
    const targets = document.querySelectorAll(
      ".article-section, .section-title, .wp-article-body-image, .wp-bento-card, .wp-bento-card-2col, .wp-timeline-item, .wp-insight-block, .wp-risk-module, .wp-table-container, .wp-remedy-profile, .wp-takeaways-block"
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    targets.forEach((t) => {
      t.classList.add('animate-on-scroll');
      observer.observe(t);
    });
}

/* ── 9. LUCY AI ASSISTANT WIDGET TOGGLE ── */
function initLucyWidget() {
    const launcher = document.getElementById('lucy-bubble-launcher');
    const container = document.getElementById('lucy-widget-container');
    const closeBtn = document.getElementById('lucy-close-btn');
    const iframe = document.getElementById('lucy-iframe');

    if (!launcher || !container || !closeBtn || !iframe) return;

    launcher.addEventListener('click', () => {
        const isActive = container.classList.toggle('active');
        if (isActive && !iframe.getAttribute('src')) {
            // Load iframe src on demand
            const dataSrc = iframe.getAttribute('data-src');
            if (dataSrc) {
                iframe.src = dataSrc;
            }
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.remove('active');
        container.classList.remove('fullscreen-active');

        // Notify the iframe that it has been closed so it can reset its internal fullscreen state
        try {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'parent-closed' }, '*');
            }
        } catch (err) {
            console.error("Failed to notify iframe of close event:", err);
        }
    });

    // Listen for postMessage from the iframe to toggle parent container's fullscreen state
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'toggle-fullscreen') {
            if (event.data.isFullscreen) {
                container.classList.add('fullscreen-active');
            } else {
                container.classList.remove('fullscreen-active');
            }
        }
    });
}

/* ── 10. PNEI WIDGET INTERACTIVE SCRIPTS ── */

// A. Organ Node Click Handler
(function() {
    const organData = {
        brain: {
            title: "Cerebral Cortex & Limbic System",
            desc: "The 'Psycho' and 'Neuro' origin. Perceives stress, registers emotions, and controls memory. Through the amygdala and hippocampus, it translates psychological events into neurological signals, immediately altering biological balance.",
            signals: "Neurotransmitters (Serotonin, Dopamine, Norepinephrine, GABA)"
        },
        pituitary: {
            title: "Hypothalamus & Pituitary Glands",
            desc: "The master translation center. The hypothalamus releases CRH (Corticotropin-Releasing Hormone) which commands the Pituitary gland to secrete ACTH. This triggers the neuroendocrine cascade directing thyroid, adrenal, and reproductive function.",
            signals: "Neuropeptides (CRH, Oxytocin, Vasopressin), Hormones (ACTH, TSH, LH)"
        },
        thyroid: {
            title: "Thyroid Gland (HPT Axis)",
            desc: "The metabolic regulator of the PNEI axis. Under stress, HPT axis suppression occurs, slowing down peripheral conversion of T4 to T3. This alters basal metabolic rate, body temperature, and immune cell responsiveness.",
            signals: "Thyroxine (T4), Triiodothyronine (T3)"
        },
        immune: {
            title: "Immune Network (Thymus & Lymph Nodes)",
            desc: "The cellular defense guard. Immune cells express receptors for hormones (cortisol) and neurotransmitters. Conversely, immune-derived cytokines travel back through the blood, crossing the blood-brain barrier to alter mood, sleep, and brain function.",
            signals: "Cytokines (IL-1, IL-6, TNF-alpha, Interferon-gamma)"
        },
        adrenals: {
            title: "Adrenal Glands (HPA Axis & Sympathetic Nerve Loop)",
            desc: "The stress response executioners. Chronic neurological distress triggers adrenal cortex to release cortisol, and the adrenal medulla to release adrenaline. This suppresses immune surveillance and triggers systemic, low-grade vascular inflammation.",
            signals: "Glucocorticoids (Cortisol), Catecholamines (Adrenaline, Noradrenaline)"
        },
        gut: {
            title: "Gut Microbiome & Mucosal Barrier",
            desc: "The second brain. Home to 70% of the immune system and 90% of serotonin synthesis. Gut microbiota interact directly with the vagus nerve, sending bidirectional signals that affect inflammation, anxiety, and hypothalamic sensitivity.",
            signals: "Short-Chain Fatty Acids (SCFAs), Serotonin, LPS, Cytokines"
        }
    };

    document.addEventListener('click', function(e) {
        const node = e.target.closest('.organ-node');
        if (!node) return;

        const container = node.closest('.pnei-widget-container');
        if (!container) return;

        const nodes = container.querySelectorAll('.organ-node');
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        const target = node.getAttribute('data-target');
        const oTitle = container.querySelector('#organ-title');
        const oDesc = container.querySelector('#organ-desc');
        const oMetrics = container.querySelector('#organ-metrics');
        const oSignaling = container.querySelector('#organ-signaling');
        const infoCard = container.querySelector('#organ-info-card');

        if (organData[target] && oTitle && oDesc && oSignaling) {
            oTitle.textContent = organData[target].title;
            oDesc.textContent = organData[target].desc;
            oSignaling.textContent = organData[target].signals;
            if (oMetrics) oMetrics.style.display = 'block';
            if (infoCard) infoCard.style.boxShadow = '0 0 15px rgba(var(--theme-color-rgb), 0.15)';
        }
    });
})();

// B. Stress vs Homeostasis Toggle
(function() {
    function getWidgetElements(targetButton) {
        const container = targetButton.closest('.pnei-widget-container');
        if (!container) return null;

        return {
            btnHomeo: container.querySelector('#btn-homeo'),
            btnStress: container.querySelector('#btn-stress'),
            p1: container.querySelector('#part-1'),
            p2: container.querySelector('#part-2'),
            p3: container.querySelector('#part-3'),
            p4: container.querySelector('#part-4'),
            nodePsycho: container.querySelector('#node-psycho'),
            nodeNeuro: container.querySelector('#node-neuro'),
            nodeEndocrine: container.querySelector('#node-endocrine'),
            nodeImmune: container.querySelector('#node-immune'),
            l1: container.querySelector('#path-1'),
            l2: container.querySelector('#path-2'),
            l3: container.querySelector('#path-3'),
            l4: container.querySelector('#path-4'),
            rPathway: container.querySelector('#readout-pathway'),
            rMolecules: container.querySelector('#readout-molecules'),
            rStatus: container.querySelector('#readout-status')
        };
    }

    function setPathwayState(els, state) {
        if (!els) return;
        const { btnHomeo, btnStress, p1, p2, p3, p4, nodePsycho, nodeNeuro, nodeEndocrine, nodeImmune, l1, l2, l3, l4, rPathway, rMolecules, rStatus } = els;

        if (state === 'stress') {
            if (btnHomeo) btnHomeo.classList.remove('active');
            if (btnStress) btnStress.classList.add('active');

            if (p1) { p1.style.animationDuration = '1s'; p1.setAttribute('fill', '#EF4444'); }
            if (p2) { p2.style.animationDuration = '1.2s'; p2.setAttribute('fill', '#F97316'); }
            if (p3) { p3.style.animationDuration = '1.4s'; p3.setAttribute('fill', '#F43F5E'); }
            if (p4) { p4.style.animationDuration = '1.6s'; p4.setAttribute('fill', '#B91C1C'); }

            if (nodePsycho) nodePsycho.setAttribute('fill', '#EF4444');
            if (nodeNeuro) nodeNeuro.setAttribute('fill', '#F97316');
            if (nodeEndocrine) nodeEndocrine.setAttribute('fill', '#F43F5E');
            if (nodeImmune) nodeImmune.setAttribute('fill', '#B91C1C');

            if (l1) l1.style.stroke = 'rgba(239, 68, 68, 0.4)';
            if (l2) l2.style.stroke = 'rgba(249, 115, 22, 0.4)';
            if (l3) l3.style.stroke = 'rgba(244, 63, 94, 0.4)';
            if (l4) l4.style.stroke = 'rgba(185, 28, 28, 0.4)';

            if (rPathway) rPathway.textContent = "Sympathetic / Adrenal Medullary (SAM)";
            if (rMolecules) rMolecules.textContent = "High Cortisol, High Adrenaline, High IL-6 (Inflammatory)";
            if (rStatus) {
                rStatus.textContent = "Immune Suppression & Mucosal Degradation Active";
                rStatus.style.setProperty('color', '#EF4444', 'important');
            }
        } else {
            if (btnStress) btnStress.classList.remove('active');
            if (btnHomeo) btnHomeo.classList.add('active');

            if (p1) { p1.style.animationDuration = '2.5s'; p1.setAttribute('fill', '#38BDF8'); }
            if (p2) { p2.style.animationDuration = '3s'; p2.setAttribute('fill', '#F472B6'); }
            if (p3) { p3.style.animationDuration = '3.5s'; p3.setAttribute('fill', '#FB7185'); }
            if (p4) { p4.style.animationDuration = '4s'; p4.setAttribute('fill', '#C084FC'); }

            if (nodePsycho) nodePsycho.setAttribute('fill', '#0D9488');
            if (nodeNeuro) nodeNeuro.setAttribute('fill', '#0284C7');
            if (nodeEndocrine) nodeEndocrine.setAttribute('fill', '#EC4899');
            if (nodeImmune) nodeImmune.setAttribute('fill', '#A855F7');

            if (l1) l1.style.stroke = 'var(--border-color)';
            if (l2) l2.style.stroke = 'var(--border-color)';
            if (l3) l3.style.stroke = 'var(--border-color)';
            if (l4) l4.style.stroke = 'var(--border-color)';

            if (rPathway) rPathway.textContent = "Parasympathetic / Vagal Restorative";
            if (rMolecules) rMolecules.textContent = "Low Cortisol, Balanced IL-10 (Anti-inflammatory)";
            if (rStatus) {
                rStatus.textContent = "Immune Surveillance & Repair Active";
                rStatus.style.setProperty('color', 'var(--white)', 'important');
            }
        }
    }

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('#btn-homeo, #btn-stress');
        if (!btn) return;

        e.preventDefault();
        const els = getWidgetElements(btn);
        if (!els) return;

        const state = btn.id === 'btn-stress' ? 'stress' : 'homeostasis';
        setPathwayState(els, state);
    });
})();

// C. Interactive Slider Input
(function() {
    document.addEventListener('input', function(e) {
        const range = e.target.closest('#pnei-range');
        if (!range) return;

        const container = range.closest('.pnei-widget-container');
        if (!container) return;

        const val = parseInt(range.value, 10);
        
        // Update metric displays based on slider value
        const fCortisol = container.querySelector('#fill-cortisol');
        const vCortisol = container.querySelector('#val-cortisol');
        if (fCortisol && vCortisol) {
            fCortisol.style.width = val + '%';
            const cortisolVal = (5.0 + (val * 0.18)).toFixed(1);
            vCortisol.textContent = cortisolVal + ' mcg/dL';
        }
        
        const fIl6 = container.querySelector('#fill-il6');
        const vIl6 = container.querySelector('#val-il6');
        if (fIl6 && vIl6) {
            const il6Pct = 100 - val;
            const il6Val = (0.8 + (il6Pct * 0.06)).toFixed(1);
            fIl6.style.width = il6Pct + '%';
            vIl6.textContent = il6Val + ' pg/mL';
        }
    });
})();

// D. PNEI Integration Quiz Handlers
(function() {
    const questions = [
        {
            q: "Which biological axis is responsible for translating mental stress into physical adrenal cortisol release?",
            opts: [
                "The Hypothalamic-Pituitary-Thyroid (HPT) Axis",
                "The Hypothalamic-Pituitary-Adrenal (HPA) Axis",
                "The Sympathetic-Vagal Reflex Arc",
                "The Hepato-Renal Filtration System"
            ],
            correct: 1,
            feedback: "Correct! The Hypothalamic-Pituitary-Adrenal (HPA) axis directs the neuroendocrine response to stress: the hypothalamus secretes CRH, signaling the pituitary to secrete ACTH, which commands the adrenals to release cortisol."
        },
        {
            q: "How do inflammatory cytokines (e.g. IL-6, TNF-alpha) interact with the brain?",
            opts: [
                "They are blocked entirely by the blood-brain barrier",
                "They enter the brain only via direct nerve injury",
                "They cross the blood-brain barrier via active transport, altering neurotransmitters and mood",
                "They only affect peripheral organs, leaving cognitive functions untouched"
            ],
            correct: 2,
            feedback: "Correct! Cytokines can traverse the blood-brain barrier through active transport systems and vagal afferent signaling, causing neuroinflammation and altering dopamine/serotonin synthesis, which triggers mood shifts and fatigue."
        },
        {
            q: "Which cranial nerve mediates the primary 'Rest and Digest' parasympathetic feedback loop between the gut, heart, and brain?",
            opts: [
                "Trigeminal Nerve (CN V)",
                "Facial Nerve (CN VII)",
                "Vagus Nerve (CN X)",
                "Accessory Nerve (CN XI)"
            ],
            correct: 2,
            feedback: "Correct! The Vagus Nerve (CN X) represents the main bidirectional communication superhighway of the gut-brain-immune axis, modulating heart rate, digestive motility, and systemic inflammatory responses."
        },
        {
            q: "Under chronic stress and cortisol elevation, what typical pathological shift happens in the gut barrier?",
            opts: [
                "Tight junction proteins break down, causing 'leaky gut' and allowing bacterial translocation",
                "Mucosal lining thickens, blocking all nutrient absorption",
                "Gut motility accelerates, increasing stomach acid pH",
                "Beneficial gut flora multiplies, enhancing immune defense"
            ],
            correct: 0,
            feedback: "Correct! Chronic cortisol secretion triggers mast cell activation, which degrades tight junction proteins (Zonulin/Occludin). This causes a 'leaky gut' barrier, allowing bacterial particles to trigger systemic immune response."
        },
        {
            q: "What is the primary objective of individualized Homeopathic treatment within the PNEI framework?",
            opts: [
                "To target and destroy circulating pathogens",
                "To chemically suppress hormone secretion",
                "To support overall stress resilience, sleep quality, and vital force balance",
                "To serve as a direct replacement for emergency surgery"
            ],
            correct: 2,
            feedback: "Correct! In homeopathy, remedies are selected based on the somatic-psychic profile of the individual to support stress resilience, sleep, and the vital force, working in synergy with the body's natural defense mechanisms."
        }
    ];

    function initQuiz(container) {
        const optsContainer = container.querySelector('#quiz-options-container');
        if (!optsContainer) return;
        if (container.dataset.quizInitialized && optsContainer.children.length > 0) return;
        container.dataset.quizInitialized = 'true';

        let currentIdx = 0;
        let score = 0;

        const qBox = container.querySelector('#quiz-question-box');
        const rBox = container.querySelector('#quiz-results-box');
        const qText = container.querySelector('#quiz-question');
        const progressText = container.querySelector('#quiz-progress-text');
        const feedbackBox = container.querySelector('#quiz-feedback');
        const feedbackText = container.querySelector('#quiz-feedback-text');
        const nextBtn = container.querySelector('#quiz-next-btn');
        const restartBtn = container.querySelector('#quiz-restart-btn');
        const scoreText = container.querySelector('#quiz-score-text');

        function loadQuestion() {
            if (feedbackBox) feedbackBox.style.display = 'none';
            const qItem = questions[currentIdx];
            if (progressText) progressText.textContent = `Question ${currentIdx + 1} of ${questions.length}`;
            if (qText) qText.textContent = qItem.q;
            if (optsContainer) {
                optsContainer.innerHTML = '';
                qItem.opts.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'quiz-opt';
                    btn.textContent = opt;
                    btn.addEventListener('click', () => selectOption(idx));
                    optsContainer.appendChild(btn);
                });
            }
        }

        function selectOption(selectedIdx) {
            const qItem = questions[currentIdx];
            const buttons = optsContainer.querySelectorAll('.quiz-opt');

            buttons.forEach((btn, idx) => {
                btn.disabled = true;
                if (idx === qItem.correct) {
                    btn.classList.add('correct');
                } else if (idx === selectedIdx) {
                    btn.classList.add('incorrect');
                }
            });

            if (selectedIdx === qItem.correct) {
                score++;
            }

            if (feedbackText) feedbackText.textContent = qItem.feedback;
            if (feedbackBox) feedbackBox.style.display = 'block';
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIdx++;
                if (currentIdx < questions.length) {
                    loadQuestion();
                } else {
                    if (qBox) qBox.style.display = 'none';
                    if (feedbackBox) feedbackBox.style.display = 'none';
                    if (rBox) rBox.style.display = 'block';
                    if (scoreText) scoreText.textContent = `You scored ${score} out of ${questions.length}`;
                }
            });
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                currentIdx = 0;
                score = 0;
                if (qBox) qBox.style.display = 'block';
                if (rBox) rBox.style.display = 'none';
                loadQuestion();
            });
        }

        loadQuestion();
    }

    function checkAndInit() {
        const quizContainer = document.querySelector('#pnei-knowledge-quiz');
        if (quizContainer) {
            initQuiz(quizContainer);
        }
    }
    window.checkAndInitQuiz = checkAndInit;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        checkAndInit();
    }

    document.addEventListener('click', checkAndInit);
    document.addEventListener('mousemove', checkAndInit);
})();

/* ── 11. PREMIUM CINEMATIC VIDEO & CANVAS PARTICLE ENGINE ── */
function initCinematicVideos() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Select all images on the page that represent PNEI illustrations
    const images = Array.from(document.querySelectorAll('img'));
    
    const pneiImages = images.filter(img => {
        const src = img.src || '';
        const alt = img.alt || '';
        return src.includes('post_pnei_') || src.includes('pnei_') || alt.includes('PNEI') || alt.includes('HPA') || alt.includes('Vagus') || alt.includes('Nervous') || alt.includes('Endocrine') || alt.includes('Immune') || alt.includes('Biomarkers') || alt.includes('Timeline');
    });

    pneiImages.forEach((img, idx) => {
        // Skip if already upgraded
        if (img.dataset.upgradedToVideo === 'true') return;
        img.dataset.upgradedToVideo = 'true';

        // 1. Create container
        const container = document.createElement('div');
        container.className = 'premium-video-container';
        
        // Inherit styling and position of image wrapper if Gutenberg block
        const parent = img.parentNode;
        if (parent && parent.classList.contains('wp-block-image')) {
            // Upgrade the Gutenberg image block to be the container or insert inside it
            parent.appendChild(container);
        } else {
            parent.insertBefore(container, img);
        }
        
        container.appendChild(img);

        // Determine scene type based on image source or alt text
        let sceneType = 'generic';
        const alt = img.alt.toLowerCase();
        const src = img.src.toLowerCase();
        if (alt.includes('featured') || src.includes('featured')) {
            sceneType = 'hero';
        } else if (alt.includes('timeline') || src.includes('img3')) {
            sceneType = 'timeline';
        } else if (alt.includes('psychology') || src.includes('img4')) {
            sceneType = 'psychology';
        } else if (alt.includes('nervous') || src.includes('img5')) {
            sceneType = 'nervous';
        } else if (alt.includes('endocrine') || src.includes('img2')) {
            sceneType = 'endocrine';
        } else if (alt.includes('immune') || src.includes('img10') || src.includes('img7')) {
            sceneType = 'immune';
        } else if (alt.includes('biomarker') || src.includes('img10')) {
            sceneType = 'biomarkers';
        }

        // Add class to container based on scene type
        container.classList.add(`scene-${sceneType}`);

        // 2. Add video elements
        const canvas = document.createElement('canvas');
        canvas.className = 'premium-video-canvas';
        container.appendChild(canvas);

        const watermark = document.createElement('div');
        watermark.className = 'premium-video-watermark';
        watermark.textContent = 'Homeo.Healthcare';
        container.appendChild(watermark);

        const playOverlay = document.createElement('div');
        playOverlay.className = 'premium-video-overlay-play';
        playOverlay.innerHTML = '<button class="premium-video-play-btn" aria-label="Play Cinematic Video"><i class="fa-solid fa-play"></i></button>';
        container.appendChild(playOverlay);

        const hud = document.createElement('div');
        hud.className = 'premium-video-hud';
        container.appendChild(hud);

        const hudGrid = document.createElement('div');
        hudGrid.className = 'premium-video-hud-grid';
        container.appendChild(hudGrid);

        // Special title overlay for Hero video
        if (sceneType === 'hero') {
            const heroTitle = document.createElement('div');
            heroTitle.className = 'premium-video-hero-title';
            heroTitle.innerHTML = '<h2>The Body Never Works Alone</h2><p>The Mind, Brain, Hormones, and Immune System are constantly communicating.</p>';
            container.appendChild(heroTitle);
        }

        // 3. Canvas Particle Engine Setup
        if (prefersReducedMotion) return; // Skip animations if user prefers reduced motion

        const ctx = canvas.getContext('2d');
        let animationFrameId = null;
        let isVisible = false;

        function resizeCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        // Set initial sizes
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle configuration based on scene type
        const particles = [];
        const maxParticles = sceneType === 'hero' ? 45 : 25;

        // Populate initial particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(createParticle(canvas.width, canvas.height, sceneType));
        }

        // HUD specific values
        let hudValues = { hrv: 72, cortisol: 14.5, crp: 1.2, il6: 3.2 };

        function createParticle(w, h, type) {
            const p = {
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.1,
                color: 'rgba(0, 200, 180, ' // Default teal
            };

            if (type === 'hero') {
                p.r = Math.random() * 5 + 2;
                p.vx = (Math.random() - 0.5) * 0.6;
                p.vy = (Math.random() - 0.5) * 0.6;
                // Hero particles can be green, teal, blue, violet
                const choices = ['0, 200, 180,', '16, 185, 129,', '14, 165, 233,', '139, 92, 246,'];
                p.color = 'rgba(' + choices[Math.floor(Math.random() * choices.length)] + ' ';
            } else if (type === 'endocrine') {
                p.r = Math.random() * 8 + 3; // larger hormone spheres
                p.vx = (Math.random() - 0.5) * 0.3;
                p.vy = -Math.random() * 0.5 - 0.1; // rise up slowly
                p.color = 'rgba(16, 185, 129, '; // Emerald green
            } else if (type === 'nervous') {
                p.r = Math.random() * 2 + 1;
                p.vx = (Math.random() - 0.5) * 1.2;
                p.vy = (Math.random() - 0.5) * 1.2;
                p.color = 'rgba(14, 165, 233, '; // Blue/cyan
            } else if (type === 'immune') {
                p.r = Math.random() * 4 + 2;
                p.vx = (Math.random() - 0.5) * 0.5;
                p.vy = (Math.random() - 0.5) * 0.5;
                p.color = 'rgba(139, 92, 246, '; // Violet
            }

            return p;
        }

        // DNA double helix sine wave helper
        let dnaOffset = 0;
        function drawDNA(ctx, w, h) {
            const amp = 15;
            const freq = 0.01;
            ctx.lineWidth = 1.2;

            for (let x = 0; x < w; x += 12) {
                const y1 = h/2 + Math.sin(x * freq + dnaOffset) * amp;
                const y2 = h/2 - Math.sin(x * freq + dnaOffset) * amp;

                // Draw strands
                ctx.fillStyle = 'rgba(0, 200, 180, 0.15)';
                ctx.beginPath();
                ctx.arc(x, y1, 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
                ctx.beginPath();
                ctx.arc(x, y2, 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw connector lines
                if (x % 24 === 0) {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.beginPath();
                    ctx.moveTo(x, y1);
                    ctx.lineTo(x, y2);
                    ctx.stroke();
                }
            }
        }

        // Draw HUD overlay text
        function drawHUDData(ctx, w, h) {
            ctx.font = '700 9px monospace';
            ctx.fillStyle = 'rgba(13, 148, 136, 0.4)';
            
            // Random jitter to simulate real-time sensors
            if (Math.random() > 0.98) hudValues.hrv = Math.floor(65 + Math.random() * 15);
            if (Math.random() > 0.98) hudValues.cortisol = (12.0 + Math.random() * 5).toFixed(1);
            if (Math.random() > 0.98) hudValues.il6 = (2.5 + Math.random() * 1.5).toFixed(1);

            ctx.fillText(`SENSOR_SYS: ONLINE`, 24, 30);
            ctx.fillText(`HRV_BASE: ${hudValues.hrv} ms`, 24, 45);
            ctx.fillText(`CORTISOL: ${hudValues.cortisol} mcg/dL`, 24, 60);
            ctx.fillText(`IL-6_EXP: ${hudValues.il6} pg/mL`, 24, 75);

            // Draw a tiny running graph line
            ctx.strokeStyle = 'rgba(13, 148, 136, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(24, 100);
            for (let i = 0; i < 60; i += 5) {
                const jitter = Math.sin((i + dnaOffset * 100) * 0.1) * 8;
                ctx.lineTo(24 + i, 100 + jitter);
            }
            ctx.stroke();
        }

        // Draw neural firing lines
        function drawNeuralFires(ctx, w, h) {
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.moveTo(w / 2, h / 2);
                const targetX = w / 2 + Math.cos(dnaOffset * 2 + i * Math.PI/2) * (w / 3);
                const targetY = h / 2 + Math.sin(dnaOffset * 2 + i * Math.PI/2) * (h / 3);
                ctx.lineTo(targetX, targetY);
            }
            ctx.stroke();
        }

        function drawLoop() {
            if (!isVisible || !document.contains(canvas)) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                return;
            }

            dnaOffset += 0.015;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw special backdrop elements
            if (sceneType === 'hero') {
                drawDNA(ctx, canvas.width, canvas.height);
            } else if (sceneType === 'biomarkers') {
                drawHUDData(ctx, canvas.width, canvas.height);
            } else if (sceneType === 'nervous') {
                drawNeuralFires(ctx, canvas.width, canvas.height);
            }

            // 2. Update and draw particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Screen boundaries bounce/reset
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0) {
                    if (sceneType === 'endocrine') {
                        p.y = canvas.height; // Loop from bottom
                        p.x = Math.random() * canvas.width;
                    } else {
                        p.vy *= -1;
                    }
                } else if (p.y > canvas.height) {
                    p.vy *= -1;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.alpha + ')';
                // Add soft cell glow for larger particles
                if (p.r > 4) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color.replace('rgba', '').split(',').slice(0, 3).join(',');
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            });
            ctx.shadowBlur = 0; // Reset shadow

            animationFrameId = requestAnimationFrame(drawLoop);
        }

        // 4. Intersection Observer for Pause/Play on viewport scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    container.classList.add('is-visible');
                    // Start animation loop
                    if (!animationFrameId) {
                        drawLoop();
                    }
                } else {
                    isVisible = false;
                    container.classList.remove('is-visible');
                    // Stop animation loop
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px 50px 0px"
        });

        observer.observe(container);
    });
}

/* ── 12. WHATSAPP STICKY CTA SCROLL TRACKING ── */
function initWhatsAppCTA() {
    const cta = document.querySelector('.whatsapp-sticky-cta');
    if (!cta) return;
    
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            // Scrolling down - hide
            cta.classList.add('whatsapp-hidden');
        } else {
            // Scrolling up - show
            cta.classList.remove('whatsapp-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
}








