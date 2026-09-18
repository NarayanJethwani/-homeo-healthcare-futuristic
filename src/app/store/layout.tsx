import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Plans & Fees | Homeo Healthcare",
  description: "Compare acute, chronic and membership care fees, individualised homeopathic case analysis, constitutional care and follow-up. Doctor review before payment.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
