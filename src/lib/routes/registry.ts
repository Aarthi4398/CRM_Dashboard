import { menuSections, routeTitles } from "../menu";

export function collectMenuHrefs(): string[] {
  return menuSections.flatMap((section) =>
    section.items.flatMap((item) =>
      item.href ? [item.href] : (item.children ?? []).map((child) => child.href),
    ),
  );
}

export function menuHrefToSlug(href: string): string {
  return href.replace(/^\//, "");
}

export function isMenuRouteSlug(slug: string): boolean {
  return routeTitles.has(slug);
}

export function resolveCatchAllSlug(
  slugSegments: string[] | undefined,
): { slug: string; title: string } | null {
  if (!slugSegments?.length || slugSegments.length !== 1) return null;
  const slug = slugSegments[0];
  const title = routeTitles.get(slug);
  if (!title) return null;
  return { slug, title };
}
