import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import "@/styles/pages/dashboard.css";

const Dashboard = dynamic(() => import("@/components/dashboard").then((module) => module.Dashboard), {
  loading: () => <HeavyVisualLoading label="Loading dashboard charts" />,
});

export default function DashboardPage() { return <Dashboard />; }
