export type CrisisVerdict =
  | { type: "immediate-risk"; warning: string }
  | { type: "possible-safety-concern"; warning: string }
  | { type: "educational" };

const TELE_MANAS_MSG = "If you are experiencing thoughts of self-harm or a mental health crisis, please seek immediate help. You can call the National Tele-MANAS Helpline at 14416 or 1800-89-14416 (India), call or text the Suicide & Crisis Lifeline at 988 (USA/Canada), call 112 (Europe), or contact your local emergency services immediately.";

const CRISIS_REPLIES: Record<string, string> = {
  en: TELE_MANAS_MSG,
  hi: "यदि आप आत्म-हानि या मानसिक स्वास्थ्य संकट का अनुभव कर रहे हैं, तो कृपया तुरंत मदद लें। आप राष्ट्रीय टेली-मानस (Tele-MANAS) हेल्पलाइन को 14416 या 1800-89-14416 पर कॉल कर सकते हैं, या तुरंत स्थानीय आपातकालीन सेवाओं से संपर्क कर सकते हैं।",
  mr: "जर तुम्ही स्वतःला इजा करण्याचे किंवा मानसिक आरोग्य संकटाचे विचार अनुभवत असाल, तर कृपया त्वरित मदत घ्या. तुम्ही राष्ट्रीय टेली-मानस (Tele-MANAS) हेल्पलाइन १४४१६ किंवा १८००-८९-१४४१६ वर कॉल करू शकता, किंवा स्थानिक आपत्कालीन सेवांशी त्वरित संपर्क साधू शकता."
};

const POSSIBLE_SAFETY_CONCERN_MSG = "If you or someone you know is going through a difficult time or mental health distress, please know that support is available. You can call the Tele-MANAS Helpline at 14416 / 1800-89-14416 (India), the Suicide & Crisis Lifeline at 988 (USA/Canada), or your local emergency services for confidential professional support.";

export class CrisisClassifier {
  static classify(query: string, lang: string): CrisisVerdict {
    const q = query.toLowerCase().trim();

    // 1. High Precedence First-Person Intent (bypasses all educational triggers)
    const firstPersonIntentKeywords = [
      "kill myself",
      "end my life",
      "harm myself",
      "self-harm",
      "drink bleach",
      "ingest poison",
      "want to die",
      "fastest way to suicide",
      "मरना चाहता हूं",
      "जीव द्यायचा",
      "जीवन संपवायचे",
      "आत्महत्या करने",
      "आत्महत्या करने का"
    ];

    const hasFirstPersonIntent = firstPersonIntentKeywords.some(keyword => q.includes(keyword));
    if (hasFirstPersonIntent) {
      const warning = CRISIS_REPLIES[lang] || CRISIS_REPLIES.en;
      return { type: "immediate-risk", warning };
    }

    // 2. Safety concern indicators in general query text (takes precedence over educational bypass)
    const safetyConcernKeywords = [
      "friend",
      "someone",
      "patient",
      "denies",
      "assessment",
      "risk",
      "patient denied",
      "risk assessment",
      "discussing case"
    ];
    const hasSafetyConcern = safetyConcernKeywords.some(keyword => q.includes(keyword));

    // 3. General Crisis Topics (evaluated with educational bypasses)
    const generalCrisisKeywords = [
      "suicide",
      "आत्महत्या"
    ];

    const hasGeneralCrisis = generalCrisisKeywords.some(keyword => q.includes(keyword));
    if (hasGeneralCrisis) {
      if (hasSafetyConcern) {
        return { type: "possible-safety-concern", warning: POSSIBLE_SAFETY_CONCERN_MSG };
      }

      const educationalPatterns = [
        "what is",
        "history of",
        "define",
        "statistics",
        "risk factors",
        "how to prevent",
        "difference between",
        "काय आहे",
        "का होते",
        "क्या है",
        "किसे कहते हैं"
      ];

      const isEducational = educationalPatterns.some(pattern => q.includes(pattern));
      if (isEducational) {
        return { type: "educational" };
      }

      const warning = CRISIS_REPLIES[lang] || CRISIS_REPLIES.en;
      return { type: "immediate-risk", warning };
    }

    if (hasSafetyConcern) {
      return { type: "possible-safety-concern", warning: POSSIBLE_SAFETY_CONCERN_MSG };
    }

    return { type: "educational" };
  }
}
