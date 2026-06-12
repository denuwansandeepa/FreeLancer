import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/index.php/api/:path*",
      },
    ];
  },
};

export default nextConfig;
