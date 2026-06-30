import { NextResponse } from "next/server";
import { REMEDIES } from "@/features/knowledge/content/remedies";

export async function GET() {
  const published = REMEDIES.filter(r => r.editorialStatus === "published");
  return NextResponse.json(published);
}
