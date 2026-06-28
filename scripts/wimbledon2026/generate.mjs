/**
 * Generate src/lib/data/wimbledon2026.ts from the curated inputs in this folder.
 *
 * Inputs (this folder):
 *   draw-atp.json / draw-wta.json — official main draws, one entry per line as
 *       "Display Surname|SEED"  (SEED = 1..32, "Q", "WC", or omitted for unseeded).
 *       Order is draw order; only the player set + seeds matter, not bracket position.
 *   overrides.json — manual name resolutions + live-ranking name aliases.
 *   idmap.json     — RapidAPI player-id snapshot (refresh with build-idmap.mjs).
 *
 * Inputs (repo data/, gitignored):
 *   data/rankings-atp-2026-06-26.txt / rankings-wta-2026-06-26.txt — live-tennis.eu
 *       copy-paste dumps. Used for the DISPLAY ranking only. Missing players show "—".
 *
 * Usage:  node scripts/wimbledon2026/generate.mjs
 * Then:   npx prettier --write src/lib/data/wimbledon2026.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');
const RANKING_DATE = '2026-06-26';

const norm = s =>
	s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-'.]/g, ' ').replace(/\s+/g, ' ').trim();
const titleCase = s => s.split(' ').map(w => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
const load = f => JSON.parse(readFileSync(join(here, f), 'utf8'));

const idmap = load('idmap.json');
const overrides = load('overrides.json');

/** Parse a live-tennis.eu ranking dump into [{ norm, name, liveRank }]. */
function parseRankings(path) {
	if (!existsSync(path)) return [];
	const out = [];
	let pendingRank = null;
	for (const raw of readFileSync(path, 'utf8').split('\n')) {
		const cells = raw.split('\t').map(c => c.trim());
		const nonEmpty = cells.filter(Boolean);
		if (nonEmpty.length === 0) continue;
		if (/^\d+$/.test(nonEmpty[0]) && nonEmpty.length <= 3 && !/[a-zA-Z]{3,}/.test(nonEmpty.join(' ').replace(/CH|NCH/g, ''))) {
			pendingRank = Number(nonEmpty[0]);
			continue;
		}
		const name = nonEmpty[0];
		const country = nonEmpty.find(c => /^[A-Z]{3}$/.test(c));
		if (/[A-Za-zÀ-ſ]/.test(name) && /\s/.test(name) && country && pendingRank != null) {
			out.push({ norm: norm(name), name, liveRank: pendingRank });
			pendingRank = null;
		}
	}
	return out;
}

/** Resolve each draw entry to { apiId, apiName, seed, country } via idmap + overrides. */
function resolveDraw(tour) {
	const draw = load(`draw-${tour}.json`);
	const map = idmap[tour];
	const all = Object.entries(map).map(([apiName, info]) => ({ apiName, toks: norm(apiName).split(' '), ...info }));
	const out = [];
	const issues = [];
	for (let i = 0; i < draw.length; i++) {
		const [namePart, tag] = draw[i].split('|');
		const seed = /^\d+$/.test(tag) ? Number(tag) : null;
		let apiName = overrides[tour][String(i + 1)];
		if (!apiName) {
			if (tour === 'atp') {
				const dt = norm(namePart).split(' ');
				const last = dt[dt.length - 1];
				const c = all.filter(e => dt.every(t => e.toks.includes(t)) && e.toks[e.toks.length - 1] === last);
				if (c.length === 1) apiName = c[0].apiName;
			} else {
				const m = namePart.match(/^([A-Z])\.\s+(.+)$/);
				const initial = m ? norm(m[1]) : '';
				const surToks = norm(m ? m[2] : namePart).split(' ');
				const last = surToks[surToks.length - 1];
				const c = all.filter(
					e => surToks.every(t => e.toks.includes(t)) && e.toks[e.toks.length - 1] === last && e.toks[0][0] === initial
				);
				if (c.length === 1) apiName = c[0].apiName;
			}
		}
		if (!apiName || !map[apiName]) {
			issues.push(`pos ${i + 1} "${draw[i]}" — ${apiName ? 'no id for ' + apiName : 'unresolved; add to overrides.json'}`);
			continue;
		}
		out.push({ apiId: String(map[apiName].id), apiName, seed, country: map[apiName].country });
	}
	return { out, issues };
}

