import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTournamentPlayers } from '$lib/server/draftQueries';
import { TENNIS_PLAYERS } from '$lib/data/players';

export const GET: RequestHandler = async ({ url }) => {
	const tournamentId = url.searchParams.get('tournamentId');
	const tour = url.searchParams.get('tour') as 'atp' | 'wta' | null;

	if (!tournamentId || !tour) {
		error(400, 'Missing tournamentId or tour query param');
	}
	if (tour !== 'atp' && tour !== 'wta') {
		error(400, 'tour must be "atp" or "wta"');
	}

	const players = getTournamentPlayers(tournamentId, tour);

	// Fallback to static data for the legacy Australian Open 2026 ATP draw
	if (players.length === 0 && tournamentId === 'ausopen-2026-atp' && tour === 'atp') {
		return json(TENNIS_PLAYERS);
	}

	return json(players);
};
