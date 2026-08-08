import type { NextConfig } from "next";

// The generated Cloud client reads `import.meta.env.*` (Vite convention).
// Next doesn't provide that, so inline the values at build time.
const envDefines = {
  "import.meta.env": JSON.stringify({
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? "",
    VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
    VITE_SUPABASE_PROJECT_ID: process.env.VITE_SUPABASE_PROJECT_ID ?? "",
  }),
};

const nextConfig: NextConfig = {
  // The hosting pipeline serves the static build output from `dist/`,
  // so export the fully static site (all routes are prerendered).
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
  compiler: { define: envDefines },
};

export default nextConfig;
