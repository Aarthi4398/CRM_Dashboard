import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import "@/styles/pages/products-list.css";

const ProductsListPage = dynamic(() => import("@/components/pages/products-list-page"), {
  loading: () => <HeavyVisualLoading label="Loading products list" />,
});

export default function ProductsListLazyRoute() {
  return <ProductsListPage />;
}
