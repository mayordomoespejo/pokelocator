import { test, expect } from "@playwright/test";

test.describe("Favorites", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/en");
    await page.evaluate(() => localStorage.removeItem("pokelocator-favorites"));
  });

  test("favorites page shows empty state initially", async ({ page }) => {
    await page.goto("/en/favorites");

    await expect(page.getByText(/no favorites yet/i)).toBeVisible({ timeout: 10000 });
  });

  test("can add a pokemon to favorites from detail page", async ({ page }) => {
    await page.goto("/en/pokemon/1"); // Bulbasaur

    // Wait for the save button to appear
    const saveBtn = page.getByRole("button", { name: /add bulbasaur to favorites/i });
    await expect(saveBtn).toBeVisible({ timeout: 15000 });
    await saveBtn.click();

    // Verify it toggled to the saved state
    const removeBtn = page.getByRole("button", { name: /remove bulbasaur from favorites/i });
    await expect(removeBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("full flow: home → detail → add favorite → favorites page", async ({ page }) => {
    // Start at home
    await page.goto("/en");

    // Wait for grid
    await page.getByRole("list", { name: /pokémon list/i }).waitFor({ timeout: 15000 });

    // Click first card
    const firstCard = page
      .getByRole("list", { name: /pokémon list/i })
      .getByRole("listitem")
      .first();
    const detailLink = firstCard.getByRole("link", { name: /view .* details/i });
    const detailHref = await detailLink.getAttribute("href");
    expect(detailHref).toBeTruthy();
    await page.goto(detailHref!);

    // Wait for detail page to load
    await page.waitForURL(/\/en\/pokemon\/\d+/);

    // Add to favorites
    const saveBtn = page.getByRole("button", { name: /add .* to favorites/i });
    await expect(saveBtn).toBeVisible({ timeout: 15000 });
    await saveBtn.click();

    // Navigate to favorites
    await page.goto("/en/favorites");

    // Should show at least one favorite card (link to view details)
    await expect(page.getByRole("link", { name: /view .* details/i }).first()).toBeVisible({
      timeout: 10000,
    });
  });
});
