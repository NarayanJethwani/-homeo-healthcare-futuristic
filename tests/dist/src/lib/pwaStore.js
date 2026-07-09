"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePWAInstall = usePWAInstall;
const react_1 = require("react");
let deferredPrompt = null;
const listeners = new Set();
if (typeof window !== "undefined") {
    // Capture the native install prompt event
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        listeners.forEach((listener) => listener(deferredPrompt));
    });
    // Reset when installed successfully
    window.addEventListener("appinstalled", () => {
        deferredPrompt = null;
        listeners.forEach((listener) => listener(null));
        console.log("Homeo Healthcare PWA installed successfully");
    });
}
function usePWAInstall() {
    const [prompt, setPrompt] = (0, react_1.useState)(null);
    const [isInstalled, setIsInstalled] = (0, react_1.useState)(false);
    const [isIOS, setIsIOS] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (typeof window === "undefined")
            return;
        // Check if running in standalone/installed mode
        const checkStandalone = () => {
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
                window.navigator.standalone;
            console.log('PWA Standalone Check (Next.js):', { isStandalone, navigatorStandalone: window.navigator.standalone });
            setIsInstalled(isStandalone);
        };
        // Detect iOS
        const detectIOS = () => {
            const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
            const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
            setIsIOS(isIOSDevice);
        };
        checkStandalone();
        detectIOS();
        // Listen to changes in deferred prompt
        const handlePromptChange = (newPrompt) => {
            setPrompt(newPrompt);
        };
        listeners.add(handlePromptChange);
        // Initialize prompt state if it was already captured
        if (deferredPrompt) {
            setPrompt(deferredPrompt);
        }
        return () => {
            listeners.delete(handlePromptChange);
        };
    }, []);
    const install = async () => {
        if (!prompt)
            return false;
        // Trigger native prompt
        prompt.prompt();
        // Await response
        const { outcome } = await prompt.userChoice;
        // Clear prompt state since it can only be used once
        deferredPrompt = null;
        setPrompt(null);
        listeners.forEach((listener) => listener(null));
        return outcome === "accepted";
    };
    return {
        isInstallable: !!prompt,
        isInstalled,
        isIOS,
        install,
    };
}
