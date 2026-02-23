import type { NextConfig } from "next";
import path from "node:path";

const requestConfigPath = "./src/i18n/request.ts";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "next-intl/config": requestConfigPath,
    },
  },
  webpack(config) {
    config.resolve.alias["next-intl/config"] = path.resolve(process.cwd(), requestConfigPath);
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
};

export default nextConfig;
