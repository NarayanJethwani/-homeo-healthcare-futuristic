import { NextRequest, NextResponse } from "next/server";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  calculateTierCarePeriodTotalPaise,
  calculateTierListCarePeriodTotalPaise,
  formatINRFromPaise,
  getTierCarePeriodLabel,
  getTierContinuityBenefit,
  type ClinicalCareDurationWeeks,
  type StoreClinicalCareTierId,
} from "@/features/store-clinical-care/domain/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierId, durationWeeks } = body;

    const tierKey: StoreClinicalCareTierId = typeof tierId === "string" && tierId in CLINICAL_CARE_TIER_OPTIONS ? tierId as StoreClinicalCareTierId : "integrated";
    const weeks = ([1, 2, 4, 8, 12].includes(Number(durationWeeks)) ? Number(durationWeeks) : 4) as ClinicalCareDurationWeeks;

    const tier = CLINICAL_CARE_TIER_OPTIONS[tierKey];
    const listTotalPaise = calculateTierListCarePeriodTotalPaise(tier.id, weeks);
    const totalPaise = calculateTierCarePeriodTotalPaise(tier.id, weeks);

    return NextResponse.json(
      {
        success: true,
        data: {
          tierId: tier.id,
          tierName: tier.name,
          weeklyRatePaise: tier.weeklyRatePaise,
          weeklyRateFormatted: formatINRFromPaise(tier.weeklyRatePaise),
          durationWeeks: weeks,
          carePeriodLabel: getTierCarePeriodLabel(tier.id, weeks),
          listTotalPaise,
          listTotalFormatted: formatINRFromPaise(listTotalPaise),
          continuityDiscountPercent: getTierContinuityBenefit(tier.id, weeks),
          continuityDiscountPaise: listTotalPaise - totalPaise,
          totalPaise,
          totalFormatted: formatINRFromPaise(totalPaise),
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}
