import { describe, it, expect } from "vitest";
import { getIdFromUrl, getEvolutionChainIdFromUrl } from "@/lib/utils/pokemon";

describe("pokemon utils", () => {
  describe("getIdFromUrl", () => {
    it("extracts numeric ID from PokéAPI URLs", () => {
      expect(getIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
      expect(getIdFromUrl("https://pokeapi.co/api/v2/pokemon-species/1/")).toBe(1);
      expect(getIdFromUrl("https://pokeapi.co/api/v2/evolution-chain/67/")).toBe(67);
    });
  });

  describe("getEvolutionChainIdFromUrl", () => {
    it("extracts evolution chain ID", () => {
      expect(getEvolutionChainIdFromUrl("https://pokeapi.co/api/v2/evolution-chain/10/")).toBe(10);
    });
  });
});
