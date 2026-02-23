import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FavoritesButton } from "@/features/favorites/FavoritesButton";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import type { FavoriteItem } from "@/types/models";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string, values?: Record<string, string>) => {
      const name = values?.name ?? "pokemon";
      if (key === "add") return `Add ${name} to favorites`;
      if (key === "remove") return `Remove ${name} from favorites`;
      if (key === "save") return "Save";
      if (key === "saved") return "Saved";
      return key;
    };
    t.has = () => false;
    return t;
  },
}));

const mockItem: FavoriteItem = {
  id: 1,
  name: "bulbasaur",
  types: [{ name: "grass", slot: 1 }],
  sprite: "https://example.com/bulbasaur.png",
};

describe("FavoritesButton", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [], hydrated: true });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders add to favorites button", () => {
    act(() => {
      root.render(<FavoritesButton item={mockItem} />);
    });
    const btn = container.querySelector("button");
    expect(btn).toBeTruthy();
    expect(btn?.getAttribute("aria-label")).toContain("Add");
    expect(btn?.getAttribute("aria-label")).toContain("Bulbasaur");
  });

  it("shows aria-pressed=false when not favorited", () => {
    act(() => {
      root.render(<FavoritesButton item={mockItem} />);
    });
    const btn = container.querySelector("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles favorite on click", () => {
    act(() => {
      root.render(<FavoritesButton item={mockItem} />);
    });

    const btn = container.querySelector("button");
    expect(btn).toBeTruthy();

    act(() => {
      btn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(useFavoritesStore.getState().isFavorite(1)).toBe(true);
  });

  it("updates aria-label when favorited", () => {
    useFavoritesStore.setState({ favorites: [mockItem], hydrated: true });
    act(() => {
      root.render(<FavoritesButton item={mockItem} />);
    });
    const btn = container.querySelector("button");
    expect(btn?.getAttribute("aria-label")).toContain("Remove");
    expect(btn?.getAttribute("aria-label")).toContain("Bulbasaur");
  });

  it("shows label when showLabel=true", () => {
    act(() => {
      root.render(<FavoritesButton item={mockItem} showLabel />);
    });
    expect(container.textContent).toContain("Save");
  });

  it("shows Saved label when item is favorited and showLabel=true", () => {
    useFavoritesStore.setState({ favorites: [mockItem], hydrated: true });
    act(() => {
      root.render(<FavoritesButton item={mockItem} showLabel />);
    });
    expect(container.textContent).toContain("Saved");
  });
});
