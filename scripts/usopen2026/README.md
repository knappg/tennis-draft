# US Open 2026 draw toolkit

Regenerates `src/lib/data/usopen2026.ts` — the committed static draw used for the
`usopen-2026-atp` / `usopen-2026-wta` tournaments. The app reads only the generated `.ts`;
this script exists so you can rebuild it when the draw changes (withdrawals,
qualifier/lucky-loser swaps, a fresh ranking snapshot).

Why static: draft eligibility depends on a player's **seed**, and seeds can diverge from
live ranking (withdrawals shift the seed list; qualifiers/wildcards aren't top-ranked). We
commit the authoritative draw rather than deriving it from live ranking.

## How this differs from the Wimbledon toolkit

Wimbledon curated the draw from official-website scrapes and resolved names → RapidAPI ids
by hand (`draw-*.json`, `idmap.json`, `overrides.json`). The US Open draw is instead pulled
**directly from the same RapidAPI feed the app scores from**, so there is nothing to hand-
curate:

```
GET /tennis/v2/{tour}/fixtures/tournament/{seasonId}?pageSize=100
```

returns all 64 first-round (R128) fixtures, each carrying:

- native player ids (identical to the ids used when results sync — picks always line up),
- official seeds (`seed1`/`seed2`, where `"1"`..`"32"` are seeds and `"WC"`/`"q"`/`"LL"`/
  `null` are unseeded),
- both players' names + country codes.

Flattening the fixtures in order gives the 128-entry bracket; adjacent entries are the
round-1 matchup, which drives the "Plays {X}" opponent tags (display only). Display
rankings come from the same feed's singles ranking pages (`position` → `currentRanking`).

Season ids live in `TOURNAMENT_CATALOG` (`src/lib/data/tournaments.ts`): ATP `21349`,
WTA `16743`.

## Files

| File           | What it is                                                                                                                           | Edit by hand? |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `generate.mjs` | Fetches the fixtures + rankings from RapidAPI and writes `src/lib/data/usopen2026.ts`. Needs `RAPIDAPI_KEY` in the repo-root `.env`. | No            |

## Regenerate

```bash
node scripts/usopen2026/generate.mjs
npx prettier --write src/lib/data/usopen2026.ts
```

`generate.mjs` validates as it runs (128 players/tour, unique ids, seeds 1–32 complete)
and **exits non-zero** if the API draw is incomplete — re-run once the draw is fully
published. Then commit `usopen2026.ts`.

## Wiring

`src/lib/data/staticDraws.ts` is the registry every caller goes through; `usopen2026.ts`
is registered there alongside `wimbledon2026.ts`. Nothing else needs touching to add a
future event — generate its data module and add one line to `staticDraws.ts`.

## Data provenance (2026-08-29)

- Draw (entrants, seeds, bracket order, ids, countries): RapidAPI `tennis-api-atp-wta-itf`
  pre-tournament fixtures feed — the same API the app syncs results from.
- Display rankings: RapidAPI singles ranking pages, captured 2026-08-29 (US Open main draw
  begins 2026-08-31).
