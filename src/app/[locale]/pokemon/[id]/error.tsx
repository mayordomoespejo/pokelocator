"use client";

import { useEffect } from "react";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DetailError({ error, reset }: ErrorProps) {
  const t = useTranslations("errors.generic");

  useEffect(() => {
    console.error("Detail page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertCircle size={40} className="text-brand" aria-hidden="true" />
      <div>
        <h2 className="text-text-primary mb-1 text-xl font-semibold">{t("title")}</h2>
        <p className="text-text-secondary text-sm">{error.message ?? t("message")}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="primary" onClick={reset}>
          {t("retry")}
        </Button>
        <Link href="/">
          <Button variant="secondary">
            <ChevronLeft size={16} />
            {t("back")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
