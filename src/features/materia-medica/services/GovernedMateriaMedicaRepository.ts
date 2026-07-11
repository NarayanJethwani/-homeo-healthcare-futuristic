import sampleCorpusJson from "../data/sampleCorpus.json";
import { SampleMateriaMedicaPassage, SampleCorpusManifest } from "../types";

export const GovernedMateriaMedicaRepository = {
  async listApprovedPassages(bookId: string): Promise<SampleMateriaMedicaPassage[]> {
    const data = sampleCorpusJson as any;
    if (!data || !data.manifest || !Array.isArray(data.passages)) {
      return [];
    }
    // Verify source version matched
    if (data.manifest.sourceVersionId !== "james-tyler-kent_v1") {
      return [];
    }
    return data.passages.filter(
      (p: any) => p.bookId === bookId && p.editorialStatus === "approved"
    );
  },

  async getApprovedPassage(passageId: string): Promise<SampleMateriaMedicaPassage | null> {
    const data = sampleCorpusJson as any;
    if (!data || !Array.isArray(data.passages)) {
      return null;
    }
    const passage = data.passages.find((p: any) => p.id === passageId);
    if (!passage || passage.editorialStatus !== "approved") {
      return null;
    }
    return passage as SampleMateriaMedicaPassage;
  },

  async getManifest(): Promise<SampleCorpusManifest> {
    return (sampleCorpusJson as any).manifest as SampleCorpusManifest;
  }
};
export default GovernedMateriaMedicaRepository;
