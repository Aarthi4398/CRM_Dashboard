import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import { pageMetadata } from "@/lib/routes/page-metadata";
import "@/styles/pages/dashboard.css";

export const metadata = pageMetadata("CRM");

const Dashboard = dynamic(() => import("@/components/dashboard").then((module) => module.Dashboard), {
  loading: () => <HeavyVisualLoading label="Loading dashboard charts" />,
});

export default function DashboardPage() { return <Dashboard />; }
