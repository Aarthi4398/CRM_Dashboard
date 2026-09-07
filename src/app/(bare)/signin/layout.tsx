import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Sign In");

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
