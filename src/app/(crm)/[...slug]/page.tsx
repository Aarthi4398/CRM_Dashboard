import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { routeTitles } from "@/lib/menu";
import { metadataForRouteSegment } from "@/lib/routes/page-metadata";
import "@/styles/pages/catalog.css";
import "@/styles/pages/generators.css";
import "@/styles/pages/layout-demos.css";

// Keep this catch-all for connected catalog demos. Unknown slugs call notFound()
// so the global app/not-found.tsx still owns the 404 presentation.

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join("/");
  const metadata = metadataForRouteSegment(key);
  return metadata ?? {};
}

export default async function ConnectedDemoPage({params}:{params:Promise<{slug:string[]}>}){
 const {slug}=await params; const key=slug.join("/"); const title=routeTitles.get(key);
 if(!title) notFound();
 return <CatalogPage slug={key} title={title}/>;
}
