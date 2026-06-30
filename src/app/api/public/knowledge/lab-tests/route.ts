import { NextResponse } from "next/server";
import { LAB_TESTS } from "@/features/knowledge/content/lab-tests";

export async function GET() {
  const published = LAB_TESTS.filter(l => l.editorialStatus === "published");
  return NextResponse.json(published);
}
