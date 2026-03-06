# Tennis Draft

A snake-draft app for drafting ATP/WTA tennis players among friends. Supports 5 tournaments (4 Grand Slams + Indian Wells), live match syncing via the SportDevs API, and win-based scoring.

## Environment Variables

All variables are read at server startup from the process environment (`.env` file in dev, PM2 ecosystem config in production).

| Variable | Required | Default | Description |
|---|---|---|---|
| `SYNC_PASSWORD` | **Yes** | — | Password required to trigger a live data sync from the UI. Set this to anything memorable; it gates the "Sync Now" button on the Setup and Results pages. |
| `SPORTDEVS_API_KEY` | For live data | — | RapidAPI key for the [SportDevs Tennis API](https://rapidapi.com/sportdevs/api/tennis-api-atp-wta-itf). Without this, tournament draws and match results cannot be fetched; the app still works with static/historical data. Free tier allows 300 requests/day. |
| `DATA_DIR` | No | `./data` | Directory where the SQLite database file is stored. Override in production to a persistent path (e.g. `/var/data/tennis-draft`). |
| `DB_FILENAME` | No | `tennis-draft.db` | Filename of the SQLite database within `DATA_DIR`. |

### Example `.env` (development)

```
SYNC_PASSWORD=changeme
SPORTDEVS_API_KEY=your_rapidapi_key_here
```

### Example PM2 ecosystem file (production)

```js
module.exports = {
  apps: [{
    name: 'tennis-draft',
    script: 'build/index.js',
    env: {
      NODE_ENV: 'production',
      DATA_DIR: '/var/data/tennis-draft',
      SYNC_PASSWORD: 'your-secret-password',
      SPORTDEVS_API_KEY: 'your_rapidapi_key_here'
    }
  }]
}
```

## Development

```sh
npm install
npm run dev
```

## Commands

```sh
npm run dev        # Start dev server
npm run build      # Production build (adapter-node)
npm run preview    # Preview production build
npm run check      # Type check (svelte-check)
npm run lint       # Prettier + ESLint check
npm run format     # Auto-format
npm test           # Run all tests
```

## Draft Rules

- **6 rounds** per draft, snake order
- Round 1: seed 1–10 (ATP)
- Rounds 2–3: seed 11–32 (ATP)
- Rounds 4–5: unseeded players (ATP)
- Round 6: any player from the WTA draw of the same tournament

**Scoring** (updated live via sync):
- 1 point per match win
- +1 bonus point for each unseeded pick (rounds 4–5) who wins 2 or more matches

## Database

SQLite via `better-sqlite3`. The file is auto-created on first startup at `DATA_DIR/DB_FILENAME`. Schema migrations run automatically; no manual steps needed.

```sh
# Inspect the database directly
sqlite3 ./data/tennis-draft.db
```
