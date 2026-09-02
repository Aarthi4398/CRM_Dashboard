"use client";

import { usePathname } from "next/navigation";
import { useCRM } from "@/lib/store";
import { StatCard } from "@/components/ui/stat-card";

type Metric = { label: string; value: string; change: string };

export function PageContext({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { state } = useCRM();
  const routeClass = `route-${path.slice(1).replaceAll("/", "-") || "home"}`;

  if (path === "/dashboard") return children;
  if (["/signin","/signup","/reset-password","/two-step-verification","/error-404","/error-500","/error-503","/coming-soon","/maintenance","/success"].includes(path) || path.startsWith("/layout-")) return children;
  if (["/profile", "/ecommerce", "/analytics", "/marketing", "/stocks", "/saas", "/logistics", "/ai", "/sales", "/finance", "/calendar", "/task-list", "/task-kanban", "/form-elements", "/form-layout", "/file-manager", "/integrations", "/chat", "/support-tickets", "/support-ticket-reply", "/inbox", "/inbox-details"].includes(path)) return <div className={`page-context ${routeClass}`}>{children}</div>;

  const metrics = getMetrics(path, state);
  return (
    <div className={`page-context ${routeClass} space-y-6`}>
      {metrics.length ? <section className={`grid gap-5 md:grid-cols-2 ${metrics.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`} aria-label="Page summary">
        {metrics.map((metric) => <StatCard key={metric.label} {...metric} down={metric.change.startsWith("-")} variant="summary"/>)}
      </section> : null}
      {children}
    </div>
  );
}

function getMetrics(path: string, state: ReturnType<typeof useCRM>["state"]): Metric[] {
  if (path === "/contacts") return [
    { label: "Total Contacts", value: String(state.contacts.length), change: "+12.5%" },
    { label: "Active Contacts", value: String(state.contacts.filter((item) => item.status === "Active").length), change: "+8.2%" },
    { label: "New Leads", value: String(state.contacts.filter((item) => item.status === "Lead").length), change: "+5.7%" },
  ];
  if (path === "/companies") return [
    { label: "Total Companies", value: String(state.companies.length), change: "+9.4%" },
    { label: "Customers", value: String(state.companies.filter((item) => item.status === "Customer").length), change: "+6.8%" },
    { label: "Portfolio Value", value: `$${Math.round(state.companies.reduce((sum, item) => sum + item.value, 0) / 1000)}K`, change: "+14.2%" },
  ];
  if (path === "/deals") return [
    { label: "Pipeline Value", value: `$${Math.round(state.deals.reduce((sum, item) => sum + item.value, 0) / 1000)}K`, change: "+18.6%" },
    { label: "Open Deals", value: String(state.deals.filter((item) => !["Won", "Lost"].includes(item.stage)).length), change: "+10.3%" },
    { label: "Won Deals", value: String(state.deals.filter((item) => item.stage === "Won").length), change: "+7.5%" },
  ];
  if (path === "/tasks" || path.startsWith("/task")) return [
    { label: "Total Tasks", value: String(state.tasks.length), change: "+11.2%" },
    { label: "In Progress", value: String(state.tasks.filter((item) => item.status === "In progress").length), change: "+6.4%" },
    { label: "Completed", value: String(state.tasks.filter((item) => item.status === "Done").length), change: "+15.8%" },
  ];
  return [];
}
