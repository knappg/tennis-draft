export const ROUND_ORDER: string[] = ['R128', 'R64', 'R32', 'R16', 'QF', 'SF', 'F', 'W'];

export const POINTS_PER_WIN = 1;
export const UNSEEDED_BONUS_WINS_THRESHOLD = 2; // wins needed to earn the bonus
export const UNSEEDED_BONUS_POINTS = 1;
export const UNSEEDED_DRAFT_ROUNDS = [4, 5]; // draft rounds where the bonus applies

export interface DraftRoundRule {
	seedMin: number | null; // null = no minimum constraint
	seedMax: number | null; // null = no maximum constraint
	unseeded: boolean; // true = must have seed IS NULL or seed > 32
	tour: 'atp' | 'wta';
}

export const DRAFT_ROUND_RULES: Record<number, DraftRoundRule> = {
	1: { seedMin: 1, seedMax: 10, unseeded: false, tour: 'atp' },
	2: { seedMin: 11, seedMax: 32, unseeded: false, tour: 'atp' },
	3: { seedMin: 11, seedMax: 32, unseeded: false, tour: 'atp' },
	4: { seedMin: null, seedMax: null, unseeded: true, tour: 'atp' },
	5: { seedMin: null, seedMax: null, unseeded: true, tour: 'atp' },
	6: { seedMin: null, seedMax: null, unseeded: false, tour: 'wta' }
};

/** Returns true if a player (by their tournament seed) is eligible to be drafted in a given round. */
export function isEligible(seed: number | null, draftRound: number): boolean {
	const rule = DRAFT_ROUND_RULES[draftRound];
	if (!rule) return false;
	if (rule.unseeded) return seed === null || seed > 32;
	if (rule.seedMin !== null && (seed === null || seed < rule.seedMin)) return false;
	if (rule.seedMax !== null && seed !== null && seed > rule.seedMax) return false;
	return true;
}

/** Human-readable label describing what's eligible in a given draft round. */
export function getRoundLabel(draftRound: number): string {
	switch (draftRound) {
		case 1:
			return 'Round 1 — Seeds 1–10 (ATP)';
		case 2:
			return 'Round 2 — Seeds 11–32 (ATP)';
		case 3:
			return 'Round 3 — Seeds 11–32 (ATP)';
		case 4:
			return 'Round 4 — Unseeded Players (ATP)';
		case 5:
			return 'Round 5 — Unseeded Players (ATP)';
		case 6:
			return 'Round 6 — WTA Draw';
		default:
			return `Round ${draftRound}`;
	}
}
