import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import "@/styles/pages/invoices.css";

const InvoicesPage = dynamic(() => import("@/components/pages/invoices-page"), {
  loading: () => <HeavyVisualLoading label="Loading invoices" />,
});

export default function InvoicesLazyRoute() {
  return <InvoicesPage />;
}
