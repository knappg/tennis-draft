/**
 * Refresh idmap.json — a snapshot of RapidAPI (tennis-api-atp-wta-itf) player ids,
 * keyed by lowercased player name. Built from the singles rankings (pages 1–10) plus
 * any players already seen in the Wimbledon results/qualifying feed.
 *
 * idmap.json is committed so generate.mjs runs offline; re-run this only when you need
 * ids for players not in the current snapshot (e.g. new qualifiers/wildcards).
 *
 * Usage:  node scripts/wimbledon2026/build-idmap.mjs
 * Requires RAPIDAPI_KEY in the repo-root .env (same key the app uses).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');

const env = readFileSync(join(repoRoot, '.env'), 'utf8');
const key = (env.match(/RAPIDAPI_KEY=("?)([^"\n]+)\1/) || [])[2];
if (!key) throw new Error('RAPIDAPI_KEY not found in .env');

const BASE = 'https://tennis-api-atp-wta-itf.p.rapidapi.com';
const HEADERS = { 'x-rapidapi-host': 'tennis-api-atp-wta-itf.p.rapidapi.com', 'x-rapidapi-key': key };
const get = async path => (await fetch(BASE + path, { headers: HEADERS })).json().catch(() => null);

// RapidAPI Wimbledon season ids (see TOURNAMENT_CATALOG in src/lib/data/tournaments.ts)
const WIMBLEDON = { atp: 21337, wta: 16733 };

const idmap = {};
for (const tour of ['atp', 'wta']) {
	const map = {};
	for (const pg of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
		const body = await get(`/tennis/v2/${tour}/ranking/singles/?pageNo=${pg}&pageSize=64`);
		for (const e of body?.data ?? []) {
			const nm = e.player?.name;
			if (nm) map[nm.toLowerCase()] = { id: e.player.id, country: e.player.countryAcr ?? '', apiRank: e.position };
		}
	}
	const res = await get(`/tennis/v2/${tour}/tournament/results/${WIMBLEDON[tour]}`);
	for (const bucket of ['singles', 'qualifying', 'doubles']) {
		for (const m of res?.data?.[bucket] ?? []) {
			for (const p of [m.player1, m.player2]) {
				if (p?.name && !map[p.name.toLowerCase()]) {
					map[p.name.toLowerCase()] = { id: p.id, country: p.countryAcr ?? '', apiRank: null };
				}
			}
		}
	}
	idmap[tour] = map;
	console.log(`${tour}: ${Object.keys(map).length} names`);
}

writeFileSync(join(here, 'idmap.json'), JSON.stringify(idmap, null, 1));
console.log('wrote idmap.json');
