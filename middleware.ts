import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function detectLocale(acceptLanguage: string | null): (typeof routing.locales)[number] {
  if (!acceptLanguage) {
    return routing.defaultLocale;
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

  for (const { tag } of weighted) {
    if (tag.startsWith("es")) {
      return "es";
    }
    if (tag.startsWith("en")) {
      return "en";
    }
  }

  return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const locale = detectLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
