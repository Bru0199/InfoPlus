import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
