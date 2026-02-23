"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { capitalize, formatDexNumber } from "@/lib/utils/formatters";
import type { SearchSuggestion } from "@/hooks/usePokemonSearch";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  activeIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
  inputId: string;
  /** Optional aria-label for the listbox (default: "Pokemon suggestions") */
  listboxAriaLabel?: string;
  /** Optional extra class names for the listbox (e.g. max-h-48) */
  listboxClassName?: string;
}

export const SearchSuggestions = forwardRef<HTMLUListElement, SearchSuggestionsProps>(
  (
    {
      suggestions,
      activeIndex,
      onSelect,
      inputId,
      listboxAriaLabel = "Pokemon suggestions",
      listboxClassName,
    },
    ref
  ) => {
    if (suggestions.length === 0) return null;

    return (
      <ul
        ref={ref}
        id={`${inputId}-listbox`}
        role="listbox"
        aria-label={listboxAriaLabel}
        className={cn(
          "listbox-scroll border-border-strong bg-bg-card absolute top-full right-0 left-0 z-50 mt-1 overflow-x-hidden overflow-y-auto rounded-xl border shadow-lg",
          listboxClassName
        )}
      >
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            id={`${inputId}-option-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(suggestion);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors",
              index === activeIndex
                ? "bg-brand-light text-brand"
                : "text-text-primary hover:bg-bg-muted"
            )}
          >
            <span className="text-text-muted text-xs">{formatDexNumber(suggestion.id)}</span>
            <span className="font-medium capitalize">{capitalize(suggestion.name)}</span>
          </li>
        ))}
      </ul>
    );
  }
);

SearchSuggestions.displayName = "SearchSuggestions";
