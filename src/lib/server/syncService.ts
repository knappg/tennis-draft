import {
	getTournamentById,
	upsertTournamentPlayer,
	upsertTournamentResult,
	upsertPlayerPoints,
	getPicksForTournament,
	upsertTournament
} from './draftQueries';
import { db } from './db';
import { fetchRankingsDraw, fetchTournamentResults } from './rapidapiClient';
import {
	ROUND_ORDER,
	POINTS_PER_WIN,
	UNSEEDED_BONUS_WINS_THRESHOLD,
	UNSEEDED_BONUS_POINTS,
	UNSEEDED_DRAFT_ROUNDS
} from '$lib/data/tournamentPoints';
import type { TournamentRound, PlayerTournamentPoints } from '$lib/types';

/**
 * Full sync for one tournament half (ATP or WTA):
 * 1. Fetch rankings draw if no players stored yet
 * 2. Fetch + upsert match results (also upserts players from result data)
 * 3. Recompute player_tournament_points
 */
export async function syncTournament(tournamentId: string): Promise<void> {
	const tournament = getTournamentById(tournamentId);
	if (!tournament?.apiId) return; // nothing to sync without a RapidAPI ID

	const tour = tournament.gender;

	// Step 1 — always refresh player draw from rankings (updates images, rankings)
	const players = await fetchRankingsDraw(tour, tournamentId);
	const insert = db.transaction(() => {
		for (const p of players) upsertTournamentPlayer(p);
	});
	insert();

	// Step 2 — fetch results; upsert players seen in results + all matches
	const { players: resultPlayers, matches } = await fetchTournamentResults(
		tournament.apiId,
		tour,
		tournamentId
	);
	const insertData = db.transaction(() => {
		for (const p of resultPlayers) upsertTournamentPlayer(p);
		for (const m of matches) upsertTournamentResult(m);
	});
	insertData();

	// Step 3 — recompute points
	recomputePoints(tournamentId);

	// Update last_synced_at
	upsertTournament({ ...tournament, lastSyncedAt: new Date().toISOString() });
}

/**
 * Rebuild player_tournament_points from tournament_results.
 * Scoring:
 *   - 1 point per win
 *   - +1 bonus for unseeded picks (draft rounds 4-5) with 2+ wins
 */
export function recomputePoints(tournamentId: string): void {
	// Count wins per player (COUNT DISTINCT round guards against duplicate API rows
	// for the same match appearing with different api_match_id values)
	const winRows = db
		.prepare(
			`SELECT winner_id, COUNT(DISTINCT round) as wins
			 FROM tournament_results
			 WHERE tournament_id = ? AND winner_id IS NOT NULL
			 GROUP BY winner_id`
		)
		.all(tournamentId) as Array<{ winner_id: string; wins: number }>;

	const winsByPlayer: Record<string, number> = {};
	for (const row of winRows) {
		winsByPlayer[row.winner_id] = row.wins;
	}

	// Determine deepest round reached per player (last round they won a match)
	const roundRows = db
		.prepare(
			`SELECT DISTINCT winner_id, round
			 FROM tournament_results
			 WHERE tournament_id = ? AND winner_id IS NOT NULL`
		)
		.all(tournamentId) as Array<{ winner_id: string; round: string }>;

	const deepestRound: Record<string, TournamentRound> = {};
	for (const row of roundRows) {
		const prev = deepestRound[row.winner_id];
		const prevIdx = prev ? ROUND_ORDER.indexOf(prev) : -1;
		const currIdx = ROUND_ORDER.indexOf(row.round);
		if (currIdx > prevIdx) {
			deepestRound[row.winner_id] = row.round as TournamentRound;
		}
	}

	// Get picks for this tournament to identify unseeded picks (draft rounds 4 & 5)
	const picks = getPicksForTournament(tournamentId);
	const unseededPickIds = new Set(
		picks
			.filter(p => UNSEEDED_DRAFT_ROUNDS.includes(p.draftRound))
			.map(p => p.tennisPlayerId)
	);

	// Compute and upsert points for every player who appeared in results
	const allPlayerIds = new Set([
		...Object.keys(winsByPlayer),
		...picks.map(p => p.tennisPlayerId)
	]);

	const upsert = db.transaction(() => {
		for (const playerId of allPlayerIds) {
			const wins = winsByPlayer[playerId] ?? 0;
			const isUnseededPick = unseededPickIds.has(playerId);
			const bonusPoints =
				isUnseededPick && wins >= UNSEEDED_BONUS_WINS_THRESHOLD ? UNSEEDED_BONUS_POINTS : 0;

			const pts: PlayerTournamentPoints = {
				playerId,
				tournamentId,
				roundReached: deepestRound[playerId] ?? 'R128',
				wins,
				bonusPoints,
				pointsEarned: wins * POINTS_PER_WIN + bonusPoints
			};
			upsertPlayerPoints(pts);
		}
	});
	upsert();
}
