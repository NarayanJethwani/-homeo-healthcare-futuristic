export const DOCTOR_PORTAL_TRIAL_MONTHS = 1;
export const DOCTOR_PORTAL_MONTHLY_PRICE_INR = 1_000;

export type CurrentDoctorSubscriptionPlan = "trial" | "branch" | "monthly";

export function isCurrentDoctorSubscriptionPlan(value: unknown): value is CurrentDoctorSubscriptionPlan {
  return value === "trial" || value === "branch" || value === "monthly";
}

function addUtcMonthsClamped(date: Date, months: number): Date {
  const result = new Date(date);
  const originalDay = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(originalDay, lastDay));
  return result;
}

export function computeCurrentDoctorSubscriptionValidUntil(
  plan: CurrentDoctorSubscriptionPlan,
  now = new Date(),
): string {
  if (plan === "branch") return "2099-12-31";
  return addUtcMonthsClamped(now, 1).toISOString().split("T")[0];
}

export function formatDoctorPortalMonthlyPrice(): string {
  return `₹${DOCTOR_PORTAL_MONTHLY_PRICE_INR.toLocaleString("en-IN")}/month`;
}
