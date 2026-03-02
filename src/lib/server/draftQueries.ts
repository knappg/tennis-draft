import { db } from './db';
import type { Participant, DraftState } from '$lib/types';

// ─── Types for DB rows ────────────────────────────────────────────────────────

interface DraftStateRow {
	id: number;
	current_round: number;
	current_pick_idx: number;
	snake_order: string;
	is_complete: number;
	status: 'setup' | 'draft' | 'results';
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
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getDraftState(): DraftState {
	const row = db.prepare('SELECT * FROM draft_state WHERE id = 1').get() as DraftStateRow;
	return {
		currentRound: row.current_round,
		currentPickIndex: row.current_pick_idx,
		snakeOrder: JSON.parse(row.snake_order),
		isComplete: row.is_complete === 1,
		status: row.status
	};
}

export function getParticipants(): Participant[] {
	const rows = db
		.prepare('SELECT * FROM participants ORDER BY sort_order')
		.all() as ParticipantRow[];

	const pickRows = db
		.prepare('SELECT * FROM picks ORDER BY pick_index')
		.all() as PickRow[];

	// Group picks by participant
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

// ─── Write ────────────────────────────────────────────────────────────────────

export function upsertParticipant(
	p: Omit<Participant, 'picks'>,
	sortOrder: number
): void {
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
		   current_round    = @currentRound,
		   current_pick_idx = @currentPickIndex,
		   snake_order      = @snakeOrder,
		   is_complete      = @isComplete,
		   status           = @status
		 WHERE id = 1`
	).run({
		currentRound: state.currentRound,
		currentPickIndex: state.currentPickIndex,
		snakeOrder: JSON.stringify(state.snakeOrder),
		isComplete: state.isComplete ? 1 : 0,
		status: state.status
	});
}

export function applyPick(
	tennisPlayerId: string,
	participantId: string,
	pickIndex: number,
	newState: DraftState
): void {
	const transaction = db.transaction(() => {
		db.prepare(
			`INSERT INTO picks (tennis_player_id, participant_id, pick_index)
			 VALUES (?, ?, ?)`
		).run(tennisPlayerId, participantId, pickIndex);
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
			   current_round    = 1,
			   current_pick_idx = 0,
			   snake_order      = '[]',
			   is_complete      = 0,
			   status           = 'setup'
			 WHERE id = 1`
		).run();
	});
	transaction();
}
