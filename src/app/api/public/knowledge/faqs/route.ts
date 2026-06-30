import { NextResponse } from "next/server";
import { FAQS } from "@/features/knowledge/content/faqs";

export async function GET() {
  const published = FAQS.filter(f => f.editorialStatus === "published");
  return NextResponse.json(published);
}
