import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Removed static export - Cloudflare Pages supports Next.js with dynamic features
  // For Cloudflare deployment, use @cloudflare/next-on-pages or deploy directly
};

export default nextConfig;
