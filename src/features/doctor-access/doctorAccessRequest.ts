import { z } from "zod";

const cleanText = (minimum: number, maximum: number, label: string) =>
  z.string().trim().min(minimum, `${label} is required.`).max(maximum, `${label} is too long.`);

export const doctorAccessRequestSchema = z.object({
  fullName: cleanText(3, 120, "Full name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(180),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s()-]{7,19}$/, "Enter a valid phone number."),
  registrationCouncil: cleanText(2, 120, "Registration council"),
  registrationNumber: cleanText(2, 80, "Registration number"),
  qualification: cleanText(2, 160, "Qualification"),
  speciality: z.string().trim().max(160).optional().default(""),
  clinicName: z.string().trim().max(160).optional().default(""),
  city: cleanText(2, 100, "City"),
  state: cleanText(2, 100, "State"),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
}).strict();

export type DoctorAccessRequestInput = z.infer<typeof doctorAccessRequestSchema>;

type RateEntry = number[];
const requestWindows = new Map<string, RateEntry>();

export function consumeDoctorAccessRateLimit(
  key: string,
  now = Date.now(),
  maxRequests = 4,
  windowMs = 15 * 60 * 1000,
): boolean {
  const active = (requestWindows.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (active.length >= maxRequests) {
    requestWindows.set(key, active);
    return false;
  }
  active.push(now);
  requestWindows.set(key, active);
  return true;
}

export function resetDoctorAccessRateLimitsForTests() {
  requestWindows.clear();
}
