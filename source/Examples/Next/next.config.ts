import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pidifyjs/core"],
  // Since react-pdf uses some browser-only features, we might need to handle them
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  turbopack: {},
  experimental: {
    turbopack: true,
  },
};

export default nextConfig;
