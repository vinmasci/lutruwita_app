import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Enable TypeScript checking during build
    ignoreBuildErrors: false,
    // Enable automatic type generation
    tsconfigPath: "./tsconfig.json"
  },
  experimental: {
    // Enable new TypeScript features
    typedRoutes: true,
    // Enable better type checking for API routes
    strictNextHead: true
  }
};

export default nextConfig;
