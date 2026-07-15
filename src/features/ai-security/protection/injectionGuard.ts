export class PromptInjectionGuard {
  static isPromptInjection(query: string): boolean {
    const injectionPatterns = [
      "ignore previous instructions",
      "ignore all previous",
      "system rules",
      "bypass safety",
      "forget what you were told",
      "developer mode",
      "act as a developer",
      "you are now a coding assistant"
    ];
    const q = query.toLowerCase();
    return injectionPatterns.some(pattern => q.includes(pattern));
  }
}
