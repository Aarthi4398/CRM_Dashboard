import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "nextjs-demo.tailadmin.com", pathname: "/images/**" }],
  },
};
export default nextConfig;
