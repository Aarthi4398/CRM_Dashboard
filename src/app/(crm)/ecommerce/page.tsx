import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import { pageMetadata } from "@/lib/routes/page-metadata";
import "@/styles/pages/ecommerce.css";

export const metadata = pageMetadata("Ecommerce");

const EcommercePage = dynamic(() => import("@/components/pages/ecommerce-page"), {
  loading: () => <HeavyVisualLoading label="Loading ecommerce charts" />,
});

export default function EcommerceLazyRoute() { return <EcommercePage />; }
