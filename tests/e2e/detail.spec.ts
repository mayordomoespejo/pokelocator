import { test, expect } from "@playwright/test";

const detailTimeouts = { timeout: 20000 };

test.describe("Pokemon Detail Page", () => {
  test("navigates to Pikachu detail page", async ({ page }) => {
    await page.goto("/en/pokemon/25");

    // Wait for content so we know the page and title have loaded
    await expect(page.getByRole("heading", { level: 1, name: /pikachu/i })).toBeVisible(
      detailTimeouts
    );
    await expect(page).toHaveTitle(/pikachu/i);
  });

  test("shows dex number and name", async ({ page }) => {
    await page.goto("/en/pokemon/25");

    await expect(page.getByText("#025")).toBeVisible(detailTimeouts);
    await expect(page.getByRole("heading", { level: 1, name: /pikachu/i })).toBeVisible();
  });

  test("shows base stats section", async ({ page }) => {
    await page.goto("/en/pokemon/25");

    await expect(page.getByRole("region", { name: /base stats/i })).toBeVisible(detailTimeouts);
  });

  test("evolution chain is visible", async ({ page }) => {
    await page.goto("/en/pokemon/25");

    const evolution = page.getByRole("region", { name: /evolution/i });
    await expect(evolution).toBeVisible({ timeout: 20000 });
  });

  test("back link navigates to home", async ({ page }) => {
    await page.goto("/en/pokemon/25");

    const backLink = page.getByRole("link", { name: /back to pokédex/i });
    await expect(backLink).toBeVisible(detailTimeouts);
    await backLink.click();

    await expect(page).toHaveURL(/\/(es|en)\/?$/);
  });
});
