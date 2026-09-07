import { expect, test } from "@playwright/test";

test.describe("CRM CRUD", () => {
  test.describe.configure({ timeout: 60_000 });

test("contact create, edit, persist, and delete flow", async ({ page }) => {
  await page.goto("/contacts");
  await page.getByRole("button", { name: "Add contact" }).click();
  await page.getByLabel("Full name").fill("Playwright Person");
  await page.getByLabel("Role").fill("QA Lead");
  await page.getByLabel("Company").fill("Test Company");
  await page.getByLabel("Email").fill("playwright@example.com");
  await page.getByLabel("Phone").fill("+91 99999 00000");
  await page.getByRole("button", { name: "Save contact" }).click();
  await expect(page.getByText("Playwright Person", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Playwright Person", { exact: true })).toBeVisible();

  const row = page.getByRole("row").filter({ hasText: "Playwright Person" });
  await row.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Role").fill("Senior QA Lead");
  await page.getByRole("button", { name: "Save contact" }).click();
  await expect(row).toContainText("Senior QA Lead");

  await row.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("dialog", { name: "Delete contact" }).getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Playwright Person", { exact: true })).toHaveCount(0);
});

test("task creation and status update persist", async ({ page }) => {
  await page.goto("/tasks");
  await page.getByRole("button", { name: "New task" }).click();
  await page.getByLabel("Task title").fill("Verify CRM release");
  await page.getByLabel("Related company or deal").fill("Test Company");
  await page.getByRole("button", { name: "Create task" }).click();
  const card = page.locator("article").filter({ hasText: "Verify CRM release" });
  await expect(card).toBeVisible();
  await card.locator("select").selectOption("Done");
  await page.reload();
  await page.getByRole("button", { name: "List view" }).click();
  const row = page.locator("section").filter({ hasText: "Verify CRM release" });
  await expect(row.getByText("Verify CRM release", { exact: true })).toBeVisible();
});

test("deal stage changes persist", async ({ page }) => {
  await page.goto("/deals");
  const deal = page.locator('article[draggable="true"]').filter({ hasText: "AI support suite" });
  const wonColumn = page.getByText("Won", { exact: true }).locator("../..");
  const transfer = await page.evaluateHandle(() => new DataTransfer());
  await deal.dispatchEvent("dragstart", { dataTransfer: transfer });
  await wonColumn.dispatchEvent("dragover", { dataTransfer: transfer });
  await wonColumn.dispatchEvent("drop", { dataTransfer: transfer });
  await expect(wonColumn).toContainText("AI support suite");
  await page.reload();
  await expect(page.getByText("Won", { exact: true }).locator("../..")).toContainText("AI support suite");
});

test("calendar event creation persists", async ({ page }) => {
  await page.goto("/calendar");
  await page.getByRole("button", { name: "Add Event +" }).click();
  await page.getByLabel("Event Title").fill("Playwright planning session");
  await page.getByLabel("Event Date").fill("2026-08-27");
  await page.getByLabel("Event Time").fill("13:30");
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(page.getByText("Playwright planning session", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Playwright planning session", { exact: true })).toBeVisible();
});

test("company create, edit, persist, delete, and modal accessibility flow", async ({ page }) => {
  await page.goto("/companies");
  const addButton = page.getByRole("button", { name: "Add company" });
  await addButton.click();
  const dialog = page.getByRole("dialog", { name: "Add company" });
  await expect(dialog).toBeVisible();

  const initialFocus = await page.evaluate(() => {
    const dialogElement = document.querySelector('[role="dialog"][aria-labelledby]');
    const active = document.activeElement;
    return Boolean(dialogElement && active && dialogElement.contains(active));
  });
  expect(initialFocus).toBe(true);

  await dialog.getByLabel("Company name").fill("Playwright Corp");
  await dialog.getByLabel("Industry", { exact: true }).fill("Testing");
  await dialog.getByLabel("Website").fill("playwright.demo");
  await dialog.getByLabel("Location").fill("Remote");
  await dialog.getByLabel("Portfolio value").fill("25000");
  await dialog.getByRole("button", { name: "Save company" }).click();
  const card = page.locator("article").filter({ hasText: "Playwright Corp" });
  await expect(card).toBeVisible();
  await page.reload();
  await expect(page.getByText("Playwright Corp", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Edit" }).click();
  const editDialog = page.getByRole("dialog", { name: "Edit company" });
  await expect(editDialog).toBeVisible();
  await editDialog.getByLabel("Industry", { exact: true }).fill("Quality Assurance");
  await editDialog.getByRole("button", { name: "Save company" }).click();
  await expect(card).toContainText("Quality Assurance");

  await card.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("dialog", { name: "Delete company" }).getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Playwright Corp", { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("Playwright Corp", { exact: true })).toHaveCount(0);
});

test("company delete is blocked when related records exist", async ({ page }) => {
  await page.goto("/companies");
  const card = page.locator("article").filter({ hasText: "Nova Labs" });
  await card.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("dialog", { name: "Delete company" }).getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("status")).toContainText(/Cannot delete Nova Labs/);
  await expect(page.getByText("Nova Labs", { exact: true })).toBeVisible();
});
});
