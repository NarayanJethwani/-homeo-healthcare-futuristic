import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Terms & Privacy Policy | Homeo Healthcare",
  description: "Read the clinical terms of service, payment policies, cancellation conditions, and data privacy protocols of Homeo Healthcare.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
