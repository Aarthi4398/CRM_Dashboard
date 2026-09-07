import { SuccessPage } from "@/components/status-page";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Success");

export default function Page() {
  return <SuccessPage />;
}
