import { describe, it, expect } from 'vitest';
import { dedupeMatches, isRetirementScore } from './rapidapiClient';

type Row = {
	tournamentId: string;
	player1Id: string;
	player2Id: string;
	score: string | null;
	apiMatchId: string;
};

function row(partial: Partial<Row>): Row {
	return {
		tournamentId: 'usopen-2026-atp',
		player1Id: '1',
		player2Id: '2',
		score: '6-4 6-4',
		apiMatchId: 'a',
		...partial
	};
}

describe('isRetirementScore', () => {
	it('detects retirement markers regardless of case', () => {
		expect(isRetirementScore('6-3 1-0 ret.')).toBe(true);
		expect(isRetirementScore('6-3 1-0 Ret.')).toBe(true);
		expect(isRetirementScore('6-4 6-4')).toBe(false);
		expect(isRetirementScore(null)).toBe(false);
	});
});

describe('dedupeMatches', () => {
	it('keeps the "Ret." row when the API returns a retired match twice', () => {
		const result = dedupeMatches([
			row({ score: '6-3 1-0', apiMatchId: 'plain' }),
			row({ score: '6-3 1-0 Ret.', apiMatchId: 'ret' })
		]);

		expect(result).toHaveLength(1);
		expect(result[0].apiMatchId).toBe('ret');
	});

	it('keeps the "Ret." row no matter which order the API returns them in', () => {
		const result = dedupeMatches([
			row({ score: '6-3 1-0 Ret.', apiMatchId: 'ret' }),
			row({ score: '6-3 1-0', apiMatchId: 'plain' })
		]);

		expect(result.map((m) => m.apiMatchId)).toEqual(['ret']);
	});

	it('collapses duplicates with the players listed in either order', () => {
		const result = dedupeMatches([
			row({ player1Id: '1', player2Id: '2', apiMatchId: 'a' }),
			row({ player1Id: '2', player2Id: '1', apiMatchId: 'b' })
		]);

		expect(result).toHaveLength(1);
	});

	it('keeps matches between different players and in different tournaments', () => {
		const result = dedupeMatches([
			row({ player1Id: '1', player2Id: '2', apiMatchId: 'a' }),
			row({ player1Id: '1', player2Id: '3', apiMatchId: 'b' }),
			row({ tournamentId: 'usopen-2026-wta', apiMatchId: 'c' })
		]);

		expect(result.map((m) => m.apiMatchId)).toEqual(['a', 'b', 'c']);
	});
});
