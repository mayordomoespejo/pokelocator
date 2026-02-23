"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="border-border bg-bg-secondary flex items-center gap-0.5 rounded-lg border p-0.5">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          disabled={isPending || l === locale}
          aria-pressed={l === locale}
          className={`cursor-pointer rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors disabled:cursor-default ${
            l === locale
              ? "bg-brand text-white shadow-sm"
              : "text-text-secondary hover:bg-brand-light/45 hover:text-brand"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
