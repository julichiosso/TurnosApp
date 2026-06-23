import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
