import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
