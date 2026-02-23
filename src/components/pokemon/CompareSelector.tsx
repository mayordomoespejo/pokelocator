"use client";

import { useRef, useState, useId, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useDebounce } from "@/hooks/useDebounce";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { capitalize, formatDexNumber } from "@/lib/utils/formatters";
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
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const { suggestions } = usePokemonSearch(debouncedQuery);

  const showSuggestions = isOpen && suggestions.length > 0;

  const handleSelect = useCallback(
    (s: { id: number; name: string }) => {
      onSelect({ id: s.id, name: s.name });
      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
    },
    [onSelect]
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
          }
          break;
        case "Escape":
          setIsOpen(false);
          setActiveIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [showSuggestions, activeIndex, suggestions, handleSelect]
  );

  const activeDescendant = activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (!showSuggestions || activeIndex < 0 || !listboxRef.current) return;

    const activeOption = listboxRef.current.children.item(activeIndex) as HTMLElement | null;
    activeOption?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, showSuggestions]);

  return (
    <div className="relative">
      <p className="text-text-muted mb-1.5 text-xs font-medium">{label}</p>

      {slot.id !== null ? (
        /* Slot filled — selected Pokémon card */
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
        /* Slot empty — search input + suggestions */
        <>
          <div className="relative flex items-center">
            <div className="text-text-secondary pointer-events-none absolute left-3">
              <Search size={14} aria-hidden="true" />
            </div>
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
              aria-controls={`${id}-listbox`}
              aria-label={tSearch("comboboxLabel", { label })}
              aria-autocomplete="list"
              aria-activedescendant={activeDescendant}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder={t("searchPlaceholder")}
              className={cn(
                "border-border bg-bg-card min-h-[46px] w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm shadow-sm transition-all outline-none",
                "text-text-primary placeholder:text-text-muted",
                "focus:border-brand"
              )}
            />
          </div>

          {showSuggestions && (
            <ul
              ref={listboxRef}
              id={`${id}-listbox`}
              role="listbox"
              aria-label={t("suggestions", { label })}
              className="listbox-scroll border-border-strong bg-bg-card absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-x-hidden overflow-y-auto rounded-xl border pr-1 shadow-lg"
            >
              {suggestions.map((s, index) => (
                <li
                  key={s.id}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(s);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    index === activeIndex
                      ? "bg-brand-light text-brand"
                      : "text-text-primary hover:bg-bg-muted"
                  )}
                >
                  <span className="text-text-muted text-xs">{formatDexNumber(s.id)}</span>
                  <span className="capitalize">{capitalize(s.name)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
