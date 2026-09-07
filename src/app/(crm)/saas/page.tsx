import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("SaaS");

const SaaSPage = dynamic(() => import("@/components/pages/saas-page"), {
  loading: () => <HeavyVisualLoading label="Loading SaaS charts" />,
});

export default function SaaSLazyRoute() { return <SaaSPage />; }
