import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The hosting pipeline serves the static build output from `dist/`,
  // so export the fully static site (all routes are prerendered).
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
  // Expose the Cloud env vars to browser bundles (Next only inlines
  // NEXT_PUBLIC_* by default).
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? "",
    VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
    VITE_SUPABASE_PROJECT_ID: process.env.VITE_SUPABASE_PROJECT_ID ?? "",
  },
};

export default nextConfig;
