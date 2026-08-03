import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import { buildClinicalQuotationPdf, type ClinicalQuotationPdfData } from "@/lib/clinicalQuotationPdf";

export async function POST(request: NextRequest) {
  const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  try {
    const body = await request.json() as ClinicalQuotationPdfData;
    if (!body.quotationId || !body.patientName || !body.selectedPathway || !Number.isFinite(Number(body.finalTotal))) {
      return NextResponse.json({ message: "Complete the confirmed quotation before downloading a PDF." }, { status: 400 });
    }
    const pdf = buildClinicalQuotationPdf(body);
    const pdfBody = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;
    return new NextResponse(pdfBody, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${body.quotationId.replace(/[^A-Za-z0-9._-]/g, "-")}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "Unable to generate the quotation PDF." }, { status: 400 });
  }
}
