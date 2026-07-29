import { NextResponse } from "next/server";
import { FAQS } from "@/features/knowledge/content/faqs";
import { serializePublishedKnowledgeEntities } from "@/features/knowledge/public/publicKnowledgeEntityDTO";
import { loadActiveControlledPublicationOverride } from "@/features/knowledge/governance/activeControlledPublication";

export async function GET() {
  const controlledOverride =
    await loadActiveControlledPublicationOverride("FAQ-safety");
  const overrides = new Map();
  if (controlledOverride) {
    overrides.set(controlledOverride.entityId, controlledOverride);
  }
  return NextResponse.json(
    serializePublishedKnowledgeEntities(FAQS, overrides),
    { headers: { "Cache-Control": "no-store" } }
  );
}
