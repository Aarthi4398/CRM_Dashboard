import { ErrorPage } from "@/components/status-page";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("503 Error");

export default function Page() {
  return <ErrorPage code="503" />;
}
