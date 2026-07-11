import { z } from "zod";
import { ValidationError } from "../errors/domainErrors";

export function validatePayload<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      "Payload validation failed",
      result.error.flatten().fieldErrors
    );
  }
  return result.data;
}

export function validateDateString(val: string): boolean {
  const timestamp = Date.parse(val);
  return !isNaN(timestamp);
}
