import { z } from "zod";

export const onboardDoctorSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(30).optional().default(""),
  speciality: z.string().trim().min(2).max(100).optional().default("General Homeopathy"),
  plan: z.enum(["trial", "branch", "monthly", "quarterly", "annual"]).optional().default("trial"),
}).strict();

export type DoctorPlan = "trial" | "branch" | "monthly" | "quarterly" | "annual";

export function computeDoctorPlanValidUntil(plan: DoctorPlan, now = new Date()): string {
  if (plan === "branch") return "2099-12-31";
  const date = new Date(now);
  if (plan === "trial") date.setDate(date.getDate() + 14);
  else if (plan === "annual") date.setFullYear(date.getFullYear() + 1);
  else if (plan === "quarterly") date.setMonth(date.getMonth() + 3);
  else date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0];
}
