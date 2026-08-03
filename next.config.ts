import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The hosting pipeline serves the static build output from `dist/`,
  // so export the fully static site (all routes are prerendered).
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
