import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid race conditions when `next dev` and `next build` run in parallel.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio-demo.creativedesignweb.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
