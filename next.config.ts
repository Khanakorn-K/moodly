import type { NextConfig } from "next";

const canonicalHost = "moodlyjournal.com";
const legacyHosts = ["moodly-rho.vercel.app", "www.moodlyjournal.com"];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return legacyHosts.map((host) => ({
      source: "/:path*",
      has: [
        {
          type: "host" as const,
          value: host,
        },
      ],
      destination: `https://${canonicalHost}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
