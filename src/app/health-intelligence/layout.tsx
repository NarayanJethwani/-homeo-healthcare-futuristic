import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Health Intelligence Center | Homeo Healthcare",
  description: "Assess your homeostatic health profile. Take our metabolic, endocrine, thyroid, and stress self-assessments to mapping constitutional symptoms.",
};

export default function HealthIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
