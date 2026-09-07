import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import { pageMetadata } from "@/lib/routes/page-metadata";
import "@/styles/pages/ai.css";

export const metadata = pageMetadata("AI");

const AIPage = dynamic(() => import("@/components/pages/ai-page"), {
  loading: () => <HeavyVisualLoading label="Loading AI analytics" />,
});

export default function AILazyRoute() { return <AIPage />; }
