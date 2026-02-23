import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const load = (ns: string) => import(`../../messages/${locale}/${ns}.json`).then((m) => m.default);

  const [common, navigation, pokemon, pages, errors] = await Promise.all([
    load("common"),
    load("navigation"),
    load("pokemon"),
    load("pages"),
    load("errors"),
  ]);

  return {
    locale,
    messages: { common, navigation, pokemon, pages, errors },
  };
});
