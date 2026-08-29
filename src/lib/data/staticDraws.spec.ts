import { describe, it, expect } from 'vitest';
import { getStaticDraw, getFirstRoundOpponent } from './staticDraws';
import { WIMBLEDON_2026_ATP } from './wimbledon2026';
import { USOPEN_2026_ATP } from './usopen2026';

describe('staticDraws registry', () => {
	it('resolves draws for every registered tournament id', () => {
		expect(getStaticDraw('usopen-2026-atp')).toHaveLength(128);
		expect(getStaticDraw('usopen-2026-wta')).toHaveLength(128);
		expect(getStaticDraw('wimbledon-2026-atp')).toHaveLength(128);
		expect(getStaticDraw('wimbledon-2026-wta')).toHaveLength(128);
	});

	it('returns null for an unregistered tournament id', () => {
		expect(getStaticDraw('ausopen-2026-atp')).toBeNull();
	});
});

describe('getFirstRoundOpponent disambiguation', () => {
	// A player who appears in BOTH the Wimbledon and US Open draws (same apiId) but with a
	// different round-1 opponent in each — the case tournamentId must disambiguate.
	const usById = new Map(USOPEN_2026_ATP.map((e) => [e.apiId, e]));
	const shared = WIMBLEDON_2026_ATP.find((w) => {
		const u = usById.get(w.apiId);
		return u && u.firstRoundOpponent !== w.firstRoundOpponent;
	});

	it('has at least one player shared across both draws with differing opponents', () => {
		expect(shared).toBeDefined();
	});

	it('returns the opponent for the tournament named in tournamentId', () => {
		const w = shared!;
		const u = usById.get(w.apiId)!;
		expect(getFirstRoundOpponent(w.apiId, 'wimbledon-2026-atp')).toBe(w.firstRoundOpponent);
		expect(getFirstRoundOpponent(w.apiId, 'usopen-2026-atp')).toBe(u.firstRoundOpponent);
	});

	it('prefers the most recent event (US Open) when no tournamentId is given', () => {
		const u = usById.get(shared!.apiId)!;
		expect(getFirstRoundOpponent(u.apiId)).toBe(u.firstRoundOpponent);
	});

	it('returns null for an unknown player id', () => {
		expect(getFirstRoundOpponent('not-a-real-id')).toBeNull();
		expect(getFirstRoundOpponent('not-a-real-id', 'usopen-2026-atp')).toBeNull();
	});
});
