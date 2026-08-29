/**
 * Generate src/lib/data/usopen2026.ts — the committed static main draws for the
 * `usopen-2026-atp` / `usopen-2026-wta` tournaments.
 *
 * Unlike the Wimbledon toolkit (which curates the draw from official-website scrapes and
 * resolves names to ids by hand), the US Open draw is pulled directly from the same
 * RapidAPI feed the app scores from, via the pre-tournament fixtures endpoint:
 *
 *   GET /tennis/v2/{tour}/fixtures/tournament/{seasonId}?pageSize=100
 *
 * That returns all 64 first-round (R128) fixtures, each carrying the native player ids
 * (identical to the ids used when results are synced), the official seeds (seed1/seed2,
 * where "1".."32" are seeds and "WC"/"q"/"LL"/null are unseeded), and both players'
 * names + countries. So there is no id map, no name resolution, and no manual draw file —
 * the API is the single source of truth. Display rankings come from the same feed's
 * singles ranking pages (position → currentRanking), captured RANKING_DATE.
 *
 * Usage:  node scripts/usopen2026/generate.mjs
 * Then:   npx prettier --write src/lib/data/usopen2026.ts
 *
 * Requires RAPIDAPI_KEY in the repo-root .env (same key the app uses). Validates as it
 * runs (128 players/tour, unique ids, seeds 1–32 complete) and exits non-zero on failure.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');
const RANKING_DATE = '2026-08-29';

// RapidAPI US Open 2026 season ids (see TOURNAMENT_CATALOG in src/lib/data/tournaments.ts)
const USOPEN = { atp: 21349, wta: 16743 };

const env = readFileSync(join(repoRoot, '.env'), 'utf8');
const key = (env.match(/RAPIDAPI_KEY=("?)([^"\n]+)\1/) || [])[2];
if (!key) throw new Error('RAPIDAPI_KEY not found in .env');

const BASE = 'https://tennis-api-atp-wta-itf.p.rapidapi.com';
const HEADERS = {
	'x-rapidapi-host': 'tennis-api-atp-wta-itf.p.rapidapi.com',
	'x-rapidapi-key': key
};
async function get(path) {
	const r = await fetch(BASE + path, { headers: HEADERS });
	if (!r.ok) throw new Error(`RapidAPI ${r.status} for ${path}: ${(await r.text()).slice(0, 200)}`);
	return r.json();
}

/** Map player id → live singles ranking position (display only). */
async function fetchRankMap(tour) {
	const map = new Map();
	for (const pg of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
		const body = await get(`/tennis/v2/${tour}/ranking/singles/?pageNo=${pg}&pageSize=64`);
		for (const e of body?.data ?? []) {
			if (e.player?.id != null && !map.has(e.player.id)) map.set(e.player.id, e.position);
		}
	}
	return map;
}

/** Build the 128-entry draw for one tour from the R128 fixtures, in bracket order. */
async function buildDraw(tour) {
	const body = await get(
		`/tennis/v2/${tour}/fixtures/tournament/${USOPEN[tour]}?pageNo=1&pageSize=100`
	);
	const fixtures = (body?.data ?? []).filter((m) => m.roundId === 4);
	const rankMap = await fetchRankMap(tour);

	const numericSeed = (s) => (s != null && /^\d+$/.test(String(s)) ? Number(s) : null);
	const entries = [];
	for (const m of fixtures) {
		const p1 = {
			apiId: String(m.player1Id),
			name: m.player1.name,
			seed: numericSeed(m.seed1),
			country: m.player1.countryAcr ?? '',
			currentRanking: rankMap.get(m.player1Id) ?? null,
			firstRoundOpponent: m.player2.name
		};
		const p2 = {
			apiId: String(m.player2Id),
			name: m.player2.name,
			seed: numericSeed(m.seed2),
			country: m.player2.countryAcr ?? '',
			currentRanking: rankMap.get(m.player2Id) ?? null,
			firstRoundOpponent: m.player1.name
		};
		entries.push(p1, p2);
	}
	return entries;
}

function validate(tour, entries) {
	const issues = [];
	if (entries.length !== 128) issues.push(`expected 128 entrants, got ${entries.length}`);
	const ids = entries.map((e) => e.apiId);
	if (new Set(ids).size !== ids.length) issues.push('duplicate player ids');
	if (entries.some((e) => !e.apiId || !e.name || !e.country))
		issues.push('entrant missing id/name/country');
	const seeds = entries
		.map((e) => e.seed)
		.filter((s) => s != null)
		.sort((a, b) => a - b);
	const seedsOk = seeds.length === 32 && seeds.every((s, i) => s === i + 1);
	if (!seedsOk) issues.push(`seeds not a complete 1–32 set (${seeds.length} seeds)`);
	const ranked = entries.filter((e) => e.currentRanking != null).length;
	console.log(
		`${tour.toUpperCase()}: ${entries.length} players | ids unique: ${new Set(ids).size === ids.length} | ` +
			`seeds 1-32 complete: ${seedsOk} | ranked: ${ranked}/${entries.length}`
	);
	return issues;
}

