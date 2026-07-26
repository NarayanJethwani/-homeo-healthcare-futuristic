import { NextResponse } from "next/server";
import { LAB_TESTS } from "@/features/knowledge/content/lab-tests";
import { serializePublishedKnowledgeEntities } from "@/features/knowledge/public/publicKnowledgeEntityDTO";

export async function GET() {
  return NextResponse.json(serializePublishedKnowledgeEntities(LAB_TESTS));
}
