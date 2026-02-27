import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "es"] as const;
const defaultLocale = "en";

function getPathLocale(pathname: string): string | null {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return null;
}

function detectLocale(acceptLanguage: string | null): (typeof locales)[number] {
  if (!acceptLanguage) {
    return defaultLocale;
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

  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeInPath = getPathLocale(pathname);

  if (!localeInPath) {
    const locale = detectLocale(request.headers.get("accept-language"));
    const destination = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", localeInPath);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Do not run locale redirect for static assets or favicon (like dealwing/cinescope)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|favicon\\.svg|icon\\.svg|icon\\.png|apple-icon\\.png|_vercel|.*\\..*).*)",
  ],
};
