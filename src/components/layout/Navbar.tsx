"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Heart, Swords, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";
import { useFavoritesStore } from "@/lib/store/favoritesStore";

export function Navbar() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const favorites = useFavoritesStore((s) => s.favorites);
  const hydrated = useFavoritesStore((s) => s.hydrated);

  const navLinks = [
    { href: "/" as const, labelKey: "pokedex" as const, icon: Home },
    { href: "/favorites" as const, labelKey: "favorites" as const, icon: Heart },
    { href: "/compare" as const, labelKey: "compare" as const, icon: Swords },
  ];

  useEffect(() => {
    // Intentional: setMounted after hydration to avoid SSR/client mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Only show count after client hydration to avoid SSR mismatch
  const favCount = mounted && hydrated ? favorites.length : 0;

  const isDark = resolvedTheme === "dark";

  return (
    <header className="border-border bg-bg-primary/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <nav
        aria-label={t("mainNav")}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label={t("homeLabel")}>
          <img src="/pokemon-logo.svg" alt="Pokémon" className="h-7 w-auto" aria-hidden="true" />
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-1 sm:flex" role="list">
          {navLinks.map(({ href, labelKey, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            const label = t(labelKey);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-light text-brand"
                      : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                  {href === "/favorites" && favCount > 0 && (
                    <span
                      className="bg-brand ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                      aria-label={t("favoritesCount", { count: favCount })}
                    >
                      {favCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Locale + theme */}
        {mounted && (
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="icon"
              size="md"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={isDark ? t("switchToLight") : t("switchToDark")}
              aria-pressed={isDark}
            >
              {isDark ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </Button>
          </div>
        )}

        {/* Mobile nav — bottom links */}
      </nav>

      {/* Mobile bottom nav */}
      <div
        className="border-border flex border-t sm:hidden"
        role="navigation"
        aria-label={t("mobileNav")}
      >
        {navLinks.map(({ href, labelKey, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors",
                isActive ? "text-brand" : "text-text-muted hover:text-text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {t(labelKey)}
              {href === "/favorites" && favCount > 0 && (
                <span className="bg-brand absolute top-1 right-1/4 flex h-3.5 min-w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white">
                  {favCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
