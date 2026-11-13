import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Fee Card & Calculator | Homeo Healthcare (v2 Preview)",
  description: "Physician-led homeopathic care fee card and interactive weekly care fee calculator.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StoreV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
