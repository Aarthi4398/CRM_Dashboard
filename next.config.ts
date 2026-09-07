import type { NextConfig } from "next";
import { getSecurityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  async headers() {
    return [{
      source: "/:path*",
      headers: [...getSecurityHeaders()],
    }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "nextjs-demo.tailadmin.com", pathname: "/images/**" }],
  },
};
export default nextConfig;
