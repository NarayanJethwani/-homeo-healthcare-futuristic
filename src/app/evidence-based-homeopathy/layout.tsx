import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evidence-Based Homeopathy | Homeo Healthcare",
  description: "Learn about the scientific evidence, nanotechnology, epigenetics, and biological pathways behind advanced homeopathic treatments.",
};

export default function EvidenceBasedHomeopathyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
