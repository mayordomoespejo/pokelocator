import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import type { ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import type { PokemonListItem } from "@/types/models";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    const t = (key: string, values?: Record<string, string>) => {
      if (namespace === "pokemon.card" && key === "viewDetails") {
        return `View ${values?.name ?? ""} details`;
      }
      if (namespace === "pokemon.types" && key === "electric") {
        return "Electric";
      }
      return key;
    };
    t.has = (key: string) => namespace === "pokemon.types" && key === "electric";
    return t;
  },
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockPokemon: PokemonListItem = {
  id: 25,
  name: "pikachu",
  types: [{ name: "electric", slot: 1 }],
  sprites: {
    officialArtwork:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    frontDefault: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    frontShiny: null,
  },
  url: "https://pokeapi.co/api/v2/pokemon/25/",
};

describe("PokemonCard", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
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

  it("renders pokemon name", () => {
    act(() => {
      root.render(<PokemonCard pokemon={mockPokemon} />);
    });
    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(container.textContent).toContain("pikachu");
  });

  it("renders dex number", () => {
    act(() => {
      root.render(<PokemonCard pokemon={mockPokemon} />);
    });
    expect(container.textContent).toContain("#025");
  });

  it("renders type badge", () => {
    act(() => {
      root.render(<PokemonCard pokemon={mockPokemon} />);
    });
    expect(container.textContent).toContain("Electric");
  });

  it("has accessible aria-label", () => {
    act(() => {
      root.render(<PokemonCard pokemon={mockPokemon} />);
    });
    const article = container.querySelector("article");
    expect(article?.getAttribute("aria-label")).toMatch(/pikachu/i);
    expect(article?.getAttribute("aria-label")).toMatch(/electric/i);
  });

  it("links to detail page", () => {
    act(() => {
      root.render(<PokemonCard pokemon={mockPokemon} />);
    });
    const link = container.querySelector('a[href="/pokemon/25"]');
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute("aria-label")).toMatch(/view pikachu details/i);
  });
});
