import { MaintenancePage } from "@/components/status-page";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Maintenance");

export default function Page() {
  return <MaintenancePage />;
}
