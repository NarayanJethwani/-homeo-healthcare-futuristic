import { NextResponse } from "next/server";
import { DISEASES } from "@/features/knowledge/content/diseases";
import { serializePublishedKnowledgeEntities } from "@/features/knowledge/public/publicKnowledgeEntityDTO";

export async function GET() {
  return NextResponse.json(serializePublishedKnowledgeEntities(DISEASES));
}
