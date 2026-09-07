import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Form Layout");

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
