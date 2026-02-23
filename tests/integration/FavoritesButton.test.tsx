import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesButton } from "@/features/favorites/FavoritesButton";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import type { FavoriteItem } from "@/types/models";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockItem: FavoriteItem = {
  id: 1,
  name: "bulbasaur",
  types: [{ name: "grass", slot: 1 }],
  sprite: "https://example.com/bulbasaur.png",
};

describe("FavoritesButton", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [], hydrated: true });
  });

  it("renders add to favorites button", () => {
    render(<FavoritesButton item={mockItem} />);
    expect(screen.getByRole("button", { name: /add bulbasaur to favorites/i })).toBeInTheDocument();
  });

  it("shows aria-pressed=false when not favorited", () => {
    render(<FavoritesButton item={mockItem} />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles favorite on click", async () => {
    const user = userEvent.setup();
    render(<FavoritesButton item={mockItem} />);

    const btn = screen.getByRole("button");
    await user.click(btn);

    expect(useFavoritesStore.getState().isFavorite(1)).toBe(true);
  });

  it("updates aria-label when favorited", async () => {
    useFavoritesStore.setState({ favorites: [mockItem], hydrated: true });
    render(<FavoritesButton item={mockItem} />);
    expect(
      screen.getByRole("button", { name: /remove bulbasaur from favorites/i })
    ).toBeInTheDocument();
  });

  it("shows label when showLabel=true", () => {
    render(<FavoritesButton item={mockItem} showLabel />);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("shows Saved label when item is favorited and showLabel=true", () => {
    useFavoritesStore.setState({ favorites: [mockItem], hydrated: true });
    render(<FavoritesButton item={mockItem} showLabel />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });
});
