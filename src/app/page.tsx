import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";

/**
 * Root path "/" has no content; all pages live under /[locale].
 * Redirect to the best locale inferred from Accept-Language.
 */
export default async function RootPage() {
  const acceptLanguage = (await headers()).get("accept-language");

  if (!acceptLanguage) {
    redirect(`/${routing.defaultLocale}`);
  }

  const weighted = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tagPart, qPart] = entry.trim().split(";q=");
      const tag = tagPart.toLowerCase();
      const quality = qPart ? Number.parseFloat(qPart) : 1;
      return { tag, quality: Number.isNaN(quality) ? 0 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  const match = weighted.find(({ tag }) => tag.startsWith("es") || tag.startsWith("en"));
  const locale = match?.tag.startsWith("es") ? "es" : "en";

  redirect(`/${locale}`);
}
