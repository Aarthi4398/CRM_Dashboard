import { expect, test } from "@playwright/test";

test("unknown route returns the global not-found page", async ({ page }) => {
  await page.goto("/definitely-not-a-real-route");
  await expect(page.getByText("We can't seem to find the page you are looking for!")).toBeVisible();
});

test("nested catch-all slug returns not found", async ({ page }) => {
  await page.goto("/text-generator/extra-segment");
  await expect(page.getByText("We can't seem to find the page you are looking for!")).toBeVisible();
});

test("signup legal links resolve to dedicated pages", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("link", { name: "Terms and Conditions" }).click();
  await expect(page).toHaveURL(/\/terms$/);
  await expect(page.getByRole("heading", { name: "Terms and Conditions" })).toBeVisible();

  await page.goto("/signup");
  await page.getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
});
