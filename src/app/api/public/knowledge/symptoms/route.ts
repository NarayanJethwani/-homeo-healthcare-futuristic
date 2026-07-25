import { NextResponse } from "next/server";
import { SYMPTOMS } from "@/features/knowledge/content/symptoms";
import { serializePublishedKnowledgeEntities } from "@/features/knowledge/public/publicKnowledgeEntityDTO";

export async function GET() {
  return NextResponse.json(serializePublishedKnowledgeEntities(SYMPTOMS));
}
