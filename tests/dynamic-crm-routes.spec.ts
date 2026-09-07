import { expect, test } from "@playwright/test";

async function expectRouteReady(page: import("@playwright/test").Page) {
  await expect(page.locator("main").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Application error|Internal Server Error/);
}

test.describe("Dynamic CRM routes", () => {
  test("invoices route loads and filters invoices", async ({ page }) => {
    await page.goto("/invoices");
    await expectRouteReady(page);
    await expect(page.getByRole("heading", { name: "Invoices", exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "Unpaid", exact: true }).click();
    await expect(page.locator("tbody tr").first()).toContainText("Unpaid");
  });

  test("products list route loads and filters products", async ({ page }) => {
    await page.goto("/products-list");
    await expectRouteReady(page);
    await expect(page.getByRole("heading", { name: "Products List" })).toBeVisible();
    await page.getByPlaceholder("Search...").fill("Samsung");
    await expect(page.getByText("Samsung Galaxy S24", { exact: true })).toBeVisible();
  });

  test("task kanban route loads and supports drag and drop", async ({ page }) => {
    await page.goto("/task-kanban");
    await expectRouteReady(page);
    await expect(page.getByRole("heading", { name: "Task Kanban", exact: true })).toBeVisible();
    const card = page.locator('article[draggable="true"]').filter({ hasText: "Finish user onboarding" });
    const completedColumn = page.locator("div.grid").locator("section").nth(2);
    await expect(card).toBeVisible();
    const transfer = await page.evaluateHandle(() => new DataTransfer());
    await card.dispatchEvent("dragstart", { dataTransfer: transfer });
    await completedColumn.dispatchEvent("dragover", { dataTransfer: transfer });
    await completedColumn.dispatchEvent("drop", { dataTransfer: transfer });
    await expect(completedColumn).toContainText("Finish user onboarding");
  });

  test("file manager route loads and supports file deletion", async ({ page }) => {
    await page.goto("/file-manager");
    await expectRouteReady(page);
    await expect(page.getByRole("heading", { name: "File Manager", exact: true })).toBeVisible();
    const row = page.getByRole("row").filter({ hasText: "Travel.jpg" });
    await row.getByRole("button", { name: "Delete Travel.jpg" }).click();
    await expect(page.getByText("Travel.jpg", { exact: true })).toHaveCount(0);
  });
});
