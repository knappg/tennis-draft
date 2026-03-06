import { writable, derived, get } from 'svelte/store';
import type { Participant, DraftState, TennisPlayer, Tournament } from '$lib/types';
import { TENNIS_PLAYERS } from '$lib/data/players';
import { browser } from '$app/environment';
import { isEligible, DRAFT_ROUND_RULES } from '$lib/data/tournamentPoints';
import { getWtaCounterpart } from '$lib/data/tournaments';

// ─── Core stores ──────────────────────────────────────────────────────────────

export const participants = writable<Participant[]>([]);
export const draftState = writable<DraftState>({
	currentRound: 1,
	currentPickIndex: 0,
	snakeOrder: [],
	isComplete: false,
	status: 'setup',
	tournamentId: null,
	wtaTournamentId: null
});
export const draftedPlayers = writable<Record<string, string>>({}); // playerId → participantId
export const activeTournament = writable<Tournament | null>(null);

// Full player pools (set from server on load or after tournament selection)
export const allAtpPlayers = writable<TennisPlayer[]>(TENNIS_PLAYERS);
export const allWtaPlayers = writable<TennisPlayer[]>([]);

// ─── Derived stores ───────────────────────────────────────────────────────────

/** All players across both tours — used by draft board to look up drafted players. */
export const allPlayers = derived(
	[allAtpPlayers, allWtaPlayers],
	([$atp, $wta]) => [...$atp, ...$wta]
);

/**
 * Players eligible to be picked in the current draft round.
 * Round 6 → WTA pool; Rounds 1-5 → ATP pool filtered by seed eligibility.
 */
export const availablePlayers = derived(
	[allAtpPlayers, allWtaPlayers, draftedPlayers, draftState],
	([$atp, $wta, $drafted, $state]) => {
		const draftedIds = new Set(Object.keys($drafted));
		const round = $state.currentRound;
		const rule = DRAFT_ROUND_RULES[round];
		if (!rule) return [];
		const pool = rule.tour === 'wta' ? $wta : $atp;
		return pool.filter(p => !draftedIds.has(p.id) && isEligible(p.seed, round));
	}
);

export const currentParticipantId = derived(draftState, $s => {
	if ($s.isComplete || $s.snakeOrder.length === 0) return null;
	return $s.snakeOrder[$s.currentPickIndex];
});

export const currentParticipant = derived([participants, currentParticipantId], ([$p, $id]) => {
	return $p.find(p => p.id === $id);
});

// ─── Persist to localStorage on change (fast same-session cache) ──────────────

if (browser) {
	participants.subscribe(val => localStorage.setItem('tennis-draft-participants', JSON.stringify(val)));
	draftState.subscribe(val => localStorage.setItem('tennis-draft-state', JSON.stringify(val)));
	draftedPlayers.subscribe(val => localStorage.setItem('tennis-draft-map', JSON.stringify(val)));
}

// ─── Server hydration ─────────────────────────────────────────────────────────

export function initFromServer(
	serverParticipants: Participant[],
	serverState: DraftState,
	serverDraftedMap: Record<string, string>,
	serverAtpPlayers: TennisPlayer[] = TENNIS_PLAYERS,
	serverWtaPlayers: TennisPlayer[] = [],
	serverTournament: Tournament | null = null
) {
	participants.set(serverParticipants);
	draftState.set(serverState);
	draftedPlayers.set(serverDraftedMap);
	allAtpPlayers.set(serverAtpPlayers.length > 0 ? serverAtpPlayers : TENNIS_PLAYERS);
	allWtaPlayers.set(serverWtaPlayers);
	activeTournament.set(serverTournament);
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export function addParticipant(name: string, teamName: string, icon: string) {
	const newParticipant: Participant = {
		id: crypto.randomUUID(),
		name,
		teamName,
		icon,
		picks: []
	};
	participants.update(p => [...p, newParticipant]);
	fetch('/api/draft/participants', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newParticipant)
	});
}

export function removeParticipant(id: string) {
	participants.update(p => p.filter(x => x.id !== id));
	fetch(`/api/draft/participants/${id}`, { method: 'DELETE' });
}

export function shuffleParticipants() {
	let shuffled: Participant[] = [];
	participants.update(p => {
		shuffled = [...p];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	});
	fetch('/api/draft/participants/order', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			participants: shuffled.map(({ id, name, teamName, icon }) => ({ id, name, teamName, icon }))
		})
	});
}

export function startDraft() {
	const p = get(participants);
	if (p.length === 0) return;

	const order: string[] = [];
	const ids = p.map(x => x.id);
	for (let r = 1; r <= 6; r++) {
		if (r % 2 === 1) {
			order.push(...ids);
		} else {
			order.push(...[...ids].reverse());
		}
	}

	const tournament = get(activeTournament);
	const newState: DraftState = {
		currentRound: 1,
		currentPickIndex: 0,
		snakeOrder: order,
		isComplete: false,
		status: 'draft',
		tournamentId: tournament?.id ?? null,
		wtaTournamentId: tournament ? getWtaCounterpart(tournament.id) : null
	};

	draftState.set(newState);
	fetch('/api/draft/start', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ state: newState })
	});
}

export function makePick(tennisPlayerId: string) {
	const state = get(draftState);
	if (state.isComplete) return;

	const participantId = state.snakeOrder[state.currentPickIndex];
	if (!participantId) return;

	const pickIndex = state.currentPickIndex;
	const draftRound = state.currentRound;

	draftedPlayers.update(drafted => ({ ...drafted, [tennisPlayerId]: participantId }));

	participants.update(all =>
		all.map(p => {
			if (p.id === participantId) {
				return { ...p, picks: [...p.picks, tennisPlayerId] };
			}
			return p;
		})
	);

	let newState: DraftState = get(draftState);
	draftState.update(s => {
		const nextIndex = s.currentPickIndex + 1;
		const isComplete = nextIndex >= s.snakeOrder.length;
		const currentRound = Math.floor(nextIndex / get(participants).length) + 1;
		newState = {
			...s,
			currentRound: isComplete ? 6 : currentRound,
			currentPickIndex: nextIndex,
			isComplete,
			status: isComplete ? 'results' : 'draft'
		};
		return newState;
	});

	fetch('/api/draft/pick', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ tennisPlayerId, participantId, pickIndex, draftRound, newState })
	});
}

export function resetDraft() {
	participants.set([]);
	draftState.set({
		currentRound: 1,
		currentPickIndex: 0,
		snakeOrder: [],
		isComplete: false,
		status: 'setup',
		tournamentId: null,
		wtaTournamentId: null
	});
	draftedPlayers.set({});
	activeTournament.set(null);
	allAtpPlayers.set(TENNIS_PLAYERS);
	allWtaPlayers.set([]);
	fetch('/api/draft/reset', { method: 'POST' });
}

/** Select a tournament from the catalog, creating DB records and loading players. */
export async function selectTournament(catalogId: string, year: number): Promise<void> {
	const resp = await fetch('/api/tournament/select', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ catalogId, year })
	});
	if (!resp.ok) return;

	const { atpTournament, wtaTournament, atpPlayers, wtaPlayers } = await resp.json();

	activeTournament.set(atpTournament);
	allAtpPlayers.set(atpPlayers.length > 0 ? atpPlayers : TENNIS_PLAYERS);
	allWtaPlayers.set(wtaPlayers);

	draftState.update(s => ({
		...s,
		tournamentId: atpTournament.id,
		wtaTournamentId: wtaTournament.id
	}));
}
