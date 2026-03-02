# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Code quality
npm run lint         # Prettier check + ESLint
npm run format       # Auto-format all files
npm run check        # SvelteKit sync + svelte-check (type checking)
npm run check:watch  # Watch mode type checking

# Testing
npm test             # Run all tests (CI mode)
npm run test:unit    # Run tests in watch mode

# Run a single test file
npx vitest run src/path/to/file.spec.ts
```

## Architecture

**SvelteKit + Svelte 5** app for managing a snake-draft of tennis players among participants. Three phases: Setup → Draft → Results.

### State Management

All application state lives in `src/lib/stores/draftStore.ts` as Svelte writeable stores. SQLite is the source of truth; the store is hydrated from the DB on every page load via `+layout.server.ts`. The store exports:
- `participants` — Array of draft participants (name, team, emoji icon, picks[])
- `draftState` — Current round (1-6), pick index, snake order, status (`'setup' | 'draft' | 'results'`)
- `availablePlayers` / `draftedPlayers` — Derived from participants + full player list
- Actions: `addParticipant`, `makePick`, `startDraft`, `resetDraft`, `shuffleParticipants`
- `initFromServer(participants, state, draftedMap)` — hydrates stores from SSR data

### Data Flow

```
+layout.server.ts (reads SQLite) → layout data prop → initFromServer() → store reactivity
Store action → optimistic store update + fire-and-forget fetch → API route writes SQLite
```

Pages are thin; business logic belongs in the store. Snake-draft order is managed via `snakeOrder` (participant IDs), reversing direction each round.

### Routing

- `/` redirects to `/setup`
- `/setup` — Add/remove participants, shuffle draft order
- `/draft` — Active draft board with `DraftTimer.svelte` (3-min countdown)
- `/results` — Final rosters with point totals

`+layout.svelte` provides the sidebar navigation shared across all routes.

### Key Files

- `src/lib/stores/draftStore.ts` — Central state; all draft logic
- `src/lib/data/players.ts` — Static tennis player data (seed, ranking, country, image URL, points)
- `src/lib/types.ts` — `Participant`, `TennisPlayer`, `DraftState` interfaces
- `src/lib/server/db.ts` — SQLite connection singleton (better-sqlite3); schema init on startup
- `src/lib/server/draftQueries.ts` — All typed DB query functions
- `src/lib/components/ui/` — shadcn-svelte UI primitives (Button, Card, Badge, Avatar, etc.)

### Styling

TailwindCSS v4 with oklch color system. UI components come from **shadcn-svelte** (built on **bits-ui** headless primitives). Prettier uses **tabs** for indentation and single quotes.

### Testing

Vitest with dual project config (in `vite.config.ts`):
- **Browser project** (Playwright/Chromium): `*.svelte.{test,spec}.{ts,js}` files
- **Server project** (Node): all other `*.{test,spec}.{ts,js}` files
