import { ErrorPage } from "@/components/status-page";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Page Not Found");

export default function NotFound() {
  return <ErrorPage code="404" />;
}
