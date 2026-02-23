# ⚡ PokéLocator

A professional, portfolio-quality Pokémon search and explorer app built with Next.js, TypeScript, TanStack Query, and Framer Motion.

![PokéLocator Preview](public/screenshots/home.png)

## Features

### MVP

- **Pokédex Grid** — Browse all ~1,300+ Pokémon with infinite scroll
- **Search** — Debounced search with suggestions dropdown (keyboard accessible)
- **Type Filter** — Filter by any Pokémon type with animated chips
- **Detail Page** — Full Pokémon profile: sprite, types, stats, moves, evolution chain, species info
- **Favorites** — Save Pokémon to favorites (persisted in localStorage)
- **Dark Mode** — System-preference aware, manually togglable, no flash

### Extras

- **Compare** — Side-by-side stat comparison for any two Pokémon
- **Animations** — Framer Motion: page transitions, grid stagger, card hover, floating sprites, animated stat bars
- **Skeleton Loaders** — Every loading state uses shimmer skeletons (not spinners)
- **SEO** — Per-page metadata with OpenGraph tags
- **PWA** — Web manifest for installability
- **Accessibility** — ARIA labels, keyboard navigation, focus-visible rings, semantic HTML

## Stack

| Layer         | Tech                                         |
| ------------- | -------------------------------------------- |
| Framework     | Next.js 16 (App Router) + TypeScript 5       |
| Styles        | Tailwind CSS v4 (CSS token design system)    |
| Data Fetching | TanStack Query v5 (infinite scroll, caching) |
| Animations    | Framer Motion v12                            |
| State         | Zustand v5 (favorites, compare)              |
| Theme         | next-themes                                  |
| Icons         | Lucide React                                 |
| Testing       | Vitest + Testing Library + Playwright        |
| Quality       | ESLint 9 + Prettier + Husky + lint-staged    |
| Deploy        | Vercel                                       |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run lint:fix     # ESLint fix
npm run format       # Prettier format all files
npm run format:check # Prettier check (used in CI)
npm run test         # Vitest watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Vitest with coverage report
npm run test:e2e     # Playwright e2e tests
npm run test:e2e:ui  # Playwright interactive UI
```

## Architecture

```
src/
├── app/           # Next.js App Router pages + layouts
├── components/    # Reusable UI (ui/ + layout/ + pokemon/)
├── features/      # Domain features (favorites, search)
├── hooks/         # Custom React hooks
├── lib/
│   ├── api/       # PokéAPI client + query keys
│   ├── store/     # Zustand stores (favorites, compare)
│   └── utils/     # cn(), formatters, normalizers
└── types/         # TypeScript types (API shapes + internal models)
```

### API Layer Strategy

All PokéAPI responses are transformed into typed internal models before reaching the UI. This decouples the UI from PokéAPI's response shapes.

- **List page**: Fetches `/pokemon?limit=24&offset=N`, then batch-fetches all 24 details in parallel with `Promise.allSettled` (individual failures don't crash the page).
- **Search**: Fetches all ~1,300 Pokémon names once (`staleTime: Infinity`), then filters client-side with a 300ms debounce.
- **Type filter**: Fetches the full Pokémon list for a type via `/type/{name}` — bypasses infinite scroll and uses a regular `useQuery`.

### Caching Strategy

- Global: `staleTime: 5min`, `gcTime: 10min`
- All-names query: `staleTime: Infinity` (Pokémon names never change)
- Next.js fetch cache: `revalidate: 86400` (24h, server-side)

## Technical Decisions & Trade-offs

**Tailwind CSS v4** — Uses the new `@theme` API and CSS variable token system. No `tailwind.config.js` needed. Design tokens defined in `:root` and `.dark`, mapped to utility classes via `@theme inline`.

**Client-side search** — PokéAPI has no fuzzy search API. Fetching all ~50KB of names once and filtering in-memory is faster and cheaper than round-tripping for every keystroke.

**Type filtering with `useQuery`** — When a type filter is active, PokéAPI returns a full list (not paginated), so `useInfiniteQuery` is replaced with a regular `useQuery`.

**Zustand over Context** — Avoids prop drilling for favorites/compare state without the boilerplate of Redux. Persist middleware handles localStorage serialization automatically.

**`Promise.allSettled` for batch fetching** — Individual Pokémon fetch failures are swallowed; the rest of the page still renders. This is important because PokéAPI occasionally returns 404 for specific forms.

## Quality Checklist

- [x] Zero TypeScript errors (`strict: true`)
- [x] Zero `any` types in application code
- [x] ESLint passes
- [x] Prettier formatting enforced via pre-commit hooks
- [x] Skeleton loaders for all loading states
- [x] Error boundaries with retry UI
- [x] Empty states for all data-less views
- [x] Keyboard navigation (search dropdown, type filter, nav)
- [x] ARIA labels on all interactive elements
- [x] `focus-visible` ring on all focusable elements
- [x] Responsive: 2-col mobile → 6-col desktop
- [x] Dark mode with no flash on load
- [x] Unit tests for all utils and hooks
- [x] Integration tests for key components
- [x] E2E tests for core user flows
- [x] CI with GitHub Actions

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on every push.

## Data Attribution

Pokémon data provided by [PokéAPI](https://pokeapi.co) — free and open.
Pokémon © Nintendo / Creatures Inc. / GAME FREAK inc.

---

Built with Next.js, TypeScript, TanStack Query, Framer Motion, Tailwind CSS, and Zustand.
