import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { metadataForRouteSegment } from "@/lib/routes/page-metadata";
import { resolveCatchAllSlug } from "@/lib/routes/registry";
import "@/styles/pages/catalog.css";
import "@/styles/pages/generators.css";
import "@/styles/pages/layout-demos.css";

// Keep this catch-all for connected catalog demos. Unknown slugs call notFound()
// so the global app/not-found.tsx still owns the 404 presentation.

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const resolved = resolveCatchAllSlug(slug);
  if (!resolved) return {};
  return metadataForRouteSegment(resolved.slug) ?? {};
}

export default async function ConnectedDemoPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const resolved = resolveCatchAllSlug(slug);
  if (!resolved) notFound();
  return <CatalogPage slug={resolved.slug} title={resolved.title} />;
}
