import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.API_BACKEND_URL ||
  "https://campus-ar-api.chikai400up.workers.dev";

const R2_STORAGE_URL =
  process.env.R2_STORAGE_URL ||
  "https://pub-d1017758a7a442dcb2145a90884f4a74.r2.dev";

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
      {
        source: "/models/:path*",
        destination: `${R2_STORAGE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