/** Attach the display name + live ranking; fall back to title-cased API name. */
function attachRanks(players, tour) {
	const ranks = parseRankings(join(repoRoot, 'data', `rankings-${tour}-${RANKING_DATE}.txt`));
	const byNorm = new Map(ranks.map(r => [r.norm, r]));
	// Fallback index by first-initial + last surname token, for API spellings that
	// differ from the ranking dump (e.g. API "Cori Gauff" vs live-tennis "Coco Gauff").
	const bySur = new Map();
	for (const r of ranks) {
		const t = r.norm.split(' ');
		const k = t[0][0] + '|' + t[t.length - 1];
		if (!bySur.has(k)) bySur.set(k, []);
		bySur.get(k).push(r);
	}
	const alias = overrides.rankAlias ?? {};
	let ranked = 0;
	for (const p of players) {
		let r = byNorm.get(alias[p.apiName] ?? norm(p.apiName));
		if (!r) {
			const t = norm(p.apiName).split(' ');
			const cand = bySur.get(t[0][0] + '|' + t[t.length - 1]) ?? [];
			if (cand.length === 1) r = cand[0];
		}
		if (r) {
			p.name = r.name;
			p.currentRanking = r.liveRank;
			ranked++;
		} else {
			p.name = titleCase(p.apiName);
			p.currentRanking = null;
		}
	}
	return ranked;
}

const data = {};
let hadIssues = false;
for (const tour of ['atp', 'wta']) {
	const { out, issues } = resolveDraw(tour);
	const ranked = attachRanks(out, tour);
	// First-round opponents: the official draw is in bracket order, so adjacent
	// entries (0-1, 2-3, …) meet in round 1. DISPLAY ONLY — never used in rules.
	for (let i = 0; i < out.length; i++) {
		out[i].firstRoundOpponent = out[i ^ 1]?.name ?? null;
	}
	const seeds = out.map(p => p.seed).filter(s => s != null).sort((a, b) => a - b);
	const seedsOk = seeds.length === 32 && seeds.every((s, i) => s === i + 1);
	const ids = out.map(p => p.apiId);
	console.log(
		`${tour.toUpperCase()}: ${out.length} players | ids unique: ${new Set(ids).size === out.length} | ` +
			`seeds 1-32 complete: ${seedsOk} | ranked: ${ranked}/${out.length}`
	);
	if (issues.length) {
		hadIssues = true;
		console.log('  ISSUES:\n   ' + issues.join('\n   '));
	}
	data[tour] = out;
}
if (hadIssues) {
	console.error('\nUnresolved entries above — fix overrides.json (or refresh idmap.json) before committing.');
	process.exit(1);
}

const esc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const arr = list =>
	list
		.map(
			p =>
				`\t{ apiId: '${p.apiId}', name: '${esc(p.name)}', seed: ${p.seed ?? 'null'}, country: '${esc(p.country)}', currentRanking: ${p.currentRanking ?? 'null'}, firstRoundOpponent: '${esc(p.firstRoundOpponent)}' }`
		)
		.join(',\n');

const ts = `/**
 * Wimbledon 2026 static main draws (gentlemen's + ladies' singles).
 *
 * Seeds + entrants are sourced from the official draws (ATP via tennisexplorer.com,
 * WTA via wtatennis.com) so seeds are authoritative and never derived from live ranking.
 * \`currentRanking\` is the live ATP/WTA ranking going into the tournament (live-tennis.eu,
 * captured ${RANKING_DATE}) and is DISPLAY ONLY — never used in draft eligibility rules.
 * \`apiId\` is the RapidAPI (tennis-api-atp-wta-itf) player id, so drafted picks match
 * synced match results for scoring.
 *
 * GENERATED FILE — regenerate via scripts/wimbledon2026/generate.mjs, do not edit by hand.
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

export const WIMBLEDON_2026_ATP: StaticDrawEntry[] = [
${arr(data.atp)}
];

export const WIMBLEDON_2026_WTA: StaticDrawEntry[] = [
${arr(data.wta)}
];

const STATIC_DRAWS: Record<string, { tour: 'atp' | 'wta'; entries: StaticDrawEntry[] }> = {
	'wimbledon-2026-atp': { tour: 'atp', entries: WIMBLEDON_2026_ATP },
	'wimbledon-2026-wta': { tour: 'wta', entries: WIMBLEDON_2026_WTA }
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
 * Return the committed static draw for a tournament id (e.g. 'wimbledon-2026-atp'),
 * or null if there is no static draw for it (fall back to the API draw).
 */
export function getStaticDraw(tournamentId: string): TennisPlayer[] | null {
	const draw = STATIC_DRAWS[tournamentId];
	if (!draw) return null;
	return toTennisPlayers(draw.entries, draw.tour, tournamentId);
}

const FIRST_ROUND_OPPONENTS: Record<string, string> = Object.fromEntries(
	[...WIMBLEDON_2026_ATP, ...WIMBLEDON_2026_WTA].map((e) => [e.apiId, e.firstRoundOpponent])
);

/**
 * Round-1 opponent display name for a player (keyed by RapidAPI/apiId), or null when
 * the player isn't part of a static draw. DISPLAY ONLY — never used in draft rules.
 */
export function getFirstRoundOpponent(playerId: string): string | null {
	return FIRST_ROUND_OPPONENTS[playerId] ?? null;
}
`;
writeFileSync(join(repoRoot, 'src', 'lib', 'data', 'wimbledon2026.ts'), ts);
console.log('\nwrote src/lib/data/wimbledon2026.ts');
