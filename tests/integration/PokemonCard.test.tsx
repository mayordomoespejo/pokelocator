import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import type { PokemonListItem } from "@/types/models";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
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

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("PokemonCard", () => {
  it("renders pokemon name", () => {
    render(<PokemonCard pokemon={mockPokemon} />, { wrapper });
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("pikachu")).toBeInTheDocument();
  });

  it("renders dex number", () => {
    render(<PokemonCard pokemon={mockPokemon} />, { wrapper });
    expect(screen.getByText("#025")).toBeInTheDocument();
  });

  it("renders type badge", () => {
    render(<PokemonCard pokemon={mockPokemon} />, { wrapper });
    expect(screen.getByText("Electric")).toBeInTheDocument();
  });

  it("has accessible aria-label", () => {
    render(<PokemonCard pokemon={mockPokemon} />, { wrapper });
    expect(screen.getByRole("article", { name: /pikachu.*electric/i })).toBeInTheDocument();
  });

  it("links to detail page", () => {
    render(<PokemonCard pokemon={mockPokemon} />, { wrapper });
    const link = screen.getByRole("link", { name: /view pikachu details/i });
    expect(link).toHaveAttribute("href", "/pokemon/25");
  });
});
