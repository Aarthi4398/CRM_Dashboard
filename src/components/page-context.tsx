"use client";

import { usePathname } from "next/navigation";
import { metricsForPath } from "@/lib/crm";
import { isBarePath, showsPageSummary } from "@/lib/routes/chrome";
import { useCRMSelector } from "@/lib/store";
import { StatCard } from "@/components/ui/stat-card";

export function PageContext({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const contacts = useCRMSelector((state) => state.contacts);
  const companies = useCRMSelector((state) => state.companies);
  const deals = useCRMSelector((state) => state.deals);
  const tasks = useCRMSelector((state) => state.tasks);
  const routeClass = `route-${path.slice(1).replaceAll("/", "-") || "home"}`;

  if (path === "/dashboard" || isBarePath(path)) return children;

  const metrics = showsPageSummary(path) ? metricsForPath(path, { contacts, companies, deals, tasks }) : [];
  return (
    <div className={`page-context ${routeClass} ${metrics.length ? "space-y-6" : ""}`}>
      {metrics.length ? <section className={`grid gap-5 md:grid-cols-2 ${metrics.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`} aria-label="Page summary">
        {metrics.map((metric) => <StatCard key={metric.label} {...metric} down={metric.change.startsWith("-")} variant="summary"/>)}
      </section> : null}
      {children}
    </div>
  );
}
