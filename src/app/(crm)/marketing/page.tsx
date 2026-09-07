import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import { pageMetadata } from "@/lib/routes/page-metadata";
import "@/styles/pages/marketing.css";

export const metadata = pageMetadata("Marketing");

const MarketingPage = dynamic(() => import("@/components/pages/marketing-page"), {
  loading: () => <HeavyVisualLoading label="Loading marketing charts" />,
});

export default function MarketingLazyRoute() { return <MarketingPage />; }
