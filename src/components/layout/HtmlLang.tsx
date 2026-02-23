"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/**
 * Sets document.documentElement.lang to the active locale after hydration.
 * Needed because the root layout (which owns <html>) can't access [locale] params.
 */
export function HtmlLang() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
