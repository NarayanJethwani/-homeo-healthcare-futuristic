import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr. Narayan Jethwani | Leading Consultant Homeopath",
  description: "Learn about Dr. Narayan Jethwani's 30+ years of clinical experience, credentials, achievements, and dedication to constitutional homeopathic medicine.",
};

export default function DrNarayanJethwaniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
