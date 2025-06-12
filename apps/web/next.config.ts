import type { NextConfig } from "next";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_AWS_S3_URL || "/",
        port: "",
      },
    ],
  },
};

export default nextConfig;
