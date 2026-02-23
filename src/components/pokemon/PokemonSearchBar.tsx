"use client";

import { useRef, useState, useCallback, useId } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, X } from "lucide-react";
import { SearchSuggestions } from "@/features/search/SearchSuggestions";
import { useDebounce } from "@/hooks/useDebounce";
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
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const { suggestions, isLoading } = usePokemonSearch(debouncedQuery);

  const showSuggestions = isOpen && suggestions.length > 0;
  const showNoResults =
    isOpen && debouncedQuery.trim().length >= 2 && !isLoading && suggestions.length === 0;

  const handleSelect = useCallback(
    (suggestion: { id: number; name: string }) => {
      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
      router.push(`/pokemon/${suggestion.id}`);
    },
    [router]
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
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && suggestions[activeIndex]) {
            handleSelect(suggestions[activeIndex]);
          } else if (query.trim()) {
            router.push(`/pokemon/${query.toLowerCase().trim()}`);
            setQuery("");
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setActiveIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [showSuggestions, activeIndex, suggestions, handleSelect, query, router]
  );

  const activeDescendant = activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined;

  return (
    <div className={cn("relative", className)}>
      {/* Input — role="combobox" must be directly on the input element */}
      <div className="relative flex items-center">
        <div className="text-text-secondary pointer-events-none absolute left-3">
          <Search size={16} aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          autoComplete="off"
          aria-label={t("label")}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
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
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label={t("clear")}
            className="text-text-secondary hover:bg-brand-light/45 hover:text-brand absolute right-3 cursor-pointer rounded-full p-0.5 transition-colors"
            tabIndex={-1}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          inputId={inputId}
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
