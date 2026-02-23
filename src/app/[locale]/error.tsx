"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errors.generic");

  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertCircle size={48} className="text-brand" aria-hidden="true" />
      <div>
        <h2 className="text-text-primary mb-2 text-2xl font-bold">{t("title")}</h2>
        <p className="text-text-secondary">{error.message ?? t("message")}</p>
      </div>
      <Button variant="primary" onClick={reset}>
        <RefreshCw size={16} aria-hidden="true" />
        {t("retry")}
      </Button>
    </div>
  );
}
