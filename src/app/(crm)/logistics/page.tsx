import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Logistics");

const LogisticsPage = dynamic(() => import("@/components/pages/logistics-page"), {
  loading: () => <HeavyVisualLoading label="Loading logistics charts and map" />,
});

export default function LogisticsLazyRoute() { return <LogisticsPage />; }
