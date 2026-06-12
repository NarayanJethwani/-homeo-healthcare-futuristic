import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

async function handleRevalidate(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/blogs";

  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ message: "Revalidation secret not configured on server" }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate the page on-demand
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), path });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}
