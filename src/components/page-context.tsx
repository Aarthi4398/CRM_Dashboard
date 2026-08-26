"use client";

import { usePathname } from "next/navigation";
import { useCRM } from "@/lib/store";

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
        {metrics.map((metric) => (
          <article className="panel px-6 py-6" key={metric.label}>
            <p className="text-[30px] font-semibold leading-none tracking-[-.02em] tabular-nums">{metric.value}</p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{metric.label}</p>
              <span className={`badge ${metric.change.startsWith("-") ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>{metric.change}</span>
            </div>
          </article>
        ))}
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
  if (path === "/calendar") return [
    { label: "Scheduled Events", value: String(state.events.length), change: "+8.1%" },
    { label: "Meetings", value: String(state.events.filter((item) => item.category === "Meeting").length), change: "+5.6%" },
    { label: "Attendees", value: String(state.events.reduce((sum, item) => sum + item.attendees, 0)), change: "+12.3%" },
  ];
  if (path === "/profile") return [
    { label: "Profile Completion", value: "92%", change: "+4.5%" },
    { label: "CRM Activities", value: String(state.tasks.length + state.events.length), change: "+9.8%" },
    { label: "Deals Managed", value: String(state.deals.length), change: "+7.2%" },
  ];
  return dashboardMetrics[path] ?? [];
}

const dashboardMetrics: Record<string, Metric[]> = {
  "/analytics": [
    { label: "Unique Visitors", value: "24.7K", change: "+20%" },
    { label: "Total Pageviews", value: "55.9K", change: "+4%" },
    { label: "Bounce Rate", value: "54%", change: "-1.59%" },
    { label: "Visit Duration", value: "2m 56s", change: "+7%" },
  ],
  "/marketing": [
    { label: "Avg. Client Rating", value: "7.8/10", change: "+20%" },
    { label: "Instagram Followers", value: "5,934", change: "-3.59%" },
    { label: "Total Revenue", value: "$9,758", change: "+15%" },
  ],
  "/stocks": [
    { label: "Apple, Inc", value: "$1,232.00", change: "+11.01%" },
    { label: "Paypal, Inc", value: "$965.00", change: "+9.05%" },
    { label: "Tesla, Inc", value: "$1,232.00", change: "+11.01%" },
    { label: "Amazon.com, Inc", value: "$2,567.00", change: "+11.01%" },
  ],
  "/saas": [
    { label: "Total Revenue", value: "$20,045.87", change: "+2.5%" },
    { label: "Active Users", value: "9,528", change: "+9.5%" },
    { label: "Customer Lifetime Value", value: "$849.54", change: "-1.6%" },
    { label: "Customer Acquisition Cost", value: "$528", change: "+3.5%" },
  ],
  "/logistics": [
    { label: "Total Orders", value: "12,384", change: "+20%" },
    { label: "Orders in Transit", value: "728", change: "+20%" },
    { label: "Delivered Orders", value: "12,384", change: "+20%" },
  ],
  "/ai": [
    { label: "Users", value: "10,590", change: "+3.52%" },
    { label: "Projects", value: "15,682", change: "+3.52%" },
    { label: "Revenue", value: "$90,369", change: "+14.8%" },
    { label: "Paid Users", value: "520", change: "-9.05%" },
  ],
  "/sales": [
    { label: "Total Revenue", value: "$10,590", change: "+32%" },
    { label: "Total Sales", value: "1,320", change: "+32%" },
    { label: "Conversion Rate", value: "4.38%", change: "+32%" },
    { label: "Refund Rate", value: "1.2%", change: "+32%" },
  ],
  "/finance": [
    { label: "Total Balance", value: "$24,830", change: "+3.2%" },
    { label: "Monthly Income", value: "$5,200", change: "+3.2%" },
    { label: "Total Spent", value: "$3,831", change: "-2.95%" },
    { label: "Saving Rate", value: "26.1%", change: "+3.9%" },
  ],
};
