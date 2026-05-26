import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Clinic Locations | Homeo Healthcare",
  description: "Get in touch with Homeo Healthcare. View clinic addresses in Mumbai, contact phone numbers, or book an appointment online.",
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
