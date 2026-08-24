import { expect,test } from "@playwright/test";
const routes=["dashboard","contacts","companies","deals","tasks","calendar","profile"];
for(const route of routes)test(`${route} route loads`,async({page})=>{await page.goto(`/${route}`);await expect(page.locator("h1")).toBeVisible();await expect(page.locator("body")).not.toContainText("This CRM route does not exist")});
test("theme persists",async({page})=>{await page.goto("/dashboard");await page.getByRole("button",{name:/Switch to dark theme/i}).click();await expect(page.locator("html")).toHaveClass(/dark/);await page.reload();await expect(page.locator("html")).toHaveClass(/dark/)});
