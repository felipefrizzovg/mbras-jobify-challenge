import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "remotive.com",
      },
    ]
  }
};

export default nextConfig;
