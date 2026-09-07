import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import "@/styles/pages/ecommerce.css";

const EcommercePage = dynamic(() => import("@/components/pages/ecommerce-page"), {
  loading: () => <HeavyVisualLoading label="Loading ecommerce charts" />,
});

export default function EcommerceLazyRoute() { return <EcommercePage />; }
