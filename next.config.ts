import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure repertory JSON data files are bundled with serverless functions on Vercel
  outputFileTracingIncludes: {
    "/api/repertory": ["./public/data/**/*.json"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.homeo.healthcare",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "admin.homeo.healthcare",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.wp.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*.wp.com",
        pathname: "/**",
      },
    ],
  },
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

