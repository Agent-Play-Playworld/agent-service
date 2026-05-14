import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@agent-play/sdk",
    "@agent-play/intercom",
    "@agent-play/node-tools",
  ],
};

export default nextConfig;
