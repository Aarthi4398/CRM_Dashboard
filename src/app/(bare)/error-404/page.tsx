import { ErrorPage } from "@/components/status-page";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("404 Error");

export default function Page() {
  return <ErrorPage code="404" />;
}
