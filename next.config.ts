import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.AWS_S3_URL || "",
        port: "",
      },
    ],
  },
};

export default nextConfig;
