import { db } from './db';
import type {
	Participant,
	DraftState,
	Tournament,
	TennisPlayer,
	TournamentMatch,
	TournamentRound,
	PlayerTournamentPoints
} from '$lib/types';

// ─── Types for DB rows ────────────────────────────────────────────────────────

interface DraftStateRow {
	id: number;
	current_round: number;
	current_pick_idx: number;
	snake_order: string;
	is_complete: number;
	status: 'setup' | 'draft' | 'results';
	tournament_id: string | null;
	wta_tournament_id: string | null;
}

interface ParticipantRow {
	id: string;
	name: string;
	team_name: string;
	icon: string;
	sort_order: number;
}

interface PickRow {
	tennis_player_id: string;
	participant_id: string;
	pick_index: number;
	draft_round: number;
	tournament_id: string | null;
}

interface TournamentRow {
	id: string;
	name: string;
	year: number;
	gender: 'atp' | 'wta';
	tour_type: 'slam' | 'masters1000';
	start_date: string | null;
	end_date: string | null;
	status: 'upcoming' | 'active' | 'complete';
	api_id: string | null;
	last_synced_at: string | null;
}

interface TournamentPlayerRow {
	id: string;
	tournament_id: string;
	tour: 'atp' | 'wta';
	name: string;
	seed: number | null;
	country: string;
	image_url: string;
	current_ranking: number | null;
	atp_player_id: string | null;
	api_id: string | null;
}

interface TournamentResultRow {
	id: number;
	tournament_id: string;
	round: string;
	match_number: number | null;
	player1_id: string;
	player2_id: string;
	winner_id: string | null;
	score: string | null;
	api_match_id: string | null;
	played_at: string | null;
}

interface PlayerPointsRow {
	player_id: string;
	tournament_id: string;
	round_reached: string;
	wins: number;
	bonus_points: number;
	points_earned: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToTournament(row: TournamentRow): Tournament {
	return {
		id: row.id,
		name: row.name,
		year: row.year,
		gender: row.gender,
		tourType: row.tour_type,
		startDate: row.start_date,
		endDate: row.end_date,
		status: row.status,
		apiId: row.api_id,
		lastSyncedAt: row.last_synced_at
	};
}

function rowToTennisPlayer(row: TournamentPlayerRow): TennisPlayer {
	return {
		id: row.id,
		name: row.name,
		seed: row.seed,
		currentRanking: row.current_ranking,
		country: row.country,
		image: row.image_url,
		tour: row.tour,
		atpPlayerId: row.atp_player_id ?? undefined,
		apiId: row.api_id ?? undefined,
		tournamentId: row.tournament_id
	};
}

// ─── Read (original 8 functions, updated for new schema) ─────────────────────

export function getDraftState(): DraftState {
	const row = db.prepare('SELECT * FROM draft_state WHERE id = 1').get() as DraftStateRow;
	return {
		currentRound: row.current_round,
		currentPickIndex: row.current_pick_idx,
		snakeOrder: JSON.parse(row.snake_order),
		isComplete: row.is_complete === 1,
		status: row.status,
		tournamentId: row.tournament_id ?? null,
		wtaTournamentId: row.wta_tournament_id ?? null
	};
}

export function getParticipants(): Participant[] {
	const rows = db
		.prepare('SELECT * FROM participants ORDER BY sort_order')
		.all() as ParticipantRow[];

	const pickRows = db
		.prepare('SELECT * FROM picks ORDER BY pick_index')
		.all() as PickRow[];

	const picksByParticipant: Record<string, string[]> = {};
	for (const pick of pickRows) {
		if (!picksByParticipant[pick.participant_id]) {
			picksByParticipant[pick.participant_id] = [];
		}
		picksByParticipant[pick.participant_id].push(pick.tennis_player_id);
	}

	return rows.map(row => ({
		id: row.id,
		name: row.name,
		teamName: row.team_name,
		icon: row.icon,
		picks: picksByParticipant[row.id] ?? []
	}));
}

export function getDraftedPlayersMap(): Record<string, string> {
	const rows = db.prepare('SELECT tennis_player_id, participant_id FROM picks').all() as PickRow[];
	const map: Record<string, string> = {};
	for (const row of rows) {
		map[row.tennis_player_id] = row.participant_id;
	}
	return map;
}

export function upsertParticipant(p: Omit<Participant, 'picks'>, sortOrder: number): void {
	db.prepare(
		`INSERT INTO participants (id, name, team_name, icon, sort_order)
		 VALUES (@id, @name, @teamName, @icon, @sortOrder)
		 ON CONFLICT(id) DO UPDATE SET
		   name = excluded.name,
		   team_name = excluded.team_name,
		   icon = excluded.icon,
		   sort_order = excluded.sort_order`
	).run({ id: p.id, name: p.name, teamName: p.teamName, icon: p.icon, sortOrder: sortOrder });
}

export function deleteParticipant(id: string): void {
	db.prepare('DELETE FROM participants WHERE id = ?').run(id);
}

export function replaceAllParticipants(list: Omit<Participant, 'picks'>[]): void {
	const transaction = db.transaction(() => {
		db.prepare('DELETE FROM participants').run();
		const insert = db.prepare(
			`INSERT INTO participants (id, name, team_name, icon, sort_order)
			 VALUES (@id, @name, @teamName, @icon, @sortOrder)`
		);
		for (let i = 0; i < list.length; i++) {
			const p = list[i];
			insert.run({ id: p.id, name: p.name, teamName: p.teamName, icon: p.icon, sortOrder: i });
		}
	});
	transaction();
}

export function saveDraftState(state: DraftState): void {
	db.prepare(
		`UPDATE draft_state SET
		   current_round     = @currentRound,
		   current_pick_idx  = @currentPickIndex,
		   snake_order       = @snakeOrder,
		   is_complete       = @isComplete,
		   status            = @status,
		   tournament_id     = @tournamentId,
		   wta_tournament_id = @wtaTournamentId
		 WHERE id = 1`
	).run({
		currentRound: state.currentRound,
		currentPickIndex: state.currentPickIndex,
		snakeOrder: JSON.stringify(state.snakeOrder),
		isComplete: state.isComplete ? 1 : 0,
		status: state.status,
		tournamentId: state.tournamentId ?? null,
		wtaTournamentId: state.wtaTournamentId ?? null
	});
}

export function applyPick(
	tennisPlayerId: string,
	participantId: string,
	pickIndex: number,
	draftRound: number,
	newState: DraftState
): void {
	const transaction = db.transaction(() => {
		db.prepare(
			`INSERT INTO picks (tennis_player_id, participant_id, pick_index, draft_round, tournament_id)
			 VALUES (?, ?, ?, ?, ?)`
		).run(tennisPlayerId, participantId, pickIndex, draftRound, newState.tournamentId ?? null);
		saveDraftState(newState);
	});
	transaction();
}

export function resetAllDraftData(): void {
	const transaction = db.transaction(() => {
		db.prepare('DELETE FROM picks').run();
		db.prepare('DELETE FROM participants').run();
		db.prepare(
			`UPDATE draft_state SET
			   current_round     = 1,
			   current_pick_idx  = 0,
			   snake_order       = '[]',
			   is_complete       = 0,
			   status            = 'setup'
			 WHERE id = 1`
		).run();
	});
	transaction();
}

// ─── Tournament Queries ───────────────────────────────────────────────────────

export function getTournaments(): Tournament[] {
	const rows = db
		.prepare('SELECT * FROM tournaments ORDER BY year DESC, name')
		.all() as TournamentRow[];
	return rows.map(rowToTournament);
}

export function getTournamentById(id: string): Tournament | null {
	const row = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id) as
		| TournamentRow
		| undefined;
	return row ? rowToTournament(row) : null;
}

