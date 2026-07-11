import { NextResponse } from "next/server";
import { ImportExportService } from "@/features/repertory/import-export/importExportService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let content = "";
    if (type === "json") {
      content = await ImportExportService.exportToJSON();
    } else if (type === "csv") {
      content = await ImportExportService.exportToCSV();
    } else if (type === "mdx") {
      content = await ImportExportService.exportToMDX();
    } else {
      content = await ImportExportService.exportToGraphTriples();
    }

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
