export class FAQWhitelistRegistry {
  private static readonly whitelist = new Set<string>([
    "what is homeopathy?",
    "what is homeopathy",
    "how does classical homeopathy work?",
    "how does classical homeopathy work",
    "what is a miasm?",
    "what is a miasm",
    "are there side effects of homeopathic remedies?",
    "are there side effects of homeopathic remedies",
    "how to contact dr jethwani?",
    "how to contact dr jethwani",
    "what are the clinic's hours?",
    "what are the clinic's hours",
    "clinical os help",
    "repertory os help"
  ].map(faq => faq.normalize("NFC").toLowerCase().trim()));

  /**
   * Evaluates if a query is a safe, pre-approved FAQ (case-insensitive, NFC-normalized, whitespace-trimmed)
   */
  public static isSafeFaq(query: string): boolean {
    if (!query) return false;
    const normalized = query.normalize("NFC").toLowerCase().trim();
    return this.whitelist.has(normalized);
  }
}
