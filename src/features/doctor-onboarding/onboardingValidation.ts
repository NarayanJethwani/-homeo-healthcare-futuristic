import { z } from "zod";
import {
  computeCurrentDoctorSubscriptionValidUntil,
  type CurrentDoctorSubscriptionPlan,
} from "@/lib/doctorSubscriptionConfig";

export const onboardDoctorSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(30).optional().default(""),
  speciality: z.string().trim().min(2).max(100).optional().default("General Homeopathy"),
  plan: z.enum(["trial", "branch", "monthly"]).optional().default("trial"),
}).strict();

export type DoctorPlan = CurrentDoctorSubscriptionPlan;

export function computeDoctorPlanValidUntil(plan: DoctorPlan, now = new Date()): string {
  return computeCurrentDoctorSubscriptionValidUntil(plan, now);
}
