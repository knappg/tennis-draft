/**
 * Registry of all committed static draws. Each tournament with a hand-verified draw ships
 * its own generated data module (see scripts/<tournament>/); this module is the single
 * place the rest of the app asks "is there a static draw for this tournament?" so adding a
 * new event is one import + one line here, and callers never change.
 *
 * Why static draws exist: draft eligibility keys off a player's official SEED, which can
 * diverge from live ranking (withdrawals reshuffle seeds; qualifiers/wildcards aren't
 * top-ranked). We commit the authoritative draw rather than deriving it from the API.
 */
import type { TennisPlayer } from '$lib/types';
import {
	getStaticDraw as getWimbledonDraw,
	getFirstRoundOpponent as getWimbledonOpponent
} from './wimbledon2026';
import {
	getStaticDraw as getUsOpenDraw,
	getFirstRoundOpponent as getUsOpenOpponent
} from './usopen2026';

/** Ordered so the most recent event resolves first when only a player id is known. */
const DRAWS = [
	{ prefix: 'usopen', getStaticDraw: getUsOpenDraw, getFirstRoundOpponent: getUsOpenOpponent },
	{
		prefix: 'wimbledon',
		getStaticDraw: getWimbledonDraw,
		getFirstRoundOpponent: getWimbledonOpponent
	}
];

/**
 * Return the committed static draw for a tournament id (e.g. 'usopen-2026-atp'), or null
 * when no static draw is registered for it (callers fall back to the live API draw).
 */
export function getStaticDraw(tournamentId: string): TennisPlayer[] | null {
	for (const d of DRAWS) {
		const players = d.getStaticDraw(tournamentId);
		if (players) return players;
	}
	return null;
}

/**
 * Round-1 opponent display name for a player, keyed by RapidAPI/apiId. A player can appear
 * in several draws with the same id, so pass the player's `tournamentId` to disambiguate;
 * without it we prefer the most recent event. DISPLAY ONLY — never used in draft rules.
 */
export function getFirstRoundOpponent(
	playerId: string,
	tournamentId?: string | null
): string | null {
	if (tournamentId) {
		const match = DRAWS.find((d) => tournamentId.startsWith(d.prefix));
		if (match) return match.getFirstRoundOpponent(playerId);
	}
	for (const d of DRAWS) {
		const opp = d.getFirstRoundOpponent(playerId);
		if (opp) return opp;
	}
	return null;
}
