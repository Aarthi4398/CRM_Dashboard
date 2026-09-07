import { ComingSoonPage } from "@/components/coming-soon-page";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Coming Soon");

export default function Page() {
  return <ComingSoonPage />;
}
