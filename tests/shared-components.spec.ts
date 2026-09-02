import { expect, test } from "@playwright/test";

test("shared status badges keep their semantic labels", async ({ page }) => {
  await page.goto("/stocks");
  await expect(page.getByText("Success", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Failed", { exact: true }).first()).toBeVisible();
});

test("shared modal closes with Escape", async ({ page }) => {
  await page.goto("/tasks");
  await page.getByRole("button", { name: "New task" }).click();
  await expect(page.getByRole("dialog", { name: "Create task" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Create task" })).toBeHidden();
});

test("premium date picker opens and clears its selected value", async ({ page }) => {
  await page.goto("/form-elements");
  const dateButton = page.getByRole("button", { name: "Select a date" }).first();
  await dateButton.click();
  await expect(page.getByRole("button", { name: "Today", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Today", exact: true }).click();
  await dateButton.click();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(dateButton).toContainText("Select a date");
});

test("underline tabs expose tab semantics without underlining their text", async ({ page }) => {
  await page.goto("/tabs");
  const tab = page.getByRole("tab", { name: "Notification" }).first();
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Notification", exact: true }).first()).toBeVisible();
});

for (const route of ["basic-tables", "data-tables", "alerts", "cards", "carousel", "dropdowns", "pagination", "popovers", "tabs", "text-generator", "layout-one", "line-chart", "maps", "buttons"]) {
  test(`split catalog family renders ${route}`, async ({ page }) => {
    await page.goto(`/${route}`);
    await expect(page.locator("main h1, main h2").first()).toBeVisible();
  });
}
