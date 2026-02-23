"use client";

import { useRef, useState, useCallback, useId } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { SearchSuggestions } from "@/features/search/SearchSuggestions";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchCombobox, useComboboxScrollIntoView } from "@/hooks/useSearchCombobox";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { cn } from "@/lib/utils/cn";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import type { CompareSlot } from "@/types/models";

interface CompareSelectorProps {
  label: string;
  slot: CompareSlot;
  onSelect: (pokemon: CompareSlot) => void;
  onClear: () => void;
}

export function CompareSelector({ label, slot, onSelect, onClear }: CompareSelectorProps) {
  const t = useTranslations("pokemon.compare");
  const tSearch = useTranslations("pokemon.search");
  const id = useId();
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
    (s: { id: number; name: string }) => {
      onSelect({ id: s.id, name: s.name });
      setQuery("");
      combobox.close();
    },
    [onSelect, combobox]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      combobox.handleKeyDown(e);
      if (e.key === "Enter" && combobox.activeIndex >= 0 && suggestions[combobox.activeIndex]) {
        e.preventDefault();
        handleSelect(suggestions[combobox.activeIndex]);
      }
    },
    [combobox, suggestions, handleSelect]
  );

  const activeDescendant = combobox.getActiveDescendantId(id);

  return (
    <div className="relative">
      <p className="text-text-muted mb-1.5 text-xs font-medium">{label}</p>

      {slot.id !== null ? (
        <div className="border-brand/50 bg-brand-light flex items-center justify-between rounded-xl border px-4 py-2.5">
          <p className="text-text-primary font-semibold capitalize">{slot.name}</p>
          <button
            onClick={onClear}
            aria-label={t("remove", { name: slot.name ?? "" })}
            className="text-text-secondary hover:bg-bg-card/70 hover:text-brand cursor-pointer rounded-full p-1 transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="relative flex items-center">
            <div className="text-text-secondary pointer-events-none absolute left-3">
              <Search size={14} aria-hidden="true" />
            </div>
            <input
              role="combobox"
              aria-expanded={combobox.showSuggestions}
              aria-haspopup="listbox"
              aria-controls={`${id}-listbox`}
              aria-label={tSearch("comboboxLabel", { label })}
              aria-autocomplete="list"
              aria-activedescendant={activeDescendant}
              value={query}
              onChange={combobox.inputHandlers.onChange}
              onFocus={combobox.inputHandlers.onFocus}
              onBlur={combobox.inputHandlers.onBlur}
              onKeyDown={handleKeyDown}
              placeholder={t("searchPlaceholder")}
              className={cn(
                "border-border bg-bg-card min-h-[46px] w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm shadow-sm transition-all outline-none",
                "text-text-primary placeholder:text-text-muted",
                "focus:border-brand"
              )}
            />
          </div>

          {combobox.showSuggestions && (
            <SearchSuggestions
              ref={listboxRef}
              suggestions={suggestions}
              activeIndex={combobox.activeIndex}
              onSelect={handleSelect}
              inputId={id}
              listboxAriaLabel={t("suggestions", { label })}
              listboxClassName="max-h-48"
            />
          )}

          {showNoResults && (
            <div
              id={`${id}-listbox`}
              role="status"
              aria-live="polite"
              className="border-border-strong bg-bg-card absolute top-full right-0 left-0 z-50 mt-1 rounded-xl border px-4 py-2.5 text-sm shadow-lg"
            >
              <p className="text-text-primary font-medium">{tSearch("noResults")}</p>
              <p className="text-text-muted text-xs">{tSearch("noResultsHint")}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
