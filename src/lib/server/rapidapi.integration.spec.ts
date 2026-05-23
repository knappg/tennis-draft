/**
 * Integration tests for the RapidAPI Tennis API.
 *
 * These validate that our API key works and the response shapes match
 * what rapidapiClient.ts expects. Skipped when RAPIDAPI_KEY is not set.
 *
 * Budget: ~2 API calls per test run (out of 500/month).
 *   1. GET /tennis/v2/atp/ranking/singles (1 call)
 *   2. GET /tennis/v2/atp/tournament/results/{id} (1 call)
 *
 * Run with: npx vitest run src/lib/server/rapidapi.integration.spec.ts
 */
import { describe, it, expect } from 'vitest';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');
const RAPIDAPI_KEY = env.RAPIDAPI_KEY;
const BASE_URL = 'https://tennis-api-atp-wta-itf.p.rapidapi.com';

// Australian Open 2026 ATP — a completed tournament with known results
const AO_ATP_API_ID = '21305';

function headers() {
	return {
		'x-rapidapi-host': 'tennis-api-atp-wta-itf.p.rapidapi.com',
		'x-rapidapi-key': RAPIDAPI_KEY!
	};
}

describe.skipIf(!RAPIDAPI_KEY)('RapidAPI Tennis Integration', () => {
	// ── Singles Rankings ────────────────────────────────────────────────
	// This is the endpoint used by fetchRankingsDraw() in rapidapiClient.ts.
	// We fetch page 1 only (1 API call) and validate the shape.
	it('GET /ranking/singles returns expected shape', async () => {
		const resp = await fetch(
			`${BASE_URL}/tennis/v2/atp/ranking/singles/?pageNo=1&pageSize=10`,
			{ headers: headers() }
		);

		expect(resp.ok, `API returned ${resp.status}`).toBe(true);

		const json = (await resp.json()) as {
			data?: Array<{
				position: number;
				player: { id: number; name: string; countryAcr: string };
			}>;
		};

		// Top-level shape
		expect(json).toHaveProperty('data');
		expect(Array.isArray(json.data)).toBe(true);
		expect(json.data!.length).toBeGreaterThan(0);

		// Validate first entry matches the contract rapidapiClient.ts relies on
		const entry = json.data![0];
		expect(entry).toHaveProperty('position');
		expect(typeof entry.position).toBe('number');

		expect(entry).toHaveProperty('player');
		expect(typeof entry.player.id).toBe('number');
		expect(typeof entry.player.name).toBe('string');
		expect(entry.player.name.length).toBeGreaterThan(0);
		// countryAcr should be a 2-3 letter code
		expect(typeof entry.player.countryAcr).toBe('string');
	});

	// ── Tournament Results ─────────────────────────────────────────────
	// This is the endpoint used by fetchTournamentResults() in rapidapiClient.ts.
	// We fetch results for AO 2026 ATP (1 API call) and validate the shape.
	it('GET /tournament/results returns expected shape', async () => {
		const resp = await fetch(
			`${BASE_URL}/tennis/v2/atp/tournament/results/${AO_ATP_API_ID}`,
			{ headers: headers() }
		);

		expect(resp.ok, `API returned ${resp.status}`).toBe(true);

		const json = (await resp.json()) as {
			data?: {
				singles?: Array<{
					id: string;
					date: string | null;
					roundId: number;
					player1Id: number;
					player2Id: number;
					match_winner: number | null;
					result: string | null;
					player1: { id: number; name: string; countryAcr: string };
					player2: { id: number; name: string; countryAcr: string };
				}>;
			};
		};

		// Top-level shape
		expect(json).toHaveProperty('data');
		expect(json.data).toHaveProperty('singles');
		expect(Array.isArray(json.data!.singles)).toBe(true);

		const singles = json.data!.singles!;
		expect(singles.length).toBeGreaterThan(0);

		// Validate a completed match has the fields rapidapiClient.ts destructures
		const completedMatch = singles.find((m) => m.match_winner != null);
		expect(completedMatch, 'Should have at least one completed match').toBeDefined();

		const m = completedMatch!;
		expect(typeof m.id).toBe('string');
		expect(typeof m.roundId).toBe('number');
		expect(typeof m.player1Id).toBe('number');
		expect(typeof m.player2Id).toBe('number');
		expect(typeof m.match_winner).toBe('number');

		// Player sub-objects
		expect(typeof m.player1.id).toBe('number');
		expect(typeof m.player1.name).toBe('string');
		expect(typeof m.player2.id).toBe('number');
		expect(typeof m.player2.name).toBe('string');

		// roundId should be one of the values we map in normalizeRoundId
		const knownRoundIds = [4, 5, 6, 7, 9, 10, 12, 24];
		expect(knownRoundIds).toContain(m.roundId);
	});
});
