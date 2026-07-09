"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModeProvider = PatientModeProvider;
exports.usePatientMode = usePatientMode;
exports.simplifyMedicalJargon = simplifyMedicalJargon;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const knowledgeAnalytics_1 = require("../analytics/knowledgeAnalytics");
const PatientModeContext = (0, react_1.createContext)(undefined);
function PatientModeProvider({ children }) {
    const [audienceMode, setAudienceModeState] = (0, react_1.useState)("patient");
    // Sync with localStorage
    (0, react_1.useEffect)(() => {
        const saved = localStorage.getItem("audience_mode_selection");
        if (saved === "patient" || saved === "student" || saved === "practitioner") {
            setAudienceModeState(saved);
        }
    }, []);
    const setAudienceMode = (mode) => {
        setAudienceModeState(mode);
        localStorage.setItem("audience_mode_selection", mode);
        // Track mode changes
        (0, knowledgeAnalytics_1.trackPatientModeToggle)(mode === "patient");
    };
    const setIsPatientFriendly = (val) => {
        setAudienceMode(val ? "patient" : "practitioner");
    };
    const isPatientFriendly = audienceMode === "patient";
    return ((0, jsx_runtime_1.jsx)(PatientModeContext.Provider, { value: { audienceMode, setAudienceMode, isPatientFriendly, setIsPatientFriendly }, children: children }));
}
function usePatientMode() {
    const context = (0, react_1.useContext)(PatientModeContext);
    if (!context) {
        return {
            audienceMode: "patient",
            setAudienceMode: () => { },
            isPatientFriendly: true,
            setIsPatientFriendly: () => { }
        };
    }
    return context;
}
/**
 * Text translation dictionary mapping medical jargon to layman parenthetical definitions.
 */
const JARGON_DICTIONARY = {
    "atopic dermatitis": "atopic dermatitis (eczema, a chronic inflammatory skin condition)",
    "erythrocyte sedimentation rate": "erythrocyte sedimentation rate (ESR, a blood test that detects inflammation)",
    "c-reactive protein": "c-reactive protein (CRP, a marker produced by the liver that rises during inflammation)",
    "gastroesophageal reflux disease": "gastroesophageal reflux disease (acid reflux causing heartburn)",
    "psoriasis": "psoriasis (a skin disease causing itchy, scaly red patches)",
    "urticaria": "urticaria (hives, a red and itchy skin rash triggered by allergies)",
    "hypothyroidism": "hypothyroidism (underactive thyroid gland producing insufficient hormones)",
    "hyperthyroidism": "hyperthyroidism (overactive thyroid gland producing excess hormones)",
    "glycated hemoglobin": "glycated hemoglobin (HbA1c, a test measuring average blood sugar over 3 months)",
    "creatinine": "creatinine (a waste product cleared by the kidneys, used to check kidney function)",
    "bilirubin": "bilirubin (a yellow compound formed during red blood cell breakdown, checking liver health)",
    "tsh": "TSH (Thyroid Stimulating Hormone, the master regulator of metabolic rate)",
    "cholelithiasis": "cholelithiasis (gallbladder stones)",
    "nephrolithiasis": "nephrolithiasis (kidney stones)",
    "otitis media": "otitis media (middle ear infection)",
    "dyspepsia": "dyspepsia (indigestion and upper abdominal discomfort)",
    "bronchitis": "bronchitis (inflammation of the lung's airways)",
    "allergic rhinitis": "allergic rhinitis (hay fever causing sneezing and nasal congestion)",
    "alopecia": "alopecia (hair loss)"
};
/**
 * Traverses a string and replaces medical jargon terms with simplified explanations.
 */
function simplifyMedicalJargon(text) {
    if (!text)
        return "";
    let simplified = text;
    // Case-insensitive replacement loops
    Object.entries(JARGON_DICTIONARY).forEach(([jargon, layman]) => {
        const regex = new RegExp(`\\b${jargon}\\b`, "gi");
        simplified = simplified.replace(regex, match => {
            // Preserve first character capitalization
            if (match[0] === match[0].toUpperCase()) {
                return layman[0].toUpperCase() + layman.slice(1);
            }
            return layman;
        });
    });
    return simplified;
}
