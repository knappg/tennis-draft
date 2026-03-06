import type { TennisPlayer, TournamentMatch, TournamentRound } from '$lib/types';
import { getPlayerImageUrl, lookupAtpPlayerId } from '$lib/data/atpPlayerIds';
import { env } from '$env/dynamic/private';

const BASE_URL = 'https://tennis-api-atp-wta-itf.p.rapidapi.com';

function getHeaders() {
	const key = env.RAPIDAPI_KEY;
	if (!key) throw new Error('RAPIDAPI_KEY environment variable is not set');
	return {
		'x-rapidapi-host': 'tennis-api-atp-wta-itf.p.rapidapi.com',
		'x-rapidapi-key': key
	};
}

async function apiFetch(path: string): Promise<unknown> {
	const resp = await fetch(`${BASE_URL}${path}`, { headers: getHeaders() });
	if (!resp.ok) {
		throw new Error(`RapidAPI error ${resp.status}: ${await resp.text()}`);
	}
	return resp.json();
}

/** Maps RapidAPI roundId integers to our internal TournamentRound codes. */
export function normalizeRoundId(roundId: number): TournamentRound {
	const map: Record<number, TournamentRound> = {
		4: 'R128', // First round
		5: 'R64', // Second round
		6: 'R32', // Third round
		7: 'R16', // Fourth round
		9: 'QF', // 1/4 final
		10: 'SF', // 1/2 final
		12: 'F', // Final
		24: 'QF' // QF (alternate id)
	};
	return map[roundId] ?? 'R128';
}

interface RapidApiPlayer {
	id: number;
	name: string;
	countryAcr: string;
}

interface RapidApiMatch {
	id: string;
	date: string | null;
	roundId: number;
	player1Id: number;
	player2Id: number;
	match_winner: number | null;
	result: string | null;
	player1: RapidApiPlayer;
	player2: RapidApiPlayer;
}

interface RapidApiRankingEntry {
	position: number;
	player: {
		id: number;
		name: string;
		countryAcr: string;
	};
}

/**
 * Fetch current singles rankings to build a draft player list with seedings.
 * Top 32 players are seeded 1–32; the rest are unseeded.
 * Fetches two pages to cover a full Grand Slam draw (128+ players).
 */
export async function fetchRankingsDraw(
	tour: 'atp' | 'wta',
	tournamentId: string
): Promise<TennisPlayer[]> {
	const [page1, page2] = await Promise.all([
		apiFetch(`/tennis/v2/${tour}/ranking/singles/?pageNo=1&pageSize=64`) as Promise<{
			data?: RapidApiRankingEntry[];
		}>,
		apiFetch(`/tennis/v2/${tour}/ranking/singles/?pageNo=2&pageSize=64`) as Promise<{
			data?: RapidApiRankingEntry[];
		}>
	]);

	const entries = [...(page1?.data ?? []), ...(page2?.data ?? [])];

	return entries.map(e => {
		const seed = e.position <= 32 ? e.position : null;
		const atpPlayerId = tour === 'atp' ? lookupAtpPlayerId(e.player.name) : undefined;
		return {
			id: String(e.player.id),
			name: e.player.name,
			seed,
			currentRanking: e.position,
			country: e.player.countryAcr ?? '',
			image: getPlayerImageUrl(e.player.name, tour, atpPlayerId),
				tour,
			atpPlayerId,
			apiId: String(e.player.id),
			tournamentId
		};
	});
}

/**
 * Fetch completed match results for a tournament.
 * Also returns all unique players encountered in those results.
 */
export async function fetchTournamentResults(
	apiId: string,
	tour: 'atp' | 'wta',
	tournamentId: string
): Promise<{
	players: TennisPlayer[];
	matches: Array<Omit<TournamentMatch, 'id'> & { apiMatchId: string }>;
}> {
	const data = (await apiFetch(`/tennis/v2/${tour}/tournament/results/${apiId}`)) as {
		data?: { singles?: RapidApiMatch[] };
	};
	const singles: RapidApiMatch[] = data?.data?.singles ?? [];

	// Collect unique players from match data
	const playerMap = new Map<number, TennisPlayer>();
	for (const m of singles) {
		for (const p of [m.player1, m.player2]) {
			if (!playerMap.has(p.id)) {
				const atpPlayerId = tour === 'atp' ? lookupAtpPlayerId(p.name) : undefined;
				playerMap.set(p.id, {
					id: String(p.id),
					name: p.name,
					seed: null,
					currentRanking: null,
					country: p.countryAcr ?? '',
					image: getPlayerImageUrl(p.name, tour, atpPlayerId),
								tour,
					atpPlayerId,
					apiId: String(p.id),
					tournamentId
				});
			}
		}
	}

	const matches = singles
		.filter(m => m.match_winner != null)
		.map(m => ({
			tournamentId,
			round: normalizeRoundId(m.roundId),
			matchNumber: null,
			player1Id: String(m.player1Id),
			player2Id: String(m.player2Id),
			winnerId: String(m.match_winner),
			score: m.result ?? null,
			apiMatchId: m.id,
			playedAt: m.date ?? null
		}));

	return { players: Array.from(playerMap.values()), matches };
}
