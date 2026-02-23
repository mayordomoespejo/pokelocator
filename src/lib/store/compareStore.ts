"use client";

import { create } from "zustand";
import type { CompareSlot } from "@/types/models";

interface CompareState {
  slotA: CompareSlot;
  slotB: CompareSlot;
  setSlot: (slot: "A" | "B", pokemon: CompareSlot) => void;
  clearSlot: (slot: "A" | "B") => void;
  clearAll: () => void;
}

const emptySlot: CompareSlot = { id: null, name: null };

export const useCompareStore = create<CompareState>()((set) => ({
  slotA: emptySlot,
  slotB: emptySlot,
  setSlot: (slot, pokemon) => set(slot === "A" ? { slotA: pokemon } : { slotB: pokemon }),
  clearSlot: (slot) => set(slot === "A" ? { slotA: emptySlot } : { slotB: emptySlot }),
  clearAll: () => set({ slotA: emptySlot, slotB: emptySlot }),
}));
