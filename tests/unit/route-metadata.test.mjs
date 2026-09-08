import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const REQUIRED_EXPLICIT_ROUTES = [
  "/",
  "/dashboard",
  "/contacts",
  "/companies",
  "/deals",
  "/tasks",
  "/calendar",
  "/profile",
  "/terms",
  "/privacy",
  "/signin",
  "/signup",
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
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

function collectExplicitRoutes(appRoot) {
  return walk(appRoot)
    .map((pagePath) => routePathFromPage(pagePath, appRoot))
    .filter(Boolean);
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
  assert.ok(pages.length > 0, "expected at least one app page route");
});

test("required explicit routes exist", () => {
  const appRoot = join(process.cwd(), "src/app");
  const explicitRoutes = new Set(collectExplicitRoutes(appRoot));

  for (const route of REQUIRED_EXPLICIT_ROUTES) {
    assert.ok(explicitRoutes.has(route), `missing explicit route: ${route}`);
  }
});

test("terms and privacy pages declare metadata and demo placeholder copy", () => {
  for (const segment of ["terms", "privacy"]) {
    const pagePath = join(process.cwd(), "src/app/(bare)", segment, "page.tsx");
    const source = readFileSync(pagePath, "utf8");
    assert.match(source, /export const metadata/);
    assert.match(source, /portfolio demo includes placeholder/i);
  }
});

test("page metadata helper module exists for shared titles", () => {
  const source = readFileSync(join(process.cwd(), "src/lib/routes/page-metadata.ts"), "utf8");
  assert.match(source, /export function pageMetadata/);
  assert.match(source, /export function metadataForRouteSegment/);
  assert.match(source, /terms:\s*"Terms and Conditions"/);
  assert.match(source, /privacy:\s*"Privacy Policy"/);
});
