"use client";

import { useRef, useState, useCallback, useId } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, X } from "lucide-react";
import { SearchSuggestions } from "@/features/search/SearchSuggestions";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchCombobox, useComboboxScrollIntoView } from "@/hooks/useSearchCombobox";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { cn } from "@/lib/utils/cn";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";

interface PokemonSearchBarProps {
  className?: string;
}

export function PokemonSearchBar({ className }: PokemonSearchBarProps) {
  const t = useTranslations("pokemon.search");
  const router = useRouter();
  const inputId = useId();
  const listboxRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const { suggestions, isLoading } = usePokemonSearch(debouncedQuery);

  const combobox = useSearchCombobox(suggestions, {
    minQueryLength: 2,
    query,
    setQuery,
  });
  useComboboxScrollIntoView(listboxRef, combobox.activeIndex, combobox.showSuggestions);

  const showNoResults =
    combobox.isOpen && debouncedQuery.trim().length >= 2 && !isLoading && suggestions.length === 0;

  const handleSelect = useCallback(
    (suggestion: { id: number; name: string }) => {
      setQuery("");
      combobox.close();
      router.push(`/pokemon/${suggestion.id}`);
    },
    [router, combobox]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      combobox.handleKeyDown(e);
      if (e.key === "Enter") {
        if (combobox.activeIndex >= 0 && suggestions[combobox.activeIndex]) {
          e.preventDefault();
          handleSelect(suggestions[combobox.activeIndex]);
        } else if (query.trim()) {
          e.preventDefault();
          router.push(`/pokemon/${query.toLowerCase().trim()}`);
          setQuery("");
          combobox.close();
        }
      }
    },
    [combobox, suggestions, query, handleSelect, router]
  );

  const activeDescendant = combobox.getActiveDescendantId(inputId);

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <div className="text-text-secondary pointer-events-none absolute left-3">
          <Search size={16} aria-hidden="true" />
        </div>
        <input
          id={inputId}
          type="search"
          role="combobox"
          value={query}
          onChange={combobox.inputHandlers.onChange}
          onFocus={combobox.inputHandlers.onFocus}
          onBlur={combobox.inputHandlers.onBlur}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          autoComplete="off"
          aria-label={t("label")}
          aria-autocomplete="list"
          aria-expanded={combobox.showSuggestions}
          aria-haspopup="listbox"
          aria-controls={`${inputId}-listbox`}
          aria-activedescendant={activeDescendant}
          className={cn(
            "border-border bg-bg-card text-text-primary w-full rounded-xl border shadow-sm transition-all outline-none",
            "placeholder:text-text-muted",
            "focus:border-brand",
            "py-2.5 pl-10 text-sm",
            query ? "pr-10" : "pr-4"
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              combobox.close();
            }}
            aria-label={t("clear")}
            className="text-text-secondary hover:bg-brand-light/45 hover:text-brand absolute right-3 cursor-pointer rounded-full p-0.5 transition-colors"
            tabIndex={-1}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {combobox.showSuggestions && (
        <SearchSuggestions
          ref={listboxRef}
          suggestions={suggestions}
          activeIndex={combobox.activeIndex}
          onSelect={handleSelect}
          inputId={inputId}
          listboxAriaLabel={t("label")}
        />
      )}

      {showNoResults && (
        <div
          id={`${inputId}-listbox`}
          role="status"
          aria-live="polite"
          className="border-border-strong bg-bg-card absolute top-full right-0 left-0 z-50 mt-1 rounded-xl border px-4 py-2.5 text-sm shadow-lg"
        >
          <p className="text-text-primary font-medium">{t("noResults")}</p>
          <p className="text-text-muted text-xs">{t("noResultsHint")}</p>
        </div>
      )}
    </div>
  );
}
