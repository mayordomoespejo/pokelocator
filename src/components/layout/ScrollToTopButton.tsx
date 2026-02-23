"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const SHOW_AFTER_SCROLL_Y = 500;

export function ScrollToTopButton() {
  const t = useTranslations("common.scrollTop");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Button
      variant="icon"
      size="lg"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("label")}
      title={t("label")}
      className={cn(
        "border-border-strong bg-bg-card fixed right-6 bottom-6 z-40 border shadow-lg",
        "transition-all duration-200",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ChevronUp size={20} aria-hidden="true" />
    </Button>
  );
}