const data = {};
let hadIssues = false;
for (const tour of ['atp', 'wta']) {
	const entries = await buildDraw(tour);
	const issues = validate(tour, entries);
	if (issues.length) {
		hadIssues = true;
		console.log('  ISSUES:\n   ' + issues.join('\n   '));
	}
	data[tour] = entries;
}
if (hadIssues) {
	console.error('\nValidation failed above — the API draw may be incomplete. Do not commit.');
	process.exit(1);
}

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const arr = (list) =>
	list
		.map(
			(p) =>
				`\t{ apiId: '${p.apiId}', name: '${esc(p.name)}', seed: ${p.seed ?? 'null'}, country: '${esc(p.country)}', currentRanking: ${p.currentRanking ?? 'null'}, firstRoundOpponent: '${esc(p.firstRoundOpponent)}' }`
		)
		.join(',\n');

const ts = `/**
 * US Open 2026 static main draws (men's + women's singles).
 *
 * Entrants, seeds, bracket pairings, ids, and countries are pulled directly from the
 * RapidAPI (tennis-api-atp-wta-itf) pre-tournament fixtures feed — the same API and the
 * same player ids the app uses to sync results and score picks — so drafted picks always
 * line up with synced results. Seeds are the official draw seeds (never derived from live
 * ranking). \`currentRanking\` is the live ATP/WTA ranking entering the tournament
 * (captured ${RANKING_DATE}) and is DISPLAY ONLY — never used in draft eligibility rules.
 *
 * GENERATED FILE — regenerate via scripts/usopen2026/generate.mjs, do not edit by hand.
 */
import type { TennisPlayer } from '$lib/types';
import { getPlayerImageUrl, lookupAtpPlayerId } from '$lib/data/atpPlayerIds';

export interface StaticDrawEntry {
	apiId: string;
	name: string;
	seed: number | null;
	country: string;
	currentRanking: number | null;
	/** Round-1 opponent's display name (from the official draw's bracket order). DISPLAY ONLY. */
	firstRoundOpponent: string;
}

export const USOPEN_2026_ATP: StaticDrawEntry[] = [
${arr(data.atp)}
];

export const USOPEN_2026_WTA: StaticDrawEntry[] = [
${arr(data.wta)}
];

const STATIC_DRAWS: Record<string, { tour: 'atp' | 'wta'; entries: StaticDrawEntry[] }> = {
	'usopen-2026-atp': { tour: 'atp', entries: USOPEN_2026_ATP },
	'usopen-2026-wta': { tour: 'wta', entries: USOPEN_2026_WTA }
};

function toTennisPlayers(
	entries: StaticDrawEntry[],
	tour: 'atp' | 'wta',
	tournamentId: string
): TennisPlayer[] {
	return entries.map(e => {
		const atpPlayerId = tour === 'atp' ? lookupAtpPlayerId(e.name) : undefined;
		return {
			id: e.apiId,
			name: e.name,
			seed: e.seed,
			currentRanking: e.currentRanking,
			country: e.country,
			image: getPlayerImageUrl(e.name, tour, atpPlayerId),
			tour,
			atpPlayerId,
			apiId: e.apiId,
			tournamentId
		};
	});
}

/**
 * Return the committed static draw for a tournament id (e.g. 'usopen-2026-atp'),
 * or null if there is no US Open static draw for it.
 */
export function getStaticDraw(tournamentId: string): TennisPlayer[] | null {
	const draw = STATIC_DRAWS[tournamentId];
	if (!draw) return null;
	return toTennisPlayers(draw.entries, draw.tour, tournamentId);
}

const FIRST_ROUND_OPPONENTS: Record<string, string> = Object.fromEntries(
	[...USOPEN_2026_ATP, ...USOPEN_2026_WTA].map((e) => [e.apiId, e.firstRoundOpponent])
);

/**
 * Round-1 opponent display name for a player (keyed by RapidAPI/apiId), or null when
 * the player isn't part of a US Open static draw. DISPLAY ONLY — never used in draft rules.
 */
export function getFirstRoundOpponent(playerId: string): string | null {
	return FIRST_ROUND_OPPONENTS[playerId] ?? null;
}
`;
writeFileSync(join(repoRoot, 'src', 'lib', 'data', 'usopen2026.ts'), ts);
console.log('\nwrote src/lib/data/usopen2026.ts');
