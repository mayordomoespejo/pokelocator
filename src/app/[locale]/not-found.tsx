import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("pages.notFound");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl" aria-hidden="true">
        😵
      </div>
      <div>
        <h1 className="text-text-primary mb-2 text-4xl font-bold">{t("heading")}</h1>
        <h2 className="text-text-primary mb-1 text-xl font-semibold">{t("subheading")}</h2>
        <p className="text-text-secondary">{t("message")}</p>
      </div>
      <Link href="/">
        <Button variant="primary">
          <Home size={16} aria-hidden="true" />
          {t("button")}
        </Button>
      </Link>
    </div>
  );
}
