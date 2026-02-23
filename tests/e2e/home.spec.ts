import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads and shows Pokemon grid", async ({ page }) => {
    await page.goto("/en");

    // Wait for grid to be visible
    await expect(page.getByRole("list", { name: /pokémon list/i })).toBeVisible({
      timeout: 15000,
    });

    // Should have multiple cards
    const cards = page.getByRole("listitem");
    await expect(cards.first()).toBeVisible();
  });

  test("search bar is present and focusable", async ({ page }) => {
    await page.goto("/en");

    const searchInput = page.getByRole("combobox", { name: /search pokémon/i });
    await expect(searchInput).toBeVisible();
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test("type filter chips are visible", async ({ page }) => {
    await page.goto("/en");

    // Wait for type chips to load
    const allChip = page.getByRole("button", { name: "All" });
    await expect(allChip).toBeVisible({ timeout: 10000 });
  });

  test("dark mode toggle is accessible", async ({ page }) => {
    await page.goto("/en");

    const toggle = page.getByRole("button", { name: /switch to dark mode/i });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });
});
