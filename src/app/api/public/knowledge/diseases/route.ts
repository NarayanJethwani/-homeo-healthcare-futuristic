import { NextResponse } from "next/server";
import { DISEASES } from "@/features/knowledge/content/diseases";

export async function GET() {
  // Only return published educational records
  const published = DISEASES.filter(d => d.editorialStatus === "published");
  return NextResponse.json(published);
}