export function upsertTournament(t: Tournament): void {
	db.prepare(
		`INSERT INTO tournaments (id, name, year, gender, tour_type, start_date, end_date, status, api_id, last_synced_at)
		 VALUES (@id, @name, @year, @gender, @tourType, @startDate, @endDate, @status, @apiId, @lastSyncedAt)
		 ON CONFLICT(id) DO UPDATE SET
		   name           = excluded.name,
		   status         = excluded.status,
		   api_id         = excluded.api_id,
		   last_synced_at = excluded.last_synced_at`
	).run({
		id: t.id,
		name: t.name,
		year: t.year,
		gender: t.gender,
		tourType: t.tourType,
		startDate: t.startDate,
		endDate: t.endDate,
		status: t.status,
		apiId: t.apiId,
		lastSyncedAt: t.lastSyncedAt
	});
}

export function setActiveTournament(tournamentId: string, wtaTournamentId: string): void {
	db.prepare(
		`UPDATE draft_state SET tournament_id = ?, wta_tournament_id = ? WHERE id = 1`
	).run(tournamentId, wtaTournamentId);
}

export function getActiveTournamentIds(): {
	tournamentId: string | null;
	wtaTournamentId: string | null;
} {
	const row = db
		.prepare('SELECT tournament_id, wta_tournament_id FROM draft_state WHERE id = 1')
		.get() as { tournament_id: string | null; wta_tournament_id: string | null } | undefined;
	return {
		tournamentId: row?.tournament_id ?? null,
		wtaTournamentId: row?.wta_tournament_id ?? null
	};
}

// ─── Tournament Players ───────────────────────────────────────────────────────

export function getTournamentPlayers(tournamentId: string, tour: 'atp' | 'wta'): TennisPlayer[] {
	const rows = db
		.prepare(
			`SELECT * FROM tournament_players
			 WHERE tournament_id = ? AND tour = ?
			 ORDER BY CASE WHEN seed IS NULL THEN 1 ELSE 0 END, seed ASC, current_ranking ASC`
		)
		.all(tournamentId, tour) as TournamentPlayerRow[];
	return rows.map(rowToTennisPlayer);
}

