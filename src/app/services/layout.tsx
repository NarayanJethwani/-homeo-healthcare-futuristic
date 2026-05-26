import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specialties & Clinical Conditions | Homeo Healthcare",
  description: "Explore clinical pathways, root-cause mapping, and recovery timelines for respiratory, skin, autoimmune, and endocrine conditions.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
