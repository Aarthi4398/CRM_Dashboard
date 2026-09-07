import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else if (entry.name === "page.tsx") files.push(path);
  }
  return files;
}

test("every app page route has metadata via page export or layout", () => {
  const appRoot = join(process.cwd(), "src/app");
  const pages = walk(appRoot);
  const missing = [];

  for (const pagePath of pages) {
    const routeDir = pagePath.slice(0, -"page.tsx".length);
    const layoutPath = join(routeDir, "layout.tsx");
    const pageSource = readFileSync(pagePath, "utf8");
    const hasPageMetadata = /export const metadata|export async function generateMetadata/.test(pageSource);
    const hasLayoutMetadata = statSync(layoutPath, { throwIfNoEntry: false })
      ? /export const metadata|export async function generateMetadata/.test(readFileSync(layoutPath, "utf8"))
      : false;
    if (!hasPageMetadata && !hasLayoutMetadata) {
      missing.push(pagePath.replace(`${appRoot}\\`, "").replace(`${appRoot}/`, ""));
    }
  }

  assert.deepEqual(missing, []);
  assert.equal(pages.length, 52);
});

test("page metadata helper module exists for shared titles", () => {
  const source = readFileSync(join(process.cwd(), "src/lib/routes/page-metadata.ts"), "utf8");
  assert.match(source, /export function pageMetadata/);
  assert.match(source, /export function metadataForRouteSegment/);
});
