"use client";

import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";

const Dashboard = dynamic(() => import("@/components/dashboard").then((module) => module.Dashboard), {
  loading: () => <HeavyVisualLoading label="Loading dashboard charts" />,
});

export default function DashboardPage() { return <Dashboard />; }
