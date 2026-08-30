import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { forbiddenApiResponse, requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { syncTreatmentPlanToClinicalSheet } from "@/lib/googleDrive";
import { normalizeRole } from "@/lib/security/rbac";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const planSchema = z.object({
  careLevel: z.string().trim().min(1),
  billingCycle: z.enum(["weekly", "monthly"]),
  durationValue: z.number().positive(),
  conditionsCount: z.number().int().positive(),
  concessionApplied: z.string().optional(),
  overridePrice: z.number().nonnegative().optional(),
  medicineAddons: z.number().nonnegative().optional(),
  receivedAmount: z.number().nonnegative(),
  finalPrice: z.number().nonnegative(),
  confirmedDate: z.string().optional(),
  breakdown: z.object({
    weeklyCareFee: z.number().nonnegative().optional(),
    listCareTotal: z.number().nonnegative().optional(),
    continuityDiscountTotal: z.number().nonnegative().optional(),
    caseSpecificSupportTotal: z.number().nonnegative().optional(),
    assessmentAddonsTotal: z.number().nonnegative().optional(),
    concessionTotal: z.number().nonnegative().optional(),
    pharmacyTotal: z.number().nonnegative().optional(),
  }).optional(),
});

function spreadsheetIdFromUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] || "";
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ patientId: string }> }) {
  const session = await requireAdminApiSession(request, ["admin", "doctor"]);
  if (!session) return unauthorizedApiResponse();

  const parsed = planSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "A valid physician-confirmed treatment plan is required." }, { status: 400 });
  }

  const { patientId } = await params;
  if (!patientId || patientId.includes("/")) {
    return NextResponse.json({ success: false, message: "A valid patient ID is required." }, { status: 400 });
  }

  try {
    const snapshot = await getAdminDb().collection("patients").doc(patientId).get();
    if (!snapshot.exists) {
      return NextResponse.json({ success: false, message: "Patient record not found." }, { status: 404 });
    }

    const patient = snapshot.data() || {};
    const isSuperAdmin = normalizeRole(session.role) === "super-admin";
    if (!isSuperAdmin && patient.assignedDoctor !== session.uid) {
      return forbiddenApiResponse("You can synchronize only cases assigned to you.");
    }

    const spreadsheetId = typeof patient.sheetId === "string" && patient.sheetId ? patient.sheetId : spreadsheetIdFromUrl(patient.sheetUrl);
    if (!spreadsheetId) {
      return NextResponse.json({ success: false, message: "This patient does not have a linked clinical sheet." }, { status: 409 });
    }

    await syncTreatmentPlanToClinicalSheet(spreadsheetId, {
      patientId,
      patientName: typeof patient.name === "string" ? patient.name : patientId,
      ...parsed.data,
      planConfirmed: true,
    });

    return NextResponse.json({
      success: true,
      patientId,
      message: "Treatment Planner and Finance were synchronized with the clinical sheet.",
    });
  } catch (error) {
    console.error("Treatment-plan sheet synchronization failed:", error);
    return NextResponse.json({ success: false, message: "The patient was saved, but the clinical sheet could not be synchronized." }, { status: 500 });
  }
}
