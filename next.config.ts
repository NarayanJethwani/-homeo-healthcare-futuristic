import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/conditions",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/protocol",
        destination: "/evidence-based-homeopathy",
        permanent: true,
      },
      {
        source: "/doctor",
        destination: "/dr-narayan-jethwani",
        permanent: true,
      },
      {
        source: "/treatments",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

