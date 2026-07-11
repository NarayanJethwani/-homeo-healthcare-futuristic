export type LegacyRemedyEntry = {
  name: string;
  path: string;
};

export type LegacyRemedyContent = {
  title: string;
  content: string;
};

// Approved whitelist of legacy books matching pre-existing database catalog
const APPROVED_LEGACY_BOOK_IDS = new Set([
  "james-tyler-kent",
  "william-boericke",
  "cyrus-maxwell-boger",
  "john-henry-clarke",
]);

export const LegacyMateriaMedicaContentAdapter = {
  async fetchRemediesIndex(bookId: string): Promise<LegacyRemedyEntry[]> {
    if (!APPROVED_LEGACY_BOOK_IDS.has(bookId)) {
      throw new Error(`Access Denied: Book ID ${bookId} is not approved for legacy scraping adapter access.`);
    }

    try {
      const res = await fetch(`/api/materia-medica/index?bookId=${encodeURIComponent(bookId)}`);
      if (res.status === 410) {
        throw new Error("Legacy scraper is currently disabled on this platform.");
      }
      if (!res.ok) {
        throw new Error(`Failed to load remedy index. Server responded with status: ${res.status}`);
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e: any) {
      if (e.message?.includes("Legacy scraper")) {
        throw e;
      }
      throw new Error(e.message || "Failed to contact legacy indexer service.");
    }
  },

  async fetchRemedyContent(bookId: string, path: string): Promise<LegacyRemedyContent> {
    if (!APPROVED_LEGACY_BOOK_IDS.has(bookId)) {
      throw new Error(`Access Denied: Book ID ${bookId} is not approved for legacy scraping adapter access.`);
    }

    // Security: Block path traversal parameters and protocol links to prevent SSRF/LFI
    if (
      path.includes("://") ||
      path.includes("..") ||
      path.includes("?") ||
      path.startsWith("/") ||
      path.startsWith("\\")
    ) {
      throw new Error("Access Denied: Traversal elements, protocols, or queries are forbidden in proving path references.");
    }

    try {
      const res = await fetch(
        `/api/materia-medica/remedy?bookId=${encodeURIComponent(bookId)}&path=${encodeURIComponent(path)}`
      );
      if (res.status === 410) {
        throw new Error("Legacy scraper is currently disabled on this platform.");
      }
      if (!res.ok) {
        throw new Error(`Failed to load proving text content. Status: ${res.status}`);
      }
      return await res.json();
    } catch (e: any) {
      if (e.message?.includes("Legacy scraper") || e.message?.includes("Access Denied")) {
        throw e;
      }
      throw new Error(e.message || "Failed to contact legacy remedy proving provider.");
    }
  }
};
export default LegacyMateriaMedicaContentAdapter;
