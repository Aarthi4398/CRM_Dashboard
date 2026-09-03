import { expect,test } from "@playwright/test";
import { menuSections } from "../src/lib/menu";
const routes=["dashboard","contacts","companies","deals","tasks","calendar","profile"];
const menuRoutes=[...new Set(menuSections.flatMap(section=>section.items.flatMap(item=>item.href?[item.href]:(item.children??[]).map(child=>child.href))))];
async function expectRouteReady(page: import("@playwright/test").Page) {
  await expect(page.locator("main").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/This CRM route does not exist|Application error|Internal Server Error/);
}
for(const route of routes)test(`${route} route loads`,async({page})=>{await page.goto(`/${route}`);await expectRouteReady(page)});
test("theme persists",async({page})=>{await page.goto("/dashboard");await page.getByRole("button",{name:/Switch to dark theme/i}).click();await expect(page.locator("html")).toHaveClass(/dark/);await page.reload();await expect(page.locator("html")).toHaveClass(/dark/)});
test("recent orders filter and selection work",async({page})=>{await page.goto("/dashboard");const ordersPanel=page.locator("section").filter({has:page.getByRole("heading",{name:"Recent Orders",exact:true})});const filter=ordersPanel.getByRole("button",{name:/Filter/});await expect(filter).toHaveAttribute("aria-expanded","false");await filter.click();await expect(filter).toHaveAttribute("aria-expanded","true");await ordersPanel.getByRole("menu").getByRole("button",{name:"Pending",exact:true}).click();await expect(ordersPanel.locator("tbody tr")).toHaveCount(2);await ordersPanel.locator("tbody input[type=checkbox]").first().check();await expect(ordersPanel.getByText("1 order selected")).toBeVisible()});
test("every sidebar destination is connected",async({page},testInfo)=>{test.skip(testInfo.project.name==="mobile","Full route audit runs once on desktop");test.setTimeout(180_000);for(const href of menuRoutes){await page.goto(href);await expectRouteReady(page)}});
