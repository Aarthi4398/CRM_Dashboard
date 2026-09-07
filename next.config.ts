import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  async headers() {
    return [{
      source: "/:path*",
      headers: [...securityHeaders],
    }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "nextjs-demo.tailadmin.com", pathname: "/images/**" }],
  },
};
export default nextConfig;
