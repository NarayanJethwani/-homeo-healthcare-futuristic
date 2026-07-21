import { NextResponse } from "next/server";
import { REMEDIES } from "@/features/knowledge/content/remedies";
import { serializePublishedKnowledgeEntities } from "@/features/knowledge/public/publicKnowledgeEntityDTO";

export async function GET() {
  return NextResponse.json(serializePublishedKnowledgeEntities(REMEDIES));
}
