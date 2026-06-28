import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["firebase-admin"],
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
