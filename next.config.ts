import type { NextConfig } from "next";
import { getVercelOutputFileTracingIncludes } from "./src/lib/runtime/vercel-deployment";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@agent-play/sdk",
    "@agent-play/intercom",
    "@agent-play/node-tools",
  ],
  outputFileTracingIncludes: getVercelOutputFileTracingIncludes(),
};

export default nextConfig;
