"use client";

import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";

const AnalyticsPage = dynamic(() => import("@/components/pages/analytics-page"), {
  loading: () => <HeavyVisualLoading label="Loading analytics charts" />,
});

export default function AnalyticsLazyRoute() { return <AnalyticsPage />; }
