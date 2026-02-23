import { describe, it, expect } from "vitest";
import {
  formatHeight,
  formatWeight,
  formatDexNumber,
  capitalize,
  formatApiName,
  cleanFlavorText,
} from "@/lib/utils/formatters";

describe("formatters", () => {
  describe("formatHeight", () => {
    it("converts decimetres to metres", () => {
      expect(formatHeight(7)).toBe("0.7 m");
      expect(formatHeight(17)).toBe("1.7 m");
      expect(formatHeight(45)).toBe("4.5 m");
    });
  });

  describe("formatWeight", () => {
    it("converts hectograms to kilograms", () => {
      expect(formatWeight(69)).toBe("6.9 kg");
      expect(formatWeight(905)).toBe("90.5 kg");
    });
  });

  describe("formatDexNumber", () => {
    it("zero-pads to 3 digits with # prefix", () => {
      expect(formatDexNumber(1)).toBe("#001");
      expect(formatDexNumber(25)).toBe("#025");
      expect(formatDexNumber(151)).toBe("#151");
      expect(formatDexNumber(1000)).toBe("#1000");
    });
  });

  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("pikachu")).toBe("Pikachu");
      expect(capitalize("")).toBe("");
      expect(capitalize("FIRE")).toBe("FIRE");
    });
  });

  describe("formatApiName", () => {
    it("converts hyphenated API names to display names", () => {
      expect(formatApiName("special-attack")).toBe("Special Attack");
      expect(formatApiName("growth-rate")).toBe("Growth Rate");
      expect(formatApiName("fire")).toBe("Fire");
    });
  });

  describe("cleanFlavorText", () => {
    it("removes special whitespace characters", () => {
      expect(cleanFlavorText("It can\nstretch\fits body")).toBe("It can stretch its body");
      expect(cleanFlavorText("Line 1\r\nLine 2")).toBe("Line 1 Line 2");
    });

    it("collapses multiple spaces", () => {
      expect(cleanFlavorText("Too   many   spaces")).toBe("Too many spaces");
    });
  });
});