export function upsertTournamentPlayer(p: TennisPlayer): void {
	db.prepare(
		`INSERT INTO tournament_players
		   (id, tournament_id, tour, name, seed, country, image_url, current_ranking, atp_player_id, api_id)
		 VALUES
		   (@id, @tournamentId, @tour, @name, @seed, @country, @imageUrl, @currentRanking, @atpPlayerId, @apiId)
		 ON CONFLICT(id, tournament_id) DO UPDATE SET
		   name            = excluded.name,
		   seed            = COALESCE(excluded.seed, tournament_players.seed),
		   country         = excluded.country,
		   image_url       = excluded.image_url,
		   current_ranking = excluded.current_ranking,
		   atp_player_id   = excluded.atp_player_id,
		   api_id          = excluded.api_id`
	).run({
		id: p.id,
		tournamentId: p.tournamentId,
		tour: p.tour ?? 'atp',
		name: p.name,
		seed: p.seed ?? null,
		country: p.country,
		imageUrl: p.image,
		currentRanking: p.currentRanking ?? null,
		atpPlayerId: p.atpPlayerId ?? null,
		apiId: p.apiId ?? null
	});
}

// ─── Tournament Results ───────────────────────────────────────────────────────

export function getTournamentResults(tournamentId: string): TournamentMatch[] {
	const rows = db
		.prepare(
			'SELECT * FROM tournament_results WHERE tournament_id = ? ORDER BY round, match_number'
		)
		.all(tournamentId) as TournamentResultRow[];
	return rows.map(r => ({
		id: r.id,
		tournamentId: r.tournament_id,
		round: r.round as TournamentRound,
		matchNumber: r.match_number,
		player1Id: r.player1_id,
		player2Id: r.player2_id,
		winnerId: r.winner_id,
		score: r.score,
		playedAt: r.played_at
	}));
}

export function upsertTournamentResult(
	match: Omit<TournamentMatch, 'id'> & { apiMatchId?: string }
): void {
	db.prepare(
		`INSERT INTO tournament_results
		   (tournament_id, round, match_number, player1_id, player2_id, winner_id, score, api_match_id, played_at)
		 VALUES
		   (@tournamentId, @round, @matchNumber, @player1Id, @player2Id, @winnerId, @score, @apiMatchId, @playedAt)
		 ON CONFLICT(api_match_id) DO UPDATE SET
		   winner_id = excluded.winner_id,
		   score     = excluded.score,
		   played_at = excluded.played_at`
	).run({
		tournamentId: match.tournamentId,
		round: match.round,
		matchNumber: match.matchNumber ?? null,
		player1Id: match.player1Id,
		player2Id: match.player2Id,
		winnerId: match.winnerId ?? null,
		score: match.score ?? null,
		apiMatchId: (match as { apiMatchId?: string }).apiMatchId ?? null,
		playedAt: match.playedAt ?? null
	});
}

// ─── Player Tournament Points ─────────────────────────────────────────────────

export function getPlayerPoints(tournamentId: string): Record<string, PlayerTournamentPoints> {
	const rows = db
		.prepare('SELECT * FROM player_tournament_points WHERE tournament_id = ?')
		.all(tournamentId) as PlayerPointsRow[];

	const result: Record<string, PlayerTournamentPoints> = {};
	for (const row of rows) {
		result[row.player_id] = {
			playerId: row.player_id,
			tournamentId: row.tournament_id,
			roundReached: row.round_reached as TournamentRound,
			wins: row.wins,
			bonusPoints: row.bonus_points,
			pointsEarned: row.points_earned
		};
	}
	return result;
}

export function upsertPlayerPoints(pts: PlayerTournamentPoints): void {
	db.prepare(
		`INSERT INTO player_tournament_points
		   (player_id, tournament_id, round_reached, wins, bonus_points, points_earned)
		 VALUES
		   (@playerId, @tournamentId, @roundReached, @wins, @bonusPoints, @pointsEarned)
		 ON CONFLICT(player_id, tournament_id) DO UPDATE SET
		   round_reached = excluded.round_reached,
		   wins          = excluded.wins,
		   bonus_points  = excluded.bonus_points,
		   points_earned = excluded.points_earned`
	).run(pts);
}

/** Return picks for a tournament, with their draft_round, for scoring purposes. */
export function getPicksForTournament(
	tournamentId: string
): Array<{ tennisPlayerId: string; draftRound: number }> {
	const rows = db
		.prepare(
			'SELECT tennis_player_id, draft_round FROM picks WHERE tournament_id = ?'
		)
		.all(tournamentId) as Array<{ tennis_player_id: string; draft_round: number }>;
	return rows.map(r => ({ tennisPlayerId: r.tennis_player_id, draftRound: r.draft_round }));
}
