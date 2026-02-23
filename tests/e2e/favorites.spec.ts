import { test, expect } from "@playwright/test";

test.describe("Favorites", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("pokelocator-favorites"));
  });

  test("favorites page shows empty state initially", async ({ page }) => {
    await page.goto("/favorites");

    await expect(page.getByText(/no favorites yet/i)).toBeVisible({ timeout: 5000 });
  });

  test("can add a pokemon to favorites from detail page", async ({ page }) => {
    await page.goto("/pokemon/1"); // Bulbasaur

    // Wait for the save button to appear
    const saveBtn = page.getByRole("button", { name: /add bulbasaur to favorites/i });
    await expect(saveBtn).toBeVisible({ timeout: 15000 });
    await saveBtn.click();

    // Verify it's saved
    await expect(saveBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("full flow: home → detail → add favorite → favorites page", async ({ page }) => {
    // Start at home
    await page.goto("/");

    // Wait for grid
    await page.getByRole("list", { name: /pokémon list/i }).waitFor({ timeout: 15000 });

    // Click first card
    const firstCard = page.getByRole("listitem").first();
    const detailLink = firstCard.getByRole("link", { name: /view .* details/i });
    await detailLink.click();

    // Wait for detail page to load
    await page.waitForURL(/\/pokemon\/\d+/);

    // Add to favorites
    const saveBtn = page.getByRole("button", { name: /add .* to favorites/i });
    await expect(saveBtn).toBeVisible({ timeout: 15000 });
    await saveBtn.click();

    // Navigate to favorites
    await page.goto("/favorites");

    // Should show 1 favorite
    const cards = page.getByRole("list");
    await expect(cards).toBeVisible({ timeout: 5000 });
  });
});
