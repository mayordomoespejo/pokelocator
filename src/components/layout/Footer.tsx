"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common.footer");

  return (
    <footer className="border-border bg-bg-primary mt-auto border-t py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-text-muted flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p>{t("built")}</p>
          <p>{t("data")}</p>
        </div>
      </div>
    </footer>
  );
}
