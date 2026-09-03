"use client";

import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";

const StocksPage = dynamic(() => import("@/components/pages/stocks-page"), {
  loading: () => <HeavyVisualLoading label="Loading stock charts" />,
});

export default function StocksLazyRoute() { return <StocksPage />; }
