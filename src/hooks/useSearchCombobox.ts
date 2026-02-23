"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

export interface SearchComboboxSuggestion {
  id: number;
  name: string;
}

export interface UseSearchComboboxOptions {
  /** Minimum query length to show suggestions (default 2) */
  minQueryLength?: number;
  /** Controlled mode: pass current query and setter (e.g. when using debounce in parent) */
  query?: string;
  setQuery?: (value: string) => void;
}

export interface UseSearchComboboxResult {
  query: string;
  setQuery: (value: string) => void;
  isOpen: boolean;
  activeIndex: number;
  showSuggestions: boolean;
  showNoResults: boolean;
  /** For aria-activedescendant: pass the combobox input id prefix (e.g. from useId()) */
  getActiveDescendantId: (inputId: string) => string | undefined;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  open: () => void;
  close: () => void;
  resetActiveIndex: () => void;
  /** Handlers for the input: onChange, onFocus, onBlur */
  inputHandlers: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
  };
}

/**
 * Shared combobox state and keyboard handling for search/select UIs.
 * Use with a listbox (e.g. SearchSuggestions) and optionally a listboxRef for scroll-into-view.
 */
export function useSearchCombobox(
  suggestions: SearchComboboxSuggestion[],
  options: UseSearchComboboxOptions = {}
): UseSearchComboboxResult {
  const { minQueryLength = 2, query: controlledQuery, setQuery: controlledSetQuery } = options;
  const [internalQuery, setInternalQuery] = useState("");
  const query = controlledQuery ?? internalQuery;
  const setQuery = controlledSetQuery ?? setInternalQuery;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const showSuggestions = isOpen && suggestions.length > 0;
  const showNoResults = isOpen && query.trim().length >= minQueryLength && suggestions.length === 0;

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const resetActiveIndex = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const getActiveDescendantId = useCallback(
    (inputId: string) => (activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined),
    [activeIndex]
  );

  const inputHandlers = useMemo(
    () => ({
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
        setActiveIndex(-1);
      },
      onFocus: () => setIsOpen(true),
      onBlur: () => setTimeout(() => setIsOpen(false), 150),
    }),
    [setQuery]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions && e.key !== "Enter") return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case "Escape":
          close();
          break;
        default:
          break;
      }
    },
    [showSuggestions, suggestions.length, close]
  );

  return {
    query,
    setQuery,
    isOpen,
    activeIndex,
    showSuggestions,
    showNoResults,
    getActiveDescendantId,
    open,
    close,
    resetActiveIndex,
    inputHandlers,
    handleKeyDown,
  };
}

/**
 * Hook to scroll the active listbox option into view when activeIndex changes.
 * Call this with the same listboxRef and activeIndex used in useSearchCombobox.
 */
export function useComboboxScrollIntoView(
  listboxRef: React.RefObject<HTMLUListElement | null>,
  activeIndex: number,
  showSuggestions: boolean
): void {
  useEffect(() => {
    if (!showSuggestions || activeIndex < 0 || !listboxRef.current) return;
    const activeOption = listboxRef.current.children.item(activeIndex) as HTMLElement | null;
    activeOption?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, showSuggestions, listboxRef]);
}
