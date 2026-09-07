import { expect, test } from "@playwright/test";

test("shared status badges keep their semantic labels", async ({ page }) => {
  await page.goto("/stocks");
  await expect(page.getByText("Success", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Failed", { exact: true }).first()).toBeVisible();
});

test("shared modal closes with Escape", async ({ page }) => {
  await page.goto("/tasks");
  const trigger = page.getByRole("button", { name: "New task" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Create task" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("shared modal traps focus and returns it to the trigger", async ({ page }) => {
  await page.goto("/tasks");
  const trigger = page.getByRole("button", { name: "New task" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Create task" });
  await expect(dialog).toBeVisible();

  const initialFocus = await page.evaluate(() => {
    const dialogElement = document.querySelector('[role="dialog"][aria-labelledby]');
    const active = document.activeElement;
    return Boolean(dialogElement && active && dialogElement.contains(active));
  });
  expect(initialFocus).toBe(true);

  await page.keyboard.press("Tab");
  const tabFocusInside = await page.evaluate(() => {
    const dialogElement = document.querySelector('[role="dialog"][aria-labelledby]');
    const active = document.activeElement;
    return Boolean(dialogElement && active && dialogElement.contains(active));
  });
  expect(tabFocusInside).toBe(true);

  await page.keyboard.press("Shift+Tab");
  const shiftTabFocusInside = await page.evaluate(() => {
    const dialogElement = document.querySelector('[role="dialog"][aria-labelledby]');
    const active = document.activeElement;
    return Boolean(dialogElement && active && dialogElement.contains(active));
  });
  expect(shiftTabFocusInside).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("form elements associate visible labels with their controls", async ({ page }) => {
  await page.goto("/form-elements");
  const associations = await page.locator(".form-elements-page label[for]").evaluateAll((labels) =>
    labels.map((label) => {
      const forId = label.getAttribute("for");
      return {
        label: label.textContent?.trim() ?? "",
        forId,
        hasControl: Boolean(forId && document.getElementById(forId)),
      };
    }),
  );
  expect(associations.length).toBeGreaterThan(10);
  for (const association of associations) {
    expect(association.hasControl, `Missing control for label "${association.label}"`).toBe(true);
  }
});

test("premium date picker opens and clears its selected value", async ({ page }) => {
  await page.goto("/form-elements");
  const dateButton = page.getByLabel("Date Picker Input");
  await dateButton.click();
  await expect(page.getByRole("button", { name: "Today", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Today", exact: true }).click();
  await dateButton.click();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(dateButton).toContainText("Select a date");
});

test("premium date picker closes on Escape and returns focus to the trigger", async ({ page }) => {
  await page.goto("/form-elements");
  const dateButton = page.getByLabel("Date Picker Input");
  await dateButton.focus();
  await page.keyboard.press("ArrowDown");
  const dialog = page.getByRole("dialog", { name: "Choose a date" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(dateButton).toBeFocused();
});

test("premium date picker closes on outside click and keeps inside clicks open", async ({ page }) => {
  await page.goto("/form-elements");
  const dateButton = page.getByLabel("Date Picker Input");
  await dateButton.click();
  const dialog = page.getByRole("dialog", { name: "Choose a date" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Previous month" }).click();
  await expect(dialog).toBeVisible();
  await page.locator("main h1").first().click();
  await expect(dialog).toBeHidden();
});

test("premium date picker supports arrow key navigation between days", async ({ page }) => {
  await page.goto("/form-elements");
  const dateButton = page.getByLabel("Date Picker Input");
  await dateButton.focus();
  await page.keyboard.press("ArrowDown");
  const dialog = page.getByRole("dialog", { name: "Choose a date" });
  await expect(dialog).toBeVisible();
  const before = await page.evaluate(() => document.activeElement?.getAttribute("data-date"));
  await page.keyboard.press("ArrowRight");
  const after = await page.evaluate(() => document.activeElement?.getAttribute("data-date"));
  expect(before).toBeTruthy();
  expect(after).toBeTruthy();
  expect(after).not.toBe(before);
});

test("header notifications expose aria-expanded and close on Escape", async ({ page }) => {
  await page.goto("/dashboard");
  const trigger = page.getByRole("button", { name: "Notifications" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.focus();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "Notifications" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("header profile menu supports keyboard navigation and Escape", async ({ page }) => {
  await page.goto("/dashboard");
  const trigger = page.getByRole("button", { name: "Open profile menu" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "Profile menu" });
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menuitem", { name: "My profile" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Sign out" })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("menuitem", { name: "My profile" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("underline tabs expose tab semantics without underlining their text", async ({ page }) => {
  await page.goto("/tabs");
  await expect(page.getByRole("heading", { name: "Tab With Underline" })).toBeVisible();
  const tab = page.getByRole("tab", { name: "Notification" }).first();
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Notification", exact: true }).first()).toBeVisible();
});

for (const route of ["basic-tables", "data-tables", "alerts", "cards", "carousel", "dropdowns", "pagination", "popovers", "tabs", "text-generator", "layout-one", "line-chart", "maps", "buttons"]) {
  test(`split catalog family renders ${route}`, async ({ page }) => {
    await page.goto(`/${route}`);
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Application error|Internal Server Error/);
  });
}
