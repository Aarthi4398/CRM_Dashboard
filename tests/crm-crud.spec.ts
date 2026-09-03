import { expect, test } from "@playwright/test";

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

  page.once("dialog", dialog => dialog.accept());
  await row.getByRole("button", { name: "Delete" }).click();
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
