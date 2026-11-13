import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classic Treatment Planner Dashboard | Homeo Healthcare (Archive)",
  description: "Interactive treatment plans calculator dashboard with comparison, savings badges, and triage assistant.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StorePlannerClassicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
