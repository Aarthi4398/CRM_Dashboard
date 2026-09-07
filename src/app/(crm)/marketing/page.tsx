import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import "@/styles/pages/marketing.css";

const MarketingPage = dynamic(() => import("@/components/pages/marketing-page"), {
  loading: () => <HeavyVisualLoading label="Loading marketing charts" />,
});

export default function MarketingLazyRoute() { return <MarketingPage />; }
