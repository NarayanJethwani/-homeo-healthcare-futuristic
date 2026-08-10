import assert from "node:assert/strict";
import { getConsultationMateriaMedicaProfile } from "@/features/consultation/application/consultationMateriaMedicaReadModel.server";

function run() {
  const belladonna = getConsultationMateriaMedicaProfile("belladonna", "william-boericke");
  assert.ok(belladonna, "Belladonna must resolve from the governed remedy catalogue");
  assert.equal(belladonna.slug, "belladonna");
  assert.equal(belladonna.editorialStatus, "published");
  assert.ok(belladonna.keynotes.length >= 3, "Belladonna must expose readable clinical keynotes");
  assert.ok(
    belladonna.citations.some((citation) => citation.id === "CIT-0006" && citation.verificationStatus === "verified"),
    "Belladonna must retain its verified Boericke citation"
  );
  assert.equal(belladonna.selectedSource?.bookId, "william-boericke");
  assert.match(belladonna.selectedSource?.text || "", /BELLADONNA/i);
  assert.ok((belladonna.selectedSource?.text?.length || 0) > 1_000, "The source reader must receive the remedy passage");

  const pulsatilla = getConsultationMateriaMedicaProfile("pulsatilla");
  assert.ok(pulsatilla, "Repertory aliases must resolve to the existing canonical remedy record");
  assert.equal(pulsatilla.slug, "pulsatilla-pratensis");

  const invalid = getConsultationMateriaMedicaProfile("../../etc/passwd");
  assert.equal(invalid, null, "Invalid remedy identifiers must be rejected before file lookup");

  console.log("Consultation Materia Medica integration checks passed");
}

run();
