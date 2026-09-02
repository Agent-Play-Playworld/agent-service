import type { NextConfig } from "next";
import { getVercelOutputFileTracingIncludes } from "./src/lib/runtime/vercel-deployment";

const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  reactStrictMode: true,
  transpilePackages: [
    "@agent-play/sdk",
    "@agent-play/intercom",
    "@agent-play/node-tools",
  ],
  outputFileTracingIncludes: getVercelOutputFileTracingIncludes(),
  async rewrites() {
    return [
      {
        source: "/health",
        destination: "/api/health",
      },
      {
        source: "/runtime/bootstrap",
        destination: "/api/runtime/bootstrap",
      },
    ];
  },
};

export default nextConfig;
