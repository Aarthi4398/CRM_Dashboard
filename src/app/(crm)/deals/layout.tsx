import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Deals");

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
