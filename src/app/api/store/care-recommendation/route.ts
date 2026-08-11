import { NextRequest, NextResponse } from "next/server";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  calculateCarePeriodTotalPaise,
  calculateListCarePeriodTotalPaise,
  formatINRFromPaise,
  getCarePeriodContinuityBenefit,
  type ClinicalCareDurationWeeks,
} from "@/features/store-clinical-care/domain/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierId, durationWeeks } = body;

    const tierKey = tierId && CLINICAL_CARE_TIER_OPTIONS[tierId] ? tierId : "integrated";
    const weeks = ([1, 2, 4, 8, 12].includes(Number(durationWeeks)) ? Number(durationWeeks) : 4) as ClinicalCareDurationWeeks;

    const tier = CLINICAL_CARE_TIER_OPTIONS[tierKey];
    const listTotalPaise = calculateListCarePeriodTotalPaise(tier.weeklyRatePaise, weeks);
    const totalPaise = calculateCarePeriodTotalPaise(tier.weeklyRatePaise, weeks);

    return NextResponse.json(
      {
        success: true,
        data: {
          tierId: tier.id,
          tierName: tier.name,
          weeklyRatePaise: tier.weeklyRatePaise,
          weeklyRateFormatted: formatINRFromPaise(tier.weeklyRatePaise),
          durationWeeks: weeks,
          listTotalPaise,
          listTotalFormatted: formatINRFromPaise(listTotalPaise),
          continuityDiscountPercent: getCarePeriodContinuityBenefit(weeks),
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
