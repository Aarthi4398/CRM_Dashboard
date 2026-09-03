"use client";

import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";

const SaaSPage = dynamic(() => import("@/components/pages/saas-page"), {
  loading: () => <HeavyVisualLoading label="Loading SaaS charts" />,
});

export default function SaaSLazyRoute() { return <SaaSPage />; }
