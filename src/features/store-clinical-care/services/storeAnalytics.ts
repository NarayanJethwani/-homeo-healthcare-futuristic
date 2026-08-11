export type StoreFunnelEventName =
  | "store_pathway_check_answered"
  | "store_health_concern_selected"
  | "store_pathway_selected"
  | "store_duration_selected"
  | "store_assessment_started"
  | "store_assessment_submitted";

interface StoreFunnelEventDetails {
  pathway?: string;
  durationWeeks?: number;
  question?: string;
  answer?: string | number;
  healthAreas?: number;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends no patient identity or clinical free text. */
export function trackStoreFunnelEvent(name: StoreFunnelEventName, details: StoreFunnelEventDetails = {}): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("homeo:store-funnel", { detail: { name, ...details } }));
  window.gtag?.("event", name, details);
}
