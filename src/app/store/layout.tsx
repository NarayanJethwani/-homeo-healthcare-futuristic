import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remedies & Care Programs | Homeo Healthcare",
  description: "Browse constitutional treatment plans and clinical consultation tiers for chronic, acute, and complex pathological recovery.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
