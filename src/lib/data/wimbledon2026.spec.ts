import { describe, it, expect } from 'vitest';
import {
	WIMBLEDON_2026_ATP,
	WIMBLEDON_2026_WTA,
	getStaticDraw,
	getFirstRoundOpponent,
	type StaticDrawEntry
} from './wimbledon2026';

function checkDraw(name: string, entries: StaticDrawEntry[]) {
	describe(name, () => {
		it('has a full 128-player main draw', () => {
			expect(entries).toHaveLength(128);
		});

		it('has reciprocal first-round opponents for every adjacent pair', () => {
			for (let i = 0; i < entries.length; i += 2) {
				expect(entries[i].firstRoundOpponent).toBe(entries[i + 1].name);
				expect(entries[i + 1].firstRoundOpponent).toBe(entries[i].name);
			}
		});

		it('has seeds 1–32, each present exactly once', () => {
			const seeds = entries
				.map((e) => e.seed)
				.filter((s): s is number => s != null)
				.sort((a, b) => a - b);
			expect(seeds).toEqual(Array.from({ length: 32 }, (_, i) => i + 1));
		});

		it('has a non-empty, unique apiId for every entrant', () => {
			const ids = entries.map((e) => e.apiId);
			expect(ids.every((id) => id.length > 0)).toBe(true);
			expect(new Set(ids).size).toBe(128);
		});

		it('has a name and country for every entrant', () => {
			expect(entries.every((e) => e.name.length > 0 && e.country.length > 0)).toBe(true);
		});
	});
}

checkDraw('WIMBLEDON_2026_ATP', WIMBLEDON_2026_ATP);
checkDraw('WIMBLEDON_2026_WTA', WIMBLEDON_2026_WTA);

describe('getStaticDraw', () => {
	it('returns 128 TennisPlayers for the ATP draw with id === apiId and tour/tournament set', () => {
		const players = getStaticDraw('wimbledon-2026-atp');
		expect(players).not.toBeNull();
		expect(players!).toHaveLength(128);
		for (const p of players!) {
			expect(p.id).toBe(p.apiId);
			expect(p.tour).toBe('atp');
			expect(p.tournamentId).toBe('wimbledon-2026-atp');
			expect(p.image).toBeTruthy();
		}
	});

	it('returns the WTA draw tagged as wta', () => {
		const players = getStaticDraw('wimbledon-2026-wta');
		expect(players!).toHaveLength(128);
		expect(players!.every((p) => p.tour === 'wta')).toBe(true);
	});

	it('returns null for a tournament with no static draw', () => {
		expect(getStaticDraw('ausopen-2026-atp')).toBeNull();
		expect(getStaticDraw('frenchopen-2026-wta')).toBeNull();
	});
});

describe('getFirstRoundOpponent', () => {
	it('returns the round-1 opponent for a drawn player (by apiId)', () => {
		const sinner = WIMBLEDON_2026_ATP[0];
		expect(getFirstRoundOpponent(sinner.apiId)).toBe(sinner.firstRoundOpponent);
		expect(getFirstRoundOpponent(sinner.apiId)).toBe(WIMBLEDON_2026_ATP[1].name);
	});

	it('returns null for a player not in any static draw', () => {
		expect(getFirstRoundOpponent('not-a-real-id')).toBeNull();
	});
});
