import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/dashboard",
  "/contacts",
  "/tasks",
  "/deals",
  "/calendar",
  "/profile",
  "/finance",
  "/text-generator",
];

async function stabilize(page: Page) {
  await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
  await expect(page.locator("main").first()).toBeVisible();
  await page.waitForTimeout(250);
}

test.describe("visual regression", () => {
  test.describe.configure({ mode: "serial" });

  for (const route of routes) {
    test(`${route} matches desktop screenshot`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "chromium", "Visual baselines are captured once on desktop Chromium");
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      await stabilize(page);
      await expect(page.locator("main").first()).toHaveScreenshot(`${route.slice(1)}.png`, {
        animations: "disabled",
        caret: "hide",
        maxDiffPixelRatio: 0.03,
        mask: [
          page.locator(".recharts-wrapper"),
          page.locator("iframe"),
          page.locator("canvas"),
          page.locator("video"),
        ],
      });
    });
  }
});
