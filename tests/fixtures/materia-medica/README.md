# Materia Medica Test Fixtures Provenance & Licensing Governance

## 1. Kent's Lectures on Homoeopathic Materia Medica
- **Original Author**: James Tyler Kent, M.D. (1849–1916)
- **Original Title**: *Lectures on Homoeopathic Materia Medica*
- **Original Publication Year**: 1905 (1st Edition), 1911 (2nd Edition, Boericke & Tafel, Philadelphia)
- **Edition / Source Used**: Boericke & Tafel 1911 2nd Edition
- **Digital Transcription Source**: Public domain text digitization (Archive.org / Homeoint.org)
- **Redistribution Basis**: The original work is believed to be in the public domain based on its publication date (1905/1911). The provenance and redistribution status of this exact digital transcription are documented separately.
- **Fixture SHA-256 (Normalized)**: `0566c8d34a3055e4a168648b1075e5f764a6f09be52d6ec931d051dc97fd43d2`
- **Test-Only Purpose**: Verifies machine OCR transcription checksum matching for James Tyler Kent's Materia Medica in `tests/materiaMedicaContentInventory.test.ts`.
- **Isolation from Migration**: Test-only input. Confirmed unreferenced by migration dry-run generator (`scripts/run-phase2-2b-firestore-migration-dry-run.ts`), governance component checksums, input dataset checksums (`src/features/knowledge-admin/data/sampleEntities.ts`), write-count calculations, conflict analysis, batch generation, or Firestore deployment authorization gates.
