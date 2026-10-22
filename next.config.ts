import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.API_BACKEND_URL ||
  "https://campus-ar-api.chikai400up.workers.dev";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
      {
        source: "/api/health",
        destination: `${BACKEND_URL}/api/health`,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
