import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  collectMenuHrefs,
  isMenuRouteSlug,
  menuHrefToSlug,
  resolveCatchAllSlug,
} from "../../src/lib/routes/registry.ts";
import { BARE_PATHS, isBarePath } from "../../src/lib/routes/chrome.ts";

function walkPages(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkPages(path, files);
    else if (entry.name === "page.tsx") files.push(path);
  }
  return files;
}

function routePathFromPage(pagePath, appRoot) {
  const relative = pagePath
    .slice(appRoot.length + 1)
    .replace(/\\/g, "/")
    .replace(/(^|\/)page\.tsx$/, "");
  const segments = relative
    .split("/")
    .filter((segment) => !segment.startsWith("(") && !segment.endsWith(")"));
  if (segments[0] === "[...slug]") return null;
  if (segments.includes("[...slug]")) return null;
  return segments.length ? `/${segments.join("/")}` : "/";
}

test("menu hrefs are unique, lowercase, and kebab-case", () => {
  const hrefs = collectMenuHrefs();
  const unique = new Set(hrefs);
  assert.equal(unique.size, hrefs.length, "duplicate menu hrefs found");
  for (const href of hrefs) {
    assert.match(href, /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test("every menu href resolves to a registered menu slug", () => {
  for (const href of collectMenuHrefs()) {
    const slug = menuHrefToSlug(href);
    assert.ok(isMenuRouteSlug(slug), `menu slug missing from routeTitles: ${slug}`);
  }
});

test("resolveCatchAllSlug accepts single-segment menu slugs only", () => {
  assert.deepEqual(resolveCatchAllSlug(["text-generator"]), {
    slug: "text-generator",
    title: "Text Generator",
  });
  assert.equal(resolveCatchAllSlug(undefined), null);
  assert.equal(resolveCatchAllSlug([]), null);
  assert.equal(resolveCatchAllSlug(["text-generator", "extra"]), null);
  assert.equal(resolveCatchAllSlug(["definitely-not-a-route"]), null);
});

test("explicit app routes and menu hrefs do not define duplicate canonical slugs", () => {
  const appRoot = join(process.cwd(), "src/app");
  const explicitRoutes = walkPages(appRoot)
    .map((pagePath) => routePathFromPage(pagePath, appRoot))
    .filter(Boolean);
  const explicitSlugs = new Set(explicitRoutes.map((route) => menuHrefToSlug(route)));
  const menuSlugs = collectMenuHrefs().map(menuHrefToSlug);

  for (const slug of menuSlugs) {
    if (explicitSlugs.has(slug)) {
      assert.ok(isMenuRouteSlug(slug), `explicit route missing menu title: ${slug}`);
    }
  }
});

test("bare route classification includes legal pages", () => {
  assert.equal(isBarePath("/terms"), true);
  assert.equal(isBarePath("/privacy"), true);
  assert.ok(BARE_PATHS.has("/terms"));
  assert.ok(BARE_PATHS.has("/privacy"));
});

test("catch-all page uses shared slug resolver", () => {
  const source = readFileSync(join(process.cwd(), "src/app/(crm)/[...slug]/page.tsx"), "utf8");
  assert.match(source, /resolveCatchAllSlug/);
  assert.doesNotMatch(source, /routeTitles\.get/);
});
