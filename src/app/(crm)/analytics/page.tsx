import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import { pageMetadata } from "@/lib/routes/page-metadata";
import "@/styles/pages/analytics.css";

export const metadata = pageMetadata("Analytics");

const AnalyticsPage = dynamic(() => import("@/components/pages/analytics-page"), {
  loading: () => <HeavyVisualLoading label="Loading analytics charts" />,
});

export default function AnalyticsLazyRoute() { return <AnalyticsPage />; }
