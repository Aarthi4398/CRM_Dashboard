import { expect, test } from "@playwright/test";

test("CSP allows required remote media while remaining present", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Header audit runs once on desktop");
  test.setTimeout(60_000);
  const response = await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  expect(response, "dashboard should respond").toBeTruthy();
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("https://nextjs-demo.tailadmin.com");
  expect(csp).toContain("https://www.openstreetmap.org");
  expect(csp).toContain("https://www.google.com");
  expect(csp).toContain("https://www.youtube.com");
  expect(csp).toContain("blob:");
  expect(csp).toContain("data:");
  expect(csp).toContain("style-src-attr 'unsafe-inline'");
  expect(csp).toContain("ws://localhost:*");
  expect(csp).not.toMatch(/connect-src[^;]*\bws:\b/);
  await expect(page.locator("main").first()).toBeVisible();
});
