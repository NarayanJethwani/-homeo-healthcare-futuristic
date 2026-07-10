import { ReviewedLabResult, PatientLabTimelineEntry } from "./types";

export async function submitLabReview(
  patientId: string,
  attachmentId: string,
  parameterId: string,
  action: "confirm" | "correct" | "reject",
  options?: {
    correction?: {
      value: string;
      unit?: string;
      flag?: "low" | "normal" | "high" | "critical" | "unknown";
    };
    reason?: string;
  }
): Promise<{ success: boolean; result: ReviewedLabResult }> {
  const payload = {
    attachmentId,
    parameterId,
    action,
    correction: options?.correction,
    reason: options?.reason
  };

  const res = await fetch(`/api/patients/${patientId}/labs/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || `Failed to submit lab ${action} action.`);
  }

  return await res.json();
}

export async function fetchLabTimeline(
  patientId: string,
  testName?: string
): Promise<PatientLabTimelineEntry[]> {
  let url = `/api/patients/${patientId}/labs/timeline`;
  if (testName) {
    url += `?testName=${encodeURIComponent(testName)}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to retrieve lab timeline.");
  }

  const body = await res.json();
  return body.timeline || [];
}

export async function fetchLabSummary(
  patientId: string
): Promise<{ success: boolean; summary: ReviewedLabResult[]; abnormal: ReviewedLabResult[] }> {
  const res = await fetch(`/api/patients/${patientId}/labs/summary`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to retrieve lab summary.");
  }

  return await res.json();
}
