import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const port = 4179;
const url = `http://127.0.0.1:${port}/dashboard`;
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(process.cwd(), ".playwright-browsers");
const { chromium } = await import("@playwright/test");

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      await wait(1000);
    }
  }
  throw new Error("Production server did not become ready for Web Vitals collection.");
}

const server = spawn(process.execPath, ["./node_modules/next/dist/bin/next", "start", "--port", String(port)], {
  stdio: "inherit",
  env: process.env,
});

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await wait(1500);
  const vitals = await page.evaluate(() => {
    const paint = Object.fromEntries(performance.getEntriesByType("paint").map(entry => [entry.name, Math.round(entry.startTime)]));
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    const lcp = lcpEntries[lcpEntries.length - 1];
    return {
      fcp: paint["first-contentful-paint"] ?? null,
      lcp: lcp ? Math.round(lcp.startTime) : null,
      marks: performance.getEntriesByType("mark").map(entry => entry.name).filter(name => name.startsWith("web-vital:")),
    };
  });
  await browser.close();
  console.log(`Web Vitals sample for /dashboard: FCP=${vitals.fcp ?? "n/a"}ms LCP=${vitals.lcp ?? "n/a"}ms marks=${vitals.marks.join(",") || "none"}`);
  if (vitals.lcp && vitals.lcp > 8000) {
    throw new Error(`LCP ${vitals.lcp}ms exceeds the 8000ms sanity check.`);
  }
} finally {
  if (server.pid) {
    try { process.kill(server.pid); } catch { /* already exited */ }
  }
}
