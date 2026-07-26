import { NextResponse } from "next/server";
import { FAQS } from "@/features/knowledge/content/faqs";
import { serializePublishedKnowledgeEntities } from "@/features/knowledge/public/publicKnowledgeEntityDTO";

export async function GET() {
  return NextResponse.json(serializePublishedKnowledgeEntities(FAQS));
}
