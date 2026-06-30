import { NextResponse } from "next/server";
import { SYMPTOMS } from "@/features/knowledge/content/symptoms";

export async function GET() {
  const published = SYMPTOMS.filter(s => s.editorialStatus === "published");
  return NextResponse.json(published);
}
