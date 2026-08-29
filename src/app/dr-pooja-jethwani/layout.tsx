import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr. Pooja Jethwani | Homeopathic Physician & Consultant",
  description: "Learn about Dr. Pooja Jethwani (BHMS, PGDEMS), specializing in compassionate homeopathic care for hormonal imbalances, pediatric health, skin concerns, and chronic conditions at Homeo Healthcare.",
};

export default function DrPoojaJethwaniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
