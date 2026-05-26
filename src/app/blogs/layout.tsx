import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Science & Healing Blog | Homeo Healthcare",
  description: "Read clinical essays, case studies, and nanotechnology-based evidence for advanced homeopathy written by Dr. Narayan Jethwani.",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
