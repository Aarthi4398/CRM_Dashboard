import type { Company, Contact, CRMTask, Deal } from "../types";
import { openDeals, sumDealValue, wonDeals } from "./deals";

export type PageMetric = { label: string; value: string; change: string };

export function contactMetrics(contacts: Contact[]): PageMetric[] {
  return [
    { label: "Total Contacts", value: String(contacts.length), change: "+12.5%" },
    { label: "Active Contacts", value: String(contacts.filter((item) => item.status === "Active").length), change: "+8.2%" },
    { label: "New Leads", value: String(contacts.filter((item) => item.status === "Lead").length), change: "+5.7%" },
  ];
}

export function companyMetrics(companies: Company[]): PageMetric[] {
  return [
    { label: "Total Companies", value: String(companies.length), change: "+9.4%" },
    { label: "Customers", value: String(companies.filter((item) => item.status === "Customer").length), change: "+6.8%" },
    { label: "Portfolio Value", value: `$${Math.round(companies.reduce((sum, item) => sum + item.value, 0) / 1000)}K`, change: "+14.2%" },
  ];
}

export function dealMetrics(deals: Deal[]): PageMetric[] {
  return [
    { label: "Pipeline Value", value: `$${Math.round(sumDealValue(deals) / 1000)}K`, change: "+18.6%" },
    { label: "Open Deals", value: String(openDeals({ deals }).length), change: "+10.3%" },
    { label: "Won Deals", value: String(wonDeals({ deals }).length), change: "+7.5%" },
  ];
}

export function taskMetrics(tasks: CRMTask[]): PageMetric[] {
  return [
    { label: "Total Tasks", value: String(tasks.length), change: "+11.2%" },
    { label: "In Progress", value: String(tasks.filter((item) => item.status === "In progress").length), change: "+6.4%" },
    { label: "Completed", value: String(tasks.filter((item) => item.status === "Done").length), change: "+15.8%" },
  ];
}

export function metricsForPath(
  path: string,
  data: { contacts: Contact[]; companies: Company[]; deals: Deal[]; tasks: CRMTask[] },
): PageMetric[] {
  if (path === "/contacts") return contactMetrics(data.contacts);
  if (path === "/companies") return companyMetrics(data.companies);
  if (path === "/deals") return dealMetrics(data.deals);
  if (path === "/tasks") return taskMetrics(data.tasks);
  return [];
}
