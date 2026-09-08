import type { Metadata } from "next";
import { routeTitles } from "@/lib/menu";

const CORE_ROUTE_TITLES: Record<string, string> = {
  contacts: "Contacts",
  companies: "Companies",
  deals: "Deals",
  tasks: "Tasks",
  dashboard: "CRM",
};

export const bareRouteTitles: Record<string, string> = {
  "coming-soon": "Coming Soon",
  "error-404": "404 Error",
  "error-500": "500 Error",
  "error-503": "503 Error",
  maintenance: "Maintenance",
  privacy: "Privacy Policy",
  success: "Success",
  signin: "Sign In",
  signup: "Sign Up",
  "reset-password": "Reset Password",
  terms: "Terms and Conditions",
  "two-step-verification": "Two Step Verification",
};

export const dashboardVariantTitles: Record<string, string> = {
  ecommerce: "Ecommerce",
  analytics: "Analytics",
  marketing: "Marketing",
  stocks: "Stocks",
  saas: "SaaS",
  logistics: "Logistics",
  ai: "AI",
};

export const dedicatedRouteTitles: Record<string, string> = {
  ...CORE_ROUTE_TITLES,
  "add-product": "Add Product",
  "ai-settings": "AI Settings",
  "api-keys": "API Keys",
  billing: "Billing",
  blank: "Blank Page",
  calendar: "Calendar",
  chat: "Chat",
  "create-invoice": "Create Invoice",
  "file-manager": "File Manager",
  "form-elements": "Form Elements",
  "form-layout": "Form Layout",
  "inbox-details": "Details",
  inbox: "Inbox",
  integrations: "Integrations",
  invoices: "Invoices",
  "pricing-tables": "Pricing Tables",
  "products-list": "Products",
  profile: "User Profile",
  "single-invoice": "Single Invoice",
  "single-transaction": "Single Transaction",
  "support-ticket-reply": "Support Reply",
  "support-tickets": "Support List",
  "task-kanban": "Kanban",
  "task-list": "List",
  transactions: "Transactions",
  faq: "FAQ",
  finance: "Finance",
  sales: "Sales",
};

export function titleForRouteSegment(segment: string): string | undefined {
  return (
    dedicatedRouteTitles[segment]
    ?? bareRouteTitles[segment]
    ?? dashboardVariantTitles[segment]
    ?? routeTitles.get(segment)
  );
}

export function pageMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description: description ?? `${title} — Aarthi CRM dashboard portfolio.`,
  };
}

export function metadataForRouteSegment(segment: string): Metadata | undefined {
  const title = titleForRouteSegment(segment);
  return title ? pageMetadata(title) : undefined;
}
