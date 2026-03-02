import { writable, derived, get } from 'svelte/store';
import type { Participant, DraftState, TennisPlayer } from '$lib/types';
import { TENNIS_PLAYERS } from '$lib/data/players';
import { browser } from '$app/environment';

// Initial State
const initialParticipants: Participant[] = [];
const initialDraftState: DraftState = {
	currentRound: 1,
	currentPickIndex: 0,
	snakeOrder: [],
	isComplete: false,
	status: 'setup'
};

// Stores
export const participants = writable<Participant[]>(initialParticipants);
export const draftState = writable<DraftState>(initialDraftState);
export const availablePlayers = writable<TennisPlayer[]>(TENNIS_PLAYERS);
export const draftedPlayers = writable<Record<string, string>>({}); // tennisPlayerId -> participantId

// Persist to localStorage on change (fast same-session cache; server is source of truth on load)
if (browser) {
	participants.subscribe(val => localStorage.setItem('tennis-draft-participants', JSON.stringify(val)));
	draftState.subscribe(val => localStorage.setItem('tennis-draft-state', JSON.stringify(val)));
	draftedPlayers.subscribe(val => localStorage.setItem('tennis-draft-map', JSON.stringify(val)));
}

// ─── Server hydration ─────────────────────────────────────────────────────────

export function initFromServer(
	serverParticipants: Participant[],
	serverState: DraftState,
	serverDraftedMap: Record<string, string>
) {
	participants.set(serverParticipants);
	draftState.set(serverState);
	draftedPlayers.set(serverDraftedMap);

	// Rebuild availablePlayers by subtracting all drafted IDs
	const draftedIds = new Set(Object.keys(serverDraftedMap));
	availablePlayers.set(TENNIS_PLAYERS.filter(p => !draftedIds.has(p.id)));
}

// ─── Derived ──────────────────────────────────────────────────────────────────

export const currentParticipantId = derived(draftState, $s => {
	if ($s.isComplete || $s.snakeOrder.length === 0) return null;
	return $s.snakeOrder[$s.currentPickIndex];
});

export const currentParticipant = derived([participants, currentParticipantId], ([$p, $id]) => {
	return $p.find(p => p.id === $id);
});

// ─── Logic Actions ────────────────────────────────────────────────────────────

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
		body: JSON.stringify({ participants: shuffled.map(({ id, name, teamName, icon }) => ({ id, name, teamName, icon })) })
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

	const newState: DraftState = {
		currentRound: 1,
		currentPickIndex: 0,
		snakeOrder: order,
		isComplete: false,
		status: 'draft'
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

	draftedPlayers.update(drafted => ({ ...drafted, [tennisPlayerId]: participantId }));
	availablePlayers.update(players => players.filter(p => p.id !== tennisPlayerId));

	participants.update(all =>
		all.map(p => {
			if (p.id === participantId) {
				return { ...p, picks: [...p.picks, tennisPlayerId] };
			}
			return p;
		})
	);

	let newState: DraftState = initialDraftState;
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
		body: JSON.stringify({ tennisPlayerId, participantId, pickIndex, newState })
	});
}

export function resetDraft() {
	participants.set([]);
	draftState.set({
		currentRound: 1,
		currentPickIndex: 0,
		snakeOrder: [],
		isComplete: false,
		status: 'setup'
	});
	draftedPlayers.set({});
	availablePlayers.set(TENNIS_PLAYERS);

	fetch('/api/draft/reset', { method: 'POST' });
}
