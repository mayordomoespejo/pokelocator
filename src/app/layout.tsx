import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PokéLocator",
    template: "%s | PokéLocator",
  },
  description:
    "Search, explore, and discover Pokémon. View stats, moves, evolution chains, and more.",
  keywords: ["pokemon", "pokedex", "pokémon", "stats", "moves", "evolution"],
  authors: [{ name: "PokéLocator" }],
  openGraph: {
    type: "website",
    siteName: "PokéLocator",
    title: "PokéLocator — Pokémon Explorer",
    description: "Search, explore, and discover Pokémon.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokéLocator",
    description: "Search, explore, and discover Pokémon.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const localeHeader = (await headers()).get("x-next-intl-locale");
  const locale =
    localeHeader && (routing.locales as readonly string[]).includes(localeHeader)
      ? localeHeader
      : routing.defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
