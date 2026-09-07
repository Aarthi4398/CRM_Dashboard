import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import "@/styles/pages/file-manager.css";

const FileManagerPage = dynamic(() => import("@/components/pages/file-manager-page"), {
  loading: () => <HeavyVisualLoading label="Loading file manager" />,
});

export default function FileManagerLazyRoute() {
  return <FileManagerPage />;
}
